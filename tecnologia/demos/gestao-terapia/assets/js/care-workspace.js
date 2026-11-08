/* Contexto e próximos passos do atendimento, sempre dentro do cofre local. */
const TherapyCare=(()=>{
 const R=TherapyCareRules,el=id=>document.getElementById(id),esc=value=>sanitizeHTML(String(value??''));
 const date=value=>value?fmtDate(String(value).slice(0,10)):'Sem data';
 const button=(label,action)=>`<button type="button" class="therapy-secondary" onclick="${action}">${label}</button>`;
 let assessmentOrigin='',orientationOrigin='',previousAssessment='';
 function init(){
  if(el('care-session-context'))return;
  const grid=el('session-form').querySelector(':scope>.grid');
  grid.insertAdjacentHTML('afterend','<details id="care-session-context" class="care-context"><summary>Contexto para este encontro</summary><div id="care-session-summary"></div></details><section class="sessions-form-section"><h4>Plano e objetivos deste encontro</h4><label>Plano terapêutico (opcional)<select id="care-session-plan" onchange="TherapyCare.objectives()"></select></label><div id="care-session-objectives" class="care-objectives"></div><p class="sessions-help">Selecione os objetivos trabalhados. O vínculo será salvo com a sessão; a situação dos objetivos permanece sob sua decisão.</p></section>');
  el('session-patient').addEventListener('change',()=>sessionContext());el('session-date').addEventListener('change',()=>sessionContext(true));
  for(const type of ['assessment','orientation']){
   const form=el(type==='assessment'?'assessment-form':'prescription-form');
   form.querySelector('[id$="form-context"]').insertAdjacentHTML('afterend',`<details class="care-context"><summary>Vínculos do acompanhamento (opcionais)</summary><div class="care-grid"><label>Encontro de origem<select id="care-${type}-session" onchange="TherapyCare.originChanged('${type}')"></select></label><label>Plano terapêutico<select id="care-${type}-plan"></select></label></div></details>`);
   el(type==='assessment'?'assessment-patient':'prescription-patient').addEventListener('change',()=>formLinks(type));
  }
  const approach=el('treatment-approach');
  approach.insertAdjacentHTML('afterend','<input id="care-treatment-approach" aria-label="Descrição da abordagem" maxlength="300" placeholder="Descreva a abordagem, se desejar" hidden>');
  approach.addEventListener('change',approachChanged);
 }
 function approachChanged(){el('care-treatment-approach').hidden=el('treatment-approach').value!=='other';}
 function sessionContext(preserve=false,source=null){
  const patientId=el('session-patient').value,day=el('session-date').value||TherapyData.dateKey(),id=el('session-id').value;
  const chosen=source?R.selection(source.evolution):preserve?sessionSelection():R.selection();
  const context=R.context(db,patientId,day,id),last=context.last;
  el('care-session-context').querySelector('summary').textContent='Contexto do acompanhamento'+(last?' · último encontro '+date(last.date):'');
  if(source!==null)el('care-session-context').open=false;
  el('care-session-summary').innerHTML=!patientId?'<p>Selecione um paciente para consultar o acompanhamento.</p>':`<div class="care-grid"><section><h4>Último encontro registrado</h4>${last?`<p>${date(last.date)}</p><h5>Continuidade prevista</h5><p>${esc(last.nextPlan||'Não registrada.')}</p><h5>Combinados / atividades</h5><p>${esc(last.evolution?.homework||'Não registrados.')}</p>`:'<p>Sem registro anterior nesta data.</p>'}</section><section><h4>Planos ativos</h4>${context.plans.map(p=>`<p><strong>${esc(p.plan?.title||'Plano terapêutico')}</strong><br>${esc(p.goals||'')}<br>Revisão: ${date(p.plan?.reviewDate)}</p>`).join('')||'<p>Nenhum plano ativo.</p>'}</section><section><h4>Avaliações recentes</h4>${context.assessments.map(a=>`<p>${esc(a.evaluation?.instrumentName||TherapyAssessmentRules.names[a.scale]||a.scale)} · ${date(a.date)}<br>${esc(TherapyAssessmentRules.scoreLabel(a))}${R.followup(TherapyAssessmentRules.meta(a.evaluation))?'<br>Reavaliação prevista: '+date(a.evaluation.reviewDate):''}</p>`).join('')||'<p>Nenhuma aplicação confirmada.</p>'}</section><section><h4>Orientações a acompanhar</h4>${context.orientations.map(o=>`<p>${esc(o.guidance?.title||TherapyGuidanceRules.kinds[o.kind])}<br>${esc(TherapyGuidanceRules.followups[o.guidance?.followup])} · ${date(o.guidance?.followupDate)}</p>`).join('')||'<p>Nenhum retorno pendente.</p>'}</section></div>`;
  const selected=db.treatments.find(p=>p.id===chosen.treatmentId&&p.patientId===patientId),plans=context.plans.slice();if(selected&&!plans.some(p=>p.id===selected.id))plans.push(selected);
  el('care-session-plan').innerHTML='<option value="">Sem vínculo com plano</option>'+plans.map(p=>`<option value="${p.id}">${esc(p.plan?.title||'Plano terapêutico')} · ${esc(TherapyTreatmentRules.statuses[p.status]||'Histórico')}${p.archived?' · Arquivado':''}</option>`).join('');el('care-session-plan').value=selected?.id||'';objectives(chosen.objectiveIds);
 }
 function objectives(ids=[]){
  const plan=db.treatments.find(p=>p.id===el('care-session-plan').value),items=plan?TherapyTreatmentRules.plan(plan.plan).objectives:[];
  el('care-session-objectives').innerHTML=items.map(o=>`<label class="care-check"><input type="checkbox" value="${o.id}" ${ids.includes(o.id)?'checked':''}><span>${esc(o.title)}<small>${esc(TherapyTreatmentRules.objectiveStatuses[o.status])}</small></span></label>`).join('')||'<p class="sessions-help">'+(plan?'Este plano ainda não tem objetivos individuais.':'O vínculo ao plano é opcional.')+'</p>';
 }
 function sessionSelection(){return {treatmentId:el('care-session-plan')?.value||'',objectiveIds:[...document.querySelectorAll('#care-session-objectives input:checked')].map(node=>node.value)};}
 function formLinks(type,chosen={}){
  const patientId=el(type==='assessment'?'assessment-patient':'prescription-patient').value,value=R.links(chosen);
  for(const [field,collection]of [['session','sessions'],['plan','treatments']]){
   const key=field==='session'?'sessionId':'treatmentId',items=db[collection].filter(item=>item.patientId===patientId&&(!item.archived&&(field==='session'||item.status==='active')||item.id===value[key])).sort((a,b)=>String(b.date||b.createdAt||'').localeCompare(String(a.date||a.createdAt||'')));
   const node=el('care-'+type+'-'+field);node.innerHTML='<option value="">Sem vínculo</option>'+items.map(item=>`<option value="${item.id}">${esc(field==='session'?date(item.date):item.plan?.title||'Plano terapêutico')}${item.archived?' · Arquivado':''}</option>`).join('');
   if(value[key]&&!items.some(item=>item.id===value[key]))node.add(new Option('Vínculo anterior indisponível',value[key]));node.value=value[key];
  }
 }
 function formValue(type){return {sessionId:el('care-'+type+'-session').value,treatmentId:el('care-'+type+'-plan').value};}
 function originChanged(type){const session=db.sessions.find(s=>s.id===el('care-'+type+'-session').value);if(session)el('care-'+type+'-plan').value=session.evolution?.treatmentId||'';}
 function assessmentOpen(item,template){assessmentOrigin=template?.sessionId||item?.evaluation?.care?.sessionId||'';previousAssessment=item?.evaluation?.previousAssessmentId||template?.previousAssessmentId||'';formLinks('assessment',item?.evaluation?.care||{sessionId:assessmentOrigin,treatmentId:template?.treatmentId||''});if(previousAssessment&&!item){for(const id of ['assessment-patient','assessment-scale','assessment-instrument-name'])el(id).disabled=true;el('assessment-form-context').textContent+=' Paciente e instrumento são mantidos nesta reavaliação. A pendência anterior será resolvida ao confirmar.';}}
 function orientationOpen(item,template){orientationOrigin=template?.sessionId||item?.guidance?.care?.sessionId||'';formLinks('orientation',item?.guidance?.care||{sessionId:orientationOrigin,treatmentId:template?.treatmentId||''});
  if(!item){el('therapy-orientation-content').value=template?.content||'';el('orientation-professional-name').value=db.settings.professionalName||'';el('orientation-professional-id').value=db.settings.therapistLicense||'';}
  orientationKind();
 }
 function orientationKind(){const referral=el('therapy-orientation-type').value==='referral';el('orientation-destination').open=referral;el('orientation-followup-section').open=referral;}
 function sourceHTML(value){const care=R.links(value);if(!care.sessionId&&!care.treatmentId)return '';const session=db.sessions.find(s=>s.id===care.sessionId),plan=db.treatments.find(t=>t.id===care.treatmentId);return `<aside class="care-context"><h3>Origem no acompanhamento</h3>${care.sessionId?'<p>Encontro: '+(session?date(session.date):'Registro indisponível')+'</p>':''}${care.treatmentId?'<p>Plano: '+esc(plan?.plan?.title||'Plano terapêutico')+'</p>':''}</aside>`;}
 function sessionHTML(item){const chosen=R.selection(item.evolution),plan=db.treatments.find(p=>p.id===chosen.treatmentId);return sourceHTML({treatmentId:chosen.treatmentId})+(chosen.objectiveIds.length?'<p class="care-context">Objetivos trabalhados: '+chosen.objectiveIds.map(id=>esc(plan?.plan?.objectives?.find(o=>o.id===id)?.title||'Objetivo anterior preservado')).join(' · ')+'</p>':'');}
 function billingContext(item){
  const charges=db.financial.filter(f=>f.type==='income'&&f.source!=='reversal'&&TherapyManagementRules.owner(db,f)===item.patientId&&(f.sessionId===item.id||item.appointmentId&&f.appointmentId===item.appointmentId));
  const used=new Set(db.packageMovements.filter(m=>m.sessionId===item.id).map(m=>m.packageId));
  const packs=db.packages.filter(p=>used.has(p.id)&&(!p.patientId||p.patientId===item.patientId));
  return {charges,packs};
 }
 function billingHTML(item){
  const {charges,packs}=billingContext(item);
  return '<section class="care-context" id="care-billing-context"><h3>Cobrança deste encontro</h3>'+charges.map(f=>'<p>'+esc(fmtMoney(f.amount))+' · '+esc(TherapyManagementRules.label(f))+'</p>').join('')+packs.map(p=>'<p>Consumo registrado no pacote '+esc(p.name)+'. A cobrança pertence à venda do pacote.</p>').join('')+(!charges.length&&!packs.length?'<p>'+esc(item.billingMode==='none'?'Encontro sem cobrança vinculada.':'Nenhuma cobrança ou consumo vinculado foi encontrado. Confira o histórico antes de criar um lançamento.')+'</p>':'')+'</section>';
 }
 function payment(id){
  if(!TherapyVault.isOpen()||window.therapyActionBusy)return;const item=db.sessions.find(s=>s.id===id);if(!item)return;
  const {charges,packs}=billingContext(item);
  if(charges.length===1&&!packs.length){if(router('financial')===false)return;el('therapy-dialog')?.remove();return TherapyFinance.detail(charges[0].id);}
  if(!charges.length&&packs.length===1){el('therapy-dialog')?.remove();return TherapyPackages.detail(packs[0].id,'charges');}
  TherapyVault.dialog('Cobrança vinculada ao encontro',billingHTML(item)+'<div class="care-next-actions">'+charges.map(f=>button(fmtMoney(f.amount)+' · '+TherapyManagementRules.label(f),`openFinancialModal('${f.id}')`)).join('')+packs.map(p=>button('Conferir pacote: '+p.name,`TherapyPackages.detail('${p.id}','charges')`)).join('')+button('Voltar ao registro',`TherapySessions.detail('${id}')`)+'</div>');
 }
 function agenda(id){
  if(!TherapyVault.isOpen()||window.therapyActionBusy)return;const item=db.sessions.find(s=>s.id===id),appointment=db.appointments.find(a=>a.id===item?.appointmentId&&a.patientId===item.patientId);if(!appointment)return therapyNotice('A marcação vinculada não está disponível.','error');
  if(router('schedule')===false)return;el('therapy-dialog')?.remove();TherapyAgenda.select(appointment.date);TherapyAgenda.openAppointment(appointment.id);
 }
 function scheduleSession(id){
  if(!TherapyVault.isOpen()||window.therapyActionBusy)return;const item=db.sessions.find(s=>s.id===id),patient=db.patients.find(p=>p.id===item?.patientId);if(!item||!patient||patient.archived)return;
  const appointment=db.appointments.find(a=>a.id===item.appointmentId&&a.patientId===item.patientId);el('therapy-dialog')?.remove();openAppointmentModal(null,item.patientId);
  if(appointment){el('appointment-time').value=appointment.time;el('appointment-duration-input').value=appointment.duration;el('therapy-appointment-fee').value=appointment.fee??db.settings.sessionFee??0;if([...el('appointment-type').options].some(option=>option.value===appointment.type))el('appointment-type').value=appointment.type;}
  el('appointment-form').insertAdjacentHTML('afterbegin','<p id="care-schedule-context" class="sessions-form-context" role="status">Paciente preenchido'+(appointment?' com horário, duração e valor da marcação anterior':'')+'. Escolha a data do próximo encontro e confira os dados antes de salvar. Nenhum agendamento foi criado ainda.</p>');el('appointment-date').focus();
 }
 function nextSteps(id){
  if(!TherapyVault.isOpen())return;const item=db.sessions.find(s=>s.id===id);if(!item)return;
  const p=db.patients.find(p=>p.id===item.patientId),plan=db.treatments.find(p=>p.id===item.evolution?.treatmentId);
  const modal=TherapyVault.dialog('Encontro registrado · próximos passos',`<p>${esc(p?.name||'Paciente')} · ${date(item.date)}</p><p>O registro foi salvo. Confira o financeiro ou prepare o próximo encontro sem procurar o paciente novamente.</p>${billingHTML(item)}<div class="care-next-actions">${button('Conferir cobrança',`TherapyCare.payment('${id}')`)}${p&&!p.archived?button('Agendar próximo encontro',`TherapyCare.scheduleSession('${id}')`):''}${item.appointmentId?button('Ver marcação na Agenda',`TherapyCare.agenda('${id}')`):''}${!p?.archived?button('Criar orientação dos combinados',`TherapyCare.fromSession('${id}','orientation')`)+button('Registrar encaminhamento',`TherapyCare.fromSession('${id}','referral')`)+button('Registrar avaliação',`TherapyCare.fromSession('${id}','assessment')`):''}${plan?button('Revisar plano e objetivos',`TherapyCare.plan('${plan.id}')`):''}${button('Conferir registro',`TherapySessions.detail('${id}')`)}${button('Voltar à rotina',"document.getElementById('therapy-dialog').remove()")}</div>`);
  modal.dataset.therapyRoutineNext='true';
 }
 function fromSession(id,type){const item=db.sessions.find(s=>s.id===id);if(!item||!TherapyVault.isOpen())return;const p=db.patients.find(p=>p.id===item.patientId);if(!p||p.archived)return therapyNotice('Reative o paciente antes de criar um registro.','error');el('therapy-dialog')?.remove();const template={patientId:item.patientId,sessionId:id,treatmentId:item.evolution?.treatmentId||''};if(type==='assessment')TherapyAssessmentForm.open(null,template);else TherapyOrientationForm.open(null,{...template,kind:type==='referral'?'referral':'orientation',content:type==='orientation'?item.evolution?.homework||'':''});}
 function reviewHTML(item){const cfg=TherapyAssessmentRules.meta(item.evaluation);if(cfg.status!=='confirmed'||!cfg.reviewDate)return '';const status=cfg.reviewStatus||'pending';return `<section class="care-context"><h3>Reavaliação</h3><p>${date(cfg.reviewDate)} · ${esc({pending:'A realizar',completed:'Realizada',dismissed:'Dispensada'}[status])}</p>${cfg.reviewResolution?'<p>'+esc(cfg.reviewResolution.note||'Resolução registrada pelo profissional.')+'</p>':''}${status==='pending'&&!item.archived&&!db.patients.find(p=>p.id===item.patientId)?.archived?button('Resolver ou reagendar',`TherapyCare.reviewForm('${item.id}')`):''}</section>`;}
 function reviewForm(id){if(!TherapyVault.isOpen())return;TherapyVault.dialog('Resolver reavaliação prevista',`<form onsubmit="resolveTherapyCareReview(event,'${id}')"><label>Decisão<select id="care-review-action" onchange="TherapyCare.reviewAction()"><option value="completed">Já realizada fora deste fluxo</option><option value="rescheduled">Reagendar</option><option value="dismissed">Dispensar reavaliação</option></select></label><label id="care-review-date-label" hidden>Nova data<input id="care-review-date" type="date"></label><label>Observação (opcional)<textarea id="care-review-note" maxlength="1000" rows="3"></textarea></label><div class="therapy-actions"><button type="submit">Salvar decisão</button>${button('Voltar',`TherapyAssessments.detail('${id}')`)}</div></form>`);}
 function reviewAction(){const required=el('care-review-action').value==='rescheduled';el('care-review-date-label').hidden=!required;el('care-review-date').required=required;}
 function reset(){assessmentOrigin='';orientationOrigin='';previousAssessment='';for(const id of ['care-session-summary','care-session-objectives'])el(id)?.replaceChildren();for(const id of ['care-session-plan','care-assessment-session','care-assessment-plan','care-orientation-session','care-orientation-plan'])el(id)?.replaceChildren();}
 return {billingHTML,payment,agenda,scheduleSession,init,sessionContext,sessionSelection,objectives,formLinks,formValue,originChanged,assessmentOpen,orientationOpen,orientationKind,sourceHTML,sessionHTML,nextSteps,fromSession,reviewHTML,reviewForm,reviewAction,reset,approachChanged,previousAssessment:()=>previousAssessment,schedule(id){el('therapy-dialog')?.remove();openAppointmentModal(null,id);},plan(id){el('therapy-dialog')?.remove();TherapyTreatments.detail(id,'objectives');}};
})();
async function resolveTherapyCareReview(event,id){event.preventDefault();db=TherapyCareRules.resolution(db,id,document.getElementById('care-review-action').value,document.getElementById('care-review-date').value,document.getElementById('care-review-note').value);await save();TherapyAssessments.detail(id);therapyNotice('Decisão de reavaliação salva.');}
