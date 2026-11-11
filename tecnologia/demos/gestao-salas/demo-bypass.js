/**
 * demo-bypass.js — Plena MicroSaaS • Gestão Salas Pro
 * Desbloqueia o app em modo demonstração e adiciona a camada comercial guiada.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Gestão Salas Pro';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Gestão Salas Pro. Gostaria de saber mais sobre a licença vitalícia.';
    var DB_KEY = 'gestao_salas_v1';
    var DEMO_THEME_SESSION_KEY = 'salas_demo_theme_session';

    // 1. Assegurar credenciais no localStorage e aparência inicial clara da vitrine
    try {
        localStorage.setItem('salas_license', 'DEMO-PLENA-VITALICIA');
        localStorage.setItem('salas_email', 'demo@plenainformatica.com.br');
        localStorage.setItem('salas_receipt_confirmed', 'true');
        localStorage.setItem('salas_last_verified_at', String(Date.now()));
        if (!sessionStorage.getItem(DEMO_THEME_SESSION_KEY)) {
            localStorage.setItem('salas_theme_preference', 'light');
        }
    } catch (e) {}

    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); }, true);

    var DEMO_GUIDES = {
        dashboard: {
            label: 'Visão geral',
            title: 'Ocupação do espaço hoje',
            steps: [
                'Confira as reservas do dia, horas alocadas e valores a receber.',
                'Veja a taxa de ocupação da semana e sinais pendentes.',
                'Use os atalhos no topo para abrir salas e novas reservas.'
            ]
        },
        agenda: {
            label: 'Agenda Simultânea',
            title: 'Ocupação de salas e turnos',
            steps: [
                'Alterne entre Lista e Grade para ver todas as salas lado a lado.',
                'Observe os bloqueios automáticos que evitam choque de horários.',
                'Clique em qualquer reserva para conferir detalhes, sinal e vistoria.'
            ]
        },
        salas: {
            label: 'Espaços & Auditórios',
            title: 'Salas, capacidades e tarifas',
            steps: [
                'Cadastre salas de reunião, consultórios, auditórios e estúdios.',
                'Defina o valor por hora, por diária e os itens padrão de vistoria.',
                'Ative ou pause espaços sem perder o histórico de reservas.'
            ]
        },
        locatarios: {
            label: 'Locatários & Clientes',
            title: 'Profissionais e empresas parceiras',
            steps: [
                'Mantenha o cadastro completo de médicos, advogados e instrutores.',
                'Consulte o histórico de locações e o saldo pendente por cliente.',
                'Abra os detalhes do locatário com acesso rápido pelo telefone.'
            ]
        },
        vistorias: {
            label: 'Vistoria & QR Code',
            title: 'Termo de entrega e devolução',
            steps: [
                'Confira o checklist de entrada registrado com data e responsável.',
                'Gere o QR Code para o locatário assinar a vistoria no próprio celular.',
                'Registre eventuais ressalvas na devolução ligadas à reserva.'
            ]
        },
        financeiro: {
            label: 'Financeiro & Caixa',
            title: 'Sinal, saldo e prestações',
            steps: [
                'Acompanhe sinais recebidos (50%), saldos pendentes e volume do mês.',
                'Registre lançamentos manuais ou baixe os relatórios em CSV.',
                'Filtre por período ou categoria com transparência de caixa.'
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
            sessionStorage.removeItem(DEMO_THEME_SESSION_KEY);
        } catch (e) {}
        location.reload();
    }

    function enrichDemoChecklists() {
        try {
            var raw = localStorage.getItem(DB_KEY);
            if (!raw) return;
            var parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.bookings)) return;
            var changed = false;
            var bk1 = parsed.bookings.find(function (b) { return b.id === 'bk_001'; });
            if (bk1 && (!bk1.checklist || !bk1.checklist.checkin)) {
                bk1.checklist = bk1.checklist || { checkin: null, checkout: null };
                bk1.checklist.checkin = {
                    by: 'Recepção · Entrada conferida',
                    at: new Date().toISOString(),
                    items: [
                        { text: 'Mobiliário e cadeiras', ok: true, note: '' },
                        { text: 'Ar-condicionado', ok: true, note: '' },
                        { text: 'TV/Projetor e equipamentos', ok: true, note: '' },
                        { text: 'Limpeza geral', ok: true, note: '' },
                        { text: 'Sem danos aparentes', ok: true, note: '' }
                    ]
                };
                changed = true;
            }
            var bk4 = parsed.bookings.find(function (b) { return b.id === 'bk_004'; });
            if (bk4 && (!bk4.checklist || !bk4.checklist.checkin)) {
                bk4.checklist = {
                    checkin: {
                        by: 'Recepção',
                        at: new Date(Date.now() - 86400000).toISOString(),
                        items: [
                            { text: 'Mobiliário e cadeiras', ok: true, note: '' },
                            { text: 'Ar-condicionado', ok: true, note: '' },
                            { text: 'Limpeza geral', ok: true, note: '' }
                        ]
                    },
                    checkout: {
                        by: 'Fernanda Lima (Vistoria Mobile QR)',
                        at: new Date(Date.now() - 72000000).toISOString(),
                        items: [
                            { text: 'Mobiliário e cadeiras', ok: true, note: '' },
                            { text: 'Ar-condicionado', ok: true, note: '' },
                            { text: 'Limpeza geral', ok: true, note: 'Sala devolvida em ordem' }
                        ]
                    }
                };
                changed = true;
            }
            if (changed) localStorage.setItem(DB_KEY, JSON.stringify(parsed));
        } catch (e) {}
    }

    function getActiveDemoView() {
        var detailModal = document.getElementById('modal-booking-detail');
        if (detailModal && !detailModal.classList.contains('hidden')) return 'vistorias';
        var activeTab = document.querySelector('#sidebar button.active-nav, .nav-item.active-nav');
        if (activeTab) {
            var id = activeTab.id || '';
            if (id === 'nav-bookings') return 'agenda';
            if (id === 'nav-rooms') return 'salas';
            if (id === 'nav-tenants') return 'locatarios';
            if (id === 'nav-finances' || id === 'nav-reports') return 'financeiro';
        }
        return 'dashboard';
    }

    function updateDemoGuide(view) {
        var guide = document.getElementById('plena-demo-guide');
        if (!guide) return;

        var content = DEMO_GUIDES[view] || DEMO_GUIDES.dashboard;
        guide.innerHTML = '<button type="button" aria-label="Fechar guia rápido" style="position:absolute;top:8px;right:10px;background:transparent;border:0;color:var(--color-muted);font-size:18px;cursor:pointer;line-height:1;" onclick="this.parentElement.remove()">×</button>' +
            '<span style="display:block;margin-bottom:4px;color:var(--color-accent);font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;">' + content.label + '</span>' +
            '<strong style="display:block;color:var(--color-text);margin-bottom:8px;font-size:13px;line-height:1.3;">' + content.title + '</strong>' +
            '<ol style="margin:0;padding-left:18px;font-size:12px;line-height:1.5;color:var(--color-muted);"><li>' + content.steps[0] + '</li><li>' + content.steps[1] + '</li><li>' + content.steps[2] + '</li></ol>';
    }

    function initContextualDemoGuide() {
        updateDemoGuide(getActiveDemoView());
        document.addEventListener('click', function (e) {
            var target = e.target.closest('#sidebar button, nav button, #modal-booking-detail button');
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
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:var(--color-surface);border-bottom:1px solid var(--color-border);color:var(--color-text);display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 12px rgba(0,0,0,.06);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:var(--color-accent);"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • Espaço Plena Coworking</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:var(--color-accent);color:#fff;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;">Gostei, falar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid var(--color-border);background:transparent;color:var(--color-muted);border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar dados</button>';
            document.body.prepend(banner);
            var h = banner.getBoundingClientRect().height || 38;
            document.body.style.paddingTop = h + 'px';
            var sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.style.top = h + 'px';
            var appHeader = document.querySelector('.app-header');
            if (appHeader) appHeader.style.top = h + 'px';

            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }

        if (!document.getElementById('plena-demo-guide')) {
            var guide = document.createElement('div');
            guide.id = 'plena-demo-guide';
            guide.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:999998;max-width:300px;background:var(--color-surface);color:var(--color-text);border:1px solid var(--color-border);border-radius:14px;padding:14px 16px;box-shadow:0 14px 40px rgba(0,0,0,.12);font-family:Inter,system-ui,sans-serif;';
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
        var themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', function () {
                try { sessionStorage.setItem(DEMO_THEME_SESSION_KEY, '1'); } catch (e) {}
            });
        }
        setTimeout(function () {
            enrichDemoChecklists();
            if (typeof loadDB === 'function') {
                loadDB();
            }
            injectDemoLayer();
            if (window.SalasDemoEntry && typeof window.router === 'function') {
                window.SalasDemoEntry.open(location.search, {
                    navigate: function (view) { return window.router(view); },
                    showGrid: function () {
                        if (typeof window.switchBookingsViewMode === 'function') window.switchBookingsViewMode('grid');
                    },
                    openVistoria: function (bookingId) {
                        if (typeof window.switchBookingsViewMode === 'function') window.switchBookingsViewMode('list');
                        if (typeof window.viewBookingDetail === 'function') window.viewBookingDetail(bookingId);
                    }
                });
            }
            initContextualDemoGuide();
        }, 40);
    });
})();
