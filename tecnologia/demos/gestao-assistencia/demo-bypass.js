/**
 * demo-bypass.js — Plena MicroSaaS • Gestão Assistência
 * Libera o app em modo demonstração e adiciona uma camada comercial guiada.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Assistência Pro';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Assistência Pro. Gostaria de saber planos e implantação.';
    var DEMO_DATA_KEY = 'plena_assistencia_demo_seed_v1';
    var DEMO_GUIDES = {
        dashboard: {
            label: 'Visão geral',
            title: 'Comece pelo panorama',
            steps: ['Confira os indicadores do mês.', 'Abra a O.S. 1048 em análise.', 'Veja os alertas de estoque baixo.']
        },
        orders: {
            label: 'Ordens de serviço',
            title: 'Simule um atendimento',
            steps: ['Abra a O.S. 1048 da Marina.', 'Confira diagnóstico, peças e técnico.', 'Altere o status para acompanhar o fluxo.']
        },
        clients: {
            label: 'Clientes',
            title: 'Consulte o histórico',
            steps: ['Pesquise por Marina Duarte.', 'Abra o cadastro e veja os dados.', 'Use o histórico para contextualizar o atendimento.']
        },
        pdv: {
            label: 'PDV - vendas',
            title: 'Faça uma venda rápida',
            steps: ['O caixa já está aberto para o teste.', 'Adicione um acessório ao carrinho.', 'Finalize a venda por Pix ou cartão.']
        },
        inventory: {
            label: 'Estoque',
            title: 'Acompanhe as peças',
            steps: ['Filtre os itens com estoque baixo.', 'Abra o histórico de um produto.', 'Ajuste quantidade ou preço para testar.']
        },
        transactions: {
            label: 'Fluxo de caixa',
            title: 'Veja a saúde financeira',
            steps: ['Compare receitas e despesas.', 'Filtre os lançamentos por período.', 'Cadastre uma entrada ou saída de teste.']
        },
        reports: {
            label: 'Relatórios',
            title: 'Consolide a operação',
            steps: ['Escolha o período desejado.', 'Confira os dados de O.S. e vendas.', 'Gere um relatório para análise.']
        },
        settings: {
            label: 'Configurações',
            title: 'Personalize a operação',
            steps: ['Confira os dados da empresa.', 'Veja a equipe de técnicos.', 'Ajuste preferências em uma cópia de teste.']
        },
        instructions: {
            label: 'Manual de uso',
            title: 'Avance no seu ritmo',
            steps: ['Use os tópicos para entender cada etapa.', 'Retorne ao módulo que quiser testar.', 'Feche este card quando já estiver familiarizado.']
        },
        about: {
            label: 'Informações',
            title: 'Próximo passo',
            steps: ['Explore os módulos que mais importam.', 'Use os dados fictícios sem receio.', 'Chame a Plena para conhecer a implantação.']
        }
    };
    window.PLENA_DEMO_WHATSAPP = WHATSAPP_PHONE;

    localStorage.setItem('assistencia_license', 'DEMO-PLENA-2026');
    localStorage.setItem('assistencia_email', 'demo@plena.app');

    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); }, true);

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
        localStorage.clear();
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
            companyName: 'Plena Informática',
            companyPhone: '(12) 99219-1018',
            companyAddress: 'São José dos Campos - SP',
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

    function getActiveDemoView() {
        var activeView = document.querySelector('.view-section:not(.hide)');
        return activeView ? activeView.id.replace('view-', '') : 'dashboard';
    }

    function updateDemoGuide(view) {
        var guide = document.getElementById('plena-demo-guide');
        if (!guide) return;

        var content = DEMO_GUIDES[view] || DEMO_GUIDES.dashboard;
        guide.innerHTML = '<button type="button" aria-label="Fechar roteiro rápido" style="position:absolute;top:8px;right:10px;background:transparent;border:0;color:#94a3b8;font-size:18px;cursor:pointer" onclick="this.parentElement.remove()">×</button>' +
            '<span style="display:block;margin-bottom:4px;color:#67e8f9;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase">' + content.label + '</span>' +
            '<strong style="display:block;color:#fff;margin-bottom:8px;font-size:14px">' + content.title + '</strong>' +
            '<ol style="margin:0;padding-left:18px;font-size:12px;line-height:1.55;color:#cbd5e1"><li>' + content.steps[0] + '</li><li>' + content.steps[1] + '</li><li>' + content.steps[2] + '</li></ol>';
    }

    function initContextualDemoGuide() {
        var currentView = getActiveDemoView();
        updateDemoGuide(currentView);

        if (typeof window.router === 'function' && !window.router.plenaDemoGuide) {
            var originalRouter = window.router;
            var guidedRouter = function (view) {
                var result = originalRouter.apply(this, arguments);
                updateDemoGuide(view);
                return result;
            };
            guidedRouter.plenaDemoGuide = true;
            window.router = guidedRouter;
        }
    }

    function injectDemoLayer() {
        if (!document.getElementById('plena-demo-banner')) {
            var banner = document.createElement('div');
            banner.id = 'plena-demo-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#0f172a;color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;text-align:center;padding:7px 12px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 2px 10px rgba(0,0,0,.35)';
            banner.innerHTML = '<span>Modo demonstração • ' + DEMO_PRODUCT + ' • dados fictícios</span><button id="plena-demo-cta" type="button" style="border:0;background:#22c55e;color:#052e16;border-radius:999px;padding:6px 10px;font-weight:900;cursor:pointer">Gostei, chamar no WhatsApp</button><button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff;border-radius:999px;padding:5px 9px;font-weight:800;cursor:pointer">Resetar demo</button>';
            document.body.prepend(banner);
            document.body.style.paddingTop = '42px';
            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }

        if (!document.getElementById('plena-demo-guide')) {
            var guide = document.createElement('div');
            guide.id = 'plena-demo-guide';
            guide.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:999998;max-width:288px;background:rgba(2,6,23,.94);color:#e5e7eb;border:1px solid rgba(103,232,249,.22);border-radius:16px;padding:14px 16px;box-shadow:0 14px 38px rgba(0,0,0,.28);font-family:Inter,system-ui,sans-serif';
            document.body.appendChild(guide);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        unlock();
        var tries = 0;
        var guard = setInterval(function () {
            unlock();
            if (++tries >= 20) clearInterval(guard);
        }, 100);
        injectDemoLayer();
        window.setTimeout(function () {
            initContextualDemoGuide();
            seedDemoWhenReady(0);
        }, 0);
    });
})();


