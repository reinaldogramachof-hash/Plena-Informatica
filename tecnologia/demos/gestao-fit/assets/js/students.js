/* Ficha privada do aluno. Ações e envios permanecem sob controle do profissional. */
const FitStudents = (() => {
    let selected='',dirty=false,privateVisible=false,namesVisible=false,privateTimer,namesTimer,privateDraft=null,page=0,activeTab='overview',opener=null,trainingPageIndex=0,privateRequest=0,privateOpening=false;
    const tabs=['overview','plans','training','relationship','privacy','private','history'];
    const esc=value=>sanitizeHTML(String(value??''));
    const available=()=>typeof FitSecurity!=='undefined'&&FitSecurity.isOpen();
    const labels={weightKg:'Peso (kg)',heightCm:'Altura (cm)',waistCm:'Cintura (cm)',hipCm:'Quadril (cm)',chestCm:'Tórax (cm)',armCm:'Braço (cm)',thighCm:'Coxa (cm)'};
    const intakeLabels={activityHistory:'Histórico de atividade física',healthNotes:'Condições de saúde relatadas',medications:'Medicamentos informados',injuries:'Dores, lesões ou cirurgias relatadas',professionalGuidance:'Orientações e restrições recebidas de profissionais de saúde'};
    const preferences={'':'Não informada',whatsapp:'WhatsApp',phone:'Ligação',email:'E-mail',none:'Não deseja contato por mensagem'};
    const preference=p=>`<label>Preferência de contato<select id="fit-student-contactPreference">${Object.entries(preferences).map(([key,label])=>`<option value="${key}" ${key===(p.contactPreference||'')?'selected':''}>${label}</option>`).join('')}</select></label>`;
    const edited=el=>el.tagName==='SELECT'?[...el.options].some(option=>option.selected!==option.defaultSelected):el.value!==el.defaultValue;
    function field(id,label,value='',type='text',max=4000) {return `<label>${esc(label)}<input id="${id}" type="${type}" value="${esc(value)}" maxlength="${max}" ${type==='date'?'max="'+FitData.dateKey()+'"':''}></label>`;}
    function area(id,label,value='') {return `<label>${esc(label)}<textarea id="${id}" rows="3" maxlength="4000">${esc(value)}</textarea></label>`;}
    function mayLeave(){return !dirty||confirm('Há alterações na ficha ainda não salvas. Deseja descartá-las?');}
    function revokePrivateAccess(){privateRequest++;privateOpening=false;if(typeof FitSecurity!=='undefined')FitSecurity.cancelPrivateAccess?.();}
    function wipePrivate(){revokePrivateAccess();clearTimeout(privateTimer);privateVisible=false;privateDraft=null;document.getElementById('fit-student-private-root')?.replaceChildren();}
    function beforeNavigate(view){if(view==='clients')return true;if(window.fitActionBusy||!mayLeave())return false;reset();return true;}
    function renderList(requestedPage=0) {
        if(!available())return;
        const records=FitCRMRules.list(db,{query:document.getElementById('fit-student-search')?.value||'',status:document.getElementById('fit-student-status')?.value||'active',stage:document.getElementById('fit-crm-stage-filter')?.value||'all',attention:document.getElementById('fit-crm-attention-filter')?.value||'all',names:namesVisible});
        const pages=Math.max(1,Math.ceil(records.length/20));page=Math.max(0,Math.min(Number(requestedPage)||0,pages-1));
        const count=document.getElementById('fit-student-count');if(count)count.textContent=records.length+' aluno(s) nesta seleção · '+db.clients.length+' cadastrado(s) · '+(namesVisible?'nomes completos por até 1 minuto':'primeiro nome e iniciais');
        const toggle=document.getElementById('fit-crm-names');if(toggle){toggle.textContent=namesVisible?'Abreviar sobrenomes':'Exibir nomes completos';toggle.setAttribute?.('aria-pressed',String(namesVisible));}
        document.getElementById('clients-list').innerHTML=records.length?records.slice(page*20,page*20+20).map(c=>`<tr><td class="px-6 py-4"><button type="button" class="fit-text-button" onclick="FitStudents.open('${c.id}')">${esc(c.label)}</button><small class="fit-student-code">Código: ${esc(c.id)}</small></td><td class="px-6 py-4">${esc(FitCRMRules.stages[c.stage])}</td><td class="px-6 py-4">${c.tags.map(t=>'<span class="fit-crm-tag">'+esc(t)+'</span>').join('')||'—'}</td><td class="px-6 py-4">${c.lastVisit?esc(fmtDate(c.lastVisit)):'Sem aula concluída'}</td><td class="px-6 py-4 ${c.late?'fit-crm-late':''}">${c.nextContact?esc(fmtDate(c.nextContact)):'Não definido'}${c.requests?'<small class="fit-student-code">'+c.requests+' solicitação(ões) pendente(s)</small>':''}</td><td class="px-6 py-4"><button type="button" class="fit-secondary" onclick="FitStudents.open('${c.id}')">Acompanhar</button></td></tr>`).join(''):'<tr><td colspan="6" class="px-6 py-8 text-center">Nenhum aluno nesta seleção.</td></tr>';
        const pagination=document.getElementById('fit-crm-pagination');if(pagination)pagination.innerHTML=pages>1?'<button type="button" class="fit-secondary" onclick="FitStudents.page(-1)" '+(page===0?'disabled':'')+'>Anterior</button><span>'+(page+1)+' de '+pages+'</span><button type="button" class="fit-secondary" onclick="FitStudents.page(1)" '+(page===pages-1?'disabled':'')+'>Próxima</button>':'';
        lucide.createIcons();
    }
    function toggleNames(){if(!available()||window.fitActionBusy)return;namesVisible=!namesVisible;clearTimeout(namesTimer);if(namesVisible)namesTimer=setTimeout(()=>{namesVisible=false;renderList(page);},60000);renderList(page);}
    function privateFields(){return [...(document.getElementById('fit-student-private-root')?.querySelectorAll('input,textarea,select')||[])];}
    function hasPrivateChanges(){return !!privateDraft||privateFields().some(edited);}
    function hasCRMChanges(){return [...(document.getElementById('fit-crm-form')?.querySelectorAll('input,textarea,select')||[])].some(edited);}
    function maskPrivate(){
        revokePrivateAccess();clearTimeout(privateTimer);if(!privateVisible){updatePrivacy();return;}
        const root=document.getElementById('fit-student-private-root'),focused=root?.contains?.(document.activeElement);
        const fields=privateFields();if(fields.some(edited))privateDraft=fields.map(el=>[el.id,el.value]);
        privateVisible=false;root?.replaceChildren();updatePrivacy();if(focused&&!document.hidden)document.getElementById('fit-student-reveal')?.focus();
    }
    function updatePrivacy(){const button=document.getElementById('fit-student-reveal');if(button){button.textContent=privateOpening?'Confirme a senha do cofre':privateVisible?'Recolher ficha reservada':privateDraft?'Retomar ficha reservada com senha':'Revelar ficha com senha';button.disabled=privateOpening;}button?.setAttribute?.('aria-expanded',String(privateVisible));}
    async function revealPrivate(){
        if(!available()||window.fitActionBusy||!selected||privateOpening)return;
        if(activeTab!=='private')selectTab('private');
        if(privateVisible){maskPrivate();return;}
        const id=selected,request=++privateRequest;privateOpening=true;updatePrivacy();
        let allowed=false;
        try{allowed=typeof FitSecurity.confirmPrivateAccess==='function'&&await FitSecurity.confirmPrivateAccess();}
        catch(error){if(request===privateRequest&&available())FitSecurity.notice('Não foi possível conferir o acesso à ficha. Tente novamente.','error');}
        finally{if(request===privateRequest){privateOpening=false;updatePrivacy();}}
        if(!allowed||request!==privateRequest||!available()||selected!==id||activeTab!=='private'||document.hidden||window.fitActionBusy)return;
        privateVisible=true;renderPrivateDetail();if(privateDraft){for(const [id,value]of privateDraft){const el=document.getElementById(id);if(el)el.value=value;}const entry=document.getElementById('fit-assessment-entry');if(entry)entry.open=true;}
        updatePrivacy();clearTimeout(privateTimer);privateTimer=setTimeout(()=>{if(window.fitActionBusy){privateTimer=setTimeout(maskPrivate,5000);return;}maskPrivate();},60000);
    }
    function renderDetail(){
        if(!available()||!selected)return;
        const c=FitStudentRules.student(db,selected);
        const root=document.getElementById('fit-student-root');root.hidden=false;
        root.innerHTML=FitCRM.sheet(c)+'<section id="fit-student-panel-private" role="tabpanel" aria-labelledby="fit-student-tab-private" hidden><div class="fit-crm-privacy"><div><strong>Ficha reservada</strong><p>Contato, anamnese, avaliações, contratos e histórico completo aparecem somente após conferir novamente a senha do cofre. A ficha volta a ficar recolhida após 1 minuto ou ao sair desta área. Rascunhos ficam apenas nesta sessão até salvar ou descartar.</p></div><button id="fit-student-reveal" type="button" class="fit-secondary" aria-expanded="false" aria-controls="fit-student-private-root" onclick="FitStudents.revealPrivate()">Revelar ficha reservada</button></div><div id="fit-student-private-root"></div></section>';
        const directory=document.getElementById('fit-student-directory');if(directory)directory.hidden=true;
        if(privateVisible&&activeTab==='private')renderPrivateDetail();updatePrivacy();syncTabs();
    }
    function syncTabs(){
        for(const tab of tabs){const panel=document.getElementById('fit-student-panel-'+tab),button=document.getElementById('fit-student-tab-'+tab);if(panel)panel.hidden=tab!==activeTab;button?.setAttribute?.('aria-selected',String(tab===activeTab));button?.setAttribute?.('tabindex',tab===activeTab?'0':'-1');}
        const form=document.getElementById('fit-crm-form');if(form)form.hidden=!['relationship','privacy'].includes(activeTab);
        if(activeTab==='history')FitCRM.inlineHistory(selected);else document.getElementById('fit-crm-history-root')?.replaceChildren();
        refreshOperational();
    }
    function refreshOperational(){
        if(!available()||!selected)return;
        const summary=FitStudentOverview.summarize(db,selected),roots={overview:'fit-student-overview-root',plans:'fit-student-plans-root',training:'fit-student-training-root'};
        for(const [tab,id]of Object.entries(roots)){const root=document.getElementById(id);if(!root)continue;if(tab!==activeTab){root.replaceChildren();continue;}
            if(tab==='overview')root.innerHTML=FitStudentOverview.markup(summary);
            if(tab==='plans')root.innerHTML='<div class="fit-overview-heading"><div><h4>Plano e aulas</h4><p>Condições contratadas, períodos e capacidade de agendamento.</p></div>'+(!summary.archived?'<button type="button" class="fit-primary" onclick="FitStudents.overviewAction(\'enroll\')">Contratar plano</button>':'')+'</div>'+FitCommerce.studentContracts(selected)+'<div class="fit-overview-meeting"><h4>Próximas aulas</h4>'+summary.upcoming.slice(0,8).map(a=>'<p>'+esc(fmtDate(a.date))+' · '+esc(a.time)+' · '+esc(a.service)+' <button type="button" class="fit-text-button" onclick="FitStudents.overviewAction(\'appointment\',\''+a.id+'\')">Abrir aula</button></p>').join('')+(summary.upcoming.length?'':'<p>Nenhuma próxima aula agendada.</p>')+(summary.upcoming.length>8?'<p class="fit-muted">Mais '+(summary.upcoming.length-8)+' aula(s) futura(s). Consulte a Agenda para o período completo.</p>':'')+'</div>';
            if(tab==='training')root.innerHTML=FitStudentOverview.trainingMarkup(summary,trainingPageIndex);
        }
    }
    function trainingPage(index){if(!available()||window.fitActionBusy||activeTab!=='training')return;trainingPageIndex=Math.max(0,Number(index)||0);refreshOperational();}
    function overviewAction(kind,key=''){
        if(!available()||window.fitActionBusy||!selected)return;
        if(['plans','training','relationship'].includes(kind)){selectTab(kind);return;}
        try{
            const id=selected,c=FitStudentRules.student(db,id);
            if(kind==='appointment'&&!db.appointments.some(a=>a.id===key&&a.clientId===id))throw new Error('A aula não pertence a este aluno ou não está mais disponível.');
            const p=['openTraining','logTraining'].includes(kind)?db.training?.programs.find(p=>p.id===key&&p.kind==='student'&&p.studentId===id):null;
            if(['openTraining','logTraining'].includes(kind)&&!p)throw new Error('A ficha de treino não está mais disponível para este aluno.');
            if(['schedule','enroll','newTraining','logTraining'].includes(kind)&&FitStudentRules.archived(c))throw new Error('Reative o aluno antes de registrar novas atividades.');
            if(kind==='logTraining'&&(p.archived||p.versions.at(-1).startsOn>FitData.dateKey()))throw new Error('Confira uma ficha ativa cujo início já ocorreu.');
            if(!['appointment','schedule','enroll','openTraining','logTraining','newTraining','trainingHistory'].includes(kind)||!prepareCRMAction())return;
            if(kind==='appointment')FitSchedule.openAppointment(key);
            if(kind==='schedule'){const summary=FitStudentOverview.summarize(db,id);openApptModal();document.getElementById('ap-client').value=id;if(summary.primary?.state==='current'&&db.services.some(s=>s.id===summary.primary.planId))document.getElementById('ap-service').value=summary.primary.planId;FitCommerce.configureAppointment(true);FitSchedule.previewForm();}
            if(kind==='enroll')openEnrollmentModal(id);
            if(kind==='openTraining')FitTraining.openProgram(p.id,p.versions.at(-1).id);
            if(kind==='logTraining')FitTrainingLog.open(p.id,p.versions.at(-1).id);
            if(kind==='newTraining')FitTraining.begin('student',id);
            if(kind==='trainingHistory')FitTrainingLog.history(id);
        }catch(error){FitSecurity.notice(error.message,'error');}
    }
    function selectTab(tab){if(!available()||window.fitActionBusy||!selected||!tabs.includes(tab))return;if(activeTab===tab)return;if(activeTab==='private')maskPrivate();activeTab=tab;syncTabs();}
    function tabKey(event,tab){let next=tabs.indexOf(tab);if(event.key==='ArrowRight')next=(next+1)%tabs.length;else if(event.key==='ArrowLeft')next=(next+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();selectTab(tabs[next]);document.getElementById('fit-student-tab-'+tabs[next])?.focus();}
    function prepareCRMAction(){if(!available()||window.fitActionBusy||!mayLeave())return false;if(dirty){dirty=false;wipePrivate();renderDetail();}return true;}
    function crmSaved(id){maskPrivate();dirty=!!privateDraft;renderList(page);if(selected===id){renderDetail();if(dirty)changed();}}
    function open(id) {
        if(!available()||window.fitActionBusy||!mayLeave())return;
        FitStudentRules.student(db,id);opener=document.activeElement;wipePrivate();selected=id;dirty=false;activeTab='overview';trainingPageIndex=0;router('clients');renderDetail();
        document.getElementById('fit-student-root').scrollIntoView({behavior:'smooth',block:'start'});document.getElementById('fit-student-heading')?.focus({preventScroll:true});
    }
    function close() {if(!available()||window.fitActionBusy||!mayLeave())return;wipePrivate();selected='';dirty=false;activeTab='overview';const root=document.getElementById('fit-student-root');root.replaceChildren();root.hidden=true;const directory=document.getElementById('fit-student-directory');if(directory)directory.hidden=false;renderList(page);if(opener?.isConnected)opener.focus();else document.getElementById('fit-student-search')?.focus();opener=null;}
    function editContact(){if(!available()||window.fitActionBusy||!mayLeave())return;dirty=false;wipePrivate();renderDetail();openClientModal(FitStudentRules.student(db,selected));}
    function renderPrivateDetail() {
        if(!available()||!selected)return;
        const c=FitStudentRules.student(db,selected),p=c.fitProfile||{},inactive=FitStudentRules.archived(c),assessments=(c.assessments||[]).slice().sort((a,b)=>b.date.localeCompare(a.date)||(b.createdAt||'').localeCompare(a.createdAt||'')||b.id.localeCompare(a.id));
        const history=FitStudentRules.history(db,c.id),comparison=FitStudentRules.comparison(c).filter(m=>m.first),today=FitData.dateKey();
        document.getElementById('fit-student-private-root').innerHTML=`
        <section class="fit-panel fit-student-sheet"><div class="fit-panel-heading"><div><p class="fit-muted">Ficha individual · Código ${esc(c.id)}</p><h3 id="fit-student-private-heading" tabindex="-1">${esc(c.name)}</h3><p class="fit-muted">${esc(c.phone||'Telefone não informado')} · ${esc(c.email||'E-mail não informado')}</p></div><button type="button" class="fit-secondary" onclick="FitStudents.close()">Fechar ficha</button></div>
        <div class="fit-quick-actions"><button type="button" class="fit-secondary" onclick="FitStudents.editContact()">Editar contato</button>${!inactive?`<button type="button" class="fit-secondary" onclick="FitSchedule.openAvailability('student','${c.id}')">Horários disponíveis</button><button type="button" class="fit-secondary" onclick="openEnrollmentModal('${c.id}')">Matricular</button>`:''}<button type="button" class="fit-secondary" onclick="toggleFitStudentArchive('${c.id}')">${inactive?'Reativar aluno':'Arquivar aluno'}</button></div>
        ${inactive?'<p class="fit-student-alert">Aluno arquivado. Histórico disponível para consulta. Reative para registrar novas aulas, matrículas ou avaliações. Compromissos e valores anteriores foram preservados.</p>':''}
        ${c.notes?`<details class="fit-student-notes"><summary>Observações do cadastro</summary><p>${esc(c.notes)}</p></details>`:''}
        <form id="fit-student-profile-form" onsubmit="submitFitStudentProfile(event)" oninput="FitStudents.changed()"><input id="fit-student-id" type="hidden" value="${c.id}"><fieldset ${inactive?'disabled':''}><legend>Objetivos e atendimento</legend><div class="fit-student-grid">${field('fit-student-birthDate','Data de nascimento',p.birthDate,'date')}${preference(p)}${field('fit-student-emergencyName','Contato de emergência — nome',p.emergencyName,'text',160)}${field('fit-student-emergencyPhone','Contato de emergência — telefone',p.emergencyPhone,'tel',40)}</div><div class="fit-student-grid two">${area('fit-student-goal','Objetivos do aluno',p.goal)}${area('fit-student-experience','Experiência e preferências',p.experience)}${area('fit-student-availability','Dias, horários e locais disponíveis',p.availability)}</div>
        <details class="fit-student-intake"><summary>Anamnese e informações relatadas</summary><p class="fit-muted">Registre somente o necessário para acompanhar o aluno. Estes campos guardam relatos e orientações recebidas; não geram diagnóstico ou liberação para exercícios.</p><div class="fit-student-grid two">${Object.entries(intakeLabels).map(([key,label])=>area('fit-intake-'+key,label,p.intake?.[key])).join('')}</div><p class="fit-muted">${p.reviewedOn?'Ficha revisada em '+esc(fmtDate(p.reviewedOn)):'Ficha ainda não revisada.'}</p></details>
        <button type="submit" class="fit-primary">Salvar ficha do aluno</button><span id="fit-student-private-save-state" class="fit-muted" role="status"></span></fieldset></form></section>
        <section class="fit-panel fit-student-sheet"><div class="fit-panel-heading"><h3>Avaliações e evolução das medidas</h3><span class="fit-counter">${assessments.length}</span></div><p class="fit-muted">Medidas opcionais. A comparação mostra a variação registrada, sem classificar o resultado. As avaliações anteriores são preservadas; para corrigir, acrescente um registro explicando o motivo.</p>
        ${comparison.length?`<div class="fit-table-scroll" tabindex="0" aria-label="Comparação das medidas"><table class="fit-student-measures"><thead><tr><th>Medida</th><th>Primeira informada</th><th>Última informada</th><th>Variação</th></tr></thead><tbody>${comparison.map(m=>`<tr><th>${labels[m.field]}</th><td>${esc(m.first.value)}<small>${esc(fmtDate(m.first.date))}</small></td><td>${esc(m.last.value)}<small>${esc(fmtDate(m.last.date))}</small></td><td>${m.change===null?'—':esc((m.change>0?'+':'')+m.change)}</td></tr>`).join('')}</tbody></table></div>`:''}
        ${!inactive?`<details id="fit-assessment-entry"><summary>Registrar avaliação</summary><form id="fit-assessment-form" onsubmit="submitFitAssessment(event)" oninput="FitStudents.changed()"><input id="fit-assessment-student" type="hidden" value="${c.id}"><div class="fit-student-grid">${field('fit-assessment-date','Data da avaliação',today,'date')}${Object.entries(labels).map(([key,label])=>`<label>${label}<input id="fit-assessment-${key}" type="number" step="0.1" min="0.1" max="${FitData.measures[key]}" inputmode="decimal"></label>`).join('')}<label>Próxima avaliação (opcional)<input id="fit-assessment-nextReview" type="date" min="${today}"></label></div>${area('fit-assessment-notes','Observações da avaliação')}<button type="submit" class="fit-primary">Salvar avaliação</button></form></details>`:''}
        <div class="fit-assessment-history">${assessments.length?assessments.map(a=>`<details id="fit-assessment-record-${a.id}"><summary>Avaliação de ${esc(fmtDate(a.date))}</summary><dl class="fit-student-measure-values">${Object.keys(labels).filter(k=>a[k]!==null&&a[k]!==undefined).map(k=>`<div><dt>${labels[k]}</dt><dd>${esc(a[k])}</dd></div>`).join('')}</dl>${a.notes?`<p class="fit-student-notes">${esc(a.notes)}</p>`:''}${a.nextReview?`<p class="fit-muted">Próxima avaliação: ${esc(fmtDate(a.nextReview))}</p>`:''}</details>`).join(''):'<p class="fit-muted">Nenhuma avaliação registrada para este aluno.</p>'}</div></section>
        ${typeof FitTraining!=='undefined'?FitTraining.studentSummary(c.id):''}${typeof FitTrainingLog!=='undefined'?FitTrainingLog.studentSummary(c.id):''}<section class="fit-panel fit-student-sheet"><h3>Contratos e saldo de sessões</h3><div id="fit-student-contracts">${FitCommerce.studentContracts(c.id)}</div></section>
        <section class="fit-panel fit-student-sheet"><h3>Histórico do aluno</h3><p class="fit-muted">Aulas, matrículas, avaliações e movimentações vinculadas ao código deste aluno.</p><ol class="fit-student-timeline">${history.length?history.map(e=>`<li><span>${esc(fmtDate(e.date))}</span><div><strong>${esc(e.title)}</strong><p>${esc(e.detail)}${e.amount!==undefined?' · '+esc(fmtMoney(e.amount)):''}</p>${e.kind==='appointment'?`<button type="button" class="fit-text-button" onclick="FitRoutine.open('appointment','${e.id}')">Ver na agenda</button>`:''}</div></li>`).join(''):'<li>Nenhuma atividade vinculada.</li>'}</ol></section>`;
    }
    function changed(){dirty=true;for(const id of ['fit-student-save-state','fit-student-private-save-state']){const output=document.getElementById(id);if(output)output.textContent=' Alterações ainda não salvas.';}}
    async function submitProfile(event){
        event.preventDefault();if(hasCRMChanges())throw new Error('Salve o acompanhamento antes de salvar a ficha reservada.');const id=document.getElementById('fit-student-id').value,input={intake:{}};
        const assessment=document.getElementById('fit-assessment-form'),draft=assessment&&[...assessment.querySelectorAll('input,textarea')].some(el=>el.value!==el.defaultValue)?[...assessment.querySelectorAll('input,textarea')].map(el=>[el.id,el.value]):null;
        for(const key of FitData.studentText)input[key]=document.getElementById('fit-student-'+key).value;
        for(const key of FitData.intakeText)input.intake[key]=document.getElementById('fit-intake-'+key).value;
        db=FitStudentRules.profile(db,id,input);await save();dirty=false;privateDraft=null;renderDetail();
        if(draft){for(const [key,value]of draft)document.getElementById(key).value=value;document.getElementById('fit-assessment-entry').open=true;changed();}
        FitSecurity.notice('Ficha do aluno salva.');
    }
    async function submitAssessment(event){
        event.preventDefault();if(hasCRMChanges())throw new Error('Salve o acompanhamento antes de registrar a avaliação.');const id=document.getElementById('fit-assessment-student').value,input={};
        // As duas áreas possuem salvamento independente. Não descarte uma ficha em edição.
        const profile=document.getElementById('fit-student-profile-form');
        if(profile&&[...profile.querySelectorAll('input,textarea,select')].some(edited))throw new Error('Salve a ficha do aluno antes de registrar a avaliação.');
        for(const key of ['date','notes','nextReview',...Object.keys(labels)])input[key]=document.getElementById('fit-assessment-'+key).value;
        db=FitStudentRules.assess(db,id,input,getID());await save();dirty=false;privateDraft=null;renderDetail();renderList();FitSecurity.notice('Avaliação registrada e histórico preservado.');
    }
    async function toggleArchive(id){
        const c=FitStudentRules.student(db,id),reactivate=FitStudentRules.archived(c);
        if(!mayLeave())return;
        const pending=db.appointments.filter(a=>a.clientId===id&&a.status==='pending').length,active=db.enrollments.filter(e=>e.studentId===id&&e.status!=='cancelado').length;
        if(!confirm(reactivate?'Reativar o cadastro deste aluno?':`Arquivar este aluno? Os registros serão preservados. Há ${pending} aula(s) pendente(s) e ${active} matrícula(s) não cancelada(s). Arquivar não cancela aulas, planos nem valores; confira essas pendências na agenda e no financeiro.`))return;
        db=FitStudentRules.archive(db,id);await save();dirty=false;wipePrivate();renderList();if(selected===id)renderDetail();FitSecurity.notice(reactivate?'Aluno reativado.':'Aluno arquivado com histórico preservado.');
    }
    function contactSaved(id){renderList();if(selected===id&&!dirty)renderDetail();}
    function reset(){clearTimeout(namesTimer);wipePrivate();selected='';dirty=false;namesVisible=false;page=0;activeTab='overview';opener=null;const root=document.getElementById('fit-student-root');root?.replaceChildren();if(root)root.hidden=true;const directory=document.getElementById('fit-student-directory');if(directory)directory.hidden=false;for(const id of ['fit-student-search','fit-student-status','fit-crm-stage-filter','fit-crm-attention-filter']){const el=document.getElementById(id);if(el)el.value=id==='fit-student-status'?'active':id.endsWith('filter')?'all':'';}const count=document.getElementById('fit-student-count');if(count)count.textContent='';document.getElementById('fit-crm-pagination')?.replaceChildren();document.getElementById('clients-list')?.replaceChildren();}
    document.addEventListener('visibilitychange',()=>{if(document.hidden){maskPrivate();namesVisible=false;clearTimeout(namesTimer);if(available())renderList(page);}});
    window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
    setInterval(()=>{if(available()&&activeTab==='overview'&&!document.hidden&&!window.fitActionBusy)refreshOperational();},60000);
    return {renderList,open,close,editContact,changed,beforeNavigate,submitProfile,submitAssessment,toggleArchive,contactSaved,reset,revealPrivate,toggleNames,hasPrivateChanges,prepareCRMAction,crmSaved,refreshOperational,overviewAction,trainingPage,current:()=>selected,currentTab:()=>activeTab,selectTab,tabKey,page:delta=>renderList(page+delta)};
})();
function submitFitStudentProfile(event){return FitStudents.submitProfile(event);}
function submitFitAssessment(event){return FitStudents.submitAssessment(event);}
function toggleFitStudentArchive(id){return FitStudents.toggleArchive(id);}
