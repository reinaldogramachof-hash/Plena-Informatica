/* Rastreio e registros livres: cálculo de soma, sem diagnóstico ou classificação de risco automática. */
const TherapyAssessmentRules=(()=>{
 const sourcePHQ='https://www.phqscreeners.com/images/sites/g/files/g10060481/f/201412/PHQ9_Portuguese%20for%20Brazil.pdf';
 const sourceGAD='https://saude.prefeitura.rio/wp-content/uploads/sites/47/2025/12/Apoio-matricial-caps-e-deambs.pdf#page=41';
 const catalog={
  phq9:{name:'PHQ-9',max:27,version:'phq9-br-2014-v1',source:sourcePHQ,questions:[
   'Pouco interesse ou pouco prazer em fazer as coisas','Se sentir “para baixo”, deprimido/a ou sem perspectiva','Dificuldade para pegar no sono ou permanecer dormindo, ou dormir mais do que de costume','Se sentir cansado/a ou com pouca energia','Falta de apetite ou comendo demais','Se sentir mal consigo mesmo/a — ou achar que você é um fracasso ou que decepcionou sua família ou você mesmo/a','Dificuldade para se concentrar nas coisas, como ler o jornal ou ver televisão','Lentidão para se movimentar ou falar, a ponto das outras pessoas perceberem? Ou o oposto – estar tão agitado/a ou irrequieto/a que você fica andando de um lado para o outro muito mais do que de costume','Pensar em se ferir de alguma maneira ou que seria melhor estar morto/a']},
  gad7:{name:'GAD-7',max:21,version:'gad7-br-2025-v1',source:sourceGAD,questions:[
   'Sentir-se nervoso/a, ansioso/a ou muito tenso/a','Não ser capaz de impedir ou de controlar as preocupações','Preocupar-se muito com diversas coisas','Dificuldade para relaxar','Ficar tão agitado/a que se torna difícil permanecer sentado/a','Ficar facilmente aborrecido/a ou irritado/a','Sentir medo como se algo horrível fosse acontecer']}
 };
 const names={phq9:'PHQ-9',gad7:'GAD-7',manual:'Registro livre / instrumento externo',humor:'Humor · registro anterior',estresse:'Estresse · registro anterior',sono:'Sono · registro anterior'};
 const choices=['Nenhuma vez','Vários dias','Mais da metade dos dias','Quase todos os dias'],impacts={'':'Não registrado',none:'Nenhuma dificuldade',some:'Alguma dificuldade',very:'Muita dificuldade',extreme:'Extrema dificuldade'};
 const copy=value=>JSON.parse(JSON.stringify(value)),id=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]+$/.test(value);
 const text=(value,max=100000)=>{if(value==null)return '';if(typeof value!=='string'||value.length>max)throw new Error('Texto da avaliação inválido ou muito longo.');return value;};
 function meta(source={}){
  if(!source||typeof source!=='object'||Array.isArray(source))throw new Error('Detalhes da avaliação inválidos.');
  const value={status:'confirmed',mode:'legacy',instrumentVersion:'',instrumentName:'',context:'',conclusion:'',impact:'',reviewDate:'',revisions:[],...copy(source)};
  if(!['draft','confirmed'].includes(value.status)||!['legacy','questionnaire','manual'].includes(value.mode)||!Object.hasOwn(impacts,value.impact)||value.reviewDate&&!TherapyAgendaRules.validDate(value.reviewDate))throw new Error('Situação ou data de revisão da avaliação inválida.');
  for(const field of ['instrumentVersion','instrumentName'])value[field]=text(value[field],300);value.context=text(value.context,5000);value.conclusion=text(value.conclusion);
  if(value.care!==undefined)value.care=TherapyCareRules.links(value.care);
  if(value.previousAssessmentId!==undefined&&value.previousAssessmentId!==''&&!id(value.previousAssessmentId))throw new Error('Aplicação anterior inválida.');
  if(value.reviewStatus!==undefined&&!['pending','completed','dismissed'].includes(value.reviewStatus))throw new Error('Situação da reavaliação inválida.');
  if(value.reviewResolution!==undefined){const r=value.reviewResolution;if(!r||!['completed','dismissed','rescheduled'].includes(r.action)||!TherapyAgendaRules.validDate(r.date))throw new Error('Resolução da reavaliação inválida.');text(r.note,1000);if(r.assessmentId&&!id(r.assessmentId))throw new Error('Aplicação vinculada inválida.');}
  if(!Array.isArray(value.revisions)||value.revisions.length>200)throw new Error('Histórico de avaliação inválido.');
  const ids=new Set();for(const revision of value.revisions){if(!revision||!id(revision.id)||ids.has(revision.id)||!Number.isFinite(Date.parse(revision.date))||!revision.snapshot||typeof revision.snapshot!=='object'||Array.isArray(revision.snapshot)||revision.snapshot.evaluation?.revisions!==undefined)throw new Error('Revisão de avaliação inválida.');ids.add(revision.id);text(revision.reason,1000);text(revision.action,100);meta({...revision.snapshot.evaluation,revisions:[]});}
  return value;
 }
 function answers(scale,source,complete=false){
  const instrument=catalog[scale];if(!instrument)throw new Error('Selecione uma escala implementada ou um registro livre.');
  if(!source||typeof source!=='object'||Array.isArray(source))throw new Error('Respostas inválidas.');const result={};
  for(const [key,value]of Object.entries(source)){if(!/^(0|[1-9]\d*)$/.test(key)||Number(key)>=instrument.questions.length||!Number.isInteger(value)||value<0||value>3)throw new Error('Confira as respostas: cada item deve conter uma opção de 0 a 3.');result[key]=value;}
  const count=Object.keys(result).length;if(complete&&count!==instrument.questions.length)throw new Error('Responda todos os itens antes de confirmar. Você pode salvar um rascunho.');
  return {answers:result,count,total:count===instrument.questions.length?Object.values(result).reduce((sum,n)=>sum+n,0):null,max:instrument.max};
 }
 function current(item){return !!catalog[item.scale]&&item.evaluation?.mode==='questionnaire'&&item.evaluation?.instrumentVersion===catalog[item.scale].version;}
 function snapshot(item){const value={};for(const key of ['patientId','date','scale','score','answers','notes','archived'])if(item[key]!==undefined)value[key]=copy(item[key]);const {revisions,...details}=meta(item.evaluation);value.evaluation=details;return value;}
 function revise(old,next,action,reason=''){
  const before=snapshot(old),after=snapshot(next);if(JSON.stringify(before)===JSON.stringify(after))return copy(old);
  next.evaluation=meta(next.evaluation);if(next.evaluation.revisions.length>=200)throw new Error('O limite de 200 revisões foi atingido. O registro e seu histórico foram preservados.');
  next.evaluation.revisions.push({id:getID(),date:new Date().toISOString(),action,reason:text(reason,1000),snapshot:before});next.updatedAt=new Date().toISOString();return next;
 }
 function save(data,source,status='confirmed'){
  if(!source||!id(source.id)||!id(source.patientId)||!['draft','confirmed'].includes(status))throw new Error('Confira paciente, data e situação da avaliação.');
  const next=copy(data),old=next.assessments.find(a=>a.id===source.id),patient=next.patients.find(p=>p.id===source.patientId);
  if((!old||meta(old.evaluation).status==='draft')&&!TherapyAgendaRules.validDate(source.date))throw new Error('Confira a data da aplicação.');
  if(!patient||patient.archived||old?.archived)throw new Error('Reative o paciente e restaure a avaliação antes de editar.');
  if(old&&(old.patientId!==source.patientId||String(old.date||'').slice(0,10)!==source.date||old.scale!==source.scale))throw new Error('Paciente, data e instrumento são preservados. Use uma nova aplicação.');
  const previous=old&&meta(old.evaluation);if(previous?.status==='confirmed'&&status==='draft')throw new Error('Uma aplicação confirmada não volta a rascunho.');
  if(previous?.status==='confirmed'&&previous.mode==='manual'&&meta(source.evaluation).instrumentName!==previous.instrumentName)throw new Error('O instrumento do registro confirmado é preservado. Use uma nova aplicação.');
  const item=old?copy(old):{id:source.id,patientId:source.patientId,date:source.date,scale:source.scale,createdAt:new Date().toISOString()};
  item.evaluation=meta(old?.evaluation);for(const field of ['context','conclusion','instrumentName','impact','reviewDate'])item.evaluation[field]=meta(source.evaluation)[field];item.notes=text(source.notes);
  if(source.evaluation?.care!==undefined)item.evaluation.care=TherapyCareRules.validateLinks(data,source.patientId,source.evaluation.care,old?.evaluation?.care);
  if(!old&&source.evaluation?.previousAssessmentId)item.evaluation.previousAssessmentId=source.evaluation.previousAssessmentId;
  if(old&&item.evaluation.reviewDate!==previous.reviewDate){item.evaluation.reviewStatus='pending';delete item.evaluation.reviewResolution;}
  if(!old||previous.status==='draft'){
   if(!catalog[source.scale]&&source.scale!=='manual')throw new Error('Use PHQ-9, GAD-7 ou registro livre.');
   item.evaluation.mode=source.scale==='manual'?'manual':'questionnaire';item.evaluation.instrumentVersion=catalog[source.scale]?.version||'manual-v1';
   if(source.scale==='manual'){if(!item.evaluation.instrumentName.trim()||status==='confirmed'&&!item.notes.trim()&&!item.evaluation.conclusion.trim())throw new Error('Informe o instrumento ou tipo de registro e o conteúdo da avaliação.');item.score=null;item.answers={};}
   else{const result=answers(source.scale,source.answers,status==='confirmed');item.answers=result.answers;item.score=status==='confirmed'?result.total:null;}
   item.evaluation.status=status;
  }else if(source.reviseAnswers){
   if(!current(old))throw new Error('As respostas da versão anterior são preservadas. Registre uma nova aplicação para usar o formulário atual.');
   const result=answers(old.scale,source.answers,true);item.answers=result.answers;item.score=result.total;
  }
  item.evaluation=meta(item.evaluation);
  if(old){const index=next.assessments.indexOf(old);next.assessments[index]=revise(old,item,previous.status==='draft'&&status==='confirmed'?'Aplicação confirmada':'Registro revisado',source.reason);}
  else next.assessments.push(item);return typeof TherapyCareRules==='undefined'||old&&previous.status==='confirmed'?next:TherapyCareRules.fulfill(next,next.assessments.find(a=>a.id===item.id));
 }
 function archive(data,recordId,archived){const next=copy(data),old=next.assessments.find(a=>a.id===recordId);if(!old)throw new Error('Avaliação não encontrada.');const item=copy(old);item.archived=archived;next.assessments[next.assessments.indexOf(old)]=revise(old,item,archived?'Registro arquivado':'Registro restaurado');return next;}
 function validate(item){if(item.evaluation!==undefined){const cfg=meta(item.evaluation);if(current(item)){if(!TherapyAgendaRules.validDate(String(item.date||'').slice(0,10)))throw new Error('Data da aplicação inválida.');const result=answers(item.scale,item.answers,cfg.status==='confirmed');if(cfg.status==='confirmed'&&item.score!==result.total||cfg.status==='draft'&&item.score!==null)throw new Error('Pontuação incompatível com as respostas da avaliação.');}if(cfg.mode==='manual'&&item.score!==null)throw new Error('Registro livre não possui soma automática.');}}
 function scoreLabel(item){const cfg=meta(item.evaluation);if(cfg.status==='draft')return 'Rascunho · sem pontuação confirmada';if(cfg.mode==='manual')return 'Registro descritivo · sem pontuação automática';if(item.score===null||item.score===undefined||!['number','string'].includes(typeof item.score)||typeof item.score==='string'&&!item.score.trim()||!Number.isFinite(Number(item.score)))return 'Pontuação não informada';return Number(item.score)+' pontos'+(current(item)?' / '+catalog[item.scale].max:' · registro anterior');}
 function filter(data,options={}){const query=TherapyPatientRules.fold(options.search||'').trim();return data.assessments.filter(item=>{const cfg=meta(item.evaluation),date=String(item.date||'').slice(0,10),patient=data.patients.find(p=>p.id===item.patientId);return (options.tab==='archived'?!!item.archived:!item.archived&&cfg.status===(options.tab==='drafts'?'draft':'confirmed'))&&(!options.patient||item.patientId===options.patient)&&(!options.scale||item.scale===options.scale)&&(!options.start||date>=options.start)&&(!options.end||date<=options.end)&&(!query||TherapyPatientRules.fold([patient?.name,names[item.scale]||item.scale,cfg.instrumentName,options.content?[item.notes,cfg.context,cfg.conclusion].join(' '):''].join(' ')).includes(query));}).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||String(b.createdAt||'').localeCompare(String(a.createdAt||'')));}
 function comparable(data,patientId,scale){return data.assessments.filter(item=>item.patientId===patientId&&item.scale===scale&&!item.archived&&meta(item.evaluation).status==='confirmed'&&current(item)).filter(item=>{try{validate(item);return true;}catch{return false;}}).sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.createdAt||'').localeCompare(String(b.createdAt||'')));}
 function reviewItem(item){return item.scale==='phq9'&&current(item)&&Number(item.answers?.[8])>0;}
 return {catalog,names,choices,impacts,meta,answers,current,save,archive,validate,scoreLabel,filter,comparable,reviewItem,revise};
})();
