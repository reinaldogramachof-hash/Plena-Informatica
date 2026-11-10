/**
 * Guardião de licença do Gestão Lava-Rápido — adaptado do mesmo padrão usado
 * no Gestão PDV/Gestão Salas (lock.js): licença vitalícia validada direto no
 * navegador contra ../api_licenca_ml.php, sem backend próprio. Um período de
 * tolerância offline evita bloquear a operação por falha momentânea de rede.
 */
(function () {
  const LICENSE_KEY = 'lavarapido_license';
  const EMAIL_KEY = 'lavarapido_email';
  const DEVICE_KEY = 'lavarapido_device';
  const LAST_VERIFIED_KEY = 'lavarapido_last_verified_at';
  const OFFLINE_GRACE_MS = 7 * 24 * 60 * 60 * 1000;
  const SYSTEM_ID = 'gestao-lavarapido';
  const API_URL = '../api_licenca_ml.php';
  // Ativação única do add-on SaaS: quando a licença vitalícia foi emitida
  // junto com uma licença SaaS (api_provisioning.php:
  // issueCompanionLavarapidoLifetimeLicense), o backend devolve essas duas
  // chaves em TODO verify/activate (o campo não expira). Gravamos aqui como
  // "pendente" porque o app (operationalData/api()) só fica disponível
  // depois do boot — quem consome e limpa isso é
  // dist/online.js:applyPendingSaasBundle(). O guard em APPLIED_ONCE_KEY
  // garante que isso só acontece UMA vez por dispositivo: sem ele, a
  // verificação periódica (a cada 5 min, ver setInterval no fim deste
  // arquivo) re-gravaria o pendente pra sempre, desfazendo silenciosamente
  // o dono limpar o campo em Configurações pra desativar o add-on.
  const PENDING_SAAS_KEY = 'lavarapido_pending_saas_key';
  const PENDING_SAAS_SLUG = 'lavarapido_pending_saas_slug';
  const APPLIED_ONCE_KEY = 'lavarapido_saas_bundle_applied_once';
  function storePendingSaasBundle(data) {
    if (localStorage.getItem(APPLIED_ONCE_KEY) === '1') return;
    if (data && data.bundled_with_saas_license_key) {
      localStorage.setItem(PENDING_SAAS_KEY, data.bundled_with_saas_license_key);
      localStorage.setItem(PENDING_SAAS_SLUG, data.bundled_with_saas_tenant_slug || '');
    }
  }

  function getOrCreateDeviceId() {
    let deviceId = localStorage.getItem(DEVICE_KEY);
    if (!deviceId) {
      deviceId = 'lavarapido_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem(DEVICE_KEY, deviceId);
    }
    return deviceId;
  }
  function canUseOfflineGrace(now = Date.now()) {
    const lastVerifiedAt = Number(localStorage.getItem(LAST_VERIFIED_KEY));
    return Number.isFinite(lastVerifiedAt) && lastVerifiedAt > 0 && now - lastVerifiedAt <= OFFLINE_GRACE_MS;
  }
  function markVerifiedNow() { localStorage.setItem(LAST_VERIFIED_KEY, String(Date.now())); }

  function gateHtml(message) {
    const storedKey = localStorage.getItem(LICENSE_KEY) || '';
    const storedEmail = localStorage.getItem(EMAIL_KEY) || '';
    return `<section class="access-card"><div class="access-mark">${icon('drop')}</div><p class="eyebrow">GESTÃO LAVA-RÁPIDO</p><h1>Ativar licença vitalícia</h1><p>Informe a chave e o e-mail da compra para liberar este computador. O acesso desta edição é feito só por licença+e-mail; a rotina diária continua local, sem internet.</p><form onsubmit="LavarapidoLock.activate(event)"><div class="access-fields">${field('Chave de licença', 'licenseKey', storedKey, 'text', 'required autocomplete="off"')}${field('E-mail da compra', 'email', storedEmail, 'email', 'required autocomplete="email"')}</div><p class="error" id="access-error">${esc(message || '')}</p><button class="primary access-submit">Validar e continuar</button></form></section>`;
  }
  function showGate(message) {
    document.body.classList.add('access-mode');
    const sidebar = document.getElementById('sidebar'), header = document.getElementById('header'), mobile = document.getElementById('mobile'), main = document.getElementById('main');
    if (sidebar) sidebar.innerHTML = ''; if (header) header.innerHTML = ''; if (mobile) mobile.innerHTML = '';
    if (main) main.innerHTML = gateHtml(message);
  }
  function unlock() {
    document.body.classList.remove('access-mode');
    if (typeof window.bootLavarapidoApp === 'function') window.bootLavarapidoApp();
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

  async function checkStatus() {
    unlock();
    return;
  }

  async function activate(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.target));
    const key = String(form.licenseKey || '').trim(), email = String(form.email || '').trim().toLowerCase();
    const submit = event.target.querySelector('.access-submit');
    if (submit) { submit.disabled = true; submit.textContent = 'Validando…'; }
    try {
      const response = await fetch(API_URL + '?action=activate', {
        method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: key, email, device_id: getOrCreateDeviceId(), system_id: SYSTEM_ID }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.status !== 'success') throw new Error(data.message || 'Não foi possível validar esta licença.');
      localStorage.setItem(LICENSE_KEY, key);
      localStorage.setItem(EMAIL_KEY, email);
      storePendingSaasBundle(data);
      markVerifiedNow();
      unlock();
    } catch (error) {
      showGate(error.message || 'Não foi possível validar esta licença.');
    } finally {
      if (submit) { submit.disabled = false; submit.textContent = 'Validar e continuar'; }
    }
  }

  window.LavarapidoLock = { checkStatus, activate, showGate, deviceId: getOrCreateDeviceId };
  // Compatibilidade com o painel de licença em Configurações (operational-ui.js).
  window.LavaRapidoLicense = { render: () => localStorage.getItem(LICENSE_KEY) ? `<p class="muted">Licença vitalícia ativa neste computador (e-mail ${esc(localStorage.getItem(EMAIL_KEY) || '')}).</p>${badge('Licença vitalícia ativa', 'good')}<div class="form-actions"><button type="button" onclick="LavarapidoLock.checkStatus()">Verificar agora</button></div>` : '' };
  document.addEventListener('DOMContentLoaded', checkStatus);
  setInterval(() => { if (document.visibilityState === 'visible') checkStatus(); }, 5 * 60 * 1000);
}());
