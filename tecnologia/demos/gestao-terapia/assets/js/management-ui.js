const TherapyManagementUI=(()=>{
 const esc=value=>sanitizeHTML(String(value??'')),el=id=>document.getElementById(id);let form=null,clean='';
 const formValue=()=>form?JSON.stringify([...form.querySelectorAll('input,select,textarea')].map(n=>[n.id,n.type==='checkbox'?n.checked:n.value])):'';
 const dirty=()=>form?.isConnected&&clean!==formValue();
 function patientOptions(id,active=false){const node=el(id),chosen=node.value;node.innerHTML=`<option value="">${active?'Sem vínculo com paciente':'Todos os pacientes'}</option>`+db.patients.filter(p=>!active||!p.archived).slice().sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')).map(p=>`<option value="${p.id}">${esc(p.name)}${p.archived?' (arquivado)':''}</option>`).join('');node.value=chosen;}
 function methods(chosen='unknown'){return Object.entries(TherapyManagementRules.methods).map(([key,label])=>`<option value="${key}"${key===chosen?' selected':''}>${label}</option>`).join('');}
 function tabs(prefix,items,selected){document.querySelectorAll(`[data-${prefix}-tab]`).forEach(n=>{const current=n.dataset[prefix+'Tab']===selected;n.setAttribute('aria-selected',String(current));n.tabIndex=current?0:-1;});el(prefix+'-panel').setAttribute('aria-labelledby',prefix+'-tab-'+selected);}
 function keyboard(prefix,handler){el(prefix+'-tabs').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const buttons=[...el(prefix+'-tabs').querySelectorAll('[role=tab]')],at=buttons.findIndex(b=>b.getAttribute('aria-selected')==='true'),next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(at+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;event.preventDefault();handler(buttons[next].dataset[prefix+'Tab']);});}
 function range(prefix,value){const today=TherapyData.dateKey(),start=value==='month'?today.slice(0,7)+'-01':value==='today'?today:'';el(prefix+'-start').value=start;el(prefix+'-end').value=value==='all'?'':today;if(prefix==='finance')TherapyFinance.render();else TherapyReports.render();}
 function dialog(title,content){const modal=TherapyVault.dialog(title,content);modal.querySelector('.therapy-dialog').classList.add('management-dialog');form=modal.querySelector('form');clean=formValue();return modal;}
 function close(){if(window.therapyActionBusy)return therapyNotice('Aguarde a gravação atual.');if(dirty()&&!confirm('Há alterações não salvas. Fechar sem salvar?'))return;el('therapy-dialog')?.remove();form=null;clean='';}
 function reset(){form=null;clean='';}
 window.addEventListener('beforeunload',event=>{if(dirty()){event.preventDefault();event.returnValue='';}});
 document.addEventListener('DOMContentLoaded',()=>{keyboard('finance',value=>TherapyFinance.tab(value));keyboard('packages',value=>TherapyPackages.tab(value));el('financial-method').innerHTML=methods();});
 return {patientOptions,methods,tabs,range,dialog,close,reset};
})();
