/**
 * Roteamento contextual de entrada da demonstração Gestão Gastro Pro (?view=...).
 * Isolado do build compilado: aciona a navegação da barra lateral assim que o painel monta.
 */
(function (root) {
  'use strict';

  var VIEW_CONFIG = {
    dashboard: { label: 'Dashboard', heading: 'Dashboard' },
    pdv: { label: 'PDV (Balcao)', heading: 'PDV Balcão' },
    mesas: { label: 'Mesas', heading: 'Mesas' },
    cozinha: { label: 'Cozinha', heading: 'Cozinha' },
    delivery: { label: 'Delivery', heading: 'Delivery' },
    'pedidos-online': { label: 'Pedidos Online', heading: 'Pedidos Online' },
    'cardapio-digital': { label: 'Cardapio Digital', heading: 'Cardápio Digital' },
    clientes: { label: 'Clientes', heading: 'Clientes' },
    vendas: { label: 'Vendas', heading: 'Vendas' },
    produtos: { label: 'Produtos', heading: 'Cardápio' },
    estoque: { label: 'Estoque', heading: 'Estoque' },
    fornecedores: { label: 'Fornecedores', heading: 'Fornecedores' },
    colaboradores: { label: 'Colaboradores', heading: 'Colaboradores' },
    caixa: { label: 'Caixa', heading: 'Caixa' },
    relatorios: { label: 'Financeiro', heading: 'Financeiro' },
    intelligence: { label: 'Inteligencia', heading: 'Inteligência' },
    diario: { label: 'Diario', heading: 'Diario' },
    configuracoes: { label: 'Configuracoes', heading: 'Configurações' },
    seguranca: { label: 'Seguranca', heading: 'Segurança' },
    suporte: { label: 'Suporte', heading: 'Suporte' },
    manual: { label: 'Manual de Uso', heading: 'Manual de Uso' }
  };

  var VALID_VIEWS = Object.keys(VIEW_CONFIG);

  var VIEW_ALIASES = {
    balcao: 'pdv',
    pos: 'pdv',
    salao: 'mesas',
    tables: 'mesas',
    comandas: 'mesas',
    kds: 'cozinha',
    kitchen: 'cozinha',
    inventory: 'estoque',
    stock: 'estoque',
    insumos: 'estoque',
    finance: 'relatorios',
    financeiro: 'relatorios',
    reports: 'relatorios',
    menu: 'produtos',
    cardapio: 'produtos',
    clients: 'clientes',
    customers: 'clientes',
    orders: 'pedidos-online',
    overview: 'dashboard',
    home: 'dashboard'
  };

  function normalizeRequestedView(rawView) {
    if (typeof rawView !== 'string') return null;
    var normalized = rawView.trim().toLowerCase();
    if (!normalized) return null;
    if (VIEW_ALIASES[normalized]) {
      normalized = VIEW_ALIASES[normalized];
    }
    return VIEW_CONFIG[normalized] ? normalized : null;
  }

  function readRequestedView(search) {
    var source = typeof search === 'string'
      ? search
      : (typeof window !== 'undefined' ? window.location.search : '');
    if (!source) return null;
    var params = new URLSearchParams(source);
    return normalizeRequestedView(params.get('view'));
  }

  function findNavButton(doc, label) {
    if (!doc) return null;
    var buttons = doc.querySelectorAll('aside nav button');
    for (var i = 0; i < buttons.length; i += 1) {
      var text = (buttons[i].textContent || '').trim();
      if (text === label) {
        return buttons[i];
      }
    }
    return null;
  }

  function isViewRendered(doc, viewId) {
    if (!doc) return false;
    var cfg = VIEW_CONFIG[viewId];
    if (!cfg) return false;
    var h1 = doc.querySelector('main h1');
    if (!h1 || (h1.textContent || '').trim() !== cfg.heading) return false;
    // Garante que o Suspense do chunk lazy terminou de carregar antes de liberar o sinal.
    var loadingSpinner = doc.querySelector('main > div .animate-spin.w-12');
    return !loadingSpinner;
  }

  function applyInitialRoute(options) {
    var opts = options || {};
    var doc = opts.document || (typeof document !== 'undefined' ? document : null);
    if (!doc) return false;

    var initialView = Object.prototype.hasOwnProperty.call(opts, 'view')
      ? normalizeRequestedView(opts.view)
      : readRequestedView(opts.search);
    var targetView = initialView || 'dashboard';
    var cfg = VIEW_CONFIG[targetView];
    if (!cfg) return false;

    var attempts = 0;
    var maxAttempts = Number(opts.maxAttempts || 120);
    var clicked = targetView === 'dashboard';
    var clickFn = typeof opts.clickButton === 'function'
      ? opts.clickButton
      : function (btn) { btn.click(); };

    if (typeof opts.immediate === 'boolean' && opts.immediate) {
      var btnNow = findNavButton(doc, cfg.label);
      if (!btnNow) return false;
      if (targetView !== 'dashboard') {
        clickFn(btnNow, targetView);
      }
      doc.documentElement.dataset.plenaDemoView = targetView;
      doc.documentElement.dataset.plenaDemoReady = 'true';
      return true;
    }

    function poll() {
      attempts += 1;
      var btn = findNavButton(doc, cfg.label);
      if (btn && !clicked) {
        clickFn(btn, targetView);
        clicked = true;
      }
      if (clicked && isViewRendered(doc, targetView)) {
        doc.documentElement.dataset.plenaDemoView = targetView;
        doc.documentElement.dataset.plenaDemoReady = 'true';
        if (typeof opts.onReady === 'function') opts.onReady(targetView);
        return true;
      }
      if (attempts < maxAttempts && typeof setTimeout === 'function') {
        setTimeout(poll, 75);
      } else {
        doc.documentElement.dataset.plenaDemoView = targetView;
        doc.documentElement.dataset.plenaDemoReady = 'false';
        doc.documentElement.dataset.plenaDemoError = 'route-timeout';
      }
      return false;
    }

    if (doc.readyState === 'loading' && typeof doc.addEventListener === 'function') {
      doc.addEventListener('DOMContentLoaded', poll, { once: true });
    } else {
      poll();
    }
    return true;
  }

  var api = {
    VALID_VIEWS: VALID_VIEWS,
    VIEW_ALIASES: VIEW_ALIASES,
    VIEW_CONFIG: VIEW_CONFIG,
    normalizeRequestedView: normalizeRequestedView,
    readRequestedView: readRequestedView,
    findNavButton: findNavButton,
    isViewRendered: isViewRendered,
    applyInitialRoute: applyInitialRoute
  };

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.PlenaGastroDemoEntry = api;

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    var capturedSearch = window.location.search;
    applyInitialRoute({ search: capturedSearch });
  }
}(typeof globalThis !== 'undefined' ? globalThis : this));
