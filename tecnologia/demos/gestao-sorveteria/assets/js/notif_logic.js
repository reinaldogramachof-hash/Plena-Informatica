// ============================================================
// MÓDULO DE NOTIFICAÇÕES — Gestão Sorveteria & Açaí Pro
// Busca notificações em sistemasdegestao.tech/api_notificacoes.php
// Filtro por "a partir da ativação" é feito no servidor (api_notificacoes.php
// consulta activated_at da licença) - este módulo só envia a license_key.
// ============================================================

const NOTIF_API_URL   = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? '../api_notificacoes.php' : 'https://sistemasdegestao.tech/api_notificacoes.php';
const NOTIF_TARGET    = 'sorveteria';
const NOTIF_READ_KEY  = 'ml_notif_read_sorveteria';
const NOTIF_CACHE_KEY = 'ml_notif_cache_sorveteria';
const NOTIF_MAX       = 10;

let _notifData = []; // lista processada e filtrada

const getNotifLicenseKey = () => {
    return localStorage.getItem('sorveteria_license') || '';
};

// ── Inicialização e Background Refresh ──────────────────────
function initNotifications() {
    // Trava de idempotência: evita registrar listeners duplicados
    if (window.__notificationsInitialized) return;
    window.__notificationsInitialized = true;

    fetchNotifications();

    // Auto-atualizar silenciosamente quando o usuário voltar para a aba
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            fetchNotifications(true);
        }
    });
}

// ── Fetch com cache de 30 min ─────────────────────────────
async function fetchNotifications(forceNetwork = false) {
    const cached = (() => { try { return JSON.parse(localStorage.getItem(NOTIF_CACHE_KEY)); } catch { return null; } })();
    const now = Date.now();
    const licenseKey = getNotifLicenseKey();

    if (!licenseKey) {
        localStorage.removeItem(NOTIF_CACHE_KEY);
        processNotifications([]);
        return;
    }

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const cacheTime = isLocal ? 0 : 30 * 60 * 1000;

    // Usar cache se fresco (< 30 min em produção, 0 em local para testes), e se não for forceNetwork
    if (!forceNetwork && cached && cached.licenseKey === licenseKey && (now - cached.fetchedAt) < cacheTime) {
        processNotifications(cached.data);
        return;
    }

    try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 5000);
        // cache:'no-store' garante que o browser nunca retorne resposta em cache
        const res   = await fetch(`${NOTIF_API_URL}?target=${NOTIF_TARGET}&license=${licenseKey}&_t=${now}`, {
            signal: ctrl.signal,
            cache: 'no-store'
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Verifica se os dados chegaram diferentes para re-renderizar
        const isDataChanged = !cached || JSON.stringify(cached.data) !== JSON.stringify(data);

        localStorage.setItem(NOTIF_CACHE_KEY, JSON.stringify({ data, fetchedAt: now, licenseKey }));

        if (isDataChanged || !forceNetwork) {
            processNotifications(data);
        }
    } catch (e) {
        // Offline ou erro → usar cache antigo silenciosamente
        if (cached) {
            processNotifications(cached.data);
        } else {
            // Se falhar e não tiver cache, remove o spinner de carregamento e exibe erro de conexão
            const container = document.getElementById('notif-list');
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-16 text-gray-400">
                        <i data-lucide="wifi-off" class="w-10 h-10 mx-auto mb-3 opacity-40"></i>
                        <p class="font-bold text-sm">Erro de conexão</p>
                        <p class="text-xs mt-1">Não foi possível carregar as notificações.</p>
                    </div>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
    }
}

// ── Filtragem, ordenação e limite ─────────────────────────
function processNotifications(rawList) {
    const now = new Date();
    _notifData = (rawList || [])
        .filter(n => {
            const targets    = n.targets || ['all'];
            const validTarget  = targets.includes('all') || targets.includes(NOTIF_TARGET);
            const notExpired   = !n.expires || new Date(n.expires) > now;
            return validTarget && notExpired;
        })
        .sort((a, b) => new Date(b.published) - new Date(a.published))
        .slice(0, NOTIF_MAX);

    updateNotifBadge();
    renderNotifications();
}

// ── Leitura / marcação ─────────────────────────────────────
function _getReadIds() {
    try { return JSON.parse(localStorage.getItem(NOTIF_READ_KEY) || '[]'); }
    catch { return []; }
}

function markAsRead(id) {
    const read = _getReadIds();
    if (!read.includes(id)) {
        read.push(id);
        localStorage.setItem(NOTIF_READ_KEY, JSON.stringify(read));
    }
    updateNotifBadge();
    renderNotifications();
}

function markAllAsRead() {
    localStorage.setItem(NOTIF_READ_KEY, JSON.stringify(_notifData.map(n => n.id)));
    updateNotifBadge();
    renderNotifications();
}

// ── Badge ─────────────────────────────────────────────────
function updateNotifBadge() {
    const read  = _getReadIds();
    const count = _notifData.filter(n => !read.includes(n.id)).length;
    document.querySelectorAll('.notif-badge').forEach(badge => {
        badge.textContent = count > 9 ? '9+' : count;
        badge.classList.toggle('hidden', count === 0);
    });
}

// ── Render da view Notificações (tema claro da Sorveteria) ─
function renderNotifications() {
    const container = document.getElementById('notif-list');
    if (!container) return;

    const read = _getReadIds();

    if (_notifData.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 text-gray-400">
                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <i data-lucide="bell-off" class="w-7 h-7 text-gray-300"></i>
                </div>
                <p class="font-bold text-gray-700 text-lg">Nenhuma notificação</p>
                <p class="text-sm mt-1 text-gray-400">Novidades e avisos aparecerão aqui</p>
            </div>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    const typeMap = {
        update:   { icon: 'rocket',       label: 'Atualização', bg: 'bg-rose-50',   border: 'border-rose-100',   text: 'text-rose-600',   iconColor: 'text-rose-500' },
        security: { icon: 'shield-alert', label: 'Segurança',   bg: 'bg-rose-50',   border: 'border-rose-100',   text: 'text-rose-600',   iconColor: 'text-rose-500' },
        backup:   { icon: 'hard-drive',   label: 'Backup',      bg: 'bg-amber-50',  border: 'border-amber-100',  text: 'text-amber-600',  iconColor: 'text-amber-500' },
        info:     { icon: 'info',         label: 'Informativo', bg: 'bg-gray-50',   border: 'border-gray-100',   text: 'text-gray-600',   iconColor: 'text-gray-400' },
        promo:    { icon: 'tag',          label: 'Novidade',    bg: 'bg-rose-50',   border: 'border-rose-100',   text: 'text-rose-600',   iconColor: 'text-rose-500' },
    };

    container.innerHTML = _notifData.map(n => {
        const isRead = read.includes(n.id);
        const tc     = typeMap[n.type] || typeMap.info;
        const date   = new Date(n.published).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        const pulse  = !isRead ? '<span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block ml-1 align-middle"></span>' : '';

        return `
        <div class="rounded-xl border shadow-sm hover:shadow-md ${isRead ? 'border-gray-100 opacity-60 bg-gray-50' : 'border-gray-200 bg-white'} p-5 lg:p-6 transition-all">
            <div class="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div class="flex items-start gap-4 flex-1 min-w-0 w-full">
                    <div class="w-11 h-11 lg:w-14 lg:h-14 rounded-xl ${tc.bg} flex items-center justify-center shrink-0 mt-1 border ${tc.border}">
                        <i data-lucide="${tc.icon}" class="w-5 h-5 lg:w-7 lg:h-7 ${tc.iconColor}"></i>
                    </div>
                    <div class="flex-1 min-w-0 w-full">
                        <div class="flex flex-wrap items-center gap-2 mb-2">
                            <span class="text-xs font-bold ${tc.bg} ${tc.text} px-2.5 py-0.5 rounded-full border ${tc.border} uppercase tracking-wide">${tc.label}</span>
                            ${pulse}
                            <span class="text-xs font-medium text-gray-400">${date}</span>
                            ${n.version ? '<span class="text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-md">v' + n.version + '</span>' : ''}
                        </div>
                        <h4 class="font-bold text-gray-800 text-base lg:text-lg mb-1.5">${n.title}</h4>
                        <p class="text-sm lg:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">${n.body}</p>
                        ${n.details ? '<div class="bg-gray-50 p-3 lg:p-4 rounded-xl border border-gray-100 mt-3"><p class="text-xs lg:text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">' + n.details + '</p></div>' : ''}
                    </div>
                </div>
                <div class="shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-100 sm:border-0 flex justify-end">
                    ${!isRead
                        ? `<button onclick="markAsRead('${n.id}')" class="w-full sm:w-auto text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2"><i data-lucide="check" class="w-4 h-4"></i> Marcar como lida</button>`
                        : `<div class="text-xs font-bold text-gray-400 flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100"><i data-lucide="check-check" class="w-4 h-4"></i> Já lida</div>`
                    }
                </div>
            </div>
        </div>`;
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ── Auto-inicialização (fallback) ─────────────────────────
// Garante que as notificações sejam inicializadas mesmo que
// o app.js cacheado pelo SW não chame initNotifications()
(function _autoInit() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initNotifications());
    } else {
        initNotifications();
    }
})();
