/* Suporte administrativo: sem leitura do prontuário e sem textos em armazenamento persistente. */
const TherapySupport=(()=>{
 const R=TherapySupportRules,el=id=>document.getElementById(id);
 let owner='',serial=0,tickets=[],active=null,draft={},reply='',queue=[],busy=false,initialized=false,lastUnread=null,timer=null;
 const identity=()=>[localStorage.getItem('terapia_license')||'',localStorage.getItem('terapia_device')||''].join('|');
 const ready=()=>window.therapyLicenseReady&&typeof TherapyVault!=='undefined'&&TherapyVault.isOpen();
 const requestId=()=>crypto.randomUUID();
 const notice=text=>{const node=el('support-network-state');if(node)node.textContent=text;};
 function reset(){
  serial++;owner='';tickets=[];active=null;draft={};reply='';queue=[];busy=false;lastUnread=null;
  for(const id of ['support-input-subject','support-input-message','support-reply-input'])if(el(id))el(id).value='';
  for(const id of ['support-tickets-list','support-chat-messages','support-detail-subject','support-detail-id'])if(el(id))el(id).replaceChildren();
  updateBadge(0);updateQueue();notice('');
 }
 function checkIdentity(){if(owner!==identity()){reset();owner=identity();}return owner;}
 async function apiRequest(action,payload={}){
  if(!ready())throw Error('Abra o cofre para acessar seus chamados.');
  const started=checkIdentity(),version=serial;
  const [license,device_id]=started.split('|');
  if(!license||!device_id)throw Error('Ative a licença neste dispositivo para usar o suporte.');
  const url=location.pathname.includes('/sistemas/')?'../../api_suporte.php':'../api_suporte.php';
  const browser=/Edg\//.test(navigator.userAgent)?'Edge':/Firefox\//.test(navigator.userAgent)?'Firefox':/Chrome\//.test(navigator.userAgent)?'Chrome':/Safari\//.test(navigator.userAgent)?'Safari':'Outro';
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,license,device_id,system_id:'gestao-terapia',app_version:TherapySystem.version(),diagnostic:{browser,theme:document.documentElement.classList.contains('dark')?'dark':'light'},...payload})});
  const data=await response.json().catch(()=>null);
  if(started!==identity()||serial!==version||!ready())throw Error('O acesso mudou. Abra novamente o suporte.');
  if(!response.ok||!data||data.status!=='success'){const error=Error(data?.message||'Falha na comunicação com o suporte.');error.status=response.status;throw error;}
  return data;
 }
 function updateBadge(count){const badge=el('support-unread-badge');if(!badge)return;badge.textContent=count?String(count):'';badge.classList.toggle('hidden',!count);badge.setAttribute('aria-label',count+' chamados com resposta');}
 function updateQueue(){
  const state=el('support-queue-state');if(state)state.textContent=queue.length?queue.length+' envio(s) aguardando confirmação. Ao reconectar, tentaremos a mesma operação, sem duplicar.':'';
  const retry=el('support-retry-btn');if(retry){retry.hidden=!queue.length;retry.disabled=busy;}
  const createPending=queue.some(item=>item.action==='create'),replyPending=queue.some(item=>item.action==='reply');
  for(const id of ['support-input-subject','support-input-message','support-input-category'])if(el(id))el(id).disabled=createPending;
  if(el('support-submit-btn'))el('support-submit-btn').disabled=createPending;
  if(el('support-send-reply-btn'))el('support-send-reply-btn').disabled=replyPending;
  if(el('support-reply-input'))el('support-reply-input').disabled=replyPending;
 }
 async function checkUnread(){
  if(!ready()||!navigator.onLine||document.visibilityState==='hidden')return;
  try{const result=await apiRequest('unread_count');const count=result.unread_count||0;updateBadge(count);
   if(lastUnread!==null&&count>lastUnread&&typeof therapyNotice==='function')therapyNotice('Você tem uma nova resposta no Suporte.');
   lastUnread=count;
  }catch(error){if(error.status===403)reset();}
 }
 function renderList(){
  const list=el('support-tickets-list');if(!list)return;
  list.innerHTML=tickets.length?tickets.map(ticket=>{const status=R.statusInfo(ticket.status);return '<button type="button" class="support-ticket-card '+(ticket.unread?'has-unread':'')+'" data-support-id="'+R.escapeHtml(ticket.id)+'"><span class="support-ticket-meta"><span>'+R.escapeHtml(ticket.id)+'</span><span class="support-badge-status support-badge-'+status.tone+'">'+R.escapeHtml(status.label)+'</span><span>'+R.escapeHtml(R.formatDate(ticket.updated_at))+'</span></span><strong>'+R.escapeHtml(ticket.subject)+'</strong><span>'+R.escapeHtml(R.categoryLabel(ticket.category))+(ticket.unread?' · Nova resposta':'')+'</span></button>';}).join(''):'<p class="system-card">Nenhum chamado encontrado. Use Abrir novo chamado para falar com o suporte.</p>';
 }
 async function loadTickets(){
  if(!ready())return;checkIdentity();
  try{const result=await apiRequest('list');tickets=result.tickets||[];renderList();updateBadge(result.unread_count||0);notice(navigator.onLine?'Chamados atualizados.':'Sem conexão. A lista pode estar desatualizada.');}
  catch(error){notice(error.message);if(error.status===403)reset();else renderList();}
 }
 function showList(){if(active&&reply&&!queue.length&&!confirm('Descartar a resposta não enviada e voltar à lista?'))return;if(!queue.length){reply='';el('support-reply-input').value='';}el('support-view-new').classList.add('hidden');el('support-view-detail').classList.add('hidden');el('support-view-list').classList.remove('hidden');active=null;renderList();}
 function showNewForm(){
  checkIdentity();if(!ready())return;
  el('support-view-list').classList.add('hidden');el('support-view-detail').classList.add('hidden');el('support-view-new').classList.remove('hidden');active=null;
  el('support-input-subject').value=draft.subject||'';el('support-input-message').value=draft.message||'';el('support-input-category').value=draft.category||'duvida';el('support-input-subject').focus();updateQueue();
 }
 function renderChat(messages){
  const chat=el('support-chat-messages');
  chat.innerHTML=messages.map(message=>'<article class="support-message '+(message.from==='user'?'is-user':'')+'"><p class="support-message-author">'+R.escapeHtml(message.from==='user'?'Você':message.author||'Suporte')+' · '+R.escapeHtml(R.formatDate(message.created_at))+'</p><div class="support-msg-bubble '+(message.from==='user'?'support-msg-user':'support-msg-support')+'">'+R.escapeHtml(message.body)+'</div></article>').join('');
 }
 function displayTicket(ticket){
  el('support-detail-id').textContent=ticket.id;el('support-detail-subject').textContent=ticket.subject;
  const status=R.statusInfo(ticket.status),badge=el('support-detail-status');badge.textContent=status.label;badge.className='support-badge-status support-badge-'+status.tone;
  el('support-reply-box').hidden=ticket.status==='closed';el('support-close-ticket-btn').hidden=ticket.status==='closed';
  renderChat(ticket.messages||[]);
 }
 async function openTicket(id,focus=true){
  if(!ready())return;
  if(active&&active!==id&&reply&&!confirm('Há uma resposta não enviada. Descartar para abrir outro chamado?'))return;
  if(active!==id){reply='';el('support-reply-input').value='';}active=id;
  el('support-view-list').classList.add('hidden');el('support-view-new').classList.add('hidden');el('support-view-detail').classList.remove('hidden');
  try{const result=await apiRequest('get',{ticket_id:id});if(active!==id)return;displayTicket(result.ticket);if(focus){el('support-detail-subject').tabIndex=-1;el('support-detail-subject').focus();}await checkUnread();}
  catch(error){notice(error.message);}
 }
 async function flush(){
  if(busy||!queue.length||!ready())return;
  checkIdentity();if(!queue.length)return;
  if(!navigator.onLine){notice('Sem conexão. O envio permanece nesta aba; não feche nem bloqueie antes de conferir.');return;}
  const version=serial;busy=true;updateQueue();
  try{
   while(queue.length){
    const operation=queue[0];
    try{
     const result=await apiRequest(operation.action,operation.payload);
     if(queue[0]!==operation)break;queue.shift();
     if(operation.action==='create'){draft={};el('support-input-subject').value='';el('support-input-message').value='';await loadTickets();await openTicket(result.ticket_id);}
     else{reply='';el('support-reply-input').value='';if(active===operation.payload.ticket_id)displayTicket(result.ticket);await loadTickets();}
     notice('Envio confirmado pelo suporte.');updateQueue();
    }catch(error){if(queue[0]!==operation)break;notice((error.status?error.message:'Conexão interrompida.')+' '+(!error.status||error.status>=500||error.status===429?'O envio está pendente; você pode tentar novamente.':'Confira o texto e tente novamente.'));
     if(error.status&&error.status<500&&error.status!==429){queue.shift();updateQueue();}
     break;
    }
   }
  }finally{if(version===serial){busy=false;updateQueue();}}
 }
 async function submitNewTicket(event){
  event?.preventDefault();checkIdentity();if(!ready()||queue.some(item=>item.action==='create'))return;
  try{draft=R.validateTicket({subject:el('support-input-subject').value,message:el('support-input-message').value,category:el('support-input-category').value});queue.push({action:'create',payload:{...draft,client_request_id:requestId()}});updateQueue();await flush();}
  catch(error){notice(error.message);}
 }
 async function sendReply(){
  checkIdentity();if(!active||!ready()||queue.some(item=>item.action==='reply'))return;
  try{reply=R.validateReply(el('support-reply-input').value);queue.push({action:'reply',payload:{ticket_id:active,message:reply,client_request_id:requestId()}});updateQueue();await flush();}
  catch(error){notice(error.message);}
 }
 async function closeCurrentTicket(){
  if(queue.length||reply){notice('Confirme o envio pendente antes de encerrar o chamado.');return;}
  if(!active||!confirm('Encerrar este chamado? O histórico será preservado.'))return;
  try{const result=await apiRequest('close',{ticket_id:active});displayTicket(result.ticket);await loadTickets();}catch(error){notice(error.message);}
 }
 function init(){
  if(initialized)return;initialized=true;
  // Remove somente o antigo cache de suporte em texto aberto, nunca o cofre.
  for(const key of ['terapia_support_cache','terapia_support_draft'])try{localStorage.removeItem(key);}catch{}
  for(const id of ['support-input-subject','support-input-message','support-input-category'])el(id)?.addEventListener('input',()=>{checkIdentity();draft={subject:el('support-input-subject').value,message:el('support-input-message').value,category:el('support-input-category').value};});
  el('support-reply-input')?.addEventListener('input',()=>{reply=el('support-reply-input').value;});
  el('support-tickets-list')?.addEventListener('click',event=>{const button=event.target.closest('[data-support-id]');if(button)openTicket(button.dataset.supportId);});
  window.addEventListener('online',()=>{flush();checkUnread();});
  window.addEventListener('offline',()=>notice('Sem conexão. Rascunhos e envios pendentes ficam somente nesta aba aberta.'));
  window.addEventListener('storage',event=>{if(['terapia_license','terapia_device'].includes(event.key))reset();});
  window.addEventListener('beforeunload',event=>{if(queue.length||draft.message||reply){event.preventDefault();event.returnValue='';}});
  document.addEventListener('therapy-vault-locked',reset);document.addEventListener('therapy-data-restored',reset);document.addEventListener('therapy-license-unlocked',()=>{checkIdentity();checkUnread();});
  timer=setInterval(()=>{if(!ready()){if(owner)reset();return;}checkIdentity();checkUnread();if(active&&!el('view-support').classList.contains('hide')&&navigator.onLine)openTicket(active,false);},30000);
 }
 function render(){init();if(!ready())return;checkIdentity();showList();loadTickets();}
 document.addEventListener('DOMContentLoaded',init);
 return {init,render,refresh:loadTickets,showNewForm,showList,openTicket,submitNewTicket,sendReply,closeCurrentTicket,checkUnread,retry:flush,reset};
})();
