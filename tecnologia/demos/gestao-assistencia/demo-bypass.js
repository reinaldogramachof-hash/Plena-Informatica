/**
 * demo-bypass.js — Plena MicroSaaS • Gestão Assistência Pro
 * Libera o app em modo demonstração, assegura tema claro inicial e ajusta a faixa superior sem cobrir controles.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Assistência Pro';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Assistência Pro. Gostaria de saber planos e implantação.';
    var DEMO_DATA_KEY = 'plena_assistencia_demo_seed_v1';
    var SESSION_BOOT_KEY = 'plena_assistencia_demo_theme_booted';
    window.PLENA_DEMO_WHATSAPP = WHATSAPP_PHONE;

    try {
        localStorage.setItem('assistencia_license', 'DEMO-PLENA-2026');
        localStorage.setItem('assistencia_email', 'demo@plena.app');
        if (!sessionStorage.getItem(SESSION_BOOT_KEY)) {
            document.documentElement.classList.remove('dark');
            sessionStorage.setItem(SESSION_BOOT_KEY, '1');
        }
    } catch (e) {}

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    }, true);

    function unlock() {
        var login = document.getElementById('view-login');
        if (login) { login.style.display = 'none'; login.classList.add('hidden'); }

        var appMain = document.getElementById('app-main-content');
        if (appMain) { appMain.style.display = ''; appMain.classList.remove('hidden', 'hide'); }

        var sidebar = document.getElementById('sidebar');
        if (sidebar) { sidebar.style.display = ''; sidebar.classList.remove('hide', 'hidden'); }

        var header = document.getElementById('main-header') || document.querySelector('header');
        if (header) { header.style.display = ''; header.classList.remove('hide', 'hidden'); }

        var receiptModal = document.getElementById('welcome-receipt-modal');
        if (receiptModal) receiptModal.classList.add('hidden');

        ['install-btn', 'pwa-install-btn', 'install-app-btn'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) { el.style.display = 'none'; el.classList.add('hidden'); el.classList.remove('flex'); }
        });
    }

    function openWhatsApp() {
        window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Resetar os dados fictícios desta demonstração?')) return;
        try {
            localStorage.clear();
            sessionStorage.removeItem(SESSION_BOOT_KEY);
        } catch (e) {}
        location.reload();
    }

    function dateOffset(days, hour) {
        var date = new Date();
        date.setDate(date.getDate() + days);
        date.setHours(hour || 10, 0, 0, 0);
        return date;
    }

    function dateOnly(days) {
        return dateOffset(days).toISOString().slice(0, 10);
    }

    function makeSale(id, days, clientId, items, total, payment) {
        var date = dateOffset(days, 14).toISOString();
        return {
            id: id,
            date: date,
            clientId: clientId,
            items: items,
            subtotal: total,
            discount: 0,
            total: total,
            payment: payment,
            received: total,
            changeValue: 0,
            splitDetails: null
        };
    }

    function seedDemoData() {
        if (typeof db === 'undefined' || typeof save !== 'function') return false;
        if (localStorage.getItem(DEMO_DATA_KEY)) return true;

        var hasData = db.orders.length || db.clients.length || db.products.length || db.transactions.length || db.pdvSales.length;
        if (hasData) return true;

        var createdAt = dateOffset(-12, 9).toISOString();
        db.settings = Object.assign({}, db.settings, {
            companyName: 'Assistência TechFix',
            companyPhone: '(12) 99219-1018',
            companyAddress: 'São José dos Campos - SP',
            theme: 'light',
            technicians: ['Carlos Mendes', 'Juliana Rocha', 'Diego Alves']
        });

        db.clients = [
            { id: 'CL-DEMO-001', name: 'Marina Duarte', phone: '(12) 98888-1021', email: 'marina.duarte@exemplo.com', cpf_cnpj: '', address: 'Jardim Satélite, São José dos Campos', notes: 'Prefere contato por WhatsApp.', orders: 2, lastOrder: dateOnly(-1), totalSpent: 648.80, createdAt: createdAt },
            { id: 'CL-DEMO-002', name: 'Rafael Costa', phone: '(12) 99777-2045', email: 'rafael.costa@exemplo.com', cpf_cnpj: '', address: 'Vila Ema, São José dos Campos', notes: 'Aguardando aprovação de peça.', orders: 1, lastOrder: dateOnly(-2), totalSpent: 389.90, createdAt: createdAt },
            { id: 'CL-DEMO-003', name: 'Fernanda Lima', phone: '(12) 99666-3178', email: 'fernanda.lima@exemplo.com', cpf_cnpj: '', address: 'Urbanova, São José dos Campos', notes: '', orders: 1, lastOrder: dateOnly(-3), totalSpent: 260.00, createdAt: createdAt },
            { id: 'CL-DEMO-004', name: 'Eduardo Nunes', phone: '(12) 98555-4290', email: 'eduardo.nunes@exemplo.com', cpf_cnpj: '', address: 'Centro, São José dos Campos', notes: 'Cliente recorrente.', orders: 1, lastOrder: dateOnly(-5), totalSpent: 479.90, createdAt: createdAt }
        ];

        db.products = [
            { id: 'PR-DEMO-001', name: 'Tela LCD iPhone 11', price: 299.90, cost: 185.00, stock: 4, minStock: 2, category: 'Peças', updatedAt: createdAt },
            { id: 'PR-DEMO-002', name: 'Bateria Samsung A32', price: 149.90, cost: 72.00, stock: 1, minStock: 3, category: 'Peças', updatedAt: createdAt },
            { id: 'PR-DEMO-003', name: 'Conector de carga USB-C', price: 89.90, cost: 32.00, stock: 0, minStock: 2, category: 'Peças', updatedAt: createdAt },
            { id: 'PR-DEMO-004', name: 'Película 3D iPhone 13', price: 49.90, cost: 12.00, stock: 12, minStock: 4, category: 'Acessórios', updatedAt: createdAt },
            { id: 'PR-DEMO-005', name: 'Cabo USB-C reforçado', price: 39.90, cost: 14.00, stock: 8, minStock: 3, category: 'Acessórios', updatedAt: createdAt },
            { id: 'PR-DEMO-006', name: 'Fonte notebook 65W', price: 179.90, cost: 95.00, stock: 2, minStock: 2, category: 'Fontes', updatedAt: createdAt }
        ];

        db.orders = [
            { id: 'OS-1048', client: 'Marina Duarte', phone: '(12) 98888-1021', device: 'iPhone 11', brand: 'Apple', serial: 'DEMO-IP11-1048', password: '', problem: 'Tela sem imagem após queda.', diagnosis: 'Display danificado; aparelho liga e recebe notificações.', entryNotes: 'Aparelho entregue com capinha.', checklist: { screen: false, back: true, buttons: true, tray: true, cameras: true, biometrics: true, power: true, connector: true }, parts: [{ productId: 'PR-DEMO-001', productName: 'Tela LCD iPhone 11', quantity: 1, unitPrice: 299.90, total: 299.90, notes: '' }], labor: 120.00, discount: 0, total: 419.90, date: dateOnly(-1), status: 'analyzing', updatedAt: dateOffset(-1, 11).toISOString(), technician: 'Juliana Rocha', history: [], paid: false },
            { id: 'OS-1047', client: 'Rafael Costa', phone: '(12) 99777-2045', device: 'Galaxy A32', brand: 'Samsung', serial: 'DEMO-A32-1047', password: '', problem: 'Não carrega e apresenta mau contato.', diagnosis: 'Conector de carga com desgaste; aguardando reposição.', entryNotes: 'Sem carregador.', checklist: { screen: true, back: true, buttons: true, tray: true, cameras: true, biometrics: true, power: true, connector: false }, parts: [{ productId: 'PR-DEMO-003', productName: 'Conector de carga USB-C', quantity: 1, unitPrice: 89.90, total: 89.90, notes: '' }], labor: 110.00, discount: 0, total: 199.90, date: dateOnly(-2), status: 'waiting_parts', updatedAt: dateOffset(-1, 16).toISOString(), technician: 'Carlos Mendes', history: [], paid: false },
            { id: 'OS-1046', client: 'Fernanda Lima', phone: '(12) 99666-3178', device: 'Notebook Lenovo Ideapad', brand: 'Lenovo', serial: 'DEMO-LEN-1046', password: '', problem: 'Desliga sozinho durante o uso.', diagnosis: 'Fonte com oscilação. Equipamento testado e liberado.', entryNotes: 'Acompanham carregador e mochila.', checklist: { screen: true, back: true, buttons: true, tray: true, cameras: true, biometrics: true, power: true, connector: true }, parts: [{ productId: 'PR-DEMO-006', productName: 'Fonte notebook 65W', quantity: 1, unitPrice: 179.90, total: 179.90, notes: '' }], labor: 80.10, discount: 0, total: 260.00, date: dateOnly(-3), status: 'ready', updatedAt: dateOffset(-1, 15).toISOString(), technician: 'Diego Alves', history: [], paid: false },
            { id: 'OS-1045', client: 'Eduardo Nunes', phone: '(12) 98555-4290', device: 'Moto G84', brand: 'Motorola', serial: 'DEMO-G84-1045', password: '', problem: 'Bateria descarrega rapidamente.', diagnosis: 'Bateria substituída e carga completa testada.', entryNotes: 'Aparelho sem avarias externas.', checklist: { screen: true, back: true, buttons: true, tray: true, cameras: true, biometrics: true, power: true, connector: true }, parts: [{ productId: 'PR-DEMO-002', productName: 'Bateria Samsung A32', quantity: 1, unitPrice: 149.90, total: 149.90, notes: 'Peça compatível.' }], labor: 130.00, discount: 0, total: 279.90, date: dateOnly(-5), status: 'delivered', updatedAt: dateOffset(-4, 17).toISOString(), technician: 'Carlos Mendes', history: [], paid: true }
        ];

        db.pdvSales = [
            makeSale('V-DEMO-102', -1, 'CL-DEMO-001', [{ productId: 'PR-DEMO-004', name: 'Película 3D iPhone 13', price: 49.90, qty: 1, total: 49.90 }, { productId: 'PR-DEMO-005', name: 'Cabo USB-C reforçado', price: 39.90, qty: 1, total: 39.90 }], 89.80, 'pix'),
            makeSale('V-DEMO-101', -3, null, [{ productId: 'PR-DEMO-005', name: 'Cabo USB-C reforçado', price: 39.90, qty: 2, total: 79.80 }], 79.80, 'cartao')
        ];

        db.transactions = [
            { id: 'TR-DEMO-001', type: 'income', amount: 279.90, desc: 'O.S. 1045 — reparo concluído', category: 'service', method: 'pix', date: dateOnly(-5), createdAt: dateOffset(-5, 17).toISOString() },
            { id: 'TR-DEMO-002', type: 'income', amount: 89.80, desc: 'Venda PDV — acessórios', category: 'sale', method: 'pix', date: dateOnly(-1), createdAt: dateOffset(-1, 14).toISOString() },
            { id: 'TR-DEMO-003', type: 'expense', amount: 185.00, desc: 'Compra de tela LCD iPhone 11', category: 'parts', method: 'pix', date: dateOnly(-6), createdAt: dateOffset(-6, 10).toISOString() },
            { id: 'TR-DEMO-004', type: 'expense', amount: 64.50, desc: 'Materiais de bancada', category: 'supplies', method: 'cartao', date: dateOnly(-2), createdAt: dateOffset(-2, 9).toISOString() }
        ];

        db.movements = [
            { id: 'MV-DEMO-001', productId: 'PR-DEMO-001', type: 'in', qty: 5, reason: 'Estoque inicial', date: dateOffset(-12, 9).toISOString() },
            { id: 'MV-DEMO-002', productId: 'PR-DEMO-003', type: 'out', qty: 1, reason: 'Reserva para O.S. 1047', date: dateOffset(-2, 15).toISOString() },
            { id: 'MV-DEMO-003', productId: 'PR-DEMO-004', type: 'out', qty: 1, reason: 'Venda PDV V-DEMO-102', date: dateOffset(-1, 14).toISOString() }
        ];

        db.cashier = { status: 'open', openedAt: dateOffset(0, 8).toISOString(), closedAt: null, initialAmount: 200.00, balance: 200.00 };
        save();
        localStorage.setItem(DEMO_DATA_KEY, '1');
        return true;
    }

    function refreshDemoViews() {
        document.querySelectorAll('.company-name-display').forEach(function (el) {
            el.textContent = (db && db.settings && db.settings.companyName) || 'Assistência TechFix';
        });
        ['renderDashboard', 'renderOrders', 'renderClients', 'renderInventory', 'renderTransactions', 'renderPDVGrid', 'renderPDVSalesHistory', 'updateCashierUI', 'populatePDVClients'].forEach(function (functionName) {
            if (typeof window[functionName] === 'function') window[functionName]();
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function seedDemoWhenReady(attempt) {
        if (seedDemoData()) {
            refreshDemoViews();
            return;
        }
        if (attempt < 20) window.setTimeout(function () { seedDemoWhenReady(attempt + 1); }, 50);
    }

    function syncBannerOffset(banner) {
        if (!banner) return;
        var h = Math.max(38, Math.ceil(banner.getBoundingClientRect().height));
        document.documentElement.style.setProperty('--plena-demo-banner-h', h + 'px');
    }

    function injectDemoLayer() {
        if (!document.getElementById('plena-demo-layout-style')) {
            var style = document.createElement('style');
            style.id = 'plena-demo-layout-style';
            style.textContent = [
                'body.plena-demo-has-banner { padding-top: var(--plena-demo-banner-h, 40px); }',
                'body.plena-demo-has-banner #sidebar { top: var(--plena-demo-banner-h, 40px); height: calc(100vh - var(--plena-demo-banner-h, 40px)); }',
                'body.plena-demo-has-banner #main-header { top: var(--plena-demo-banner-h, 40px); }'
            ].join('\n');
            document.head.appendChild(style);
        }

        if (!document.getElementById('plena-demo-banner')) {
            var banner = document.createElement('div');
            banner.id = 'plena-demo-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#0f2140;border-bottom:1px solid rgba(96,165,250,0.32);color:#f5f7fb;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 10px rgba(15,33,64,.25);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#60a5fa;"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • Assistência TechFix</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:#2563eb;color:#ffffff;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;transition:background 0.2s;">Gostei, chamar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.28);background:transparent;color:#dbeafe;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar demo</button>';
            document.body.prepend(banner);
            document.body.classList.add('plena-demo-has-banner');
            syncBannerOffset(banner);

            if (typeof ResizeObserver === 'function') {
                new ResizeObserver(function () { syncBannerOffset(banner); }).observe(banner);
            } else {
                window.addEventListener('resize', function () { syncBannerOffset(banner); });
            }

            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }
    }

    // Reidratação automática de ícones Lucide em alterações dinâmicas do DOM
    if (typeof MutationObserver !== 'undefined') {
        var _iconObserverTimer = null;
        var _iconObserver = new MutationObserver(function () {
            if (_iconObserverTimer) return;
            _iconObserverTimer = setTimeout(function () {
                _iconObserverTimer = null;
                if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
                    if (document.querySelector('i[data-lucide], span[data-lucide]')) {
                        try { lucide.createIcons(); } catch (e) {}
                    }
                }
            }, 35);
        });
        document.addEventListener('DOMContentLoaded', function () {
            if (document.body) {
                _iconObserver.observe(document.body, { childList: true, subtree: true });
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.documentElement.classList.remove('dark');
        unlock();
        var tries = 0;
        var guard = setInterval(function () {
            unlock();
            if (++tries >= 20) clearInterval(guard);
        }, 100);
        injectDemoLayer();
        window.setTimeout(function () {
            seedDemoWhenReady(0);
        }, 0);
    });
})();
