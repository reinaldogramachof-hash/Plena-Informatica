/**
 * demo-seed.js — Plena MicroSaaS • Gestão Sorveteria & Açaí Pro
 * Base de dados rica demonstrativa ("Sorveteria Aurora Gelato")
 */
(function () {
    'use strict';

    var money = function (v) { return Math.round(Number(v || 0) * 100) / 100; };

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
        { id: 'mk-p01', code: 'SOR001', name: 'Sorvete Chocolate Belga', category: 'sorvete', flavor: 'Chocolate', cost: 7.2, price: 14.9, stock: 42, minStock: 12, unit: 'litro', temperature: '-18°C', ingredients: 'Leite, cacau belga, creme e açúcar', description: 'Massa cremosa premium de chocolate.' },
        { id: 'mk-p02', code: 'SOR002', name: 'Sorvete Morango Natural', category: 'sorvete', flavor: 'Morango', cost: 6.8, price: 13.9, stock: 36, minStock: 10, unit: 'litro', temperature: '-18°C', ingredients: 'Leite, morango fresco e estabilizante', description: 'Sabor leve com fruta de verdade.' },
        { id: 'mk-p03', code: 'SOR003', name: 'Sorvete Pistache Especial', category: 'sorvete', flavor: 'Pistache', cost: 9.4, price: 18.9, stock: 18, minStock: 8, unit: 'litro', temperature: '-18°C', ingredients: 'Leite, pistache, creme e açúcar', description: 'Linha especial de alto valor agregado.' },
        { id: 'mk-p04', code: 'SOR004', name: 'Sorvete Ninho com Nutella', category: 'sorvete', flavor: 'Ninho', cost: 8.6, price: 17.5, stock: 24, minStock: 8, unit: 'litro', temperature: '-18°C', ingredients: 'Leite em pó, creme e creme de avelã', description: 'Campeão de vendas da vitrine.' },
        { id: 'mk-p05', code: 'ACA001', name: 'Açaí Tradicional 300ml', category: 'acai', flavor: 'Açaí', cost: 5.2, price: 14.0, stock: 48, minStock: 12, unit: 'unidade', temperature: '-15°C', ingredients: 'Açaí, guaraná, banana e granola', description: 'Copo tradicional pronto para consumo.', tipo: 'acai', sizes: [{ label: '300ml', price: 14 }, { label: '500ml', price: 20 }, { label: '700ml', price: 26 }] },
        { id: 'mk-p06', code: 'ACA002', name: 'Açaí Premium 500ml', category: 'acai', flavor: 'Açaí Premium', cost: 7.8, price: 22.0, stock: 32, minStock: 10, unit: 'unidade', temperature: '-15°C', ingredients: 'Açaí, leite ninho, morango e granola', description: 'Copo premium com adicionais.', tipo: 'acai', sizes: [{ label: '500ml', price: 22 }, { label: '700ml', price: 29 }] },
        { id: 'mk-p07', code: 'PIC001', name: 'Picolé Frutas Vermelhas', category: 'picole', flavor: 'Frutas Vermelhas', cost: 1.4, price: 5.5, stock: 86, minStock: 25, unit: 'unidade', temperature: '-18°C', ingredients: 'Frutas vermelhas e água filtrada', description: 'Picolé refrescante artesanal.' },
        { id: 'mk-p08', code: 'CAS001', name: 'Casquinha Dupla', category: 'casquinha', flavor: 'Baunilha', cost: 1.1, price: 8.0, stock: 120, minStock: 40, unit: 'unidade', temperature: 'Ambiente', ingredients: 'Casquinha, duas bolas e cobertura', description: 'Produto rápido para balcão.' },
        { id: 'mk-p09', code: 'COB001', name: 'Calda Chocolate', category: 'cobertura', flavor: 'Chocolate', cost: 2.1, price: 4.0, stock: 9, minStock: 4, unit: 'litro', temperature: 'Ambiente', ingredients: 'Chocolate e leite condensado', description: 'Cobertura cremosa.' },
        { id: 'mk-p10', code: 'COM001', name: 'Leite Ninho', category: 'complemento', flavor: 'Leite Ninho', cost: 3.2, price: 5.0, stock: 11, minStock: 5, unit: 'kg', temperature: 'Ambiente', ingredients: 'Leite em pó', description: 'Adicional para açaí e sorvetes.' }
    ];

    var clients = [
        { id: 'mk-c01', name: 'Mariana Costa', phone: '(12) 99124-3301', email: 'mariana.costa@email.com', points: 184, history: [] },
        { id: 'mk-c02', name: 'Felipe Andrade', phone: '(12) 99672-1188', email: 'felipe.andrade@email.com', points: 92, history: [] },
        { id: 'mk-c03', name: 'Camila Rocha', phone: '(12) 98802-4410', email: 'camila.rocha@email.com', points: 238, history: [] },
        { id: 'mk-c04', name: 'Bruno Martins', phone: '(12) 99744-9021', email: 'bruno.martins@email.com', points: 61, history: [] },
        { id: 'mk-c05', name: 'Patricia Lima', phone: '(12) 98120-7784', email: 'patricia.lima@email.com', points: 145, history: [] }
    ];

    var suppliers = [
        { id: 'mk-s01', name: 'Laticínios Vale Fresco', contact: 'Renata', phone: '(12) 3333-1020', category: 'Leite e Creme' },
        { id: 'mk-s02', name: 'Frutas Serra Azul', contact: 'Eduardo', phone: '(12) 3341-8800', category: 'Frutas' },
        { id: 'mk-s03', name: 'Embalagens Prime', contact: 'Carla', phone: '(12) 3322-4400', category: 'Embalagens' },
        { id: 'mk-s04', name: 'Distribuidora Doce Mix', contact: 'Rafael', phone: '(12) 3350-7788', category: 'Complementos' }
    ];

    var inventory = [
        { id: 'mk-i01', code: 'ING001', name: 'Leite Integral', category: 'leite', stock: 64, minStock: 20, unit: 'litro', cost: 4.9, expiryDate: isoDate(-12) },
        { id: 'mk-i02', code: 'ING002', name: 'Creme de Leite', category: 'leite', stock: 31, minStock: 12, unit: 'litro', cost: 8.2, expiryDate: isoDate(-18) },
        { id: 'mk-i03', code: 'ING003', name: 'Morango Congelado', category: 'fruta', stock: 18, minStock: 8, unit: 'kg', cost: 13.5, expiryDate: isoDate(-25) },
        { id: 'mk-i04', code: 'ING004', name: 'Polpa de Açaí', category: 'fruta', stock: 44, minStock: 15, unit: 'kg', cost: 11.8, expiryDate: isoDate(-30) },
        { id: 'mk-i05', code: 'ING005', name: 'Açúcar Cristal', category: 'acucar', stock: 26, minStock: 10, unit: 'kg', cost: 4.1, expiryDate: isoDate(-90) },
        { id: 'mk-i06', code: 'ING006', name: 'Copos 500ml', category: 'embalagem', stock: 180, minStock: 80, unit: 'unidade', cost: 0.42, expiryDate: null },
        { id: 'mk-i07', code: 'ING007', name: 'Potes 1L', category: 'embalagem', stock: 72, minStock: 30, unit: 'unidade', cost: 1.25, expiryDate: null }
    ];

    var saleTemplates = [
        ['mk-p04', 2, 'credito'], ['mk-p05', 3, 'pix'], ['mk-p01', 1, 'dinheiro'],
        ['mk-p06', 2, 'debito'], ['mk-p03', 1, 'credito'], ['mk-p08', 4, 'pix'],
        ['mk-p07', 5, 'dinheiro'], ['mk-p02', 2, 'pix']
    ];
    var sales = [];
    for (var day = 0; day < 14; day++) {
        var count = day === 0 ? 8 : (day % 4) + 2;
        for (var n = 0; n < count; n++) {
            var tpl = saleTemplates[(day + n) % saleTemplates.length];
            var prod = null;
            for (var p = 0; p < products.length; p++) {
                if (products[p].id === tpl[0]) { prod = products[p]; break; }
            }
            if (!prod) prod = products[0];
            var qty = tpl[1];
            var subtotal = money(prod.price * qty);
            var extra = n % 3 === 0 ? 5 : 0;
            var total = money(subtotal + extra);
            sales.push({
                id: 'mk-sale-' + day + '-' + n,
                date: isoDate(day),
                timestamp: isoTime(day, 10 + (n % 10), (n * 7) % 60),
                items: [{
                    productId: prod.id,
                    name: prod.name,
                    qty: qty,
                    quantity: qty,
                    price: prod.price,
                    total: subtotal
                }],
                subtotal: subtotal,
                discount: 0,
                total: total,
                paymentMethod: tpl[2],
                status: 'concluida',
                customerName: clients[(day + n) % clients.length].name
            });
        }
    }

    var production = [
        { id: 'mk-pr01', date: isoDate(0), timestamp: isoTime(0, 7, 40), product: 'Chocolate Belga', flavor: 'Chocolate', type: 'Sorvete', quantity: 18, unit: 'L', status: 'pronto', ingredientsUsed: 12 },
        { id: 'mk-pr02', date: isoDate(0), timestamp: isoTime(0, 9, 15), product: 'Ninho com Nutella', flavor: 'Ninho', type: 'Sorvete', quantity: 14, unit: 'L', status: 'produzindo', ingredientsUsed: 9 },
        { id: 'mk-pr03', date: isoDate(0), timestamp: isoTime(0, 11, 30), product: 'Açaí Premium', flavor: 'Açaí Premium', type: 'Açaí', quantity: 22, unit: 'L', status: 'pendente', ingredientsUsed: 15 },
        { id: 'mk-pr04', date: isoDate(1), timestamp: isoTime(1, 8, 20), product: 'Morango Natural', flavor: 'Morango', type: 'Sorvete', quantity: 16, unit: 'L', status: 'pronto', ingredientsUsed: 10 }
    ];

    var freezers = [
        { id: 'freezer1', name: 'Freezer Principal', idealTemp: -18, currentTemp: -18.4, status: 'normal' },
        { id: 'freezer2', name: 'Freezer de Açaí', idealTemp: -15, currentTemp: -15.7, status: 'normal' },
        { id: 'freezer3', name: 'Câmara Fria', idealTemp: -20, currentTemp: -19.6, status: 'normal' }
    ];

    var temperatures = [
        { id: 'mk-t01', freezerId: 'freezer1', temperature: -18.4, status: 'normal', date: isoDate(0), timestamp: isoTime(0, 8, 5), notes: 'Check de abertura' },
        { id: 'mk-t02', freezerId: 'freezer2', temperature: -15.7, status: 'normal', date: isoDate(0), timestamp: isoTime(0, 8, 8), notes: 'Check de abertura' },
        { id: 'mk-t03', freezerId: 'freezer3', temperature: -19.6, status: 'normal', date: isoDate(0), timestamp: isoTime(0, 8, 10), notes: 'Check de abertura' },
        { id: 'mk-t04', freezerId: 'freezer1', temperature: -18.1, status: 'normal', date: isoDate(0), timestamp: isoTime(0, 13, 20), notes: 'Check de rotina' },
        { id: 'mk-t05', freezerId: 'freezer2', temperature: -15.3, status: 'normal', date: isoDate(0), timestamp: isoTime(0, 13, 22), notes: 'Check de rotina' }
    ];

    window.SORVETERIA_DEMO_SEED = {
        products: products,
        sales: sales,
        saleReversals: [],
        loyaltyMovements: [],
        clients: clients,
        suppliers: suppliers,
        inventory: inventory,
        production: production,
        recipes: [
            { id: 'mk-r01', name: 'Base Chocolate Belga', productName: 'Chocolate Belga', yield: 18, unit: 'L', ingredients: [{ name: 'Leite Integral', qty: 10, unit: 'litro' }, { name: 'Creme de Leite', qty: 4, unit: 'litro' }, { name: 'Açúcar Cristal', qty: 2, unit: 'kg' }] },
            { id: 'mk-r02', name: 'Base Açaí Premium', productName: 'Açaí Premium', yield: 22, unit: 'L', ingredients: [{ name: 'Polpa de Açaí', qty: 16, unit: 'kg' }, { name: 'Morango Congelado', qty: 3, unit: 'kg' }] }
        ],
        cashierSessions: [
            { id: 'mk-cash-01', openedAt: isoTime(0, 8, 0), closedAt: null, openingAmount: 150, status: 'open', operator: 'Atendimento' }
        ],
        stockLosses: [
            { id: 'mk-l01', itemId: 'mk-i03', itemName: 'Morango Congelado', itemSource: 'inventory', qty: 1.2, reason: 'Avaria na embalagem', date: isoDate(2), notes: 'Baixa controlada' },
            { id: 'mk-l02', itemId: 'mk-p07', itemName: 'Picolé Frutas Vermelhas', itemSource: 'product', qty: 4, reason: 'Quebra', date: isoDate(5), notes: 'Reposição de vitrine' }
        ],
        combos: [
            { id: 'mk-combo-01', name: 'Combo Família', price: 49.9, items: [{ productId: 'mk-p01', qty: 1 }, { productId: 'mk-p02', qty: 1 }, { productId: 'mk-p09', qty: 1 }] }
        ],
        temperatures: temperatures,
        freezers: freezers,
        settings: {
            companyName: 'Sorveteria Aurora Gelato',
            setupComplete: true,
            cnpj: '14.549.923/0001-35',
            phone: '(12) 99219-1018',
            address: 'Av. das Flores, 128 - Centro',
            stockAlerts: true,
            defaultMinStock: 10,
            dailyProductionGoal: 60,
            temperatureAlerts: true,
            criticalTemp: -12,
            termsAccepted: true,
            termsAcceptedAt: isoTime(0, 8, 0)
        },
        tutorial: {
            completedSteps: ['instalacao', 'primeiro-cadastro', 'producao', 'vendas', 'backup'],
            checklistState: {}
        },
        defaultProducts: [],
        adicionais: [
            { id: 'ad1', name: 'Leite Ninho', price: 2 },
            { id: 'ad2', name: 'Paçoca', price: 1.5 },
            { id: 'ad3', name: 'Granola', price: 1 },
            { id: 'ad4', name: 'Morango Fresco', price: 2.5 }
        ]
    };
})();

