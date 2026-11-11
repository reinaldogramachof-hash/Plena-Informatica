/**
 * demo-bypass.js — Plena MicroSaaS • Gestão PDV Pro
 * Desbloqueia o app em modo demonstração, assegura tema claro inicial
 * e posiciona a faixa de demonstração sem cobrir a barra lateral ou o topo.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Gestão PDV Pro';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Gestão PDV Pro. Gostaria de saber mais sobre a licença vitalícia e implantação.';
    var DB_KEY = 'gestao_pdv_v1';
    var THEME_KEY = 'pdv_theme_preference';
    var SESSION_BOOT_KEY = 'plena_pdv_demo_theme_booted';

    // 1. Assegurar credenciais no localStorage síncrono
    try {
        localStorage.setItem('pdv_license', 'DEMO-PLENA-VITALICIA');
        localStorage.setItem('pdv_email', 'demo@plenainformatica.com.br');
        localStorage.setItem('pdv_receipt_confirmed', 'true');
        localStorage.setItem('pdv_last_verified_at', String(Date.now()));
    } catch (e) {}

    // Inicia sempre no tema claro na entrada da sessão da demo; permite alternar para escuro durante a visita
    try {
        if (!sessionStorage.getItem(SESSION_BOOT_KEY)) {
            localStorage.removeItem(THEME_KEY);
            sessionStorage.setItem(SESSION_BOOT_KEY, '1');
        }
        if (!localStorage.getItem(THEME_KEY)) {
            document.documentElement.classList.remove('dark');
        }
    } catch (e) {
        document.documentElement.classList.remove('dark');
    }

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    }, true);

    // 2. Semeadura de dados no banco local
    function seedPdvData() {
        if (!window.PDV_DEMO_SEED) return;
        var existing = null;
        try {
            existing = localStorage.getItem(DB_KEY);
        } catch (e) {}

        if (!existing || existing === '{}' || existing === 'null') {
            try {
                localStorage.setItem(DB_KEY, JSON.stringify(window.PDV_DEMO_SEED));
            } catch (e) {}
        }
    }

    seedPdvData();

    function openWhatsApp() {
        window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Deseja resetar as alterações e recarregar os dados do Mercado & Empório Central?')) return;
        try {
            localStorage.removeItem(DB_KEY);
            localStorage.removeItem(THEME_KEY);
            sessionStorage.removeItem(SESSION_BOOT_KEY);
        } catch (e) {}
        location.reload();
    }

    function syncBannerOffset(banner) {
        if (!banner) return;
        var h = Math.max(38, Math.ceil(banner.getBoundingClientRect().height));
        document.documentElement.style.setProperty('--plena-demo-banner-h', h + 'px');
    }

    function injectDemoLayer() {
        if (!document.getElementById('plena-demo-layout-style')) {
            var style = document.createElement('style');
            style.id = 'plena-demo-layout-style';
            style.textContent = [
                'body.plena-demo-has-banner { padding-top: var(--plena-demo-banner-h, 40px); }',
                'body.plena-demo-has-banner .sidebar { top: var(--plena-demo-banner-h, 40px); height: calc(100vh - var(--plena-demo-banner-h, 40px)); }',
                'body.plena-demo-has-banner .app-header { top: var(--plena-demo-banner-h, 40px); }'
            ].join('\n');
            document.head.appendChild(style);
        }

        if (!document.getElementById('plena-demo-banner')) {
            var banner = document.createElement('div');
            banner.id = 'plena-demo-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#112921;border-bottom:1px solid rgba(52,211,153,0.28);color:#ecfdf5;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 10px rgba(17,41,33,.2);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#10b981;"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • Mercado &amp; Empório Central</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:#059669;color:#ffffff;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;transition:background 0.2s;">Gostei, falar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.25);background:transparent;color:#d1fae5;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar dados</button>';
            document.body.prepend(banner);
            document.body.classList.add('plena-demo-has-banner');
            syncBannerOffset(banner);

            if (typeof ResizeObserver === 'function') {
                new ResizeObserver(function () { syncBannerOffset(banner); }).observe(banner);
            } else {
                window.addEventListener('resize', function () { syncBannerOffset(banner); });
            }

            document.getElementById('plena-demo-cta').addEventListener('click', openWhatsApp);
            document.getElementById('plena-demo-reset').addEventListener('click', resetDemo);
        }
    }

    // Reidratação automática de ícones Lucide em alterações dinâmicas do DOM
    if (typeof MutationObserver !== 'undefined') {
        var _iconObserverTimer = null;
        var _iconObserver = new MutationObserver(function () {
            if (_iconObserverTimer) return;
            _iconObserverTimer = setTimeout(function () {
                _iconObserverTimer = null;
                if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
                    if (document.querySelector('i[data-lucide], span[data-lucide]')) {
                        try { lucide.createIcons(); } catch (e) {}
                    }
                }
            }, 35);
        });
        document.addEventListener('DOMContentLoaded', function () {
            if (document.body) {
                _iconObserver.observe(document.body, { childList: true, subtree: true });
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        seedPdvData();
        injectDemoLayer();
    });
})();
