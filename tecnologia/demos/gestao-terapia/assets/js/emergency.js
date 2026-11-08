/* Registros do profissional; decisões e contatos permanecem manuais. */
const TherapyEmergency=(()=>{
 const el=id=>document.getElementById(id),esc=value=>sanitizeHTML(String(value??''));
 const types=TherapyData.emergencyTypes,risks={baixo:'Baixo',medio:'Médio',alto:'Alto'};
 let clean='',limit=10;
 const fields=['emergency-patient','emergency-type','emergency-intervention','emergency-referrals','emergency-date','emergency-duration'];
 function signature(){return JSON.stringify(fields.map(id=>el(id)?.value||'').concat(document.querySelector('input[name="risk-level"]:checked')?.value||''));}
 function dirty(){return !!clean&&signature()!==clean;}
 function reset(){
  el('emergency-form')?.reset();if(el('emergency-date'))el('emergency-date').value=TherapyData.dateTimeLocal();
  for(const id of ['therapy-emergency-search','therapy-emergency-risk'])if(el(id))el(id).value='';
  el('therapy-emergency-references')?.replaceChildren();el('recent-emergencies')?.replaceChildren();limit=10;clean=signature();
 }
 function beforeNavigate(view){
  if(view==='emergency'||el('view-emergency').classList.contains('hide')||!TherapyVault.isOpen()||!dirty())return true;
  if(window.therapyActionBusy){therapyNotice('Aguarde a gravação atual.');return false;}
  if(!confirm('Há alterações não salvas na emergência. Sair e descartar essas alterações?'))return false;
  reset();return true;
 }
 function contact(label,value,phone=false){
  const text=String(value||'').trim();if(!text)return '';
  const number=text.replace(/[^\d+]/g,''),digits=number.replace(/\D/g,'');
  const action=phone&&/^[+\d\s().-]+$/.test(text)&&/^\+?\d+$/.test(number)&&digits.length>=7&&digits.length<=15;
  return `<p><strong>${esc(label)}:</strong> ${esc(text)}${action?` <button type="button" class="therapy-secondary" data-emergency-phone="${esc(number)}">Ligar para este contato</button>`:''}</p>`;
 }
 function references(){
  if(!TherapyVault.isOpen())return;
  const patient=db.patients.find(p=>p.id===el('emergency-patient').value),s=db.settings,host=el('therapy-emergency-references');
  host.innerHTML='<h3>Referências cadastradas</h3>'+contact('Consultório',s.clinicPhone,true)+contact('Contato de referência',s.emergencyContact,true)+contact('Serviço ou hospital',s.hospitalReference)+(patient?contact('Contato do paciente',patient.emergencyName)+contact('Telefone do contato',patient.emergencyPhone,true):'')+'<p>Confira os dados antes de usar. O sistema não aciona contatos automaticamente.</p>';
  host.querySelectorAll('[data-emergency-phone]').forEach(button=>button.onclick=()=>callEmergency(button.dataset.emergencyPhone));
 }
 function safeRecord(item){try{TherapyData.validateEmergency(item);return db.patients.some(patient=>patient.id===item.patientId);}catch{return false;}}
 function recent(){
  if(!TherapyVault.isOpen())return;
  const query=el('therapy-emergency-search').value.trim().toLocaleLowerCase('pt-BR'),risk=el('therapy-emergency-risk').value;
  const rows=db.emergencies.filter(item=>(!risk||item.riskLevel===risk)&&(!query||[getPatientName(item.patientId),types[item.type]||item.type,item.date].join(' ').toLocaleLowerCase('pt-BR').includes(query))).slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  el('recent-emergencies').innerHTML=`<p role="status">${rows.length} registro(s) · mostrando ${Math.min(limit,rows.length)}</p>`+rows.slice(0,limit).map(item=>`<article class="therapy-panel"><h4>${esc(getPatientName(item.patientId))}</h4><p>${esc(types[item.type]||item.type||'Tipo não informado')} · ${esc(risks[item.riskLevel]||'Risco não informado')}</p><p>${esc(String(item.intervention||'Intervenção não informada').slice(0,100))}</p><p>${esc(item.date?String(item.date).replace('T',' '):'Data não informada')}${Number.isFinite(item.duration)?' · '+esc(item.duration)+' min':''}</p>${safeRecord(item)?'':'<p>Registro antigo incompleto: confira os dados originais.</p>'}<button type="button" class="therapy-secondary" onclick="TherapyEmergency.detail('${item.id}')">Conferir registro completo</button></article>`).join('')+(rows.length>limit?'<button type="button" class="therapy-secondary" onclick="TherapyEmergency.more()">Carregar mais registros</button>':'');
 }
 function render(){
  if(!TherapyVault.isOpen())return;
  const selected=el('emergency-patient').value;
  el('emergency-patient').innerHTML='<option value="">Selecione um paciente</option>'+db.patients.filter(p=>!p.archived).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('');
  if(db.patients.some(p=>p.id===selected&&!p.archived))el('emergency-patient').value=selected;
  references();recent();
 }
 function detail(id){
  if(!TherapyVault.isOpen())return therapyNotice('Abra os registros antes de continuar.','error');
  const item=db.emergencies.find(e=>e.id===id);if(!item)return;
  const part=(label,value)=>`<h3>${esc(label)}</h3><p style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(value||'Não informado')}</p>`;
  TherapyVault.dialog('Registro de emergência',part('Paciente',getPatientName(item.patientId))+part('Tipo',types[item.type]||item.type)+part('Risco informado pelo profissional',risks[item.riskLevel]||item.riskLevel)+part('Data e hora',item.date)+part('Duração (minutos)',item.duration===0?'0':item.duration)+part('Intervenção realizada',item.intervention)+part('Encaminhamentos',item.referrals)+(safeRecord(item)?'':'<p>Registro antigo incompleto preservado. Confira a documentação original.</p>')+'<button type="button" onclick="document.getElementById(\'therapy-dialog\').remove()">Fechar</button>');
 }
 async function submit(event){
  event.preventDefault();const patientId=el('emergency-patient').value;
  if(!db.patients.some(p=>p.id===patientId&&!p.archived))throw new Error('Selecione um paciente ativo.');
  const item=TherapyData.validateEmergency({id:getID(),patientId,type:el('emergency-type').value,riskLevel:document.querySelector('input[name="risk-level"]:checked')?.value,intervention:el('emergency-intervention').value.trim(),referrals:el('emergency-referrals').value.trim(),date:el('emergency-date').value,duration:el('emergency-duration').value===''?0:Number(el('emergency-duration').value),createdAt:new Date().toISOString()});
  db.emergencies.push(item);await save();reset();render();therapyNotice('Emergência registrada.');
 }
 function init(){
  const duration=el('emergency-duration');duration.min='0';duration.max='1440';duration.step='1';
  for(const id of ['emergency-intervention','emergency-referrals'])el(id).maxLength=20000;
  el('recent-emergencies').insertAdjacentHTML('beforebegin','<label>Buscar no histórico<input id="therapy-emergency-search" type="search" placeholder="Paciente, tipo ou data"></label><label>Risco informado<select id="therapy-emergency-risk"><option value="">Todos</option><option value="baixo">Baixo</option><option value="medio">Médio</option><option value="alto">Alto</option></select></label>');
  const host=document.createElement('section');host.id='therapy-emergency-references';host.className='therapy-panel';el('recent-emergencies').parentElement.before(host);
  el('therapy-emergency-search').oninput=()=>{limit=10;recent();};el('therapy-emergency-risk').onchange=()=>{limit=10;recent();};el('emergency-patient').addEventListener('change',references);reset();
 }
 window.submitEmergency=submit;window.renderEmergency=render;window.renderRecentEmergencies=recent;
 const previousRouter=window.router;
 window.router=function(view){if(!beforeNavigate(view))return false;return previousRouter(view);};
 window.addEventListener('beforeunload',event=>{if(TherapyVault.isOpen()&&dirty()){event.preventDefault();event.returnValue='';}});
 document.addEventListener('therapy-vault-locked',reset);document.addEventListener('DOMContentLoaded',init);
 return {reset,render,recent,detail,dirty,more(){limit+=10;recent();}};
})();
