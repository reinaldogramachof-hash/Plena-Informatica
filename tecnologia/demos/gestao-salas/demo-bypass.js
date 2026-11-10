/**
 * demo-bypass.js — Plena MicroSaaS • Gestão Salas Pro
 * Desbloqueia o app em modo demonstração e adiciona a camada comercial guiada.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Gestão Salas Pro';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Gestão Salas Pro. Gostaria de saber mais sobre a licença vitalícia e implantação.';
    var DB_KEY = 'gestao_salas_v1';

    // 1. Assegurar credenciais no localStorage síncrono
    try {
        localStorage.setItem('salas_license', 'DEMO-PLENA-VITALICIA');
        localStorage.setItem('salas_email', 'demo@plenainformatica.com.br');
        localStorage.setItem('salas_receipt_confirmed', 'true');
        localStorage.setItem('salas_last_verified_at', String(Date.now()));
    } catch (e) {}

    var DEMO_GUIDES = {
        agenda: {
            label: 'Agenda Simultânea',
            title: 'Ocupação de salas e turnos',
            steps: [
                'Visualize as reservas por hora, turno ou dia inteiro sem sobreposição.',
                'Clique em qualquer espaço vazio para agendar uma nova locação.',
                'Acompanhe o status: Reservada, Confirmada, Em Uso ou Concluída.'
            ]
        },
        salas: {
            label: 'Espaços & Auditórios',
            title: 'Salas, capacidades e tarifas',
            steps: [
                'Cadastre salas de reunião, consultórios, auditórios e estúdios.',
                'Defina o valor por hora e por diária de cada espaço.',
                'Configure o checklist padrão de itens para a vistoria de entrada e saída.'
            ]
        },
        locatarios: {
            label: 'Locatários & Clientes',
            title: 'Profissionais e empresas parceiras',
            steps: [
                'Mantenha o cadastro completo de advogados, médicos, terapeutas e instrutores.',
                'Acesse o histórico de todas as locações já realizadas por cliente.',
                'Dispare mensagens diretas pelo WhatsApp com lembretes da reserva.'
            ]
        },
        vistorias: {
            label: 'Vistorias & Check-in',
            title: 'Termo de entrega e QR Code',
            steps: [
                'Gere o termo de vistoria de entrada com fotos e itens conferidos.',
                'Envie o link ou QR Code para assinatura digital pelo celular do locatário.',
                'Previna disputas sobre danos em ar-condicionado, projetor ou móveis.'
            ]
        },
        financeiro: {
            label: 'Financeiro & Depósitos',
            title: 'Sinal, saldo e taxas de limpeza',
            steps: [
                'Controle o recebimento do sinal (50% na reserva) e o saldo na entrega da chave.',
                'Registre taxas extras de limpeza, horas adicionais ou quebras.',
                'Acompanhe o faturamento líquido mensal e o ticket médio por sala.'
            ]
        }
    };

    function openWhatsApp() {
        window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Deseja resetar as alterações e recarregar os dados do Espaço Plena Coworking & Salas?')) return;
        try {
            localStorage.removeItem(DB_KEY);
        } catch (e) {}
        location.reload();
    }

    function getActiveDemoView() {
        var activeTab = document.querySelector('#sidebar button.active, #sidebar a.active, .nav-item.active, [data-tab].active');
        if (activeTab) {
            var text = activeTab.textContent.trim().toLowerCase();
            if (text.includes('agenda') || text.includes('calendario')) return 'agenda';
            if (text.includes('sala') || text.includes('espaço')) return 'salas';
            if (text.includes('locatário') || text.includes('cliente')) return 'locatarios';
            if (text.includes('vistoria') || text.includes('check')) return 'vistorias';
            if (text.includes('financ') || text.includes('receita')) return 'financeiro';
        }
        return 'agenda';
    }

    function updateDemoGuide(view) {
        var guide = document.getElementById('plena-demo-guide');
        if (!guide) return;

        var content = DEMO_GUIDES[view] || DEMO_GUIDES.agenda;
        guide.innerHTML = '<button type="button" aria-label="Fechar guia rápido" style="position:absolute;top:8px;right:10px;background:transparent;border:0;color:#94a3b8;font-size:18px;cursor:pointer;line-height:1;" onclick="this.parentElement.remove()">×</button>' +
            '<span style="display:block;margin-bottom:4px;color:#818cf8;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;">' + content.label + '</span>' +
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
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#0c1020;border-bottom:1px solid rgba(99,102,241,0.35);color:#e2e8f0;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 12px rgba(0,0,0,.5);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#6366f1;"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • Espaço Plena Coworking</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:#6366f1;color:#fff;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;transition:background 0.2s;">Gostei, falar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.2);background:transparent;color:#94a3b8;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar dados</button>';
            document.body.prepend(banner);
            document.body.style.paddingTop = '38px';

            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }

        if (!document.getElementById('plena-demo-guide')) {
            var guide = document.createElement('div');
            guide.id = 'plena-demo-guide';
            guide.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:999998;max-width:300px;background:rgba(12,16,32,.96);color:#e5e7eb;border:1px solid rgba(99,102,241,.4);border-radius:14px;padding:14px 16px;box-shadow:0 14px 40px rgba(0,0,0,.45);font-family:Inter,system-ui,sans-serif;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);';
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
        injectDemoLayer();
        setTimeout(function () {
            initContextualDemoGuide();
        }, 150);
    });
})();
