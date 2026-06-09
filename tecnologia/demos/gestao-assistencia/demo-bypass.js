/**
 * demo-bypass.js — Plena MicroSaaS • Gestão Assistência
 * Libera o app em modo demonstração e adiciona uma camada comercial guiada.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Assistência Pro';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Assistência Pro. Gostaria de saber planos e implantação.';
    window.PLENA_DEMO_WHATSAPP = WHATSAPP_PHONE;

    localStorage.setItem('assistencia_license', 'DEMO-PLENA-2026');
    localStorage.setItem('assistencia_email', 'demo@plena.app');

    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); }, true);

    function unlock() {
        var login = document.getElementById('view-login');
        if (login) { login.style.display = 'none'; login.classList.add('hidden'); }

        var appMain = document.getElementById('app-main-content');
        if (appMain) { appMain.style.display = ''; appMain.classList.remove('hidden', 'hide'); }

        var sidebar = document.getElementById('sidebar');
        if (sidebar) { sidebar.style.display = ''; sidebar.classList.remove('hide', 'hidden'); }

        var header = document.getElementById('main-header') || document.querySelector('header');
        if (header) { header.style.display = ''; header.classList.remove('hide', 'hidden'); }

        var receiptModal = document.getElementById('welcome-receipt-modal');
        if (receiptModal) receiptModal.classList.add('hidden');

        ['install-btn', 'pwa-install-btn'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) { el.style.display = 'none'; el.classList.add('hidden'); el.classList.remove('flex'); }
        });
    }

    function openWhatsApp() {
        window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Resetar os dados ficticios desta demonstração?')) return;
        localStorage.clear();
        location.reload();
    }

    function injectDemoLayer() {
        if (!document.getElementById('plena-demo-banner')) {
            var banner = document.createElement('div');
            banner.id = 'plena-demo-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#0f172a;color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;text-align:center;padding:7px 12px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 2px 10px rgba(0,0,0,.35)';
            banner.innerHTML = '<span>Modo demonstração • ' + DEMO_PRODUCT + ' • dados ficticios</span><button id="plena-demo-cta" type="button" style="border:0;background:#22c55e;color:#052e16;border-radius:999px;padding:6px 10px;font-weight:900;cursor:pointer">Gostei, chamar no WhatsApp</button><button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff;border-radius:999px;padding:5px 9px;font-weight:800;cursor:pointer">Resetar demo</button>';
            document.body.prepend(banner);
            document.body.style.paddingTop = '42px';
            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }

        if (!document.getElementById('plena-demo-guide')) {
            var guide = document.createElement('div');
            guide.id = 'plena-demo-guide';
            guide.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:999998;max-width:320px;background:#020617;color:#e5e7eb;border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:16px;box-shadow:0 18px 60px rgba(0,0,0,.38);font-family:Inter,system-ui,sans-serif';
            guide.innerHTML = '<button type="button" aria-label="Fechar" style="position:absolute;top:8px;right:10px;background:transparent;border:0;color:#94a3b8;font-size:18px;cursor:pointer" onclick="this.parentElement.remove()">x</button><strong style="display:block;color:#fff;margin-bottom:8px">Roteiro rápido do demo</strong><ol style="margin:0;padding-left:18px;font-size:13px;line-height:1.55;color:#cbd5e1"><li>Abra uma ordem de serviço e confira o fluxo.</li><li>Veja estoque, peças e PDV.</li><li>Confira clientes, recibos e relatorios.</li></ol>';
            document.body.appendChild(guide);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        unlock();
        var tries = 0;
        var guard = setInterval(function () {
            unlock();
            if (++tries >= 20) clearInterval(guard);
        }, 100);
        injectDemoLayer();
    });
})();


