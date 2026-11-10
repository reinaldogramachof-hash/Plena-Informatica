/**
 * demo-bypass.js — Plena MicroSaaS • Gestão Lava-Rápido
 * Desbloqueia o app em modo demonstração e adiciona a camada comercial guiada.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Gestão Lava-Rápido';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Gestão Lava-Rápido. Gostaria de saber mais sobre a licença vitalícia e implantação.';
    var DB_KEY = 'gestao_lavarapido_v1';

    var DEMO_GUIDES = {
        patio: {
            label: 'Pátio Operacional',
            title: 'Fila de lavagem em tempo real',
            steps: [
                'Acompanhe os carros em cada etapa: Aguardando, Lavagem, Acabamento e Pronto.',
                'Clique em qualquer veículo para avançar de etapa ou registrar serviços extras.',
                'Veículos prontos ficam destacados para liberação e entrega rápida ao cliente.'
            ]
        },
        orders: {
            label: 'Ordens de Serviço',
            title: 'Histórico e controle de OS',
            steps: [
                'Consulte todas as OS do dia e anteriores com placa, modelo e valor total.',
                'Filtre por status de pagamento (pendente, pago, cancelado) e data.',
                'Acesse o detalhamento do check-in de entrada e os serviços executados.'
            ]
        },
        new_order: {
            label: 'Nova Entrada / OS',
            title: 'Check-in ágil na recepção',
            steps: [
                'Localize o cliente pela placa, telefone ou cadastre um novo veículo.',
                'Selecione os serviços (lavagem simples, completa, polimento ou adicionais).',
                'Atribua o lavador responsável para cálculo automático da comissão.'
            ]
        },
        cash: {
            label: 'Frente de Caixa',
            title: 'Movimentações e fechamento',
            steps: [
                'Veja o valor em caixa, entradas por dinheiro, PIX, débito e crédito.',
                'Registre sangrias para depósito ou despesas emergenciais de insumos.',
                'Realize o fechamento diário conferindo o saldo esperado x informado.'
            ]
        },
        services: {
            label: 'Serviços & Preços',
            title: 'Tabela de serviços e lavagens',
            steps: [
                'Configure preços e tempos estimados por tipo de lavagem e detalhamento.',
                'Defina a porcentagem de comissão por serviço para a equipe de lavadores.',
                'Ative ou pause serviços sazonais (ex: lavagem de motor, cristalização).'
            ]
        },
        stock: {
            label: 'Estoque de Insumos',
            title: 'Produtos de estética e lavagem',
            steps: [
                'Monitore o volume de shampoos, ceras líquidas, pretinho e panos de microfibra.',
                'Alerta visual automático quando um insumo atingir o estoque mínimo.',
                'Histórico de entradas de compras e saídas para uso diário no pátio.'
            ]
        },
        team: {
            label: 'Equipe & Comissões',
            title: 'Produtividade dos lavadores',
            steps: [
                'Cadastre seus lavadores e profissionais de acabamento com telefone e função.',
                'Apuração automática da comissão sobre os veículos entregues.',
                'Transparência total para o fechamento semanal ou quinzenal dos lavadores.'
            ]
        },
        reports: {
            label: 'Relatórios & DRE',
            title: 'Faturamento e indicadores',
            steps: [
                'Consulte o faturamento bruto, total de comissões pagas e despesas do pátio.',
                'Veja o ticket médio por veículo e os serviços mais lucrativos do mês.',
                'Exporte os dados em planilha CSV para controle contábil em 1 clique.'
            ]
        },
        settings: {
            label: 'Configurações',
            title: 'Identidade e backup local',
            steps: [
                'Personalize nome do lava-rápido, CNPJ, telefone, endereço e tolerância.',
                'Gere backup completo em arquivo JSON com apenas 1 clique.',
                'Restaure a base a qualquer momento em caso de troca de computador.'
            ]
        }
    };

    window.PLENA_DEMO_WHATSAPP = WHATSAPP_PHONE;

    // 1. Assegurar credenciais de bypass para contornar o lock.js
    localStorage.setItem('lavarapido_license', 'DEMO-PLENA-LAVARAPIDO-2026');
    localStorage.setItem('lavarapido_email', 'demo@plenainformatica.com.br');
    localStorage.setItem('lavarapido_last_verified_at', String(Date.now()));

    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); }, true);

    // Evita conflitos de ServiceWorker em modo iframe/demo
    if ('serviceWorker' in navigator && typeof navigator.serviceWorker.register === 'function') {
        var origRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
        navigator.serviceWorker.register = function () {
            return origRegister.apply(null, arguments).catch(function () {
                return { scope: './', unregister: function () { return Promise.resolve(true); } };
            });
        };
    }

    // Ajusta as datas da base fictícia para que "Hoje" coincida com o horário real do visitante
    function adjustSeedDates(seed) {
        if (!seed || !seed.orders) return seed;
        try {
            var now = new Date();
            var todayStr = now.toISOString().slice(0, 10);
            var refStr = '2026-10-21';
            var refDate = new Date(refStr + 'T12:00:00');
            var nowDate = new Date(todayStr + 'T12:00:00');
            var diffMs = nowDate.getTime() - refDate.getTime();
            var diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return seed;

            function shiftIso(isoStr) {
                if (!isoStr || typeof isoStr !== 'string') return isoStr;
                var d = new Date(isoStr);
                if (isNaN(d.getTime())) return isoStr;
                d.setDate(d.getDate() + diffDays);
                return d.toISOString();
            }

            if (Array.isArray(seed.orders)) {
                seed.orders.forEach(function (o) {
                    if (o.enteredAt) o.enteredAt = shiftIso(o.enteredAt);
                    if (o.deliveredAt) o.deliveredAt = shiftIso(o.deliveredAt);
                    if (o.paidAt) o.paidAt = shiftIso(o.paidAt);
                    if (o.updatedAt) o.updatedAt = shiftIso(o.updatedAt);
                    if (o.cancelledAt) o.cancelledAt = shiftIso(o.cancelledAt);
                });
            }

            if (Array.isArray(seed.cashSessions)) {
                seed.cashSessions.forEach(function (cs) {
                    if (cs.openedAt) cs.openedAt = shiftIso(cs.openedAt);
                    if (cs.closedAt) cs.closedAt = shiftIso(cs.closedAt);
                });
            }

            if (Array.isArray(seed.cashTransactions)) {
                seed.cashTransactions.forEach(function (ct) {
                    if (ct.createdAt) ct.createdAt = shiftIso(ct.createdAt);
                });
            }

            if (Array.isArray(seed.orderHistory)) {
                seed.orderHistory.forEach(function (oh) {
                    if (oh.changedAt) oh.changedAt = shiftIso(oh.changedAt);
                });
            }

            if (Array.isArray(seed.checkins)) {
                seed.checkins.forEach(function (ci) {
                    if (ci.receivedAt) ci.receivedAt = shiftIso(ci.receivedAt);
                    if (ci.updatedAt) ci.updatedAt = shiftIso(ci.updatedAt);
                });
            }

            if (Array.isArray(seed.deliveries)) {
                seed.deliveries.forEach(function (d) {
                    if (d.checkedAt) d.checkedAt = shiftIso(d.checkedAt);
                });
            }
        } catch (err) {
            console.warn('Erro ao ajustar datas relativas da demo lava-rápido:', err);
        }
        return seed;
    }

    // 2. Prepara os dados da demonstração no localStorage
    function seedLavarapidoData() {
        var existing = null;
        try {
            var raw = localStorage.getItem(DB_KEY);
            if (raw) existing = JSON.parse(raw);
        } catch (e) { existing = null; }

        var isPopulated = existing && Array.isArray(existing.orders) && existing.orders.length > 0;
        if (!isPopulated && window.LAVARAPIDO_DEMO_SEED) {
            var seed = adjustSeedDates(JSON.parse(JSON.stringify(window.LAVARAPIDO_DEMO_SEED)));
            localStorage.setItem(DB_KEY, JSON.stringify(seed));
        }
    }

    seedLavarapidoData();

    function openWhatsApp() {
        window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Deseja resetar as alterações e recarregar os dados do Lava Rápido Estrela Azul?')) return;
        try {
            localStorage.removeItem(DB_KEY);
        } catch (e) {}
        location.reload();
    }

    function getActiveDemoView() {
        var activeBtn = document.querySelector('#sidebar .nav-item.active, #sidebar a.active, #mobile .nav-item.active');
        if (activeBtn) {
            var text = activeBtn.textContent.trim().toLowerCase();
            if (text.includes('pátio') || text.includes('patio')) return 'patio';
            if (text.includes('os') || text.includes('ordens')) return 'orders';
            if (text.includes('caixa')) return 'cash';
            if (text.includes('serviço')) return 'services';
            if (text.includes('estoque')) return 'stock';
            if (text.includes('equipe')) return 'team';
            if (text.includes('relatório')) return 'reports';
            if (text.includes('config')) return 'settings';
        }
        return 'patio';
    }

    function updateDemoGuide(view) {
        var guide = document.getElementById('plena-demo-guide');
        if (!guide) return;

        var content = DEMO_GUIDES[view] || DEMO_GUIDES.patio;
        guide.innerHTML = '<button type="button" aria-label="Fechar guia rápido" style="position:absolute;top:8px;right:10px;background:transparent;border:0;color:#94a3b8;font-size:18px;cursor:pointer;line-height:1;" onclick="this.parentElement.remove()">×</button>' +
            '<span style="display:block;margin-bottom:4px;color:#38bdf8;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;">' + content.label + '</span>' +
            '<strong style="display:block;color:#fff;margin-bottom:8px;font-size:13px;line-height:1.3;">' + content.title + '</strong>' +
            '<ol style="margin:0;padding-left:18px;font-size:12px;line-height:1.5;color:#cbd5e1;"><li>' + content.steps[0] + '</li><li>' + content.steps[1] + '</li><li>' + content.steps[2] + '</li></ol>';
    }

    function initContextualDemoGuide() {
        updateDemoGuide(getActiveDemoView());

        document.addEventListener('click', function (e) {
            var target = e.target.closest('#sidebar button, #sidebar a, #mobile button, #mobile a');
            if (target) {
                setTimeout(function () {
                    updateDemoGuide(getActiveDemoView());
                }, 80);
            }
        });
    }

    function injectDemoLayer() {
        if (!document.getElementById('plena-demo-banner')) {
            var banner = document.createElement('div');
            banner.id = 'plena-demo-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#090d16;border-bottom:1px solid rgba(14,165,233,0.35);color:#e2e8f0;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 12px rgba(0,0,0,.5);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#0284c7;"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • Lava Rápido Estrela Azul</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:#0284c7;color:#fff;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;transition:background 0.2s;">Gostei, falar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.2);background:transparent;color:#94a3b8;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar dados</button>';
            document.body.prepend(banner);
            document.body.style.paddingTop = '38px';

            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }

        if (!document.getElementById('plena-demo-guide')) {
            var guide = document.createElement('div');
            guide.id = 'plena-demo-guide';
            guide.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:999998;max-width:300px;background:rgba(11,15,25,.96);color:#e5e7eb;border:1px solid rgba(14,165,233,.4);border-radius:14px;padding:14px 16px;box-shadow:0 14px 40px rgba(0,0,0,.45);font-family:Inter,system-ui,sans-serif;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);';
            document.body.appendChild(guide);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        seedLavarapidoData();
        injectDemoLayer();
        setTimeout(function () {
            initContextualDemoGuide();
        }, 150);
    });
})();
