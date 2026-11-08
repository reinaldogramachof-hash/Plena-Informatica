/* Registro informado pelo profissional, sem prescrição ou interpretação automática. */
const FitTrainingLog = (() => {
    const R = FitTrainingLogRules, el = id => document.getElementById(id);
    const esc = value => sanitizeHTML(String(value ?? '')), value = id => el(id)?.value || '';
    const labels = { done: 'Realizado', partial: 'Parcial', skipped: 'Não realizado' };
    let draft = null, dirty = false, saving = false, filters = {}, page = 0;
    const input = (id, label, v = '', type = 'text', extra = '') => `<label>${esc(label)}<input id="${id}" type="${type}" value="${esc(v)}" ${extra}></label>`;
    const area = (id, label, v = '', max = 2000) => `<label>${esc(label)}<textarea id="${id}" rows="2" maxlength="${max}">${esc(v)}</textarea></label>`;
    function ensure() { if (!FitSecurity.isOpen()) throw new Error('Abra os registros antes de continuar.'); }
    function safe(fn) { return (...args) => { try { ensure(); if (window.fitActionBusy) return FitSecurity.notice('Aguarde a gravação atual.'); return fn(...args); } catch (error) { FitSecurity.notice(error.message, 'error'); } }; }
    function clearEditor() { draft = null; dirty = false; saving = false; }
    function mayClose() { return !saving && (!dirty || confirm('Há uma execução de treino ainda não salva. Deseja descartá-la?')); }
    function leaveEditor() { return !draft || FitSecurity.closeDialog() !== false; }
    function open(programId, versionId, sessionId = '') {
        if (!leaveEditor()) return;
        const previous = sessionId ? R.session(db, sessionId) : null;
        if (previous?.voided) throw new Error('Este registro foi cancelado. Consulte seu histórico.');
        if (previous) { programId = previous.programId; versionId = previous.versionId; }
        const selected = FitTrainingRules.version(db, programId, versionId), block = selected.version.blocks.find(b => b.id === previous?.blockId) || selected.version.blocks[0];
        R.reference(db, programId, versionId, block.id, !previous);
        const old = previous && R.latest(previous);
        const next = { sessionId: previous?.id || getID(), revisionId: getID(), expected: old?.id || '', programId, versionId, blockId: block.id, date: old?.date || FitData.dateKey(), effort: old?.effort ?? '', notes: old?.notes || '', reason: '', items: block.items.map(row => ({ rowId: row.id, status: '', sets: '', reps: '', load: '', notes: '' })) };
        if (old) next.items = block.items.map(row => FitData.clone(old.items.find(item => item.rowId === row.id)));
        const modal = FitSecurity.dialog(previous ? 'Corrigir execução de treino' : 'Registrar execução de treino', '<div id="fit-training-log-editor"></div>', { layout: 'wide', beforeClose: mayClose, onClose: clearEditor });
        if (!modal) return;
        draft = next; dirty = false; renderEditor();
    }
    function renderEditor() {
        if (!draft) return;
        const ref = R.reference(db, draft.programId, draft.versionId, draft.blockId), c = db.clients.find(c => c.id === ref.program.studentId);
        el('fit-training-log-editor').innerHTML = `<div class="fit-log-context"><strong>${esc(c.name)} · ${esc(ref.version.title)}</strong><p>Versão ${ref.version.number}${ref.version.id !== ref.program.versions.at(-1).id ? ' · versão anterior selecionada' : ''}. Preencha o que foi realizado; a prescrição abaixo é uma referência.</p><p>Este registro não confirma presença nem altera sessões contratadas ou pagamentos.</p></div><form id="fit-training-log-form" oninput="FitTrainingLog.changed()" onchange="FitTrainingLog.changed()" onsubmit="submitFitTrainingLog(event)">${input('fit-log-date', 'Data da execução', draft.date, 'date', 'required min="' + ref.version.startsOn + '" max="' + FitData.dateKey() + '"')}<label>Divisão desta execução<select id="fit-log-block" onchange="FitTrainingLog.changeBlock(this.value)" ${draft.expected ? 'disabled' : ''}>${ref.version.blocks.map(b => `<option value="${b.id}" ${b.id === draft.blockId ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></label>${input('fit-log-effort', 'Esforço percebido (opcional, 1 a 10)', draft.effort, 'number', 'min="1" max="10" step="1"')}${area('fit-log-notes', 'Observações da execução', draft.notes, 4000)}<div class="fit-log-results">${ref.block.items.map((row, index) => {
            const actual = draft.items.find(item => item.rowId === row.id);
            return `<article class="fit-log-result"><div class="fit-log-result-heading"><h3>${index + 1}. ${esc(row.name)}</h3><p>Prescrito: ${row.sets} série(s) · ${esc(row.reps)}${row.load ? ' · ' + esc(row.load) : ''}</p></div><div class="fit-training-row-fields"><label>Situação<select id="fit-log-status-${index}" required><option value="">Informe...</option>${Object.entries(labels).map(([key, label]) => `<option value="${key}" ${key === actual.status ? 'selected' : ''}>${label}</option>`).join('')}</select></label>${input('fit-log-sets-' + index, 'Séries realizadas', actual.sets ?? '', 'number', 'min="1" max="100" step="1"')}${input('fit-log-reps-' + index, 'Repetições ou tempo realizados', actual.reps, 'text', 'maxlength="80"')}${input('fit-log-load-' + index, 'Carga / orientação realizada', actual.load, 'text', 'maxlength="80"')}</div>${area('fit-log-item-notes-' + index, 'Observação deste exercício', actual.notes)}<p class="fit-muted">Para “não realizado”, deixe séries, repetições e carga vazias. Sem carga informada, o histórico exibirá “não informada”.</p></article>`;
        }).join('')}</div>${draft.expected ? area('fit-log-reason', 'Motivo da correção (obrigatório)', draft.reason, 500) : ''}<label class="fit-log-confirm"><input id="fit-log-confirm" type="checkbox" required> Conferi a versão, a divisão e os resultados informados.</label><div class="fit-dialog-actions"><span id="fit-log-draft-state" role="status">${dirty ? 'Alterações ainda não salvas.' : 'Confira os resultados antes de salvar.'}</span><button type="button" onclick="FitSecurity.closeDialog()">Voltar</button><button type="submit">${draft.expected ? 'Salvar correção' : 'Salvar execução'}</button></div></form>`;
    }
    function capture() {
        if (!draft) throw new Error('Abra uma execução antes de continuar.');
        draft.date = value('fit-log-date'); draft.effort = value('fit-log-effort'); draft.notes = value('fit-log-notes'); draft.reason = value('fit-log-reason');
        draft.items.forEach((item, index) => { for (const key of ['status', 'sets', 'reps', 'load']) item[key] = value('fit-log-' + key + '-' + index); item.notes = value('fit-log-item-notes-' + index); });
    }
    function changed() { if (!draft) return; dirty = true; const node = el('fit-log-draft-state'); if (node) node.textContent = 'Alterações ainda não salvas.'; }
    function changeBlock(blockId) {
        if (!draft || draft.expected || blockId === draft.blockId) return;
        const previous = draft.blockId;
        if (dirty && !confirm('Trocar a divisão descarta os resultados digitados. Deseja continuar?')) { el('fit-log-block').value = previous; return; }
        capture();
        const ref = R.reference(db, draft.programId, draft.versionId, blockId, true);
        draft.blockId = blockId; draft.items = ref.block.items.map(row => ({ rowId: row.id, status: '', sets: '', reps: '', load: '', notes: '' })); dirty = true; renderEditor();
    }
    async function submit(event) {
        event.preventDefault(); ensure();
        if (saving) throw new Error('Aguarde a gravação atual.');
        if (!el('fit-log-confirm')?.checked) throw new Error('Confira a versão e os resultados antes de salvar.');
        capture();
        const current = FitData.clone(draft), controls = [...(el('fit-training-log-form')?.querySelectorAll?.('input,select,textarea,button') || [])].filter(control => !control.disabled);
        saving = true; controls.forEach(control => control.disabled = true);
        try {
            db = current.expected ? R.correct(db, current.sessionId, current.expected, current, current.revisionId) : R.create(db, current, current.sessionId, current.revisionId);
            await save(); ensure();
            clearEditor(); FitSecurity.closeDialog();
            if (typeof FitTraining !== 'undefined') FitTraining.render();
            FitSecurity.notice(current.expected ? 'Correção salva. O registro anterior foi preservado.' : 'Execução salva no histórico do aluno.');
            detail(current.sessionId);
        } finally { saving = false; controls.forEach(control => control.disabled = false); }
    }
    function history(studentId = '', programId = '', versionId = '') {
        if (!leaveEditor()) return;
        if (studentId) FitStudentRules.student(db, studentId);
        if (programId) { const p = FitTrainingRules.program(db, programId); if (p.kind !== 'student') throw new Error('Modelos não possuem execuções.'); studentId = p.studentId; if (versionId) FitTrainingRules.version(db, programId, versionId); }
        filters = { studentId, programId, versionId, from: '', to: '', status: 'active' }; page = 0; renderHistory();
    }
    function renderHistory() {
        const records = R.list(db, filters), programs = (db.training?.programs || []).filter(p => p.kind === 'student' && (!filters.studentId || p.studentId === filters.studentId));
        const selected = programs.find(p => p.id === filters.programId), versions = selected?.versions || [], v = versions.find(v => v.id === filters.versionId);
        const pages = Math.max(1, Math.ceil(records.length / 15)); page = Math.max(0, Math.min(page, pages - 1));
        const select = (id, label, options) => `<label>${label}<select id="${id}" onchange="FitTrainingLog.filter()">${options}</select></label>`;
        const option = (id, label, current) => `<option value="${id}" ${id === current ? 'selected' : ''}>${esc(label)}</option>`;
        FitSecurity.dialog('Histórico e evolução dos treinos', `<p>Consulte o realizado e compare os resultados de um exercício na mesma versão da ficha. Valores são os informados pelo profissional.</p><div class="fit-log-filters">${select('fit-log-filter-student', 'Aluno', option('', 'Todos os alunos', filters.studentId) + FitStudentRules.list(db, '', 'all').map(c => option(c.id, c.name + (FitStudentRules.archived(c) ? ' · arquivado' : ''), filters.studentId)).join(''))}${select('fit-log-filter-program', 'Ficha', option('', 'Todas as fichas', filters.programId) + programs.map(p => option(p.id, p.versions.at(-1).title + (p.archived ? ' · arquivada' : ''), filters.programId)).join(''))}${select('fit-log-filter-version', 'Versão', option('', 'Todas as versões', filters.versionId) + versions.map(v => option(v.id, 'Versão ' + v.number + ' · ' + v.title, filters.versionId)).join(''))}${select('fit-log-filter-status', 'Registros', [['active', 'Válidos'], ['voided', 'Cancelados'], ['all', 'Todos']].map(([id, label]) => option(id, label, filters.status)).join(''))}${input('fit-log-filter-from', 'De', filters.from, 'date', 'onchange="FitTrainingLog.filter()"')}${input('fit-log-filter-to', 'Até', filters.to, 'date', 'onchange="FitTrainingLog.filter()"')}</div><div class="fit-log-comparison"><h3>Evolução por exercício</h3>${selected && v ? `<label>Exercício da versão ${v.number}<select id="fit-log-compare-row" onchange="FitTrainingLog.compareSelected()"><option value="">Selecione para comparar...</option>${v.blocks.flatMap(b => b.items.map(row => `<option value="${b.id}:${row.id}">${esc(b.name)} · ${esc(row.name)}</option>`)).join('')}</select></label><div id="fit-log-comparison-result" aria-live="polite"></div>` : '<p class="fit-muted">Selecione uma ficha e uma versão para comparar o mesmo exercício ao longo do tempo.</p>'}</div><p class="fit-muted">${records.length} registro(s) nesta seleção · página ${page + 1} de ${pages}</p><div class="fit-log-history">${records.slice(page * 15, page * 15 + 15).map(s => {
            const ref = R.reference(db, s.programId, s.versionId, s.blockId), r = R.latest(s), name = db.clients.find(c => c.id === s.studentId)?.name;
            return `<article class="fit-log-history-card"><div><strong>${esc(fmtDate(r.date))} · ${esc(name)}</strong><p>${esc(ref.version.title)} · versão ${ref.version.number} · ${esc(ref.block.name)}</p><small>${s.voided ? 'Cancelado · fora da comparação' : r.items.filter(i => i.status !== 'skipped').length + ' exercício(s) realizado(s) ou parcial(is)'}${s.revisions.length > 1 ? ' · corrigido' : ''}</small></div><button type="button" class="fit-secondary" onclick="FitTrainingLog.detail('${s.id}')">Ver registro</button></article>`;
        }).join('') || '<p class="fit-empty">Nenhuma execução nesta seleção. Abra uma ficha individual para registrar o realizado.</p>'}</div><div class="fit-dialog-actions"><button type="button" onclick="FitTrainingLog.movePage(-1)" ${page === 0 ? 'disabled' : ''}>Anterior</button><button type="button" onclick="FitTrainingLog.movePage(1)" ${page === pages - 1 ? 'disabled' : ''}>Próxima</button><button type="button" onclick="FitSecurity.closeDialog()">Fechar</button></div>`, { layout: 'wide' });
    }
    function filter() {
        const next = { studentId: value('fit-log-filter-student'), programId: value('fit-log-filter-program'), versionId: value('fit-log-filter-version'), from: value('fit-log-filter-from'), to: value('fit-log-filter-to'), status: value('fit-log-filter-status') || 'active' };
        if (next.studentId !== filters.studentId) { next.programId = ''; next.versionId = ''; }
        else if (next.programId !== filters.programId) next.versionId = '';
        R.list(db, next); filters = next; page = 0; renderHistory();
    }
    function movePage(delta) { page += delta; renderHistory(); }
    function resultTable(ref, revision) {
        return `<div class="fit-table-scroll"><table class="fit-log-table"><thead><tr><th>Exercício</th><th>Prescrito nesta versão</th><th>Realizado</th></tr></thead><tbody>${ref.block.items.map(row => {
            const item = revision.items.find(item => item.rowId === row.id);
            return `<tr><td>${esc(row.name)}</td><td>${row.sets} série(s) · ${esc(row.reps)} · ${esc(row.load || 'Carga não informada')}</td><td><strong>${labels[item.status]}</strong>${item.status === 'skipped' ? '' : '<br>' + item.sets + ' série(s) · ' + esc(item.reps) + ' · ' + esc(item.load || 'Carga não informada')}${item.notes ? '<p class="fit-training-notes">' + esc(item.notes) + '</p>' : ''}</td></tr>`;
        }).join('')}</tbody></table></div>`;
    }
    function detail(sessionId) {
        if (!leaveEditor()) return;
        const s = R.session(db, sessionId), ref = R.reference(db, s.programId, s.versionId, s.blockId), r = R.latest(s), student = db.clients.find(c => c.id === s.studentId);
        const entry = revision => `<p>${esc(fmtDate(revision.date))} · Esforço: ${revision.effort === null ? 'não informado' : revision.effort + '/10'}</p>${resultTable(ref, revision)}${revision.notes ? '<p class="fit-training-notes">' + esc(revision.notes) + '</p>' : ''}`;
        FitSecurity.dialog('Registro de execução', `<div class="fit-log-context"><strong>${esc(student.name)} · ${esc(ref.version.title)}</strong><p>Versão ${ref.version.number} · ${esc(ref.block.name)} · registro ${s.id}</p><p>Registrado em ${esc(new Date(s.createdAt).toLocaleString('pt-BR'))}</p></div>${s.voided ? `<p class="fit-log-cancelled">Registro cancelado em ${esc(new Date(s.voided.at).toLocaleString('pt-BR'))}: ${esc(s.voided.reason)}. Preservado para consulta; fora da comparação.</p>` : ''}${entry(r)}${r.reason ? '<p>Última correção: ' + esc(r.reason) + '</p>' : ''}${s.revisions.length > 1 ? `<details class="fit-log-revisions"><summary>Ver ${s.revisions.length - 1} registro(s) anterior(es)</summary>${s.revisions.slice(0, -1).reverse().map(old => `<section><h3>Registro ${old.number} · ${esc(new Date(old.createdAt).toLocaleString('pt-BR'))}</h3>${old.reason ? '<p>Motivo: ' + esc(old.reason) + '</p>' : ''}${entry(old)}</section>`).join('')}</details>` : ''}<div class="fit-dialog-actions">${!s.voided ? `<button type="button" onclick="FitTrainingLog.open('${s.programId}','${s.versionId}','${s.id}')">Corrigir registro</button><button type="button" onclick="FitTrainingLog.cancelDialog('${s.id}')">Cancelar registro</button>` : ''}<button type="button" onclick="FitTrainingLog.history('${s.studentId}','${s.programId}')">Ver histórico</button><button type="button" onclick="FitSecurity.closeDialog()">Fechar</button></div>`, { layout: 'wide' });
    }
    function cancelDialog(sessionId) {
        const s = R.session(db, sessionId); if (s.voided) throw new Error('Este registro já foi cancelado.');
        FitSecurity.dialog('Cancelar registro de execução', `<p>O registro continuará disponível para consulta, com seus resultados e correções. Ele deixará de participar da comparação de evolução.</p><form onsubmit="voidFitTrainingLog(event)"><input id="fit-log-cancel-id" type="hidden" value="${s.id}"><input id="fit-log-cancel-expected" type="hidden" value="${R.latest(s).id}">${area('fit-log-cancel-reason', 'Motivo do cancelamento (obrigatório)', '', 500)}<label><input type="checkbox" id="fit-log-cancel-confirm" required> Conferi o registro que será cancelado.</label><div class="fit-dialog-actions"><button type="button" onclick="FitTrainingLog.detail('${s.id}')">Voltar</button><button type="submit">Confirmar cancelamento</button></div></form>`, { layout: 'wide' });
    }
    async function submitVoid(event) {
        event.preventDefault(); ensure();
        if (!el('fit-log-cancel-confirm')?.checked) throw new Error('Confira o registro antes de cancelar.');
        const key = value('fit-log-cancel-id');
        db = R.voidSession(db, key, value('fit-log-cancel-expected'), value('fit-log-cancel-reason')); await save(); ensure();
        FitSecurity.closeDialog(); FitSecurity.notice('Registro cancelado e preservado no histórico.'); detail(key);
    }
    function compareSelected() {
        const target = el('fit-log-comparison-result'), selected = value('fit-log-compare-row');
        if (!selected) { target.replaceChildren(); return; }
        const [blockId, rowId] = selected.split(':'), result = R.compare(db, filters.programId, filters.versionId, blockId, rowId, filters), recent = result.records.slice(0, 2);
        target.innerHTML = `<p class="fit-muted">Comparação dos dois registros válidos mais recentes, pela data da execução, na mesma divisão e versão, dentro do período selecionado. Não realizados e cancelados ficam fora. A situação do filtro de consulta não muda essa regra.</p>${recent.length ? `<div class="fit-log-comparison-cards">${recent.map((record, index) => `<article><span>${index === 0 ? 'Mais recente' : 'Anterior'}</span><h4>${esc(fmtDate(record.revision.date))}</h4><p>${labels[record.item.status]} · ${record.item.sets} série(s)</p><p>${esc(record.item.reps)}</p><strong>${esc(record.item.load || 'Carga não informada')}</strong><p>Esforço da execução: ${record.revision.effort === null ? 'não informado' : record.revision.effort + '/10'}</p><button type="button" class="fit-text-button" onclick="FitTrainingLog.detail('${record.session.id}')">Ver registro</button></article>`).join('')}</div>${recent.length < 2 ? '<p class="fit-muted">Registre outra execução desta prescrição para comparar.</p>' : ''}` : '<p class="fit-muted">Ainda não há resultado realizado ou parcial deste exercício no período.</p>'}<p class="fit-muted">Cargas, repetições e tempos são textos informados. O sistema não calcula percentuais de evolução nem recomenda progressões.</p>`;
    }
    function studentSummary(studentId) {
        const records = R.list(db, { studentId }), last = records[0];
        return `<section class="fit-panel fit-student-sheet"><div class="fit-panel-heading"><h3>Execução e evolução dos treinos</h3><button type="button" class="fit-secondary" onclick="FitTrainingLog.history('${studentId}')">Consultar histórico</button></div><p>${records.length} execução(ões) válida(s)${last ? ' · Última em ' + esc(fmtDate(R.latest(last).date)) : ''}</p><p class="fit-muted">O registro de treino é independente da presença e do saldo de sessões.</p></section>`;
    }
    function reset() { clearEditor(); filters = {}; page = 0; el('fit-training-log-editor')?.replaceChildren(); el('fit-log-comparison-result')?.replaceChildren(); }
    window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
    return { submit, submitVoid, changed, studentSummary, reset, open: safe(open), history: safe(history), detail: safe(detail), cancelDialog: safe(cancelDialog), filter: safe(filter), movePage: safe(movePage), compareSelected: safe(compareSelected), changeBlock: safe(changeBlock) };
})();
function submitFitTrainingLog(event) { return FitTrainingLog.submit(event); }
function voidFitTrainingLog(event) { return FitTrainingLog.submitVoid(event); }
