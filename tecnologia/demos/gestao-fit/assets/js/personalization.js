const FitPersonalization = (() => {
    const R = FitPersonalizationRules, el = id => document.getElementById(id), value = id => el(id)?.value || '', esc = value => sanitizeHTML(String(value ?? ''));
    let logo = '', dirty = false, reading = false, saving = false, generation = 0;
    function ensure() { if (!FitSecurity.isOpen()) throw new Error('Abra os registros antes de continuar.'); }
    function render() {
        ensure(); if (dirty || reading || saving) return;
        const host = el('view-settings'); if (!host) return;
        let root = el('fit-personalization-root'); if (!root) { host.insertAdjacentHTML('beforeend', '<section class="fit-panel" id="fit-personalization-root"></section>'); root = el('fit-personalization-root'); }
        const p = db.settings.presentation || { palette: 'green', fontSize: 16, signature: '', logo: '' }; logo = p.logo;
        root.innerHTML = `<h3 class="fit-money-section-title">Sua apresentação profissional</h3><p class="fit-muted">Logo e assinatura acompanham o backup protegido e as novas impressões. A identificação licenciada continua preservada.</p><form id="fit-personalization-form" class="fit-presentation-form" oninput="FitPersonalization.changed()" onchange="FitPersonalization.changed()" onsubmit="submitFitPersonalization(event)"><label>Cor principal<select id="fit-palette">${[['green', 'Verde'], ['blue', 'Azul'], ['violet', 'Violeta'], ['teal', 'Verde petróleo']].map(([id, name]) => `<option value="${id}" ${p.palette === id ? 'selected' : ''}>${name}</option>`).join('')}</select></label><label>Tamanho do texto<select id="fit-font-size">${[[14, 'Compacto'], [16, 'Padrão'], [18, 'Ampliado']].map(([size, name]) => `<option value="${size}" ${p.fontSize === size ? 'selected' : ''}>${name}</option>`).join('')}</select></label><label>Logo PNG, JPEG ou WebP (até 200 KB)<input type="file" accept="image/png,image/jpeg,image/webp" onchange="FitPersonalization.readLogo(this)"></label><div id="fit-logo-preview">${logo ? '<img class="fit-brand-preview" src="' + esc(logo) + '" alt="Logo profissional selecionada">' : '<p class="fit-muted">Nenhuma logo selecionada.</p>'}</div><button type="button" class="fit-secondary" onclick="FitPersonalization.removeLogo()">Remover logo</button><label>Assinatura administrativa e de impressão<textarea id="fit-signature" rows="3" maxlength="300">${esc(p.signature)}</textarea></label><p id="fit-presentation-state" class="fit-muted" role="status">Confira e salve para aplicar.</p><button type="submit" class="fit-primary">Salvar apresentação</button></form>`;
    }
    function changed() { dirty = true; const node = el('fit-presentation-state'); if (node) node.textContent = 'Alterações ainda não salvas.'; }
    function apply() {
        const p = db.settings.presentation || { palette: 'green', fontSize: 16, logo: '' }, pair = R.palettes[p.palette];
        document.documentElement.style.setProperty('--color-accent', pair[0]); document.documentElement.style.setProperty('--color-accent-hover', pair[1]); document.documentElement.style.setProperty('--brand-primary', pair[0]); document.documentElement.style.setProperty('--brand-dark', pair[1]); document.documentElement.style.setProperty('font-size', p.fontSize + 'px');
        const img = el('fit-personal-logo'); if (img) { img.src = p.logo || ''; img.hidden = !p.logo; }
    }
    async function readLogo(input) {
        ensure(); if (saving || window.fitActionBusy) return; const file = input.files?.[0]; input.value = ''; if (!file) return;
        if (file.size > 200000 || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return FitSecurity.notice('Escolha PNG, JPEG ou WebP de até 200 KB.', 'error');
        const current = ++generation; reading = true;
        try { const result = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('Não foi possível ler a imagem.')); reader.readAsDataURL(file); }); if (current !== generation || !FitSecurity.isOpen()) return; const candidate = R.save(db, { palette: value('fit-palette'), fontSize: value('fit-font-size'), signature: value('fit-signature'), logo: result }); logo = candidate.settings.presentation.logo; el('fit-logo-preview').innerHTML = '<img class="fit-brand-preview" src="' + esc(logo) + '" alt="Logo profissional selecionada">'; changed(); }
        catch (error) { if (current === generation && FitSecurity.isOpen()) FitSecurity.notice(error.message, 'error'); }
        finally { if (current === generation) reading = false; }
    }
    function removeLogo() { ensure(); if (saving || window.fitActionBusy) return; generation++; reading = false; logo = ''; el('fit-logo-preview').textContent = 'Nenhuma logo selecionada.'; changed(); }
    function beforeNavigate(view) { if (view === 'settings') return true; if (reading || saving) return false; if (dirty && !confirm('Há alterações de apresentação ainda não salvas. Deseja descartá-las?')) return false; if (dirty) { dirty = false; logo = ''; } return true; }
    async function submit(event) {
        event.preventDefault(); ensure(); if (reading || saving) throw new Error('Aguarde a leitura ou gravação da apresentação.');
        const result = R.save(db, { palette: value('fit-palette'), fontSize: value('fit-font-size'), signature: value('fit-signature'), logo });
        const controls = [...(el('fit-personalization-form')?.querySelectorAll?.('input,select,textarea,button') || [])].filter(control => !control.disabled); saving = true; controls.forEach(control => control.disabled = true);
        try { db = result; await save(); ensure(); dirty = false; saving = false; apply(); render(); FitSecurity.notice('Apresentação salva neste dispositivo e incluída nos próximos backups.'); } finally { saving = false; controls.forEach(control => control.disabled = false); }
    }
    function reset() { generation++; logo = ''; dirty = false; reading = false; saving = false; el('fit-personalization-root')?.replaceChildren(); const img = el('fit-personal-logo'); if (img) { img.src = ''; img.hidden = true; } for (const name of ['--color-accent', '--color-accent-hover', '--brand-primary', '--brand-dark', 'font-size']) document.documentElement.style.removeProperty(name); }
    function printLogo() { return db.settings.presentation?.logo ? '<img class="fit-print-logo" src="' + esc(db.settings.presentation.logo) + '" alt="Logo profissional">' : ''; }
    window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
    return { render, apply, reset, beforeNavigate, submit, readLogo, removeLogo, changed, printLogo };
})();
function submitFitPersonalization(event) { return FitPersonalization.submit(event); }
