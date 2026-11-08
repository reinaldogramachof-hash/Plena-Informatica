/* Central de Aprendizado e Autoatendimento — leitura 100% isolada do cofre clínico. */
const TherapyManual = (() => {
    const key = 'mente_manual_progress';
    const D = TherapyManualData;
    const el = id => document.getElementById(id);
    const esc = value => sanitizeHTML(String(value ?? ''));
    const tabs = {
        topics: 'Guia por módulo',
        onboarding: 'Primeiros passos',
        flows: 'Fluxos da rotina',
        troubleshooting: 'Resolva rápido'
    };

    let progress = {};
    let activeTab = 'topics';
    let expandMode = null;
    let forcedOpenTopic = null;
    let highlightTimer = null;

    function highlight(value, rawQuery) {
        const str = String(value ?? '');
        const q = D.fold(rawQuery);
        if (!q || !str) return esc(str);
        let folded = '';
        const map = [];
        for (let i = 0; i < str.length; i += 1) {
            const norm = str[i].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            for (let k = 0; k < norm.length; k += 1) {
                folded += norm[k];
                map.push(i);
            }
        }
        const terms = folded.includes(q) ? [q] : q.split(/\s+/).filter(t => t.length >= 2);
        const ranges = [];
        for (const term of terms) {
            if (!term) continue;
            let from = 0;
            while (from <= folded.length - term.length) {
                const idx = folded.indexOf(term, from);
                if (idx === -1) break;
                ranges.push([map[idx], map[idx + term.length - 1] + 1]);
                from = idx + term.length;
            }
        }
        if (!ranges.length) return esc(str);
        ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        const merged = [ranges[0]];
        for (let i = 1; i < ranges.length; i += 1) {
            const prev = merged[merged.length - 1];
            if (ranges[i][0] <= prev[1]) prev[1] = Math.max(prev[1], ranges[i][1]);
            else merged.push(ranges[i]);
        }
        let out = '';
        let cursor = 0;
        for (const [start, end] of merged) {
            if (start > cursor) out += esc(str.slice(cursor, start));
            out += '<mark class="manual-mark">' + esc(str.slice(start, end)) + '</mark>';
            cursor = end;
        }
        if (cursor < str.length) out += esc(str.slice(cursor));
        return out;
    }

    function actionButton(actionItem) {
        const cls = actionItem.primary ? 'manual-action-primary' : 'therapy-secondary';
        return `<button type="button" class="${cls}" onclick="TherapyManual.runAction('${esc(actionItem.action)}')">${esc(actionItem.label)}</button>`;
    }

    function onboardingState() {
        const s = (typeof db !== 'undefined' && db?.settings) ? db.settings : {};
        const fontCustom = typeof TherapyTypography !== 'undefined' && typeof TherapyTypography.current === 'function' && TherapyTypography.current() !== 100;
        let backupStamp = null;
        try { backupStamp = localStorage.getItem('terapia_backup_requested_at'); } catch {}
        return D.evaluateOnboarding({
            settings: s,
            hasPatients: Array.isArray(db?.patients) && db.patients.length > 0,
            hasAppointments: Array.isArray(db?.appointments) && db.appointments.length > 0,
            hasSessions: Array.isArray(db?.sessions) && db.sessions.length > 0,
            backupStamp,
            fontCustom
        });
    }

    function syncTabs(focusTab = false) {
        document.querySelectorAll('[data-manual-tab]').forEach(btn => {
            const selected = btn.dataset.manualTab === activeTab;
            btn.setAttribute('aria-selected', String(selected));
            btn.tabIndex = selected ? 0 : -1;
        });
        for (const id of Object.keys(tabs)) {
            const panel = el('manual-panel-' + id);
            if (panel) panel.hidden = id !== activeTab;
        }
        if (focusTab) el('manual-tab-' + activeTab)?.focus({ preventScroll: true });
    }

    function selectTab(value, focusTab = false) {
        if (!Object.hasOwn(tabs, value)) return;
        activeTab = value;
        syncTabs(focusTab);
        render();
    }

    function onFilterChange(source = '') {
        expandMode = null;
        forcedOpenTopic = null;
        if ((source === 'group' || source === 'read') && activeTab !== 'topics') {
            activeTab = 'topics';
            syncTabs(false);
        } else if (source === 'search' && (activeTab === 'onboarding' || activeTab === 'flows')) {
            activeTab = 'topics';
            syncTabs(false);
        }
        render();
    }

    function quickSearch(term) {
        const input = el('manual-search');
        if (!input) return;
        const same = D.fold(input.value) === D.fold(term);
        input.value = same ? '' : term;
        expandMode = null;
        forcedOpenTopic = null;
        if (!same && activeTab !== 'topics' && activeTab !== 'troubleshooting') {
            activeTab = 'topics';
            syncTabs(false);
        }
        render();
    }

    function toggleAll(openAll) {
        expandMode = Boolean(openAll);
        forcedOpenTopic = null;
        render();
    }

    function renderQuickChips(rawQ) {
        const host = el('manual-quick-chips');
        if (!host) return;
        const activeFolded = D.fold(rawQ);
        host.innerHTML = `<span class="manual-chips-label">Temas frequentes:</span>` + D.quickQueries.map(chip => {
            const pressed = activeFolded === D.fold(chip.query);
            return `<button type="button" class="manual-chip" aria-pressed="${pressed}" onclick="TherapyManual.quickSearch('${esc(chip.query)}')">${esc(chip.label)}</button>`;
        }).join('');
    }

    function renderOnboarding(state) {
        const banner = el('manual-onboarding-banner');
        const rawQ = el('manual-search')?.value || '';
        const group = el('manual-group')?.value || '';
        const readFilter = el('manual-read-filter')?.value || '';
        if (banner) {
            if (!rawQ && !group && !readFilter) {
                banner.hidden = false;
                banner.innerHTML = `<div class="manual-banner-copy"><strong>Implantação guiada: ${state.completedCount} de ${state.total} etapas personalizadas</strong><p>Novo no sistema ou com dúvida pontual? Siga o roteiro de primeiros passos ou abra soluções diretas por sintoma.</p></div><div class="manual-action-group"><button type="button" class="therapy-secondary" onclick="TherapyManual.selectTab('onboarding')">Primeiros passos</button><button type="button" class="therapy-secondary" onclick="TherapyManual.selectTab('troubleshooting')">Resolva rápido</button></div>`;
            } else {
                banner.hidden = true;
                banner.replaceChildren();
            }
        }

        const list = el('manual-onboarding-list');
        if (!list) return;
        list.innerHTML = `<div class="manual-section-intro"><div><h3>Primeiros passos no consultório</h3><p>Conferência somente-leitura do ambiente atual (${state.completedCount} de ${state.total} personalizadas). Nenhum dado clínico é alterado ao consultar este painel.</p></div></div>` +
            `<div class="manual-step-cards">` +
            state.steps.map(item => `<article class="manual-step-card" data-status="${esc(item.status)}">
                <div class="manual-step-header">
                    <span class="manual-step-number">Etapa ${item.step} · ${esc(item.time)}</span>
                    <span class="manual-status-badge" data-status="${esc(item.status)}">${esc(item.badge)}</span>
                </div>
                <h4>${esc(item.title)}</h4>
                <p class="manual-step-summary">${esc(item.summary)}</p>
                <ul class="manual-rule-list">${item.items.map(line => `<li>${esc(line)}</li>`).join('')}</ul>
                <div class="manual-action-group">${item.actions.map(actionButton).join('')}</div>
            </article>`).join('') +
            `</div>`;
    }

    function renderFlows(rawQ) {
        const list = el('manual-flows-list');
        if (!list) return;
        const items = rawQ ? D.flows.filter(f => D.matchesQuery(D.flowSearchText(f), rawQ)) : D.flows;
        if (!items.length) {
            list.innerHTML = '<div class="system-card"><p>Nenhum fluxo encontrado para a busca atual. Limpe a busca para visualizar os 4 fluxos da rotina.</p></div>';
            return;
        }
        list.innerHTML = `<div class="manual-section-intro"><div><h3>Fluxos visuais da rotina</h3><p>Entenda a sequência exata entre módulos para operar atendimentos, pacotes, prontuários e backups sem retrabalho.</p></div></div>` +
            items.map(flow => `<article class="manual-flow-card" id="manual-${esc(flow.id)}">
                <div class="manual-flow-header">
                    <div>
                        <span class="manual-tag">${esc(flow.tag)}</span>
                        <h4>${highlight(flow.title, rawQ)}</h4>
                        <p>${highlight(flow.subtitle, rawQ)}</p>
                    </div>
                </div>
                <ol class="manual-flow-steps">
                    ${flow.steps.map((step, idx) => `<li class="manual-flow-step">
                        <span class="manual-flow-index">0${idx + 1}</span>
                        <div>
                            <strong>${highlight(step.title, rawQ)}</strong>
                            <p>${highlight(step.detail, rawQ)}</p>
                        </div>
                    </li>`).join('')}
                </ol>
                <div class="manual-action-group">${flow.actions.map(actionButton).join('')}</div>
            </article>`).join('');
    }

    function renderTroubleCard(item, rawQ) {
        return `<article class="manual-trouble-card" id="manual-trouble-${esc(item.id)}">
            <div class="manual-trouble-head">
                <span class="manual-tag">${esc(item.category)}</span>
                <h4>${highlight(item.question, rawQ)}</h4>
            </div>
            <p class="manual-trouble-cause"><strong>Por que acontece:</strong> ${highlight(item.cause, rawQ)}</p>
            <div class="manual-trouble-fix">
                <strong>Como resolver agora:</strong>
                <ol class="manual-step-list">${item.solution.map(line => `<li>${highlight(line, rawQ)}</li>`).join('')}</ol>
            </div>
            <div class="manual-action-group">${item.actions.map(actionButton).join('')}</div>
        </article>`;
    }

    function renderTroubleshooting(rawQ) {
        const list = el('manual-troubleshooting-list');
        if (!list) return;
        const items = rawQ ? D.troubleshooting.filter(t => D.matchesQuery(D.troubleSearchText(t), rawQ)) : D.troubleshooting;
        if (!items.length) {
            list.innerHTML = '<div class="system-card"><p>Nenhuma situação encontrada para este termo. Experimente palavras como backup, pacote, senha, rascunho ou estorno.</p></div>';
            return;
        }
        list.innerHTML = `<div class="manual-section-intro"><div><h3>Resolva rápido — diagnóstico de dúvidas comuns</h3><p>${items.length} ${items.length === 1 ? 'orientação prática disponível' : 'orientações práticas disponíveis'} para resolver na hora sem precisar aguardar atendimento.</p></div></div>` +
            `<div class="manual-trouble-grid">${items.map(item => renderTroubleCard(item, rawQ)).join('')}</div>`;
    }

    function renderSearchExtras(rawQ) {
        const extras = el('manual-search-extras');
        if (!extras) return;
        const q = D.fold(rawQ);
        if (!q) {
            extras.replaceChildren();
            extras.hidden = true;
            return;
        }
        const matchedTroubles = D.troubleshooting.filter(t => D.matchesQuery(D.troubleSearchText(t), rawQ));
        if (!matchedTroubles.length) {
            extras.replaceChildren();
            extras.hidden = true;
            return;
        }
        extras.hidden = false;
        extras.innerHTML = `<div class="manual-extras-heading"><h3>Soluções rápidas relacionadas (${matchedTroubles.length})</h3><p>Respostas diretas da aba Resolva rápido para o termo pesquisado.</p></div>` +
            `<div class="manual-trouble-grid">${matchedTroubles.map(item => renderTroubleCard(item, rawQ)).join('')}</div>`;
    }

    function renderPrintSheet(state) {
        const sheet = el('manual-print-sheet');
        if (!sheet) return;
        sheet.innerHTML = `<header class="manual-print-header">
            <h2>Gestão Terapia — Guia Rápido de Operação e Segurança</h2>
            <p>Resumo de bolso para consulta local. Nenhum dado de paciente é incluído neste impresso.</p>
        </header>
        <section class="manual-print-block">
            <h3>1. Checklist inicial do consultório</h3>
            <ol>${state.steps.map(s => `<li><strong>${esc(s.title)} (${esc(s.badge)}):</strong> ${esc(s.summary)}</li>`).join('')}</ol>
        </section>
        <section class="manual-print-block">
            <h3>2. Quatro regras essenciais do dia a dia</h3>
            <ul>
                <li><strong>Agendar vs. Registrar atendimento:</strong> reservar horário na Agenda não gera receita nem conclui sessão; use Registrar atendimento após o encontro.</li>
                <li><strong>Pacotes sem cobrança duplicada:</strong> a venda cria uma cobrança única; ao concluir cada sessão em modo Pacote, abate-se 1 unidade sem nova receita.</li>
                <li><strong>Rascunhos protegidos:</strong> salvar rascunho guarda o texto no cofre sem concluir horário, sem cobrar e sem consumir pacote.</li>
                <li><strong>Licença vs. Senha dos Registros:</strong> a Chave de Licença ativa o aplicativo; a Senha dos Registros (12+ caracteres) abre a base e os backups protegidos (.json).</li>
            </ul>
        </section>
        <section class="manual-print-block">
            <h3>3. Rotina de backup e troca de computador</h3>
            <p>Os registros ficam exclusivamente neste navegador. Ao encerrar o expediente, acesse Configurações &gt; Segurança e backup, baixe o arquivo .json protegido, guarde em local externo seguro e selecione-o em Conferir backup sem restaurar. Informe a senha do arquivo e confira se ele corresponde à base salva. Essa conferência não altera os registros. Para migrar de aparelho, ative a licença no novo navegador e restaure esse arquivo com a senha correspondente.</p>
        </section>`;
    }

    function updateTabLabels(topicCount, state, troubleCount) {
        const map = {
            topics: `Guia por módulo (${topicCount})`,
            onboarding: `Primeiros passos (${state.completedCount}/${state.total})`,
            flows: `Fluxos da rotina (${D.flows.length})`,
            troubleshooting: `Resolva rápido (${troubleCount})`
        };
        for (const [id, text] of Object.entries(map)) {
            const btn = el('manual-tab-' + id);
            if (btn) btn.textContent = text;
        }
    }

    function load(preserveTab = false) {
        try {
            progress = TherapySystemRules.progress(
                JSON.parse(localStorage.getItem(key) || '{}'),
                D.topics.map(t => t.id)
            );
        } catch {
            progress = {};
        }
        if (!preserveTab) activeTab = 'topics';
        expandMode = null;
        syncTabs(false);
        render();
    }

    function render() {
        if (!TherapyVault.isOpen()) return;
        const rawQ = el('manual-search')?.value || '';
        const q = D.fold(rawQ);
        const group = el('manual-group')?.value || '';
        const readFilter = el('manual-read-filter')?.value || '';

        const open = new Set(
            [...document.querySelectorAll('#manual-topics details[open]')].map(n => n.dataset.topic)
        );
        if (forcedOpenTopic) open.add(forcedOpenTopic);

        const items = D.topics.filter(t =>
            (!group || t.group === group) &&
            (!readFilter || (readFilter === 'read' ? !!progress[t.id] : !progress[t.id])) &&
            (!q || D.matchesQuery(D.topicSearchText(t), rawQ))
        );

        const count = D.topics.filter(t => progress[t.id]).length;
        const percent = Math.round((count / D.topics.length) * 100);
        el('manual-progress-text').textContent = `${count} de ${D.topics.length} tópicos marcados como lidos · ${percent}%`;
        el('manual-progress-bar').style.width = percent + '%';
        el('manual-progress').setAttribute('aria-valuenow', String(percent));

        const matchedTroublesCount = q
            ? D.troubleshooting.filter(t => D.matchesQuery(D.troubleSearchText(t), rawQ)).length
            : D.troubleshooting.length;

        el('manual-count').textContent = q && matchedTroublesCount
            ? `${items.length} tópico(s) nos módulos · ${matchedTroublesCount} solução(ões) rápida(s)`
            : `${items.length} tópico(s) nos filtros`;

        const expandControls = el('manual-expand-controls');
        if (expandControls) expandControls.hidden = items.length === 0;

        el('manual-topics').innerHTML = items.map((t, index) => {
            const shouldOpen = expandMode === true
                ? true
                : expandMode === false
                    ? forcedOpenTopic === t.id
                    : (open.has(t.id) || (!q && !readFilter && index === 0));
            const readBadge = progress[t.id] ? ' · Concluído' : '';
            return `<details class="system-topic${progress[t.id] ? ' is-read' : ''}" id="manual-${t.id}" data-topic="${t.id}"${shouldOpen ? ' open' : ''}>
                <summary>
                    <span>
                        <small>${esc(t.group)} · Leitura ${esc(t.readTime)}${readBadge}</small>
                        <strong>${highlight(t.title, rawQ)}</strong>
                        <em class="manual-topic-summary">${highlight(t.summary, rawQ)}</em>
                    </span>
                </summary>
                <div>
                    <div class="manual-topic-grid">
                        <section class="manual-topic-block">
                            <h4>Como usar na prática</h4>
                            <ol class="manual-step-list">${t.steps.map(step => `<li>${highlight(step, rawQ)}</li>`).join('')}</ol>
                        </section>
                        <section class="manual-topic-block">
                            <h4>Regras e limites importantes</h4>
                            <ul class="manual-rule-list">${t.rules.map(rule => `<li>${highlight(rule, rawQ)}</li>`).join('')}</ul>
                        </section>
                    </div>
                    <div class="manual-topic-caution"><strong>Ponto de atenção:</strong> ${highlight(t.caution, rawQ)}</div>
                    <div class="system-topic-actions">
                        <label class="system-check"><input type="checkbox" class="manual-check" data-section="${t.id}" ${progress[t.id] ? 'checked' : ''} onchange="TherapyManual.mark('${t.id}',this.checked)">Marcar como lido</label>
                        <div class="manual-action-group">${t.actions.map(actionButton).join('')}</div>
                        ${typeof TherapyTours!=='undefined'?TherapyTours.topicLinks(t.id):''}
                    </div>
                </div>
            </details>`;
        }).join('') || '<div class="system-card"><p>Nenhum tópico de módulo encontrado com esses filtros. Confira abaixo as soluções rápidas ou limpe a busca.</p></div>';

        const state = onboardingState();
        renderQuickChips(rawQ);
        renderOnboarding(state);
        renderFlows(rawQ);
        renderTroubleshooting(rawQ);
        renderSearchExtras(rawQ);
        renderPrintSheet(state);
        updateTabLabels(items.length, state, matchedTroublesCount);
    }

    function mark(id, value) {
        if (!D.topics.some(t => t.id === id) || !TherapyVault.isOpen()) return;
        const next = { ...progress, [id]: !!value };
        try {
            localStorage.setItem(key, JSON.stringify(next));
            progress = next;
        } catch {
            therapyNotice('Não foi possível guardar o progresso neste navegador.', 'error');
        }
        render();
    }

    function openTopic(topicId) {
        if (!D.topics.some(t => t.id === topicId) || !TherapyVault.isOpen()) return;
        if (router('manual') === false) return;
        if (el('manual-search')) el('manual-search').value = '';
        if (el('manual-group')) el('manual-group').value = '';
        if (el('manual-read-filter')) el('manual-read-filter').value = '';
        activeTab = 'topics';
        expandMode = null;
        forcedOpenTopic = topicId;
        syncTabs(false);
        render();
        forcedOpenTopic = null;
        const target = el('manual-' + topicId);
        if (target) {
            target.open = true;
            clearTimeout(highlightTimer);
            document.querySelectorAll('.manual-topic-highlight').forEach(n => n.classList.remove('manual-topic-highlight'));
            target.classList.add('manual-topic-highlight');
            target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            target.querySelector('summary')?.focus({ preventScroll: true });
            highlightTimer = setTimeout(() => target.classList.remove('manual-topic-highlight'), 2400);
        }
    }

    function openForView(viewId) {
        const topicId = D.viewTopics[viewId] || 'install';
        openTopic(topicId);
    }

    function openForCurrentView() {
        if (!TherapyVault.isOpen()) return;
        const activeSection = document.querySelector('.view-section:not(.hide)');
        const viewId = activeSection ? activeSection.id.replace(/^view-/, '') : 'dashboard';
        if (viewId === 'manual') {
            el('manual-search')?.focus();
            return;
        }
        openForView(viewId);
    }

    function runAction(code) {
        if (!TherapyVault.isOpen() || typeof code !== 'string') return;
        const [kind, target] = code.split(':');
        if (kind === 'view' && target) {
            router(target);
        } else if (kind === 'settings' && target) {
            TherapySettings.open(target);
        } else if (kind === 'modal') {
            if (target === 'agenda-settings') {
                if (typeof openTherapyAgendaSettings === 'function') openTherapyAgendaSettings();
            } else if (target === 'coverage') {
                if (typeof TherapyCoverageUI !== 'undefined') TherapyCoverageUI.configure();
            } else if (target === 'assistant') {
                if (router('dashboard') !== false && typeof TherapyAssistant !== 'undefined') TherapyAssistant.show();
            } else if (target === 'password') {
                if (TherapySettings.open('security') !== false) TherapySystem.password();
            }
        } else if (kind === 'fn') {
            if (target === 'backup' && typeof window.downloadBackup === 'function') window.downloadBackup();
            else if (target === 'diagnostic' && router('about') !== false) TherapySystem.diagnostic();
        } else if (kind === 'clinical' && typeof TherapyClinicalReferences !== 'undefined') {
            TherapyClinicalReferences.open(target === 'all' ? '' : target);
        } else if (kind === 'topic' && target) {
            openTopic(target);
        }
    }

    function clear() {
        if (el('manual-search')) el('manual-search').value = '';
        if (el('manual-group')) el('manual-group').value = '';
        if (el('manual-read-filter')) el('manual-read-filter').value = '';
        expandMode = null;
        forcedOpenTopic = null;
        render();
    }

    function resetProgress() {
        if (!confirm('Reiniciar somente as marcações de leitura do Manual?')) return;
        try {
            localStorage.removeItem(key);
            progress = {};
            render();
            therapyNotice('Marcações de leitura reiniciadas.');
        } catch {
            therapyNotice('Não foi possível reiniciar o progresso.', 'error');
        }
    }

    function printGuide() {
        if (!TherapyVault.isOpen()) return;
        renderPrintSheet(onboardingState());
        window.print();
    }

    function reset() {
        clearTimeout(highlightTimer);
        progress = {};
        activeTab = 'topics';
        expandMode = null;
        forcedOpenTopic = null;
        if (el('manual-search')) el('manual-search').value = '';
        if (el('manual-group')) el('manual-group').value = '';
        if (el('manual-read-filter')) el('manual-read-filter').value = '';
        for (const id of [
            'manual-topics',
            'manual-search-extras',
            'manual-onboarding-banner',
            'manual-onboarding-list',
            'manual-flows-list',
            'manual-troubleshooting-list',
            'manual-quick-chips',
            'manual-print-sheet'
        ]) {
            el(id)?.replaceChildren();
        }
        if (el('manual-onboarding-banner')) el('manual-onboarding-banner').hidden = true;
        if (el('manual-search-extras')) el('manual-search-extras').hidden = true;
        if (el('manual-count')) el('manual-count').textContent = '';
        if (el('manual-progress-text')) el('manual-progress-text').textContent = '';
        if (el('manual-progress-bar')) el('manual-progress-bar').style.width = '0%';
        el('manual-progress')?.setAttribute('aria-valuenow', '0');
        syncTabs(false);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const tablist = el('manual-tabs');
        if (!tablist) return;
        tablist.addEventListener('keydown', event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const keys = Object.keys(tabs);
            const at = keys.indexOf(activeTab);
            const next = event.key === 'Home'
                ? keys[0]
                : event.key === 'End'
                    ? keys.at(-1)
                    : keys[(at + (event.key === 'ArrowRight' ? 1 : -1) + keys.length) % keys.length];
            selectTab(next, true);
        });
    });

    return {
        load,
        render,
        mark,
        selectTab,
        onFilterChange,
        quickSearch,
        toggleAll,
        openTopic,
        openForView,
        openForCurrentView,
        runAction,
        clear,
        resetProgress,
        printGuide,
        reset,
        highlight
    };
})();
window.initManual = () => TherapyManual.load();
window.resetManualProgress = () => TherapyManual.resetProgress();
