(function (root) {
  'use strict';

  const catalogPath = '/tecnologia/tecnologia.html';
  const isHome = pathname => pathname === '/' || pathname === '/index.html';
  const isDestination = pathname => pathname === catalogPath ||
    /^\/produtos\/[^/]+\.html$/.test(pathname) ||
    /^\/tecnologia\/sites-premium\/(?:index\.html|[^/]+\/(?:index\.html)?)?$/.test(pathname) ||
    /^\/tecnologia\/(?:modelos\/landing-pages\/[^/]+\/(?:index\.html)?|landing-pages\/lp-[^/]+\.html|demos\/ecommerce\/[^/]+\.html)$/.test(pathname) ||
    /^\/tecnologia\/(?:ecommerce|automacoes|sites-para-psicologos)\.html$/.test(pathname);

  function resolveOrigin({ url, referrer = '' }) {
    const current = new URL(url);
    if (isHome(current.pathname)) return 'inicio';
    const origin = current.searchParams.get('origem');
    if (origin === 'inicio' || origin === 'tecnologia') return origin;
    try {
      const previous = new URL(referrer);
      if (previous.origin === current.origin && isHome(previous.pathname)) return 'inicio';
    } catch { /* Acesso direto ou referrer indisponível: usar o catálogo. */ }
    return 'tecnologia';
  }

  function categoryFor(pathname) {
    if (pathname.includes('/landing-pages/')) return '#landing-pages';
    if (pathname.includes('/sites-premium/') || pathname.endsWith('/sites-para-psicologos.html')) return '#sites-premium';
    if (pathname.includes('/ecommerce')) return '#ecommerce';
    if (pathname.endsWith('/automacoes.html')) return '#automacoes';
    return '#sistemas';
  }

  function returnTarget(context) {
    const current = new URL(context.url);
    if (current.pathname === catalogPath || resolveOrigin(context) === 'inicio') {
      return { href: '/index.html#services', label: '← Voltar à página inicial' };
    }
    return { href: catalogPath + categoryFor(current.pathname), label: '← Voltar à Tecnologia' };
  }

  function destinationHref(href, currentUrl, referrer = '') {
    if (!href || href.startsWith('#')) return href;
    const current = new URL(currentUrl);
    let target;
    try { target = new URL(href, current); } catch { return href; }
    if (target.origin !== current.origin || !isDestination(target.pathname)) return href;
    target.searchParams.set('origem', resolveOrigin({ url: currentUrl, referrer }));
    return target.pathname + target.search + target.hash;
  }

  const api = { resolveOrigin, returnTarget, destinationHref };
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (!root.document) return;

  function prepareLink(link) {
    if (link.hasAttribute('data-plena-return')) {
      const target = returnTarget({ url: root.location.href, referrer: root.document.referrer });
      link.setAttribute('href', target.href);
      link.textContent = link.getAttribute('data-plena-return') === 'compact'
        ? (target.href.startsWith('/index.html') ? 'Página inicial' : 'Tecnologia')
        : target.label;
      return;
    }
    if (link.hasAttribute('download')) return;
    const href = link.getAttribute('href');
    const next = destinationHref(href, root.location.href, root.document.referrer);
    if (next !== href) link.setAttribute('href', next);
  }

  root.document.querySelectorAll('a[href]').forEach(prepareLink);
  // Abrange links inseridos após o carregamento e cliques com modificadores.
  for (const name of ['click', 'auxclick']) {
    root.document.addEventListener(name, event => {
      const link = event.target.closest('a[href]');
      if (link) prepareLink(link);
    }, true);
  }
})(typeof window === 'object' ? window : globalThis);
