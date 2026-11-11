/* No celular, a experiência real começa pela solicitação do teste assistido. */
(function (root) {
  function createEntry({ isMobile, openDemo, requestTrial }) {
    return function (parameters = {}) {
      if (isMobile()) return requestTrial();
      return openDemo(parameters);
    };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { createEntry };
  if (typeof window !== 'undefined') {
    root.openDemoModal = createEntry({
      isMobile: () => root.matchMedia('(max-width: 767px)').matches,
      openDemo: root.openDemoModal,
      requestTrial: () => {
        root.toggleProductMobileMenu(false);
        root.openProductWhatsApp('Olá! Estou pelo celular e quero solicitar meu período de 7 dias gratuitos do Gestão Terapia para experimentar o sistema na rotina do meu consultório. Como faço para começar?', 'Gestão Terapia');
      },
    });
  }
})(globalThis);
