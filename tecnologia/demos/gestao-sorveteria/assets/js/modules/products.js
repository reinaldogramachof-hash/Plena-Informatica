// ============================================================
// products.js — Catálogo de Produtos
// Gestão Sorveteria & Açaí Pro
// ============================================================

let currentProductsTab = 'products';

function populateProductCategorySelect() {
    const select = document.getElementById('p-category');
    if (!select) return;
    const currentValue = select.value || '';
    select.innerHTML = '<option value="">Selecione...</option>' +
        PRODUCT_CATEGORIES.map(category => `<option value="${category.value}">${sanitizeHTML(category.label)}</option>`).join('');
    select.value = PRODUCT_CATEGORIES.some(category => category.value === currentValue) ? currentValue : '';
}

function renderProductsCatalog(category = 'all') {
    syncProductsTabs();
    if (currentProductsTab === 'additions') { renderAdditions(); return; }
    if (currentProductsTab === 'combos') {
        renderCombos();
        return;
    }

    const container = document.getElementById('products-catalog');
    const emptyMsg = document.getElementById('no-products-msg');

    if (!container) return; // Segurança

    container.innerHTML = '';

    let filtered = db.products;
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    // O filtro continua identificado mesmo quando não há itens na categoria.
    document.querySelectorAll('#view-products button[onclick^="filterProductCatalog"]').forEach(btn => {
        const active = btn.getAttribute('onclick').includes(`'${category}'`);
        btn.setAttribute('aria-pressed', String(active));
        btn.classList.toggle('bg-rose-500', active);
        btn.classList.toggle('text-white', active);
        btn.classList.toggle('bg-gray-100', !active);
        btn.classList.toggle('text-gray-700', !active);
    });

    if (filtered.length === 0) {
        if (emptyMsg) emptyMsg.classList.remove('hidden');
        return;
    }

    if (emptyMsg) emptyMsg.classList.add('hidden');

    container.innerHTML = filtered.map(product => {
        const mode = pdvProductMode(product);
        const label = PRODUCT_CATEGORIES.find(item => item.value === product.category)?.label || product.category || 'Produto';
        const id = managementAttribute(product.id);
        return `<article class="catalog-product" data-product-id="${id}">
            <div class="catalog-product-top"><span class="catalog-product-type"><i data-lucide="${mode.icon}" aria-hidden="true"></i>${sanitizeHTML(label)}</span></div>
            <div><h3>${sanitizeHTML(product.name)}</h3><small>${sanitizeHTML(mode.label)}${product.flavor ? ' · ' + sanitizeHTML(product.flavor) : ''}</small></div>
            <p class="catalog-product-stock" data-low="${Number(product.stock) <= Number(product.minStock || 0)}" data-empty="${Number(product.stock) <= 0}">${sanitizeHTML(pdvProductStock(product))}</p>
            <div class="catalog-product-bottom"><span class="catalog-product-price">${sanitizeHTML(pdvProductPrice(product))}</span>
                <div class="catalog-product-actions">
                    <button onclick="openEditProductModal(this.closest('[data-product-id]').dataset.productId)" aria-label="Editar ${managementAttribute(product.name)}" title="Editar produto"><i data-lucide="pencil" aria-hidden="true"></i></button>
                    <button onclick="deleteProduct(this.closest('[data-product-id]').dataset.productId)" aria-label="Excluir ${managementAttribute(product.name)}" title="Excluir produto"><i data-lucide="trash-2" aria-hidden="true"></i></button>
                </div>
            </div>
        </article>`;
    }).join('');

    if (window.lucide) lucide.createIcons();

}

function syncProductsTabs() {
    document.querySelectorAll('.products-main-tab').forEach(btn => {
        const isActive = btn.dataset.tab === currentProductsTab;
        btn.setAttribute('aria-pressed', String(isActive));
        btn.className = `products-main-tab py-2 px-1 border-b-2 font-medium text-sm ${isActive
            ? 'border-rose-500 text-rose-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`;
    });
    const productsPanel = document.getElementById('products-panel');
    const combosPanel = document.getElementById('combos-panel');
    if (productsPanel) productsPanel.classList.toggle('hidden', currentProductsTab !== 'products');
    if (combosPanel) combosPanel.classList.toggle('hidden', currentProductsTab !== 'combos');
    document.getElementById('additions-panel')?.classList.toggle('hidden', currentProductsTab !== 'additions');
}

function showProductsTab(tab) {
    currentProductsTab = tab;
    syncProductsTabs();
    if (tab === 'combos') renderCombos();
    else if (tab === 'additions') renderAdditions();
    else renderProductsCatalog();
}

function renderCombos() {
    const container = document.getElementById('combos-list');
    if (!container) return;
    const combos = db.combos || [];

    if (combos.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-400">
                <i data-lucide="badge-percent" class="w-12 h-12 mx-auto mb-3 text-gray-300"></i>
                <p>Nenhum combo cadastrado.</p>
            </div>`;
    } else {
        container.innerHTML = combos.map(combo => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <p class="font-bold text-gray-800">${sanitizeHTML(combo.name)}</p>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${combo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">${combo.active ? 'Ativo' : 'Inativo'}</span>
                        </div>
                        <p class="text-lg font-bold text-rose-600 mt-1">${fmtMoney(combo.comboPrice || 0)}</p>
                        <p class="text-xs text-gray-500 mt-1">${describeComboItems(combo)}</p>
                    </div>
                    <div class="flex gap-1 shrink-0">
                        <button onclick="openEditComboModal('${combo.id}')" class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Editar">
                            <i data-lucide="pencil" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteCombo('${combo.id}')" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Excluir">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (window.lucide) lucide.createIcons();
}

function describeComboItems(combo) {
    return (combo.items || []).map(item => {
        const product = (db.products || []).find(p => p.id === item.productId);
        return `${item.qty || 1}x ${product ? sanitizeHTML(product.name) : 'Produto removido'}`;
    }).join(', ') || 'Sem itens';
}

function openComboModal() {
    ensureComboModal();
    document.getElementById('combo-modal-title').textContent = 'Novo Combo';
    document.getElementById('combo-id').value = '';
    document.getElementById('combo-name').value = '';
    document.getElementById('combo-price').value = '';
    document.getElementById('combo-active').checked = true;
    document.getElementById('combo-items-list').innerHTML = '';
    addComboItemRow();
    document.getElementById('comboModal').classList.remove('hidden');
}

function openEditComboModal(id) {
    const combo = (db.combos || []).find(c => c.id === id);
    if (!combo) return;
    openComboModal();
    document.getElementById('combo-modal-title').textContent = 'Editar Combo';
    document.getElementById('combo-id').value = combo.id;
    document.getElementById('combo-name').value = combo.name || '';
    document.getElementById('combo-price').value = combo.comboPrice || '';
    document.getElementById('combo-active').checked = combo.active !== false;
    document.getElementById('combo-items-list').innerHTML = '';
    (combo.items || []).forEach(item => addComboItemRow(item));
}

function addComboItemRow(item = {}) {
    const container = document.getElementById('combo-items-list');
    if (!container) return;
    const options = (db.products || []).map(p => `<option value="${p.id}" ${p.id === item.productId ? 'selected' : ''}>${sanitizeHTML(p.name)}</option>`).join('');
    container.insertAdjacentHTML('beforeend', `
        <div class="combo-item-row grid grid-cols-[1fr_90px_36px] gap-2">
            <select class="combo-product border p-2 rounded text-sm">${options}</select>
            <input type="number" class="combo-qty border p-2 rounded text-sm" min="0.01" step="0.01" value="${item.qty || 1}">
            <button type="button" onclick="this.parentElement.remove()" class="text-red-500 hover:bg-red-50 rounded">
                <i data-lucide="x" class="w-4 h-4 mx-auto"></i>
            </button>
        </div>
    `);
    if (window.lucide) lucide.createIcons();
}

function saveCombo(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('combo-id')?.value || getID();
    const name = document.getElementById('combo-name')?.value.trim() || '';
    const comboPrice = parseFloat(document.getElementById('combo-price')?.value || 0);
    const active = document.getElementById('combo-active')?.checked !== false;
    const items = [];

    document.querySelectorAll('#combo-items-list .combo-item-row').forEach(row => {
        const productId = row.querySelector('.combo-product')?.value || '';
        const qty = parseFloat(row.querySelector('.combo-qty')?.value || 0);
        if (productId && qty > 0) items.push({ productId, qty });
    });

    if (!name || comboPrice <= 0 || items.length === 0) {
        showNotification('Informe nome, itens e preço do combo.', 'error');
        return;
    }

    if (!db.combos) db.combos = [];
    const existing = db.combos.findIndex(c => c.id === id);
    const combo = { id, name, items, comboPrice, active };
    if (existing >= 0) db.combos[existing] = combo;
    else db.combos.push(combo);
    save();
    closeModal('comboModal');
    renderCombos();
    showNotification('Combo salvo com sucesso!', 'success');
}

function deleteCombo(id) {
    if (!confirm('Excluir este combo?')) return;
    db.combos = (db.combos || []).filter(c => c.id !== id);
    save();
    renderCombos();
    showNotification('Combo excluído.', 'success');
}

function ensureComboModal() {
    if (document.getElementById('comboModal')) return;
    const modal = document.createElement('div');
    modal.id = 'comboModal';
    modal.className = 'fixed inset-0 modal-backdrop hidden z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 id="combo-modal-title" class="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <i data-lucide="badge-percent" class="w-5 h-5 text-rose-600"></i>
                    Novo Combo
                </h3>
                <button onclick="closeModal('comboModal')" class="text-gray-400 hover:text-gray-600">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <form onsubmit="saveCombo(event)" class="space-y-4">
                <input type="hidden" id="combo-id">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Nome do Combo</label>
                        <input type="text" id="combo-name" required class="w-full border p-2 rounded-lg text-sm mt-1 outline-none focus:border-rose-400">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Preço Total (R$)</label>
                        <input type="number" id="combo-price" min="0.01" step="0.01" required class="w-full border p-2 rounded-lg text-sm mt-1 outline-none focus:border-rose-400">
                    </div>
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Itens do Combo</label>
                    <div id="combo-items-list" class="space-y-2 mb-2"></div>
                    <button type="button" onclick="addComboItemRow()" class="text-sm text-rose-500 hover:text-rose-400 flex items-center gap-1">
                        <i data-lucide="plus" class="w-4 h-4"></i> Adicionar Produto
                    </button>
                </div>
                <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input type="checkbox" id="combo-active" class="rounded text-rose-500 focus:ring-rose-500" checked>
                    Combo ativo no PDV
                </label>
                <button type="submit" class="w-full bg-rose-500 text-white py-3 rounded-lg font-bold hover:bg-rose-600">Salvar Combo</button>
            </form>
        </div>`;
    document.body.appendChild(modal);
    if (window.lucide) lucide.createIcons();
}

function filterProductCatalog(category) {
    renderProductsCatalog(category);
}

function openEditProductModal(id) {
    const product = db.products.find(p => p.id === id);
    if (!product) return;

    // Atualizar título
    const titleEl = document.getElementById('product-modal-title');
    if (titleEl) titleEl.textContent = 'Editar Produto';

    // Preencher formulário com dados do produto
    populateProductCategorySelect();
    document.getElementById('p-id').value = product.id;
    document.getElementById('p-code').value = product.code || '';
    document.getElementById('p-name').value = product.name || '';
    document.getElementById('p-category').value = product.category || '';
    document.getElementById('p-flavor').value = product.flavor || '';
    document.getElementById('p-cost').value = product.cost ?? 0;
    document.getElementById('p-price').value = product.price || '';
    document.getElementById('p-temperature').value = product.temperature || '';
    document.getElementById('p-stock').value = product.stock ?? 0;
    document.getElementById('p-min-stock').value = product.minStock ?? 0;
    document.getElementById('p-expiry').value = product.expiryDate || '';
    document.getElementById('p-unit').value = product.unit || 'unidade';
    document.getElementById('p-ingredients').value = product.ingredients || '';
    document.getElementById('p-description').value = product.description || '';
    document.getElementById('p-tipo').value = product.tipo || 'padrao';

    // Campos condicionais
    if (product.tipo === 'massa') {
        document.getElementById('p-price-hundred').value = product.pricePerHundredGrams || '';
    }

    if (product.tipo === 'acai' && product.sizes) {
        document.getElementById('acai-sizes-list').innerHTML = '';
        product.sizes.forEach(s => {
            addAcaiSizeRow();
            const rows = document.querySelectorAll('.acai-size-row');
            const lastRow = rows[rows.length - 1];
            lastRow.querySelector('.size-label').value = s.label;
            lastRow.querySelector('.size-price').value = s.price;
            lastRow.querySelector('.size-stock-qty').value = s.stockQty ?? '';
        });
    } else {
        document.getElementById('acai-sizes-list').innerHTML = '';
    }

    toggleProductTypeFields();
    document.getElementById('p-unit-review').classList.toggle('hidden', !needsWeightUnitReview(product));
    if (needsWeightUnitReview(product)) document.getElementById('p-unit').value = '';
    updateProductUnitLabels();
    document.getElementById('productModal').classList.remove('hidden');
    document.getElementById('p-optional-fields').open = false;
}

function openProductModal() {
    // Resetar título
    const titleEl = document.getElementById('product-modal-title');
    if (titleEl) titleEl.textContent = 'Novo Produto';

    document.getElementById('p-id').value = '';
    document.getElementById('p-code').value = '';
    document.getElementById('p-name').value = '';
    populateProductCategorySelect();
    document.getElementById('p-category').value = '';
    document.getElementById('p-flavor').value = '';
    document.getElementById('p-cost').value = '0';
    document.getElementById('p-price').value = '';
    document.getElementById('p-temperature').value = '';
    document.getElementById('p-stock').value = '0';
    document.getElementById('p-min-stock').value = '10';
    document.getElementById('p-expiry').value = '';
    document.getElementById('p-unit').value = 'unidade';
    document.getElementById('p-ingredients').value = '';
    document.getElementById('p-description').value = '';

    // Novos campos
    document.getElementById('p-tipo').value = 'padrao';
    document.getElementById('p-price-hundred').value = '';
    document.getElementById('acai-sizes-list').innerHTML = '';
    toggleProductTypeFields();
    document.getElementById('p-unit-review').classList.add('hidden');

    document.getElementById('productModal').classList.remove('hidden');
    document.getElementById('p-optional-fields').open = false;
}

function saveProduct(e) {
    e.preventDefault();
    const product = {
        id: document.getElementById('p-id').value || getID(),
        code: document.getElementById('p-code').value,
        name: document.getElementById('p-name').value,
        category: document.getElementById('p-category').value,
        flavor: document.getElementById('p-flavor').value,
        cost: parseFloat(document.getElementById('p-cost').value) || 0,
        price: parseFloat(document.getElementById('p-price').value) || 0,
        temperature: document.getElementById('p-temperature').value,
        stock: parseFloat(document.getElementById('p-stock').value) || 0,
        minStock: parseFloat(document.getElementById('p-min-stock').value) || 0,
        expiryDate: document.getElementById('p-expiry')?.value || null,
        unit: document.getElementById('p-unit').value,
        ingredients: document.getElementById('p-ingredients').value,
        description: document.getElementById('p-description').value,
        tipo: document.getElementById('p-tipo').value || 'padrao'
    };
    product.stockSchemaVersion = 2;
    if (product.tipo === 'massa' && !['kg', 'gramas'].includes(product.unit)) {
        showNotification('Confira o saldo e o custo e escolha gramas ou kg como unidade do estoque.', 'error'); return;
    }

    const duplicateCode = (db.products || []).find(p =>
        p.id !== product.id &&
        String(p.code || '').trim().toLowerCase() === String(product.code || '').trim().toLowerCase()
    );
    if (duplicateCode) {
        showNotification('Já existe um produto com este código.', 'error');
        return;
    }

    if (product.tipo === 'massa') {
        product.pricePerHundredGrams = parseFloat(document.getElementById('p-price-hundred').value) || 0;
        if (product.pricePerHundredGrams <= 0) { showNotification('Informe o preço por 100 gramas.', 'error'); return; }
    } else if (product.tipo === 'acai') {
        product.sizes = [];
        document.querySelectorAll('.acai-size-row').forEach(row => {
            const label = row.querySelector('.size-label').value;
            const price = parseFloat(row.querySelector('.size-price').value) || 0;
            const rawConsumption = row.querySelector('.size-stock-qty').value;
            if (label) product.sizes.push({ label, price, ...(rawConsumption !== '' ? { stockQty: Number(rawConsumption) } : {}) });
        });
        try {
            if (!product.sizes.length) throw new Error('Cadastre ao menos um tamanho de açaí.');
            product.sizes.forEach(size => {
                if (size.price <= 0) throw new Error('Informe o preço de cada tamanho.');
                size.stockQty = getAcaiStockQuantity(product, size);
            });
        } catch (error) { showNotification(error.message, 'error'); return; }
    }

    // Check if update or new
    const existingIndex = db.products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
        db.products[existingIndex] = product;
    } else {
        db.products.push(product);
    }

    save();
    closeModal('productModal');
    renderProductsCatalog();
    showNotification('Produto salvo com sucesso!', 'success');
}

function deleteProduct(id) {
    if (confirm('Excluir produto?')) {
        db.products = db.products.filter(p => p.id !== id);
        save();
        renderProductsCatalog();
    }
}

// ── Funções de Interface do Modal de Produto ──

function toggleProductTypeFields() {
    const tipo = document.getElementById('p-tipo').value;
    document.getElementById('p-sale-hint').textContent = ({padrao:'Informe preço e custo para cada unidade vendida.',massa:'O cliente informa o peso em gramas. Cadastre o preço por 100 g e confira a unidade do estoque.',acai:'Cadastre os tamanhos, seus preços e o consumo de estoque de cada copo.'})[tipo];
    const wPrice = document.getElementById('wrapper-p-price');
    const wPriceHundred = document.getElementById('wrapper-p-price-hundred');
    const wAcaiSizes = document.getElementById('wrapper-p-acai-sizes');
    const priceInput = document.getElementById('p-price');

    if (wPrice) wPrice.classList.toggle('hidden', tipo !== 'padrao');
    if (wPriceHundred) wPriceHundred.classList.toggle('hidden', tipo !== 'massa');
    if (wAcaiSizes) wAcaiSizes.classList.toggle('hidden', tipo !== 'acai');

    if (tipo === 'padrao') {
        priceInput.setAttribute('required', 'true');
    } else {
        priceInput.removeAttribute('required');
    }

    const unitInput = document.getElementById('p-unit');
    if (tipo === 'massa' && !document.getElementById('p-id').value && !['kg', 'gramas'].includes(unitInput.value)) unitInput.value = 'kg';
    updateProductUnitLabels();
}

function updateProductUnitLabels() {
    const unit = document.getElementById('p-unit').selectedOptions[0]?.text || 'unidade a conferir';
    document.getElementById('p-cost-label').textContent = `Custo por ${unit} (R$)`;
    document.getElementById('p-stock-label').textContent = `Estoque atual (${unit})`;
    document.getElementById('p-min-stock-label').textContent = `Estoque mínimo (${unit})`;
}

function addAcaiSizeRow() {
    const container = document.getElementById('acai-sizes-list');
    const div = document.createElement('div');
    div.className = 'acai-size-row grid grid-cols-2 gap-2 items-center border rounded-lg p-2';
    div.innerHTML = `
        <input type="text" placeholder="Tamanho, ex.: 300 ml" aria-label="Tamanho do açaí" class="size-label col-span-2 w-full border p-2 rounded-lg text-sm outline-none">
        <input type="number" step="0.01" min="0" placeholder="Preço (R$)" aria-label="Preço deste tamanho" class="size-price w-full border p-2 rounded-lg text-sm outline-none">
        <input type="number" step="0.001" min="0.001" placeholder="Consumo no estoque" aria-label="Consumo na unidade do estoque para este tamanho" title="Ex.: estoque em litros, copo 300 ml = 0,3. Deixe vazio para calcular a partir do tamanho em ml ou g." class="size-stock-qty w-full border p-2 rounded-lg text-sm">
        <button type="button" onclick="this.parentElement.remove()" class="col-span-2 justify-self-end text-red-500 hover:text-red-700 p-2" aria-label="Remover tamanho"><i data-lucide="x" class="w-4 h-4"></i></button>
    `;
    container.appendChild(div);
    if (window.lucide) lucide.createIcons();
}
