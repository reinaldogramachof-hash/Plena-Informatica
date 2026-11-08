/* Execuções manuais vinculadas à prescrição histórica. Não alteram presença ou dinheiro. */
const FitTrainingLogRules = (() => {
    const clone = FitData.clone;
    const sessions = data => data.training?.sessions || [];
    const latest = session => session.revisions.at(-1);
    function text(value, label, max, min = 0) {
        if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) throw new Error(label + ': informe de ' + min + ' a ' + max + ' caracteres.');
        return value.trim();
    }
    function id(value) {
        if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,160}$/.test(value)) throw new Error('Identificador de execução inválido.');
        return value;
    }
    function stamp(now) {
        if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new Error('Data de registro inválida.');
        return now.toISOString();
    }
    function integer(value, label, min, max, optional = false) {
        if (optional && (value === '' || value === null || value === undefined)) return null;
        if (!['string', 'number'].includes(typeof value) || !/^\d+$/.test(String(value)) || Number(value) < min || Number(value) > max) throw new Error(label + ' inválido.');
        return Number(value);
    }
    function session(data, key) {
        const found = sessions(data).find(s => s.id === key);
        if (!found) throw new Error('Execução não encontrada.');
        return found;
    }
    function reference(data, programId, versionId, blockId, active = false) {
        const found = FitTrainingRules.version(data, programId, versionId), p = found.program;
        if (p.kind !== 'student') throw new Error('Duplique o modelo para um aluno antes de registrar uma execução.');
        FitStudentRules.student(data, p.studentId, active);
        if (active && p.archived) throw new Error('Reative a ficha antes de registrar uma execução.');
        const block = found.version.blocks.find(b => b.id === blockId);
        if (!block) throw new Error('Divisão não encontrada nesta versão da ficha.');
        return { ...found, block };
    }
    function revision(data, input, ref, revisionId, number, now) {
        id(revisionId);
        if (sessions(data).some(s => s.revisions.some(r => r.id === revisionId))) throw new Error('Esta gravação já foi registrada. Atualize o histórico.');
        if (!FitData.isDate(input.date) || input.date > FitData.dateKey(now) || input.date < ref.version.startsOn) throw new Error('Informe uma data já ocorrida, a partir do início desta versão da ficha.');
        if (!Array.isArray(input.items) || input.items.length !== ref.block.items.length) throw new Error('Confira todos os exercícios da divisão selecionada.');
        const used = new Set();
        const items = input.items.map(item => {
            if (!item || !ref.block.items.some(row => row.id === item.rowId) || used.has(item.rowId)) throw new Error('Exercício repetido ou fora desta divisão.');
            used.add(item.rowId);
            if (!['done', 'partial', 'skipped'].includes(item.status)) throw new Error('Informe a situação de cada exercício.');
            const skipped = item.status === 'skipped';
            const sets = integer(item.sets, 'Séries realizadas', 1, 100, skipped);
            const reps = text(item.reps, 'Repetições ou tempo realizados', 80, skipped ? 0 : 1);
            const load = text(item.load, 'Carga ou orientação realizada', 80);
            if (skipped && (sets !== null || reps || load)) throw new Error('Exercício não realizado deve ficar sem séries, repetições ou carga realizados.');
            return { rowId: item.rowId, status: item.status, sets, reps, load, notes: text(item.notes || '', 'Observação do exercício', 2000) };
        });
        if (items.every(item => item.status === 'skipped')) throw new Error('Registre ao menos um exercício realizado ou parcial.');
        return { id: revisionId, number, date: input.date, recordedOn: FitData.dateKey(now), items, effort: integer(input.effort, 'Esforço percebido', 1, 10, true), notes: text(input.notes || '', 'Observações da execução', 4000), reason: number === 1 ? '' : text(input.reason, 'Motivo da correção', 500, 5), createdAt: stamp(now) };
    }
    function create(data, input, sessionId, revisionId, now = new Date()) {
        stamp(now); id(sessionId);
        if (sessions(data).some(s => s.id === sessionId)) throw new Error('Esta execução já foi registrada. Consulte o histórico.');
        const ref = reference(data, input.programId, input.versionId, input.blockId, true);
        const record = { id: sessionId, studentId: ref.program.studentId, programId: ref.program.id, versionId: ref.version.id, blockId: ref.block.id, createdAt: stamp(now), revisions: [revision(data, input, ref, revisionId, 1, now)], voided: null };
        const result = clone(data);
        result.training.sessions = [...sessions(result), record];
        FitData.validateTraining(result);
        return result;
    }
    function correct(data, key, expectedRevisionId, input, revisionId, now = new Date()) {
        stamp(now);
        const old = session(data, key);
        if (old.voided || latest(old).id !== expectedRevisionId) throw new Error('A execução mudou ou foi cancelada. Reabra o registro atual.');
        if (now.toISOString() < latest(old).createdAt) throw new Error('Confira o relógio: a correção antecede o registro atual.');
        const ref = reference(data, old.programId, old.versionId, old.blockId);
        const entry = revision(data, input, ref, revisionId, old.revisions.length + 1, now);
        const result = clone(data);
        session(result, key).revisions.push(entry);
        FitData.validateTraining(result);
        return result;
    }
    function voidSession(data, key, expectedRevisionId, reason, now = new Date()) {
        stamp(now);
        const old = session(data, key);
        if (latest(old).id !== expectedRevisionId) throw new Error('A execução mudou. Reabra o registro atual.');
        if (old.voided) return clone(data);
        if (now.toISOString() < latest(old).createdAt) throw new Error('Confira o relógio antes de cancelar este registro.');
        const result = clone(data);
        session(result, key).voided = { reason: text(reason, 'Motivo do cancelamento', 500, 5), at: now.toISOString() };
        FitData.validateTraining(result);
        return result;
    }
    function list(data, { studentId = '', programId = '', versionId = '', from = '', to = '', status = 'active' } = {}) {
        if (from && !FitData.isDate(from) || to && !FitData.isDate(to) || from && to && from > to) throw new Error('Confira o período do histórico.');
        return sessions(data).filter(s => (!studentId || s.studentId === studentId) && (!programId || s.programId === programId) && (!versionId || s.versionId === versionId) && (status === 'all' || (status === 'voided' ? !!s.voided : !s.voided)) && (!from || latest(s).date >= from) && (!to || latest(s).date <= to)).slice().sort((a, b) => latest(b).date.localeCompare(latest(a).date) || b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));
    }
    // Somente a mesma linha, divisão e versão: não misturar prescrições ou interpretar textos como carga numérica.
    function compare(data, programId, versionId, blockId, rowId, filters = {}) {
        const ref = reference(data, programId, versionId, blockId);
        const row = ref.block.items.find(row => row.id === rowId);
        if (!row) throw new Error('Exercício não encontrado nesta prescrição.');
        const records = list(data, { ...filters, programId, versionId, status: 'active' }).filter(s => s.blockId === blockId).map(s => ({ session: s, revision: latest(s), item: latest(s).items.find(item => item.rowId === rowId) })).filter(record => record.item && record.item.status !== 'skipped');
        return { ...ref, row, records };
    }
    return { sessions, latest, session, reference, create, correct, voidSession, list, compare };
})();
