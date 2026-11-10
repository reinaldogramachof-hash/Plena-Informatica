/* Camada de boot do Gestão Lava-Rápido 100% local. Substitui o antigo
 * cliente autenticado contra um servidor Node: agora só inicializa o app
 * depois que dist/lock.js confirma a licença, e expõe api() como um
 * despachante local que imita as mesmas rotas que existiam no servidor,
 * para dist/operational-ui.js continuar funcionando sem alterações. */
let onlineReady = false;
let authUser = { id: 'local', name: 'Responsável pela unidade', role: 'owner' };
let stateRevision = 1;

const originalRender = render;
const safeText = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

function routeMatch(method, pathname, pattern) {
  if (method !== pattern.method) return null;
  const match = pathname.match(pattern.regex);
  return match ? match : null;
}

// Mesma tabela de rotas que existia no servidor (server-core.cjs), agora
// despachando direto para window.LavarapidoStore em vez de SQLite.
async function api(path, options = {}) {
  const store = window.LavarapidoStore;
  const [pathname, queryString] = path.split('?');
  const params = new URLSearchParams(queryString || '');
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : {};
  try {
    if (method === 'GET' && pathname === '/api/operational/services') return { services: store.listServices() };
    if (method === 'POST' && pathname === '/api/operational/services') return { service: store.saveService(body) };
    let m = pathname.match(/^\/api\/operational\/services\/([^/]+)$/);
    if (method === 'PATCH' && m) return { service: store.saveService(body, m[1]) };

    if (method === 'GET' && pathname === '/api/operational/employees') return { employees: store.listEmployees() };
    if (method === 'POST' && pathname === '/api/operational/employees') return { employee: store.saveEmployee(body) };
    m = pathname.match(/^\/api\/operational\/employees\/([^/]+)$/);
    if (method === 'PATCH' && m) return { employee: store.saveEmployee(body, m[1]) };

    if (method === 'GET' && pathname === '/api/operational/stock') return { items: store.listStock() };
    if (method === 'POST' && pathname === '/api/operational/stock') return { item: store.saveStockItem(body) };
    m = pathname.match(/^\/api\/operational\/stock\/([^/]+)$/);
    if (method === 'PATCH' && m) return { item: store.saveStockItem(body, m[1]) };
    m = pathname.match(/^\/api\/operational\/stock\/([^/]+)\/movements$/);
    if (method === 'GET' && m) return { movements: store.stockHistory(m[1]) };
    if (method === 'POST' && m) return { item: store.adjustStock(m[1], body) };

    if (method === 'GET' && pathname === '/api/operational/customers') return { customers: store.listCustomers() };
    if (method === 'POST' && pathname === '/api/operational/customers') return { customer: store.createCustomer(body) };
    m = pathname.match(/^\/api\/operational\/customers\/([^/]+)$/);
    if (method === 'PATCH' && m) return { customer: store.saveCustomer(m[1], body) };
    m = pathname.match(/^\/api\/operational\/customers\/([^/]+)\/vehicles$/);
    if (method === 'POST' && m) return { vehicle: store.saveVehicle(m[1], body) };
    m = pathname.match(/^\/api\/operational\/customers\/([^/]+)\/vehicles\/([^/]+)$/);
    if (method === 'PATCH' && m) return { vehicle: store.saveVehicle(m[1], body, m[2]) };

    if (method === 'GET' && pathname === '/api/operational/orders') return { orders: store.listWorkOrders(params.get('stage') || '') };
    if (method === 'POST' && pathname === '/api/operational/orders') return { order: store.createWorkOrder(body) };
    m = pathname.match(/^\/api\/operational\/orders\/([^/]+)\/checkin$/);
    if (method === 'PATCH' && m) return { order: store.updateWorkOrderCheckin(m[1], body) };
    m = pathname.match(/^\/api\/operational\/orders\/([^/]+)$/);
    if (method === 'PATCH' && m) return { order: store.correctWorkOrder(m[1], body) };
    m = pathname.match(/^\/api\/operational\/orders\/([^/]+)\/delivery$/);
    if (method === 'POST' && m) return { order: store.saveWorkOrderDelivery(m[1], body) };
    m = pathname.match(/^\/api\/operational\/orders\/([^/]+)\/advance$/);
    if (method === 'POST' && m) return { order: store.advanceWorkOrder(m[1], body.expectedStage) };
    m = pathname.match(/^\/api\/operational\/orders\/([^/]+)\/cancel$/);
    if (method === 'POST' && m) return { order: store.cancelWorkOrder(m[1], body) };
    m = pathname.match(/^\/api\/operational\/orders\/([^/]+)\/payment$/);
    if (method === 'POST' && m) return store.registerPayment(m[1], body);

    if (method === 'GET' && pathname === '/api/operational/cash') return { cash: store.currentCash() };
    if (method === 'GET' && pathname === '/api/operational/cash/history') return { sessions: store.cashHistory() };
    if (method === 'POST' && pathname === '/api/operational/cash/open') return { cash: store.openCash(body) };
    if (method === 'POST' && pathname === '/api/operational/cash/close') return { cash: store.closeCash(body) };
    if (method === 'POST' && pathname === '/api/operational/cash/transactions') return { transaction: store.registerCashTransaction(body) };

    if (method === 'GET' && pathname === '/api/operational/finance') return store.financialSummary(params.get('from'), params.get('to'));
    if (method === 'GET' && pathname === '/api/operational/commissions') return store.commissionSummary(params.get('from'), params.get('to'));
    if (method === 'GET' && pathname === '/api/operational/dashboard') return store.dashboardSummary();

    if (method === 'GET' && pathname === '/api/operational/backup') return store.buildBackup();
    if (method === 'POST' && pathname === '/api/operational/restore') return { result: store.restoreBackup(body.snapshot, body.recovery) };

    if (method === 'GET' && pathname === '/api/operational/settings') return { settings: store.unitSettings() };
    if (method === 'PUT' && pathname === '/api/operational/settings') return { settings: store.updateUnitSettings(body) };

    if (method === 'GET' && pathname === '/api/operational/notifications') return { items: store.notifications() };
    if (method === 'GET' && pathname === '/api/audit') return { entries: store.auditEntries(Math.max(1, Math.min(200, Number(params.get('limit')) || 50))) };

    throw Object.assign(new Error('Rota não encontrada.'), { status: 404 });
  } catch (issue) {
    if (issue instanceof store.OperationalError) throw Object.assign(new Error(issue.message), { status: issue.status });
    throw issue;
  }
}

function decorateShell() {
  const profile = document.querySelector('.profile');
  if (profile) profile.innerHTML = `<span class="avatar">${safeText(authUser.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase())}</span><div><strong>${safeText(authUser.name)}</strong><small>Unidade local</small></div>`;
}

render = function onlineRender() {
  if (!onlineReady) return;
  originalRender();
  decorateShell();
};

licensePage = function onlineLicensePage() {
  return head('Licenciamento', 'O acesso desta unidade é vinculado à licença vitalícia ativada neste computador.') + `<div class="two-grid"><section class="panel"><h2>Instalação da unidade</h2><p class="muted">Os módulos operacionais estão disponíveis para quem acessa com a licença desta unidade.</p>${badge('Ambiente local', 'good')}</section><section class="panel"><h2>Situação da licença</h2><p class="muted">A ativação é feita com a chave e o e-mail da compra, direto na porta de entrada do sistema. Consulte ou revalide em Configurações. Não há chaves fictícias nem validação simulada nesta edição.</p></section></div>`;
};

// Consome a chave/slug SaaS que dist/lock.js deixou pendente (licença
// vitalícia emitida junto com um add-on SaaS, ver
// issueCompanionLavarapidoLifetimeLicense em api_provisioning.php). Só roda
// quando onlineReady já é true, porque precisa de api()/store disponíveis.
// Não sobrescreve um valor já configurado manualmente pelo dono, e só
// acontece UMA vez por dispositivo (lavarapido_saas_bundle_applied_once) —
// sem isso, a verificação periódica da licença (a cada 5 min) reaplicaria a
// chave pra sempre, desfazendo silenciosamente o dono limpar o campo em
// Configurações pra desativar o add-on.
async function applyPendingSaasBundle() {
  if (localStorage.getItem('lavarapido_saas_bundle_applied_once') === '1') return;
  const pendingKey = localStorage.getItem('lavarapido_pending_saas_key');
  if (!pendingKey) return;
  const pendingSlug = localStorage.getItem('lavarapido_pending_saas_slug') || '';
  try {
    const current = await api('/api/operational/settings');
    const settings = current.settings || {};
    if (!settings.saasLicenseKey) {
      await api('/api/operational/settings', {
        method: 'PUT',
        body: JSON.stringify({ ...settings, saasLicenseKey: pendingKey, saasSlug: pendingSlug }),
      });
    }
  } catch (error) {
    console.warn('Não foi possível aplicar a licença SaaS vinculada automaticamente:', error);
    return; // mantém pendente para tentar de novo no próximo boot (ainda não marcou applied_once)
  }
  localStorage.removeItem('lavarapido_pending_saas_key');
  localStorage.removeItem('lavarapido_pending_saas_slug');
  localStorage.setItem('lavarapido_saas_bundle_applied_once', '1');
}

// dist/operational-ui.js embrulha loadOnlineApp para carregar
// operationalData assim que a licença libera a operação; mantemos o nome e a
// forma para esse encadeamento continuar funcionando sem alterar aquele
// arquivo.
async function loadOnlineApp() {
  onlineReady = true;
  document.body.classList.remove('access-mode');
  render();
  // dist/operational-ui.js embrulha esta função e já faz seu próprio
  // refreshOperationalData()+render() logo depois desta resolver — por isso
  // não repetimos aqui, só aplicamos o vínculo pendente antes de devolver.
  await applyPendingSaasBundle();
}

// Chamado por dist/lock.js assim que a licença é validada/renovada.
window.bootLavarapidoApp = function bootLavarapidoApp() {
  loadOnlineApp();
};
