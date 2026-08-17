const WHATSAPP_PHONE = '5512992191018';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const commercialMessages = {
  diagnóstico: 'Olá! Vim pelo site da Plena, na página de tecnologia, e gostaria de um diagnóstico para meu projeto.',
  assistencia: 'Olá! Vim pelo site da Plena e tenho interesse no sistema Assistência Pro. Gostaria de entender os planos e testar a solução.',
  gastro: 'Olá! Vim pelo site da Plena e tenho interesse no sistema Gestão Gastro. Gostaria de agendar uma demonstração.',
  landing: 'Olá! Vim pelo site da Plena e gostaria de criar uma landing page para captar leads ou vender melhor.',
  siteCorporativo: 'Olá! Vim pelo site da Plena e gostaria de consultar sobre um site corporativo.',
  clinicas: 'Olá! Vim pelo site da Plena e gostaria de consultar sobre um site para escritório ou clínica.',
  ecommerce: 'Olá! Vim pelo site da Plena e gostaria de um diagnóstico para e-commerce ou catálogo online.',
  ia: 'Olá! Vim pelo site da Plena e gostaria de entender como implementar IA ou automação no meu negócio.'
};

// Mensagens específicas por oferta (data-offer) — mantém o contexto do lead no WhatsApp
const OFFER_MESSAGES = {
  'diagnóstico': commercialMessages.diagnóstico,
  'landing-pages': commercialMessages.landing,
  'site-corporativo': commercialMessages.siteCorporativo,
  'ecommerce': commercialMessages.ecommerce,
  'assistencia-pro': commercialMessages.assistencia,
  'gestão-gastro': commercialMessages.gastro,
  'barbearia-premium': 'Olá! Vim pelo site da Plena e tenho interesse no sistema Barbearia Premium. Gostaria de entender os planos.',
  'beleza-spa': 'Olá! Vim pelo site da Plena e tenho interesse no sistema Beleza & Spa. Gostaria de entender os planos.',
  'landing-infoproduto': commercialMessages.landing,
  'captura-leads': commercialMessages.landing,
  'eventos-ingressos': commercialMessages.landing,
  'case-sucesso': commercialMessages.landing,
  'comparativo': commercialMessages.landing,
  'agendamento': commercialMessages.landing,
  'feature': commercialMessages.landing,
  'waitlist': commercialMessages.landing,
  'oferta': commercialMessages.landing,
  'link-bio': commercialMessages.landing,
  'dashboards-bi': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em Dashboards & B.I. Gostaria de um diagnóstico.',
  'erps-custom': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em um ERP sob medida. Gostaria de um diagnóstico.',
  'crms': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em um CRM B2B. Gostaria de um diagnóstico.',
  'portais': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em Portais & Intranet. Gostaria de um diagnóstico.',
  'ecom-moda': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em e-commerce de Moda & Vestuário. Gostaria de um diagnóstico.',
  'ecom-eletronicos': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em e-commerce de Eletrônicos & Tech. Gostaria de um diagnóstico.',
  'ecom-supermercado': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em e-commerce de Supermercado/Delivery. Gostaria de um diagnóstico.',
  'ecom-b2b': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em e-commerce B2B/Atacado. Gostaria de um diagnóstico.',
  'ecom-infoproduto': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em e-commerce de Infoprodutos & Cursos. Gostaria de um diagnóstico.',
  'ecom-assinaturas': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em e-commerce de Assinaturas & Clubes. Gostaria de um diagnóstico.',
  'ecom-autopecas': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em e-commerce de Peças Automotivas. Gostaria de um diagnóstico.',
  'ecom-farmacia': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em e-commerce de Saúde & Farmácia. Gostaria de um diagnóstico.',
  'ecom-moveis': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em e-commerce de Móveis & Decoração. Gostaria de um diagnóstico.',
  'ecom-cosmeticos': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em e-commerce de Cosméticos & Beleza. Gostaria de um diagnóstico.',
  'site-premium-clinica': 'Olá! Vim pela página de tecnologia da Plena, naveguei no modelo de site premium para Clínica & Saúde e gostaria de um orçamento para o meu negócio.',
  'site-premium-arquitetura': 'Olá! Vim pela página de tecnologia da Plena, naveguei no modelo de site premium para Arquitetura & Engenharia e gostaria de um orçamento para o meu escritório.',
  'site-premium-advocacia': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse no site premium para Advocacia. Gostaria de um orçamento.',
  'site-premium-imobiliaria': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse no site premium para Imobiliária. Gostaria de um orçamento.',
  'site-premium-outro': 'Olá! Vim pela página de tecnologia da Plena, vi a vitrine de Sites Premium e gostaria de um modelo para o meu segmento.'
};

const solutionCatalog = [
  { categoria: 'sistemas', nome: 'Assistência Pro', setor: 'Assistências técnicas', preco: 'R$ 97/mês', status: 'Demo disponível', landingUrl: '../produtos/assistencia-pro.html', demoUrl: 'demos/gestao-assistencia/', ctaLabel: 'Conhecer página', whatsappMessage: commercialMessages.assistencia },
  { categoria: 'sistemas', nome: 'Barbearia Premium', setor: 'Barbearias', preco: 'R$ 79/mês', status: 'Demo disponível', landingUrl: '../produtos/barbearia-premium.html', demoUrl: 'demos/gestao-barbearia/', ctaLabel: 'Conhecer página', whatsappMessage: OFFER_MESSAGES['barbearia-premium'] },
  { categoria: 'sistemas', nome: 'Beleza & Spa', setor: 'Beleza e estética', preco: 'R$ 97/mês', status: 'Demo disponível', landingUrl: '../produtos/beleza-spa.html', demoUrl: 'demos/gestao-beleza/', ctaLabel: 'Conhecer página', whatsappMessage: OFFER_MESSAGES['beleza-spa'] },
  { categoria: 'landing-pages', nome: 'Landing Pages', setor: 'Campanhas e captação', preco: 'Sob consulta', status: 'Demo disponível', demoUrl: 'landing-pages/lp-01-lancamento.html', ctaLabel: 'Solicitar página', whatsappMessage: commercialMessages.landing }
];

// Rastreamento de intenção
// Mantém o histórico em memória e, se o GA4 estiver configurado
// (snippet comentado no <head>), envia o evento para o gtag.

function trackIntent(action, offer, category) {
  window.plenaTechEvents = window.plenaTechEvents || [];
  window.plenaTechEvents.push({ action, offer, category, at: new Date().toISOString() });
  if (typeof window.gtag === 'function') {
    window.gtag('event', `plena_${action}`, {
      offer: offer || '(sem oferta)',
      category: category || '(sem categoria)',
      page: 'tecnologia'
    });
  }
}

// WhatsApp

function openWhatsApp(message, meta = {}) {
  const text = encodeURIComponent(message || commercialMessages.diagnóstico);
  trackIntent('whatsapp', meta.offer || 'diagnóstico', meta.category || 'contato');
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`, '_blank', 'noopener,noreferrer');
}

function openWhatsAppByKey(key) {
  openWhatsApp(commercialMessages[key] || commercialMessages.diagnóstico, { offer: key, category: 'whatsapp' });
}

function openWhatsAppForOffer(offer, category) {
  const message = OFFER_MESSAGES[offer] || commercialMessages[offer] || commercialMessages.diagnóstico;
  openWhatsApp(message, { offer, category: category || 'whatsapp' });
}

// Religa todos os botões de WhatsApp à mensagem específica da sua oferta (sobrescreve o onclick inline)
document.querySelectorAll('button[data-action="whatsapp"][data-offer]').forEach(btn => {
  btn.onclick = () => {
    if (btn.dataset.category === 'mobile-menu') toggleMobileMenu();
    openWhatsAppForOffer(btn.dataset.offer, btn.dataset.category);
  };
});

// Abas do catálogo

function activateTab(btn) {
  // Desativa todas as abas
  document.querySelectorAll('.tab-btn[role="tab"]').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
    b.setAttribute('tabindex', '-1');
  });
  // Ativa a aba clicada
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  btn.removeAttribute('tabindex');

  // Oculta todos os painéis
  document.querySelectorAll('.tab-pane').forEach(p => {
    p.classList.remove('active');
    p.hidden = true;
  });
  // Exibe o painel alvo
  const target = document.getElementById(btn.dataset.target);
  if (target) {
    target.hidden = false;
    target.classList.add('active');
  }

  showNicheRow(btn.dataset.target);
  trackIntent('tab', btn.dataset.offer || btn.dataset.target, btn.dataset.category || 'tabs');
}

function activateTabByTarget(targetId) {
  const btn = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
  if (btn) activateTab(btn);
}

// Deep link: tecnologia.html#sites-premium abre o catálogo já na aba Sites Premium
// (usado pelos links "Voltar à vitrine" dos modelos premium e por links de divulgação).
if (window.location.hash === '#sites-premium') {
  activateTabByTarget('tab-premium');
  document.getElementById('soluções')?.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn));
});

// Navegação por teclado nas abas (setas esquerda/direita, Home, End)
document.querySelector('.tab-track')?.addEventListener('keydown', e => {
  const tabs = [...document.querySelectorAll('.tab-btn[role="tab"]')];
  const idx = tabs.indexOf(document.activeElement);
  if (idx === -1) return;

  let next = -1;
  if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
  if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length;
  if (e.key === 'Home') next = 0;
  if (e.key === 'End') next = tabs.length - 1;

  if (next !== -1) {
    e.preventDefault();
    activateTab(tabs[next]);
    tabs[next].focus();
  }
});

const desktopQuery = window.matchMedia('(min-width: 768px)');

// Filtros de nicho

const NICHE_FILTERS = {};

// Mapeia data-offer → nicho (null = sempre visível)
const NICHE_MAP = {
  'assistencia-pro': 'demo',
  'barbearia-premium': 'demo',
  'beleza-spa': 'demo',
  'gestão-gastro': 'breve',
  'landing-infoproduto': 'lancamento',
  'captura-leads': 'captacao',
  'eventos-ingressos': 'eventos',
  'case-sucesso': 'institucional',
  'comparativo': 'institucional',
  'agendamento': 'institucional',
  'feature': 'lancamento',
  'waitlist': 'captacao',
  'oferta': 'lancamento',
  'link-bio': 'institucional',
  'dashboards-bi': 'dados',
  'erps-custom': 'sistemas',
  'crms': 'sistemas',
  'site-corporativo': 'presenca',
  'portais': 'presenca',
  'ecommerce': null,        // card de abertura — sempre visível
  'ecom-moda': 'varejo',
  'ecom-eletronicos': 'varejo',
  'ecom-supermercado': 'alimentacao',
  'ecom-b2b': 'servicos',
  'ecom-infoproduto': 'servicos',
  'ecom-assinaturas': 'servicos',
  'ecom-autopecas': 'especialidade',
  'ecom-farmacia': 'especialidade',
  'ecom-moveis': 'varejo',
  'ecom-cosmeticos': 'varejo',
};

const activeFilters = {};

function injectNicheFilters() {
  const viewport = document.querySelector('.showcase-viewport');
  if (!viewport) return;

  const container = document.createElement('div');
  container.id = 'niche-filter-container';
  container.className = 'niche-filter-container';

  Object.entries(NICHE_FILTERS).forEach(([tabId, filters]) => {
    const row = document.createElement('div');
    row.className = 'niche-filter-row';
    row.id = `niche-row-${tabId}`;
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', 'Filtrar por categoria');
    row.hidden = true;

    filters.forEach(({ label, value }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'niche-chip' + (value === '' ? ' active' : '');
      btn.dataset.niche = value;
      btn.textContent = label;
      btn.addEventListener('click', () => onNicheChipClick(tabId, value));
      row.appendChild(btn);
    });

    container.appendChild(row);
    activeFilters[tabId] = '';
  });

  viewport.parentNode.insertBefore(container, viewport);

  const activeBtn = document.querySelector('.tab-btn.active');
  if (activeBtn) showNicheRow(activeBtn.dataset.target);
}

function showNicheRow(tabId) {
  let hasRow = false;
  document.querySelectorAll('.niche-filter-row').forEach(row => {
    const isTarget = row.id === `niche-row-${tabId}`;
    row.hidden = !isTarget;
    if (isTarget) hasRow = true;
  });

  const container = document.getElementById('niche-filter-container');
  if (container) {
    container.style.display = hasRow ? '' : 'none';
  }
}

function onNicheChipClick(tabId, value) {
  activeFilters[tabId] = value;

  const row = document.getElementById(`niche-row-${tabId}`);
  if (row) {
    row.querySelectorAll('.niche-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.niche === value);
    });
  }

  applyNicheFilter(tabId, value);
  trackIntent('filter', value || 'todos', tabId);
}

function applyNicheFilter(tabId, value) {
  const pane = document.getElementById(tabId);
  if (!pane) return;

  pane.querySelectorAll('[data-offer]').forEach(card => {
    const niche = NICHE_MAP[card.dataset.offer];
    const matches = niche === null || !value || niche === value;
    card.classList.toggle('card-hidden', !matches);
    card.toggleAttribute('aria-hidden', !matches);
  });
}

// Efeito de profundidade nos cards (desktop, sem movimento reduzido)

if (!REDUCED_MOTION) {
  document.querySelectorAll('.tech-showcase article[data-offer]').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (!desktopQuery.matches) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--spot-x', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--spot-y', `${(y * 100).toFixed(1)}%`);
      card.style.setProperty('--tilt-x', `${((x - 0.5) * 2.5).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${((0.5 - y) * 2).toFixed(2)}deg`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
      card.style.removeProperty('--spot-x');
      card.style.removeProperty('--spot-y');
    });
  });
}

// Modal de demonstração

let currentDemoOffer = 'demo';
let currentDemoUrl = '';
let modalOpener = null;
let modalTrapHandler = null;

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapModalFocus(modal) {
  const getFocusable = () => [...modal.querySelectorAll(FOCUSABLE)].filter(el => !el.closest('iframe'));
  modalTrapHandler = e => {
    if (e.key !== 'Tab') return;
    const els = getFocusable();
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  modal.addEventListener('keydown', modalTrapHandler);
}

function removeTrapModalFocus(modal) {
  if (modalTrapHandler) {
    modal.removeEventListener('keydown', modalTrapHandler);
    modalTrapHandler = null;
  }
}

function openDemoModal(url, offer = 'demo', displayMode = 'fullscreen') {
  if (!url) return;
  const modal = document.getElementById('demo-modal');
  const iframe = document.getElementById('demo-iframe');
  const loader = document.getElementById('demo-loader');
  const newTab = document.getElementById('demo-newtab');

  modalOpener = document.activeElement;

  currentDemoOffer = offer;
  modal.classList.toggle('demo-modal--compact', displayMode === 'compact');

  // Adiciona cache buster para evitar problemas de cache de redirecionamento 301 do 'serve'
  const cacheBuster = url.includes('?') ? '&_t=' + Date.now() : '?_t=' + Date.now();
  const finalUrl = url + cacheBuster;

  currentDemoUrl = finalUrl;
  if (newTab) newTab.href = finalUrl;

  trackIntent('demo', offer, 'demo-modal');
  if (loader) loader.classList.remove('is-hidden');
  iframe.onload = () => { if (loader) loader.classList.add('is-hidden'); };
  iframe.src = finalUrl;
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    modal.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
    // Mover foco para o botão de fechar e ativar trap
    const closeBtn = modal.querySelector('button[onclick="closeDemoModal()"]');
    if (closeBtn) closeBtn.focus();
    trapModalFocus(modal);
    document.documentElement.style.overflow = 'hidden';
  }, 10);
}

// CTA dentro do modal: leva a demo direto para a conversa no WhatsApp
const demoCta = document.getElementById('demo-cta');
if (demoCta) {
  demoCta.addEventListener('click', () => {
    trackIntent('demo-cta', currentDemoOffer, 'demo-modal');
    openWhatsAppForOffer(currentDemoOffer, 'demo-modal');
  });
}

// Fecha o modal de demo com a tecla ESC
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const modal = document.getElementById('demo-modal');
  if (modal && !modal.classList.contains('hidden')) closeDemoModal();
});

function closeDemoModal() {
  const modal = document.getElementById('demo-modal');
  const iframe = document.getElementById('demo-iframe');

  removeTrapModalFocus(modal);

  modal.classList.remove('opacity-100');
  modal.classList.add('opacity-0');
  setTimeout(() => {
    modal.classList.add('hidden');
    modal.classList.remove('demo-modal--compact');
    iframe.src = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    // Restaura foco ao elemento que abriu o modal
    if (modalOpener && typeof modalOpener.focus === 'function') {
      modalOpener.focus();
      modalOpener = null;
    }
  }, 300);
}

// Menu mobile

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const drawer = document.getElementById('mobile-drawer');
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    void menu.offsetWidth; // força reflow para a transição
    drawer.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  } else {
    drawer.classList.add('translate-x-full');
    document.body.style.overflow = '';
    setTimeout(() => menu.classList.add('hidden'), 300);
  }
}

// Inicialização (Init)

injectNicheFilters();
