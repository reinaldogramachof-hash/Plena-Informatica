/* Editores únicos das preferências. Não muda o contrato do cofre ou os registros históricos. */
const TherapySettings=(()=>{
 const el=id=>document.getElementById(id),forms=new Map();let origin=null,agendaPage='preferences';
 const view=()=>document.querySelector('.view-section:not(.hide)')?.id.replace('view-','');
 const state=form=>JSON.stringify([...form.querySelectorAll('input,select,textarea')].filter(n=>!['submit','button','file'].includes(n.type)).map(n=>[n.id,n.type==='checkbox'?n.checked:n.value]));
 function capture(root){for(const form of forms.keys())if(!form.isConnected)forms.delete(form);root?.querySelectorAll('form').forEach(form=>forms.set(form,state(form)));}
 function saved(id){const form=el(id);if(form)forms.set(form,state(form));}
 function dirty(){return [...forms].some(([form,clean])=>form.isConnected&&state(form)!==clean);}
 function replace(){if(!dirty())return true;if(window.therapyActionBusy||!confirm('Há configurações não salvas nesta área. Descartar para abrir outro cadastro?'))return false;return true;}
 function mount(area,title,html){const host=el('system-editor-'+area);host.innerHTML='<h3>'+sanitizeHTML(title)+'</h3>'+html;capture(host);TherapyHelp.refresh();return host;}
 function activate(area){
  el('system-return').hidden=!origin;
  if(area==='agenda'&&!el('system-editor-agenda').hasChildNodes())renderAgenda();
  if(area==='coverage'&&!el('system-editor-coverage').hasChildNodes())TherapyCoverageUI.renderSettings();
  if(area==='financial'&&!el('system-editor-financial').hasChildNodes())TherapyAssistant.renderRecurringSettings();
 }
 function open(area,detail=''){
  if(!TherapyVault.isOpen()||window.therapyActionBusy)return false;
  const source=view(),focus=document.activeElement;
  if(source!=='settings'&&router('settings')===false)return false;
  if(TherapySystem.select(area)===false)return false;
  if(source!=='settings'){origin={view:source,focus};el('system-return').hidden=false;}
  if(area==='agenda'&&detail&&detail!==agendaPage){if(!replace())return false;agendaPage=detail;renderAgenda();}
  return true;
 }
 function back(){const previous=origin;if(!previous)return;if(router(previous.view)===false)return;origin=null;if(previous.focus?.isConnected&&previous.focus.getClientRects().length)previous.focus.focus({preventScroll:true});}
 function renderAgenda(){
  if(agendaPage==='dates')renderTherapyAgendaDatesSettings();else renderTherapyAgendaSettings();
  el('system-editor-agenda').insertAdjacentHTML('afterbegin',`<div class="therapy-actions system-editor-nav"><button type="button" class="therapy-secondary" onclick="TherapySettings.open('agenda','preferences')" aria-pressed="${agendaPage==='preferences'}">Expediente e visualização</button><button type="button" class="therapy-secondary" onclick="TherapySettings.open('agenda','dates')" aria-pressed="${agendaPage==='dates'}">Feriados e datas</button></div>`);
 }
 function discard(area){if(!replace())return false;if(area==='agenda')renderAgenda();return true;}
 function reset(){forms.clear();origin=null;agendaPage='preferences';for(const key of ['agenda','coverage','financial'])el('system-editor-'+key)?.replaceChildren();if(el('system-return'))el('system-return').hidden=true;}
 return {open,back,activate,mount,capture,saved,dirty,replace,discard,reset};
})();
