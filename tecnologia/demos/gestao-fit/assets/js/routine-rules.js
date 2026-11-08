/* Leituras da rotina. Nenhuma ação de confirmação, presença ou cobrança é automática. */
const FitRoutineRules = (() => {
    function dayNumber(value) { if(!FitData.isDate(value))throw new Error('Data inválida.');return Date.parse(value+'T00:00:00Z')/86400000; }
    function addDays(value, amount) { return new Date((dayNumber(value)+amount)*86400000).toISOString().slice(0,10); }
    function profile(data) {
        const stored=data.settings.professional||{};
        return { name:stored.name||data.settings.businessOwner||'',brand:data.settings.businessName||'',email:stored.email||'',phone:stored.phone||'',registration:stored.registration||'',specialty:stored.specialty||'',primaryInstructorId:stored.primaryInstructorId||(data.team.length===1?data.team[0].id:'') };
    }
    function text(value,label,max,required=false) {
        if(typeof value!=='string')throw new Error(label+' inválido.');const clean=value.trim();
        if(clean.length>max||required&&clean.length<2)throw new Error(label+(required?' deve ter de 2 a '+max:' deve ter até '+max)+' caracteres.');return clean;
    }
    function saveProfile(data,input,newId) {
        const next=FitData.clone(data),name=text(input.name,'Nome',120,true),email=text(input.email||'','E-mail',160),phone=text(input.phone||'','Telefone',32);
        if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Confira o e-mail profissional.');
        if(phone&&!/^\+?[\d\s().-]+$/.test(phone)||phone&&(phone.replace(/\D/g,'').length<10||phone.replace(/\D/g,'').length>15))throw new Error('Confira o telefone profissional.');
        let primaryInstructorId=input.primaryInstructorId||'';
        if(primaryInstructorId&&!next.team.some(person=>person.id===primaryInstructorId))throw new Error('O cadastro vinculado não está disponível. Confira o perfil.');
        if(!primaryInstructorId){if(!/^[A-Za-z0-9_-]{1,160}$/.test(newId||'')||next.team.some(p=>p.id===newId))throw new Error('Não foi possível criar o vínculo profissional.');primaryInstructorId=newId;next.team.push({id:primaryInstructorId,name,commission:0});}
        else {const person=next.team.find(p=>p.id===primaryInstructorId);person.name=name;}
        next.settings.businessName=text(input.brand||'','Nome profissional ou marca',120);
        next.settings.professional={...next.settings.professional,version:1,name,email,phone,registration:text(input.registration||'','Registro profissional',80),specialty:text(input.specialty||'','Especialidade',160),primaryInstructorId};
        return next;
    }
    function schedule(data,date,status='all') {
        if(!FitData.isDate(date))throw new Error('Escolha uma data válida.');
        return data.appointments.filter(item=>item.date===date&&(status==='all'||item.status===status)).slice().sort((a,b)=>a.time.localeCompare(b.time)||a.id.localeCompare(b.id));
    }
    function summarize(data, now=new Date()) {
        const today=FitData.dateKey(now),time=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0'),month=today.slice(0,7),day=dayNumber(today);
        const clients=new Map(data.clients.map(c=>[c.id,c]));
        const appointments=schedule(data,today),live=appointments.filter(a=>['pending','done'].includes(a.status));
        const active=data.enrollments.filter(e=>e.status==='ativo'&&clients.has(e.studentId)&&!clients.get(e.studentId).archivedAt&&!clients.get(e.studentId).archived);
        const dueSoon=Number(data.settings.dueSoonDays??3),inactivity=Number(data.settings.inactivityDays??14);
        const dues=FitCommerceRules.receivables(data).filter(r=>r.date<=addDays(today,dueSoon)).map(r=>({...r,key:r.kind+':'+r.id,id:r.enrollmentId||r.appointmentId||r.accountId,kind:r.kind==='account'?'finance':r.kind==='standalone'?'appointment':'enrollment',daysOverdue:Math.max(0,day-dayNumber(r.date)),missingPlan:r.amount===null}));
        const monthTransactions=data.transactions.filter(t=>t.date.slice(0,7)===month&&t.date<=today);
        const incomeCents=monthTransactions.filter(t=>t.type==='income').reduce((sum,t)=>sum+Math.round(t.amount*100),0),expenseCents=monthTransactions.filter(t=>t.type==='expense').reduce((sum,t)=>sum+Math.round(t.amount*100),0);
        const income=incomeCents/100,expense=expenseCents/100,minute=now.getHours()*60+now.getMinutes();
        // Um horário em andamento não é uma conclusão atrasada. Registros antigos não recebem duração presumida.
        const endMinute=a=>Number.isInteger(a.schedule?.durationMinutes)?Number(a.time.slice(0,2))*60+Number(a.time.slice(3))+a.schedule.durationMinutes:null;
        const past=data.appointments.filter(a=>a.status==='pending'&&(a.date<today||a.date===today&&(endMinute(a)===null?a.time<time:endMinute(a)<=minute))).slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)||a.id.localeCompare(b.id));
        const ongoing=appointments.filter(a=>a.status==='pending'&&a.time<=time&&endMinute(a)!==null&&endMinute(a)>minute);
        const upcoming=appointments.filter(a=>a.status==='pending'&&(a.time>time||a.time===time&&endMinute(a)===null));
        const awaitingToday=past.filter(a=>a.date===today);
        const inactive=[];
        for(const id of new Set(active.map(e=>e.studentId))){
            const starts=active.filter(e=>e.studentId===id&&e.startDate<=today).map(e=>e.startDate).sort();if(!starts.length)continue;
            const latest=data.appointments.filter(a=>a.clientId===id&&a.status==='done'&&a.date<=today).map(a=>a.date).sort().at(-1);
            const reference=[starts.at(-1),latest].filter(Boolean).sort().at(-1),days=day-dayNumber(reference);
            if(days>=inactivity)inactive.push({id,name:clients.get(id).name,days,lastVisit:latest||null});
        }
        inactive.sort((a,b)=>b.days-a.days||a.name.localeCompare(b.name));
        const integrity=FitData.inspect(data).issues;
        const reviews=[];
        for(const c of data.clients.filter(c=>!c.archived&&!c.archivedAt)){
            const last=(c.assessments||[]).slice().sort((a,b)=>b.date.localeCompare(a.date)||(b.createdAt||'').localeCompare(a.createdAt||'')||b.id.localeCompare(a.id))[0];
            if(last?.nextReview&&last.nextReview<=addDays(today,dueSoon))reviews.push({id:c.id,name:c.name,date:last.nextReview});
        }
        const pending=[];
        if(typeof FitCRMRules!=='undefined')for(const c of data.clients){
            const r=FitCRMRules.state(c),label=FitCRMRules.initials(c.name)+' · '+c.id;
            if(!c.archived&&!c.archivedAt&&r.nextContact&&r.nextContact<=today)pending.push({key:'crm:'+c.id,kind:'student',id:c.id,date:r.nextContact,title:label,detail:'Retorno administrativo previsto',priority:3});
            if(FitCRMRules.openRequests(c).length)pending.push({key:'privacy:'+c.id,kind:'student',id:c.id,title:label,detail:'Solicitação de dados aguardando resposta registrada',priority:3});
            if(r.privacy.reviewOn&&r.privacy.reviewOn<=today)pending.push({key:'privacyReview:'+c.id,kind:'student',id:c.id,date:r.privacy.reviewOn,title:label,detail:'Revisar a necessidade dos dados conservados',priority:3});
        }
        for(const item of past)pending.push({key:'appointment:'+item.id,kind:'appointment',id:item.id,date:item.date,title:item.clientName||clients.get(item.clientId)?.name||'Aluno não vinculado',detail:item.date===today&&endMinute(item)===null?'Horário iniciado · duração a conferir':'Horário encerrado sem conclusão',priority:1});
        for(const item of dues)pending.push({key:item.key,dueKey:item.key,kind:item.kind,id:item.id,date:item.date,title:item.name,detail:item.missingPlan?'Conferir condições anteriores':item.date<today?'Recebimento com vencimento anterior':item.date===today?'Recebimento previsto para hoje':'Recebimento próximo',priority:item.date<today?2:4});
        for(const item of inactive)pending.push({key:'student:'+item.id,kind:'student',id:item.id,title:item.name,detail:item.lastVisit?`${item.days} dias sem aula concluída`:`Sem presença concluída desde o início do plano (${item.days} dias)`,priority:5});
        for(const item of reviews)pending.push({key:'review:'+item.id,kind:'student',id:item.id,date:item.date,title:item.name,detail:item.date<today?'Reavaliação prevista pendente':'Reavaliação prevista',priority:3});
        for(const p of data.training?.programs||[]){const c=clients.get(p.studentId),v=p.versions.at(-1);if(p.kind==='student'&&!p.archived&&c&&!c.archived&&!c.archivedAt&&v.reviewOn&&v.reviewOn<=addDays(today,dueSoon))pending.push({key:'trainingReview:'+p.id,kind:'training',id:p.id,date:v.reviewOn,title:c.name,detail:'Revisão de treino · '+v.title,priority:3});}
        if(!data.settings.professional?.name)pending.push({key:'profile:setup',kind:'profile',title:'Complete seu perfil',detail:'Nome, contato e vínculo do profissional',priority:0});
        if(!data.services.length)pending.push({key:'services:setup',kind:'services',title:'Cadastre seus serviços',detail:'Defina os valores antes de registrar uma aula',priority:0});
        if(integrity.length)pending.push({key:'integrity:review',kind:'integrity',title:'Vínculos para conferir',detail:`${integrity.length} referência(s) indisponível(is); registros preservados`,priority:3});
        pending.sort((a,b)=>a.priority-b.priority||(a.date||'').localeCompare(b.date||'')||a.key.localeCompare(b.key));
        return {today,time,dueWindowEnd:addDays(today,dueSoon),profile:profile(data),appointments,ongoing,upcoming,awaitingToday,scheduled:live.filter(a=>a.status==='pending').length,completed:live.filter(a=>a.status==='done').length,total:live.length,canceled:appointments.filter(a=>a.status==='canceled').length,missed:appointments.filter(a=>a.status==='missed').length,confirmed:appointments.filter(a=>a.status==='pending'&&a.attendance?.confirmation==='confirmed').length,income,expense,balance:(incomeCents-expenseCents)/100,dues,forecast:dues.reduce((sum,e)=>sum+Math.round((e.amount||0)*100),0)/100,overdue:dues.filter(e=>e.date<today).length,past,inactive,pending,integrity};
    }
    return {profile,saveProfile,schedule,summarize,addDays};
})();
