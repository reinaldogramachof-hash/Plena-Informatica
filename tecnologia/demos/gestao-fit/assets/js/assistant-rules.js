/* Assistente local: preparar não é enviar, contatar não é confirmar presença ou pagamento. */
const FitAssistantRules = (() => {
    const clone = FitData.clone;
    const defaults = { version: 1, enabled: true, confirmationDays: 1, renewalDays: 7, returnDays: 14, paymentDays: 3, templates: {
        confirmation: 'Olá, {aluno}! Podemos confirmar nossa aula de {data}, às {hora}? {profissional}',
        renewal: 'Olá, {aluno}! A vigência do seu plano {plano} termina em {data}. Podemos conversar sobre a continuidade? {profissional}',
        return: 'Olá, {aluno}! Gostaria de combinar seus próximos horários? Fico à disposição. {profissional}',
        payment: 'Olá, {aluno}! Podemos conferir o vencimento de {data} do seu plano {plano}? {profissional}'
    } };
    const text = (value, max, min = 0) => { if (typeof value !== 'string' || value.trim().length < min || value.length > max) throw new Error('Texto do assistente inválido.'); return value.trim(); };
    const id = value => { if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,160}$/.test(value)) throw new Error('Identidade de contato inválida.'); return value; };
    function config(data) { const c = data.settings.assistant || {}; return { ...clone(defaults), ...clone(c), templates: { ...defaults.templates, ...c.templates } }; }
    function validate(data) {
        const c = data.settings.assistant;
        if (c !== undefined) {
            if (!c || typeof c !== 'object' || Array.isArray(c) || c.version !== 1 || typeof c.enabled !== 'boolean' || ['confirmationDays', 'renewalDays', 'returnDays', 'paymentDays'].some(key => !Number.isInteger(c[key]) || c[key] < (key === 'returnDays' ? 1 : 0) || c[key] > 365) || !c.templates || typeof c.templates !== 'object') throw new Error('Preferências do assistente incompatíveis.');
            for (const kind of Object.keys(defaults.templates)) {
                const template = text(c.templates[kind], 2000, 5);
                if ([...template.matchAll(/\{([^{}]+)\}/g)].some(match => !['aluno', 'profissional', 'data', 'hora', 'plano'].includes(match[1]))) throw new Error('Use somente os campos de mensagem apresentados na tela.');
            }
        }
        if (data.assistant === undefined) return data;
        const a = data.assistant, ids = new Set();
        if (!a || a.version !== 1 || !Array.isArray(a.contacts)) throw new Error('Histórico do assistente inválido.');
        for (const log of a.contacts) {
            id(log.id); if (ids.has(log.id)) throw new Error('Contato repetido.'); ids.add(log.id);
            if (!data.clients.some(c => c.id === log.studentId) || !['confirmation', 'renewal', 'return', 'payment'].includes(log.kind) || !['contacted', 'snoozed'].includes(log.outcome) || !Number.isFinite(Date.parse(log.at)) || new Date(log.at).toISOString() !== log.at) throw new Error('Vínculo ou registro de contato inválido.');
            text(log.taskKey, 500, 1); text(log.fingerprint, 2500, 1); text(log.note, 1000); text(log.message, 4000);
            if (log.outcome === 'snoozed' && !FitData.isDate(log.until) || log.outcome === 'contacted' && log.until !== null) throw new Error('Adiamento de contato inválido.');
        }
        return data;
    }
    function saveConfig(data, input) {
        const result = clone(data); result.settings.assistant = { version: 1, enabled: input.enabled, confirmationDays: Number(input.confirmationDays), renewalDays: Number(input.renewalDays), returnDays: Number(input.returnDays), paymentDays: Number(input.paymentDays), templates: clone(input.templates) }; return validate(result);
    }
    function tasks(data, now = new Date()) {
        const settings = config(data); if (!settings.enabled) return [];
        const today = FitData.dateKey(now), rows = [], addDays = FitCommerceRules.addDays;
        const add = (kind, studentId, suffix, date, context, source) => {
            const student = data.clients.find(c => c.id === studentId); if (!student || FitStudentRules.archived(student)) return;
            const taskKey = kind + ':' + suffix, fingerprint = JSON.stringify({ studentId, name: student.name, phone: student.phone || '', preference: student.fitProfile?.contactPreference || '', date, ...context });
            const history = (data.assistant?.contacts || []).filter(log => log.taskKey === taskKey && log.fingerprint === fingerprint), last = history.at(-1);
            const status = last?.outcome === 'contacted' ? 'contacted' : last?.outcome === 'snoozed' && last.until > today ? 'snoozed' : 'pending';
            rows.push({ kind, studentId, taskKey, fingerprint, date, context, source, student, status, last });
        };
        for (const a of data.appointments.filter(a => a.status === 'pending' && a.date >= today && a.date <= addDays(today, settings.confirmationDays) && a.attendance?.confirmation !== 'confirmed')) {
            if (a.date === today && a.time < String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')) continue;
            add('confirmation', a.clientId, a.id, a.date, { time: a.time, location: a.schedule?.location || '', plan: a.serviceName || '' }, { kind: 'appointment', id: a.id });
        }
        for (const e of data.enrollments.filter(e => e.commercial && e.status === 'ativo')) {
            const p = e.commercial.periods.at(-1), end = FitCommerceRules.addDays(p.endDate, -1);
            if (end <= addDays(today, settings.renewalDays)) add('renewal', e.studentId, e.id + ':' + p.id, end, { plan: e.commercial.planName, endDate: p.endDate }, { kind: 'enrollment', id: e.id });
        }
        const activeIds = new Set(data.enrollments.filter(e => e.status === 'ativo' && e.startDate <= today).map(e => e.studentId));
        for (const studentId of activeIds) {
            const lastVisit = data.appointments.filter(a => a.clientId === studentId && a.status === 'done' && a.date <= today).map(a => a.date).sort().at(-1);
            const start = data.enrollments.filter(e => e.studentId === studentId && e.status === 'ativo' && e.startDate <= today).map(e => e.startDate).sort().at(-1), since = [start, lastVisit].filter(Boolean).sort().at(-1);
            if (since && since <= addDays(today, -settings.returnDays)) add('return', studentId, studentId, since, { lastVisit: lastVisit || '', reference: since, plan: '' }, { kind: 'student', id: studentId });
        }
        for (const row of FitCommerceRules.receivables(data).filter(row => row.kind !== 'legacy' && row.amount > 0 && row.studentId && row.date <= addDays(today, settings.paymentDays))) {
            const target = row.kind === 'period' ? { kind: 'period', enrollmentId: row.enrollmentId, periodId: row.periodId } : row.kind === 'account' ? { kind: 'account', accountId: row.accountId } : { kind: 'standalone', appointmentId: row.appointmentId };
            add('payment', row.studentId, row.id, row.date, { plan: row.plan, amount: row.amount }, { kind: 'finance', id: row.enrollmentId || row.appointmentId || row.accountId || '', target });
        }
        return rows.sort((a, b) => a.date.localeCompare(b.date) || a.taskKey.localeCompare(b.taskKey));
    }
    function task(data, taskKey, fingerprint, now = new Date()) { const found = tasks(data, now).find(t => t.taskKey === taskKey && t.fingerprint === fingerprint); if (!found) throw new Error('A pendência mudou. Atualize o assistente e confira o registro de origem.'); return found; }
    function phone(student) {
        if (student.fitProfile?.contactPreference === 'none') throw new Error('O cadastro indica não contatar este aluno.');
        if (student.fitProfile?.contactPreference && student.fitProfile.contactPreference !== 'whatsapp') throw new Error('O aluno prefere outro canal. Confira sua preferência antes de usar WhatsApp.');
        const raw = String(student.phone || '').trim(); if (!/^\+?[0-9 ().-]+$/.test(raw)) throw new Error('Confira o telefone com DDD no cadastro.');
        let digits = raw.replace(/\D/g, ''); if (digits.length === 10 || digits.length === 11) digits = '55' + digits;
        if (!/^\d{8,15}$/.test(digits) || !raw.startsWith('+') && !(digits.startsWith('55') && [12, 13].includes(digits.length))) throw new Error('Confira o telefone e o código do país.'); return digits;
    }
    function message(data, current) {
        if (current.student.fitProfile?.contactPreference === 'none') throw new Error('O aluno indicou que não deseja contato.');
        const values = { aluno: current.student.name, profissional: data.settings.professional?.name || data.settings.businessOwner || '', data: FitData.formatDate(current.date), hora: current.context.time || '', plano: current.context.plan || '' };
        const body = config(data).templates[current.kind].replace(/\{(aluno|profissional|data|hora|plano)\}/g, (_, key) => values[key]);
        return text(body + (data.settings.presentation?.signature ? '\n' + data.settings.presentation.signature : ''), 4000, 5);
    }
    function whatsapp(data, taskKey, fingerprint, reviewed, now = new Date()) { const current = task(data, taskKey, fingerprint, now); return 'https://wa.me/' + phone(current.student) + '?text=' + encodeURIComponent(text(reviewed, 4000, 5)); }
    function record(data, taskKey, fingerprint, input, contactId, now = new Date()) {
        id(contactId); const current = task(data, taskKey, fingerprint, now), result = clone(data);
        result.assistant = result.assistant || { version: 1, contacts: [] };
        if (result.assistant.contacts.some(log => log.id === contactId)) throw new Error('Este contato já foi registrado.');
        if (!['contacted', 'snoozed'].includes(input.outcome) || current.student.fitProfile?.contactPreference === 'none' && input.outcome === 'contacted') throw new Error('Confira a preferência de contato e a ação escolhida.');
        const until = input.outcome === 'snoozed' ? input.until : null;
        if (until !== null && (!FitData.isDate(until) || until <= FitData.dateKey(now) || until > FitCommerceRules.addDays(FitData.dateKey(now), 365))) throw new Error('Adie para uma data futura dentro de um ano.');
        result.assistant.contacts.push({ id: contactId, taskKey, fingerprint, studentId: current.studentId, kind: current.kind, outcome: input.outcome, until, note: text(input.note || '', 1000), message: input.outcome === 'contacted' ? text(input.message || '', 4000) : '', at: now.toISOString() });
        return validate(result);
    }
    function clearOperations(data) { const result = clone(data); if (result.assistant) result.assistant.contacts = []; return result; }
    return { defaults, config, validate, saveConfig, tasks, task, phone, message, whatsapp, record, clearOperations };
})();
