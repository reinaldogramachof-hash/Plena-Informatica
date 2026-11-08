/* Só o router de desenvolvimento autoriza esta facilidade; não há senha fixa. */
const FitValidationSession = (() => {
    const lifetime = 8 * 60 * 60 * 1000, idle = 15 * 60 * 1000;
    function isLocal(location) { return ['127.0.0.1','localhost','[::1]'].includes(location.hostname) && location.port === '8000'; }
    async function configuration({ location = globalThis.location, fetcher = globalThis.fetch, storage = globalThis.sessionStorage, now = Date.now } = {}) {
        if (!isLocal(location)) return { enabled: false };
        const marker = 'gestao_fit_v1:validation-authorized';
        const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 3000);
        try {
            const response = await fetcher(new URL('/__fit_local_validation.json', location.href).href, { cache: 'no-store', signal: controller.signal });
            if (!response.ok) throw new Error('Sem configuração local.');
            const config = await response.json();
            if (config.enabled !== true || config.system !== 'gestao-fit' || config.purpose !== 'local-visual-validation') { storage.removeItem(marker); return { enabled: false }; }
            storage.setItem(marker, JSON.stringify({ origin: location.origin, expiresAt: now() + lifetime }));
            return { enabled: true, storage, now, lifetime, idle };
        } catch {
            try {
                const previous = JSON.parse(storage.getItem(marker));
                if (previous?.origin === location.origin && Number.isFinite(previous.expiresAt) && previous.expiresAt > now() && previous.expiresAt <= now() + lifetime) return { enabled: true, storage, now, lifetime, idle };
            } catch {}
            return { enabled: false };
        } finally { clearTimeout(timeout); }
    }
    return { configuration, isLocal, lifetime, idle };
})();
