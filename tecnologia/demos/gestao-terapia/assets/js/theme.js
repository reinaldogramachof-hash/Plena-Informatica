// Preferência visual local, independente dos dados da operação.
const THERAPY_THEME_KEY = 'terapia_theme_preference';
const THERAPY_PALETTE_KEY = 'terapia_accent_palette';

// A apresentação comercial reinicia neste padrão; os controles seguem disponíveis na sessão.
try {
    localStorage.setItem(THERAPY_THEME_KEY, 'light');
    localStorage.setItem(THERAPY_PALETTE_KEY, 'emerald');
} catch {}

const THERAPY_PALETTES = {
    blue: ['Azul Sereno', '#1D4ED8', '#1E40AF', '#93C5FD', '29,78,216', '59,130,246'],
    indigo: ['Índigo Mente', '#4338CA', '#3730A3', '#A5B4FC', '67,56,202', '165,180,252'],
    teal: ['Verde Petróleo', '#0F766E', '#115E59', '#5EEAD4', '15,118,110', '45,212,191'],
    green: ['Verde Sálvia', '#15803D', '#166534', '#86EFAC', '21,128,61', '34,197,94'],
    emerald: ['Esmeralda Terapia', '#047857', '#065F46', '#6EE7B7', '4,120,87', '110,231,183'],
    violet: ['Lavanda Acolhedor', '#6D28D9', '#5B21B6', '#C4B5FD', '109,40,217', '167,139,250'],
    rose: ['Rosa Empatia', '#BE185D', '#9D174D', '#F9A8D4', '190,24,93', '244,114,182'],
    terracotta: ['Terracota Presença', '#C2410C', '#9A3412', '#FDBA74', '194,65,12', '253,186,116'],
    amber: ['Âmbar Acolhimento', '#B45309', '#92400E', '#FCD34D', '180,83,9', '252,211,77'],
    slate: ['Grafite Sóbrio', '#475569', '#334155', '#CBD5E1', '71,85,105', '203,213,225']
};

function getTherapyPaletteKey() {
    try {
        const stored = localStorage.getItem(THERAPY_PALETTE_KEY);
        if (stored && THERAPY_PALETTES[stored]) return stored;
    } catch {}
    return 'emerald';
}

function applyTherapyPalette(key, persist = false) {
    const palette = THERAPY_PALETTES[key] || THERAPY_PALETTES.emerald;
    const isDark = document.documentElement.classList.contains('dark');
    const variables = ['--color-accent', '--color-accent-hover', '--color-accent-text', '--color-accent-soft'];
    const values = [
        palette[1],
        palette[2],
        isDark ? palette[3] : palette[1],
        'rgba(' + (isDark ? palette[5] : palette[4]) + ',' + (isDark ? '.14' : '.08') + ')'
    ];
    variables.forEach((name, i) => document.documentElement.style.setProperty(name, values[i]));
    if (persist) {
        try { localStorage.setItem(THERAPY_PALETTE_KEY, key); } catch {}
    }
}

function applySorveteriaTheme(theme, persist = false) {
    const next = theme === 'light' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.style.colorScheme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0F0F11' : '#F5F5F7');
    applyTherapyPalette(getTherapyPaletteKey());
    const button = document.getElementById('theme-toggle-btn');
    if (button) {
        const label = next === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';
        button.title = label;
        button.setAttribute('aria-label', label);
        button.setAttribute('aria-pressed', String(next === 'dark'));
    }
    if (persist) {
        try { localStorage.setItem(THERAPY_THEME_KEY, next); }
        catch { if (typeof notifyUser === 'function') notifyUser('Tema aplicado. Não foi possível guardar a preferência neste dispositivo.', 'warning'); }
    }
}
function toggleSorveteriaTheme() {
    applySorveteriaTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark', true);
    if (typeof TherapySystem !== 'undefined') TherapySystem.status();
}
function restoreSorveteriaTheme() {
    let theme = 'light';
    try { theme = localStorage.getItem(THERAPY_THEME_KEY) || 'light'; } catch {}
    applySorveteriaTheme(theme);
}
restoreSorveteriaTheme();
applyTherapyPalette(getTherapyPaletteKey());
document.addEventListener('DOMContentLoaded', () => {
    restoreSorveteriaTheme();
    applyTherapyPalette(getTherapyPaletteKey());
});
window.addEventListener('storage', event => {
    if (event.key === THERAPY_THEME_KEY) applySorveteriaTheme(event.newValue);
    if (event.key === THERAPY_PALETTE_KEY) applyTherapyPalette(event.newValue);
});
