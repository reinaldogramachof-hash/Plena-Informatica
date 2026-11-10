// ============================================================
// inventory.js — Controle de Estoque
// Gestão Sorveteria & Açaí Pro
// ============================================================

let currentInventoryTab = 'ingredients';

const INVENTORY_INGREDIENT_CATEGORIES = [
    { value: 'leite', label: 'Leite e Creme' },
    { value: 'fruta', label: 'Frutas' },
    { value: 'acucar', label: 'Acucares' },
    { value: 'sabor', label: 'Essencias' },
    { value: 'embalagem', label: 'Embalagens' }
];

function getInventoryTabCategories(tab = currentInventoryTab) {
    if (tab === 'finished' || tab === 'other' || tab === 'packaging') {
        const groupKey = tab === 'packaging' ? 'other' : tab;
        const group = PRODUCT_CATEGORY_GROUPS[groupKey] || [];
        return PRODUCT_CATEGORIES.filter(category => group.includes(category.value));
    }
    return INVENTORY_INGREDIENT_CATEGORIES;
}

function syncInventoryCategoryFilter() {
    const select = document.getElementById('inventory-category');
    if (!select) return;

    const currentValue = select.value || 'all';
    const categories = getInventoryTabCategories();
    select.innerHTML = '<option value="all">Todas categorias</option>' +
        categories.map(category => `<option value="${category.value}">${sanitizeHTML(category.label)}</option>`).join('');
    select.value = categories.some(category => category.value === currentValue) ? currentValue : 'all';
}

function renderInventory() {
    syncInventoryCategoryFilter();
    document.querySelectorAll('.inventory-tab').forEach(btn => {
        const active = btn.dataset.tab === currentInventoryTab;
        btn.setAttribute('aria-pressed', String(active));
        btn.classList.toggle('border-rose-500', active);
        btn.classList.toggle('text-rose-600', active);
        btn.classList.toggle('border-transparent', !active);
    });
    // Lê filtros
    const search = (document.getElementById('inventory-search')?.value || '').toLowerCase();
    const category = document.getElementById('inventory-category')?.value || 'all';
    const status = document.getElementById('inventory-status')?.value || 'all';
    const sort = document.getElementById('inventory-sort')?.value || 'name';

    // Fonte de dados: db.inventory para ingredientes, db.products para finished/packaging
    let items = [];
    if (currentInventoryTab === 'ingredients') {
        items = (db.inventory || []).map(item => ({ ...item, _source: 'inventory' }));
    } else if (currentInventoryTab === 'finished') {
        const categories = getInventoryTabCategories('finished').map(item => item.value);
        items = db.products.filter(p => categories.includes(p.category)).map(p => ({
            id: p.id, code: p.code, name: p.name, category: p.category,
            stock: p.stock, minStock: p.minStock, unit: p.unit,
            expiryDate: p.expiryDate || null, _source: 'product'
        }));
    } else {
        const categories = getInventoryTabCategories('other').map(item => item.value);
        items = db.products.filter(p => categories.includes(p.category)).map(p => ({
            id: p.id, code: p.code, name: p.name, category: p.category,
            stock: p.stock, minStock: p.minStock, unit: p.unit,
            expiryDate: p.expiryDate || null, _source: 'product'
        }));
    }

    // Filtros
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search) || (i.code||'').toLowerCase().includes(search));
    if (category !== 'all') items = items.filter(i => i.category === category);
    if (status === 'in-stock') items = items.filter(i => i.stock >= i.minStock);
    else if (status === 'low-stock') items = items.filter(i => i.stock > 0 && i.stock < i.minStock);
    else if (status === 'out-of-stock') items = items.filter(i => i.stock <= 0);

    // Sort
    if (sort === 'name') items.sort((a,b) => a.name.localeCompare(b.name));
    else if (sort === 'stock') items.sort((a,b) => a.stock - b.stock);
    else if (sort === 'stock-desc') items.sort((a,b) => b.stock - a.stock);
    else if (sort === 'expiry') items.sort((a,b) => new Date(a.expiryDate||'9999') - new Date(b.expiryDate||'9999'));

    // Render table
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    if (items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="px-6 py-8 text-center text-gray-400">
            <i data-lucide="package" class="w-10 h-10 mx-auto mb-2 text-gray-300"></i>
            <p>Nenhum item encontrado.</p></td></tr>`;
        if (window.lucide) lucide.createIcons();
        updateInventoryCounters();
        renderExpiryAlerts();
        return;
    }

    tbody.innerHTML = items.map(item => {
        const stockStatus = item.stock <= 0 ? 'out' : item.stock < item.minStock ? 'low' : 'ok';
        const badge = stockStatus === 'out'
            ? '<span class="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Em Falta</span>'
            : stockStatus === 'low'
            ? '<span class="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Baixo</span>'
            : '<span class="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">OK</span>';
        return `<tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-xs text-gray-500 font-mono">${item.code || '-'}</td>
            <td class="px-6 py-4 font-medium text-gray-800">${sanitizeHTML(item.name)}</td>
            <td class="px-6 py-4 text-sm text-gray-600 capitalize">${sanitizeHTML(item.category || '-')}</td>
            <td class="px-6 py-4">${badge} <span class="ml-1 text-sm font-bold">${item.stock}</span></td>
            <td class="px-6 py-4 text-sm text-gray-600">${item.minStock}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${sanitizeHTML(item.unit || '-')}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${item.expiryDate ? fmtDate(item.expiryDate) : '-'}</td>
            <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button onclick="openStockEntryModal('${item.id}','${item._source}')" class="p-1 text-rose-600 hover:bg-rose-50 rounded" title="Entrada de estoque">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                    </button>
                    <button onclick="deleteInventoryItem('${item.id}','${item._source}')" class="p-1 text-red-400 hover:bg-red-50 rounded" title="Remover">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');

    updateInventoryCounters();
    renderExpiryAlerts();
    if (window.lucide) lucide.createIcons();
}

function updateInventoryCounters() {
    const allProducts = db.products || [];
    const allInventory = db.inventory || [];
    const allItems = [...allInventory, ...allProducts];

    const outCount = allItems.filter(i => i.stock <= 0).length;
    const lowCount = allItems.filter(i => i.stock > 0 && i.stock < i.minStock).length;

    const elIngr = document.getElementById('inventory-ingredients');
    const elFin = document.getElementById('inventory-finished');
    const elOut = document.getElementById('out-of-stock');
    const elLow = document.getElementById('low-stock');

    if (elIngr) elIngr.textContent = allInventory.length;
    if (elFin) {
        const finishedCategories = getInventoryTabCategories('finished').map(item => item.value);
        elFin.textContent = allProducts.filter(p => finishedCategories.includes(p.category)).length;
    }
    if (elOut) elOut.textContent = outCount;
    if (elLow) elLow.textContent = lowCount;
}

function showInventoryTab(tab) {
    currentInventoryTab = tab;
    document.querySelectorAll('.inventory-tab').forEach(btn => {
        const isActive = btn.dataset.tab === tab;
        btn.className = `inventory-tab py-2 px-1 border-b-2 font-medium text-sm ${isActive
            ? 'border-rose-500 text-rose-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`;
    });
    renderInventory();
}

function clearInventoryFilters() {
    const fields = ['inventory-search','inventory-category','inventory-status','inventory-sort'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = el.tagName === 'SELECT' ? el.options[0].value : '';
    });
    renderInventory();
}

function exportInventoryCSV() {
    const items = [...(db.inventory || []), ...db.products];
    const escapeCSV = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const header = ['Codigo','Nome','Categoria','Estoque','Minimo','Unidade'].map(escapeCSV).join(',');
    const rows = items.map(i => [
        i.code || '',
        i.name || '',
        i.category || '',
        i.stock ?? '',
        i.minStock ?? 0,
        i.unit || ''
    ].map(escapeCSV).join(','));
    const csv = [header, ...rows].join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `estoque_sorveteria_${localDateKey()}.csv`;
    a.click();
    showNotification('CSV exportado!', 'success');
}

function openInventoryItemModal() {
    const stockEl = document.getElementById('inv-stock');
    const minStockEl = document.getElementById('inv-min-stock');
    if (stockEl && !stockEl.value) stockEl.value = '0';
    if (minStockEl && !minStockEl.value) minStockEl.value = '0';

    const modal = document.getElementById('inventoryItemModal');
    if (modal) modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

function closeInventoryItemModal() {
    const modal = document.getElementById('inventoryItemModal');
    if (modal) modal.classList.add('hidden');
    const form = document.getElementById('inventory-item-form');
    if (form) form.reset();
}

function saveInventoryItem(e) {
    if (e) e.preventDefault();
    const name     = document.getElementById('inv-name')?.value?.trim() || '';
    const category = document.getElementById('inv-category')?.value || 'outro';
    const unit     = document.getElementById('inv-unit')?.value || 'kg';
    const stock    = parseFloat(document.getElementById('inv-stock')?.value || 0);
    const minStock = parseFloat(document.getElementById('inv-min-stock')?.value || 0);
    const cost     = parseFloat(document.getElementById('inv-cost')?.value || 0);
    const expiry   = document.getElementById('inv-expiry')?.value || '';

    if (!name || stock < 0 || minStock < 0) {
        showNotification('Preencha nome, quantidade e estoque mínimo.', 'error');
        return;
    }

    const item = {
        id: getID(),
        code: 'ING' + Date.now().toString().slice(-4),
        name, category, unit, stock, minStock,
        cost, expiryDate: expiry || null,
        createdAt: new Date().toISOString()
    };

    if (!db.inventory) db.inventory = [];
    db.inventory.push(item);
    save();
    closeInventoryItemModal();
    showInventoryTab('ingredients');
    showNotification(`"${name}" adicionado ao estoque!`, 'success');
}

function renderExpiryAlerts() {
    const container=document.getElementById('expiry-alerts');if(!container)return;
    const items=getExpiryItems(db);const outer=container.parentElement;outer.classList.toggle('expiry-ok',items.length===0);
    outer.innerHTML='<h3 class="font-bold text-lg mb-3">Validade dos itens com saldo</h3><div id="expiry-alerts" class="space-y-2">'+(items.length?items.map(item=>'<div data-severity="'+(item.daysLeft<=0?'danger':'warning')+'" class="border rounded-lg p-3 flex items-center justify-between gap-3"><div><p class="font-bold text-sm">'+sanitizeHTML(item.name)+'</p><p class="text-sm">'+(item.daysLeft<0?'Vencido há '+Math.abs(item.daysLeft)+' dia(s)':item.daysLeft===0?'Vence hoje':'Vence em '+item.daysLeft+' dia(s)')+' · '+fmtDate(item.expiryDate)+'</p></div><button class="border rounded-lg px-3 py-2 text-sm" data-source="'+item.source+'" data-item-id="'+managementAttribute(item.id)+'" onclick="openOperationalStock(this.dataset.source,this.dataset.itemId)">Conferir item</button></div>').join(''):'<p class="text-sm text-gray-500">Nenhum item com saldo vencido ou vencendo nos próximos 7 dias.</p>')+'</div>';
}

function openStockEntryModal(itemId, source) {
    // Remove modal anterior se existir
    const old = document.getElementById('stock-entry-inline-modal');
    if (old) old.remove();

    const item = source === 'product'
        ? db.products.find(x => x.id === itemId)
        : (db.inventory || []).find(x => x.id === itemId);
    if (!item) return;

    const modal = document.createElement('div');
    modal.id = 'stock-entry-inline-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black/50" onclick="document.getElementById('stock-entry-inline-modal')?.remove()"></div>
        <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm z-10">
            <h3 class="font-bold text-gray-800 mb-1">Entrada de Estoque</h3>
            <p class="text-sm text-gray-500 mb-4">${sanitizeHTML(item.name)} — atual: ${item.stock} ${sanitizeHTML(item.unit || '')}</p>
            <label class="text-xs font-bold text-gray-500 uppercase">Quantidade a adicionar</label>
            <input type="number" id="stock-entry-qty" min="0.01" step="0.01"
                class="w-full border rounded-lg px-3 py-2 mt-1 mb-4 text-sm outline-none focus:border-rose-400"
                placeholder="Ex: 10">
            <div class="flex gap-2">
                <button onclick="confirmStockEntry('${itemId}','${source}')"
                    class="flex-1 bg-rose-500 text-white rounded-lg py-2 font-bold text-sm hover:bg-rose-600">Confirmar</button>
                <button onclick="document.getElementById('stock-entry-inline-modal')?.remove()"
                    class="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 font-bold text-sm hover:bg-gray-50">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => document.getElementById('stock-entry-qty')?.focus(), 100);
}

function confirmStockEntry(itemId, source) {
    const qty = parseFloat(document.getElementById('stock-entry-qty')?.value || 0);
    if (isNaN(qty) || qty <= 0) { showNotification('Informe uma quantidade válida.', 'error'); return; }
    if (source === 'product') {
        const p = db.products.find(x => x.id === itemId);
        if (p) { p.stock += qty; save(); renderInventory(); showNotification(`+${qty} adicionado ao estoque de ${p.name}`, 'success'); }
    } else {
        const i = (db.inventory || []).find(x => x.id === itemId);
        if (i) { i.stock += qty; save(); renderInventory(); showNotification(`+${qty} adicionado`, 'success'); }
    }
    document.getElementById('stock-entry-inline-modal')?.remove();
}

function openLossModal() {
    const old = document.getElementById('stock-loss-modal');
    if (old) old.remove();

    const items = [
        ...(db.inventory || []).map(i => ({ ...i, _source: 'inventory' })),
        ...(db.products || []).map(p => ({ ...p, _source: 'product' }))
    ].filter(i => i.stock !== undefined);

    if (items.length === 0) {
        showNotification('Nenhum item disponível para baixa.', 'info');
        return;
    }

    const modal = document.createElement('div');
    modal.id = 'stock-loss-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black/50" onclick="document.getElementById('stock-loss-modal')?.remove()"></div>
        <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg z-10">
            <div class="flex items-center justify-between mb-5">
                <h3 class="font-bold text-gray-800 flex items-center gap-2">
                    <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600"></i>
                    Registrar Perda
                </h3>
                <button onclick="document.getElementById('stock-loss-modal')?.remove()" class="text-gray-400 hover:text-gray-600">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <form onsubmit="saveLoss(event)" class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Item</label>
                    <select id="loss-item" required class="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-rose-400">
                        ${items.map(item => `<option value="${item._source}:${item.id}">${sanitizeHTML(item.name)} - atual: ${item.stock} ${sanitizeHTML(item.unit || '')}</option>`).join('')}
                    </select>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Quantidade</label>
                        <input type="number" id="loss-qty" min="0.01" step="0.01" required class="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-rose-400">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Motivo</label>
                        <select id="loss-reason" required class="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-rose-400">
                            <option value="validade">Validade</option>
                            <option value="quebra">Quebra</option>
                            <option value="degustacao">Degustação</option>
                            <option value="falha_equipamento">Falha de equipamento</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Notas</label>
                    <textarea id="loss-notes" rows="2" class="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-rose-400"></textarea>
                </div>
                <button type="submit" class="w-full bg-rose-500 text-white rounded-lg py-3 font-bold hover:bg-rose-600">Salvar Perda</button>
            </form>
        </div>`;
    document.body.appendChild(modal);
    if (window.lucide) lucide.createIcons();
}

function saveLoss(e) {
    if (e) e.preventDefault();
    const [source, itemId] = (document.getElementById('loss-item')?.value || '').split(':');
    const qty = parseFloat(document.getElementById('loss-qty')?.value || 0);
    const reason = document.getElementById('loss-reason')?.value || 'outro';
    const notes = document.getElementById('loss-notes')?.value?.trim() || '';

    if (!source || !itemId || qty <= 0) {
        showNotification('Informe item e quantidade válidos.', 'error');
        return;
    }

    const list = source === 'product' ? db.products : (db.inventory || []);
    const item = list.find(x => x.id === itemId);
    if (!item) {
        showNotification('Item não encontrado.', 'error');
        return;
    }

    if (needsWeightUnitReview(item)) { showNotification('Confira a unidade deste produto em Produtos antes de registrar a perda.', 'error'); return; }
    if (qty > Number(item.stock || 0)) { showNotification('A perda não pode ser maior que o estoque disponível.', 'error'); return; }
    item.stock = Number((Number(item.stock || 0) - qty).toFixed(6));
    if (!db.stockLosses) db.stockLosses = [];
    db.stockLosses.unshift({
        id: getID(),
        itemName: item.name,
        itemSource: source,
        itemId,
        qty,
        costTotal: roundMoney(Number(item.cost || 0) * qty),
        unit: item.unit || '',
        reason,
        date: new Date().toISOString(),
        notes
    });

    save();
    document.getElementById('stock-loss-modal')?.remove();
    renderInventory();
    showNotification('Perda registrada e estoque atualizado.', 'success');
}

function openStockTakeModal() {
    // Remover modal anterior se existir
    const old = document.getElementById('stocktake-modal');
    if (old) old.remove();

    // Agregar itens de inventory + products
    const allItems = [
        ...(db.inventory || []).map(i => ({...i, _src: 'inventory'})),
        ...db.products.map(p => ({...p, _src: 'product'}))
    ].filter(i => i.stock !== undefined);

    if (allItems.length === 0) {
        showNotification('Nenhum item para contar.', 'info');
        return;
    }

    const modal = document.createElement('div');
    modal.id = 'stocktake-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black/50" onclick="document.getElementById('stocktake-modal')?.remove()"></div>
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col z-10">
            <div class="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 class="font-bold text-gray-800">Inventário Físico</h3>
                <button onclick="document.getElementById('stocktake-modal')?.remove()" class="text-gray-400 hover:text-gray-600 p-1">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <p class="text-sm text-gray-500 px-5 pt-3 pb-2">Informe as quantidades contadas. Deixe em branco para não alterar.</p>
            <div class="overflow-y-auto flex-1 px-5 py-3 space-y-2">
                ${allItems.map(item => `
                    <div class="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-800">${sanitizeHTML(item.name)}</p>
                            <p class="text-xs text-gray-400">Atual: ${item.stock} ${item.unit || ''}</p>
                        </div>
                        <input type="number" min="0" step="0.01" placeholder="Contado"
                            data-id="${item.id}" data-src="${item._src}"
                            class="stocktake-input w-28 border rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-rose-400">
                    </div>
                `).join('')}
            </div>
            <div class="p-5 border-t border-gray-100 flex gap-3">
                <button onclick="document.getElementById('stocktake-modal')?.remove()"
                    class="flex-1 border border-gray-300 rounded-xl py-2 font-bold text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button onclick="confirmStockTake()"
                    class="flex-1 bg-rose-500 text-white rounded-xl py-2 font-bold text-sm hover:bg-rose-600">Aplicar Ajustes</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    if (window.lucide) lucide.createIcons();
}

function confirmStockTake() {
    let changes = 0;
    document.querySelectorAll('.stocktake-input').forEach(input => {
        if (input.value === '') return;
        const qty = parseFloat(input.value);
        if (isNaN(qty) || qty < 0) return;
        const id = input.dataset.id;
        const src = input.dataset.src;

        if (src === 'inventory') {
            const item = (db.inventory || []).find(x => x.id === id);
            if (item) { item.stock = qty; changes++; }
        } else {
            const product = db.products.find(x => x.id === id);
            if (product) { product.stock = qty; changes++; }
        }
    });

    if (changes > 0) {
        save();
        document.getElementById('stocktake-modal')?.remove();
        renderInventory();
        showNotification(`${changes} item(ns) ajustado(s)!`, 'success');
    } else {
        showNotification('Nenhuma alteração foi feita.', 'warning');
    }
}

function deleteInventoryItem(itemId, source) {
    if (!confirm('Remover este item do estoque?')) return;
    if (source === 'inventory') {
        db.inventory = (db.inventory || []).filter(x => x.id !== itemId);
        save(); renderInventory(); showNotification('Item removido.', 'success');
    } else {
        showNotification('Produtos são gerenciados na aba Produtos.', 'info');
    }
}
