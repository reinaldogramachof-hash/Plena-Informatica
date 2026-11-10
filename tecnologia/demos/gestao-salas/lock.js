/**
 * Guardião de licença do Gestão Salas.
 * O modo offline só é liberado por um período limitado após validação no servidor.
 */
(function () {
    const LICENSE_KEY = 'salas_license';
    const EMAIL_KEY = 'salas_email';
    const DEVICE_KEY = 'salas_device';
    const RECEIPT_KEY = 'salas_receipt_confirmed';
    const LAST_VERIFIED_KEY = 'salas_last_verified_at';
    const OFFLINE_GRACE_MS = 7 * 24 * 60 * 60 * 1000;
    const SYSTEM_ID = 'gestao-salas';
    const API_URL = '../api_licenca_ml.php';

    function getOrCreateDeviceId() {
        let deviceId = localStorage.getItem(DEVICE_KEY);
        if (!deviceId) {
            deviceId = 'salas_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now().toString(36);
            localStorage.setItem(DEVICE_KEY, deviceId);
        }
        return deviceId;
    }

    function canUseOfflineGrace(now = Date.now()) {
        const lastVerifiedAt = Number(localStorage.getItem(LAST_VERIFIED_KEY));
        return Number.isFinite(lastVerifiedAt) && lastVerifiedAt > 0 && now - lastVerifiedAt <= OFFLINE_GRACE_MS;
    }

    function markVerifiedNow() {
        localStorage.setItem(LAST_VERIFIED_KEY, String(Date.now()));
    }

    async function checkStatus() {
        unlockSystem();
        return;
    }

    function redirectToLogin(message) {
        const login = document.getElementById('view-login');
        if (login) {
            login.classList.remove('hide');
            login.style.display = 'flex';
            const messageElement = login.querySelector('p.text-slate-500, p.subtitle, .login-subtitle');
            if (messageElement) messageElement.textContent = message;
        }
        hideApp();
    }

    function blockSystem(titleText, messageText) {
        const login = document.getElementById('view-login');
        if (login) {
            login.classList.remove('hide');
            login.style.display = 'flex';
            const title = login.querySelector('h3, h2');
            const message = login.querySelector('p.text-slate-500, p.subtitle, .login-subtitle');
            const button = login.querySelector("button[type='submit'], #btn-activate");
            if (title) title.textContent = titleText;
            if (message) message.textContent = messageText;
            if (button) button.textContent = 'Já comprei (Ativar)';
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
            login.style.display = 'none';
        }
        const sidebar = document.getElementById('sidebar');
        const main = document.querySelector('main');
        const header = document.querySelector('header');
        if (sidebar) sidebar.style.display = '';
        if (main) main.style.display = '';
        if (header) header.style.display = '';
    }

    function showTrialBanner(expirationDate) {
        document.getElementById('trial-banner')?.remove();
        const remainingHours = Math.ceil((new Date(expirationDate) - new Date()) / (1000 * 60 * 60));
        if (remainingHours <= 0) return;

        const banner = document.createElement('div');
        banner.id = 'trial-banner';
        banner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#f97316;color:white;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:bold;z-index:9999;box-shadow:0 4px 15px rgba(0,0,0,.2);pointer-events:none';
        banner.textContent = `Teste grátis: restam ${remainingHours}h`;
        document.body.appendChild(banner);
    }

    document.addEventListener('DOMContentLoaded', checkStatus);
    setInterval(() => {
        if (document.visibilityState === 'visible') checkStatus();
    }, 5 * 60 * 1000);
})();
