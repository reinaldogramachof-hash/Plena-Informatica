const TherapyCoverageUI=(()=>{
 const R=TherapyCoverageRules,el=id=>document.getElementById(id),esc=value=>sanitizeHTML(String(value??''));let sessionPrevious=null;
 function options(current='unspecified',previous=null){
  const entries=[['unspecified','Não informado'],['private','Particular'],['reimbursement','Particular com reembolso'],...R.read(db).plans.filter(p=>p.active).map(p=>['insurance:'+p.id,'Convênio · '+p.name])];
  if(previous){const value=R.key(previous),index=entries.findIndex(e=>e[0]===value),label=R.label({coverage:previous});if(index<0)entries.push([value,label+' · histórico preservado']);else if(entries[index][1]!==label)entries[index][1]=label+' · histórico preservado';}
  return entries.map(([value,label])=>`<option value="${esc(value)}" ${value===current?'selected':''}>${esc(label)}</option>`).join('');
 }
 function badge(item){const s=R.of(item);return `<span class="coverage-badge" style="--coverage-color:${s.color}"><i aria-hidden="true"></i>${esc(R.label(item))}</span>`;}
 function filterOptions(id,items){
  const select=el(id);if(!select)return;const selected=select.value,plans=new Map(R.read(db).plans.map(p=>['insurance:'+p.id,p.name+(p.active?'':' · inativo')]));
  for(const item of items){const s=R.of(item);if(s.kind==='insurance'&&!plans.has(R.key(s)))plans.set(R.key(s),s.name+' · histórico');}
  select.innerHTML='<option value="">Todas as origens</option><option value="private">Particular</option><option value="insurance">Todos os convênios</option><option value="reimbursement">Particular com reembolso</option><option value="unspecified">Não informado</option>'+[...plans].map(([value,name])=>`<option value="${esc(value)}">Convênio · ${esc(name)}</option>`).join('');
  select.value=[...select.options].some(o=>o.value===selected)?selected:'';
 }
 function init(){
  const patientSection=document.createElement('section');patientSection.className='crm-form-section';patientSection.innerHTML='<h3>Origem do atendimento</h3><label>Preferência para novas marcações<select id="patient-coverage"></select></label><p class="coverage-help">Particular, convênio direto ou particular com documentação para reembolso. Marcações anteriores preservam sua origem.</p>';
  el('patient-form').lastElementChild.before(patientSection);
  el('appointment-form').lastElementChild.insertAdjacentHTML('beforebegin','<label>Origem deste atendimento<select id="appointment-coverage"></select></label><p class="coverage-help">A origem e o valor ficam registrados nesta marcação. O tipo de sessão e a situação são independentes.</p>');
  el('appointment-patient').addEventListener('change',()=>appointment(null,el('appointment-patient').value));
  el('therapy-billing').insertAdjacentHTML('afterbegin','<label>Origem do atendimento<select id="session-coverage"></select></label>');
  el('session-patient').addEventListener('change',()=>session(null,null,el('session-patient').value));
  document.querySelector('.agenda-heading-actions').insertAdjacentHTML('beforeend','<button type="button" class="therapy-secondary" onclick="TherapyCoverageUI.configure()">Convênios e cores</button>');
  document.querySelector('.agenda-toolbar-filters').insertAdjacentHTML('beforeend','<label>Origem do atendimento<select id="agenda-coverage-filter" onchange="renderSchedule()"></select></label>');
  for(const selector of ['.agenda-dot:not([class*=is-])','.agenda-dot.is-completed'])el('agenda-legend').querySelector(selector)?.parentElement.remove();
  el('agenda-legend').insertAdjacentHTML('beforeend','<div id="coverage-legend" class="coverage-legend"></div>');
  document.querySelector('#view-financial .management-filters').insertAdjacentHTML('afterbegin','<label>Origem do atendimento<select id="finance-coverage-filter"></select></label>');
 }
 function fillPatient(patient){const pref=R.preference(patient?.coverage);const previous=pref.kind==='insurance'?R.read(db).plans.find(p=>p.id===pref.planId):null;el('patient-coverage').innerHTML=options(R.key(pref),previous?{...pref,name:previous.name,color:previous.color}:null);}
 function patientValue(old){const p=R.choice(el('patient-coverage').value);R.snapshot(db,p,old?.coverage?.kind===p.kind&&old.coverage.planId===p.planId&&p.kind==='insurance'?{...p,...R.read(db).plans.find(plan=>plan.id===p.planId)}:null);return p;}
 function defaultPreference(patient){const pref=R.preference(patient?.coverage);return pref.kind==='insurance'&&!R.read(db).plans.some(p=>p.id===pref.planId&&p.active)?R.preference():pref;}
 function appointment(id,patientId){const old=db.appointments.find(a=>a.id===id),patient=db.patients.find(p=>p.id===(old?.patientId||patientId)),pref=old?R.of(old):defaultPreference(patient),current=old?pref:R.snapshot(db,pref);
  el('appointment-coverage').innerHTML=options(R.key(current),old?.coverage);el('appointment-coverage').dataset.owner=id||'';
 }
 function appointmentValue(id){const old=db.appointments.find(a=>a.id===id);return R.snapshot(db,R.choice(el('appointment-coverage').value),old?.coverage);}
 function session(source,appointment,patientId){
  sessionPrevious=source?.coverage||appointment?.coverage||null;
  const current=source||appointment?R.of(source?.coverage?source:appointment):R.snapshot(db,defaultPreference(db.patients.find(p=>p.id===patientId)));
  el('session-coverage').innerHTML=options(R.key(current),sessionPrevious);el('session-coverage').disabled=!!appointment||!!source?.sessionId||!!source?.billingMode;
 }
 function sessionValue(){return R.snapshot(db,R.choice(el('session-coverage').value),sessionPrevious);}
 function renderAgenda(items){
  filterOptions('agenda-coverage-filter',db.appointments);
  const legend=new Map();for(const item of items){const s=R.of(item);legend.set(R.key(s)+'|'+s.name+'|'+s.color,item);}
  el('coverage-legend').innerHTML='<h3>Origem do atendimento</h3><p class="coverage-help">A cor identifica a origem; a situação aparece por escrito. Cores e nomes anteriores são preservados.</p>'+[...legend.values()].map(badge).join('');
 }
 let query='',status='',editing='';
 function configure(id=''){
  if(!TherapySettings.open('coverage'))return false;
  if(editing===id)return true;
  if(!TherapySettings.replace())return false;
  renderSettings(id);return true;
 }
 function renderSettings(id=''){
  editing=id;const cfg=R.read(db),plan=cfg.plans.find(p=>p.id===id);
  TherapySettings.mount('coverage','Convênios',`<p class="system-help">Cadastre as origens dos novos atendimentos. Renomear, recolorir ou inativar preserva o histórico e os valores anteriores.</p>
  <form id="coverage-colors-form" onsubmit="saveTherapyCoverageColors(event)"><details><summary>Cores das origens</summary><div class="therapy-form-grid"><label>Particular<input id="coverage-private-color" type="color" value="${cfg.privateColor}"></label><label>Particular com reembolso<input id="coverage-reimbursement-color" type="color" value="${cfg.reimbursementColor}"></label></div><div class="therapy-actions"><button type="submit">Salvar cores</button></div></details></form>
  <form id="coverage-plan-form" class="system-subsection" onsubmit="saveTherapyCoveragePlan(event)"><h4>${plan?'Editar convênio':'Novo convênio'}</h4><input id="coverage-plan-id" type="hidden" value="${esc(plan?.id||'')}"><div class="therapy-form-grid"><label>Nome do convênio<input id="coverage-plan-name" maxlength="80" required value="${esc(plan?.name||'')}"></label><label>Cor<input id="coverage-plan-color" type="color" value="${plan?.color||'#0F766E'}"></label></div><label class="coverage-check"><input id="coverage-plan-active" type="checkbox" ${plan?.active!==false?'checked':''}>Disponível para novas marcações</label><div class="therapy-actions"><button type="submit">Salvar convênio</button>${plan?'<button type="button" class="therapy-secondary" onclick="TherapyCoverageUI.configure()">Novo convênio</button>':''}</div></form>
  <div class="settings-coverage-list"><h4>Convênios cadastrados</h4><div class="therapy-form-grid"><label>Buscar convênio<input id="coverage-search" type="search" maxlength="80" value="${esc(query)}" oninput="TherapyCoverageUI.list()"></label><label>Situação<select id="coverage-status" onchange="TherapyCoverageUI.list()"><option value="">Todos</option><option value="active" ${status==='active'?'selected':''}>Ativos</option><option value="inactive" ${status==='inactive'?'selected':''}>Inativos</option></select></label></div><p id="coverage-count" class="coverage-help" role="status"></p><div id="coverage-plan-list" class="coverage-plan-list"></div></div><p class="coverage-help">Convênio direto identifica a origem do atendimento. Particular com reembolso continua sendo atendimento particular. O cadastro não envia guias nem solicita pagamentos.</p>`);list();
 }
 function list(){
  query=el('coverage-search').value;status=el('coverage-status').value;
  const term=query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),plans=R.read(db).plans.filter(p=>(!status||(status==='active')===p.active)&&p.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(term));
  el('coverage-count').textContent=plans.length+' convênio(s) encontrado(s).';
  el('coverage-plan-list').innerHTML=plans.map(p=>`<div>${badge({coverage:{kind:'insurance',planId:p.id,name:p.name,color:p.color}})}<span>${p.active?'Ativo':'Inativo'}</span><button type="button" class="therapy-secondary" onclick="TherapyCoverageUI.configure('${p.id}')">Editar</button></div>`).join('')||'<p>Nenhum convênio encontrado.</p>';
 }
 function planSaved(){editing='';const form=el('coverage-plan-form');form.reset();el('coverage-plan-id').value='';el('coverage-plan-name').value='';el('coverage-plan-color').value='#0F766E';el('coverage-plan-active').checked=true;form.querySelector('h4').textContent='Novo convênio';form.querySelector('[onclick]')?.remove();TherapySettings.saved('coverage-plan-form');list();}
 function reset(){sessionPrevious=null;query='';status='';editing='';el('coverage-legend')?.replaceChildren();for(const id of ['patient-coverage','appointment-coverage','session-coverage','agenda-coverage-filter','finance-coverage-filter'])el(id)?.replaceChildren();}
 return {init,badge,options,filterOptions,fillPatient,patientValue,appointment,appointmentValue,session,sessionValue,renderAgenda,configure,renderSettings,list,planSaved,reset};
})();
async function saveTherapyCoveragePlan(event){event.preventDefault();const get=id=>document.getElementById(id),id=get('coverage-plan-id').value||getID();db=TherapyCoverageRules.savePlan(db,{id,name:get('coverage-plan-name').value,color:get('coverage-plan-color').value,active:get('coverage-plan-active').checked});await save();TherapyCoverageUI.planSaved();renderSchedule();therapyNotice('Convênio salvo. Histórico preservado.');}
async function saveTherapyCoverageColors(event){event.preventDefault();const cfg=TherapyCoverageRules.read(db);db.settings.coverage=TherapyCoverageRules.settings({...cfg,privateColor:document.getElementById('coverage-private-color').value,reimbursementColor:document.getElementById('coverage-reimbursement-color').value});await save();TherapySettings.saved('coverage-colors-form');renderSchedule();therapyNotice('Cores salvas para novas marcações.');}
