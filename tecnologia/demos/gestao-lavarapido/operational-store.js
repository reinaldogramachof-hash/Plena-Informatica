/* Núcleo operacional 100% local do Gestão Lava-Rápido: substitui o antigo
 * backend Node+SQLite. Toda a regra de negócio portada de
 * src/operational-service.cjs passa a operar sobre um único blob JSON no
 * localStorage (DB_KEY), no mesmo padrão usado pelo Gestão PDV/Salas.
 * api() abaixo imita literalmente as rotas que existiam no servidor, para
 * que dist/operational-ui.js continue funcionando sem nenhuma alteração. */
(function () {
  const DB_KEY = 'gestao_lavarapido_v1';
  const STAGES = ['aguardando', 'lavagem', 'acabamento', 'pronto', 'entregue'];
  const PAYMENT_METHODS = new Set(['Dinheiro', 'PIX', 'Débito', 'Crédito', 'Outros']);
  const FUEL_LEVELS = new Set(['Não informado', 'Reserva', '1/4', '1/2', '3/4', 'Cheio']);
  const BUSINESS_TIME_ZONE = 'America/Sao_Paulo';

  class OperationalError extends Error { constructor(message, status = 422) { super(message); this.status = status; } }

  const now = () => new Date().toISOString();
  const newId = () => (window.crypto?.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const text = (value, limit = 160) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
  const round2 = value => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  const money = value => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || n > 10000000) throw new OperationalError('Valor monetário inválido (máximo R$ 10 milhões).');
    return round2(n);
  };
  const normalizePlate = value => text(value, 10).toUpperCase().replace(/[^A-Z0-9]/g, '');
  const businessDay = value => new Intl.DateTimeFormat('sv-SE', { timeZone: BUSINESS_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value));

  function dayBoundary(day) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) !== day) throw new OperationalError('Data inválida.');
    const target = Date.parse(`${day}T00:00:00Z`);
    let instant = target;
    const formatter = new Intl.DateTimeFormat('en-GB', { timeZone: BUSINESS_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
    for (let i = 0; i < 3; i++) {
      const p = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(part => [part.type, part.value]));
      const represented = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
      instant += target - represented;
    }
    return instant;
  }
  function dateRange(from, to) {
    if (to) dayBoundary(to);
    const start = from ? new Date(dayBoundary(from)).toISOString() : '0000-01-01T00:00:00.000Z';
    const nextDay = to ? new Date(Date.parse(`${to}T00:00:00Z`) + 86400000).toISOString().slice(0, 10) : '';
    const end = to ? new Date(dayBoundary(nextDay) - 1).toISOString() : '9999-12-31T23:59:59.999Z';
    if (start > end) throw new OperationalError('O período informado é inválido.');
    return { start, end };
  }

  const normalizeCheckin = payload => {
    const rawOdometer = payload?.odometerKm;
    const odometerKm = rawOdometer === '' || rawOdometer === undefined || rawOdometer === null ? null : Number(rawOdometer);
    if (odometerKm !== null && (!Number.isInteger(odometerKm) || odometerKm < 0 || odometerKm > 2000000)) throw new OperationalError('Quilometragem de entrada inválida.');
    const keyCount = payload?.keyCount === '' || payload?.keyCount === undefined ? 0 : Number(payload.keyCount);
    if (!Number.isInteger(keyCount) || keyCount < 0 || keyCount > 10) throw new OperationalError('Quantidade de chaves inválida.');
    const fuelLevel = text(payload?.fuelLevel, 30) || 'Não informado';
    if (!FUEL_LEVELS.has(fuelLevel)) throw new OperationalError('Nível de combustível inválido.');
    return { odometerKm, fuelLevel, keyCount, accessories: text(payload?.accessories, 1000), conditionNotes: text(payload?.conditionNotes, 2000), receivedAt: now() };
  };
  const normalizeDelivery = payload => {
    const receivedByName = text(payload?.receivedByName, 120);
    if (receivedByName.length < 2) throw new OperationalError('Informe quem recebeu o veículo.');
    if (payload?.accessoriesConfirmed !== true && payload?.accessoriesConfirmed !== 'true' && payload?.accessoriesConfirmed !== 'on' && payload?.accessoriesConfirmed !== 1) throw new OperationalError('Confirme os itens e acessórios na entrega.');
    return { receivedByName, receivedByDocument: text(payload?.receivedByDocument, 40), finalCondition: text(payload?.finalCondition, 2000), accessoriesConfirmed: true, checkedAt: now() };
  };

  function seedServices(timestamp) {
    return [
      { id: newId(), name: 'Lavagem simples', category: 'Principal', price: 40, durationMinutes: 30, commissionRate: 10, active: true, createdAt: timestamp, updatedAt: timestamp },
      { id: newId(), name: 'Lavagem completa', category: 'Principal', price: 70, durationMinutes: 50, commissionRate: 10, active: true, createdAt: timestamp, updatedAt: timestamp },
      { id: newId(), name: 'Higienização interna', category: 'Principal', price: 180, durationMinutes: 120, commissionRate: 10, active: true, createdAt: timestamp, updatedAt: timestamp },
    ];
  }
  function defaultDB() {
    const timestamp = now();
    return {
      version: 1,
      settings: { name: 'Minha unidade', phone: '', document: '', address: '', hours: 'Seg. a sáb. • 08h às 18h', tolerance: 15, theme: 'dark', payments: 'Dinheiro, PIX, Débito, Crédito, Outros', currency: 'BRL', print: 'A4' },
      customers: [], services: seedServices(timestamp), employees: [], stockItems: [], stockMovements: [],
      cashSessions: [], cashTransactions: [],
      orders: [], orderItems: [], orderHistory: [], checkins: [], deliveries: [],
      auditLog: [], sequence: 1000,
    };
  }
  function normalizeDB(raw) {
    const base = defaultDB();
    if (!raw || typeof raw !== 'object') return base;
    const arrays = ['customers', 'services', 'employees', 'stockItems', 'stockMovements', 'cashSessions', 'cashTransactions', 'orders', 'orderItems', 'orderHistory', 'checkins', 'deliveries', 'auditLog'];
    const next = { ...base };
    for (const key of arrays) next[key] = Array.isArray(raw[key]) ? raw[key] : base[key];
    next.settings = { ...base.settings, ...(raw.settings && typeof raw.settings === 'object' ? raw.settings : {}) };
    next.sequence = Number.isFinite(raw.sequence) ? raw.sequence : base.sequence;
    if (!next.services.length) next.services = base.services;
    return next;
  }

  let db = normalizeDB(JSON.parse(localStorage.getItem(DB_KEY) || 'null'));
  let lastSerialized = JSON.stringify(db);
  function save() { lastSerialized = JSON.stringify(db); localStorage.setItem(DB_KEY, lastSerialized); }
  function syncFromStorage() {
    const raw = localStorage.getItem(DB_KEY);
    if (raw === null || raw === lastSerialized) return false;
    db = normalizeDB(JSON.parse(raw));
    lastSerialized = raw;
    if (typeof window.onLavarapidoStoreSync === 'function') window.onLavarapidoStoreSync();
    return true;
  }
  window.addEventListener('storage', event => { if (event.key === DB_KEY) syncFromStorage(); });
  ['pointerdown', 'keydown', 'visibilitychange'].forEach(name => document.addEventListener(name, () => syncFromStorage(), true));

  const audit = (action, entity, details = {}) => { db.auditLog.unshift({ id: newId(), action, entity, details, createdAt: now() }); if (db.auditLog.length > 500) db.auditLog.length = 500; };

  const find = (collection, id) => db[collection].find(row => row.id === id);
  const requireCustomer = customerId => { const c = find('customers', customerId); if (!c) throw new OperationalError('Cliente não encontrado.', 404); return c; };
  const requireVehicle = (customerId, vehicleId) => { const c = requireCustomer(customerId); const v = c.vehicles.find(item => item.id === vehicleId); if (!v) throw new OperationalError('Veículo não encontrado para este cliente.', 404); return v; };
  const requireService = serviceId => { const s = find('services', serviceId); if (!s || !s.active) throw new OperationalError('Serviço indisponível.', 404); return s; };
  const currentCashSession = () => db.cashSessions.find(session => session.status === 'open') || null;
  const requireOpenCash = () => { const c = currentCashSession(); if (!c) throw new OperationalError('Abra o caixa antes de registrar esta operação.'); return c; };

  function currentCash() {
    const cash = currentCashSession();
    if (!cash) return null;
    const movements = db.cashTransactions.filter(t => t.cashSessionId === cash.id).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(t => ({ id: t.id, kind: t.kind, description: t.description, method: t.paymentMethod, amount: t.amount, createdAt: t.createdAt }));
    const physical = round2(movements.filter(m => m.method === 'Dinheiro').reduce((sum, m) => sum + m.amount, 0));
    const methods = [...PAYMENT_METHODS].map(method => ({ method, amount: round2(movements.filter(m => m.method === method && ['payment', 'refund'].includes(m.kind)).reduce((sum, m) => sum + m.amount, 0)) }));
    return { id: cash.id, openingAmount: cash.openingAmount, openedAt: cash.openedAt, expectedAmount: round2(cash.openingAmount + physical), movements, methods };
  }

  function listServices() { return [...db.services].sort((a, b) => (b.active - a.active) || a.category.localeCompare(b.category, 'pt-BR') || a.name.localeCompare(b.name, 'pt-BR')); }
  function listEmployees() { return [...db.employees].sort((a, b) => (b.active - a.active) || a.name.localeCompare(b.name, 'pt-BR')); }
  function listStock() { return [...db.stockItems].sort((a, b) => (b.active - a.active) || a.name.localeCompare(b.name, 'pt-BR')); }
  function listCustomers() { return [...db.customers].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')); }
  function stockHistory(stockItemId) { return db.stockMovements.filter(m => m.stockItemId === stockItemId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 100); }

  function saveService(payload, serviceId = '') {
    const name = text(payload.name, 120), category = text(payload.category, 80), price = money(payload.price);
    const duration = Number(payload.durationMinutes ?? payload.duration), commission = Number(payload.commissionRate ?? payload.commission ?? 0);
    if (name.length < 2 || category.length < 2 || !Number.isInteger(duration) || duration < 0 || duration > 10080 || !Number.isFinite(commission) || commission < 0 || commission > 100) throw new OperationalError('Dados do serviço inválidos. Comissão deve estar entre 0 e 100%.');
    const timestamp = now(), active = payload.active === undefined ? true : Boolean(payload.active);
    if (serviceId) {
      const service = find('services', serviceId);
      if (!service) throw new OperationalError('Serviço não encontrado.', 404);
      Object.assign(service, { name, category, price, durationMinutes: duration, commissionRate: commission, active, updatedAt: timestamp });
      audit('service.updated', 'service', { serviceId });
    } else {
      serviceId = newId();
      db.services.push({ id: serviceId, name, category, price, durationMinutes: duration, commissionRate: commission, active, createdAt: timestamp, updatedAt: timestamp });
      audit('service.created', 'service', { serviceId });
    }
    save();
    return find('services', serviceId);
  }

  function saveEmployee(payload, employeeId = '') {
    const name = text(payload.name, 120), role = text(payload.role, 80), commission = Number(payload.commissionRate ?? payload.commission ?? 0);
    if (name.length < 2 || role.length < 2 || !Number.isFinite(commission) || commission < 0 || commission > 100) throw new OperationalError('Dados do funcionário inválidos. Comissão deve estar entre 0 e 100%.');
    const timestamp = now(), active = payload.active === undefined ? true : Boolean(payload.active), phone = text(payload.phone, 40);
    if (employeeId) {
      const employee = find('employees', employeeId);
      if (!employee) throw new OperationalError('Funcionário não encontrado.', 404);
      Object.assign(employee, { name, phone, role, commissionRate: commission, active, updatedAt: timestamp });
      audit('employee.updated', 'employee', { employeeId });
    } else {
      employeeId = newId();
      db.employees.push({ id: employeeId, name, phone, role, commissionRate: commission, active, createdAt: timestamp, updatedAt: timestamp });
      audit('employee.created', 'employee', { employeeId });
    }
    save();
    return find('employees', employeeId);
  }

  function saveStockItem(payload, stockItemId = '') {
    const name = text(payload.name, 120), category = text(payload.category, 80), unit = text(payload.unit, 20) || 'un.';
    const minimumQuantity = Number(payload.minimumQuantity ?? payload.minimum ?? 0);
    if (name.length < 2 || !Number.isFinite(minimumQuantity) || minimumQuantity < 0) throw new OperationalError('Dados do produto inválidos.');
    const timestamp = now(), active = payload.active === undefined ? true : Boolean(payload.active);
    if (stockItemId) {
      const item = find('stockItems', stockItemId);
      if (!item) throw new OperationalError('Produto não encontrado.', 404);
      Object.assign(item, { name, category, unit, minimumQuantity, active, updatedAt: timestamp });
      audit('stock_item.updated', 'stock_item', { stockItemId });
    } else {
      stockItemId = newId();
      const quantity = Number(payload.quantity ?? 0);
      if (!Number.isFinite(quantity) || quantity < 0) throw new OperationalError('Estoque inicial inválido.');
      db.stockItems.push({ id: stockItemId, name, category, unit, quantity, minimumQuantity, active, createdAt: timestamp, updatedAt: timestamp });
      if (quantity > 0) db.stockMovements.unshift({ id: newId(), stockItemId, kind: 'entrada', quantity, beforeQuantity: 0, afterQuantity: quantity, reason: 'Estoque inicial', createdAt: timestamp });
      audit('stock_item.created', 'stock_item', { stockItemId });
    }
    save();
    return find('stockItems', stockItemId);
  }

  function createCustomer(payload) {
    const name = text(payload.name, 120), phone = text(payload.phone, 40), plate = normalizePlate(payload.vehicle?.plate || payload.plate);
    if (name.length < 2 || !plate) throw new OperationalError('Nome do cliente e placa são obrigatórios.');
    if (db.customers.some(c => c.vehicles.some(v => v.plate === plate))) throw new OperationalError('Já existe um veículo com esta placa.', 409);
    const customerId = newId(), vehicleId = newId(), timestamp = now();
    const vehicle = { id: vehicleId, plate, brand: text(payload.vehicle?.brand || payload.brand, 80), model: text(payload.vehicle?.model || payload.model, 100), color: text(payload.vehicle?.color || payload.color, 60), year: text(payload.vehicle?.year || payload.year, 8), notes: text(payload.vehicle?.notes, 1000), createdAt: timestamp, updatedAt: timestamp };
    db.customers.push({ id: customerId, name, phone, notes: text(payload.notes, 1000), vehicles: [vehicle], createdAt: timestamp, updatedAt: timestamp });
    audit('customer.created', 'customer', { customerId, vehicleId, plate });
    save();
    return { id: customerId, name, phone, vehicle: { id: vehicleId, plate } };
  }

  function saveCustomer(customerId, payload) {
    const customer = requireCustomer(customerId);
    const name = text(payload.name, 120);
    if (name.length < 2) throw new OperationalError('Informe o nome do cliente.');
    Object.assign(customer, { name, phone: text(payload.phone, 40), notes: text(payload.notes, 1000), updatedAt: now() });
    audit('customer.updated', 'customer', { customerId });
    save();
    return listCustomers().find(c => c.id === customerId);
  }

  function saveVehicle(customerId, payload, vehicleId = '') {
    const customer = requireCustomer(customerId);
    const plate = normalizePlate(payload.plate);
    if (!plate) throw new OperationalError('Informe a placa do veículo.');
    const duplicate = db.customers.flatMap(c => c.vehicles).find(v => v.plate === plate);
    if (duplicate && duplicate.id !== vehicleId) throw new OperationalError('Já existe um veículo com esta placa.', 409);
    const timestamp = now();
    const fields = { plate, brand: text(payload.brand, 80), model: text(payload.model, 100), color: text(payload.color, 60), year: text(payload.year, 8), notes: text(payload.notes, 1000) };
    if (vehicleId) {
      const vehicle = requireVehicle(customerId, vehicleId);
      Object.assign(vehicle, fields, { updatedAt: timestamp });
      audit('vehicle.updated', 'vehicle', { vehicleId, customerId, plate });
    } else {
      vehicleId = newId();
      customer.vehicles.push({ id: vehicleId, ...fields, createdAt: timestamp, updatedAt: timestamp });
      audit('vehicle.created', 'vehicle', { vehicleId, customerId, plate });
    }
    save();
    return customer.vehicles.find(v => v.id === vehicleId);
  }

  function buildOrderIdentity(customer, vehicle, employee) {
    return { customer: { name: customer.name, phone: customer.phone }, vehicle: { plate: vehicle.plate, brand: vehicle.brand, model: vehicle.model, color: vehicle.color, year: vehicle.year }, employee: employee ? { name: employee.name } : null };
  }

  function getWorkOrder(orderId) {
    const order = find('orders', orderId);
    if (!order) throw new OperationalError('Ordem de serviço não encontrada.', 404);
    const customer = db.customers.find(c => c.vehicles.some(v => v.id === order.vehicleId)) || db.customers.find(c => c.id === order.customerId);
    const vehicle = customer?.vehicles.find(v => v.id === order.vehicleId);
    const employee = order.employeeId ? find('employees', order.employeeId) : null;
    const identity = order.identitySnapshot || {};
    return {
      id: order.id, sequence: order.sequence, stage: order.stage, paymentStatus: order.paymentStatus, note: order.note,
      revision: order.revision, cancelledAt: order.cancelledAt || null, cancellationReason: order.cancellationReason || '',
      commissionRate: order.commissionRateSnapshot ?? null, commission: order.commissionAmount ?? null,
      discount: order.discount, subtotal: order.subtotal, total: order.total,
      enteredAt: order.enteredAt, deliveredAt: order.deliveredAt || null, paidAt: order.paidAt || null,
      customer: { id: order.customerId, name: customer?.name || '', phone: customer?.phone || '', ...identity.customer },
      vehicle: { id: order.vehicleId, plate: vehicle?.plate || '', brand: vehicle?.brand || '', model: vehicle?.model || '', color: vehicle?.color || '', year: vehicle?.year || '', ...identity.vehicle },
      employee: order.employeeId ? { id: order.employeeId, name: identity.employee?.name || employee?.name || '' } : null,
      items: db.orderItems.filter(item => item.workOrderId === orderId),
      history: db.orderHistory.filter(entry => entry.workOrderId === orderId).sort((a, b) => new Date(a.changedAt) - new Date(b.changedAt)),
      checkin: db.checkins.find(entry => entry.workOrderId === orderId) || null,
      delivery: db.deliveries.find(entry => entry.workOrderId === orderId) || null,
    };
  }

  function listWorkOrders(stage = '') {
    const rows = STAGES.includes(stage) ? db.orders.filter(order => order.stage === stage) : db.orders;
    return [...rows].sort((a, b) => new Date(b.enteredAt) - new Date(a.enteredAt)).map(order => getWorkOrder(order.id));
  }

  function createWorkOrder(payload) {
    const customer = requireCustomer(payload.customerId);
    const vehicle = requireVehicle(payload.customerId, payload.vehicleId);
    const principal = requireService(payload.principalServiceId);
    const extraIds = Array.isArray(payload.additionalServiceIds) ? [...new Set(payload.additionalServiceIds)] : [];
    if (extraIds.includes(principal.id)) throw new OperationalError('O serviço principal não pode ser cobrado novamente como adicional.');
    if (db.orders.some(order => order.vehicleId === vehicle.id && order.stage !== 'entregue' && order.paymentStatus !== 'cancelled')) throw new OperationalError('Este veículo já possui uma OS ativa. Consulte o pátio antes de abrir outra.', 409);
    const extras = extraIds.map(requireService);
    const employeeId = text(payload.employeeId, 80);
    const employee = employeeId ? db.employees.find(e => e.id === employeeId && e.active) : null;
    if (employeeId && !employee) throw new OperationalError('Responsável indisponível.');
    const subtotal = round2([principal, ...extras].reduce((sum, item) => sum + Number(item.price), 0));
    const discount = money(payload.discount || 0);
    if (discount > subtotal) throw new OperationalError('O desconto não pode superar o total dos serviços.');
    const checkin = normalizeCheckin(payload.checkin);
    const orderId = newId(), timestamp = now(), sequence = ++db.sequence;
    const rate = Number(employee?.commissionRate || 0), total = round2(subtotal - discount);
    db.orders.push({
      id: orderId, sequence, customerId: customer.id, vehicleId: vehicle.id, employeeId: employeeId || null,
      stage: 'aguardando', paymentStatus: 'pending', note: text(payload.note, 2000), discount, subtotal, total,
      enteredAt: timestamp, deliveredAt: null, paidAt: null, updatedAt: timestamp,
      commissionRateSnapshot: rate, commissionAmount: round2(total * rate / 100), identitySnapshot: buildOrderIdentity(customer, vehicle, employee),
      revision: 1, cancelledAt: null, cancellationReason: '',
    });
    const addItem = (service, type) => db.orderItems.push({ id: newId(), workOrderId: orderId, serviceId: service.id, type, name: service.name, price: service.price, durationMinutes: service.durationMinutes, quantity: 1 });
    addItem(principal, 'principal'); extras.forEach(item => addItem(item, 'adicional'));
    db.checkins.push({ workOrderId: orderId, ...checkin, updatedAt: timestamp });
    db.orderHistory.push({ id: newId(), workOrderId: orderId, stage: 'aguardando', changedAt: timestamp, note: 'Entrada no pátio', changedBy: 'Operador' });
    audit('work_order.created', 'work_order', { orderId, sequence });
    save();
    return getWorkOrder(orderId);
  }

  // Correção de balcão: somente aguardando e não paga. Não muda cliente/
  // veículo nem apaga histórico; depois disso, cancelar e reabrir.
  function correctWorkOrder(orderId, payload) {
    const order = find('orders', orderId);
    if (!order) throw new OperationalError('Ordem não encontrada.', 404);
    if (order.stage !== 'aguardando' || order.paymentStatus !== 'pending') throw new OperationalError('Só é possível corrigir serviços e responsável antes da lavagem e do pagamento.', 409);
    if (payload.expectedRevision !== order.revision) throw new OperationalError('A ordem foi alterada. Atualize antes de corrigir.', 409);
    const reason = text(payload.reason, 1000);
    if (reason.length < 5) throw new OperationalError('Informe o motivo da correção (mínimo 5 caracteres).');
    const principal = requireService(payload.principalServiceId);
    const extraIds = Array.isArray(payload.additionalServiceIds) ? [...new Set(payload.additionalServiceIds)] : [];
    if (extraIds.includes(principal.id)) throw new OperationalError('O serviço principal não pode ser cobrado novamente como adicional.');
    const extras = extraIds.map(requireService);
    const employeeId = text(payload.employeeId, 80);
    const employee = employeeId ? db.employees.find(e => e.id === employeeId && e.active) : null;
    if (employeeId && !employee) throw new OperationalError('Responsável indisponível.');
    const subtotal = round2([principal, ...extras].reduce((sum, item) => sum + Number(item.price), 0)), discount = money(payload.discount || 0);
    if (discount > subtotal) throw new OperationalError('O desconto não pode superar o total dos serviços.');
    const previous = getWorkOrder(orderId);
    const rate = employeeId === order.employeeId && order.commissionRateSnapshot !== null ? order.commissionRateSnapshot : Number(employee?.commissionRate || 0);
    const total = round2(subtotal - discount), timestamp = now();
    const customer = db.customers.find(c => c.vehicles.some(v => v.id === order.vehicleId));
    const vehicle = customer?.vehicles.find(v => v.id === order.vehicleId);
    order.identitySnapshot = { ...order.identitySnapshot, employee: employee ? { name: employee.name } : null };
    db.orderItems = db.orderItems.filter(item => item.workOrderId !== orderId);
    [principal, ...extras].forEach((service, index) => db.orderItems.push({ id: newId(), workOrderId: orderId, serviceId: service.id, type: index === 0 ? 'principal' : 'adicional', name: service.name, price: service.price, durationMinutes: service.durationMinutes, quantity: 1 }));
    Object.assign(order, { employeeId: employeeId || null, discount, subtotal, total, note: text(payload.note, 2000), commissionRateSnapshot: rate, commissionAmount: round2(total * rate / 100), revision: order.revision + 1, updatedAt: timestamp });
    db.orderHistory.push({ id: newId(), workOrderId: orderId, stage: order.stage, changedAt: timestamp, note: `Correção: ${reason}. Antes: ${previous.items.map(item => item.name).join(' + ')}; total ${previous.total}; responsável ${previous.employee?.name || 'Não definido'}.`, changedBy: 'Operador' });
    audit('work_order.corrected', 'work_order', { orderId, reason, previousTotal: previous.total, total });
    save();
    return getWorkOrder(orderId);
  }

  function advanceWorkOrder(orderId, expectedStage) {
    const order = find('orders', orderId);
    if (!order) throw new OperationalError('Ordem de serviço não encontrada.', 404);
    if (order.paymentStatus === 'cancelled') throw new OperationalError('Esta OS está cancelada.');
    if (expectedStage !== undefined && order.stage !== expectedStage) throw new OperationalError('A etapa foi atualizada. Recarregue a OS antes de avançar novamente.', 409);
    const currentIndex = STAGES.indexOf(order.stage);
    if (currentIndex < 0 || currentIndex >= STAGES.length - 1) throw new OperationalError('Esta ordem já foi concluída.');
    const nextStage = STAGES[currentIndex + 1];
    if (nextStage === 'entregue' && order.paymentStatus !== 'paid') throw new OperationalError('Registre o pagamento antes da entrega.');
    if (nextStage === 'entregue' && !db.deliveries.some(entry => entry.workOrderId === orderId)) throw new OperationalError('Conclua a conferência de entrega antes de liberar o veículo.');
    const timestamp = now();
    Object.assign(order, { stage: nextStage, deliveredAt: nextStage === 'entregue' ? timestamp : null, updatedAt: timestamp });
    db.orderHistory.push({ id: newId(), workOrderId: orderId, stage: nextStage, changedAt: timestamp, note: 'Avanço operacional', changedBy: 'Operador' });
    audit('work_order.stage_advanced', 'work_order', { orderId, to: nextStage });
    save();
    return getWorkOrder(orderId);
  }

  function updateWorkOrderCheckin(orderId, payload) {
    const order = find('orders', orderId);
    if (!order) throw new OperationalError('Ordem de serviço não encontrada.', 404);
    if (order.stage !== 'aguardando' || order.paymentStatus === 'cancelled') throw new OperationalError('O check-in só pode ser alterado enquanto a OS estiver aguardando e ativa.');
    const checkin = normalizeCheckin(payload);
    const existing = db.checkins.find(entry => entry.workOrderId === orderId);
    Object.assign(existing, checkin, { updatedAt: now() });
    audit('work_order.checkin_updated', 'work_order', { orderId });
    save();
    return getWorkOrder(orderId);
  }

  function saveWorkOrderDelivery(orderId, payload) {
    const order = find('orders', orderId);
    if (!order) throw new OperationalError('Ordem de serviço não encontrada.', 404);
    if (order.stage !== 'pronto') throw new OperationalError('A conferência de entrega só fica disponível quando a OS estiver pronta.');
    if (order.paymentStatus !== 'paid') throw new OperationalError('Registre o pagamento antes da conferência de entrega.');
    const delivery = normalizeDelivery(payload);
    const existing = db.deliveries.find(entry => entry.workOrderId === orderId);
    if (existing) Object.assign(existing, delivery); else db.deliveries.push({ workOrderId: orderId, ...delivery });
    audit('work_order.delivery_checked', 'work_order', { orderId, receivedByName: delivery.receivedByName });
    save();
    return getWorkOrder(orderId);
  }

  function cancelWorkOrder(orderId, payload) {
    const order = find('orders', orderId);
    if (!order) throw new OperationalError('OS não encontrada.', 404);
    if (order.paymentStatus === 'cancelled') throw new OperationalError('Esta OS já está cancelada.', 409);
    if (payload.expectedRevision !== order.revision) throw new OperationalError('A OS foi atualizada. Reabra os detalhes antes de cancelar.', 409);
    if (order.stage === 'entregue') throw new OperationalError('Não é permitido cancelar uma OS já entregue nesta edição.');
    const reason = text(payload.reason, 500);
    if (reason.length < 5) throw new OperationalError('Informe um motivo com pelo menos 5 caracteres.');
    const timestamp = now();
    if (order.paymentStatus === 'paid') {
      if (payload.refundConfirmed !== true) throw new OperationalError('Confirme que a devolução foi realizada manualmente.');
      const cash = requireOpenCash();
      const payment = db.cashTransactions.find(t => t.workOrderId === orderId && t.kind === 'payment');
      if (!payment) throw new OperationalError('Recebimento original não encontrado; revise o histórico antes de cancelar.');
      db.cashTransactions.unshift({ id: newId(), cashSessionId: cash.id, workOrderId: orderId, kind: 'refund', amount: -order.total, paymentMethod: payment.paymentMethod, description: `Estorno manual OS #${order.sequence}: ${reason}`, createdAt: timestamp });
    }
    Object.assign(order, { paymentStatus: 'cancelled', cancelledAt: timestamp, cancellationReason: reason, revision: order.revision + 1, updatedAt: timestamp });
    db.orderHistory.push({ id: newId(), workOrderId: orderId, stage: order.stage, changedAt: timestamp, note: `Cancelamento: ${reason}`, changedBy: 'Operador' });
    audit('work_order.cancelled', 'work_order', { orderId, reason });
    save();
    return getWorkOrder(orderId);
  }

  function openCash(payload) {
    if (currentCashSession()) throw new OperationalError('Já existe um caixa aberto.');
    const opening = money(payload.openingAmount || 0), timestamp = now(), cashId = newId();
    db.cashSessions.push({ id: cashId, status: 'open', openingAmount: opening, expectedClosingAmount: null, informedClosingAmount: null, openedAt: timestamp, closedAt: null });
    audit('cash.opened', 'cash_session', { cashId, opening });
    save();
    return { id: cashId, openingAmount: opening, openedAt: timestamp };
  }

  function registerPayment(orderId, payload) {
    const order = find('orders', orderId);
    if (!order) throw new OperationalError('Ordem de serviço não encontrada.', 404);
    if (order.paymentStatus !== 'pending') throw new OperationalError('Esta ordem já possui pagamento registrado.');
    const cash = requireOpenCash(), method = text(payload.method, 30);
    const accepted = (db.settings.payments || [...PAYMENT_METHODS].join(',')).split(',').map(value => value.trim());
    if (!PAYMENT_METHODS.has(method) || !accepted.includes(method)) throw new OperationalError('Forma de pagamento não aceita nesta unidade.');
    const received = money(payload.receivedAmount ?? order.total);
    if (received < order.total) throw new OperationalError('O valor recebido não cobre o total da ordem.');
    if (method !== 'Dinheiro' && received !== order.total) throw new OperationalError('Para PIX, cartão e outros meios, informe o valor exato da OS. Troco é permitido somente em dinheiro.');
    const timestamp = now();
    Object.assign(order, { paymentStatus: 'paid', paidAt: timestamp, updatedAt: timestamp });
    db.cashTransactions.unshift({ id: newId(), cashSessionId: cash.id, workOrderId: orderId, kind: 'payment', amount: order.total, paymentMethod: method, description: `Recebimento OS #${order.sequence}`, createdAt: timestamp });
    audit('work_order.paid', 'work_order', { orderId, method, total: order.total });
    save();
    return { order: getWorkOrder(orderId), change: round2(received - order.total) };
  }

  function closeCash(payload) {
    const cash = requireOpenCash();
    const total = round2(db.cashTransactions.filter(t => t.cashSessionId === cash.id && t.paymentMethod === 'Dinheiro').reduce((sum, t) => sum + t.amount, 0));
    const expected = round2(cash.openingAmount + total), informed = money(payload.informedAmount);
    const timestamp = now();
    Object.assign(cash, { status: 'closed', expectedClosingAmount: expected, informedClosingAmount: informed, closedAt: timestamp });
    audit('cash.closed', 'cash_session', { cashId: cash.id, expected, informed });
    save();
    return { id: cash.id, expectedAmount: expected, informedAmount: informed, difference: round2(informed - expected), closedAt: timestamp };
  }

  function registerCashTransaction(payload) {
    const cash = requireOpenCash(), kind = text(payload.kind, 20);
    if (!['income', 'expense', 'withdrawal'].includes(kind)) throw new OperationalError('Tipo de movimento financeiro inválido.');
    const value = money(payload.amount);
    if (!value) throw new OperationalError('Informe um valor maior que zero.');
    const amount = kind === 'income' ? value : -value, description = text(payload.description, 300);
    if (description.length < 3) throw new OperationalError('Descreva o motivo do movimento.');
    const timestamp = now(), transactionId = newId();
    db.cashTransactions.unshift({ id: transactionId, cashSessionId: cash.id, workOrderId: null, kind, amount, paymentMethod: 'Dinheiro', description, createdAt: timestamp });
    audit('cash.transaction_registered', 'cash_transaction', { transactionId, kind, amount });
    save();
    return { id: transactionId, kind, amount, description, createdAt: timestamp };
  }

  function cashHistory() {
    return db.cashSessions.filter(c => c.status === 'closed').sort((a, b) => new Date(b.closedAt) - new Date(a.closedAt)).slice(0, 100).map(session => {
      const transactions = db.cashTransactions.filter(t => t.cashSessionId === session.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const paymentMethods = [...PAYMENT_METHODS].map(method => ({ method, amount: round2(transactions.filter(t => t.paymentMethod === method && ['payment', 'refund'].includes(t.kind)).reduce((sum, t) => sum + t.amount, 0)) })).filter(item => item.amount !== 0);
      return {
        id: session.id, openedAt: session.openedAt, closedAt: session.closedAt, opening: session.openingAmount, expected: session.expectedClosingAmount, informed: session.informedClosingAmount,
        difference: round2(session.informedClosingAmount - session.expectedClosingAmount), transactions, transactionCount: transactions.length, paymentMethods,
      };
    });
  }

  function financialSummary(from = '', to = '') {
    const { start, end } = dateRange(from, to);
    const transactions = db.cashTransactions.filter(t => t.createdAt >= start && t.createdAt <= end).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(t => ({ ...t, orderSequence: t.workOrderId ? find('orders', t.workOrderId)?.sequence ?? null : null }));
    const incoming = round2(transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0));
    const outgoing = round2(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0));
    const pendingOrders = db.orders.filter(o => o.paymentStatus === 'pending' && o.stage !== 'entregue');
    const receivables = round2(pendingOrders.reduce((sum, o) => sum + o.total, 0));
    const payments = transactions.filter(t => t.kind === 'payment');
    const paymentMethods = [...new Set(payments.map(t => t.paymentMethod))].map(method => ({ method, amount: round2(payments.filter(t => t.paymentMethod === method).reduce((sum, t) => sum + t.amount, 0)) }));
    return { period: { from: from || null, to: to || null }, incoming, outgoing, balance: round2(incoming - outgoing), receivables, receivableCount: pendingOrders.length, paymentMethods, transactions };
  }

  function commissionSummary(from = '', to = '') {
    const { start, end } = dateRange(from, to);
    const employees = listEmployees().map(employee => {
      const paidOrders = db.orders.filter(o => o.employeeId === employee.id && o.paymentStatus === 'paid' && o.paidAt >= start && o.paidAt <= end);
      const legacyCount = paidOrders.filter(o => o.commissionAmount === null || o.commissionAmount === undefined).length;
      return { id: employee.id, name: employee.name, role: employee.role, commissionRate: employee.commissionRate, orderCount: paidOrders.length, billed: round2(paidOrders.reduce((sum, o) => sum + o.total, 0)), commission: round2(paidOrders.reduce((sum, o) => sum + Number(o.commissionAmount || 0), 0)), legacyCount };
    });
    return { period: { from: from || null, to: to || null }, employees, legacyCount: employees.reduce((sum, e) => sum + e.legacyCount, 0), total: round2(employees.reduce((sum, e) => sum + e.commission, 0)) };
  }

  function dashboardSummary() {
    const today = businessDay(now()), finance = financialSummary(today, today);
    const stages = Object.fromEntries(STAGES.map(stage => [stage, db.orders.filter(o => o.stage === stage && o.paymentStatus !== 'cancelled').length]));
    return { today, finance, stages, openCash: currentCash(), lowStock: listStock().filter(item => item.active && Number(item.quantity) <= Number(item.minimumQuantity)) };
  }

  function notifications() {
    const items = [];
    listStock().filter(item => item.active && Number(item.quantity) <= Number(item.minimumQuantity)).forEach(item => items.push({ id: `stock-${item.id}`, level: 'warning', title: 'Estoque no nível mínimo', message: `${item.name}: ${item.quantity} ${item.unit} disponíveis.` }));
    listWorkOrders('pronto').filter(order => order.paymentStatus === 'pending').forEach(order => items.push({ id: `payment-${order.id}`, level: 'attention', title: `OS #${order.sequence} pronta para entrega`, message: `${order.customer.name} ainda precisa concluir o pagamento.` }));
    const pending = db.orders.filter(o => o.paymentStatus === 'pending' && o.stage !== 'entregue');
    if (!currentCash() && pending.length) items.push({ id: 'cash-closed', level: 'attention', title: 'Caixa fechado', message: `${pending.length} ordens aguardam recebimento.` });
    if (!items.length) items.push({ id: 'all-clear', level: 'good', title: 'Operação em dia', message: 'Não há alertas operacionais no momento.' });
    return items;
  }

  function adjustStock(stockItemId, payload) {
    const item = find('stockItems', stockItemId);
    if (!item) throw new OperationalError('Produto não encontrado.', 404);
    const kind = text(payload.kind, 20), quantity = Number(payload.quantity);
    if (!['entrada', 'saida', 'ajuste'].includes(kind) || !Number.isFinite(quantity) || quantity < 0 || quantity > 10000000 || (kind !== 'ajuste' && quantity === 0)) throw new OperationalError('Movimentação de estoque inválida.');
    if (text(payload.reason, 300).length < 3) throw new OperationalError('Informe o motivo da movimentação (mínimo 3 caracteres).');
    const next = kind === 'ajuste' ? quantity : Number(item.quantity) + (kind === 'entrada' ? quantity : -quantity);
    if (next < 0) throw new OperationalError('Quantidade superior ao estoque disponível.');
    const timestamp = now();
    db.stockMovements.unshift({ id: newId(), stockItemId, kind, quantity, beforeQuantity: item.quantity, afterQuantity: next, reason: text(payload.reason, 300), createdAt: timestamp });
    item.quantity = next; item.updatedAt = timestamp;
    audit('stock.moved', 'stock_item', { stockItemId, kind, quantity, before: item.quantity, after: next });
    save();
    return { id: item.id, quantity: next };
  }

  function unitSettings() { return { ...db.settings }; }
  function updateUnitSettings(payload) {
    const name = text(payload.name, 100);
    if (name.length < 2) throw new OperationalError('Informe o nome da unidade.');
    const next = {
      ...db.settings, name, phone: text(payload.phone, 40), document: text(payload.document, 40), address: text(payload.address, 200), hours: text(payload.hours, 120),
      tolerance: Math.max(0, Math.min(120, Number(payload.tolerance) || 0)), payments: text(payload.payments, 300), currency: 'BRL', print: 'A4',
      // Add-on SaaS opcional (agenda online + checklist): vinculado pela ativacao
      // da licenca vitalicia (ver lock.js/online.js) ou colado manualmente aqui.
      saasLicenseKey: text(payload.saasLicenseKey, 64), saasSlug: text(payload.saasSlug, 80),
    };
    const accepted = next.payments.split(',').map(value => value.trim()).filter(Boolean);
    if (!accepted.length || accepted.some(value => !PAYMENT_METHODS.has(value))) throw new OperationalError('Selecione pelo menos uma forma válida: Dinheiro, PIX, Débito, Crédito ou Outros.');
    next.payments = [...new Set(accepted)].join(', ');
    db.settings = next;
    audit('settings.updated', 'tenant', { name });
    save();
    return next;
  }

  function buildBackup() {
    return {
      schemaVersion: 3, product: 'gestao-lavarapido', exportedAt: now(),
      tenant: { name: db.settings.name },
      settings: db.settings,
      data: {
        customers: db.customers, services: db.services, employees: db.employees, stockItems: db.stockItems, stockMovements: db.stockMovements,
        cashSessions: db.cashSessions, cashTransactions: db.cashTransactions, orders: db.orders, orderItems: db.orderItems, orderHistory: db.orderHistory,
        checkins: db.checkins, deliveries: db.deliveries, auditLog: db.auditLog,
      },
      sequence: db.sequence,
    };
  }

  function restoreBackup(snapshot, recovery = {}) {
    if (!snapshot || ![2, 3].includes(snapshot.schemaVersion) || snapshot.product !== 'gestao-lavarapido' || !snapshot.data || typeof snapshot.data !== 'object') throw new OperationalError('Arquivo de backup incompatível.');
    const hasLocalData = db.customers.length || db.orders.length || db.employees.length || db.stockItems.length || db.cashSessions.length;
    if (hasLocalData && (recovery.allowRecovery !== true || text(recovery.businessName, 100) !== (snapshot.tenant?.name || ''))) {
      throw new OperationalError('Para recuperar em instalação nova e vazia, confirme a recuperação e digite o nome da unidade do backup.');
    }
    const data = structuredClone(snapshot.data);
    const required = ['customers', 'services', 'employees', 'stockItems', 'stockMovements', 'cashSessions', 'cashTransactions', 'orders', 'orderItems', 'orderHistory'];
    if (required.some(key => !Array.isArray(data[key]) || data[key].length > 100000)) throw new OperationalError('O backup está incompleto ou excede o limite permitido.');
    const checkins = Array.isArray(data.checkins) ? data.checkins : [];
    const deliveries = Array.isArray(data.deliveries) ? data.deliveries : [];
    const auditLog = Array.isArray(data.auditLog) ? data.auditLog : [];
    const orderIds = new Set(data.orders.map(order => order.id)), stockIds = new Set(data.stockItems.map(item => item.id)), cashIds = new Set(data.cashSessions.map(cash => cash.id));
    if (data.orderItems.some(item => !orderIds.has(item.workOrderId)) || data.orderHistory.some(entry => !orderIds.has(entry.workOrderId)) || checkins.some(entry => !orderIds.has(entry.workOrderId)) || deliveries.some(entry => !orderIds.has(entry.workOrderId)) || data.stockMovements.some(movement => !stockIds.has(movement.stockItemId)) || data.cashTransactions.some(t => (t.workOrderId && !orderIds.has(t.workOrderId)) || (t.cashSessionId && !cashIds.has(t.cashSessionId)))) {
      throw new OperationalError('As referências internas do backup não são válidas.');
    }
    db = {
      version: 1, settings: { ...defaultDB().settings, ...(snapshot.settings || {}), name: snapshot.tenant?.name || snapshot.settings?.name || db.settings.name },
      customers: data.customers, services: data.services.length ? data.services : seedServices(now()), employees: data.employees, stockItems: data.stockItems, stockMovements: data.stockMovements,
      cashSessions: data.cashSessions, cashTransactions: data.cashTransactions, orders: data.orders, orderItems: data.orderItems, orderHistory: data.orderHistory,
      checkins, deliveries, auditLog, sequence: Number.isFinite(snapshot.sequence) ? snapshot.sequence : (data.orders.reduce((max, order) => Math.max(max, Number(order.sequence) || 0), 1000)),
    };
    audit('backup.restored', 'tenant', { exportedAt: snapshot.exportedAt || null, orders: data.orders.length });
    save();
    return { restoredAt: now(), orders: data.orders.length, customers: data.customers.length };
  }

  const store = {
    STAGES, OperationalError,
    listServices, saveService, listEmployees, saveEmployee, listStock, saveStockItem, stockHistory,
    currentCash, cashHistory, listCustomers, createCustomer, saveCustomer, saveVehicle,
    createWorkOrder, correctWorkOrder, updateWorkOrderCheckin, saveWorkOrderDelivery, getWorkOrder, listWorkOrders,
    advanceWorkOrder, cancelWorkOrder, openCash, registerPayment, closeCash, registerCashTransaction,
    financialSummary, commissionSummary, dashboardSummary, buildBackup, restoreBackup, unitSettings, updateUnitSettings,
    notifications, adjustStock,
    auditEntries: (limit = 50) => db.auditLog.slice(0, limit),
    _debugState: () => db,
    _resetForTests: raw => { db = normalizeDB(raw); save(); },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = store;
  if (typeof window !== 'undefined') window.LavarapidoStore = store;
}());
