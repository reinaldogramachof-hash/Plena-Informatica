const PLENA_WHATSAPP = '5512992191018';

function openProductWhatsApp(message, source) {
  const tagged = `${message}\n\nOrigem: vim pelo site da Plena${source ? ' - ' + source : ''}.`;
  window.open(`https://wa.me/${PLENA_WHATSAPP}?text=${encodeURIComponent(tagged)}`, '_blank', 'noopener,noreferrer');
}

function syncProductOverlayScroll() {
  const demoModal = document.getElementById('demo-modal');
  const mobileMenu = document.getElementById('product-mobile-menu');
  const hasOpenOverlay =
    (demoModal && demoModal.classList.contains('open')) ||
    (mobileMenu && mobileMenu.classList.contains('open'));

  document.body.style.overflow = hasOpenOverlay ? 'hidden' : '';
  document.documentElement.style.overflow = hasOpenOverlay ? 'hidden' : '';
}

function toggleProductMobileMenu(force) {
  const menu = document.getElementById('product-mobile-menu');
  if (!menu) {
    return;
  }

  const shouldOpen = typeof force === 'boolean' ? force : !menu.classList.contains('open');
  menu.classList.toggle('open', shouldOpen);
  menu.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  syncProductOverlayScroll();
}

(function initProductMobileMenu() {
  const mobileMenu = document.getElementById('product-mobile-menu');
  if (!mobileMenu) {
    return;
  }

  document.addEventListener('click', function handleProductMenuClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest('[data-mobile-menu-close]')) {
      toggleProductMobileMenu(false);
    }
  });

  document.addEventListener('keydown', function handleProductMenuEscape(event) {
    if (event.key === 'Escape') {
      toggleProductMobileMenu(false);
    }
  });
})();

(function initProductDemoModal() {
  const body = document.body;
  const modal = document.getElementById('demo-modal');
  const frame = document.getElementById('demo-frame');
  const directLink = document.getElementById('demo-direct-link');

  if (!body || !modal || !frame) {
    return;
  }

  const demoUrl = body.dataset.demoUrl;
  const demoTitle = body.dataset.demoTitle || 'Sistema';
  const useFullscreenDemo = body.dataset.demoFullscreen === 'true';
  const mobileMessage = body.dataset.demoMobileMessage || `Olá! Quero ver a demo do ${demoTitle} mas estou pelo celular — pode me mostrar por aqui?`;
  let demoLoadTimer;

  frame.addEventListener('load', function handleDemoLoad() {
    window.clearTimeout(demoLoadTimer);
    modal.classList.remove('is-loading', 'is-delayed');
  });

  window.openDemoModal = function openDemoModal() {
    if (window.matchMedia('(max-width: 767px)').matches && !useFullscreenDemo) {
      openProductWhatsApp(mobileMessage, demoTitle);
      return;
    }

    window.clearTimeout(demoLoadTimer);
    const cacheBuster = demoUrl.includes('?') ? '&_t=' + Date.now() : '?_t=' + Date.now();
    const currentDemoUrl = demoUrl + cacheBuster;
    if (directLink) directLink.href = currentDemoUrl;
    modal.classList.add('is-loading');
    modal.classList.remove('is-delayed');
    frame.src = currentDemoUrl;
    demoLoadTimer = window.setTimeout(function showDemoFallback() {
      modal.classList.add('is-delayed');
    }, 7000);

    modal.classList.add('open');
    modal.classList.toggle('demo-modal--fullscreen', useFullscreenDemo);
    syncProductOverlayScroll();
  };

  window.closeDemoModal = function closeDemoModal() {
    modal.classList.remove('open');
    modal.classList.remove('demo-modal--fullscreen', 'is-loading', 'is-delayed');
    window.clearTimeout(demoLoadTimer);
    syncProductOverlayScroll();
  };

  modal.addEventListener('click', function handleBackdropClick(event) {
    if (event.target === modal) {
      window.closeDemoModal();
    }
  });

  document.addEventListener('keydown', function handleEscape(event) {
    if (event.key === 'Escape') {
      window.closeDemoModal();
    }
  });
})();
