/* Eventos de clique, sem mensagem de WhatsApp, formulário ou dados de pacientes. */
(function (root) {
  const kinds = new Set(['segment', 'service', 'whatsapp', 'trial', 'demo', 'model']);
  function buildEvent({ kind, offer = '', pathname, search = '', destination = '' }) {
    if (!kinds.has(kind)) return null;
    const event = { event: 'plena_commercial_click', intent: kind, offer, page_path: pathname, destination_path: destination };
    const params = new URLSearchParams(search);
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
      const value = params.get(key);
      if (value && /^[\p{L}\p{N}_. -]{1,100}$/u.test(value)) event[key] = value;
    }
    return event;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { buildEvent };
  if (typeof document === 'undefined' || root.plenaCommercialTrackingInstalled) return;
  root.plenaCommercialTrackingInstalled = true;
  document.addEventListener('click', event => {
    const control = event.target.closest?.('a, button');
    if (!control) return;
    const handler = control.getAttribute('onclick') || '';
    const href = control.getAttribute('href') || '';
    const mobileTrial = root.matchMedia('(max-width: 767px)').matches && control.hasAttribute('data-therapy-demo-entry');
    let kind = control.dataset.plenaKind;
    if (!kind && (mobileTrial || /7 dias/.test(control.innerText))) kind = 'trial';
    if (!kind && /openDemoModal|openDemo\(/.test(handler)) kind = 'demo';
    if (!kind && (/WhatsApp|whatsApp/.test(handler) || /wa\.me\//.test(href) || control.classList.contains('whatsapp-btn'))) kind = 'whatsapp';
    let destination = '';
    if (href) {
      try { const url = new URL(href, root.location.href); destination = url.origin === root.location.origin ? url.pathname : url.hostname; } catch { /* Link inválido não transmite seu conteúdo. */ }
    }
    const payload = buildEvent({ kind, offer: control.dataset.plenaOffer || document.body.dataset.commercialOffer || '', pathname: root.location.pathname, search: root.location.search, destination });
    if (!payload) return;
    root.dataLayer = root.dataLayer || [];
    root.dataLayer.push(payload);
  }, true);
})(globalThis);
