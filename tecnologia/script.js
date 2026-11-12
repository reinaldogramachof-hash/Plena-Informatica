const WHATSAPP_PHONE = '5512992191018';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const commercialMessages = {
  diagnóstico: 'Olá! Vim pelo site da Plena, na página de tecnologia, e gostaria de um diagnóstico para meu projeto.',
  assistencia: 'Olá! Vim pelo site da Plena e tenho interesse no sistema Assistência Pro. Gostaria de entender os planos e testar a solução.',
  terapia: 'Olá! Vim pela página de tecnologia da Plena e tenho interesse no sistema Gestão Terapia Pro. Gostaria de conhecer a licença vitalícia e testar a demonstração.',
  odonto: 'Olá! Vim pela página de tecnologia da Plena e tenho interesse no sistema Gestão Odonto Pro. Gostaria de conhecer a licença vitalícia e tirar dúvidas.',
  fit: 'Olá! Vim pela página de tecnologia da Plena e tenho interesse no sistema Gestão Fit Pro. Gostaria de conhecer a licença vitalícia e testar a demonstração.',
  lavarapido: 'Olá! Vim pela página de tecnologia da Plena e tenho interesse no sistema Gestão Lava-Rápido. Gostaria de conhecer a licença vitalícia e testar a demonstração.',
  sorveteria: 'Olá! Vim pela página de tecnologia da Plena e tenho interesse no sistema Sorveteria & Açaí Pro. Gostaria de conhecer a licença vitalícia e testar a demonstração.',
  pdv: 'Olá! Vim pela página de tecnologia da Plena e tenho interesse no sistema Gestão PDV Pro. Gostaria de conhecer a licença vitalícia e testar a demonstração.',
  salas: 'Olá! Vim pela página de tecnologia da Plena e tenho interesse no sistema Gestão Salas Pro. Gostaria de conhecer a licença vitalícia e testar a demonstração.',
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
  'gestao-terapia': commercialMessages.terapia,
  'gestao-odonto': commercialMessages.odonto,
  'gestao-fit': commercialMessages.fit,
  'gestao-lavarapido': commercialMessages.lavarapido,
  'gestao-sorveteria': commercialMessages.sorveteria,
  'gestao-pdv': commercialMessages.pdv,
  'gestao-salas': commercialMessages.salas,
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
  'site-premium-gastronomia': 'Olá! Vim pela página de tecnologia da Plena, naveguei no modelo de site premium para Restaurante & Gastronomia e gostaria de um orçamento para o meu negócio.',
  'site-premium-estetica': 'Olá! Vim pela página de tecnologia da Plena, naveguei no modelo de site premium para Clínica de Estética & Spa e gostaria de um orçamento para o meu negócio.',
  'site-premium-outro': 'Olá! Vim pela página de tecnologia da Plena, vi a vitrine de Sites Premium e gostaria de um modelo para o meu segmento.',
  'automacoes-ia': 'Olá! Vim pela página de tecnologia da Plena e quero entender o que dá para automatizar na minha operação. Gostaria de um diagnóstico.',
  'automacao-whatsapp': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em automação de atendimento no WhatsApp. Gostaria de um diagnóstico.',
  'automacao-leads': 'Olá! Vim pela página de tecnologia da Plena e quero organizar a captação e o encaminhamento de leads. Gostaria de um diagnóstico.',
  'automacao-integracoes': 'Olá! Vim pela página de tecnologia da Plena e preciso integrar meus sistemas (catálogo, estoque, pagamento, nota fiscal ou CRM). Gostaria de um diagnóstico.',
  'automacao-rotinas': 'Olá! Vim pela página de tecnologia da Plena e quero automatizar lembretes e rotinas do meu negócio. Gostaria de um diagnóstico.',
  'automacao-ia': 'Olá! Vim pela página de tecnologia da Plena e tenho interesse em um assistente de IA com o conteúdo do meu negócio. Gostaria de entender o escopo.'
};

const solutionCatalog = [
  { categoria: 'sistemas', nome: 'Assistência Pro', setor: 'Assistências técnicas', preco: 'R$ 97/mês', status: 'Demo disponível', landingUrl: '../produtos/assistencia-pro.html', demoUrl: 'demos/gestao-assistencia/', ctaLabel: 'Conhecer página', whatsappMessage: commercialMessages.assistencia },
  { categoria: 'sistemas', nome: 'Barbearia Premium', setor: 'Barbearias', preco: 'R$ 79/mês', status: 'Demo disponível', landingUrl: '../produtos/barbearia-premium.html', demoUrl: 'demos/gestao-barbearia/', ctaLabel: 'Conhecer página', whatsappMessage: OFFER_MESSAGES['barbearia-premium'] },
  { categoria: 'sistemas', nome: 'Gestão Terapia Pro', setor: 'Psicologia e terapia', preco: 'R$ 499,90 vitalício', status: 'Demo disponível', landingUrl: '../produtos/gestao-terapia.html', demoUrl: 'demos/gestao-terapia/', ctaLabel: 'Conhecer página', whatsappMessage: commercialMessages.terapia },
  { categoria: 'sistemas', nome: 'Gestão Odonto Pro', setor: 'Odontologia e clínicas', preco: 'R$ 299,90 vitalício', status: 'Demo disponível', landingUrl: '../produtos/gestao-odonto.html', demoUrl: 'demos/gestao-odonto/', ctaLabel: 'Conhecer página', whatsappMessage: commercialMessages.odonto },
  { categoria: 'sistemas', nome: 'Gestão Fit Pro', setor: 'Personal trainers e fitness', preco: 'R$ 299,90 vitalício', status: 'Demo disponível', landingUrl: '../produtos/gestao-fit.html', demoUrl: 'demos/gestao-fit/', ctaLabel: 'Conhecer página', whatsappMessage: commercialMessages.fit },
  { categoria: 'sistemas', nome: 'Gestão Lava-Rápido', setor: 'Lava-rápidos e estética automotiva', preco: 'R$ 299,90 vitalício', status: 'Demo disponível', landingUrl: '../produtos/gestao-lavarapido.html', demoUrl: 'demos/gestao-lavarapido/index.html', ctaLabel: 'Conhecer página', whatsappMessage: commercialMessages.lavarapido },
  { categoria: 'sistemas', nome: 'Sorveteria & Açaí Pro', setor: 'Sorveterias e açaí', preco: 'R$ 299,90 vitalício', status: 'Demo disponível', landingUrl: '../produtos/gestao-sorveteria.html', demoUrl: 'demos/gestao-sorveteria/index.html', ctaLabel: 'Conhecer página', whatsappMessage: commercialMessages.sorveteria },
  { categoria: 'sistemas', nome: 'Gestão PDV Pro', setor: 'Comércio, varejo e mercadinhos', preco: 'R$ 299,90 vitalício', status: 'Demo disponível', landingUrl: '../produtos/gestao-pdv.html', demoUrl: 'demos/gestao-pdv/index.html', ctaLabel: 'Conhecer página', whatsappMessage: commercialMessages.pdv },
  { categoria: 'sistemas', nome: 'Gestão Salas Pro', setor: 'Coworking e locação de salas', preco: 'R$ 299,90 vitalício', status: 'Demo disponível', landingUrl: '../produtos/gestao-salas.html', demoUrl: 'demos/gestao-salas/index.html', ctaLabel: 'Conhecer página', whatsappMessage: commercialMessages.salas },
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

function activateTab(btn, updateHash = true) {
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
  if (updateHash) {
    const hash = Object.keys(DEEP_LINK_TABS).find(key => DEEP_LINK_TABS[key] === btn.dataset.target);
    if (hash) window.history.replaceState(null, '', hash);
  }
}

function activateTabByTarget(targetId) {
  const btn = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
  if (btn) activateTab(btn);
}

// Deep links do catálogo: abre a aba certa e rola até o catálogo.
// Usado pelos modelos premium, pelos 301 das páginas de portal aposentadas e por links de divulgação.
const DEEP_LINK_TABS = {
  '#sistemas': 'tab-gestão',
  '#sites-premium': 'tab-premium',
  '#landing-pages': 'tab-landing',
  '#ecommerce': 'tab-ecom',
  '#automacoes': 'tab-automacao',
  '#projetos-consulta': 'tab-sites',
  '#segmentos': 'tab-gestão',
};

function syncCatalogHash() {
  const target = DEEP_LINK_TABS[window.location.hash];
  const btn = target && document.querySelector(`.tab-btn[data-target="${target}"]`);
  if (!btn) return;
  activateTab(btn, false);
  document.getElementById('segmentos')?.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
  btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'auto' });
}
syncCatalogHash();
window.addEventListener('hashchange', syncCatalogHash);

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
  'gestao-terapia': 'demo',
  'gestao-odonto': 'demo',
  'gestao-fit': 'demo',
  'gestao-lavarapido': 'demo',
  'gestao-sorveteria': 'demo',
  'gestao-pdv': 'demo',
  'gestao-salas': 'demo',
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

// Menu mobile (mesmo padrão de dropdown da página inicial)

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('menu-btn');
  if (!menu) return;

  const willOpen = menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !willOpen);

  if (btn) btn.setAttribute('aria-expanded', String(willOpen));
  document.getElementById('icon-open')?.classList.toggle('hidden', !willOpen);
  document.getElementById('icon-close')?.classList.toggle('hidden', willOpen);
}

document.querySelectorAll('#mobile-menu .mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('mobile-menu');
    if (menu && !menu.classList.contains('hidden')) toggleMobileMenu();
  });
});

// Inicialização (Init)

injectNicheFilters();

// Briefing guiado da aba Projetos sob Consulta
// Quatro perguntas montam o resumo do pedido, sugerem um caminho no catálogo
// e preparam a mensagem do WhatsApp. Nada é enviado antes do clique.

const briefingForm = document.getElementById('briefing-form');

if (briefingForm) {
  const BRIEFING_QUESTIONS = [
    { name: 'negocio', prefix: 'Meu negócio é' },
    { name: 'necessidade', prefix: 'Preciso de' },
    { name: 'situacao', prefix: 'Hoje isso funciona com' },
    { name: 'prioridade', prefix: 'O que mais pesa é' },
  ];

  // Cada necessidade aponta para um destino real: uma aba do catálogo ou uma demo.
  const BRIEFING_ROUTES = {
    'um sistema de gestão para o meu segmento': { kind: 'tab', tab: 'tab-gestão', label: 'Ver os sistemas de gestão' },
    'um dashboard, relatório ou B.I.': { kind: 'demo', url: 'demos/projetos-b2b/demo-dashboard.html', offer: 'dashboards-bi', label: 'Abrir a demo de dashboard' },
    'um ERP ou sistema interno': { kind: 'demo', url: 'demos/projetos-b2b/demo-erp.html', offer: 'erps-custom', label: 'Abrir a demo de ERP' },
    'um CRM ou funil de vendas': { kind: 'demo', url: 'demos/projetos-b2b/demo-crm.html', offer: 'crms', label: 'Abrir a demo de CRM' },
    'um portal ou área do cliente': { kind: 'demo', url: 'demos/projetos-b2b/demo-portal.html', offer: 'portais', label: 'Abrir a demo de portal' },
    'um site institucional ou premium': { kind: 'tab', tab: 'tab-premium', label: 'Ver os modelos de Sites Premium' },
    'uma página de campanha': { kind: 'tab', tab: 'tab-landing', label: 'Ver os modelos de landing page' },
    'uma loja virtual': { kind: 'tab', tab: 'tab-ecom', label: 'Ver os modelos de e-commerce' },
    'uma automação ou integração': { kind: 'tab', tab: 'tab-automacao', label: 'Ver as automações e IA' },
  };

  // Negócio informado -> card do sistema correspondente na aba Sistemas de Gestão.
  const BRIEFING_SEGMENT_CARDS = {
    'uma assistência técnica': { offer: 'assistencia-pro', name: 'Assistência Pro' },
    'uma barbearia ou salão': { offer: 'barbearia-premium', name: 'Barbearia Premium' },
    'um restaurante ou delivery': { offer: 'gestao-gastro', name: 'Gestão Gastro' },
    'um espaço de beleza e estética': { offer: 'beleza-spa', name: 'Beleza & Spa' },
    'uma clínica de terapia': { offer: 'gestao-terapia', name: 'Gestão Terapia Pro' },
    'uma clínica odontológica': { offer: 'gestao-odonto', name: 'Gestão Odonto Pro' },
    'uma academia ou personal trainer': { offer: 'gestao-fit', name: 'Gestão Fit Pro' },
    'um lava-rápido ou estética automotiva': { offer: 'gestao-lavarapido', name: 'Gestão Lava-Rápido' },
    'uma sorveteria ou açaí': { offer: 'gestao-sorveteria', name: 'Sorveteria & Açaí Pro' },
    'um comércio, mercado ou PDV': { offer: 'gestao-pdv', name: 'Gestão PDV Pro' },
    'um espaço coworking ou locação de salas': { offer: 'gestao-salas', name: 'Gestão Salas Pro' },
  };

  const summaryEl = document.getElementById('briefing-summary');
  const routeWrap = document.getElementById('briefing-route-wrap');
  const routeBtn = document.getElementById('briefing-route');
  const noteEl = document.getElementById('briefing-nota');
  const submitBtn = briefingForm.querySelector('button[type="submit"]');
  const resetBtn = briefingForm.querySelector('.briefing-reset');

  let currentRoute = null;

  function briefingAnswers() {
    return BRIEFING_QUESTIONS.map(question => {
      const checked = briefingForm.querySelector(`input[name="${question.name}"]:checked`);
      return checked ? checked.value : null;
    });
  }

  function briefingSentences() {
    const answers = briefingAnswers();
    const sentences = [];
    answers.forEach((value, index) => {
      if (value) sentences.push(`${BRIEFING_QUESTIONS[index].prefix} ${value}.`);
    });
    const note = (noteEl && noteEl.value ? noteEl.value : '').trim();
    if (note) sentences.push(`Observação: ${note}`);
    return sentences;
  }

  function briefingMessage() {
    return [
      'Olá! Vim pela página de tecnologia da Plena, na aba Projetos sob Consulta.',
      '',
      briefingSentences().join('\n'),
      '',
      'Gostaria de um diagnóstico.',
    ].join('\n');
  }

  // Quando a necessidade é um sistema de gestão, o negócio define o card exato.
  function resolveRoute() {
    const answers = briefingAnswers();
    const need = answers[1];
    const route = need ? BRIEFING_ROUTES[need] : null;
    if (!route) return null;

    if (route.kind === 'tab' && route.tab === 'tab-gestão') {
      const segmentCard = BRIEFING_SEGMENT_CARDS[answers[0]];
      if (segmentCard) {
        return {
          kind: 'tab',
          tab: route.tab,
          offer: segmentCard.offer,
          label: `Ver ${segmentCard.name} no catálogo`,
        };
      }
    }

    return route;
  }

  function goToTab(tab, offer) {
    activateTabByTarget(tab);

    const card = offer
      ? document.querySelector(`.tech-showcase article[data-offer="${offer}"]`)
      : null;

    if (card) {
      window.setTimeout(() => {
        card.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'center' });
        card.classList.add('is-briefing-focus');
        window.setTimeout(() => card.classList.remove('is-briefing-focus'), 3200);
      }, 80);
      return;
    }

    document.getElementById('soluções')?.scrollIntoView({
      behavior: REDUCED_MOTION ? 'auto' : 'smooth',
    });
  }

  function refreshBriefing() {
    const answers = briefingAnswers();
    const filled = answers.filter(Boolean).length;
    const complete = filled === BRIEFING_QUESTIONS.length;

    if (submitBtn) submitBtn.disabled = !complete;

    if (summaryEl) {
      summaryEl.textContent = complete
        ? briefingSentences().join(' ')
        : `Responda as ${BRIEFING_QUESTIONS.length} perguntas para montar o resumo (${filled} de ${BRIEFING_QUESTIONS.length}).`;
    }

    currentRoute = complete ? resolveRoute() : null;

    if (routeWrap && routeBtn) {
      if (currentRoute) {
        routeBtn.textContent = currentRoute.label;
        routeWrap.hidden = false;
      } else {
        routeWrap.hidden = true;
      }
    }
  }

  briefingForm.addEventListener('change', refreshBriefing);
  briefingForm.addEventListener('input', event => {
    if (event.target === noteEl) refreshBriefing();
  });

  briefingForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!briefingAnswers().every(Boolean)) return;
    openWhatsApp(briefingMessage(), { offer: 'projetos-consulta', category: 'briefing' });
  });

  if (routeBtn) {
    routeBtn.addEventListener('click', () => {
      if (!currentRoute) return;
      trackIntent('briefing-route', currentRoute.offer || currentRoute.tab, 'briefing');

      if (currentRoute.kind === 'demo') {
        window.open(currentRoute.url, '_blank', 'noopener,noreferrer');
        return;
      }

      goToTab(currentRoute.tab, currentRoute.offer);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      briefingForm.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; });
      if (noteEl) noteEl.value = '';
      refreshBriefing();
      briefingForm.querySelector('input[type="radio"]')?.focus();
    });
  }

  refreshBriefing();
}
