/**
 * demo-bypass.js — Plena MicroSaaS • Gestão Barbearia Pro
 * Libera o app em modo demonstração, assegura tema claro inicial e ajusta a faixa superior sem cobrir controles.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Barbearia Premium';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Barbearia Premium. Gostaria de saber planos e implantação.';
    var DEMO_DATA_KEY = 'plena_barbearia_demo_seed_v1';
    var SESSION_BOOT_KEY = 'plena_barbearia_demo_theme_booted';
    window.PLENA_DEMO_WHATSAPP = WHATSAPP_PHONE;

    try {
        localStorage.setItem('plena_license', 'DEMO-PLENA-2026');
        localStorage.setItem('ml_license_email', 'demo@plena.app');
        localStorage.setItem('ml_receipt_confirmed', 'true');
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

        var header = document.getElementById('main-header') || document.querySelector('.main-content > header');
        if (header) { header.style.display = ''; header.classList.remove('hide', 'hidden'); }

        var receiptModal = document.getElementById('welcome-receipt-modal');
        if (receiptModal) receiptModal.classList.add('hidden');

        ['install-btn', 'pwa-install-btn'].forEach(function (id) {
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

    function dateOnly(offset) {
        var date = new Date();
        date.setDate(date.getDate() + (offset || 0));
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return date.getFullYear() + '-' + month + '-' + day;
    }

    function dateTime(offset, hour) {
        var date = new Date();
        date.setDate(date.getDate() + (offset || 0));
        date.setHours(hour || 9, 0, 0, 0);
        return date.toISOString();
    }

    function seedDemoData() {
        if (typeof db === 'undefined' || typeof save !== 'function') return false;
        if (localStorage.getItem(DEMO_DATA_KEY)) return true;

        var hasUserData = db.appointments.length || db.clients.length || db.inventory.length || db.transactions.length;
        if (hasUserData) return true;

        var today = dateOnly(0);
        var yesterday = dateOnly(-1);
        var twoDaysAgo = dateOnly(-2);
        var threeDaysAgo = dateOnly(-3);

        db.settings = Object.assign({}, db.settings, {
            businessName: 'Barbearia Central',
            businessOwner: 'Marcos Almeida',
            businessPhone: '(12) 99219-1018',
            businessHours: '09:00 às 20:00',
            businessStart: 9,
            businessEnd: 18,
            agendaInterval: 60,
            workDays: {
                saturday: { active: true, start: 9, end: 18 },
                sunday: { active: true, start: 9, end: 17 }
            },
            theme: 'light'
        });

        db.team = [
            { id: 'pro-lucas', name: 'Lucas Ferreira', commission: 45, contract: 'PJ', phone: '(12) 98811-2040', startDate: dateOnly(-420), notes: 'Especialista em degradê e barba.' },
            { id: 'pro-rafael', name: 'Rafael Souza', commission: 40, contract: 'PJ', phone: '(12) 99702-4815', startDate: dateOnly(-310), notes: 'Atendimento infantil e cortes sociais.' },
            { id: 'pro-andre', name: 'André Martins', commission: 42, contract: 'CLT', phone: '(12) 99675-9112', startDate: dateOnly(-185), notes: 'Coloração e tratamentos capilares.' }
        ];

        db.services = [
            { id: 'srv-degrade', name: 'Corte Degradê', price: 45.00 },
            { id: 'srv-social', name: 'Corte Social', price: 38.00 },
            { id: 'srv-barba', name: 'Barba Completa', price: 35.00 },
            { id: 'srv-combo', name: 'Combo Corte + Barba', price: 72.00 },
            { id: 'srv-pezinho', name: 'Pezinho / Acabamento', price: 18.00 },
            { id: 'srv-sobrancelha', name: 'Sobrancelha', price: 22.00 },
            { id: 'srv-hidratacao', name: 'Hidratação Capilar', price: 48.00 }
        ];

        db.clients = [
            { id: 'cli-gabriel', name: 'Gabriel Santos', phone: '(12) 98845-1172', email: 'gabriel.santos@exemplo.com', birthDate: '1993-05-18', notes: 'Prefere degradê baixo e barba desenhada.' },
            { id: 'cli-bruno', name: 'Bruno Lima', phone: '(12) 99721-8064', email: 'bruno.lima@exemplo.com', birthDate: '1987-09-03', notes: 'Cliente recorrente; costuma comprar pomada.' },
            { id: 'cli-caio', name: 'Caio Oliveira', phone: '(12) 99614-3370', email: 'caio.oliveira@exemplo.com', birthDate: '1998-11-26', notes: 'Atendimento com Rafael, corte social.' },
            { id: 'cli-vinicius', name: 'Vinícius Rocha', phone: '(12) 99162-4551', email: 'vinicius.rocha@exemplo.com', birthDate: '1991-02-14', notes: 'Interesse em tratamento capilar.' },
            { id: 'cli-eduardo', name: 'Eduardo Alves', phone: '(12) 98215-6090', email: 'eduardo.alves@exemplo.com', birthDate: '1990-07-09', notes: 'Costuma agendar nas manhãs de quarta e sexta.' }
        ];

        db.inventory = [
            { id: 'inv-pomada', name: 'Pomada Modeladora Matte', category: 'cosmeticos', supplier: 'Barber Supply', quantity: 8, minQuantity: 3, unitPrice: 22.00, price: 45.00, createdAt: dateTime(-25, 10) },
            { id: 'inv-shampoo', name: 'Shampoo Anticaspa', category: 'cosmeticos', supplier: 'Barber Supply', quantity: 5, minQuantity: 2, unitPrice: 19.00, price: 38.00, createdAt: dateTime(-20, 10) },
            { id: 'inv-oleo', name: 'Óleo para Barba 30ml', category: 'cosmeticos', supplier: 'Barber Supply', quantity: 7, minQuantity: 2, unitPrice: 24.00, price: 48.00, createdAt: dateTime(-19, 10) },
            { id: 'inv-balm', name: 'Balm Hidratante Barba', category: 'cosmeticos', supplier: 'Barber Supply', quantity: 6, minQuantity: 2, unitPrice: 21.00, price: 42.00, createdAt: dateTime(-18, 10) },
            { id: 'inv-navalha', name: 'Navalha Descartável', category: 'laminas', supplier: 'Pro Barber', quantity: 2, minQuantity: 5, unitPrice: 1.80, price: 5.00, createdAt: dateTime(-18, 10) },
            { id: 'inv-posbarba', name: 'Bálsamo Pós-Barba', category: 'cosmeticos', supplier: 'Barber Supply', quantity: 0, minQuantity: 2, unitPrice: 18.00, price: 36.00, createdAt: dateTime(-17, 10) },
            { id: 'inv-capa', name: 'Capa de Corte Premium', category: 'acessorios', supplier: 'Pro Barber', quantity: 6, minQuantity: 2, unitPrice: 24.00, price: 52.00, createdAt: dateTime(-15, 10) },
            { id: 'inv-gel', name: 'Gel Fixador Black 250g', category: 'cosmeticos', supplier: 'Barber Supply', quantity: 9, minQuantity: 3, unitPrice: 14.00, price: 29.90, createdAt: dateTime(-12, 10) }
        ];

        db.appointments = [
            { id: 'apt-001', date: today, time: '09:00', client: 'Gabriel Santos', clientId: 'cli-gabriel', proId: 'pro-lucas', proName: 'Lucas Ferreira', serviceId: 'srv-combo', serviceName: 'Combo Corte + Barba', status: 'done', notes: 'Manter o acabamento da última visita.' },
            { id: 'apt-002', date: today, time: '10:00', client: 'Caio Oliveira', clientId: 'cli-caio', proId: 'pro-rafael', proName: 'Rafael Souza', serviceId: 'srv-social', serviceName: 'Corte Social', status: 'done', notes: '' },
            { id: 'apt-003', date: today, time: '11:00', client: 'Vinícius Rocha', clientId: 'cli-vinicius', proId: 'pro-andre', proName: 'André Martins', serviceId: 'srv-hidratacao', serviceName: 'Hidratação Capilar', status: 'pending', notes: 'Avaliar tratamento.' },
            { id: 'apt-004', date: today, time: '10:00', client: 'Eduardo Alves', clientId: 'cli-eduardo', proId: 'pro-lucas', proName: 'Lucas Ferreira', serviceId: 'srv-barba', serviceName: 'Barba Completa', status: 'pending', notes: '' },
            { id: 'apt-005', date: today, time: '12:00', client: 'Bruno Lima', clientId: 'cli-bruno', proId: 'pro-lucas', proName: 'Lucas Ferreira', serviceId: 'srv-degrade', serviceName: 'Corte Degradê', status: 'pending', notes: '' },
            { id: 'apt-006', date: today, time: '13:00', client: 'Gabriel Santos', clientId: 'cli-gabriel', proId: 'pro-rafael', proName: 'Rafael Souza', serviceId: 'srv-pezinho', serviceName: 'Pezinho / Acabamento', status: 'pending', notes: '' },
            { id: 'apt-007', date: today, time: '14:00', client: 'Caio Oliveira', clientId: 'cli-caio', proId: 'pro-andre', proName: 'André Martins', serviceId: 'srv-degrade', serviceName: 'Corte Degradê', status: 'pending', notes: '' },
            { id: 'apt-008', date: yesterday, time: '15:00', client: 'Gabriel Santos', clientId: 'cli-gabriel', proId: 'pro-lucas', proName: 'Lucas Ferreira', serviceId: 'srv-combo', serviceName: 'Combo Corte + Barba', status: 'done', notes: '' },
            { id: 'apt-009', date: twoDaysAgo, time: '16:00', client: 'Vinícius Rocha', clientId: 'cli-vinicius', proId: 'pro-andre', proName: 'André Martins', serviceId: 'srv-barba', serviceName: 'Barba Completa', status: 'done', notes: '' }
        ];

        db.transactions = [
            { id: 'tr-001', type: 'income', description: 'Combo Corte + Barba — Gabriel Santos', amount: 72.00, date: today, proId: 'pro-lucas', proName: 'Lucas Ferreira', serviceId: 'srv-combo', clientId: 'cli-gabriel', commission: 32.40, commissionPaid: false, isPending: false },
            { id: 'tr-002', type: 'income', description: 'Corte Social — Caio Oliveira', amount: 38.00, date: today, proId: 'pro-rafael', proName: 'Rafael Souza', serviceId: 'srv-social', clientId: 'cli-caio', commission: 15.20, commissionPaid: false, isPending: false },
            { id: 'tr-003', type: 'income', description: 'PDV [Lucas Ferreira]: Pomada Modeladora Matte', amount: 45.00, date: yesterday, proId: 'pro-lucas', proName: 'Lucas Ferreira', serviceId: 'pdv', clientId: 'cli-bruno', commission: 20.25, commissionPaid: false, isPending: false },
            { id: 'tr-004', type: 'income', description: 'Corte Degradê — Bruno Lima', amount: 45.00, date: yesterday, proId: 'pro-lucas', proName: 'Lucas Ferreira', serviceId: 'srv-degrade', clientId: 'cli-bruno', commission: 20.25, commissionPaid: false, isPending: true },
            { id: 'tr-005', type: 'income', description: 'Barba Completa — Vinícius Rocha', amount: 35.00, date: twoDaysAgo, proId: 'pro-andre', proName: 'André Martins', serviceId: 'srv-barba', clientId: 'cli-vinicius', commission: 14.70, commissionPaid: true, isPending: false },
            { id: 'tr-006', type: 'expense', description: 'Reposição de cosméticos', amount: 128.00, date: threeDaysAgo, category: 'Estoque', commissionPaid: true, isPending: false },
            { id: 'tr-007', type: 'expense', description: 'Material descartável para barbearia', amount: 46.50, date: yesterday, category: 'Operacional', commissionPaid: true, isPending: false }
        ];

        db.stockMovements = [
            { id: 'mov-001', date: dateTime(-3, 10), productId: 'inv-pomada', productName: 'Pomada Modeladora Matte', type: 'in', quantity: 12, reason: 'compra', notes: 'Reposição semanal.' },
            { id: 'mov-002', date: dateTime(-1, 16), productId: 'inv-pomada', productName: 'Pomada Modeladora Matte', type: 'out', quantity: 1, reason: 'venda', notes: 'Venda no PDV para Bruno Lima.' },
            { id: 'mov-003', date: dateTime(-1, 17), productId: 'inv-navalha', productName: 'Navalha Descartável', type: 'out', quantity: 8, reason: 'uso', notes: 'Atendimentos do dia.' }
        ];

        save();
        localStorage.setItem(DEMO_DATA_KEY, '1');
        return true;
    }

    function refreshDemoViews() {
        if (typeof db !== 'undefined') {
            if (document.getElementById('hour-start-week')) document.getElementById('hour-start-week').value = db.settings.businessStart || 9;
            if (document.getElementById('hour-end-week')) document.getElementById('hour-end-week').value = db.settings.businessEnd || 18;
        }
        ['renderDashboard', 'renderAgenda', 'renderTeam', 'renderServices', 'renderInventory', 'renderFinance', 'renderClients', 'renderPDV', 'updateDataStatus'].forEach(function (functionName) {
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
                'body.plena-demo-has-banner .main-content > header, body.plena-demo-has-banner #main-header { top: var(--plena-demo-banner-h, 40px); }'
            ].join('\n');
            document.head.appendChild(style);
        }

        if (!document.getElementById('plena-demo-banner')) {
            var banner = document.createElement('div');
            banner.id = 'plena-demo-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#1f1a15;border-bottom:1px solid rgba(217,119,6,0.35);color:#f8f4ed;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 10px rgba(31,26,21,.28);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#f59e0b;"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • Barbearia Central</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:#b45309;color:#ffffff;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;transition:background 0.2s;">Gostei, chamar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid rgba(248,244,237,.32);background:transparent;color:#f3e8d6;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar demo</button>';
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
