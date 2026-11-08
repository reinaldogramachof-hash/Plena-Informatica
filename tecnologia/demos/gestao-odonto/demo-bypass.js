/**
 * demo-bypass.js — Plena MicroSaaS • Gestão Odonto
 * Desbloqueia o app em modo demonstração e adiciona a camada comercial guiada.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Gestão Odonto';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Gestão Odonto Pro. Gostaria de saber mais sobre a licença vitalícia e implantação.';
    var DB_KEY = 'gestao_odonto_v1';

    var DEMO_GUIDES = {
        dashboard: {
            label: 'Visão Geral',
            title: 'Rotina do consultório hoje',
            steps: [
                'Confira os atendimentos do dia com horários, pacientes e procedimentos.',
                'Veja os KPIs clínicos: pacientes ativos, tratamentos em curso e estoque.',
                'Acesse atalhos rápidos para novo agendamento, paciente ou orçamento.'
            ]
        },
        schedule: {
            label: 'Agenda de Cadeira',
            title: 'Gestão de horários e procedimentos',
            steps: [
                'Visualize os intervalos de consulta por tempo de cadeira (30 a 60 min).',
                'Status visual com diferenciação entre confirmado, agendado e concluído.',
                'Clique em qualquer horário para editar ou iniciar o atendimento.'
            ]
        },
        patients: {
            label: 'Prontuários',
            title: 'Ficha clínica do paciente',
            steps: [
                'Consulte o histórico completo, anamnese, alertas médicos e contatos.',
                'Atenção aos alertas de saúde (ex: alergia a anestésicos, hipertensão).',
                'Separação por modalidade: particular, convênio ou mensalidade ortodôntica.'
            ]
        },
        'patient-details': {
            label: 'Prontuário Detalhado',
            title: 'Linha do tempo do paciente',
            steps: [
                'Veja evolução clínica por consulta e histórico de dentes tratados.',
                'Acesse os tratamentos vinculados e orçamentos em aprovação.',
                'Imprima a ficha cadastral limpa sem expor notas internas.'
            ]
        },
        treatments: {
            label: 'Tratamentos & Orçamentos',
            title: 'O coração da venda clínica',
            steps: [
                'Estruture planos de tratamento por dente ou arcada com valor total.',
                'Controle de status: em avaliação, ativo ou concluído.',
                'Histórico de sessões executadas com detalhamento técnico.'
            ]
        },
        financial: {
            label: 'Financeiro Clínico',
            title: 'Fluxo de caixa e parcelamentos',
            steps: [
                'Acompanhe receitas de procedimentos e mensalidades ortodônticas.',
                'Controle de despesas com laboratório de prótese dental e insumos.',
                'Aba de débitos/inadimplência para cobranças éticas e organizadas.'
            ]
        },
        stock: {
            label: 'Estoque de Insumos',
            title: 'Materiais odontológicos sob controle',
            steps: [
                'Controle de resinas, anestésicos, luvas e descartáveis.',
                'Alertas automáticos de estoque mínimo para não faltar na cadeira.',
                'Controle de lote e data de validade para conformidade com a Anvisa.'
            ]
        },
        reports: {
            label: 'Relatórios & DRE',
            title: 'Indicadores de produtividade',
            steps: [
                'Consulte o demonstrativo de resultado (receitas vs despesas).',
                'Gráficos de faturamento mensal e procedimentos mais executados.',
                'Exportação em PDF formatado para arquivamento ou contador.'
            ]
        },
        settings: {
            label: 'Configurações',
            title: 'Identidade da clínica',
            steps: [
                'Personalize nome da clínica, CRO do dentista e dados de cabeçalho.',
                'Ajuste horários de expediente e tempo padrão de consulta.',
                'Dados 100% locais no navegador, com exportação de backup.'
            ]
        },
        manual: {
            label: 'Manual de Uso',
            title: 'Guia passo a passo',
            steps: [
                'Consulte tutoriais rápidos sobre cada rotina do consultório.',
                'Dicas de fluxo para recepção e atendimento clínico.',
                'Retorne à tela desejada a qualquer momento pelo menu lateral.'
            ]
        },
        about: {
            label: 'Sobre a Licença',
            title: 'Licença vitalícia Plena',
            steps: [
                'Software local vitalício, sem mensalidade obrigatória.',
                'Dados 100% sob seu controle no seu computador.',
                'Fale com a Plena no WhatsApp para tirar dúvidas e adquirir.'
            ]
        }
    };

    window.PLENA_DEMO_WHATSAPP = WHATSAPP_PHONE;

    // 1. Assegurar credenciais de bypass para contornar o lock.js
    localStorage.setItem('odonto_master_mode', 'true');
    localStorage.setItem('odonto_license', 'DEMO-PLENA-ODONTO-2026');
    localStorage.setItem('odonto_email', 'demo@plenainformatica.com.br');
    localStorage.setItem('odonto_receipt_confirmed', 'true');
    localStorage.setItem('odonto_owner_name', 'Dr. Lucas Silveira');
    localStorage.setItem('odonto_owner_doc', 'CRO-SP 108.432');

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
        if (!seed || !seed.appointments) return seed;
        try {
            var now = new Date();
            var todayStr = now.toISOString().slice(0, 10);
            var refStr = '2026-11-08';
            var refDate = new Date(refStr + 'T12:00:00');
            var nowDate = new Date(todayStr + 'T12:00:00');
            var diffMs = nowDate.getTime() - refDate.getTime();
            var diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return seed;

            function shiftDateStr(dateStr) {
                if (!dateStr || typeof dateStr !== 'string') return dateStr;
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                    var d = new Date(dateStr + 'T12:00:00');
                    d.setDate(d.getDate() + diffDays);
                    return d.toISOString().slice(0, 10);
                }
                if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
                    var dt = new Date(dateStr);
                    if (isNaN(dt.getTime())) return dateStr;
                    dt.setDate(dt.getDate() + diffDays);
                    return dt.toISOString();
                }
                return dateStr;
            }

            if (Array.isArray(seed.appointments)) {
                seed.appointments.forEach(function (apt) {
                    if (apt.date) apt.date = shiftDateStr(apt.date);
                    if (apt.createdAt) apt.createdAt = shiftDateStr(apt.createdAt);
                });
            }

            if (Array.isArray(seed.financial)) {
                seed.financial.forEach(function (f) {
                    if (f.date) f.date = shiftDateStr(f.date);
                    if (f.paidAt) f.paidAt = shiftDateStr(f.paidAt);
                });
            }

            if (Array.isArray(seed.treatments)) {
                seed.treatments.forEach(function (t) {
                    if (t.createdAt) t.createdAt = shiftDateStr(t.createdAt);
                    if (Array.isArray(t.sessionsHistory)) {
                        t.sessionsHistory.forEach(function (sh) {
                            if (sh.date) sh.date = shiftDateStr(sh.date);
                        });
                    }
                });
            }
        } catch (err) {
            console.warn('Erro ao ajustar datas relativas da demo odonto:', err);
        }
        return seed;
    }

    // 2. Prepara os dados da demonstração no localStorage
    function seedOdontoData() {
        var existing = null;
        try {
            var raw = localStorage.getItem(DB_KEY);
            if (raw) existing = JSON.parse(raw);
        } catch (e) { existing = null; }

        var isPopulated = existing && Array.isArray(existing.patients) && existing.patients.length > 0;
        if (!isPopulated && window.ODONTO_DEMO_SEED) {
            var seed = adjustSeedDates(JSON.parse(JSON.stringify(window.ODONTO_DEMO_SEED)));
            localStorage.setItem(DB_KEY, JSON.stringify(seed));
            if (typeof db !== 'undefined') {
                for (var k in seed) {
                    db[k] = seed[k];
                }
            }
        }
    }

    seedOdontoData();

    function unlockUI() {
        var login = document.getElementById('view-login');
        if (login) {
            login.style.display = 'none';
            login.classList.add('hide');
        }

        var receiptModal = document.getElementById('welcome-receipt-modal');
        if (receiptModal) {
            receiptModal.classList.add('hidden');
        }

        var sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.style.display = '';
            sidebar.classList.remove('hide', 'hidden');
        }

        var main = document.querySelector('main');
        if (main) {
            main.style.display = '';
            main.classList.remove('hide', 'hidden');
        }

        var header = document.querySelector('header');
        if (header) {
            header.style.display = '';
            header.classList.remove('hide', 'hidden');
        }
    }

    function openWhatsApp() {
        window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Deseja resetar as alterações e recarregar os dados da Clínica OdontoPlena?')) return;
        try {
            localStorage.removeItem(DB_KEY);
        } catch (e) {}
        location.reload();
    }

    function getActiveDemoView() {
        var active = document.querySelector('.view-section:not(.hide)');
        if (!active || !active.id) return 'dashboard';
        return active.id.replace('view-', '');
    }

    function updateDemoGuide(view) {
        var guide = document.getElementById('plena-demo-guide');
        if (!guide) return;

        var content = DEMO_GUIDES[view] || DEMO_GUIDES.dashboard;
        guide.innerHTML = '<button type="button" aria-label="Fechar guia rápido" style="position:absolute;top:8px;right:10px;background:transparent;border:0;color:#94a3b8;font-size:18px;cursor:pointer;line-height:1;" onclick="this.parentElement.remove()">×</button>' +
            '<span style="display:block;margin-bottom:4px;color:#67e8f9;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;">' + content.label + '</span>' +
            '<strong style="display:block;color:#fff;margin-bottom:8px;font-size:13px;line-height:1.3;">' + content.title + '</strong>' +
            '<ol style="margin:0;padding-left:18px;font-size:12px;line-height:1.5;color:#cbd5e1;"><li>' + content.steps[0] + '</li><li>' + content.steps[1] + '</li><li>' + content.steps[2] + '</li></ol>';
    }

    function initContextualDemoGuide() {
        updateDemoGuide(getActiveDemoView());

        if (typeof window.router === 'function' && !window.router.plenaDemoHook) {
            var origRouter = window.router;
            var wrappedRouter = function (view) {
                var res = origRouter.apply(this, arguments);
                setTimeout(function () {
                    updateDemoGuide(view);
                }, 50);
                return res;
            };
            wrappedRouter.plenaDemoHook = true;
            window.router = wrappedRouter;
        }
    }

    function injectDemoLayer() {
        if (!document.getElementById('plena-demo-banner')) {
            var banner = document.createElement('div');
            banner.id = 'plena-demo-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#090d16;border-bottom:1px solid rgba(8,145,178,0.35);color:#e2e8f0;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 12px rgba(0,0,0,.5);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#06b6d4;"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • Clínica OdontoPlena (Dr. Lucas Silveira)</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:#0891b2;color:#fff;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;transition:background 0.2s;">Gostei, falar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.2);background:transparent;color:#94a3b8;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar dados</button>';
            document.body.prepend(banner);
            document.body.style.paddingTop = '38px';

            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }

        if (!document.getElementById('plena-demo-guide')) {
            var guide = document.createElement('div');
            guide.id = 'plena-demo-guide';
            guide.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:999998;max-width:300px;background:rgba(11,15,25,.96);color:#e5e7eb;border:1px solid rgba(8,145,178,.4);border-radius:14px;padding:14px 16px;box-shadow:0 14px 40px rgba(0,0,0,.45);font-family:Inter,system-ui,sans-serif;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);';
            document.body.appendChild(guide);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        seedOdontoData();
        unlockUI();
        injectDemoLayer();
        setTimeout(function () {
            initContextualDemoGuide();
            unlockUI();
            if (typeof renderDashboard === 'function') {
                renderDashboard();
            }
        }, 150);
    });

    window.addEventListener('load', function () {
        unlockUI();
    });
})();

