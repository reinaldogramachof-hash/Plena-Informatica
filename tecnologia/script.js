const WHATSAPP_PHONE = '5512992191018';
const commercialMessages = {
  diagnóstico: 'Olá! Vim pelo site da Plena, na página de tecnologia, e gostaria de um diagnóstico para meu projeto.',
  assistencia: 'Olá! Vim pelo site da Plena e tenho interesse no sistema Assistência Pro. Gostaria de entender os planos e testar a solução.',
  gastro: 'Olá! Vim pelo site da Plena e tenho interesse no sistema Gestão Gastro. Gostaria de agendar uma demonstração.',
  landing: 'Olá! Vim pelo site da Plena e gostaria de criar uma landing page para captar leads ou vender melhor.',
  siteCorporativo: 'Olá! Vim pelo site da Plena e gostaria de consultar sobre um site corporativo.',
  clinicas: 'Olá! Vim pelo site da Plena e gostaria de consultar sobre um site para escritorio ou clinica.',
  ecommerce: 'Olá! Vim pelo site da Plena e gostaria de um diagnóstico para e-commerce ou catalogo online.',
  ia: 'Olá! Vim pelo site da Plena e gostaria de entender como implementar IA ou automacao no meu negocio.'
};

const solutionCatalog = [
  { categoria: 'sistemas', nome: 'Assistência Pro', setor: 'Assistências técnicas', preco: 'R$ 97/mes', status: 'Demo disponivel', landingUrl: '../produtos/assistencia-pro.html', demoUrl: 'demos/gestao-assistencia/index.html', ctaLabel: 'Conhecer página', whatsappMessage: commercialMessages.assistencia },
  { categoria: 'sistemas', nome: 'Barbearia Premium', setor: 'Barbearias', preco: 'R$ 79/mes', status: 'Demo disponivel', landingUrl: '../produtos/barbearia-premium.html', demoUrl: 'demos/gestao-barbearia/index.html', ctaLabel: 'Conhecer página', whatsappMessage: 'Olá! Vim pelo site da Plena e tenho interesse no sistema Barbearia Premium.' },
  { categoria: 'sistemas', nome: 'Beleza & Spa', setor: 'Beleza e estética', preco: 'R$ 97/mes', status: 'Demo disponivel', landingUrl: '../produtos/beleza-spa.html', demoUrl: 'demos/gestao-beleza/index.html', ctaLabel: 'Conhecer página', whatsappMessage: 'Olá! Vim pelo site da Plena e tenho interesse no sistema Beleza & Spa.' },
  { categoria: 'landing-pages', nome: 'Landing Pages', setor: 'Campanhas e captação', preco: 'Sob consulta', status: 'Demo disponivel', demoUrl: 'landing-pages/lp-01-lancamento.html', ctaLabel: 'Solicitar página', whatsappMessage: commercialMessages.landing }
];

function trackIntent(action, offer, category) {
  window.plenaTechEvents = window.plenaTechEvents || [];
  window.plenaTechEvents.push({ action, offer, category, at: new Date().toISOString() });
}

function openWhatsApp(message, meta = {}) {
  const text = encodeURIComponent(message || commercialMessages.diagnóstico);
  trackIntent('whatsapp', meta.offer || 'diagnóstico', meta.category || 'contato');
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`, '_blank', 'noopener,noreferrer');
}

function openWhatsAppByKey(key) {
  openWhatsApp(commercialMessages[key] || commercialMessages.diagnóstico, { offer: key, category: 'whatsapp' });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(btn.dataset.target);
    if (target) {
      target.classList.add('active');
      if (target.dataset.loopReady === 'true') {
        target.scrollLeft = target.scrollWidth / 3;
      } else {
        target.scrollLeft = 0;
      }
      // rAF ensures the browser has applied display:flex before we measure
      requestAnimationFrame(() => updateShowcaseMeter(target));
    }

    trackIntent('tab', btn.dataset.offer || btn.dataset.target, btn.dataset.category || 'tabs');
  });
});

const desktopQuery = window.matchMedia('(min-width: 768px)');
const showcaseMeter = document.querySelector('.showcase-meter span');
const showcasePrevButton = document.querySelector('[data-rail-control="prev"]');
const showcaseNextButton = document.querySelector('[data-rail-control="next"]');
const showcaseCounter = document.querySelector('.showcase-counter');

function getActiveRail() {
  return document.querySelector('.showcase-rail.active');
}

function countVisibleCards(rail) {
  if (!rail) return { current: 0, total: 0 };
  const cards = Array.from(rail.children).filter(card => !card.classList.contains('is-loop-clone'));
  const total = cards.length;
  if (total === 0) return { current: 0, total: 0 };
  const railLeft = rail.getBoundingClientRect().left;
  let current = 1;
  for (let i = 0; i < cards.length; i++) {
    const cardLeft = cards[i].getBoundingClientRect().left - railLeft;
    if (cardLeft >= -8) { current = i + 1; break; }
  }
  return { current, total };
}

function updateShowcaseMeter(rail = getActiveRail()) {
  if (!rail || !showcaseMeter) return;
  const segment = rail.dataset.loopReady === 'true' ? Math.max(rail.scrollWidth / 3, 1) : 0;
  const max = Math.max(rail.scrollWidth - rail.clientWidth, 1);
  const rawProgress = segment ? ((rail.scrollLeft % segment) / segment) : (rail.scrollLeft / max);
  const progress = Math.min(1, Math.max(0, rawProgress));
  showcaseMeter.style.setProperty('--rail-progress', progress.toFixed(3));
  updateShowcaseControls(rail);
  if (showcaseCounter) {
    const { current, total } = countVisibleCards(rail);
    showcaseCounter.textContent = total > 0 ? `${current} / ${total}` : '';
  }
}

function updateShowcaseControls(rail = getActiveRail()) {
  if (!rail || !showcasePrevButton || !showcaseNextButton) return;
  if (rail.dataset.loopReady === 'true') {
    showcasePrevButton.disabled = false;
    showcaseNextButton.disabled = false;
    return;
  }
  const max = Math.max(rail.scrollWidth - rail.clientWidth, 0);
  showcasePrevButton.disabled = rail.scrollLeft <= 8;
  showcaseNextButton.disabled = max <= 0 || rail.scrollLeft >= max - 8;
}

function getShowcaseStep(rail = getActiveRail()) {
  if (!rail) return 420;
  return Math.min(Math.max(rail.clientWidth * 0.9, 620), 1080);
}

function moveActiveRail(direction) {
  const rail = getActiveRail();
  if (!rail) return;
  rail.scrollBy({ left: getShowcaseStep(rail) * direction, behavior: 'smooth' });
  window.setTimeout(() => {
    normalizeInfiniteRail(rail);
    updateShowcaseMeter(rail);
  }, 420);
}

showcasePrevButton?.addEventListener('click', () => moveActiveRail(-1));
showcaseNextButton?.addEventListener('click', () => moveActiveRail(1));

function prepareInfiniteRail(rail) {
  if (!rail || rail.dataset.loopReady === 'true') return;
  const originals = Array.from(rail.children);
  if (originals.length < 2) return;

  originals.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add('is-loop-clone');
    clone.setAttribute('aria-hidden', 'true');
    rail.appendChild(clone);
  });

  [...originals].reverse().forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add('is-loop-clone');
    clone.setAttribute('aria-hidden', 'true');
    rail.insertBefore(clone, rail.firstChild);
  });

  rail.dataset.loopReady = 'true';
  requestAnimationFrame(() => {
    rail.scrollLeft = rail.scrollWidth / 3;
    updateShowcaseMeter(rail);
  });
}

function normalizeInfiniteRail(rail) {
  if (!rail || rail.dataset.loopReady !== 'true') return;
  const segment = rail.scrollWidth / 3;
  if (segment <= 0) return;
  if (rail.scrollLeft < segment * 0.5) {
    rail.scrollLeft += segment;
  } else if (rail.scrollLeft > segment * 1.5) {
    rail.scrollLeft -= segment;
  }
}

// Keyboard navigation when viewport is focused or hovered
const showcaseViewport = document.querySelector('.showcase-viewport');
if (showcaseViewport) {
  showcaseViewport.setAttribute('tabindex', '0');
  showcaseViewport.addEventListener('keydown', event => {
    if (!desktopQuery.matches) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveActiveRail(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveActiveRail(1); }
  });
}

document.querySelectorAll('.showcase-rail').forEach(rail => {
  prepareInfiniteRail(rail);

  let isDragging = false;
  let dragStartX = 0;
  let dragStartLeft = 0;
  let lastX = 0;
  let velocity = 0;
  let momentumFrame = null;

  // scrollend with fallback for browsers that don't support it
  const onScrollEnd = () => updateShowcaseMeter(rail);
  if ('onscrollend' in window) {
    rail.addEventListener('scrollend', onScrollEnd, { passive: true });
  } else {
    let scrollTimer;
    rail.addEventListener('scroll', () => {
      updateShowcaseMeter(rail);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(onScrollEnd, 120);
    }, { passive: true });
  }
  if ('onscrollend' in window) {
    rail.addEventListener('scroll', () => updateShowcaseMeter(rail), { passive: true });
  }

  // Smooth wheel — accumulate delta with rAF to avoid janky jumps
  let wheelAccum = 0;
  let wheelFrame = null;
  rail.addEventListener('wheel', event => {
    if (!desktopQuery.matches || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    if (rail.dataset.loopReady !== 'true') {
      const max = Math.max(rail.scrollWidth - rail.clientWidth, 0);
      const atStart = rail.scrollLeft <= 2;
      const atEnd = rail.scrollLeft >= max - 2;
      if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return;
    }
    event.preventDefault();
    wheelAccum += event.deltaY * 0.32;
    if (!wheelFrame) {
      wheelFrame = requestAnimationFrame(() => {
        rail.scrollLeft += wheelAccum;
        normalizeInfiniteRail(rail);
        wheelAccum = 0;
        wheelFrame = null;
        updateShowcaseMeter(rail);
      });
    }
  }, { passive: false });

  // Drag with momentum
  rail.addEventListener('pointerdown', event => {
    if (!desktopQuery.matches) return;
    cancelAnimationFrame(momentumFrame);
    isDragging = true;
    dragStartX = event.clientX;
    lastX = event.clientX;
    dragStartLeft = rail.scrollLeft;
    velocity = 0;
    rail.classList.add('is-dragging');
    rail.setPointerCapture(event.pointerId);
  });

  rail.addEventListener('pointermove', event => {
    if (!isDragging) return;
    velocity = (lastX - event.clientX) * 0.52;
    lastX = event.clientX;
    rail.scrollLeft = dragStartLeft - ((event.clientX - dragStartX) * 0.74);
    normalizeInfiniteRail(rail);
    updateShowcaseMeter(rail);
  });

  const endDrag = (event) => {
    if (!isDragging) return;
    isDragging = false;
    rail.classList.remove('is-dragging');
    if (event && rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    // Apply momentum
    const applyMomentum = () => {
      if (Math.abs(velocity) < 0.5) return;
      rail.scrollLeft += velocity;
      normalizeInfiniteRail(rail);
      velocity *= 0.82;
      momentumFrame = requestAnimationFrame(applyMomentum);
      updateShowcaseMeter(rail);
    };
    momentumFrame = requestAnimationFrame(applyMomentum);
  };

  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointerleave', () => {
    if (isDragging) endDrag(null);
  });
});

document.querySelectorAll('.tech-showcase article[data-offer]').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (!desktopQuery.matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty('--spot-x', `${(x * 100).toFixed(1)}%`);
    card.style.setProperty('--spot-y', `${(y * 100).toFixed(1)}%`);
    card.style.setProperty('--tilt-x', `${((x - 0.5) * 5).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${((0.5 - y) * 4).toFixed(2)}deg`);
  });

  card.addEventListener('pointerleave', () => {
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
    card.style.removeProperty('--spot-x');
    card.style.removeProperty('--spot-y');
  });
});

updateShowcaseMeter();

function openDemoModal(url, offer = 'demo') {
  if (!url) return;
  const modal = document.getElementById('demo-modal');
  const iframe = document.getElementById('demo-iframe');

  trackIntent('demo', offer, 'demo-modal');
  iframe.src = url;
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    modal.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }, 10);
}

function closeDemoModal() {
  const modal = document.getElementById('demo-modal');
  const iframe = document.getElementById('demo-iframe');

  modal.classList.remove('opacity-100');
  modal.classList.add('opacity-0');
  setTimeout(() => {
    modal.classList.add('hidden');
    iframe.src = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, 300);
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const drawer = document.getElementById('mobile-drawer');
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    // Trigger reflow
    void menu.offsetWidth;
    drawer.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  } else {
    drawer.classList.add('translate-x-full');
    document.body.style.overflow = '';
    setTimeout(() => menu.classList.add('hidden'), 300);
  }
}
