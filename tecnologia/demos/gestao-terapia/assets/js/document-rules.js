/* Primeira etapa: documentos administrativos e cópia das orientações confirmadas. */
const TherapyDocumentRules=(()=>{
 const kinds={attendance:'Declaração de comparecimento',accompaniment:'Declaração de acompanhamento',orientation:'Orientação',referral:'Encaminhamento',consent:'Termo de ciência e consentimento',contract:'Contrato de prestação de serviços'};
 const clone=value=>JSON.parse(JSON.stringify(value));
 const text=(value,max=20000)=>{if(value==null)return '';if(typeof value!=='string'||value.length>max)throw Error('Conteúdo de documento inválido ou muito longo.');return value.trim();};
 const date=value=>{value=text(value,10);if(value&&(!/^\d{4}-\d{2}-\d{2}$/.test(value)||new Date(value+'T12:00:00').toISOString().slice(0,10)!==value))throw Error('Data do documento inválida.');return value;};
 const id=()=>crypto.randomUUID().replaceAll('-','');
 function validate(row){
  if(!Object.hasOwn(kinds,row.kind)||!['draft','completed','cancelled'].includes(row.status)||!Number.isInteger(row.version)||row.version<1||row.templateVersion!=='2026.11.04-1')throw Error('Documento incompatível. Atualize o sistema.');
  for(const key of ['title','purpose','requester','recipient','representative','place','body','cancellationReason'])if(row[key]!==undefined)text(row[key]);
  if(['attendance','accompaniment'].includes(row.kind)&&row.status!=='draft'){
   const f=row.facts;if(!f||!date(f.start)||!/^\d{2}:\d{2}$/.test(f.time)||!/^\d{2}:\d{2}$/.test(f.until)||f.time>=f.until||[f.time,f.until].some(t=>Number(t.slice(0,2))>23||Number(t.slice(3))>59)||row.kind==='accompaniment'&&(!date(f.end)||f.end<f.start||!text(f.frequency,150)))throw Error('Fatos da declaração incompletos.');
   const body=row.kind==='attendance'?`Declaro, para a finalidade indicada, que ${row.snapshot.patientName} compareceu a atendimento psicológico em ${f.start}, das ${f.time} às ${f.until}.`:`Declaro, para a finalidade indicada, que ${row.snapshot.patientName} está em acompanhamento psicológico no período de ${f.start} a ${f.end}, com periodicidade ${f.frequency}, das ${f.time} às ${f.until}.`;
   if(row.body!==body||row.title!==kinds[row.kind])throw Error('Declaração deve conter somente os fatos estruturados.');
  }
  date(row.date);if(!row.snapshot||typeof row.snapshot.patientName!=='string'||typeof row.snapshot.professionalName!=='string'||typeof row.snapshot.professionalId!=='string')throw Error('Identificação do documento inválida.');
  for(const value of Object.values(row.snapshot))text(value);
  if(!Array.isArray(row.history)||row.history.length>500||!Array.isArray(row.files)||row.files.length>12||!row.signature||!row.delivery)throw Error('Histórico ou anexos do documento inválidos.');
  for(const event of row.history)if(!event||!['created','completed','cancelled','attachment','signature','delivery'].includes(event.type)||!Number.isFinite(Date.parse(event.at))||typeof event.note!=='string')throw Error('Evento de documento inválido.');
  if(!['unsigned','paper','attached','verification_recorded'].includes(row.signature.status)||!['pending','sent','received'].includes(row.delivery.status))throw Error('Situação de assinatura ou entrega inválida.');
  text(row.signature.evidence);text(row.delivery.evidence);text(row.delivery.recipient);text(row.delivery.channel);
  const seen=new Set();for(const file of row.files){if(!file||!/^df_[a-f0-9]{32}$/.test(file.id)||seen.has(file.id)||!['signed','receipt','official'].includes(file.role)||!Number.isInteger(file.size)||file.size<5||file.size>5000000||! /^[a-f0-9]{64}$/.test(file.hash)||! /^[A-Za-z0-9+/]{43}=$/.test(file.key)||! /^[A-Za-z0-9+/]{16}$/.test(file.iv))throw Error('Referência de arquivo inválida.');text(file.name,200);seen.add(file.id);}
  if(['attached','verification_recorded'].includes(row.signature.status)&&!row.files.some(file=>file.id===row.signature.fileId&&file.role==='signed'))throw Error('Assinatura sem arquivo correspondente.');
  if(row.signature.status==='paper'&&!text(row.signature.evidence))throw Error('Identifique quem assinou e onde o original em papel está guardado.');
  if(row.signature.status==='verification_recorded'&&!text(row.signature.evidence))throw Error('Registre a evidência da conferência externa.');
  if(row.delivery.status!=='pending'&&(!text(row.delivery.recipient)||!text(row.delivery.channel)||!Number.isFinite(Date.parse(row.delivery.at))))throw Error('Entrega sem destinatário, canal ou data.');
  if(row.delivery.status==='received'&&!text(row.delivery.evidence))throw Error('Registre a confirmação de recebimento.');
  if(row.status!=='draft'&&(!text(row.title)||!text(row.purpose)||!text(row.requester)||!text(row.recipient)||!text(row.body)||!text(row.snapshot.patientName)||!text(row.snapshot.professionalName)||!text(row.snapshot.professionalId)||!date(row.date)||!text(row.place)||!Number.isFinite(Date.parse(row.completedAt))))throw Error('Documento concluído sem identificação, conteúdo ou finalidade.');
  if(row.status==='cancelled'&&!text(row.cancellationReason))throw Error('Informe o motivo do cancelamento.');
  if(row.source&&(!['prescriptions'].includes(row.source.collection)||! /^[a-zA-Z0-9_-]+$/.test(row.source.id)))throw Error('Origem do documento inválida.');
  return row;
 }
 function create(data,input,previous=null){
  const patient=data.patients.find(p=>p.id===input.patientId);if(!patient||patient.archived)throw Error('Selecione um paciente ativo.');
  if(!Object.hasOwn(kinds,input.kind))throw Error('Selecione a modalidade.');
  const now=new Date().toISOString(),row={id:id(),patientId:patient.id,kind:input.kind,status:'draft',version:previous?previous.version+1:1,templateVersion:'2026.11.04-1',createdAt:now,date:date(input.date),title:text(input.title,200),purpose:text(input.purpose,2000),requester:text(input.requester,300),recipient:text(input.recipient,300),representative:text(input.representative,300),place:text(input.place,300),body:text(input.body),snapshot:{patientName:patient.name,professionalName:text(input.professionalName,200),professionalId:text(input.professionalId,100),clinicName:text(data.settings.clinicName,200)},history:[{type:'created',at:now,note:previous?'Nova versão: '+text(input.reason,1000):'Rascunho criado'}],files:[],signature:{status:'unsigned'},delivery:{status:'pending'}};
  if(previous&&data.documents.some(row=>row.previousId===previous.id))throw Error('Já existe uma nova versão vinculada. Abra a versão mais recente para corrigir.');
  if(previous){if(previous.status==='draft'||previous.patientId!==patient.id||previous.kind!==row.kind||!text(input.reason,1000))throw Error('Informe o motivo da nova versão do mesmo paciente e modalidade.');row.previousId=previous.id;}
  if(['orientation','referral'].includes(row.kind)){
   const source=data.prescriptions.find(p=>p.id===input.sourceId&&p.patientId===patient.id),copy=source&&TherapyGuidanceRules.copyForRecipient(data,source.id);
   if(!copy||source.kind!==(row.kind==='referral'?'referral':'orientation'))throw Error('Escolha uma orientação/encaminhamento confirmado do mesmo paciente.');
   row.source={collection:'prescriptions',id:source.id};row.body=copy.content;row.title=copy.title||kinds[row.kind];
  }
  return validate(row);
 }
 function complete(row,confirmed){if(row.status!=='draft')throw Error('Esta versão já foi concluída.');if(!confirmed)throw Error('Confirme a revisão profissional do conteúdo e dos fatos declarados.');row=clone(row);row.status='completed';row.completedAt=new Date().toISOString();row.history.push({type:'completed',at:row.completedAt,note:'Revisão e fatos confirmados pelo profissional'});return validate(row);}
 function cancel(row,reason){if(row.status!=='completed')throw Error('Somente documentos concluídos podem ser cancelados.');row=clone(row);row.status='cancelled';row.cancellationReason=text(reason,1000);row.history.push({type:'cancelled',at:new Date().toISOString(),note:row.cancellationReason});return validate(row);}
 function validateAll(data){
  const fileIds=new Set(),parents=new Set();
  for(const row of data.documents){
   if(!Number.isFinite(Date.parse(row.createdAt)))throw Error('Data de criação do documento inválida.');
   if(row.previousId){const parent=data.documents.find(item=>item.id===row.previousId);if(!parent||parent.status==='draft'||parent.patientId!==row.patientId||parent.kind!==row.kind||row.version!==parent.version+1||parents.has(row.previousId))throw Error('Encadeamento de versões do documento inválido.');parents.add(row.previousId);}else if(row.version!==1)throw Error('Versão sem documento anterior.');
   if(row.source){const source=data.prescriptions.find(item=>item.id===row.source.id);if(source&&source.patientId!==row.patientId)throw Error('Origem do documento pertence a outro paciente.');}
   for(const file of row.files){if(fileIds.has(file.id))throw Error('Arquivo repetido em documentos diferentes.');fileIds.add(file.id);}
  }
 }
 function guard(previous,next){
  for(const old of previous||[]){const row=next.find(item=>item.id===old.id);if(!row)throw Error('Documentos não podem ser apagados. Preserve o histórico.');if(old.status==='draft'){if(old.patientId!==row.patientId||old.kind!==row.kind||old.createdAt!==row.createdAt)throw Error('Paciente e modalidade originais do rascunho devem ser preservados.');continue;}
   const immutable=value=>{const copy=clone(value);for(const key of ['status','cancellationReason','history','files','signature','delivery'])delete copy[key];return JSON.stringify(copy);};
   if(immutable(old)!==immutable(row)||old.status==='cancelled'&&(row.status!=='cancelled'||row.cancellationReason!==old.cancellationReason)||!['completed','cancelled'].includes(row.status)||JSON.stringify(row.history.slice(0,old.history.length))!==JSON.stringify(old.history)||JSON.stringify(row.files.slice(0,old.files.length))!==JSON.stringify(old.files))throw Error('Versão concluída imutável. Crie uma nova versão para corrigir.');
  }
 }
 return {kinds,create,complete,cancel,validate,validateAll,guard,clone};
})();
