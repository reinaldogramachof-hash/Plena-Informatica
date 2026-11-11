/**
 * Demo comercial do Gestão Beleza Pro — Studio Aurora.
 * Libera o app em modo demonstração, popula dados fictícios equilibrados e posiciona a faixa sem cobrir controles.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Beleza & Spa';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Gestão Beleza Pro. Gostaria de saber planos e implantação.';
    var DEMO_DATA_KEY = 'plena_beauty_demo_seed_v1';
    window.PLENA_DEMO_WHATSAPP = WHATSAPP_PHONE;

    try {
        localStorage.setItem('plena_license', 'DEMO-PLENA-2026');
        localStorage.setItem('ml_license_email', 'demo@plena.app');
        localStorage.setItem('ml_receipt_confirmed', 'true');
    } catch (e) {}

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    }, true);

    function dateOnly(offset) {
        var date = new Date();
        date.setDate(date.getDate() + (offset || 0));
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }

    function unlock() {
        var login = document.getElementById('view-login');
        if (login) { login.style.display = 'none'; login.classList.add('hidden'); }
        var appMain = document.getElementById('app-main-content');
        if (appMain) { appMain.style.display = ''; appMain.classList.remove('hidden', 'hide'); }
        var receiptModal = document.getElementById('welcome-receipt-modal');
        if (receiptModal) receiptModal.classList.add('hidden');
        ['install-btn', 'pwa-install-btn'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) { el.style.display = 'none'; el.classList.add('hidden'); el.classList.remove('flex'); }
        });
    }

    function seedDemoData() {
        if (typeof db === 'undefined' || typeof save !== 'function') return false;
        if (localStorage.getItem(DEMO_DATA_KEY)) return true;
        if (db.appointments.length || db.clients.length || db.inventory.length || db.transactions.length) return true;

        var today = dateOnly(0);
        var yesterday = dateOnly(-1);
        var twoDaysAgo = dateOnly(-2);
        var threeDaysAgo = dateOnly(-3);

        db.settings = Object.assign({}, db.settings, {
            businessName: 'Studio Aurora',
            businessOwner: 'Marina Lopes',
            businessHours: '09:00 - 20:00',
            businessPhone: '(12) 99219-1018'
        });

        db.team = [
            { id: 'pro-camila', name: 'Camila Freitas', commission: 45, contract: 'PJ', phone: '(12) 98811-2040', startDate: dateOnly(-430) },
            { id: 'pro-bruna', name: 'Bruna Martins', commission: 40, contract: 'PJ', phone: '(12) 99702-4815', startDate: dateOnly(-280) },
            { id: 'pro-fernanda', name: 'Fernanda Costa', commission: 42, contract: 'CLT', phone: '(12) 99675-9112', startDate: dateOnly(-160) }
        ];

        db.services = [
            { id: 'srv-corte', name: 'Corte Feminino', price: 90 },
            { id: 'srv-escova', name: 'Escova Modelada', price: 65 },
            { id: 'srv-manicure', name: 'Manicure Completa', price: 42 },
            { id: 'srv-hidratacao', name: 'Hidratação Capilar', price: 95 },
            { id: 'srv-sobrancelha', name: 'Design de Sobrancelhas', price: 48 },
            { id: 'srv-spa', name: 'Spa dos Pés', price: 85 }
        ];

        db.clients = [
            { id: 'cli-marina', name: 'Marina Costa', phone: '(12) 98845-1172', email: 'marina.costa@exemplo.com', birth: '1991-05-18', address: 'Rua das Flores, 140', notes: 'Prefere hidratação e escova modelada.' },
            { id: 'cli-juliana', name: 'Juliana Alves', phone: '(12) 99721-8064', email: 'juliana.alves@exemplo.com', birth: '1987-09-03', address: 'Av. Paulista, 812', notes: 'Cliente recorrente de manicure.' },
            { id: 'cli-ana', name: 'Ana Beatriz Lima', phone: '(12) 99614-3370', email: 'ana.lima@exemplo.com', birth: '1996-11-26', address: 'Rua Turquesa, 54', notes: 'Atendimento com Bruna.' },
            { id: 'cli-carolina', name: 'Carolina Rocha', phone: '(12) 99162-4551', email: 'carolina.rocha@exemplo.com', birth: '1990-02-14', address: 'Rua Alecrim, 210', notes: 'Sessões de spa e cuidados faciais.' },
            { id: 'cli-beatriz', name: 'Beatriz Mendes', phone: '(12) 98134-7720', email: 'beatriz.mendes@exemplo.com', birth: '1994-08-22', address: 'Av. Nove de Julho, 330', notes: 'Retorna quinzenalmente para escova.' },
            { id: 'cli-larissa', name: 'Larissa Nogueira', phone: '(12) 99408-5190', email: 'larissa.nogueira@exemplo.com', birth: '1989-12-04', address: 'Rua das Magnólias, 98', notes: 'Prefere atendimento no fim da manhã.' }
        ];

        db.inventory = [
            { id: 'inv-mascara', name: 'Máscara Hidratante Profissional', category: 'Tratamentos', price: 68, quantity: 8, minStock: 3 },
            { id: 'inv-shampoo', name: 'Shampoo Pós-Química', category: 'Tratamentos', price: 54, quantity: 5, minStock: 2 },
            { id: 'inv-kit', name: 'Kit Manicure Descartável', category: 'Manicure', price: 8, quantity: 3, minStock: 5 },
            { id: 'inv-serum', name: 'Sérum Facial Iluminador', category: 'Estética', price: 72, quantity: 0, minStock: 2 },
            { id: 'inv-esmalte', name: 'Esmalte Gel Nude Rosé', category: 'Manicure', price: 18, quantity: 12, minStock: 4 },
            { id: 'inv-oleo', name: 'Óleo Corporal Aromático', category: 'Estética', price: 84, quantity: 7, minStock: 3 }
        ];

        db.appointments = [
            { id: 'apt-001', client: 'Marina Costa', serviceId: 'srv-hidratacao', serviceName: 'Hidratação Capilar', proId: 'pro-camila', proName: 'Camila Freitas', date: today, time: '09:00', price: 95, status: 'done', commission: 42.75, transactionId: 'tr-001' },
            { id: 'apt-002', client: 'Juliana Alves', serviceId: 'srv-manicure', serviceName: 'Manicure Completa', proId: 'pro-bruna', proName: 'Bruna Martins', date: today, time: '10:00', price: 42, status: 'done', commission: 16.80, transactionId: 'tr-002' },
            { id: 'apt-003', client: 'Ana Beatriz Lima', serviceId: 'srv-corte', serviceName: 'Corte Feminino', proId: 'pro-fernanda', proName: 'Fernanda Costa', date: today, time: '11:00', price: 90, status: 'pending', commission: 37.80, transactionId: 'tr-003' },
            { id: 'apt-004', client: 'Beatriz Mendes', serviceId: 'srv-escova', serviceName: 'Escova Modelada', proId: 'pro-camila', proName: 'Camila Freitas', date: today, time: '13:00', price: 65, status: 'pending', commission: 29.25, transactionId: 'tr-004' },
            { id: 'apt-005', client: 'Carolina Rocha', serviceId: 'srv-spa', serviceName: 'Spa dos Pés', proId: 'pro-bruna', proName: 'Bruna Martins', date: today, time: '14:00', price: 85, status: 'pending', commission: 34.00, transactionId: 'tr-005' },
            { id: 'apt-006', client: 'Larissa Nogueira', serviceId: 'srv-sobrancelha', serviceName: 'Design de Sobrancelhas', proId: 'pro-fernanda', proName: 'Fernanda Costa', date: today, time: '15:00', price: 48, status: 'pending', commission: 20.16, transactionId: 'tr-006' },
            { id: 'apt-007', client: 'Marina Costa', serviceId: 'srv-escova', serviceName: 'Escova Modelada', proId: 'pro-camila', proName: 'Camila Freitas', date: yesterday, time: '15:00', price: 65, status: 'done', commission: 29.25, transactionId: 'tr-007' },
            { id: 'apt-008', client: 'Beatriz Mendes', serviceId: 'srv-hidratacao', serviceName: 'Hidratação Capilar', proId: 'pro-fernanda', proName: 'Fernanda Costa', date: twoDaysAgo, time: '16:00', price: 95, status: 'done', commission: 39.90, transactionId: 'tr-008' },
            { id: 'apt-009', client: 'Juliana Alves', serviceId: 'srv-sobrancelha', serviceName: 'Design de Sobrancelhas', proId: 'pro-bruna', proName: 'Bruna Martins', date: twoDaysAgo, time: '14:00', price: 48, status: 'done', commission: 19.20, transactionId: 'tr-012' },
            { id: 'apt-010', client: 'Carolina Rocha', serviceId: 'srv-manicure', serviceName: 'Manicure Completa', proId: 'pro-bruna', proName: 'Bruna Martins', date: threeDaysAgo, time: '11:00', price: 42, status: 'done', commission: 16.80, transactionId: 'tr-013' }
        ];

        db.transactions = [
            { id: 'tr-001', date: today, description: 'Hidratação Capilar — Marina Costa', type: 'income', amount: 95, category: 'serviço', commission: 42.75, commissionPaid: false, apptId: 'apt-001', proId: 'pro-camila', proName: 'Camila Freitas' },
            { id: 'tr-002', date: today, description: 'Manicure Completa — Juliana Alves', type: 'income', amount: 42, category: 'serviço', commission: 16.80, commissionPaid: false, apptId: 'apt-002', proId: 'pro-bruna', proName: 'Bruna Martins' },
            { id: 'tr-003', date: today, description: 'Corte Feminino — Ana Beatriz Lima', type: 'income', amount: 90, category: 'serviço', commission: 37.80, commissionPaid: false, apptId: 'apt-003', proId: 'pro-fernanda', proName: 'Fernanda Costa' },
            { id: 'tr-004', date: today, description: 'Escova Modelada — Beatriz Mendes', type: 'income', amount: 65, category: 'serviço', commission: 29.25, commissionPaid: false, apptId: 'apt-004', proId: 'pro-camila', proName: 'Camila Freitas' },
            { id: 'tr-005', date: today, description: 'Spa dos Pés — Carolina Rocha', type: 'income', amount: 85, category: 'serviço', commission: 34.00, commissionPaid: false, apptId: 'apt-005', proId: 'pro-bruna', proName: 'Bruna Martins' },
            { id: 'tr-006', date: today, description: 'Design de Sobrancelhas — Larissa Nogueira', type: 'income', amount: 48, category: 'serviço', commission: 20.16, commissionPaid: false, apptId: 'apt-006', proId: 'pro-fernanda', proName: 'Fernanda Costa' },
            { id: 'tr-007', date: yesterday, description: 'Escova Modelada — Marina Costa', type: 'income', amount: 65, category: 'serviço', commission: 29.25, commissionPaid: false, apptId: 'apt-007', proId: 'pro-camila', proName: 'Camila Freitas' },
            { id: 'tr-008', date: twoDaysAgo, description: 'Hidratação Capilar — Beatriz Mendes', type: 'income', amount: 95, category: 'serviço', commission: 39.90, commissionPaid: true, apptId: 'apt-008', proId: 'pro-fernanda', proName: 'Fernanda Costa' },
            { id: 'tr-012', date: twoDaysAgo, description: 'Design de Sobrancelhas — Juliana Alves', type: 'income', amount: 48, category: 'serviço', commission: 19.20, commissionPaid: true, apptId: 'apt-009', proId: 'pro-bruna', proName: 'Bruna Martins' },
            { id: 'tr-013', date: threeDaysAgo, description: 'Manicure Completa — Carolina Rocha', type: 'income', amount: 42, category: 'serviço', commission: 16.80, commissionPaid: true, apptId: 'apt-010', proId: 'pro-bruna', proName: 'Bruna Martins' },
            { id: 'tr-009', date: yesterday, description: 'Venda Produto: Máscara Hidratante Profissional', type: 'income', amount: 68, category: 'estoque', commission: 0, commissionPaid: true, proName: 'Recepção' },
            { id: 'tr-010', date: twoDaysAgo, description: 'Reposição de insumos descartáveis', type: 'expense', amount: 96, category: 'estoque' },
            { id: 'tr-011', date: threeDaysAgo, description: 'Compra de séruns e óleos de cabine', type: 'expense', amount: 142, category: 'estoque' }
        ];

        db.stockMovements = [
            { id: 'mov-001', productId: 'inv-mascara', type: 'in', quantity: 12, reason: 'Compra', notes: 'Reposição semanal.', date: threeDaysAgo },
            { id: 'mov-002', productId: 'inv-mascara', type: 'out', quantity: 1, reason: 'Venda', notes: 'Venda para Marina Costa.', date: yesterday },
            { id: 'mov-003', productId: 'inv-kit', type: 'out', quantity: 6, reason: 'Uso Interno', notes: 'Atendimentos de manicure.', date: yesterday },
            { id: 'mov-004', productId: 'inv-oleo', type: 'in', quantity: 8, reason: 'Compra', notes: 'Linha relaxamento spa.', date: twoDaysAgo }
        ];

        save();
        localStorage.setItem(DEMO_DATA_KEY, '1');
        return true;
    }

    function refreshDemoViews() {
        var activeEl = document.getElementById('dash-active-clients');
        if (activeEl && typeof db !== 'undefined' && Array.isArray(db.clients)) {
            activeEl.textContent = String(db.clients.length);
        }
        var elName = document.getElementById('biz-name'); if (elName && db.settings) elName.value = db.settings.businessName || '';
        var elOwner = document.getElementById('biz-owner'); if (elOwner && db.settings) elOwner.value = db.settings.businessOwner || '';
        var elHours = document.getElementById('biz-hours'); if (elHours && db.settings) elHours.value = db.settings.businessHours || '';
        ['renderDashboard', 'renderAgenda', 'renderTeam', 'renderServices', 'renderFinance', 'renderClients', 'renderInventory', 'generateReport'].forEach(function (name) {
            if (typeof window[name] === 'function') window[name]();
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function openWhatsApp() {
        window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Resetar os dados fictícios desta demonstração?')) return;
        try { localStorage.clear(); } catch (e) {}
        location.reload();
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
                'body.plena-demo-has-banner { padding-top: var(--plena-demo-banner-h, 40px); height: 100vh; overflow: hidden; box-sizing: border-box; }',
                'body.plena-demo-has-banner > div.flex.h-screen { height: calc(100vh - var(--plena-demo-banner-h, 40px)) !important; min-height: 0 !important; }',
                'body.plena-demo-has-banner #sidebar { top: var(--plena-demo-banner-h, 40px); height: calc(100vh - var(--plena-demo-banner-h, 40px)); }',
                'body.plena-demo-has-banner .main-content { min-height: 0 !important; height: 100%; }',
                'body.plena-demo-has-banner .main-content > header { top: 0 !important; flex-shrink: 0; }'
            ].join('\n');
            document.head.appendChild(style);
        }

        if (!document.getElementById('plena-demo-banner')) {
            var banner = document.createElement('div');
            banner.id = 'plena-demo-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#381c26;border-bottom:1px solid rgba(251,113,133,0.35);color:#fbf6f5;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 10px rgba(0,0,0,.35);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#fb7185;"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • Studio Aurora</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:#be123c;color:#ffffff;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;">Gostei, chamar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid rgba(251,246,245,.32);background:transparent;color:#f5dfe4;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar demo</button>';
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
        unlock();
        var tries = 0;
        var guard = setInterval(function () {
            unlock();
            if (++tries >= 20) clearInterval(guard);
        }, 100);
        injectDemoLayer();
        var seedAttempts = 0;
        window.setTimeout(function seedWhenReady() {
            if (seedDemoData()) {
                refreshDemoViews();
            } else if (++seedAttempts < 20) {
                window.setTimeout(seedWhenReady, 50);
            }
        }, 0);
    });
})();
