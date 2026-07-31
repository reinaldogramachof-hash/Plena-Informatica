(function () {
  const phone = '5512992191018';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const diagnosisForm = document.querySelector('.diagnosis-form');
  const hero = document.querySelector('.hero');
  const veil = document.querySelector('.hero-veil');

  // Efeito Spotlight (Holofote de cursor) no Hero
  if (hero && veil && !reducedMotion) {
    let mouseX = 50;
    let mouseY = 50;
    let targetX = 50;
    let targetY = 50;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;
    });

    hero.addEventListener('mouseleave', () => {
      targetX = 50;
      targetY = 50;
    });

    function updateSpotlight() {
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;
      veil.style.setProperty('--mx', `${mouseX.toFixed(2)}%`);
      veil.style.setProperty('--my', `${mouseY.toFixed(2)}%`);
      requestAnimationFrame(updateSpotlight);
    }
    requestAnimationFrame(updateSpotlight);
  }

  function setHeaderState() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', setHeaderState, { passive: true });
  setHeaderState();

  menuButton?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  // Stepper do Diagnóstico
  const summaryNicho = diagnosisForm?.querySelector('#summary-nicho');
  const summaryFoco = diagnosisForm?.querySelector('#summary-foco');

  diagnosisForm?.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStep = btn.closest('.form-step');
      const nextStep = currentStep?.nextElementSibling;
      if (nextStep && nextStep.classList.contains('form-step')) {
        currentStep.classList.remove('active');
        nextStep.classList.add('active');

        // Se for o passo final (resumo), atualiza os textos
        if (nextStep.getAttribute('data-step') === '3') {
          const segmentoVal = diagnosisForm.querySelector('input[name="segmento"]:checked')?.value || 'outro segmento';
          const objetivoVal = diagnosisForm.querySelector('input[name="objetivo"]:checked')?.value || 'uma presença digital premium';
          if (summaryNicho) summaryNicho.textContent = segmentoVal;
          if (summaryFoco) summaryFoco.textContent = objetivoVal;
        }
      }
    });
  });

  diagnosisForm?.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStep = btn.closest('.form-step');
      const prevStep = currentStep?.previousElementSibling;
      if (prevStep && prevStep.classList.contains('form-step')) {
        currentStep.classList.remove('active');
        prevStep.classList.add('active');
      }
    });
  });

  diagnosisForm?.addEventListener('submit', event => {
    event.preventDefault();
    const name = diagnosisForm.querySelector('input[name="nome"]')?.value || 'Visitante';
    const segment = diagnosisForm.querySelector('input[name="segmento"]:checked')?.value || 'outro segmento';
    const goal = diagnosisForm.querySelector('input[name="objetivo"]:checked')?.value || 'uma presença digital premium';
    const message = `Olá! Sou o ${name}. Realizei o diagnóstico no portal de Sites Premium para ${segment} com foco em ${goal}. Podemos analisar essa diretriz criativa juntos?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });

  // Observador para a animação da seção Intro
  const introSection = document.querySelector('.intro');
  if (introSection && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          introSection.classList.add('is-visible');
        } else {
          introSection.classList.remove('is-visible');
        }
      });
    }, {
      threshold: 0.15
    });
    observer.observe(introSection);
  }

  // Observador para a animação da seção Método (Como construímos)
  const methodSection = document.querySelector('.method');
  if (methodSection && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          methodSection.classList.add('is-visible');
        } else {
          methodSection.classList.remove('is-visible');
        }
      });
    }, {
      threshold: 0.15
    });
    observer.observe(methodSection);
  }

  // Observador para a animação da seção Closing (Seu próximo capítulo)
  const closingSection = document.querySelector('.closing');
  if (closingSection && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          closingSection.classList.add('is-visible');
        } else {
          closingSection.classList.remove('is-visible');
        }
      });
    }, {
      threshold: 0.15
    });
    observer.observe(closingSection);
  }
})();
