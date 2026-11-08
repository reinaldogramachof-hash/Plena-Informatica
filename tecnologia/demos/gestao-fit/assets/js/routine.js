const FitRoutine = (() => {
    const escape = value => sanitizeHTML(String(value ?? ''));
    const available = () => typeof FitSecurity !== 'undefined' && FitSecurity.isOpen();
    let dayMode = 'next', priorityPage = 0, lastDay = '';
    function appointment(item, actions = false) {
        const labels={pending:'Agendada',done:'Realizada',canceled:'Cancelada',missed:'Falta'},student=db.clients.find(c=>c.id===item.clientId),slot=FitScheduleRules.span(item);
        const interval=slot.known?item.time+' a '+FitScheduleRules.clock(slot.end):item.time+' · duração a confirmar';
        return `<article class="fit-appointment" id="fit-${actions?'appointment':'today'}-${escape(item.id)}" tabindex="-1"><div class="fit-appointment-time">${escape(interval)}</div><div class="fit-appointment-copy"><strong>${escape(item.clientName||student?.name||'Aluno não vinculado')}</strong><p>${escape(item.serviceName||'Serviço cadastrado')}</p><span class="fit-state" data-state="${escape(item.status)}">${labels[item.status]||'Conferir'}</span><span class="fit-appointment-detail">${escape(item.schedule?.location||'Local não informado')}</span>${item.schedule?.recurrence?'<span class="fit-appointment-detail">Série · aula '+item.schedule.recurrence.index+' de '+item.schedule.recurrence.count+'</span>':''}${typeof FitAttendance!=='undefined'?FitAttendance.details(item):''}${item.schedule?.notes?'<span class="fit-appointment-detail">'+escape(item.schedule.notes)+'</span>':''}${!student?'<p class="fit-muted">Vínculo de aluno para conferir</p>':''}${item.schedule?.history?.length?'<details class="fit-appointment-detail"><summary>Histórico do horário</summary><ul>'+item.schedule.history.map(h=>'<li>'+escape(h?.at?new Date(h.at).toLocaleString('pt-BR'):'')+' · '+escape(({created:'Agendamento criado',rescheduled:'Horário atualizado'})[h?.action]||'Registro anterior')+(h?.previous?' · anterior: '+escape(h.previous.date)+' '+escape(h.previous.time)+' · '+escape(h.previous.durationMinutes??'duração não informada')+' min':'')+'</li>').join('')+'</ul></details>':''}</div><div class="fit-row-actions">${actions&&item.status==='pending'?`<button type="button" class="fit-secondary" onclick="FitAttendance.open('${escape(item.id)}','${item.attendance?.confirmation==='confirmed'?'unconfirm':'confirm'}')">${item.attendance?.confirmation==='confirmed'?'Remover confirmação':'Confirmar aula'}</button><button type="button" class="fit-secondary" onclick="FitAttendance.open('${escape(item.id)}','miss')">Registrar falta</button><button type="button" class="fit-secondary" onclick="FitSchedule.openEdit('${escape(item.id)}')">Editar horário</button><button type="button" class="fit-secondary" onclick="cancelAppt('${escape(item.id)}')" aria-label="Cancelar aula de ${escape(item.clientName)}">Cancelar</button><button type="button" class="fit-primary" onclick="finishAppt('${escape(item.id)}')">Concluir aula</button>`:actions&&item.status==='missed'?`<button type="button" class="fit-secondary" onclick="FitAttendance.open('${escape(item.id)}','correct')">Corrigir falta</button>`:`<button type="button" class="fit-secondary" onclick="FitRoutine.open('appointment','${escape(item.id)}')">Ver na agenda</button>`}</div></article>`;
    }
    function render() {
        if (!available()) return;
        const state = FitRoutineRules.summarize(db), root = document.getElementById('fit-dashboard-root');
        if (!root) return;
        if (lastDay !== state.today) { dayMode = 'next'; priorityPage = 0; lastDay = state.today; }
        priorityPage = Math.max(0, Math.min(priorityPage, Math.ceil(state.pending.length / 6) - 1));
        root.innerHTML = FitDayView.markup(state, { dayMode, priorityPage });
        const footer = document.getElementById('fit-sidebar-profile');
        if (footer) footer.textContent = state.profile.brand || state.profile.name || 'Seu espaço de trabalho';
        lucide.createIcons();
    }
    function selectDay(mode) {
        if (!available() || !['next', 'review', 'all'].includes(mode)) return;
        dayMode = mode; render();
        document.getElementById('fit-day-mode-' + mode)?.focus({ preventScroll: true });
    }
    function movePriorities(amount) {
        if (!available() || ![-1, 1].includes(amount)) return;
        priorityPage += amount; render();
        document.getElementById('fit-day-priority-title')?.focus({ preventScroll: true });
    }
    function financeWindow() {
        router('finance');
        if (document.getElementById('view-finance')?.classList.contains('hide')) return false;
        const state = FitRoutineRules.summarize(db), start = [state.today, ...state.dues.map(row => row.date)].sort()[0];
        if (typeof FitFinance !== 'undefined') FitFinance.focusReceivables(start, state.dueWindowEnd);
        else switchFinanceTab('recebiveis');
        return true;
    }
    function openDue(key) {
        if (!available()) return;
        const row = FitCommerceRules.receivables(db).find(row => row.kind + ':' + row.id === key);
        if (!row) return FitSecurity.notice('Este recebimento não está mais em aberto. Atualize o resumo.', 'error');
        if (!financeWindow() || typeof FitFinance === 'undefined') return;
        if (row.kind === 'legacy') return FitSecurity.notice('Condições anteriores: confira o contrato antes de registrar o recebimento.');
        const target = row.kind === 'period' ? { kind: 'period', enrollmentId: row.enrollmentId, periodId: row.periodId } : row.kind === 'standalone' ? { kind: 'standalone', appointmentId: row.appointmentId } : { kind: 'account', accountId: row.accountId };
        FitFinance.openTarget(target);
    }
    function renderSchedule() { return FitSchedule.renderSchedule(); }
    function goToDate(date) { if(available())return FitSchedule.openDay(date); }
    function moveDate(amount) { if(available())return FitSchedule.movePeriod(amount); }
    function open(kind,id) {
        if(!available())return;
        if(kind==='today'){document.getElementById('fit-schedule-status').value='all';document.getElementById('fit-schedule-search').value='';return goToDate(FitData.dateKey());}
        if(kind==='appointment'){
            const item=db.appointments.find(a=>a.id===id);if(!item)return FitSecurity.notice('O registro não está mais disponível.','error');
            document.getElementById('fit-schedule-status').value='all';document.getElementById('fit-schedule-search').value='';goToDate(item.date);const row=document.getElementById('fit-appointment-'+id);row?.scrollIntoView({block:'center',behavior:'smooth'});row?.focus({preventScroll:true});return;
        }
        if(kind==='enrollment'){if(!db.enrollments.some(e=>e.id===id))return FitSecurity.notice('Matrícula indisponível.','error');router('finance');switchFinanceTab('recebiveis');return;}
        if(kind==='student'){if(!db.clients.some(c=>c.id===id))return FitSecurity.notice('Aluno indisponível.','error');FitStudents.open(id);return;}
        if(kind==='training'){const p=db.training?.programs.find(p=>p.id===id);if(!p)return FitSecurity.notice('Ficha de treino indisponível.','error');FitTraining.openProgram(p.id,p.versions.at(-1).id);return;}
        if(kind==='finance'){if(financeWindow()&&id&&typeof FitFinance!=='undefined')FitFinance.openTarget({kind:'account',accountId:id});return;}
        if(kind==='integrity'){
            const issues=FitData.inspect(db).issues;
            const node=FitSecurity.dialog('Vínculos para conferir',`<p>Os históricos foram preservados. Não associe alunos apenas pelo nome.</p><ul>${issues.slice(0,40).map(item=>`<li>${escape(item.collection)} / ${escape(item.id)}: ${escape(item.field)}</li>`).join('')}</ul><p>${issues.length} referência(s) indisponível(is).</p><button type="button" id="fit-close-integrity">Fechar</button>`);
            node.querySelector('#fit-close-integrity').onclick=FitSecurity.closeDialog;return;
        }
        if(kind==='profile')router('profile');if(kind==='services')router('services');
    }
    function fillProfile() {
        if(!available())return;const profile=FitRoutineRules.profile(db);
        for(const field of ['name','brand','email','phone','registration','specialty'])document.getElementById('fit-profile-'+field).value=profile[field];
        document.getElementById('fit-profile-brand').disabled=!!(LICENSE_DATA.active&&LICENSE_DATA.businessName);
        const select=document.getElementById('fit-profile-linked');select.innerHTML='<option value="">Criar meu cadastro profissional</option>';
        for(const person of db.team){const option=document.createElement('option');option.value=person.id;option.textContent=person.name;select.appendChild(option);}select.value=profile.primaryInstructorId;
    }
    async function submitProfile(event) {
        event.preventDefault();const input=Object.fromEntries(['name','brand','email','phone','registration','specialty'].map(field=>[field,document.getElementById('fit-profile-'+field).value]));input.primaryInstructorId=document.getElementById('fit-profile-linked').value;
        if(LICENSE_DATA.active&&LICENSE_DATA.businessName)input.brand=db.settings.businessName||LICENSE_DATA.businessName;
        db=FitRoutineRules.saveProfile(db,input,getID());await save();fillProfile();render();FitSecurity.notice('Perfil profissional salvo.');
    }
    function reset() {
        dayMode='next';priorityPage=0;lastDay='';
        document.getElementById('fit-dashboard-root')?.replaceChildren();document.getElementById('fit-profile-linked')?.replaceChildren();
        const footer=document.getElementById('fit-sidebar-profile');if(footer)footer.textContent='Seu espaço de trabalho';
        const count=document.getElementById('fit-schedule-count');if(count)count.textContent='';
    }
    function setup() {
        const table=document.getElementById('clients-list')?.closest('table')?.parentElement;if(table){table.classList.add('fit-table-scroll');table.tabIndex=0;table.setAttribute('aria-label','Tabela de alunos: deslize para conferir as colunas');}
        const synchronizeScroll=()=>{const workModal=[...document.querySelectorAll('.modal-backdrop')].some(node=>!node.classList.contains('hidden'));document.body.style.overflow=workModal||!!document.querySelector('.fit-security-overlay')||document.getElementById('sidebar')?.classList.contains('open')?'hidden':'';};
        const observer=new MutationObserver(synchronizeScroll);observer.observe(document.body,{childList:true});
        for(const modal of document.querySelectorAll('.modal-backdrop,#sidebar'))observer.observe(modal,{attributes:true,attributeFilter:['class']});
        setInterval(()=>{const view=document.getElementById('view-dashboard'),root=document.getElementById('fit-dashboard-root');if(available()&&view&&!view.classList.contains('hide')&&!document.hidden&&!root?.contains(document.activeElement)&&!document.querySelector('.fit-security-overlay,.modal-backdrop:not(.hidden)'))render();},60000);
    }
    document.addEventListener('DOMContentLoaded',setup);
    window.submitFitProfile=submitProfile;
    return {appointment,render,renderSchedule,goToDate,moveDate,open,openDue,selectDay,movePriorities,fillProfile,reset};
})();
