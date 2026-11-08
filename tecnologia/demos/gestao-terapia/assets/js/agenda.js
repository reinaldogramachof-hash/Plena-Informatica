const TherapyAgenda = (() => {
    const R=TherapyAgendaRules;
    const state={view:null,status:'all',search:''};
    const panelsKey='terapia_agenda_panels_collapsed';
    let panelsCollapsed=false;
    try{panelsCollapsed=localStorage.getItem(panelsKey)==='true';}catch{}
    const esc=value=>sanitizeHTML(String(value??''));
    const dateLabel=(date,options={day:'numeric',month:'long',year:'numeric'})=>new Intl.DateTimeFormat('pt-BR',options).format(new Date(date+'T12:00:00'));
    const date=()=>document.getElementById('schedule-date').value||TherapyData.dateKey();
    const patient=item=>db.patients.find(p=>p.id===item.patientId)?.name||'Paciente não encontrado';
    const kind={national:'Feriado nacional',state:'Feriado estadual',municipal:'Feriado municipal',reference:'Data de referência',closure:'Data do consultório'};
    function dates(day,cfg){return R.holidays(Number(day.slice(0,4)),cfg).filter(item=>item.date===day).concat(cfg.blocks.filter(item=>day>=item.startDate&&day<=item.endDate).map(item=>({name:'Bloqueio: '+item.reason+(item.allDay?' · Dia inteiro':' · '+item.startTime+'–'+item.endTime),kind:'closure',blocked:true})));}
    const dateName=item=>(item.kind==='reference'?'Ref. ':'')+item.name;
    function badges(day,cfg){return dates(day,cfg).map(item=>`<span class="agenda-date-badge ${item.blocked?'is-blocked':''}" data-kind="${item.kind}" title="${esc(kind[item.kind]+': '+item.name)}${item.blocked?' · Bloqueado':''}">${esc(dateName(item))}</span>`).join('');}
    function filtered(cfg){return db.appointments.filter(item=>TherapyCoverageRules.matches(item,document.getElementById('agenda-coverage-filter')?.value)&&(state.status==='all'?(cfg.showInactive||!['cancelled','no_show'].includes(item.status)):state.status==='active'?!['completed','cancelled','no_show'].includes(item.status):item.status===state.status)&&(!state.search||patient(item).toLocaleLowerCase('pt-BR').includes(state.search))).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));}
    function name(item,cfg){return cfg.hideNames?'Sessão reservada':patient(item);}
    function row(item,cfg){return `<button type="button" class="agenda-list-item coverage-appointment" style="--coverage-color:${TherapyCoverageRules.of(item).color}" data-appointment="${item.id}" onclick="TherapyAgenda.openAppointment('${item.id}')"><span class="agenda-list-time">${esc(item.time)}<small>${esc(R.time(Math.min(1440,R.minutes(item.time)+Number(item.duration))))}</small></span><span class="agenda-list-copy"><strong>${esc(name(item,cfg))}</strong><small>${esc(item.type||'Sessão')} · ${Number(item.duration)} min</small>${TherapyCoverageUI.badge(item)}</span><span class="agenda-status" data-status="${esc(item.status||'scheduled')}">${esc(getStatusText(item.status||'scheduled'))}</span></button>`;}
    function mini(cfg){
        const selected=date(),month=selected.slice(0,7),days=R.month(selected,cfg.weekStartsOn),today=TherapyData.dateKey();
        document.getElementById('agenda-mini').innerHTML=`<div class="agenda-panel-heading"><h3>${esc(dateLabel(selected,{month:'long',year:'numeric'}))}</h3><button type="button" class="agenda-panel-toggle" onclick="TherapyAgenda.togglePanels()" aria-label="Recolher calendário e legendas" title="Recolher calendário e legendas" aria-expanded="true" aria-controls="agenda-mini agenda-legend"><span aria-hidden="true">‹</span></button></div><div class="agenda-mini-grid">${R.week(selected,cfg.weekStartsOn).map(day=>`<span>${esc(dateLabel(day,{weekday:'narrow'}))}</span>`).join('')}${days.map(day=>`<button type="button" aria-label="Selecionar ${esc(dateLabel(day))}" aria-pressed="${day===selected}" class="${day.slice(0,7)!==month?'is-outside':''} ${day===today?'is-today':''} ${dates(day,cfg).length?'has-date':''}" onclick="TherapyAgenda.select('${day}')">${Number(day.slice(8))}</button>`).join('')}</div>`;
    }
    function monthView(cfg,items){
        const selected=date(),month=selected.slice(0,7),days=R.month(selected,cfg.weekStartsOn);
        return `<div class="agenda-month" role="group" aria-label="Calendário mensal"><div class="agenda-month-weekdays">${days.slice(0,7).map(day=>`<span>${esc(dateLabel(day,{weekday:'short'}))}</span>`).join('')}</div><div class="agenda-month-grid">${days.map(day=>{
            const entries=items.filter(item=>item.date===day),marks=dates(day,cfg),off=!cfg.weekDays[new Date(day+'T12:00:00').getDay()].enabled;
            const marksHtml=marks.slice(0,2).map(item=>`<span class="agenda-month-holiday ${item.blocked?'is-blocked':''}" data-kind="${item.kind}" title="${esc(kind[item.kind]+': '+item.name)}">${esc(dateName(item))}</span>`).join('');
            const eventsHtml=entries.slice(0,3).map(item=>`<span class="agenda-month-event coverage-appointment" style="--coverage-color:${TherapyCoverageRules.of(item).color}" data-status="${esc(item.status||'scheduled')}">${esc(item.time)} ${esc(name(item,cfg))}${TherapyCoverageUI.badge(item)}</span>`).join('');
            return `<button type="button" class="agenda-month-day ${day.slice(0,7)!==month?'is-outside':''} ${off?'is-day-off':''} ${day===TherapyData.dateKey()?'is-today':''}" data-date="${day}" aria-pressed="${day===selected}" aria-label="${esc(dateLabel(day))}: ${entries.length} marcações${marks.length?', '+esc(marks.map(item=>item.name).join(', ')):''}" onclick="TherapyAgenda.select('${day}',true)"><span class="agenda-day-number">${Number(day.slice(8))}</span>${marksHtml}${marks.length>2?`<small>+${marks.length-2} datas</small>`:''}${eventsHtml}${entries.length>3?`<small>+${entries.length-3} marcações</small>`:''}</button>`;
        }).join('')}</div></div>`;
    }
    function slotReason(day,start,duration,cfg){return R.reason(cfg,day,start,duration)||(R.conflict(db.appointments,{date:day,time:R.time(start),duration},cfg.bufferMinutes)?'Horário ocupado ou dentro do intervalo entre sessões.':'');}
    function timeView(cfg,items){
        const days=state.view==='day'?[date()]:R.week(date(),cfg.weekStartsOn).filter(day=>cfg.showWeekends||day===date()||items.some(item=>item.date===day)||![0,6].includes(new Date(day+'T12:00:00').getDay()));
        const visible=items.filter(item=>days.includes(item.date)),step=cfg.slotMinutes,pixels=cfg.density==='compact'?1:1.25;
        let start=R.minutes(cfg.displayStart),end=R.minutes(cfg.displayEnd);
        for(const item of visible){start=Math.min(start,Math.floor(R.minutes(item.time)/step)*step);end=Math.max(end,R.minutes(item.time)+Number(item.duration));}
        start=Math.max(0,start);end=Math.min(1440,Math.ceil(end/step)*step);
        const slots=[];for(let minute=start;minute<end;minute+=step)slots.push(minute);
        const duration=Number(db.settings.sessionDuration)||50,height=(end-start)*pixels;
        return `<div class="agenda-grid-scroll" tabindex="0" role="region" aria-label="Grade de horários. Use as setas nos horários livres e Enter para agendar."><div class="agenda-time-grid" style="--agenda-days:${days.length};--agenda-slot-height:${step*pixels}px;--agenda-height:${height}px"><div class="agenda-grid-corner">Horários</div>${days.map(day=>`<button type="button" class="agenda-grid-date ${day===TherapyData.dateKey()?'is-today':''}" onclick="TherapyAgenda.select('${day}',true)"><strong>${esc(dateLabel(day,{weekday:'short',day:'numeric',month:'2-digit'}))}</strong>${badges(day,cfg)||`<small>${cfg.weekDays[new Date(day+'T12:00:00').getDay()].enabled?'Expediente cadastrado':'Sem expediente cadastrado'}</small>`}</button>`).join('')}<div class="agenda-time-labels" style="height:${height}px">${slots.map(minute=>`<span style="top:${(minute-start)*pixels}px">${minute%30===0?R.time(minute):''}</span>`).join('')}</div>${days.map(day=>{
            const entries=R.layout(visible.filter(item=>item.date===day));
            return `<div class="agenda-time-day" data-day="${day}" style="height:${height}px">${slots.map(minute=>{
                const reason=slotReason(day,minute,duration,cfg),off=!R.withinHours(cfg,day,minute,Math.min(step,end-minute));
                return `<button type="button" class="agenda-free-slot ${off?'is-outside-hours':''}" tabindex="-1" data-slot="${day}T${R.time(minute)}" style="top:${(minute-start)*pixels}px;height:${Math.min(step,end-minute)*pixels}px" ${reason?'disabled':''} title="${esc(reason||'Agendar às '+R.time(minute))}" aria-label="${esc(dateLabel(day))}, ${R.time(minute)}${reason?': '+esc(reason):': horário livre'}" onclick="TherapyAgenda.create('${day}','${R.time(minute)}')"></button>`;
            }).join('')}${cfg.blocks.filter(block=>day>=block.startDate&&day<=block.endDate).map(block=>{const from=block.allDay?start:Math.max(start,R.minutes(block.startTime)),to=block.allDay?end:Math.min(end,R.minutes(block.endTime));return to>from?`<span class="agenda-block-shade" style="top:${(from-start)*pixels}px;height:${(to-from)*pixels}px">${esc(block.reason)}</span>`:'';}).join('')}${entries.map(item=>`<button type="button" class="agenda-event coverage-appointment" data-appointment="${item.id}" data-status="${esc(item.status||'scheduled')}" style="--coverage-color:${TherapyCoverageRules.of(item).color};top:${(R.minutes(item.time)-start)*pixels}px;height:${Math.max(10,Number(item.duration)*pixels-2)}px;left:calc(${item.lane/item.lanes*100}% + 2px);width:calc(${100/item.lanes}% - 4px)" aria-label="${esc(item.time)} · ${esc(name(item,cfg))} · ${esc(getStatusText(item.status||'scheduled'))} · ${esc(TherapyCoverageRules.label(item))}" title="${esc(item.time+' · '+name(item,cfg)+' · '+getStatusText(item.status||'scheduled')+' · '+TherapyCoverageRules.label(item))}" onclick="TherapyAgenda.openAppointment('${item.id}')"><strong>${esc(item.time)}</strong><span>${esc(name(item,cfg))}</span>${TherapyCoverageUI.badge(item)}<small>${esc(getStatusText(item.status||'scheduled'))}</small></button>`).join('')}</div>`;
        }).join('')}</div></div>`;
    }
    function listView(cfg,items){
        const selected=date(),entries=items.filter(item=>item.date.slice(0,7)===selected.slice(0,7)),days=[...new Set(entries.map(item=>item.date))];
        return days.length?days.map(day=>`<section class="agenda-list-day"><h3>${esc(dateLabel(day,{weekday:'long',day:'numeric',month:'long'}))}</h3><div class="agenda-day-marks">${badges(day,cfg)}</div>${entries.filter(item=>item.date===day).map(item=>row(item,cfg)).join('')}</section>`).join(''):'<p class="agenda-empty">Nenhuma marcação neste mês com os filtros atuais.</p>';
    }
    function render(){
        if(typeof db==='undefined'||!TherapyVault.isOpen())return;
        const cfg=R.read(db.settings),input=document.getElementById('schedule-date');if(!R.validDate(input.value))input.value=TherapyData.dateKey();
        if(!state.view)state.view=cfg.defaultView;
        state.status=document.getElementById('agenda-status-filter').value;state.search=document.getElementById('agenda-search').value.trim().toLocaleLowerCase('pt-BR');
        const items=filtered(cfg),selected=date(),week=R.week(selected,cfg.weekStartsOn),old=document.querySelector('.agenda-grid-scroll'),scroll=old?{top:old.scrollTop,left:old.scrollLeft}:null;
        document.getElementById('schedule-period-label').textContent=state.view==='day'?dateLabel(selected):state.view==='week'?dateLabel(week[0],{day:'numeric',month:'short'})+' — '+dateLabel(week[6]):dateLabel(selected,{month:'long',year:'numeric'});
        document.querySelectorAll('[data-agenda-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.agendaView===state.view)));
        document.getElementById('agenda-policy-summary').textContent=[cfg.city&&cfg.state?cfg.city+' / '+cfg.state:'Brasil',cfg.enforceHours?'Expediente restritivo':'Expediente indicativo',cfg.bufferMinutes?cfg.bufferMinutes+' min entre sessões':'Sem intervalo obrigatório'].join(' · ');
        mini(cfg);syncPanels();TherapyCoverageUI.renderAgenda(items.filter(item=>state.view==='day'?item.date===selected:state.view==='week'?week.includes(item.date):item.date.slice(0,7)===selected.slice(0,7)));
        const container=document.getElementById('schedule-timeline');container.innerHTML=state.view==='month'?monthView(cfg,items):state.view==='list'?listView(cfg,items):timeView(cfg,items);
        const board=container.querySelector('.agenda-grid-scroll');if(board&&scroll){board.scrollTop=scroll.top;board.scrollLeft=scroll.left;}
        const first=container.querySelector('.agenda-free-slot:not(:disabled)');if(first)first.tabIndex=0;
        document.getElementById('agenda-period-count').textContent=items.filter(item=>state.view==='day'?item.date===selected:state.view==='week'?week.includes(item.date):item.date.slice(0,7)===selected.slice(0,7)).length+' marcações na vista atual';
        updateBackToTop();
    }
    function select(day,detail=false){if(!R.validDate(day))return;document.getElementById('schedule-date').value=day;render();if(detail){const heading=document.getElementById('schedule-period-label');heading?.scrollIntoView({block:'nearest'});heading?.focus({preventScroll:true});}}
    function view(value){if(!['day','week','month','list'].includes(value))return;state.view=value;render();}
    function navigate(delta){
        const selected=date();if(state.view==='day'||state.view==='week')return select(R.addDays(selected,delta*(state.view==='day'?1:7)));
        const next=new Date(selected.slice(0,7)+'-01T12:00:00');next.setMonth(next.getMonth()+delta);const last=new Date(next.getFullYear(),next.getMonth()+1,0).getDate();next.setDate(Math.min(Number(selected.slice(8)),last));select(TherapyData.dateKey(next));
    }
    function create(day=date(),time=''){
        if(!TherapyVault.isOpen())return;const cfg=R.read(db.settings);
        if(time){const reason=slotReason(day,R.minutes(time),Number(db.settings.sessionDuration)||50,cfg);if(reason)return therapyNotice(reason,'error');}
        openAppointmentModal();document.getElementById('appointment-date').value=day;if(time)document.getElementById('appointment-time').value=time;
    }
    function closeDialog(){document.getElementById('therapy-dialog')?.remove();}
    function openAppointment(id){
        if(!TherapyVault.isOpen())return;const item=db.appointments.find(a=>a.id===id);if(!item)return;
        const cfg=R.read(db.settings),problem=R.reason(cfg,item.date,R.minutes(item.time),Number(item.duration)),session=db.sessions.find(s=>s.appointmentId===id&&s.patientId===item.patientId),draft=(db.sessionDrafts||[]).find(d=>d.appointmentId===id&&d.patientId===item.patientId);
        TherapyVault.dialog('Marcação da Agenda',`<p><strong>${esc(patient(item))}</strong><br>${esc(dateLabel(item.date))} · ${esc(item.time)} · ${Number(item.duration)} min<br>${esc(item.type||'Sessão')} · ${esc(getStatusText(item.status||'scheduled'))}</p>${TherapyCoverageUI.badge(item)}${item.notes?`<p>${esc(item.notes)}</p>`:''}${problem?`<p class="agenda-warning">${esc(problem)} Marcação existente preservada.</p>`:''}${TherapyExternal.actions(item)}<div class="therapy-actions">${!['cancelled','no_show'].includes(item.status)?`<button type="button" onclick="TherapyAgenda.register('${id}')">${session?'Conferir anotação':draft?'Retomar rascunho':item.status==='completed'?'Recuperar anotação':'Registrar atendimento'}</button>`:''}${session?`<button type="button" onclick="TherapyCare.payment('${session.id}')">Conferir cobrança</button>`:''}${item.status!=='completed'?`<button type="button" onclick="TherapyAgenda.status('${id}')">Situação</button><button type="button" onclick="TherapyAgenda.edit('${id}')">Alterar horário</button>`:''}<button type="button" onclick="this.closest('#therapy-dialog').remove()">Fechar</button></div>`);
    }
    function syncPanels(){
        document.querySelector('#view-schedule .agenda-layout').classList.toggle('agenda-panels-collapsed',panelsCollapsed);
        for(const id of ['agenda-mini','agenda-legend'])document.getElementById(id).hidden=panelsCollapsed;
        document.getElementById('agenda-panels-expand').hidden=!panelsCollapsed;
        document.querySelectorAll('.agenda-panel-toggle,#agenda-panels-expand').forEach(button=>button.setAttribute('aria-expanded',String(!panelsCollapsed)));
    }
    function togglePanels(){
        panelsCollapsed=!panelsCollapsed;
        try{localStorage.setItem(panelsKey,String(panelsCollapsed));}catch{}
        syncPanels();updateBackToTop();
        const target=panelsCollapsed?document.getElementById('agenda-panels-expand'):[...document.querySelectorAll('.agenda-panel-toggle')].find(button=>button.getClientRects().length);
        target?.focus({preventScroll:true});
    }
    function updateBackToTop(){
        const button=document.getElementById('agenda-back-to-top'),workspace=document.getElementById('therapy-workspace-scroll'),view=document.getElementById('view-schedule'),toolbar=view?.querySelector('.agenda-toolbar');
        if(!button||!workspace||!toolbar)return;
        button.hidden=state.view!=='list'||view.classList.contains('hide')||toolbar.getBoundingClientRect().bottom>workspace.getBoundingClientRect().top;
    }
    function backToTop(){
        const workspace=document.getElementById('therapy-workspace-scroll');
        workspace.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
        document.getElementById('schedule-date').focus({preventScroll:true});
    }
    function reset(){state.view=null;state.status='all';state.search='';document.getElementById('agenda-search').value='';document.getElementById('agenda-status-filter').value='all';document.getElementById('schedule-timeline')?.replaceChildren();document.getElementById('agenda-mini')?.replaceChildren();updateBackToTop();}
    document.addEventListener('DOMContentLoaded',()=>{
        document.getElementById('therapy-workspace-scroll').addEventListener('scroll',updateBackToTop,{passive:true});
        window.addEventListener('resize',updateBackToTop);
        new MutationObserver(updateBackToTop).observe(document.getElementById('view-schedule'),{attributes:true,attributeFilter:['class']});
        updateBackToTop();
        document.getElementById('schedule-timeline').addEventListener('keydown',event=>{
            const current=event.target.closest('[data-slot]');if(!current||!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
            const columns=[...document.querySelectorAll('.agenda-time-day')],column=current.closest('.agenda-time-day'),slots=[...column.querySelectorAll('.agenda-free-slot:not(:disabled)')];let next;
            if(event.key==='Home')next=slots[0];else if(event.key==='End')next=slots.at(-1);else if(event.key==='ArrowDown'||event.key==='ArrowUp')next=slots[slots.indexOf(current)+(event.key==='ArrowDown'?1:-1)];else{const neighbour=columns[columns.indexOf(column)+(event.key==='ArrowRight'?1:-1)];next=neighbour?.querySelector(`[data-slot$="${current.dataset.slot.slice(10)}"]:not(:disabled)`);}
            if(next){event.preventDefault();current.tabIndex=-1;next.tabIndex=0;next.focus();}
        });
    });
    return {render,select,view,navigate,create,date,reset,openAppointment,backToTop,togglePanels,resetView(){state.view=null;render();},register(id){closeDialog();const session=db.sessions.find(s=>s.appointmentId===id);if(session)return TherapySessions.detail(session.id);TherapySessions.register(id);},status(id){closeDialog();changeAppointmentStatus(id);},edit(id){closeDialog();openAppointmentModal(id);}};
})();
