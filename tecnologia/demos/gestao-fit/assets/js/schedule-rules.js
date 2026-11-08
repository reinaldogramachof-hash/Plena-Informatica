/* Intervalos civis locais. Nenhuma duração antiga é inferida. */
const FitScheduleRules = (() => {
    const clone=FitData.clone;
    function clock(minute){return `${String(Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}`;}
    function span(a){if(!FitData.isDate(a.date)||!FitData.validTime(a.time))throw new Error('Data ou horário inválido.');const start=FitData.minutes(a.time),known=Number.isInteger(a.schedule?.durationMinutes);return {start,end:known?start+a.schedule.durationMinutes:1440,known};}
    function metadata(input){
        const raw=input.durationMinutes;if(!['number','string'].includes(typeof raw)||typeof raw==='string'&&!/^\d+$/.test(raw.trim()))throw new Error('Informe a duração da aula em minutos.');
        if(typeof input.location!=='string'||typeof (input.notes??'')!=='string')throw new Error('Local ou observações inválidos.');
        return {version:1,durationMinutes:Number(raw),location:input.location.trim(),notes:(input.notes||'').trim()};
    }
    function sameResource(a,b){return !a.proId||!b.proId||a.proId===b.proId||!a.clientId||!b.clientId||a.clientId===b.clientId;}
    function addDays(date,amount){if(!FitData.isDate(date)||!Number.isInteger(amount))throw new Error('Data ou intervalo inválido.');const result=new Date(Date.parse(date+'T00:00:00Z')+amount*86400000).toISOString().slice(0,10);if(!FitData.isDate(result))throw new Error('O período está fora do calendário aceito.');return result;}
    function weekday(date){if(!FitData.isDate(date))throw new Error('Data inválida.');return new Date(date+'T12:00:00Z').getUTCDay();}
    function range(date,mode='day'){
        if(!FitData.isDate(date)||!['day','week','month'].includes(mode))throw new Error('Período da agenda inválido.');
        let start=date,end=date;
        if(mode==='week'){start=addDays(date,-((weekday(date)+6)%7));try{end=addDays(start,6);}catch{end='9999-12-31';}}
        if(mode==='month'){const [y,m]=date.split('-').map(Number);start=date.slice(0,7)+'-01';end=date.slice(0,7)+'-'+String(new Date(Date.UTC(y,m,0)).getUTCDate()).padStart(2,'0');}
        const clamp=(value,amount)=>{try{return addDays(value,amount);}catch{return amount<0?'1900-01-01':'9999-12-31';}};
        const gridStart=mode==='month'?clamp(start,-((weekday(start)+6)%7)):start,gridEnd=mode==='month'?clamp(end,6-((weekday(end)+6)%7)):end,days=[];
        for(let d=gridStart;d<=gridEnd;){days.push(d);if(d===gridEnd)break;d=addDays(d,1);}
        return {mode,start,end,days};
    }
    function move(date,mode,amount){if(!Number.isInteger(amount))throw new Error('Deslocamento inválido.');range(date,mode);if(mode!=='month')return addDays(date,amount*(mode==='week'?7:1));const [y,m,d]=date.split('-').map(Number),target=new Date(Date.UTC(y,m-1+amount,1)),last=new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate(),result=`${String(target.getUTCFullYear()).padStart(4,'0')}-${String(target.getUTCMonth()+1).padStart(2,'0')}-${String(Math.min(d,last)).padStart(2,'0')}`;if(!FitData.isDate(result))throw new Error('O período está fora do calendário aceito.');return result;}
    function periodItems(data,date,mode='day',status='all'){const r=range(date,mode);return {range:r,items:data.appointments.filter(a=>a.date>=r.start&&a.date<=r.end&&(status==='all'||status==='confirmed'&&a.status==='pending'&&a.attendance?.confirmation==='confirmed'||status==='unconfirmed'&&a.status==='pending'&&a.attendance?.confirmation!=='confirmed'||a.status===status)).slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)||a.id.localeCompare(b.id))};}
    function capacity(data,enrollmentId,periodId,excludeId=''){
        const e=data.enrollments.find(e=>e.id===enrollmentId),p=e?.commercial?.periods.find(p=>p.id===periodId);if(!p)throw new Error('Período do contrato indisponível.');
        const used=e.commercial.uses.filter(u=>u.periodId===p.id).length,pending=data.appointments.filter(a=>a.id!==excludeId&&a.status==='pending'&&a.billing?.mode==='contract'&&a.billing.enrollmentId===e.id&&a.billing.periodId===p.id).length;
        return {limit:p.sessionsIncluded,used,pending,available:p.sessionsIncluded===null?null:p.sessionsIncluded-used-pending};
    }
    function conflicts(data,candidate){const a=span(candidate);return data.appointments.filter(b=>b.id!==candidate.id&&b.date===candidate.date&&b.status!=='canceled'&&sameResource(candidate,b)).flatMap(b=>{const other=span(b);return a.start<other.end&&other.start<a.end?[{kind:other.known?'overlap':'unknown-duration',id:b.id,date:b.date,time:b.time,name:b.clientName||data.clients.find(c=>c.id===b.clientId)?.name||'Cadastro anterior'}]:[];});}
    function within(availability,candidate){if(!availability?.enabled)return null;const day=new Date(candidate.date+'T12:00:00').getDay(),s=span(candidate);return availability.slots.some(slot=>slot.day===day&&FitData.minutes(slot.start)<=s.start&&s.end<=FitData.minutes(slot.end));}
    function analyze(data,candidate){
        const errors=[],warnings=[],c=span(candidate),student=data.clients.find(s=>s.id===candidate.clientId);
        if(!c.known)warnings.push('Duração anterior não informada. Confira antes de ocupar este intervalo.');
        const personal=c.known?within(data.settings.schedule?.availability,candidate):null,client=c.known?within(student?.fitProfile?.weeklyAvailability,candidate):null;
        if(personal===false)errors.push('O intervalo está fora da disponibilidade semanal do personal.');else if(personal===null&&c.known)warnings.push('Disponibilidade semanal do personal não configurada.');
        if(client===false)errors.push('O intervalo está fora da disponibilidade semanal do aluno.');else if(client===null&&c.known)warnings.push('Disponibilidade semanal do aluno não configurada; confira as informações de sua ficha.');
        for(const b of data.settings.schedule?.blocks||[])if(b.active&&b.date===candidate.date&&c.start<FitData.minutes(b.end)&&FitData.minutes(b.start)<c.end)errors.push(`Horário bloqueado: ${b.start} a ${b.end}${b.note?' · '+b.note:''}.`);
        const overlaps=conflicts(data,candidate);for(const item of overlaps)errors.push(item.kind==='unknown-duration'?`O agendamento ${item.id}, às ${item.time}, está sem duração. Confira esse horário antes de salvar outro que possa se sobrepor.`:`Conflito com ${item.name}, às ${item.time} (código ${item.id}).`);
        if(candidate.billing?.mode==='contract'){try{const cap=capacity(data,candidate.billing.enrollmentId,candidate.billing.periodId,candidate.id);if(cap.available!==null&&cap.available<1)errors.push(`O período não tem sessão disponível para este horário: ${cap.used} consumida(s) e ${cap.pending} outra(s) pendente(s), de ${cap.limit} contratada(s).`);}catch(error){errors.push(error.message);}}
        return {errors,warnings,conflicts:overlaps,endTime:c.known?clock(c.end):null};
    }
    function save(data,appointment,input,now=new Date()){
        const next=clone(data),previous=next.appointments.find(a=>a.id===appointment.id);
        if(appointment.status!=='pending')throw new Error('O horário deve permanecer pendente até a confirmação da presença.');
        if(previous&&previous.status!=='pending')throw new Error('Edite somente aulas pendentes.');
        if(!/^[A-Za-z0-9_-]{1,160}$/.test(appointment.id||''))throw new Error('Identificador de agendamento inválido.');
        if(previous&&['clientId','serviceId','proId'].some(key=>previous[key]!==appointment[key]))throw new Error('Para trocar aluno, serviço ou profissional, cancele e crie um novo horário.');
        if(previous&&(previous.date!==appointment.date||previous.time!==appointment.time))FitStudentRules.student(next,appointment.clientId,true);
        if(!previous)FitStudentRules.student(next,appointment.clientId,true);
        if(previous&&data.transactions.some(t=>t.appointmentId===previous.id)&&(previous.date!==appointment.date||previous.time!==appointment.time))throw new Error('Há recebimento anterior vinculado. Preserve a data e confira o histórico antes de reagendar.');
        let candidate={...previous,...clone(appointment),schedule:{...previous?.schedule,...metadata(input),history:clone(previous?.schedule?.history||[])}};
        if(previous)for(const key of ['billing','price','commissionPct','commissionVal','clientName','serviceName','proName','attendance']){if(previous[key]===undefined)delete candidate[key];else candidate[key]=clone(previous[key]);}
        else if(appointment.attendance!==undefined)throw new Error('Registre a confirmação após criar o agendamento.');
        span(candidate);FitData.validateSchedule(candidate);
        if(previous?.billing?.mode==='contract'){
            const e=next.enrollments.find(e=>e.id===previous.billing.enrollmentId);if(!e?.commercial)throw new Error('Contrato anterior indisponível.');
            const period=e.commercial.periods.find(p=>p.startDate<=candidate.date&&candidate.date<p.endDate);if(!period)throw new Error('A nova data está fora da vigência do contrato.');
            candidate=FitCommerceRules.prepareAppointment(next,candidate,{mode:'contract',enrollmentId:e.id,periodId:period.id});
        }
        if(previous?.billing?.mode==='standalone')candidate.billing=clone(previous.billing);
        const report=analyze(next,candidate);if(report.errors.length)throw new Error(report.errors.join('\n'));
        const values=a=>({date:a.date,time:a.time,durationMinutes:a.schedule?.durationMinutes??null,location:a.schedule?.location||'',notes:a.schedule?.notes||''});
        if(!previous)candidate.schedule.history.push({action:'created',at:now.toISOString(),next:values(candidate)});
        else if(JSON.stringify(values(previous))!==JSON.stringify(values(candidate)))candidate.schedule.history.push({action:'rescheduled',at:now.toISOString(),previous:values(previous),next:values(candidate)});
        const changedMeeting=previous&&(['date','time'].some(key=>previous[key]!==candidate[key])||['durationMinutes','location'].some(key=>previous.schedule?.[key]!==candidate.schedule?.[key]));
        if(previous?.attendance?.confirmation==='confirmed'&&changedMeeting){candidate.attendance.confirmation='unconfirmed';candidate.attendance.history.push({action:'confirmation_invalidated',at:now.toISOString(),note:'Data, horário, duração ou local alterado. Confirme o encontro novamente.'});}
        if(previous)next.appointments[next.appointments.findIndex(a=>a.id===candidate.id)]=candidate;else next.appointments.push(candidate);
        return next;
    }
    function saveAvailability(data,kind,studentId,input){
        const next=clone(data);FitData.validateAvailability(input);
        if(kind==='personal')next.settings.schedule={...next.settings.schedule,version:1,availability:clone(input)};
        else if(kind==='student'){const c=FitStudentRules.student(next,studentId,true);c.fitProfile={...c.fitProfile,version:1,weeklyAvailability:clone(input)};}
        else throw new Error('Origem da disponibilidade inválida.');return next;
    }
    function block(data,input,id){
        const next=clone(data);if(!/^[A-Za-z0-9_-]{1,160}$/.test(id||''))throw new Error('Identificador do bloqueio inválido.');
        const schedule={...next.settings.schedule,version:1,blocks:clone(next.settings.schedule?.blocks||[])};if(schedule.blocks.some(b=>b.id===id))throw new Error('Este bloqueio já foi registrado.');
        schedule.blocks.push({id,date:input.date,start:input.start,end:input.end,note:typeof input.note==='string'?input.note.trim():input.note,active:true});next.settings.schedule=schedule;FitData.validateScheduleSettings(next.settings);return next;
    }
    function release(data,id){const next=clone(data),b=next.settings.schedule?.blocks?.find(b=>b.id===id);if(!b)throw new Error('Bloqueio indisponível.');b.active=false;return next;}
    function recurrenceDates(start,options){
        if(!FitData.isDate(start)||!options||!Number.isInteger(options.count)||options.count<2||options.count>52||!Number.isInteger(options.weekInterval)||options.weekInterval<1||options.weekInterval>4||!Array.isArray(options.weekdays)||!options.weekdays.length||options.weekdays.some(d=>!Number.isInteger(d)||d<0||d>6)||new Set(options.weekdays).size!==options.weekdays.length)throw new Error('Defina de 2 a 52 aulas, dias da semana e intervalo de 1 a 4 semanas.');
        if(!options.weekdays.includes(weekday(start)))throw new Error('Selecione também o dia da primeira aula ou ajuste a data inicial.');
        const dates=[],baseMonday=Date.parse(start+'T00:00:00Z')-((weekday(start)+6)%7)*86400000;
        for(let offset=0;offset<=365&&dates.length<options.count;offset++){const date=addDays(start,offset),week=Math.floor((Date.parse(date+'T00:00:00Z')-baseMonday)/604800000);if(week%options.weekInterval===0&&options.weekdays.includes(weekday(date)))dates.push(date);}
        if(dates.length!==options.count)throw new Error('A repetição deve caber em até 366 dias. Reduza a quantidade ou o intervalo.');return dates;
    }
    function previewSeries(data,base,input,options,seriesId,now=new Date()){
        if(typeof seriesId!=='string'||!/^[A-Za-z0-9_-]{1,120}$/.test(seriesId))throw new Error('Identificador de série inválido.');
        if(data.appointments.some(a=>a.schedule?.recurrence?.seriesId===seriesId))throw new Error('Esta série já foi registrada. Abra uma nova contratação de horários se necessário.');
        const dates=recurrenceDates(base.date,options);metadata(input);span(base);let working=clone(data);const rows=[];
        for(let i=0;i<dates.length;i++){
            const id=seriesId+'_'+(i+1);if(data.appointments.some(a=>a.id===id))throw new Error('Identificador de aula já utilizado. Abra uma nova série.');
            let a={...clone(base),id,date:dates[i]};
            try{
                if(a.billing?.mode==='contract'){const e=working.enrollments.find(e=>e.id===a.billing.enrollmentId),p=e?.commercial?.periods.find(p=>p.startDate<=a.date&&a.date<p.endDate);if(!p)throw new Error('A data não possui período contratado no contrato escolhido.');a=FitCommerceRules.prepareAppointment(working,a,{mode:'contract',enrollmentId:e.id,periodId:p.id});}
                else if(a.billing?.mode==='standalone')a=FitCommerceRules.prepareAppointment(working,a,{mode:'standalone',price:a.billing.priceCents/100});
                else throw new Error('Defina cobertura contratada ou valor avulso antes de repetir aulas.');
                const next=save(working,a,input,now),saved=next.appointments.find(a=>a.id===id);saved.schedule.recurrence={version:1,seriesId,index:i+1,count:options.count,weekInterval:options.weekInterval,weekdays:options.weekdays.slice().sort((a,b)=>a-b),originalDate:a.date};
                const report=analyze(next,saved);rows.push({id,date:a.date,time:a.time,endTime:report.endTime,errors:[],warnings:report.warnings,periodId:saved.billing.periodId||null});working=next;
            }catch(error){rows.push({id,date:a.date,time:a.time,endTime:null,errors:[error.message],warnings:[]});}
        }
        const valid=rows.every(row=>!row.errors.length);return {valid,rows,count:rows.length,data:valid?working:null};
    }
    return {clock,span,metadata,conflicts,within,analyze,save,saveAvailability,block,release,range,move,periodItems,capacity,recurrenceDates,previewSeries,weekday};
})();
