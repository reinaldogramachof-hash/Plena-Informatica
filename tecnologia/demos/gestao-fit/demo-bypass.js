/**
 * demo-bypass.js — Plena MicroSaaS • Gestão Fit
 * Desbloqueia o app em modo demonstração e adiciona a camada comercial guiada.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Gestão Fit';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Gestão Fit Pro. Gostaria de saber mais sobre a licença vitalícia e implantação.';
    var DB_KEY = 'gestao_fit_v1';

    // 1. Assegurar credenciais no localStorage síncrono
    try {
        localStorage.setItem('fit_license', 'DEMO-PLENA-VITALICIA');
        localStorage.setItem('fit_verified_license', 'DEMO-PLENA-VITALICIA');
        localStorage.setItem('fit_receipt_confirmed', 'DEMO-PLENA-VITALICIA');
        localStorage.setItem('fit_email', 'demo@plenainformatica.com.br');
        localStorage.removeItem('fit_license_blocked');
        localStorage.removeItem('fit_is_trial');
    } catch (e) {}

    window.fitLicenseReady = true;

    // 2. Interceptar FitVaultStore para que o cofre nunca exija senha na demo
    function patchFitVault() {
        if (typeof FitVaultStore === 'undefined') return;
        if (FitVaultStore._plenaPatched) return;
        FitVaultStore._plenaPatched = true;

        var origCreate = FitVaultStore.create;
        FitVaultStore.create = function (options) {
            var rawSeed = window.PLENA_DEMO_FIT_SEED || (options && options.defaults) || {};
            var currentData = JSON.parse(JSON.stringify(rawSeed));

            if (typeof FitData !== 'undefined' && typeof FitData.normalize === 'function' && options && options.defaults) {
                try {
                    currentData = FitData.normalize(currentData, options.defaults, true);
                } catch (e) {}
            }

            return {
                load: function () {
                    return { protected: true, legacy: false };
                },
                unlock: async function () {
                    return JSON.parse(JSON.stringify(currentData));
                },
                resume: async function () {
                    return JSON.parse(JSON.stringify(currentData));
                },
                save: async function (data) {
                    currentData = data;
                    if (typeof window.db !== 'undefined') window.db = data;
                    return JSON.parse(JSON.stringify(data));
                },
                prepare: function () {
                    return {};
                },
                restore: async function (preview) {
                    if (preview && preview.data) currentData = preview.data;
                    return JSON.parse(JSON.stringify(currentData));
                },
                recover: async function () {
                    return JSON.parse(JSON.stringify(currentData));
                },
                originalFromRecovery: async function () {
                    return '';
                },
                backup: async function () {
                    return JSON.stringify(currentData);
                },
                changePassword: async function () {},
                verifyPassword: async function () {
                    return true;
                },
                lock: function () {
                    if (typeof showNotification === 'function') {
                        showNotification('O bloqueio por senha está desativado no modo demonstração.', 'info');
                    }
                },
                activity: function () {},
                snapshot: function () {
                    return JSON.parse(JSON.stringify(currentData));
                },
                status: function () {
                    return { open: true, busy: false, previous: false };
                },
                previous: function () {
                    return null;
                },
                raw: function () {
                    return JSON.stringify(currentData);
                }
            };
        };
    }

    patchFitVault();

    var DEMO_GUIDES = {
        dashboard: {
            label: 'Meu Dia',
            title: 'Rotina do personal hoje',
            steps: [
                'Confira as aulas agendadas para hoje com horários, alunos e locais.',
                'Acompanhe KPIs: alunos ativos, sessões do mês e saldo financeiro.',
                'Ações rápidas para marcar aula, registrar presença ou cadastrar novo aluno.'
            ]
        },
        schedule: {
            label: 'Agenda de Treinos',
            title: 'Gestão de horários e aulas',
            steps: [
                'Visualização semanal e diária com identificação clara de horários vagos.',
                'Diferenciação por status: confirmada, agendada, concluída ou falta justificada.',
                'Clique em qualquer aula para ver detalhes ou registrar atendimento.'
            ]
        },
        assistant: {
            label: 'Assistente do Personal',
            title: 'Contatos inteligentes e lembretes',
            steps: [
                'Alertas de renovação de pacotes e vencimento de planos de alunos.',
                'Mensagens pré-formatadas para enviar pelo WhatsApp sem automações invasivas.',
                'Controle de alunos sem agendamento recente para evitar abandono de treinos.'
            ]
        },
        clients: {
            label: 'Alunos & Avaliações',
            title: 'Ficha completa do aluno',
            steps: [
                'Consulte dados pessoais, metas, restrições articulares e disponibilidade.',
                'Histórico de avaliações físicas: peso, perímetros (braço, cintura) e evolução.',
                'Acesso ao plano ativo e quantidade de sessões restantes no mês.'
            ]
        },
        training: {
            label: 'Treinos & Exercícios',
            title: 'Prescrição e biblioteca técnica',
            steps: [
                'Biblioteca completa de exercícios agrupados por grupamento muscular.',
                'Fichas de treino montadas com repetições, carga, cadência e descanso.',
                'Histórico de alterações preservado para comparar progressão de cargas.'
            ]
        },
        services: {
            label: 'Planos & Serviços',
            title: 'Configuração comercial',
            steps: [
                'Defina planos mensais (ex: 8x ou 12x por mês) ou pacotes avulsos de aulas.',
                'Configure valores por plano, duração de aula e regras de validade.',
                'Separação rigorosa entre vigência do plano e consumo real de aulas.'
            ]
        },
        finance: {
            label: 'Financeiro do Personal',
            title: 'Fluxo de caixa e despesas',
            steps: [
                'Acompanhe mensalidades recebidas via Pix, cartão ou transferência.',
                'Registre custos fixos: aluguel de estúdio, anuidade CREF e insumos.',
                'Previsão de faturamento mensal e balanço gerencial em tempo real.'
            ]
        },
        crm: {
            label: 'Relacionamento (CRM)',
            title: 'Captação e fidelização',
            steps: [
                'Acompanhe leads interessados e alunos em fase de renovação.',
                'Etapas organizadas para não esquecer contatos de retorno.',
                'Histórico de conversas e registros com respeito absoluto à LGPD.'
            ]
        },
        settings: {
            label: 'Ajustes & Cofre',
            title: 'Identidade e segurança local',
            steps: [
                'Personalize nome comercial (ex: ProFit Personal), CREF e horários de trabalho.',
                'Cofre local criptografado com senha: dados 100% no seu computador.',
                'Gere backups protegidos em 1 clique para pendrive ou nuvem privada.'
            ]
        }
    };

    function seedFitData() {
        try {
            var existing = localStorage.getItem(DB_KEY);
            if (!existing || existing === '{}' || existing === 'null') {
                if (window.PLENA_DEMO_FIT_SEED) {
                    localStorage.setItem(DB_KEY, JSON.stringify(window.PLENA_DEMO_FIT_SEED));
                }
            }
        } catch (e) {
            console.warn('[demo-bypass] Falha ao injetar seed no localStorage:', e);
        }
    }

    function unlockUI() {
        patchFitVault();

        var loginModal = document.getElementById('view-login');
        if (loginModal) {
            loginModal.classList.add('hide');
            loginModal.style.display = 'none';
        }

        var receiptModal = document.getElementById('welcome-receipt-modal');
        if (receiptModal) {
            receiptModal.classList.add('hidden');
            receiptModal.style.display = 'none';
        }

        // Remove overlay de cofre
        document.querySelectorAll('.fit-security-overlay, #fit-security-dialog').forEach(function (el) {
            el.remove();
        });

        document.body.classList.remove('fit-data-locked');
        document.body.style.overflow = '';

        var sidebar = document.getElementById('sidebar');
        var main = document.querySelector('main');
        var header = document.querySelector('header');
        if (sidebar) sidebar.style.display = '';
        if (main) main.style.display = '';
        if (header) header.style.display = '';

        // Se o objeto global db estiver vazio, carrega o seed
        if (typeof window.db !== 'undefined' && window.PLENA_DEMO_FIT_SEED) {
            if (!window.db.clients || window.db.clients.length === 0) {
                window.db = JSON.parse(JSON.stringify(window.PLENA_DEMO_FIT_SEED));
            }
        }

        if (typeof router === 'function') {
            try {
                router('dashboard');
            } catch (e) {}
        }
    }

    function openWhatsApp() {
        window.open('https://api.whatsapp.com/send?phone=' + WHATSAPP_PHONE + '&text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Deseja resetar as alterações e recarregar os dados do Studio ProFit (Personal Carlos Mendes)?')) return;
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
            '<span style="display:block;margin-bottom:4px;color:#4ade80;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;">' + content.label + '</span>' +
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
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#0d140e;border-bottom:1px solid rgba(22,163,74,0.4);color:#e2e8f0;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 12px rgba(0,0,0,.5);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#22c55e;"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • ProFit Studio (Personal Carlos Mendes)</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:#16a34a;color:#fff;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;transition:background 0.2s;">Gostei, falar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.2);background:transparent;color:#94a3b8;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar dados</button>';
            document.body.prepend(banner);
            document.body.style.paddingTop = '38px';

            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }

        if (!document.getElementById('plena-demo-guide')) {
            var guide = document.createElement('div');
            guide.id = 'plena-demo-guide';
            guide.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:999998;max-width:300px;background:rgba(15,23,17,.96);color:#e5e7eb;border:1px solid rgba(34,197,94,.35);border-radius:14px;padding:14px 16px;box-shadow:0 14px 40px rgba(0,0,0,.45);font-family:Inter,system-ui,sans-serif;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);';
            document.body.appendChild(guide);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        patchFitVault();
        seedFitData();
        unlockUI();
        injectDemoLayer();
        setTimeout(function () {
            initContextualDemoGuide();
            unlockUI();
            if (typeof FitRoutine !== 'undefined' && typeof FitRoutine.render === 'function') {
                FitRoutine.render();
            }
        }, 150);
    });

    window.addEventListener('load', function () {
        patchFitVault();
        unlockUI();
    });
})();
