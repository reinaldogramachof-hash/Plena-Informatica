// ============================================================
// reports.js — Vendas, Clientes, Fornecedores, Relatórios,
//              Configurações, Backup, Manual/Checklist
// Gestão Sorveteria & Açaí Pro
// ============================================================

// --- TERMOS ---
function updateTermsVisuals() {
    const hasAccepted = db.settings.termsAccepted;
    const termsBox = document.getElementById('terms-box');
    const btn = document.getElementById('btn-confirm-terms');
    const badge = document.getElementById('terms-accepted-badge');
    const icon = document.getElementById('terms-icon');
    const title = document.getElementById('terms-title');
    const desc = document.getElementById('terms-desc');

    if (hasAccepted && termsBox) {
        termsBox.classList.remove('bg-gray-50', 'border-gray-200');
        termsBox.classList.add('bg-green-50', 'border-green-200');

        if (btn) btn.classList.add('hidden');
        if (badge) {
            badge.classList.remove('hidden');
            badge.classList.add('flex');
        }

        const dateElement = document.getElementById('terms-date');
        if (dateElement && db.settings.termsAcceptedAt) {
            const dateObj = new Date(db.settings.termsAcceptedAt);
            dateElement.textContent = 'Confirmado em: ' + dateObj.toLocaleString('pt-BR');
        }

        if (icon) {
            icon.setAttribute('class', 'w-16 h-16 text-green-500 mb-3 transition-colors duration-500');
            icon.setAttribute('data-lucide', 'shield-check');
            if (window.lucide) lucide.createIcons();
        }
        if (title) {
            title.textContent = 'Termos Aceitos e Válidos';
            title.classList.add('text-green-800');
        }
        if (desc) {
            desc.textContent = 'Obrigado por sua transparência e confiança. Seu uso está regularizado.';
            desc.classList.add('text-green-700');
        }
    }
}

// --- VENDAS ---
function renderSales() {
    const tbody = document.getElementById('sales-table-body');
    const emptyMsg = document.getElementById('sales-empty-msg');
    const filterDateEl = document.getElementById('sales-date-filter');
    const filterDate = filterDateEl ? filterDateEl.value : '';

    if (!tbody) return;
    tbody.innerHTML = '';
    let filteredSales = [...db.sales].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (filterDate) {
        filteredSales = filteredSales.filter(s => saleDateKey(s) === filterDate);
    }
    const term = (document.getElementById('sales-search')?.value || '').trim().toLowerCase();
    if (term) filteredSales = filteredSales.filter(s => [s.id, s.clientName, db.clients.find(c=>c.id===s.clientId)?.name].some(value=>String(value||'').toLowerCase().includes(term)));

    if (filteredSales.length === 0) {
        if (emptyMsg) emptyMsg.classList.remove('hidden');
        return;
    }

    if (emptyMsg) emptyMsg.classList.add('hidden');
    tbody.innerHTML = filteredSales.map(sale => `
        <tr class="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
            <td class="px-6 py-4 font-mono text-xs text-gray-500">#${sale.id.slice(-6).toUpperCase()}</td>
            <td class="px-6 py-4 text-gray-700">${fmtDateTime(sale.timestamp)}</td>
            <td class="px-6 py-4 text-gray-700">${sale.items.length} itens${sale.status==='canceled'?'<br><strong class="text-red-600">Cancelada</strong>':''}</td>
            <td class="px-6 py-4 font-bold text-gray-800">${fmtMoney(sale.total)}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 uppercase">
                    ${sale.paymentMethod || 'Dinheiro'}
                </span>
            </td>
            <td class="px-6 py-4 text-center">
                <button data-sale-id="${managementAttribute(sale.id)}" onclick="openSaleDetails(this.dataset.saleId)" class="border rounded-lg p-2 text-sm font-bold" title="Ver detalhes da venda">Detalhes</button>
                <button onclick="printSaleReceipt('${sale.id}')" class="text-gray-400 hover:text-rose-600 transition-colors" title="Reimprimir Cupom">
                    <i data-lucide="printer" class="w-5 h-5"></i>
                </button>
            </td>
        </tr>
    `).join('');

    if (window.lucide) lucide.createIcons();
}

// --- CLIENTES ---
function renderClients() {
    const tbody = document.getElementById('clients-table-body');
    const emptyMsg = document.getElementById('clients-empty-msg');
    const searchEl = document.getElementById('client-search');
    const term = searchEl ? searchEl.value.toLowerCase() : '';

    if (!tbody) return;
    tbody.innerHTML = '';
    const filtered = db.clients.filter(c => c.name.toLowerCase().includes(term));

    if (filtered.length === 0) {
        if (emptyMsg) emptyMsg.classList.remove('hidden');
        return;
    }

    if (emptyMsg) emptyMsg.classList.add('hidden');
    tbody.innerHTML = filtered.map(client => `
        <tr class="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
            <td class="px-6 py-4 font-bold text-gray-800">${sanitizeHTML(client.name)}</td>
            <td class="px-6 py-4 text-gray-600">${sanitizeHTML(client.phone || '-')}</td>
            <td class="px-6 py-4 text-gray-600">${sanitizeHTML(client.email || '-')}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs font-bold bg-rose-100 text-rose-700">
                    ${client.points || 0} pts
                </span>
            </td>
            <td class="px-6 py-4 text-center">
                <button data-client-id="${managementAttribute(client.id)}" onclick="openClientHistory(this.dataset.clientId)" class="border rounded-lg p-2 text-sm font-bold">Histórico</button>
                <button onclick="openEditClientModal('${client.id}')" class="text-gray-400 hover:text-rose-600 transition-colors p-1" title="Editar cliente">
                    <i data-lucide="pencil" class="w-5 h-5"></i>
                </button>
                <button onclick="deleteClient('${client.id}')" class="text-gray-400 hover:text-red-600 transition-colors p-1" title="Excluir cliente">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </td>
        </tr>
    `).join('');

    if (window.lucide) lucide.createIcons();
}

function openClientModal() {
    const titleEl = document.getElementById('client-modal-title');
    if (titleEl) titleEl.textContent = 'Novo Cliente';
    document.getElementById('client-id').value = '';
    document.getElementById('client-name').value = '';
    document.getElementById('client-phone').value = '';
    document.getElementById('client-email').value = '';
    document.getElementById('clientModal').classList.remove('hidden');
}

function openEditClientModal(id) {
    const client = db.clients.find(c => c.id === id);
    if (!client) {
        showNotification('Cliente não encontrado.', 'error');
        return;
    }

    const titleEl = document.getElementById('client-modal-title');
    if (titleEl) titleEl.textContent = 'Editar Cliente';
    document.getElementById('client-id').value = client.id;
    document.getElementById('client-name').value = client.name || '';
    document.getElementById('client-phone').value = client.phone || '';
    document.getElementById('client-email').value = client.email || '';
    document.getElementById('clientModal').classList.remove('hidden');
}

function saveClient(e) {
    e.preventDefault();
    const clientId = document.getElementById('client-id').value || getID();
    const existingIndex = db.clients.findIndex(c => c.id === clientId);
    const existingClient = existingIndex >= 0 ? db.clients[existingIndex] : {};
    const client = {
        id: clientId,
        name: document.getElementById('client-name').value,
        phone: document.getElementById('client-phone').value,
        email: document.getElementById('client-email').value,
        points: existingClient.points || 0,
        history: existingClient.history || []
    };

    if (existingIndex >= 0) {
        db.clients[existingIndex] = client;
    } else {
        db.clients.push(client);
    }

    save();
    closeModal('clientModal');
    renderClients();
    showNotification(existingIndex >= 0 ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!', 'success');
}

function deleteClient(id) {
    if (db.sales.some(sale=>sale.clientId===id)) { showNotification('Este cliente tem vendas vinculadas. Mantenha o cadastro para preservar o histórico e os pontos.', 'info'); return; }
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        db.clients = db.clients.filter(c => c.id !== id);
        save();
        renderClients();
    }
}

// --- FORNECEDORES ---
function renderSuppliers() {
    const tbody = document.getElementById('suppliers-table-body');
    const emptyMsg = document.getElementById('suppliers-empty-msg');

    if (!tbody) return;
    tbody.innerHTML = '';

    if (db.suppliers.length === 0) {
        if (emptyMsg) emptyMsg.classList.remove('hidden');
        return;
    }

    if (emptyMsg) emptyMsg.classList.add('hidden');
    tbody.innerHTML = db.suppliers.map(sup => `
        <tr class="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
            <td class="px-6 py-4 font-bold text-gray-800">${sanitizeHTML(sup.name)}</td>
            <td class="px-6 py-4 text-gray-600">${sanitizeHTML(sup.contact || '-')}</td>
            <td class="px-6 py-4 text-gray-600">${sanitizeHTML(sup.phone || '-')}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs font-bold bg-rose-100 text-rose-700 uppercase">
                    ${sanitizeHTML(sup.category || 'Geral')}
                </span>
            </td>
            <td class="px-6 py-4 text-center">
                <button onclick="openEditSupplierModal('${sup.id}')" class="text-gray-400 hover:text-rose-600 transition-colors p-1" title="Editar fornecedor">
                    <i data-lucide="pencil" class="w-5 h-5"></i>
                </button>
                <button onclick="deleteSupplier('${sup.id}')" class="text-gray-400 hover:text-red-600 transition-colors p-1" title="Excluir fornecedor">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </td>
        </tr>
    `).join('');

    if (window.lucide) lucide.createIcons();
}

function openSupplierModal() {
    const titleEl = document.getElementById('supplier-modal-title');
    if (titleEl) titleEl.textContent = 'Novo Fornecedor';
    document.getElementById('supplier-id').value = '';
    document.getElementById('supplier-name').value = '';
    document.getElementById('supplier-contact').value = '';
    document.getElementById('supplier-phone').value = '';
    document.getElementById('supplier-category').value = '';
    document.getElementById('supplierModal').classList.remove('hidden');
}

function openEditSupplierModal(id) {
    const supplier = db.suppliers.find(s => s.id === id);
    if (!supplier) {
        showNotification('Fornecedor não encontrado.', 'error');
        return;
    }

    const titleEl = document.getElementById('supplier-modal-title');
    if (titleEl) titleEl.textContent = 'Editar Fornecedor';
    document.getElementById('supplier-id').value = supplier.id;
    document.getElementById('supplier-name').value = supplier.name || '';
    document.getElementById('supplier-contact').value = supplier.contact || '';
    document.getElementById('supplier-phone').value = supplier.phone || '';
    document.getElementById('supplier-category').value = supplier.category || '';
    document.getElementById('supplierModal').classList.remove('hidden');
}

function saveSupplier(e) {
    e.preventDefault();
    const supplierId = document.getElementById('supplier-id').value || getID();
    const existingIndex = db.suppliers.findIndex(s => s.id === supplierId);
    const supplier = {
        id: supplierId,
        name: document.getElementById('supplier-name').value,
        contact: document.getElementById('supplier-contact').value,
        phone: document.getElementById('supplier-phone').value,
        category: document.getElementById('supplier-category').value
    };

    if (existingIndex >= 0) {
        db.suppliers[existingIndex] = supplier;
    } else {
        db.suppliers.push(supplier);
    }

    save();
    closeModal('supplierModal');
    renderSuppliers();
    showNotification(existingIndex >= 0 ? 'Fornecedor atualizado!' : 'Fornecedor salvo!', 'success');
}

function deleteSupplier(id) {
    if (confirm('Excluir fornecedor?')) {
        db.suppliers = db.suppliers.filter(s => s.id !== id);
        save();
        renderSuppliers();
    }
}

// --- RELATÓRIOS ---
function renderReports() {
    const periodEl = document.getElementById('report-period');
    const period = periodEl ? periodEl.value : 'month';
    let filteredSales = [...db.sales];

    const today = new Date();
    const todayStr = localDateKey(today);
    const periodStart = getReportPeriodStart(period, today, todayStr);
    const periodEnd = new Date(today);
    periodEnd.setHours(23, 59, 59, 999);

    filteredSales = filteredSales.filter(s => {
        const saleDay = saleDateKey(s);
        const saleDate = new Date(saleDay + 'T00:00:00');
        return saleDate >= periodStart && saleDate <= periodEnd;
    });

    // ── KPIs principais ──
    const grossSales = filteredSales.reduce((sum, s) => sum + (s.total || 0), 0);
    const reversals = (db.saleReversals || []).filter(item=>new Date(item.at)>=periodStart && new Date(item.at)<=periodEnd);
    const refunded = reversals.reduce((sum,item)=>sum+item.amount,0);
    const totalSales = roundMoney(grossSales - refunded);
    const avgTicket  = filteredSales.length > 0 ? grossSales / filteredSales.length : 0;
    const summary = document.getElementById('report-reversals-summary');
    if(summary) summary.textContent = `Vendas brutas: ${fmtMoney(grossSales)} · Devoluções do período: ${fmtMoney(refunded)} · Receita líquida: ${fmtMoney(totalSales)}. O ticket médio considera as vendas brutas. Cancelamentos entram na data da devolução.`;

    // Custos congelados na operação. Não inventar o custo de vendas antigas.
    const knownSales = filteredSales.filter(s => s.costSnapshotVersion === 1 && Number.isFinite(s.costTotal));
    const soldCost = knownSales.reduce((sum, sale) => sum + sale.costTotal, 0) - reversals.reduce((sum,item)=>sum+(Number(item.costCredit)||0),0);
    const periodLosses = (db.stockLosses || [])
        .filter(loss => {
            const lossDate = new Date(loss.date);
            return lossDate >= periodStart && lossDate <= periodEnd;
        });
    const knownLosses = periodLosses.filter(loss => Number.isFinite(loss.costTotal));
    const lossCost = knownLosses.reduce((sum, loss) => sum + loss.costTotal, 0);
    const missingCosts = filteredSales.length - knownSales.length + periodLosses.length - knownLosses.length;
    const totalCost = soldCost + lossCost;
    const grossProfit = totalSales - totalCost;
    const marginPct = totalSales > 0 ? (grossProfit / totalSales * 100) : 0;

    const repInc = document.getElementById('rep-inc');
    const repExp = document.getElementById('rep-exp');
    const repBal = document.getElementById('rep-bal');
    const repCost = document.getElementById('rep-cost');
    const repProfit = document.getElementById('rep-profit');
    const repMargin = document.getElementById('rep-margin');

    if (repInc) repInc.textContent = fmtMoney(totalSales);
    if (repExp) repExp.textContent = `${filteredSales.length} venda(s)`;
    if (repBal) repBal.textContent = fmtMoney(avgTicket);
    if (repCost) repCost.textContent = fmtMoney(totalCost);
    const repCostDetail = document.getElementById('rep-cost-detail');
    if (repCostDetail) repCostDetail.textContent = `Venda: ${fmtMoney(soldCost)} | Perdas: ${fmtMoney(lossCost)}${missingCosts ? ` | ${missingCosts} registro(s) antigo(s) sem custo histórico. Custo parcial; lucro e margem indisponíveis.` : ''}`;
    if (repProfit) repProfit.textContent = missingCosts ? '—' : fmtMoney(grossProfit);
    if (repMargin) repMargin.textContent = missingCosts ? '—' : `${marginPct.toFixed(1)}%`;

    // ── Breakdown por forma de pagamento ──
    const paymentEl = document.getElementById('rep-payment-breakdown');
    if (paymentEl) {
        const paymentMap = {};
        filteredSales.forEach(s => {
            const method = s.paymentMethod || 'dinheiro';
            if (!paymentMap[method]) paymentMap[method] = { count: 0, total: 0 };
            paymentMap[method].count++;
            paymentMap[method].total += (s.total || 0);
        });

        const labels = {
            dinheiro: 'Dinheiro',
            pix:      'PIX',
            debito:   'Débito',
            credito:  'Crédito'
        };
        const entries = Object.entries(paymentMap).sort((a, b) => b[1].total - a[1].total);

        if (entries.length === 0) {
            paymentEl.innerHTML = '<p class="text-gray-400 text-sm text-center py-4">Nenhuma venda no período</p>';
        } else {
            paymentEl.innerHTML = entries.map(([method, data]) => {
                const pct = grossSales > 0 ? Math.round((data.total / grossSales) * 100) : 0;
                return `
                    <div class="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                        <span class="text-sm font-medium text-gray-700 w-28 shrink-0">${labels[method] || method}</span>
                        <div class="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div class="h-full bg-rose-500 rounded-full transition-all" style="width:${pct}%"></div>
                        </div>
                        <span class="text-xs font-bold text-gray-700 w-20 text-right">${fmtMoney(data.total)}</span>
                        <span class="text-xs text-gray-400 w-10 text-right">${pct}%</span>
                    </div>`;
            }).join('');
        }
    }

    // ── Top produtos por receita ──
    const chartEl = document.getElementById('top-flavors-chart');
    if (chartEl) {
        const productMap = {};
        filteredSales.forEach(s => {
            (s.items || []).forEach(item => {
                if (!productMap[item.name]) productMap[item.name] = { total: 0, qty: 0 };
                productMap[item.name].total += (item.total || 0);
                productMap[item.name].qty   += (item.qty || 1);
            });
        });

        const topProducts = Object.entries(productMap)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 5);

        if (topProducts.length === 0) {
            chartEl.className = 'h-40 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg';
            chartEl.innerHTML = 'Nenhuma venda no período selecionado';
        } else {
            const maxVal = topProducts[0][1].total;
            const medals = ['1°', '2°', '3°', '4°', '5°'];
            chartEl.className = 'space-y-3 pt-2';
            chartEl.innerHTML = topProducts.map(([name, data], i) => {
                const pct = maxVal > 0 ? Math.round((data.total / maxVal) * 100) : 0;
                return `
                    <div class="flex items-center gap-3">
                        <span class="text-base w-6 text-center shrink-0">${medals[i]}</span>
                        <span class="text-sm font-medium text-gray-700 w-36 truncate shrink-0" title="${sanitizeHTML(name)}">${sanitizeHTML(name)}</span>
                        <div class="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div class="h-full bg-rose-600 rounded-full" style="width:${pct}%"></div>
                        </div>
                        <span class="text-xs font-bold text-rose-700 w-20 text-right">${fmtMoney(data.total)}</span>
                    </div>`;
            }).join('');
        }
    }

    renderSeasonalityChart();
}

function getReportPeriodStart(period, today, todayStr) {
    if (period === 'today') return new Date(todayStr + 'T00:00:00');
    if (period === 'week') {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        lastWeek.setHours(0, 0, 0, 0);
        return lastWeek;
    }
    if (period === 'year') return new Date(todayStr.slice(0, 4) + '-01-01T00:00:00');
    return new Date(todayStr.slice(0, 7) + '-01T00:00:00');
}

function renderSeasonalityChart() {
    const chart = document.getElementById('seasonality-chart');
    if (!chart) return;

    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: localDateKey(date).slice(0, 7),
            label: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
            total: 0
        });
    }

    (db.sales || []).forEach(sale => {
        const key = saleDateKey(sale).slice(0, 7);
        const month = months.find(m => m.key === key);
        if (month) month.total += Number(sale.total || 0);
    });

    db.saleReversals.forEach(item=>{const month=months.find(m=>m.key===localDateKey(item.at).slice(0,7));if(month)month.total-=item.amount;});
    const max = Math.max(...months.map(m => Math.abs(m.total)), 1);
    chart.innerHTML = `
        <div class="grid grid-cols-6 gap-3 h-48 items-end">
            ${months.map(month => {
                const height = Math.max(6, Math.round((Math.abs(month.total) / max) * 100));
                return `
                    <div class="flex flex-col items-center justify-end h-full gap-2">
                        <div class="text-[10px] font-bold text-gray-500">${fmtMoney(month.total)}</div>
                        <div class="w-full bg-gray-100 rounded-lg h-32 flex items-end overflow-hidden">
                            <div class="w-full bg-rose-600 rounded-t-lg transition-all" style="height:${height}%"></div>
                        </div>
                        <div class="text-xs font-bold text-gray-600 capitalize">${sanitizeHTML(month.label)}</div>
                    </div>`;
            }).join('')}
        </div>`;
}

function shareReport() {
    const periodEl  = document.getElementById('report-period');
    const periodTxt = periodEl ? periodEl.options[periodEl.selectedIndex]?.text : 'Período';
    const repInc    = document.getElementById('rep-inc')?.textContent  || 'R$ 0,00';
    const repExp    = document.getElementById('rep-exp')?.textContent  || '0';
    const repBal    = document.getElementById('rep-bal')?.textContent  || 'R$ 0,00';
    const store     = db.settings?.companyName || 'Sorveteria';

    const msg = `📊 *Relatório — ${store}*\n📅 Período: ${periodTxt}\n\n💰 Receita Total: ${repInc}\n🧾 Nº de Vendas: ${repExp}\n📈 Ticket Médio: ${repBal}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// --- CONFIGURAÇÕES ---
function renderSettings() {
    const nameEl = document.getElementById('settings-name');
    const addrEl = document.getElementById('settings-address');
    const phoneEl = document.getElementById('settings-phone');
    if (nameEl) nameEl.value = db.settings.companyName || '';
    if (addrEl) addrEl.value = db.settings.address || '';
    if (phoneEl) phoneEl.value = db.settings.phone || '';
    renderLoyaltySettings();renderBackupStatus();
}

function saveCompanySettings() {
    const nameEl = document.getElementById('settings-name');
    const addrEl = document.getElementById('settings-address');
    const phoneEl = document.getElementById('settings-phone');
    if (nameEl) db.settings.companyName = nameEl.value;
    if (addrEl) db.settings.address = addrEl.value;
    if (phoneEl) db.settings.phone = phoneEl.value;
    save();
    document.getElementById('company-name').textContent=db.settings.companyName;
    renderOperationalDashboard();
    showNotification('Configurações salvas!', 'success');
}

// --- BACKUP E RESTAURAÇÃO ---
function downloadBackup() { requestSorveteriaBackup(); }

function restoreBackup(input) { previewSorveteriaBackup(input); }

function factoryReset() {
    if (confirm('ATENÇÃO: Isso apagará TODOS os dados, produtos e vendas. Tem certeza absoluta?')) {
        if (confirm('Última chance: Essa ação não pode ser desfeita. Confirmar reset?')) {
            localStorage.removeItem(DB_KEY);
            localStorage.removeItem(PDV_DRAFT_KEY);
            localStorage.removeItem(RESTORE_CHECKPOINT_KEY);
            localStorage.removeItem(BACKUP_HISTORY_KEY);
            location.reload();
        }
    }
}

// --- MANUAL / TUTORIAL / CHECKLIST ---
function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function markSectionComplete(id) {
    const completed = JSON.parse(localStorage.getItem('sorveteria-manual-progress') || '[]');
    if (!completed.includes(id)) {
        completed.push(id);
        localStorage.setItem('sorveteria-manual-progress', JSON.stringify(completed));
        updateTutorialProgress();
        showNotification('Seção concluída!', 'success');
    }
}

function updateTutorialProgress() {
    const sections = ['instalacao', 'primeiro-cadastro', 'producao', 'vendas', 'backup', 'duvidas', 'checklist'];
    const completed = JSON.parse(localStorage.getItem('sorveteria-manual-progress') || '[]');
    const progress = (completed.length / sections.length) * 100;

    const progressBar = document.getElementById('tutorial-progress');
    const completedSteps = document.getElementById('completed-steps');

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (completedSteps) completedSteps.textContent = `${completed.length}/${sections.length} etapas`;
}

function updateChecklist() {
    const checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
    const total = checkboxes.length;
    const checked = document.querySelectorAll('#checklist input[type="checkbox"]:checked').length;
    const percent = Math.round((checked / total) * 100);

    const percentEl = document.getElementById('checklist-percent');
    const progressEl = document.getElementById('checklist-progress');
    const completedEl = document.getElementById('checklist-completed');
    const totalEl = document.getElementById('checklist-total');

    if (percentEl) percentEl.textContent = `${percent}%`;
    if (progressEl) progressEl.style.width = `${percent}%`;
    if (completedEl) completedEl.textContent = checked;
    if (totalEl) totalEl.textContent = total;

    checkboxes.forEach(cb => {
        const item = cb.closest('.checklist-item');
        if (!item) return;
        if (cb.checked) {
            item.classList.add('bg-rose-50', 'border-rose-500');
            item.classList.remove('border-gray-200');
        } else {
            item.classList.remove('bg-rose-50', 'border-rose-500');
            item.classList.add('border-gray-200');
        }
    });

    const state = {};
    checkboxes.forEach(cb => state[cb.id] = cb.checked);
    localStorage.setItem('sorveteria-checklist-state', JSON.stringify(state));
}

function resetChecklist() {
    if (confirm('Deseja reiniciar seu checklist diário?')) {
        localStorage.removeItem('sorveteria-checklist-state');
        document.querySelectorAll('#checklist input[type="checkbox"]').forEach(cb => cb.checked = false);
        updateChecklist();
        showNotification('Checklist reiniciado', 'info');
    }
}

function loadChecklistState() {
    const state = JSON.parse(localStorage.getItem('sorveteria-checklist-state') || '{}');
    Object.keys(state).forEach(id => {
        const cb = document.getElementById(id);
        if (cb) cb.checked = state[id];
    });
    updateChecklist();
}

function showExample(type) {
    showNotification(`Dica: Veja a seção ${type} no menu lateral`, 'info');
}
