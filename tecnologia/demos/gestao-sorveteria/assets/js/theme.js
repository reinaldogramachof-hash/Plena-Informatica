// Preferência visual local, independente dos dados da operação.
const SORVETERIA_THEME_KEY = 'sorveteria_theme_preference';
function applySorveteriaTheme(theme, persist = false) {
    const next = theme === 'light' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.style.colorScheme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0F0F11' : '#F5F5F7');
    const button = document.getElementById('theme-toggle-btn');
    if (button) {
        const label = next === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';
        button.title = label;
        button.setAttribute('aria-label', label);
        button.setAttribute('aria-pressed', String(next === 'dark'));
    }
    if (persist) {
        try { localStorage.setItem(SORVETERIA_THEME_KEY, next); }
        catch { if (typeof notifyUser === 'function') notifyUser('Tema aplicado. Não foi possível guardar a preferência neste dispositivo.', 'warning'); }
    }
}
function toggleSorveteriaTheme() {
    applySorveteriaTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark', true);
}
function restoreSorveteriaTheme() {
    let theme = 'light';
    try { theme = localStorage.getItem(SORVETERIA_THEME_KEY) || 'light'; } catch {}
    applySorveteriaTheme(theme);
}
restoreSorveteriaTheme();
document.addEventListener('DOMContentLoaded', restoreSorveteriaTheme);
window.addEventListener('storage', event => { if (event.key === SORVETERIA_THEME_KEY) applySorveteriaTheme(event.newValue); });
