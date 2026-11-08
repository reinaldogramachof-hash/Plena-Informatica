/* CRM local: metadados administrativos e vínculos com os registros existentes. */
const TherapyPatientRules=(()=>{
 const stages={unclassified:'Sem etapa definida',intake:'Primeiro contato',assessment:'Em avaliação',ongoing:'Em acompanhamento',paused:'Em pausa',discharged:'Alta / encerrado'};
 const channels={none:'Não informado',phone:'Telefone',whatsapp:'WhatsApp',email:'E-mail',in_person:'Presencial',other:'Outro'};
 const permissions={not_informed:'Não informado',allowed:'Contato autorizado',restricted:'Contato restrito'};
 const priorities={normal:'Normal',high:'Alta',low:'Baixa'};
 const modalities={not_informed:'Não informada',in_person:'Presencial',online:'Online',hybrid:'Híbrida'};
 const text=(value,max=200)=>{if(typeof value!=='string'||value.length>max)throw new Error('Texto do CRM inválido ou muito longo.');return value.trim();};
 const stamp=value=>typeof value==='string'&&TherapyAgendaRules.validDate(value.slice(0,10))&&Number.isFinite(Date.parse(value));
 function normalize(source={}){
  if(!source||typeof source!=='object'||Array.isArray(source))throw new Error('Dados do CRM inválidos.');
  const cfg={stage:'unclassified',preferredName:'',document:'',pronouns:'',source:'',channel:'none',permission:'not_informed',modality:'not_informed',availability:'',address:'',city:'',state:'',guardianName:'',guardianRelationship:'',guardianPhone:'',emergencyRelationship:'',adminNotes:'',tags:[],contacts:[],tasks:[],stageHistory:[],...source};
  if(!Object.hasOwn(stages,cfg.stage)||!Object.hasOwn(channels,cfg.channel)||!Object.hasOwn(permissions,cfg.permission)||!Object.hasOwn(modalities,cfg.modality))throw new Error('Confira etapa e preferências do CRM.');
  for(const key of['preferredName','document','pronouns','source','availability','address','city','state','guardianName','guardianRelationship','guardianPhone','emergencyRelationship','adminNotes'])cfg[key]=text(cfg[key],key==='adminNotes'?4000:key==='availability'||key==='address'?500:200);
  if(cfg.state&&!TherapyAgendaRules.states.includes(cfg.state))throw new Error('Estado inválido no cadastro do paciente.');
  if(!Array.isArray(cfg.tags)||cfg.tags.length>12)throw new Error('Use até 12 etiquetas por paciente.');
  cfg.tags=[...new Set(cfg.tags.map(tag=>text(tag,40)).filter(Boolean))];
  for(const field of['contacts','tasks','stageHistory']){
   if(!Array.isArray(cfg[field])||cfg[field].length>2000)throw new Error('Histórico do CRM inválido ou excede 2.000 registros por painel.');
   const ids=new Set();cfg[field]=cfg[field].map(item=>{
    if(!item||typeof item.id!=='string'||!/^[a-zA-Z0-9_-]+$/.test(item.id)||ids.has(item.id))throw new Error('Registro do CRM inválido ou repetido.');ids.add(item.id);
    if(field==='contacts'){
     if(!TherapyAgendaRules.validDate(item.date)||!Object.hasOwn(channels,item.channel))throw new Error('Confira a data e o canal do contato.');
     const summary=text(item.summary,160),note=text(item.note||'',4000);if(!summary)throw new Error('Descreva o contato.');
     if(item.createdAt&&!stamp(item.createdAt))throw new Error('Data de registro do contato inválida.');
     return {...item,summary,note};
    }
    if(field==='tasks'){
     const title=text(item.title,180);if(!title||!TherapyAgendaRules.validDate(item.dueDate)||!Object.hasOwn(priorities,item.priority)||!['open','done'].includes(item.status)||item.createdAt&&!stamp(item.createdAt)||item.completedAt&&!stamp(item.completedAt))throw new Error('Confira título, prazo e situação da pendência.');
     return {...item,title};
    }
    if(!Object.hasOwn(stages,item.from)||!Object.hasOwn(stages,item.to)||!stamp(item.date))throw new Error('Histórico de etapas inválido.');
    return {...item,reason:text(item.reason||'',500)};
   });
  }
  return cfg;
 }
 const read=patient=>normalize(patient?.crm===undefined?{}:patient.crm);
 const fold=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const phone=value=>String(value||'').replace(/\D/g,'');
 function financial(data,patientId){
  const own=new Set(data.financial.filter(item=>item.patientId===patientId).map(item=>item.id));
  const rows=data.financial.filter(item=>own.has(item.id)||item.originalId&&own.has(item.originalId));
  const valid=rows.filter(item=>!item.cancelledAt),paid=valid.filter(item=>item.paymentStatus!=='pending');
  const sum=items=>Math.round(items.reduce((total,item)=>total+Number(item.amount),0)*100)/100;
  return {rows,income:sum(paid.filter(item=>item.type==='income')),expense:sum(paid.filter(item=>item.type==='expense')),pending:sum(valid.filter(item=>item.type==='income'&&item.paymentStatus==='pending'))};
 }
 function summary(data,patient,today=TherapyData.dateKey(),now=new Date()){
  const cfg=read(patient),appointments=data.appointments.filter(item=>item.patientId===patient.id);
  const active=appointments.filter(item=>!['completed','cancelled','no_show'].includes(item.status));
  const currentTime=TherapyData.dateKey(now)===today?String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0'):'00:00';
  const future=active.filter(item=>item.date>today||item.date===today&&item.time>=currentTime||item.status==='in_progress').sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
  const completed=appointments.filter(item=>item.status==='completed').sort((a,b)=>b.date.localeCompare(a.date)||b.time.localeCompare(a.time));
  const tasks=cfg.tasks.filter(item=>item.status==='open').sort((a,b)=>a.dueDate.localeCompare(b.dueDate)||Number(b.priority==='high')-Number(a.priority==='high'));
  return {cfg,appointments,next:future[0]||null,last:completed[0]||null,completed:completed.length,noShows:appointments.filter(item=>item.status==='no_show').length,cancelled:appointments.filter(item=>item.status==='cancelled').length,tasks,overdue:tasks.filter(item=>item.dueDate<today).length,financial:financial(data,patient.id)};
 }
 function filter(data,options={},today=TherapyData.dateKey(),now=new Date()){
  const search=fold(options.search).trim(),digits=phone(search),index=data.patients.map(patient=>({patient,...summary(data,patient,today,now)}));
  return index.filter(item=>{
   const p=item.patient,cfg=item.cfg;
   return (options.archived||!p.archived)&&(!options.alerts||['risco','atenção'].includes(p.risk))&&(!options.stage||options.stage==='all'||cfg.stage===options.stage)&&(!options.focus||options.focus==='all'||options.focus==='overdue'&&item.overdue>0||options.focus==='no_next'&&!item.next)&&(!search||fold([p.name,p.phone,p.email,cfg.preferredName,cfg.source,...cfg.tags].join(' ')).includes(search)||digits.length>=3&&phone(p.phone).includes(digits));
  }).sort((a,b)=>{
   if(options.alerts){const priority=Number(b.patient.risk==='risco')-Number(a.patient.risk==='risco');if(priority)return priority;}
   if(options.sort==='next'){const compare=(a.next?a.next.date+'T'+a.next.time:'9999').localeCompare(b.next?b.next.date+'T'+b.next.time:'9999');if(compare)return compare;}
   if(options.sort==='followup'){const compare=(a.tasks[0]?.dueDate||'9999').localeCompare(b.tasks[0]?.dueDate||'9999');if(compare)return compare;}
   return a.patient.name.localeCompare(b.patient.name,'pt-BR');
  });
 }
 function changeStage(patient,stage,reason='',id,date=new Date().toISOString()){
  if(!Object.hasOwn(stages,stage))throw new Error('Etapa de acompanhamento inválida.');
  const next=JSON.parse(JSON.stringify(patient)),cfg=read(next);
  if(cfg.stage!==stage){cfg.stageHistory.push({id,from:cfg.stage,to:stage,reason,date});cfg.stage=stage;}next.crm=normalize(cfg);next.updatedAt=date;return next;
 }
 function addContact(patient,item,nextTask=null){const next=JSON.parse(JSON.stringify(patient)),cfg=read(next);cfg.contacts.push(item);if(nextTask)cfg.tasks.push(nextTask);next.crm=normalize(cfg);return next;}
 function taskStatus(patient,id,status,date=new Date().toISOString()){const next=JSON.parse(JSON.stringify(patient)),cfg=read(next),task=cfg.tasks.find(item=>item.id===id);if(!task||!['open','done'].includes(status))throw new Error('Pendência inválida.');task.status=status;task.completedAt=status==='done'?date:null;next.crm=normalize(cfg);return next;}
 return {normalize,read,stages,channels,permissions,priorities,modalities,summary,financial,filter,changeStage,addContact,taskStatus,fold,phone};
})();
