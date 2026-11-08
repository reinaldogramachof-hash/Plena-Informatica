/* Prévia e ações manuais: a base local permanece independente do Google. */
const TherapyExternal=(()=>{
 const R=TherapyExternalRules,el=id=>document.getElementById(id),esc=value=>sanitizeHTML(String(value??''));
 const external='target="therapyGoogle" rel="noopener noreferrer" referrerpolicy="no-referrer"';
 function init(){
  if(el('appointment-meet-url'))return;
  el('appointment-form').lastElementChild.insertAdjacentHTML('beforebegin',`<section class="care-context system-dialog"><h3>Videochamada (opcional)</h3><label>Link do Google Meet<input id="appointment-meet-url" type="text" inputmode="url" maxlength="500" autocomplete="off" placeholder="https://meet.google.com/abc-defg-hij"></label><p>Crie uma sala no Google Meet e cole o link aqui. O sistema não cria salas automaticamente.</p><a class="therapy-secondary" href="https://meet.google.com/" ${external}>Abrir Google Meet para criar uma sala</a></section>`);
 }
 function fill(item){el('appointment-meet-url').value=item?.meetUrl||'';}
 function value(){return R.meet(el('appointment-meet-url').value);}
 function actions(item){
  let link='';try{link=R.meet(item.meetUrl);}catch{}
  return `<section class="care-context"><h3>Ferramentas externas</h3>${link?`<div class="therapy-actions"><a class="therapy-secondary" href="${esc(link)}" ${external}>Abrir Meet</a><button type="button" onclick="TherapyExternal.copy('${item.id}')">Copiar link do Meet</button></div><p>A sala abre no Google Meet. Confira se o link ainda está disponível antes da sessão.</p>`:'<p>Nenhum link do Meet salvo nesta marcação.</p>'}${!['cancelled','no_show'].includes(item.status)?`<button type="button" class="therapy-secondary" onclick="TherapyExternal.calendar('${item.id}')">Adicionar ao Google Agenda</button>`:''}<p>Adição manual de uma marcação por vez. Reagendar ou cancelar aqui não atualiza o Google. A abertura dos serviços requer internet.</p></section>`;
 }
 async function copy(id){
  if(!TherapyVault.isOpen())return;const item=db.appointments.find(a=>a.id===id);if(!item)return;
  try{const link=R.meet(item.meetUrl);if(!link)throw new Error('Esta marcação não tem link do Meet.');if(!navigator.clipboard?.writeText)throw new Error('Cópia automática indisponível.');await navigator.clipboard.writeText(link);therapyNotice('Link do Meet copiado. Confira o destinatário antes de compartilhar.');}
  catch(error){if(!TherapyVault.isOpen())return;let link='';try{link=R.meet(item.meetUrl);}catch{}if(!link)return therapyNotice(error.message,'error');const modal=TherapyVault.dialog('Copiar link do Meet','<p>A cópia automática não foi permitida. Selecione e copie o endereço abaixo.</p><label>Link da sala<input id="external-copy-link" type="text" readonly></label><button type="button" onclick="document.getElementById(\'therapy-dialog\').remove()">Fechar</button>');modal.querySelector('.therapy-dialog').classList.add('system-dialog');modal.querySelector('input').value=link;modal.querySelector('input').select();}
 }
 function calendar(id){
  if(!TherapyVault.isOpen())return;const item=db.appointments.find(a=>a.id===id);if(!item)return;
  let link;try{R.calendar(item);link=R.meet(item.meetUrl);}catch(error){return therapyNotice(error.message,'error');}
  const stamp=localStorage.getItem('gestao_terapia_v1');
  const modal=TherapyVault.dialog('Adicionar manualmente ao Google Agenda',`<p>Confira os dados antes de abrir o Google. Nenhum evento foi criado ainda.</p><p>${esc(fmtDate(item.date))} · ${esc(item.time)} · ${Number(item.duration)} min<br>Fuso deste dispositivo: ${esc(Intl.DateTimeFormat().resolvedOptions().timeZone)}</p><label>Título do evento<input id="external-calendar-title" type="text" maxlength="200" value="Atendimento"></label>${link?'<label class="care-check"><input id="external-calendar-meet" type="checkbox"><span>Incluir o link do Meet na descrição do evento</span></label>':''}<p>Nome do paciente, contatos, anotações e valores não são preenchidos. O título que você escrever e o link, se selecionado, serão enviados ao Google.</p><p>Salve o evento na tela do Google. Repetir esta ação pode criar duplicatas. Alterações e cancelamentos precisam ser feitos também no Google; não há sincronização.</p><p id="external-calendar-error" role="alert"></p><div class="therapy-actions"><a class="therapy-secondary" id="external-calendar-open" ${external}>Abrir no Google Agenda</a><button type="button" id="external-calendar-back">Voltar à marcação</button></div>`);
  modal.querySelector('.therapy-dialog').classList.add('system-dialog');
  const update=()=>{const anchor=el('external-calendar-open');try{anchor.href=R.calendar(item,{title:el('external-calendar-title').value,includeMeet:!!el('external-calendar-meet')?.checked});anchor.removeAttribute('aria-disabled');el('external-calendar-error').textContent='';}catch(error){anchor.removeAttribute('href');anchor.setAttribute('aria-disabled','true');el('external-calendar-error').textContent=error.message;}};
  el('external-calendar-open').onclick=event=>{if(!TherapyVault.isOpen()||localStorage.getItem('gestao_terapia_v1')!==stamp||db.appointments.find(a=>a.id===id)!==item){event.preventDefault();event.currentTarget.removeAttribute('href');therapyNotice('A base mudou. Reabra a marcação para conferir os dados antes de abrir o Google.','error');}};
  modal.addEventListener('input',update);el('external-calendar-back').onclick=()=>TherapyAgenda.openAppointment(id);update();
 }
 return {init,fill,value,actions,copy,calendar};
})();
