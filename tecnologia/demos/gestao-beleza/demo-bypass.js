/**
 * Demo comercial do Gestão Beleza Pro.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Beleza & Spa';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Gestão Beleza Pro. Gostaria de saber planos e implantação.';
    var DEMO_DATA_KEY = 'plena_beauty_demo_seed_v1';
    var DEMO_GUIDES = {
        dashboard: { label: 'Visão geral', steps: ['Confira os atendimentos e o faturamento previstos para hoje.', 'Compare as comissões pendentes da equipe.', 'Abra a agenda para seguir a rotina de atendimento.'] },
        agenda: { label: 'Agenda', steps: ['Veja os horários de Camila, Bruna e Fernanda.', 'Confira cliente, serviço e profissional em cada cartão.', 'Clique em um horário livre para simular um novo agendamento.'] },
        team: { label: 'Profissionais', steps: ['Compare serviços realizados e comissões da equipe.', 'Abra uma profissional para conhecer os dados cadastrados.', 'Use o pagamento de comissão para observar o fluxo de gestão.'] },
        services: { label: 'Serviços', steps: ['Compare corte, escova, manicure e tratamentos.', 'Observe os valores usados no atendimento.', 'Edite um serviço para conhecer a manutenção do catálogo.'] },
        finance: { label: 'Financeiro', steps: ['Compare receitas, despesas e comissões do mês.', 'Identifique os lançamentos de atendimento e produtos.', 'Filtre a lista para analisar uma parte da operação.'] },
        clients: { label: 'Clientes', steps: ['Abra a ficha de Marina Costa ou Juliana Alves.', 'Confira histórico, ticket médio e preferências.', 'Use os dados para orientar o próximo atendimento.'] },
        reports: { label: 'Relatórios', steps: ['Escolha o período com dados fictícios preenchidos.', 'Compare atendimentos, faturamento e desempenho.', 'Use as informações para apoiar uma decisão simples.'] },
        inventory: { label: 'Estoque', steps: ['Localize a Máscara Hidratante e o Kit Manicure.', 'Observe os alertas de estoque baixo e esgotado.', 'Confira as últimas entradas e saídas no histórico.'] },
        settings: { label: 'Configurações', steps: ['Confira os dados do Studio Aurora.', 'Veja as informações que podem receber a identidade do negócio.', 'Entenda como a operação pode ser personalizada.'] },
        instructions: { label: 'Manual de uso', steps: ['Escolha o tópico que deseja conhecer.', 'Retorne ao módulo indicado para praticar.', 'Feche o roteiro quando já estiver familiarizado.'] }
    };
    window.PLENA_DEMO_WHATSAPP = WHATSAPP_PHONE;

    localStorage.setItem('plena_license', 'DEMO-PLENA-2026');
    localStorage.setItem('ml_license_email', 'demo@plena.app');
    localStorage.setItem('ml_receipt_confirmed', 'true');
    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); }, true);

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
        ['install-btn', 'pwa-install-btn'].forEach(function (id) { var el = document.getElementById(id); if (el) { el.style.display = 'none'; el.classList.add('hidden'); } });
    }

    function seedDemoData() {
        if (typeof db === 'undefined' || typeof save !== 'function') return false;
        if (localStorage.getItem(DEMO_DATA_KEY)) return true;
        if (db.appointments.length || db.clients.length || db.inventory.length || db.transactions.length) return true;

        var today = dateOnly(0);
        var yesterday = dateOnly(-1);
        var twoDaysAgo = dateOnly(-2);
        db.settings = Object.assign({}, db.settings, { businessName: 'Studio Aurora', businessOwner: 'Marina Lopes', businessHours: '09:00 - 20:00', businessPhone: '(12) 99219-1018' });
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
            { id: 'cli-marina', name: 'Marina Costa', phone: '(12) 98845-1172', email: 'marina.costa@exemplo.com', birthDate: '1991-05-18', notes: 'Prefere hidratação e escova modelada.' },
            { id: 'cli-juliana', name: 'Juliana Alves', phone: '(12) 99721-8064', email: 'juliana.alves@exemplo.com', birthDate: '1987-09-03', notes: 'Cliente recorrente de manicure.' },
            { id: 'cli-ana', name: 'Ana Beatriz Lima', phone: '(12) 99614-3370', email: 'ana.lima@exemplo.com', birthDate: '1996-11-26', notes: 'Atendimento com Bruna.' },
            { id: 'cli-carolina', name: 'Carolina Rocha', phone: '(12) 99162-4551', email: 'carolina.rocha@exemplo.com', birthDate: '1990-02-14', notes: 'Interesse em pacote de cuidados.' }
        ];
        db.inventory = [
            { id: 'inv-mascara', name: 'Máscara Hidratante Profissional', category: 'Tratamentos', price: 68, quantity: 8, minStock: 3 },
            { id: 'inv-shampoo', name: 'Shampoo Pós-Química', category: 'Tratamentos', price: 54, quantity: 5, minStock: 2 },
            { id: 'inv-kit', name: 'Kit Manicure Descartável', category: 'Manicure', price: 8, quantity: 2, minStock: 5 },
            { id: 'inv-serum', name: 'Sérum Facial', category: 'Estética', price: 72, quantity: 0, minStock: 2 },
            { id: 'inv-esmalte', name: 'Esmalte Premium Nude', category: 'Manicure', price: 18, quantity: 12, minStock: 4 }
        ];
        db.appointments = [
            { id: 'apt-001', client: 'Marina Costa', serviceId: 'srv-hidratacao', serviceName: 'Hidratação Capilar', proId: 'pro-camila', proName: 'Camila Freitas', date: today, time: '09:00', price: 95, status: 'pending', commission: 42.75, transactionId: 'tr-001' },
            { id: 'apt-002', client: 'Juliana Alves', serviceId: 'srv-manicure', serviceName: 'Manicure Completa', proId: 'pro-bruna', proName: 'Bruna Martins', date: today, time: '10:00', price: 42, status: 'pending', commission: 16.80, transactionId: 'tr-002' },
            { id: 'apt-003', client: 'Ana Beatriz Lima', serviceId: 'srv-corte', serviceName: 'Corte Feminino', proId: 'pro-fernanda', proName: 'Fernanda Costa', date: today, time: '11:00', price: 90, status: 'pending', commission: 37.80, transactionId: 'tr-003' },
            { id: 'apt-004', client: 'Carolina Rocha', serviceId: 'srv-spa', serviceName: 'Spa dos Pés', proId: 'pro-bruna', proName: 'Bruna Martins', date: today, time: '14:00', price: 85, status: 'pending', commission: 34.00, transactionId: 'tr-004' },
            { id: 'apt-005', client: 'Marina Costa', serviceId: 'srv-escova', serviceName: 'Escova Modelada', proId: 'pro-camila', proName: 'Camila Freitas', date: yesterday, time: '15:00', price: 65, status: 'done', commission: 29.25, transactionId: 'tr-005' }
        ];
        db.transactions = [
            { id: 'tr-001', date: today, description: 'Hidratação Capilar (Marina Costa)', type: 'income', amount: 95, commission: 42.75, commissionPaid: false, apptId: 'apt-001', proId: 'pro-camila', proName: 'Camila Freitas' },
            { id: 'tr-002', date: today, description: 'Manicure Completa (Juliana Alves)', type: 'income', amount: 42, commission: 16.80, commissionPaid: false, apptId: 'apt-002', proId: 'pro-bruna', proName: 'Bruna Martins' },
            { id: 'tr-003', date: today, description: 'Corte Feminino (Ana Beatriz Lima)', type: 'income', amount: 90, commission: 37.80, commissionPaid: false, apptId: 'apt-003', proId: 'pro-fernanda', proName: 'Fernanda Costa' },
            { id: 'tr-005', date: yesterday, description: 'Escova Modelada (Marina Costa)', type: 'income', amount: 65, commission: 29.25, commissionPaid: false, apptId: 'apt-005', proId: 'pro-camila', proName: 'Camila Freitas' },
            { id: 'tr-006', date: yesterday, description: 'Venda Produto: Máscara Hidratante Profissional', type: 'income', amount: 68, commission: 0, commissionPaid: true, proName: 'Recepção' },
            { id: 'tr-007', date: twoDaysAgo, description: 'Reposição de materiais descartáveis', type: 'expense', amount: 96, category: 'Estoque' }
        ];
        db.stockMovements = [
            { id: 'mov-001', productId: 'inv-mascara', type: 'in', quantity: 12, reason: 'Compra', notes: 'Reposição semanal.', date: twoDaysAgo },
            { id: 'mov-002', productId: 'inv-mascara', type: 'out', quantity: 1, reason: 'Venda', notes: 'Venda para Marina Costa.', date: yesterday },
            { id: 'mov-003', productId: 'inv-kit', type: 'out', quantity: 8, reason: 'Uso interno', notes: 'Atendimentos do dia.', date: yesterday }
        ];
        save();
        localStorage.setItem(DEMO_DATA_KEY, '1');
        return true;
    }

    function refreshDemoViews() {
        ['renderDashboard', 'renderAgenda', 'renderTeam', 'renderServices', 'renderFinance', 'renderClients', 'renderInventory', 'generateReport'].forEach(function (name) { if (typeof window[name] === 'function') window[name](); });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function updateDemoGuide(view) {
        var guide = document.getElementById('plena-demo-guide');
        if (!guide) return;
        var content = DEMO_GUIDES[view] || DEMO_GUIDES.dashboard;
        guide.innerHTML = '<button type="button" aria-label="Fechar roteiro rápido" style="position:absolute;top:8px;right:10px;background:transparent;border:0;color:#fda4af;font-size:18px;cursor:pointer" onclick="this.parentElement.remove()">×</button><span style="display:block;margin-bottom:4px;color:#fda4af;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase">' + content.label + '</span><strong style="display:block;color:#fff;margin-bottom:8px;font-size:14px">O que testar agora</strong><ol style="margin:0;padding-left:18px;font-size:12px;line-height:1.55;color:#fecdd3"><li>' + content.steps[0] + '</li><li>' + content.steps[1] + '</li><li>' + content.steps[2] + '</li></ol>';
    }

    function initContextualDemoGuide() {
        var active = document.querySelector('.view-section:not(.hide)');
        updateDemoGuide(active ? active.id.replace('view-', '') : 'dashboard');
        if (typeof window.router === 'function' && !window.router.plenaDemoGuide) {
            var originalRouter = window.router;
            var guidedRouter = function (view) { var result = originalRouter.apply(this, arguments); updateDemoGuide(view); return result; };
            guidedRouter.plenaDemoGuide = true;
            window.router = guidedRouter;
        }
    }

    function openWhatsApp() { window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer'); }
    function resetDemo() { if (confirm('Resetar os dados fictícios desta demonstração?')) { localStorage.clear(); location.reload(); } }

    function injectDemoLayer() {
        if (!document.getElementById('plena-demo-banner')) {
            var banner = document.createElement('div');
            banner.id = 'plena-demo-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#4c0519;color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;text-align:center;padding:7px 12px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 2px 10px rgba(0,0,0,.35)';
            banner.innerHTML = '<span>Modo demonstração • ' + DEMO_PRODUCT + ' • dados fictícios</span><button id="plena-demo-cta" type="button" style="border:0;background:#fda4af;color:#4c0519;border-radius:999px;padding:6px 10px;font-weight:900;cursor:pointer">Gostei, chamar no WhatsApp</button><button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff;border-radius:999px;padding:5px 9px;font-weight:800;cursor:pointer">Resetar demo</button>';
            document.body.prepend(banner); document.body.style.paddingTop = '42px';
            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }
        if (!document.getElementById('plena-demo-guide')) {
            var guide = document.createElement('div'); guide.id = 'plena-demo-guide';
            guide.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:999998;max-width:288px;background:rgba(76,5,25,.96);color:#fff;border:1px solid rgba(253,164,175,.28);border-radius:16px;padding:14px 16px;box-shadow:0 14px 38px rgba(0,0,0,.3);font-family:Inter,system-ui,sans-serif';
            document.body.appendChild(guide);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        unlock();
        var tries = 0; var guard = setInterval(function () { unlock(); if (++tries >= 20) clearInterval(guard); }, 100);
        injectDemoLayer();
        var seedAttempts = 0;
        window.setTimeout(function seedWhenReady() { if (seedDemoData()) { refreshDemoViews(); initContextualDemoGuide(); } else if (++seedAttempts < 20) { window.setTimeout(seedWhenReady, 50); } }, 0);
    });
})();
