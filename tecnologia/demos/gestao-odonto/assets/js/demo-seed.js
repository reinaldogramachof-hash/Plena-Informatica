/**
 * demo-seed.js — Base Fictícia Clínica OdontoPlena
 * Dados simulados e realistas para demonstração clínica do Gestão Odonto Pro.
 */
window.ODONTO_DEMO_SEED = {
    settings: {
        clinicName: 'Clínica OdontoPlena',
        dentistCRO: 'Dr. Lucas Silveira · CRO-SP 108.432',
        clinicPhone: '(12) 99219-1018',
        clinicEmail: 'contato@odontoplena.com.br',
        clinicAddress: 'Av. Cassiano Ricardo, 601 - Aquarius, São José dos Campos - SP',
        clinicCNPJ: '59.779.242/0001-78',
        appointmentDuration: 30,
        reminderHours: 24,
        openingHour: '08:00',
        closingHour: '18:30',
        stockMinAlert: 4,
        stockExpiryAlertDays: 45,
        debtAlertDays: 30,
        autoBackupReminder: true,
        ownerName: 'Dr. Lucas Silveira',
        ownerDoc: 'CRO-SP 108.432'
    },
    patients: [
        {
            id: 'pat_1',
            name: 'Mariana Castro Silva',
            cpf: '345.890.128-40',
            birth: '1994-06-15',
            phone: '(12) 98841-2290',
            address: 'Rua das Palmeiras, 142 - Jd. Aquarius, São José dos Campos',
            billingType: 'particular',
            monthlyFee: 0,
            monthlyDueDay: 10,
            medicalAlerts: 'Alérgica a penicilina. Não utilizar derivados de amoxicilina.',
            notes: 'Paciente queixa-se de dor reflexa ao mastigar alimentos frios no quadrante superior direito.',
            clinicalNotes: [
                { date: '2026-10-15', text: 'Exame clínico: cavidade ocluso-mesial ativa no dente 16. Teste de vitalidade pulpar positivo.' }
            ],
            createdAt: '2026-10-15T09:00:00.000Z'
        },
        {
            id: 'pat_2',
            name: 'Roberto Dias Nogueira',
            cpf: '219.743.088-12',
            birth: '1982-11-20',
            phone: '(12) 99124-7731',
            address: 'Av. São João, 980 - Jd. Esplanada, São José dos Campos',
            billingType: 'particular',
            monthlyFee: 0,
            monthlyDueDay: 10,
            medicalAlerts: 'Hipertenso controlado com Losartana 50mg. Aferir PA antes de procedimentos cirúrgicos.',
            notes: 'Reabilitação estética anterior no dente 21 após fratura antiga de esmalte.',
            clinicalNotes: [
                { date: '2026-10-02', text: 'Preparo para faceta/coroa total em cerâmica pura E-Max no dente 21.' }
            ],
            createdAt: '2026-10-02T14:30:00.000Z'
        },
        {
            id: 'pat_3',
            name: 'Camila Duarte Fernandes',
            cpf: '412.567.890-33',
            birth: '2001-03-28',
            phone: '(12) 99763-1452',
            address: 'Rua Madre Paula, 310 - Vila Ema, São José dos Campos',
            billingType: 'mensalidade',
            monthlyFee: 150,
            monthlyDueDay: 10,
            medicalAlerts: 'Sem contraindicações médicas. Anamnese de rotina sem restrições.',
            notes: 'Tratamento ortodôntico corretivo fixo metálico prescrição Roth 0.022.',
            clinicalNotes: [
                { date: '2026-09-10', text: 'Instalação de aparelho ortodôntico completo nas arcadas superior e inferior.' }
            ],
            createdAt: '2026-09-10T10:00:00.000Z'
        },
        {
            id: 'pat_4',
            name: 'Thiago Henrique Lopes',
            cpf: '188.456.901-55',
            birth: '1990-09-14',
            phone: '(12) 98112-9080',
            address: 'Rua Heitor de Andrade, 77 - Vila Adyana, São José dos Campos',
            billingType: 'particular',
            monthlyFee: 0,
            monthlyDueDay: 10,
            medicalAlerts: 'Fumante moderado. Orientado sobre risco de cicatrização e alveolite pós-exodontia.',
            notes: 'Indicação cirúrgica para exodontia profilática dos 3ºs molares inferiores inclusos.',
            clinicalNotes: [],
            createdAt: '2026-10-22T16:00:00.000Z'
        },
        {
            id: 'pat_5',
            name: 'Juliana Martins Barbosa',
            cpf: '301.890.456-78',
            birth: '1987-12-05',
            phone: '(12) 99201-6543',
            address: 'Av. Cidade Jardim, 450 - Bosque dos Eucaliptos, São José dos Campos',
            billingType: 'convenio',
            monthlyFee: 0,
            monthlyDueDay: 10,
            medicalAlerts: 'Gestante (2º trimestre - 22 semanas). Anestésico de escolha: Prilocaína ou Lidocaína 2% com vasoconstritor autorizado pelo obstetra.',
            notes: 'Acompanhamento de profilaxia trimestral e gengivite gravídica.',
            clinicalNotes: [],
            createdAt: '2026-10-18T11:00:00.000Z'
        },
        {
            id: 'pat_6',
            name: 'Carlos Eduardo Fonseca',
            cpf: '156.789.234-91',
            birth: '1975-04-18',
            phone: '(12) 98774-3211',
            address: 'Rua Paraibuna, 1205 - Jd. São Dimas, São José dos Campos',
            billingType: 'particular',
            monthlyFee: 0,
            monthlyDueDay: 10,
            medicalAlerts: 'Diabético tipo 2 controlado. Glicemia recente de jejum 108 mg/dL.',
            notes: 'Terapia periodontal básica e raspagem de bolsas periodontais moderadas.',
            clinicalNotes: [],
            createdAt: '2026-09-25T15:20:00.000Z'
        }
    ],
    appointments: [
        {
            id: 'apt_1',
            patientId: 'pat_1',
            date: '2026-11-08',
            time: '08:30',
            duration: 45,
            procedure: 'Restauração Classe II Resina Fotopolimerizável',
            notes: 'Elemento 16 (ocluso-mesial). Anestesia infiltrativa terminal.',
            status: 'confirmed',
            createdAt: '2026-11-05T10:00:00.000Z'
        },
        {
            id: 'apt_2',
            patientId: 'pat_3',
            date: '2026-11-08',
            time: '09:30',
            duration: 30,
            procedure: 'Manutenção Ortodôntica Mensal',
            notes: 'Troca de arco superior NiTi .016 e elásticos.',
            status: 'scheduled',
            createdAt: '2026-11-04T11:30:00.000Z'
        },
        {
            id: 'apt_3',
            patientId: 'pat_5',
            date: '2026-11-08',
            time: '10:30',
            duration: 45,
            procedure: 'Profilaxia e Raspagem Supragengival',
            notes: 'Controle de biofilme e gengivite gravídica.',
            status: 'scheduled',
            createdAt: '2026-11-03T14:00:00.000Z'
        },
        {
            id: 'apt_4',
            patientId: 'pat_2',
            date: '2026-11-08',
            time: '14:00',
            duration: 60,
            procedure: 'Cimentação Definitiva de Coroa Cerâmica',
            notes: 'Elemento 21 (Dissilicato E-Max). Checagem de oclusão e desoclusão.',
            status: 'scheduled',
            createdAt: '2026-11-02T16:15:00.000Z'
        },
        {
            id: 'apt_5',
            patientId: 'pat_4',
            date: '2026-11-08',
            time: '15:30',
            duration: 45,
            procedure: 'Avaliação Cirúrgica para Exodontia 3ºs Molares',
            notes: 'Análise de raio-X panorâmico dos dentes 38 e 48.',
            status: 'scheduled',
            createdAt: '2026-11-01T09:40:00.000Z'
        },
        {
            id: 'apt_6',
            patientId: 'pat_6',
            date: '2026-11-09',
            time: '09:00',
            duration: 60,
            procedure: 'Raspagem e Alisamento Radicular (Q1)',
            notes: 'Bolsas periodontais de 4-5mm.',
            status: 'scheduled',
            createdAt: '2026-11-05T13:00:00.000Z'
        }
    ],
    treatments: [
        {
            id: 'treat_1',
            patientId: 'pat_1',
            type: 'Dentística',
            teeth: '16',
            description: 'Restauração estética em resina composta classe II (OM) com forramento bioativo',
            value: 380,
            totalSessions: 1,
            completedSessions: 0,
            sessionsHistory: [],
            financialStatus: 'partial',
            status: 'active',
            createdAt: '2026-10-15T09:30:00.000Z'
        },
        {
            id: 'treat_2',
            patientId: 'pat_2',
            type: 'Prótese',
            teeth: '21',
            description: 'Coroa total em cerâmica pura (Dissilicato de Lítio E-Max) com cimentação adesiva',
            value: 1850,
            totalSessions: 3,
            completedSessions: 2,
            sessionsHistory: [
                { date: '2026-10-18', procedure: 'Preparo dental e moldagem com silicona de adição', notes: 'Instalado provisório estético em bisacrílica.' },
                { date: '2026-10-28', procedure: 'Prova da infraestrutura e escolha de cor na escala VITA (A2)', notes: 'Aprovada adaptação cervical.' }
            ],
            financialStatus: 'partial',
            status: 'active',
            createdAt: '2026-10-02T15:00:00.000Z'
        },
        {
            id: 'treat_3',
            patientId: 'pat_3',
            type: 'Ortodontia',
            teeth: 'Superior e Inferior',
            description: 'Tratamento ortodôntico corretivo fixo metálico com manutenção mensal programada',
            value: 2400,
            totalSessions: 18,
            completedSessions: 4,
            sessionsHistory: [
                { date: '2026-09-10', procedure: 'Colagem de bráquetes e arcos iniciais', notes: 'Sem intercorrências.' },
                { date: '2026-10-08', procedure: 'Primeira manutenção e alinhamento', notes: 'Progresso regular.' }
            ],
            financialStatus: 'partial',
            status: 'active',
            createdAt: '2026-09-10T10:30:00.000Z'
        },
        {
            id: 'treat_4',
            patientId: 'pat_4',
            type: 'Cirurgia',
            teeth: '38, 48',
            description: 'Exodontia cirúrgica de terceiros molares inferiores inclusos com odontossecção',
            value: 900,
            totalSessions: 2,
            completedSessions: 0,
            sessionsHistory: [],
            financialStatus: 'pending',
            status: 'evaluation',
            createdAt: '2026-10-22T16:30:00.000Z'
        },
        {
            id: 'treat_5',
            patientId: 'pat_6',
            type: 'Periodontia',
            teeth: 'Geral',
            description: 'Terapia periodontal não cirúrgica com raspagem e alisamento corono-radicular em 4 quadrantes',
            value: 1200,
            totalSessions: 4,
            completedSessions: 1,
            sessionsHistory: [
                { date: '2026-10-27', procedure: 'Raspagem supragengival e orientação de higiene interdental', notes: 'Instrução com escova interproximal.' }
            ],
            financialStatus: 'partial',
            status: 'active',
            createdAt: '2026-09-25T16:00:00.000Z'
        }
    ],
    stock: [
        {
            id: 'stk_1',
            name: 'Resina Composta Filtek Z250 XT A2 (3M)',
            quantity: 6,
            minimum: 3,
            minQuantity: 3,
            category: 'Restauradores',
            unit: 'Seringa 4g',
            unitCost: 145.00,
            lotNumber: 'L26084',
            expirationDate: '2027-11-30',
            lastUpdated: '2026-10-20T10:00:00.000Z'
        },
        {
            id: 'stk_2',
            name: 'Anestésico Articaína 4% c/ Epinefrina 1:100.000 (DFL)',
            quantity: 4,
            minimum: 2,
            minQuantity: 2,
            category: 'Anestésicos',
            unit: 'Cx 50 tubetes',
            unitCost: 210.00,
            lotNumber: 'L99401',
            expirationDate: '2027-08-15',
            lastUpdated: '2026-10-20T10:00:00.000Z'
        },
        {
            id: 'stk_3',
            name: 'Anestésico Mepivacaína 3% sem Vasoconstritor (DFL)',
            quantity: 2,
            minimum: 2,
            minQuantity: 2,
            category: 'Anestésicos',
            unit: 'Cx 50 tubetes',
            unitCost: 195.00,
            lotNumber: 'L88210',
            expirationDate: '2027-04-20',
            lastUpdated: '2026-10-20T10:00:00.000Z'
        },
        {
            id: 'stk_4',
            name: 'Luvas de Nitrilo Azuis Tamanho M (Supermax)',
            quantity: 8,
            minimum: 4,
            minQuantity: 4,
            category: 'Biossegurança',
            unit: 'Cx 100 un',
            unitCost: 48.00,
            lotNumber: 'L77312',
            expirationDate: '2028-01-10',
            lastUpdated: '2026-10-20T10:00:00.000Z'
        },
        {
            id: 'stk_5',
            name: 'Ácido Fosfórico 37% Gel (Condac 37 FGM)',
            quantity: 3,
            minimum: 2,
            minQuantity: 2,
            category: 'Restauradores',
            unit: 'Kit 3 seringas',
            unitCost: 35.00,
            lotNumber: 'L33120',
            expirationDate: '2027-06-30',
            lastUpdated: '2026-10-20T10:00:00.000Z'
        },
        {
            id: 'stk_6',
            name: 'Fio Ortodôntico NiTi Termoativado .016 Superior (Morelli)',
            quantity: 5,
            minimum: 3,
            minQuantity: 3,
            category: 'Ortodontia',
            unit: 'Envelope 10 un',
            unitCost: 62.00,
            lotNumber: 'L55410',
            expirationDate: '2029-05-01',
            lastUpdated: '2026-10-20T10:00:00.000Z'
        },
        {
            id: 'stk_7',
            name: 'Sugador Odontológico Descartável Transparente',
            quantity: 12,
            minimum: 5,
            minQuantity: 5,
            category: 'Biossegurança',
            unit: 'Pacote 100 un',
            unitCost: 18.50,
            lotNumber: 'L11209',
            expirationDate: '2028-12-31',
            lastUpdated: '2026-10-20T10:00:00.000Z'
        },
        {
            id: 'stk_8',
            name: 'Kit Brocas Diamantadas Alta Rotação KG Sorensen',
            quantity: 3,
            minimum: 1,
            minQuantity: 1,
            category: 'Instrumentais',
            unit: 'Estojo',
            unitCost: 180.00,
            lotNumber: 'L44901',
            expirationDate: '2030-01-01',
            lastUpdated: '2026-10-20T10:00:00.000Z'
        }
    ],
    financial: [
        {
            id: 'fin_1',
            type: 'income',
            amount: 925.00,
            description: 'Entrada Coroa Cerâmica 21 - Roberto Nogueira (1/2)',
            category: 'Procedimento',
            date: '2026-10-18',
            status: 'paid',
            paymentMethod: 'pix',
            patientId: 'pat_2',
            paidAt: '2026-10-18'
        },
        {
            id: 'fin_2',
            type: 'income',
            amount: 150.00,
            description: 'Manutenção Ortodôntica Outubro - Camila Fernandes',
            category: 'Mensalidade',
            date: '2026-10-10',
            status: 'paid',
            paymentMethod: 'pix',
            patientId: 'pat_3',
            paidAt: '2026-10-10'
        },
        {
            id: 'fin_3',
            type: 'income',
            amount: 190.00,
            description: 'Sinal Restauração 16 - Mariana Castro',
            category: 'Procedimento',
            date: '2026-10-25',
            status: 'paid',
            paymentMethod: 'credit_card',
            patientId: 'pat_1',
            paidAt: '2026-10-25'
        },
        {
            id: 'fin_4',
            type: 'income',
            amount: 300.00,
            description: 'Sessão 1 Terapia Periodontal - Carlos Eduardo',
            category: 'Procedimento',
            date: '2026-10-27',
            status: 'paid',
            paymentMethod: 'pix',
            patientId: 'pat_6',
            paidAt: '2026-10-27'
        },
        {
            id: 'fin_5',
            type: 'expense',
            amount: 450.00,
            description: 'Laboratório Prótese Dental (Coroa Cerâmica 21)',
            category: 'Laboratório',
            date: '2026-10-24',
            status: 'paid',
            paymentMethod: 'pix',
            patientId: null,
            paidAt: '2026-10-24'
        },
        {
            id: 'fin_6',
            type: 'expense',
            amount: 685.00,
            description: 'Reposição Dental Cremer (Anestésicos e Resinas)',
            category: 'Materiais Odontológicos',
            date: '2026-10-20',
            status: 'paid',
            paymentMethod: 'boleto',
            patientId: null,
            paidAt: '2026-10-20'
        },
        {
            id: 'fin_7',
            type: 'expense',
            amount: 1800.00,
            description: 'Locação e Condomínio Sala Consultório',
            category: 'Aluguel/Imóvel',
            date: '2026-10-05',
            status: 'paid',
            paymentMethod: 'boleto',
            patientId: null,
            paidAt: '2026-10-05'
        },
        {
            id: 'fin_8',
            type: 'income',
            amount: 925.00,
            description: 'Final Coroa Cerâmica 21 - Roberto Nogueira (2/2)',
            category: 'Procedimento',
            date: '2026-11-08',
            status: 'pending',
            paymentMethod: 'credit_card',
            patientId: 'pat_2',
            paidAt: null
        },
        {
            id: 'fin_9',
            type: 'income',
            amount: 190.00,
            description: 'Saldo Restauração 16 - Mariana Castro (2/2)',
            category: 'Procedimento',
            date: '2026-11-08',
            status: 'pending',
            paymentMethod: 'pix',
            patientId: 'pat_1',
            paidAt: null
        }
    ]
};

