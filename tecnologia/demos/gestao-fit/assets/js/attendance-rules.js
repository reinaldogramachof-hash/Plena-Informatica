/* Confirmação não é presença. Faltas exigem uma decisão explícita sobre a sessão. */
const FitAttendanceRules = (() => {
    const clone=FitData.clone;
    function appointment(data,id){const a=data.appointments.find(a=>a.id===id);if(!a)throw new Error('Aula não encontrada.');return a;}
    function text(value,max=2000,required=false){if(typeof value!=='string'||value.trim().length>max||required&&value.trim().length<3)throw new Error(required?'Informe uma justificativa de 3 a '+max+' caracteres.':'Observação inválida.');return value.trim();}
    function pending(data,id){const a=appointment(data,id);if(a.status!=='pending')throw new Error('Esta ação está disponível somente para aulas agendadas.');FitStudentRules.student(data,a.clientId,true);return a;}
    function stamp(now){if(!(now instanceof Date)||!Number.isFinite(now.getTime()))throw new Error('Data de registro inválida.');return now.toISOString();}
    function history(a,action,now,note='',extra={}){const previous=a.attendance||{version:1,confirmation:'unconfirmed',history:[]};a.attendance={...previous,history:[...previous.history,{action,at:stamp(now),note,...extra}]};}
    function elapsed(a,now,requireEnd=false){
        stamp(now);const today=FitData.dateKey(now);if(a.date>today)throw new Error('Não registre presença ou falta em uma aula futura.');
        if(a.date<today)return;
        const current=now.getHours()*60+now.getMinutes(),start=FitData.minutes(a.time);
        if(requireEnd&&!a.schedule?.durationMinutes)throw new Error('Informe a duração do horário antes de registrar falta em uma aula de hoje.');
        if(current<start+(requireEnd?a.schedule.durationMinutes:0))throw new Error(requireEnd?'Aguarde o término previsto da aula para registrar falta.':'Aguarde o início da aula para registrar sua conclusão.');
    }
    function confirm(data,id,confirmed,note='',now=new Date()){
        if(typeof confirmed!=='boolean')throw new Error('Confirmação inválida.');note=text(note);const next=clone(data),a=pending(next,id),state=confirmed?'confirmed':'unconfirmed';stamp(now);
        if((a.attendance?.confirmation||'unconfirmed')===state)return next;
        history(a,confirmed?'confirmed':'confirmation_cleared',now,note);a.attendance.confirmation=state;return next;
    }
    function complete(data,id,note='',now=new Date()){
        note=text(note);const previous=appointment(data,id);if(previous.status==='done')return clone(data);elapsed(previous,now);
        const next=FitCommerceRules.complete(data,id,now),a=appointment(next,id);history(a,'completed',now,note);return next;
    }
    function miss(data,id,input,now=new Date()){
        const reason=text(input?.reason,1000,true),effect=input?.effect;if(!['waived','consume'].includes(effect))throw new Error('Escolha se a falta preserva ou consome uma sessão.');
        const next=clone(data),old=appointment(next,id);if(old.status==='missed'){if(old.attendance.absence.effect===effect&&old.attendance.absence.reason===reason)return next;throw new Error('Esta falta já foi registrada. Use a correção para alterar sua decisão.');}
        const a=pending(next,id);elapsed(a,now,true);
        if(effect==='consume'){
            if(a.billing?.mode!=='contract')throw new Error('Consumo por falta exige uma cobertura contratada e conferida. Aulas avulsas ou anteriores não recebem nova cobrança.');
            if(next.transactions.some(t=>t.appointmentId===a.id&&!t.paymentKey))throw new Error('Há recebimento anterior vinculado. Confira o histórico antes de consumir outra sessão.');
            const info=FitCommerceRules.coverage(next,a,a.billing.enrollmentId,a.billing.periodId);
            if(info.enrollment.commercial.uses.some(u=>u.appointmentId===a.id||u.id===a.id))throw new Error('Já existe um movimento de sessão com esta identificação. Confira o histórico.');
            info.enrollment.commercial.uses.push({id:a.id,appointmentId:a.id,periodId:info.period.id,date:a.date});
        }
        a.status='missed';history(a,'missed',now,reason,{effect});a.attendance.absence={effect,reason,recordedAt:stamp(now)};return next;
    }
    function correctAbsence(data,id,reason,now=new Date()){
        reason=text(reason,1000,true);const next=clone(data),a=appointment(next,id);if(a.status!=='missed'||!a.attendance?.absence)throw new Error('Escolha uma falta registrada para corrigir.');FitStudentRules.student(next,a.clientId,true);
        const previous=clone(a.attendance.absence);
        if(previous.effect==='consume'){
            const e=next.enrollments.find(e=>e.id===a.billing?.enrollmentId),use=e?.commercial?.uses.find(u=>u.appointmentId===a.id&&u.periodId===a.billing.periodId&&u.date===a.date);
            if(!use)throw new Error('Movimento da falta indisponível. Nenhuma alteração foi aplicada.');e.commercial.uses=e.commercial.uses.filter(u=>u!==use);
        }
        a.status='pending';delete a.attendance.absence;a.attendance.confirmation='unconfirmed';history(a,'absence_corrected',now,reason,{effect:previous.effect});
        if(a.billing?.mode==='contract')FitCommerceRules.coverage(next,a,a.billing.enrollmentId,a.billing.periodId);
        const report=FitScheduleRules.analyze(next,a);if(report.errors.length)throw new Error('Não foi possível devolver a aula à agenda: '+report.errors.join(' '));return next;
    }
    function cancel(data,id,now=new Date()){
        const previous=appointment(data,id),next=FitCommerceRules.cancelAppointment(data,id);if(previous.status!=='canceled')history(appointment(next,id),'canceled',now);return next;
    }
    return {confirm,complete,miss,correctAbsence,cancel};
})();
