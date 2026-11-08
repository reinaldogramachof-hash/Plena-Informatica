/* Consulta local; não lê narrativas, não preenche prontuários e não grava dados ou pesquisas. */
const TherapyClinicalReferences = (() => {
    const D = TherapyClinicalData, el = id => document.getElementById(id);
    const esc = value => sanitizeHTML(String(value ?? ''));
    let root = null, opener = null, query = '', category = '', selected = '', scheduled = false;
    const ready = () => typeof TherapyVault !== 'undefined' && TherapyVault.isOpen()
        && !!window.therapyLicenseReady && !!el('view-login')?.classList.contains('hide');
    const visible = node => !!node?.isConnected && !node.closest('[hidden],.hide,.hidden,[inert]') && !!node.getClientRects().length;
    const button = (label, attribute, value = '') => `<button type="button" class="therapy-secondary" ${attribute}="${esc(value)}">${esc(label)}</button>`;
    function close(restore = true) {
        const previous = opener;
        root?.remove(); root = null; opener = null; query = ''; category = ''; selected = '';
        if (restore && ready() && visible(previous)) previous.focus({ preventScroll: true });
    }
    function sourceHTML(id) {
        const source = D.sources[id];
        if (!source || !source.url.startsWith('https://')) return '';
        return `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">${esc(source.title)} — abrir fonte externa</a><br><small>${esc(source.edition)}. Requer conexão.</small></li>`;
    }
    function renderBody(focus = false) {
        const host = el('clinical-body'); if (!host || !ready()) return;
        const entry = D.get(selected);
        if (entry) {
            host.innerHTML = `<article class="clinical-article" aria-labelledby="clinical-entry-title">
                ${button('Voltar aos resultados', 'data-clinical-back')}
                <h3 id="clinical-entry-title" tabindex="-1">${esc(entry.title)}</h3>
                <small>${esc(D.categories[entry.category])} · texto de consulta</small>
                <p>${esc(entry.definition)}</p><h4>Quando consultar</h4><p>${esc(entry.use)}</p>
                <h4>Distinção importante</h4><p>${esc(entry.distinction)}</p>
                ${entry.steps ? `<h4>Organizar o registro</h4><ol>${entry.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol>` : ''}
                <h4>Exemplo fictício</h4><p>${esc(entry.example)}</p>
                ${entry.outline ? `<h4>Estrutura vazia para redação profissional</h4><p>Somente títulos. Nenhum exemplo ou achado é copiado. Você decide onde usar e redige o conteúdo.</p><textarea id="clinical-outline" readonly aria-label="Estrutura vazia, somente títulos">${esc(entry.outline.join(':\n\n') + ':\n')}</textarea><div class="clinical-actions">${button('Copiar estrutura vazia', 'data-clinical-copy')}</div>` : ''}
                <h4>Conceitos relacionados</h4><div class="clinical-related">${entry.related.map(id => D.get(id)).filter(Boolean).map(item => button(item.title, 'data-clinical-entry', item.id)).join('')}</div>
                <h4>Referências para aprofundamento</h4><ul>${entry.sources.map(sourceHTML).join('')}</ul>
                <p><small>Redação editorial original · revisão editorial de 30/10/2026. Revisão profissional do piloto pendente. A leitura não comprova formação ou suficiência da avaliação.</small></p>
            </article>`;
            if (focus) el('clinical-entry-title').focus({ preventScroll: true });
        } else {
            const entries = D.search(query, category);
            host.innerHTML = `<p class="clinical-count" role="status">${entries.length} referência(s) encontrada(s)</p><div class="clinical-results">${entries.map(item => `<article class="clinical-result"><h3>${esc(item.title)}</h3><small>${esc(D.categories[item.category])}</small><p>${esc(item.definition)}</p>${button('Consultar ' + item.title, 'data-clinical-entry', item.id)}</article>`).join('') || '<p>Nenhuma referência encontrada. Use outro termo ou limpe os filtros. A busca consulta o catálogo, sem analisar registros de pacientes.</p>'}</div>`;
        }
    }
    function renderCategories() {
        const host = el('clinical-categories'); if (!host) return;
        host.innerHTML = [['', 'Todas'], ...Object.entries(D.categories)].map(([id, label]) => `<button type="button" class="therapy-secondary" data-clinical-category="${id}" aria-pressed="${category === id}">${esc(label)}</button>`).join('');
    }
    function open(target = '') {
        if (!ready()) return;
        // A senha ou a licença continuam sob seus controles normais, sem sobreposição clínica.
        if ([...document.querySelectorAll('.therapy-overlay,.therapy-modal-work')].some(node => visible(node) && node.querySelector('input[type=password],#activation-form,#system-reset-form'))) return;
        if (typeof TherapyHelp !== 'undefined') TherapyHelp.close?.();
        if (!root) {
            const launchOpener = document.activeElement;
            if (typeof TherapyTours !== 'undefined') TherapyTours.onReferencesOpen();
            opener = launchOpener;
            root = document.createElement('div'); root.id = 'therapy-clinical'; root.className = 'therapy-overlay clinical-overlay';
            root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-labelledby', 'clinical-title');
            root.innerHTML = `<section class="clinical-sheet"><header><div><h2 id="clinical-title">Referências clínicas</h2><p>Abordagens, termos e organização do acompanhamento.</p></div>${button('Fechar referências', 'data-clinical-close')}</header>
                <p class="clinical-notice">Consulta educacional. A avaliação e as conclusões pertencem ao profissional. Os textos são referências gerais; não analisam o paciente e não salvam seus formulários.</p>
                <label class="clinical-search-label" for="clinical-search">Buscar referência<input id="clinical-search" type="search" maxlength="160" autocomplete="off" placeholder="Ex.: fenomenologia, hipótese, humor"></label>
                <div id="clinical-categories" class="clinical-categories" role="group" aria-label="Categorias de referências"></div>
                <p id="clinical-message" role="status"></p><div id="clinical-body"></div>
                <footer><small>Catálogo disponível offline após a atualização do aplicativo. Fontes externas exigem conexão. Revisão profissional do piloto pendente.</small></footer></section>`;
            document.body.appendChild(root);
        }
        query = ''; category = Object.hasOwn(D.categories, target) ? target : ''; selected = D.get(target)?.id || '';
        if (target === 'approach') {
            const choice = el('treatment-approach')?.value;
            selected = D.approaches.find(item => item.approach === choice)?.id || '';
            category = 'approaches';
        }
        el('clinical-search').value = ''; el('clinical-message').textContent = '';
        renderCategories(); renderBody();
        (selected ? el('clinical-entry-title') : el('clinical-search')).focus({ preventScroll: true });
    }
    function launch(parent, target, label) {
        if (!parent || parent.querySelector(`:scope > [data-clinical-open="${target}"]`)) return;
        const node = document.createElement('button'); node.type = 'button'; node.className = 'therapy-secondary clinical-launch';
        node.dataset.clinicalOpen = target; node.textContent = label;
        parent.appendChild(node);
    }
    function install() {
        scheduled = false;
        // Os controles são estáticos; nenhum valor clínico é lido para decidir o conteúdo.
        const patientActions = document.querySelector('#view-patients .patients-heading-actions');
        launch(patientActions, '', 'Referências clínicas');
        const patientReference = patientActions?.querySelector('[data-clinical-open]');
        if (patientReference) patientReference.className = 'therapy-primary';
        launch(el('crm-profile-heading')?.querySelector('.crm-profile-actions'), '', 'Referências clínicas');
        launch(document.querySelector('#view-manual .manual-heading-actions'), '', 'Referências clínicas');
        const fields = {
            'patient-complaint': ['guide-demand', 'Ajuda: demanda e queixa'],
            'patient-history': ['anamnesis', 'Ajuda: histórico e anamnese'],
            'treatment-approach': ['approach', 'Consultar abordagem'],
            'treatment-diagnosis': ['guide-hypothesis', 'Ajuda: hipótese e diagnóstico'],
            'treatment-summary': ['guide-formulation', 'Ajuda: compreensão do caso'],
            'session-content': ['guide-evolution', 'Ajuda: registro e evolução'],
            'session-mood': ['mood', 'Ajuda: humor e afeto'],
            'session-adherence': ['adherence', 'Ajuda: adesão ao acompanhamento'],
            'assessment-conclusion': ['guide-hypothesis', 'Ajuda: fundamentação e limites']
        };
        for (const [id, [target, label]] of Object.entries(fields)) {
            const field = el(id), parent = field?.parentElement;
            if (!parent) continue;
            // Colocar o botão fora do label evita ativação acidental do campo por associação.
            const existing = document.querySelector(`[data-clinical-field="${id}"]`);
            if (existing) { if (parent.nextElementSibling !== existing) parent.after(existing); continue; }
            const wrap = document.createElement('div'); wrap.dataset.clinicalField = id;
            launch(wrap, target, label); parent.after(wrap);
        }
    }
    function scheduleInstall() { if (!scheduled) { scheduled = true; requestAnimationFrame(install); } }
    document.addEventListener('click', async event => {
        const launchControl = event.target.closest('[data-clinical-open]');
        if (launchControl) { event.preventDefault(); open(launchControl.dataset.clinicalOpen); return; }
        if (!root || !root.contains(event.target) || !ready()) return;
        if (event.target === root || event.target.closest('[data-clinical-close]')) { close(); return; }
        const entry = event.target.closest('[data-clinical-entry]');
        if (entry) { selected = D.get(entry.dataset.clinicalEntry)?.id || ''; renderBody(true); return; }
        const filter = event.target.closest('[data-clinical-category]');
        if (filter) { category = filter.dataset.clinicalCategory; selected = ''; renderCategories(); renderBody(); el('clinical-categories').querySelector(`[data-clinical-category="${category}"]`)?.focus({ preventScroll: true }); return; }
        if (event.target.closest('[data-clinical-back]')) { selected = ''; renderBody(); el('clinical-search').focus({ preventScroll: true }); return; }
        if (event.target.closest('[data-clinical-copy]')) {
            const field = el('clinical-outline'); if (!field) return;
            const currentRoot = root;
            try {
                if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
                await navigator.clipboard.writeText(field.value);
                if (root === currentRoot && ready()) el('clinical-message').textContent = 'Estrutura vazia copiada. Cole onde desejar e redija seu registro; nenhum formulário foi alterado.';
            } catch {
                if (root !== currentRoot || !ready()) return;
                field.focus(); field.select(); el('clinical-message').textContent = 'A cópia automática não ficou disponível. A estrutura está selecionada para você copiar pelos controles do navegador.';
            }
        }
    });
    document.addEventListener('input', event => {
        if (event.target.id !== 'clinical-search' || !root || !ready()) return;
        query = event.target.value.slice(0, 160); selected = ''; renderBody();
    });
    document.addEventListener('keydown', event => {
        if (!root || !root.contains(event.target)) return;
        if (event.key === 'Escape' && !event.target.closest('#therapy-tour-panel')) {
            event.preventDefault(); event.stopImmediatePropagation(); close();
        } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault(); event.stopImmediatePropagation();
        }
    }, true);
    for (const name of ['therapy-vault-locked', 'therapy-data-restored']) document.addEventListener(name, () => close(false));
    window.addEventListener('storage', event => { if (event.key === 'gestao_terapia_v1') close(false); });
    document.addEventListener('DOMContentLoaded', () => {
        install();
        new MutationObserver(records => {
            if (root && !ready()) close(false);
            if (records.some(record => record.type === 'childList' && !record.target.closest?.('#therapy-clinical') && [...record.addedNodes, ...record.removedNodes].some(node => node.nodeType === 1 && !node.matches?.('.clinical-launch,[data-clinical-field]')))) scheduleInstall();
        }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    });
    return { open, close };
})();
