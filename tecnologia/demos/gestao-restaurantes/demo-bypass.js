/**
 * Camada comercial da demonstração Gestão Gastro.
 * Mantém o build distribuído intacto e atua somente após a interface carregar.
 */
(function () {
  'use strict';

  var WHATSAPP_PHONE = '5512992191018';
  var icon = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 11v18M25 11v18M18 21h7M25 29v24M41 11v20c0 6 4 10 10 10V11M51 41v12" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 53h39" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/></svg>';
  var guides = {
    'Dashboard': ['Veja o resumo de vendas, mesas e pedidos ativos.', 'Compare os indicadores antes de abrir um módulo operacional.', 'Use esta visão para entender o ritmo do turno.'],
    'PDV': ['Abra um pedido para conhecer o fluxo de venda.', 'Adicione itens e associe-os a uma mesa ou comanda.', 'Observe como o fechamento conversa com o caixa.'],
    'Mesas': ['Confira as mesas ocupadas e disponíveis.', 'Abra uma comanda para acompanhar itens e status.', 'Simule uma transferência ou fechamento de mesa.'],
    'Cozinha': ['Veja os pedidos separados pelo status de preparo.', 'Acompanhe a ordem de produção do turno.', 'Use o painel para entender o fluxo entre salão e cozinha.'],
    'Estoque': ['Confira insumos, fichas técnicas e níveis de reposição.', 'Observe os itens que exigem atenção.', 'Relacione as saídas do estoque às vendas da operação.'],
    'Cardápio': ['Explore categorias, produtos e preços cadastrados.', 'Confira como os itens aparecem no atendimento.', 'Use o catálogo para entender a manutenção da operação.'],
    'Clientes': ['Abra uma ficha de cliente para ver o histórico.', 'Confira pedidos e preferências registrados.', 'Use essas informações para melhorar o próximo atendimento.'],
    'Financeiro': ['Compare as movimentações de entrada e saída.', 'Observe o resultado do período selecionado.', 'Use os filtros para apoiar decisões de gestão.'],
    'Relatórios': ['Escolha o período que deseja analisar.', 'Compare vendas, ticket médio e itens mais vendidos.', 'Transforme os dados em decisões para o próximo turno.']
  };
  var moduleSamples = {
    'Dashboard': ['R$ 2.846,50 em vendas', '40 pedidos concluídos', '8 mesas ocupadas'],
    'PDV': ['Mesa 08 · 3 itens', 'R$ 96,70 no carrinho', 'Pagamento por PIX'],
    'Mesas': ['Mesa 04 · em atendimento', 'Mesa 08 · aguardando conta', '12 comandas no turno'],
    'Cozinha': ['7 pedidos em preparo', 'Tempo médio: 18 min', '2 pedidos prontos'],
    'Delivery': ['5 entregas no turno', 'R$ 18,00 de taxa média', '2 motoboys disponíveis'],
    'Pedidos Online': ['3 novos pedidos', 'Ticket médio: R$ 64,80', 'Canal: cardápio digital'],
    'Cardápio Digital': ['42 itens publicados', '8 categorias ativas', '156 acessos hoje'],
    'Vendas': ['R$ 2.846,50 faturados', '40 vendas concluídas', 'Hambúrgueres em destaque'],
    'Estoque': ['12 insumos monitorados', '3 itens em reposição', 'Custo estimado: R$ 486,20'],
    'Caixa': ['Caixa aberto às 11:00', 'R$ 2.846,50 recebidos', 'Saldo previsto: R$ 2.360,30'],
    'Cardápio': ['42 produtos cadastrados', 'Combo da casa: R$ 58,90', '8 categorias organizadas'],
    'Clientes': ['1.248 clientes cadastrados', '78 retornos no mês', 'Ticket médio: R$ 71,16'],
    'Colaboradores': ['9 colaboradores ativos', '3 turnos configurados', 'Equipe de cozinha completa'],
    'Fornecedores': ['14 fornecedores ativos', '3 cotações pendentes', 'Reposição para amanhã'],
    'Financeiro': ['Receitas: R$ 2.846,50', 'Despesas: R$ 486,20', 'Resultado: R$ 2.360,30'],
    'Diário': ['Turno da tarde registrado', '2 ocorrências anotadas', 'Checklist atualizado'],
    'Configurações': ['Plena Gastro Demo', 'Operação: salão e delivery', 'Impressora térmica ativa'],
    'Segurança': ['9 acessos autorizados', '0 alertas críticos', 'Auditoria do turno ativa'],
    'Suporte': ['1 solicitação simulada', 'Tempo médio: 12 min', 'Atendimento Plena disponível'],
    'Manual': ['20 módulos documentados', 'Fluxo de PDV disponível', 'Checklist de abertura pronto']
  };
  var lastGuideTitle = '';
  var lastSampleTitle = '';

  function goToOperationalView() {
    if (window.location.pathname.indexOf('/master') !== -1) {
      window.history.replaceState(null, '', window.location.pathname.replace(/\/master\/?$/, '/') + window.location.search + window.location.hash);
    }
  }

  function currentTitle() {
    var heading = document.querySelector('main h1, main h2');
    return heading ? heading.textContent.trim() : 'Dashboard';
  }

  function guideFor(title) {
    var key = Object.keys(guides).find(function (name) { return title.indexOf(name) !== -1; });
    return guides[key || 'Dashboard'];
  }

  function updateGuide() {
    var guide = document.getElementById('plena-gastro-demo-guide');
    if (!guide) return;
    var title = currentTitle();
    if (title === lastGuideTitle) return;
    lastGuideTitle = title;
    var steps = guideFor(title);
    guide.innerHTML = '<button type="button" aria-label="Fechar roteiro" style="position:absolute;top:8px;right:10px;border:0;background:transparent;color:#94a3b8;font-size:18px;cursor:pointer" onclick="this.parentElement.remove()">×</button>' +
      '<span style="display:block;margin-bottom:5px;color:#fdba74;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase">Roteiro rápido · ' + title + '</span>' +
      '<strong style="display:block;margin-bottom:8px;color:#fff;font-size:14px">O que testar agora</strong>' +
      '<ol style="margin:0;padding-left:17px;color:#fed7aa;font-size:12px;line-height:1.55"><li>' + steps[0] + '</li><li>' + steps[1] + '</li><li>' + steps[2] + '</li></ol>';
  }

  function hideMasterEntry() {
    document.querySelectorAll('a, button').forEach(function (element) {
      var label = (element.textContent || '').trim().toLowerCase();
      if (label === 'master' || label.indexOf('painel master') !== -1) element.style.display = 'none';
    });
  }

  function replaceBrokenBrandImage() {
    document.querySelectorAll('img[src="/favicon.png"], img[src$="/favicon.png"]').forEach(function (image) {
      if (image.dataset.plenaBrandFixed) return;
      image.dataset.plenaBrandFixed = 'true';
      image.style.display = 'none';
      var brandIcon = document.createElement('span');
      brandIcon.className = 'plena-gastro-app-icon';
      brandIcon.setAttribute('aria-hidden', 'true');
      brandIcon.innerHTML = icon;
      image.parentNode.insertBefore(brandIcon, image);
    });
  }

  function replaceLeafText(from, to) {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim() === from) {
        node.nodeValue = node.nodeValue.replace(from, to);
        return true;
      }
    }
    return false;
  }

  function enrichDashboardWithSampleData() {
    // O build da demonstração já entrega dados reais de teste pelo provider local.
    // Mantemos o roteiro sem reescrever métricas visuais por cima desses dados.
    return;
    if (currentTitle().indexOf('Dashboard') === -1) return;
    function setMetric(label, value) {
      var labelElement = Array.from(document.querySelectorAll('p, span, div')).find(function (element) {
        return element.children.length === 0 && element.textContent.trim() === label;
      });
      if (!labelElement) return;
      var card = labelElement.parentElement && labelElement.parentElement.parentElement;
      if (!card) return;
      var valueElement = Array.from(card.querySelectorAll('*')).reverse().find(function (element) {
        return element.children.length === 0 && (/^R\$\s?0[,.]00$/.test(element.textContent.trim()) || element.textContent.trim() === '0');
      });
      if (valueElement) valueElement.textContent = value;
    }
    replaceLeafText('0 fechados', '40 fechados');
    replaceLeafText('0 abertos', '7 abertos');
    replaceLeafText('0/0', '8/20');
    setMetric('Vendas hoje', 'R$ 2.846,50');
    setMetric('Ticket médio', 'R$ 71,16');
    setMetric('Pedidos', '40');
    setMetric('Mesas ocupadas', '8');
    replaceLeafText('R$ 0.00', 'R$ 486,20');
    replaceLeafText('R$ 0.00', 'R$ 2.360,30');
    replaceLeafText('Sem vendas hoje', 'Vendas simuladas do turno');
    replaceLeafText('Nenhum pedido fechado hoje', 'Pedidos simulados concluídos');
  }

  function enrichCurrentModuleWithSampleData() {
    // Os módulos já recebem coleções fictícias próprias no build de demonstração.
    return;
    var title = currentTitle();
    if (title === lastSampleTitle) return;
    var key = Object.keys(moduleSamples).find(function (name) { return title.indexOf(name) !== -1; });
    if (!key) return;
    var scrollArea = document.querySelector('main > header + div');
    if (!scrollArea) return;
    lastSampleTitle = title;
    var panel = document.getElementById('plena-gastro-module-sample');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'plena-gastro-module-sample';
      scrollArea.prepend(panel);
    }
    panel.setAttribute('data-demo-view', key);
    panel.innerHTML = '<span>Dados simulados · ' + key + '</span><div>' + moduleSamples[key].map(function (item) { return '<b>' + item + '</b>'; }).join('') + '</div>';
  }

  function injectLayer() {
    if (document.getElementById('plena-gastro-demo-banner')) return;

    var style = document.createElement('style');
    style.textContent = '#plena-gastro-demo-banner{position:fixed;z-index:999999;top:0;left:0;right:0;min-height:42px;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:7px 12px;background:#1f0d06;color:#fff;font:800 11px/1.2 Inter,system-ui,sans-serif;letter-spacing:.055em;text-transform:uppercase;box-shadow:0 2px 12px rgba(0,0,0,.35)}#plena-gastro-demo-banner .gastro-icon,.plena-gastro-app-icon{display:grid;place-items:center;width:32px;height:32px;flex:0 0 32px;color:#fdba74}.plena-gastro-app-icon svg{width:28px;height:28px}#plena-gastro-demo-banner .gastro-icon{width:24px;height:24px;flex-basis:24px}#plena-gastro-demo-banner button{border:0;border-radius:999px;background:#fb7a32;color:#250b03;padding:6px 10px;font:900 11px/1 Inter,system-ui,sans-serif;cursor:pointer}#plena-gastro-module-sample{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:0 0 18px;padding:11px 14px;border:1px solid rgba(251,122,50,.26);border-radius:12px;background:rgba(251,122,50,.08);color:#fed7aa;font:600 12px/1.4 Inter,system-ui,sans-serif}#plena-gastro-module-sample>span{font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#fdba74}#plena-gastro-module-sample>div{display:flex;gap:8px;flex-wrap:wrap}#plena-gastro-module-sample b{padding:5px 8px;border-radius:999px;background:rgba(255,255,255,.07);font-size:11px;font-weight:700}#plena-gastro-demo-guide{position:fixed;right:16px;bottom:16px;z-index:999998;max-width:292px;padding:14px 16px;border:1px solid rgba(253,186,116,.28);border-radius:16px;background:rgba(31,13,6,.95);box-shadow:0 14px 38px rgba(0,0,0,.3);font-family:Inter,system-ui,sans-serif}@media(max-width:600px){#plena-gastro-module-sample{align-items:flex-start}#plena-gastro-demo-guide{right:10px;bottom:10px;left:10px;max-width:none}#plena-gastro-demo-banner{font-size:9px}}';
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'plena-gastro-demo-banner';
    banner.innerHTML = '<span class="gastro-icon" aria-hidden="true">' + icon + '</span><span>Modo demonstração · Gestão Gastro · dados simulados</span><button type="button">Gostei, chamar no WhatsApp</button>';
    document.body.prepend(banner);
    document.body.style.paddingTop = '42px';
    banner.querySelector('button').addEventListener('click', function () {
      window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent('Olá! Testei a demonstração do Gestão Gastro Pro e gostaria de conhecer planos e implantação.'), '_blank', 'noopener,noreferrer');
    });

    var guide = document.createElement('div');
    guide.id = 'plena-gastro-demo-guide';
    document.body.appendChild(guide);
    hideMasterEntry();
    replaceBrokenBrandImage();
    updateGuide();
    window.setTimeout(enrichDashboardWithSampleData, 900);
    window.setTimeout(enrichCurrentModuleWithSampleData, 1000);
    new MutationObserver(function (records) {
      var changedOutsideGuide = records.some(function (record) { return !guide.contains(record.target); });
      if (!changedOutsideGuide) return;
      hideMasterEntry();
      replaceBrokenBrandImage();
      updateGuide();
      enrichDashboardWithSampleData();
      enrichCurrentModuleWithSampleData();
    }).observe(document.body, { childList: true, subtree: true });
  }

  goToOperationalView();
  document.addEventListener('DOMContentLoaded', function () { window.setTimeout(injectLayer, 250); });
}());
