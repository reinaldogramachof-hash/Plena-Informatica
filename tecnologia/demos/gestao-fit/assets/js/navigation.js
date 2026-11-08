/* Preferência visual local; não lê nem altera os registros do profissional. */
const FitNavigation = (() => {
    const key = 'fit.sidebar.collapsed.v1';
    let collapsed = false, mobileOpen = false, media, savedOverflow = null;
    const el = id => document.getElementById(id);
    const desktop = () => media.matches;
    function render() {
        const sidebar = el('sidebar'), overlay = el('overlay'), toggle = el('fit-sidebar-toggle');
        if (!sidebar || !overlay || !toggle) return;
        const wide = desktop(), opened = !wide && mobileOpen;
        document.documentElement.classList.toggle('fit-sidebar-collapsed', wide && collapsed);
        sidebar.classList.toggle('open', opened);
        sidebar.inert = !wide && !opened;
        sidebar.setAttribute('aria-hidden', String(!wide && !opened));
        overlay.classList.toggle('hidden', !opened);
        const main = document.querySelector('main.main-content');
        if (main) main.inert = opened;
        if (opened) {
            if (savedOverflow === null) savedOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        } else if (savedOverflow !== null) {
            if (!document.querySelector('.fit-security-overlay')) document.body.style.overflow = savedOverflow;
            savedOverflow = null;
        }
        const label = wide ? (collapsed ? 'Expandir menu' : 'Recolher menu') : (opened ? 'Fechar menu' : 'Abrir menu');
        toggle.setAttribute('aria-expanded', String(wide ? !collapsed : opened));
        toggle.setAttribute('aria-label', label);
        toggle.title = label;
        toggle.querySelectorAll('[data-fit-menu-icon]').forEach(icon => {
            icon.hidden = icon.getAttribute('data-fit-menu-icon') !== (wide ? (collapsed ? 'expand' : 'collapse') : 'menu');
        });
    }
    function toggle() {
        if (!media) return;
        if (desktop()) {
            collapsed = !collapsed;
            try { localStorage.setItem(key, collapsed ? '1' : '0'); } catch (_) { /* A navegação continua sem persistência. */ }
        } else mobileOpen = !mobileOpen;
        render();
        if (!desktop() && mobileOpen) el('fit-sidebar-close')?.focus();
    }
    function close(restoreFocus = true) {
        if (!media || !mobileOpen) return;
        mobileOpen = false;
        render();
        if (restoreFocus) el('fit-sidebar-toggle')?.focus();
    }
    function setActive(view) {
        const id = 'nav-' + (view === 'team' ? 'profile' : view);
        document.querySelectorAll('#sidebar .nav-item').forEach(button => {
            if (button.id === id) button.setAttribute('aria-current', 'page');
            else button.removeAttribute('aria-current');
        });
    }
    function keyboard(event) {
        if (!mobileOpen || desktop() || document.querySelector('.fit-security-overlay')) return;
        if (event.key === 'Escape') { event.preventDefault(); close(); return; }
        if (event.key !== 'Tab') return;
        const buttons = [...el('sidebar').querySelectorAll('button:not([disabled]),a[href]')].filter(node => !node.hidden && node.getClientRects().length);
        const first = buttons[0], last = buttons.at(-1), active = document.activeElement;
        if (!first) return;
        if (event.shiftKey && (active === first || !el('sidebar').contains(active))) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (active === last || !el('sidebar').contains(active))) { event.preventDefault(); first.focus(); }
    }
    function setup() {
        if (media || !el('sidebar')) return;
        media = window.matchMedia('(min-width: 1024px)');
        try { collapsed = localStorage.getItem(key) === '1'; } catch (_) { collapsed = false; }
        const changed = () => {
            const focused = document.activeElement, sidebar = el('sidebar');
            mobileOpen = false;
            render();
            if ((!desktop() && sidebar.contains(focused)) || (desktop() && focused === el('fit-sidebar-close'))) el('fit-sidebar-toggle')?.focus();
        };
        if (media.addEventListener) media.addEventListener('change', changed);
        else media.addListener(changed);
        document.addEventListener('keydown', keyboard);
        render();
        setActive('dashboard');
    }
    document.addEventListener('DOMContentLoaded', setup);
    return { toggle, close, setActive };
})();
