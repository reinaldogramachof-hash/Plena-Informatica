let therapyInitialized=false, therapyStarting=false;
window.therapyActionBusy=false;
function therapyNotice(message,type='info') {
    document.getElementById('therapy-notice')?.remove();
    const node=document.createElement('div');node.id='therapy-notice';node.className='therapy-notice';node.dataset.type=type;node.setAttribute('role',type==='error'?'alert':'status');node.textContent=message;document.body.appendChild(node);setTimeout(()=>node.remove(),7000);
}
async function bootTherapy() {
    if(therapyStarting)return;therapyStarting=true;
    if(typeof TherapyDocumentRules==='undefined'||typeof TherapyDocumentFiles==='undefined'||typeof TherapyDocuments==='undefined'||typeof TherapyExternal==='undefined'||typeof TherapyExternalRules==='undefined'||typeof TherapyCare==='undefined'||typeof TherapyCareRules==='undefined'||typeof TherapySettings==='undefined'||typeof TherapyClinicalData==='undefined'||typeof TherapyClinicalReferences==='undefined'||typeof TherapyCoverageRules==='undefined'||typeof TherapyCoverageUI==='undefined'||typeof TherapyEmergency==='undefined'||typeof TherapyAssistantRules==='undefined'||typeof TherapyAssistant==='undefined'||typeof TherapySystemRules==='undefined'||typeof TherapySystem==='undefined'||typeof TherapyManualData==='undefined'||typeof TherapyManual==='undefined'||typeof TherapyManagementRules==='undefined'||typeof TherapyManagementUI==='undefined'||typeof TherapyFinance==='undefined'||typeof TherapyPackages==='undefined'||typeof TherapyReportRules==='undefined'||typeof TherapyReports==='undefined'||typeof TherapyOrientations==='undefined'||typeof TherapyOrientationForm==='undefined'||typeof TherapyGuidanceRules==='undefined'||typeof TherapyAssessments==='undefined'||typeof TherapyAssessmentRules==='undefined'||typeof TherapyAssessmentForm==='undefined'||typeof TherapyTreatments==='undefined'||typeof TherapyTreatmentRules==='undefined'||typeof TherapyVault==='undefined'||typeof TherapyData==='undefined'||typeof TherapySidebar==='undefined'||typeof TherapyAgendaRules==='undefined'||typeof TherapyAgendaRules==='undefined'||typeof TherapyAgenda==='undefined'||typeof TherapyPatientRules==='undefined'||typeof TherapyPatients==='undefined'||typeof TherapyPatientForms==='undefined'||typeof TherapyPatientPanels==='undefined'||typeof TherapySessions==='undefined'||typeof TherapySessionRules==='undefined'||typeof TherapySessionForm==='undefined'||typeof submitTherapyAgendaSettings!=='function'||typeof initTherapyWorkflows!=='function'||typeof initTherapyOrientations!=='function'||typeof therapyTotals!=='function'||typeof renderTherapyDashboard!=='function'){
        const panel=document.createElement('div');panel.className='therapy-overlay';panel.setAttribute('role','alert');panel.innerHTML='<div class="therapy-dialog"><h2>Não foi possível carregar o sistema completo</h2><p>Os dados foram preservados. Reabra conectado à internet para concluir a atualização.</p><button onclick="location.reload()">Reabrir sistema</button></div>';document.body.appendChild(panel);return;
    }
    TherapyVault.start(defaultDB,async data=>{
        db=data;
        if(!therapyInitialized){await init();initTherapyWorkflows();therapyInitialized=true;}
        TherapyEmergency.reset();
        TherapySystem.fill();
        router('dashboard');
        if(typeof TherapyTours!=='undefined')TherapyTours.onUnlock();
    });
    if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>therapyNotice('Não foi possível preparar o acesso offline. Reabra com conexão.','error'));
}
document.addEventListener('therapy-vault-locked',()=>{
    db=JSON.parse(JSON.stringify(defaultDB));
    document.querySelectorAll('.view-section').forEach(el=>el.classList.add('hide'));
    document.querySelectorAll('.modal-backdrop').forEach(el=>el.classList.add('hidden'));
    document.getElementById('therapy-dialog')?.remove();
    document.querySelectorAll('form').forEach(form=>{if(form.id!=='activation-form')form.reset();});
    for(const id of ['patients-list','sessions-list','assessments-list','finance-table-body','schedule-timeline','today-schedule','therapy-next-session','therapy-pending-sessions','recent-emergencies','recent-emergencies-list','therapy-packages-list','patient-alerts'])document.getElementById(id)?.replaceChildren();
    document.getElementById('therapy-pending-sessions').hidden=true;
    document.querySelectorAll('select[id$="-patient"],#therapy-session-package').forEach(el=>el.replaceChildren());
    TherapyDocuments.reset();TherapyCare.reset();TherapyCoverageUI.reset();TherapySystem.reset();TherapyManual.reset();TherapyFinance.reset();TherapyPackages.reset();TherapyReports.reset();TherapyManagementUI.reset();TherapyOrientations.reset();TherapyAssessments.reset();TherapyTreatments.reset();TherapySessions.reset();TherapyPatients.reset();TherapyAgenda.reset();TherapySidebar.close(false);document.body.style.overflow='';
});
function installTherapyActions() {
    window.showNotification=therapyNotice;
    window.downloadBackup=()=>TherapyVault.backup().catch(e=>therapyNotice(e.message,'error'));
    window.restoreBackup=input=>TherapyVault.restore(input);
    const names=['saveTherapyDocument','cancelTherapyDocument','attachTherapyDocument','recordTherapyDocumentSignature','recordTherapyDocumentDelivery','resolveTherapyCareReview','saveTherapyLogo','saveTherapyCoveragePlan','saveTherapyCoverageColors','submitPatient','deletePatient','submitAppointment','submitTherapyStatus','submitSessionNotes','deleteSessionNotes','submitTreatment','deleteTreatment','submitAssessment','deleteAssessment','submitPrescription','deletePrescription','submitFinancial','deleteFinancial','submitEmergency','saveSettings','clearAllData','factoryReset','submitTherapyPackage','submitTherapyReceipt','submitTherapyAgendaSettings','submitTherapyAgendaDate','removeTherapyAgendaDate','submitTherapyAgendaBlock','removeTherapyAgendaBlock','reactivateTherapyPatient','submitTherapyPatientContact','submitTherapyPatientTask','toggleTherapyPatientTask','submitTherapyPatientStage','saveTherapySessionDraft','discardTherapySessionDraft','restoreTherapySession','archiveTherapyTreatment','submitTherapyTreatmentObjective','submitTherapyTreatmentLinks','saveTherapyAssessmentDraft','archiveTherapyAssessment','saveTherapyOrientationDraft','archiveTherapyOrientation','submitTherapyOrientationEvent','submitTherapyPackageRevision','submitTherapyPassword','submitTherapySystemReset','submitTherapyPalette','saveTherapyAssistantSettings','recordTherapyAssistantContact','saveTherapyRecurring','toggleTherapyRecurring','generateTherapyRecurring'];
    for(const name of names){
        const action=window[name];if(!action||action.therapyGuarded)continue;
        window[name]=async function(...args){
            args[0]?.preventDefault?.();
            if(window.therapyActionBusy)return therapyNotice('Aguarde a gravação atual.');
            if(!TherapyVault.isOpen())return therapyNotice('Abra os registros antes de continuar.','error');
            const tourToken=typeof TherapyTours!=='undefined'?TherapyTours.beginAction(name,args):null;
            window.therapyActionBusy=true;
            const controls=[...document.querySelectorAll('button[type=submit]')].filter(b=>!b.disabled);controls.forEach(b=>b.disabled=true);
            try{
                const result=await action(...args);
                TherapyDocuments.refresh();TherapyPatients.refresh();
                TherapySessions.refresh();
                TherapyTreatments.refresh();
                TherapyAssessments.refresh();
                TherapyOrientations.refresh();
                TherapyFinance.refresh();TherapyPackages.refresh();TherapyReports.refresh();
                if(!document.getElementById('view-dashboard').classList.contains('hide'))renderDashboard();
                if(typeof TherapyTours!=='undefined')TherapyTours.endAction(tourToken,true);
                return result;
            }catch(error){const previous=TherapyVault.rollback();if(previous)db=previous;therapyNotice(error.message,'error');if(typeof TherapyTours!=='undefined')TherapyTours.endAction(tourToken,false);}
            finally{window.therapyActionBusy=false;controls.forEach(b=>b.disabled=false);}
        };
        window[name].therapyGuarded=true;
    }
}
document.addEventListener('DOMContentLoaded',()=>{
    const header=document.querySelector('main>header');header.classList.add('app-header');
    const actions=header.lastElementChild;
    actions.insertAdjacentHTML('afterbegin','<button id="header-manual-btn" type="button" onclick="TherapyManual.openForCurrentView()" class="theme-toggle" aria-label="Guia desta tela no Manual" title="Guia desta tela no Manual"><i data-lucide="book-open" class="w-4 h-4" aria-hidden="true"></i></button><button id="theme-toggle-btn" type="button" onclick="toggleSorveteriaTheme()" class="theme-toggle" aria-label="Alternar tema claro e escuro"><i data-lucide="sun" class="theme-icon-light w-4 h-4"></i><i data-lucide="moon" class="theme-icon-dark w-4 h-4"></i></button><button type="button" onclick="TherapyVault.lock()" class="therapy-secondary" aria-label="Bloquear registros">Bloquear</button>');if(typeof lucide!=='undefined'&&typeof lucide.createIcons==='function')lucide.createIcons();
    restoreSorveteriaTheme();
    document.getElementById('patient-form').lastElementChild.insertAdjacentHTML('beforebegin','<div class="therapy-form-grid"><label>Contato de emergência do paciente<input id="therapy-patient-emergency-name"></label><label>Telefone do contato<input id="therapy-patient-emergency-phone" type="tel"></label></div>');
    document.querySelectorAll('.view-section').forEach(view=>{
        const heading=view.querySelector(':scope>div:first-child');
        // Aplica o alinhamento apenas à linha do título, nunca a um painel inteiro.
        if(heading?.querySelector(':scope>h2,:scope>div>h2'))heading.classList.add('therapy-heading');
    });
    document.querySelectorAll('label').forEach(label=>{const field=label.nextElementSibling;if(!label.htmlFor&&field?.matches('input[id],select[id],textarea[id]'))label.htmlFor=field.id;});
    document.querySelectorAll('.overflow-x-auto').forEach(el=>{el.tabIndex=0;el.setAttribute('role','region');el.setAttribute('aria-label','Tabela: deslize para conferir as colunas');});
    installTherapyActions();
});
const originalTherapyPatientModal=window.openPatientModal;
window.openPatientModal=function(id=null){originalTherapyPatientModal(id);const patient=db.patients.find(p=>p.id===id);document.getElementById('therapy-patient-emergency-name').value=patient?.emergencyName||'';document.getElementById('therapy-patient-emergency-phone').value=patient?.emergencyPhone||'';document.getElementById('btn-delete-patient').textContent='Arquivar paciente';TherapyPatientForms.fill(id);};
