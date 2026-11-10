// ============================================================
// production.js — Controle de Produção
// Gestão Sorveteria & Açaí Pro
// ============================================================

let currentProductionTab = 'lots';

function renderProduction() {
    syncProductionTabs();
    if (currentProductionTab === 'recipes') {
        renderRecipes();
        return;
    }
    const search = (document.getElementById('production-search')?.value || '').toLowerCase();
    const type = document.getElementById('production-type')?.value || 'all';
    const status = document.getElementById('production-status')?.value || 'all';
    const date = document.getElementById('production-date')?.value || '';

    let items = db.production || [];
    if (search) items = items.filter(i => i.product?.toLowerCase().includes(search) || (i.code||'').toLowerCase().includes(search));
    if (type !== 'all') items = items.filter(i => i.type === type);
    if (status !== 'all') items = items.filter(i => i.status === status);
    if (date) items = items.filter(i => i.date?.slice(0,10) === date);

    const tbody = document.getElementById('production-table-body');
    const emptyMsg = document.getElementById('production-empty-msg');
    if (!tbody) return;

    if (items.length === 0) {
        tbody.innerHTML = '';
        if (emptyMsg) emptyMsg.classList.remove('hidden');
    } else {
        if (emptyMsg) emptyMsg.classList.add('hidden');
        tbody.innerHTML = items.map(item => {
            const statusBadge = {
                'produzindo': '<span class="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Produzindo</span>',
                'pronto': '<span class="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Pronto</span>',
                'pendente': '<span class="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">Pendente</span>'
            }[item.status] || `<span class="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">${item.status}</span>`;
            return `<tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-xs font-mono text-gray-500">${item.code || item.id?.slice(0,6).toUpperCase()}</td>
                <td class="px-6 py-4 font-medium text-gray-800">${sanitizeHTML(item.product || '-')}</td>
                <td class="px-6 py-4 text-sm text-gray-600 capitalize">${item.type || '-'}</td>
                <td class="px-6 py-4 text-sm font-bold">${item.quantity || 0} ${item.unit || 'L'}</td>
                <td class="px-6 py-4">${statusBadge}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${item.date ? fmtDate(item.date) : '-'}</td>
                <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                        ${item.status !== 'pronto' ? `<button onclick="openProductionModal('${item.id}')" class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Editar</button>` : ''}
                        ${item.status !== 'pronto' ? `<button onclick="openProductionReview('${item.id}')" class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">Pronto</button>` : ''}
                        <button onclick="deleteProduction('${item.id}')" class="p-1 text-red-400 hover:bg-red-50 rounded"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                </td>
            </tr>`;
        }).join('');
    }

    // Contadores
    const today = localDateKey();
    const todayItems = (db.production||[]).filter(i => i.date?.slice(0,10) === today);
    const inProgress = (db.production||[]).filter(i => i.status === 'produzindo').length;
    const ready = (db.production||[]).filter(i => i.status === 'pronto').length;
    const completedToday = todayItems.filter(item => item.status === 'pronto');

    const elToday = document.getElementById('production-today-summary');
    const elProgress = document.getElementById('production-in-progress');
    const elReady = document.getElementById('production-ready');
    const elIngr = document.getElementById('ingredients-used');
    if (elToday) elToday.textContent = summarizeStockQuantities(completedToday);
    if (elProgress) elProgress.textContent = inProgress;
    if (elReady) elReady.textContent = ready;
    if (elIngr) elIngr.textContent = summarizeStockQuantities(completedToday.flatMap(item => item.ingredients || []), 'qty');

    renderProductionSchedule();
    if (window.lucide) lucide.createIcons();
}

function syncProductionTabs() {
    document.querySelectorAll('.production-tab').forEach(btn => {
        const isActive = btn.dataset.tab === currentProductionTab;
        btn.setAttribute('aria-pressed', String(isActive));
        btn.className = `production-tab py-2 px-1 border-b-2 font-medium text-sm ${isActive
            ? 'border-rose-500 text-rose-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`;
    });

    const lots = document.getElementById('production-lots-panel');
    const recipes = document.getElementById('production-recipes-panel');
    if (lots) lots.classList.toggle('hidden', currentProductionTab !== 'lots');
    if (recipes) recipes.classList.toggle('hidden', currentProductionTab !== 'recipes');
}

function showProductionTab(tab) {
    currentProductionTab = tab;
    syncProductionTabs();
    if (tab === 'recipes') renderRecipes();
    else renderProduction();
}

function renderRecipes() {
    const container = document.getElementById('recipes-list');
    if (!container) return;

    const recipes = db.recipes || [];
    if (recipes.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-400">
                <i data-lucide="book-open" class="w-12 h-12 mx-auto mb-3 text-gray-300"></i>
                <p>Nenhuma receita cadastrada.</p>
            </div>`;
    } else {
        container.innerHTML = recipes.map(recipe => {
            const product = (db.products || []).find(p => p.id === recipe.productId);
            return `
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="font-bold text-gray-800">${sanitizeHTML(recipe.name)}</p>
                            <p class="text-xs text-gray-500 mt-1">${recipe.yieldQty || 0} ${sanitizeHTML(recipe.yieldUnit || '')} - ${(recipe.ingredients || []).length} ingrediente(s)</p>
                            ${product ? `<p class="text-xs text-rose-600 mt-1">Produto: ${sanitizeHTML(product.name)}</p>` : ''}
                            ${recipe.notes ? `<p class="text-xs text-gray-500 mt-2 line-clamp-2">${sanitizeHTML(recipe.notes)}</p>` : ''}
                        </div>
                        <div class="flex gap-1 shrink-0">
                            <button onclick="openEditRecipeModal('${recipe.id}')" class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Editar">
                                <i data-lucide="pencil" class="w-4 h-4"></i>
                            </button>
                            <button onclick="deleteRecipe('${recipe.id}')" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Excluir">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
        }).join('');
    }

    if (window.lucide) lucide.createIcons();
}

function renderProductionSchedule() {
    const schedule = document.getElementById('production-schedule');
    if (!schedule) return;
    const pending = (db.production||[]).filter(i => i.status !== 'pronto').slice(0,5);
    if (pending.length === 0) {
        schedule.innerHTML = '<p class="text-gray-400 text-sm">Nenhuma produção agendada.</p>';
        return;
    }
    schedule.innerHTML = pending.map(i => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                    <i data-lucide="ice-cream-2" class="w-4 h-4 text-rose-600"></i>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-800">${sanitizeHTML(i.product || 'Produção')}</p>
                    <p class="text-xs text-gray-500">${i.quantity || 0} ${sanitizeHTML(i.unit || 'L')} — ${fmtDate(i.date||new Date())}</p>
                </div>
            </div>
            <span class="text-xs font-bold capitalize ${i.status === 'produzindo' ? 'text-yellow-600' : 'text-gray-500'}">${i.status}</span>
        </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
}

function openProductionModal(id = '') {
    const existing = db.production.find(item => item.id === id);
    if (existing?.status === 'pronto' || existing?.completedAt) { showNotification('Este lote já foi concluído.', 'warning'); return; }
    const form = document.getElementById('production-form');
    form.reset();
    form.dataset.editId = existing?.id || '';
    document.getElementById('prod-ingredients-list').innerHTML = '';
    const modal = document.getElementById('productionModal');
    if (modal) modal.classList.remove('hidden');

    const quantityEl = document.getElementById('prod-quantity');
    if (quantityEl && !quantityEl.value) quantityEl.value = '1';

    const recipeSelect = document.getElementById('prod-recipe');
    if (recipeSelect) {
        recipeSelect.innerHTML = '<option value="">Começar sem receita</option>' +
            (db.recipes || []).map(r => `<option value="${r.id}">${sanitizeHTML(r.name)} (${r.yieldQty || 0} ${sanitizeHTML(r.yieldUnit || '')})</option>`).join('');
    }

    // Popular select de produtos
    const prodSelect = document.getElementById('prod-product-link');
    if (prodSelect) {
        prodSelect.innerHTML = '<option value="">Nenhum produto específico</option>' +
            db.products.map(p => `<option value="${p.id}">${sanitizeHTML(p.name)}${p.flavor ? ' — ' + p.flavor : ''}</option>`).join('');
    }
    document.getElementById('prod-date').value = existing?.date || localDateKey();
    if (existing) {
        for (const [field, value] of Object.entries({ 'prod-product': existing.product, 'prod-type': existing.type, 'prod-quantity': existing.quantity, 'prod-unit': existing.unit, 'prod-notes': existing.notes, 'prod-temperature': existing.temperature, 'prod-status': existing.status, 'prod-product-link': existing.productId, 'prod-recipe': existing.recipeId })) {
            document.getElementById(field).value = value ?? '';
        }
        (existing.ingredients || []).forEach(ingredient => addIngredientRow('prod-ingredients-list', ingredient));
    }
}

function addIngredientRow(targetId = 'prod-ingredients-list', ingredient = {}) {
    const container = document.getElementById(targetId);
    if (!container) return;
    const rowId = getID();
    container.insertAdjacentHTML('beforeend', `
        <div id="ingredient-${rowId}" class="ingredient-row grid grid-cols-[1fr_110px_90px_36px] gap-2">
            <input type="text" placeholder="Ingrediente" value="${sanitizeHTML(ingredient.name || '')}" class="ingredient-name border p-2 rounded text-sm">
            <input type="number" placeholder="Quantidade" step="0.1" min="0" value="${ingredient.qty || ''}" class="ingredient-qty border p-2 rounded text-sm">
            <select class="ingredient-unit border p-2 rounded text-sm">
                <option value="kg" ${ingredient.unit === 'kg' ? 'selected' : ''}>kg</option>
                <option value="gramas" ${ingredient.unit === 'gramas' ? 'selected' : ''}>g</option>
                <option value="litro" ${ingredient.unit === 'litro' ? 'selected' : ''}>L</option>
                <option value="ml" ${ingredient.unit === 'ml' ? 'selected' : ''}>ml</option>
                <option value="unidade" ${ingredient.unit === 'unidade' ? 'selected' : ''}>un</option>
            </select>
            <button type="button" onclick="this.parentElement.remove()" class="text-red-500 hover:bg-red-50 rounded">
                <i data-lucide="x" class="w-4 h-4 mx-auto"></i>
            </button>
        </div>
    `);
    if (window.lucide) lucide.createIcons();
}

function collectIngredientRows(selector) {
    const ingredients = [];
    document.querySelectorAll(selector).forEach(row => {
        const name = row.querySelector('.ingredient-name, input[type="text"]')?.value?.trim() || '';
        const qty = parseFloat(row.querySelector('.ingredient-qty, input[type="number"]')?.value || 0);
        const unitIngr = row.querySelector('.ingredient-unit, select')?.value || 'kg';
        if (name && qty > 0) ingredients.push({ name, qty, unit: unitIngr });
    });
    return ingredients;
}

function openRecipeModal() {
    ensureRecipeModal();
    document.getElementById('recipe-modal-title').textContent = 'Nova Receita';
    document.getElementById('recipe-id').value = '';
    document.getElementById('recipe-name').value = '';
    document.getElementById('recipe-yield-qty').value = '';
    document.getElementById('recipe-yield-unit').value = 'litro';
    document.getElementById('recipe-notes').value = '';
    document.getElementById('recipe-product').innerHTML = '<option value="">Sem vínculo</option>' +
        (db.products || []).map(p => `<option value="${p.id}">${sanitizeHTML(p.name)}</option>`).join('');
    document.getElementById('recipe-ingredients-list').innerHTML = '';
    addIngredientRow('recipe-ingredients-list');
    document.getElementById('recipeModal').classList.remove('hidden');
}

function openEditRecipeModal(id) {
    const recipe = (db.recipes || []).find(r => r.id === id);
    if (!recipe) return;
    openRecipeModal();
    document.getElementById('recipe-modal-title').textContent = 'Editar Receita';
    document.getElementById('recipe-id').value = recipe.id;
    document.getElementById('recipe-name').value = recipe.name || '';
    document.getElementById('recipe-product').value = recipe.productId || '';
    document.getElementById('recipe-yield-qty').value = recipe.yieldQty || '';
    document.getElementById('recipe-yield-unit').value = recipe.yieldUnit || 'litro';
    document.getElementById('recipe-notes').value = recipe.notes || '';
    document.getElementById('recipe-ingredients-list').innerHTML = '';
    (recipe.ingredients || []).forEach(ing => addIngredientRow('recipe-ingredients-list', ing));
}

function saveRecipe(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('recipe-id')?.value || getID();
    const name = document.getElementById('recipe-name')?.value.trim() || '';
    const productId = document.getElementById('recipe-product')?.value || '';
    const yieldQty = parseFloat(document.getElementById('recipe-yield-qty')?.value || 0);
    const yieldUnit = document.getElementById('recipe-yield-unit')?.value || 'litro';
    const notes = document.getElementById('recipe-notes')?.value.trim() || '';

    if (!name || yieldQty <= 0) {
        showNotification('Informe nome e rendimento da receita.', 'error');
        return;
    }

    const ingredients = collectIngredientRows('#recipe-ingredients-list .ingredient-row');
    if (ingredients.length === 0) {
        showNotification('Adicione ao menos um ingrediente.', 'error');
        return;
    }

    if (!db.recipes) db.recipes = [];
    const existing = db.recipes.findIndex(r => r.id === id);
    const now = new Date().toISOString();
    const recipe = {
        id,
        productId: productId || undefined,
        name,
        yieldQty,
        yieldUnit,
        ingredients,
        notes,
        createdAt: existing >= 0 ? db.recipes[existing].createdAt : now,
        updatedAt: now
    };

    if (existing >= 0) db.recipes[existing] = recipe;
    else db.recipes.push(recipe);
    save();
    closeModal('recipeModal');
    renderRecipes();
    showNotification('Receita salva com sucesso!', 'success');
}

function deleteRecipe(id) {
    if (!confirm('Excluir esta receita?')) return;
    db.recipes = (db.recipes || []).filter(r => r.id !== id);
    save();
    renderRecipes();
    showNotification('Receita excluída.', 'success');
}

function applyRecipeToProduction(recipeId) {
    const recipe = (db.recipes || []).find(r => r.id === recipeId);
    if (!recipe) return;
    const product = (db.products || []).find(p => p.id === recipe.productId);
    const quantityEl = document.getElementById('prod-quantity');
    const desiredQty = parseFloat(quantityEl?.value || recipe.yieldQty || 0);
    const factor = recipe.yieldQty > 0 && desiredQty > 0 ? desiredQty / recipe.yieldQty : 1;

    if (product) {
        document.getElementById('prod-product').value = product.name || recipe.name;
        document.getElementById('prod-product-link').value = product.id;
        document.getElementById('prod-type').value = product.category || 'sorvete';
    } else {
        document.getElementById('prod-product').value = recipe.name || '';
    }
    document.getElementById('prod-unit').value = recipe.yieldUnit || 'litro';
    if (quantityEl && !quantityEl.value) quantityEl.value = recipe.yieldQty || '';

    const container = document.getElementById('prod-ingredients-list');
    if (container) container.innerHTML = '';
    (recipe.ingredients || []).forEach(ing => {
        addIngredientRow('prod-ingredients-list', {
            name: ing.name,
            qty: Number((Number(ing.qty || 0) * factor).toFixed(3)),
            unit: ing.unit
        });
    });
}

function ensureRecipeModal() {
    if (document.getElementById('recipeModal')) return;
    const modal = document.createElement('div');
    modal.id = 'recipeModal';
    modal.className = 'fixed inset-0 modal-backdrop hidden z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 id="recipe-modal-title" class="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <i data-lucide="book-open" class="w-5 h-5 text-rose-600"></i>
                    Nova Receita
                </h3>
                <button onclick="closeModal('recipeModal')" class="text-gray-400 hover:text-gray-600">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <form onsubmit="saveRecipe(event)" class="space-y-4">
                <input type="hidden" id="recipe-id">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Nome da Receita</label>
                        <input type="text" id="recipe-name" required class="w-full border p-2 rounded-lg text-sm mt-1 outline-none focus:border-rose-400">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Produto Vinculado</label>
                        <select id="recipe-product" class="w-full border p-2 rounded-lg text-sm mt-1 outline-none focus:border-rose-400"></select>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Rendimento</label>
                        <input type="number" id="recipe-yield-qty" min="0.1" step="0.1" required class="w-full border p-2 rounded-lg text-sm mt-1 outline-none focus:border-rose-400">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Unidade</label>
                        <select id="recipe-yield-unit" class="w-full border p-2 rounded-lg text-sm mt-1 outline-none focus:border-rose-400">
                            <option value="litro">Litros</option>
                            <option value="kg">Quilos</option>
                            <option value="gramas">Gramas</option>
                            <option value="ml">Mililitros</option>
                            <option value="unidade">Unidades</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Ingredientes</label>
                    <div id="recipe-ingredients-list" class="space-y-2 mb-2"></div>
                    <button type="button" onclick="addIngredientRow('recipe-ingredients-list')" class="text-sm text-rose-500 hover:text-rose-400 flex items-center gap-1">
                        <i data-lucide="plus" class="w-4 h-4"></i> Adicionar Ingrediente
                    </button>
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Notas</label>
                    <textarea id="recipe-notes" rows="2" class="w-full border p-2 rounded-lg text-sm mt-1 outline-none focus:border-rose-400"></textarea>
                </div>
                <button type="submit" class="w-full bg-rose-500 text-white py-3 rounded-lg font-bold hover:bg-rose-600">Salvar Receita</button>
            </form>
        </div>`;
    document.body.appendChild(modal);
    if (window.lucide) lucide.createIcons();
}

function clearProductionFilters() {
    ['production-search','production-type','production-status','production-date'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = el.tagName === 'SELECT' ? el.options[0].value : '';
    });
    renderProduction();
}

function exportProductionCSV() {
    const header = 'Código,Produto,Tipo,Quantidade,Unidade,Status,Data';
    const rows = (db.production||[]).map(i => `${i.code||i.id},${i.product},${i.type||''},${i.quantity||0},${i.unit||'L'},${i.status},${i.date?.slice(0,10)||''}`);
    const csv = [header, ...rows].join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `producao_sorveteria_${localDateKey()}.csv`;
    a.click();
    showNotification('CSV exportado!', 'success');
}

function saveProduction(e) {
    if (e) e.preventDefault();
    const existing = db.production.find(item => item.id === document.getElementById('production-form').dataset.editId);
    if (existing?.status === 'pronto' || existing?.completedAt) { showNotification('Este lote já foi concluído.', 'warning'); return; }

    const product  = document.getElementById('prod-product')?.value?.trim() || '';
    const type     = document.getElementById('prod-type')?.value || 'sorvete';
    const quantity = parseFloat(document.getElementById('prod-quantity')?.value || 0);
    const unit     = document.getElementById('prod-unit')?.value || 'litro';
    const date     = document.getElementById('prod-date')?.value || localDateKey();
    const notes    = document.getElementById('prod-notes')?.value?.trim() || '';

    if (!product || !Number.isFinite(quantity) || quantity <= 0) {
        showNotification('Preencha o produto e a quantidade.', 'error');
        return;
    }

    // Coletar ingredientes como array estruturado
    const ingredients = [];
    let ingredientsUsed = 0; // mantém compatibilidade de exibição
    collectIngredientRows('#prod-ingredients-list .ingredient-row, #prod-ingredients-list > div').forEach(ing => {
        ingredients.push(ing);
        if (ing.unit === 'kg' || ing.unit === 'litro') ingredientsUsed += ing.qty;
    });

    // Vincular a um produto do catálogo (se disponível)
    const productId = document.getElementById('prod-product-link')?.value || '';
    const recipeId = document.getElementById('prod-recipe')?.value || '';

    const item = {
        ...existing,
        id: existing?.id || getID(),
        code: existing?.code || 'PRD' + Date.now().toString().slice(-4),
        productId: productId || undefined,
        recipeId: recipeId || undefined,
        product, type, quantity, unit, date, notes,
        ingredients,
        ingredientsUsed,
        status: document.getElementById('prod-status')?.value === 'pendente' ? 'pendente' : 'produzindo',
        temperature: document.getElementById('prod-temperature')?.value?.trim() || '',
        createdAt: existing?.createdAt || new Date().toISOString()
    };

    const next = JSON.parse(JSON.stringify(db));
    const index = next.production.findIndex(record => record.id === item.id);
    if (index >= 0) next.production[index] = item;
    else next.production.push(item);
    try { persistDatabase(next); }
    catch (error) { showNotification(error.message, 'error'); return; }

    // Fechar modal e limpar formulário
    const modal = document.getElementById('productionModal');
    if (modal) modal.classList.add('hidden');
    const form = document.getElementById('production-form');
    if (form) form.reset();
    const ingredList = document.getElementById('prod-ingredients-list');
    if (ingredList) ingredList.innerHTML = '';

    renderProduction();
    showNotification(existing ? 'Lote atualizado. Confira os dados antes de concluir.' : `Produção de "${product}" iniciada!`, 'success');
}

function updateProductionStatus(id, status) {
    const item=db.production.find(item=>item.id===id);if(!item)return;
    if(item.status==='pronto'||item.completedAt){showNotification('Este lote já foi concluído. O estoque não será movimentado novamente.','info');return;}
    if(!['pronto','produzindo','pendente'].includes(status))return;
    try{
        if(status==='pronto')persistDatabase(planProductionCompletion(db,id).next);
        else{const next=JSON.parse(JSON.stringify(db));next.production.find(item=>item.id===id).status=status;persistDatabase(next);}
        renderProduction();renderOperationalDashboard();showNotification('Status atualizado: '+status+'!','success');
    }catch(error){showNotification(error.message,'error');}
}

function deleteProduction(id) {
    const item = db.production.find(i => i.id === id);
    if (item?.status === 'pronto' || item?.completedAt) { showNotification('Lotes concluídos são mantidos no histórico para preservar as movimentações de estoque.', 'warning'); return; }
    if (!confirm('Remover este registro de produção?')) return;
    db.production = db.production.filter(i => i.id !== id);
    save(); renderProduction(); showNotification('Registro removido.', 'success');
}
