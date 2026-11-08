/* Criptografia e persistência. Exportação temporária só com autorização do router local. */
const FitVaultStore = (() => {
    const format = 'gestao-fit-vault', iterations = 600000, limit = 20000000;
    function create({ storage = localStorage, cryptography = crypto, locks = globalThis.navigator?.locks, defaults, storageKey = 'gestao_fit_v1', validation = { enabled: false } }) {
        const encoder = new TextEncoder(), decoder = new TextDecoder();
        const encode = value => { let text = ''; for (const byte of new Uint8Array(value)) text += String.fromCharCode(byte); return btoa(text); };
        const decode = value => { if (typeof value !== 'string' || value.length > limit * 2) throw new Error('Arquivo protegido inválido.'); return Uint8Array.from(atob(value), c => c.charCodeAt(0)); };
        let key = null, salt = null, rounds = iterations, expected, plain = null, epoch = 0, busy = false;
        const sessionKey = storageKey + ':validation-session';
        const validationEnabled = validation.enabled === true && !!validation.storage;
        const now = validation.now || Date.now, lifetime = validation.lifetime || 8 * 60 * 60 * 1000, idleLimit = validation.idle || 15 * 60 * 1000;
        let validationExpiry = null;
        function forgetSession() { try { validation.storage?.removeItem(sessionKey); } catch {} validationExpiry = null; }
        async function rememberSession(fresh = false) {
            if (!validationEnabled || !key) return false;
            const active = key, version = epoch;
            try {
                const raw = await cryptography.subtle.exportKey('raw', active);
                if (!key || key !== active || epoch !== version) return false;
                if (fresh || !validationExpiry) validationExpiry = now() + lifetime;
                validation.storage.setItem(sessionKey, JSON.stringify({ system: 'gestao-fit', key: encode(raw), salt: encode(salt), rounds, expiresAt: validationExpiry, activityAt: now() }));
                return true;
            } catch { forgetSession(); return false; }
        }
        function activity() {
            if (!validationEnabled || !key) return;
            try {
                const saved = JSON.parse(validation.storage.getItem(sessionKey));
                if (!saved || saved.expiresAt <= now()) { forgetSession(); return; }
                saved.activityAt = now(); validation.storage.setItem(sessionKey, JSON.stringify(saved));
            } catch { forgetSession(); }
        }
        const read = () => storage.getItem(storageKey);
        const assertCurrent = stamp => { if (read() !== stamp) throw new Error('Os dados mudaram em outra aba. Reabra o sistema antes de continuar.'); };
        const exclusive = work => locks ? locks.request('gestao-fit:write:' + storageKey, work) : work();
        function errorMessage(error) {
            if (['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(error?.name)) return new Error('Não há espaço para gravar. Os últimos dados salvos foram preservados. Libere espaço e confira um backup antes de continuar.');
            return error;
        }
        async function guarded(work) {
            if (busy) throw new Error('Aguarde a gravação atual.');
            busy = true;
            try { return await work(); } catch (error) { throw errorMessage(error); } finally { busy = false; }
        }
        async function derive(password, activeSalt, activeRounds = iterations) {
            if (!cryptography?.subtle) throw new Error('Abra por HTTPS ou pelo endereço local para proteger os registros.');
            const material = await cryptography.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
            return cryptography.subtle.deriveKey({ name: 'PBKDF2', salt: activeSalt, iterations: activeRounds, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, validationEnabled, ['encrypt', 'decrypt']);
        }
        function checkEnvelope(source) {
            if (!source || source.format !== format || source.version !== 1 || source.system !== 'gestao-fit' || source.kdf !== 'PBKDF2-SHA256' || !Number.isInteger(source.iterations) || source.iterations < 100000 || source.iterations > 2000000 || decode(source.salt).length !== 16 || decode(source.iv).length !== 12 || decode(source.ciphertext).length < 16) throw new Error('Arquivo protegido inválido ou de outro sistema.');
        }
        async function encrypt(data, activeKey = key, activeSalt = salt, activeRounds = rounds) {
            const iv = cryptography.getRandomValues(new Uint8Array(12));
            const ciphertext = await cryptography.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(format + ':1') }, activeKey, encoder.encode(JSON.stringify(data)));
            return { format, version: 1, system: 'gestao-fit', kdf: 'PBKDF2-SHA256', iterations: activeRounds, salt: encode(activeSalt), iv: encode(iv), ciphertext: encode(ciphertext) };
        }
        async function decrypt(source, password) {
            checkEnvelope(source);
            const activeSalt = decode(source.salt), activeKey = await derive(password, activeSalt, source.iterations);
            try {
                const text = await cryptography.subtle.decrypt({ name: 'AES-GCM', iv: decode(source.iv), additionalData: encoder.encode(format + ':1') }, activeKey, decode(source.ciphertext));
                return { data: JSON.parse(decoder.decode(text)), key: activeKey, salt: activeSalt, rounds: source.iterations };
            } catch { throw new Error('Senha incorreta ou arquivo danificado. Os dados foram preservados.'); }
        }
        function validatePassword(password, repeat) {
            if (typeof password !== 'string' || password.length < 12 || password.length > 200 || password !== repeat) throw new Error('As senhas devem ser iguais e ter de 12 a 200 caracteres.');
        }
        function load() {
            expected = read();
            if (expected === null) { forgetSession(); return { protected: false, legacy: false }; }
            try {
                const data = JSON.parse(expected);
                if (data?.format === format) { checkEnvelope(data); return { protected: true, legacy: false }; }
                FitData.normalize(data, defaults, true);
                forgetSession();
                return { protected: false, legacy: true };
            } catch { forgetSession(); throw new Error('Não foi possível ler a base atual. O original foi preservado; use a recuperação por backup.'); }
        }
        async function resume() {
            if (!validationEnabled) return null;
            return guarded(async () => {
                try {
                    if (expected === undefined) load();
                    const stamp = expected, version = epoch, source = JSON.parse(stamp), saved = JSON.parse(validation.storage.getItem(sessionKey));
                    if (!saved) return null;
                    checkEnvelope(source);
                    if (saved.system !== 'gestao-fit' || !Number.isFinite(saved.expiresAt) || saved.expiresAt <= now() || saved.expiresAt > now() + lifetime || !Number.isFinite(saved.activityAt) || saved.activityAt > now() || now() - saved.activityAt >= idleLimit || saved.salt !== source.salt || saved.rounds !== source.iterations || decode(saved.key).length !== 32) throw new Error('Sessão local encerrada.');
                    const activeKey = await cryptography.subtle.importKey('raw', decode(saved.key), { name: 'AES-GCM' }, true, ['encrypt','decrypt']);
                    const text = await cryptography.subtle.decrypt({ name: 'AES-GCM', iv: decode(source.iv), additionalData: encoder.encode(format + ':1') }, activeKey, decode(source.ciphertext));
                    const clean = FitData.normalize(JSON.parse(decoder.decode(text)), defaults, true);
                    if (epoch !== version) throw new Error('Abertura cancelada.'); assertCurrent(stamp);
                    key = activeKey; salt = decode(source.salt); rounds = source.iterations; plain = JSON.stringify(clean); validationExpiry = saved.expiresAt;
                    return FitData.clone(clean);
                } catch { forgetSession(); return null; }
            });
        }
        async function unlock(password, repeat) {
            return guarded(async () => {
                if (expected === undefined) load();
                const stamp = expected, version = epoch, source = stamp === null ? null : JSON.parse(stamp);
                let activeKey, activeSalt, activeRounds, clean;
                if (source?.format === format) {
                    const opened = await decrypt(source, password);
                    clean = FitData.normalize(opened.data, defaults, true); activeKey = opened.key; activeSalt = opened.salt; activeRounds = opened.rounds;
                } else {
                    validatePassword(password, repeat);
                    clean = FitData.normalize(source || defaults, defaults, !!source);
                    activeSalt = cryptography.getRandomValues(new Uint8Array(16)); activeRounds = iterations; activeKey = await derive(password, activeSalt);
                    const serialized = JSON.stringify(await encrypt(clean, activeKey, activeSalt, activeRounds));
                    await exclusive(() => { if (epoch !== version) throw new Error('Abertura cancelada.'); assertCurrent(stamp); storage.setItem(storageKey, serialized); expected = serialized; });
                }
                if (epoch !== version) throw new Error('Abertura cancelada.');
                assertCurrent(expected);
                key = activeKey; salt = activeSalt; rounds = activeRounds; plain = JSON.stringify(clean);
                await rememberSession(true);
                if (!key || epoch !== version) throw new Error('Abertura cancelada.');
                return FitData.clone(clean);
            });
        }
        async function save(data, checkpoint = false) {
            return guarded(async () => {
                if (!key) throw new Error('Abra os registros antes de continuar.');
                const version = epoch, stamp = expected, clean = FitData.normalize(data, defaults, true);
                const serialized = JSON.stringify(await encrypt(clean));
                await exclusive(() => {
                    if (!key || epoch !== version) throw new Error('Gravação cancelada pelo bloqueio.');
                    assertCurrent(stamp);
                    const previous = checkpoint ? storage.getItem(storageKey + ':before-restore') : null;
                    if (checkpoint && stamp) storage.setItem(storageKey + ':before-restore', stamp);
                    try { storage.setItem(storageKey, serialized); }
                    catch (error) {
                        if (checkpoint) try { if (previous === null) storage.removeItem(storageKey + ':before-restore'); else storage.setItem(storageKey + ':before-restore', previous); } catch {}
                        throw error;
                    }
                    expected = serialized; plain = JSON.stringify(clean);
                });
                await rememberSession();
                if (!key || epoch !== version) throw new Error('Gravação concluída, mas os registros foram bloqueados. Reabra para conferir.');
                return FitData.clone(clean);
            });
        }
        async function prepare(text, password) {
            const token = { stamp: expected, epoch };
            if (typeof text !== 'string' || encoder.encode(text).byteLength > limit) throw new Error('O backup excede o limite de 20 MB.');
            let source; try { source = JSON.parse(text); } catch { throw new Error('Arquivo JSON inválido. A base atual foi preservada.'); }
            const protectedFile = source?.format === format;
            const data = FitData.normalize(protectedFile ? (await decrypt(source, password)).data : source, defaults, true);
            if (token.stamp !== expected || token.epoch !== epoch) throw new Error('Os registros mudaram durante a conferência. Selecione o arquivo novamente.');
            return { data, report: FitData.inspect(data), protected: protectedFile, token };
        }
        async function restore(preview) {
            if (!key || preview.token.stamp !== expected || preview.token.epoch !== epoch) throw new Error('A base mudou desde a prévia. Selecione o arquivo novamente.');
            return save(preview.data, true);
        }
        async function recover(preview, password, repeat) {
            return guarded(async () => {
                validatePassword(password, repeat);
                if (preview.token.stamp !== expected || preview.token.epoch !== epoch) throw new Error('A base mudou. Reabra a recuperação.');
                const stamp = expected, version = epoch, clean = FitData.normalize(preview.data, defaults, true), newSalt = cryptography.getRandomValues(new Uint8Array(16)), newKey = await derive(password, newSalt);
                const serialized = JSON.stringify(await encrypt(clean, newKey, newSalt, iterations));
                // Mesmo um original ilegível é preservado cifrado na cópia anterior.
                const original = stamp ? JSON.stringify(await encrypt({ recoveryOriginal: stamp }, newKey, newSalt, iterations)) : null;
                await exclusive(() => {
                    if (epoch !== version) throw new Error('Recuperação cancelada.'); assertCurrent(stamp);
                    const old = storage.getItem(storageKey + ':before-restore');
                    if (original) storage.setItem(storageKey + ':before-restore', original);
                    try { storage.setItem(storageKey, serialized); } catch(error) { try { if(old===null)storage.removeItem(storageKey+':before-restore');else storage.setItem(storageKey+':before-restore',old); } catch {} throw error; }
                    key = newKey; salt = newSalt; rounds = iterations; expected = serialized; plain = JSON.stringify(clean);
                });
                await rememberSession(true);
                if (!key || epoch !== version) throw new Error('Recuperação concluída; reabra os registros.');
                return FitData.clone(clean);
            });
        }
        async function originalFromRecovery(text, password) {
            const opened = await decrypt(JSON.parse(text), password);
            if (typeof opened.data.recoveryOriginal !== 'string') throw new Error('Este arquivo não contém um original de recuperação.');
            return opened.data.recoveryOriginal;
        }
        async function backup() {
            if (!key || !plain || busy) throw new Error('Abra os registros e aguarde a gravação antes do backup.');
            const version = epoch, stamp = expected, content = JSON.stringify(await encrypt(JSON.parse(plain)));
            if (!key || epoch !== version || expected !== stamp) throw new Error('Os registros mudaram durante o backup. Tente novamente.'); assertCurrent(stamp); return content;
        }
        async function changePassword(current, password, repeat) {
            return guarded(async () => {
                validatePassword(password, repeat);
                if (!key || password === current) throw new Error('Abra os registros e escolha uma senha diferente da atual.');
                const stamp = expected, version = epoch, opened = await decrypt(JSON.parse(stamp), current), clean = FitData.normalize(opened.data, defaults, true), newSalt = cryptography.getRandomValues(new Uint8Array(16)), newKey = await derive(password, newSalt);
                const serialized = JSON.stringify(await encrypt(clean, newKey, newSalt, iterations));
                await exclusive(() => { if (!key || epoch !== version) throw new Error('Troca de senha cancelada.'); assertCurrent(stamp); storage.setItem(storageKey, serialized); key = newKey; salt = newSalt; rounds = iterations; expected = serialized; plain = JSON.stringify(clean); epoch++; });
                forgetSession(); await rememberSession(true);
            });
        }
        async function verifyPassword(password) {
            if (!key || busy) throw new Error('Abra os registros e aguarde a gravação atual.');
            const stamp = expected, version = epoch;
            await decrypt(JSON.parse(stamp), password);
            if (!key || epoch !== version || expected !== stamp) throw new Error('A base mudou. Reabra a operação.');
            assertCurrent(stamp);
        }
        function lock() { forgetSession(); epoch++; key = null; salt = null; plain = null; }
        return { load, unlock, resume, save, prepare, restore, recover, originalFromRecovery, backup, changePassword, verifyPassword, lock, activity,
            snapshot: () => plain ? JSON.parse(plain) : null,
            status: () => ({ open: !!key, busy, previous: !!storage.getItem(storageKey + ':before-restore') }),
            previous: () => storage.getItem(storageKey + ':before-restore'), raw: () => expected };
    }
    return { create, format, iterations };
})();
