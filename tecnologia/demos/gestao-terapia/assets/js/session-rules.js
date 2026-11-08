/* Sessões e rascunhos usam o mesmo cofre; rascunho nunca conclui nem cobra. */
const TherapySessionRules=(()=>{
 const modalities={not_informed:'Não informada',in_person:'Presencial',online:'Online',hybrid:'Híbrida'};
 const fields=['content','interventions','nextPlan','mood','adherence'];
 const copy=value=>JSON.parse(JSON.stringify(value));
 const id=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]+$/.test(value);
 const text=(value,max=100000)=>{if(value==null)return '';if(typeof value!=='string'||value.length>max)throw new Error('Texto do registro inválido ou muito longo.');return value;};
 const stamp=value=>typeof value==='string'&&TherapyAgendaRules.validDate(value.slice(0,10))&&Number.isFinite(Date.parse(value));
 function evolution(source={}){
  if(!source||typeof source!=='object'||Array.isArray(source))throw new Error('Dados de evolução inválidos.');
  const item={modality:'not_informed',duration:null,focus:'',objectives:'',homework:'',...source};
  if(!Object.hasOwn(modalities,item.modality)||item.duration!==null&&(!Number.isInteger(item.duration)||item.duration<10||item.duration>240))throw new Error('Confira modalidade e duração da sessão.');
  for(const key of['focus','objectives','homework'])item[key]=text(item[key],5000);
  if(item.treatmentId!==undefined||item.objectiveIds!==undefined){if(typeof TherapyCareRules==='undefined')throw new Error('Atualize o sistema para abrir os vínculos do atendimento.');Object.assign(item,TherapyCareRules.selection(item));}
  return item;
 }
 function prepare(source,required=true){
  if(!source||!id(source.id)||!id(source.patientId)||!TherapyAgendaRules.validDate(source.date)||source.appointmentId!=null&&!id(source.appointmentId))throw new Error('Confira paciente, data e vínculo do registro.');
  const record={...source,evolution:evolution(source.evolution)};
  for(const field of fields)record[field]=text(source[field],['mood','adherence'].includes(field)?200:100000);
  if(required&&!record.content.trim())throw new Error('Registre o conteúdo do atendimento antes de concluir.');
  record.revisionReason=text(source.revisionReason,1000);
  return record;
 }
 function validateHistory(session){
  if(session.evolution!==undefined)evolution(session.evolution);
  if(session.revisions===undefined)return;
  if(!Array.isArray(session.revisions)||session.revisions.length>200)throw new Error('Histórico de alterações da sessão inválido.');
  const ids=new Set();for(const revision of session.revisions){if(!revision||!id(revision.id)||ids.has(revision.id)||!stamp(revision.date)||!revision.snapshot)throw new Error('Revisão da sessão inválida ou repetida.');ids.add(revision.id);text(revision.reason,1000);for(const field of fields)text(revision.snapshot[field],['mood','adherence'].includes(field)?200:100000);evolution(revision.snapshot.evolution);}
 }
 function editable(item){const value={};for(const field of fields)value[field]=text(item[field]);value.evolution=evolution(item.evolution);return value;}
 function edit(old,record){
  if(old.archived)throw new Error('Restaure a anotação antes de editar.');
  if(old.patientId!==record.patientId||String(old.date||'').slice(0,10)!==record.date||(old.appointmentId||null)!==(record.appointmentId||null))throw new Error('Paciente, data e vínculo do registro confirmado são preservados.');
  const next=copy(old),before=editable(old),after=editable(record);
  if(JSON.stringify(before)!==JSON.stringify(after)){
   next.revisions=next.revisions||[];if(next.revisions.length>=200)throw new Error('O registro atingiu o limite de 200 revisões. O histórico foi preservado.');
   next.revisions.push({id:getID(),date:new Date().toISOString(),reason:record.revisionReason||'',snapshot:before});Object.assign(next,after);next.updatedAt=new Date().toISOString();
  }
  return next;
 }
 function draft(source){
  const value=prepare(source,false);
  if(source.billing!==undefined&&(!source.billing||typeof source.billing!=='object'||Array.isArray(source.billing)))throw new Error('Cobrança planejada do rascunho inválida.');
  if(value.sessionId!=null&&!id(value.sessionId)||value.createdAt&&!stamp(value.createdAt)||value.updatedAt&&!stamp(value.updatedAt))throw new Error('Rascunho inválido.');
  const billing={mode:'none',amount:0,paid:false,packageId:null,...value.billing};
  if(!['none','single','package'].includes(billing.mode)||!Number.isFinite(billing.amount)||billing.amount<0||typeof billing.paid!=='boolean'||billing.packageId!=null&&billing.packageId!==''&&!id(billing.packageId))throw new Error('Confira a cobrança planejada do rascunho.');
  value.billing=billing;return value;
 }
 function saveDraft(data,source){
  const value=draft(source),next=copy(data);next.sessionDrafts=next.sessionDrafts||[];
  const old=next.sessionDrafts.find(item=>item.id===value.id),patient=next.patients.find(item=>item.id===value.patientId),record=next.sessions.find(item=>item.id===value.sessionId),appointment=next.appointments.find(item=>item.id===value.appointmentId);
  if(!patient)throw new Error('Selecione o paciente do rascunho.');
  if(value.sessionId&&(!record||record.patientId!==value.patientId))throw new Error('O registro original não está disponível. O rascunho foi preservado.');
  if(old&&(old.patientId!==value.patientId||(old.sessionId||null)!==(value.sessionId||null)||(old.appointmentId||null)!==(value.appointmentId||null)))throw new Error('O vínculo do rascunho não pode ser trocado.');
  if(value.appointmentId&&(!appointment||appointment.patientId!==value.patientId||!record&&['cancelled','no_show'].includes(appointment.status)))throw new Error('O agendamento não está disponível para este rascunho.');
  if(patient.archived&&!record&&appointment?.status!=='completed')throw new Error('Reative o cadastro antes de iniciar um novo atendimento.');
  if(!record&&appointment&&next.sessions.some(item=>item.appointmentId===appointment.id))throw new Error('Este atendimento já tem um registro confirmado. Confira o registro antes de continuar.');
  if(next.sessionDrafts.some(item=>item.id!==value.id&&(value.sessionId&&item.sessionId===value.sessionId||value.appointmentId&&item.appointmentId===value.appointmentId)))throw new Error('Já existe um rascunho para este atendimento. Abra o rascunho existente.');
  value.createdAt=old?.createdAt||new Date().toISOString();value.updatedAt=new Date().toISOString();
  if(old)Object.assign(old,value);else next.sessionDrafts.push(value);return next;
 }
 function finish(data,record,billing,draftId=null){
  const pending=draftId&&(data.sessionDrafts||[]).find(item=>item.id===draftId);
  if(draftId&&(!pending||pending.patientId!==record.patientId||(pending.appointmentId||null)!==(record.appointmentId||null)||pending.sessionId&&pending.sessionId!==record.id))throw new Error('O rascunho mudou ou já foi utilizado. Reabra os registros.');
  if(pending?.sessionId&&!data.sessions.some(item=>item.id===pending.sessionId))throw new Error('O registro original não está disponível. O rascunho foi preservado.');
  if(typeof TherapyCareRules!=='undefined')TherapyCareRules.validateSession(data,record);
  let next=TherapyFlow.complete(data,record,billing);
  if(typeof TherapyCareRules!=='undefined')next=TherapyCareRules.connectSession(next,record,data.sessions.find(item=>item.id===record.id));
  next.sessionDrafts=(next.sessionDrafts||[]).filter(item=>item.id!==draftId);return next;
 }
 function archive(data,sessionId,archived){const next=copy(data),session=next.sessions.find(item=>item.id===sessionId);if(!session)throw new Error('Registro não encontrado.');session.archived=archived;session[archived?'archivedAt':'restoredAt']=new Date().toISOString();return next;}
 function queue(data,today=TherapyData.dateKey(),now=new Date()){
  const current=TherapyData.dateKey(now)===today?String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0'):'23:59';
  return data.appointments.filter(item=>!['cancelled','no_show'].includes(item.status)&&!data.sessions.some(note=>note.appointmentId===item.id)&&(item.date<today||item.date===today&&item.time<=current||['in_progress','completed'].includes(item.status))).map(item=>({...item,recovery:item.status==='completed'})).sort((a,b)=>Number(b.recovery)-Number(a.recovery)||a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
 }
 function billingLabel(data,session){if(session.billingMode==='single')return 'Sessão avulsa';if(session.billingMode==='package'||data.packageMovements.some(item=>item.sessionId===session.id))return 'Pacote de sessões';if(session.billingMode==='none')return 'Sem cobrança vinculada';if(data.financial.some(item=>item.sessionId===session.id))return 'Lançamento vinculado';return 'Cobrança não informada';}
 function filter(data,items,options={}){
  const query=TherapyPatientRules.fold(options.search||'').trim();
  return items.filter(item=>{
   const patient=data.patients.find(p=>p.id===item.patientId),metadata=[patient?.name,patient?.crm?.preferredName,item.type].join(' '),content=options.content?[item.content,item.interventions,item.nextPlan,item.evolution?.focus,item.evolution?.objectives,item.evolution?.homework].join(' '):'';
   const date=String(item.date||'').slice(0,10);
   return (!options.patient||item.patientId===options.patient)&&(!options.start||date>=options.start)&&(!options.end||date<=options.end)&&(!query||TherapyPatientRules.fold(metadata+' '+content).includes(query));
  }).sort((a,b)=>options.sort==='patient'?(data.patients.find(p=>p.id===a.patientId)?.name||'').localeCompare(data.patients.find(p=>p.id===b.patientId)?.name||'','pt-BR'):(options.sort==='oldest'?1:-1)*(String(a.date).localeCompare(String(b.date))||String(a.updatedAt||a.createdAt||a.time||'').localeCompare(String(b.updatedAt||b.createdAt||b.time||''))));
 }
 return {evolution,prepare,validateHistory,edit,draft,saveDraft,finish,archive,queue,billingLabel,filter,modalities};
})();
