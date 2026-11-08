/* Relacionamento administrativo. Não envia mensagens nem presume consentimento. */
const FitCRMRules = (() => {
    const stages = { unclassified: 'A classificar', prospect: 'Primeiro contato', trial: 'Aula experimental', active: 'Em acompanhamento', paused: 'Em pausa', return: 'Retomar contato', closed: 'Encerrado' };
    const requests = { access: 'Acesso aos dados', correction: 'Correção de dados', deletion: 'Pedido de exclusão', restriction: 'Revisão do uso dos dados', other: 'Outra solicitação' };
    const channels = { internal: 'Registro interno', person: 'Pessoalmente', whatsapp: 'WhatsApp', email: 'E-mail', phone: 'Ligação' };
    const blank = () => ({ version: 1, revision: 0, stage: 'unclassified', source: '', tags: [], nextContact: '', followup: '', privacy: { purpose: '', noticeOn: '', reviewOn: '' }, events: [] });
    const state = c => c.crm || blank();
    const text = (v, max, min = 0) => { if (typeof v !== 'string' || v.trim().length < min || v.length > max) throw new Error('Confira os campos de acompanhamento.'); return v.trim(); };
    const object = v => v && typeof v === 'object' && !Array.isArray(v);
    const validId = v => typeof v === 'string' && /^[A-Za-z0-9_-]{1,160}$/.test(v);
    const stamp = v => typeof v === 'string' && Number.isFinite(Date.parse(v)) && new Date(v).toISOString() === v;
    function validate(c) {
        if (c.crm === undefined) return;
        const r = c.crm;
        if (!object(r) || r.version !== 1 || !Number.isInteger(r.revision) || r.revision < 1 || !Object.hasOwn(stages, r.stage) || !Array.isArray(r.tags) || r.tags.length > 6 || new Set(r.tags).size !== r.tags.length || !object(r.privacy) || !Array.isArray(r.events)) throw new Error('Acompanhamento do aluno incompatível.');
        text(r.source, 100); text(r.followup, 500); for (const tag of r.tags) text(tag, 40, 1);
        text(r.privacy.purpose, 1000);
        for (const value of [r.nextContact, r.privacy.noticeOn, r.privacy.reviewOn]) if (value !== '' && !FitData.isDate(value)) throw new Error('Data do acompanhamento inválida.');
        const ids = new Set();
        for (const event of r.events) {
            if (!object(event) || !validId(event.id) || ids.has(event.id) || !['contact', 'note', 'request', 'response', 'stage'].includes(event.kind) || !FitData.isDate(event.date) || !stamp(event.at)) throw new Error('Histórico de relacionamento inválido.');
            ids.add(event.id); text(event.note, 1500, 1);
            if (event.kind === 'contact' && !Object.hasOwn(channels, event.channel)) throw new Error('Canal de contato inválido.');
            if (event.kind === 'request' && !Object.hasOwn(requests, event.requestType)) throw new Error('Solicitação de dados inválida.');
            if (event.kind === 'response') { const source = r.events.find(row => row.id === event.requestId && row.kind === 'request'); if (!source || source.date > event.date) throw new Error('Resposta sem solicitação válida.'); }
            if (event.kind === 'stage' && (!Object.hasOwn(stages, event.from) || !Object.hasOwn(stages, event.to))) throw new Error('Histórico de etapa inválido.');
        }
    }
    function editable(data, id, revision, now, active = true) {
        if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new Error('Relógio inválido.');
        const next = FitData.clone(data), c = FitStudentRules.student(next, id, active), r = FitData.clone(state(c));
        if (!Number.isInteger(revision) || r.revision !== revision) throw new Error('O acompanhamento mudou. Reabra a ficha antes de salvar.');
        c.crm = r; return { next, c, r };
    }
    function add(r, event, eventId, now) {
        if (!validId(eventId) || r.events.some(e => e.id === eventId)) throw new Error('Este registro já foi utilizado. Reabra a ação.');
        r.events.push({ ...event, id: eventId, at: now.toISOString() }); r.revision++;
    }
    function save(data, id, input, revision, eventId, now = new Date()) {
        const { next, c, r } = editable(data, id, revision, now), previous = r.stage, today = FitData.dateKey(now);
        if (!Object.hasOwn(stages, input.stage)) throw new Error('Escolha uma etapa válida.');
        r.stage = input.stage; r.source = text(input.source || '', 100); r.followup = text(input.followup || '', 500);
        if (!Array.isArray(input.tags)) throw new Error('Confira as etiquetas.'); r.tags = [...new Set(input.tags.map(tag => text(tag, 40, 1)))];
        r.nextContact = input.nextContact || ''; r.privacy = { ...r.privacy, purpose: text(input.purpose || '', 1000), noticeOn: input.noticeOn || '', reviewOn: input.reviewOn || '' };
        if (r.privacy.noticeOn && (!FitData.isDate(r.privacy.noticeOn) || r.privacy.noticeOn > today)) throw new Error('A comunicação de privacidade deve ter uma data ocorrida.');
        add(r, { kind: 'stage', date: today, from: previous, to: r.stage, note: previous === r.stage ? 'Acompanhamento administrativo revisado.' : 'Etapa alterada: ' + stages[previous] + ' → ' + stages[r.stage] }, eventId, now);
        validate(c); return next;
    }
    function record(data, id, input, revision, eventId, now = new Date()) {
        const { next, c, r } = editable(data, id, revision, now, !['request','response'].includes(input.kind));
        if (!['contact', 'note', 'request', 'response'].includes(input.kind) || !FitData.isDate(input.date) || input.date > FitData.dateKey(now)) throw new Error('Confira o tipo e a data do registro.');
        if(input.kind==='response'&&!openRequests(c).some(e=>e.id===input.requestId))throw new Error('A solicitação não está mais pendente.');
        if (input.kind === 'contact' && c.fitProfile?.contactPreference === 'none' && !['internal', 'person'].includes(input.channel)) throw new Error('O aluno indicou que não deseja contato. Registre apenas uma interação interna ou presencial.');
        add(r, { kind: input.kind, date: input.date, note: text(input.note, 1500, 3), ...(input.kind === 'contact' ? { channel: input.channel } : {}), ...(input.kind === 'request' ? { requestType: input.requestType } : {}), ...(input.kind === 'response' ? { requestId: input.requestId } : {}) }, eventId, now);
        validate(c); return next;
    }
    function initials(name) { return (String(name || '').match(/\p{L}+/gu)||[]).slice(0, 3).map(part => part[0].toLocaleUpperCase('pt-BR') + '.').join(' ') || 'Aluno'; }
    function shortName(name) {
        const parts=String(name||'').match(/\p{L}[\p{L}\p{M}'’\-]*/gu)||[];
        return parts.length?[parts[0],...parts.slice(1).map(part=>Array.from(part)[0].toLocaleUpperCase('pt-BR')+'.')].join(' '):'Aluno';
    }
    function openRequests(c) { const r = state(c); return r.events.filter(e => e.kind === 'request' && !r.events.some(answer => answer.kind === 'response' && answer.requestId === e.id)); }
    function project(data, c, names = false, today = FitData.dateKey()) {
        const r = state(c), completed = data.appointments.filter(a => a.clientId === c.id && a.status === 'done' && a.date <= today).map(a => a.date).sort();
        const next = data.appointments.filter(a => a.clientId === c.id && a.status === 'pending' && a.date >= today).map(a => a.date).sort();
        return { id: c.id, label: names ? c.name : shortName(c.name), stage: r.stage, tags: r.tags.slice(), nextContact: r.nextContact, late: !!r.nextContact && r.nextContact < today, lastVisit: completed.at(-1) || '', nextLesson: next[0] || '', requests: openRequests(c).length };
    }
    function list(data, { query = '', status = 'active', stage = 'all', attention = 'all', names = false } = {}, now = new Date()) {
        const today = FitData.dateKey(now);
        return FitStudentRules.list(data, query, status).map(c => project(data, c, names, today)).filter(row => (stage === 'all' || row.stage === stage) && (attention === 'all' || attention === 'due' && row.nextContact && row.nextContact <= today || attention === 'no_next' && !row.nextLesson || attention === 'requests' && row.requests > 0)).sort((a, b) => (a.nextContact || '9999').localeCompare(b.nextContact || '9999') || a.label.localeCompare(b.label) || a.id.localeCompare(b.id));
    }
    return { stages, requests, channels, state, validate, save, record, initials, shortName, openRequests, project, list };
})();
