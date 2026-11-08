const TherapySessionForm=(()=>{
 const R=TherapySessionRules,esc=value=>sanitizeHTML(String(value??''));
 const state={open:false,clean:''};
 const previousOpen=window.openSessionNotesModal,previousClose=window.closeModal;
 const element=id=>document.getElementById(id);
 function init(){
  const form=element('session-form');if(element('therapy-session-draft'))return;
  const grid=form.querySelector(':scope>.grid'),section=document.createElement('section');section.className='sessions-form-section';section.innerHTML='<h4>Registro do encontro</h4><label>Foco do encontro (opcional)<input id="session-focus" maxlength="5000"></label>';
  section.appendChild(element('session-content').parentElement);
  const planning=document.createElement('details');planning.open=false;planning.className='sessions-form-section';planning.innerHTML='<summary>Intervenções e continuidade</summary>';
  for(const id of['session-interventions','session-next-plan'])planning.appendChild(element(id).parentElement);
  planning.insertAdjacentHTML('beforeend','<label>Objetivos trabalhados (opcional)<textarea id="session-objectives" rows="2" maxlength="5000"></textarea></label><label>Combinados / atividades (opcional)<textarea id="session-homework" rows="2" maxlength="5000"></textarea></label>');
  const observations=document.createElement('details');observations.className='sessions-form-section';observations.innerHTML='<summary>Observações complementares do profissional</summary><div class="therapy-form-grid"></div>';
  for(const id of['session-mood','session-adherence'])observations.lastElementChild.appendChild(element(id).parentElement);
  grid.insertAdjacentHTML('beforeend',`<label>Modalidade<select id="session-modality">${Object.entries(R.modalities).map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></label><label>Duração registrada (min, opcional)<input id="session-record-duration" type="number" min="10" max="240"></label>`);
  grid.after(section,planning,observations);
  const billing=element('therapy-billing'),billingSection=document.createElement('details');billingSection.className='sessions-form-section';billingSection.open=true;billingSection.innerHTML='<summary>Cobrança deste atendimento</summary>';billing.before(billingSection);billingSection.appendChild(billing);billingSection.insertAdjacentHTML('beforeend','<p id="sessions-billing-summary" class="sessions-form-context" role="status"></p>');form.addEventListener('change',billingSummary);billing.querySelector('h3')?.remove();
  form.insertAdjacentHTML('afterbegin','<input id="therapy-session-draft" type="hidden"><p id="sessions-form-context" class="sessions-form-context" role="status"></p>');
  const actions=form.lastElementChild;actions.classList.add('sessions-form-actions');actions.insertAdjacentHTML('beforebegin','<label id="sessions-revision-field">Observação da alteração (opcional)<textarea id="session-revision-reason" rows="2" maxlength="1000"></textarea></label>');
  actions.querySelector('[type=submit]').id='sessions-finalize';actions.insertAdjacentHTML('afterbegin','<button type="button" id="sessions-save-draft" class="therapy-secondary" onclick="saveTherapySessionDraft()">Salvar rascunho</button>');actions.insertAdjacentHTML('beforeend','<button type="button" class="therapy-secondary" onclick="closeModal(\'sessionNotesModal\')">Voltar</button>');
  element('btn-delete-session').textContent='Arquivar anotação';
  for(const id of['session-content','session-interventions','session-next-plan']){element(id).maxLength=100000;element(id).parentElement.className='sessions-note-field';}
  element('session-date').addEventListener('change',()=>populateTherapyPackageChoices());
  element('sessionNotesModal').querySelector(':scope>div').classList.add('sessions-editor');
  TherapyCare.init();
  section.appendChild(element('session-next-plan').parentElement);
  section.appendChild(element('session-homework').parentElement);
  planning.appendChild(element('session-focus').parentElement);
  for(const id of ['session-modality','session-record-duration'])observations.lastElementChild.appendChild(element(id).parentElement);
  element('session-objectives').parentElement.firstChild.textContent='Complemento sobre os objetivos (opcional)';
 }
 function billingSummary(){
  const old=!!element('session-id').value,appointment=db.appointments.find(a=>a.id===element('therapy-session-appointment').value),mode=element('therapy-billing-mode').value;
  element('sessions-billing-summary').textContent=old?'A revisão preserva a cobrança e o consumo de pacote anteriores.':appointment?.status==='completed'?'A recuperação desta anotação não gera nova cobrança nem consumo de pacote.':mode==='package'?'Ao confirmar, será consumida uma sessão do pacote selecionado. Salvar rascunho não consome saldo.':mode==='none'?'Ao confirmar, o registro ficará sem cobrança. Salvar rascunho não conclui o encontro.':'Ao confirmar, será criada uma cobrança avulsa '+(element('therapy-session-paid').checked?'já recebida.':'pendente de recebimento.')+' Salvar rascunho não aplica essa cobrança.';
 }
 function values(){
  return {record:{id:element('session-id').value,patientId:element('session-patient').value,coverage:TherapyCoverageUI.sessionValue(),date:element('session-date').value,appointmentId:element('therapy-session-appointment').value||null,content:element('session-content').value,interventions:element('session-interventions').value,nextPlan:element('session-next-plan').value,mood:element('session-mood').value,adherence:element('session-adherence').value,evolution:{...TherapyCare.sessionSelection(),modality:element('session-modality').value,duration:element('session-record-duration').value===''?null:Number(element('session-record-duration').value),focus:element('session-focus').value,objectives:element('session-objectives').value,homework:element('session-homework').value},revisionReason:element('session-revision-reason').value},billing:{mode:element('therapy-billing-mode').value,amount:Number(element('therapy-session-fee').value),paid:element('therapy-session-paid').checked,packageId:element('therapy-session-package').value||null},draftId:element('therapy-session-draft').value||null};
 }
 function clean(){state.clean=JSON.stringify(values());}
 function dirty(){return state.open&&!element('sessionNotesModal').classList.contains('hidden')&&state.clean!==JSON.stringify(values());}
 function open(id=null,appointmentId=null,draftId=null){
  if(!TherapyVault.isOpen())return;
  const appointment=db.appointments.find(a=>a.id===appointmentId),existing=id?db.sessions.find(s=>s.id===id):db.sessions.find(s=>appointmentId&&s.appointmentId===appointmentId);
  if(id&&!existing)return therapyNotice('Registro não encontrado.','error');
  if(existing?.archived)return TherapySessions.detail(existing.id);
  const pending=draftId?(db.sessionDrafts||[]).find(d=>d.id===draftId):existing?(db.sessionDrafts||[]).find(d=>d.sessionId===existing.id):(db.sessionDrafts||[]).find(d=>appointmentId&&d.appointmentId===appointmentId&&!d.sessionId);
  previousOpen(existing?.id||null,appointmentId||existing?.appointmentId||null);
  const source=pending||existing,evo=R.evolution(source?.evolution),patientId=source?.patientId||appointment?.patientId;
  if(patientId){const select=element('session-patient');if(![...select.options].some(option=>option.value===patientId)){const p=db.patients.find(p=>p.id===patientId);if(p)select.add(new Option(p.name+(p.archived?' (arquivado)':''),p.id));}select.value=patientId;}
  if(!source&&!appointment)element('session-date').value=TherapyData.dateKey();
  if(existing?.date&&TherapyAgendaRules.validDate(existing.date.slice(0,10)))element('session-date').value=existing.date.slice(0,10);
  if(pending){element('session-date').value=pending.date;for(const field of['content','interventions','nextPlan','mood','adherence']){const input=element({content:'session-content',interventions:'session-interventions',nextPlan:'session-next-plan',mood:'session-mood',adherence:'session-adherence'}[field]);if(input.tagName==='SELECT'&&pending[field]&&![...input.options].some(option=>option.value===pending[field]))input.add(new Option('Registro anterior: '+pending[field],pending[field]));input.value=pending[field]||'';}element('therapy-session-appointment').value=pending.appointmentId||'';}
  for(const field of['mood','adherence'])if(existing?.[field]&&!pending){const select=element('session-'+field);if(![...select.options].some(option=>option.value===existing[field]))select.add(new Option('Registro anterior: '+existing[field],existing[field]));select.value=existing[field];}
  element('session-modality').value=evo.modality;element('session-record-duration').value=evo.duration??(!source?(appointment?.duration||db.settings.sessionDuration||50):'');for(const field of['focus','objectives','homework'])element('session-'+field).value=evo[field];
  element('therapy-session-draft').value=pending?.id||'';element('session-revision-reason').value=pending?.revisionReason||'';element('sessions-revision-field').hidden=!existing;
  if(pending&&!existing&&appointment?.status!=='completed'){element('therapy-billing-mode').value=pending.billing.mode;element('therapy-session-fee').value=pending.billing.amount;element('therapy-session-paid').checked=pending.billing.paid;populateTherapyPackageChoices();element('therapy-session-package').value=pending.billing.packageId||'';syncTherapyBilling();}
  const recovery=appointment?.status==='completed'&&!existing;
  element('session-patient').disabled=!!existing||!!appointment||!!pending;element('session-date').disabled=!!existing||!!appointment;
  element('sessions-finalize').textContent=existing?'Salvar alterações':recovery?'Salvar anotação recuperada':appointment?'Concluir atendimento':'Salvar anotação';
  element('session-modal-title').textContent=pending?(existing?'Rascunho de revisão':'Rascunho do atendimento'):existing?'Editar registro de sessão':recovery?'Recuperar anotação':'Registrar sessão';
  element('sessions-form-context').textContent=pending?'Rascunho protegido carregado. O registro confirmado e a cobrança ainda não foram alterados.':existing?'Paciente, data, atendimento e cobrança são preservados. O conteúdo anterior fica no histórico de alterações.':recovery?'Este atendimento já foi concluído. A anotação será recuperada sem nova cobrança ou consumo de pacote.':appointment?'Vinculado à Agenda. Concluir confirma o registro e aplica a cobrança escolhida uma única vez.':'Anotação avulsa, sem horário da Agenda vinculado. Confira o paciente, a data e a cobrança antes de salvar.';
  TherapyCoverageUI.session(source,appointment,element('session-patient').value);TherapyCare.sessionContext(false,source);
  state.open=true;billingSummary();clean();
 }
 async function saveDraft(){
  const value=values(),draftId=value.draftId||getID(),source={...value.record,id:draftId,sessionId:value.record.id||null,billing:value.billing};
  db=R.saveDraft(db,source);await save();element('therapy-session-draft').value=draftId;element('session-patient').disabled=true;element('sessions-form-context').textContent='Rascunho salvo no cofre. O atendimento e a cobrança permanecem como estavam.';clean();TherapySessions.refresh();therapyNotice('Rascunho protegido salvo.');
 }
 async function finish(event){
  event.preventDefault();const value=values(),old=db.sessions.find(s=>s.id===value.record.id),record={...value.record,id:value.record.id||getID(),createdAt:old?.createdAt||new Date().toISOString()};
  db=R.finish(db,record,value.billing,value.draftId);await save();element('session-id').value=record.id;element('therapy-session-draft').value='';clean();state.open=false;closeModal('sessionNotesModal');renderSessions();TherapyCare.nextSteps(record.id);therapyNotice(old?'Alterações salvas. Histórico e cobrança preservados.':'Registro do atendimento salvo.');
 }
 async function archive(){const id=element('session-id').value;if(!id||!confirm('Arquivar a anotação? Atendimento, histórico de alterações, pacote e cobrança serão preservados.'))return;db=R.archive(db,id,true);await save();clean();state.open=false;closeModal('sessionNotesModal');renderSessions();therapyNotice('Anotação arquivada.');}
 function resume(id){
  const pending=(db.sessionDrafts||[]).find(d=>d.id===id);if(!pending||!TherapyVault.isOpen())return;
  const registered=pending.appointmentId&&db.sessions.find(s=>s.appointmentId===pending.appointmentId);
  if(!pending.sessionId&&registered){TherapyVault.dialog('Rascunho anterior preservado',`<p>Este atendimento já tem um registro confirmado. O rascunho não será aplicado por cima dele.</p><p>${esc(pending.content)}</p><div class="therapy-actions"><button type="button" onclick="TherapySessions.detail('${registered.id}')">Conferir registro confirmado</button><button type="button" onclick="this.closest('#therapy-dialog').remove()">Fechar</button></div>`);return;}
  if(pending.sessionId&&!db.sessions.some(s=>s.id===pending.sessionId))return therapyNotice('O registro original não está disponível. O rascunho continua preservado.','error');
  open(pending.sessionId||null,pending.appointmentId||null,pending.id);
 }
 window.closeModal=function(id){if(id==='sessionNotesModal'&&state.open){if(window.therapyActionBusy)return therapyNotice('Aguarde a gravação atual.');if(dirty()&&!confirm('Há alterações não salvas. Fechar sem salvar?'))return;state.open=false;}return previousClose(id);};
 window.addEventListener('beforeunload',event=>{if(dirty()){event.preventDefault();event.returnValue='';}});
 return {init,open,resume,values,dirty,saveDraft,finish,archive,reset(){state.open=false;state.clean='';element('sessions-form-context')?.replaceChildren();}};
})();
window.openSessionNotesModal=(id=null,appointmentId=null)=>TherapySessionForm.open(id,appointmentId);
window.submitSessionNotes=event=>TherapySessionForm.finish(event);
window.deleteSessionNotes=()=>TherapySessionForm.archive();
async function saveTherapySessionDraft(){return TherapySessionForm.saveDraft();}
async function discardTherapySessionDraft(id){if(!confirm('Descartar este rascunho? Os registros confirmados, atendimentos e cobranças serão preservados.'))return;db.sessionDrafts=(db.sessionDrafts||[]).filter(d=>d.id!==id);await save();TherapySessions.refresh();therapyNotice('Rascunho descartado.');}
window.populateTherapyPackageChoices=function(){const select=document.getElementById('therapy-session-package'),patientId=document.getElementById('session-patient').value,date=document.getElementById('session-date').value||TherapyData.dateKey(),previous=select.value,session=db.sessions.find(s=>s.id===document.getElementById('session-id').value);select.innerHTML='<option value="">Selecione o pacote</option>'+db.packages.filter(p=>p.patientId===patientId&&(session?.packageId===p.id||TherapyFlow.available(db,p)>0&&(!p.expiresAt||p.expiresAt>=date)&&(!p.date||p.date<=date))).map(p=>`<option value="${p.id}">${sanitizeHTML(p.name)} · ${TherapyFlow.available(db,p)} sessões${session?.packageId===p.id?' · Vinculado ao registro':db.financial.some(f=>f.packageId===p.id&&!f.cancelledAt&&f.paymentStatus==='pending')?' · cobrança pendente':''}</option>`).join('');select.value=session?.packageId||previous||'';};
