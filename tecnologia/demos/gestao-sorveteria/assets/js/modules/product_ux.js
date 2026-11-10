function initProductUX() {
    const form = document.getElementById('p-id').closest('form');
    const optional = document.createElement('details');
    optional.id = 'p-optional-fields'; optional.className = 'border rounded-xl p-4';
    optional.innerHTML = '<summary class="font-bold cursor-pointer">Informações complementares</summary><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"></div>';
    const content = optional.lastElementChild;
    for (const id of ['p-flavor','p-temperature','p-expiry','p-ingredients','p-description']) {
        const input = document.getElementById(id);
        const group = id === 'p-flavor' ? input.parentElement.parentElement : input.parentElement;
        content.appendChild(group);
    }
    const first = document.getElementById('p-name').parentElement;
    first.parentElement.prepend(first);
    document.getElementById('p-category').parentElement.parentElement.classList.remove('md:grid-cols-2');
    const priceGrid = document.getElementById('p-cost').parentElement.parentElement;
    priceGrid.classList.remove('md:grid-cols-3'); priceGrid.classList.add('md:grid-cols-2');
    form.insertBefore(optional, form.lastElementChild);
}
function renderAdditions() {
    const container = document.getElementById('additions-list');
    container.innerHTML = db.adicionais.length ? db.adicionais.map(addition => {
        const source = addition.stockSource === 'inventory' ? db.inventory : db.products;
        const linked = addition.stockItemId ? source.find(item => item.id === addition.stockItemId) : null;
        const usage = addition.stockItemId ? (linked ? `${addition.stockQty} ${linked.unit || 'unidade'} de ${linked.name}` : 'Item de estoque removido — confira o cadastro') : 'Sem baixa de estoque';
        return `<article class="bg-white p-4 border rounded-xl space-y-2" data-addition-id="${sanitizeHTML(String(addition.id)).replaceAll('"','&quot;')}"><div class="flex justify-between gap-3"><h3 class="font-bold">${sanitizeHTML(addition.name)}</h3><strong>${Number(addition.price) ? fmtMoney(Number(addition.price)) : 'Grátis'}</strong></div><p class="text-sm text-gray-500">${sanitizeHTML(usage)}</p><p class="text-xs">${addition.active === false ? 'Inativo na montagem' : 'Disponível na montagem'}</p><button onclick="openAdditionModal(this.parentElement.dataset.additionId)" class="px-3 py-2 rounded-lg border text-sm font-bold">Editar adicional</button></article>`;
    }).join('') : '<p class="text-gray-500 text-sm">Nenhum adicional cadastrado.</p>';
}
function openAdditionModal(id = '') {
    document.getElementById('addition-modal')?.remove();
    const addition = db.adicionais.find(item => item.id === id);
    const modal = document.createElement('div');
    modal.id = 'addition-modal'; modal.className = 'pdv-payment-overlay';
    modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-label', addition ? 'Editar adicional' : 'Novo adicional');
    const options = [{ value:'',label:'Sem baixa de estoque' }];
    for (const [source,items] of [['product',db.products],['inventory',db.inventory]]) {
        for (const item of items) options.push({ value:source+':'+item.id,label:`${source === 'product' ? 'Produto' : 'Insumo'}: ${item.name} (${item.unit || 'unidade'})` });
    }
    modal.innerHTML = `<div class="pdv-payment-content bg-white rounded-xl p-6"><h3 class="text-lg font-bold mb-4">${addition ? 'Editar adicional' : 'Novo adicional'}</h3>
        <form onsubmit="saveAddition(event)" class="space-y-4">
        <input type="hidden" id="addition-id"><label class="block text-sm">Nome<input id="addition-name" required maxlength="100" class="block w-full mt-1 p-2 border rounded-lg"></label>
        <label class="block text-sm">Preço adicional (R$)<input id="addition-price" type="number" min="0" step="0.01" required class="block w-full mt-1 p-2 border rounded-lg"></label>
        <label class="block text-sm">Controle de estoque<select id="addition-stock" onchange="updateAdditionStockLabel()" class="block w-full mt-1 p-2 border rounded-lg">${options.map(option=>`<option value="${sanitizeHTML(option.value).replaceAll('"','&quot;')}">${sanitizeHTML(option.label)}</option>`).join('')}</select></label>
        <label id="addition-consumption-label" class="block text-sm">Consumo por escolha<input id="addition-consumption" type="number" min="0.001" step="0.001" class="block w-full mt-1 p-2 border rounded-lg"><span id="addition-unit-help" class="text-xs text-gray-500"></span></label>
        <label class="flex items-center gap-2 text-sm"><input id="addition-active" type="checkbox">Disponível na montagem do açaí</label>
        <div class="flex gap-3"><button type="submit" class="flex-1 py-3 rounded-lg bg-brand-primary text-white font-bold">Salvar adicional</button><button type="button" onclick="document.getElementById('addition-modal').remove()" class="px-4 py-3 rounded-lg border">Cancelar</button></div></form></div>`;
    document.body.appendChild(modal);
    document.getElementById('addition-id').value = addition?.id || '';
    document.getElementById('addition-name').value = addition?.name || '';
    document.getElementById('addition-price').value = addition?.price ?? 0;
    document.getElementById('addition-stock').value = addition?.stockItemId ? addition.stockSource+':'+addition.stockItemId : '';
    document.getElementById('addition-consumption').value = addition?.stockQty ?? '';
    document.getElementById('addition-active').checked = addition?.active !== false;
    updateAdditionStockLabel(); document.getElementById('addition-name').focus();
}
function additionStockTarget(value) {
    const index = value.indexOf(':');
    if (index < 0) return null;
    const source = value.slice(0,index), id = value.slice(index+1);
    return { source, item: (source === 'inventory' ? db.inventory : db.products).find(item=>item.id===id) };
}
function updateAdditionStockLabel() {
    const target = additionStockTarget(document.getElementById('addition-stock').value);
    document.getElementById('addition-consumption-label').classList.toggle('hidden', !target);
    document.getElementById('addition-consumption').required = !!target;
    document.getElementById('addition-unit-help').textContent = target?.item ? `Quantidade consumida em ${target.item.unit || 'unidade'} cada vez que o adicional for escolhido.` : '';
}
function saveAddition(event) {
    event.preventDefault();
    const id = document.getElementById('addition-id').value;
    const name = document.getElementById('addition-name').value.trim();
    const price = Number(document.getElementById('addition-price').value);
    const target = additionStockTarget(document.getElementById('addition-stock').value);
    const qty = Number(document.getElementById('addition-consumption').value);
    if (!name || !Number.isFinite(price) || price < 0 || (target && (!target.item || !Number.isFinite(qty) || qty <= 0))) { showNotification('Confira nome, preço e consumo de estoque.', 'error'); return; }
    if (target?.item && needsWeightUnitReview(target.item)) { showNotification('Confira a unidade do produto vinculado antes de usá-lo como adicional.', 'error'); return; }
    const addition = { id:id || getID(),name,price:roundMoney(price),active:document.getElementById('addition-active').checked,...(target ? {stockSource:target.source,stockItemId:target.item.id,stockQty:qty} : {}) };
    const next = JSON.parse(JSON.stringify(db));
    const index = next.adicionais.findIndex(item=>item.id===addition.id);
    if (index>=0) next.adicionais[index]=addition; else next.adicionais.push(addition);
    try { persistDatabase(next); }
    catch(error) { showNotification(error.message,'error'); return; }
    document.getElementById('addition-modal').remove();renderAdditions();showNotification('Adicional salvo.', 'success');
}

function snapshotAddition(addition) {
    if (!addition.stockItemId) return { id:addition.id, name:addition.name, price:Number(addition.price) };
    const item = (addition.stockSource === 'inventory' ? db.inventory : db.products).find(item=>item.id===addition.stockItemId);
    if (!item) throw new Error(`Confira o estoque do adicional ${addition.name}.`);
    if (needsWeightUnitReview(item)) requireWeightUnit(item);
    return { ...addition, stockUnit:item.unit || 'unidade' };
}
