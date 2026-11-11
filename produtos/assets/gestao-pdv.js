/* Acessibilidade dos overlays do Gestão PDV Pro; a demonstração usa o carregador existente. */
(() => {
  const modal = document.getElementById('demo-modal');
  const menu = document.getElementById('product-mobile-menu');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const pageRegions = document.querySelectorAll('body > header, body > main, body > footer, .pdv-skip');
  let opener = null;
  let activeOverlay = null;

  const visibleControls = overlay => [...overlay.querySelectorAll('a[href], button, summary, iframe, [tabindex="0"]')]
    .filter(element => !element.disabled && element.getClientRects().length > 0);

  function syncOverlays() {
    const next = modal.classList.contains('open') ? modal : menu.classList.contains('open') ? menu : null;
    toggle.setAttribute('aria-expanded', String(menu.classList.contains('open')));
    modal.setAttribute('aria-hidden', String(next !== modal));
    menu.inert = next !== menu;
    pageRegions.forEach(region => { region.inert = Boolean(next); });
    if (next && next !== activeOverlay) {
      if (!activeOverlay) opener = document.activeElement;
      activeOverlay = next;
      const first = next === modal ? next.querySelector('.demo-fullscreen-close') : next.querySelector('.product-mobile-menu__close');
      first?.focus();
    } else if (!next && activeOverlay) {
      activeOverlay = null;
      if (opener?.isConnected) opener.focus();
      opener = null;
    }
  }

  [modal, menu].forEach(overlay => {
    new MutationObserver(syncOverlays).observe(overlay, { attributes: true, attributeFilter: ['class'] });
  });
  document.addEventListener('keydown', event => {
    if (!activeOverlay || event.key !== 'Tab') return;
    const controls = visibleControls(activeOverlay);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  const frame = document.getElementById('demo-frame');
  frame.addEventListener('load', () => {
    try {
      frame.contentDocument?.addEventListener('keydown', event => {
        if (event.key === 'Escape') window.closeDemoModal();
        if (event.key === 'Tab' && event.shiftKey && frame.contentDocument.activeElement === frame.contentDocument.body) {
          event.preventDefault(); modal.querySelector('.demo-fullscreen-close')?.focus();
        }
      });
    } catch {
      // O botão de fechar da página permanece disponível em origem diferente.
    }
  });
  syncOverlays();
})();
