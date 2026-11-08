/* Contas e caixa separados. Todos os movimentos monetários novos usam centavos inteiros. */
const FitFinanceRules = (() => {
    const clone = FitData.clone, C = FitCommerceRules;
    const empty = () => ({ version: 1, accounts: [], adjustments: [], recurrences: [], reconciliations: [] });
    const state = data => data.finance || empty();
    const id = value => { if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,160}$/.test(value)) throw new Error('Identificador financeiro inválido.'); return value; };
    const text = (value, max = 500, min = 0) => { if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) throw new Error('Confira o texto financeiro (' + min + ' a ' + max + ' caracteres).'); return value.trim(); };
    const day = value => { if (!FitData.isDate(value)) throw new Error('Data financeira inválida.'); return value; };
    const stamp = now => { if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new Error('Relógio inválido.'); return now.toISOString(); };
    const money = value => Number.isSafeInteger(value) && value >= 0 && value <= 10000000000;
    const txCents = t => Math.round(t.amount * 100);
    function next(data) { const result = clone(data); result.finance = result.finance || empty(); return result; }
    function key(target) {
        if (!target || typeof target !== 'object') throw new Error('Origem financeira inválida.');
        if (target.kind === 'period') return 'period:' + id(target.enrollmentId) + ':' + id(target.periodId);
        if (target.kind === 'standalone') return 'appointment:' + id(target.appointmentId);
        if (target.kind === 'account') return 'account:' + id(target.accountId);
        throw new Error('Origem financeira inválida.');
    }
    function info(data, target) {
        key(target);
        if (target.kind === 'account') {
            const account = state(data).accounts.find(a => a.id === target.accountId);
            if (!account) throw new Error('Conta não encontrada.');
            return { target, account, priceCents: account.amountCents, date: account.dueDate, studentId: account.studentId, description: account.title, direction: account.kind === 'payable' ? 'expense' : 'income', party: account.party };
        }
        return { ...C.targetInfo(data, target), direction: 'income', party: '' };
    }
    function targets(data) {
        return [
            ...data.enrollments.filter(e => e.commercial).flatMap(e => e.commercial.periods.map(p => ({ kind: 'period', enrollmentId: e.id, periodId: p.id }))),
            ...data.appointments.filter(a => a.status === 'done' && a.billing?.mode === 'standalone').map(a => ({ kind: 'standalone', appointmentId: a.id })),
            ...state(data).accounts.map(a => ({ kind: 'account', accountId: a.id }))
        ];
    }
    function settlement(data, target, asOf = '9999-12-31') {
        const origin = info(data, target), paymentKey = key(target);
        const adjustments = state(data).adjustments.filter(a => key(a.target) === paymentKey && a.date <= asOf);
        const cancellationDate = origin.account?.cancelled && (origin.account.cancelled.date || FitData.dateKey(origin.account.cancelled.at));
        const cancelled = !!cancellationDate && cancellationDate <= asOf;
        const totalCents = cancelled ? 0 : origin.priceCents + adjustments.reduce((sum, a) => sum + a.deltaCents, 0);
        const receipts = data.transactions.filter(t => t.paymentKey === paymentKey && t.date <= asOf && t.finance?.kind !== 'refund');
        const refunds = data.transactions.filter(t => t.paymentKey === paymentKey && t.date <= asOf && t.finance?.kind === 'refund');
        const paidCents = receipts.reduce((sum, t) => sum + txCents(t), 0), refundedCents = refunds.reduce((sum, t) => sum + txCents(t), 0), netCents = paidCents - refundedCents;
        return { ...origin, cancelled, key: paymentKey, originalCents: origin.priceCents, totalCents, paidCents, refundedCents, netCents, remainingCents: Math.max(0, totalCents - netCents), creditCents: Math.max(0, netCents - totalCents), receipts, refunds, adjustments };
    }
    function validate(data) {
        const f = state(data), object = value => value && typeof value === 'object' && !Array.isArray(value);
        const iso = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
        if (!object(f) || f.version !== 1 || ['accounts', 'adjustments', 'recurrences', 'reconciliations'].some(name => !Array.isArray(f[name]))) throw new Error('Base financeira incompatível.');
        const ids = new Set(), unique = value => { id(value); if (ids.has(value)) throw new Error('Identidade financeira repetida.'); ids.add(value); };
        const generated = new Set();
        for (const a of f.accounts) {
            unique(a.id); text(a.title, 160, 2); text(a.party, 160); day(a.dueDate);
            if (!['payable', 'receivable'].includes(a.kind) || !money(a.amountCents) || a.amountCents === 0 || !iso(a.createdAt) || a.studentId !== null && !data.clients.some(c => c.id === a.studentId)) throw new Error('Conta ou vínculo financeiro inválido.');
            if (a.cancelled !== null && (!object(a.cancelled) || !iso(a.cancelled.at) || a.cancelled.at < a.createdAt)) throw new Error('Cancelamento de conta inválido.');
            if (a.cancelled) text(a.cancelled.reason, 500, 5);
            if (a.cancelled?.date !== undefined) day(a.cancelled.date);
            if (a.recurrence !== undefined) {
                const signature = a.recurrence.templateId + ':' + a.recurrence.month;
                if (!f.recurrences.some(t => t.id === a.recurrence.templateId) || !validMonth(a.recurrence.month) || generated.has(signature)) throw new Error('Conta recorrente repetida ou sem modelo.');
                generated.add(signature);
            }
        }
        for (const a of f.adjustments) {
            unique(a.id); const origin = info(data, a.target); day(a.date); text(a.reason, 500, 5);
            if (!Number.isSafeInteger(a.deltaCents) || a.deltaCents === 0 || Math.abs(a.deltaCents) > 10000000000 || !iso(a.createdAt) || origin.account?.cancelled) {
                // Ajustes anteriores ao cancelamento de uma conta permanecem válidos.
                if (!Number.isSafeInteger(a.deltaCents) || a.deltaCents === 0 || Math.abs(a.deltaCents) > 10000000000 || !iso(a.createdAt)) throw new Error('Ajuste financeiro inválido.');
            }
        }
        for (const r of f.recurrences) {
            unique(r.id); text(r.title, 160, 2); text(r.party, 160);
            if (r.id.length > 100 || !money(r.amountCents) || !r.amountCents || !Number.isInteger(r.day) || r.day < 1 || r.day > 31 || !validMonth(r.startMonth) || r.endMonth !== '' && (!validMonth(r.endMonth) || r.endMonth < r.startMonth) || typeof r.active !== 'boolean' || !Number.isInteger(r.revision) || r.revision < 1 || !iso(r.createdAt) || !iso(r.updatedAt) || !Array.isArray(r.history)) throw new Error('Modelo de despesa recorrente inválido.');
            if (r.history.some(h => !object(h) || !iso(h.at) || typeof h.active !== 'boolean' || !Number.isInteger(h.revision))) throw new Error('Histórico da recorrência inválido.');
        }
        const refunds = new Map();
        for (const t of data.transactions.filter(t => t.finance !== undefined)) {
            const meta = t.finance;
            if (!object(meta) || meta.version !== 1 || !['payment', 'refund', 'reversal'].includes(meta.kind) || !money(txCents(t)) || txCents(t) <= 0 || t.amount !== txCents(t) / 100 || !iso(t.createdAt) || !C.methods.includes(t.paymentMethod)) throw new Error('Movimento financeiro inválido.');
            if (meta.kind === 'payment') {
                const origin = info(data, meta.target);
                if (t.paymentKey !== key(meta.target) || t.type !== origin.direction || (t.clientId || null) !== (origin.studentId || null)) throw new Error('Pagamento sem origem correspondente.');
            } else {
                const original = data.transactions.find(source => source.id === meta.originalId);
                if (!original || original.id === t.id || original.finance && original.finance.kind !== 'payment' || meta.kind === 'refund' && !original.paymentKey || meta.kind === 'reversal' && (original.paymentKey || original.finance) || t.type === original.type || t.date < original.date || Number.isFinite(Date.parse(original.createdAt)) && Date.parse(t.createdAt) < Date.parse(original.createdAt)) throw new Error('Estorno sem movimento original válido.');
                text(meta.reason, 500, 5);
                if (meta.kind === 'refund' && (t.paymentKey !== original.paymentKey || key(meta.target) !== original.paymentKey || (t.clientId || null) !== (original.clientId || null))) throw new Error('Devolução com origem incorreta.');
                refunds.set(original.id, (refunds.get(original.id) || 0) + txCents(t));
                if (refunds.get(original.id) > txCents(original)) throw new Error('Estorno excede o movimento original.');
            }
        }
        for (const target of targets(data)) {
            const row = settlement(data, target), allAdjustments = f.adjustments.filter(a => key(a.target) === row.key);
            const maximum = row.originalCents + allAdjustments.reduce((sum, a) => sum + Math.max(0, a.deltaCents), 0);
            if (!money(row.totalCents) || !Number.isSafeInteger(row.netCents) || row.netCents < 0 || row.netCents > maximum || row.account?.cancelled && row.netCents !== 0) throw new Error('Saldo financeiro incompatível com valores e movimentos.');
        }
        for (const r of f.reconciliations) {
            unique(r.id); text(r.note, 500);
            if (!data.transactions.some(t => t.id === r.transactionId) || typeof r.checked !== 'boolean' || !iso(r.at)) throw new Error('Conferência de caixa inválida.');
        }
        return data;
    }
    function account(data, input, accountId, now = new Date()) {
        stamp(now); id(accountId); const result = next(data);
        if (result.finance.accounts.some(a => a.id === accountId)) throw new Error('Esta conta já foi cadastrada.');
        if (!['payable', 'receivable'].includes(input.kind)) throw new Error('Escolha conta a pagar ou receber.');
        if (input.studentId) FitStudentRules.student(data, input.studentId, true);
        const amountCents = C.cents(input.amount); if (!amountCents) throw new Error('Informe valor maior que zero.');
        result.finance.accounts.push({ id: accountId, kind: input.kind, title: text(input.title, 160, 2), party: text(input.party || '', 160), studentId: input.studentId || null, amountCents, dueDate: day(input.dueDate), createdAt: now.toISOString(), cancelled: null });
        return validate(result);
    }
    function pay(data, target, input, transactionId, now = new Date()) {
        stamp(now); id(transactionId); const result = next(data), row = settlement(result, target), amountCents = C.cents(input.amount);
        if (result.transactions.some(t => t.id === transactionId)) throw new Error('Este pagamento já foi registrado. Atualize a consulta.');
        if (row.account?.cancelled || !amountCents || amountCents > row.remainingCents) throw new Error('Valor deve ser maior que zero e não exceder o saldo em aberto.');
        if (day(input.date) > FitData.dateKey(now) || !C.methods.includes(input.method)) throw new Error('Confira data já ocorrida e forma de pagamento.');
        result.transactions.push({ id: transactionId, type: row.direction, amount: amountCents / 100, date: input.date, description: row.description, clientId: row.studentId || null, serviceId: row.planId || null, enrollmentId: target.enrollmentId || null, billingPeriodId: target.periodId || null, appointmentId: target.appointmentId || null, paymentKey: row.key, paymentMethod: input.method, commission: 0, createdAt: now.toISOString(), finance: { version: 1, kind: 'payment', target: clone(target) } });
        return validate(result);
    }
    function adjust(data, target, input, adjustmentId, now = new Date()) {
        stamp(now); id(adjustmentId); const result = next(data), row = settlement(result, target);
        if (result.finance.adjustments.some(a => a.id === adjustmentId)) throw new Error('Este ajuste já foi registrado.');
        const amount = C.cents(input.amount);
        if (!['increase', 'decrease'].includes(input.direction) || !amount || row.account?.cancelled) throw new Error('Confira o ajuste e a situação da conta.');
        const deltaCents = input.direction === 'decrease' ? -amount : amount;
        if (row.totalCents + deltaCents < 0 || row.totalCents + deltaCents > 10000000000) throw new Error('O valor ajustado deve ficar entre zero e o limite financeiro.');
        result.finance.adjustments.push({ id: adjustmentId, target: clone(target), deltaCents, reason: text(input.reason, 500, 5), date: FitData.dateKey(now), createdAt: now.toISOString() });
        return validate(result);
    }
    function targetFromTransaction(t) {
        if (t.finance?.target) return clone(t.finance.target);
        return t.billingPeriodId ? { kind: 'period', enrollmentId: t.enrollmentId, periodId: t.billingPeriodId } : { kind: 'standalone', appointmentId: t.appointmentId };
    }
    function refundable(data, transactionId) {
        const original = data.transactions.find(t => t.id === transactionId);
        if (!original || original.finance && original.finance.kind !== 'payment') throw new Error('Escolha um recebimento ou pagamento original.');
        return { original, remainingCents: txCents(original) - data.transactions.filter(t => t.finance?.originalId === transactionId).reduce((sum, t) => sum + txCents(t), 0) };
    }
    function refund(data, transactionId, input, refundId, now = new Date()) {
        stamp(now); id(refundId); const result = next(data), source = refundable(result, transactionId), amountCents = C.cents(input.amount);
        if (result.transactions.some(t => t.id === refundId)) throw new Error('Este estorno já foi registrado.');
        if (!amountCents || amountCents > source.remainingCents || day(input.date) < source.original.date || input.date > FitData.dateKey(now) || !C.methods.includes(input.method)) throw new Error('Confira o saldo estornável, a data e a forma de devolução.');
        const original = source.original, isLinked = !!original.paymentKey;
        result.transactions.push({ id: refundId, type: original.type === 'income' ? 'expense' : 'income', amount: amountCents / 100, date: input.date, description: 'Estorno: ' + original.description, clientId: original.clientId || null, paymentMethod: input.method, ...(isLinked ? { paymentKey: original.paymentKey } : {}), createdAt: now.toISOString(), commission: 0, finance: { version: 1, kind: isLinked ? 'refund' : 'reversal', originalId: original.id, ...(isLinked ? { target: targetFromTransaction(original) } : {}), reason: text(input.reason, 500, 5) } });
        return validate(result);
    }
    function cancelAccount(data, accountId, reason, now = new Date()) {
        stamp(now); const result = next(data), row = settlement(result, { kind: 'account', accountId });
        if (row.account.cancelled) return result;
        if (row.netCents !== 0) throw new Error('Estorne os movimentos desta conta antes de cancelá-la.');
        row.account.cancelled = { at: now.toISOString(), date: FitData.dateKey(now), reason: text(reason, 500, 5) };
        return validate(result);
    }
    const validMonth = month => typeof month === 'string' && /^\d{4}-\d{2}$/.test(month) && FitData.isDate(month + '-01');
    function recurrence(data, input, templateId, now = new Date()) {
        stamp(now); id(templateId); const result = next(data), old = result.finance.recurrences.find(t => t.id === templateId);
        if (templateId.length > 100 || old && old.revision !== input.expectedRevision) throw new Error('Modelo alterado. Atualize a consulta.');
        const amountCents = C.cents(input.amount), dayOfMonth = Number(input.day);
        if (!amountCents || !['number', 'string'].includes(typeof input.day) || !/^\d+$/.test(String(input.day)) || !Number.isInteger(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31 || !validMonth(input.startMonth) || input.endMonth && (!validMonth(input.endMonth) || input.endMonth < input.startMonth) || typeof input.active !== 'boolean') throw new Error('Confira valor, dia, meses e situação da recorrência.');
        const record = { id: templateId, title: text(input.title, 160, 2), party: text(input.party || '', 160), amountCents, day: dayOfMonth, startMonth: input.startMonth, endMonth: input.endMonth || '', active: input.active, revision: (old?.revision || 0) + 1, createdAt: old?.createdAt || now.toISOString(), updatedAt: now.toISOString(), history: [...(old?.history || []), { at: now.toISOString(), active: input.active, revision: (old?.revision || 0) + 1, amountCents, day: dayOfMonth, title: input.title }] };
        if (old) result.finance.recurrences[result.finance.recurrences.indexOf(old)] = record; else result.finance.recurrences.push(record);
        return validate(result);
    }
    function preview(data, month) {
        if (!validMonth(month)) throw new Error('Selecione uma competência válida.');
        return state(data).recurrences.filter(t => t.active && t.startMonth <= month && (!t.endMonth || month <= t.endMonth) && !state(data).accounts.some(a => a.recurrence?.templateId === t.id && a.recurrence.month === month)).map(t => {
            const last = new Date(Date.parse(C.addMonths(month + '-01', 1) + 'T00:00:00Z') - 86400000).getUTCDate();
            return { templateId: t.id, revision: t.revision, month, title: t.title, party: t.party, amountCents: t.amountCents, dueDate: month + '-' + String(Math.min(t.day, last)).padStart(2, '0') };
        }).sort((a, b) => a.templateId.localeCompare(b.templateId));
    }
    function generate(data, month, expected, now = new Date()) {
        stamp(now); const current = preview(data, month); if (!current.length) return clone(data);
        if (JSON.stringify(current) !== JSON.stringify(expected)) throw new Error('A prévia mudou. Confira novamente antes de gerar.');
        const result = next(data);
        for (const row of current) result.finance.accounts.push({ id: 'rec_' + row.templateId + '_' + month.replace('-', ''), kind: 'payable', title: row.title, party: row.party, studentId: null, amountCents: row.amountCents, dueDate: row.dueDate, createdAt: now.toISOString(), cancelled: null, recurrence: { templateId: row.templateId, month } });
        return validate(result);
    }
    function reconcile(data, transactionId, checked, note, recordId, expectedId = '', now = new Date()) {
        stamp(now); id(recordId); const result = next(data), previous = result.finance.reconciliations.filter(r => r.transactionId === transactionId).at(-1);
        if (!data.transactions.some(t => t.id === transactionId) || typeof checked !== 'boolean' || (previous?.id || '') !== expectedId || result.finance.reconciliations.some(r => r.id === recordId)) throw new Error('A conferência mudou. Reabra o movimento.');
        result.finance.reconciliations.push({ id: recordId, transactionId, checked, note: text(note || '', 500), at: now.toISOString() }); return validate(result);
    }
    function receivables(data) {
        const rows = targets(data).map(target => settlement(data, target)).filter(row => row.direction === 'income' && row.remainingCents > 0).map(row => ({ ...row.target, id: row.key, studentId: row.studentId, name: data.clients.find(c => c.id === row.studentId)?.name || row.party || 'Conta avulsa', plan: row.description, date: row.date, amount: row.remainingCents / 100, status: row.enrollment?.status || 'em_aberto' }));
        for (const e of data.enrollments.filter(e => !e.commercial && e.status !== 'cancelado')) rows.push({ kind: 'legacy', id: e.id, enrollmentId: e.id, studentId: e.studentId, name: data.clients.find(c => c.id === e.studentId)?.name || 'Aluno indisponível', plan: data.services.find(s => s.id === e.planId)?.name || 'Condições anteriores', date: e.dueDate, amount: null, status: e.status });
        return rows.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    }
    function report(data, { from = '', to = FitData.dateKey(), studentId = '' } = {}) {
        if (from) day(from); day(to); if (from && from > to) throw new Error('Confira o período do relatório.');
        const inPeriod = date => (!from || date >= from) && date <= to;
        const cash = data.transactions.filter(t => inPeriod(t.date) && (!studentId || t.clientId === studentId)).slice().sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
        const incomeCents = cash.filter(t => t.type === 'income').reduce((sum, t) => sum + txCents(t), 0), expenseCents = cash.filter(t => t.type === 'expense').reduce((sum, t) => sum + txCents(t), 0);
        const obligations = targets(data).map(target => settlement(data, target, to)).filter(row => inPeriod(row.date) && (!studentId || row.studentId === studentId));
        const appointments = data.appointments.filter(a => inPeriod(a.date) && (!studentId || a.clientId === studentId));
        const sessions = data.enrollments.filter(e => e.commercial && (!studentId || e.studentId === studentId)).flatMap(e => e.commercial.periods.map(p => ({ enrollment: e, period: p, used: e.commercial.uses.filter(u => u.periodId === p.id && u.date <= to).length }))).filter(r => r.period.startDate <= to && (!from || r.period.endDate > from));
        const checked = cash.filter(t => state(data).reconciliations.filter(r => r.transactionId === t.id).at(-1)?.checked).length;
        return { from, to, studentId, cash, incomeCents, expenseCents, balanceCents: incomeCents - expenseCents, obligations, appointments, sessions, checked, unchecked: cash.length - checked, dueIncomeCents: obligations.filter(r => r.direction === 'income').reduce((sum, r) => sum + r.remainingCents, 0), dueExpenseCents: obligations.filter(r => r.direction === 'expense').reduce((sum, r) => sum + r.remainingCents, 0), creditCents: obligations.reduce((sum, r) => sum + r.creditCents, 0) };
    }
    function clearOperations(data) { const result = clone(data); if (result.finance) result.finance = { ...result.finance, accounts: [], adjustments: [], reconciliations: [] }; return result; }
    return { state, key, info, targets, settlement, validate, account, pay, adjust, refund, refundable, targetFromTransaction, cancelAccount, recurrence, preview, generate, reconcile, receivables, report, clearOperations };
})();
