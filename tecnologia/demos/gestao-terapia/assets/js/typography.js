// Preferência de leitura deste navegador, independente do cofre e dos backups.
const TherapyTypography = (() => {
    const key = 'terapia_font_size_preference';
    const levels = [90, 100, 110, 120, 130];
    let percent = 100, storageFailed = false;

    function normalize(value) {
        return levels.includes(Number(value)) ? Number(value) : 100;
    }

    function render() {
        const value = document.getElementById('system-font-value');
        if (value) value.textContent = percent + '%';
        for (const [id, disabled] of [
            ['system-font-decrease', percent === levels[0]],
            ['system-font-increase', percent === levels.at(-1)],
            ['system-font-reset', percent === 100]
        ]) {
            const button = document.getElementById(id);
            if (button) button.disabled = disabled;
        }
        const status = document.getElementById('system-font-status');
        if (status) status.textContent = storageFailed
            ? 'Fonte em ' + percent + '%. Aplicada nesta aba, mas não foi possível guardar a preferência. Ao reabrir, ela poderá voltar ao tamanho anterior.'
            : 'Fonte em ' + percent + '%. Preferência guardada neste navegador.';
    }

    function apply(value, persist = false) {
        percent = normalize(value);
        document.documentElement.style.fontSize = percent + '%';
        if (persist) {
            try { localStorage.setItem(key, String(percent)); storageFailed = false; }
            catch { storageFailed = true; }
        }
        render();
        return percent;
    }

    function restore() {
        let value = 100;
        try { value = localStorage.getItem(key); }
        catch { storageFailed = true; }
        apply(value);
    }

    restore();
    document.addEventListener('DOMContentLoaded', render);
    window.addEventListener('storage', event => {
        if (event.key === key || event.key === null) restore();
    });
    return {
        apply,
        render,
        current: () => percent,
        adjust: delta => apply(Math.max(levels[0], Math.min(levels.at(-1), percent + delta)), true),
        reset: () => apply(100, true)
    };
})();
