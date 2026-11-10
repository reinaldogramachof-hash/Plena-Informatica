// ==========================================
// MÓDULO PDV (FRENTE DE CAIXA) - GESTÃO SORVETERIA
// ==========================================

let pdvCart = [];
let lastSaleId = null;
const PDV_DRAFT_KEY = DB_KEY + ':pdv-draft-v1';
let pdvOperationId = getID();
let pendingPdvDraft = null;
let pdvDraftReady = false;

function persistPdvDraft() {
    if (!pdvDraftReady || pendingPdvDraft) return;
    try {
        if (!pdvCart.length) { localStorage.removeItem(PDV_DRAFT_KEY); return; }
        localStorage.setItem(PDV_DRAFT_KEY, JSON.stringify({
            version: 1, operationId: pdvOperationId, items: pdvCart,
            clientId: document.getElementById('customer-select')?.value || '',
            discount: document.getElementById('pdv-discount')?.value || '',
            received: document.getElementById('pdv-amount-received')?.value || '',
            paymentMethod: document.querySelector('input[name="pdv-payment"]:checked')?.value || 'dinheiro',
            loyaltyPoints: document.getElementById('pdv-loyalty-points')?.value || '0',
            savedAt: new Date().toISOString()
        }));
    } catch (error) { showNotification('Não foi possível salvar o rascunho neste dispositivo. Faça um backup e confira o espaço disponível.', 'error'); }
}
function initPdvDraft() {
    try {
        const draft = JSON.parse(localStorage.getItem(PDV_DRAFT_KEY) || 'null');
        if (draft?.version === 1 && Array.isArray(draft.items) && draft.items.length && draft.operationId) {
            if (!db.sales.some(s => s.operationId === draft.operationId)) pendingPdvDraft = draft;
            else localStorage.removeItem(PDV_DRAFT_KEY);
        }
    } catch (error) { showNotification('Não foi possível ler o rascunho da venda.', 'error'); }
    pdvDraftReady = true;
    document.getElementById('pdv-draft-notice')?.classList.toggle('hidden', !pendingPdvDraft);
    document.getElementById('view-cashier')?.addEventListener('input', persistPdvDraft);
    document.getElementById('view-cashier')?.addEventListener('change', persistPdvDraft);
}
function canEditPdv() {
    if (!pendingPdvDraft) return true;
    router('cashier');
    document.getElementById('pdv-draft-notice')?.scrollIntoView({ block: 'center' });
    showNotification('Retome ou descarte a venda salva antes de iniciar outra.', 'info');
    return false;
}
function resumePdvDraft() {
    if (!pendingPdvDraft) return;
    const draft = pendingPdvDraft;
    pdvCart = draft.items;
    pdvOperationId = draft.operationId;
    pendingPdvDraft = null;
    populateCustomerSelect();
    document.getElementById('customer-select').value = draft.clientId || '';
    document.getElementById('pdv-discount').value = draft.discount;
    document.getElementById('pdv-amount-received').value = draft.received;
    if(document.getElementById('pdv-loyalty-points'))document.getElementById('pdv-loyalty-points').value=draft.loyaltyPoints||'0';
    const radio = [...document.querySelectorAll('[name="pdv-payment"]')].find(el => el.value === draft.paymentMethod);
    if (radio) radio.checked = true;
    document.getElementById('pdv-draft-notice').classList.add('hidden');
    toggleChangeInput(); renderCart();
}
function discardPdvDraft() {
    if (!confirm('Descartar a venda em andamento? As vendas já finalizadas não serão alteradas.')) return;
    try { localStorage.removeItem(PDV_DRAFT_KEY); }
    catch (error) { showNotification('Não foi possível descartar o rascunho.', 'error'); return; }
    pendingPdvDraft = null; pdvCart = []; pdvOperationId = getID();
    document.getElementById('pdv-draft-notice').classList.add('hidden');
    renderCart();
}

// ========== CLIENTES: Vinculação no PDV ==========
function populateCustomerSelect() {
    const sel = document.getElementById('customer-select');
    if (!sel) return;
    const selected = sel.value;
    sel.innerHTML = '<option value="">Cliente avulso</option>' +
        (db.clients || []).map(c =>
            `<option value="${c.id}">${sanitizeHTML(c.name)}</option>`
        ).join('');
    if ([...sel.options].some(option => option.value === selected)) sel.value = selected;
}

function renderCashierProducts(event) {
    const searchInput = document.getElementById('product-search');
    const term = (searchInput?.value || '').toLowerCase();
    const rawTerm = (searchInput?.value || '').trim();
    const grid = document.getElementById('products-grid');
    const emptyMsg = document.getElementById('pdv-empty-products');

    if (!grid) return;

    // Popular select de clientes
    populateCustomerSelect();
    renderCashierSessionStatus();

    // Filtra produtos ativos
    let filtered = db.products || [];
    if (window.currentPdvCategory && window.currentPdvCategory !== 'all') {
        filtered = filtered.filter(p => p.category === window.currentPdvCategory);
    }

    filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        (product.id && product.id.toLowerCase().includes(term)) ||
        (product.code && product.code.toLowerCase().includes(term)) ||
        (product.flavor && product.flavor.toLowerCase().includes(term))
    );
    const favoriteIds = new Set(db.settings.pdvFavorites || []);
    if (document.getElementById('pdv-favorites-filter')?.getAttribute('aria-pressed') === 'true') filtered = filtered.filter(product => favoriteIds.has(product.id));
    const salesCount = new Map();
    for (const sale of db.sales) for (const item of sale.items || []) salesCount.set(item.productId, (salesCount.get(item.productId) || 0) + Number(item.qty || 0));
    const sort = document.getElementById('pdv-product-sort')?.value || 'frequent';
    filtered = [...filtered].sort((a,b) => (sort === 'frequent' ? (salesCount.get(b.id) || 0) - (salesCount.get(a.id) || 0) : 0) || a.name.localeCompare(b.name));

    // Suporte a Leitor de Código de Barras (Enter)
    if (event && event.key === 'Enter' && rawTerm !== '') {
        const normalizedTerm = rawTerm.toLowerCase();
        const exactMatch = filtered.find(p =>
            p.id.toLowerCase() === normalizedTerm ||
            (p.code && p.code.toLowerCase() === normalizedTerm)
        );
        const itemToAdd = exactMatch || (filtered.length === 1 ? filtered[0] : null);

        if (itemToAdd) {
            addToCart(itemToAdd.id);
            searchInput.value = '';
            renderCashierProducts();
            return;
        }
    }

    const activeCombos = (db.combos || [])
        .filter(combo => combo.active !== false)
        .filter(combo => combo.name.toLowerCase().includes(term));

    if (filtered.length === 0 && activeCombos.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center text-gray-400 py-8" id="pdv-empty-products">
            <i data-lucide="ice-cream" class="w-10 h-10 mx-auto mb-2 text-gray-300"></i>
            <p>Nenhum produto encontrado.</p></div>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    const productCards = filtered.map(p => {
        const mode=pdvProductMode(p),empty=Number(p.stock)<=0;
        return `<article class="pdv-product-card bg-white border border-gray-200" data-product-id="${managementAttribute(p.id)}" data-empty="${empty}">
            <button type="button" class="pdv-favorite-toggle" onclick="togglePdvFavorite(this.parentElement.dataset.productId)" aria-label="${favoriteIds.has(p.id)?'Remover dos favoritos':'Marcar como favorito'}" aria-pressed="${favoriteIds.has(p.id)}"><i data-lucide="star" ${favoriteIds.has(p.id)?'fill="currentColor"':''} aria-hidden="true"></i></button>
            <button type="button" class="pdv-product-pick" onclick="addToCart(this.parentElement.dataset.productId)" ${empty?'disabled':''} title="${managementAttribute(p.name)}">
                <div class="pdv-product-meta"><i data-lucide="${mode.icon}" aria-hidden="true"></i><span>${mode.label}</span></div>
                <div><p class="pdv-product-name">${sanitizeHTML(p.name)}</p>${p.flavor?`<p class="pdv-product-flavor">${sanitizeHTML(p.flavor)}</p>`:''}</div>
                <div><span class="pdv-product-price">${pdvProductPrice(p)}</span><span class="pdv-product-stock">${sanitizeHTML(pdvProductStock(p))}</span></div>
            </button></article>`;
    }).join('');

    const comboCards = activeCombos.map(combo => `<article class="pdv-product-card bg-white border border-gray-200" data-combo-id="${managementAttribute(combo.id)}"><button type="button" class="pdv-product-pick" onclick="addComboToCart(this.parentElement.dataset.comboId)"><div class="pdv-product-meta"><i data-lucide="package-plus" aria-hidden="true"></i><span>Combo</span></div><p class="pdv-product-name">${sanitizeHTML(combo.name)}</p><span class="pdv-product-price">${fmtMoney(combo.comboPrice||0)}</span></button></article>`).join('');

    grid.innerHTML = productCards + comboCards;

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function getOpenCashierSession() {
    return (db.cashierSessions || []).find(s => s.status === 'aberto') || null;
}

function updateCashierClosedWarning() {
    const warning = document.getElementById('cashier-closed-cash-warning');
    if (!warning) return;
    const paymentMethod = document.querySelector('input[name="pdv-payment"]:checked')?.value || 'dinheiro';
    const shouldShow = paymentMethod === 'dinheiro' && !getOpenCashierSession();
    warning.classList.toggle('hidden', !shouldShow);
}

function getMassaStockDeduction(product, grams) {
    requireWeightUnit(product);
    return convertStockQuantity(grams, 'gramas', product.unit);
}

function getMassaAvailableGrams(product) {
    requireWeightUnit(product);
    return convertStockQuantity(Number(product.stock || 0), product.unit, 'gramas');
}

function renderCashierSessionStatus() {
    const container = document.getElementById('cashier-session-controls');
    if (!container) return;

    const session = getOpenCashierSession();
    if (!session) {
        container.innerHTML = `
            <button onclick="openCashierSession()"
                class="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 transition-colors">
                <i data-lucide="unlock" class="w-4 h-4"></i>
                Abrir Caixa
            </button>`;
    } else {
        container.innerHTML = `
            <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                    <i data-lucide="circle-dollar-sign" class="w-4 h-4"></i>
                    Caixa aberto desde ${new Date(session.openedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button onclick="openSangriaModal()"
                    class="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-bold hover:bg-amber-200 transition-colors">
                    <i data-lucide="minus-circle" class="w-4 h-4"></i>
                    Sangria
                </button>
                <button onclick="openCloseCashierModal()"
                    class="flex items-center gap-2 px-3 py-2 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 transition-colors">
                    <i data-lucide="lock" class="w-4 h-4"></i>
                    Fechar Caixa
                </button>
            </div>`;
    }

    if (window.lucide) lucide.createIcons();
    updateCashierClosedWarning();
}

function openCashierSession() {
    const current = getOpenCashierSession();
    if (current) {
        showNotification('Já existe um caixa aberto.', 'info');
        return;
    }
    const modal = document.createElement('div');
    modal.id = 'cashier-open-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black/50" onclick="document.getElementById('cashier-open-modal')?.remove()"></div>
        <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm z-10">
            <h3 class="font-bold text-gray-800 mb-4">Abrir Caixa</h3>
            <form onsubmit="confirmOpenCashierSession(event)" class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Valor inicial em dinheiro</label>
                    <input type="number" id="cashier-opening-amount" min="0" step="0.01" required class="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-rose-400">
                </div>
                <button type="submit" class="w-full bg-rose-500 text-white rounded-lg py-3 font-bold hover:bg-rose-600">Abrir Caixa</button>
            </form>
        </div>`;
    document.body.appendChild(modal);
}

function confirmOpenCashierSession(e) {
    if (e) e.preventDefault();
    const openingAmount = parseFloat(document.getElementById('cashier-opening-amount')?.value || 0);
    if (openingAmount < 0) {
        showNotification('Informe um valor inicial válido.', 'error');
        return;
    }
    if (!db.cashierSessions) db.cashierSessions = [];
    db.cashierSessions.unshift({
        id: getID(),
        openedAt: new Date().toISOString(),
        openingAmount,
        closedAt: null,
        closingAmount: null,
        expectedAmount: null,
        difference: null,
        notes: '',
        status: 'aberto',
        sangrias: []
    });
    save();
    document.getElementById('cashier-open-modal')?.remove();
    renderCashierSessionStatus();
    showNotification('Caixa aberto com sucesso.', 'success');
}

function openSangriaModal() {
    if (!getOpenCashierSession()) {
        showNotification('Abra o caixa antes de registrar sangria.', 'warning');
        return;
    }
    const modal = document.createElement('div');
    modal.id = 'sangria-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black/50" onclick="document.getElementById('sangria-modal')?.remove()"></div>
        <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm z-10">
            <h3 class="font-bold text-gray-800 mb-4">Registrar Sangria</h3>
            <form onsubmit="confirmSangria(event)" class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Valor</label>
                    <input type="number" id="sangria-amount" min="0.01" step="0.01" required class="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-rose-400">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Motivo</label>
                    <input type="text" id="sangria-reason" required class="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-rose-400">
                </div>
                <button type="submit" class="w-full bg-rose-500 text-white rounded-lg py-3 font-bold hover:bg-rose-600">Salvar Sangria</button>
            </form>
        </div>`;
    document.body.appendChild(modal);
}

function confirmSangria(e) {
    if (e) e.preventDefault();
    const amount = parseFloat(document.getElementById('sangria-amount')?.value || 0);
    const reason = document.getElementById('sangria-reason')?.value.trim() || '';
    registerSangria(amount, reason);
}

function registerSangria(amount, reason) {
    const session = getOpenCashierSession();
    if (!session) {
        showNotification('Nenhum caixa aberto.', 'error');
        return;
    }
    if (amount <= 0 || !reason) {
        showNotification('Informe valor e motivo da sangria.', 'error');
        return;
    }
    if (!session.sangrias) session.sangrias = [];
    session.sangrias.push({ id: getID(), amount, reason, timestamp: new Date().toISOString() });
    save();
    document.getElementById('sangria-modal')?.remove();
    renderCashierSessionStatus();
    showNotification('Sangria registrada.', 'success');
}

function getCashierSessionTotals(session) {
    const openedAt = new Date(session.openedAt).getTime();
    const closedAt = session.closedAt ? new Date(session.closedAt).getTime() : Date.now();
    const sessionSales = (db.sales || []).filter(s => {
        const ts = new Date(s.timestamp || s.date).getTime();
        return Object.hasOwn(s, 'cashierSessionId') ? s.cashierSessionId === session.id : ts >= openedAt && ts <= closedAt;
    });
    const paymentTotals = {};
    for (const sale of sessionSales) {
        const method = sale.paymentMethod || 'dinheiro';
        paymentTotals[method] = roundMoney((paymentTotals[method] || 0) + Number(sale.total || 0));
    }
    const cashSales = paymentTotals.dinheiro || 0;
    const sangrias = (session.sangrias || []).reduce((sum, s) => sum + Number(s.amount || 0), 0);
    const refunds = (db.saleReversals || []).filter(item => item.cashierSessionId === session.id);
    const refundTotals = {};
    for (const refund of refunds) refundTotals[refund.paymentMethod] = roundMoney((refundTotals[refund.paymentMethod] || 0) + refund.amount);
    const cashRefunds = refundTotals.dinheiro || 0;
    const refundsTotal = roundMoney(refunds.reduce((sum,item)=>sum+item.amount,0));
    const expected = roundMoney(Number(session.openingAmount || 0) + cashSales - sangrias - cashRefunds);
    return { cashSales, sangrias, expected, paymentTotals, refundTotals, cashRefunds, refundsTotal, salesCount: sessionSales.length };
}

function openCloseCashierModal() {
    const session = getOpenCashierSession();
    if (!session) {
        showNotification('Nenhum caixa aberto.', 'warning');
        return;
    }
    const totals = getCashierSessionTotals(session);
    const modal = document.createElement('div');
    modal.id = 'cashier-close-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black/50" onclick="document.getElementById('cashier-close-modal')?.remove()"></div>
        <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg z-10">
            <h3 class="font-bold text-gray-800 mb-4">Fechar Caixa</h3>
            ${cashierPaymentSummary(totals)}
            <div class="space-y-2 text-sm mb-4">
                <div class="flex justify-between"><span>Abertura</span><strong>${fmtMoney(session.openingAmount || 0)}</strong></div>
                <div class="flex justify-between"><span>Vendas em dinheiro</span><strong>${fmtMoney(totals.cashSales)}</strong></div>
                <div class="flex justify-between"><span>Sangrias</span><strong>-${fmtMoney(totals.sangrias)}</strong></div>
                <div class="flex justify-between border-t pt-2"><span>Esperado em dinheiro (após devoluções)</span><strong id="cashier-expected">${fmtMoney(totals.expected)}</strong></div>
            </div>
            <form onsubmit="confirmCloseCashierSession(event)" class="space-y-4">
                <input type="hidden" id="cashier-expected-value" value="${totals.expected}">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Dinheiro contado na gaveta</label>
                    <input type="number" id="cashier-closing-amount" min="0" step="0.01" required oninput="updateCashierDifference()" class="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-rose-400">
                </div>
                <div class="flex justify-between bg-gray-50 rounded-lg p-3 text-sm">
                    <span>Diferença</span>
                    <strong id="cashier-difference">${fmtMoney(0)}</strong>
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Notas</label>
                    <textarea id="cashier-close-notes" rows="2" class="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-rose-400"></textarea>
                </div>
                <button type="submit" class="w-full bg-rose-500 text-white rounded-lg py-3 font-bold hover:bg-rose-600">Confirmar Fechamento</button>
            </form>
        </div>`;
    document.body.appendChild(modal);
}

function updateCashierDifference() {
    const expected = parseFloat(document.getElementById('cashier-expected-value')?.value || 0);
    const closing = parseFloat(document.getElementById('cashier-closing-amount')?.value || 0);
    const diff = closing - expected;
    const el = document.getElementById('cashier-difference');
    if (el) el.textContent = fmtMoney(diff);
}

function confirmCloseCashierSession(e) {
    if (e) e.preventDefault();
    const closingAmount = parseFloat(document.getElementById('cashier-closing-amount')?.value || 0);
    const notes = document.getElementById('cashier-close-notes')?.value.trim() || '';
    closeCashierSession(closingAmount, notes);
}

function closeCashierSession(closingAmount, notes = '') {
    const session = getOpenCashierSession();
    if (!session) return;
    if (!Number.isFinite(closingAmount) || closingAmount<0) { showNotification('Informe o dinheiro contado na gaveta.', 'error'); return; }
    const totals = getCashierSessionTotals(session);
    const next = JSON.parse(JSON.stringify(db));
    const closing = next.cashierSessions.find(item=>item.id===session.id);
    closing.closedAt = new Date().toISOString();
    closing.closingAmount = roundMoney(closingAmount);
    closing.expectedAmount = roundMoney(totals.expected);
    closing.difference = roundMoney(closingAmount - totals.expected);
    closing.notes = notes;
    closing.status = 'fechado';
    try { persistDatabase(next); }
    catch(error) { showNotification(error.message, 'error'); return; }
    document.getElementById('cashier-close-modal')?.remove();
    renderCashierSessionStatus();
    showCashierClosingResult(closing);
    showNotification('Caixa fechado com sucesso.', 'success');
}

function printCashierClosingReport(session) {
    const totals = getCashierSessionTotals(session);
    const win = window.open('', '_blank');
    if (!win) {
        showNotification('Bloqueador de pop-ups ativo para impressão.', 'warning');
        return;
    }
    win.document.write(`
        <html><head><title>Fechamento de Caixa</title>
        <style>body{font-family:Arial,sans-serif;padding:24px;color:#111}table{width:100%;border-collapse:collapse}td{padding:8px;border-bottom:1px solid #ddd}.right{text-align:right}.bold{font-weight:700}</style>
        </head><body onload="setTimeout(() => { window.print(); window.close(); }, 500);">
        <h2>Relatório de Fechamento de Caixa</h2>
        <p>Aberto em: ${fmtDateTime(session.openedAt)}<br>Fechado em: ${fmtDateTime(session.closedAt)}</p>
        <table>
            <tr><td>Abertura</td><td class="right">${fmtMoney(session.openingAmount || 0)}</td></tr>
            <tr><td>Vendas em dinheiro</td><td class="right">${fmtMoney(totals.cashSales)}</td></tr>
            <tr><td>Sangrias</td><td class="right">-${fmtMoney(totals.sangrias)}</td></tr>
            <tr><td>Devoluções em dinheiro</td><td class="right">− ${fmtMoney(totals.cashRefunds)}</td></tr>
            <tr class="bold"><td>Esperado</td><td class="right">${fmtMoney(session.expectedAmount || 0)}</td></tr>
            <tr><td>Contado</td><td class="right">${fmtMoney(session.closingAmount || 0)}</td></tr>
            <tr class="bold"><td>Diferença</td><td class="right">${fmtMoney(session.difference || 0)}</td></tr>
        </table>
        <h3>Vendas por forma de pagamento</h3><table>${Object.entries({dinheiro:'Dinheiro',pix:'Pix',debito:'Débito',credito:'Crédito'}).map(([key,label]) => `<tr><td>${label}</td><td class="right">${fmtMoney(totals.paymentTotals[key] || 0)}</td></tr>`).join('')}</table><p>Pix e cartões não compõem o dinheiro esperado na gaveta.</p>
        ${session.notes ? `<p><strong>Notas:</strong> ${sanitizeHTML(session.notes)}</p>` : ''}
        </body></html>`);
    win.document.close();
}

function filterProductsByCategory(cat) {
    window.currentPdvCategory = cat;
    document.querySelectorAll('.category-tab').forEach(btn => {
        const isActive = btn.getAttribute('onclick')?.includes(`'${cat}'`);
        btn.className = `category-tab px-4 py-2 rounded-lg text-sm font-medium ${isActive
            ? 'bg-rose-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;
    });
    renderCashierProducts();
}

function filterProducts(event) {
    renderCashierProducts(event);
}

function addToCart(productId) {
    if (!canEditPdv()) return;
    const product = db.products.find(p => p.id === productId);
    if (!product) return;

    const tipo = product.tipo || 'padrao';

    if (tipo === 'massa') { openMassaModal(product); return; }
    if (tipo === 'acai')  { openAcaiModal(product);  return; }

    if (product.stock <= 0) {
        showNotification('Produto sem estoque disponível!', 'error');
        return;
    }

    const existingIndex = pdvCart.findIndex(item => item.productId === productId && (!item.details || item.details === ''));
    if (existingIndex !== -1) {
        updateCartQty(existingIndex, 1);
    } else {
        pdvCart.push({
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            qty: 1,
            total: Number(product.price),
            tipo: 'padrao',
            details: ''
        });
        renderCart();
    }
}

function addComboToCart(comboId) {
    if (!canEditPdv()) return;
    const combo = (db.combos || []).find(c => c.id === comboId && c.active !== false);
    if (!combo) return;

    const missing = (combo.items || []).find(item => {
        const product = db.products.find(p => p.id === item.productId);
        return product && product.tipo === 'padrao' && Number(product.stock || 0) < Number(item.qty || 1);
    });
    if (missing) {
        const product = db.products.find(p => p.id === missing.productId);
        showNotification(`Estoque insuficiente para ${product?.name || 'item do combo'}.`, 'warning');
        return;
    }

    const details = (combo.items || []).map(item => {
        const product = db.products.find(p => p.id === item.productId);
        return `${item.qty || 1}x ${product ? product.name : 'Produto removido'}`;
    }).join(', ');

    pdvCart.push({
        productId: combo.id,
        comboId: combo.id,
        name: combo.name,
        price: Number(combo.comboPrice || 0),
        qty: 1,
        total: Number(combo.comboPrice || 0),
        tipo: 'combo',
        isCombo: true,
        comboItems: (combo.items || []).map(i => ({ ...i })),
        details
    });
    renderCart();
    showNotification(`${combo.name} adicionado!`, 'success');
}

// ── Fluxos Especiais (Massa/Açaí) ──

let currentMassaProduct = null;
function openMassaModal(p) {
    try { requireWeightUnit(p); }
    catch (error) { showNotification(error.message, 'warning'); router('products'); openEditProductModal(p.id); return; }
    currentMassaProduct = p;
    document.getElementById('massa-modal-title').textContent = p.name;
    document.getElementById('massa-modal-price-label').textContent = `${fmtMoney(p.pricePerHundredGrams || 0)}/100g`;
    document.getElementById('massa-weight-input').value = '';
    document.getElementById('massa-calculated-price').textContent = 'R$ 0,00';
    document.getElementById('massa-modal').classList.remove('hidden');
}

function updateMassaPrice() {
    if (!currentMassaProduct) return;
    const g = parseFloat(document.getElementById('massa-weight-input').value) || 0;
    const price = (g / 100) * (currentMassaProduct.pricePerHundredGrams || 0);
    document.getElementById('massa-calculated-price').textContent = fmtMoney(price);
}

function closeMassaModal() {
    document.getElementById('massa-modal').classList.add('hidden');
    currentMassaProduct = null;
}

function confirmMassaItem() {
    if (!currentMassaProduct) return;
    const g = parseFloat(document.getElementById('massa-weight-input').value) || 0;
    if (g <= 0) { showNotification('Informe um peso válido', 'error'); return; }
    let availableGrams;
    try { availableGrams = getMassaAvailableGrams(currentMassaProduct); }
    catch (error) { showNotification(error.message, 'warning'); return; }
    if (g > availableGrams) {
        showNotification(`Estoque insuficiente. Disponível: ${availableGrams.toFixed(0)}g.`, 'warning');
        return;
    }
    const price = (g / 100) * (currentMassaProduct.pricePerHundredGrams || 0);

    pdvCart.push({
        productId: currentMassaProduct.id,
        name: currentMassaProduct.name,
        price: Number(price),
        qty: 1,
        total: Number(price),
        tipo: 'massa',
        grams: g,
        stockUnit: currentMassaProduct.unit,
        details: `${g}g`
    });

    const addedName = currentMassaProduct.name;
    closeMassaModal();
    renderCart();
    showNotification(`${addedName} adicionado!`, 'success');
}

let currentAcaiProduct = null;
function openAcaiModal(p) {
    currentAcaiProduct = p;
    document.getElementById('acai-modal-title').textContent = p.name;

    const sizes = p.sizes || [];
    const sizesContainer = document.getElementById('acai-sizes-container');
    sizesContainer.innerHTML = sizes.map((s, idx) => `
        <label class="flex items-center gap-2 p-2 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="acai-size" value="${idx}" class="text-rose-500 focus:ring-rose-500" ${idx === 0 ? 'checked' : ''} onchange="updateAcaiTotals()">
            <span class="text-sm font-medium text-gray-700 flex-1">${sanitizeHTML(s.label)}</span>
            <span class="text-sm font-bold text-rose-600">${fmtMoney(s.price)}</span>
        </label>
    `).join('');

    const adicionais = db.adicionais || [];
    const adContainer = document.getElementById('acai-adicionais-container');
    adContainer.innerHTML = adicionais.map((a, idx) => a.active === false ? '' : `
        <label class="flex items-center gap-2 p-2 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="checkbox" name="acai-adicional" value="${idx}" class="text-rose-500 rounded focus:ring-rose-500" onchange="updateAcaiTotals()">
            <span class="text-sm font-medium text-gray-700 flex-1 truncate">${sanitizeHTML(a.name)}</span>
            <span class="text-xs font-bold ${a.price > 0 ? 'text-gray-500' : 'text-green-500'}">${a.price > 0 ? '+'+fmtMoney(a.price) : 'Grátis'}</span>
        </label>
    `).join('');

    updateAcaiTotals();
    document.getElementById('acai-modal').classList.remove('hidden');
}

function updateAcaiTotals() {
    if (!currentAcaiProduct) return;
    const sizes = currentAcaiProduct.sizes || [];
    const selectedSizeIdx = document.querySelector('input[name="acai-size"]:checked')?.value;
    const size = selectedSizeIdx !== undefined ? sizes[selectedSizeIdx] : null;

    let total = size ? size.price : 0;

    const adCbs = document.querySelectorAll('input[name="acai-adicional"]:checked');
    const adicionais = db.adicionais || [];
    const selectedAds = Array.from(adCbs).map(cb => adicionais[cb.value]).filter(Boolean);

    selectedAds.forEach(a => total += a.price);

    document.getElementById('acai-total-price').textContent = fmtMoney(total);
    document.getElementById('acai-summary-text').textContent = `${size ? size.label : ''} + ${selectedAds.length} adicional(is)`;
}

function closeAcaiModal() {
    document.getElementById('acai-modal').classList.add('hidden');
    currentAcaiProduct = null;
}

function confirmAcaiItem() {
    if (!currentAcaiProduct) return;
    const sizes = currentAcaiProduct.sizes || [];
    const selectedSizeIdx = document.querySelector('input[name="acai-size"]:checked')?.value;
    if (selectedSizeIdx === undefined || !sizes[selectedSizeIdx]) { showNotification('Selecione um tamanho', 'error'); return; }
    const size = sizes[selectedSizeIdx];
    let portion;
    try { portion = getAcaiStockQuantity(currentAcaiProduct, size); }
    catch (error) { showNotification(error.message, 'warning'); return; }
    if (Number(currentAcaiProduct.stock || 0) < portion) {
        showNotification('Estoque insuficiente para este açaí.', 'warning');
        return;
    }

    let price = size.price;

    const adCbs = document.querySelectorAll('input[name="acai-adicional"]:checked');
    const adicionais = db.adicionais || [];
    const selectedAds = Array.from(adCbs).map(cb => adicionais[cb.value]).filter(Boolean);
    let additions;
    try { additions = selectedAds.map(snapshotAddition); }
    catch(error) { showNotification(error.message, 'error'); return; }
    selectedAds.forEach(a => price += a.price);

    const details = selectedAds.length > 0
        ? `${size.label} + ${selectedAds.map(a => a.name).join(', ')}`
        : size.label;

    pdvCart.push({
        productId: currentAcaiProduct.id,
        name: currentAcaiProduct.name,
        price: Number(price),
        qty: 1,
        total: Number(price),
        tipo: 'acai',
        stockQty: portion,
        stockUnit: currentAcaiProduct.unit,
        additions,
        details: details
    });

    const addedName = currentAcaiProduct.name;
    closeAcaiModal();
    renderCart();
    showNotification(`${addedName} adicionado!`, 'success');
}

// ── Funções de Carrinho ──

function updateCartQty(index, delta) {
    const item = pdvCart[index];
    if (!item) return;

    if (item.tipo !== 'padrao') {
        // Massa e açaí são itens únicos de quantidade 1 no carrinho. Se for -1, remove.
        if (delta < 0) removeFromCart(index);
        return;
    }

    const product = db.products.find(p => p.id === item.productId);
    const newQty = item.qty + delta;

    if (newQty <= 0) {
        removeFromCart(index);
        return;
    }

    if (product && newQty > product.stock) {
        showNotification(`Estoque insuficiente! Disponível: ${product.stock}`, 'warning');
        return;
    }

    item.qty = newQty;
    item.total = item.qty * item.price;
    renderCart();
}

function renderCart() {
    const container = document.getElementById('pdv-cart-items');

    if (!container) return; // Segurança

    if (pdvCart.length === 0) {
        container.innerHTML = `
        <div class="pdv-cart-empty" id="pdv-cart-empty">
            <i data-lucide="shopping-basket" aria-hidden="true"></i>
            <p>Seu pedido está vazio.</p>
            <p class="pdv-cart-detail">Adicione produtos ao lado.</p>
        </div>`;
        renderCartTotals();
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    container.innerHTML = pdvCart.map((item, index) => `
        <div class="pdv-cart-row">
            <div class="pdv-cart-line">
                <div class="flex-1 min-w-0">
                    <p class="pdv-cart-name">${sanitizeHTML(item.name)}</p>
                    ${item.details ? `<p class="pdv-cart-detail">${sanitizeHTML(item.details)}</p>` : ''}
                    <p class="pdv-cart-unit">${fmtMoney(item.price)} por item</p>
                </div>
                <button type="button" onclick="removeFromCart(${index})" class="pdv-cart-remove" aria-label="Remover ${managementAttribute(item.name)} do pedido">
                    <i data-lucide="trash-2" aria-hidden="true"></i>
                </button>
            </div>
            <div class="pdv-cart-bottom">
                <div class="pdv-stepper">
                    <button type="button" onclick="updateCartQty(${index}, -1)" aria-label="Diminuir quantidade de ${managementAttribute(item.name)}">−</button>
                    <span>${item.qty}</span>
                    <button type="button" onclick="updateCartQty(${index}, 1)" aria-label="Aumentar quantidade de ${managementAttribute(item.name)}" ${item.tipo !== 'padrao' ? 'disabled' : ''}>+</button>
                </div>
                <div class="pdv-cart-line-total">${fmtMoney(item.total)}</div>
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
    renderCartTotals();
}

function removeFromCart(index) {
    pdvCart.splice(index, 1);
    renderCart();
}

function clearCart() {
    if (!canEditPdv()) return;
    if (pdvCart.length > 0) {
        if (confirm('Esvaziar o carrinho?')) {
            pdvCart = [];
            const discInput = document.getElementById('pdv-discount');
            if (discInput) discInput.value = '';
            document.getElementById('pdv-amount-received').value = '';
            document.getElementById('customer-select').value = '';
            document.getElementById('pdv-loyalty-points').value='0';
            pdvOperationId = getID();
            renderCart();
        }
    }
}

// Compatibilidade
function clearSale() { clearCart(); }

function renderCartTotals() {
    const subtotal = pdvCart.reduce((sum, item) => sum + item.total, 0);
    const discountVal = parseFloat(document.getElementById('pdv-discount')?.value) || 0;
    const loyalty=pdvLoyaltyAmounts(subtotal,discountVal);
    const total = roundMoney(Math.max(0, subtotal - discountVal - loyalty.discount));

    const subEl = document.getElementById('pdv-subtotal');
    const totEl = document.getElementById('pdv-total');

    if (subEl) subEl.textContent = fmtMoney(subtotal);
    if (totEl) totEl.textContent = fmtMoney(total);
    const orderTotal = document.getElementById('pdv-order-total');
    const count = document.getElementById('pdv-order-count');
    if (orderTotal) orderTotal.textContent = fmtMoney(total);
    if (count) count.textContent = pdvCart.length ? `${pdvCart.reduce((sum,item) => sum + Number(item.qty),0)} item(ns) no pedido` : 'Pedido vazio';
    const charge=document.getElementById('pdv-charge-btn');
    if(charge)charge.disabled=!pdvCart.length;

    calculateChange();
    persistPdvDraft();
}

function toggleChangeInput() {
    const paymentMethodEl = document.querySelector('input[name="pdv-payment"]:checked');
    if (!paymentMethodEl) return;
    const paymentMethod = paymentMethodEl.value;

    const changeSection = document.getElementById('pdv-change-section');
    if (changeSection) {
        if (paymentMethod === 'dinheiro') changeSection.classList.remove('hidden');
        else changeSection.classList.add('hidden');
    }
    updateCashierClosedWarning();
    calculateChange();
}

function calculateChange() {
    const paymentMethodEl = document.querySelector('input[name="pdv-payment"]:checked');
    if (!paymentMethodEl) return;
    const paymentMethod = paymentMethodEl.value;

    const subtotal = pdvCart.reduce((sum, item) => sum + item.total, 0);
    const discountVal = parseFloat(document.getElementById('pdv-discount')?.value) || 0;
    const loyalty=pdvLoyaltyAmounts(subtotal,discountVal);
    const total = roundMoney(Math.max(0, subtotal - discountVal - loyalty.discount));

    const changeValEl = document.getElementById('pdv-change-val');
    if (!changeValEl) return;

    if (paymentMethod === 'dinheiro') {
        const receivedInput = document.getElementById('pdv-amount-received');
        const received = parseFloat(receivedInput?.value) || 0;

        if (received > total + 0.01) {
            const change = received - total;
            changeValEl.textContent = fmtMoney(change);
            changeValEl.classList.remove('text-red-500');
            changeValEl.classList.add('text-rose-400');
        } else if (received > 0 && received < total - 0.01) {
            const pending = total - received;
            changeValEl.textContent = 'Falta ' + fmtMoney(pending);
            changeValEl.classList.remove('text-rose-400');
            changeValEl.classList.add('text-red-500');
        } else {
            changeValEl.textContent = 'R$ 0,00';
            changeValEl.classList.remove('text-red-500');
            changeValEl.classList.add('text-rose-400');
        }
    }
}

function finalizeSale(allowWithoutSession = false) {
    if (!canEditPdv()) return;
    if (pdvCart.length === 0) {
        showNotification('Carrinho vazio!', 'error');
        return;
    }
    if (!getOpenCashierSession() && allowWithoutSession !== true) { requestCashierBeforeSale(); return; }

    let prepared;
    try { prepared = prepareSaleItems(pdvCart, db.products, db.inventory); }
    catch (error) { showNotification(error.message, 'error'); return; }
    if (db.sales.some(s => s.operationId === pdvOperationId)) {
        showNotification('Esta venda já foi finalizada. Confira o histórico de vendas.', 'warning'); return;
    }
    const subtotal = roundMoney(prepared.items.reduce((sum, item) => sum + item.total, 0));
    const discountVal = parseFloat(document.getElementById('pdv-discount')?.value) || 0;
    if (!Number.isFinite(discountVal) || discountVal < 0 || discountVal > subtotal) { showNotification('O desconto deve ficar entre zero e o subtotal.', 'error'); return; }
    let loyalty;
    try{loyalty=pdvLoyaltyAmounts(subtotal,discountVal,true);}catch(error){showNotification(error.message,'error');return;}
    const total = roundMoney(Math.max(0, subtotal - discountVal - loyalty.discount));

    const paymentMethodEl = document.querySelector('input[name="pdv-payment"]:checked');
    const paymentMethod = paymentMethodEl ? paymentMethodEl.value : 'dinheiro';

    let received = 0;
    if (paymentMethod === 'dinheiro') {
        const receivedInput = document.getElementById('pdv-amount-received');
        received = parseFloat(receivedInput?.value) || 0;

        if (!Number.isFinite(received) || roundMoney(received) < total) {
            showNotification('O valor recebido é menor que o total da venda!', 'error');
            return;
        }
    } else {
        received = total;
    }

    const saleId = 'V' + getID().toUpperCase();
    const saleDate = new Date().toISOString();
    const change = Math.max(0, received - total);

    const sale = {
        id: saleId,
        operationId: pdvOperationId,
        date: localDateKey(saleDate),
        timestamp: saleDate,
        items: prepared.items,
        costTotal: roundMoney(prepared.items.reduce((sum, item) => sum + item.costTotal, 0)),
        costSnapshotVersion: 1,
        cashierSessionId: getOpenCashierSession()?.id || null,
        subtotal: subtotal,
        discount: roundMoney(discountVal+loyalty.discount),
        manualDiscount: discountVal,
        total: total,
        paymentMethod: paymentMethod, // Mantemos o nome antigo para manter compatilidade com relatorios se houver
        status: 'completed',
        received: received,
        changeValue: change
    };

    const next = JSON.parse(JSON.stringify(db));
    for (const [id, quantity] of prepared.totals) {
        const product = next.products.find(p => p.id === id);
        product.stock = Number((Number(product.stock) - quantity).toFixed(6));
    }
    for (const [id, quantity] of prepared.inventoryTotals) {
        const item = next.inventory.find(item=>item.id===id);
        item.stock = Number((Number(item.stock) - quantity).toFixed(6));
    }
    next.sales.unshift(sale);

    // Vincular cliente e aplicar a regra de fidelidade definida pelo dono.
    const cid = document.getElementById('customer-select')?.value;
    if (cid) {
        sale.clientId = cid;
        const ci = next.clients.findIndex(c => c.id === cid);
        if (ci > -1) {
            const rule=next.settings.loyalty||{};
            const earned=rule.enabled&&rule.earnEvery>0?Math.floor(total/rule.earnEvery):0;
            sale.clientName = next.clients[ci].name;
            next.clients[ci].points = Number(next.clients[ci].points || 0) - loyalty.points + earned;
            sale.loyalty={pointsRedeemed:loyalty.points,pointsEarned:earned,discount:loyalty.discount,rule:{...rule}};
            next.loyaltyMovements.unshift({id:getID(),clientId:cid,saleId,at:saleDate,type:'sale',delta:earned-loyalty.points});
            if (!next.clients[ci].history) next.clients[ci].history = [];
            next.clients[ci].history.unshift({ saleId, date: localDateKey(saleDate), total });
        }
    }

    try { persistDatabase(next); }
    catch (error) { showNotification('Venda não gravada. ' + error.message, 'error'); return; }
    closePdvPayment();

    // Limpar o Caixa
    pdvCart = [];
    pdvOperationId = getID();
    if (document.getElementById('pdv-discount')) document.getElementById('pdv-discount').value = '';
    if (document.getElementById('pdv-amount-received')) document.getElementById('pdv-amount-received').value = '';
    document.getElementById('customer-select').value = '';
    document.getElementById('pdv-loyalty-points').value='0';

    renderCart();
    renderCashierProducts();

    showNotification('Venda finalizada com sucesso!', 'success');

    // Mostra modal
    lastSaleId = saleId;
    const successModal = document.getElementById('pdvSuccessModal');
    if (successModal) {
        successModal.classList.remove('hidden');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

function printLastSale() {
    if (lastSaleId) {
        printSaleReceipt(lastSaleId);
        const successModal = document.getElementById('pdvSuccessModal');
        if (successModal) successModal.classList.add('hidden');
    }
}

function printReceipt() {
    if (lastSaleId) {
        printLastSale();
        return;
    }
    const lastSale = (db.sales || [])[0];
    if (lastSale) printSaleReceipt(lastSale.id);
    else showNotification('Nenhuma venda para imprimir.', 'info');
}

function printSaleReceipt(id) {
    const sale = db.sales.find(s => s.id === id);
    if (!sale) return;

    const cfg = db.settings || {};
    const win = window.open('', '_blank');
    if (!win) {
        showNotification('Bloqueador de pop-ups ativo.', 'warning');
        return;
    }

    const storeName = sanitizeHTML(cfg.companyName || 'Sorveteria & Açaí Pro');
    const address   = cfg.address ? `END: ${sanitizeHTML(cfg.address)}<br>` : '';
    const phone     = cfg.phone   ? `FONE: ${sanitizeHTML(cfg.phone)}<br>` : '';

    win.document.write(`
        <html>
        <head>
            <title>Recibo PDV #${sale.id}</title>
            <style>
                @page { size: auto; margin: 0mm; }
                body {
                    font-family: 'Courier New', Courier, monospace;
                    width: 72mm;
                    margin: 0 auto;
                    padding: 5mm;
                    font-size: 11px;
                    line-height: 1.2;
                    color: #000;
                }
                .center { text-align: center; }
                .divider { border-top: 1px dashed #000; margin: 5mm 0; }
                table { width: 100%; border-collapse: collapse; }
                .right { text-align: right; }
                .bold { font-weight: bold; }
                .item-row td { padding: 1mm 0; }
                .total-row td { padding-top: 2mm; }
                .receipt-header { margin-bottom: 3mm; }
                .receipt-footer { margin-top: 5mm; font-size: 10px; }
            </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 500);">
            <div class="center receipt-header">
                <strong style="font-size: 14px;">${storeName.toUpperCase()}</strong><br>
                ${phone}
                ${address}
            </div>

            <div class="divider"></div>

            <div class="center bold">CUPOM NÃO FISCAL</div>
            ${sale.status === 'canceled' ? '<div class="center bold">VENDA CANCELADA — REGISTRO HISTÓRICO</div>' : ''}
            <div class="center">
                VENDA: #${sale.id}<br>
                DATA: ${new Date(sale.timestamp).toLocaleString('pt-BR')}
            </div>

            <div class="divider"></div>

            <table>
                <thead>
                    <tr class="bold">
                        <th align="left">ITEM</th>
                        <th align="right">TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    ${sale.items.map(i => `
                        <tr class="item-row">
                            <td>
                                ${i.qty}x ${sanitizeHTML(i.name)}
                                ${i.details ? `<br><span style="font-size: 9px; color: #555;">${sanitizeHTML(i.details)}</span>` : ''}
                            </td>
                            <td class="right" style="vertical-align: top;">${fmtMoney(i.total)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="divider"></div>

            <table class="total-row">
                <tr>
                    <td>Subtotal:</td>
                    <td class="right">${fmtMoney(sale.subtotal)}</td>
                </tr>
                ${sale.discount > 0 ? `
                <tr>
                    <td>Desconto:</td>
                    <td class="right">-${fmtMoney(sale.discount)}</td>
                </tr>` : ''}
                <tr class="bold" style="font-size: 13px;">
                    <td>TOTAL:</td>
                    <td class="right">${fmtMoney(sale.total)}</td>
                </tr>
            </table>

            <div class="divider"></div>

            <div class="center text-sm">
                <strong>FORMA DE PAGAMENTO</strong><br>
                ${(sale.paymentMethod || 'Dinheiro').toUpperCase()}
                ${sale.changeValue > 0 ? `<br>TROCO: ${fmtMoney(sale.changeValue)}` : ''}
            </div>

            <div class="divider"></div>

            <div class="center receipt-footer">
                OBRIGADO PELA PREFERÊNCIA!<br>
            </div>

            <div style="height: 10mm;"></div>
        </body>
        </html>
    `);
    win.document.close();
}

// ── Venda Rápida (Modal do Header) ──────────────────────────
function openQuickSaleModal() {
    let modal = document.getElementById('quick-sale-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quick-sale-modal';
        modal.className = 'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50" onclick="closeQuickSaleModal()"></div>
            <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col z-10">
                <div class="flex items-center justify-between p-4 border-b border-gray-100">
                    <div class="flex items-center gap-2">
                        <i data-lucide="zap" class="w-5 h-5 text-rose-500"></i>
                        <h3 class="font-bold text-gray-800">Venda Rápida</h3>
                    </div>
                    <button onclick="closeQuickSaleModal()" class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <div class="p-4 overflow-y-auto flex-1">
                    <p class="text-sm text-gray-500 mb-3">Toque no produto para adicionar ao carrinho:</p>
                    <div id="quick-sale-grid" class="grid grid-cols-2 gap-2"></div>
                </div>
                <div class="p-4 border-t border-gray-100 flex gap-2">
                    <button onclick="closeQuickSaleModal(); router('cashier');"
                        class="flex-1 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors">
                        Ver Caixa Completo
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const grid = document.getElementById('quick-sale-grid');
    const products = (db.products || []).filter(p => p.stock > 0 || p.tipo !== 'padrao').slice(0, 8);
    grid.innerHTML = products.length === 0
        ? '<p class="col-span-2 text-center text-gray-400 py-4 text-sm">Nenhum produto cadastrado.</p>'
        : products.map(p => `
            <button onclick="addToCart('${p.id}'); closeQuickSaleModal(); router('cashier');"
                class="p-3 bg-gray-50 hover:bg-rose-50 border border-gray-200 hover:border-rose-300 rounded-xl text-left transition-all active:scale-95">
                <p class="text-xs font-bold text-gray-800 leading-tight">${sanitizeHTML(p.name)}</p>
                <p class="text-xs text-rose-600 font-bold mt-1">${pdvProductPrice(p)}</p>
            </button>
        `).join('');

    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeQuickSaleModal() {
    const modal = document.getElementById('quick-sale-modal');
    if (modal) modal.classList.add('hidden');
}

function newSale() {
    clearSale();
    router('cashier');
}
