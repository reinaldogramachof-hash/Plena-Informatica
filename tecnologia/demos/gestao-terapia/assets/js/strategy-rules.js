/* Regras puras de agregação, indicadores, projeções e séries históricas da Visão Estratégica.
   Todos os cálculos são baseados em registros objetivos e regras de gestão pré-existentes.
   Não realiza inferência diagnóstica ou clínica. */

const TherapyStrategyRules = (() => {
    const pad = n => String(n).padStart(2, '0');

    // Validação e formatação de data
    const isValidDateKey = str => typeof str === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(str) && new Date(str+'T12:00:00').getDate()===Number(str.slice(8,10));
    const inRange = (date, start, end) => !!date && (!start || date >= start) && (!end || date <= end);
    const cents = value => Math.round((Number(value)||0)*100);
    const sum = rows => rows.reduce((total,row)=>total+cents(row.amount),0)/100;
    const cashDay = row => typeof TherapyManagementRules!=='undefined'?TherapyManagementRules.cashDate(row):extractDay(row.paidAt||row.date);
    const dueDay = row => typeof TherapyManagementRules!=='undefined'?TherapyManagementRules.dueDate(row):extractDay(row.dueDate||row.date);
    const ongoing = patient => !patient.archived && patient.crm?.stage==='ongoing';

    function addDays(dateStr, days) {
        const [y, m, d] = dateStr.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        dt.setDate(dt.getDate() + days);
        return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
    }

    function addMonths(yearMonthStr, months) {
        const [y, m] = yearMonthStr.split('-').map(Number);
        const dt = new Date(y, m - 1 + months, 1);
        return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}`;
    }

    const monthLabels = {
        '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
        '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
        '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez'
    };

    function formatMonth(yearMonthStr) {
        if (!yearMonthStr || typeof yearMonthStr !== 'string') return '';
        const parts = yearMonthStr.split('-');
        if (parts.length < 2) return yearMonthStr;
        const [y, m] = parts;
        return `${monthLabels[m] || m}/${y.slice(2)}`;
    }

    /**
     * Calcula o intervalo atual e o período anterior equivalente
     * @param {string} horizon - '30d' | '90d' | '6m' | '12m' | 'current_year'
     * @param {string} today - 'YYYY-MM-DD'
     */
    function getInterval(horizon = '6m', today = null) {
        const refToday = today && isValidDateKey(today) ? today : (typeof TherapyData !== 'undefined' ? TherapyData.dateKey() : new Date().getFullYear()+'-'+pad(new Date().getMonth()+1)+'-'+pad(new Date().getDate()));
        const [refYear, refMonth, refDay] = refToday.split('-').map(Number);

        let start = '';
        let end = refToday;
        let prevStart = '';
        let prevEnd = '';
        let months = [];

        if (horizon === '30d') {
            start = addDays(refToday, -29);
            prevEnd = addDays(start, -1);
            prevStart = addDays(prevEnd, -29);

            // Meses envolvidos
            const sM = start.slice(0, 7);
            const eM = end.slice(0, 7);
            let cur = sM;
            while (cur <= eM) {
                months.push(cur);
                cur = addMonths(cur, 1);
            }
        } else if (horizon === '90d') {
            start = addDays(refToday, -89);
            prevEnd = addDays(start, -1);
            prevStart = addDays(prevEnd, -89);

            const sM = start.slice(0, 7);
            const eM = end.slice(0, 7);
            let cur = sM;
            while (cur <= eM) {
                months.push(cur);
                cur = addMonths(cur, 1);
            }
        } else if (horizon === '12m') {
            const startMonth = addMonths(refToday.slice(0, 7), -11);
            start = `${startMonth}-01`;

            const prevStartMonth = addMonths(startMonth, -12);
            const prevEndMonth = addMonths(startMonth, -1);
            prevStart = `${prevStartMonth}-01`;
            const lastDayOfPrevEnd = new Date(Number(prevEndMonth.slice(0, 4)), Number(prevEndMonth.slice(5, 7)), 0).getDate();
            prevEnd = `${prevEndMonth}-${pad(lastDayOfPrevEnd)}`;

            let cur = startMonth;
            for (let i = 0; i < 12; i++) {
                months.push(cur);
                cur = addMonths(cur, 1);
            }
        } else if (horizon === 'current_year') {
            start = `${refYear}-01-01`;
            prevStart = `${refYear - 1}-01-01`;
            prevEnd = `${refYear - 1}-${pad(refMonth)}-${pad(refDay)}`;

            let cur = `${refYear}-01`;
            const endMonth = refToday.slice(0, 7);
            while (cur <= endMonth) {
                months.push(cur);
                cur = addMonths(cur, 1);
            }
        } else {
            // Padrão: 6 meses ('6m')
            const startMonth = addMonths(refToday.slice(0, 7), -5);
            start = `${startMonth}-01`;

            const prevStartMonth = addMonths(startMonth, -6);
            const prevEndMonth = addMonths(startMonth, -1);
            prevStart = `${prevStartMonth}-01`;
            const lastDayOfPrevEnd = new Date(Number(prevEndMonth.slice(0, 4)), Number(prevEndMonth.slice(5, 7)), 0).getDate();
            prevEnd = `${prevEndMonth}-${pad(lastDayOfPrevEnd)}`;

            let cur = startMonth;
            for (let i = 0; i < 6; i++) {
                months.push(cur);
                cur = addMonths(cur, 1);
            }
        }

        // Comparação imediatamente anterior, com a mesma quantidade de dias.
        const length = Math.round((new Date(end+'T12:00:00Z')-new Date(start+'T12:00:00Z'))/86400000)+1;
        if(horizon==='current_year'){const lastDay=new Date(refYear-1,refMonth,0).getDate();prevEnd=`${refYear-1}-${pad(refMonth)}-${pad(Math.min(refDay,lastDay))}`;}
        else {prevEnd=addDays(start,-1);prevStart=addDays(prevEnd,-length+1);}

        const horizonLabels = {
            '30d': 'Últimos 30 dias',
            '90d': 'Últimos 90 dias',
            '6m': 'Últimos 6 meses',
            '12m': 'Últimos 12 meses',
            'current_year': 'Ano atual'
        };

        return {
            horizon,
            label: horizonLabels[horizon] || 'Período selecionado',
            start,
            end,
            prevStart,
            prevEnd,
            months,
            today: refToday
        };
    }

    /**
     * Calcula variação percentual entre valor atual e anterior
     */
    function calculateDelta(current, previous) {
        const cur = Number(current) || 0;
        const prev = Number(previous) || 0;
        if (prev === 0) {
            if (cur === 0) return { percent: 0, text: '0%', direction: 'neutral' };
            return { percent: null, text: 'Sem base anterior', direction: 'neutral' };
        }
        const delta = ((cur - prev) / Math.abs(prev)) * 100;
        const rounded = Math.round(delta * 10) / 10;
        const sign = rounded > 0 ? '+' : '';
        const direction = rounded > 0 ? 'positive' : rounded < 0 ? 'negative' : 'neutral';
        return {
            percent: rounded,
            text: `${sign}${rounded.toLocaleString('pt-BR')}%`,
            direction
        };
    }

    /**
     * Converte datas para chave dia
     */
    function extractDay(value) {
        if (!value) return '';
        if (typeof TherapyAgendaRules !== 'undefined' && TherapyAgendaRules.validDate(value)) return value;
        const day=String(value).slice(0,10);return isValidDateKey(day)?day:'';
    }

    /**
     * Agrega dados de receita e agendamentos mês a mês
     */
    function aggregateMonthlySeries(data, monthsList, interval = {}) {
        const financial = Array.isArray(data.financial) ? data.financial : [];
        const appointments = Array.isArray(data.appointments) ? data.appointments : [];
        const R = typeof TherapyManagementRules !== 'undefined' ? TherapyManagementRules : null;

        const series = monthsList.map(month => {
            const label = formatMonth(month);

            // Filtro financeiro do mês (regime de caixa para recebidos/pagos)
            const monthFin = financial.filter(f => {
                if (f.cancelledAt) return false;
                const cDate = cashDay(f);
                return cDate && cDate.startsWith(month) && inRange(cDate,interval.start,interval.end);
            });

            // Receitas realizadas
            const paidIncome = monthFin.filter(f => f.type === 'income' && f.source !== 'reversal' && f.paymentStatus !== 'pending');
            const refunds = monthFin.filter(f => f.type === 'expense' && f.source === 'reversal' && f.paymentStatus !== 'pending');
            const grossIncome = paidIncome.reduce((s, f) => s + (Number(f.amount) || 0), 0);
            const totalRefunds = refunds.reduce((s, f) => s + (Number(f.amount) || 0), 0);
            const netIncome = Math.round((grossIncome - totalRefunds) * 100) / 100;

            // Despesas operacionais do mês
            const expenses = monthFin.filter(f => f.type === 'expense' && f.source !== 'reversal' && f.paymentStatus !== 'pending');
            const totalExpenses = expenses.reduce((s, f) => s + (Number(f.amount) || 0), 0);

            // A receber previstos para o mês
            const pendingMonth = financial.filter(f => {
                if (f.cancelledAt || f.type !== 'income' || f.paymentStatus !== 'pending') return false;
                const dDate = dueDay(f);
                return dDate && dDate.startsWith(month) && inRange(dDate,interval.start,interval.end);
            });
            const totalPending = pendingMonth.reduce((s, f) => s + (Number(f.amount) || 0), 0);

            // Agendamentos do mês
            const monthApps = appointments.filter(a => a.date && a.date.startsWith(month) && inRange(a.date,interval.start,interval.end));
            const completed = monthApps.filter(a => a.status === 'completed').length;
            const noShow = monthApps.filter(a => a.status === 'no_show').length;
            const cancelled = monthApps.filter(a => a.status === 'cancelled').length;
            const scheduled = monthApps.filter(a => ['scheduled', 'confirmed', 'in_progress'].includes(a.status)).length;
            const total = monthApps.length;

            const denominator = completed + noShow;
            const attendanceRate = denominator > 0 ? Math.round((completed / denominator) * 1000) / 10 : null;

            return {
                month,
                label,
                income: netIncome,
                grossIncome: Math.round(grossIncome * 100) / 100,
                refunds: Math.round(totalRefunds * 100) / 100,
                expense: Math.round(totalExpenses * 100) / 100,
                balance: Math.round((netIncome - totalExpenses) * 100) / 100,
                pending: Math.round(totalPending * 100) / 100,
                completed,
                noShow,
                cancelled,
                scheduled,
                total,
                attendanceRate
            };
        });

        return series;
    }

    /**
     * Calcula indicadores consolidados de um intervalo
     */
    function computePeriodStats(data, start, end) {
        const financial = Array.isArray(data.financial) ? data.financial : [];
        const appointments = Array.isArray(data.appointments) ? data.appointments : [];
        const patients = Array.isArray(data.patients) ? data.patients : [];
        const R = typeof TherapyManagementRules !== 'undefined' ? TherapyManagementRules : null;

        // Financeiro do período
        const inPeriodCash = financial.filter(f => {
            if (f.cancelledAt) return false;
            const date = cashDay(f);
            return date && (!start || date >= start) && (!end || date <= end);
        });

        const paidIncome = inPeriodCash.filter(f => f.type === 'income' && f.source !== 'reversal' && f.paymentStatus !== 'pending');
        const refunds = inPeriodCash.filter(f => f.type === 'expense' && f.source === 'reversal' && f.paymentStatus !== 'pending');
        const grossIncome = paidIncome.reduce((s, f) => s + (Number(f.amount) || 0), 0);
        const totalRefunds = refunds.reduce((s, f) => s + (Number(f.amount) || 0), 0);
        const income = Math.round((grossIncome - totalRefunds) * 100) / 100;

        // A receber com vencimento no período
        const inPeriodPending = financial.filter(f => {
            if (f.cancelledAt || f.type !== 'income' || f.paymentStatus !== 'pending') return false;
            const date = dueDay(f);
            return date && (!start || date >= start) && (!end || date <= end);
        });
        const pending = inPeriodPending.reduce((s, f) => s + (Number(f.amount) || 0), 0);

        // Agendamentos no período
        const inPeriodApps = appointments.filter(a => a.date && (!start || a.date >= start) && (!end || a.date <= end));
        const completed = inPeriodApps.filter(a => a.status === 'completed').length;
        const noShow = inPeriodApps.filter(a => a.status === 'no_show').length;
        const cancelled = inPeriodApps.filter(a => a.status === 'cancelled').length;
        const totalAppointments = inPeriodApps.length;

        // Comparecimento
        const denominator = completed + noShow;
        const attendanceRate = denominator > 0 ? Math.round((completed / denominator) * 1000) / 10 : null;

        // Ticket Médio
        const averageTicket = completed > 0 ? Math.round((income / completed) * 100) / 100 : 0;

        // Novos Pacientes
        const newPatients = patients.filter(p => {
            const created = p.createdAt ? p.createdAt.slice(0, 10) : '';
            return created && (!start || created >= start) && (!end || created <= end);
        }).length;

        return {
            income,
            grossIncome,
            refunds: totalRefunds,
            pending: Math.round(pending * 100) / 100,
            completed,
            noShow,
            cancelled,
            totalAppointments,
            attendanceRate,
            averageTicket,
            newPatients
        };
    }

    /**
     * Calcula todos os KPIs com comparativo do período anterior
     */
    function computeKPIs(data, interval) {
        const cur = computePeriodStats(data, interval.start, interval.end);
        const prev = computePeriodStats(data, interval.prevStart, interval.prevEnd);
        const activePatientsCount = (data.patients || []).filter(ongoing).length;

        // Variações
        const incomeDelta = calculateDelta(cur.income, prev.income);
        const appointmentsDelta = calculateDelta(cur.completed, prev.completed);
        const ticketDelta = calculateDelta(cur.averageTicket, prev.averageTicket);
        const newPatientsDelta = calculateDelta(cur.newPatients, prev.newPatients);

        // Variação em pontos percentuais para taxa de comparecimento
        let attendanceDelta = { text: 'Estável', direction: 'neutral' };
        if (cur.attendanceRate !== null && prev.attendanceRate !== null) {
            const diff = Math.round((cur.attendanceRate - prev.attendanceRate) * 10) / 10;
            const sign = diff > 0 ? '+' : '';
            attendanceDelta = {
                text: `${sign}${diff.toLocaleString('pt-BR')} p.p.`,
                direction: diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral'
            };
        } else if (cur.attendanceRate !== null) {
            attendanceDelta = { text: 'Base inicial', direction: 'neutral' };
        }

        return {
            income: {
                current: cur.income,
                previous: prev.income,
                delta: incomeDelta,
                note: 'Caixa líquido realizado no período'
            },
            pending: {
                current: cur.pending,
                previous: prev.pending,
                note: 'Cobranças pendentes com vencimento no período'
            },
            completed: {
                current: cur.completed,
                previous: prev.completed,
                delta: appointmentsDelta,
                note: 'Sessões realizadas com sucesso'
            },
            attendance: {
                current: cur.attendanceRate,
                previous: prev.attendanceRate,
                delta: attendanceDelta,
                note: 'Concluídas ÷ (Concluídas + Faltas)'
            },
            averageTicket: {
                current: cur.averageTicket,
                previous: prev.averageTicket,
                delta: ticketDelta,
                note: 'Receita líquida por sessão concluída'
            },
            patients: {
                active: activePatientsCount,
                newCount: cur.newPatients,
                previousNewCount: prev.newPatients,
                delta: newPatientsDelta,
                note: `${cur.newPatients} novos no período · ${activePatientsCount} ativos hoje`
            }
        };
    }

    /**
     * Agrupa atendimentos e receita por Origem / Convênio
     */
    function computeCoverageDistribution(data, interval) {
        const appointments = (data.appointments || []).filter(a => a.date && a.date >= interval.start && a.date <= interval.end && a.status === 'completed');
        const financial = (data.financial || []).filter(f => {
            if (f.cancelledAt || f.paymentStatus === 'pending' || !(f.type === 'income' && f.source !== 'reversal' || f.type === 'expense' && f.source === 'reversal')) return false;
            const cDate = cashDay(f);
            return cDate && cDate >= interval.start && cDate <= interval.end;
        });

        const C = typeof TherapyCoverageRules !== 'undefined' ? TherapyCoverageRules : null;
        const groups = new Map();

        // Processa atendimentos
        for (const app of appointments) {
            const cov = C ? C.of(app) : (app.coverage || {name:'Não informado',color:'#64748B',kind:'unspecified'});
            const key = (cov.kind||'unspecified')+':'+(cov.planId||cov.name||'Não informado');
            if (!groups.has(key)) {
                groups.set(key, {
                    name: cov.name || 'Não informado',
                    color: cov.color || '#2563EB',
                    kind: cov.kind || 'private',
                    count: 0,
                    income: 0
                });
            }
            groups.get(key).count += 1;
        }

        // Processa financeiro
        for (const fin of financial) {
            const cov = C ? C.of(fin) : (fin.coverage || {name:'Não informado',color:'#64748B',kind:'unspecified'});
            const key = (cov.kind||'unspecified')+':'+(cov.planId||cov.name||'Não informado');
            if (!groups.has(key)) {
                groups.set(key, {
                    name: cov.name || 'Não informado',
                    color: cov.color || '#2563EB',
                    kind: cov.kind || 'private',
                    count: 0,
                    income: 0
                });
            }
            groups.get(key).income += (fin.type==='expense'?-1:1)*(Number(fin.amount)||0);
        }

        const totalCount = appointments.length;
        const result = Array.from(groups.values()).map(g => {
            const percent = totalCount > 0 ? Math.round((g.count / totalCount) * 1000) / 10 : 0;
            return {
                ...g,
                income: Math.round(g.income * 100) / 100,
                percent
            };
        }).sort((a, b) => b.count - a.count || b.income - a.income);

        return {
            totalSessions: totalCount,
            groups: result
        };
    }

    /**
     * Ocupação Semanal por dia e turno (Manhã, Tarde, Noite)
     */
    function computeScheduleOccupancy(data, interval) {
        const appointments = (data.appointments || []).filter(a => {
            return a.date && a.date >= interval.start && a.date <= interval.end && !['cancelled', 'no_show'].includes(a.status);
        });

        const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        // Índices de Date.getDay(): 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
        const grid = {
            morning: [0, 0, 0, 0, 0, 0],   // 07h às 11h59
            afternoon: [0, 0, 0, 0, 0, 0], // 12h às 17h59
            evening: [0, 0, 0, 0, 0, 0]    // 18h às 22h
        };

        let maxCell = 0;
        let totalCount = 0;

        for (const a of appointments) {
            if (!a.date || !a.time) continue;
            const [y, m, d] = a.date.split('-').map(Number);
            const dayOfWeek = new Date(y, m - 1, d).getDay(); // 0 a 6
            if (dayOfWeek < 1 || dayOfWeek > 6) continue; // Desconsidera Domingo por padrão no consultório

            const dayIdx = dayOfWeek - 1; // 0=Seg ... 5=Sáb
            const hour = Number(a.time.slice(0, 2));
            if(!Number.isFinite(hour)||hour<7||hour>=22)continue;

            let shift = 'afternoon';
            if (hour < 12) shift = 'morning';
            else if (hour >= 18) shift = 'evening';

            grid[shift][dayIdx] += 1;
            totalCount += 1;
            if (grid[shift][dayIdx] > maxCell) {
                maxCell = grid[shift][dayIdx];
            }
        }

        return {
            dayNames,
            grid,
            maxCell: maxCell || 1,
            totalCount
        };
    }

    /**
     * Aging de Contas a Receber (Vencidos e A Vencer)
     */
    function computeReceivablesAging(data, today) {
        const refToday = today || (typeof TherapyData !== 'undefined' ? TherapyData.dateKey() : new Date().toISOString().slice(0, 10));
        const financial = Array.isArray(data.financial) ? data.financial : [];

        const pending = financial.filter(f => !f.cancelledAt && f.type === 'income' && f.paymentStatus === 'pending');

        const buckets = {
            current: { label: 'Em dia / sem vencimento informado', amount: 0, count: 0 },
            upTo30: { label: 'Vencidos até 30 dias', amount: 0, count: 0 },
            from31To60: { label: 'Vencidos de 31 a 60 dias', amount: 0, count: 0 },
            over60: { label: 'Vencidos há mais de 60 dias', amount: 0, count: 0 }
        };

        for (const f of pending) {
            const dueDate = dueDay(f);
            const amount = Number(f.amount) || 0;

            if (!dueDate || dueDate >= refToday) {
                buckets.current.amount += amount;
                buckets.current.count += 1;
            } else {
                // Cálculo de dias de atraso
                const diffTime = Math.abs(new Date(refToday + 'T12:00:00') - new Date(dueDate + 'T12:00:00'));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 30) {
                    buckets.upTo30.amount += amount;
                    buckets.upTo30.count += 1;
                } else if (diffDays <= 60) {
                    buckets.from31To60.amount += amount;
                    buckets.from31To60.count += 1;
                } else {
                    buckets.over60.amount += amount;
                    buckets.over60.count += 1;
                }
            }
        }

        const totalOverdue = buckets.upTo30.amount + buckets.from31To60.amount + buckets.over60.amount;
        const totalPending = buckets.current.amount + totalOverdue;

        return {
            totalPending: Math.round(totalPending * 100) / 100,
            totalOverdue: Math.round(totalOverdue * 100) / 100,
            buckets: {
                current: { ...buckets.current, amount: Math.round(buckets.current.amount * 100) / 100 },
                upTo30: { ...buckets.upTo30, amount: Math.round(buckets.upTo30.amount * 100) / 100 },
                from31To60: { ...buckets.from31To60, amount: Math.round(buckets.from31To60.amount * 100) / 100 },
                over60: { ...buckets.over60, amount: Math.round(buckets.over60.amount * 100) / 100 }
            }
        };
    }

    /**
     * Projeções transparentes, éticas e responsáveis (Fase 1)
     */
    function computeProjections(data, today) {
        const refToday=today||getInterval().today,month=refToday.slice(0,7),start=addDays(refToday,-89);
        const appointments=data.appointments||[],financial=data.financial||[],patients=data.patients||[];
        const completed=appointments.filter(a=>a.status==='completed'&&inRange(a.date,start,refToday));
        const last30=addDays(refToday,-30);
        const inactive=patients.filter(ongoing).filter(p=>{
            const apps=appointments.filter(a=>a.patientId===p.id);
            if(apps.some(a=>a.date>=refToday&&['scheduled','confirmed','in_progress'].includes(a.status)))return false;
            const last=apps.filter(a=>a.status==='completed'&&a.date<=refToday).map(a=>a.date).sort().at(-1);
            return last&&last<last30;
        });
        const retention={count:inactive.length,patientIds:inactive.map(p=>p.id),patients:inactive.slice(0,5).map(p=>({patientId:p.id})),methodology:'Cadastros em acompanhamento, sem atendimento há mais de 30 dias e sem marcação futura ativa.'};
        if(completed.length<5)return {hasEnoughData:false,retention,message:'Base de dados inicial ou recente insuficiente. São necessários ao menos 5 atendimentos concluídos nos últimos 90 dias para estimar receitas.'};
        const stats=computePeriodStats(data,start,refToday),monthStats=computePeriodStats(data,month+'-01',refToday);
        const attendance=stats.attendanceRate===null?0:stats.attendanceRate/100;
        const completedIds=new Set(completed.map(a=>a.id));
        const direct=financial.filter(f=>!f.cancelledAt&&f.type==='income'&&f.source!=='reversal'&&f.paymentStatus!=='pending'&&!f.packageId&&completedIds.has(f.appointmentId)&&inRange(cashDay(f),start,refToday));
        const paidSessionIds=new Set(direct.map(f=>f.appointmentId));
        const ticket=paidSessionIds.size?sum(direct)/paidSessionIds.size:null;
        const pending=financial.filter(f=>!f.cancelledAt&&f.type==='income'&&f.paymentStatus==='pending'&&dueDay(f).startsWith(month));
        const future=appointments.filter(a=>a.date>refToday&&a.date.startsWith(month)&&['scheduled','confirmed'].includes(a.status)).sort((a,b)=>a.date.localeCompare(b.date));
        const balances=new Map();let packageSessions=0;
        for(const pack of data.packages||[]){
            const info=typeof TherapyManagementRules!=='undefined'?TherapyManagementRules.packageInfo(data,pack,refToday):null;
            const available=info?.available||0;packageSessions+=available;
            if(available)balances.set(pack.id,{patientId:pack.patientId,balance:available,date:pack.date||'',expiresAt:pack.expiresAt||''});
        }
        let extra=0,unpriced=0;
        for(const app of future){
            // Uma cobrança já registrada representa este atendimento; não estimá-la novamente.
            if(financial.some(f=>!f.cancelledAt&&f.type==='income'&&f.appointmentId===app.id))continue;
            const pack=[...balances.values()].find(p=>p.patientId===app.patientId&&p.balance>0&&(!p.date||p.date<=app.date)&&(!p.expiresAt||p.expiresAt>=app.date));
            if(pack){pack.balance--;continue;}
            const recorded=typeof app.fee==='number'&&Number.isFinite(app.fee)&&app.fee>=0?app.fee:ticket;
            if(recorded===null){unpriced++;continue;}
            extra+=recorded*attendance;
        }
        const actual=monthStats.income,receivables=sum(pending),round=value=>Math.round(value*100)/100;
        const average=stats.income/3;
        return {hasEnoughData:true,retention,currentMonth:{incomeSoFar:actual,pendingSoFar:receivables,futureSessionsCount:future.length,unpricedSessions:unpriced,range:{min:actual,expected:round(actual+receivables+extra)},methodology:'Recebido líquido até hoje versus cenário com recebíveis do mês e sessões futuras ponderadas pelo comparecimento recente. Recebíveis não são garantidos. Cobranças vinculadas e saldo válido de pacotes não geram receita adicional nesta conta. '+(unpriced?unpriced+' sessão(ões) sem valor conhecido foram excluídas.':'')},nextQuarter:{monthlyRunRate:round(average),validPackageSessions:packageSessions,range:{min:round(Math.min(average*2.5,average*3)),expected:round(Math.max(average*2.5,average*3))},methodology:'Cenários de 2,5 e 3 vezes da média mensal de caixa líquido dos últimos 90 dias. Saldo de pacotes é contexto de atendimentos já contratados; não é somado como receita nova.'}};
    }


    return {
        getInterval,
        calculateDelta,
        aggregateMonthlySeries,
        computePeriodStats,
        computeKPIs,
        computeCoverageDistribution,
        computeScheduleOccupancy,
        computeReceivablesAging,
        computeProjections,
        formatMonth
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TherapyStrategyRules;
}
