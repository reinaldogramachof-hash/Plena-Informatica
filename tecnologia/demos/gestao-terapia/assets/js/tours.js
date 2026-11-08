/* Tours opcionais: navegação por APIs existentes, sem preenchimento ou gravação automática. */
const TherapyTours=(()=>{
 const D=TherapyTourData,R=TherapyTourRules,catalog=D.all(),key='terapia_guides_v1';
 const el=id=>document.getElementById(id),esc=value=>sanitizeHTML(String(value??''));
 let progress=R.empty(),storage=true,active=null,serial=0,scheduled=false,opener=null,libraryArea='',libraryQuery='',libraryStatus='',installed=false,highlighted=null,context=null;
 const currentView=()=>document.querySelector('.view-section:not(.hide)')?.id.replace('view-','')||'';
 const ready=()=>typeof TherapyVault!=='undefined'&&TherapyVault.isOpen()&&!!window.therapyLicenseReady&&!!el('view-login')?.classList.contains('hide');
 const visible=node=>!!node?.isConnected&&!node.closest('[hidden],.hide,.hidden,[inert]')&&!!node.getClientRects().length;
 function modal(){return [...document.querySelectorAll('.therapy-overlay,.therapy-modal-work')].filter(visible).map((node,index)=>({node,index,z:parseInt(getComputedStyle(node).zIndex)||0})).sort((a,b)=>a.z-b.z||a.index-b.index).at(-1)?.node||null;}
 function credentialDialog(){const m=modal();return !!m?.querySelector('input[type=password],#activation-form,#system-reset-form');}
 function load(){try{progress=R.normalize(JSON.parse(localStorage.getItem(key)||'null'),catalog);for(const entry of Object.values(progress.entries))if(entry.status==='in_progress')entry.status='paused';storage=true;}catch{progress=R.empty();storage=false;}}
 function persist(){progress=R.normalize(progress,catalog);try{localStorage.setItem(key,JSON.stringify(progress));storage=true;}catch{storage=false;}}
 function saveState(status){if(!active)return;progress=R.update(progress,catalog,active.guide.id,active.index,status);persist();}
 function button(label,action,value='',secondary=true){return `<button type="button" class="${secondary?'therapy-secondary':'therapy-primary'}" data-tour-action="${action}" data-tour-value="${esc(value)}">${esc(label)}</button>`;}
 function panel(){let node=el('therapy-tour-panel');if(!node){node=document.createElement('section');node.id='therapy-tour-panel';node.className='therapy-tour-panel';node.setAttribute('role','region');node.setAttribute('aria-label','Guia de uso');node.tabIndex=-1;document.body.appendChild(node);}return node;}
 function clearTarget(){highlighted?.classList.remove('therapy-tour-target');highlighted=null;}
 function targetFor(step){if(!step?.target)return null;const node=document.querySelector(step.target),m=modal();return visible(node)&&(!m||m.contains(node))?node:null;}
 function mount(node){const m=modal();node.classList.toggle('is-in-modal',!!m);const parent=m?(m.querySelector('.therapy-dialog')||m.firstElementChild||m):document.body;
  if(node.parentElement!==parent){if(m){const heading=parent.querySelector(':scope>h2,:scope>h3,:scope>div:first-child');if(heading&&heading.parentElement===parent)heading.after(node);else parent.prepend(node);}else parent.appendChild(node);}
 }
 function removePanel(){clearTarget();el('therapy-tour-panel')?.remove();context=null;}
 function storageNote(){return storage?'Progresso de aprendizado neste navegador, separado dos registros.':'O progresso não pôde ser guardado. O guia continua disponível nesta abertura.';}
 function revealTarget(){
  if(!active||active.paused||modal())return;const target=targetFor(active.guide.steps[active.index]),dock=el('therapy-tour-panel');if(!target||!dock)return;
  const rect=target.getBoundingClientRect(),box=dock.getBoundingClientRect();if(rect.height>140||rect.right<=box.left||rect.left>=box.right||rect.bottom<=box.top-12||rect.top>=box.bottom)return;
  let parent=target.parentElement;while(parent&&!(parent.scrollHeight>parent.clientHeight&&/auto|scroll/.test(getComputedStyle(parent).overflowY)))parent=parent.parentElement;
  (parent||document.scrollingElement)?.scrollBy({top:rect.bottom-box.top+12,behavior:'instant'});
 }
 function render(){
  if(!ready()){removePanel();return;}
  if(!active)return;
  const node=panel();if(credentialDialog()){node.hidden=true;clearTarget();return;}node.hidden=false;mount(node);
  const g=active.guide,s=g.steps[active.index],target=targetFor(s),nextTarget=active.paused?null:target;
  if(highlighted!==nextTarget){clearTarget();highlighted=nextTarget;highlighted?.classList.add('therapy-tour-target');}
  context={view:currentView(),modal:modal(),target,paused:active.paused,credential:false};
  const focused=node.contains(document.activeElement)?{id:document.activeElement.id,action:document.activeElement.dataset.tourAction}:null;
  const last=active.index===g.steps.length-1;
  const completion=R.completed(g,{proof:active.proof,external:active.external,target:!!target});
  const missing=!target?'<p class="tour-hint">O elemento desta etapa não está visível. Abra-o pelos controles normais ou use a opção disponível abaixo. Em lista vazia, consulte o artigo antes de criar qualquer registro.</p>':'';
  const waiting=last&&!completion?(g.intent?.length?'A operação esperada ainda não foi confirmada durante este guia. Confira mensagens e formulários; não repita uma gravação já realizada só para encerrar a orientação.':'Confira a tela ou o arquivo antes de encerrar esta tarefa.'):'';
  node.classList.toggle('is-collapsed',!!active.collapsed);
  node.innerHTML=`<header><div><small>${g.kind==='intro'?'Conhecer esta tela':g.kind==='reference'?'Entender a tarefa':'Fazer uma tarefa'} · ${active.index+1} de ${g.steps.length}</small><h2 id="therapy-tour-title">${esc(g.title)}</h2></div>${button(active.collapsed?'Expandir':'Recolher','collapse')}</header><div class="tour-body" ${active.collapsed?'hidden':''}><p class="tour-status" role="status">${esc(active.paused?'Guia pausado. '+(active.reason||'Você pode retomar quando desejar.'):active.feedback||'Você controla as ações do aplicativo.')}</p><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${missing}${s.action?button(actionLabel(s.action),'navigate',s.action):''}${last&&g.external?'<label class="tour-confirm"><input id="tour-external-confirm" type="checkbox" '+(active.external?'checked':'')+'>Conferi o resultado fora do aplicativo. Não apenas solicitei a operação.</label>':''}${waiting?`<p class="tour-hint">${esc(waiting)}</p>`:''}<div class="tour-actions">${active.paused?button('Retomar','resume-current','',false):`${active.index?button('Voltar','back'):''}${button(last?(completion==='done'?'Concluir tarefa':completion==='reviewed'?'Concluir conferência':'Concluir orientação'):'Próximo','next','',false)}`}${button('Ver no Manual','article',g.id)}</div>${last&&g.intent?.length&&!active.proof?button('Encerrar como orientação consultada','reviewed'):''}<div class="tour-actions tour-secondary">${button('Retomar depois','pause')}${button('Sair do guia','exit')}${button('Pular guia','skip')}</div><small class="tour-storage">${storageNote()}</small></div>`;
  node.setAttribute('aria-labelledby','therapy-tour-title');
  node.querySelector('[data-tour-action=next]')?.toggleAttribute('disabled',last&&!completion);
  if(focused){const replacement=focused.id?el(focused.id):node.querySelector('[data-tour-action="'+focused.action+'"]');(replacement&&!replacement.disabled?replacement:node).focus({preventScroll:true});}
 }
 function actionLabel(code){return ({'open:patient':'Abrir novo cadastro','open:appointment':'Abrir nova marcação','open:session':'Abrir anotação avulsa','open:treatment':'Abrir novo plano','open:assessment':'Abrir nova avaliação','open:orientation':'Abrir novo documento','open:financial':'Abrir novo lançamento','open:package':'Abrir novo pacote','open:assistant':'Abrir Assistente','open:recurring':'Abrir despesas recorrentes','open:coverage':'Abrir cadastro de convênios','open:agenda-settings':'Abrir configuração da agenda','open:agenda-dates':'Abrir feriados e datas','open:agenda-blocks':'Abrir bloqueios'})[code]||'Abrir a tela desta etapa';}
 function start(id,resume=false){
  if(!ready())return;if(window.therapyActionBusy)return therapyNotice('Aguarde a gravação atual.');const guide=catalog.find(g=>g.id===id);if(!guide)return;
  if(active)saveState('paused');if(!document.activeElement.closest('#therapy-tour-panel'))opener=document.activeElement;
  const previous=progress.entries[id];active={guide,index:resume&&previous?previous.step:0,run:++serial,proof:false,external:false,paused:false,collapsed:false,allowed:new Set([guide.view]),feedback:resume?'Retomado. Uma gravação anterior não deve ser repetida para liberar o guia; confira o resultado ou encerre como orientação consultada.':''};
  if(typeof TherapyHelp!=='undefined')TherapyHelp.close?.();
  el('therapy-tour-panel')?.remove();
  if(currentView()!==guide.view){if(modal()){active.paused=true;active.reason='Feche ou preserve o formulário pelos controles normais antes de mudar de tela.';}
   else if(router(guide.view)===false){active.paused=true;active.reason='A navegação foi recusada para preservar seu trabalho.';}}
  saveState(active.paused?'paused':'in_progress');render();panel().focus({preventScroll:true});revealTarget();
 }
 function restoreFocus(){const m=modal(),target=visible(opener)&&(!m||m.contains(opener))?opener:m?.querySelector('form input:not([type=hidden]),button')||document.querySelector('.view-section:not(.hide) h2');if(visible(target)){if(!target.matches('button,input,select,textarea,a[href]'))target.tabIndex=-1;target.focus({preventScroll:true});}}
 function stop(status='paused'){if(active)saveState(status);active=null;removePanel();restoreFocus();renderWelcome();renderLibrary();}
 function next(){if(!active||active.paused||window.therapyActionBusy)return;const g=active.guide;
  if(active.index<g.steps.length-1){active.index++;active.feedback='';saveState('in_progress');render();const target=targetFor(g.steps[active.index]);target?.scrollIntoView({block:'nearest',behavior:'instant'});revealTarget();return;}
  const result=R.completed(g,{proof:active.proof,external:active.external,target:!!targetFor(g.steps[active.index])});if(result){stop(result);therapyNotice(result==='done'?'Operação confirmada e guia concluído.':result==='reviewed'?'Conferência registrada no aprendizado.':'Orientação apresentada. Nenhuma operação foi executada pelo guia.');}
 }
 function navigate(code){
  if(!ready()||window.therapyActionBusy)return;
  const [type,name]=String(code).split(':');if(!['view','settings','open','clinical'].includes(type))return;
  if(credentialDialog())return;
  if(type==='clinical'){if(typeof TherapyClinicalReferences!=='undefined')TherapyClinicalReferences.open(name==='all'?'':name);schedule();return;}
  if(modal()){if(active){active.feedback='Um formulário já está aberto. Continue nele ou feche-o pelos controles normais, preservando suas alterações.';render();}return;}
  if(type==='view'){if(!D.sections.some(s=>s.view===name))return;if(router(name)===false)return navigationRefused();active?.allowed.add(name);}
  if(type==='settings'){if(!['clinic','routine','agenda','coverage','financial','appearance','assistant','security','maintenance'].includes(name))return;active?.allowed.add('settings');if(TherapySettings.open(name)===false)return navigationRefused();}
  if(type==='open'){
   const actions={patient:['patients',()=>openPatientModal()],appointment:['schedule',()=>openAppointmentModal()],session:['sessions',()=>openSessionNotesModal()],treatment:['treatments',()=>openTreatmentModal()],assessment:['assessments',()=>openAssessmentModal()],orientation:['prescriptions',()=>openPrescriptionModal()],financial:['financial',()=>openFinancialModal()],package:['packages',()=>TherapyPackages.open()],assistant:['dashboard',()=>TherapyAssistant.show()],recurring:['financial',()=>TherapyAssistant.recurring()],coverage:['settings',()=>TherapyCoverageUI.configure()],'agenda-settings':['settings',()=>openTherapyAgendaSettings()],'agenda-dates':['settings',()=>openTherapyAgendaDates()],'agenda-blocks':['schedule',()=>openTherapyAgendaBlocks()]};
   const action=actions[name];if(!action)return;if(router(action[0])===false)return navigationRefused();active?.allowed.add(action[0]);if(action[1]()===false)return navigationRefused();
  }schedule();
 }
 function navigationRefused(){if(active){active.paused=true;active.reason='A navegação não foi concluída. Seu formulário e suas alterações permanecem sob os controles normais.';saveState('paused');render();}}
 function pauseForNavigation(){if(active&&!active.paused&&!active.allowed.has(currentView())){active.paused=true;active.reason='Você abriu outra área. Retome quando desejar; nada foi salvo ou fechado pelo guia.';saveState('paused');}}
 function beginAction(name,args){if(!active||active.paused||!ready())return null;const variant=typeof args?.[1]==='string'?args[1]:'';if(!R.matches(active.guide.intent,name,variant))return null;return {run:active.run,revision:typeof therapySaveRevision==='number'?therapySaveRevision:0};}
 function endAction(token,success){if(!token||!active||token.run!==active.run)return;if(success&&typeof therapySaveRevision==='number'&&therapySaveRevision>token.revision){active.proof=true;active.feedback='O aplicativo confirmou a gravação desta operação. Confira o resultado antes de concluir o guia.';}else active.feedback='Não houve confirmação de nova gravação. Confira o formulário ou as mensagens do aplicativo.';render();}
 function catalogPanel(areaId){if(!ready()||credentialDialog())return;opener=document.activeElement;if(active)saveState('paused');active=null;clearTarget();const section=D.sections.find(s=>s.id===areaId)||D.sections.find(s=>s.view===currentView())||D.sections[0],node=panel();mount(node);node.hidden=false;node.classList.remove('is-collapsed');
  const intro=catalog.find(g=>g.id==='intro-'+section.id),items=D.tasks.filter(t=>t.area===section.id);
  node.innerHTML=`<header><h2 id="therapy-tour-title">Guias · ${esc(section.title)}</h2>${button('Fechar','close-catalog')}</header><p>${esc(section.description)}</p><div class="tour-actions">${button('Conhecer esta tela','start',intro.id,false)}${progress.entries[intro.id]?.status==='paused'?button('Retomar apresentação','resume',intro.id):''}</div><h3>Fazer uma tarefa</h3><div class="tour-task-list">${items.map(t=>`<article><strong>${esc(t.title)}</strong><small>${esc(R.labels[progress.entries[t.id]?.status]||'Não iniciado')}</small><div>${button('Passo a passo','start',t.id)}${progress.entries[t.id]?.status==='paused'?button('Retomar','resume',t.id):''}${button('Ler orientação','article',t.id)}</div></article>`).join('')||'<p>Use os primeiros passos e escolha a próxima área.</p>'}</div><div class="tour-actions">${button('Ver todos os guias','library')}${button('Ler tópico do Manual','topic',section.topic)}</div><small>${storageNote()}</small>`;node.setAttribute('aria-labelledby','therapy-tour-title');node.focus({preventScroll:true});
 }
 function openLibrary(areaId=''){
  if(!ready())return;if(active)saveState('paused');active=null;removePanel();if(modal()){therapyNotice('Feche o formulário pelos controles normais antes de abrir a biblioteca.');return;}if(router('manual')===false)return;
  libraryArea=D.sections.some(s=>s.id===areaId)?areaId:'';libraryQuery='';libraryStatus='';const node=el('therapy-tour-library');node.hidden=false;renderLibrary();node.scrollIntoView({block:'start'});el('tour-library-search')?.focus({preventScroll:true});
 }
 function renderLibrary(){const host=el('therapy-tour-library');if(!ready()||!host||host.hidden)return;
  const q=TherapyManualData.fold(libraryQuery).split(/\s+/).map(token=>token.length>4?token.replace(/s$/,''):token).join(' '),sections=D.sections.filter(s=>!libraryArea||s.id===libraryArea);
  const selected=sections.map(s=>({section:s,guides:catalog.filter(g=>g.area===s.id&&(!libraryStatus||(progress.entries[g.id]?.status||'new')===libraryStatus)&&(!q||TherapyManualData.matchesQuery(TherapyManualData.fold([s.title,s.description,g.title,g.description,g.before,g.result,g.exception,g.preserves,g.correction,...g.steps.map(x=>x.title+' '+x.text)].filter(Boolean).join(' ')),q)))})).filter(s=>s.guides.length);
  host.innerHTML=`<div class="tour-library-heading"><div><h2>Guias e tarefas</h2><p>Apresentações, tarefas e artigos. As gravações continuam nos controles normais do aplicativo.</p></div>${button('Fechar biblioteca','hide-library')}</div><div class="tour-library-filters"><label>Buscar guia<input id="tour-library-search" type="search" maxlength="160" value="${esc(libraryQuery)}"></label><label>Área<select id="tour-library-area"><option value="">Todas as áreas</option>${D.sections.map(s=>`<option value="${s.id}" ${libraryArea===s.id?'selected':''}>${esc(s.title)}</option>`).join('')}</select></label><label>Aprendizado<select id="tour-library-status"><option value="">Todas as situações</option><option value="new" ${libraryStatus==='new'?'selected':''}>Não iniciado</option>${Object.entries(R.labels).map(([id,label])=>`<option value="${id}" ${libraryStatus===id?'selected':''}>${esc(label)}</option>`).join('')}</select></label></div><p class="tour-hint">${storageNote()} Pular não é concluir. Operação confirmada depende de uma gravação observada durante o guia; conferência externa depende de você.</p>${selected.map(({section:s,guides})=>`<section class="tour-library-section"><h3>${esc(s.title)}</h3>${guides.map(g=>`<article><div><strong>${esc(g.title)}</strong><small>${g.kind==='intro'?'Conhecer esta tela':g.kind==='reference'?'Orientação sem executar operação':'Fazer uma tarefa'} · ${esc(R.labels[progress.entries[g.id]?.status]||'Não iniciado')}</small></div><div class="tour-actions">${button(progress.entries[g.id]?'Repetir':'Começar','start',g.id)}${progress.entries[g.id]?.status==='paused'?button('Retomar','resume',g.id):''}${button('Ler artigo','article',g.id)}</div></article>`).join('')}</section>`).join('')||'<p>Nenhum guia corresponde aos filtros.</p>'}<div id="therapy-tour-article"></div>`;
 }
 function article(id){const guide=catalog.find(g=>g.id===id);if(!guide)return;if(active)saveState('paused');const prior=active;active=null;removePanel();if(modal()){active=prior;if(active){active.feedback='Feche o formulário pelos controles normais antes de abrir o artigo. Você pode retomar depois.';render();}return;}if(router('manual')===false){active=prior;render();return;}
  const host=el('therapy-tour-library');host.hidden=false;libraryArea=guide.area;renderLibrary();const section=el('therapy-tour-article');
  section.innerHTML=`<article class="tour-article"><h2>${esc(guide.title)}</h2><p>${esc(guide.description||guide.result)}</p>${guide.before?`<h3>Antes de começar</h3><p>${esc(guide.before)}</p>`:''}<h3>Passo a passo</h3><ol>${guide.steps.map(s=>`<li><strong>${esc(s.title)}</strong><p>${esc(s.text)}</p></li>`).join('')}</ol>${guide.result?`<h3>Como conferir o resultado</h3><p>${esc(guide.result)}</p><h3>O que esta ação preserva</h3><p>${esc(guide.preserves)}</p><h3>Se não apareceu ou não salvou</h3><p>${esc(guide.exception)}</p><h3>Corrigir ou voltar</h3><p>${esc(guide.correction)}</p><h3>Exemplo e próximo passo</h3><p>${esc(guide.example)}</p>`:''}<div class="tour-actions">${button('Iniciar este guia','start',guide.id,false)}${progress.entries[guide.id]?.status==='paused'?button('Retomar guia','resume',guide.id):''}${button('Abrir tópico relacionado','topic',guide.topic)}</div></article>`;
  section.scrollIntoView({block:'start'});section.querySelector('h2').tabIndex=-1;section.querySelector('h2').focus({preventScroll:true});
 }
 function renderWelcome(){const host=el('therapy-tour-welcome');if(!host)return;host.hidden=!ready()||progress.welcome!=='pending';if(host.hidden){host.replaceChildren();return;}
  host.innerHTML='<div><strong>Comece pela sua rotina</strong><p>Conheça o consultório, paciente, agenda, registro e backup em trechos curtos. Você pode parar e retomar.</p></div><div class="tour-actions">'+button('Começar primeiros passos','welcome-start','',false)+button('Agora não','welcome-dismiss')+'</div>';
 }
 function install(){if(installed)return;installed=true;const host=document.createElement('section');host.id='therapy-tour-welcome';host.className='tour-welcome';host.hidden=true;document.querySelector('#view-dashboard .therapy-heading')?.after(host);
  const library=document.createElement('section');library.id='therapy-tour-library';library.className='tour-library';library.hidden=true;el('manual-tabs').before(library);
  for(const s of D.sections.filter(s=>!['start','assistant','coverage'].includes(s.id))){const heading=el('view-'+s.view)?.querySelector('h2');if(heading&&!heading.querySelector('.tour-module-launch'))(heading.querySelector('.therapy-help-trigger')||heading).insertAdjacentHTML(heading.querySelector('.therapy-help-trigger')?'beforebegin':'beforeend',`<button type="button" class="therapy-secondary tour-module-launch" data-tour-action="catalog" data-tour-value="${s.id}">Guia desta tela</button>`);}
  document.querySelector('#view-manual .manual-heading-actions')?.insertAdjacentHTML('beforeend',button('Guias e tarefas','library'));
 }
 function accessHint(){const form=el('therapy-unlock-form');if(form&&!el('tour-access-note')){const note=document.createElement('p');note.id='tour-access-note';note.textContent='Após abrir os registros, você pode conhecer as telas e seguir tarefas pelo botão Guia desta tela. Licença e senha local têm funções diferentes. Os guias nunca pedem sua senha.';form.after(note);}}
 function onUnlock(){load();install();renderWelcome();schedule();}
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;if(!ready()){if(active)saveState('paused');active=null;removePanel();renderWelcome();return;}pauseForNavigation();if(active){const target=targetFor(active.guide.steps[active.index]),m=modal(),credential=credentialDialog();if(!el('therapy-tour-panel')||!context||context.view!==currentView()||context.modal!==m||context.target!==target||context.paused!==active.paused||context.credential!==credential){render();if(credential)context={view:currentView(),modal:m,target,paused:active.paused,credential:true};}}});}
 function dispatch(action,value){
  if(!ready())return;
  if(action==='start'||action==='resume')return start(value,action==='resume');
  if(action==='catalog')return catalogPanel(value);
  if(action==='library')return openLibrary(value);
  if(action==='article')return article(value);
  if(action==='topic'){if(active)saveState('paused');active=null;removePanel();if(modal())return therapyNotice('Feche o formulário pelos controles normais antes de abrir o Manual.');return TherapyManual.openTopic(value);}
  if(action==='navigate')return navigate(value);
  if(action==='welcome-start'){progress.welcome='started';persist();renderWelcome();return start('intro-start');}
  if(action==='welcome-dismiss'){progress.welcome='dismissed';persist();return renderWelcome();}
  if(action==='close-catalog'){removePanel();restoreFocus();return;}
  if(action==='hide-library'){el('therapy-tour-library').hidden=true;return;}
  if(!active)return;
  if(action==='next')return next();
  if(action==='back'){active.index=Math.max(0,active.index-1);active.feedback='';saveState('in_progress');render();}
  if(action==='collapse'){active.collapsed=!active.collapsed;render();}
  if(action==='pause'||action==='exit')return stop('paused');
  if(action==='skip')return stop('skipped');
  if(action==='reviewed')return stop('consulted');
  if(action==='resume-current'){active.paused=false;active.reason='';active.allowed.add(currentView());saveState('in_progress');render();}
 }
 document.addEventListener('click',event=>{const control=event.target.closest('[data-tour-action]');if(!control)return;event.preventDefault();dispatch(control.dataset.tourAction,control.dataset.tourValue||'');});
 document.addEventListener('change',event=>{if(event.target.id==='tour-external-confirm'&&active){active.external=event.target.checked;render();}if(event.target.id==='tour-library-area'||event.target.id==='tour-library-status'){const id=event.target.id;if(id==='tour-library-area')libraryArea=event.target.value;else libraryStatus=event.target.value;renderLibrary();el(id)?.focus({preventScroll:true});}});
 document.addEventListener('input',event=>{if(event.target.id!=='tour-library-search')return;const position=event.target.selectionStart;libraryQuery=event.target.value.slice(0,160);renderLibrary();const node=el('tour-library-search');node.focus({preventScroll:true});node.setSelectionRange(position,position);});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&event.target.closest('#therapy-tour-panel')){event.preventDefault();event.stopImmediatePropagation();if(active)stop('paused');else{removePanel();restoreFocus();}}},true);
 document.addEventListener('therapy-vault-locked',()=>{if(active)saveState('paused');active=null;removePanel();el('therapy-tour-library')?.replaceChildren();if(el('therapy-tour-library'))el('therapy-tour-library').hidden=true;renderWelcome();});
 document.addEventListener('therapy-data-restored',()=>{if(active)stop('paused');renderWelcome();});
 window.addEventListener('storage',event=>{if(event.key==='gestao_terapia_v1'&&active){stop('paused');therapyNotice('Os registros mudaram em outra aba. Reabra os registros antes de retomar a tarefa.');}});
 document.addEventListener('therapy-modal-opening',()=>schedule());
 document.addEventListener('DOMContentLoaded',()=>{
  accessHint();
  new MutationObserver(records=>{accessHint();if(!ready()){if(el('therapy-tour-panel'))schedule();return;}if(!active)return;if(records.some(r=>{if(r.target.closest?.('#therapy-tour-panel'))return false;if(r.type==='attributes'){if(r.attributeName==='class'){const clean=value=>String(value||'').split(/\s+/).filter(c=>c&&c!=='therapy-tour-target').sort().join(' ');return clean(r.oldValue)!==clean(r.target.className);}return true;}return [...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&!n.closest?.('#therapy-tour-panel')&&!n.matches?.('#therapy-tour-panel'));}))schedule();}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['class','hidden']});
  el('manual-tabs')?.addEventListener('click',()=>{if(el('therapy-tour-library'))el('therapy-tour-library').hidden=true;});
 });
 window.addEventListener('resize',()=>{if(active)render();});
 return {onUnlock,start,onReferencesOpen(){if(active&&active.guide.topic!=='clinical')stop('paused');},topicLinks(topic){return '<div class="tour-actions tour-topic-links">'+D.sections.filter(s=>s.topic===topic||D.tasks.some(t=>t.topic===topic&&t.area===s.id)).map(s=>button('Guias de '+s.title,'catalog',s.id)).join('')+'</div>';},openForCurrentView(){catalogPanel(D.sections.find(s=>s.view===currentView())?.id||'start');},openLibrary,article,beginAction,endAction,catalog,progress:()=>R.normalize(progress,catalog),active:()=>active?{id:active.guide.id,step:active.index,paused:active.paused,proof:active.proof}:null};
})();
