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
    var SEED_VERSION_KEY = 'fit_demo_seed_ver';
    var SEED_VERSION = 'fit-v2';

    // 1. Assegurar credenciais no localStorage síncrono e aparência inicial clara
    try {
        localStorage.setItem('fit_license', 'DEMO-PLENA-VITALICIA');
        localStorage.setItem('fit_verified_license', 'DEMO-PLENA-VITALICIA');
        localStorage.setItem('fit_receipt_confirmed', 'DEMO-PLENA-VITALICIA');
        localStorage.setItem('fit_email', 'demo@plenainformatica.com.br');
        localStorage.removeItem('fit_license_blocked');
        localStorage.removeItem('fit_is_trial');
    } catch (e) {}

    window.fitLicenseReady = true;

    function forceLightDefault() {
        try {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        } catch (e) {}
    }

    forceLightDefault();

    function pad2(n) {
        return String(n).padStart(2, '0');
    }

    function localTodayISO() {
        var now = new Date();
        return now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate());
    }

    function addDaysUTC(dateStr, days) {
        var d = new Date(dateStr + 'T12:00:00Z');
        d.setUTCDate(d.getUTCDate() + days);
        return d.toISOString().slice(0, 10);
    }

    function nextMonthFirstISO(dateStr) {
        var parts = dateStr.split('-').map(Number);
        var d = new Date(Date.UTC(parts[0], parts[1], 1));
        return d.toISOString().slice(0, 10);
    }

    function normalizeIsoStamp(value) {
        if (typeof value === 'string') {
            var ms = Date.parse(value);
            if (Number.isFinite(ms)) return new Date(ms).toISOString();
        }
        return '2026-01-10T10:00:00.000Z';
    }

    function enrichDemoSeed(rawSeed) {
        var seed = JSON.parse(JSON.stringify(rawSeed || {}));
        var today = localTodayISO();
        var monthPrefix = today.slice(0, 7);
        var todayDay = Number(today.slice(8, 10)) || 1;
        var firstDayOfMonth = monthPrefix + '-01';
        var nextMonthFirst = nextMonthFirstISO(today);

        function monthDay(daysBack) {
            var target = Math.max(1, todayDay - daysBack);
            return monthPrefix + '-' + pad2(target);
        }

        seed.system = 'gestao-fit';
        seed.schemaVersion = 7;

        seed.settings = seed.settings || {};
        seed.settings.termsAccepted = true;
        seed.settings.termsAcceptedAt = normalizeIsoStamp(seed.settings.termsAcceptedAt || '2026-01-01T08:00:00.000Z');
        seed.settings.presentation = {
            version: 1,
            palette: 'green',
            fontSize: 16,
            signature: 'ProFit Personal & Studio · CREF 049821-G/SP',
            logo: ''
        };

        var serviceTerms = {
            'srv-01': { version: 1, kind: 'monthly', months: 1, validityDays: null, sessionsIncluded: 12 },
            'srv-02': { version: 1, kind: 'monthly', months: 1, validityDays: null, sessionsIncluded: 8 },
            'srv-03': { version: 1, kind: 'monthly', months: 1, validityDays: null, sessionsIncluded: 8 },
            'srv-04': { version: 1, kind: 'monthly', months: 1, validityDays: null, sessionsIncluded: null }
        };

        if (Array.isArray(seed.services)) {
            seed.services.forEach(function (srv) {
                var t = serviceTerms[srv.id];
                if (t) srv.commercial = Object.assign({}, t);
                srv.billingCycle = srv.billingCycle || 'monthly';
                srv.sessionsIncluded = t ? t.sessionsIncluded : (srv.sessionsIncluded ?? null);
            });
        }

        // Normalizar contratos/matrículas conforme FitData v7
        var periodSpec = {
            'enr-01': { planId: 'srv-01', planName: 'Personal Individual (12 Aulas/mês)', priceCents: 120000, sessions: 12, due: monthDay(6), paidBy: 'tx-01' },
            'enr-02': { planId: 'srv-02', planName: 'Personal Individual (8 Aulas/mês)', priceCents: 88000, sessions: 8, due: monthDay(5), paidBy: 'tx-02' },
            'enr-03': { planId: 'srv-02', planName: 'Personal Individual (8 Aulas/mês)', priceCents: 88000, sessions: 8, due: monthDay(4), paidBy: 'tx-03' },
            'enr-04': { planId: 'srv-01', planName: 'Personal Individual (12 Aulas/mês)', priceCents: 120000, sessions: 12, due: monthDay(3), paidBy: 'tx-04' },
            'enr-05': { planId: 'srv-03', planName: 'Treinamento Funcional em Dupla', priceCents: 75000, sessions: 8, due: monthDay(0), paidBy: null }
        };

        if (Array.isArray(seed.appointments)) {
            var apptContractMap = {
                'appt-fit-01': 'enr-01',
                'appt-fit-02': 'enr-02',
                'appt-fit-03': 'enr-03',
                'appt-fit-04': 'enr-04',
                'appt-fit-05': 'enr-05',
                'appt-fit-06': 'enr-01'
            };
            var clientMap = {};
            var serviceMap = {};
            var proMap = {};
            if (Array.isArray(seed.clients)) seed.clients.forEach(function (c) { clientMap[c.id] = c.name; });
            if (Array.isArray(seed.services)) seed.services.forEach(function (s) { serviceMap[s.id] = s.name; });
            if (Array.isArray(seed.team)) seed.team.forEach(function (p) { proMap[p.id] = p.name; });

            var tomorrow = addDaysUTC(today, 1);
            var safeFutureDate = tomorrow < nextMonthFirst ? tomorrow : today;

            if (!seed.appointments.some(function (a) { return a.id === 'appt-fit-06'; })) {
                seed.appointments.push({
                    id: 'appt-fit-06',
                    clientId: 'cli-01',
                    serviceId: 'srv-01',
                    proId: 'adm',
                    date: safeFutureDate,
                    time: safeFutureDate === tomorrow ? '07:00' : '22:00',
                    status: 'pending',
                    notes: 'Treino B — Membros inferiores e estabilização de core.',
                    schedule: {
                        version: 1,
                        durationMinutes: 60,
                        location: 'Studio ProFit - Sala 2'
                    }
                });
            }

            seed.appointments.forEach(function (apt) {
                if (apt.id !== 'appt-fit-06') {
                    apt.date = today;
                } else {
                    apt.date = safeFutureDate;
                }
                if (apt.status === 'confirmed') {
                    apt.status = 'pending';
                    apt.attendance = {
                        version: 1,
                        confirmation: 'confirmed',
                        history: [{ action: 'confirmed', at: firstDayOfMonth + 'T08:00:00.000Z' }]
                    };
                }
                if (apt.id === 'appt-fit-02') {
                    apt.serviceId = 'srv-02';
                }
                apt.clientName = clientMap[apt.clientId] || apt.clientName || '';
                apt.serviceName = serviceMap[apt.serviceId] || apt.serviceName || '';
                apt.proName = proMap[apt.proId] || apt.proName || 'Carlos Mendes';
                var enrId = apptContractMap[apt.id];
                if (enrId) {
                    apt.billing = { version: 1, mode: 'contract', enrollmentId: enrId, periodId: 'per-' + enrId };
                }
            });
        }

        if (Array.isArray(seed.enrollments)) {
            seed.enrollments = seed.enrollments.map(function (enr) {
                var spec = periodSpec[enr.id] || { planId: enr.planId, planName: 'Personal Individual', priceCents: 88000, sessions: 8, due: today, paidBy: null };
                var uses = [];
                if (enr.id === 'enr-01') {
                    uses.push({ id: 'use-fit-01', appointmentId: 'appt-fit-01', periodId: 'per-' + enr.id, date: today });
                }
                if (enr.id === 'enr-02') {
                    uses.push({ id: 'use-fit-02', appointmentId: 'appt-fit-02', periodId: 'per-' + enr.id, date: today });
                }
                return {
                    id: enr.id,
                    studentId: enr.studentId,
                    planId: spec.planId,
                    instructorId: enr.instructorId || 'adm',
                    startDate: firstDayOfMonth,
                    dueDate: spec.due,
                    status: 'ativo',
                    history: [{ action: 'contratada', date: firstDayOfMonth + 'T09:00:00.000Z', periodId: 'per-' + enr.id }],
                    commercial: {
                        version: 1,
                        kind: 'monthly',
                        months: 1,
                        validityDays: null,
                        sessionsIncluded: spec.sessions,
                        planName: spec.planName,
                        priceCents: spec.priceCents,
                        periods: [{
                            id: 'per-' + enr.id,
                            startDate: firstDayOfMonth,
                            endDate: nextMonthFirst,
                            dueDate: spec.due,
                            priceCents: spec.priceCents,
                            sessionsIncluded: spec.sessions
                        }],
                        uses: uses
                    }
                };
            });
        }

        var txOffsets = { 'tx-01': 5, 'tx-02': 4, 'tx-03': 3, 'tx-04': 2, 'tx-05': 7, 'tx-06': 9 };
        var txEnroll = {
            'tx-01': { enrollmentId: 'enr-01', periodId: 'per-enr-01', serviceId: 'srv-01', method: 'Pix' },
            'tx-02': { enrollmentId: 'enr-02', periodId: 'per-enr-02', serviceId: 'srv-02', method: 'Cartão de Crédito' },
            'tx-03': { enrollmentId: 'enr-03', periodId: 'per-enr-03', serviceId: 'srv-02', method: 'Pix' },
            'tx-04': { enrollmentId: 'enr-04', periodId: 'per-enr-04', serviceId: 'srv-01', method: 'Pix' }
        };

        if (Array.isArray(seed.transactions)) {
            seed.transactions.forEach(function (tx) {
                var off = Object.prototype.hasOwnProperty.call(txOffsets, tx.id) ? txOffsets[tx.id] : 2;
                tx.date = monthDay(off);
                var bind = txEnroll[tx.id];
                if (bind) {
                    tx.serviceId = bind.serviceId;
                    tx.enrollmentId = bind.enrollmentId;
                    tx.billingPeriodId = bind.periodId;
                    tx.paymentKey = 'period:' + bind.enrollmentId + ':' + bind.periodId;
                    tx.paymentMethod = bind.method;
                }
            });
        }

        // Contas financeiras de exemplo (a receber / a pagar no período atual)
        seed.finance = {
            version: 1,
            accounts: [
                {
                    id: 'acc-fit-01',
                    kind: 'receivable',
                    title: 'Consultoria Fitness & Prescrição — Mensalidade',
                    party: 'Mariana Duarte Ramos',
                    studentId: 'cli-06',
                    amountCents: 35000,
                    dueDate: today,
                    createdAt: firstDayOfMonth + 'T08:00:00.000Z',
                    cancelled: null
                },
                {
                    id: 'acc-fit-02',
                    kind: 'payable',
                    title: 'Manutenção preventiva de kettlebells e colchonetes',
                    party: 'EquipaSul Studio Hardware',
                    studentId: null,
                    amountCents: 28000,
                    dueDate: addDaysUTC(today, 2),
                    createdAt: firstDayOfMonth + 'T10:00:00.000Z',
                    cancelled: null
                }
            ],
            adjustments: [],
            recurrences: [],
            reconciliations: []
        };

        // Exercícios e fichas de treino com carimbos ISO válidos
        if (seed.training && Array.isArray(seed.training.exercises)) {
            seed.training.exercises.forEach(function (ex) {
                ex.createdAt = normalizeIsoStamp(ex.createdAt);
                ex.updatedAt = normalizeIsoStamp(ex.updatedAt);
            });

            if (!Array.isArray(seed.training.programs) || seed.training.programs.length === 0) {
                var reviewDate = addDaysUTC(today, 21);
                var startDate = addDaysUTC(today, -14);
                var verStamp = '2026-10-28T11:30:00.000Z';

                seed.training.programs = [
                    {
                        id: 'prog-fit-01',
                        kind: 'student',
                        studentId: 'cli-01',
                        archived: false,
                        createdAt: verStamp,
                        updatedAt: verStamp,
                        history: [{ action: 'created', at: verStamp, versionId: 'ver-fit-01' }],
                        versions: [{
                            id: 'ver-fit-01',
                            number: 1,
                            title: 'Hipertrofia e Força — Ciclo A/B',
                            goal: 'Progressão de força em membros superiores e estabilização de core.',
                            notes: 'Priorizar controle excêntrico de 2 segundos e pausa de descanso completa.',
                            startsOn: startDate,
                            reviewOn: reviewDate,
                            createdAt: verStamp,
                            blocks: [
                                {
                                    id: 'blk-fit-01a',
                                    name: 'Treino A — Superiores & Core',
                                    notes: 'Executar segunda e quinta-feira com aquecimento articular prévio.',
                                    items: [
                                        {
                                            id: 'row-fit-01',
                                            exerciseId: 'ex-01',
                                            name: 'Supino Reto com Barra',
                                            group: 'Peitoral',
                                            equipment: 'Barra Olímpica e Banco Reto',
                                            instructions: 'Escápulas em retração, descida controlada tocando o externo médio.',
                                            sets: 4,
                                            reps: '8–10',
                                            load: '65 kg',
                                            restSeconds: 90,
                                            notes: 'Manter cotovelos em 45 graus.'
                                        },
                                        {
                                            id: 'row-fit-02',
                                            exerciseId: 'ex-03',
                                            name: 'Puxada Alta Pronada',
                                            group: 'Costas',
                                            equipment: 'Polia Alta / Pulldown',
                                            instructions: 'Puxada em direção à clavícula, sem balanço excessivo de tronco.',
                                            sets: 4,
                                            reps: '10–12',
                                            load: '55 kg',
                                            restSeconds: 75,
                                            notes: 'Depressão escapular no início da puxada.'
                                        },
                                        {
                                            id: 'row-fit-03',
                                            exerciseId: 'ex-05',
                                            name: 'Desenvolvimento Militar com Halteres',
                                            group: 'Deltoides',
                                            equipment: 'Banco com encosto 85°',
                                            instructions: 'Empurrar acima da cabeça com controle na fase excêntrica de 2 segundos.',
                                            sets: 3,
                                            reps: '10',
                                            load: '18 kg/lado',
                                            restSeconds: 60,
                                            notes: ''
                                        },
                                        {
                                            id: 'row-fit-04',
                                            exerciseId: 'ex-06',
                                            name: 'Prancha Isométrica com Apoio nos Antebraços',
                                            group: 'Core',
                                            equipment: 'Colchonete',
                                            instructions: 'Ativação de glúteos e abdômen, sem hiperlordose lombar.',
                                            sets: 3,
                                            reps: '45 s',
                                            load: 'Peso corporal',
                                            restSeconds: 45,
                                            notes: ''
                                        }
                                    ]
                                },
                                {
                                    id: 'blk-fit-01b',
                                    name: 'Treino B — Inferiores & Posterior',
                                    notes: 'Executar terça e sexta-feira.',
                                    items: [
                                        {
                                            id: 'row-fit-05',
                                            exerciseId: 'ex-02',
                                            name: 'Agachamento Livre com Barra',
                                            group: 'Membros Inferiores',
                                            equipment: 'Rack e Barra',
                                            instructions: 'Base na largura dos ombros, joelhos alinhados com a ponta dos pés, tronco firme.',
                                            sets: 4,
                                            reps: '8–10',
                                            load: '80 kg',
                                            restSeconds: 120,
                                            notes: ''
                                        },
                                        {
                                            id: 'row-fit-06',
                                            exerciseId: 'ex-04',
                                            name: 'Levantamento Terra Romeno (RDL)',
                                            group: 'Posterior de Coxa',
                                            equipment: 'Halteres ou Barra',
                                            instructions: 'Flexão de quadril com joelhos semiflexionados, coluna neutra durante todo o curso.',
                                            sets: 4,
                                            reps: '10',
                                            load: '60 kg',
                                            restSeconds: 90,
                                            notes: ''
                                        }
                                    ]
                                }
                            ]
                        }]
                    },
                    {
                        id: 'prog-fit-02',
                        kind: 'student',
                        studentId: 'cli-02',
                        archived: false,
                        createdAt: verStamp,
                        updatedAt: verStamp,
                        history: [{ action: 'created', at: verStamp, versionId: 'ver-fit-02' }],
                        versions: [{
                            id: 'ver-fit-02',
                            number: 1,
                            title: 'Condicionamento & Estabilidade Postural',
                            goal: 'Fortalecimento de cadeia posterior e proteção patelar.',
                            notes: 'Sem impactos verticais em dor aguda.',
                            startsOn: startDate,
                            reviewOn: reviewDate,
                            createdAt: verStamp,
                            blocks: [{
                                id: 'blk-fit-02a',
                                name: 'Sessão Completa — 2x na Semana',
                                notes: '',
                                items: [
                                    {
                                        id: 'row-fit-07',
                                        exerciseId: 'ex-04',
                                        name: 'Levantamento Terra Romeno (RDL)',
                                        group: 'Posterior de Coxa',
                                        equipment: 'Halteres ou Barra',
                                        instructions: 'Flexão de quadril com joelhos semiflexionados, coluna neutra durante todo o curso.',
                                        sets: 3,
                                        reps: '12',
                                        load: '16 kg/lado',
                                        restSeconds: 60,
                                        notes: ''
                                    },
                                    {
                                        id: 'row-fit-08',
                                        exerciseId: 'ex-06',
                                        name: 'Prancha Isométrica com Apoio nos Antebraços',
                                        group: 'Core',
                                        equipment: 'Colchonete',
                                        instructions: 'Ativação de glúteos e abdômen, sem hiperlordose lombar.',
                                        sets: 3,
                                        reps: '40 s',
                                        load: 'Peso corporal',
                                        restSeconds: 45,
                                        notes: ''
                                    }
                                ]
                            }]
                        }]
                    }
                ];
            }
        }

        return seed;
    }

    var preparedDemoSeed = null;
    function getPreparedSeed() {
        if (!preparedDemoSeed && window.PLENA_DEMO_FIT_SEED) {
            preparedDemoSeed = enrichDemoSeed(window.PLENA_DEMO_FIT_SEED);
        }
        return preparedDemoSeed;
    }

    var demoRouteApplied = false;
    function applyDemoRouteOnce() {
        if (demoRouteApplied) return;
        if (typeof FitSecurity === 'undefined' || !FitSecurity.isOpen()) return;
        if (document.body && document.body.classList.contains('fit-data-locked')) {
            setTimeout(applyDemoRouteOnce, 25);
            return;
        }
        demoRouteApplied = true;

        var handled = false;
        if (window.FitDemoEntry && typeof window.router === 'function') {
            handled = window.FitDemoEntry.open(window.location.search, {
                navigate: function (view) { return window.router(view); },
                openStudent: function (studentId) {
                    if (typeof FitStudents !== 'undefined' && typeof FitStudents.open === 'function') {
                        FitStudents.open(studentId);
                    }
                }
            });
        }

        if (!handled) {
            updateDemoGuide(getActiveDemoView());
        } else {
            updateDemoGuide(getActiveDemoView());
        }

        adjustBannerOffset();
        document.documentElement.dataset.plenaDemoReady = '1';
    }

    // 2. Interceptar FitVaultStore para que o cofre nunca exija senha na demo
    function patchFitVault() {
        if (typeof FitVaultStore === 'undefined') return;
        if (FitVaultStore._plenaPatched) return;
        FitVaultStore._plenaPatched = true;

        FitVaultStore.create = function (options) {
            var vaultOpen = false;
            var rawSeed = getPreparedSeed() || (options && options.defaults) || {};
            var currentData = JSON.parse(JSON.stringify(rawSeed));

            if (typeof FitData !== 'undefined' && typeof FitData.normalize === 'function' && options && options.defaults) {
                try {
                    currentData = FitData.normalize(currentData, options.defaults, true);
                } catch (e) {
                    console.warn('[demo-bypass] FitData.normalize aviso:', e);
                }
            }

            return {
                load: function () {
                    return { protected: true, legacy: false };
                },
                unlock: async function () {
                    vaultOpen = true;
                    setTimeout(onVaultOpened, 25);
                    return JSON.parse(JSON.stringify(currentData));
                },
                resume: async function () {
                    vaultOpen = true;
                    setTimeout(onVaultOpened, 25);
                    return JSON.parse(JSON.stringify(currentData));
                },
                save: async function (data) {
                    currentData = data;
                    return JSON.parse(JSON.stringify(data));
                },
                prepare: function () {
                    return {};
                },
                restore: async function (preview) {
                    vaultOpen = true;
                    if (preview && preview.data) currentData = preview.data;
                    setTimeout(onVaultOpened, 25);
                    return JSON.parse(JSON.stringify(currentData));
                },
                recover: async function () {
                    vaultOpen = true;
                    setTimeout(onVaultOpened, 25);
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
                    return { open: vaultOpen, busy: false, previous: false };
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
                'Visualização diária, semanal e mensal com identificação de horários vagos.',
                'Diferenciação por status: confirmada, agendada, realizada ou falta.',
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
                'Consulte dados, objetivos, restrições articulares e plano contratado.',
                'Acompanhe a ficha de treino ativa (A/B) e o saldo de sessões do período.',
                'Histórico de avaliações físicas e medidas preservado com segurança.'
            ]
        },
        training: {
            label: 'Treinos & Exercícios',
            title: 'Prescrição e biblioteca técnica',
            steps: [
                'Biblioteca de exercícios agrupados por grupamento muscular.',
                'Fichas de treino montadas com séries, repetições, carga e descanso.',
                'Histórico de versões preservado para comparar progressão de cargas.'
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
            title: 'Fluxo de caixa e recebíveis',
            steps: [
                'Acompanhe mensalidades recebidas via Pix, cartão ou transferência.',
                'Controle contas a receber, contas a pagar e conferência de caixa.',
                'Previsão financeira mensal separada do saldo já movimentado.'
            ]
        },
        settings: {
            label: 'Ajustes & Cofre',
            title: 'Identidade e segurança local',
            steps: [
                'Personalize nome comercial (ProFit Studio), CREF e horários de trabalho.',
                'Cofre local criptografado com senha: dados 100% no seu computador.',
                'Gere backups protegidos em 1 clique para pendrive ou nuvem privada.'
            ]
        }
    };

    function seedFitData() {
        try {
            var currentVer = localStorage.getItem(SEED_VERSION_KEY);
            var existing = localStorage.getItem(DB_KEY);
            var prepared = getPreparedSeed();
            if ((!existing || existing === '{}' || existing === 'null' || currentVer !== SEED_VERSION) && prepared) {
                localStorage.setItem(DB_KEY, JSON.stringify(prepared));
                localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
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

        document.querySelectorAll('.fit-security-overlay, #fit-security-dialog').forEach(function (el) {
            el.remove();
        });

        document.body.classList.remove('fit-data-locked');
        if (!document.getElementById('sidebar')?.classList.contains('open')) {
            document.body.style.overflow = '';
        }

        var sidebar = document.getElementById('sidebar');
        var main = document.querySelector('main');
        var header = document.getElementById('fit-app-header') || document.querySelector('header');
        if (sidebar) sidebar.style.display = '';
        if (main) main.style.display = '';
        if (header) header.style.display = '';

        var prepared = getPreparedSeed();
        if (typeof window.db !== 'undefined' && prepared) {
            if (!window.db.clients || window.db.clients.length === 0) {
                window.db = JSON.parse(JSON.stringify(prepared));
            }
        }
    }

    function adjustBannerOffset() {
        var banner = document.getElementById('plena-demo-banner');
        if (!banner) return;
        var h = banner.getBoundingClientRect().height || 40;
        document.body.style.paddingTop = h + 'px';

        var sb = document.getElementById('sidebar');
        if (sb) {
            sb.style.top = h + 'px';
            sb.style.height = 'calc(100dvh - ' + h + 'px)';
        }

        var hdr = document.getElementById('fit-app-header');
        if (hdr) {
            hdr.style.top = h + 'px';
        }
    }

    function openWhatsApp() {
        window.open('https://api.whatsapp.com/send?phone=' + WHATSAPP_PHONE + '&text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Deseja resetar as alterações e recarregar os dados do Studio ProFit (Personal Carlos Mendes)?')) return;
        try {
            localStorage.removeItem(DB_KEY);
            localStorage.removeItem(SEED_VERSION_KEY);
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
        guide.innerHTML = '<button type="button" aria-label="Fechar guia rápido" style="position:absolute;top:8px;right:10px;background:transparent;border:0;color:#64748b;font-size:18px;cursor:pointer;line-height:1;" onclick="this.parentElement.remove()">×</button>' +
            '<span style="display:block;margin-bottom:4px;color:#15803d;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;">' + content.label + '</span>' +
            '<strong style="display:block;color:#122619;margin-bottom:8px;font-size:13px;line-height:1.3;">' + content.title + '</strong>' +
            '<ol style="margin:0;padding-left:18px;font-size:12px;line-height:1.5;color:#47584d;"><li>' + content.steps[0] + '</li><li>' + content.steps[1] + '</li><li>' + content.steps[2] + '</li></ol>';
    }

    function initContextualDemoGuide() {
        updateDemoGuide(getActiveDemoView());

        if (typeof window.router === 'function' && !window.router.plenaDemoHook) {
            var origRouter = window.router;
            var wrappedRouter = function (view) {
                var res = origRouter.apply(this, arguments);
                setTimeout(function () {
                    updateDemoGuide(view);
                }, 40);
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
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#f6f9f6;border-bottom:1px solid rgba(21,128,61,0.18);color:#122619;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 10px rgba(18,38,25,.06);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#15803d;"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • ProFit Studio (Personal Carlos Mendes)</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:#15803d;color:#fff;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;transition:background 0.2s;">Gostei, falar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid rgba(21,128,61,.25);background:#fff;color:#166534;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar dados</button>';
            document.body.prepend(banner);
            adjustBannerOffset();

            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }

        if (!document.getElementById('plena-demo-guide')) {
            var guide = document.createElement('div');
            guide.id = 'plena-demo-guide';
            guide.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:999998;max-width:300px;background:#ffffff;color:#122619;border:1px solid rgba(21,128,61,0.22);border-radius:14px;padding:14px 16px;box-shadow:0 14px 40px rgba(18,38,25,.12);font-family:Inter,system-ui,sans-serif;';
            document.body.appendChild(guide);
        }
    }

    function onVaultOpened() {
        forceLightDefault();
        unlockUI();
        injectDemoLayer();
        initContextualDemoGuide();
        applyDemoRouteOnce();
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

    window.addEventListener('resize', adjustBannerOffset);

    document.addEventListener('DOMContentLoaded', function () {
        forceLightDefault();
        patchFitVault();
        seedFitData();
        injectDemoLayer();
        adjustBannerOffset();
        setTimeout(function () {
            if (!demoRouteApplied && typeof FitSecurity !== 'undefined' && FitSecurity.isOpen()) {
                onVaultOpened();
            } else {
                initContextualDemoGuide();
                adjustBannerOffset();
            }
        }, 60);
    });

    window.addEventListener('load', function () {
        patchFitVault();
        unlockUI();
        adjustBannerOffset();
        if (!demoRouteApplied && typeof FitSecurity !== 'undefined' && FitSecurity.isOpen()) {
            onVaultOpened();
        }
    });
})();
