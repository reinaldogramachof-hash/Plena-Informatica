/**
 * Camada comercial da demonstração Gestão Gastro Pro.
 * Mantém o build React distribuído intacto, ajusta o viewport com banner e remove distrações de instalação.
 */
(function () {
  'use strict';

  var WHATSAPP_PHONE = '5512992191018';
  var DEMO_BASE_PATH = '/tecnologia/demos/gestao-restaurantes/';
  var icon = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 11v18M25 11v18M18 21h7M25 29v24M41 11v20c0 6 4 10 10 10V11M51 41v12" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 53h39" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/></svg>';

  // Suprime o prompt nativo de instalação PWA para evitar botões flutuantes na demo.
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    if (typeof event.stopImmediatePropagation === 'function') {
      event.stopImmediatePropagation();
    }
  }, true);

  // Impede que o router interno reescreva o subpath da demo para "/" e quebre recarregamentos.
  if (window.history && typeof window.history.replaceState === 'function') {
    var nativeReplaceState = window.history.replaceState.bind(window.history);
    window.history.replaceState = function (state, unused, nextUrl) {
      if (typeof nextUrl === 'string' && (nextUrl === '/' || nextUrl === '/master')) {
        if (window.location.pathname.indexOf(DEMO_BASE_PATH) !== -1) {
          var preserved = window.location.pathname + window.location.search + window.location.hash;
          return nativeReplaceState(state, unused, preserved);
        }
      }
      return nativeReplaceState(state, unused, nextUrl);
    };
  }

  function goToOperationalView() {
    if (window.location.pathname.indexOf('/master') !== -1) {
      var cleanPath = window.location.pathname.replace(/\/master\/?$/, '/');
      window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
    }
  }

  function hideMasterEntry() {
    document.querySelectorAll('a, button').forEach(function (element) {
      var label = (element.textContent || '').trim().toLowerCase();
      if (label === 'master' || label.indexOf('painel master') !== -1) {
        element.style.display = 'none';
      }
    });
  }

  function replaceBrokenBrandImage() {
    document.querySelectorAll('img[src="/favicon.png"], img[src$="/favicon.png"]').forEach(function (image) {
      if (image.dataset.plenaBrandFixed) return;
      image.dataset.plenaBrandFixed = 'true';
      image.style.display = 'none';
      var brandIcon = document.createElement('span');
      brandIcon.className = 'plena-gastro-app-icon';
      brandIcon.setAttribute('aria-hidden', 'true');
      brandIcon.innerHTML = icon;
      image.parentNode.insertBefore(brandIcon, image);
    });
  }

  function injectLayer() {
    if (document.getElementById('plena-demo-banner')) return;

    var staleGuide = document.getElementById('plena-gastro-demo-guide');
    if (staleGuide) staleGuide.remove();

    var style = document.createElement('style');
    style.id = 'plena-demo-bypass-style';
    style.textContent = [
      ':root { --plena-demo-banner-h: 42px; }',
      'body.plena-demo-has-banner { padding-top: var(--plena-demo-banner-h, 42px) !important; height: 100vh !important; overflow: hidden !important; box-sizing: border-box !important; }',
      'body.plena-demo-has-banner #root { height: 100%; }',
      'body.plena-demo-has-banner #root > div.h-screen, body.plena-demo-has-banner #root > div.min-h-screen { height: calc(100vh - var(--plena-demo-banner-h, 42px)) !important; min-height: 0 !important; }',
      'body.plena-demo-has-banner main > header { top: 0 !important; flex-shrink: 0 !important; }',
      '#plena-demo-banner { position: fixed; z-index: 999999; top: 0; left: 0; right: 0; min-height: 42px; display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; padding: 7px 14px; background: #1c0e08; color: #fdf7f2; border-bottom: 1px solid rgba(251, 146, 60, 0.28); font: 700 11px/1.2 Inter, system-ui, sans-serif; letter-spacing: .04em; text-transform: uppercase; box-shadow: 0 2px 12px rgba(0, 0, 0, .35); }',
      '#plena-demo-banner .gastro-icon, .plena-gastro-app-icon { display: grid; place-items: center; width: 28px; height: 28px; flex: 0 0 28px; color: #fb923c; }',
      '#plena-demo-banner .gastro-icon { width: 22px; height: 22px; flex-basis: 22px; }',
      '#plena-demo-banner .gastro-icon svg, .plena-gastro-app-icon svg { width: 100%; height: 100%; }',
      '#plena-demo-banner button { border: 0; border-radius: 999px; background: #ea580c; color: #ffffff; padding: 6px 12px; font: 700 11px/1 Inter, system-ui, sans-serif; cursor: pointer; text-transform: none; letter-spacing: 0; }',
      '#plena-demo-banner button:hover { background: #c2410c; }',
      '@media (max-width: 600px) { #plena-demo-banner { font-size: 9.5px; gap: 6px; padding: 6px 10px; } }'
    ].join('\n');
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'plena-demo-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Barra informativa da demonstração');
    banner.innerHTML = '<span class="gastro-icon" aria-hidden="true">' + icon + '</span><span>Modo demonstração · Gestão Gastro Pro · dados fictícios</span><button type="button">Quero usar no meu restaurante</button>';
    document.body.prepend(banner);
    document.body.classList.add('plena-demo-has-banner');

    function syncBannerHeight() {
      var h = Math.ceil(banner.getBoundingClientRect().height || 42);
      document.documentElement.style.setProperty('--plena-demo-banner-h', h + 'px');
    }
    syncBannerHeight();
    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(syncBannerHeight).observe(banner);
    }
    window.addEventListener('resize', syncBannerHeight);

    banner.querySelector('button').addEventListener('click', function () {
      window.open(
        'https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent('Olá! Testei a demonstração do Gestão Gastro Pro e gostaria de conhecer planos e implantação.'),
        '_blank',
        'noopener,noreferrer'
      );
    });

    hideMasterEntry();
    replaceBrokenBrandImage();
    new MutationObserver(function () {
      hideMasterEntry();
      replaceBrokenBrandImage();
    }).observe(document.body, { childList: true, subtree: true });
  }

  goToOperationalView();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      registrations.forEach(function (registration) { registration.unregister(); });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.setTimeout(injectLayer, 80); });
  } else {
    window.setTimeout(injectLayer, 80);
  }
}());
