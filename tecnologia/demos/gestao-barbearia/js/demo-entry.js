(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.PlenaBarbeariaDemoEntry = api;
}(typeof globalThis !== 'undefined' ? globalThis : window, function () {
  const ALLOWED_VIEWS = Object.freeze({
    dashboard: 'dashboard',
    agenda: 'agenda',
    team: 'team',
    services: 'services',
    inventory: 'inventory',
    finance: 'finance',
    clients: 'clients',
    pdv: 'pdv',
    reports: 'reports',
  });

  function resolveView(search) {
    const params = new URLSearchParams(search || '');
    const rawView = (params.get('view') || '').trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(ALLOWED_VIEWS, rawView) ? ALLOWED_VIEWS[rawView] : '';
  }

  function open(search, actions) {
    const view = resolveView(search);
    if (!view || !actions || typeof actions.navigate !== 'function') {
      return false;
    }

    actions.navigate(view);
    return true;
  }

  function scheduleEntry(global) {
    const doc = global.document;
    const targetView = resolveView(global.location.search);

    let attempts = 0;
    const timer = global.setInterval(() => {
      attempts += 1;
      const clockEl = doc && doc.getElementById('current-date');
      const sidebarEl = doc && doc.getElementById('sidebar');
      const seeded = Boolean(
        (global.localStorage && global.localStorage.getItem('plena_barbearia_demo_seed_v1') === '1') ||
        (global.db && Array.isArray(global.db.appointments) && global.db.appointments.length > 0)
      );
      const ready = Boolean(
        doc &&
        typeof global.router === 'function' &&
        clockEl &&
        clockEl.textContent &&
        clockEl.textContent.trim().length > 0 &&
        clockEl.textContent.trim() !== '...' &&
        sidebarEl &&
        !sidebarEl.classList.contains('hide') &&
        seeded
      );

      if (ready) {
        global.clearInterval(timer);
        if (targetView) {
          open(global.location.search, {
            navigate(view) {
              global.router(view);
            },
          });
        }
        doc.documentElement.dataset.plenaDemoReady = 'true';
        return;
      }

      if (attempts >= 120) {
        global.clearInterval(timer);
      }
    }, 40);
  }

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const boot = () => scheduleEntry(window);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }

  return { ALLOWED_VIEWS, resolveView, open };
}));
