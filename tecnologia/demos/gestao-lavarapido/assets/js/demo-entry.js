(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.PlenaLavarapidoDemoEntry = api;
}(typeof globalThis !== 'undefined' ? globalThis : window, function () {
  const ALLOWED_VIEWS = Object.freeze({
    patio: 'patio',
    ordens: 'ordens',
    caixa: 'caixa',
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
    const targetView = resolveView(global.location.search);
    if (!targetView) {
      return;
    }

    let attempts = 0;
    const timer = global.setInterval(() => {
      attempts += 1;
      const body = global.document && global.document.body;
      const isReady = typeof global.route === 'function' &&
        typeof global.onlineReady !== 'undefined' ? global.onlineReady : false;
      const ready = Boolean(
        typeof global.route === 'function' &&
        (typeof onlineReady !== 'undefined' && onlineReady) &&
        (typeof operationalLoaded !== 'undefined' && operationalLoaded) &&
        body &&
        !body.classList.contains('access-mode')
      );

      if (ready) {
        global.clearInterval(timer);
        open(global.location.search, {
          navigate(view) {
            global.route(view);
            if (typeof global.render === 'function') {
              global.render();
            }
          },
        });
        return;
      }

      if (attempts >= 120) {
        global.clearInterval(timer);
      }
    }, 50);
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
