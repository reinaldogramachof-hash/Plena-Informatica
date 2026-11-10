let operationalData = { services: [], employees: [], stock: [], customers: [], orders: [], cash: null, settings: null, notifications: [], audit: [], dashboard: null, finance: null, commissions: null };
let operationalLoading = false;
let operationalLoaded = false, operationalMutation = false, operationalLoadError = '';
let operationalGeneration = 0;
let cashSessions = [], operationalDraft = null, operationalOrderConfirmation = null, deliveryAfterPayment = null;
const localDay = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
let reportPeriod = { from: localDay().slice(0, 7) + '-01', to: localDay() };
let customerLookup = '';
let orderFilter = { search: '', stage: '', page: 1 };
function resetOperationalSession() {
  operationalGeneration += 1; operationalLoading = false;
  operationalData = { services: [], employees: [], stock: [], customers: [], orders: [], cash: null, settings: null, notifications: [], audit: [], dashboard: null, finance: null, commissions: null };
  operationalLoaded = false; operationalLoadError = ''; operationalDraft = null; operationalOrderConfirmation = null; deliveryAfterPayment = null; cashSessions = []; customerLookup = ''; orderFilter = { search: '', stage: '', page: 1 };
}
document.title = 'Gestão Lava-Rápido · Operação';

const stageLabel = { aguardando: 'Aguardando', lavagem: 'Em lavagem', acabamento: 'Em acabamento', pronto: 'Pronto', entregue: 'Entregue' };
const stageOrder = ['aguardando', 'lavagem', 'acabamento', 'pronto', 'entregue'];
const operationalMoney = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
const operationalDate = value => value ? new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—';
const operationalError = async callback => {
  if (operationalMutation) return;
  operationalMutation = true;
  const buttons = [...(typeof document.querySelectorAll === 'function' ? document.querySelectorAll('button') : [])].map(button => [button, button.disabled]);
  buttons.forEach(([button]) => { button.disabled = true; });
  try { await callback(); } catch (issue) { toast(issue.message || 'Não foi possível concluir a operação.'); }
  finally { operationalMutation = false; buttons.forEach(([button, disabled]) => { if (button && button.isConnected) button.disabled = disabled; }); }
};

async function refreshOperationalData() {
  if (!onlineReady || operationalLoading) return;
  const generation = operationalGeneration;
  operationalLoading = true; operationalLoadError = '';
  try {
    const [services, employees, stock, customers, orders, cash, settings, notifications] = await Promise.all([
      api('/api/operational/services'), api('/api/operational/employees'), api('/api/operational/stock'),
      api('/api/operational/customers'), api('/api/operational/orders'), api('/api/operational/cash'), api('/api/operational/settings'), api('/api/operational/notifications'),
    ]);
    let dashboard = null, finance = null, commissions = null, audit = [], sessions = [];
    if (authUser?.role !== 'operator') {
      const params = `?from=${encodeURIComponent(reportPeriod.from)}&to=${encodeURIComponent(reportPeriod.to)}`;
      const management = await Promise.all([api('/api/operational/dashboard'), api('/api/operational/finance' + params), api('/api/operational/commissions' + params), api('/api/audit?limit=20'), api('/api/operational/cash/history')]);
      [dashboard, finance, commissions] = management;
      audit = management[3].entries; sessions = management[4].sessions;
    }
    if (!onlineReady || generation !== operationalGeneration) return;
    cashSessions = sessions;
    operationalData = { services: services.services, employees: employees.employees, stock: stock.items, customers: customers.customers, orders: orders.orders, cash: cash.cash, settings: settings.settings, notifications: notifications.items, audit, dashboard, finance, commissions };
    operationalLoaded = true;
  } catch (issue) { if (generation === operationalGeneration) operationalLoadError = issue.message; throw issue; }
  finally { if (generation === operationalGeneration) operationalLoading = false; }
}

const operationalOrderTiming = order => {
  const duration = order.items.reduce((minutes, item) => minutes + Number(item.durationMinutes || 0), 0);
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - new Date(order.enteredAt).getTime()) / 60000));
  return { duration, elapsedMinutes, delayed: order.stage !== 'pronto' && duration > 0 && elapsedMinutes > duration + Number(operationalData.settings?.tolerance || 0) };
};
const sortOperationalQueue = orders => [...orders].sort((left, right) => {
  const leftTiming = operationalOrderTiming(left), rightTiming = operationalOrderTiming(right);
  if (leftTiming.delayed !== rightTiming.delayed) return leftTiming.delayed ? -1 : 1;
  return new Date(left.enteredAt).getTime() - new Date(right.enteredAt).getTime();
});
const operationalOrderCard = order => {
  const next = stageOrder[stageOrder.indexOf(order.stage) + 1];
  const action = next === 'entregue' ? 'beginOperationalDelivery' : 'advanceOperationalOrder';
  const { duration, elapsedMinutes, delayed } = operationalOrderTiming(order);
  return `<article class="order-card"><div class="order-card-top"><div><span class="eyebrow">OS #${order.sequence}</span><h3>${safeText(order.customer.name)}</h3><p>${safeText(order.vehicle.plate)} · ${safeText([order.vehicle.brand, order.vehicle.model].filter(Boolean).join(' ')) || 'Veículo'}</p><p>${safeText(order.employee?.name || 'Sem responsável')} · ${operationalDate(order.enteredAt)}</p></div>${badge(stageLabel[order.stage], order.stage === 'pronto' ? 'good' : '')}</div><div class="order-card-details"><span>${order.items.map(item => safeText(item.name)).join(' + ')}</span><strong>${operationalMoney(order.total)}</strong></div><div class="order-card-actions">${order.paymentStatus === 'paid' ? badge('Pago', 'good') : badge('A receber')}
  ${order.paymentStatus === 'pending' ? `<button class="small-button" onclick="openOperationalPayment('${order.id}')">Receber</button>` : ''}
  <button class="small-button" onclick="${action}('${order.id}')">${next === 'entregue' ? 'Conferir e entregar' : `Avançar para ${stageLabel[next]}`}</button>
  <button class="small-button" onclick="openOperationalOrder('${order.id}')">Detalhes</button></div><p>${elapsedMinutes} min no pátio · estimativa ${duration} min ${delayed ? badge('Atrasado', 'warn') : ''}</p></article>`;
};

function patio() {
  const orders = operationalData.orders.filter(order => order.paymentStatus !== 'cancelled');
  const delayed = orders.filter(order => operationalOrderTiming(order).delayed);
  const columns = stageOrder.filter(stage => stage !== 'entregue').map(stage => {
    const queued = sortOperationalQueue(orders.filter(order => order.stage === stage));
    return `<section class="operational-column"><div class="operational-column-title"><h3>${stageLabel[stage]}</h3><span>${queued.length}</span></div>${queued.map(operationalOrderCard).join('') || '<p class="muted empty-state">Nenhum veículo nesta etapa.</p>'}</section>`;
  }).join('');
  return head('Pátio e Fila', 'Atrasos aparecem primeiro; use Atualizar para conferir outra aba.', btn('Atualizar', 'reloadOperationalView()', 'refresh') + btn('Nova OS', "route('nova')", 'plus', true)) + `<div class="stats">${stat('No pátio', orders.filter(order => order.stage !== 'entregue').length, 'Ordens abertas', 'car')}${stat('Em atendimento', orders.filter(order => ['lavagem', 'acabamento'].includes(order.stage)).length, 'Lavagem e acabamento', 'drop')}${stat('Prontos', orders.filter(order => order.stage === 'pronto').length, 'Aguardando retirada ou pagamento', 'check')}${stat('Atrasadas', delayed.length, delayed.length ? 'Priorize os cartões sinalizados' : 'Nenhuma previsão ultrapassada', 'alert')}</div><p class="patio-priority-note">${delayed.length ? `${delayed.length} ordem(ns) ultrapassaram a previsão. Elas foram posicionadas primeiro em cada etapa.` : 'Os cartões seguem a ordem de chegada dentro de cada etapa.'}</p><section class="operational-board">${columns}</section>`;
}

function newOrder() {
  const services = operationalData.services.filter(item => item.active);
  const employees = operationalData.employees.filter(item => item.active);
  if (!services.length) return head('Nova Ordem de Serviço', 'Cadastre os serviços reais antes de iniciar.') + `<section class="panel"><p>Nenhum serviço ativo cadastrado.</p><button onclick="route('servicos')">Ir para Serviços</button></section>`;
  if (!operationalData.customers.length) return head('Nova Ordem de Serviço', 'Cadastre o primeiro cliente e veículo antes de abrir uma ordem.') + `<section class="panel empty-operational-state"><h2>Comece pela identificação do veículo</h2><p class="muted">A OS precisa de um cliente e de um veículo para manter o histórico correto desde a entrada.</p><button class="primary" onclick="openOperationalCustomer()">Cadastrar cliente e veículo</button></section>`;
  return head('Nova Ordem de Serviço', 'Identifique o veículo, registre a entrada e confira tudo antes de enviar ao pátio.') + `<div class="steps order-steps" aria-label="Etapas da nova ordem"><div class="step active"><span>1</span>Identificação</div><div class="step active"><span>2</span>Check-in e serviços</div><div class="step active"><span>3</span>Conferência</div></div><div class="two-grid"><section class="panel">
    <div class="intro-row"><div><h2>Dados da ordem</h2><p class="muted">Busque por nome, telefone ou placa. O cliente criado agora já fica pronto para esta OS.</p></div><button type="button" onclick="openOperationalCustomer()">Novo cliente</button></div>
    <form id="operational-order-form" onsubmit="createOperationalOrder(event)" class="form-stack">
      <label>Localizar cliente<input id="order-customer-search" type="search" placeholder="Nome, telefone ou placa" oninput="filterOperationalCustomers(this.value)"></label>
      <p id="order-customer-match" class="muted order-field-help">${operationalData.customers.length} clientes cadastrados.</p>
      <label>Cliente<select id="operational-customer" name="customerId" required onchange="refreshOperationalVehicles()"><option value="">Selecione um cliente</option>${operationalData.customers.map(customer => `<option value="${customer.id}">${safeText(customer.name)}</option>`).join('')}</select></label>
      <label>Veículo<select id="operational-vehicle" name="vehicleId" required><option value="">Selecione o cliente primeiro</option></select></label>
      <fieldset class="checkin-card"><legend>Check-in do veículo</legend><div class="form-grid">
        <label>Quilometragem<input name="odometerKm" type="number" min="0" max="2000000" step="1" placeholder="Opcional"></label>
        <label>Combustível<select name="fuelLevel">${['Não informado','Reserva','1/4','1/2','3/4','Cheio'].map(value => `<option>${value}</option>`).join('')}</select></label>
        <label>Chaves recebidas<input name="keyCount" type="number" min="0" max="10" step="1" value="1" required></label>
      </div><label>Itens e acessórios<textarea name="accessories" rows="2"></textarea></label><label>Condições e avarias aparentes<textarea name="conditionNotes" rows="2"></textarea></label></fieldset>
      <label>Serviço principal<select name="principalServiceId" required><option value="">Selecione</option>${services.map(service => `<option value="${service.id}">${safeText(service.name)} · ${operationalMoney(service.price)}</option>`).join('')}</select></label>
      <fieldset class="checkin-card"><legend>Serviços adicionais</legend>${services.map(service => `<label class="option"><input name="additionalServiceIds" type="checkbox" value="${service.id}"> ${safeText(service.name)} · ${operationalMoney(service.price)}</label>`).join('')}</fieldset>
      <label>Responsável<select name="employeeId"><option value="">Não definido</option>${employees.map(employee => `<option value="${employee.id}">${safeText(employee.name)}</option>`).join('')}</select></label>
      <label>Desconto (R$)<input name="discount" type="number" min="0" step="0.01" value="0"></label>
      <label>Observações<textarea name="note" rows="3"></textarea></label>
      <p class="muted">O rascunho é preservado durante a navegação nesta sessão, mas não após sair ou recarregar.</p>
      <div class="form-actions"><button type="button" onclick="discardOperationalDraft()">Limpar rascunho</button><button class="primary">Conferir e abrir pátio</button></div>
    </form></section><aside class="panel"><h2>Conferência da entrada</h2><div id="order-live-summary" aria-live="polite"></div><p class="muted">Preço, duração e comissão do responsável são registrados na abertura. O recebimento acontece depois, no Caixa.</p><div class="flow-list">${stageOrder.map(stage => `<span>${stageLabel[stage]}</span>`).join('')}</div></aside></div>`;
}

function ordersPage() {
  const term = orderFilter.search.toLocaleLowerCase('pt-BR');
  const filtered = operationalData.orders.filter(order => (!orderFilter.stage || (orderFilter.stage === 'cancelled' ? order.paymentStatus === 'cancelled' : order.stage === orderFilter.stage && order.paymentStatus !== 'cancelled')) && [order.sequence, order.customer.name, order.customer.phone, order.vehicle.plate].join(' ').toLocaleLowerCase('pt-BR').includes(term));
  const pages = Math.max(1, Math.ceil(filtered.length / 20)); orderFilter.page = Math.min(orderFilter.page, pages);
  const rows = filtered.slice((orderFilter.page - 1) * 20, orderFilter.page * 20).map(order => ['#' + order.sequence, '<b>' + safeText(order.customer.name) + '</b><br><small>' + safeText(order.vehicle.plate) + '</small>', stageLabel[order.stage], operationalMoney(order.total), badge(order.paymentStatus === 'cancelled' ? 'Cancelada' : order.paymentStatus === 'paid' ? 'Pago' : 'A receber', order.paymentStatus === 'paid' ? 'good' : ''), '<button class="small-button" onclick="openOperationalOrder(\'' + order.id + '\')">Ver detalhes</button>']);
  return head('Ordens de Serviço', 'Histórico com busca por número, cliente, telefone ou placa.', btn('Atualizar', 'reloadOperationalView()', 'refresh')) + '<section class="panel"><form onsubmit="applyOrderFilter(event)" class="form-grid"><label>Buscar<input name="search" type="search" value="' + safeText(orderFilter.search) + '"></label><label>Situação<select name="stage"><option value="">Todas</option>' + [...Object.entries(stageLabel), ['cancelled', 'Canceladas']].map(([value, label]) => '<option value="' + value + '" ' + (orderFilter.stage === value ? 'selected' : '') + '>' + label + '</option>').join('') + '</select></label><button>Buscar</button></form><p class="muted">' + filtered.length + ' ordens encontradas.</p>' + (rows.length ? table(['OS', 'Cliente / veículo', 'Etapa', 'Total', 'Pagamento', ''], rows) : '<p>Nenhuma ordem para os filtros informados.</p>') + '<div class="form-actions"><button onclick="changeOrderPage(-1)" ' + (orderFilter.page <= 1 ? 'disabled' : '') + '>Anterior</button><span>Página ' + orderFilter.page + ' de ' + pages + '</span><button onclick="changeOrderPage(1)" ' + (orderFilter.page >= pages ? 'disabled' : '') + '>Próxima</button></div></section>';
}
function applyOrderFilter(event) { event.preventDefault(); orderFilter = { ...Object.fromEntries(new FormData(event.target)), page: 1 }; render(); }
function changeOrderPage(delta) { orderFilter.page += delta; render(); }
function operationalPeriodControls() {
  return '<section class="panel"><form class="form-grid" onsubmit="applyOperationalPeriod(event)"><label>De<input name="from" type="date" value="' + reportPeriod.from + '" required></label><label>Até<input name="to" type="date" value="' + reportPeriod.to + '" required></label><button>Aplicar período</button></form><p class="muted">Datas da unidade (horário de São Paulo). Contas a receber mostram todas as pendências atuais.</p></section>';
}
async function applyOperationalPeriod(event) {
  event.preventDefault(); const period = Object.fromEntries(new FormData(event.target));
  if (period.from > period.to) return toast('A data inicial deve ser anterior à final.');
  reportPeriod = period; await reloadOperationalView();
}

function dashboard() {
  const summary = operationalData.dashboard, orders = operationalData.orders;
  const activeOrders = orders.filter(order => order.paymentStatus !== 'cancelled');
  const stages = summary?.stages || Object.fromEntries(stageOrder.map(stage => [stage, activeOrders.filter(order => order.stage === stage).length]));
  const lowStock = summary?.lowStock || operationalData.stock.filter(item => item.active && Number(item.quantity) <= Number(item.minimumQuantity));
  const readyToReceive = activeOrders.filter(order => order.stage === 'pronto' && order.paymentStatus === 'pending');
  const businessDay = (summary?.today || localDay()).split('-').reverse().join('/');
  const canManageCash = authUser?.role !== 'operator';
  const pendingActions = [];
  if (!operationalData.cash) {
    pendingActions.push(`<div class="dashboard-action"><div>${badge('Caixa', 'warn')}<b>Caixa fechado</b><p>Abra o caixa antes de registrar recebimentos.</p></div>${canManageCash ? `<button class="small-button" onclick="route('caixa')">Abrir caixa</button>` : '<small>Aguarde a abertura por proprietário ou gestor.</small>'}</div>`);
  }
  readyToReceive.slice(0, 3).forEach(order => pendingActions.push(`<div class="dashboard-action"><div>${badge('Recebimento', 'warn')}<b>OS #${order.sequence} pronta</b><p>${safeText(order.customer.name)} · ${safeText(order.vehicle.plate)} · ${operationalMoney(order.total)}</p></div><button class="small-button" onclick="openOperationalPayment('${order.id}')">Receber</button></div>`));
  lowStock.slice(0, 3).forEach(item => pendingActions.push(`<div class="dashboard-action"><div>${badge('Estoque', 'warn')}<b>${safeText(item.name)} no mínimo</b><p>${safeText(item.quantity)} ${safeText(item.unit)} disponíveis · mínimo ${safeText(item.minimumQuantity)}</p></div><button class="small-button" onclick="route('estoque')">Conferir</button></div>`));
  const stageRows = stageOrder.map(stage => {
    const historic = stage === 'entregue';
    return `<p><span><b>${stageLabel[stage]}</b><small>${historic ? 'Histórico de entregas' : stage === 'pronto' ? 'Aguardando retirada ou pagamento' : 'Ordens em andamento'}</small></span><button class="small-button" onclick="route('${historic ? 'ordens' : 'patio'}')">${stages[stage] || 0} ${historic ? 'no histórico' : 'no pátio'}</button></p>`;
  }).join('');
  const actions = btn('Atualizar', 'reloadOperationalView()', 'refresh') + btn('Nova OS', "route('nova')", 'plus', true);
  const financialStats = summary ? `${stat('Entradas hoje', operationalMoney(summary.finance.incoming), 'Recebimentos e entradas extras do dia', 'chart')}${stat('Saídas hoje', operationalMoney(summary.finance.outgoing), 'Despesas, sangrias e devoluções do dia', 'money')}${stat('Saldo do dia', operationalMoney(summary.finance.balance), 'Entradas menos saídas registradas', 'wallet')}${stat('A receber', operationalMoney(summary.finance.receivables), `${summary.finance.receivableCount} ordens pendentes`, 'orders')}` : `${stat('No pátio', activeOrders.filter(order => order.stage !== 'entregue').length, 'Veículos em operação', 'car')}${stat('Em atendimento', activeOrders.filter(order => ['lavagem', 'acabamento'].includes(order.stage)).length, 'Lavagem e acabamento', 'drop')}${stat('Prontos', stages.pronto || 0, 'Aguardando retirada ou pagamento', 'check')}${stat('Estoque em alerta', lowStock.length, lowStock.length ? 'Itens para conferência' : 'Níveis adequados', 'box')}`;
  return head('Dashboard', `${summary ? 'Indicadores financeiros e operacionais' : 'Acompanhamento operacional'} de ${businessDay} (horário de São Paulo).`, actions) + `<div class="stats">${financialStats}</div><div class="two-grid"><section class="panel"><div class="dashboard-panel-head"><div><h2>Andamento das ordens</h2><p class="muted">Acesse o pátio para trabalhar nas etapas ou consulte o histórico.</p></div><button class="small-button" onclick="route('patio')">Abrir pátio</button></div><div class="summary-list dashboard-stage-list">${stageRows}</div></section><section class="panel"><div class="dashboard-panel-head"><div><h2>Prioridades de agora</h2><p class="muted">Pendências que exigem uma ação na operação.</p></div>${lowStock.length ? `<button class="small-button" onclick="route('estoque')">Estoque</button>` : ''}</div><div class="dashboard-actions">${pendingActions.length ? pendingActions.join('') : '<div class="empty-state"><p>Não há pendências operacionais no momento.</p><button class="small-button" onclick="route(\'patio\')">Ver pátio</button></div>'}</div></section></div>`;
}

function cashPage() {
  const cash = operationalData.cash;
  const pending = operationalData.orders.filter(order => order.paymentStatus === 'pending' && order.stage !== 'entregue').sort((left, right) => {
    if ((left.stage === 'pronto') !== (right.stage === 'pronto')) return left.stage === 'pronto' ? -1 : 1;
    return new Date(left.enteredAt).getTime() - new Date(right.enteredAt).getTime();
  });
  const readyToReceive = pending.filter(order => order.stage === 'pronto');
  const methods = cash?.methods || [], movements = cash?.movements || [];
  const canManageCash = authUser?.role !== 'operator';
  const actions = cash ? (canManageCash ? `<div class="form-actions">${btn('Novo movimento', 'openOperationalFinanceTransaction()', 'plus')}${btn('Fechar caixa', 'openOperationalCloseCash()', 'wallet')}</div>` : badge('Caixa aberto para recebimentos', 'good')) : (canManageCash ? btn('Abrir caixa', 'openOperationalOpenCash()', 'wallet', true) : badge('Aguardando abertura por gestor'));
  const cashContext = cash ? `<section class="cash-context"><span>${badge('Caixa aberto', 'good')}</span><p>Dinheiro esperado considera somente fundo inicial, recebimentos em dinheiro e movimentos do caixa. PIX e cartões aparecem por forma de pagamento, mas não entram no valor físico contado.</p></section>` : `<section class="cash-context"><span>${badge('Caixa fechado', 'warn')}</span><p>${canManageCash ? 'Abra o caixa para registrar recebimentos e movimentações. Nenhum pagamento é lançado enquanto ele estiver fechado.' : 'Aguarde proprietário ou gestor abrir o caixa. Você poderá registrar recebimentos assim que ele estiver disponível.'}</p></section>`;
  const pendingAction = cash ? '' : (canManageCash ? '<button class="small-button" onclick="openOperationalOpenCash()">Abrir caixa</button>' : '');
  const pendingSection = '<section class="panel"><div class="dashboard-panel-head"><div><h2>Ordens a receber</h2><p class="muted">Ordens prontas aparecem primeiro. O recebimento é manual e fica registrado no caixa atual.</p></div>' + pendingAction + '</div>' + (pending.length ? table(['OS', 'Cliente / etapa', 'Total', 'Ação'], pending.map(order => ['#' + order.sequence, safeText(order.customer.name) + '<br><small>' + safeText(order.vehicle.plate) + ' · ' + safeText(stageLabel[order.stage]) + '</small>', operationalMoney(order.total), cash ? '<button class="small-button" onclick="openOperationalPayment(\'' + order.id + '\')">Receber</button>' : '<small class="muted">Caixa fechado</small>'])) : '<p class="muted">Não há ordens pendentes.</p>') + '</section>';
  return head('Caixa', 'Recebimentos, movimentações e conferência do dinheiro físico.', actions) +
    '<div class="stats">' + stat('Status', cash ? 'Aberto' : 'Fechado', cash ? 'Desde ' + operationalDate(cash.openedAt) : 'Recebimentos bloqueados', 'wallet') + stat('Dinheiro esperado', operationalMoney(cash?.expectedAmount), 'Somente dinheiro físico', 'money') + stat('A receber', operationalMoney(pending.reduce((sum, order) => sum + Number(order.total), 0)), pending.length + ' ordens pendentes', 'orders') + stat('Prontas', readyToReceive.length, readyToReceive.length ? 'Priorize pagamento e entrega' : 'Nenhuma OS pronta pendente', 'check') + '</div>' + cashContext +
    pendingSection +
    '<div class="two-grid"><section class="panel"><h2>Recebimentos líquidos por forma</h2>' + (methods.length ? table(['Forma', 'Valor'], methods.map(item => [safeText(item.method), operationalMoney(item.amount)])) : '<p class="muted">Sem recebimentos neste caixa.</p>') + '</section><section class="panel"><h2>Movimentos do caixa atual</h2>' + (movements.length ? table(['Quando', 'Descrição', 'Forma', 'Valor'], movements.map(item => [operationalDate(item.createdAt), safeText(item.description), safeText(item.method), operationalMoney(item.amount)])) : '<p class="muted">Nenhum movimento registrado.</p>') + '</section></div>' +
    (authUser?.role === 'operator' ? '' : '<section class="panel"><h2>Últimos fechamentos</h2>' + (cashSessions.length ? table(['Fechado em', 'Dinheiro esperado', 'Conferido', 'Diferença', ''], cashSessions.map(item => [operationalDate(item.closedAt), operationalMoney(item.expected), operationalMoney(item.informed), operationalMoney(item.difference), `<button class="small-button" onclick="openOperationalCashSession('${item.id}')">Conferir</button>`])) : '<p class="muted">Nenhum caixa fechado.</p>') + '</section>');
}

function financePage() {
  const finance = operationalData.finance;
  if (!finance) return head('Financeiro', 'Movimentos e saldo da operação.') + `<section class="panel"><p class="muted">Seu perfil não possui acesso financeiro.</p></section>`;
  return head('Financeiro', 'Entradas, saídas e saldo registrados no período.', btn('Novo movimento', 'openOperationalFinanceTransaction()', 'plus', true)) + operationalPeriodControls() + `<div class="stats">${stat('Entradas', operationalMoney(finance.incoming), 'Pagamentos e receitas extras', 'chart')}${stat('Saídas', operationalMoney(finance.outgoing), 'Despesas e sangrias', 'money')}${stat('Saldo', operationalMoney(finance.balance), 'Resultado do período', 'wallet')}${stat('A receber', operationalMoney(finance.receivables), `${finance.receivableCount} ordens pendentes`, 'orders')}</div><section class="panel"><h2>Movimentos</h2>${finance.transactions.length ? table(['Data', 'Tipo', 'Descrição', 'Forma', 'Valor'], finance.transactions.map(transaction => [operationalDate(transaction.createdAt), transaction.kind === 'refund' ? 'Devolução de pagamento' : transaction.kind === 'payment' ? 'Pagamento de OS' : transaction.kind === 'income' ? 'Entrada' : transaction.kind === 'expense' ? 'Despesa' : 'Sangria', safeText(transaction.description), safeText(transaction.paymentMethod) || '—', `<b>${operationalMoney(transaction.amount)}</b>`])) : '<p class="muted">Nenhum movimento no período.</p>'}</section>`;
}

function commissionsPage() {
  const commissions = operationalData.commissions;
  if (!commissions) return head('Comissões', 'Cálculo por responsável.') + `<section class="panel"><p class="muted">Seu perfil não possui acesso a comissões.</p></section>`;
  return head('Comissões', 'Percentual congelado na abertura de cada OS; apuração por pagamento.') + operationalPeriodControls() + (commissions.legacyCount ? '<p class="notice">' + commissions.legacyCount + ' ordens antigas sem percentual histórico foram excluídas do valor calculado. Confira-as manualmente.</p>' : '') + `<div class="stats">${stat('Total previsto', operationalMoney(commissions.total), 'Comissões de ordens pagas', 'money')}${stat('Colaboradores', commissions.employees.filter(employee => employee.orderCount > 0).length, 'Com produção no período', 'users')}</div><section class="panel">${commissions.employees.length ? table(['Responsável', 'Função', 'Ordens pagas', 'Faturado', 'Taxa para novas OS', 'Comissão congelada'], commissions.employees.map(employee => [`<b>${safeText(employee.name)}</b>`, safeText(employee.role), employee.orderCount, operationalMoney(employee.billed), `${employee.commissionRate}%`, `<b>${operationalMoney(employee.commission)}</b>`])) : '<p class="muted">Cadastre os responsáveis para acompanhar as comissões.</p>'}</section>`;
}

function reportsPage() {
  const finance = operationalData.finance, commissions = operationalData.commissions, orders = operationalData.orders.filter(order => order.enteredAt && new Date(order.enteredAt).toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }) >= reportPeriod.from && new Date(order.enteredAt).toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }) <= reportPeriod.to);
  if (!finance) return head('Relatórios', 'Consolidação operacional.') + `<section class="panel"><p class="muted">Seu perfil não possui acesso a relatórios.</p></section>`;
  const listedOrders = orders.slice(0, 50);
  return head('Relatórios', 'Resumo exportável dos dados registrados no período.', btn('Exportar CSV completo', 'downloadOperationalReport()', 'download', true)) + operationalPeriodControls() + `<div class="two-grid"><section class="panel"><h2>Resumo financeiro</h2><div class="summary-list"><p><span>Entradas</span><b>${operationalMoney(finance.incoming)}</b></p><p><span>Saídas</span><b>${operationalMoney(finance.outgoing)}</b></p><p><span>Saldo</span><b>${operationalMoney(finance.balance)}</b></p><p><span>Em aberto</span><b>${operationalMoney(finance.receivables)}</b></p></div></section><section class="panel"><h2>Ordens de serviço</h2><div class="summary-list"><p><span>Total registrado</span><b>${orders.length}</b></p><p><span>Entregues</span><b>${orders.filter(order => order.stage === 'entregue').length}</b></p><p><span>Pagas</span><b>${orders.filter(order => order.paymentStatus === 'paid').length}</b></p></div></section></div><div class="two-grid"><section class="panel"><h2>Recebimentos por forma</h2>${finance.paymentMethods.length ? table(['Forma', 'Total'], finance.paymentMethods.map(item => [safeText(item.method), operationalMoney(item.amount)])) : '<p class="muted">Não há recebimentos registrados.</p>'}</section><section class="panel"><h2>Comissões previstas</h2>${commissions?.employees?.some(item => item.orderCount) ? table(['Responsável', 'Ordens', 'Comissão'], commissions.employees.filter(item => item.orderCount).map(item => [safeText(item.name), item.orderCount, operationalMoney(item.commission)])) : '<p class="muted">Não há comissões no período.</p>'}</section></div><section class="panel"><h2>Ordens do período</h2>${listedOrders.length ? table(['OS', 'Entrada', 'Cliente / veículo', 'Responsável', 'Etapa', 'Total'], listedOrders.map(order => ['#' + order.sequence, operationalDate(order.enteredAt), `<b>${safeText(order.customer.name)}</b><br><small>${safeText(order.vehicle.plate)}</small>`, safeText(order.employee?.name) || 'Não definido', safeText(order.paymentStatus === 'cancelled' ? 'Cancelada' : stageLabel[order.stage]), operationalMoney(order.total)])) + (orders.length > listedOrders.length ? `<p class="muted">Exibindo as primeiras ${listedOrders.length} ordens. A exportação contém todo o período.</p>` : '') : '<p class="muted">Nenhuma ordem registrada no período.</p>'}</section>`;
}

backupPage = function operationalBackupPage() {
  if (authUser?.role !== 'owner') {
    return head('Backup e Restauração', 'Proteção dos dados da unidade.') + `<section class="panel"><p class="muted">Somente o proprietário pode exportar ou restaurar dados da unidade.</p></section>`;
  }
  return head('Backup e Restauração', 'Uma cópia segura dos dados da sua operação.') +
    `<div class="notice">${icon('shield')}Os dados ficam armazenados no servidor local da unidade, com acesso autenticado. Mantenha cópias externas em um pendrive ou outro local seguro.</div>` +
    `<div class="two-grid"><section class="panel"><div class="intro-row"><span class="avatar">${icon('download')}</span><div><h2 style="margin:0">Gerar backup completo</h2><p class="muted" style="margin:5px 0">Exportação manual em arquivo JSON</p></div></div><p>Inclui clientes, veículos, ordens, serviços, equipe, estoque, caixa e configurações.</p><div class="form-actions">${btn('Baixar backup JSON', 'backupDownload()', 'download', true)}</div></section><section class="panel"><h2>Restaurar dados</h2><p class="muted">Selecione um backup gerado por este sistema. A restauração substituirá todas as informações atuais.</p><label for="restore">Arquivo de backup (.json)</label><input id="restore" type="file" accept=".json,application/json" onchange="prepareRestore(this)"><p id="restore-error" class="error"></p><div class="notice">Gere um backup dos dados atuais antes de restaurar outro arquivo. Uma cópia de segurança é criada automaticamente no servidor antes da restauração.</div></section></div>`;
};

notificationsPage = function operationalNotificationsPage() {
  const items = operationalData.notifications;
  return head('Notificações', 'Alertas derivados dos dados reais da operação.') + `<section class="panel"><div class="notification-list">${items.map(item => `<article class="notification-item ${safeText(item.level)}"><div><h3>${safeText(item.title)}</h3><p>${safeText(item.message)}</p></div>${badge(item.level === 'good' ? 'Em dia' : item.level === 'warning' ? 'Atenção' : 'Pendente', item.level === 'good' ? 'good' : '')}</article>`).join('')}</div></section>`;
};

settingsPage = function operationalSettingsPage() {
  if (typeof authUser !== 'undefined' && authUser?.role === 'operator') {
    return head('Configurações', 'Dados e controles da unidade.', typeof openPasswordChange === 'function' ? btn('Trocar minha senha', 'openPasswordChange()', 'shield') : '') + `<section class="panel"><h2>Acesso operacional</h2><p class="muted">Seu perfil pode operar ordens e atendimentos, mas não alterar dados administrativos.</p></section>`;
  }
  const s = operationalData.settings || {};
  const saasLicenseKey = (typeof state !== 'undefined' && state?.settings?.saasLicenseKey) || s.saasLicenseKey || '';
  const saasSlug = (typeof state !== 'undefined' && state?.settings?.saasSlug) || s.saasSlug || '';
  const paymentMethodsList = ['Dinheiro', 'PIX', 'Débito', 'Crédito', 'Outros'];
  const currentPayments = typeof s.payments === 'string'
    ? s.payments.split(',').map(item => item.trim()).filter(Boolean)
    : paymentMethodsList;
  const licensePanel = window.LavaRapidoLicense?.render?.() || '';
  const passwordBtn = typeof openPasswordChange === 'function' ? btn('Trocar minha senha', 'openPasswordChange()', 'shield') : '';
  const accessSection = `<section class="panel"><h2>Acessos da unidade</h2>${(typeof authUser !== 'undefined' && authUser?.role === 'owner')
    ? `<p class="muted">Crie usuários para gestores e operadores. Toda alteração fica registrada.</p>${typeof openAccessManager === 'function' ? btn('Gerenciar acessos', 'openAccessManager()', 'users') : ''}`
    : `<p class="muted">Somente o proprietário pode criar ou alterar acessos.</p>`}</section>`;

  return head('Configurações', 'Preferências da unidade e da operação.', passwordBtn) +
    `<form id="settings-form" onsubmit="saveSettings(event)">` +
      `<div class="two-grid">` +
        `<div>` +
          `<section class="panel">` +
            `<h2>Dados da unidade</h2>` +
            `<div class="form-grid">` +
              `<div><label for="settings-name">Nome da unidade *</label><input id="settings-name" name="name" type="text" value="${safeText(s.name || '')}" required minlength="2"></div>` +
              `<div><label for="settings-document">CNPJ ou CPF</label><input id="settings-document" name="document" type="text" value="${safeText(s.document || '')}"></div>` +
              `<div><label for="settings-phone">Telefone</label><input id="settings-phone" name="phone" type="tel" value="${safeText(s.phone || '')}"></div>` +
              `<div><label for="settings-hours">Horário de funcionamento</label><input id="settings-hours" name="hours" type="text" value="${safeText(s.hours || '')}"></div>` +
              `<div><label for="settings-address">Endereço</label><input id="settings-address" name="address" type="text" value="${safeText(s.address || '')}"></div>` +
            `</div>` +
          `</section>` +
          `<section class="panel">` +
            `<h2>Preferências operacionais</h2>` +
            `<div class="form-grid">` +
              `<div><label for="settings-tolerance">Tolerância de atraso (min)</label><input id="settings-tolerance" name="tolerance" type="number" min="0" max="120" value="${Number(s.tolerance ?? 15)}" required></div>` +
            `</div>` +
            `<fieldset class="checkin-card" style="margin-top:16px;">` +
              `<legend>Formas de pagamento aceitas *</legend>` +
              `<div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:8px;">` +
                paymentMethodsList.map(method => `
                  <label class="option" style="display:inline-flex; align-items:center; gap:6px;">
                    <input type="checkbox" name="payments" value="${method}" ${currentPayments.includes(method) ? 'checked' : ''}>
                    <span>${method}</span>
                  </label>
                `).join('') +
              `</div>` +
            `</fieldset>` +
          `</section>` +
        `</div>` +
        `<div>` +
          `<section class="panel">` +
            `<h2>Add-on SaaS: Agenda Online</h2>` +
            `<p class="muted">Opcional. Gerado pelo suporte ao evoluir sua licença vitalícia para o add-on SaaS.</p>` +
            `<div class="form-grid">` +
              `<div><label for="settings-saasLicenseKey">Chave da licença SaaS (saasLicenseKey)</label><input id="settings-saasLicenseKey" name="saasLicenseKey" type="text" value="${safeText(saasLicenseKey)}"></div>` +
              `<div><label for="settings-saasSlug">Slug da agenda (saasSlug)</label><input id="settings-saasSlug" name="saasSlug" type="text" value="${safeText(saasSlug)}"></div>` +
            `</div>` +
            `<div style="margin-top:12px;">` +
              (saasSlug
                ? `<a class="small-button" href="agendar/?s=${encodeURIComponent(saasSlug)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;">${icon('calendar')}Ver página pública de agendamento</a>`
                : `<button type="button" class="small-button" disabled>${icon('calendar')}Ver página pública de agendamento</button>`) +
            `</div>` +
          `</section>` +
          (licensePanel ? `<section class="panel"><h2>Licença do produto</h2>${licensePanel}</section>` : '') +
          accessSection +
          `<div class="form-actions" style="margin-top:16px;"><button class="primary" type="submit">${icon('check')}Salvar configurações</button></div>` +
        `</div>` +
      `</div>` +
    `</form>` +
    (operationalData.audit && operationalData.audit.length ? `<section class="panel"><h2>Histórico de alterações</h2>${table(['Quando', 'Ação', 'Responsável'], operationalData.audit.map(entry => [operationalDate(entry.createdAt), safeText(entry.action), safeText(entry.userName) || 'Sistema']))}</section>` : '');
};

function clientsPage() {
  const term = customerLookup.toLocaleLowerCase('pt-BR');
  const customers = operationalData.customers.filter(customer => [customer.name, customer.phone, ...customer.vehicles.map(vehicle => vehicle.plate)].join(' ').toLocaleLowerCase('pt-BR').includes(term));
  const activeVehicleIds = new Set(operationalData.orders.filter(order => order.stage !== 'entregue' && order.paymentStatus !== 'cancelled').map(order => order.vehicle.id));
  const vehicleCount = operationalData.customers.reduce((total, customer) => total + customer.vehicles.length, 0);
  const activeVehicles = operationalData.customers.flatMap(customer => customer.vehicles).filter(vehicle => activeVehicleIds.has(vehicle.id)).length;
  const clearSearch = customerLookup ? '<button type="button" class="small-button" onclick="customerLookup=\'\';render()">Limpar busca</button>' : '';
  const resultText = customerLookup ? `${customers.length} cliente(s) encontrado(s) para a busca.` : `${operationalData.customers.length} cliente(s) cadastrados; consulte o cadastro antes de abrir uma nova OS.`;
  return head('Clientes e Veículos', 'Cadastros reutilizados na OS e histórico preservado por cliente e placa.', btn('Novo cliente', 'openOperationalCustomer()', 'plus', true)) + `<div class="stats">${stat('Clientes', operationalData.customers.length, 'Contatos cadastrados', 'users')}${stat('Veículos', vehicleCount, 'Placas vinculadas', 'car')}${stat('No pátio', activeVehicles, activeVehicles ? 'Veículos com OS em andamento' : 'Nenhum veículo em atendimento', 'drop')}</div><section class="panel"><form onsubmit="event.preventDefault();customerLookup=this.elements.lookup.value;render()" class="form-grid"><label>Buscar nome, telefone ou placa<input name="lookup" type="search" value="${safeText(customerLookup)}" placeholder="Ex.: Ana, 11999999999 ou ABC1D23"></label><div class="form-actions"><button>Buscar</button>${clearSearch}</div></form><p class="muted customer-search-result" aria-live="polite">${resultText}</p></section>` + `<section class="panel">${customers.length ? table(['Cliente', 'Telefone', 'Veículos', ''], customers.map(customer => [`<b>${safeText(customer.name)}</b>`, safeText(customer.phone) || '—', customer.vehicles.map(vehicle => `<span class="badge">${safeText(vehicle.plate)}${vehicle.model ? ` · ${safeText(vehicle.model)}` : ''}${activeVehicleIds.has(vehicle.id) ? ' · No pátio' : ''}</span>`).join(' '), `<button class="small-button" onclick="openOperationalCustomer('${customer.id}')">Abrir cadastro</button>`])) : `<div class="empty-state"><p>${customerLookup ? 'Nenhum cliente corresponde à busca.' : 'Nenhum cliente cadastrado.'}</p><button class="small-button" onclick="openOperationalCustomer()">Cadastrar cliente e veículo</button></div>`}</section>`;
}

function servicesPage() {
  const services = operationalData.services;
  const canManage = authUser?.role !== 'operator';
  const active = services.filter(service => service.active), inactive = services.filter(service => !service.active);
  const activeDuration = active.reduce((total, service) => total + Number(service.durationMinutes || 0), 0);
  return head('Serviços e Combos', 'Tabela de preço usada na abertura da OS. Inative sem apagar para preservar o histórico.', canManage ? btn('Novo serviço', 'openOperationalService()', 'plus', true) : '') + `<div class="stats">${stat('Ativos', active.length, 'Disponíveis para novas OS', 'drop')}${stat('Pausados', inactive.length, inactive.length ? 'Não aparecem em novas OS' : 'Nenhum serviço pausado', 'alert')}${stat('Tempo catalogado', activeDuration + ' min', 'Soma das durações ativas', 'clock')}</div><section class="panel"><div class="dashboard-panel-head"><div><h2>Catálogo de serviços</h2><p class="muted">Preço e duração são confirmados na OS; mudanças futuras não alteram ordens já abertas.</p></div>${canManage && active.length ? '<button class="small-button" onclick="route(\'nova\')">Abrir nova OS</button>' : ''}</div>${services.length ? table(['Serviço', 'Categoria', 'Duração', 'Preço', 'Comissão', 'Disponibilidade', ''], services.map(service => [`<b>${safeText(service.name)}</b>`, safeText(service.category) || 'Sem categoria', `${service.durationMinutes} min`, operationalMoney(service.price), `${service.commissionRate}%`, badge(service.active ? 'Disponível' : 'Pausado', service.active ? 'good' : ''), canManage ? `<button class="small-button" onclick="openOperationalService('${service.id}')">Editar</button>` : '<small class="muted">Somente leitura</small>'])) : `<div class="empty-state"><p>Nenhum serviço cadastrado. Cadastre a tabela real antes de abrir a primeira OS.</p>${canManage ? '<button class="small-button" onclick="openOperationalService()">Cadastrar serviço</button>' : ''}</div>`}</section>`;
}

function stockPage() {
  const items = operationalData.stock;
  const canManage = authUser?.role !== 'operator';
  const active = items.filter(item => item.active);
  const outOfStock = active.filter(item => Number(item.quantity) === 0);
  const lowStock = active.filter(item => Number(item.quantity) > 0 && Number(item.quantity) <= Number(item.minimumQuantity));
  const stockStatus = item => !item.active ? ['Pausado', ''] : Number(item.quantity) === 0 ? ['Sem estoque', 'warn'] : Number(item.quantity) < Number(item.minimumQuantity) ? ['Abaixo do mínimo', 'warn'] : Number(item.quantity) === Number(item.minimumQuantity) ? ['No mínimo', 'warn'] : ['Normal', 'good'];
  return head('Produtos e Estoque', 'Controle de insumos da operação. Toda movimentação fica registrada no histórico.', canManage ? btn('Novo produto', 'openOperationalStock()', 'plus', true) : '') + `<div class="stats">${stat('Itens ativos', active.length, 'Disponíveis para controle', 'box')}${stat('Sem estoque', outOfStock.length, outOfStock.length ? 'Reponha antes do próximo atendimento' : 'Nenhum item zerado', 'alert')}${stat('Em alerta', lowStock.length, lowStock.length ? 'Abaixo ou no nível mínimo' : 'Níveis adequados', 'chart')}</div><section class="panel"><div class="dashboard-panel-head"><div><h2>Saldo atual</h2><p class="muted">Use “Movimentar” para entrada, saída ou ajuste após a contagem física.</p></div></div>${items.length ? table(['Produto', 'Categoria', 'Saldo', 'Mínimo', 'Situação', ''], items.map(item => { const [label, tone] = stockStatus(item); return [`<b>${safeText(item.name)}</b>`, safeText(item.category) || '—', `${item.quantity} ${safeText(item.unit)}`, `${item.minimumQuantity} ${safeText(item.unit)}`, badge(label, tone), canManage ? `<button class="small-button" onclick="openOperationalStockMove('${item.id}')">Movimentar</button> <button class="small-button" onclick="openOperationalStock('${item.id}')">Editar</button> <button class="small-button" onclick="openOperationalStockHistory('${item.id}')">Histórico</button>` : '<small class="muted">Somente leitura</small>']; })) : `<div class="empty-state"><p>Nenhum insumo cadastrado. Cadastre os produtos que a equipe realmente controla.</p>${canManage ? '<button class="small-button" onclick="openOperationalStock()">Cadastrar produto</button>' : ''}</div>`}</section>`;
}

function teamPage() {
  const employees = operationalData.employees;
  const canManage = authUser?.role !== 'operator';
  return head('Equipe', 'Responsáveis disponíveis para as ordens de serviço.', canManage ? btn('Novo funcionário', 'openOperationalEmployee()', 'plus', true) : '') + `<section class="panel">${employees.length ? table(['Nome', 'Função', 'Telefone', 'Comissão', 'Status', ''], employees.map(employee => [`<b>${safeText(employee.name)}</b>`, safeText(employee.role), safeText(employee.phone) || '—', `${employee.commissionRate}%`, badge(employee.active ? 'Ativo' : 'Inativo', employee.active ? 'good' : ''), canManage ? `<button class="small-button" onclick="openOperationalEmployee('${employee.id}')">Editar</button>` : '<small class="muted">Somente leitura</small>'])) : '<p class="muted">Nenhum funcionário cadastrado.</p>'}</section>`;
}

async function refreshOperationalScreen() { await refreshOperationalData(); render(); }
function refreshOperationalVehicles() {
  const customer = operationalData.customers.find(item => item.id === document.getElementById('operational-customer')?.value);
  const vehicle = document.getElementById('operational-vehicle');
  if (vehicle) vehicle.innerHTML = `<option value="">Selecione</option>${(customer?.vehicles || []).map(item => `<option value="${item.id}">${safeText(item.plate)} · ${safeText([item.brand, item.model].filter(Boolean).join(' '))}</option>`).join('')}`;
}
async function createOperationalOrder(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const payload = Object.fromEntries(form);
  payload.additionalServiceIds = form.getAll('additionalServiceIds');
  payload.checkin = { odometerKm: payload.odometerKm, fuelLevel: payload.fuelLevel, keyCount: payload.keyCount, accessories: payload.accessories, conditionNotes: payload.conditionNotes };
  ['odometerKm', 'fuelLevel', 'keyCount', 'accessories', 'conditionNotes'].forEach(key => delete payload[key]);
  const customer = operationalData.customers.find(item => item.id === payload.customerId);
  const vehicle = customer?.vehicles.find(item => item.id === payload.vehicleId);
  const selectedServices = operationalData.services.filter(item => [payload.principalServiceId, ...payload.additionalServiceIds].includes(item.id));
  const subtotal = selectedServices.reduce((sum, item) => sum + Number(item.price), 0), discount = Number(payload.discount || 0);
  if (!customer || !vehicle || !payload.principalServiceId) return toast('Selecione cliente, veículo e serviço principal antes de continuar.');
  if (discount < 0 || discount > subtotal) return toast('Revise o desconto antes de abrir a OS.');
  operationalOrderConfirmation = payload;
  const employee = operationalData.employees.find(item => item.id === payload.employeeId);
  modal('Conferir entrada no pátio', `<div class="summary-list order-confirmation"><p><span><b>Cliente</b><br><small>${safeText(customer.name)}${customer.phone ? ` · ${safeText(customer.phone)}` : ''}</small></span></p><p><span><b>Veículo</b><br><small>${safeText(vehicle.plate)} · ${safeText([vehicle.brand, vehicle.model, vehicle.color].filter(Boolean).join(' · ')) || 'Sem detalhes adicionais'}</small></span></p><p><span><b>Serviços</b><br><small>${selectedServices.map(item => safeText(item.name)).join(' + ')}</small></span></p><p><span><b>Responsável</b><br><small>${safeText(employee?.name || 'Não definido')}</small></span></p><p><span><b>Check-in</b><br><small>${payload.checkin.keyCount || 0} chave(s) · ${safeText(payload.checkin.fuelLevel || 'Não informado')}</small></span></p><p class="total"><span>Total da OS</span><b>${operationalMoney(subtotal - discount)}</b></p></div><p class="muted">A ordem entrará em Aguardando no Pátio. O pagamento não será registrado nesta etapa.</p><div class="form-actions"><button onclick="closeModal()">Voltar e editar</button><button class="primary" onclick="confirmOperationalOrder()">Criar OS e abrir pátio</button></div>`);
}
async function confirmOperationalOrder() {
  const payload = operationalOrderConfirmation;
  if (!payload) return;
  await operationalError(async () => {
    const { order } = await api('/api/operational/orders', { method: 'POST', body: JSON.stringify(payload) });
    const sourceAppointmentId = payload.sourceAppointmentId;
    operationalOrderConfirmation = null; operationalDraft = null; closeModal(); await refreshOperationalData(); route('patio'); toast(`OS #${order.sequence} criada com sucesso.`);
    // Fechamento do add-on SaaS: se esta OS veio de um agendamento online
    // (convertAppointmentToOrder em app.js), avisa o backend pra não aparecer
    // mais como pendente. Fire-and-forget: nunca bloqueia nem falha a OS já criada.
    if (sourceAppointmentId) {
      const key = (typeof operationalData !== 'undefined' && operationalData?.settings?.saasLicenseKey) || (typeof state !== 'undefined' && state?.settings?.saasLicenseKey) || '';
      if (key) {
        fetch('../api_lavarapido_public.php?action=mark_converted', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ license_key: key, appointment_id: sourceAppointmentId }),
        }).catch(() => {});
      }
      if (typeof onlineAppointments !== 'undefined' && Array.isArray(onlineAppointments)) {
        onlineAppointments = onlineAppointments.filter(item => String(item.id) !== String(sourceAppointmentId));
      }
    }
  });
}
async function advanceOperationalOrder(orderId) {
  const order = operationalData.orders.find(item => item.id === orderId); if (!order) return;
  await operationalError(async () => { const { order: updated } = await api(`/api/operational/orders/${orderId}/advance`, { method: 'POST', body: JSON.stringify({ expectedStage: order.stage }) }); await refreshOperationalScreen(); toast(`OS #${updated.sequence} movida para ${stageLabel[updated.stage]}.`); });
}
function openOperationalOrder(orderId) {
  const order = operationalData.orders.find(item => item.id === orderId); if (!order) return;
  const history = order.history || [], checkin = order.checkin || {}, delivery = order.delivery;
  const checkinDetails = `<hr><div class="intro-row"><div><h3>Check-in de entrada</h3><p class="muted">Registro protegido após o início da lavagem.</p></div>${order.stage === 'aguardando' && order.paymentStatus !== 'cancelled' ? `<button type="button" class="small-button" onclick="openOperationalCheckin('${order.id}')">Editar check-in</button>` : ''}</div><div class="summary-list"><p><b>Quilometragem:</b> ${checkin.odometerKm === null || checkin.odometerKm === undefined ? 'Não informada' : `${safeText(checkin.odometerKm)} km`}</p><p><b>Combustível:</b> ${safeText(checkin.fuelLevel || 'Não informado')} · <b>Chaves:</b> ${safeText(checkin.keyCount ?? 0)}</p><p><b>Itens recebidos:</b> ${safeText(checkin.accessories || 'Não informado')}</p><p><b>Condições:</b> ${safeText(checkin.conditionNotes || 'Sem observações')}</p></div>`;
  const deliveryDetails = order.stage === 'pronto' || delivery ? `<hr><div class="intro-row"><div><h3>Conferência e entrega</h3><p class="muted">A entrega exige pagamento e conferência registrada.</p></div>${order.stage === 'pronto' && order.paymentStatus !== 'cancelled' ? `<button type="button" class="small-button" onclick="beginOperationalDelivery('${order.id}')">${delivery ? 'Revisar entrega' : 'Conferir entrega'}</button>` : ''}</div>${delivery ? `<div class="summary-list"><p><b>Recebido por:</b> ${safeText(delivery.receivedByName)}${delivery.receivedByDocument ? ` · ${safeText(delivery.receivedByDocument)}` : ''}</p><p><b>Itens conferidos:</b> ${delivery.accessoriesConfirmed ? 'Sim' : 'Não'} · <b>Condição final:</b> ${safeText(delivery.finalCondition || 'Sem observações')}</p><p><small>Conferido em ${operationalDate(delivery.checkedAt)}</small></p></div>` : '<p class="muted">Ainda não foi registrada a conferência final.</p>'}` : '';
  modal(`OS #${order.sequence}`, `<div class="summary-list"><p><b>Cliente:</b> ${safeText(order.customer.name)} · ${safeText(order.customer.phone)}</p><p><b>Veículo:</b> ${safeText(order.vehicle.plate)} · ${safeText([order.vehicle.brand, order.vehicle.model].filter(Boolean).join(' '))}</p><p><b>Etapa:</b> ${safeText(stageLabel[order.stage])}</p><p><b>Serviços:</b> ${order.items.map(item => safeText(item.name)).join(', ')}</p><p><b>Total:</b> ${operationalMoney(order.total)}</p><p><b>Pagamento:</b> ${order.paymentStatus === 'cancelled' ? 'Cancelada · ' + safeText(order.cancellationReason) : order.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}</p>${order.note ? `<p><b>Observações:</b> ${safeText(order.note)}</p>` : ''}</div>${checkinDetails}${deliveryDetails}<div class="form-actions">${order.stage === 'aguardando' && order.paymentStatus === 'pending' && authUser?.role !== 'operator' ? `<button onclick="openOperationalCorrection('${order.id}')">Corrigir OS</button>` : ''}<button onclick="window.print()">Imprimir OS (A4)</button>${order.stage !== 'entregue' && order.paymentStatus !== 'cancelled' && authUser?.role !== 'operator' ? `<button class="danger" onclick="openOperationalCancellation('${order.id}')">Cancelar OS</button>` : ''}</div><hr><h3>Histórico da ordem</h3><div class="summary-list">${history.length ? history.map(entry => `<p><span><b>${safeText(stageLabel[entry.stage])}</b><br><small>${safeText(entry.note)} · ${safeText(entry.changedBy)}</small></span><small>${operationalDate(entry.changedAt)}</small></p>`).join('') : '<p class="muted">Nenhum evento registrado.</p>'}</div>`);
}

function openOperationalCheckin(orderId) {
  const order = operationalData.orders.find(item => item.id === orderId); if (!order || order.stage !== 'aguardando') return toast('O check-in não pode mais ser alterado nesta etapa.');
  const checkin = order.checkin || {};
  modal(`Check-in · OS #${order.sequence}`, `<form onsubmit="saveOperationalCheckin(event, '${order.id}')" class="form-stack"><div class="form-grid"><label>Quilometragem<input name="odometerKm" type="number" min="0" max="2000000" step="1" value="${safeText(checkin.odometerKm ?? '')}"></label><label>Combustível<select name="fuelLevel">${['Não informado', 'Reserva', '1/4', '1/2', '3/4', 'Cheio'].map(level => `<option ${checkin.fuelLevel === level ? 'selected' : ''}>${level}</option>`).join('')}</select></label><label>Chaves recebidas<input name="keyCount" type="number" min="0" max="10" step="1" value="${safeText(checkin.keyCount ?? 0)}" required></label></div><label>Itens e acessórios recebidos<textarea name="accessories" rows="3">${safeText(checkin.accessories || '')}</textarea></label><label>Condições e avarias aparentes<textarea name="conditionNotes" rows="3">${safeText(checkin.conditionNotes || '')}</textarea></label><div class="form-actions"><button class="primary">Salvar check-in</button></div></form>`);
}

async function saveOperationalCheckin(event, orderId) {
  event.preventDefault();
  await operationalError(async () => { await api(`/api/operational/orders/${orderId}/checkin`, { method: 'PATCH', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }); closeModal(); await refreshOperationalScreen(); toast('Check-in atualizado.'); });
}
function openOperationalDelivery(orderId) {
  const order = operationalData.orders.find(item => item.id === orderId); if (!order || order.stage !== 'pronto') return toast('A conferência fica disponível quando a OS estiver pronta.');
  if (order.paymentStatus !== 'paid') return toast('Registre o pagamento antes da conferência de entrega.');
  const delivery = order.delivery || {};
  modal(`Conferência · OS #${order.sequence}`, `<p class="muted">Confirme o veículo e os itens recebidos antes de liberar a saída.</p><form onsubmit="saveOperationalDelivery(event, '${order.id}')" class="form-stack"><label>Quem recebeu o veículo<input name="receivedByName" value="${safeText(delivery.receivedByName || order.customer.name)}" minlength="2" required></label><label>Documento ou referência da retirada<input name="receivedByDocument" value="${safeText(delivery.receivedByDocument || '')}" placeholder="Opcional"></label><label>Condição final e observações<textarea name="finalCondition" rows="3" placeholder="Ex.: veículo conferido, sem novas avarias aparentes">${safeText(delivery.finalCondition || '')}</textarea></label><label class="option"><input name="accessoriesConfirmed" type="checkbox" ${delivery.accessoriesConfirmed ? 'checked' : ''} required> Itens e acessórios conferidos com o responsável</label><div class="form-actions"><button class="primary">Concluir conferência e entrega</button></div></form>`);
}
async function saveOperationalDelivery(event, orderId) {
  event.preventDefault();
  await operationalError(async () => { await api(`/api/operational/orders/${orderId}/delivery`, { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }); await api(`/api/operational/orders/${orderId}/advance`, { method: 'POST', body: JSON.stringify({ expectedStage: 'pronto' }) }); closeModal(); await refreshOperationalScreen(); toast('Conferência registrada e veículo entregue.'); });
}
function openOperationalPayment(orderId) {
  const order = operationalData.orders.find(item => item.id === orderId); if (!order || order.paymentStatus !== 'pending') return;
  if (!operationalData.cash) { deliveryAfterPayment = null; return modal('Caixa fechado', '<p>Abra o caixa e retorne à ordem para receber o pagamento.</p><button onclick="closeModal();route(\'caixa\')">Ir ao Caixa</button>'); }
  const methods = (operationalData.settings?.payments || 'Dinheiro,PIX,Débito,Crédito').split(',').map(value => value.trim());
  modal('Receber OS #' + order.sequence, '<p>' + safeText(order.customer.name) + ' · <b>' + safeText(order.vehicle.plate) + '</b></p><div class="summary-line total"><span>Total</span><b>' + operationalMoney(order.total) + '</b></div><form onsubmit="payOperationalOrder(event,\'' + order.id + '\')"><label>Forma de pagamento<select name="method" onchange="updateOperationalChange(this.form,' + order.total + ')">' + methods.map(method => '<option>' + safeText(method) + '</option>').join('') + '</select></label><label>Valor recebido (R$)<input name="receivedAmount" type="number" min="' + order.total + '" step="0.01" value="' + order.total + '" oninput="updateOperationalChange(this.form,' + order.total + ')" required></label><p id="operational-change" aria-live="polite"></p><p class="notice">Confirme manualmente o recebimento. Não há comunicação com bancos ou operadoras de cartão.</p><div class="form-actions"><button class="primary">Confirmar recebimento</button></div></form>');
  updateOperationalChange(document.querySelector('#dialog form'), order.total);
}
function updateOperationalChange(form, total) {
  const cash = form.elements.method.value === 'Dinheiro', input = form.elements.receivedAmount;
  input.readOnly = !cash; if (!cash) input.value = total;
  document.getElementById('operational-change').textContent = cash ? 'Troco: ' + operationalMoney(Math.max(0, Number(input.value) - total)) : 'Valor exato, sem troco.';
}
async function payOperationalOrder(event, orderId) {
  event.preventDefault();
  await operationalError(async () => {
    const result = await api('/api/operational/orders/' + orderId + '/payment', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) });
    closeModal(); await refreshOperationalScreen();
    toast(result.change > 0 ? 'Pagamento confirmado. Troco: ' + operationalMoney(result.change) : 'Pagamento confirmado.');
    if (deliveryAfterPayment === orderId) { deliveryAfterPayment = null; openOperationalDelivery(orderId); }
  });
}
function openOperationalOpenCash() { modal('Abertura de caixa', `<p class="muted">Informe apenas o dinheiro físico disponível para troco no início do turno.</p><form onsubmit="openOperationalCash(event)"><label>Fundo inicial (R$)<input name="openingAmount" type="number" min="0" step="0.01" value="0" required></label><div class="form-actions"><button class="primary">Abrir caixa</button></div></form>`); }
async function openOperationalCash(event) { event.preventDefault(); await operationalError(async () => { await api('/api/operational/cash/open', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }); closeModal(); await refreshOperationalScreen(); toast('Caixa aberto.'); }); }
function openOperationalCloseCash() { const expected = Number(operationalData.cash?.expectedAmount || 0); modal('Fechamento de caixa', '<p>Dinheiro físico esperado: <b>' + operationalMoney(expected) + '</b></p><p class="muted">Conte o dinheiro antes de informar o valor. Não some PIX ou cartões ao dinheiro físico.</p><form onsubmit="closeOperationalCash(event)"><label>Dinheiro conferido (R$)<input name="informedAmount" type="number" min="0" step="0.01" oninput="updateOperationalClosingDifference(this.form, ' + expected + ')" required></label><p id="operational-closing-difference" class="muted" aria-live="polite">Informe o valor contado para conferir a diferença.</p><div class="form-actions"><button class="primary">Fechar caixa</button></div></form>'); }
function updateOperationalClosingDifference(form, expected) { const value = form.elements.informedAmount.value; const feedback = document.getElementById('operational-closing-difference'); if (!feedback) return; if (value === '') return feedback.textContent = 'Informe o valor contado para conferir a diferença.'; const difference = Number(value) - expected; feedback.textContent = difference === 0 ? 'Conferência sem diferença.' : difference > 0 ? `Sobra informada: ${operationalMoney(difference)}.` : `Falta informada: ${operationalMoney(Math.abs(difference))}.`; }
async function closeOperationalCash(event) { event.preventDefault(); await operationalError(async () => { const { cash } = await api('/api/operational/cash/close', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }); closeModal(); await refreshOperationalScreen(); toast(`Caixa fechado. Diferença: ${operationalMoney(cash.difference)}.`); }); }
function openOperationalCashSession(sessionId) {
  const session = cashSessions.find(item => item.id === sessionId); if (!session) return;
  const methods = session.paymentMethods?.length ? table(['Forma', 'Recebimentos líquidos'], session.paymentMethods.map(item => [safeText(item.method), operationalMoney(item.amount)])) : '<p class="muted">Nenhum recebimento vinculado a este caixa.</p>';
  const transactions = session.transactions?.length ? table(['Quando', 'Tipo', 'Descrição', 'Forma', 'Valor', 'Responsável'], session.transactions.map(item => [operationalDate(item.createdAt), safeText(item.kind === 'payment' ? 'Pagamento' : item.kind === 'refund' ? 'Devolução' : item.kind === 'income' ? 'Entrada' : item.kind === 'expense' ? 'Despesa' : 'Sangria'), safeText(item.description), safeText(item.method) || '—', operationalMoney(item.amount), safeText(item.userName) || 'Sistema'])) : '<p class="muted">Nenhum movimento registrado.</p>';
  modal(`Fechamento de caixa · ${operationalDate(session.closedAt)}`, `<div class="stats">${stat('Fundo inicial', operationalMoney(session.opening), 'Abertura', 'money')}${stat('Esperado', operationalMoney(session.expected), 'Dinheiro físico', 'wallet')}${stat('Conferido', operationalMoney(session.informed), 'Valor informado', 'wallet')}${stat('Diferença', operationalMoney(session.difference), session.difference === 0 ? 'Sem divergência' : 'Conferir contado', 'chart')}</div><div class="summary-list"><p><span>Aberto por</span><b>${safeText(session.openedBy) || 'Não identificado'}</b></p><p><span>Fechado por</span><b>${safeText(session.closedBy) || 'Não identificado'}</b></p><p><span>Movimentos registrados</span><b>${session.transactionCount || 0}</b></p></div><hr><h3>Recebimentos por forma</h3>${methods}<hr><h3>Movimentos deste caixa</h3>${transactions}`);
}
function openOperationalFinanceTransaction() {
  if (!operationalData.cash) return toast('Abra o caixa antes de lançar uma entrada, despesa ou sangria.');
  modal('Novo movimento financeiro', `<form onsubmit="saveOperationalFinanceTransaction(event)"><label>Tipo<select name="kind"><option value="income">Entrada avulsa</option><option value="expense">Despesa</option><option value="withdrawal">Sangria</option></select></label><label>Valor (R$)<input name="amount" type="number" min="0.01" step="0.01" required></label><label>Motivo<input name="description" minlength="3" required></label><div class="form-actions"><button class="primary">Registrar movimento</button></div></form>`);
}
async function saveOperationalFinanceTransaction(event) { event.preventDefault(); await operationalError(async () => { await api('/api/operational/cash/transactions', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }); closeModal(); await refreshOperationalScreen(); toast('Movimento financeiro registrado.'); }); }
function downloadOperationalReport() {
  const finance = operationalData.finance; if (!finance) return;
  const orders = operationalData.orders.filter(order => order.enteredAt && new Date(order.enteredAt).toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }) >= reportPeriod.from && new Date(order.enteredAt).toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }) <= reportPeriod.to);
  const commissions = operationalData.commissions?.employees || [];
  const moneyValue = value => Number(value || 0).toFixed(2).replace('.', ',');
  const rows = [
    ['Seção', 'Data', 'Referência', 'Descrição', 'Forma / status', 'Valor'],
    ['Resumo', `${reportPeriod.from} a ${reportPeriod.to}`, '', 'Entradas', '', moneyValue(finance.incoming)],
    ['Resumo', `${reportPeriod.from} a ${reportPeriod.to}`, '', 'Saídas', '', moneyValue(finance.outgoing)],
    ['Resumo', `${reportPeriod.from} a ${reportPeriod.to}`, '', 'Saldo', '', moneyValue(finance.balance)],
    ...finance.transactions.map(transaction => ['Movimento financeiro', operationalDate(transaction.createdAt), transaction.orderSequence ? `OS #${transaction.orderSequence}` : '', transaction.description, transaction.paymentMethod, moneyValue(transaction.amount)]),
    ...orders.map(order => ['Ordem de serviço', operationalDate(order.enteredAt), `OS #${order.sequence}`, `${order.customer.name} · ${order.vehicle.plate}`, order.paymentStatus === 'cancelled' ? 'Cancelada' : `${stageLabel[order.stage]} · ${order.paymentStatus === 'paid' ? 'Paga' : 'A receber'}`, moneyValue(order.total)]),
    ...commissions.filter(employee => employee.orderCount).map(employee => ['Comissão prevista', `${reportPeriod.from} a ${reportPeriod.to}`, employee.name, `${employee.orderCount} ordens pagas`, `${employee.commissionRate}% em novas OS`, moneyValue(employee.commission)])
  ];
  const csv = rows.map(row => row.map(value => `"${operationalCsvCell(value)}"`).join(';')).join('\n');
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' })); link.download = `relatorio-lava-rapido-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(link.href);
}
async function saveSettings(event) {
  if (event?.preventDefault) event.preventDefault();
  let form;
  if (event instanceof FormData) {
    form = event;
  } else if (event?.formData instanceof FormData) {
    form = event.formData;
  } else {
    const formEl = event?.target && event.target.elements ? event.target : (document.getElementById('settings-form') || (typeof document.querySelector === 'function' ? document.querySelector('form') : null));
    form = formEl ? new FormData(formEl) : new FormData();
  }

  const paymentCheckboxes = form.getAll ? form.getAll('payments').filter(Boolean) : [];
  let payments = '';
  if (paymentCheckboxes.length > 0) {
    payments = paymentCheckboxes.join(', ');
  } else if (form.get && form.has && form.has('payments')) {
    payments = String(form.get('payments') || '').trim();
  }

  const saasLicenseKey = String(form.get ? (form.get('saasLicenseKey') ?? '') : '').trim();
  const saasSlug = String(form.get ? (form.get('saasSlug') ?? '') : '').trim();

  const payload = {
    name: String(form.get ? (form.get('name') ?? '') : '').trim(),
    phone: String(form.get ? (form.get('phone') ?? '') : '').trim(),
    document: String(form.get ? (form.get('document') ?? '') : '').trim(),
    address: String(form.get ? (form.get('address') ?? '') : '').trim(),
    hours: String(form.get ? (form.get('hours') ?? '') : '').trim(),
    tolerance: Number(form.get ? form.get('tolerance') : 0) || 0,
    payments,
    // Add-on SaaS: precisa ir no payload real (operational-store.js:updateUnitSettings
    // ja aceita esses dois campos), senao fica só em memória e some no próximo reload.
    saasLicenseKey,
    saasSlug,
  };

  if (typeof state !== 'undefined' && state?.settings) {
    state.settings.saasLicenseKey = saasLicenseKey;
    state.settings.saasSlug = saasSlug;
    if (typeof persist === 'function') persist();
  }
  if (typeof operationalData !== 'undefined' && operationalData?.settings) {
    operationalData.settings.saasLicenseKey = saasLicenseKey;
    operationalData.settings.saasSlug = saasSlug;
  }

  await operationalError(async () => {
    await api('/api/operational/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    await refreshOperationalData();
    if (typeof closeModal === 'function') closeModal();
    render();
    toast('Configurações salvas.');
  });
}

async function backupDownload() {
  await operationalError(async () => {
    const snapshot = await api('/api/operational/backup');
    const filename = `gestao-lava-rapido-backup-${new Date().toISOString().slice(0, 10)}.json`;
    const jsonStr = JSON.stringify(snapshot, null, 2);
    if (typeof download === 'function') {
      download(filename, jsonStr, 'application/json');
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([jsonStr], { type: 'application/json' }));
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    }
    toast('Backup gerado. Guarde o arquivo em local seguro.');
  });
}

let pendingRestoreSnapshot = null;

async function prepareRestore(input) {
  const file = input?.files ? input.files[0] : input;
  if (!file) return;
  const errorEl = document.getElementById('restore-error');
  if (errorEl) errorEl.textContent = '';

  try {
    let textContent = '';
    if (typeof file.text === 'function') {
      textContent = await file.text();
    } else {
      textContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }
    const snapshot = JSON.parse(textContent);
    pendingRestoreSnapshot = snapshot;

    const ordersCount = snapshot?.data?.orders?.length ?? (snapshot?.orders?.length ?? 0);
    const customersCount = snapshot?.data?.customers?.length ?? (snapshot?.customers?.length ?? (snapshot?.clients?.length ?? 0));
    const tenantName = snapshot?.tenant?.name ? safeText(snapshot.tenant.name) : 'Unidade';

    modal('Substituir todos os dados?', `
      <p>Este backup de <b>${tenantName}</b> contém <b>${ordersCount} ordens</b> e <b>${customersCount} clientes</b>.</p>
      <div class="notice">Os dados operacionais atuais serão substituídos pelo conteúdo do arquivo. Os acessos de usuários são preservados e uma cópia de segurança local é gerada pelo servidor.</div>
      <p id="restore-error" class="error"></p>
      <div class="form-actions">
        ${btn('Cancelar', 'closeModal()', 'close')}
        <button class="danger" onclick="restoreNow()">Confirmar restauração</button>
      </div>
    `);
  } catch (err) {
    const msg = 'Arquivo inválido ou incompatível. Nenhum dado foi alterado.';
    if (errorEl) errorEl.textContent = msg;
    else toast(msg);
  }
}

async function restoreNow(recovery = {}) {
  if (!pendingRestoreSnapshot) return;
  const errorEl = document.getElementById('restore-error');
  if (errorEl) errorEl.textContent = '';

  await operationalError(async () => {
    try {
      const response = await api('/api/operational/restore', {
        method: 'POST',
        body: JSON.stringify({
          snapshot: pendingRestoreSnapshot,
          recovery: recovery || {},
        }),
      });
      pendingRestoreSnapshot = null;
      if (typeof closeModal === 'function') closeModal();
      await refreshOperationalData();
      render();
      const result = response?.result || {};
      const orders = result.orders ?? 0;
      const customers = result.customers ?? 0;
      toast(`Backup restaurado: ${orders} ordens e ${customers} clientes.`);
    } catch (issue) {
      const message = issue.message || '';
      if (message.toLowerCase().includes('confirme a recuperação')) {
        modal('Confirmação de recuperação', `
          <div class="notice">${safeText(message)}</div>
          <form onsubmit="confirmRecoveryRestore(event)">
            <label>Nome exato da unidade do backup
              <input id="recovery-business-name" name="businessName" required autocomplete="off" placeholder="Nome da unidade">
            </label>
            <p id="restore-error" class="error"></p>
            <div class="form-actions">
              ${btn('Cancelar', 'closeModal()', 'close')}
              <button class="danger" type="submit">Confirmar e restaurar</button>
            </div>
          </form>
        `);
      } else {
        if (errorEl) errorEl.textContent = message;
        else toast(message);
      }
    }
  });
}

function confirmRecoveryRestore(event) {
  if (event?.preventDefault) event.preventDefault();
  const input = document.getElementById('recovery-business-name');
  const businessName = input ? input.value.trim() : '';
  restoreNow({ allowRecovery: true, businessName });
}

function openOperationalCustomer(customerId = '') {
  const customer = operationalData.customers.find(item => item.id === customerId);
  if (customer) {
    const orders = operationalData.orders.filter(order => order.customer.id === customerId);
    const activeVehicleIds = new Set(operationalData.orders.filter(order => order.stage !== 'entregue' && order.paymentStatus !== 'cancelled').map(order => order.vehicle.id));
    return modal(customer.name, `<form onsubmit="saveOperationalCustomer(event, '${customerId}')" class="form-stack"><div class="form-grid"><label>Nome<input name="name" value="${safeText(customer.name)}" required minlength="2"></label><label>Telefone<input name="phone" value="${safeText(customer.phone)}"></label></div><label>Observações<textarea name="notes" rows="2">${safeText(customer.notes)}</textarea></label><div class="form-actions"><button class="primary">Salvar cliente</button><button type="button" onclick="startOperationalOrderForCustomer('${customerId}')">Nova OS para este cliente</button></div></form><hr><div class="intro-row"><div><h3>Veículos</h3><p class="muted">Cadastre ou atualize os veículos vinculados a este cliente.</p></div>${btn('Adicionar veículo', `openOperationalVehicle('${customerId}')`, 'plus')}</div><div class="summary-list">${customer.vehicles.map(vehicle => `<p><span><b>${safeText(vehicle.plate)}</b>${activeVehicleIds.has(vehicle.id) ? ` ${badge('No pátio', 'good')}` : ''}<br><small>${safeText([vehicle.brand, vehicle.model, vehicle.color, vehicle.year].filter(Boolean).join(' · ')) || 'Sem detalhes informados'}</small></span><button type="button" class="small-button" onclick="openOperationalVehicle('${customerId}', '${vehicle.id}')">Editar</button></p>`).join('')}</div><hr><h3>Histórico de ordens</h3>${orders.length ? `<div class="summary-list">${orders.map(order => `<p><span><b>OS #${order.sequence}</b> · ${safeText(order.vehicle.plate)}<br><small>${safeText(stageLabel[order.stage])} · ${operationalDate(order.enteredAt)}</small></span><button type="button" class="small-button" onclick="openOperationalOrder('${order.id}')">Ver OS</button></p>`).join('')}</div>` : '<p class="muted">Ainda não há ordens registradas para este cliente.</p>'}`);
  }
  modal('Novo cliente e veículo', `<form onsubmit="createOperationalCustomer(event)"><div class="form-grid"><label>Nome<input name="name" required minlength="2"></label><label>Telefone<input name="phone"></label><label>Placa<input name="plate" required maxlength="10" style="text-transform:uppercase"></label><label>Marca<input name="brand"></label><label>Modelo<input name="model"></label><label>Cor<input name="color"></label><label>Ano<input name="year" maxlength="8"></label></div><label>Observações<textarea name="notes" rows="2"></textarea></label><div class="form-actions"><button class="primary">Salvar cliente</button></div></form>`);
}
async function createOperationalCustomer(event) { event.preventDefault(); await operationalError(async () => { const { customer } = await api('/api/operational/customers', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }); operationalDraft = { ...(operationalDraft || {}), customerId: customer.id, vehicleId: customer.vehicle.id, additionalServiceIds: operationalDraft?.additionalServiceIds || [] }; closeModal(); await refreshOperationalScreen(); toast('Cliente e veículo cadastrados e selecionados para a nova OS.'); }); }
function startOperationalOrderForCustomer(customerId) { const customer = operationalData.customers.find(item => item.id === customerId); if (!customer) return; operationalDraft = { ...(operationalDraft || {}), customerId, vehicleId: operationalDraft?.customerId === customerId ? operationalDraft.vehicleId || '' : '', additionalServiceIds: operationalDraft?.additionalServiceIds || [] }; closeModal(); route('nova'); toast(`Cliente ${customer.name} selecionado. Escolha o veículo e conclua o check-in.`); }
async function saveOperationalCustomer(event, customerId) { event.preventDefault(); await operationalError(async () => { await api(`/api/operational/customers/${customerId}`, { method: 'PATCH', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }); closeModal(); await refreshOperationalScreen(); toast('Dados do cliente atualizados.'); }); }
function openOperationalVehicle(customerId, vehicleId = '') { const customer = operationalData.customers.find(item => item.id === customerId); const vehicle = customer?.vehicles.find(item => item.id === vehicleId) || {}; modal(vehicleId ? `Editar veículo · ${vehicle.plate}` : 'Adicionar veículo', `<form onsubmit="saveOperationalVehicle(event, '${customerId}', '${vehicleId}')"><div class="form-grid"><label>Placa<input name="plate" value="${safeText(vehicle.plate)}" required maxlength="10" style="text-transform:uppercase"></label><label>Marca<input name="brand" value="${safeText(vehicle.brand)}"></label><label>Modelo<input name="model" value="${safeText(vehicle.model)}"></label><label>Cor<input name="color" value="${safeText(vehicle.color)}"></label><label>Ano<input name="year" value="${safeText(vehicle.year)}" maxlength="8"></label></div><label>Observações<textarea name="notes" rows="2">${safeText(vehicle.notes)}</textarea></label><div class="form-actions"><button class="primary">Salvar veículo</button></div></form>`); }
async function saveOperationalVehicle(event, customerId, vehicleId) { event.preventDefault(); await operationalError(async () => { await api(`/api/operational/customers/${customerId}/vehicles${vehicleId ? `/${vehicleId}` : ''}`, { method: vehicleId ? 'PATCH' : 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }); closeModal(); await refreshOperationalScreen(); toast(vehicleId ? 'Veículo atualizado.' : 'Veículo cadastrado.'); }); }
function openOperationalService(serviceId = '') { const service = operationalData.services.find(item => item.id === serviceId) || {}; modal(serviceId ? 'Editar serviço' : 'Novo serviço', `<p class="muted">Use um nome que a equipe reconheça. Pausar mantém o histórico e remove o item apenas das novas OS.</p><form onsubmit="saveOperationalService(event, '${serviceId}')"><div class="form-grid"><label>Nome<input name="name" value="${safeText(service.name)}" required maxlength="120" placeholder="Ex.: Lavagem completa"></label><label>Categoria<input name="category" list="operational-service-categories" value="${safeText(service.category || 'Principal')}" required></label><datalist id="operational-service-categories"><option value="Principal"><option value="Adicional"><option value="Combo"><option value="Higienização"></datalist><label>Preço (R$)<input name="price" type="number" min="0" step="0.01" value="${service.price ?? ''}" required></label><label>Duração (min)<input name="durationMinutes" type="number" min="0" max="1440" value="${service.durationMinutes ?? 30}" required></label><label>Comissão (%)<input name="commissionRate" type="number" min="0" max="100" step="0.01" value="${service.commissionRate ?? 0}" required></label><label>Disponibilidade<select name="active"><option value="true" ${service.active !== false ? 'selected' : ''}>Disponível em novas OS</option><option value="false" ${service.active === false ? 'selected' : ''}>Pausado</option></select></label></div><div class="form-actions"><button class="primary">Salvar serviço</button></div></form>`); }
async function saveOperationalService(event, serviceId) { event.preventDefault(); await operationalError(async () => { const payload = Object.fromEntries(new FormData(event.target)); payload.active = payload.active === 'true'; await api(`/api/operational/services${serviceId ? `/${serviceId}` : ''}`, { method: serviceId ? 'PATCH' : 'POST', body: JSON.stringify(payload) }); closeModal(); await refreshOperationalScreen(); toast('Serviço salvo.'); }); }
function openOperationalEmployee(employeeId = '') { const employee = operationalData.employees.find(item => item.id === employeeId) || {}; modal(employeeId ? 'Editar funcionário' : 'Novo funcionário', `<form onsubmit="saveOperationalEmployee(event, '${employeeId}')"><div class="form-grid"><label>Nome<input name="name" value="${safeText(employee.name)}" required></label><label>Função<input name="role" value="${safeText(employee.role || 'Lavador')}" required></label><label>Telefone<input name="phone" value="${safeText(employee.phone)}"></label><label>Comissão (%)<input name="commissionRate" type="number" min="0" max="100" step="0.01" value="${employee.commissionRate ?? 0}" required></label><label>Status<select name="active"><option value="true" ${employee.active !== false ? 'selected' : ''}>Ativo</option><option value="false" ${employee.active === false ? 'selected' : ''}>Inativo</option></select></label></div><div class="form-actions"><button class="primary">Salvar funcionário</button></div></form>`); }
async function saveOperationalEmployee(event, employeeId) { event.preventDefault(); await operationalError(async () => { const payload = Object.fromEntries(new FormData(event.target)); payload.active = payload.active === 'true'; await api(`/api/operational/employees${employeeId ? `/${employeeId}` : ''}`, { method: employeeId ? 'PATCH' : 'POST', body: JSON.stringify(payload) }); closeModal(); await refreshOperationalScreen(); toast('Funcionário salvo.'); }); }
function openOperationalStock(stockItemId = '') { const item = operationalData.stock.find(stock => stock.id === stockItemId) || {}; modal(stockItemId ? 'Editar produto' : 'Novo produto', `<p class="muted">Cadastre somente o que será conferido na rotina. O nível mínimo aciona alertas, sem bloquear a operação automaticamente.</p><form onsubmit="saveOperationalStock(event, '${stockItemId}')"><div class="form-grid"><label>Nome<input name="name" value="${safeText(item.name)}" required maxlength="120"></label><label>Categoria<input name="category" value="${safeText(item.category)}" placeholder="Ex.: Produtos de lavagem"></label><label>Unidade<input name="unit" value="${safeText(item.unit || 'un.')}" required placeholder="Ex.: L, un., frasco"></label>${stockItemId ? '' : '<label>Estoque inicial<input name="quantity" type="number" min="0" step="0.01" value="0" required></label>'}<label>Estoque mínimo<input name="minimumQuantity" type="number" min="0" step="0.01" value="${item.minimumQuantity ?? 0}" required></label><label>Status<select name="active"><option value="true" ${item.active !== false ? 'selected' : ''}>Controlar no estoque</option><option value="false" ${item.active === false ? 'selected' : ''}>Pausado</option></select></label></div><div class="form-actions"><button class="primary">Salvar produto</button></div></form>`); }
async function saveOperationalStock(event, stockItemId) { event.preventDefault(); await operationalError(async () => { const payload = Object.fromEntries(new FormData(event.target)); payload.active = payload.active === 'true'; await api(`/api/operational/stock${stockItemId ? `/${stockItemId}` : ''}`, { method: stockItemId ? 'PATCH' : 'POST', body: JSON.stringify(payload) }); closeModal(); await refreshOperationalScreen(); toast('Produto salvo.'); }); }
function openOperationalStockMove(stockItemId) { const item = operationalData.stock.find(stock => stock.id === stockItemId); if (!item) return; modal(`Movimentar ${item.name}`, `<p>Saldo atual: <b>${item.quantity} ${safeText(item.unit)}</b></p><p class="muted">Entrada soma, saída reduz e ajuste substitui o saldo pelo valor contado.</p><form onsubmit="saveOperationalStockMove(event, '${stockItemId}')"><label>Tipo<select name="kind" onchange="updateOperationalStockMovement(this.form, ${Number(item.quantity)})"><option value="entrada">Entrada</option><option value="saida">Saída</option><option value="ajuste">Ajustar saldo para</option></select></label><label id="operational-stock-quantity-label">Quantidade de entrada<input name="quantity" type="number" min="0" step="0.01" oninput="updateOperationalStockMovement(this.form, ${Number(item.quantity)})" required></label><p id="operational-stock-preview" class="muted" aria-live="polite">Informe a quantidade para conferir o novo saldo.</p><label>Motivo<input name="reason" required maxlength="200" placeholder="Ex.: compra, uso na operação ou contagem"></label><div class="form-actions"><button class="primary">Registrar movimento</button></div></form>`); }
function updateOperationalStockMovement(form, current) { const kind = form.elements.kind.value, value = form.elements.quantity.value, label = document.getElementById('operational-stock-quantity-label'), preview = document.getElementById('operational-stock-preview'); if (!label || !preview) return; label.firstChild.textContent = kind === 'ajuste' ? 'Novo saldo contado' : kind === 'saida' ? 'Quantidade de saída' : 'Quantidade de entrada'; if (value === '') return preview.textContent = 'Informe a quantidade para conferir o novo saldo.'; const quantity = Number(value), result = kind === 'entrada' ? current + quantity : kind === 'saida' ? current - quantity : quantity; preview.textContent = result < 0 ? 'A saída não pode deixar o saldo negativo.' : `Novo saldo previsto: ${result}.`; }
async function saveOperationalStockMove(event, stockItemId) { event.preventDefault(); await operationalError(async () => { await api(`/api/operational/stock/${stockItemId}/movements`, { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }); closeModal(); await refreshOperationalScreen(); toast('Estoque atualizado.'); }); }

const originalOnlineLoad = loadOnlineApp;
loadOnlineApp = async function operationalLoadOnlineApp() {
  await originalOnlineLoad();
  if (onlineReady) { try { await refreshOperationalData(); } catch {} render(); }
};

const operationalRender = render;
render = function renderOperationalShell() {
  captureOperationalDraft();
  operationalRender();
  if (onlineReady) {
    const screens = { patio, dashboard, nova: newOrder, ordens: ordersPage, caixa: cashPage, agenda_online: (typeof onlineAgendaPage === 'function' ? onlineAgendaPage : undefined), servicos: servicesPage, estoque: stockPage, financeiro: financePage, comissoes: commissionsPage, config: settingsPage, backup: backupPage };
    if (!operationalLoaded || operationalLoadError) $('#main').innerHTML = head('Operação da unidade', 'Carregamento dos dados locais.') + `<section class="panel" role="status"><p>${safeText(operationalLoadError || 'Carregando os módulos…')}</p>${operationalLoadError ? '<button onclick="reloadOperationalView()">Tentar novamente</button>' : ''}</section>`;
    else if (typeof page !== 'undefined' && screens[page]) $('#main').innerHTML = screens[page]();
    restoreOperationalDraft();
    const count = document.querySelector('.nav-link[href="#patio"] .count');
    if (count) count.textContent = operationalData.orders.filter(order => order.stage !== 'entregue' && order.paymentStatus !== 'cancelled').length;
    const avatar = document.querySelector('#header .avatar');
    if (avatar && authUser) avatar.textContent = authUser.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }
  const indicator = document.querySelector('.sidebar-foot .local');
  if (indicator) indicator.innerHTML = `<span class="dot"></span> Dados protegidos na unidade <span style="margin-left:auto">${icon('shield')}</span>`;
};

let operationalBootAttempts = 0;
const operationalBootTimer = setInterval(async () => {
  operationalBootAttempts += 1;
  if (onlineReady) { clearInterval(operationalBootTimer); try { await refreshOperationalData(); } catch {} render(); }
  if (operationalBootAttempts > 40) clearInterval(operationalBootTimer);
}, 100);

async function reloadOperationalView() { try { await refreshOperationalData(); } catch (issue) { toast(issue.message); } render(); }
function captureOperationalDraft() {
  const form = document.getElementById('operational-order-form'); if (!form || form.dataset.completed === 'true') return;
  const data = new FormData(form); operationalDraft = Object.fromEntries(data);
  operationalDraft.additionalServiceIds = data.getAll('additionalServiceIds');
}
function restoreOperationalDraft() {
  const form = document.getElementById('operational-order-form'); if (!form) return;
  if (operationalDraft) {
    form.elements.customerId.value = operationalDraft.customerId || '';
    refreshOperationalVehicles();
    for (const element of form.elements) {
      if (!element.name) continue;
      if (element.type === 'checkbox') element.checked = operationalDraft.additionalServiceIds.includes(element.value);
      else if (Object.hasOwn(operationalDraft, element.name)) element.value = operationalDraft[element.name];
    }
  }
  updateOperationalSummary();
}
function discardOperationalDraft() { operationalDraft = null; operationalOrderConfirmation = null; document.getElementById('operational-order-form')?.reset(); refreshOperationalVehicles(); updateOperationalSummary(); }
function filterOperationalCustomers(value) {
  const select = document.getElementById('operational-customer'), term = value.toLocaleLowerCase('pt-BR');
  let visible = 0;
  for (const option of select.options) {
    const customer = operationalData.customers.find(item => item.id === option.value);
    option.hidden = !!customer && ![customer.name, customer.phone, ...customer.vehicles.map(vehicle => vehicle.plate)].join(' ').toLocaleLowerCase('pt-BR').includes(term);
    if (customer && !option.hidden) visible += 1;
  }
  const feedback = document.getElementById('order-customer-match');
  if (feedback) feedback.textContent = term ? (visible ? `${visible} cliente(s) encontrado(s).` : 'Nenhum cliente encontrado. Use Novo cliente para cadastrar.') : `${operationalData.customers.length} clientes cadastrados.`;
}
function updateOperationalSummary() {
  const form = document.getElementById('operational-order-form'); if (!form) return;
  const principal = form.elements.principalServiceId.value;
  for (const checkbox of form.querySelectorAll('[name="additionalServiceIds"]')) {
    checkbox.disabled = checkbox.value === principal;
    if (checkbox.disabled) checkbox.checked = false;
  }
  const data = new FormData(form), ids = [principal, ...data.getAll('additionalServiceIds')];
  const selected = operationalData.services.filter(service => ids.includes(service.id));
  const subtotal = selected.reduce((total, service) => total + Number(service.price), 0);
  form.elements.discount.max = subtotal;
  const discount = Math.min(Math.max(0, Number(data.get('discount') || 0)), subtotal), total = subtotal - discount;
  const customer = operationalData.customers.find(item => item.id === data.get('customerId'));
  const vehicle = customer?.vehicles.find(item => item.id === data.get('vehicleId'));
  const employee = operationalData.employees.find(item => item.id === data.get('employeeId'));
  const context = `<div class="summary-line"><span><small>Cliente e veículo</small><br>${customer && vehicle ? `<b>${safeText(customer.name)}</b><br><small>${safeText(vehicle.plate)} · ${safeText([vehicle.brand, vehicle.model].filter(Boolean).join(' ')) || 'Veículo selecionado'}</small>` : '<span class="muted">Selecione o cliente e o veículo</span>'}</span></div>`;
  document.getElementById('order-live-summary').innerHTML = context + (selected.length ? selected.map(service => `<div class="summary-line"><span>${safeText(service.name)}</span><b>${operationalMoney(service.price)}</b></div>`).join('') + `<div class="summary-line"><span>Subtotal</span><b>${operationalMoney(subtotal)}</b></div>${discount ? `<div class="summary-line"><span>Desconto</span><b>− ${operationalMoney(discount)}</b></div>` : ''}<div class="summary-line total"><span>Total da OS</span><b>${operationalMoney(total)}</b></div><p class="muted">Duração estimada: ${selected.reduce((minutes, service) => minutes + service.durationMinutes, 0)} min · Responsável: ${safeText(employee?.name || 'não definido')}.</p>` : '<p class="muted">Selecione o serviço principal para conferir valores e duração.</p>');
}
document.addEventListener('input', event => { if (event.target.closest('#operational-order-form')) { updateOperationalSummary(); captureOperationalDraft(); } });
document.addEventListener('change', event => { if (event.target.closest('#operational-order-form')) { updateOperationalSummary(); captureOperationalDraft(); } });
function beginOperationalDelivery(orderId) {
  const order = operationalData.orders.find(item => item.id === orderId); if (!order) return;
  if (order.paymentStatus === 'pending') { deliveryAfterPayment = orderId; openOperationalPayment(orderId); }
  else openOperationalDelivery(orderId);
}
function operationalCsvCell(value) {
  let text = String(value ?? '');
  if (/^[\s\u0000-\u001f]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
  return text.replace(/"/g, '""');
}
function openOperationalCorrection(orderId) {
  const order = operationalData.orders.find(item => item.id === orderId); if (!order) return;
  const services = operationalData.services.filter(item => item.active), principal = order.items.find(item => item.type === 'principal')?.serviceId;
  modal('Corrigir OS #' + order.sequence, '<p>Disponível somente antes da lavagem e do pagamento. O motivo e os valores anteriores ficam no histórico.</p><form onsubmit="saveOperationalCorrection(event,\'' + orderId + '\')"><label>Serviço principal<select name="principalServiceId" required>' + services.map(item => '<option value="' + item.id + '" ' + (item.id === principal ? 'selected' : '') + '>' + safeText(item.name) + ' · ' + operationalMoney(item.price) + '</option>').join('') + '</select></label><fieldset class="checkin-card"><legend>Adicionais (não repita o principal)</legend>' + services.map(item => '<label class="option"><input name="additionalServiceIds" type="checkbox" value="' + item.id + '" ' + (order.items.some(line => line.type === 'adicional' && line.serviceId === item.id) ? 'checked' : '') + '> ' + safeText(item.name) + ' · ' + operationalMoney(item.price) + '</label>').join('') + '</fieldset><label>Responsável<select name="employeeId"><option value="">Não definido</option>' + operationalData.employees.filter(item => item.active).map(item => '<option value="' + item.id + '" ' + (item.id === order.employee?.id ? 'selected' : '') + '>' + safeText(item.name) + '</option>').join('') + '</select></label><label>Desconto (R$)<input name="discount" type="number" min="0" step="0.01" value="' + order.discount + '" required></label><label>Observações<textarea name="note">' + safeText(order.note) + '</textarea></label><label>Motivo da correção<textarea name="reason" minlength="5" required></textarea></label><p class="notice">A correção usa os preços atuais do catálogo. Confira os valores antes de salvar.</p><div class="form-actions"><button class="primary">Salvar correção</button></div></form>');
}
async function saveOperationalCorrection(event, orderId) {
  event.preventDefault(); const form = new FormData(event.target), order = operationalData.orders.find(item => item.id === orderId);
  await operationalError(async () => { await api('/api/operational/orders/' + orderId, { method: 'PATCH', body: JSON.stringify({ ...Object.fromEntries(form), additionalServiceIds: form.getAll('additionalServiceIds'), expectedRevision: order.revision }) }); closeModal(); await refreshOperationalScreen(); toast('Correção registrada no histórico da OS.'); });
}
function openOperationalCancellation(orderId) {
  const order = operationalData.orders.find(item => item.id === orderId); if (!order) return;
  modal('Cancelar OS #' + order.sequence, '<p>Esta ação mantém a ordem no histórico e não pode ser desfeita.</p><form onsubmit="cancelOperationalOrder(event,\'' + orderId + '\')"><label>Motivo do cancelamento<textarea name="reason" minlength="5" required></textarea></label>' + (order.paymentStatus === 'paid' ? '<p class="notice">Devolva ' + operationalMoney(order.total) + ' pela forma original de pagamento. É necessário um caixa aberto.</p><label class="option"><input name="refundConfirmed" type="checkbox" required> Confirmo que o valor foi devolvido ao cliente</label>' : '') + '<div class="form-actions"><button class="danger">Confirmar cancelamento</button></div></form>');
}
async function cancelOperationalOrder(event, orderId) {
  event.preventDefault(); const order = operationalData.orders.find(item => item.id === orderId), form = new FormData(event.target);
  await operationalError(async () => { await api('/api/operational/orders/' + orderId + '/cancel', { method: 'POST', body: JSON.stringify({ expectedRevision: order.revision, reason: form.get('reason'), refundConfirmed: form.has('refundConfirmed') }) }); closeModal(); await refreshOperationalScreen(); toast('Ordem cancelada; histórico preservado.'); });
}
async function openOperationalStockHistory(itemId) {
  await operationalError(async () => {
    const { movements } = await api('/api/operational/stock/' + itemId + '/movements');
    modal('Últimos movimentos do produto', movements.length ? table(['Quando', 'Tipo', 'Antes', 'Depois', 'Motivo'], movements.map(item => [operationalDate(item.createdAt), safeText(item.kind), item.beforeQuantity, item.afterQuantity, safeText(item.reason)])) : '<p>Nenhum movimento registrado.</p>');
  });
}
