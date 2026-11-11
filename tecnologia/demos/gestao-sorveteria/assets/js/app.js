// ============================================================
// app.js — Bootloader e Event Listeners Globais
// Gestão Sorveteria & Açaí Pro
// ============================================================

// --- LICENCIAMENTO ---
const LICENSE_DATA = {
    active: false,
    businessName: "",
    ownerName: "",
    ownerDoc: ""
};

function notifyUser(message, type = 'info') {
    if (typeof showNotification === 'function') {
        showNotification(message, type);
    } else {
        console[type === 'error' ? 'error' : 'log'](message);
    }
}

// --- VALIDAÇÃO DE DOCUMENTOS (CPF/CNPJ) ---
(function () {
    const validateDoc = (val) => {
        if (!val) return true;
        const str = val.replace(/\D/g, '');

        if (str.length === 11) {
            if (/^(\d)\1+$/.test(str)) return false;
            let sum = 0, remainder;
            for (let i = 1; i <= 9; i++) sum += parseInt(str.substring(i - 1, i)) * (11 - i);
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(str.substring(9, 10))) return false;
            sum = 0;
            for (let i = 1; i <= 10; i++) sum += parseInt(str.substring(i - 1, i)) * (12 - i);
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(str.substring(10, 11))) return false;
            return true;
        }

        if (str.length === 14) {
            if (/^(\d)\1+$/.test(str)) return false;
            let size = str.length - 2;
            let numbers = str.substring(0, size);
            const digits = str.substring(size);
            let sum = 0, pos = size - 7;
            for (let i = size; i >= 1; i--) {
                sum += numbers.charAt(size - i) * pos--;
                if (pos < 2) pos = 9;
            }
            let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
            if (result != digits.charAt(0)) return false;
            size = size + 1;
            numbers = str.substring(0, size);
            sum = 0; pos = size - 7;
            for (let i = size; i >= 1; i--) {
                sum += numbers.charAt(size - i) * pos--;
                if (pos < 2) pos = 9;
            }
            result = sum % 11 < 2 ? 0 : 11 - sum % 11;
            if (result != digits.charAt(1)) return false;
            return true;
        }
        return false;
    };

    window.Security = { check: validateDoc };
})();

// --- TERMOS DE USO ---
function confirmTerms() {
    if (!confirm('Tem certeza que leu e concorda com todos os termos apresentados?')) return;
    db.settings.termsAccepted = true;
    db.settings.termsAcceptedAt = new Date().toISOString();
    save();
    if (typeof updateTermsVisuals === 'function') updateTermsVisuals();
    notifyUser('Obrigado! Seu aceite foi registrado com sucesso.', 'success');
}

// --- UTILITÁRIO DE MODAL ---
function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

// --- PWA INSTALL PROMPT ---
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const slot = document.getElementById('pwa-install-slot');
    const btn = document.createElement('button');
    btn.id = 'pwa-install-button';
    btn.className = 'flex items-center gap-1.5 px-3 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-dark transition-all active:scale-95';
    btn.innerHTML = '<i data-lucide="download" class="w-4 h-4"></i><span>Instalar App</span>';
    btn.onclick = () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            btn.remove();
            if (slot) slot.classList.add('hidden');
        });
    };
    if (slot) {
        slot.innerHTML = '';
        slot.appendChild(btn);
        slot.classList.remove('hidden');
    } else {
        document.body.appendChild(btn);
    }
    if (window.lucide) lucide.createIcons();
});

// --- DETECÇÃO DE IFRAME ---
if (window.self !== window.top) {
    if (document.body) {
        document.body.classList.add('in-iframe');
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            if (document.body) document.body.classList.add('in-iframe');
        });
    }
}

// --- ATIVAÇÃO DE LICENÇA V12.1 ---
window.activateLicense = async function (e) {
    if (e) e.preventDefault();

    const keyInput = document.getElementById('license-key');
    const emailInput = document.getElementById('license-email');
    const btn = document.getElementById('btn-activate');

    if (!keyInput || !emailInput) return;

    const key = keyInput.value.trim();
    const email = emailInput.value.trim();

    if (!key || !email) { notifyUser('Por favor, preencha todos os campos.', 'error'); return; }

    // Master Keys (Testes / Admin)
    const MASTER_KEYS = [
        String.fromCharCode(77,65,83,84,69,82,49,50,51),
        String.fromCharCode(65,68,77,73,78,95,77,76),
        String.fromCharCode(84,69,83,84,69,50,48,50,54)
    ];

    if (MASTER_KEYS.includes(key.toUpperCase())) {
        localStorage.setItem('sorveteria_license', key);
        localStorage.setItem('sorveteria_email', email);
        localStorage.setItem('sorveteria_master_mode', 'true');
        localStorage.setItem('sorveteria_receipt_confirmed', 'true');
        if (btn) btn.innerText = 'Acesso Liberado...';
        setTimeout(() => {
            notifyUser('Modo Admin/Teste ativado!', 'success');
            window.location.reload();
        }, 500);
        return;
    }

    // Fluxo padrão via API
    if (btn) { btn.innerText = 'Verificando...'; btn.disabled = true; }

    try {
        const output = document.getElementById('activation-error');
        if (output) output.classList.add('hidden');

        let deviceId = localStorage.getItem('sorveteria_device');
        if (!deviceId) {
            deviceId = 'dev_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
            localStorage.setItem('sorveteria_device', deviceId);
        }

        const response = await fetch('../api_licenca_ml.php?action=activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // system_id: identidade do produto; o servidor recusa chave de outro sistema.
            body: JSON.stringify({ license_key: key, email, device_id: deviceId, system_id: 'gestao-sorveteria' })
        });

        const data = await response.json();

        if (data.status === 'success') {
            localStorage.setItem('sorveteria_license', key);
            localStorage.setItem('sorveteria_email', email);
            localStorage.removeItem('sorveteria_master_mode');

            if (!localStorage.getItem('sorveteria_receipt_confirmed')) {
                const loginView = document.getElementById('view-login');
                if (loginView) { loginView.classList.add('hide'); loginView.style.display = 'none'; }
                const receiptModal = document.getElementById('welcome-receipt-modal');
                if (receiptModal) receiptModal.classList.remove('hidden');
                if (window.lucide) lucide.createIcons();
            } else {
                notifyUser('Licença ativada com sucesso!', 'success');
                window.location.reload();
            }
        } else {
            if (data.status === 'expired') {
                const output = document.getElementById('activation-error');
                if (output) {
                    output.innerHTML = '<div style="text-align:center;padding:10px 0"><p style="font-weight:bold;color:#dc2626;margin-bottom:6px">Período de teste encerrado.</p><p style="font-size:13px;color:#475569;margin-bottom:0">Para continuar usando o sistema sem perder seus dados locais, solicite a licença vitalícia pelo mesmo canal onde iniciou seu teste ou realizou a compra.</p></div>';
                    output.classList.remove('hidden');
                } else {
                    notifyUser('Período de teste encerrado. Para continuar usando o sistema sem perder seus dados locais, solicite a licença vitalícia pelo mesmo canal onde iniciou seu teste ou realizou a compra.', 'error');
                }
            } else {
                const msg = data.message || 'Chave inválida ou erro no servidor.';
                const output = document.getElementById('activation-error');
                if (output) { output.textContent = msg; output.classList.remove('hidden'); }
                else notifyUser('Erro: ' + msg, 'error');
            }
        }
    } catch (err) {
        console.error(err);
        notifyUser('Erro de conexão com o servidor de validação.', 'error');
    } finally {
        if (btn) { btn.innerText = 'Ativar Licença'; btn.disabled = false; }
    }
};

// --- CONFIRMAÇÃO DE RECIBO (ML COMPRA GARANTIDA) ---
window.confirmReceipt = async function () {
    const btn = document.getElementById('btn-confirm-receipt');
    if (btn) { btn.innerText = 'Registrando...'; btn.disabled = true; }

    const key = localStorage.getItem('sorveteria_license');
    const email = localStorage.getItem('sorveteria_email') || '';

    try {
        const response = await fetch('../api_licenca_ml.php?action=confirm_receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ license_key: key, email, legal_agree: true })
        });

        const data = await response.json();

        if (data.status === 'success') {
            localStorage.setItem('sorveteria_receipt_confirmed', 'true');
            const modal = document.getElementById('welcome-receipt-modal');
            if (modal) modal.classList.add('hidden');
            notifyUser('Recebimento confirmado! Bem-vindo ao sistema.', 'success');
            window.location.reload();
        } else {
            notifyUser('Atenção: não foi possível registrar o recibo. Erro: ' + (data.message || 'Falha de comunicação.'), 'error');
            if (btn) { btn.disabled = false; btn.innerText = 'Tentar Novamente'; }
        }
    } catch (e) {
        notifyUser('Erro de conexão. Tente novamente.', 'error');
        if (btn) { btn.disabled = false; btn.innerText = 'Confirmar Recebimento e Acesso'; }
    }
};

// --- INICIALIZAÇÃO DO APLICATIVO ---
function init() {
    if (window.lucide) lucide.createIcons();
    restoreSidebarState();

    const _now = new Date();
    const dateEl = document.getElementById('current-date');
    if (dateEl) dateEl.textContent = `${String(_now.getDate()).padStart(2,'0')}/${String(_now.getMonth()+1).padStart(2,'0')}/${_now.getFullYear()}`;
    if (typeof updateTime === 'function') updateTime();

    initPdvDraft();
    initPdvUX();
    initProductUX();
    initSorveteriaManagement();
    showSorveteriaSetup();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(() => notifyUser('Não foi possível preparar o acesso sem internet. Reabra o sistema com conexão.', 'warning'));
    }

    // Renderizar estado inicial
    router('dashboard');
    if (typeof startFreezerReminder === 'function') startFreezerReminder();
    if (typeof renderFreezerLog === 'function') renderFreezerLog();
    if (typeof updateDataStatus === 'function') updateDataStatus();
    if (typeof updateTutorialProgress === 'function') updateTutorialProgress();
    if (typeof loadChecklistState === 'function') loadChecklistState();
    if (typeof updateTermsVisuals === 'function') updateTermsVisuals();

    // Intervalos de atualização
    if (typeof updateTime === 'function') setInterval(updateTime, 60000);

}

function showSorveteriaSetup() {
    if (databaseLoadError) {
        notifyUser('Os dados locais não puderam ser lidos. Eles foram preservados. Restaure um backup válido em Configurações.', 'error');
        return;
    }
    if (DB_KEY === DEMO_DB_KEY) {
        const banner = document.createElement('div');
        banner.className = 'p-3 bg-amber-50 text-amber-800 text-sm flex flex-wrap items-center justify-between gap-2';
        banner.innerHTML = '<strong>Demonstração — estes dados estão separados da sua operação.</strong><button onclick="leaveSorveteriaDemo()" class="px-3 py-2 rounded-lg border font-bold">Voltar aos meus dados</button>';
        document.querySelector('main')?.prepend(banner);
        return;
    }
    if (db.settings.setupComplete) return;
    const modal = document.createElement('div');
    modal.id = 'sorveteria-setup';
    modal.className = 'fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Começar a usar a sorveteria');
    modal.innerHTML = `<div class="bg-white text-gray-800 rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 class="text-xl font-bold">Como deseja começar?</h2>
        <p class="text-sm">Cadastre seus produtos ou conheça o sistema com exemplos separados dos seus dados.</p>
        <button onclick="startSorveteriaOperation()" class="w-full py-3 rounded-lg bg-brand-primary text-white font-bold">Começar minha sorveteria</button>
        <button onclick="startSorveteriaDemo()" class="w-full py-3 rounded-lg border font-bold">Conhecer com exemplos</button>
    </div>`;
    document.body.appendChild(modal);
}
function startSorveteriaOperation() {
    try {
        const next = JSON.parse(JSON.stringify(db));
        next.settings.setupComplete = true;
        persistDatabase(next);
        document.getElementById('sorveteria-setup')?.remove();
        router('products');
    } catch (error) { notifyUser(error.message, 'error'); }
}
function startSorveteriaDemo() {
    try {
        if (!localStorage.getItem(DEMO_DB_KEY)) {
            const demo = normalizeDatabase(null);
            demo.settings.setupComplete = true;
            demo.settings.companyName = 'Sorveteria Demonstração';
            demo.products = JSON.parse(JSON.stringify(defaultDB.defaultProducts));
            demo.freezers = [{ id: 'demo-freezer', name: 'Freezer de exemplo', idealTemp: -18, currentTemp: null, status: 'sem-leitura' }];
            localStorage.setItem(DEMO_DB_KEY, JSON.stringify(demo));
        }
        sessionStorage.setItem('sorveteria_demo', 'true');
        location.reload();
    } catch (error) { notifyUser('Não foi possível abrir a demonstração. ' + error.message, 'error'); }
}
function leaveSorveteriaDemo() {
    sessionStorage.removeItem('sorveteria_demo');
    location.reload();
}


// --- SIDEBAR COLLAPSE (DESKTOP) ---
function toggleSidebarCollapse() {
    const sidebar = document.getElementById('sidebar');
    const isCollapsed = sidebar.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebar_collapsed', isCollapsed ? 'true' : 'false');
}

// Restaurar estado do colapso ao iniciar
function restoreSidebarState() {
    if (localStorage.getItem('sidebar_collapsed') === 'true') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.add('sidebar-collapsed');
    }
}

document.addEventListener('DOMContentLoaded', init);
