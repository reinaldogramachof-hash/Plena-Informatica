/**
 * demo-bypass.js — Plena MicroSaaS • Gestão Sorveteria & Açaí Pro
 * Desbloqueia o app em modo demonstração e adiciona a camada comercial guiada.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Gestão Sorveteria & Açaí';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Gestão Sorveteria. Gostaria de saber mais sobre a licença vitalícia e implantação.';
    var DB_KEY = 'gestao_sorveteria_v1';

    // 1. Assegurar credenciais no localStorage síncrono
    try {
        localStorage.setItem('sorveteria_license', 'DEMO-PLENA-VITALICIA');
        localStorage.setItem('sorveteria_email', 'demo@plenainformatica.com.br');
        localStorage.setItem('sorveteria_master_mode', 'true');
        localStorage.setItem('sorveteria_receipt_confirmed', 'true');
        localStorage.setItem('freezer_reminder_dismissed', String(Date.now()));
        sessionStorage.removeItem('sorveteria_demo');
    } catch (e) {}

    // 2. Semeadura de dados no banco local
    function seedSorveteriaData() {
        if (!window.SORVETERIA_DEMO_SEED) return;
        var existing = null;
        try {
            existing = localStorage.getItem(DB_KEY);
        } catch (e) {}

        if (!existing || existing === '{}' || existing === 'null') {
            try {
                localStorage.setItem(DB_KEY, JSON.stringify(window.SORVETERIA_DEMO_SEED));
            } catch (e) {}
        }
    }

    seedSorveteriaData();

    var DEMO_GUIDES = {
        dashboard: {
            label: 'Visão Geral',
            title: 'Resumo operacional do dia',
            steps: [
                'Acompanhe o faturamento em tempo real, ticket médio e volume vendido.',
                'Veja o alerta de freezers e a produção em andamento do dia.',
                'Monitore os produtos mais consumidos para repor a vitrine a tempo.'
            ]
        },
        pdv: {
            label: 'Frente de Caixa (PDV)',
            title: 'Vendas rápidas e pesagem por tara',
            steps: [
                'Selecione o tamanho do pote ou casquinha e informe o peso com desconto automático da tara.',
                'Adicione complementos e caldas em 1 clique.',
                'Conclua a venda em dinheiro, PIX ou cartão com impressão instantânea de cupom.'
            ]
        },
        inventory: {
            label: 'Estoque de Insumos',
            title: 'Bases, frutas e embalagens',
            steps: [
                'Controle litros de leite, quilos de polpa, morangos e copinhos disponíveis.',
                'Veja os itens em nível crítico destacados em vermelho para reposição.',
                'Dê entrada em notas ou registre perdas controladas com histórico.'
            ]
        },
        production: {
            label: 'Lotes de Produção',
            title: 'Receitas e bateladas de sorvete',
            steps: [
                'Cadastre as receitas padrão com rendimento em litros e insumos necessários.',
                'Abra ordens de produção e dê baixa automática dos ingredientes do estoque.',
                'Controle o status de cada sabor: Pendente, Produzindo ou Pronto para vitrine.'
            ]
        },
        temperature: {
            label: 'Controle de Freezers',
            title: 'Monitoramento térmico e ANVISA',
            steps: [
                'Registre as medições de temperatura dos freezers de atendimento e câmara fria.',
                'Receba alertas visuais caso a temperatura suba acima do limite seguro (-12°C).',
                'Mantenha o histórico diário em conformidade com as exigências sanitárias.'
            ]
        },
        reports: {
            label: 'Relatórios Financeiros',
            title: 'DRE, vendas por período e ticket médio',
            steps: [
                'Analise o lucro bruto, faturamento por forma de pagamento e custos de produção.',
                'Filtre as vendas por dia, semana ou mês com gráficos comparativos.',
                'Exporte os relatórios em CSV para o seu contador em segundos.'
            ]
        }
    };

    function openWhatsApp() {
        window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Deseja resetar as alterações e recarregar os dados da Sorveteria Aurora Gelato?')) return;
        try {
            localStorage.removeItem(DB_KEY);
        } catch (e) {}
        location.reload();
    }

    function getActiveDemoView() {
        var hash = (location.hash || '').replace('#', '').trim().toLowerCase();
        if (hash.includes('pdv')) return 'pdv';
        if (hash.includes('inventory') || hash.includes('estoque')) return 'inventory';
        if (hash.includes('production') || hash.includes('producao')) return 'production';
        if (hash.includes('temp') || hash.includes('freezer')) return 'temperature';
        if (hash.includes('report') || hash.includes('relat')) return 'reports';
        return 'dashboard';
    }

    function updateDemoGuide(view) {
        var guide = document.getElementById('plena-demo-guide');
        if (!guide) return;

        var content = DEMO_GUIDES[view] || DEMO_GUIDES.dashboard;
        guide.innerHTML = '<button type="button" aria-label="Fechar guia rápido" style="position:absolute;top:8px;right:10px;background:transparent;border:0;color:#94a3b8;font-size:18px;cursor:pointer;line-height:1;" onclick="this.parentElement.remove()">×</button>' +
            '<span style="display:block;margin-bottom:4px;color:#f43f5e;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;">' + content.label + '</span>' +
            '<strong style="display:block;color:#fff;margin-bottom:8px;font-size:13px;line-height:1.3;">' + content.title + '</strong>' +
            '<ol style="margin:0;padding-left:18px;font-size:12px;line-height:1.5;color:#cbd5e1;"><li>' + content.steps[0] + '</li><li>' + content.steps[1] + '</li><li>' + content.steps[2] + '</li></ol>';
    }

    function initContextualDemoGuide() {
        updateDemoGuide(getActiveDemoView());
        window.addEventListener('hashchange', function () {
            setTimeout(function () {
                updateDemoGuide(getActiveDemoView());
            }, 80);
        });
    }

    function injectDemoLayer() {
        if (!document.getElementById('plena-demo-banner')) {
            var banner = document.createElement('div');
            banner.id = 'plena-demo-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#0f172a;border-bottom:1px solid rgba(244,63,94,0.35);color:#e2e8f0;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 12px rgba(0,0,0,.5);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#f43f5e;"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • Aurora Gelato</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:#f43f5e;color:#fff;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;transition:background 0.2s;">Gostei, falar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.2);background:transparent;color:#94a3b8;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar dados</button>';
            document.body.prepend(banner);
            document.body.style.paddingTop = '38px';

            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }

        if (!document.getElementById('plena-demo-guide')) {
            var guide = document.createElement('div');
            guide.id = 'plena-demo-guide';
            guide.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:999998;max-width:300px;background:rgba(15,23,42,.96);color:#e5e7eb;border:1px solid rgba(244,63,94,.4);border-radius:14px;padding:14px 16px;box-shadow:0 14px 40px rgba(0,0,0,.45);font-family:Inter,system-ui,sans-serif;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);';
            document.body.appendChild(guide);
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
        seedSorveteriaData();
        injectDemoLayer();
        setTimeout(function () {
            initContextualDemoGuide();
        }, 150);
    });
})();

