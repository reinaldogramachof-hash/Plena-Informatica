/**
 * demo-seed.js — Plena MicroSaaS • Gestão Fit
 * Base de dados rica e representativa para demonstração do Personal Carlos Mendes (ProFit Personal).
 */
(function () {
    'use strict';

    function getTodayISO() {
        var d = new Date();
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + day;
    }

    function addDaysISO(baseISO, days) {
        var d = new Date(baseISO + 'T12:00:00');
        d.setDate(d.getDate() + days);
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + day;
    }

    var today = getTodayISO();
    var firstDayOfMonth = today.slice(0, 8) + '01';
    var nextMonthDue = addDaysISO(today, 15);

    window.PLENA_DEMO_FIT_SEED = {
        appointments: [
            {
                id: 'appt-fit-01',
                clientId: 'cli-01',
                serviceId: 'srv-01',
                proId: 'adm',
                date: today,
                time: '07:00',
                status: 'done',
                notes: 'Foco em membros superiores e core. Carga progressiva.',
                schedule: {
                    version: 1,
                    durationMinutes: 60,
                    location: 'Studio ProFit - Sala 2'
                }
            },
            {
                id: 'appt-fit-02',
                clientId: 'cli-02',
                serviceId: 'srv-01',
                proId: 'adm',
                date: today,
                time: '08:30',
                status: 'done',
                notes: 'Treino de membros inferiores. Sem dor relatada no joelho.',
                schedule: {
                    version: 1,
                    durationMinutes: 60,
                    location: 'Academia Platinum'
                }
            },
            {
                id: 'appt-fit-03',
                clientId: 'cli-03',
                serviceId: 'srv-02',
                proId: 'adm',
                date: today,
                time: '10:00',
                status: 'confirmed',
                notes: 'Treinamento intervalado de alta intensidade (HIIT).',
                schedule: {
                    version: 1,
                    durationMinutes: 60,
                    location: 'Studio ProFit'
                }
            },
            {
                id: 'appt-fit-04',
                clientId: 'cli-04',
                serviceId: 'srv-01',
                proId: 'adm',
                date: today,
                time: '16:30',
                status: 'confirmed',
                notes: 'Avaliação física periódica e reajuste de cargas.',
                schedule: {
                    version: 1,
                    durationMinutes: 60,
                    location: 'Studio ProFit - Sala Avaliação'
                }
            },
            {
                id: 'appt-fit-05',
                clientId: 'cli-05',
                serviceId: 'srv-03',
                proId: 'adm',
                date: today,
                time: '18:30',
                status: 'confirmed',
                notes: 'Sessão funcional em dupla. Circuito metabólico.',
                schedule: {
                    version: 1,
                    durationMinutes: 60,
                    location: 'Parque da Cidade / Espaço Funcional'
                }
            }
        ],
        team: [
            {
                id: 'adm',
                name: 'Carlos Mendes',
                email: 'carlos.mendes@profitpersonal.com.br',
                phone: '(11) 98765-4321',
                role: 'Personal Trainer & Preparador Físico',
                cref: 'CREF 049821-G/SP',
                commission: 0
            }
        ],
        services: [
            {
                id: 'srv-01',
                name: 'Personal Individual (12 Aulas/mês)',
                duration: 60,
                price: 1200,
                category: 'Personal Presencial',
                color: '#16A34A',
                description: 'Acompanhamento presencial 3x por semana com periodização individual e bioimpedância.'
            },
            {
                id: 'srv-02',
                name: 'Personal Individual (8 Aulas/mês)',
                duration: 60,
                price: 880,
                category: 'Personal Presencial',
                color: '#22C55E',
                description: 'Acompanhamento presencial 2x por semana focado em hipertrofia ou condicionamento.'
            },
            {
                id: 'srv-03',
                name: 'Treinamento Funcional em Dupla',
                duration: 60,
                price: 750,
                category: 'Funcional',
                color: '#3B82F6',
                description: 'Sessões dinâmicas compartilhadas para duas pessoas com metas complementares.'
            },
            {
                id: 'srv-04',
                name: 'Consultoria Fitness & Prescrição',
                duration: 45,
                price: 350,
                category: 'Consultoria',
                color: '#8B5CF6',
                description: 'Prescrição mensal de treinos por aplicativo com vídeo de execução e suporte semanal.'
            }
        ],
        clients: [
            {
                id: 'cli-01',
                name: 'Lucas Silva Prado',
                phone: '(11) 99123-4567',
                email: 'lucas.prado@email.com',
                gender: 'M',
                notes: 'Objetivo: Hipertrofia com foco em deltoides e peitoral. Sem restrições osteoarticulares.',
                fitProfile: {
                    version: 1,
                    birthDate: '1992-06-15',
                    goal: 'Hipertrofia e força máxima',
                    experience: 'Avançado (4 anos de treino)',
                    availability: 'Segunda, Quarta e Sexta às 07:00',
                    emergencyName: 'Juliana Prado (Esposa)',
                    emergencyPhone: '(11) 99876-5432',
                    contactPreference: 'whatsapp'
                },
                assessments: [
                    {
                        id: 'ass-01',
                        date: addDaysISO(today, -30),
                        weightKg: 82.5,
                        heightCm: 178,
                        waistCm: 84,
                        hipCm: 98,
                        chestCm: 104,
                        armCm: 39.5,
                        thighCm: 59,
                        notes: 'Ganho de 1.8kg de massa magra no último ciclo. Redução do percentual de gordura para 13.5%.'
                    }
                ]
            },
            {
                id: 'cli-02',
                name: 'Beatriz Vasconcelos',
                phone: '(11) 98234-5678',
                email: 'beatriz.v@email.com',
                gender: 'F',
                notes: 'Objetivo: Emagrecimento e melhora da postura. Histórico de condromalácia patelar grau I.',
                fitProfile: {
                    version: 1,
                    birthDate: '1988-11-20',
                    goal: 'Emagrecimento sustentável e fortalecimento',
                    experience: 'Intermediário',
                    availability: 'Terça e Quinta às 08:30',
                    emergencyName: 'Marcos Vasconcelos (Irmão)',
                    emergencyPhone: '(11) 98765-1122',
                    contactPreference: 'whatsapp'
                },
                assessments: [
                    {
                        id: 'ass-02',
                        date: addDaysISO(today, -15),
                        weightKg: 64.2,
                        heightCm: 165,
                        waistCm: 72,
                        hipCm: 99,
                        chestCm: 90,
                        armCm: 28,
                        thighCm: 54,
                        notes: 'Evolução muito favorável. Redução de 2cm de circunferência abdominal.'
                    }
                ]
            },
            {
                id: 'cli-03',
                name: 'Rafael Costa Santos',
                phone: '(11) 97345-6789',
                email: 'rafael.costa@email.com',
                gender: 'M',
                notes: 'Objetivo: Preparação para prova de 10km e ganho de força excêntrica.',
                fitProfile: {
                    version: 1,
                    birthDate: '1995-03-10',
                    goal: 'Resistência aeróbica e prevenção de lesões',
                    experience: 'Corredor amador',
                    availability: 'Segunda e Quarta às 10:00',
                    emergencyName: 'Helena Santos',
                    emergencyPhone: '(11) 99111-2233',
                    contactPreference: 'whatsapp'
                }
            },
            {
                id: 'cli-04',
                name: 'Camila Fernandes Martins',
                phone: '(11) 96456-7890',
                email: 'camila.martins@email.com',
                gender: 'F',
                notes: 'Objetivo: Reabilitação funcional de coluna lombar (hérnia L5-S1 estável) e mobilidade.',
                fitProfile: {
                    version: 1,
                    birthDate: '1984-08-25',
                    goal: 'Core training, estabilidade lombar e postura',
                    experience: 'Iniciante / Retorno aos treinos',
                    availability: 'Segunda, Quarta e Sexta às 16:30',
                    emergencyName: 'Paulo Martins',
                    emergencyPhone: '(11) 98888-7777',
                    contactPreference: 'whatsapp'
                }
            },
            {
                id: 'cli-05',
                name: 'Rodrigo Alves Nogueira',
                phone: '(11) 95567-8901',
                email: 'rodrigo.alves@email.com',
                gender: 'M',
                notes: 'Treina em dupla com a esposa. Foco em saúde metabólica e resistência.',
                fitProfile: {
                    version: 1,
                    birthDate: '1980-01-30',
                    goal: 'Redução de estresse e perda de gordura',
                    experience: 'Intermediário',
                    availability: 'Terça e Quinta às 18:30',
                    emergencyName: 'Carla Nogueira',
                    emergencyPhone: '(11) 97777-6666',
                    contactPreference: 'whatsapp'
                }
            },
            {
                id: 'cli-06',
                name: 'Mariana Duarte Ramos',
                phone: '(11) 94678-9012',
                email: 'mariana.ramos@email.com',
                gender: 'F',
                notes: 'Consultoria de treino à distância. Aluna de musculação avançada.',
                fitProfile: {
                    version: 1,
                    birthDate: '1997-09-12',
                    goal: 'Definição muscular e hipertrofia de membros inferiores',
                    experience: 'Avançado',
                    availability: 'Treino independente em academia própria',
                    contactPreference: 'whatsapp'
                }
            }
        ],
        enrollments: [
            {
                id: 'enr-01',
                studentId: 'cli-01',
                planId: 'srv-01',
                instructorId: 'adm',
                startDate: firstDayOfMonth,
                status: 'active',
                sessionsLeft: 7,
                totalSessions: 12,
                cycle: 'monthly'
            },
            {
                id: 'enr-02',
                studentId: 'cli-02',
                planId: 'srv-01',
                instructorId: 'adm',
                startDate: firstDayOfMonth,
                status: 'active',
                sessionsLeft: 5,
                totalSessions: 8,
                cycle: 'monthly'
            },
            {
                id: 'enr-03',
                studentId: 'cli-03',
                planId: 'srv-02',
                instructorId: 'adm',
                startDate: firstDayOfMonth,
                status: 'active',
                sessionsLeft: 4,
                totalSessions: 8,
                cycle: 'monthly'
            },
            {
                id: 'enr-04',
                studentId: 'cli-04',
                planId: 'srv-01',
                instructorId: 'adm',
                startDate: firstDayOfMonth,
                status: 'active',
                sessionsLeft: 8,
                totalSessions: 12,
                cycle: 'monthly'
            },
            {
                id: 'enr-05',
                studentId: 'cli-05',
                planId: 'srv-03',
                instructorId: 'adm',
                startDate: firstDayOfMonth,
                status: 'active',
                sessionsLeft: 6,
                totalSessions: 8,
                cycle: 'monthly'
            }
        ],
        transactions: [
            {
                id: 'tx-01',
                date: addDaysISO(today, -6),
                type: 'income',
                category: 'Mensalidade',
                description: 'Lucas Silva Prado — Plano Personal 12x (Pix)',
                amount: 1200,
                clientId: 'cli-01',
                serviceId: 'srv-01',
                method: 'pix'
            },
            {
                id: 'tx-02',
                date: addDaysISO(today, -5),
                type: 'income',
                category: 'Mensalidade',
                description: 'Beatriz Vasconcelos — Plano Personal 8x (Cartão Crédito)',
                amount: 880,
                clientId: 'cli-02',
                serviceId: 'srv-01',
                method: 'card'
            },
            {
                id: 'tx-03',
                date: addDaysISO(today, -4),
                type: 'income',
                category: 'Mensalidade',
                description: 'Rafael Costa Santos — Plano Personal 8x (Pix)',
                amount: 880,
                clientId: 'cli-03',
                serviceId: 'srv-02',
                method: 'pix'
            },
            {
                id: 'tx-04',
                date: addDaysISO(today, -3),
                type: 'income',
                category: 'Mensalidade',
                description: 'Camila Fernandes Martins — Plano Personal 12x (Pix)',
                amount: 1200,
                clientId: 'cli-04',
                serviceId: 'srv-01',
                method: 'pix'
            },
            {
                id: 'tx-05',
                date: addDaysISO(today, -8),
                type: 'expense',
                category: 'Estrutura & Sala',
                description: 'Locação horária Studio ProFit (Mês vigente)',
                amount: 650,
                method: 'pix'
            },
            {
                id: 'tx-06',
                date: addDaysISO(today, -12),
                type: 'expense',
                category: 'Conselho / CREF',
                description: 'Anuidade CREF-SP proporcional',
                amount: 110,
                method: 'boleto'
            }
        ],
        training: {
            version: 1,
            exercises: [
                { id: 'ex-01', name: 'Supino Reto com Barra', group: 'Peitoral', equipment: 'Barra Olímpica e Banco Reto', instructions: 'Escápulas em retração, descida controlada tocando o externo médio.', archived: false, revision: 1, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z' },
                { id: 'ex-02', name: 'Agachamento Livre com Barra', group: 'Membros Inferiores', equipment: 'Rack e Barra', instructions: 'Base na largura dos ombros, joelhos alinhados com a ponta dos pés, tronco firme.', archived: false, revision: 1, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z' },
                { id: 'ex-03', name: 'Puxada Alta Pronada', group: 'Costas', equipment: 'Polia Alta / Pulldown', instructions: 'Puxada em direção à clavícula, sem balanço excessivo de tronco.', archived: false, revision: 1, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z' },
                { id: 'ex-04', name: 'Levantamento Terra Romeno (RDL)', group: 'Posterior de Coxa', equipment: 'Halteres ou Barra', instructions: 'Flexão de quadril com joelhos semiflexionados, coluna neutra durante todo o curso.', archived: false, revision: 1, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z' },
                { id: 'ex-05', name: 'Desenvolvimento Militar com Halteres', group: 'Deltoides', equipment: 'Banco com encosto 85°', instructions: 'Empurrar acima da cabeça com controle na fase excêntrica de 2 segundos.', archived: false, revision: 1, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z' },
                { id: 'ex-06', name: 'Prancha Isométrica com Apoio nos Antebraços', group: 'Core', equipment: 'Colchonete', instructions: 'Ativação de glúteos e abdômen, sem hiperlordose lombar.', archived: false, revision: 1, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z' }
            ],
            programs: []
        },
        settings: {
            businessName: 'ProFit Personal & Studio',
            businessOwner: 'Carlos Mendes',
            businessDoc: 'CREF 049821-G/SP',
            businessHours: '06:00 às 21:00',
            theme: 'green',
            termsAccepted: true,
            termsAcceptedAt: '2026-01-01T08:00:00Z',
            operationMode: 'personal',
            graceDays: 5,
            dueSoonDays: 3,
            inactivityDays: 14,
            blockCheckinOnOverdue: false
        },
        tutorial: {
            completedSteps: ['step-01', 'step-02', 'step-03'],
            checklistState: { welcomeDismissed: true }
        },
        schemaVersion: 7
    };
})();
