/* Rotina do profissional autônomo. Regras puras; nenhuma mensagem ou pagamento é enviado. */
const TherapyAssistantRules=(()=>{
 const copy=value=>JSON.parse(JSON.stringify(value)),validId=id=>typeof id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(id);
 const palettes={blue:['Azul Sereno','#1D4ED8','#1E40AF','#93C5FD','29,78,216','59,130,246'],indigo:['Índigo Mente','#4338CA','#3730A3','#A5B4FC','67,56,202','165,180,252'],teal:['Verde Petróleo','#0F766E','#115E59','#5EEAD4','15,118,110','45,212,191'],green:['Verde Sálvia','#15803D','#166534','#86EFAC','21,128,61','34,197,94'],emerald:['Esmeralda Terapia','#047857','#065F46','#6EE7B7','4,120,87','110,231,183'],violet:['Lavanda Acolhedor','#6D28D9','#5B21B6','#C4B5FD','109,40,217','167,139,250'],rose:['Rosa Empatia','#BE185D','#9D174D','#F9A8D4','190,24,93','244,114,182'],terracotta:['Terracota Presença','#C2410C','#9A3412','#FDBA74','194,65,12','253,186,116'],amber:['Âmbar Acolhimento','#B45309','#92400E','#FCD34D','180,83,9','252,211,77'],slate:['Grafite Sóbrio','#475569','#334155','#CBD5E1','71,85,105','203,213,225']};
 const labels={confirmation:'Confirmação de horário',payment:'Lembrete financeiro',package:'Próximos horários / pacote',followup:'Contato de retorno'};
 const defaults={confirmationDays:1,backupDays:7,palette:'blue',logo:'',signature:'',templates:{confirmation:'Olá, {nome}! Podemos confirmar nosso horário de {data}, às {hora}?\n{assinatura}',payment:'Olá, {nome}! Gostaria de conferir o pagamento previsto para {data}, no valor de {valor}. Caso já tenha realizado, por favor me avise.\n{assinatura}',package:'Olá, {nome}! Podemos combinar a organização dos próximos horários?\n{assinatura}',followup:'Olá, {nome}! Estou entrando em contato para combinarmos nosso retorno. Qual o melhor horário para conversarmos?\n{assinatura}'},recurring:[]};
 const text=(value,max)=>{if(typeof value!=='string'||value.length>max)throw new Error('Confira os textos e limites do assistente.');return value.trim();};
 const validMonth=value=>typeof value==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(value)&&Number(value.slice(0,4))>=1900&&Number(value.slice(0,4))<=2199;
 function settings(source={}){
  if(!source||typeof source!=='object'||Array.isArray(source))throw new Error('Preferências do assistente inválidas.');
  const cfg={...copy(defaults),...copy(source),templates:{...defaults.templates,...source.templates}};
  if(![0,1,2,3,7].includes(cfg.confirmationDays)||![1,3,7,14,30].includes(cfg.backupDays)||!Object.hasOwn(palettes,cfg.palette))throw new Error('Confira os prazos e a cor do assistente.');
  cfg.signature=text(cfg.signature,200);cfg.logo=text(cfg.logo,180000);
  if(cfg.logo&&!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/.test(cfg.logo))throw new Error('Use uma imagem PNG, JPG ou WebP válida para o consultório.');
  for(const key of Object.keys(labels)){
   cfg.templates[key]=text(cfg.templates[key],1500);if(!cfg.templates[key])throw new Error('Preencha todos os modelos de mensagem.');
   for(const match of cfg.templates[key].matchAll(/\{([^{}]+)\}/g))if(!['nome','data','hora','valor','assinatura'].includes(match[1]))throw new Error('Campo desconhecido no modelo: {'+match[1]+'}.');
  }
  if(!Array.isArray(cfg.recurring)||cfg.recurring.length>100)throw new Error('Limite de 100 regras de despesas recorrentes.');
  const ids=new Set();cfg.recurring=cfg.recurring.map(rule=>{
   if(!rule||!validId(rule.id)||ids.has(rule.id)||!Number.isInteger(rule.day)||rule.day<1||rule.day>31||typeof rule.enabled!=='boolean'||!validMonth(rule.start)||rule.end&&(!validMonth(rule.end)||rule.end<rule.start)||!Number.isFinite(rule.amount)||rule.amount<=0||rule.amount>999999999.99)throw new Error('Confira os dados da despesa recorrente.');
   ids.add(rule.id);const description=text(rule.description,300);if(!description||Math.round(rule.amount*100)<=0)throw new Error('Informe a descrição e um valor de pelo menos R$ 0,01.');
   return {id:rule.id,description,amount:Math.round(rule.amount*100)/100,day:rule.day,start:rule.start,end:rule.end||'',enabled:rule.enabled};
  });return cfg;
 }
 function plusDays(day,days){const date=new Date(day+'T12:00:00');date.setDate(date.getDate()+days);return TherapyData.dateKey(date);}
 function queue(data,{today=TherapyData.dateKey(),now=new Date(),backupAt=null}={}){
  const cfg=settings(data.settings?.assistant),patients=new Map(data.patients.filter(p=>!p.archived).map(p=>[p.id,p])),rows=[];
  const add=(kind,recordId,patientId,title,date,action,message='',extra={})=>{
   if(patientId&&!patients.has(patientId))return;
   const patient=patients.get(patientId),key=kind+':'+action+':'+recordId;
   rows.push({key,kind,recordId,patientId:patientId||null,name:patient?.name||'Consultório',title,date:date||today,action,message,...extra,contacted:!!patient&&TherapyPatientRules.read(patient).contacts.some(c=>c.assistantKey===key&&c.date===today)});
  };
  const time=TherapyData.dateKey(now)===today?String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0'):'00:00';
  for(const a of data.appointments)if((a.status||'scheduled')==='scheduled'&&a.date>=today&&a.date<=plusDays(today,cfg.confirmationDays)&&(a.date>today||a.time>=time))add('agenda',a.id,a.patientId,'Confirmar horário',a.date,'appointment','confirmation',{time:a.time});
  const drafts=new Set((data.sessionDrafts||[]).map(d=>d.appointmentId).filter(Boolean));
  for(const a of TherapySessionRules.queue(data,today,now))if(!drafts.has(a.id))add('records',a.id,a.patientId,a.recovery?'Concluído sem anotação':'Conferir atendimento e registro',a.date,'record');
  for(const d of data.sessionDrafts||[])add('records',d.id,d.patientId,'Retomar rascunho de sessão',d.date,'draft');
  for(const p of patients.values())for(const task of TherapyPatientRules.read(p).tasks)if(task.status==='open'&&task.dueDate<=today)add('returns',task.id,p.id,'Retorno pendente',task.dueDate,'task','followup');
  for(const p of data.treatments)if(!p.archived&&p.status==='active'&&p.plan?.reviewDate&&p.plan.reviewDate<=today)add('returns',p.id,p.patientId,'Revisar plano terapêutico',p.plan.reviewDate,'treatment');
  for(const a of data.assessments)if(!a.archived){const meta=TherapyAssessmentRules.meta(a.evaluation);if(meta.status==='draft')add('records',a.id,a.patientId,'Retomar rascunho de avaliação',String(a.date||'').slice(0,10),'assessment');else if(meta.reviewDate&&meta.reviewDate<=today&&(meta.reviewStatus||'pending')==='pending')add('returns',a.id,a.patientId,'Conferir reavaliação prevista',meta.reviewDate,'assessment');}
  for(const o of data.prescriptions)if(!o.archived){const meta=TherapyGuidanceRules.meta(o.guidance);if(meta.status==='draft')add('records',o.id,o.patientId,'Retomar rascunho de orientação',String(o.start||'').slice(0,10),'orientation');else if(TherapyGuidanceRules.due(o,today))add('returns',o.id,o.patientId,'Conferir entrega ou retorno',meta.followupDate,'orientation');}
  for(const f of data.financial)if(TherapyManagementRules.status(f)==='pending'&&TherapyManagementRules.dueDate(f)&&TherapyManagementRules.dueDate(f)<=today)add('finance',f.id,TherapyManagementRules.owner(data,f),f.type==='income'?'Conferir recebimento':'Conferir conta a pagar',TherapyManagementRules.dueDate(f),'financial',f.type==='income'?'payment':'',{amount:f.amount});
  for(const p of data.packages){const info=TherapyManagementRules.packageInfo(data,p,today);if(!p.voided&&((info.state==='active'&&info.balance<=1)||info.state==='exhausted'||info.state==='expired'&&info.balance>0))add('finance',p.id,p.patientId,info.state==='expired'?'Conferir validade do pacote':info.balance?'Pacote com uma sessão disponível':'Pacote sem sessões disponíveis',today,'package','package');}
  const stamp=backupAt&&new Date(backupAt),stampDay=stamp&&Number.isFinite(stamp.getTime())?TherapyData.dateKey(stamp):'',last=stampDay&&stampDay<=today?stampDay:'';
  if(!last||plusDays(last,cfg.backupDays)<=today)add('system','backup',null,'Conferir backup protegido',last?plusDays(last,cfg.backupDays):today,'backup');
  return rows.sort((a,b)=>a.date.localeCompare(b.date)||a.name.localeCompare(b.name,'pt-BR')||a.key.localeCompare(b.key));
 }
 function compose(data,row){
  const patient=data.patients.find(p=>p.id===row.patientId&&!p.archived);if(!patient||!Object.hasOwn(labels,row.message))throw new Error('Confira o paciente e a pendência antes de preparar a mensagem.');
  const cfg=settings(data.settings?.assistant),crm=TherapyPatientRules.read(patient);
  const values={nome:(crm.preferredName||patient.name).trim().split(/\s+/)[0],data:TherapyAgendaRules.validDate(row.date)?row.date.split('-').reverse().join('/'):'',hora:row.time||'',valor:row.amount==null?'':Number(row.amount).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}),assinatura:cfg.signature||data.settings.clinicName||''};
  return cfg.templates[row.message].replace(/\{(nome|data|hora|valor|assinatura)\}/g,(_,key)=>values[key]);
 }
 function whatsappNumber(phone){
  const raw=String(phone||'').trim();if(/[A-Za-z]/.test(raw))throw new Error('Confira o telefone e o DDI do paciente.');
  let number=raw.replace(/\D/g,'');if(!raw.startsWith('+')&&!(number.startsWith('55')&&[12,13].includes(number.length))){if([10,11].includes(number.length))number='55'+number;else throw new Error('Informe o telefone com DDD ou com +DDI para outros países.');}
  if(!/^[1-9]\d{7,14}$/.test(number))throw new Error('Confira o telefone do paciente.');return number;
 }
 function contact(data,row,today=TherapyData.dateKey()){
  const next=copy(data),patient=next.patients.find(p=>p.id===row.patientId&&!p.archived);if(!patient||!Object.hasOwn(labels,row.message))throw new Error('Contato não disponível para esta pendência.');
  const crm=TherapyPatientRules.read(patient);if(crm.permission==='restricted')throw new Error('Há restrição de contato registrada. Revise a ficha antes de prosseguir.');
  if(crm.contacts.some(c=>c.assistantKey===row.key&&c.date===today))return next;
  patient.crm=TherapyPatientRules.addContact(patient,{id:getID(),date:today,channel:'whatsapp',summary:labels[row.message]+' · envio informado pelo profissional',note:'Registro manual. Não comprova entrega, leitura, confirmação do horário ou pagamento.',assistantKey:row.key,createdAt:new Date().toISOString()}).crm;
  return next;
 }
 function recurringPreview(data,month){
  if(!validMonth(month))throw new Error('Escolha um mês válido.');const cfg=settings(data.settings?.assistant),last=new Date(Number(month.slice(0,4)),Number(month.slice(5)),0).getDate();
  return cfg.recurring.filter(rule=>rule.enabled&&rule.start<=month&&(!rule.end||month<=rule.end)).map(rule=>({ruleId:rule.id,id:'rec_'+rule.id+'_'+month.replace('-',''),description:rule.description,amount:rule.amount,date:month+'-01',dueDate:month+'-'+String(Math.min(rule.day,last)).padStart(2,'0'),existing:data.financial.some(f=>f.id==='rec_'+rule.id+'_'+month.replace('-','')||f.recurringRuleId===rule.id&&f.recurringMonth===month)}));
 }
 function generateRecurring(data,month){
  let next=copy(data);for(const item of recurringPreview(data,month).filter(item=>!item.existing)){
   next=TherapyManagementRules.create(next,{id:item.id,type:'expense',description:item.description,amount:item.amount,date:item.date,dueDate:item.dueDate,category:'Recorrente',paymentStatus:'pending',paymentMethod:'unknown'});
   const saved=next.financial.find(f=>f.id===item.id);saved.recurringRuleId=item.ruleId;saved.recurringMonth=month;
  }return next;
 }
 return {settings,defaults,labels,palettes,queue,compose,whatsappNumber,contact,recurringPreview,generateRecurring,validMonth};
})();
