/* Agenda, atendimento, pacotes e cobrança: cada operação é gravada uma única vez. */
const TherapyFlow = (() => {
    const copy=data=>JSON.parse(JSON.stringify(data));
    function available(data,pack){return pack.voided?0:Number(pack.totalSessions)-data.packageMovements.filter(m=>m.packageId===pack.id).reduce((n,m)=>n+Number(m.quantity),0);}
    function schedule(data,appointment,count=1){
        if(!data.patients.some(p=>p.id===appointment.patientId&&!p.archived))throw new Error('Selecione um paciente ativo.');
        if(!Number.isInteger(count)||count<1||count>24)throw new Error('Escolha entre 1 e 24 semanas.');
        if(!/^\d{4}-\d{2}-\d{2}$/.test(appointment.date)||TherapyData.dateKey(new Date(appointment.date+'T12:00:00'))!==appointment.date||!/^\d{2}:\d{2}$/.test(appointment.time)||Number(appointment.time.slice(0,2))>23||Number(appointment.time.slice(3))>59||!Number.isFinite(appointment.duration)||appointment.duration<10||appointment.duration>240)throw new Error('Confira data, horário e duração de 10 a 240 minutos.');
        if(appointment.meetUrl!==undefined)appointment={...appointment,meetUrl:TherapyExternalRules.meet(appointment.meetUrl)};
        const old=data.appointments.find(a=>a.id===appointment.id);
        if(appointment.coverage!==undefined)appointment={...appointment,coverage:TherapyCoverageRules.snapshot(data,TherapyCoverageRules.preference(appointment.coverage),old?.coverage)};
        else if(old?.coverage)appointment={...appointment,coverage:copy(old.coverage)};
        if(old?.status==='completed')throw new Error('Atendimento concluído: edite as anotações pelo registro da sessão.');
        if(old&&count>1)throw new Error('Edite uma marcação de cada vez. A série existente será preservada.');
        const cfg=TherapyAgendaRules.read(data.settings),unchanged=old&&!['cancelled','no_show'].includes(old.status)&&old.date===appointment.date&&old.time===appointment.time&&Number(old.duration)===appointment.duration;
        const next=copy(data),existing=next.appointments.filter(a=>a.id!==appointment.id),batch=[];
        const start=appointment.time.split(':').reduce((h,m)=>h*60+Number(m),0);
        if(start+appointment.duration>1440)throw new Error('A sessão deve terminar no mesmo dia.');
        for(let i=0;i<count;i++){
            const day=new Date(appointment.date+'T12:00:00');day.setDate(day.getDate()+7*i);
            const item={...appointment,id:i?getID():appointment.id,date:TherapyData.dateKey(day),status:old?.status||'scheduled',seriesId:count>1?appointment.id:old?.seriesId};
            const unavailable=unchanged?'':TherapyAgendaRules.reason(cfg,item.date,start,item.duration);
            if(unavailable)throw new Error(unavailable+' Nenhuma marcação da série foi gravada.');
            const conflict=!unchanged&&TherapyAgendaRules.conflict(existing.concat(batch),item,cfg.bufferMinutes);
            if(conflict)throw new Error('Há conflito de horário em '+fmtDate(item.date)+'. Nenhum agendamento foi gravado.');
            batch.push(item);
        }
        next.appointments=existing.concat(batch);return next;
    }
    function complete(data,record,billing){
        record=TherapySessionRules.prepare(record);
        const next=copy(data),appointment=next.appointments.find(a=>a.id===record.appointmentId),old=next.sessions.find(s=>s.id===record.id);
        if(!next.patients.some(p=>p.id===record.patientId)||!record.content.trim())throw new Error('Selecione o paciente e registre as anotações da sessão.');
        if(old){const index=next.sessions.indexOf(old);next.sessions[index]=TherapySessionRules.edit(old,record);return next;}
        if(record.appointmentId&&!appointment)throw new Error('O agendamento não está mais disponível.');
        if(appointment?.date&&appointment.date!==record.date)throw new Error('A data do registro deve corresponder ao agendamento.');
        if(next.patients.find(p=>p.id===record.patientId).archived&&appointment?.status!=='completed')throw new Error('Reative o cadastro antes de iniciar um novo atendimento.');
        if(appointment&&(appointment.patientId!==record.patientId||['cancelled','no_show'].includes(appointment.status)))throw new Error('O agendamento não está disponível para este atendimento.');
        const linked=appointment&&next.sessions.find(s=>s.appointmentId===appointment.id);
        if(linked&&linked.id!==record.id)throw new Error('Este atendimento já tem um registro. Abra o registro existente.');
        if(appointment?.coverage)record.coverage=copy(appointment.coverage);
        else if(record.coverage!==undefined)record.coverage=TherapyCoverageRules.validate(record.coverage);
        if(appointment?.status==='completed'){record.billingMode='none';record.recoveredAt=new Date().toISOString();next.sessions.push(record);return next;}
        if(!billing||!['none','single','package'].includes(billing.mode))throw new Error('Escolha a forma de registro da cobrança.');
        if(billing.mode==='package'){
            const pack=next.packages.find(p=>p.id===billing.packageId&&p.patientId===record.patientId);
            if(!pack||available(next,pack)<=0||(pack.expiresAt&&pack.expiresAt<record.date)||(pack.date&&pack.date>record.date))throw new Error('O pacote não tem saldo válido para esta sessão.');
            next.packageMovements.push({id:getID(),packageId:pack.id,sessionId:record.id,appointmentId:appointment?.id||null,quantity:1,date:record.date});record.packageId=pack.id;
        }else if(billing.mode==='single'){
            if(!Number.isFinite(billing.amount)||billing.amount<0)throw new Error('Informe um valor válido para a sessão.');
            next.financial.push({id:getID(),patientId:record.patientId,sessionId:record.id,appointmentId:appointment?.id||null,...(record.coverage?{coverage:copy(record.coverage)}:{}),source:'session',type:'income',description:'Sessão avulsa',category:billing.category||'sessao',date:record.date,amount:Math.round(billing.amount*100)/100,paymentStatus:billing.paid?'paid':'pending',createdAt:new Date().toISOString()});
        }
        record.billingMode=billing.mode;next.sessions.push(record);if(appointment)appointment.status='completed';return next;
    }
    function sellPackage(data,pack,paid){
        if(!/^[a-zA-Z0-9_-]+$/.test(pack.id||'')||!data.patients.some(p=>p.id===pack.patientId&&!p.archived)||typeof pack.name!=='string'||!pack.name.trim()||pack.name.length>200||!Number.isInteger(pack.totalSessions)||pack.totalSessions<1||pack.totalSessions>100||!Number.isFinite(pack.amount)||pack.amount<0||pack.amount>999999999.99||!TherapyAgendaRules.validDate(pack.date)||pack.expiresAt&&(!TherapyAgendaRules.validDate(pack.expiresAt)||pack.expiresAt<pack.date))throw new Error('Confira paciente, nome, quantidade, valor e validade do pacote.');
        if(data.packages.some(p=>p.id===pack.id))throw new Error('Este pacote já foi salvo. Reabra o formulário para uma nova venda.');
        if(pack.paymentDate&&(!TherapyAgendaRules.validDate(pack.paymentDate)||pack.paymentDate>TherapyData.dateKey()))throw new Error('Confira a data do pagamento realizado.');
        const next=copy(data);next.packages.push({...copy(pack),amount:Math.round(pack.amount*100)/100,createdAt:pack.createdAt||new Date().toISOString()});next.financial.push({id:getID(),patientId:pack.patientId,packageId:pack.id,source:'package',type:'income',description:'Pacote: '+pack.name,category:'pacote',date:pack.date,amount:Math.round(pack.amount*100)/100,paymentStatus:paid?'paid':'pending',...(paid?{paidAt:pack.paymentDate||pack.date}:{}),paymentMethod:pack.paymentMethod||'unknown',createdAt:new Date().toISOString()});return next;
    }
    return{schedule,complete,sellPackage,available};
})();

function initTherapyWorkflows(){
    initTherapyOrientations();
    document.getElementById('appointment-form').lastElementChild.insertAdjacentHTML('beforebegin','<div class="therapy-form-grid"><label>Repetir semanalmente<input id="therapy-repeat" type="number" min="1" max="24" value="1"><small>Quantidade de semanas, incluindo a primeira sessão.</small></label><label>Valor da sessão avulsa (R$)<input id="therapy-appointment-fee" type="number" min="0" step="0.01" value="0"></label></div>');
    document.getElementById('session-form').lastElementChild.insertAdjacentHTML('beforebegin','<div id="therapy-billing" class="therapy-panel"><input type="hidden" id="therapy-session-appointment"><h3>Cobrança deste atendimento</h3><label>Forma de registro<select id="therapy-billing-mode" onchange="syncTherapyBilling()"><option value="none">Sem cobrança vinculada</option><option value="single">Sessão avulsa ou convênio manual</option><option value="package">Consumir uma sessão do pacote</option></select></label><div id="therapy-single"><label>Valor (R$)<input id="therapy-session-fee" type="number" min="0" step="0.01"></label><label><input type="checkbox" id="therapy-session-paid">Pagamento já recebido</label></div><div id="therapy-package"><label>Pacote do paciente<select id="therapy-session-package"></select></label></div><p id="therapy-billing-note"></p></div>');
    document.getElementById('session-patient').addEventListener('change',populateTherapyPackageChoices);
    TherapyExternal.init();
    TherapyPackages.init();
    TherapyReports.init();
    TherapyPatients.init();
    TherapyCoverageUI.init();
    TherapySessions.init();
    TherapyTreatments.init();
    installTherapyActions();if(window.lucide)lucide.createIcons();
}
const originalTherapyRouter=window.router;
window.router=function(view){if(originalTherapyRouter(view)===false)return false;document.querySelector('#therapy-dialog[data-therapy-routine-next]')?.remove();if(view==='reports')TherapyReports.render();if(view==='packages'){document.getElementById('page-title').textContent='Pacotes';renderTherapyPackages();}document.getElementById('therapy-workspace-scroll').scrollTo({top:0,behavior:'instant'});};
const originalTherapyAppointment=window.openAppointmentModal;
window.openAppointmentModal=function(id=null,patientId=null){document.getElementById('care-schedule-context')?.remove();originalTherapyAppointment(id,patientId);if(!id)document.getElementById('appointment-date').value=document.getElementById('view-schedule').classList.contains('hide')?TherapyData.dateKey():TherapyAgenda.date();document.getElementById('therapy-repeat').value='1';document.getElementById('therapy-repeat').disabled=!!id;document.getElementById('therapy-appointment-fee').value=db.appointments.find(a=>a.id===id)?.fee??db.settings.sessionFee??0;TherapyCoverageUI.appointment(id,patientId||document.getElementById('appointment-patient').value);TherapyExternal.fill(db.appointments.find(a=>a.id===id));};
window.submitAppointment=async function(event){event.preventDefault();const id=document.getElementById('appointment-id').value;const item={id:id||getID(),patientId:document.getElementById('appointment-patient').value,type:document.getElementById('appointment-type').value,date:document.getElementById('appointment-date').value,time:document.getElementById('appointment-time').value,duration:Number(document.getElementById('appointment-duration-input').value),notes:document.getElementById('appointment-notes').value,fee:Number(document.getElementById('therapy-appointment-fee').value),meetUrl:TherapyExternal.value(),coverage:TherapyCoverageUI.appointmentValue(id),createdAt:db.appointments.find(a=>a.id===id)?.createdAt||new Date().toISOString()};if(!Number.isFinite(item.fee)||item.fee<0)throw new Error('Informe um valor válido.');db=TherapyFlow.schedule(db,item,id?1:Number(document.getElementById('therapy-repeat').value));await save();closeModal('appointmentModal');renderSchedule();therapyNotice('Agendamento salvo.');};
const originalTherapyNotes=window.openSessionNotesModal;
window.openSessionNotesModal=function(id=null,appointmentId=null){
    const appointment=db.appointments.find(a=>a.id===appointmentId),existing=id?db.sessions.find(s=>s.id===id):db.sessions.find(s=>appointmentId&&s.appointmentId===appointmentId);
    originalTherapyNotes(existing?.id||null);
    document.getElementById('therapy-session-appointment').value=appointmentId||existing?.appointmentId||'';
    const patientId=appointment?.patientId||existing?.patientId,patientSelect=document.getElementById('session-patient');
    if(patientId&&![...patientSelect.options].some(option=>option.value===patientId)){const patient=db.patients.find(p=>p.id===patientId);if(patient)patientSelect.add(new Option(patient.name+' (arquivado)',patient.id));}
    if(patientId)patientSelect.value=patientId;
    if(appointment){document.getElementById('session-patient').value=appointment.patientId;document.getElementById('session-date').value=appointment.date;}
    document.getElementById('session-patient').disabled=!!appointment||!!existing;document.getElementById('session-date').disabled=!!appointment||!!existing;
    const recovery=appointment?.status==='completed'&&!existing;
    document.getElementById('therapy-billing-mode').value=existing?.billingMode||(recovery?'none':appointment?'single':'none');document.getElementById('therapy-session-fee').value=appointment?.fee??db.settings.sessionFee??0;document.getElementById('therapy-session-paid').checked=false;
    populateTherapyPackageChoices();document.querySelectorAll('#therapy-billing input:not([type=hidden]),#therapy-billing select').forEach(el=>el.disabled=!!existing||recovery);document.getElementById('therapy-billing-note').textContent=existing?'A edição das anotações preserva o atendimento e a cobrança já registrados.':recovery?'Recuperação de anotação: atendimento, cobranças e consumos de pacote preservados. Não será gerada nova cobrança.':appointment?'Ao salvar, o atendimento será concluído e o lançamento ou consumo será registrado uma única vez.':'Anotação avulsa, sem agendamento vinculado. Confira a forma de cobrança antes de salvar.';syncTherapyBilling();
};
function syncTherapyBilling(){const mode=document.getElementById('therapy-billing-mode').value;document.getElementById('therapy-single').hidden=mode!=='single';document.getElementById('therapy-package').hidden=mode!=='package';}
window.submitSessionNotes=async function(event){event.preventDefault();const record={id:document.getElementById('session-id').value||getID(),appointmentId:document.getElementById('therapy-session-appointment').value||null,patientId:document.getElementById('session-patient').value,date:document.getElementById('session-date').value,content:document.getElementById('session-content').value,interventions:document.getElementById('session-interventions').value,nextPlan:document.getElementById('session-next-plan').value,mood:document.getElementById('session-mood').value,adherence:document.getElementById('session-adherence').value,createdAt:new Date().toISOString()};db=TherapyFlow.complete(db,record,{mode:document.getElementById('therapy-billing-mode').value,amount:Number(document.getElementById('therapy-session-fee').value),paid:document.getElementById('therapy-session-paid').checked,packageId:document.getElementById('therapy-session-package').value});await save();closeModal('sessionNotesModal');renderSessions();therapyNotice('Atendimento e registro salvos.');};
window.changeAppointmentStatus=function(id){const item=db.appointments.find(a=>a.id===id);if(!item)return;const modal=TherapyVault.dialog('Situação do agendamento',`<p>${sanitizeHTML(getPatientName(item.patientId))} · ${fmtDate(item.date)} · ${sanitizeHTML(item.time)}</p><label>Situação<select id="therapy-status">${[['scheduled','Agendado'],['confirmed','Confirmado'],['in_progress','Em atendimento'],['cancelled','Cancelado'],['no_show','Não compareceu']].map(([value,label])=>`<option value="${value}" ${item.status===value?'selected':''}>${label}</option>`).join('')}</select></label><label>Motivo ou observação<input id="therapy-status-reason"></label><div class="therapy-actions"><button id="therapy-status-save">Salvar situação</button><button id="therapy-status-complete">Registrar atendimento</button><button type="button" onclick="this.closest('#therapy-dialog').remove()">Voltar</button></div>`);modal.querySelector('#therapy-status-save').onclick=()=>window.submitTherapyStatus(id);modal.querySelector('#therapy-status-complete').onclick=()=>{modal.remove();openSessionNotesModal(null,id);};};
window.submitTherapyStatus=async function(id){let item=db.appointments.find(a=>a.id===id);const status=document.getElementById('therapy-status').value,reason=document.getElementById('therapy-status-reason').value.trim();if(item.status==='completed')throw new Error('O atendimento está concluído. Seu histórico e cobrança serão preservados.');if(['cancelled','no_show'].includes(status)&&!reason)throw new Error('Informe o motivo ou a observação.');if(!['scheduled','confirmed','in_progress','cancelled','no_show'].includes(status))throw new Error('Situação inválida.');if(!['cancelled','no_show'].includes(status)){db=TherapyFlow.schedule(db,{...item},1);item=db.appointments.find(a=>a.id===id);}item.status=status;item.statusReason=reason;item.updatedAt=new Date().toISOString();await save();document.getElementById('therapy-dialog').remove();renderSchedule();therapyNotice('Situação atualizada.');};
window.deleteAppointment=function(){const id=document.getElementById('appointment-id').value;closeModal('appointmentModal');return changeAppointmentStatus(id);};
window.deleteSessionNotes=async function(){const session=db.sessions.find(s=>s.id===document.getElementById('session-id').value);if(!session||!confirm('Arquivar a anotação? O atendimento, consumo de pacote e cobrança permanecerão registrados.'))return;session.archived=true;await save();closeModal('sessionNotesModal');renderSessions();};
