/**
 * demo-bypass.js — Plena MicroSaaS • Gestão PDV Pro
 * Desbloqueia o app em modo demonstração e adiciona a camada comercial guiada.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Gestão PDV Pro';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Gestão PDV Pro. Gostaria de saber mais sobre a licença vitalícia e implantação.';
    var DB_KEY = 'gestao_pdv_v1';

    // 1. Assegurar credenciais no localStorage síncrono
    try {
        localStorage.setItem('pdv_license', 'DEMO-PLENA-VITALICIA');
        localStorage.setItem('pdv_email', 'demo@plenainformatica.com.br');
        localStorage.setItem('pdv_receipt_confirmed', 'true');
        localStorage.setItem('pdv_last_verified_at', String(Date.now()));
    } catch (e) {}

    // 2. Semeadura de dados no banco local
    function seedPdvData() {
        if (!window.PDV_DEMO_SEED) return;
        var existing = null;
        try {
            existing = localStorage.getItem(DB_KEY);
        } catch (e) {}

        if (!existing || existing === '{}' || existing === 'null') {
            try {
                localStorage.setItem(DB_KEY, JSON.stringify(window.PDV_DEMO_SEED));
            } catch (e) {}
        }
    }

    seedPdvData();

    var DEMO_GUIDES = {
        pdv: {
            label: 'Frente de Caixa (PDV)',
            title: 'Agilidade máxima no caixa',
            steps: [
                'Passe o leitor de código de barras ou busque o item pelo nome/código.',
                'Use atalhos rápidos do teclado (F2, F4, F8) para concluir o cupom.',
                'Receba em dinheiro com cálculo de troco, PIX com QR Code ou cartão.'
            ]
        },
        dashboard: {
            label: 'Painel Geral',
            title: 'Visão consolidada do negócio',
            steps: [
                'Acompanhe o faturamento do dia, vendas realizadas e ticket médio.',
                'Veja os produtos mais vendidos e alertas de estoque baixo.',
                'Monitore o saldo em caixa e a movimentação financeira diária.'
            ]
        },
        inventory: {
            label: 'Estoque & Produtos',
            title: 'Controle de saldo e reposição',
            steps: [
                'Cadastre produtos com código EAN-13, preço de custo, margem e estoque mínimo.',
                'Itens com estoque no limite são destacados em amarelo ou vermelho.',
                'Dê entrada em novas compras e registre perdas com justificativa.'
            ]
        },
        cash: {
            label: 'Controle de Caixa',
            title: 'Abertura, sangrias e fechamento',
            steps: [
                'Abra o caixa informando o fundo de troco da gaveta.',
                'Registre sangrias para depósito com comprovante emitido.',
                'Feche o turno com conferência cega e comparação de valores.'
            ]
        },
        customers: {
            label: 'Clientes & Crediário (Fiado)',
            title: 'Gestão de contas e caderneta',
            steps: [
                'Defina o limite máximo de crédito na caderneta por cliente.',
                'Venda na opção "Fiado" e o saldo devedor é atualizado na hora.',
                'Dê baixa em pagamentos parciais ou totais com recibo.'
            ]
        },
        reports: {
            label: 'Relatórios Financeiros',
            title: 'DRE e lucratividade real',
            steps: [
                'Consulte o faturamento por período, margem de contribuição e despesas.',
                'Analise o lucro líquido real descontando o custo das mercadorias vendidas.',
                'Exporte os relatórios em Excel/CSV em apenas 1 clique.'
            ]
        }
    };

    function openWhatsApp() {
        window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Deseja resetar as alterações e recarregar os dados do Mercado & Empório Central?')) return;
        try {
            localStorage.removeItem(DB_KEY);
        } catch (e) {}
        location.reload();
    }

    function getActiveDemoView() {
        var activeTab = document.querySelector('#sidebar button.active, #sidebar a.active, .nav-item.active');
        if (activeTab) {
            var text = activeTab.textContent.trim().toLowerCase();
            if (text.includes('pdv') || text.includes('caixa')) return 'pdv';
            if (text.includes('estoque') || text.includes('produto')) return 'inventory';
            if (text.includes('cliente') || text.includes('fiado')) return 'customers';
            if (text.includes('relat') || text.includes('financeiro')) return 'reports';
        }
        return 'pdv';
    }

    function updateDemoGuide(view) {
        var guide = document.getElementById('plena-demo-guide');
        if (!guide) return;

        var content = DEMO_GUIDES[view] || DEMO_GUIDES.pdv;
        guide.innerHTML = '<button type="button" aria-label="Fechar guia rápido" style="position:absolute;top:8px;right:10px;background:transparent;border:0;color:#94a3b8;font-size:18px;cursor:pointer;line-height:1;" onclick="this.parentElement.remove()">×</button>' +
            '<span style="display:block;margin-bottom:4px;color:#10b981;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;">' + content.label + '</span>' +
            '<strong style="display:block;color:#fff;margin-bottom:8px;font-size:13px;line-height:1.3;">' + content.title + '</strong>' +
            '<ol style="margin:0;padding-left:18px;font-size:12px;line-height:1.5;color:#cbd5e1;"><li>' + content.steps[0] + '</li><li>' + content.steps[1] + '</li><li>' + content.steps[2] + '</li></ol>';
    }

    function initContextualDemoGuide() {
        updateDemoGuide(getActiveDemoView());
        document.addEventListener('click', function (e) {
            var target = e.target.closest('#sidebar button, #sidebar a, nav button, nav a');
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
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#061412;border-bottom:1px solid rgba(16,185,129,0.35);color:#e2e8f0;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 12px rgba(0,0,0,.5);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#10b981;"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • Mercado & Empório Central</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:#10b981;color:#041f1a;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;transition:background 0.2s;">Gostei, falar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.2);background:transparent;color:#94a3b8;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar dados</button>';
            document.body.prepend(banner);
            document.body.style.paddingTop = '38px';

            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }

        if (!document.getElementById('plena-demo-guide')) {
            var guide = document.createElement('div');
            guide.id = 'plena-demo-guide';
            guide.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:999998;max-width:300px;background:rgba(6,20,18,.96);color:#e5e7eb;border:1px solid rgba(16,185,129,.4);border-radius:14px;padding:14px 16px;box-shadow:0 14px 40px rgba(0,0,0,.45);font-family:Inter,system-ui,sans-serif;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);';
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
        seedPdvData();
        injectDemoLayer();
        setTimeout(function () {
            initContextualDemoGuide();
        }, 150);
    });
})();
