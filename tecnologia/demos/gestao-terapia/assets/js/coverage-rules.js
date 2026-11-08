/* Origem administrativa do atendimento. Cópias históricas não dependem do cadastro atual. */
const TherapyCoverageRules=(()=>{
 const kinds={unspecified:'Não informado',private:'Particular',insurance:'Convênio',reimbursement:'Particular com reembolso'};
 const validId=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(value);
 const color=value=>{if(typeof value!=='string'||!/^#[0-9a-f]{6}$/i.test(value))throw new Error('Escolha uma cor válida para o atendimento.');return value.toUpperCase();};
 const fold=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
 function settings(source={}){
  if(!source||typeof source!=='object'||Array.isArray(source))throw new Error('Configuração de convênios inválida.');
  const cfg={privateColor:'#2563EB',reimbursementColor:'#B45309',plans:[],...source};
  cfg.privateColor=color(cfg.privateColor);cfg.reimbursementColor=color(cfg.reimbursementColor);
  if(!Array.isArray(cfg.plans)||cfg.plans.length>100)throw new Error('Cadastre até 100 convênios.');
  const ids=new Set(),names=new Set();
  cfg.plans=cfg.plans.map(p=>{
   if(!p||!validId(p.id)||ids.has(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>80||typeof p.active!=='boolean')throw new Error('Confira nome, identificação e situação do convênio.');
   const name=p.name.trim(),key=fold(name);if(names.has(key))throw new Error('Já existe um convênio com esse nome.');ids.add(p.id);names.add(key);
   return {id:p.id,name,color:color(p.color),active:p.active};
  });return cfg;
 }
 const read=data=>settings(data.settings?.coverage);
 function preference(source={kind:'unspecified',planId:''}){
  if(!source||typeof source!=='object'||Array.isArray(source)||!Object.hasOwn(kinds,source.kind)||typeof source.planId!=='string'||(source.kind==='insurance'?!validId(source.planId):source.planId!==''))throw new Error('Selecione particular, convênio ou reembolso.');
  return {kind:source.kind,planId:source.planId};
 }
 function validate(source){
  const p=preference(source);if(typeof source.name!=='string'||!source.name.trim()||source.name.length>80||p.kind!=='insurance'&&source.name!==kinds[p.kind])throw new Error('Identificação histórica do atendimento inválida.');
  return {...p,name:source.name.trim(),color:color(source.color)};
 }
 const key=source=>source?.kind==='insurance'?'insurance:'+source.planId:source?.kind||'unspecified';
 function choice(value){return preference(value?.startsWith('insurance:')?{kind:'insurance',planId:value.slice(10)}:{kind:value||'unspecified',planId:''});}
 function snapshot(data,source,previous){
  const p=preference(source);
  if(previous&&key(p)===key(validate(previous)))return validate(previous);
  const cfg=read(data),plan=p.kind==='insurance'?cfg.plans.find(item=>item.id===p.planId&&item.active):null;
  if(p.kind==='insurance'&&!plan)throw new Error('O convênio está inativo ou não existe. Escolha um convênio ativo.');
  return {...p,name:plan?.name||kinds[p.kind],color:plan?.color||(p.kind==='private'?cfg.privateColor:p.kind==='reimbursement'?cfg.reimbursementColor:'#64748B')};
 }
 const of=item=>item?.coverage?validate(item.coverage):{kind:'unspecified',planId:'',name:kinds.unspecified,color:'#64748B'};
 const label=item=>{const s=of(item);return s.kind==='insurance'?'Convênio · '+s.name:s.name;};
 const matches=(item,value)=>!value||value==='all'||(value==='insurance'?of(item).kind==='insurance':key(of(item))===value);
 function savePlan(data,source){
  const next=JSON.parse(JSON.stringify(data)),cfg=read(next),index=cfg.plans.findIndex(p=>p.id===source.id);
  if(index<0)cfg.plans.push(source);else cfg.plans[index]=source;
  next.settings.coverage=settings(cfg);return next;
 }
 return {kinds,color,settings,read,preference,validate,key,choice,snapshot,of,label,matches,savePlan};
})();
