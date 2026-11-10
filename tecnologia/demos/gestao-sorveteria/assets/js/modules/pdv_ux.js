// Atendimento de balcão: catálogo, pedido e cobrança em etapas claras.
function pdvProductPrice(product) {
    if (product.tipo === 'massa') return `${fmtMoney(Number(product.pricePerHundredGrams || 0))}/100 g`;
    if (product.tipo === 'acai') {
        const prices = (product.sizes || []).map(size => Number(size.price)).filter(Number.isFinite);
        return prices.length ? `A partir de ${fmtMoney(Math.min(...prices))}` : 'Cadastre os tamanhos';
    }
    return fmtMoney(Number(product.price || 0));
}
function pdvProductMode(product) {
    if (product.tipo === 'massa') return { icon:'ice-cream-bowl', label:'Por peso' };
    if (product.tipo === 'acai') return { icon:'cup-soda', label:'Por tamanho' };
    const labels={kg:'Por kg',litro:'Por litro',ml:'Por ml',gramas:'Por grama'};
    const icon=({picole:'popsicle',bebida:'cup-soda',casquinha:'ice-cream-cone',sorvete:'ice-cream-bowl'})[product.category] || 'package';
    return { icon, label:labels[product.unit] || 'Por unidade' };
}
function pdvProductStock(product) {
    const stock=Number(product.stock);
    if(!Number.isFinite(stock))return 'Conferir estoque';
    if(stock<=0)return 'Sem estoque';
    const units={unidade:stock===1?'unidade':'unidades',litro:stock===1?'litro':'litros',gramas:'g'};
    return `${stock.toLocaleString('pt-BR',{maximumFractionDigits:3})} ${units[product.unit] || product.unit || 'unidades'} em estoque`;
}
function togglePdvFavorite(id) {
    const next = JSON.parse(JSON.stringify(db));
    const favorites = new Set(next.settings.pdvFavorites || []);
    if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
    next.settings.pdvFavorites = [...favorites];
    try { persistDatabase(next); renderCashierProducts(); }
    catch (error) { showNotification(error.message, 'error'); }
}
function initPdvUX() {
    const cart = document.getElementById('pdv-cart-items').parentElement;
    const order = cart.parentElement;
    const checkout = document.getElementById('checkout-btn').closest('.card-hover');
    order.classList.add('pdv-order');
    order.parentElement.classList.add('pdv-layout');
    order.parentElement.classList.remove('grid-cols-1','lg:grid-cols-3');
    order.previousElementSibling.classList.add('pdv-catalog');
    order.previousElementSibling.classList.remove('lg:col-span-2');
    cart.classList.add('pdv-order-items');
    checkout.classList.remove('card-hover');
    const customer = document.getElementById('customer-select').parentElement;
    customer.classList.add('pdv-order-customer');
    order.appendChild(customer);
    const footer = document.createElement('div');
    footer.className = 'pdv-charge-bar';
    footer.innerHTML = `<div><span id="pdv-order-count" class="text-sm text-gray-500">Pedido vazio</span><strong id="pdv-order-total" class="block text-2xl">${fmtMoney(0)}</strong></div>
        <button id="pdv-charge-btn" onclick="openPdvPayment()" class="bg-brand-primary text-white rounded-lg px-6 py-3 font-bold">Cobrar <span class="hidden md:inline text-xs">· F8</span></button>`;
    order.appendChild(footer);
    const modal = document.createElement('div');
    modal.id = 'pdv-payment-modal';
    modal.className = 'hidden pdv-payment-overlay';
    modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'pdv-payment-title');
    modal.innerHTML = `<div class="pdv-payment-content bg-white rounded-xl shadow-2xl">
        <div class="flex items-center justify-between gap-3 p-4 border-b"><h3 id="pdv-payment-title" class="font-bold text-lg">Receber pagamento</h3>
        <button onclick="closePdvPayment()" class="p-2 rounded-lg border text-sm" aria-label="Voltar ao pedido">Voltar ao pedido</button></div></div>`;
    modal.firstElementChild.appendChild(checkout); document.body.appendChild(modal);
    modal.addEventListener('click', event => { if (event.target === modal) closePdvPayment(); });
    modal.addEventListener('input', persistPdvDraft);
    modal.addEventListener('change', persistPdvDraft);
    const toolbar = document.createElement('div');
    toolbar.className = 'pdv-catalog-tools';
    toolbar.innerHTML = `<button id="pdv-favorites-filter" onclick="this.setAttribute('aria-pressed',this.getAttribute('aria-pressed')==='true'?'false':'true');renderCashierProducts()" aria-pressed="false" class="px-3 py-2 border rounded-lg text-sm font-bold inline-flex items-center gap-2"><i data-lucide="star" aria-hidden="true"></i>Favoritos</button>
        <label class="text-sm flex items-center gap-2">Ordenar<select id="pdv-product-sort" onchange="renderCashierProducts()" class="border p-2 rounded-lg"><option value="frequent">Mais vendidos</option><option value="name">Nome A–Z</option></select></label>
        <span class="text-xs text-gray-500">F2 buscar · Enter adicionar · F8 cobrar</span>`;
    document.getElementById('products-grid').before(toolbar);
    document.getElementById('product-search').placeholder = 'Buscar por nome, sabor ou código · F2';
    document.addEventListener('keydown', event => {
        const view = document.getElementById('view-cashier');
        const paymentOpen = !modal.classList.contains('hidden');
        const otherModal = document.querySelector('.pdv-payment-overlay:not(.hidden),#productModal:not(.hidden),#massa-modal:not(.hidden),#acai-modal:not(.hidden),#sorveteria-setup');
        if (event.key === 'Escape' && paymentOpen && !document.getElementById('cashier-required-modal')) { event.preventDefault(); closePdvPayment(); }
        if (event.key === 'F2' && !otherModal) {
            event.preventDefault(); router('cashier'); document.getElementById('product-search').focus();
        }
        if (event.key === 'F8' && !view.classList.contains('hide') && !otherModal) { event.preventDefault(); openPdvPayment(); }
    });
    renderCartTotals();
}
function openPdvPayment() {
    if (!canEditPdv()) return;
    if (!pdvCart.length) { showNotification('Adicione um produto ao pedido para cobrar.', 'info'); return; }
    document.getElementById('pdv-payment-modal').classList.remove('hidden');
    document.body.classList.add('pdv-payment-open');
    toggleChangeInput(); renderCartTotals();
    const cash = document.querySelector('[name="pdv-payment"]:checked')?.value === 'dinheiro';
    const input = document.getElementById(cash ? 'pdv-amount-received' : 'checkout-btn');
    input.focus();
}
function closePdvPayment() {
    document.getElementById('pdv-payment-modal')?.classList.add('hidden');
    document.body.classList.remove('pdv-payment-open');
    document.getElementById('pdv-charge-btn')?.focus();
}
function requestCashierBeforeSale() {
    if (document.getElementById('cashier-required-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'cashier-required-modal'; modal.className = 'pdv-payment-overlay'; modal.style.zIndex = '80';
    modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-label', 'Caixa fechado');
    modal.innerHTML = `<div class="pdv-payment-content bg-white rounded-xl p-6 space-y-4">
        <h3 class="font-bold text-lg">O caixa está fechado</h3><p class="text-sm">Abra o caixa para incluir esta venda no fechamento. Se continuar sem abrir, a venda ficará no histórico, fora de uma sessão de caixa.</p>
        <button id="pdv-open-cashier-first" onclick="document.getElementById('cashier-required-modal').remove();closePdvPayment();openCashierSession()" class="w-full rounded-lg py-3 bg-brand-primary text-white font-bold">Abrir caixa</button>
        <button onclick="document.getElementById('cashier-required-modal').remove();finalizeSale(true)" class="w-full rounded-lg py-3 border font-bold">Continuar venda sem caixa aberto</button>
        <button onclick="document.getElementById('cashier-required-modal').remove()" class="w-full py-2 text-sm">Voltar à cobrança</button></div>`;
    document.body.appendChild(modal); document.getElementById('pdv-open-cashier-first').focus();
}
function cashierPaymentSummary(totals) {
    return `<div class="p-3 rounded-lg border space-y-2 text-sm"><p class="font-bold">Vendas por forma de pagamento</p>${Object.entries({dinheiro:'Dinheiro',pix:'Pix',debito:'Débito',credito:'Crédito'}).map(([key,label]) => `<div class="flex justify-between gap-4"><span>${label}</span><strong>${fmtMoney(totals.paymentTotals[key] || 0)}</strong></div>`).join('')}<p class="font-bold">Devoluções registradas: ${fmtMoney(totals.refundsTotal || 0)}</p>${Object.entries(totals.refundTotals||{}).map(([key,value])=>`<div class="flex justify-between"><span>${sanitizeHTML(key)}</span><strong>− ${fmtMoney(value)}</strong></div>`).join('')}<p class="text-xs text-gray-500">Devoluções em dinheiro reduzem o esperado na gaveta. Pix e cartões não entram no valor esperado de dinheiro na gaveta.</p></div>`;
}
function showCashierClosingResult(session) {
    document.getElementById('cashier-result-modal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'cashier-result-modal'; modal.className = 'pdv-payment-overlay';
    modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Caixa fechado');
    modal.innerHTML = `<div class="pdv-payment-content bg-white rounded-xl p-6 space-y-4"><h3 class="font-bold text-lg">Caixa fechado</h3>
        ${cashierPaymentSummary(getCashierSessionTotals(session))}
        <p class="text-sm">Dinheiro esperado: <strong>${fmtMoney(session.expectedAmount)}</strong><br>Dinheiro contado: <strong>${fmtMoney(session.closingAmount)}</strong><br>Diferença: <strong>${fmtMoney(session.difference)}</strong></p>
        <p class="text-sm">Guarde uma cópia dos dados deste expediente e confira o arquivo nos downloads.</p><button onclick="downloadBackup()" class="w-full rounded-lg border py-3 font-bold">Exportar backup deste expediente</button><button id="print-cashier-result" class="w-full rounded-lg border py-3 font-bold">Imprimir fechamento</button><button onclick="document.getElementById('cashier-result-modal').remove()" class="w-full rounded-lg bg-brand-primary text-white py-3 font-bold">Concluir</button></div>`;
    document.body.appendChild(modal);
    document.getElementById('print-cashier-result').onclick = ()=>printCashierClosingReport(session);
}
