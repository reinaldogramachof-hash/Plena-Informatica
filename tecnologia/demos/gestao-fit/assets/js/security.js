/* Fluxos locais de abertura, gravação e recuperação. Validação visual a cargo do usuário. */
const FitSecurity = (() => {
    let store, initialized = false, opening = false, idle, activeDialog, wasOverflow = '', privateCheck = null;
    window.fitActionBusy = false;
    const escape = value => sanitizeHTML(String(value ?? ''));
    function notice(message, type = 'info') {
        document.getElementById('fit-notice')?.remove();
        const node = document.createElement('div'); node.id = 'fit-notice'; node.dataset.type = type; node.setAttribute('role', type === 'error' ? 'alert' : 'status'); node.textContent = message; document.body.appendChild(node); setTimeout(() => node.remove(), 8000);
    }
    function closeDialog() {
        if (!activeDialog) return true;
        if (activeDialog.beforeClose?.() === false) return false;
        const opener = activeDialog.opener;
        const onCancel = activeDialog.onCancel;
        activeDialog.node.remove(); activeDialog = null; document.body.style.overflow = wasOverflow;
        onCancel?.();
        if (opener?.isConnected) opener.focus();
        return true;
    }
    function dialog(title, content, options = {}) {
        if (activeDialog?.beforeClose?.() === false) return null;
        const opener = document.activeElement;
        if (!activeDialog) wasOverflow = document.body.style.overflow;
        activeDialog?.onCancel?.();
        activeDialog?.node.remove();
        const node = document.createElement('div'); node.className = 'fit-security-overlay'; node.id = 'fit-security-dialog'; node.setAttribute('role', 'dialog'); node.setAttribute('aria-modal', 'true'); node.setAttribute('aria-labelledby', 'fit-security-title');
        const operational=options.layout==='wide',wide=options.kind==='availability';
        node.innerHTML = `<div class="fit-security-dialog${operational?' fit-operational-dialog':''}${wide?' fit-hours-dialog':''}"><header class="fit-dialog-heading"><div>${operational?'<p class="fit-dialog-eyebrow">Seu espaço de trabalho</p>':''}<h2 id="fit-security-title">${escape(title)}</h2></div>${operational?'<button type="button" class="fit-dialog-close" aria-label="Fechar janela" data-fit-dialog-close>&times;</button>':''}</header><div class="fit-dialog-body">${content}</div></div>`;
        document.body.appendChild(node); document.body.style.overflow = 'hidden'; activeDialog = { node, opener, beforeClose:options.beforeClose, onCancel:options.onClose };
        if(operational){node.querySelector('[data-fit-dialog-close]').onclick=()=>{if(window.fitActionBusy)return notice('Aguarde a gravação atual.');closeDialog();};}
        const focusable=()=>[...node.querySelectorAll('input,button,select,textarea,a[href]')].filter(el=>!el.disabled&&!el.matches?.(':disabled')&&!el.hidden&&el.type!=='hidden'&&!el.closest('[hidden]')&&el.getClientRects().length);
        node.addEventListener('keydown', event => {
            if(event.key==='Escape'&&operational){event.preventDefault();if(!window.fitActionBusy)closeDialog();return;}
            if (event.key !== 'Tab') return;
            const controls = focusable();
            const first = controls[0], last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        });
        focusable()[0]?.focus(); return node;
    }
    function formAction(modal, action) {
        modal.querySelector('form').onsubmit = async event => {
            event.preventDefault();
            if (window.fitActionBusy) return notice('Aguarde a operação atual.');
            window.fitActionBusy = true; const controls = [...modal.querySelectorAll('button')]; controls.forEach(b => b.disabled = true);
            try { await action(event); } catch (error) {
                const output=modal.querySelector('[role=alert]');
                if(modal.isConnected && output)output.textContent=error.message;
                else {store.lock();purge();opening=false;notice(error.message,'error');open();}
            }
            finally { window.fitActionBusy = false; controls.forEach(b => b.disabled = false); activity(); }
        };
    }
    function download(text, filename) {
        const url = URL.createObjectURL(new Blob([text], { type: 'application/json' })), link = document.createElement('a');
        link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    async function opened(data) {
        purge();
        db = data;
        if(typeof FitPersonalization!=='undefined')FitPersonalization.apply();
        if (!initialized) { init(); initialized = true; }
        for (const [id, field] of Object.entries({ 'biz-name': 'businessName', 'biz-owner': 'businessOwner', 'biz-doc': 'businessDoc', 'biz-hours': 'businessHours' })) document.getElementById(id).value = db.settings[field] || '';
        document.body.classList.remove('fit-data-locked'); router('dashboard'); updateTermsVisuals(); activity(); opening = false;
    }
    function purge() {
        cancelPrivateAccess();
        db = FitData.clone(defaultDB); currentCommissionData = null; clearTimeout(idle); document.body.classList.add('fit-data-locked');
        for (const id of ['agenda-list','upcoming-appts','team-list','services-list','trans-list','clients-list','recebiveis-list','recebiveis-stats','radar-container','top-services','print-area']) document.getElementById(id)?.replaceChildren();
        document.querySelectorAll('form').forEach(f => { if(f.id !== 'activation-form')f.reset(); });
        document.querySelectorAll('#biz-name,#biz-owner,#biz-doc,#biz-hours').forEach(el => el.value = '');
        document.querySelectorAll('.license-watermark,.print-header,iframe').forEach(el => el.remove());
        for(const id of ['enr-student-name','comm-pro-name'])document.getElementById(id).textContent='';
        document.querySelectorAll('#ap-service,#ap-pro,#ap-client,#enr-plan,#enr-instructor').forEach(el => el.replaceChildren());
        document.querySelectorAll('#dash-rev-today,#dash-comm-pending,#dash-mrr,#fin-income,#fin-expense,#fin-commission,#rep-inc,#rep-exp,#rep-com,#close-inc,#close-exp,#close-com,#close-bal,#comm-value').forEach(el => el.textContent = 'R$ 0,00');
        for (const id of ['apptModal','teamModal','serviceModal','expenseModal','clientModal','enrollmentModal','closingModal','commissionModal']) document.getElementById(id)?.classList.add('hidden');
        if(typeof FitRoutine!=='undefined')FitRoutine.reset();
        if(typeof FitStudents!=='undefined')FitStudents.reset();
        if(typeof FitCRM!=='undefined')FitCRM.reset();
        if(typeof FitCommerce!=='undefined')FitCommerce.reset();
        if(typeof FitSchedule!=='undefined')FitSchedule.reset();
        if(typeof FitAttendance!=='undefined')FitAttendance.reset();
        if(typeof FitTraining!=='undefined')FitTraining.reset();
        if(typeof FitTrainingLog!=='undefined')FitTrainingLog.reset();
        if(typeof FitFinance!=='undefined')FitFinance.reset();
        if(typeof FitAssistant!=='undefined')FitAssistant.reset();
        if(typeof FitPersonalization!=='undefined')FitPersonalization.reset();
    }
    function lock(show = true, force = false) {
        if (!force && (window.fitActionBusy || store?.status().busy)) return notice('Aguarde a gravação antes de bloquear.');
        store?.lock(); purge(); closeDialog(); opening = false;
        if (show && window.fitLicenseReady) open();
    }
    function activity() {
        clearTimeout(idle);
        store?.activity();
        if (store?.status().open) idle = setTimeout(() => { if (window.fitActionBusy) activity(); else lock(); }, 15 * 60000);
    }
    function passwordFields(prefix, confirm = true) {
        return `<label>Senha${confirm ? ' (12 a 200 caracteres)' : ''}<input id="${prefix}-password" type="password" ${confirm ? 'minlength="12" maxlength="200" autocomplete="new-password"' : 'autocomplete="current-password"'} required></label>${confirm ? `<label>Repita a senha<input id="${prefix}-repeat" type="password" minlength="12" maxlength="200" autocomplete="new-password" required></label>` : ''}`;
    }
    function summary(preview) {
        const labels = { clients:'alunos',appointments:'agendamentos',team:'instrutores',services:'planos',transactions:'lançamentos',enrollments:'matrículas',trainingExercises:'exercícios da biblioteca',trainingPrograms:'fichas de treino e modelos',trainingVersions:'versões de treino',trainingSessions:'execuções de treino (inclui canceladas)',trainingSessionRevisions:'registros e correções de execução',trainingSessionsVoided:'execuções canceladas',financeAccounts:'contas financeiras',financeAdjustments:'ajustes de valores',financeRecurrences:'modelos de despesas recorrentes',financeReconciliations:'conferências financeiras',assistantContacts:'contatos e adiamentos' };
        return `<div class="fit-security-summary"><ul>${Object.entries(preview.report.counts).map(([key,value])=>`<li>${value} ${labels[key]}</li>`).join('')}</ul><p>${preview.protected ? 'Arquivo protegido por senha.' : 'Backup antigo em texto: será protegido ao gravar.'}</p><p>${preview.report.issues.length ? `${preview.report.issues.length} vínculo(s) precisam de conferência. Os registros serão preservados sem associar por nome ou apagar históricos.` : 'Não foram encontrados vínculos ausentes nas referências conferidas.'}</p>${preview.report.issues.length ? `<details><summary>Conferir referências</summary><ul>${preview.report.issues.slice(0,30).map(i=>`<li>${escape(i.collection)} / ${escape(i.id)}: ${escape(i.field)}</li>`).join('')}</ul>${preview.report.issues.length>30?'<p>Mostrando as primeiras 30 referências.</p>':''}</details>` : ''}</div>`;
    }
    function askPassword(title) {
        return new Promise((resolve,reject) => {
            const modal = dialog(title, `<form>${passwordFields('fit-backup',false)}<div class="fit-security-actions"><button type="submit">Conferir</button><button type="button" id="fit-cancel-password">Cancelar</button></div></form>`);
            activeDialog.onCancel=()=>reject(new Error('Operação cancelada.'));
            modal.querySelector('form').onsubmit = event => { event.preventDefault(); const password = modal.querySelector('input').value; activeDialog.onCancel=null; closeDialog(); resolve(password); };
            modal.querySelector('#fit-cancel-password').onclick = closeDialog;
        });
    }
    function cancelPrivateAccess(){privateCheck?.cancel();}
    function confirmPrivateAccess(){
        if(!store?.status().open||window.fitActionBusy||document.hidden||privateCheck)return Promise.resolve(false);
        return new Promise(resolve=>{
            let finished=false,verifying=false,modal;
            const finish=allowed=>{if(finished)return;finished=true;const input=modal?.querySelector('#fit-private-password');if(input)input.value='';if(privateCheck?.node===modal)privateCheck=null;resolve(allowed);};
            modal=dialog('Confirmar acesso à ficha reservada',`<p>Informe a mesma senha de abertura do cofre para revelar os dados pessoais e de saúde deste aluno.</p><form id="fit-private-access-form"><label>Senha atual do cofre<input id="fit-private-password" type="password" maxlength="200" autocomplete="current-password" required></label><p role="alert"></p><div class="fit-dialog-actions"><button type="button" id="fit-private-cancel" class="fit-secondary">Cancelar</button><button type="submit" class="fit-primary">Confirmar e revelar</button></div></form><p class="fit-muted">A conferência vale somente para esta abertura. Após recolher a ficha, sair desta área ou aguardar o prazo, a senha será solicitada novamente.</p>`,{layout:'wide',onClose:()=>finish(false)});
            if(!modal){finish(false);return;}
            privateCheck={node:modal,cancel(){finish(false);if(activeDialog?.node===modal)closeDialog();}};
            modal.querySelector('#fit-private-cancel').onclick=()=>{if(activeDialog?.node===modal)closeDialog();else finish(false);};
            modal.querySelector('form').onsubmit=async event=>{
                event.preventDefault();if(finished||verifying)return;
                const output=modal.querySelector('[role=alert]');
                if(!store?.status().open||window.fitActionBusy){output.textContent='Abra os registros e aguarde a operação atual.';return;}
                const input=modal.querySelector('#fit-private-password');let password=input.value;input.value='';
                if(!password){output.textContent='Informe a senha atual do cofre.';input.focus();return;}
                verifying=true;output.textContent='Conferindo a senha…';const submit=modal.querySelector('button[type=submit]');submit.disabled=true;
                try{
                    await store.verifyPassword(password);
                    if(finished||document.hidden||!modal.isConnected||activeDialog?.node!==modal||!store.status().open){finish(false);if(activeDialog?.node===modal)closeDialog();return;}
                    finish(true);closeDialog();activity();
                }catch(error){
                    if(finished)return;
                    if(!modal.isConnected||!store.status().open){finish(false);if(activeDialog?.node===modal)closeDialog();return;}
                    output.textContent='Senha não confirmada. Confira a senha atual do cofre e tente novamente.';input.focus();
                }finally{password='';verifying=false;if(!finished&&modal.isConnected)submit.disabled=false;}
            };
        });
    }
    async function readFile(file) {
        if (file.size > 20000000) throw new Error('O arquivo excede o limite de 20 MB.');
        const text = await file.text(); let source; try { source = JSON.parse(text); } catch { throw new Error('Arquivo JSON inválido. Os registros atuais foram preservados.'); }
        return store.prepare(text, source?.format === FitVaultStore.format ? await askPassword('Senha do backup') : undefined);
    }
    function recovery(message) {
        opening = true;
        const modal = dialog('Recuperar registros', `<p>${escape(message)}</p><p>O original não foi apagado. Guarde uma cópia antes de conferir um backup válido.</p><div class="fit-security-actions"><button id="fit-original">Guardar original</button></div><label>Selecionar backup<input type="file" id="fit-recovery-file" accept=".json"></label><p role="alert"></p>`);
        modal.querySelector('#fit-original').onclick = () => download(store.raw() || '', 'fit-original-preservado.json');
        modal.querySelector('#fit-recovery-file').onchange = async event => {
            const file = event.target.files?.[0]; if (!file) return;
            try {
                const preview = await readFile(file);
                const confirm = dialog('Proteger a recuperação', `<p>A gravação só ocorrerá após sua confirmação. O original também ficará em uma cópia protegida neste navegador.</p>${summary(preview)}<form>${passwordFields('fit-recovery')}<label><input type="checkbox" required>Conferi o backup e quero substituir a base ilegível.</label><div class="fit-security-actions"><button type="submit">Proteger e recuperar</button><button type="button" id="fit-recovery-cancel">Cancelar</button></div><p role="alert"></p></form>`);
                confirm.querySelector('#fit-recovery-cancel').onclick = () => recovery(message);
                formAction(confirm, async () => { const data = await store.recover(preview, document.getElementById('fit-recovery-password').value, document.getElementById('fit-recovery-repeat').value); closeDialog(); await opened(data); notice('Registros recuperados e protegidos.'); });
            } catch(error) { recovery(error.message); }
        };
    }
    async function open() {
        if (opening || store.status().open || !window.fitLicenseReady) return;
        opening = true;
        let status; try { status = store.load(); } catch(error) { recovery(error.message); return; }
        if(status.protected){
            let resumed;try{resumed=await store.resume();}catch{}
            if(!window.fitLicenseReady){store.lock();opening=false;return;}
            if(resumed){await opened(resumed);return;}
        }
        const modal = dialog(status.protected ? 'Abrir seus registros' : 'Proteger seus registros', `<p>${status.protected ? 'Informe a senha local dos registros.' : 'Defina uma senha para proteger os dados e os backups do Gestão Fit. Os registros existentes serão preservados.'}</p><p>Guarde a senha em local seguro. Sem a senha correspondente, os registros e backups protegidos não poderão ser abertos.</p><form id="fit-unlock-form">${passwordFields('fit-vault',!status.protected)}<button type="submit">${status.protected ? 'Abrir registros' : 'Proteger e continuar'}</button><p role="alert"></p></form><details><summary>Preciso recuperar de um backup</summary><button type="button" id="fit-show-recovery">Conferir recuperação</button></details>`);
        modal.querySelector('#fit-show-recovery').onclick = () => recovery('Selecione um backup válido para substituir a base atual após a conferência.');
        formAction(modal, async () => { const data = await store.unlock(document.getElementById('fit-vault-password').value, document.getElementById('fit-vault-repeat')?.value); closeDialog(); await opened(data); });
    }
    async function persist(data, checkpoint = false) {
        try { const saved = await store.save(data, checkpoint); activity(); return saved; }
        catch(error) { const last = store.snapshot(); if (last) db = last; throw error; }
    }
    async function backup() {
        try { const content = await store.backup(); download(content, `fit-backup-${FitData.dateKey()}.json`); notice('Backup protegido solicitado. Confira o arquivo nos downloads e guarde a senha correspondente.'); }
        catch(error) { notice(error.message,'error'); }
    }
    async function restore(input, verifyOnly = false) {
        const file = input.files?.[0]; input.value = ''; if (!file) return;
        if (!store.status().open || window.fitActionBusy) return notice('Abra os registros e aguarde a gravação atual.','error');
        try {
            const preview = await readFile(file);
            if (!store.status().open) throw new Error('Os registros foram bloqueados. Abra antes de conferir novamente.');
            const modal = dialog(verifyOnly ? 'Conferência de backup' : 'Conferir restauração', `${summary(preview)}${verifyOnly ? '<p>Conferência de estrutura concluída; nenhum registro foi substituído. A restauração em ambiente separado continua sendo a prova de recuperação.</p><button id="fit-close-preview">Fechar</button>' : '<p>A restauração substituirá a base atual. A cópia anterior ficará protegida neste navegador; ela não substitui um backup externo.</p><form><label><input type="checkbox" required>Conferi os registros e quero substituir a base atual.</label><div class="fit-security-actions"><button type="submit">Substituir e restaurar</button><button type="button" id="fit-close-preview">Cancelar</button></div><p role="alert"></p></form>'}`);
            modal.querySelector('#fit-close-preview').onclick = closeDialog;
            if (!verifyOnly) formAction(modal, async () => { const data = await store.restore(preview); closeDialog(); await opened(data); notice('Backup restaurado. A cópia anterior está protegida neste navegador.'); });
        } catch(error) { notice(error.message,'error'); }
    }
    function password() {
        const modal = dialog('Alterar senha dos registros', `<p>A alteração protege a base atual. Backups já baixados e cópias anteriores continuam com a senha antiga.</p><form><label>Senha atual<input id="fit-current-password" type="password" required autocomplete="current-password"></label>${passwordFields('fit-new')}<div class="fit-security-actions"><button type="submit">Alterar senha</button><button type="button" id="fit-cancel-change">Cancelar</button></div><p role="alert"></p></form>`);
        modal.querySelector('#fit-cancel-change').onclick = closeDialog;
        formAction(modal, async () => { await store.changePassword(document.getElementById('fit-current-password').value,document.getElementById('fit-new-password').value,document.getElementById('fit-new-repeat').value); closeDialog(); notice('Senha alterada. Guarde um novo backup protegido.'); });
    }
    function previous() { const content = store.previous(); if (!content) return notice('Nenhuma cópia anterior disponível.'); download(content,'fit-copia-anterior-protegida.json'); }
    async function extractOriginal(input) {
        const file=input.files?.[0];input.value='';if(!file)return;
        try{if(file.size>20000000)throw new Error('O arquivo excede 20 MB.');const text=await file.text(),password=await askPassword('Senha da cópia de recuperação');download(await store.originalFromRecovery(text,password),'fit-original-recuperado.json');notice('Original extraído. Pode conter dados pessoais; guarde em local seguro.');}catch(error){notice(error.message,'error');}
    }
    function maintenance(reset) {
        const modal = dialog(reset ? 'Reiniciar cadastros e configurações' : 'Limpar registros operacionais', `<p>${reset ? 'Alunos, agenda, matrículas, lançamentos, treinos, histórico de execuções, biblioteca e preferências serão substituídos pelos padrões iniciais.' : 'Alunos, agenda, matrículas, lançamentos e fichas individuais de treino, histórico de execuções, contas/ajustes/conferências financeiras e histórico de contatos serão removidos. Biblioteca de exercícios, modelos de treino, modelos de despesas recorrentes, planos, instrutores e configurações serão preservados.'} A licença e a senha atual serão mantidas. Guarde primeiro um backup externo. Uma cópia protegida anterior também será preservada neste navegador.</p><form><label>Senha atual<input type="password" id="fit-maintenance-password" required autocomplete="current-password"></label><label>Digite LIMPAR para confirmar<input id="fit-maintenance-confirm" required pattern="LIMPAR" autocomplete="off"></label><div class="fit-security-actions"><button type="submit">Confirmar limpeza</button><button type="button" id="fit-cancel-maintenance">Cancelar</button></div><p role="alert"></p></form>`);
        modal.querySelector('#fit-cancel-maintenance').onclick = closeDialog;
        formAction(modal,async()=>{if(document.getElementById('fit-maintenance-confirm').value!=='LIMPAR')throw new Error('Digite LIMPAR para confirmar.');await store.verifyPassword(document.getElementById('fit-maintenance-password').value);const next=reset?FitData.clone(defaultDB):{...FitData.clone(db),clients:[],appointments:[],transactions:[],enrollments:[]};let cleared=reset?next:FitTrainingRules.clearStudents(next);if(!reset&&typeof FitFinanceRules!=='undefined')cleared=FitFinanceRules.clearOperations(cleared);if(!reset&&typeof FitAssistantRules!=='undefined')cleared=FitAssistantRules.clearOperations(cleared);const data=await persist(cleared,true);closeDialog();await opened(data);notice('Limpeza concluída. A cópia anterior foi preservada.');});
    }
    function guards() {
        const names=['submitAppt','submitTeam','submitService','submitExpense','submitClient','submitEnrollment','finishAppt','cancelAppt','handlePayEnrollment','confirmCommissionPayment','saveBusinessInfo','confirmTerms','submitFitProfile','submitFitCRM','submitFitCRMEvent','submitFitStudentProfile','submitFitAssessment','toggleFitStudentArchive','submitFitPayment','submitFitContractAction','submitFitCompletion','submitFitAvailability','submitFitScheduleBlock','releaseFitScheduleBlock','submitFitAttendance','submitFitExercise','submitFitProgram','submitFitTrainingCopy','archiveFitExercise','archiveFitProgram','submitFitTrainingLog','voidFitTrainingLog','submitFitFinance','submitFitAssistant','submitFitPersonalization'];
        for (const name of names) {
            const action = window[name];
            window[name] = async function(...args) {
                args[0]?.preventDefault?.();
                if (!store.status().open) return notice('Abra os registros antes de continuar.','error');
                if (window.fitActionBusy) return notice('Aguarde a gravação atual.');
                window.fitActionBusy = true;
                const controls=[...document.querySelectorAll('button[type=submit]')].filter(b=>!b.disabled);controls.forEach(b=>b.disabled=true);
                try { const result=await action(...args);if(store.status().open){FitRoutine.render();if(typeof FitStudents!=='undefined'&&typeof FitStudents.refreshOperational==='function')FitStudents.refreshOperational();}return result; }
                catch(error) { const previous=store.snapshot();if(previous)db=previous;notice(error.message,'error'); }
                finally { window.fitActionBusy=false;controls.forEach(b=>b.disabled=false);activity(); }
            };
        }
        window.downloadBackup=backup;window.restoreBackup=restore;window.clearAllData=()=>maintenance(false);window.factoryReset=()=>maintenance(true);window.showNotification=notice;
        // Uma tela ou documento não pode ser aberto por ação tardia depois do bloqueio.
        for(const name of ['router','openApptModal','openTeamModal','openServiceModal','openExpenseModal','editTransaction','openClientModal','openEnrollmentModal','openClosingModal','payCommission','shareCommissionWhatsApp','printCommissionReceipt','shareReport','shareClosing','printClosing','printReport','printFinanceReport']){
            const original=window[name];window[name]=function(...args){if(!store.status().open)return notice('Abra os registros antes de continuar.','error');return original(...args);};
        }
    }
    async function setup() {
        const validation=await FitValidationSession.configuration();
        store=FitVaultStore.create({defaults:defaultDB,validation});
        document.getElementById('view-settings').insertAdjacentHTML('beforeend',`<section class="fit-security-panel"><h3>Proteção e recuperação</h3><p>Registros e backups protegidos com sua senha local. Bloqueio após 15 minutos sem atividade. Uma cópia no mesmo navegador não protege contra a perda do dispositivo.</p><div class="fit-security-actions"><button type="button" onclick="FitSecurity.lock()">Bloquear registros</button><button type="button" onclick="FitSecurity.password()">Alterar senha</button><button type="button" onclick="FitSecurity.previous()">Baixar cópia anterior</button></div><label class="block mt-4">Conferir um backup sem restaurar<input type="file" accept=".json" onchange="FitSecurity.restore(this,true)" class="block mt-2"></label><details class="mt-4"><summary>Original preservado de uma recuperação</summary><p>Se uma base ilegível foi substituída, a cópia anterior contém o original protegido com a senha definida na recuperação. Selecione essa cópia para extrair o original.</p><input type="file" accept=".json" onchange="FitSecurity.extractOriginal(this)"></details></section>`);
        const actions=document.querySelector('main>header>div:last-child');actions.insertAdjacentHTML('afterbegin','<button type="button" onclick="FitSecurity.lock()" class="px-3 py-2 text-sm border border-[var(--color-border)] rounded" aria-label="Bloquear registros">Bloquear</button>');
        if(validation.enabled)document.querySelector('.fit-security-panel')?.insertAdjacentHTML('beforeend','<p>Abertura mantida nesta aba para validação local. O bloqueio manual, a inatividade e o prazo da sessão encerram essa facilidade.</p>');
        guards();
        document.addEventListener('pointerdown',activity,{passive:true});document.addEventListener('keydown',activity);
        window.addEventListener('storage',event=>{if((event.key===DB_KEY||event.key===null)&&store.status().open){lock(false,true);notice('A base mudou em outra aba. Reabra os registros antes de continuar.','error');if(window.fitLicenseReady)open();}});
        if(window.fitLicenseReady)open();
        if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>notice('Não foi possível preparar o acesso offline. Reabra conectado para concluir.','error'));
    }
    document.addEventListener('fit-license-unlocked',()=>{if(store)open();});
    document.addEventListener('fit-license-locked',()=>{window.fitLicenseReady=false;if(store)lock(false,true);});
    document.addEventListener('DOMContentLoaded',setup);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelPrivateAccess();});
    return {persist,lock,open,backup,restore,password,previous,extractOriginal,dialog,closeDialog,confirmPrivateAccess,cancelPrivateAccess,snapshot:()=>store?.snapshot(),isOpen:()=>!!store?.status().open,notice};
})();
