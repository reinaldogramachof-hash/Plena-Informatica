/* AES-GCM autenticado. Validação temporária local mantém a chave na sessão da aba, nunca a senha. */
const TherapyVault = (() => {
    const storageKey = 'gestao_terapia_v1', format = 'gestao-terapia-vault', iterations = 600000;
    // Temporário para a lapidação local; não se aplica ao endereço publicado.
    const validationMode = window.THERAPY_LOCAL_VALIDATION === true && location.port === '8000' && ['localhost','127.0.0.1','[::1]'].includes(location.hostname);
    const validationKey = storageKey + ':validation-session', validationLifetime = 8 * 60 * 60 * 1000;
    let key = null, salt = null, rounds = iterations, expected = null, lastPlain = null, defaults, unlocked, opening = false, idle, epoch=0;
    const encoder = new TextEncoder(), decoder = new TextDecoder();
    const encode = bytes => {let text='';for(const byte of new Uint8Array(bytes))text+=String.fromCharCode(byte);return btoa(text);};
    const decode = text => Uint8Array.from(atob(text), c=>c.charCodeAt(0));
    async function derive(password, bytes, rounds = iterations) {
        const material = await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);
        return crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes,iterations:rounds,hash:'SHA-256'},material,{name:'AES-GCM',length:256},validationMode,['encrypt','decrypt']);
    }
    function checkEnvelope(data) {
        if(data?.format!==format || data.version!==1 || data.system!=='gestao-terapia' || data.kdf!=='PBKDF2-SHA256' || !Number.isInteger(data.iterations) || data.iterations<100000 || data.iterations>2000000 || decode(data.salt).length!==16 || decode(data.iv).length!==12 || typeof data.ciphertext!=='string') throw new Error('Arquivo protegido inválido ou incompatível.');
    }
    function forgetValidation() { try { sessionStorage.removeItem(validationKey); } catch {} }
    if (!validationMode) forgetValidation();
    async function rememberValidation() {
        if (!validationMode || !key) return;
        try {
            const raw = await crypto.subtle.exportKey('raw',key);
            sessionStorage.setItem(validationKey,JSON.stringify({key:encode(raw),salt:encode(salt),rounds,expiresAt:Date.now()+validationLifetime}));
        } catch {
            forgetValidation();
            if (typeof therapyNotice === 'function') therapyNotice('Acesso aberto, mas não foi possível manter a sessão após F5 neste navegador.','error');
        }
    }
    async function resumeValidation(stored) {
        if (!validationMode) return null;
        try {
            const saved = JSON.parse(sessionStorage.getItem(validationKey) || 'null');
            if (!saved) return null;
            if (!Number.isFinite(saved.expiresAt) || saved.expiresAt<=Date.now() || saved.expiresAt>Date.now()+validationLifetime || saved.salt!==stored.salt || saved.rounds!==stored.iterations || decode(saved.key).length!==32) throw new Error('Sessão encerrada.');
            checkEnvelope(stored);
            const activeKey = await crypto.subtle.importKey('raw',decode(saved.key),{name:'AES-GCM'},false,['encrypt','decrypt']);
            const plain = await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(stored.iv),additionalData:encoder.encode(format+':1')},activeKey,decode(stored.ciphertext));
            const data = TherapyData.normalize(JSON.parse(decoder.decode(plain)),defaults,true,true);
            if (localStorage.getItem(storageKey)!==expected) throw new Error('Base alterada em outra aba.');
            return {data,key:activeKey,salt:decode(stored.salt)};
        } catch { forgetValidation(); return null; }
    }
    async function decrypt(data, password) {
        checkEnvelope(data);
        const derived = await derive(password,decode(data.salt),data.iterations);
        try {
            const plain = await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(data.iv),additionalData:encoder.encode(format+':1')},derived,decode(data.ciphertext));
            return {data:JSON.parse(decoder.decode(plain)),key:derived,salt:decode(data.salt)};
        } catch {throw new Error('Senha incorreta ou arquivo danificado. Os dados foram preservados.');}
    }
    async function encrypt(data,activeKey=key,activeSalt=salt,activeRounds=rounds) {
        if(!activeKey)throw new Error('Abra os registros com sua senha.');
        const iv=crypto.getRandomValues(new Uint8Array(12));
        const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode(format+':1')},activeKey,encoder.encode(JSON.stringify(data)));
        return {format,version:1,system:'gestao-terapia',kdf:'PBKDF2-SHA256',iterations:activeRounds,salt:encode(activeSalt),iv:encode(iv),ciphertext:encode(ciphertext)};
    }
    async function save(data, checkpoint = false) {
        const version=epoch,stamp=expected;if(!key)throw new Error('Abra os registros antes de salvar.');
        const clean=TherapyData.normalize(data,defaults,true,checkpoint?null:lastPlain?JSON.parse(lastPlain):null), serialized=JSON.stringify(await encrypt(clean));
        if(!key||epoch!==version||expected!==stamp)throw new Error('A base mudou ou o cofre foi bloqueado. Reabra antes de salvar.');
        if(localStorage.getItem(storageKey)!==expected)throw new Error('Os dados mudaram em outra aba. Reabra o sistema antes de continuar.');
        if(checkpoint&&expected)await TherapyDocumentFiles.saveCheckpoint(expected,lastPlain?JSON.parse(lastPlain):null);
        if(!key||epoch!==version||expected!==stamp||localStorage.getItem(storageKey)!==stamp)throw new Error('A base mudou durante a preparação da cópia anterior.');
        const previous=checkpoint?localStorage.getItem(storageKey+':before-restore'):null;
        let checkpointWritten=false;
        try{if(checkpoint&&expected){localStorage.setItem(storageKey+':before-restore',expected);checkpointWritten=true;}localStorage.setItem(storageKey,serialized);}catch(error){if(checkpointWritten){try{if(previous===null)localStorage.removeItem(storageKey+':before-restore');else localStorage.setItem(storageKey+':before-restore',previous);}catch{}}if(error.name==='QuotaExceededError')throw new Error('Sem espaço neste navegador. A base atual foi preservada. Guarde um backup externo e libere espaço sem limpar os dados deste site.');throw error;}
        expected=serialized;lastPlain=JSON.stringify(clean);refreshIdle();return clean;
    }
    async function protectLegacyCopy(){
        const name=storageKey+'_corrupted_backup',raw=localStorage.getItem(name);if(!raw)return;
        try{if(JSON.parse(raw)?.format===format)return;}catch{}
        const protectedCopy=JSON.stringify(await encrypt({legacyRecovery:true,original:raw}));
        if(localStorage.getItem(name)!==raw)throw new Error('A cópia antiga mudou em outra aba. Reabra o sistema.');
        localStorage.setItem(name,protectedCopy);
    }
    function dialog(title, content) {
        const opener=document.activeElement;
        document.getElementById('therapy-dialog')?.remove();
        const modal=document.createElement('div');modal.id='therapy-dialog';modal.className='therapy-overlay';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label',title);
        const compact=/<input\b[^>]*\btype=["']password["']|therapy-(?:recovery-file|raw-download|confirm-restore)/i.test(content);
        const box=document.createElement('div');box.className='therapy-dialog'+(compact?'':' therapy-work-dialog');const heading=document.createElement('h2');heading.textContent=title;box.appendChild(heading);box.insertAdjacentHTML('beforeend',content);modal.appendChild(box);document.body.appendChild(modal);
        modal.dispatchEvent(new CustomEvent('therapy-modal-opening',{bubbles:true,detail:{opener}}));
        box.querySelector('input,button')?.focus();return modal;
    }
    function refreshIdle(){clearTimeout(idle);if(key){let minutes=15;try{minutes=TherapySystemRules.security(JSON.parse(lastPlain)?.settings?.security).autoLockMinutes;}catch{}idle=setTimeout(()=>{if(window.therapyActionBusy)refreshIdle();else lock();},minutes*60000);}}
    function lock(){if(window.therapyActionBusy)return therapyNotice('Aguarde a gravação antes de bloquear.');forgetValidation();epoch++;key=null;salt=null;lastPlain=null;clearTimeout(idle);document.dispatchEvent(new Event('therapy-vault-locked'));opening=false;open();}
    function recover(message){
        dialog('Recuperar registros','<p id="therapy-recovery-message"></p><p>A base atual foi preservada. Guarde o arquivo original e qualquer cópia anterior antes de escolher um backup válido. O original pode conter registros sem criptografia se a base antiga já estava nesse formato; guarde-o em local privado.</p><button id="therapy-raw-download">Guardar arquivo original</button><label>Recuperar de backup<input type="file" id="therapy-recovery-file" accept=".json"></label><button type="button" id="therapy-recovery-back">Voltar à abertura</button>');
        document.getElementById('therapy-recovery-back').onclick=()=>{opening=false;open();};
        document.getElementById('therapy-recovery-message').textContent=message;
        document.getElementById('therapy-raw-download').onclick=()=>download(expected||'','terapia-original.json');
        document.getElementById('therapy-recovery-file').onchange=async event=>{
            try{
                const file=event.target.files?.[0];if(!file)return;if(file.size>TherapyDocumentFiles.MAX_BACKUP)throw new Error('O arquivo excede 100 MB.');
                const started=expected,version=epoch,{next:clean,files}=await readBackup(file);
                const modal=dialog('Proteger a recuperação','<p>Confira o arquivo abaixo. Ele substituirá toda a base atual; os dados não serão mesclados. O original será guardado como cópia anterior neste navegador, substituindo a cópia anterior existente. Baixe o original antes de prosseguir.</p>'+summary(clean)+'<p>Escolha uma nova senha para a base recuperada. O arquivo de backup continuará usando a senha antiga.</p><form><label>Nova senha<input type="password" id="therapy-recovery-password" required minlength="12" maxlength="200" autocomplete="new-password"></label><label>Repita a senha<input type="password" id="therapy-recovery-confirm" required minlength="12" maxlength="200" autocomplete="new-password"></label><label>Digite RESTAURAR<input id="therapy-recovery-phrase" required autocomplete="off"></label><button type="submit">Proteger e recuperar</button><button type="button" id="therapy-recovery-cancel">Cancelar</button><p role="alert"></p></form>');
                modal.querySelector('#therapy-recovery-cancel').onclick=()=>recover('Recuperação cancelada. A base atual foi preservada.');
                modal.querySelector('form').onsubmit=async e=>{
                    e.preventDefault();e.submitter.disabled=true;let busy=false,committed=false;
                    try{if(window.therapyActionBusy)throw new Error('Aguarde a gravação atual.');const password=document.getElementById('therapy-recovery-password').value;if(password.length<12||password.length>200||password!==document.getElementById('therapy-recovery-confirm').value)throw new Error('As senhas precisam ser iguais e ter de 12 a 200 caracteres.');if(document.getElementById('therapy-recovery-phrase').value!=='RESTAURAR')throw new Error('Digite RESTAURAR exatamente como exibido.');if(epoch!==version||expected!==started||localStorage.getItem(storageKey)!==started)throw new Error('A base mudou. Reabra o sistema antes de recuperar.');window.therapyActionBusy=true;busy=true;modal.querySelectorAll('button').forEach(button=>button.disabled=true);salt=crypto.getRandomValues(new Uint8Array(16));rounds=iterations;key=await derive(password,salt);if(epoch!==version||expected!==started)throw new Error('A base mudou. Reabra o sistema.');await TherapyDocumentFiles.stage(clean,files);await save(clean,true);committed=true;window.therapyActionBusy=false;busy=false;modal.remove();opening=false;await unlocked(clean);await rememberValidation();refreshIdle();document.dispatchEvent(new Event('therapy-data-restored'));}
                    catch(error){if(committed){lock();therapyNotice('Recuperação gravada e original preservado. Reabra com a nova senha para carregar as telas.','error');return;}key=null;salt=null;modal.querySelector('[role=alert]').textContent=error.message;}
                    finally{if(busy)window.therapyActionBusy=false;modal.querySelectorAll('button').forEach(button=>button.disabled=false);}
                };
            }catch(error){recover(error.message);}
        };
    }
    async function open() {
        if(opening || key)return;opening=true;
        expected=localStorage.getItem(storageKey);
        let stored;
        try{stored=expected?JSON.parse(expected):null;if(stored&&stored.format!==format)TherapyData.normalize(stored,defaults,true);}catch(error){recover(error.message);return;}
        const encrypted=stored?.format===format;
        if (encrypted) {
            const resumed = await resumeValidation(stored);
            if (resumed) {
                try {
                    key=resumed.key;salt=resumed.salt;rounds=stored.iterations;lastPlain=JSON.stringify(resumed.data);
                    await protectLegacyCopy();opening=false;await unlocked(resumed.data);refreshIdle();return;
                } catch {
                    forgetValidation();key=null;salt=null;lastPlain=null;
                    document.dispatchEvent(new Event('therapy-vault-locked'));opening=true;
                }
            }
        } else forgetValidation();
        const modal=dialog(encrypted?'Abrir registros':'Proteger os registros',`<p>${encrypted?'Informe sua senha local para acessar os registros.':'Crie uma senha de pelo menos 12 caracteres. Os dados existentes serão preservados e protegidos após a confirmação.'}</p><p>Guarde a senha em local seguro. Sem ela, os registros e backups protegidos não poderão ser abertos.</p><form id="therapy-unlock-form"><label>Senha<input type="password" id="therapy-vault-password" autocomplete="${encrypted?'current-password':'new-password'}" required ${encrypted?'':'minlength="12"'}></label>${encrypted?'':'<label>Repita a senha<input type="password" id="therapy-vault-confirm" autocomplete="new-password" minlength="12" required></label>'}<p id="therapy-vault-error" role="alert"></p><button type="submit">${encrypted?'Abrir registros':'Proteger e continuar'}</button></form>`);
        if(encrypted){const recovery=document.createElement('button');recovery.type='button';recovery.id='therapy-open-recovery';recovery.textContent='Recuperar usando outro backup';recovery.onclick=()=>recover('A senha atual não pode ser recuperada. Você pode usar outro backup cuja senha conheça. Escolher um arquivo ainda não altera a base atual.');modal.querySelector('.therapy-dialog').appendChild(recovery);}
        modal.querySelector('form').onsubmit=async event=>{
            event.preventDefault();const button=event.submitter;button.disabled=true;const recovery=modal.querySelector('#therapy-open-recovery');if(recovery)recovery.disabled=true;
            try {
                if(!crypto.subtle)throw new Error('Abra o sistema por HTTPS ou localhost para proteger os registros.');
                const password=document.getElementById('therapy-vault-password').value;
                let clean;
                if(encrypted){const result=await decrypt(stored,password);clean=TherapyData.normalize(result.data,defaults,true,true);key=result.key;salt=result.salt;rounds=stored.iterations;lastPlain=JSON.stringify(clean);}
                else {
                    if(password.length<12 || password!==document.getElementById('therapy-vault-confirm').value)throw new Error('As senhas devem ser iguais e ter ao menos 12 caracteres.');
                    clean=TherapyData.normalize(stored||defaults,defaults,!!stored);salt=crypto.getRandomValues(new Uint8Array(16));rounds=iterations;key=await derive(password,salt);await save(clean);
                }
                await protectLegacyCopy();modal.querySelector('form').reset();modal.remove();opening=false;await unlocked(clean);await rememberValidation();refreshIdle();
            }catch(error){key=null;salt=null;const output=document.getElementById('therapy-vault-error');if(output)output.textContent=error.message;else{document.dispatchEvent(new Event('therapy-vault-locked'));opening=false;open();therapyNotice('Não foi possível abrir todos os módulos. Os dados foram preservados. Reabra o sistema conectado à internet.','error');}}
            finally{button.disabled=false;if(recovery)recovery.disabled=false;}
        };
    }
    function askPassword(title) {return new Promise((resolve,reject)=>{const modal=dialog(title,'<form><label>Senha do backup<input type="password" required autocomplete="off"></label><div class="therapy-actions"><button type="submit">Conferir backup</button><button type="button">Cancelar</button></div></form>');modal.querySelector('form').onsubmit=e=>{e.preventDefault();const pass=modal.querySelector('input').value;modal.remove();resolve(pass);};modal.querySelector('[type=button]').onclick=()=>{modal.remove();reject(new Error('Conferência cancelada.'));};});}
    function download(text,name){const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
    const collectionLabels={patients:'Pacientes',appointments:'Agendamentos',sessions:'Registros de sessão',sessionDrafts:'Rascunhos de sessão',treatments:'Tratamentos',assessments:'Avaliações',prescriptions:'Orientações e encaminhamentos',emergencies:'Emergências',financial:'Lançamentos financeiros',packages:'Pacotes',packageMovements:'Consumos de pacotes',documents:'Documentos'};
    function summary(next,current=null){return '<div class="system-backup-summary" tabindex="0" role="region" aria-label="Resumo dos registros"><table><thead><tr><th scope="col">Registros</th>'+(current?'<th scope="col">Base atual</th>':'')+'<th scope="col">Arquivo</th></tr></thead><tbody>'+TherapyData.collections.map(name=>'<tr><th scope="row">'+collectionLabels[name]+'</th>'+(current?'<td>'+current[name].length+'</td>':'')+'<td>'+next[name].length+'</td></tr>').join('')+'</tbody></table></div>';}
    async function readBackup(file){
        if(file.size>TherapyDocumentFiles.MAX_BACKUP)throw new Error('O arquivo excede o limite de 100 MB.');
        let source;try{source=JSON.parse(await file.text());}catch{throw new Error('Não foi possível ler este JSON. Escolha um backup do Gestão Terapia.');}
        let files=[],recoveryFiles=false;if(source?.format==='gestao-terapia-backup'){if(source.version!==2||source.system!=='gestao-terapia'||source.vault?.format!==format)throw Error('Versão de backup incompatível.');files=source.files;recoveryFiles=source.recoveryFiles===true;source=source.vault;}
        const protectedFile=source?.format===format;
        const next=TherapyData.normalize(protectedFile?(await decrypt(source,await askPassword('Abrir backup protegido'))).data:source,defaults,true);
        if(recoveryFiles){if(!Array.isArray(files)||new Set(files.map(file=>file?.id)).size!==files.length)throw Error('Arquivo de recuperação inválido.');const wanted=new Set(next.documents.flatMap(row=>row.files.map(file=>file.id)));files=files.filter(file=>wanted.has(file?.id));}
        await TherapyDocumentFiles.inspect(next,files);
        return {next,protectedFile,files};
    }
    async function verify(input){
        const stamp=expected,version=epoch;
        try{
            if(!key)throw new Error('Abra os registros antes de conferir.');
            const file=input.files?.[0];if(!file)return;
            const {next,protectedFile}=await readBackup(file);
            if(!key||epoch!==version||expected!==stamp||localStorage.getItem(storageKey)!==stamp)throw new Error('A base mudou durante a conferência. Escolha o arquivo novamente.');
            const matches=JSON.stringify(next)===JSON.stringify(TherapyData.normalize(JSON.parse(lastPlain),defaults,true));
            const checkedAt=new Date().toISOString();let recorded=true;
            try{localStorage.setItem('terapia_backup_check',JSON.stringify({checkedAt,protectedFile,matches}));if(protectedFile&&matches)localStorage.setItem('terapia_backup_verified_at',checkedAt);}catch{recorded=false;}
            dialog('Backup conferido',`<p>O arquivo foi lido e validado${protectedFile?' com a senha informada':''}. Nenhum registro foi substituído.</p><p>${protectedFile?'Cópia protegida por senha.':'Atenção: este arquivo antigo não está criptografado. Gere e confira um novo backup protegido.'}</p><p>${matches?'O conteúdo confere com os registros salvos agora.':'O conteúdo difere da base atual. Pode ser uma cópia antiga ou de outra base; ela não atualiza o lembrete de backup conferido.'}</p>${summary(next)}<p>Os anexos incluídos também foram decifrados e tiveram sua integridade conferida.</p><p>A conferência não é uma restauração exercitada em outro navegador e não garante que o arquivo esteja guardado fora deste dispositivo. Novas alterações exigem um novo backup.</p>${recorded?'':'<p role="alert">O arquivo foi conferido, mas não foi possível registrar a data neste navegador.</p>'}<button type="button" onclick="document.getElementById('therapy-dialog').remove()">Fechar</button>`);
            document.dispatchEvent(new Event('therapy-backup-verified'));
        }catch(error){therapyNotice(error.message,'error');}finally{input.value='';}
    }
    async function backup(){
        if(!key||!lastPlain)throw new Error('Abra os registros antes de solicitar um backup.');
        const stamp=expected,version=epoch;
        const current=()=>{if(!key||epoch!==version||expected!==stamp||localStorage.getItem(storageKey)!==stamp)throw new Error('Os dados mudaram em outra aba ou o cofre foi bloqueado. Reabra os registros antes de baixar o backup.');};
        current();const clean=TherapyData.normalize(JSON.parse(lastPlain),defaults,true,true),serialized=await TherapyDocumentFiles.bundle(await encrypt(clean),clean);current();
        download(serialized,`terapia-backup-${TherapyData.dateKey()}.json`);document.dispatchEvent(new Event('therapy-backup-requested'));therapyNotice('Backup protegido solicitado. Confira o arquivo nos downloads.');
    }
    async function restore(input) {
        const started=expected,startedEpoch=epoch;
        try {
            if(!key)throw new Error('Abra os registros antes de restaurar.');
            const file=input.files?.[0];if(!file)return;
            if(file.size>TherapyDocumentFiles.MAX_BACKUP)throw new Error('O arquivo excede o limite de 100 MB.');
            const {next,files}=await readBackup(file);
            if(!key||epoch!==startedEpoch||expected!==started)throw new Error('Os registros mudaram desde a seleção. Escolha o backup novamente.');
            const modal=dialog('Conferir restauração',`<p>A restauração substituirá todos os registros e configurações atuais pelos do arquivo. Não há mesclagem. A senha atual deste navegador continuará protegendo a base restaurada.</p>${summary(next,TherapyData.normalize(JSON.parse(lastPlain),defaults,true,true))}<p>Uma cópia protegida da base atual será guardada neste navegador e substituirá a cópia anterior existente. Baixe as cópias que desejar preservar antes de continuar. Essa cópia local não protege contra perda do dispositivo.</p><label>Digite RESTAURAR para confirmar<input id="therapy-restore-phrase" autocomplete="off"></label><div class="therapy-actions"><button id="therapy-confirm-restore">Substituir e restaurar</button><button id="therapy-cancel-restore">Cancelar</button></div><p role="alert"></p>`);
            modal.querySelector('#therapy-cancel-restore').onclick=()=>modal.remove();
            modal.querySelector('#therapy-confirm-restore').onclick=async()=>{let busy=false,committed=false;try{if(document.getElementById('therapy-restore-phrase').value!=='RESTAURAR')throw new Error('Digite RESTAURAR exatamente como exibido.');if(window.therapyActionBusy)throw new Error('Aguarde a gravação atual.');if(!key||epoch!==startedEpoch||expected!==started)throw new Error('Os registros mudaram desde a prévia. Selecione o backup novamente.');window.therapyActionBusy=true;busy=true;modal.querySelectorAll('button').forEach(b=>b.disabled=true);await TherapyDocumentFiles.stage(next,files);await save(next,true);committed=true;window.therapyActionBusy=false;busy=false;modal.remove();await unlocked(next);document.dispatchEvent(new Event('therapy-data-restored'));therapyNotice('Backup restaurado. A cópia anterior está protegida neste navegador.');}catch(error){if(committed){lock();therapyNotice('Restauração gravada e cópia anterior preservada. Reabra com a senha atual para carregar as telas.','error');return;}modal.querySelector('[role=alert]').textContent=error.message;modal.querySelectorAll('button').forEach(b=>b.disabled=false);}finally{if(busy)window.therapyActionBusy=false;}};
        }catch(error){therapyNotice(error.message,'error');}finally{input.value='';}
    }
    async function previous(){const previous=localStorage.getItem(storageKey+':before-restore');if(!previous)return therapyNotice('Nenhuma cópia anterior disponível.');download(await TherapyDocumentFiles.previousBundle(previous),'terapia-copia-anterior-protegida.json');}
    async function verifyCurrent(password){if(!key||!expected)throw new Error('Abra os registros antes de continuar.');const stamp=expected,version=epoch;const result=await decrypt(JSON.parse(stamp),password);if(!key||epoch!==version||expected!==stamp||localStorage.getItem(storageKey)!==stamp)throw new Error('Os dados mudaram em outra aba. Reabra antes de continuar.');return {data:result.data,stamp,version};}
    async function changePassword(current,password,repeat){if(typeof password!=='string'||password.length<12||password.length>200||password!==repeat)throw new Error('As novas senhas devem ser iguais e ter de 12 a 200 caracteres.');if(current===password)throw new Error('Escolha uma senha diferente da atual.');const check=await verifyCurrent(current),newSalt=crypto.getRandomValues(new Uint8Array(16)),newKey=await derive(password,newSalt),clean=TherapyData.normalize(check.data,defaults,true,true),serialized=JSON.stringify(await encrypt(clean,newKey,newSalt,iterations));if(!key||epoch!==check.version||expected!==check.stamp||localStorage.getItem(storageKey)!==check.stamp)throw new Error('Os dados mudaram em outra aba. Reabra antes de continuar.');localStorage.setItem(storageKey,serialized);key=newKey;salt=newSalt;rounds=iterations;expected=serialized;lastPlain=JSON.stringify(clean);epoch++;forgetValidation();await rememberValidation();refreshIdle();}
    async function replaceWithCheckpoint(next,password){const check=await verifyCurrent(password);if(epoch!==check.version||expected!==check.stamp)throw new Error('A base mudou. Reabra a manutenção.');await save(next,true);await unlocked(next);document.dispatchEvent(new Event('therapy-data-restored'));}
    function start(base,onUnlock){defaults=base;unlocked=onUnlock;open();}
    document.addEventListener('pointerdown',refreshIdle,{passive:true});document.addEventListener('keydown',refreshIdle);
    return {start,save,backup,verify,restore,previous,lock,dialog,changePassword,replaceWithCheckpoint,activity:refreshIdle,status:()=>({open:!!key,previous:!!localStorage.getItem(storageKey+':before-restore'),bytes:expected?.length||0}),rollback:()=>lastPlain?JSON.parse(lastPlain):null,isOpen:()=>!!key};
})();
