/**
 * demo-bypass.js — Plena MicroSaaS • Gestão Lava-Rápido
 * Desbloqueia o app em modo demonstração, mantém o tema claro inicial
 * e posiciona a faixa de demonstração sem cobrir a barra lateral ou o topo.
 */
(function () {
    'use strict';

    var DEMO_PRODUCT = 'Gestão Lava-Rápido';
    var WHATSAPP_PHONE = '5512992191018';
    var WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Plena e testei a demonstração do Gestão Lava-Rápido. Gostaria de saber mais sobre a licença vitalícia e implantação.';
    var DB_KEY = 'gestao_lavarapido_v1';
    var APP_STATE_KEY = 'lava-app-v1';

    window.PLENA_DEMO_WHATSAPP = WHATSAPP_PHONE;

    // 1. Assegurar credenciais de bypass para contornar o lock.js
    try {
        localStorage.setItem('lavarapido_license', 'DEMO-PLENA-LAVARAPIDO-2026');
        localStorage.setItem('lavarapido_email', 'demo@plenainformatica.com.br');
        localStorage.setItem('lavarapido_last_verified_at', String(Date.now()));
    } catch (e) {}

    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); }, true);

    // Evita conflitos de ServiceWorker em modo iframe/demo
    if ('serviceWorker' in navigator && typeof navigator.serviceWorker.register === 'function') {
        var origRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
        navigator.serviceWorker.register = function () {
            return origRegister.apply(null, arguments).catch(function () {
                return { scope: './', unregister: function () { return Promise.resolve(true); } };
            });
        };
    }

    // Ajusta as datas da base fictícia para que "Hoje" coincida com a sessão atual do visitante
    function adjustSeedDates(seed) {
        if (!seed || !seed.orders) return seed;
        try {
            var now = new Date();
            var todayStr = now.toISOString().slice(0, 10);
            var refStr = '2026-10-21';
            var refDate = new Date(refStr + 'T12:00:00');
            var nowDate = new Date(todayStr + 'T12:00:00');
            var diffMs = nowDate.getTime() - refDate.getTime();
            var diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

            function shiftIso(isoStr) {
                if (!isoStr || typeof isoStr !== 'string') return isoStr;
                var d = new Date(isoStr);
                if (isNaN(d.getTime())) return isoStr;
                if (diffDays !== 0) d.setDate(d.getDate() + diffDays);
                return d.toISOString();
            }

            // Mantém as OS abertas de hoje dentro de janelas recentes realistas no pátio
            var nowMs = now.getTime();
            var minutesAgoMap = {
                1008: 14,
                1009: 21,
                1010: 27,
                1011: 46,
                1012: 68
            };

            if (Array.isArray(seed.orders)) {
                seed.orders.forEach(function (o) {
                    var offsetMin = minutesAgoMap[o.sequence];
                    if (offsetMin && o.stage !== 'entregue') {
                        var enteredIso = new Date(nowMs - offsetMin * 60000).toISOString();
                        o.enteredAt = enteredIso;
                        o.updatedAt = new Date(nowMs - Math.max(2, Math.floor(offsetMin / 2)) * 60000).toISOString();
                        if (o.paidAt) o.paidAt = new Date(nowMs - Math.max(1, offsetMin - 5) * 60000).toISOString();
                    } else {
                        if (o.enteredAt) o.enteredAt = shiftIso(o.enteredAt);
                        if (o.deliveredAt) o.deliveredAt = shiftIso(o.deliveredAt);
                        if (o.paidAt) o.paidAt = shiftIso(o.paidAt);
                        if (o.updatedAt) o.updatedAt = shiftIso(o.updatedAt);
                        if (o.cancelledAt) o.cancelledAt = shiftIso(o.cancelledAt);
                    }
                });
            }

            if (Array.isArray(seed.cashSessions)) {
                seed.cashSessions.forEach(function (cs) {
                    if (cs.status === 'open') {
                        cs.openedAt = new Date(nowMs - 115 * 60000).toISOString();
                    } else {
                        if (cs.openedAt) cs.openedAt = shiftIso(cs.openedAt);
                        if (cs.closedAt) cs.closedAt = shiftIso(cs.closedAt);
                    }
                });
            }

            if (Array.isArray(seed.cashTransactions)) {
                seed.cashTransactions.forEach(function (ct) {
                    if (String(ct.createdAt || '').indexOf(refStr) === 0) {
                        ct.createdAt = new Date(nowMs - 52 * 60000).toISOString();
                    } else if (ct.createdAt) {
                        ct.createdAt = shiftIso(ct.createdAt);
                    }
                });
            }

            if (Array.isArray(seed.orderHistory)) {
                seed.orderHistory.forEach(function (oh) {
                    if (oh.changedAt) oh.changedAt = shiftIso(oh.changedAt);
                });
            }

            if (Array.isArray(seed.checkins)) {
                seed.checkins.forEach(function (ci) {
                    if (ci.receivedAt) ci.receivedAt = shiftIso(ci.receivedAt);
                    if (ci.updatedAt) ci.updatedAt = shiftIso(ci.updatedAt);
                });
            }

            if (Array.isArray(seed.deliveries)) {
                seed.deliveries.forEach(function (d) {
                    if (d.checkedAt) d.checkedAt = shiftIso(d.checkedAt);
                });
            }
        } catch (err) {
            console.warn('Erro ao ajustar datas relativas da demo lava-rápido:', err);
        }
        return seed;
    }

    // 2. Prepara os dados da demonstração no localStorage
    function seedLavarapidoData() {
        var existing = null;
        try {
            var raw = localStorage.getItem(DB_KEY);
            if (raw) existing = JSON.parse(raw);
        } catch (e) { existing = null; }

        var isPopulated = existing && Array.isArray(existing.orders) && existing.orders.length > 0;
        if (!isPopulated && window.LAVARAPIDO_DEMO_SEED) {
            var seed = adjustSeedDates(JSON.parse(JSON.stringify(window.LAVARAPIDO_DEMO_SEED)));
            seed.settings = seed.settings || {};
            seed.settings.theme = 'light';
            localStorage.setItem(DB_KEY, JSON.stringify(seed));
        }
    }

    seedLavarapidoData();

    function applyPreferredDemoTheme() {
        var preferred = 'light';
        try {
            var rawApp = localStorage.getItem(APP_STATE_KEY);
            if (rawApp) {
                var parsed = JSON.parse(rawApp);
                if (parsed && parsed.settings && (parsed.settings.theme === 'dark' || parsed.settings.theme === 'light')) {
                    preferred = parsed.settings.theme;
                }
            }
        } catch (e) {}

        try {
            if (typeof state !== 'undefined' && state && state.settings) {
                state.settings.theme = preferred;
            }
        } catch (e) {}

        document.body.classList.toggle('light', preferred === 'light');
    }

    function openWhatsApp() {
        window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE), '_blank', 'noopener,noreferrer');
    }

    function resetDemo() {
        if (!confirm('Deseja resetar as alterações e recarregar os dados do Lava Rápido Estrela Azul?')) return;
        try {
            localStorage.removeItem(DB_KEY);
            localStorage.removeItem(APP_STATE_KEY);
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
                'body.plena-demo-has-banner aside { top: var(--plena-demo-banner-h, 40px); }',
                'body.plena-demo-has-banner header { top: var(--plena-demo-banner-h, 40px); }',
                'body.plena-demo-has-banner main { margin-top: calc(56px + var(--plena-demo-banner-h, 40px)); min-height: calc(100vh - 56px - var(--plena-demo-banner-h, 40px)); }',
                'body.plena-demo-has-banner.light .nav-link.active, body.plena-demo-has-banner.light .order-card .eyebrow, body.plena-demo-has-banner.light .step.active, body.plena-demo-has-banner.light .subtle-link { color: #0369a1; }',
                'body.plena-demo-has-banner.light .nav-link .count, body.plena-demo-has-banner.light .badge.info { color: #0369a1; background: rgba(2,132,199,0.12); }',
                '@media (max-width: 767px) { body.plena-demo-has-banner aside { top: 0; } }'
            ].join('\n');
            document.head.appendChild(style);
        }

        if (!document.getElementById('plena-demo-banner')) {
            var banner = document.createElement('div');
            banner.id = 'plena-demo-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#0f253d;border-bottom:1px solid rgba(56,189,248,0.28);color:#f1f5f9;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;text-align:center;padding:7px 14px;font-size:11px;font-weight:700;box-shadow:0 2px 10px rgba(15,37,61,.18);font-family:Inter,system-ui,sans-serif;';
            banner.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:7px;height:7px;border-radius:50%;background:#38bdf8;"></span> Modo demonstração • <strong>' + DEMO_PRODUCT + '</strong> • Lava Rápido Estrela Azul</span>' +
                '<button id="plena-demo-cta" type="button" style="border:0;background:#0284c7;color:#fff;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;transition:background 0.2s;">Gostei, falar no WhatsApp</button>' +
                '<button id="plena-demo-reset" type="button" style="border:1px solid rgba(255,255,255,.25);background:transparent;color:#cbd5e1;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;">Resetar dados</button>';
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

    document.addEventListener('DOMContentLoaded', function () {
        seedLavarapidoData();
        applyPreferredDemoTheme();
        injectDemoLayer();
    });
})();
