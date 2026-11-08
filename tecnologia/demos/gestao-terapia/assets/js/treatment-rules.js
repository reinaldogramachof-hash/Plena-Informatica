/* Plano e objetivos são definidos pelo profissional; frequência e metas não geram agenda ou cobrança. */
const TherapyTreatmentRules=(()=>{
 const statuses={active:'Ativo',paused:'Pausado',completed:'Concluído'},objectiveStatuses={pending:'A iniciar',working:'Em acompanhamento',achieved:'Alcançado',paused:'Pausado'};
 const approaches={tcc:'TCC',psicanalise:'Psicanálise',humanista:'Humanista',gestalt:'Gestalt-terapia','sistêmica':'Sistêmica',focada_emocoes:'Focada nas emoções',aceitacao_compromisso:'ACT',dialetica:'DBT',psicodinamica:'Psicodinâmica',integrative:'Integrativa',fenomenologica:'Fenomenológica (Fenomenologia)'},frequencies={semanal:'Semanal',quinzenal:'Quinzenal',mensal:'Mensal',variavel:'Variável'};
 const copy=value=>JSON.parse(JSON.stringify(value)),id=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]+$/.test(value);
 const text=(value,max=100000)=>{if(value==null)return '';if(typeof value!=='string'||value.length>max)throw new Error('Texto do plano inválido ou muito longo.');return value;};
 function date(value){if(value!==''&&!TherapyAgendaRules.validDate(value))throw new Error('Confira as datas do plano.');return value;}
 function plan(source={}){
  if(!source||typeof source!=='object'||Array.isArray(source))throw new Error('Detalhes do plano inválidos.');
  const result={title:'',startDate:'',reviewDate:'',endDate:'',summary:'',objectives:[],sessionIds:[],history:[],...copy(source)};
  result.title=text(result.title,300);result.summary=text(result.summary);
  for(const key of ['startDate','reviewDate','endDate'])date(result[key]);
  if(result.startDate&&(result.reviewDate&&result.reviewDate<result.startDate||result.endDate&&result.endDate<result.startDate))throw new Error('Revisão e encerramento não podem ser anteriores ao início do plano.');
  if(!Array.isArray(result.objectives)||result.objectives.length>200||!Array.isArray(result.sessionIds)||result.sessionIds.length>2000||new Set(result.sessionIds).size!==result.sessionIds.length||result.sessionIds.some(value=>!id(value)))throw new Error('Objetivos ou vínculos de sessões inválidos.');
  const seen=new Set();for(const item of result.objectives){if(!item||!id(item.id)||seen.has(item.id)||!Object.hasOwn(objectiveStatuses,item.status)||!text(item.title,1000).trim())throw new Error('Objetivo inválido ou repetido.');text(item.note,10000);seen.add(item.id);}
  if(!Array.isArray(result.history)||result.history.length>200)throw new Error('Histórico do plano inválido.');
  const revisions=new Set();for(const revision of result.history){if(!revision||!id(revision.id)||revisions.has(revision.id)||!Number.isFinite(Date.parse(revision.date))||!revision.snapshot||typeof revision.snapshot!=='object'||Array.isArray(revision.snapshot))throw new Error('Revisão do plano inválida.');text(revision.action,100);text(revision.reason,1000);const snap=revision.snapshot;if(snap.plan?.history!==undefined)throw new Error('Histórico aninhado inválido.');plan({...snap.plan,history:[]});for(const key of ['diagnosis','approach','goals','frequency'])text(snap[key]);revisions.add(revision.id);}
  return result;
 }
 function snapshot(item){const value={};for(const key of ['patientId','diagnosis','approach','goals','frequency','sessionsGoal','status','archived'])if(item[key]!==undefined)value[key]=copy(item[key]);const {history,...details}=plan(item.plan);value.plan=details;return value;}
 function change(data,recordId,action,mutate,reason='',administrative=false){
  const next=copy(data),item=next.treatments.find(item=>item.id===recordId);if(!item)throw new Error('Plano não encontrado.');
  const patient=next.patients.find(p=>p.id===item.patientId);if(!administrative&&(item.archived||!patient||patient.archived))throw new Error('Restaure o plano e reative o cadastro antes de editar.');
  const before=snapshot(item);item.plan=plan(item.plan);mutate(item,next);item.plan=plan(item.plan);
  if(JSON.stringify(before)!==JSON.stringify(snapshot(item))){if(item.plan.history.length>=200)throw new Error('Limite de 200 alterações atingido. O histórico foi preservado.');item.plan.history.push({id:getID(),date:new Date().toISOString(),action,reason:text(reason,1000),snapshot:before});item.updatedAt=new Date().toISOString();}
  return next;
 }
 function save(data,source){
  if(!source||!id(source.id)||!id(source.patientId))throw new Error('Confira o paciente do plano.');
  const patient=data.patients.find(p=>p.id===source.patientId),old=data.treatments.find(t=>t.id===source.id);if(!patient||patient.archived)throw new Error('Selecione um paciente ativo.');
  if(old&&old.patientId!==source.patientId)throw new Error('O paciente do plano é preservado. Crie outro plano para outro paciente.');
  const fields={};for(const key of ['diagnosis','approach','goals','frequency'])fields[key]=text(source[key]);
  if(!fields.approach.trim()||!fields.goals.trim())throw new Error('Informe a abordagem e os objetivos do plano.');
  if(!Object.hasOwn(statuses,source.status)&&(!old||source.status!==old.status))throw new Error('Selecione uma situação válida.');
  const goal=source.sessionsGoal;if(goal!==null&&(!Number.isInteger(goal)||goal<1||goal>1000))throw new Error('A meta de sessões deve ficar entre 1 e 1000 ou em branco.');
  const incoming=plan(source.plan),apply=item=>{Object.assign(item,fields,{sessionsGoal:goal,status:source.status});for(const key of ['title','startDate','reviewDate','endDate','summary'])item.plan[key]=incoming[key];};
  if(old)return change(data,old.id,'Plano revisado',apply,source.reason);
  const next=copy(data),item={id:source.id,patientId:source.patientId,plan:plan(),createdAt:new Date().toISOString()};apply(item);item.plan=plan(item.plan);next.treatments.push(item);return next;
 }
 function objective(data,recordId,source){
  if(!source||!id(source.id)||!text(source.title,1000).trim()||!Object.hasOwn(objectiveStatuses,source.status))throw new Error('Confira o objetivo e sua situação.');text(source.note,10000);
  return change(data,recordId,'Objetivo atualizado',item=>{const old=item.plan.objectives.find(o=>o.id===source.id);if(old)Object.assign(old,{title:source.title,status:source.status,note:source.note||''});else item.plan.objectives.push({...source,createdAt:new Date().toISOString()});});
 }
 function links(data,recordId,sessionIds,administrative=false){return change(data,recordId,'Vínculos de sessões revisados',(item,next)=>{if(!Array.isArray(sessionIds)||sessionIds.some(sid=>!id(sid)||!item.plan.sessionIds.includes(sid)&&!next.sessions.some(s=>s.id===sid&&s.patientId===item.patientId)))throw new Error('Selecione somente registros deste paciente.');item.plan.sessionIds=sessionIds;},'',administrative);}
 function archive(data,recordId,archived){return change(data,recordId,archived?'Plano arquivado':'Plano restaurado',item=>{item.archived=archived;},'',true);}
 function summary(data,item,today=TherapyData.dateKey()){
  const details=plan(item.plan),sessions=data.sessions.filter(s=>s.patientId===item.patientId&&details.sessionIds.includes(s.id));
  return {details,sessions,missing:details.sessionIds.length-sessions.length,achieved:details.objectives.filter(o=>o.status==='achieved').length,due:!item.archived&&item.status==='active'&&!!details.reviewDate&&details.reviewDate<=today};
 }
 function filter(data,options={}){const query=TherapyPatientRules.fold(options.search||'').trim();return data.treatments.filter(item=>{const p=data.patients.find(p=>p.id===item.patientId),details=plan(item.plan),clinical=options.clinical?[item.diagnosis,item.goals,details.summary,...details.objectives.map(o=>o.title+' '+(o.note||''))].join(' '):'';return (options.status==='archived'?!!item.archived:!item.archived&&(options.status==='all'||!options.status||item.status===options.status))&&(!options.patient||item.patientId===options.patient)&&(!options.due||summary(data,item).due)&&(!query||TherapyPatientRules.fold([p?.name,details.title,item.approach,clinical].join(' ')).includes(query));}).sort((a,b)=>options.sort==='patient'?(data.patients.find(p=>p.id===a.patientId)?.name||'').localeCompare(data.patients.find(p=>p.id===b.patientId)?.name||'','pt-BR'):options.sort==='review'?(plan(a.plan).reviewDate||'9999').localeCompare(plan(b.plan).reviewDate||'9999'):String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));}
 return {plan,save,objective,links,archive,summary,filter,statuses,objectiveStatuses,approaches,frequencies};
})();
