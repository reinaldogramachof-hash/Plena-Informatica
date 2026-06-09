document.addEventListener('DOMContentLoaded', () => {

  // ── HEADER: burger menu ──
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      iconOpen.classList.toggle('hidden', !isOpen);
      iconClose.classList.toggle('hidden', isOpen);
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });
    mobileMenu.querySelectorAll('.mobile-link').forEach(el => {
      el.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── WHATSAPP ──
  const PHONE = '5512981488505';
  window.openWhatsApp = function (msg) {
    const text = msg || 'Olá! Gostaria de mais informações sobre os serviços digitais.';
    window.open('https://api.whatsapp.com/send?phone=' + PHONE + '&text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
  };

  document.querySelectorAll('.whatsapp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.getAttribute('data-message');
      openWhatsApp(msg);
    });
  });

  // ── MODAL LIGHTBOX ──
  const modal = document.getElementById('service-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalBtn = document.getElementById('modal-whatsapp-btn');
  const modalDuvidasBtn = document.getElementById('modal-duvidas-btn');
  const closeBtn = document.querySelector('.modal-close');

  if (modal) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const serviceName = item.getAttribute('data-service');
        const imgSrc = item.querySelector('img').getAttribute('src');
        
        modalTitle.textContent = serviceName;
        modalImg.setAttribute('src', imgSrc);
        modalImg.setAttribute('alt', serviceName);
        
        // Ação Principal
        modalBtn.onclick = () => {
          openWhatsApp(`Olá! Vim pelo site e gostaria de solicitar o serviço: *${serviceName}*.`);
        };

        // Ação Secundária (Dúvidas)
        if(modalDuvidasBtn) {
          modalDuvidasBtn.onclick = () => {
            openWhatsApp(`Olá! Estou com algumas dúvidas sobre o serviço: *${serviceName}*. Pode me ajudar?`);
          };
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ── SCROLL REVEAL ──
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

});
