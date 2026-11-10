/**
 * demo-seed.js — Plena MicroSaaS • Gestão PDV Pro
 * Base de dados demonstrativa de alta qualidade ("Mercado & Empório Central")
 */
(function () {
    'use strict';

    var round2 = function (v) { return Math.round((Number(v || 0) + Number.EPSILON) * 100) / 100; };

    var isoDate = function (daysAgo) {
        var d = new Date();
        d.setDate(d.getDate() - Number(daysAgo || 0));
        return d.toISOString().slice(0, 10);
    };

    var isoTime = function (daysAgo, hour, minute) {
        var d = new Date();
        d.setDate(d.getDate() - Number(daysAgo || 0));
        d.setHours(Number(hour || 12), Number(minute || 0), 0, 0);
        return d.toISOString();
    };

    var products = [
        { id: 'pdv-p01', code: '7891000100101', name: 'Café Torrado Especial 500g', price: 18.90, cost: 11.50, stock: 45, minStock: 15, unit: 'un', category: 'Mercearia' },
        { id: 'pdv-p02', code: '7891000100102', name: 'Azeite de Oliva Extra Virgem 500ml', price: 34.50, cost: 22.00, stock: 28, minStock: 10, unit: 'un', category: 'Mercearia' },
        { id: 'pdv-p03', code: '7891000100103', name: 'Arroz Tipo 1 Nobre 5kg', price: 26.90, cost: 18.00, stock: 60, minStock: 20, unit: 'un', category: 'Mercearia' },
        { id: 'pdv-p04', code: '7891000100104', name: 'Feijão Carioca Especial 1kg', price: 8.90, cost: 5.50, stock: 52, minStock: 15, unit: 'un', category: 'Mercearia' },
        { id: 'pdv-p05', code: '7891000100105', name: 'Refrigerante Cola Lata 350ml', price: 5.50, cost: 2.80, stock: 96, minStock: 30, unit: 'un', category: 'Bebidas' },
        { id: 'pdv-p06', code: '7891000100106', name: 'Água Mineral sem Gás 500ml', price: 3.00, cost: 1.10, stock: 120, minStock: 40, unit: 'un', category: 'Bebidas' },
        { id: 'pdv-p07', code: '7891000100107', name: 'Cerveja Artesanal IPA 500ml', price: 16.90, cost: 9.80, stock: 34, minStock: 12, unit: 'un', category: 'Bebidas' },
        { id: 'pdv-p08', code: '7891000100108', name: 'Pão de Queijo Tradicional (kg)', price: 32.00, cost: 16.00, stock: 12, minStock: 5, unit: 'kg', category: 'Padaria' },
        { id: 'pdv-p09', code: '7891000100109', name: 'Queijo Meia Cura Canastra (kg)', price: 59.90, cost: 38.00, stock: 8, minStock: 4, unit: 'kg', category: 'Laticínios' },
        { id: 'pdv-p10', code: '7891000100110', name: 'Detergente Líquido Neutro 500ml', price: 2.80, cost: 1.40, stock: 75, minStock: 25, unit: 'un', category: 'Limpeza' },
        { id: 'pdv-p11', code: '7891000100111', name: 'Sabão em Pó Concentrado 1kg', price: 14.90, cost: 9.00, stock: 38, minStock: 15, unit: 'un', category: 'Limpeza' },
        { id: 'pdv-p12', code: '7891000100112', name: 'Chocolate Barra Amargo 70% 90g', price: 9.50, cost: 5.20, stock: 64, minStock: 20, unit: 'un', category: 'Doces' }
    ];

    var customers = [
        { id: 'cli-01', name: 'Mariana Silveira', phone: '(12) 99182-4411', email: 'mariana.silveira@email.com', limitFiado: 300, balanceFiado: 45.00 },
        { id: 'cli-02', name: 'Carlos Eduardo Mendes', phone: '(12) 98845-1290', email: 'carlos.mendes@email.com', limitFiado: 500, balanceFiado: 0.00 },
        { id: 'cli-03', name: 'Fernanda Nogueira', phone: '(12) 99702-8833', email: 'fernanda.nog@email.com', limitFiado: 200, balanceFiado: 28.50 },
        { id: 'cli-04', name: 'Roberto Alencar', phone: '(12) 98114-6677', email: 'roberto.alencar@email.com', limitFiado: 400, balanceFiado: 0.00 }
    ];

    var operators = [
        { id: 'op-01', name: 'Lucas Administrador', pin: '1234', role: 'admin' },
        { id: 'op-02', name: 'Ana Carolina (Caixa)', pin: '0000', role: 'caixa' }
    ];

    var saleTemplates = [
        { items: [{ id: 'pdv-p01', qty: 2 }, { id: 'pdv-p08', qty: 0.5 }], pay: 'pix' },
        { items: [{ id: 'pdv-p03', qty: 1 }, { id: 'pdv-p04', qty: 2 }, { id: 'pdv-p02', qty: 1 }], pay: 'cartao' },
        { items: [{ id: 'pdv-p05', qty: 4 }, { id: 'pdv-p12', qty: 2 }], pay: 'dinheiro', rec: 50, chg: 9 },
        { items: [{ id: 'pdv-p07', qty: 3 }, { id: 'pdv-p09', qty: 0.4 }], pay: 'cartao' },
        { items: [{ id: 'pdv-p10', qty: 3 }, { id: 'pdv-p11', qty: 1 }], pay: 'pix' },
        { items: [{ id: 'pdv-p06', qty: 6 }, { id: 'pdv-p01', qty: 1 }], pay: 'dinheiro', rec: 40, chg: 3.10 }
    ];

    var sales = [];
    var transactions = [];

    for (var day = 0; day < 10; day++) {
        var count = day === 0 ? 8 : (day % 4) + 3;
        for (var n = 0; n < count; n++) {
            var tpl = saleTemplates[(day + n) % saleTemplates.length];
            var saleId = 'VD-' + (1000 + day * 20 + n);
            var saleItems = [];
            var subtotal = 0;

            for (var it = 0; it < tpl.items.length; it++) {
                var pId = tpl.items[it].id;
                var pQty = tpl.items[it].qty;
                var found = null;
                for (var pi = 0; pi < products.length; pi++) {
                    if (products[pi].id === pId) { found = products[pi]; break; }
                }
                if (!found) found = products[0];
                var lineTot = round2(found.price * pQty);
                subtotal += lineTot;
                saleItems.push({
                    id: found.id,
                    name: found.name,
                    price: found.price,
                    cost: found.cost,
                    quantity: pQty,
                    total: lineTot
                });
            }

            subtotal = round2(subtotal);
            var discount = 0;
            var total = subtotal;
            var txId = 'TX-' + saleId;

            var payList = [{ method: tpl.pay, amount: total }];
            if (tpl.pay === 'dinheiro' && tpl.rec) {
                payList[0].received = tpl.rec;
                payList[0].change = tpl.chg || round2(tpl.rec - total);
            }

            sales.push({
                id: saleId,
                transactionId: txId,
                date: isoDate(day),
                timestamp: isoTime(day, 8 + (n % 11), (n * 9) % 60),
                operator: 'Ana Carolina (Caixa)',
                customer: customers[(day + n) % customers.length].name,
                customerId: customers[(day + n) % customers.length].id,
                items: saleItems,
                subtotal: subtotal,
                discount: discount,
                total: total,
                payments: payList,
                payment: tpl.pay,
                status: 'completed'
            });

            transactions.push({
                id: txId,
                type: 'income',
                amount: total,
                desc: 'Venda PDV #' + saleId,
                catId: '1',
                method: tpl.pay === 'dinheiro' ? 'Dinheiro' : tpl.pay === 'pix' ? 'Pix' : 'Cartão',
                date: isoDate(day),
                source: 'pdv',
                saleId: saleId
            });
        }
    }

    var cashHistory = [
        {
            id: 'cx-hist-01',
            openedAt: isoTime(1, 8, 0),
            closedAt: isoTime(1, 19, 30),
            initialBalance: 150.00,
            finalBalance: 1120.40,
            expectedBalance: 1120.40,
            difference: 0.00,
            operator: 'Ana Carolina (Caixa)',
            status: 'closed'
        }
    ];

    window.PDV_DEMO_SEED = {
        transactions: transactions,
        sales: sales,
        stockMovements: [],
        canceledSales: [],
        categories: [
            { id: '1', name: 'Vendas', type: 'income', color: '#10B981' },
            { id: '2', name: 'Serviços', type: 'income', color: '#3B82F6' },
            { id: '3', name: 'Fornecedor', type: 'expense', color: '#F59E0B' },
            { id: '4', name: 'Aluguel', type: 'expense', color: '#EF4444' },
            { id: '5', name: 'Pessoal', type: 'expense', color: '#8B5CF6' },
            { id: '6', name: 'Transporte', type: 'expense', color: '#6366F1' },
            { id: '7', name: 'Marketing', type: 'expense', color: '#EC4899' },
            { id: '8', name: 'Investimento', type: 'expense', color: '#14B8A6' }
        ],
        products: products,
        operators: operators,
        auditLog: [],
        customers: customers,
        receivables: [
            { id: 'rec-01', customerId: 'cli-01', customerName: 'Mariana Silveira', amount: 45.00, date: isoDate(2), status: 'pending', desc: 'Compra no fiado / caderneta' }
        ],
        fiadoPayments: [],
        settings: {
            companyName: 'Mercado & Empório Central',
            maxDiscountPercent: 10,
            termsAccepted: true,
            termsAcceptedAt: isoTime(0, 8, 0)
        },
        cash: {
            isOpen: true,
            initialBalance: 200.00,
            currentBalance: 785.40,
            openedAt: isoTime(0, 8, 0),
            history: cashHistory,
            sangrias: [
                { id: 'sg-01', amount: 300.00, reason: 'Sangria para cofre', timestamp: isoTime(0, 13, 30), operator: 'Lucas Administrador' }
            ],
            reforcos: []
        }
    };
})();
