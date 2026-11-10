// ============================================================
// router.js — Gerenciamento de Navegação SPA
// Gestão Sorveteria & Açaí Pro
// ============================================================

function router(view) {
    const previousView = document.querySelector('.view-section:not(.hide)')?.id;
    if (view !== 'cashier' && typeof closePdvPayment === 'function') closePdvPayment();
    // Esconder todas as views
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hide'));

    // Remover active de todos os nav items
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active-nav', 'bg-white/10', 'text-white');
        el.removeAttribute('aria-current');
        el.classList.add('text-gray-300');
    });

    // Mostrar view selecionada
    const viewElement = document.getElementById(`view-${view}`);
    if (viewElement) {
        viewElement.classList.remove('hide');
        viewElement.classList.add('fade-in');
    }

    // Ativar nav item selecionado
    const navElement = document.getElementById(`nav-${view}`);
    if (navElement) {
        navElement.classList.add('active-nav');
        navElement.setAttribute('aria-current', 'page');
        navElement.classList.remove('text-gray-300');
    }

    // Atualizar título da página
    const titles = {
        dashboard: 'Dashboard',
        cashier: 'Frente de Caixa',
        production: 'Produção',
        inventory: 'Estoque',
        products: 'Produtos',
        sales: 'Vendas',
        clients: 'Clientes',
        suppliers: 'Fornecedores',
        reports: 'Relatórios',
        temperature: 'Temperatura',
        settings: 'Configurações',
        notifications: 'Notificações',
        instructions: 'Manual',
        about: 'Saiba Mais'
    };

    const titleEl = document.getElementById('page-title');
    if (titleEl) {
        titleEl.innerText = titles[view] || 'Gestão Sorveteria';
    }

    // Fechar sidebar no mobile
    if (window.innerWidth <= 1024) {
        document.getElementById('sidebar')?.classList.remove('open');
        document.getElementById('overlay')?.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Chamar função de render da view ativa
    const renderMap = {
        dashboard:   () => { if (typeof renderDashboard === 'function') renderDashboard(); },
        cashier:     () => { if (typeof renderCashierProducts === 'function') renderCashierProducts(); },
        production:  () => { if (typeof renderProduction === 'function') renderProduction(); if (typeof renderProductionSchedule === 'function') renderProductionSchedule(); },
        inventory:   () => { if (typeof renderInventory === 'function') renderInventory(); },
        products:    () => { if (typeof renderProductsCatalog === 'function') renderProductsCatalog(); },
        sales:       () => { if (typeof renderSales === 'function') renderSales(); },
        clients:     () => { if (typeof renderClients === 'function') renderClients(); },
        suppliers:   () => { if (typeof renderSuppliers === 'function') renderSuppliers(); },
        reports:     () => { if (typeof renderReports === 'function') renderReports(); },
        temperature: () => { if (typeof renderTemperature === 'function') renderTemperature(); },
        settings:    () => { if (typeof renderSettings === 'function') renderSettings(); },
        notifications: () => { if (typeof renderNotifications === 'function') renderNotifications(); },
    };
    if (renderMap[view]) renderMap[view]();
    if (viewElement && previousView !== viewElement.id) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (!sidebar || !overlay) return;

    sidebar.classList.toggle('open');
    overlay.classList.toggle('hidden');

    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}
