/**
 * Lock.js - Guardião de Segurança V12.1 (Receipt + Trial + Email Capture)
 * Padrão ML Factory - Confirm Receipt System
 */
(function () {
    // Namespace proprio: localStorage e por ORIGEM, nao por caminho, e todos os
    // sistemas dividem sistemasdegestao.tech. As chaves genericas usadas antes
    // (plena_license, ml_license_email) colidem com Barbearia e Beleza - o lock.js
    // da Barbearia inclusive ADOTA plena_license quando barbearia_license nao existe.
    // Sem migracao de chave legada: o Odonto nunca foi publicado, nao ha dado de
    // cliente a migrar, e migrar reintroduziria a colisao.
    const LICENSE_KEY = 'odonto_license';
    const EMAIL_KEY = 'odonto_email';
    const DEVICE_KEY = 'odonto_device';
    const RECEIPT_KEY = 'odonto_receipt_confirmed';
    const MASTER_KEY = 'odonto_master_mode';
    const SYSTEM_ID = 'gestao-odonto';
    const API_URL = '../api_licenca_ml.php';

    function getLocalLicense() {
        return localStorage.getItem(LICENSE_KEY);
    }

    function getOrCreateDeviceId() {
        let deviceId = localStorage.getItem(DEVICE_KEY);
        if (!deviceId) {
            deviceId = 'dev_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
            localStorage.setItem(DEVICE_KEY, deviceId);
        }
        return deviceId;
    }

    async function checkStatus() {
        // --- MASTER PASSWORD BYPASS ---
        if (localStorage.getItem(MASTER_KEY) === 'true') {
            unlockSystem();
            console.log('Master Mode Enabled - API Check Skipped');
            return;
        }

        const key = getLocalLicense();

        if (!key) {
            redirectToLogin("Ative sua licença para continuar.");
            return;
        }

        try {
            const res = await fetch(API_URL + '?action=verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // device_id: sem ele o travamento por aparelho nao funciona.
                // system_id: o servidor recusa chave emitida para outro sistema.
                body: JSON.stringify({
                    license_key: key,
                    email: localStorage.getItem(EMAIL_KEY) || '',
                    device_id: getOrCreateDeviceId(),
                    system_id: SYSTEM_ID
                })
            });
            const data = await res.json();

            if (data.status === 'success') {
                if (data.license_status === 'expired') {
                    blockSystem("Período de teste encerrado.", "Para continuar usando o sistema sem perder seus dados locais, solicite a licença vitalícia pelo mesmo canal onde iniciou seu teste ou realizou a compra.");
                } else if (data.license_status === 'blocked') {
                    blockSystem("Licença Bloqueada", "Entre em contato com o suporte.");
                } else {
                    // ATIVO ou TRIAL VÁLIDO
                    if (!localStorage.getItem(RECEIPT_KEY) && localStorage.getItem(MASTER_KEY) !== 'true') {
                        hideApp();
                        const login = document.getElementById('view-login');
                        if (login) login.style.display = 'none';
                        const receiptModal = document.getElementById('welcome-receipt-modal');
                        if (receiptModal) receiptModal.classList.remove('hidden');
                    } else {
                        unlockSystem();
                        if (data.is_trial && data.expiration_date) {
                            showTrialBanner(data.expiration_date);
                        }
                    }
                }
            } else {
                redirectToLogin("Licença inválida ou não encontrada.");
            }

        } catch (e) {
            console.warn("Erro ao verificar licença (offline?):", e);
            // Fail-open se já tem chave local (evita bloquear usuários offline)
            if (key) unlockSystem();
        }
    }

    // --- UI HELPERS ---

    function redirectToLogin(msg) {
        const login = document.getElementById('view-login');
        if (login) {
            login.classList.remove('hide');
            login.style.display = 'flex';
            const msgEl = login.querySelector('p.text-slate-500, p.subtitle, .login-subtitle');
            if (msgEl) msgEl.innerText = msg;
        }
        hideApp();
    }

    function blockSystem(titleText, msgText) {
        const login = document.getElementById('view-login');
        if (login) {
            login.classList.remove('hide');
            login.style.display = 'flex';

            const h3 = login.querySelector('h3, h2');
            const p = login.querySelector('p.text-slate-500, p.subtitle, .login-subtitle');
            const btn = login.querySelector("button[type='submit'], #btn-activate");

            if (h3) h3.innerText = titleText;
            if (p) {
                p.innerText = msgText;
            }
            if (btn) btn.innerText = "Já comprei (Ativar)";
        }
        hideApp();
    }

    function hideApp() {
        const sidebar = document.getElementById('sidebar');
        const main = document.querySelector('main');
        const header = document.querySelector('header');
        if (sidebar) sidebar.style.display = 'none';
        if (main) main.style.display = 'none';
        if (header) header.style.display = 'none';
    }

    function unlockSystem() {
        const login = document.getElementById('view-login');
        if (login) {
            login.classList.add('hide');
        }
        const sidebar = document.getElementById('sidebar');
        const main = document.querySelector('main');
        const header = document.querySelector('header');
        if (sidebar) sidebar.style.display = '';
        if (main) main.style.display = '';
        if (header) header.style.display = '';
    }

    function showTrialBanner(expDate) {
        const old = document.getElementById('trial-banner');
        if (old) old.remove();

        const exp = new Date(expDate);
        const now = new Date();
        const diffHrs = Math.ceil((exp - now) / (1000 * 60 * 60));

        if (diffHrs <= 0) return;

        const banner = document.createElement('div');
        banner.id = 'trial-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f97316;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            pointer-events: none;
        `;
        banner.innerHTML = `⏳ Teste Grátis: Restam ${diffHrs}h`;
        document.body.appendChild(banner);
    }

    // INIT
    document.addEventListener('DOMContentLoaded', checkStatus);
    setInterval(checkStatus, 5 * 60 * 1000);

})();
