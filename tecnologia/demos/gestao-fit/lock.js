/**
 * Lock.js - Guardião de Segurança V12.1 (Receipt + Trial + Email Capture)
 * Padrão ML Factory - Confirm Receipt System
 */
(function () {
    const LICENSE_KEY = 'fit_license';
    const EMAIL_KEY = 'fit_email';
    const scriptURL = new URL(document.currentScript?.src || './lock.js', location.href);
    const API_URL = new URL(scriptURL.pathname.includes('/sistemas/gestao-fit/') ? '../../api_licenca_ml.php' : '../api_licenca_ml.php', scriptURL).href;
    const SYSTEM = 'gestao-fit';
    let checking = false;

    async function request(action, payload) {
        const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 15000);
        try {
            const response = await fetch(API_URL + '?action=' + action, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, system_id: SYSTEM }), signal: controller.signal
            });
            if (!response.ok) throw new Error('Não foi possível consultar o serviço de licenças.');
            return await response.json();
        } finally { clearTimeout(timeout); }
    }
    function remember(key, data, email, device) {
        const changed = getLocalLicense() !== key;
        if(changed)localStorage.removeItem('fit_receipt_confirmed');
        localStorage.setItem(LICENSE_KEY,key);
        localStorage.setItem('fit_verified_license',key);
        localStorage.removeItem('fit_license_blocked');
        if(email)localStorage.setItem(EMAIL_KEY,email);
        if(device)localStorage.setItem('fit_device',device);
        if(data.expiration_date)localStorage.setItem('fit_license_expiration',data.expiration_date);
        else localStorage.removeItem('fit_license_expiration');
        localStorage.setItem('fit_is_trial',data.is_trial?'true':'false');
    }
    function valid(data) { return data.status === 'success' && ['active','trial'].includes(data.license_status || 'active'); }
    function offlineAllowed() {
        const key=getLocalLicense(),expiration=localStorage.getItem('fit_license_expiration');
        if(!key || localStorage.getItem('fit_verified_license')!==key || localStorage.getItem('fit_license_blocked')===key || localStorage.getItem('fit_receipt_confirmed')!==key)return false;
        if(localStorage.getItem('fit_is_trial')==='true'&&!expiration)return false;
        return !expiration || Number.isFinite(Date.parse(expiration)) && Date.parse(expiration)>Date.now();
    }
    function receiptOrUnlock() {
        if(localStorage.getItem('fit_receipt_confirmed')!==getLocalLicense()){
            hideApp();document.getElementById('view-login')?.classList.add('hide');
            document.getElementById('welcome-receipt-modal')?.classList.remove('hidden');
        } else {document.getElementById('welcome-receipt-modal')?.classList.add('hidden');unlockSystem();}
    }

    function getLocalLicense() {
        return localStorage.getItem(LICENSE_KEY);
    }

    async function checkStatus() {
        unlockSystem();
        return;
    }

    async function activate(key,email) {
        const device=localStorage.getItem('fit_device')||('fit_'+crypto.randomUUID());
        const data=await request('activate',{license_key:key,email,device_id:device});
        if(!valid(data))throw new Error(data.message||'Não foi possível ativar a licença do Gestão Fit.');
        remember(key,data,email,device);receiptOrUnlock();return data;
    }
    async function confirmReceipt() {
        const key=getLocalLicense();
        if(!key||localStorage.getItem('fit_verified_license')!==key)throw new Error('Confira a licença antes de confirmar o recebimento.');
        const data=await request('confirm_receipt',{license_key:key,email:localStorage.getItem(EMAIL_KEY)||'',legal_agree:true});
        if(data.status!=='success')throw new Error(data.message||'Não foi possível registrar a confirmação.');
        localStorage.setItem('fit_receipt_confirmed',key);receiptOrUnlock();
    }
    window.FitLicense={checkStatus,activate,confirmReceipt,offlineAllowed,endpoint:API_URL};

    // --- UI HELPERS ---

    function redirectToLogin(msg) {
        document.getElementById('welcome-receipt-modal')?.classList.add('hidden');
        const login = document.getElementById('view-login');
        if (login) {
            login.classList.remove('hide');
            login.style.display = 'flex';
            const msgEl = login.querySelector('p.text-slate-500, p.subtitle, .login-subtitle, p.text-zinc-400');
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
                p.innerHTML = `${msgText}<br><br><a href="../loja/checkout.html" class="text-blue-600 font-bold underline">COMPRAR VERSÃO VITALÍCIA</a>`;
            }
            if (btn) btn.innerText = "Já comprei (Ativar)";
        }
        hideApp();
    }

    function hideApp() {
        window.fitLicenseReady = false;
        document.dispatchEvent(new Event('fit-license-locked'));
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
            login.classList.add('hide', 'hidden');
            login.style.display = 'none';
        }
        const receipt = document.getElementById('welcome-receipt-modal');
        if (receipt) {
            receipt.classList.add('hide', 'hidden');
            receipt.style.display = 'none';
        }
        const sidebar = document.getElementById('sidebar');
        const main = document.querySelector('main');
        const header = document.querySelector('header');
        if (sidebar) sidebar.style.display = '';
        if (main) main.style.display = '';
        if (header) header.style.display = '';
        window.fitLicenseReady = true;
        document.dispatchEvent(new Event('fit-license-unlocked'));
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
