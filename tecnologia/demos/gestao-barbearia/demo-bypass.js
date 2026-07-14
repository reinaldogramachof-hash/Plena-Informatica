/**
 * demo-bypass.js — Plena MicroSaaS • Gestão Barbearia
 * Libera o app em modo demonstração e adiciona uma camada comercial guiada.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Barbearia Premium';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Barbearia Premium. Gostaria de saber planos e implantação.';
    var DEMO_DATA_KEY = 'plena_barbearia_demo_seed_v1';
    var DEMO_GUIDES = {
        dashboard: { label: 'Visão geral', title: 'O que testar agora', steps: ['Confira os atendimentos previstos para hoje.', 'Compare o faturamento do dia com as comissões pendentes.', 'Abra um agendamento da lista para seguir a rotina.'] },
        agenda: { label: 'Agenda', title: 'O que testar agora', steps: ['Veja os horários preenchidos de Lucas, Rafael e André.', 'Confira cliente, serviço e barbeiro em cada cartão.', 'Clique em um horário livre para simular um novo agendamento.'] },
        team: { label: 'Barbeiros', title: 'O que testar agora', steps: ['Compare as comissões de Lucas, Rafael e André.', 'Observe os serviços concluídos de cada profissional.', 'Use o botão de pagamento para visualizar a gestão de comissões.'] },
        services: { label: 'Serviços', title: 'O que testar agora', steps: ['Compare os valores de corte, barba e combos.', 'Observe quantas vendas já foram registradas por serviço.', 'Edite um item para conhecer a manutenção do catálogo.'] },
        inventory: { label: 'Estoque', title: 'O que testar agora', steps: ['Localize a Pomada Modeladora e a Navalha descartável.', 'Observe o alerta de estoque baixo nos itens de reposição.', 'Confira as últimas entradas e saídas no histórico.'] },
        finance: { label: 'Financeiro', title: 'O que testar agora', steps: ['Compare receitas, despesas e comissões do mês.', 'Identifique o lançamento fiado de um cliente recorrente.', 'Filtre a lista para analisar um período ou profissional.'] },
        pdv: { label: 'PDV', title: 'O que testar agora', steps: ['Adicione Pomada Modeladora ou Shampoo ao carrinho.', 'Vincule o cliente e selecione um barbeiro para ver a comissão.', 'Finalize a venda e confira o reflexo no caixa e estoque.'] },
        clients: { label: 'Clientes', title: 'O que testar agora', steps: ['Abra a ficha de Gabriel Santos ou Bruno Lima.', 'Confira histórico, ticket médio e preferências de atendimento.', 'Use o atalho de agenda para iniciar uma nova visita.'] },
        reports: { label: 'Relatórios', title: 'O que testar agora', steps: ['Selecione um período com os dados fictícios já preenchidos.', 'Compare faturamento, atendimentos e desempenho da equipe.', 'Use as informações para apoiar uma decisão da operação.'] },
        settings: { label: 'Configurações', title: 'O que testar agora', steps: ['Confira os dados da Barbearia Central no cadastro.', 'Veja horários, intervalos e preferências operacionais.', 'Entenda quais informações podem receber a identidade do cliente.'] },
        instructions: { label: 'Manual de uso', title: 'O que testar agora', steps: ['Escolha o tópico que deseja conhecer.', 'Retorne ao módulo indicado para praticar.', 'Feche este roteiro quando já estiver familiarizado.'] },
        notifications: { label: 'Notificações', title: 'O que testar agora', steps: ['Confira os avisos da operação.', 'Use alertas para priorizar uma ação.', 'Volte ao módulo relacionado para continuar.'] },
        about: { label: 'Informações', title: 'Próximo passo', steps: ['Explore os módulos mais importantes.', 'Use os dados fictícios sem receio.', 'Chame a Plena para conhecer a implantação.'] }
    };
    window.PLENA_DEMO_WHATSAPP = WHATSAPP_PHONE;

    localStorage.setItem('plena_license', 'DEMO-PLENA-2026');
    localStorage.setItem('ml_license_email', 'demo@plena.app');
    localStorage.setItem('ml_receipt_confirmed', 'true');

    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); }, true);

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

    function openWhatsApp() {
        window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Resetar os dados fictícios desta demonstração?')) return;
        localStorage.clear();
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
            businessEnd: 20,
            agendaInterval: 60
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
            { id: 'cli-vinicius', name: 'Vinícius Rocha', phone: '(12) 99162-4551', email: 'vinicius.rocha@exemplo.com', birthDate: '1991-02-14', notes: 'Interesse em tratamento capilar.' }
        ];

        db.inventory = [
            { id: 'inv-pomada', name: 'Pomada Modeladora Matte', category: 'cosmeticos', supplier: 'Barber Supply', quantity: 8, minQuantity: 3, unitPrice: 22.00, price: 45.00, createdAt: dateTime(-25, 10) },
            { id: 'inv-shampoo', name: 'Shampoo Anticaspa', category: 'cosmeticos', supplier: 'Barber Supply', quantity: 5, minQuantity: 2, unitPrice: 19.00, price: 38.00, createdAt: dateTime(-20, 10) },
            { id: 'inv-navalha', name: 'Navalha Descartável', category: 'laminas', supplier: 'Pro Barber', quantity: 2, minQuantity: 5, unitPrice: 1.80, price: 5.00, createdAt: dateTime(-18, 10) },
            { id: 'inv-posbarba', name: 'Bálsamo Pós-Barba', category: 'cosmeticos', supplier: 'Barber Supply', quantity: 0, minQuantity: 2, unitPrice: 18.00, price: 36.00, createdAt: dateTime(-17, 10) },
            { id: 'inv-capa', name: 'Capa de Corte Premium', category: 'acessorios', supplier: 'Pro Barber', quantity: 6, minQuantity: 2, unitPrice: 24.00, price: 52.00, createdAt: dateTime(-15, 10) }
        ];

        db.appointments = [
            { id: 'apt-001', date: today, time: '09:00', client: 'Gabriel Santos', clientId: 'cli-gabriel', proId: 'pro-lucas', proName: 'Lucas Ferreira', serviceId: 'srv-combo', serviceName: 'Combo Corte + Barba', status: 'pending', notes: 'Manter o acabamento da última visita.' },
            { id: 'apt-002', date: today, time: '10:00', client: 'Caio Oliveira', clientId: 'cli-caio', proId: 'pro-rafael', proName: 'Rafael Souza', serviceId: 'srv-social', serviceName: 'Corte Social', status: 'pending', notes: '' },
            { id: 'apt-003', date: today, time: '11:00', client: 'Vinícius Rocha', clientId: 'cli-vinicius', proId: 'pro-andre', proName: 'André Martins', serviceId: 'srv-hidratacao', serviceName: 'Hidratação Capilar', status: 'pending', notes: 'Avaliar tratamento.' },
            { id: 'apt-004', date: today, time: '14:00', client: 'Bruno Lima', clientId: 'cli-bruno', proId: 'pro-lucas', proName: 'Lucas Ferreira', serviceId: 'srv-degrade', serviceName: 'Corte Degradê', status: 'pending', notes: '' },
            { id: 'apt-005', date: yesterday, time: '15:00', client: 'Gabriel Santos', clientId: 'cli-gabriel', proId: 'pro-lucas', proName: 'Lucas Ferreira', serviceId: 'srv-combo', serviceName: 'Combo Corte + Barba', status: 'done', notes: '' }
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

    function getActiveDemoView() {
        var activeView = document.querySelector('.view-section:not(.hide)');
        return activeView ? activeView.id.replace('view-', '') : 'dashboard';
    }

    function updateDemoGuide(view) {
        var guide = document.getElementById('plena-demo-guide');
        if (!guide) return;
        var content = DEMO_GUIDES[view] || DEMO_GUIDES.dashboard;
        guide.innerHTML = '<button type="button" aria-label="Fechar roteiro rápido" style="position:absolute;top:8px;right:10px;background:transparent;border:0;color:#94a3b8;font-size:18px;cursor:pointer" onclick="this.parentElement.remove()">×</button>' +
            '<span style="display:block;margin-bottom:4px;color:#93c5fd;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase">' + content.label + '</span>' +
            '<strong style="display:block;color:#fff;margin-bottom:8px;font-size:14px">' + content.title + '</strong>' +
            '<ol style="margin:0;padding-left:18px;font-size:12px;line-height:1.55;color:#cbd5e1"><li>' + content.steps[0] + '</li><li>' + content.steps[1] + '</li><li>' + content.steps[2] + '</li></ol>';
    }

    function initContextualDemoGuide() {
        updateDemoGuide(getActiveDemoView());
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
            banner.innerHTML = '<span>Modo demonstração • ' + DEMO_PRODUCT + ' • dados ficticios</span><button id="plena-demo-cta" type="button" style="border:0;background:#22c55e;color:#052e16;border-radius:999px;padding:6px 10px;font-weight:900;cursor:pointer">Gostei, chamar no WhatsApp</button><button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff;border-radius:999px;padding:5px 9px;font-weight:800;cursor:pointer">Resetar demo</button>';
            document.body.prepend(banner);
            document.body.style.paddingTop = '42px';
            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }

        if (!document.getElementById('plena-demo-guide')) {
            var guide = document.createElement('div');
            guide.id = 'plena-demo-guide';
            guide.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:999998;max-width:288px;background:rgba(2,6,23,.94);color:#e5e7eb;border:1px solid rgba(147,197,253,.22);border-radius:16px;padding:14px 16px;box-shadow:0 14px 38px rgba(0,0,0,.28);font-family:Inter,system-ui,sans-serif';
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

