// Regras locais compartilhadas por venda, estoque, produção e relatórios.
function roundMoney(value) { return Math.round((Number(value) + Number.EPSILON) * 100) / 100; }
function summarizeStockQuantities(records, quantityField = 'quantity') {
    const groups = new Map();
    for (const record of records) {
        const unit = stockUnit(record.unit);
        groups.set(unit, (groups.get(unit) || 0) + Number(record[quantityField] || 0));
    }
    return [...groups].map(([unit, quantity]) => `${Number(quantity.toFixed(3)).toLocaleString('pt-BR')} ${unit}`).join(' · ') || '0';
}
function stockUnit(unit) {
    return ({ g: 'gramas', grama: 'gramas', quilograma: 'kg', l: 'litro', litros: 'litro', unidades: 'unidade', un: 'unidade' })[String(unit).toLowerCase()] || String(unit || 'unidade').toLowerCase();
}
function convertStockQuantity(quantity, from, to) {
    if (Number.isFinite(Number(quantity)) && Number(quantity) >= 0 && stockUnit(from) === stockUnit(to)) return Number(quantity);
    const units = { gramas: ['peso', 1], kg: ['peso', 1000], ml: ['volume', 1], litro: ['volume', 1000], unidade: ['unidade', 1] };
    const a = units[stockUnit(from)], b = units[stockUnit(to)];
    if (!Number.isFinite(Number(quantity)) || Number(quantity) < 0 || !a || !b || a[0] !== b[0]) throw new Error('Confira as unidades do estoque. Não é possível converter peso, volume e unidades entre si.');
    return Number(quantity) * a[1] / b[1];
}
function needsWeightUnitReview(product) {
    return product?.tipo === 'massa' && stockUnit(product.unit) === 'gramas' && product.stockSchemaVersion !== 2;
}
function requireWeightUnit(product) {
    if (needsWeightUnitReview(product)) throw new Error(`Confira a unidade de estoque de ${product.name} em Produtos antes da venda. A quantidade antiga foi preservada.`);
    if (!['gramas', 'kg'].includes(stockUnit(product.unit))) throw new Error(`Cadastre o estoque de ${product.name} em gramas ou kg para vender por peso.`);
}
function getAcaiStockQuantity(product, size) {
    if (Number.isFinite(Number(size?.stockQty)) && Number(size.stockQty) > 0) return Number(size.stockQty);
    if (stockUnit(product.unit) === 'unidade') return 1;
    const match = String(size?.label || '').trim().match(/^(\d+(?:[.,]\d+)?)\s*(ml|l|litro|kg|g|gramas)\b/i);
    if (match) return convertStockQuantity(Number(match[1].replace(',', '.')), match[2], product.unit);
    throw new Error(`Informe o consumo de estoque do tamanho ${size?.label || ''} no cadastro de ${product.name}.`);
}
function cartStockUsage(item, products) {
    const product = products.find(p => p.id === item.productId);
    const qty = Number(item.qty);
    if (!Number.isFinite(qty) || qty <= 0) throw new Error('Quantidade inválida no pedido.');
    if (item.isCombo || item.tipo === 'combo') {
        if (!item.comboItems?.length) throw new Error('Combo sem produtos. Confira o cadastro.');
        return item.comboItems.map(component => {
            const p = products.find(x => x.id === component.productId);
            if (!p) throw new Error('Um produto do combo foi removido. Monte o pedido novamente.');
            if (needsWeightUnitReview(p)) requireWeightUnit(p);
            const amount = Number(component.qty) * qty;
            if (!Number.isFinite(amount) || amount <= 0) throw new Error('Quantidade inválida no combo.');
            return { productId: p.id, qty: amount, unit: p.unit || 'unidade' };
        });
    }
    if (!product) throw new Error('Um produto foi removido. Confira o pedido antes de cobrar.');
    if (item.stockUnit && stockUnit(item.stockUnit) !== stockUnit(product.unit)) throw new Error(`A unidade de ${product.name} mudou. Remova e adicione o item novamente.`);
    let amount = qty;
    if (item.tipo === 'massa') {
        requireWeightUnit(product);
        const grams = Number(item.grams ?? parseFloat(item.details));
        if (!Number.isFinite(grams) || grams <= 0) throw new Error('Peso inválido no pedido.');
        amount = convertStockQuantity(grams * qty, 'gramas', product.unit);
    } else if (item.tipo === 'acai') {
        const portion = Number(item.stockQty);
        if (!Number.isFinite(portion) || portion <= 0) throw new Error('Confira o tamanho do açaí e adicione-o novamente ao pedido.');
        amount = portion * qty;
    }
    return [{ productId: product.id, qty: amount, unit: product.unit || 'unidade' }];
}
function prepareSaleItems(cart, products, inventory = []) {
    const totals = new Map();
    const inventoryTotals = new Map();
    const items = cart.map(item => {
        if (!Number.isFinite(Number(item.price)) || Number(item.price) < 0 || !Number.isFinite(Number(item.total)) || Number(item.total) < 0) throw new Error('Preço inválido no pedido.');
        const stockMovements = cartStockUsage(item, products);
        for (const addition of item.additions || []) {
            if (!addition.stockItemId) continue;
            if (!['inventory','product'].includes(addition.stockSource)) throw new Error('Confira o vínculo de estoque do adicional.');
            const target = (addition.stockSource === 'inventory' ? inventory : products).find(p=>p.id===addition.stockItemId);
            if (!target || stockUnit(target.unit) !== stockUnit(addition.stockUnit)) throw new Error(`O estoque de ${addition.name} mudou. Monte o açaí novamente.`);
            if (needsWeightUnitReview(target)) requireWeightUnit(target);
            const qty = Number(addition.stockQty) * Number(item.qty);
            if (!Number.isFinite(qty) || qty<=0) throw new Error('Consumo inválido de adicional.');
            stockMovements.push({source:addition.stockSource, ...(addition.stockSource === 'inventory' ? {inventoryId:target.id} : {productId:target.id}), qty, unit:target.unit});
        }
        let costTotal = 0;
        for (const movement of stockMovements) {
            const isInventory = movement.source === 'inventory';
            const p = (isInventory ? inventory : products).find(x => x.id === (isInventory ? movement.inventoryId : movement.productId));
            const cost = Number(p.cost || 0);
            if (!Number.isFinite(cost) || cost < 0) throw new Error(`Confira o custo de ${p.name}.`);
            costTotal += cost * movement.qty;
            const targetTotals = isInventory ? inventoryTotals : totals;
            targetTotals.set(p.id, (targetTotals.get(p.id) || 0) + movement.qty);
        }
        return { ...item, total: roundMoney(Number(item.price) * Number(item.qty)), stockMovements, costTotal: roundMoney(costTotal), costSnapshotVersion: 1 };
    });
    for (const [id, amount] of totals) {
        const p = products.find(x => x.id === id);
        if (!Number.isFinite(Number(p.stock)) || amount > Number(p.stock) + 0.0000001) throw new Error(`Estoque insuficiente para ${p.name}. Disponível: ${p.stock} ${p.unit || 'unidade'}.`);
    }
    for (const [id, amount] of inventoryTotals) {
        const p = inventory.find(x=>x.id===id);
        if (!Number.isFinite(Number(p.stock)) || amount>Number(p.stock)+0.0000001) throw new Error(`Estoque insuficiente para ${p.name}. Disponível: ${p.stock} ${p.unit || 'unidade'}.`);
    }
    return { items, totals, inventoryTotals };
}

function getLoyaltyRedemption(data, clientId, requestedPoints, subtotal, manualDiscount = 0) {
    const rule = data.settings.loyalty || {};
    const points = Number(requestedPoints || 0);
    if (!Number.isInteger(points) || points < 0) throw new Error('Informe uma quantidade inteira de pontos.');
    if (!points) return { points: 0, discount: 0 };
    if (!rule.enabled || !Number.isFinite(Number(rule.pointValue)) || roundMoney(Number(rule.pointValue)) <= 0 || !Number.isFinite(Number(rule.earnEvery)) || !(rule.earnEvery > 0) || !(rule.maxDiscountPercent > 0 && rule.maxDiscountPercent <= 100)) throw new Error('O dono precisa configurar e ativar o resgate de pontos.');
    const client = data.clients.find(client => client.id === clientId);
    if (!client) throw new Error('Selecione o cliente para usar seus pontos.');
    if (!Number.isInteger(Number(client.points || 0))) throw new Error('Confira o saldo de pontos do cliente.');
    if (points > Math.max(0, Number(client.points || 0))) throw new Error('O cliente não tem esse saldo de pontos.');
    const discount = roundMoney(points * rule.pointValue);
    if (!Number.isFinite(discount) || discount <= 0) throw new Error('Confira a regra de valor dos pontos.');
    const available = Math.max(0, subtotal - manualDiscount);
    if (discount > roundMoney(available * rule.maxDiscountPercent / 100) || discount > available) throw new Error('Os pontos excedem o limite de desconto configurado para esta compra.');
    return { points, discount };
}

function getFreezerReadingState(data, freezer, now = Date.now()) {
    const reading = (data.temperatures || []).filter(item => item.freezerId === freezer.id && item.temperature!==null && item.temperature!=='' && Number.isFinite(Number(item.temperature)) && Number.isFinite(Date.parse(item.timestamp)))
        .sort((a,b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))[0] || null;
    const minutes = reading ? Math.max(0, Math.floor((now - Date.parse(reading.timestamp)) / 60000)) : null;
    const cutoff = Math.max(1, Number(data.settings.temperatureReminderMinutes) || 60);
    const condition = !reading ? 'sem-leitura' : Number(reading.temperature) > (data.settings.criticalTemp ?? -12) ? 'critico' : Number(reading.temperature) > Number(freezer.idealTemp) + 2 ? 'alto' : 'normal';
    return { reading, minutes, stale: !!reading && minutes >= cutoff, condition, label: !reading ? 'Sem leitura' : minutes >= cutoff ? 'Leitura antiga' : ({critico:'Crítico',alto:'Alerta',normal:'Normal'})[condition] };
}

function getExpiryItems(data, today = localDateKey()) {
    return [['inventory',data.inventory],['product',data.products]].flatMap(([source,items]) => items.map(item => ({...item, source})))
        .filter(item => Number(item.stock) > 0 && /^\d{4}-\d{2}-\d{2}$/.test(item.expiryDate || ''))
        .map(item => ({...item, daysLeft: Math.round((Date.parse(item.expiryDate+'T00:00:00Z') - Date.parse(today+'T00:00:00Z')) / 86400000)}))
        .filter(item => Number.isFinite(item.daysLeft) && item.daysLeft <= 7).sort((a,b)=>a.daysLeft-b.daysLeft);
}

function planProductionCompletion(data, id, at = new Date().toISOString()) {
    const next = JSON.parse(JSON.stringify(data));
    const lot = next.production.find(item=>item.id===id);
    if (!lot || lot.status === 'pronto' || lot.completedAt) throw new Error('Este lote já foi concluído ou não está disponível.');
    const movements = new Map();
    for (const ingredient of lot.ingredients || []) {
        const candidates = next.inventory.filter(item=>ingredient.inventoryId ? item.id===ingredient.inventoryId : item.name.trim().toLowerCase()===ingredient.name.trim().toLowerCase());
        if (candidates.length!==1) throw new Error(`Confira o ingrediente ${ingredient.name} no estoque.`);
        const item=candidates[0];
        if (!(Number(ingredient.qty)>0)) throw new Error(`Confira a quantidade de ${ingredient.name}.`);
        const qty=convertStockQuantity(ingredient.qty,ingredient.unit,item.unit);
        movements.set(item.id,(movements.get(item.id)||0)+qty);
    }
    const inputs=[];
    for (const [inventoryId,qty] of movements) {
        const item=next.inventory.find(item=>item.id===inventoryId);
        if (!Number.isFinite(Number(item.stock)) || qty>Number(item.stock)+0.0000001) throw new Error(`Estoque insuficiente de ${item.name}. O lote não foi concluído.`);
        inputs.push({inventoryId,qty,name:item.name,unit:item.unit,before:Number(item.stock),after:Number((Number(item.stock)-qty).toFixed(6))});
    }
    const product=next.products.find(product=>product.id===lot.productId);
    if (!product) throw new Error('Vincule o lote a um produto do catálogo antes de concluir.');
    if (needsWeightUnitReview(product)) requireWeightUnit(product);
    if (!(Number(lot.quantity)>0) || !Number.isFinite(Number(product.stock))) throw new Error('Confira a quantidade produzida e o saldo do produto.');
    const qty=convertStockQuantity(lot.quantity,lot.unit,product.unit);
    const output={productId:product.id,name:product.name,unit:product.unit,qty,before:Number(product.stock),after:Number((Number(product.stock)+qty).toFixed(6))};
    inputs.forEach(input=>{next.inventory.find(item=>item.id===input.inventoryId).stock=input.after;});
    product.stock=output.after;lot.status='pronto';lot.completedAt=at;lot.stockMovements=inputs;lot.outputStockQty=qty;
    return {next,inputs,output};
}

function planSaleCancellation(data, id, {reason, restock=false, paymentMethod, cashierSessionId=null, at=new Date().toISOString(), reversalId} = {}) {
    const next=JSON.parse(JSON.stringify(data));
    const sale=next.sales.find(sale=>sale.id===id);
    if (!sale || sale.status==='canceled' || next.saleReversals.some(item=>item.saleId===id)) throw new Error('Esta venda já foi cancelada ou não está disponível.');
    if (typeof reason!=='string' || reason.trim().length<3) throw new Error('Informe o motivo do cancelamento.');
    if (!['dinheiro','pix','debito','credito'].includes(paymentMethod)) throw new Error('Confira a forma de devolução.');
    if (restock) {
        if (!sale.items?.length || !sale.items.every(item=>item.stockMovements?.length)) throw new Error('Esta venda antiga não tem movimentações registradas para reposição automática.');
        for (const item of sale.items) for (const movement of item.stockMovements) {
            const inventory=movement.source==='inventory';
            const target=(inventory?next.inventory:next.products).find(target=>target.id===(inventory?movement.inventoryId:movement.productId));
            if (!target || stockUnit(target.unit)!==stockUnit(movement.unit) || !Number.isFinite(Number(movement.qty)) || Number(movement.qty)<=0 || !Number.isFinite(Number(target.stock))) throw new Error('Um item foi removido ou sua unidade mudou. Confira o estoque antes de repor.');
            target.stock=Number((Number(target.stock)+Number(movement.qty)).toFixed(6));
        }
    }
    const reversal={id:reversalId || getID(),saleId:id,at,reason:reason.trim(),amount:Number(sale.total),paymentMethod,cashierSessionId,restocked:restock,costCredit:restock&&sale.costSnapshotVersion===1?Number(sale.costTotal):0};
    if (!Number.isFinite(reversal.amount) || reversal.amount<0) throw new Error('Valor da venda inválido.');
    sale.status='canceled';sale.cancellation=reversal;
    next.saleReversals.unshift(reversal);
    if (sale.loyalty) {
        const client=next.clients.find(client=>client.id===sale.clientId);
        if (client) {
            const delta=Number(sale.loyalty.pointsRedeemed||0)-Number(sale.loyalty.pointsEarned||0);
            client.points=Number(client.points||0)+delta;
            next.loyaltyMovements.unshift({id:getID(),clientId:client.id,saleId:id,at,type:'cancellation',delta});
        }
    }
    return {next,reversal};
}

function validateSorveteriaBackup(source) {
    if (!source || typeof source!=='object' || Array.isArray(source) || !Array.isArray(source.products) || !Array.isArray(source.sales)) throw new Error('O arquivo não contém um backup válido da Sorveteria.');
    if (source.system && source.system!=='gestao-sorveteria') throw new Error('O backup pertence a outro sistema.');
    if (source.settings && (typeof source.settings!=='object' || Array.isArray(source.settings))) throw new Error('As configurações do backup são inválidas.');
    const normalized=normalizeDatabase(source);
    for (const key of ['products','inventory','sales','clients','suppliers','production','recipes','cashierSessions','stockLosses','combos','temperatures','freezers','adicionais','saleReversals','loyaltyMovements']) {
        const ids=new Set();
        for (const item of normalized[key]) {
            if (!item || typeof item!=='object' || Array.isArray(item) || typeof item.id!=='string' || !item.id || ids.has(item.id)) throw new Error(`Há registros inválidos ou repetidos em ${key}.`);
            ids.add(item.id);
            for (const field of ['stock','cost','price','total','amount']) if (Object.hasOwn(item,field) && (item[field]===null || item[field]==='' || !Number.isFinite(Number(item[field])) || Number(item[field])<0)) throw new Error(`Valor inválido em ${key}: ${field}.`);
            if (['products','inventory','clients','suppliers','recipes','freezers','adicionais','combos'].includes(key) && (typeof item.name!=='string' || !item.name.trim())) throw new Error(`Há um cadastro sem nome válido em ${key}.`);
            if (key==='clients' && Object.hasOwn(item,'points') && !Number.isInteger(Number(item.points))) throw new Error('Há saldos de pontos inválidos no backup.');
            if (key==='sales' && (!Array.isArray(item.items) || !Number.isFinite(Number(item.total)))) throw new Error('Há vendas inválidas no backup.');
            if (key==='sales' && item.items.some(line=>!line || typeof line.name!=='string' || !Number.isFinite(Number(line.total)) || Number(line.total)<0)) throw new Error('Há itens de venda inválidos no backup.');
            if (key==='saleReversals' && (!item.saleId || !Number.isFinite(Date.parse(item.at)) || !Number.isFinite(Number(item.amount)) || !['dinheiro','pix','debito','credito'].includes(item.paymentMethod))) throw new Error('Há devoluções inválidas no backup.');
        }
    }
    return normalized;
}
