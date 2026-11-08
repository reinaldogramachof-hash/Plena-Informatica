/* Visão operacional do dia e alternância com Visão Estratégica.
   Alterações usam os fluxos protegidos da Agenda e das Sessões. */

let therapyDashboardMinute = '';
let currentDashboardTab = 'operational';

function therapyDashboardStamp() {
    const now = new Date();
    return TherapyData.dateKey(now) + 'T' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
}

/**
 * Alterna entre a Visão Operacional e a Visão Estratégica
 */
function switchDashboardTab(tabId) {
    if (!['operational', 'strategic'].includes(tabId)||!TherapyVault.isOpen()) return;
    currentDashboardTab = tabId;

    const opTab = document.getElementById('tab-dashboard-operational');
    const stTab = document.getElementById('tab-dashboard-strategic');
    const opPanel = document.getElementById('dashboard-panel-operational');
    const stPanel = document.getElementById('dashboard-panel-strategic');

    if (opTab) {
        opTab.tabIndex=tabId==='operational'?0:-1;
        opTab.setAttribute('aria-selected', tabId === 'operational' ? 'true' : 'false');
        opTab.classList.toggle('active', tabId === 'operational');
    }
    if (stTab) {
        stTab.tabIndex=tabId==='strategic'?0:-1;
        stTab.setAttribute('aria-selected', tabId === 'strategic' ? 'true' : 'false');
        stTab.classList.toggle('active', tabId === 'strategic');
    }

    if (opPanel) opPanel.hidden = (tabId !== 'operational');
    if (stPanel) stPanel.hidden = (tabId !== 'strategic');

    if (tabId === 'operational') {
        renderTherapyDashboard();
    } else {
        if (typeof TherapyStrategyUI !== 'undefined') {
            TherapyStrategyUI.render();
        }
    }

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

function renderTherapyDashboard() {
    const today = TherapyData.dateKey();
    const patients = db.patients.filter(patient => !patient.archived);
    const appointments = db.appointments.filter(item => item.date === today).sort((a, b) => a.time.localeCompare(b.time));
    const active = appointments.filter(item => !['cancelled', 'no_show'].includes(item.status));
    const completed = active.filter(item => item.status === 'completed').length;
    const alerts = patients.filter(patient => ['risco', 'atenção'].includes(patient.risk))
        .sort((a, b) => Number(b.risk === 'risco') - Number(a.risk === 'risco') || a.name.localeCompare(b.name, 'pt-BR'));
    const totals = therapyTotals();
    const now = new Date();
    const currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    therapyDashboardMinute = therapyDashboardStamp();
    document.getElementById('therapy-dashboard-clinic').textContent = db.settings.clinicName || 'Seu consultório';
    const date = document.getElementById('therapy-dashboard-date');
    date.textContent = new Intl.DateTimeFormat('pt-BR', {weekday:'long', day:'numeric', month:'long'}).format(now);
    date.dateTime = today;
    document.getElementById('therapy-dashboard-updated').textContent = 'Atualizado às ' + currentTime;
    for (const [id, value] of [['dash-today', active.length], ['dash-patients', patients.length], ['dash-revenue', fmtMoney(totals.income)], ['dash-alerts', alerts.length]])
        document.getElementById(id).textContent = value;
    document.getElementById('therapy-day-summary').textContent = `${completed} ${completed === 1 ? 'concluída' : 'concluídas'} · ${active.length - completed} a concluir · ${appointments.length - active.length} cancelamentos ou faltas`;

    const pending = active.filter(item => item.status !== 'completed');
    const overdue = pending.filter(item => item.status !== 'in_progress' && item.time < currentTime);
    const next = pending.find(item => item.status === 'in_progress') || pending.find(item => item.time >= currentTime);
    const dayOverview = overdue.length
        ? {title:`${overdue.length} ${overdue.length === 1 ? 'atendimento aguarda' : 'atendimentos aguardam'} conferência`,description:'Os horários já passaram, mas ainda não foram concluídos. Confira as marcações na Agenda de hoje, abaixo.'}
        : active.length
            ? {title:'Atendimentos de hoje concluídos',description:'Não há atendimentos a concluir. O histórico do dia continua disponível na lista abaixo.'}
            : appointments.length
                ? {title:'Nenhum atendimento a concluir hoje',description:'As marcações de hoje estão canceladas ou registradas como falta. Confira a lista abaixo.'}
                : {title:'Nenhuma marcação para hoje',description:'Use Nova sessão para agendar um atendimento ou consulte outras datas na Agenda.'};
    const name = item => sanitizeHTML(db.patients.find(patient => patient.id === item.patientId)?.name || 'Paciente não encontrado');
    const state = item => `<span class="therapy-state" data-status="${sanitizeHTML(item.status || 'scheduled')}">${sanitizeHTML(getStatusText(item.status || 'scheduled'))}</span>`;
    const pendingPanel = document.getElementById('therapy-pending-sessions');
    pendingPanel.hidden = !overdue.length;
    pendingPanel.innerHTML = overdue.length
        ? `<div><strong>${overdue.length} ${overdue.length === 1 ? 'horário anterior sem conclusão' : 'horários anteriores sem conclusão'}</strong><p>A partir de ${sanitizeHTML(overdue[0].time)}. Confira a situação antes de registrar o atendimento.</p></div><button type="button" class="therapy-secondary" onclick="therapyDashboardPending()">Ver pendências</button>`
        : '';
    document.getElementById('therapy-next-session').innerHTML = next
        ? `<div><span class="therapy-eyebrow">${next.status === 'in_progress' ? 'Em atendimento' : 'Próxima sessão'}</span><h3>${sanitizeHTML(next.time)} · ${name(next)}</h3><p>${sanitizeHTML(next.type || 'Sessão')} · ${Number(next.duration) || 50} min</p></div><button type="button" class="therapy-primary" onclick="therapyDashboardAction('${next.id}')">Registrar atendimento</button>`
        : `<div><span class="therapy-eyebrow">Seu dia</span><h3>${dayOverview.title}</h3><p>${dayOverview.description}</p></div><button type="button" class="therapy-secondary" onclick="therapyOpenToday()">Abrir agenda</button>`;
    document.getElementById('today-schedule').innerHTML = appointments.length
        ? appointments.map(item => {
            const missing = item.status === 'completed' && !db.sessions.some(session => session.appointmentId === item.id);
            const previous = overdue.some(appointment => appointment.id === item.id);
            const canRegister = !['completed', 'cancelled', 'no_show'].includes(item.status);
            return `<article class="therapy-schedule-row" data-overdue="${previous}"><div class="therapy-schedule-detail"><time datetime="${today}T${sanitizeHTML(item.time)}">${sanitizeHTML(item.time)}</time><div><strong>${name(item)}</strong><small>${sanitizeHTML(item.type || 'Sessão')} · ${Number(item.duration) || 50} min</small>${previous ? '<small class="therapy-pending-label">Horário anterior sem conclusão</small>' : ''}${missing ? '<small class="therapy-pending-label">Sem anotação vinculada</small>' : ''}</div></div><div class="therapy-schedule-actions">${state(item)}${item.status !== 'completed' ? `<button type="button" class="therapy-secondary" aria-label="Situação de ${name(item)} às ${sanitizeHTML(item.time)}" onclick="changeAppointmentStatus('${item.id}')">Situação</button>` : ''}${canRegister || item.status === 'completed' ? `<button type="button" class="therapy-secondary" onclick="therapyDashboardAction('${item.id}')">${missing ? 'Adicionar anotação' : item.status === 'completed' ? 'Conferir registro' : 'Registrar atendimento'}</button>` : ''}</div></article>`;
        }).join('')
        : '<div class="therapy-empty"><p>Nenhuma sessão agendada para hoje.</p><small>Use Nova sessão para adicionar um horário à agenda.</small></div>';
    const highRisk = alerts.filter(patient => patient.risk === 'risco').length;
    const alertPanel = document.getElementById('therapy-dashboard-alerts');
    alertPanel.dataset.level = highRisk ? 'risk' : alerts.length ? 'attention' : 'none';
    document.getElementById('therapy-alert-summary').textContent = alerts.length
        ? `${alerts.length} ${alerts.length === 1 ? 'cadastro sinalizado' : 'cadastros sinalizados'} · marcações do profissional`
        : 'Nenhum cadastro ativo sinalizado';
    document.getElementById('patient-alerts').innerHTML = alerts.length
        ? alerts.slice(0, 3).map(patient => `<div class="therapy-alert-row" data-risk="${patient.risk === 'risco' ? 'risk' : 'attention'}"><div><strong>${sanitizeHTML(patient.name)}</strong><small>${patient.risk === 'risco' ? 'Alto risco registrado' : 'Atenção registrada'}</small></div><button type="button" class="therapy-secondary" aria-label="Conferir paciente ${sanitizeHTML(patient.name)}" onclick="openPatientModal('${patient.id}')">Conferir</button></div>`).join('') + '<button type="button" class="therapy-link" onclick="therapyOpenDashboardPatients(true)">Ver todos os sinalizados</button>'
        : '<p class="therapy-alert-empty">As marcações feitas no cadastro aparecerão aqui.</p>';
    if(typeof TherapyAssistant!=='undefined')TherapyAssistant.renderDashboard();
    if(currentDashboardTab==='strategic'&&typeof TherapyStrategyUI!=='undefined')TherapyStrategyUI.render();
}

function therapyOpenToday() {
    router('schedule');
    document.getElementById('schedule-date').value = TherapyData.dateKey();
    renderSchedule();
}

function therapyOpenDashboardPatients(alertsOnly = false) {
    TherapyPatients.resetDirectory();
    document.getElementById('crm-stage-filter').value='all';
    document.getElementById('crm-focus-filter').value='all';
    document.getElementById('therapy-show-alerts').checked = alertsOnly;
    document.getElementById('therapy-show-archived').checked = false;
    document.getElementById('search-patients').value = '';
    router('patients');
}

function therapyDashboardPending() {
    const row = document.querySelector('#today-schedule [data-overdue=true]');
    if (row) { row.scrollIntoView({block:'center'}); row.querySelector('button')?.focus({preventScroll:true}); }
}

function therapyDashboardAction(id) {
    if (!TherapyVault.isOpen()) return;
    const appointment = db.appointments.find(item => item.id === id);
    if (!appointment) return;
    if (appointment.status === 'completed') {
        const session = db.sessions.find(item => item.appointmentId === id);
        if (session) return openSessionNotesModal(session.id, id);
        const dialog = TherapyVault.dialog('Atendimento sem anotação vinculada', `<p>O atendimento de ${fmtDate(appointment.date)} às ${sanitizeHTML(appointment.time)} está concluído. Nenhuma anotação foi encontrada para esse horário.</p><p>Você pode adicionar a anotação preservando o atendimento, as cobranças e os consumos de pacote já registrados.</p><div class="therapy-actions"><button id="therapy-recover-note" type="button">Adicionar anotação sem nova cobrança</button><button type="button" class="therapy-secondary" onclick="therapyOpenToday();this.closest('#therapy-dialog').remove()">Conferir agenda</button><button type="button" onclick="this.closest('#therapy-dialog').remove()">Voltar</button></div>`);
        dialog.querySelector('#therapy-recover-note').onclick = () => { dialog.remove(); openSessionNotesModal(null, id); };
        return;
    }
    if (['cancelled', 'no_show'].includes(appointment.status)) return changeAppointmentStatus(id);
    openSessionNotesModal(null, id);
}

function therapyRefreshDashboard(force = false) {
    const view = document.getElementById('view-dashboard');
    if (!view || view.classList.contains('hide') || document.hidden || typeof TherapyVault === 'undefined' || !TherapyVault.isOpen() || window.therapyActionBusy) return;
    if (document.querySelector('.modal-backdrop:not(.hidden),#therapy-dialog') || document.activeElement?.closest('#today-schedule,#patient-alerts,#therapy-next-session,#therapy-pending-sessions')) return;

    if (currentDashboardTab === 'strategic') {
        if (force && typeof TherapyStrategyUI !== 'undefined') {
            TherapyStrategyUI.render();
        }
        return;
    }

    if (force || therapyDashboardMinute !== therapyDashboardStamp()) {
        renderTherapyDashboard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => therapyRefreshDashboard(), 30000);
    document.addEventListener('visibilitychange', () => therapyRefreshDashboard(true));
    window.addEventListener('focus', () => therapyRefreshDashboard(true));
});

function resetTherapyStrategy(){
 currentDashboardTab='operational';if(typeof TherapyStrategyUI!=='undefined')TherapyStrategyUI.reset();
 for(const key of ['operational','strategic']){const tab=document.getElementById('tab-dashboard-'+key),panel=document.getElementById('dashboard-panel-'+key);if(tab){tab.tabIndex=key==='operational'?0:-1;tab.setAttribute('aria-selected',String(key==='operational'));tab.classList.toggle('active',key==='operational');}if(panel)panel.hidden=key!=='operational';}
}
document.addEventListener('therapy-vault-locked',resetTherapyStrategy);
document.addEventListener('therapy-data-restored',resetTherapyStrategy);
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelector('.therapy-dashboard-tabs')?.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();
  const next=event.key==='Home'?'operational':event.key==='End'?'strategic':currentDashboardTab==='operational'?'strategic':'operational';switchDashboardTab(next);document.getElementById('tab-dashboard-'+next)?.focus();
 });
});
