/* Acompanhamento local. Contatos, solicitações e respostas são registros manuais. */
const FitCRM = (() => {
    const esc = value => sanitizeHTML(String(value ?? ''));
    let dialogDirty = false, saving = false, active = false, historyStudent = '', historyPage = 0;
    const value = id => document.getElementById(id)?.value || '';
    const options = (entries, current) => Object.entries(entries).map(([key, label]) => `<option value="${esc(key)}" ${key === current ? 'selected' : ''}>${esc(label)}</option>`).join('');
    const field = (key, label, content, type = 'text', max = 100) => `<label>${label}<input id="fit-crm-${key}" type="${type}" value="${esc(content)}" maxlength="${max}"></label>`;
    function sheet(c) {
        const r = FitCRMRules.state(c), inactive = FitStudentRules.archived(c), pending = FitCRMRules.openRequests(c);
        return `<section class="fit-panel fit-student-sheet fit-crm-sheet"><div class="fit-panel-heading fit-crm-workspace-heading"><div><p class="fit-muted">Gestão do aluno · Código ${esc(c.id)}</p><h3 id="fit-student-heading" tabindex="-1">${esc(FitCRMRules.shortName(c.name))}</h3><p class="fit-muted">${inactive ? 'Cadastro arquivado · histórico preservado' : FitCRMRules.stages[r.stage]}</p></div><button type="button" class="fit-secondary" onclick="FitStudents.close()">Voltar à lista de alunos</button></div>
        <div class="fit-crm-tabs" role="tablist" aria-label="Gestão do aluno">${[['overview','Visão geral'],['plans','Plano e aulas'],['training','Treinos'],['relationship','Relacionamento'],['privacy','Privacidade'],['private','Ficha reservada'],['history','Histórico de relacionamento']].map(([key,label])=>`<button type="button" role="tab" id="fit-student-tab-${key}" aria-controls="fit-student-panel-${key}" aria-selected="${key==='overview'}" tabindex="${key==='overview'?'0':'-1'}" onclick="FitStudents.selectTab('${key}')" onkeydown="FitStudents.tabKey(event,'${key}')">${label}${key==='privacy'&&pending.length?' <span class="fit-crm-tab-count">'+pending.length+'</span>':''}</button>`).join('')}</div>
        <section id="fit-student-panel-overview" role="tabpanel" aria-labelledby="fit-student-tab-overview"><div id="fit-student-overview-root"></div></section>
        <section id="fit-student-panel-plans" role="tabpanel" aria-labelledby="fit-student-tab-plans" hidden><div id="fit-student-plans-root"></div></section>
        <section id="fit-student-panel-training" role="tabpanel" aria-labelledby="fit-student-tab-training" hidden><div id="fit-student-training-root"></div></section>
        <form id="fit-crm-form" onsubmit="submitFitCRM(event)" oninput="FitStudents.changed()"><input id="fit-crm-id" type="hidden" value="${c.id}"><input id="fit-crm-revision" type="hidden" value="${r.revision}">
        <section id="fit-student-panel-relationship" role="tabpanel" aria-labelledby="fit-student-tab-relationship"><fieldset ${inactive?'disabled':''}><legend>Relacionamento e próximo contato</legend><div class="fit-student-grid"><label>Etapa<select id="fit-crm-stage">${options(FitCRMRules.stages,r.stage)}</select></label>${field('source','Origem do contato',r.source)}${field('nextContact','Próximo contato (opcional)',r.nextContact,'date')}${field('tags','Etiquetas administrativas (até 6, separadas por vírgula)',r.tags.join(', '),'text',245)}</div><label>Próxima ação<textarea id="fit-crm-followup" rows="2" maxlength="500">${esc(r.followup)}</textarea></label><p class="fit-muted">Use etiquetas e notas administrativas. Informações de saúde e avaliações ficam na ficha reservada.</p></fieldset>
        ${inactive?'':`<div class="fit-crm-actions"><button type="button" class="fit-secondary" onclick="FitCRM.event('contact')">Registrar interação</button><button type="button" class="fit-secondary" onclick="FitCRM.event('note')">Adicionar nota</button></div>`}</section>
        <section id="fit-student-panel-privacy" role="tabpanel" aria-labelledby="fit-student-tab-privacy" hidden><fieldset ${inactive?'disabled':''}><legend>Finalidade e transparência no uso dos dados</legend><label>Finalidade informada ao aluno<textarea id="fit-crm-purpose" rows="2" maxlength="1000">${esc(r.privacy.purpose)}</textarea></label><div class="fit-student-grid two">${field('noticeOn','Comunicação de privacidade realizada em',r.privacy.noticeOn,'date')}${field('reviewOn','Revisar necessidade dos dados em',r.privacy.reviewOn,'date')}</div><p class="fit-muted">Registre somente o que ocorreu. Estes campos não representam consentimento, autorização para publicidade ou definição automática de uma base legal. A revisão não apaga registros.</p></fieldset><div class="fit-crm-actions"><button type="button" class="fit-secondary" onclick="FitCRM.event('request')">Solicitação de dados</button></div>
        ${pending.length?`<div class="fit-student-alert"><strong>${pending.length} solicitação(ões) aguardando resposta registrada</strong>${pending.map(e=>`<div class="fit-crm-request"><span>${esc(FitCRMRules.requests[e.requestType])} · ${esc(fmtDate(e.date))}</span><button type="button" class="fit-text-button" onclick="FitCRM.event('response','${e.id}')">Registrar resposta</button></div>`).join('')}</div>`:'<p class="fit-muted">Nenhuma solicitação aguardando resposta registrada.</p>'}</section>
        <div class="fit-crm-savebar">${inactive?'':'<button type="submit" class="fit-primary">Salvar acompanhamento</button>'}<span id="fit-student-save-state" class="fit-muted" role="status"></span></div></form>
        <section id="fit-student-panel-history" role="tabpanel" aria-labelledby="fit-student-tab-history" hidden><div class="fit-crm-section-heading"><div><h4>Histórico de relacionamento</h4><p class="fit-muted">Contatos registrados, notas, mudanças de etapa e solicitações sobre dados pessoais.</p></div><span class="fit-counter">${r.events.length}</span></div><div id="fit-crm-history-root"></div></section></section>`;
    }
    async function submit(event) {
        event.preventDefault();
        const input = {}; for (const key of ['stage','source','nextContact','followup','purpose','noticeOn','reviewOn']) input[key] = value('fit-crm-' + key);
        input.tags = value('fit-crm-tags').split(',').map(tag => tag.trim()).filter(Boolean);
        const id = value('fit-crm-id'); db = FitCRMRules.save(db, id, input, Number(value('fit-crm-revision')), getID()); await save();
        FitStudents.crmSaved(id); FitSecurity.notice('Acompanhamento salvo.');
    }
    function beforeClose() { return !saving && (!dialogDirty || confirm('Descartar o registro ainda não salvo?')); }
    function cleared() { active = false; dialogDirty = false; saving = false; historyStudent = ''; historyPage = 0; }
    function event(kind, requestId = '') {
        if (!FitSecurity.isOpen() || window.fitActionBusy || !['contact','note','request','response'].includes(kind) || !FitStudents.prepareCRMAction()) return;
        const c = FitStudentRules.student(db, FitStudents.current(), !['request','response'].includes(kind)), r = FitCRMRules.state(c), today = FitData.dateKey();
        if (kind === 'response' && !FitCRMRules.openRequests(c).some(e => e.id === requestId)) return FitSecurity.notice('Reabra a solicitação pendente.','error');
        const titles = {contact:'Registrar interação realizada',note:'Adicionar nota administrativa',request:'Registrar solicitação do aluno',response:'Registrar resposta ao aluno'};
        const content = `<form onsubmit="submitFitCRMEvent(event)" oninput="FitCRM.changed()"><input id="fit-crm-event-student" type="hidden" value="${c.id}"><input id="fit-crm-event-revision" type="hidden" value="${r.revision}"><input id="fit-crm-event-id" type="hidden" value="${getID()}"><input id="fit-crm-event-kind" type="hidden" value="${kind}"><input id="fit-crm-event-requestId" type="hidden" value="${esc(requestId)}"><p class="fit-muted">Código ${esc(c.id)} · Registro manual. Nenhuma mensagem será enviada e nenhum dado será apagado por esta ação.</p><div class="fit-dialog-grid"><label>Data do ocorrido<input id="fit-crm-event-date" type="date" value="${today}" max="${today}" required></label>${kind === 'contact' ? `<label>Canal<select id="fit-crm-event-channel">${options(c.fitProfile?.contactPreference === 'none' ? {internal:'Registro interno',person:'Pessoalmente'} : FitCRMRules.channels,'internal')}</select></label>` : ''}${kind === 'request' ? `<label>Tipo de solicitação<select id="fit-crm-event-requestType">${options(FitCRMRules.requests,'access')}</select></label>` : ''}<label class="fit-crm-span">${kind === 'response' ? 'Resposta ou encaminhamento efetivamente realizado' : 'Descrição administrativa'}<textarea id="fit-crm-event-note" rows="4" minlength="3" maxlength="1500" required></textarea></label></div><p class="fit-muted">Evite copiar documentos, diagnósticos e dados de terceiros. Pedidos de exclusão precisam de análise do profissional sobre o que pode ser eliminado ou deve ser conservado.</p><label class="fit-crm-check"><input id="fit-crm-event-reviewed" type="checkbox" required>Conferi o aluno e o conteúdo deste registro.</label><div class="fit-dialog-actions"><button type="button" class="fit-secondary" onclick="FitSecurity.closeDialog()">Voltar</button><button type="submit" class="fit-primary">Salvar registro</button></div></form>`;
        const node = FitSecurity.dialog(titles[kind], content, {layout:'wide',beforeClose,onClose:cleared});
        if (node) { active = true; dialogDirty = false; }
    }
    async function submitEvent(event) {
        event.preventDefault(); if (!active || saving) throw new Error('Reabra o registro.');
        if (!document.getElementById('fit-crm-event-reviewed')?.checked) throw new Error('Confira o registro antes de salvar.');
        const input = {}; for (const key of ['kind','date','channel','requestType','requestId','note']) input[key] = value('fit-crm-event-' + key);
        const id = value('fit-crm-event-student'); saving = true;
        try { db = FitCRMRules.record(db,id,input,Number(value('fit-crm-event-revision')),value('fit-crm-event-id')); await save(); }
        catch (error) { saving = false; throw error; }
        saving = false; dialogDirty = false; FitSecurity.closeDialog(); FitStudents.crmSaved(id); FitSecurity.notice('Registro salvo no histórico administrativo.');
    }
    function history(id, page = 0) {
        if (!FitSecurity.isOpen() || window.fitActionBusy || !FitStudents.prepareCRMAction()) return;
        const c = FitStudentRules.student(db,id), events = FitCRMRules.state(c).events.slice().reverse(), pages = Math.max(1,Math.ceil(events.length/20));
        page = Math.max(0,Math.min(page,pages-1));
        const titles = {contact:'Interação',note:'Nota administrativa',request:'Solicitação',response:'Resposta registrada',stage:'Acompanhamento'};
        const content = `<p class="fit-muted">Código ${esc(id)} · Registros anteriores preservados.</p><ol class="fit-student-timeline">${events.slice(page*20,page*20+20).map(e => `<li><span>${esc(fmtDate(e.date))}</span><div><strong>${titles[e.kind]}${e.requestType ? ' · '+esc(FitCRMRules.requests[e.requestType]) : ''}${e.channel ? ' · '+esc(FitCRMRules.channels[e.channel]) : ''}</strong><p>${esc(e.note)}</p></div></li>`).join('') || '<li>Nenhum registro administrativo.</li>'}</ol><div class="fit-dialog-actions"><button type="button" class="fit-secondary" onclick="FitCRM.historyPage(-1)" ${page===0?'disabled':''}>Anteriores</button><span>${page+1} de ${pages}</span><button type="button" class="fit-secondary" onclick="FitCRM.historyPage(1)" ${page===pages-1?'disabled':''}>Próximos</button><button type="button" class="fit-secondary" onclick="FitSecurity.closeDialog()">Fechar</button></div>`;
        const node = FitSecurity.dialog('Histórico de relacionamento',content,{layout:'wide',onClose:cleared});
        if (node) { active = true; historyStudent = id; historyPage = page; }
    }
    function inlineHistory(id,page=0){
        if(!FitSecurity.isOpen()||window.fitActionBusy||FitStudents.current()!==id||FitStudents.currentTab()!=='history')return;
        const c=FitStudentRules.student(db,id),events=FitCRMRules.state(c).events.slice().reverse(),pages=Math.max(1,Math.ceil(events.length/20));page=Math.max(0,Math.min(Number(page)||0,pages-1));
        const titles={contact:'Interação',note:'Nota administrativa',request:'Solicitação',response:'Resposta registrada',stage:'Acompanhamento'};
        const root=document.getElementById('fit-crm-history-root');if(!root)return;
        root.innerHTML=`<ol class="fit-student-timeline">${events.slice(page*20,page*20+20).map(e=>`<li><span>${esc(fmtDate(e.date))}</span><div><strong>${titles[e.kind]}${e.requestType?' · '+esc(FitCRMRules.requests[e.requestType]):''}${e.channel?' · '+esc(FitCRMRules.channels[e.channel]):''}</strong><p>${esc(e.note)}</p></div></li>`).join('')||'<li>Nenhum registro administrativo.</li>'}</ol>${pages>1?`<div class="fit-crm-pagination"><button type="button" class="fit-secondary" onclick="FitCRM.inlineHistory('${id}',${page-1})" ${page===0?'disabled':''}>Anterior</button><span>${page+1} de ${pages}</span><button type="button" class="fit-secondary" onclick="FitCRM.inlineHistory('${id}',${page+1})" ${page===pages-1?'disabled':''}>Próxima</button></div>`:''}`;
    }
    function beforeNavigate() { return !active || FitSecurity.closeDialog(); }
    document.addEventListener('visibilitychange',() => { if (document.hidden && historyStudent && !saving && !window.fitActionBusy) FitSecurity.closeDialog(); });
    window.addEventListener('beforeunload',event => { if (dialogDirty || saving) { event.preventDefault(); event.returnValue=''; } });
    return {sheet,submit,event,submitEvent,history,inlineHistory,historyPage:delta=>history(historyStudent,historyPage+delta),changed:()=>{dialogDirty=true;},beforeNavigate,reset:cleared};
})();
function submitFitCRM(event) { return FitCRM.submit(event); }
function submitFitCRMEvent(event) { return FitCRM.submitEvent(event); }
