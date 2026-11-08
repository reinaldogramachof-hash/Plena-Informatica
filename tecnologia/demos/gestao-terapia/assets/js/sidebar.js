/* Somente preferências de navegação; nenhum dado clínico é gravado aqui. */
const TherapySidebar = (() => {
    const key = 'terapia_sidebar_preferences';
    const compactScreen = matchMedia('(max-width: 1024px)');
    const preferences = {collapsed:false};
    let sidebar, opener, drawerOpen = false, ready = false;

    function persist() {
        try { localStorage.setItem(key, JSON.stringify(preferences)); } catch {}
    }
    function setDrawer(open, returnFocus = true) {
        const wasOpen = drawerOpen;
        drawerOpen = compactScreen.matches && open;
        sidebar.classList.toggle('open', drawerOpen);
        sidebar.inert = compactScreen.matches && !drawerOpen;
        sidebar.setAttribute('aria-hidden', String(sidebar.inert));
        document.getElementById('overlay').classList.toggle('hidden', !drawerOpen);
        document.querySelector('main').inert = drawerOpen;
        opener.setAttribute('aria-expanded', String(compactScreen.matches ? drawerOpen : !preferences.collapsed));
        const label = compactScreen.matches ? (drawerOpen ? 'Fechar menu' : 'Abrir menu') : (preferences.collapsed ? 'Expandir menu' : 'Recolher menu');
        opener.setAttribute('aria-label', label);
        opener.title = label;
        if (drawerOpen) {
            sidebar.setAttribute('role', 'dialog');
            sidebar.setAttribute('aria-modal', 'true');
            document.getElementById('therapy-menu-close').focus();
        } else {
            sidebar.removeAttribute('role');
            sidebar.removeAttribute('aria-modal');
            if (wasOpen && returnFocus) opener.focus();
        }
    }
    function syncLayout() {
        const collapsed = !compactScreen.matches && preferences.collapsed;
        sidebar.classList.toggle('sidebar-collapsed', collapsed);
        const control = document.getElementById('therapy-sidebar-collapse');
        const label = collapsed ? 'Expandir menu' : 'Recolher menu';
        if (control) {
            control.setAttribute('aria-expanded', String(!collapsed));
            control.setAttribute('aria-label', label);
            control.title = label;
            const copy = control.querySelector('.therapy-nav-copy');
            if (copy) copy.textContent = label;
        }
        if (opener) {
            opener.setAttribute('aria-expanded', String(!collapsed));
            opener.setAttribute('aria-label', collapsed ? 'Expandir menu' : 'Recolher menu');
            opener.title = collapsed ? 'Expandir menu' : 'Recolher menu';
        }
        setDrawer(false, false);
    }
    function toggle() {
        if (!ready) return;
        if (compactScreen.matches) return setDrawer(!drawerOpen);
        preferences.collapsed = !preferences.collapsed;
        persist();
        syncLayout();
    }
    function close(returnFocus = true) {
        if (ready) setDrawer(false, returnFocus);
    }
    function activate(view) {
        if (!ready) return;
        const selected = document.getElementById('nav-' + view);
        sidebar.querySelectorAll('.nav-item').forEach(item => {
            const active = item === selected;
            item.classList.toggle('active-nav', active);
            if (active) item.setAttribute('aria-current', 'page');
            else item.removeAttribute('aria-current');
        });
        if (compactScreen.matches) close();
    }
    function init() {
        sidebar = document.getElementById('sidebar');
        opener = document.getElementById('therapy-menu-toggle');
        try {
            const saved = JSON.parse(localStorage.getItem(key));
            preferences.collapsed = saved?.collapsed === true;
        } catch {}
        ready = true;
        syncLayout();
        compactScreen.addEventListener('change', syncLayout);
        document.addEventListener('keydown', event => {
            if (!drawerOpen) return;
            if (event.key === 'Escape') { event.preventDefault(); close(); }
            if (event.key !== 'Tab') return;
            const controls = [...sidebar.querySelectorAll('button:not([disabled]),[tabindex="0"]')]
                .filter(element => element.getClientRects().length);
            const first = controls[0], last = controls.at(-1);
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        });
    }
    document.addEventListener('DOMContentLoaded', init);
    return {toggle, close, activate};
})();
