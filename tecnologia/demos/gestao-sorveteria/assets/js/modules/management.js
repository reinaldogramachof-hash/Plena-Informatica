let pendingSorveteriaRestore=null;
const BACKUP_HISTORY_KEY=DB_KEY+':backup-exports';
const RESTORE_CHECKPOINT_KEY=DB_KEY+':before-restore';
function managementAttribute(value){return sanitizeHTML(String(value)).replaceAll('"','&quot;').replaceAll("'",'&#39;');}
function showManagementDialog(id,title,content,footer=''){
    document.getElementById(id)?.remove();const modal=document.createElement('div');modal.id=id;modal.className='pdv-payment-overlay';
    modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label',title);
    modal.innerHTML=`<div class="pdv-payment-content management-content bg-white rounded-xl p-6 space-y-4"><div class="flex justify-between gap-3 items-center"><h3 class="text-lg font-bold">${sanitizeHTML(title)}</h3><button type="button" onclick="this.closest('[role=dialog]').remove()" class="p-2 rounded-lg border" aria-label="Fechar janela">Fechar</button></div>${content}${footer}</div>`;
    document.body.appendChild(modal);return modal;
}
function backupExportHistory(){try{const items=JSON.parse(localStorage.getItem(BACKUP_HISTORY_KEY)||'[]');return Array.isArray(items)?items.filter(item=>item&&typeof item.name==='string'&&Number.isFinite(Date.parse(item.at))):[];}catch{return[];}}
function exportLocalFile(content,name){const url=URL.createObjectURL(new Blob([content],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function requestSorveteriaBackup(){
    if(databaseLoadError){showNotification('Recupere os dados locais antes de exportar um novo backup.','error');return;}
    const at=new Date().toISOString(),name=`ml_sorveteria_backup_${localDateKey()}.json`;
    exportLocalFile(JSON.stringify({...db,system:'gestao-sorveteria',version:'ml_sorveteria_v7',exportedAt:at},null,2),name);
    try{localStorage.setItem(BACKUP_HISTORY_KEY,JSON.stringify([{at,name},...backupExportHistory()].slice(0,10)));}catch{}
    renderBackupStatus();renderOperationalDashboard();showNotification('Exportação solicitada. Confira o arquivo na pasta de downloads.','success');
}
function renderBackupStatus(){
    const target=document.getElementById('sorveteria-backup-status');if(!target)return;
    const history=backupExportHistory();
    target.innerHTML=`<h3 class="font-bold">Histórico de exportações</h3><p class="text-sm text-gray-500">Confira se o arquivo foi guardado na pasta de downloads. O histórico registra a solicitação de exportação.</p>${history.length?`<ul class="text-sm space-y-1">${history.map(item=>`<li>${fmtDateTime(item.at)} — ${sanitizeHTML(item.name)}</li>`).join('')}</ul>`:'<p class="text-sm">Nenhuma exportação solicitada neste dispositivo.</p>'}${localStorage.getItem(RESTORE_CHECKPOINT_KEY)?'<button onclick="previewPreviousSorveteriaBackup()" class="border rounded-lg px-3 py-2 text-sm font-bold">Revisar cópia anterior à restauração</button>':''}`;
}
function previewSorveteriaBackup(input){
    const file=input.files?.[0];if(!file)return;
    const reader=new FileReader();reader.onload=()=>{try{showSorveteriaRestorePreview(JSON.parse(reader.result),file.name);}catch(error){showNotification(error.message,'error');}finally{input.value='';}};reader.onerror=()=>showNotification('Não foi possível ler esse arquivo.','error');reader.readAsText(file);
}
function showSorveteriaRestorePreview(source,name,checkpointDraft=null){
    const next=validateSorveteriaBackup(source);pendingSorveteriaRestore={next,checkpointDraft};
    const rows=[['products','Produtos'],['inventory','Insumos'],['sales','Vendas'],['clients','Clientes'],['production','Lotes'],['temperatures','Leituras'],['saleReversals','Cancelamentos'],['loyaltyMovements','Movimentos de pontos']];
    showManagementDialog('backup-preview-modal','Conferir restauração',`<p class="text-sm">Arquivo: <strong>${sanitizeHTML(name)}</strong><br>Exportação: ${source.exportedAt?fmtDateTime(source.exportedAt):'data não informada'}</p><table class="w-full text-sm"><thead><tr><th class="text-left p-2">Dados</th><th>Atuais</th><th>No arquivo</th></tr></thead><tbody>${rows.map(([key,label])=>`<tr class="border-t"><td class="p-2">${label}</td><td class="text-center">${db[key].length}</td><td class="text-center">${next[key].length}</td></tr>`).join('')}</tbody></table>
        <p class="text-sm">A restauração substitui os dados atuais e o pedido em andamento. Antes de aplicar, será guardada neste dispositivo uma cópia dos dados e do pedido atuais.</p>`,
        '<button id="confirm-backup-restore" onclick="applySorveteriaRestore()" class="w-full py-3 rounded-lg bg-brand-primary text-white font-bold">Confirmar substituição e restaurar</button>');
}
function applySorveteriaRestore(){
    if(!pendingSorveteriaRestore)return;
    const previousDraft=localStorage.getItem(PDV_DRAFT_KEY);
    let draftChanged=false;
    try{
        if(localStorage.getItem(DB_KEY)!==storedDatabase)throw new Error('Os dados mudaram em outra aba. Atualize a tela e confira o arquivo novamente.');
        localStorage.setItem(RESTORE_CHECKPOINT_KEY,JSON.stringify({at:new Date().toISOString(),database:storedDatabase||JSON.stringify(db),draft:previousDraft}));
        const {next,checkpointDraft}=pendingSorveteriaRestore;
        if(checkpointDraft)localStorage.setItem(PDV_DRAFT_KEY,checkpointDraft);else localStorage.removeItem(PDV_DRAFT_KEY);
        draftChanged=true;
        persistDatabase(next,{recovery:true});
        pendingSorveteriaRestore=null;location.reload();
    }catch(error){
        if(draftChanged){try{if(previousDraft)localStorage.setItem(PDV_DRAFT_KEY,previousDraft);else localStorage.removeItem(PDV_DRAFT_KEY);}catch{showNotification('Não foi possível recuperar o pedido. A cópia anterior continua guardada nas configurações.','error');}}
        showNotification('Restauração não aplicada. '+error.message,'error');
    }
}
function previewPreviousSorveteriaBackup(){try{const checkpoint=JSON.parse(localStorage.getItem(RESTORE_CHECKPOINT_KEY));showSorveteriaRestorePreview(JSON.parse(checkpoint.database),'Cópia anterior — '+fmtDateTime(checkpoint.at),checkpoint.draft);}catch(error){showNotification('Não foi possível abrir a cópia anterior: '+error.message,'error');}}
function initSorveteriaManagement(){
    const dashboard=document.getElementById('view-dashboard'),panel=document.createElement('div');panel.id='operational-dashboard';document.getElementById('dashboard-priorities').appendChild(panel);
    const freezerCard=document.getElementById('freezer-log-card');dashboard.appendChild(freezerCard);
    const status=document.createElement('div');status.id='sorveteria-backup-status';status.className='bg-white border rounded-xl p-6 space-y-3 mt-6';document.getElementById('view-settings').appendChild(status);
    const search=document.createElement('input');search.id='sales-search';search.type='search';search.placeholder='Buscar venda por código ou cliente';search.className='w-full border p-3 rounded-lg mb-4';search.oninput=renderSales;document.getElementById('sales-table-body').closest('table').parentElement.before(search);
    const summary=document.createElement('p');summary.id='report-reversals-summary';summary.className='text-sm text-gray-500 mb-4';document.getElementById('view-reports').children[0].after(summary);
    initSorveteriaLoyalty();renderBackupStatus();renderOperationalDashboard();
    setInterval(()=>{if(!dashboard.classList.contains('hide'))renderOperationalDashboard();if(!document.getElementById('view-temperature').classList.contains('hide'))renderTemperature();},60000);
}
function renderOperationalDashboard(){
    const target=document.getElementById('operational-dashboard');if(!target)return;
    const today=localDateKey(),alerts=[];
    for(const freezer of db.freezers){const state=getFreezerReadingState(db,freezer);if(!state.reading||state.stale||state.condition==='critico'||state.condition==='alto')alerts.push({label:freezer.name,text:!state.reading?'Sem leitura registrada':`${state.label} · última: ${state.reading.temperature}°C, ${fmtDateTime(state.reading.timestamp)}`,action:'temperature',id:freezer.id,severity:state.condition==='critico'?'danger':'warning'});}
    for(const item of getExpiryItems(db))alerts.push({label:item.name,text:item.daysLeft<0?'Validade vencida':item.daysLeft===0?'Vence hoje':`Vence em ${item.daysLeft} dia(s)`,action:'stock',id:item.id,source:item.source,severity:item.daysLeft<0?'danger':'warning'});
    const low=[['product',db.products],['inventory',db.inventory]].flatMap(([source,items])=>items.filter(item=>Number(item.stock)<=Number(item.minStock||0)).map(item=>({...item,source})));
    for(const item of low)alerts.push({label:item.name,text:`Repor estoque: ${item.stock} ${item.unit||'unidade'} disponíveis`,action:'stock',id:item.id,source:item.source,severity:Number(item.stock)<=0?'danger':'warning'});
    const pending=db.production.filter(item=>item.status!=='pronto');if(pending.length)alerts.push({label:'Produção em andamento',text:`${pending.length} lote(s) para conferir`,action:'production'});
    const last=backupExportHistory()[0];if(!last||localDateKey(last.at)!==today)alerts.push({label:'Cópia de segurança',text:'Solicite uma exportação e confira o arquivo guardado hoje.',action:'backup'});
    const session=getOpenCashierSession();
    const net=db.sales.filter(sale=>saleDateKey(sale)===today).reduce((sum,sale)=>sum+sale.total,0)-db.saleReversals.filter(item=>localDateKey(item.at)===today).reduce((sum,item)=>sum+item.amount,0);
    document.getElementById('company-name').textContent=db.settings.companyName;
    document.getElementById('today-sales').textContent=fmtMoney(net);
    document.getElementById('dashboard-cash-actions').innerHTML=`<span class="dashboard-cash-status" data-open="${!!session}"><i data-lucide="${session?'circle-check':'clock-3'}" aria-hidden="true"></i>${session?'Caixa aberto':'Caixa fechado'}</span><button onclick="router('cashier');${session?'':'openCashierSession()'}" class="workspace-button">${session?'Ver caixa':'Abrir caixa'}</button><button onclick="downloadBackup()" class="workspace-button"><i data-lucide="download" aria-hidden="true"></i>Backup</button>`;
    const rank={danger:0,warning:1};alerts.sort((a,b)=>(rank[a.severity]??2)-(rank[b.severity]??2));
    const icons={temperature:'thermometer',stock:'package',production:'factory',backup:'database-backup'};
    target.innerHTML=`<div class="workspace-panel-heading"><h3>Prioridades de agora</h3><span class="dashboard-count">${alerts.length} ${alerts.length===1?'pendência':'pendências'}</span></div>
        <p class="dashboard-priority-intro text-gray-500">Confira os itens que pedem atenção na operação.</p>
        <div class="dashboard-priority-list">${alerts.slice(0,6).map(alert=>`<div class="dashboard-priority" data-severity="${alert.severity||'info'}"><i data-lucide="${icons[alert.action]}" aria-hidden="true"></i><div class="dashboard-priority-copy"><strong>${sanitizeHTML(alert.label)}</strong><p>${sanitizeHTML(alert.text)}</p></div><button class="workspace-button" data-action="${alert.action}" data-item-id="${managementAttribute(alert.id||'')}" data-source="${alert.source||''}" onclick="openOperationalAlert(this)">Conferir</button></div>`).join('')||'<p class="workspace-empty">Nenhuma pendência encontrada.</p>'}</div>
        <p class="dashboard-priority-foot">${alerts.length>6?`Exibindo 6 de ${alerts.length}. Consulte também Estoque, Temperatura e Produção. `:''}Temperaturas são registradas manualmente. Os lembretes são atualizados enquanto o sistema está aberto.</p>`;
    if(window.lucide)lucide.createIcons();
}
function openOperationalAlert(button){const{action,itemId,source}=button.dataset;if(action==='temperature'){router('temperature');openTemperatureModal(itemId);}if(action==='stock')openOperationalStock(source,itemId);if(action==='production')router('production');if(action==='backup'){router('settings');document.getElementById('sorveteria-backup-status').scrollIntoView({block:'center'});}}
function openOperationalStock(source,id){router('inventory');const item=(source==='inventory'?db.inventory:db.products).find(item=>item.id===id);if(!item)return;showInventoryTab(source==='inventory'?'ingredients':PRODUCT_CATEGORY_GROUPS.finished.includes(item.category)?'finished':'packaging');document.getElementById('inventory-search').value=item.name;renderInventory();openStockEntryModal(id,source);}
function openProductionReview(id){
    try{const plan=planProductionCompletion(db,id);const lot=db.production.find(item=>item.id===id);
        const modal=showManagementDialog('production-review-modal','Conferir conclusão do lote',`<p class="font-bold">${sanitizeHTML(lot.product)}</p><h4 class="font-bold text-sm">Consumo de insumos</h4><ul class="space-y-2 text-sm">${plan.inputs.map(item=>`<li>${sanitizeHTML(item.name)}: ${item.before} → ${item.after} ${sanitizeHTML(item.unit)} (consumo ${item.qty})</li>`).join('')||'<li>Nenhum insumo informado neste lote.</li>'}</ul><h4 class="font-bold text-sm">Produto que entrará no estoque</h4><p class="text-sm">${sanitizeHTML(plan.output.name)}: ${plan.output.before} → ${plan.output.after} ${sanitizeHTML(plan.output.unit)}.</p>`,
        '<button id="confirm-production-review" class="w-full py-3 rounded-lg bg-brand-primary text-white font-bold">Confirmar consumo e concluir lote</button>');modal.querySelector('#confirm-production-review').onclick=()=>{updateProductionStatus(id,'pronto');if(db.production.find(item=>item.id===id)?.status==='pronto')modal.remove();};
    }catch(error){showManagementDialog('production-review-modal','Conferir lote',`<p class="text-sm">${sanitizeHTML(error.message)}</p>`,'<p class="text-sm">Edite o lote ou confira os saldos antes de concluir.</p>');}
}
function openSaleDetails(id){
    const sale=db.sales.find(sale=>sale.id===id);if(!sale)return;
    const client=db.clients.find(client=>client.id===sale.clientId);
    const modal=showManagementDialog('sale-details-modal','Detalhes da venda',`<p class="text-sm">${sanitizeHTML(sale.id)} · ${fmtDateTime(sale.timestamp)}<br>Cliente: ${sanitizeHTML(sale.clientName||client?.name||'Cliente avulso')}<br>Situação: <strong>${sale.status==='canceled'?'Cancelada':'Finalizada'}</strong></p>
        <ul class="space-y-2 text-sm">${sale.items.map(item=>`<li class="border-b pb-2">${item.qty} × ${sanitizeHTML(item.name)} ${sanitizeHTML(item.details||'')}<strong class="float-right">${fmtMoney(Number(item.total))}</strong></li>`).join('')}</ul><p class="text-sm">Subtotal: ${fmtMoney(sale.subtotal??sale.total)}<br>Descontos: ${fmtMoney(sale.discount||0)}<br>Total: <strong>${fmtMoney(sale.total)}</strong><br>Pagamento: ${sanitizeHTML(sale.paymentMethod||'dinheiro')}${sale.loyalty?`<br>Pontos usados: ${sale.loyalty.pointsRedeemed} · ganhos: ${sale.loyalty.pointsEarned}`:''}</p>
        ${sale.cancellation?`<div class="border rounded-lg p-3 text-sm">Cancelamento registrado em ${fmtDateTime(sale.cancellation.at)}<br>Motivo: ${sanitizeHTML(sale.cancellation.reason)}<br>Devolução registrada: ${fmtMoney(sale.cancellation.amount)} (${sanitizeHTML(sale.cancellation.paymentMethod)})<br>Reposição de estoque: ${sale.cancellation.restocked?'sim':'não'}</div>`:''}`,
        `<div class="flex flex-wrap gap-3"><button id="sale-detail-print" class="px-4 py-3 border rounded-lg font-bold">Reimprimir</button>${sale.status!=='canceled'?'<button id="sale-detail-cancel" class="px-4 py-3 border rounded-lg font-bold">Registrar cancelamento</button>':''}</div>`);
    modal.querySelector('#sale-detail-print').onclick=()=>printSaleReceipt(id);const cancel=modal.querySelector('#sale-detail-cancel');if(cancel)cancel.onclick=()=>{modal.remove();openSaleCancellation(id);};
}
function openSaleCancellation(id){
    const sale=db.sales.find(sale=>sale.id===id);if(!sale||sale.status==='canceled')return;
    const restorable=sale.items.length&&sale.items.every(item=>item.stockMovements?.length);
    const modal=showManagementDialog('sale-cancel-modal','Registrar cancelamento',`<form id="sale-cancel-form" class="space-y-4"><p class="text-sm">Venda ${sanitizeHTML(id)} · ${fmtMoney(sale.total)}. O registro original será mantido.</p>${sale.clientId&&!sale.loyalty?'<p class="text-sm">Esta venda antiga não registra os pontos ganhos ou usados. O saldo de pontos será preservado, sem recalcular uma regra desconhecida.</p>':''}
        <label class="block text-sm">Motivo<textarea id="sale-cancel-reason" required minlength="3" class="w-full border rounded-lg p-2 mt-1"></textarea></label>
        <label class="block text-sm">Forma da devolução<select id="sale-cancel-method" class="w-full border rounded-lg p-2 mt-1"><option value="dinheiro">Dinheiro</option><option value="pix">Pix</option><option value="debito">Débito</option><option value="credito">Crédito</option></select></label>
        <label class="flex gap-2 text-sm"><input id="sale-cancel-restock" type="checkbox" ${restorable?'':'disabled'}>Repor os itens no estoque, somente se retornaram e podem ser vendidos.</label>${!restorable?'<p class="text-xs text-gray-500">Venda antiga sem movimentações completas: reposição automática indisponível.</p>':''}
        <p class="text-xs text-gray-500">${getOpenCashierSession()?'A devolução será vinculada ao caixa aberto agora.':'Sem caixa aberto: a devolução ficará no histórico, fora de uma sessão de caixa.'} O sistema registra a devolução; ele não transfere dinheiro ou estorna a operadora de cartão.</p>
        <label class="flex gap-2 text-sm"><input id="sale-cancel-confirmed" type="checkbox" required>Conferi o valor e a devolução realizada fora do sistema.</label>
        <button type="submit" class="w-full bg-brand-primary text-white py-3 rounded-lg font-bold">Confirmar cancelamento e devolução</button></form>`);
    modal.querySelector('#sale-cancel-method').value=sale.paymentMethod||'dinheiro';
    modal.querySelector('form').onsubmit=event=>{event.preventDefault();try{const plan=planSaleCancellation(db,id,{reason:document.getElementById('sale-cancel-reason').value,restock:document.getElementById('sale-cancel-restock').checked,paymentMethod:document.getElementById('sale-cancel-method').value,cashierSessionId:getOpenCashierSession()?.id||null});persistDatabase(plan.next);modal.remove();renderSales();renderCashierSessionStatus();renderDashboard();openSaleDetails(id);showNotification('Cancelamento e devolução registrados.','success');}catch(error){showNotification(error.message,'error');}};
}
function openClientHistory(id){const client=db.clients.find(client=>client.id===id);if(!client)return;const sales=db.sales.filter(sale=>sale.clientId===id);const modal=showManagementDialog('client-history-modal','Histórico do cliente',`<p class="font-bold">${sanitizeHTML(client.name)}</p><p class="text-sm">Saldo de pontos: ${Number(client.points||0)}${Number(client.points)<0?' — saldo devedor, aguardando compensação':''}</p><div class="space-y-2">${sales.map(sale=>`<button class="block w-full text-left border rounded-lg p-3 text-sm" data-sale-id="${managementAttribute(sale.id)}" onclick="document.getElementById('client-history-modal').remove();openSaleDetails(this.dataset.saleId)">${fmtDateTime(sale.timestamp)} · ${fmtMoney(sale.total)} · ${sale.status==='canceled'?'Cancelada':'Finalizada'}</button>`).join('')||'<p class="text-sm">Nenhuma venda vinculada.</p>'}</div>`);return modal;}
