const TherapyPatients=(()=>{
 const R=TherapyPatientRules,esc=value=>sanitizeHTML(String(value??''));
 const tabs={overview:'Resumo',details:'Dados cadastrais',agenda:'Agenda',sessions:'Atendimentos',treatments:'Planos terapêuticos',assessments:'Avaliações',orientations:'Orientações',documents:'Documentos',financial:'Financeiro e pacotes',relationship:'Relacionamento',timeline:'Linha do tempo'};
 const state={id:null,tab:'overview',limit:40};
 const current=()=>db.patients.find(patient=>patient.id===state.id);
 const when=value=>value&&TherapyAgendaRules.validDate(value.slice(0,10))?fmtDate(value.slice(0,10)):'Data não informada';
 const empty=message=>`<p class="crm-empty">${esc(message)}</p>`;
 const button=(label,action,extra='')=>`<button type="button" class="therapy-secondary" ${extra} onclick="${action}">${label}</button>`;
 const badge=(label,tone='')=>`<span class="crm-badge ${tone}">${esc(label)}</span>`;
 const risk=patient=>['risco','atenção'].includes(patient.risk)?badge('Sinalização: '+(patient.risk==='risco'?'Risco':'Atenção'),patient.risk==='risco'?'is-danger':'is-warning'):'';
 const info=(label,value)=>`<div><dt>${esc(label)}</dt><dd>${esc(value||'Não informado')}</dd></div>`;
 function options(values,first='Todas as etapas'){return `<option value="all">${first}</option>`+Object.entries(values).map(([value,label])=>`<option value="${value}">${label}</option>`).join('');}
 function init(){document.getElementById('crm-stage-filter').innerHTML=options(R.stages);TherapyPatientForms.init();}
 function render(){
  if(!TherapyVault.isOpen())return;
  const profile=document.getElementById('crm-profile'),directory=document.getElementById('crm-directory'),patient=current();
  if(state.id&&!patient)state.id=null;
  directory.hidden=!!state.id;profile.hidden=!state.id;
  if(patient&&state.id){renderProfile(patient);return;}
  const filters={search:document.getElementById('search-patients').value,archived:document.getElementById('therapy-show-archived').checked,alerts:document.getElementById('therapy-show-alerts').checked,stage:document.getElementById('crm-stage-filter').value,focus:document.getElementById('crm-focus-filter').value,sort:document.getElementById('crm-sort').value};
  const items=R.filter(db,filters),active=db.patients.filter(p=>!p.archived).map(p=>R.summary(db,p));
  document.getElementById('crm-metrics').innerHTML=[['Cadastros ativos',active.length,'all','Pacientes não arquivados'],['Sem próximo horário',active.filter(p=>!p.next).length,'no_next','Ativos sem sessão futura ou em andamento'],['Retornos em atraso',active.filter(p=>p.overdue).length,'overdue','Pacientes com pendência vencida'],['Cadastros sinalizados',db.patients.filter(p=>!p.archived&&['risco','atenção'].includes(p.risk)).length,'alerts','Sinalizações registradas pelo profissional']].map(([label,count,filter,description])=>`<button type="button" class="crm-metric" onclick="TherapyPatients.focus('${filter}')"><span>${label}</span><strong>${count}</strong><small>${description}</small></button>`).join('');
  document.getElementById('crm-result-count').textContent=items.length+' de '+db.patients.length+' cadastros · etapas definidas pelo profissional';
  document.getElementById('patients-list').innerHTML=items.map(item=>{
   const p=item.patient,cfg=item.cfg;
   return `<div class="crm-patient-row"><div class="crm-patient-identity"><span class="crm-avatar" aria-hidden="true">${esc(p.name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join(''))}</span><div><button type="button" class="crm-name" onclick="TherapyPatients.open('${p.id}')">${esc(cfg.preferredName||p.name)}</button>${cfg.preferredName?`<small>${esc(p.name)}</small>`:''}<small>${esc(p.phone||p.email||'Contato não informado')}</small><div class="crm-tags">${cfg.tags.map(tag=>badge(tag)).join('')}</div></div></div><div class="crm-patient-state">${badge(R.stages[cfg.stage])}${p.archived?badge('Arquivado'):''}${risk(p)}</div><div class="crm-patient-next"><span>${item.next?when(item.next.date)+' · '+esc(item.next.time):'Sem próximo horário'}</span><small>${item.overdue?item.overdue+' pendência(s) em atraso':item.tasks.length?item.tasks.length+' pendência(s) aberta(s)':'Sem pendências abertas'}</small></div><div class="crm-row-actions">${button('Abrir ficha',`TherapyPatients.open('${p.id}')`)}${!p.archived?button('Agendar',`TherapyPatients.schedule('${p.id}')`):''}</div></div>`;
  }).join('')||`<div class="crm-empty"><h3>${db.patients.length?'Nenhum cadastro corresponde aos filtros':'Nenhum paciente cadastrado'}</h3><p>${db.patients.length?'Ajuste a busca ou limpe os filtros.':'Cadastre o primeiro paciente para iniciar o acompanhamento.'}</p>${button(db.patients.length?'Limpar filtros':'Novo paciente',db.patients.length?'TherapyPatients.clearFilters()':'openPatientModal()')}</div>`;
 }
 function renderProfile(patient){
  const s=R.summary(db,patient),cfg=s.cfg;
  document.getElementById('crm-profile-heading').innerHTML=`<div class="crm-profile-title"><span class="crm-avatar" aria-hidden="true">${esc(patient.name[0])}</span><div><h2 id="crm-patient-name" tabindex="-1">${esc(cfg.preferredName||patient.name)}</h2><p>${cfg.preferredName?esc(patient.name)+' · ':''}${esc(patient.phone||patient.email||'Contato não informado')}</p><div class="crm-tags">${badge(R.stages[cfg.stage])}${patient.archived?badge('Arquivado'):''}${risk(patient)}${cfg.tags.map(tag=>badge(tag)).join('')}</div></div></div><div class="crm-profile-actions">${button('Gerar documento',`TherapyDocuments.new('${patient.id}')`)}${button('Editar cadastro',`openPatientModal('${patient.id}')`)}${patient.archived?button('Reativar cadastro',`reactivateTherapyPatient('${patient.id}')`):button('Nova sessão',`TherapyPatients.schedule('${patient.id}')`)}</div>`;
  document.getElementById('crm-tabs').innerHTML=Object.entries(tabs).map(([id,label])=>`<button type="button" role="tab" id="crm-tab-${id}" aria-controls="crm-panel" aria-selected="${state.tab===id}" tabindex="${state.tab===id?0:-1}" onclick="TherapyPatients.tab('${id}')">${label}</button>`).join('');
  const panel=document.getElementById('crm-panel');panel.setAttribute('aria-labelledby','crm-tab-'+state.tab);
  panel.innerHTML=(patient.archived?'<p class="crm-notice">Cadastro arquivado. Histórico preservado. Reative para iniciar novos acompanhamentos.</p>':'')+TherapyPatientPanels.render(state.tab,{patient,s,cfg,esc,when,empty,button,badge,info,limit:state.limit});
 }
 function open(id){if(!TherapyVault.isOpen()||!db.patients.some(p=>p.id===id))return;state.id=id;state.tab='overview';state.limit=40;router('patients');document.getElementById('therapy-workspace-scroll').scrollTop=0;document.getElementById('crm-patient-name')?.focus({preventScroll:true});}
 function back(){state.id=null;state.tab='overview';render();document.getElementById('therapy-workspace-scroll').scrollTop=0;}
 function clearFilters(){for(const id of['search-patients'])document.getElementById(id).value='';for(const id of['therapy-show-alerts','therapy-show-archived'])document.getElementById(id).checked=false;for(const id of['crm-stage-filter','crm-focus-filter'])document.getElementById(id).value='all';document.getElementById('crm-sort').value='name';state.id=null;render();}
 function focus(value){clearFilters();if(value==='alerts')document.getElementById('therapy-show-alerts').checked=true;else if(value!=='all')document.getElementById('crm-focus-filter').value=value;render();}
 function tab(value){if(!tabs[value])return;state.tab=value;state.limit=40;render();const node=document.getElementById('crm-tab-'+value);node?.scrollIntoView({block:'nearest',inline:'nearest'});node?.focus({preventScroll:true});}
 function schedule(id=state.id){const patient=db.patients.find(p=>p.id===id);if(!patient||patient.archived)return therapyNotice('Reative o cadastro antes de agendar.','error');openAppointmentModal(null,id);}
 const types={session:['sessions','openSessionNotesModal','session-patient'],treatment:['treatments','openTreatmentModal','treatment-patient'],assessment:['assessments','openAssessmentModal','assessment-patient'],orientation:['prescriptions','openPrescriptionModal','prescription-patient'],financial:['financial','openFinancialModal','therapy-financial-patient'],package:['packages','openTherapyPackage','therapy-pack-patient']};
 function record(type,id=null){
  const patient=current(),config=types[type];if(!patient||!config||!TherapyVault.isOpen())return;
  if(id&&!db[config[0]].some(item=>item.id===id&&(item.patientId===patient.id||type==='financial'&&R.financial(db,patient.id).rows.some(row=>row.id===id))))return;
  if(patient.archived&&(!id||!['financial','session','orientation','assessment'].includes(type)))return therapyNotice('Reative o cadastro para iniciar ou editar este acompanhamento.','error');
  window[config[1]](id);const select=document.getElementById(config[2]);if(select&&!id)select.value=patient.id;
  if(!id){if(type==='session'){populateTherapyPackageChoices();TherapyCare.sessionContext();}else if(type==='assessment'||type==='orientation')TherapyCare.formLinks(type);}
 }
 function reset(){state.id=null;state.tab='overview';state.limit=40;for(const id of['crm-profile-heading','crm-tabs','crm-panel','crm-metrics'])document.getElementById(id)?.replaceChildren();document.getElementById('search-patients').value='';document.getElementById('crm-profile').hidden=true;document.getElementById('crm-directory').hidden=false;for(const id of['crm-stage-filter','crm-focus-filter'])document.getElementById(id).value='all';}
 document.addEventListener('DOMContentLoaded',()=>document.getElementById('crm-tabs').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const keys=Object.keys(tabs),index=keys.indexOf(state.tab),next=event.key==='Home'?keys[0]:event.key==='End'?keys.at(-1):keys[(index+(event.key==='ArrowRight'?1:-1)+keys.length)%keys.length];event.preventDefault();tab(next);}));
 return {init,render,open,back,tab,focus,clearFilters,schedule,record,current,reset,refresh(){if(!document.getElementById('view-patients').classList.contains('hide'))render();},more(){state.limit+=40;render();},resetDirectory(){state.id=null;},get selectedId(){return state.id;}};
})();
window.renderPatients=()=>TherapyPatients.render();
