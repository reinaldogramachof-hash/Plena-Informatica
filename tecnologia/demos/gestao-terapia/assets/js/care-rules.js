/* Continuidade local do atendimento. Vínculos explícitos, sem inferência clínica. */
const TherapyCareRules=(()=>{
 const copy=value=>JSON.parse(JSON.stringify(value));
 const validId=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]+$/.test(value);
 function links(value={}){
  const result={sessionId:'',treatmentId:'',...copy(value)};
  for(const key of ['sessionId','treatmentId'])if(result[key]!==''&&!validId(result[key]))throw new Error('Vínculo de acompanhamento inválido.');
  return result;
 }
 function validateLinks(data,patientId,value,previous={}){
  const result=links(value),before=links(previous);
  for(const [field,collection]of [['sessionId','sessions'],['treatmentId','treatments']]){
   if(!result[field]||result[field]===before[field])continue;
   const item=data[collection].find(item=>item.id===result[field]&&item.patientId===patientId);
   if(!item||item.archived||field==='treatmentId'&&item.status!=='active')throw new Error('Selecione registros ativos deste paciente para o vínculo.');
  }
  return result;
 }
 function selection(value={}){
  const result={treatmentId:value.treatmentId||'',objectiveIds:value.objectiveIds||[]};
  if(result.treatmentId&&!validId(result.treatmentId)||!Array.isArray(result.objectiveIds)||result.objectiveIds.length>200||new Set(result.objectiveIds).size!==result.objectiveIds.length||result.objectiveIds.some(id=>!validId(id))||!result.treatmentId&&result.objectiveIds.length)throw new Error('Confira o plano e os objetivos selecionados.');
  return copy(result);
 }
 function validateSession(data,record){
  const chosen=selection(record.evolution),old=data.sessions.find(item=>item.id===record.id),before=selection(old?.evolution);
  if(!chosen.treatmentId)return chosen;
  const plan=data.treatments.find(item=>item.id===chosen.treatmentId&&item.patientId===record.patientId);
  if(!plan||chosen.treatmentId!==before.treatmentId&&(plan.archived||plan.status!=='active'))throw new Error('O plano selecionado não está ativo para este paciente.');
  const objectives=TherapyTreatmentRules.plan(plan.plan).objectives;
  if(chosen.objectiveIds.some(id=>!objectives.some(item=>item.id===id)&&!(before.treatmentId===chosen.treatmentId&&before.objectiveIds.includes(id))))throw new Error('Um objetivo selecionado não pertence ao plano.');
  return chosen;
 }
 function connectSession(data,record,previous){
  const chosen=selection(record.evolution),before=selection(previous?.evolution);let next=data;
  for(const planId of new Set([before.treatmentId,chosen.treatmentId].filter(Boolean))){
   const item=next.treatments.find(item=>item.id===planId&&item.patientId===record.patientId);if(!item)continue;
   const ids=TherapyTreatmentRules.plan(item.plan).sessionIds,linked=ids.includes(record.id),wanted=planId===chosen.treatmentId;
   if(linked===wanted)continue;
   // A revisão pode conservar um vínculo existente de um plano pausado ou arquivado.
   next=TherapyTreatmentRules.links(next,planId,wanted?ids.concat(record.id):ids.filter(id=>id!==record.id),true);
  }
  return next;
 }
 function context(data,patientId,date,excludeId=''){
  const records=data.sessions.filter(item=>item.patientId===patientId&&!item.archived&&item.id!==excludeId&&String(item.date).slice(0,10)<=date).sort((a,b)=>String(b.date).localeCompare(String(a.date))||String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
  return {last:records[0]||null,plans:data.treatments.filter(item=>item.patientId===patientId&&!item.archived&&item.status==='active'),assessments:data.assessments.filter(item=>item.patientId===patientId&&!item.archived&&TherapyAssessmentRules.meta(item.evaluation).status==='confirmed').sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,3),orientations:data.prescriptions.filter(item=>item.patientId===patientId&&TherapyGuidanceRules.pending(item))};
 }
 function followup(meta){return !!meta.reviewDate&&(meta.reviewStatus||'pending')==='pending';}
 function resolution(data,id,action,date='',note=''){
  if(!['completed','dismissed','rescheduled'].includes(action)||typeof note!=='string'||note.length>1000)throw new Error('Confira a resolução da reavaliação.');
  const next=copy(data),old=next.assessments.find(item=>item.id===id);
  if(!old||old.archived||!next.patients.some(p=>p.id===old.patientId&&!p.archived)||TherapyAssessmentRules.meta(old.evaluation).status!=='confirmed')throw new Error('Selecione uma avaliação confirmada e um paciente ativo.');
  const item=copy(old);item.evaluation=TherapyAssessmentRules.meta(item.evaluation);
  if(action==='rescheduled'){
   if(!TherapyAgendaRules.validDate(date)||date<=TherapyData.dateKey())throw new Error('Escolha uma data futura para reagendar.');
   item.evaluation.reviewDate=date;item.evaluation.reviewStatus='pending';
  }else item.evaluation.reviewStatus=action;
  item.evaluation.reviewResolution={action,date:TherapyData.dateKey(),note};
  next.assessments[next.assessments.indexOf(old)]=TherapyAssessmentRules.revise(old,item,'Reavaliação: '+action,note);return next;
 }
 function fulfill(data,item){
  const id=item.evaluation?.previousAssessmentId;if(!id||item.evaluation.status!=='confirmed')return data;
  const old=data.assessments.find(record=>record.id===id);
  if(!old||old.id===item.id||old.patientId!==item.patientId||old.scale!==item.scale||String(old.date).slice(0,10)>String(item.date).slice(0,10)||old.archived||TherapyAssessmentRules.meta(old.evaluation).status!=='confirmed'||old.scale==='manual'&&old.evaluation.instrumentName!==item.evaluation.instrumentName||old.scale!=='manual'&&old.evaluation.instrumentVersion!==item.evaluation.instrumentVersion)throw new Error('A reavaliação deve corresponder ao paciente, instrumento e versão da aplicação anterior.');
  if(!followup(TherapyAssessmentRules.meta(old.evaluation)))return data;
  const next=resolution(data,id,'completed','', 'Atendida pela aplicação '+item.id+'.');
  next.assessments.find(record=>record.id===id).evaluation.reviewResolution.assessmentId=item.id;return next;
 }
 return {links,validateLinks,selection,validateSession,connectSession,context,followup,resolution,fulfill};
})();
