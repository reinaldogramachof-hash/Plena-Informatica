/* Preferências de aprendizado: somente IDs públicos dos guias, versão, etapa e situação. */
const TherapyTourRules=(()=>{
 const states=['in_progress','paused','presented','done','reviewed','consulted','skipped'];
 const empty=()=>({schema:1,welcome:'pending',entries:{}});
 function normalize(source,catalog){
  const result=empty();if(!source||typeof source!=='object'||Array.isArray(source))return result;
  if(['pending','dismissed','started'].includes(source.welcome))result.welcome=source.welcome;
  if(!source.entries||typeof source.entries!=='object'||Array.isArray(source.entries))return result;
  for(const guide of catalog){const value=Object.hasOwn(source.entries,guide.id)?source.entries[guide.id]:null;
   if(!value||value.version!==guide.version||!states.includes(value.status)||!Number.isInteger(value.step)||value.step<0||value.step>=guide.steps.length)continue;
   // Campos desconhecidos, conteúdo digitado e identificadores de registros nunca são copiados.
   result.entries[guide.id]={version:guide.version,step:value.step,status:value.status};
  }return result;
 }
 function update(source,catalog,id,step,status){
  const guide=catalog.find(g=>g.id===id);if(!guide||!states.includes(status)||!Number.isInteger(step)||step<0||step>=guide.steps.length)throw new Error('Progresso do guia inválido.');
  const next=normalize(source,catalog);next.entries[id]={version:guide.version,step,status};return next;
 }
 function completed(guide,{proof=false,external=false,target=false}={}){
  if(guide.kind==='intro'||guide.kind==='reference')return 'presented';
  if(guide.external)return external&&target?'reviewed':null;
  if(guide.intent?.length)return proof?'done':null;
  return target?'reviewed':null;
 }
 function matches(intent,name,variant=''){return Array.isArray(intent)&&intent.some(item=>item===name||item===name+':'+variant);}
 const labels={in_progress:'Em andamento',paused:'Pausado',presented:'Orientação apresentada',done:'Operação confirmada',reviewed:'Conferido pelo usuário',consulted:'Orientação consultada',skipped:'Pulado'};
 return {empty,normalize,update,completed,matches,labels};
})();
