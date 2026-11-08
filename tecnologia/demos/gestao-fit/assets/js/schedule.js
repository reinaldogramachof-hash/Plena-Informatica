const FitSchedule = (() => {
    const R=FitScheduleRules,esc=value=>sanitizeHTML(String(value??'')),el=id=>document.getElementById(id),value=id=>el(id)?.value||'';
    const days=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    let seriesPreview=null, renderedPeriod='';
    function ensure(){if(!FitSecurity.isOpen())throw new Error('Abra os registros antes de continuar.');}
    function safe(action){return (...args)=>{try{ensure();if(window.fitActionBusy)return FitSecurity.notice('Aguarde a gravação atual.');return action(...args);}catch(error){FitSecurity.notice(error.message,'error');}};}
    function slotInput(){return {durationMinutes:value('ap-duration'),location:value('ap-location'),notes:value('ap-notes')};}
    function candidate(id){
        const previousId=value('ap-id');
        if(previousId){const old=db.appointments.find(a=>a.id===previousId);if(!old)throw new Error('O agendamento anterior não está disponível.');return {...FitData.clone(old),date:value('ap-date'),time:value('ap-time')};}
        const clientId=value('ap-client'),client=FitStudentRules.student(db,clientId,true),service=db.services.find(s=>s.id===value('ap-service')),pro=db.team.find(p=>p.id===value('ap-pro'));
        if(!service||!pro)throw new Error('Escolha o serviço e o profissional.');
        const a={id,clientId,clientName:client.name,date:value('ap-date'),time:value('ap-time'),serviceId:service.id,serviceName:service.name,proId:pro.id,proName:pro.name,price:service.price,status:'pending',commissionPct:0,commissionVal:0};
        return FitCommerceRules.prepareAppointment(db,a,FitCommerce.appointmentInput());
    }
    function previewForm(){
        if(!FitSecurity.isOpen())return;const output=el('fit-appt-preview');if(!output)return;
        invalidateSeries();
        if(el('ap-repeat-enabled')?.checked){output.dataset.state='review';output.textContent='Confira a prévia de todas as datas antes de salvar a repetição.';return;}
        try{const a=candidate('fit_preview_only'),next=R.save(db,a,slotInput()),saved=next.appointments.find(item=>item.id===a.id),report=R.analyze(next,saved);output.dataset.state='ready';output.textContent=`${fmtDate(saved.date)} · ${saved.time} a ${report.endTime} · ${saved.schedule.durationMinutes} minutos · ${saved.schedule.location||'Local não informado'}. Sem sobreposição identificada nos horários conferidos.${report.warnings.length?'\n'+report.warnings.join('\n'):''}`;}
        catch(error){output.dataset.state='review';output.textContent=error.message;}
    }
    async function submitAppointment(event){
        event.preventDefault();ensure();
        if(el('ap-repeat-enabled')?.checked){
            if(value('ap-id'))throw new Error('A edição desta tela altera somente um horário. Abra uma nova série para repetir aulas.');
            const request=seriesRequest();
            if(!seriesPreview||seriesPreview.signature!==JSON.stringify(request)||seriesPreview.revision!==JSON.stringify(db)||!el('ap-series-confirm')?.checked)throw new Error('Atualize a prévia da série e confira todas as datas antes de salvar.');
            const plan=R.previewSeries(db,request.base,request.slot,request.options,request.seriesId);if(!plan.valid)throw new Error('A série possui horários que precisam de correção. Nada foi gravado.');
            db=plan.data;await save();invalidateSeries();closeModal('apptModal');FitRoutine.render();FitRoutine.renderSchedule();FitSecurity.notice(`${plan.count} aulas agendadas em uma única gravação. Nenhuma presença ou entrada financeira foi registrada.`);return;
        }
        const a=candidate(value('ap-id')||getID());db=R.save(db,a,slotInput());await save();closeModal('apptModal');FitRoutine.render();FitRoutine.renderSchedule();FitSecurity.notice(value('ap-id')?'Horário atualizado, com histórico preservado.':'Aula agendada, com duração e conflitos conferidos.');
    }
    function invalidateSeries(){seriesPreview=null;el('fit-series-preview')?.replaceChildren();const checkbox=el('ap-series-confirm');if(checkbox){checkbox.checked=false;checkbox.disabled=true;}}
    function toggleSeries(){ensure();const enabled=!!el('ap-repeat-enabled')?.checked,fields=el('ap-repeat-fields');if(fields){fields.hidden=!enabled;fields.disabled=!enabled;}previewForm();}
    function seriesRequest(){
        const options={count:Number(value('ap-repeat-count')),weekInterval:Number(value('ap-repeat-interval')),weekdays:days.flatMap((_,day)=>el('ap-repeat-day-'+day)?.checked?[day]:[])};
        return {base:candidate('series_preview_base'),slot:slotInput(),options,seriesId:value('ap-series-id')};
    }
    function previewSeries(){
        if(!el('ap-repeat-enabled')?.checked||value('ap-id'))throw new Error('Ative a repetição em um novo agendamento para conferir a série.');
        invalidateSeries();const request=seriesRequest(),plan=R.previewSeries(db,request.base,request.slot,request.options,request.seriesId),root=el('fit-series-preview');
        root.innerHTML=`<p class="fit-muted">${plan.count} aula(s) previstas. ${plan.valid?'Todas passaram pelas conferências; confirme as datas para salvar.':'Há impedimentos. Corrija-os e gere outra prévia; nenhuma aula foi gravada.'} Aulas avulsas só entram no caixa após conclusão e recebimento explícitos.</p><div class="fit-table-scroll" tabindex="0" aria-label="Prévia das aulas repetidas"><table class="fit-series-table"><thead><tr><th>Data</th><th>Horário</th><th>Conferência</th></tr></thead><tbody>${plan.rows.map(row=>`<tr><td>${esc(fmtDate(row.date))}</td><td>${esc(row.time)}${row.endTime?' a '+esc(row.endTime):''}</td><td>${row.errors.length?`<strong>Revisar</strong><ul>${row.errors.map(e=>`<li>${esc(e)}</li>`).join('')}</ul>`:`Disponível${row.periodId?' · cobertura contratada conferida':''}${row.warnings.length?`<details><summary>Observações</summary><ul>${row.warnings.map(w=>`<li>${esc(w)}</li>`).join('')}</ul></details>`:''}`}</td></tr>`).join('')}</tbody></table></div>`;
        el('ap-series-confirm').disabled=!plan.valid;
        if(plan.valid)seriesPreview={signature:JSON.stringify(request),revision:JSON.stringify(db)};
    }
    function initializeForm(){
        for(const id of ['ap-client','ap-service','ap-pro','ap-billing-mode','ap-contract','ap-standalone-price']){const field=el(id);if(field)field.disabled=false;}
        el('ap-duration').value='60';el('ap-location').value='';el('ap-notes').value='';el('fit-appt-title').textContent='Agendar aula';el('fit-appt-finance-note').hidden=true;el('fit-appt-billing-fields').hidden=false;previewForm();
        const repeat=el('ap-repeat-enabled');if(repeat){repeat.checked=false;repeat.disabled=false;el('ap-repeat-fields').hidden=true;el('ap-repeat-fields').disabled=true;el('ap-series-id').value=getID();el('ap-repeat-count').value='4';el('ap-repeat-interval').value='1';const date=value('ap-date');for(let day=0;day<7;day++)el('ap-repeat-day-'+day).checked=FitData.isDate(date)&&R.weekday(date)===day;}invalidateSeries();previewForm();
    }
    function addMissingOption(id,key,label){const field=el(id);if(![...field.options].some(o=>o.value===key)){const option=document.createElement('option');option.value=key||'';option.textContent=label||'Vínculo anterior indisponível';field.appendChild(option);}field.value=key||'';}
    function openEdit(id){
        const a=db.appointments.find(a=>a.id===id);if(!a||a.status!=='pending')throw new Error('Edite somente aulas pendentes.');openApptModal();
        el('ap-id').value=a.id;addMissingOption('ap-client',a.clientId,a.clientName);addMissingOption('ap-service',a.serviceId,a.serviceName);addMissingOption('ap-pro',a.proId,a.proName);
        for(const key of ['ap-client','ap-service','ap-pro','ap-billing-mode','ap-contract','ap-standalone-price'])el(key).disabled=true;
        el('ap-date').value=a.date;el('ap-time').value=a.time;el('ap-duration').value=a.schedule?.durationMinutes??'';el('ap-location').value=a.schedule?.location||'';el('ap-notes').value=a.schedule?.notes||'';
        el('fit-appt-title').textContent='Editar horário da aula';el('fit-appt-billing-fields').hidden=true;el('fit-appt-finance-note').hidden=false;el('ap-display-val').textContent='Cobertura e valores preservados';previewForm();
        el('ap-repeat-enabled').checked=false;el('ap-repeat-enabled').disabled=true;el('ap-repeat-fields').hidden=true;el('ap-repeat-fields').disabled=true;invalidateSeries();
    }
    function renderSchedule(){
        if(!FitSecurity.isOpen())return;const field=el('agenda-date');if(!field)return;if(!FitData.isDate(field.value))field.value=FitData.dateKey();
        const previousBoard=el('agenda-list')?.querySelector?.('.fit-timeline-scroll'),scroll=previousBoard?{top:previousBoard.scrollTop,left:previousBoard.scrollLeft}:null;
        const mode=value('fit-schedule-view')||'day',period=R.periodItems(db,field.value,mode,value('fit-schedule-status')||'all'),range=period.range,query=value('fit-schedule-search').trim().toLocaleLowerCase('pt-BR'),items=period.items.filter(a=>!query||[a.clientName,db.clients.find(c=>c.id===a.clientId)?.name,a.serviceName,a.schedule?.location].some(text=>String(text||'').toLocaleLowerCase('pt-BR').includes(query))),blocks=(db.settings.schedule?.blocks||[]).filter(b=>b.active&&b.date>=range.start&&b.date<=range.end);
        if(mode==='day')el('agenda-list').innerHTML=items.length?items.map(a=>{let warnings=[];if(a.status==='pending'){const report=R.analyze(db,a);warnings=[...report.errors,...report.warnings];}return FitRoutine.appointment(a,true)+(warnings.length?`<details class="fit-agenda-review"><summary>Conferir este horário</summary><ul>${warnings.map(w=>`<li>${esc(w)}</li>`).join('')}</ul></details>`:'');}).join(''):'<p class="fit-muted">Nenhuma aula nesta data e filtro.</p>';
        else el('agenda-list').innerHTML=mode==='month'?monthMarkup(range,items,blocks,field.value):'';
        el('fit-schedule-count').textContent=`${items.length} registro(s) de ${fmtDate(range.start)} a ${fmtDate(range.end)} · ${blocks.length} bloqueio(s). ${mode==='day'?'Durações antigas não são presumidas.':'Escolha um dia para conferir e editar as aulas.'}`;
        const root=el('fit-schedule-blocks');if(root)root.innerHTML=blocks.length?`<h3>Horários bloqueados no período</h3>${blocks.map(b=>`<article class="fit-agenda-block"><span><strong>${esc(fmtDate(b.date))} · ${esc(b.start)} a ${esc(b.end)}</strong> · ${esc(b.note||'Indisponível')}</span><button type="button" class="fit-secondary" onclick="releaseFitScheduleBlock('${b.id}')">Liberar horário</button></article>`).join('')}`:'';
        if(mode!=='month')el('agenda-list').innerHTML=timelineMarkup(range,items,blocks)+(mode==='day'?`<section class="fit-agenda-day-detail"><div class="fit-agenda-detail-heading"><h4>Aulas deste dia</h4><span>${items.length} registro(s)</span></div>${el('agenda-list').innerHTML}</section>`:'');
        const heading=el('fit-schedule-period');if(heading)heading.textContent=mode==='month'?dateLabel(field.value,{month:'long',year:'numeric'}):mode==='week'?fmtDate(range.start)+' a '+fmtDate(range.end):dateLabel(field.value,{weekday:'long',day:'numeric',month:'long'});
        const mini=el('fit-schedule-mini');if(mini)mini.innerHTML=miniMarkup(field.value);
        for(const button of document.querySelectorAll?.('[data-fit-view]')||[])button.setAttribute('aria-pressed',String(button.dataset.fitView===mode));
        const periodKey=mode+':'+range.start+':'+range.end,board=el('agenda-list')?.querySelector?.('.fit-timeline-scroll');
        if(board&&scroll&&renderedPeriod===periodKey){board.scrollTop=scroll.top;board.scrollLeft=scroll.left;}
        renderedPeriod=periodKey;
        const filtering=!!query||value('fit-schedule-status')!=='all',clear=el('fit-schedule-clear');if(clear)clear.hidden=!filtering;
        const summary=el('fit-schedule-summary');if(summary)summary.innerHTML=`<span>${filtering?'No filtro atual':'No período'}</span>${[['pending','Agendadas'],['done','Realizadas'],['missed','Faltas'],['canceled','Canceladas']].map(([status,label])=>`<span class="fit-agenda-total"><b>${items.filter(a=>a.status===status).length}</b>${label}</span>`).join('')}${filtering&&!items.length?'<strong>Nenhuma aula corresponde aos filtros. Limpe os filtros para conferir o período.</strong>':''}`;
        lucide.createIcons();
    }
    function clearFilters(){el('fit-schedule-search').value='';el('fit-schedule-status').value='all';renderSchedule();el('fit-schedule-search').focus?.();}
    function openAppointment(id){
        const a=db.appointments.find(a=>a.id===id);if(!a)throw new Error('A aula não está mais disponível. Atualize a agenda.');
        const span=R.span(a),student=db.clients.find(c=>c.id===a.clientId),labels={pending:'Agendada',done:'Realizada',canceled:'Cancelada',missed:'Falta'},warnings=a.status==='pending'?R.analyze(db,a):{errors:[],warnings:[]};
        const action=(kind,label,primary=false)=>`<button type="button" class="${primary?'fit-primary':'fit-secondary'}" onclick="FitSchedule.act('${a.id}','${kind}')">${label}</button>`;
        FitSecurity.dialog('Detalhes da aula',`<section class="fit-agenda-detail-card"><div><span class="fit-state" data-state="${esc(a.status)}">${labels[a.status]||'Conferir'}</span><h3>${esc(a.clientName||student?.name||'Aluno não vinculado')}</h3><p>${esc(a.serviceName||'Serviço anterior')}</p><small>Código da aula: ${esc(a.id)} · aluno: ${esc(a.clientId||'vínculo indisponível')}</small></div><dl><div><dt>Data e horário</dt><dd>${esc(fmtDate(a.date))} · ${esc(a.time)}${span.known?' a '+esc(R.clock(span.end)):''}</dd></div><div><dt>Duração</dt><dd>${span.known?a.schedule.durationMinutes+' minutos':'A conferir; registro anterior sem duração'}</dd></div><div><dt>Local</dt><dd>${esc(a.schedule?.location||'Não informado')}</dd></div><div><dt>Confirmação</dt><dd>${a.status==='pending'?(a.attendance?.confirmation==='confirmed'?'Confirmada com o aluno':'Ainda não confirmada'):'Situação final registrada'}</dd></div></dl></section>${a.schedule?.notes?'<p class="fit-agenda-detail-notes">'+esc(a.schedule.notes)+'</p>':''}${typeof FitAttendance!=='undefined'?FitAttendance.details(a):''}${warnings.errors.length+warnings.warnings.length?'<div class="fit-agenda-detail-warnings"><strong>Conferir este horário</strong><ul>'+[...warnings.errors,...warnings.warnings].map(text=>'<li>'+esc(text)+'</li>').join('')+'</ul><p>O registro existente foi preservado.</p></div>':''}${a.schedule?.history?.length?'<details class="fit-agenda-detail-history"><summary>Histórico de horários</summary>'+a.schedule.history.map(row=>'<p>'+esc(row.at?new Date(row.at).toLocaleString('pt-BR'):'Registro anterior')+' · '+esc(row.action==='created'?'Agendamento criado':'Horário atualizado')+(row.previous?' · anterior: '+esc(fmtDate(row.previous.date))+' '+esc(row.previous.time):'')+'</p>').join('')+'</details>':''}<p class="fit-muted">Abrir esta aula não altera presença, sessões ou dinheiro.</p><div class="fit-agenda-detail-actions">${a.status==='pending'?action(a.attendance?.confirmation==='confirmed'?'unconfirm':'confirm',a.attendance?.confirmation==='confirmed'?'Remover confirmação':'Confirmar aula')+action('edit','Editar horário')+action('miss','Registrar falta')+action('cancel','Cancelar aula')+action('complete','Concluir aula',true):a.status==='missed'?action('correct','Corrigir falta'):''}<button type="button" class="fit-secondary" onclick="FitSecurity.closeDialog()">Fechar</button></div>`,{layout:'wide'});
    }
    async function act(id,action){
        try{
            ensure();if(window.fitActionBusy)return FitSecurity.notice('Aguarde a gravação atual.');
            const a=db.appointments.find(a=>a.id===id);if(!a||!(a.status==='pending'&&['confirm','unconfirm','edit','miss','cancel','complete'].includes(action)||a.status==='missed'&&action==='correct'))throw new Error('A situação desta aula mudou. Reabra os detalhes antes de continuar.');
            if(FitSecurity.closeDialog()===false)return;
            if(action==='edit')return openEdit(id);
            if(action==='complete')return finishAppt(id);
            if(action==='cancel')return await cancelAppt(id);
            return FitAttendance.open(id,action);
        }catch(error){FitSecurity.notice(error.message,'error');}
    }
    function dateLabel(date,options){return new Intl.DateTimeFormat('pt-BR',options).format(new Date(date+'T12:00:00Z'));}
    function setView(mode){if(!['day','week','month'].includes(mode))throw new Error('Visualização inválida.');el('fit-schedule-view').value=mode;renderSchedule();}
    function selectDate(date){if(!FitData.isDate(date))throw new Error('Data inválida.');el('agenda-date').value=date;renderSchedule();}
    function miniMarkup(selected){const range=R.range(selected,'month'),today=FitData.dateKey(),marked=new Set(db.appointments.filter(a=>a.status!=='canceled').map(a=>a.date));return `<h3>${esc(dateLabel(selected,{month:'long',year:'numeric'}))}</h3><div class="fit-mini-grid">${[1,2,3,4,5,6,0].map(d=>`<span aria-hidden="true">${days[d].slice(0,3)}</span>`).join('')}${range.days.map(date=>`<button type="button" aria-label="${esc(dayLabel(date))}${marked.has(date)?' · há registros de aulas':''}" aria-pressed="${date===selected}" class="${date<range.start||date>range.end?'outside ':''}${date===today?'today ':''}${marked.has(date)?'has-appointment':''}" onclick="FitSchedule.selectDate('${date}')">${Number(date.slice(-2))}</button>`).join('')}</div>`;}
    function slotReport(date,time){const proId=db.settings.professional?.primaryInstructorId||(db.team.length===1?db.team[0].id:null);return R.analyze(db,{id:'',date,time,proId,status:'pending',schedule:{version:1,durationMinutes:60,location:'',notes:''}});}
    function openSlot(date,time){if(!FitData.isDate(date)||!FitData.validTime(time)||FitData.minutes(time)>1380)throw new Error('Horário inválido.');const report=slotReport(date,time);if(report.errors.length)throw new Error(report.errors.join('\n'));openApptModal();el('ap-date').value=date;el('ap-time').value=time;FitCommerce.configureAppointment();initializeForm();}
    function layoutEvents(events){
        let group=[],ends=[],groupEnd=-1;
        const finish=()=>{for(const item of group)item.lanes=ends.length;group=[];ends=[];groupEnd=-1;};
        for(const item of events){
            if(group.length&&item.top>=groupEnd)finish();
            let lane=ends.findIndex(end=>end<=item.top);if(lane<0)lane=ends.length;
            ends[lane]=item.top+item.height;item.lane=lane;group.push(item);groupEnd=Math.max(groupEnd,item.top+item.height);
        }
        finish();
    }
    function timelineMarkup(range,items,blocks){
        const dates=range.days,all=db.appointments.filter(a=>dates.includes(a.date)),minutes=all.flatMap(a=>{const s=R.span(a);return [s.start,s.known?s.end:1440];}).concat(blocks.flatMap(b=>[FitData.minutes(b.start),FitData.minutes(b.end)])),slots=db.settings.schedule?.availability?.enabled?db.settings.schedule.availability.slots:[];
        for(const slot of slots)minutes.push(FitData.minutes(slot.start),FitData.minutes(slot.end));
        const from=Math.max(0,Math.floor(Math.min(420,...minutes)/60)*60),to=Math.min(1440,Math.ceil(Math.max(1260,...minutes)/60)*60),scale=1.2,height=(to-from)*scale+44,ticks=[];
        for(let minute=from;minute<to;minute+=60)ticks.push(minute);
        return `<div class="fit-timeline-scroll" tabindex="0" role="region" aria-label="Grade de horários da ${range.mode==='week'?'semana':'data selecionada'}"><div class="fit-time-grid" style="--fit-days:${dates.length};--fit-grid-height:${height}px"><div class="fit-time-corner">Horário</div>${dates.map(date=>`<button type="button" class="fit-time-date${date===FitData.dateKey()?' today':''}" onclick="FitSchedule.openDay('${date}')"><span>${esc(dateLabel(date,{weekday:'short'}))}</span><strong>${Number(date.slice(-2))}</strong></button>`).join('')}<div class="fit-time-axis" style="height:${height}px">${ticks.map(minute=>`<span style="top:${(minute-from)*scale}px">${R.clock(minute)}</span>`).join('')}</div>${dates.map(date=>{
            const events=items.filter(a=>a.date===date).map(a=>{const s=R.span(a),top=(s.start-from)*scale;return {a,top,height:Math.min(Math.max(44,(s.known?s.end-s.start:40)*scale),height-top),lane:0};}).sort((a,b)=>a.top-b.top);
            layoutEvents(events);
            return `<div class="fit-time-day" style="height:${height}px">${ticks.map(minute=>{const time=R.clock(minute),report=slotReport(date,time),blocked=report.errors.length>0;return `<button type="button" class="fit-free-slot" style="top:${(minute-from)*scale}px;height:72px" ${blocked?'disabled ':''}aria-label="${esc(dayLabel(date))}, ${time}${blocked?' · indisponível':' · agendar aula de 60 minutos'}" title="${esc(blocked?report.errors.join(' '):'Agendar às '+time)}" onclick="FitSchedule.openSlot('${date}','${time}')"></button>`;}).join('')}${blocks.filter(b=>b.date===date).map(b=>`<div class="fit-time-block" style="top:${(FitData.minutes(b.start)-from)*scale}px;height:${(FitData.minutes(b.end)-FitData.minutes(b.start))*scale}px" title="${esc(b.note||'Horário bloqueado')}"><span>Bloqueado · ${esc(b.start)}–${esc(b.end)}</span></div>`).join('')}${events.map(({a,top,height,lane,lanes})=>{const width=100/lanes,known=R.span(a).known,name=a.clientName||db.clients.find(c=>c.id===a.clientId)?.name||'Aluno anterior',end=known?R.clock(R.span(a).end):'duração a conferir',label=a.time+' · '+name+' · '+end+' · '+({pending:'Agendada',done:'Realizada',canceled:'Cancelada',missed:'Falta'})[a.status]+(a.schedule?.location?' · '+a.schedule.location:'');return `<button type="button" class="fit-time-event" data-state="${a.status}" style="top:${top}px;height:${height}px;left:calc(${lane*width}% + 4px);width:calc(${width}% - 8px)" title="${esc(label)}" aria-label="${esc(label)}" onclick="FitSchedule.openAppointment('${a.id}')"><strong>${esc(a.time)} · ${esc(name)}${a.status==='pending'&&a.attendance?.confirmation==='confirmed'?' · confirmada':''}</strong><span>${esc(a.serviceName||'Serviço anterior')}</span><small>${esc(known?end:'Duração a conferir')}${a.schedule?.location?' · '+esc(a.schedule.location):''}</small></button>`;}).join('')}</div>`;
        }).join('')}</div></div>`;
    }
    function dayLabel(date){return days[R.weekday(date)]+' · '+fmtDate(date);}
    function monthMarkup(range,items,blocks,selected){const today=FitData.dateKey();return `<div class="fit-month-scroll" tabindex="0" aria-label="Calendário mensal"><div class="fit-month-grid">${[1,2,3,4,5,6,0].map(d=>`<div class="fit-month-weekday">${days[d].slice(0,3)}</div>`).join('')}${range.days.map(date=>{const inside=date>=range.start&&date<=range.end,list=inside?items.filter(a=>a.date===date):[],blocked=inside?blocks.filter(b=>b.date===date).length:0;return `<button type="button" class="fit-month-day${inside?'':' outside'}${date===today?' today':''}${date===selected?' selected':''}" onclick="FitSchedule.openDay('${date}')" aria-label="${esc(dayLabel(date))}${inside?' · '+list.length+' aula(s), '+blocked+' bloqueio(s)':' · abrir este dia'}"><strong>${Number(date.slice(-2))}${date===today?' · hoje':''}</strong>${list.slice(0,2).map(a=>`<span data-state="${a.status}">${esc(a.time)} · ${esc(a.clientName||'Aluno anterior')}</span>`).join('')}${list.length>2?`<small>+${list.length-2} aula(s)</small>`:''}${blocked?`<small>${blocked} bloqueio(s)</small>`:''}</button>`;}).join('')}</div></div>`;}
    function openDay(date){if(!FitData.isDate(date))throw new Error('Data inválida.');const mode=el('fit-schedule-view');if(mode)mode.value='day';el('agenda-date').value=date;router('schedule');renderSchedule();}
    function movePeriod(amount){const mode=value('fit-schedule-view')||'day';el('agenda-date').value=R.move(value('agenda-date')||FitData.dateKey(),mode,amount);renderSchedule();}
    function today(){el('agenda-date').value=FitData.dateKey();renderSchedule();}
    function availabilityInput(){
        const slots=[];for(let day=0;day<7;day++){if(!el('fit-hours-day-'+day).checked)continue;for(let i=0;i<2;i++){const start=value(`fit-hours-${day}-${i}-start`),end=value(`fit-hours-${day}-${i}-end`);if(i===0||start||end)slots.push({day,start,end});}}
        return {enabled:el('fit-hours-enabled').checked,slots};
    }
    function openAvailability(kind,studentId=''){
        const c=kind==='student'?FitStudentRules.student(db,studentId,true):null,current=kind==='student'?c.fitProfile?.weeklyAvailability:db.settings.schedule?.availability;
        FitSecurity.dialog(kind==='student'?'Disponibilidade de '+c.name:'Disponibilidade do personal',`<p class="fit-dialog-intro">Organize sua semana com até dois intervalos por dia. Os dias desmarcados ficam indisponíveis quando estes horários estiverem ativos.</p><form onsubmit="submitFitAvailability(event)"><input type="hidden" id="fit-hours-kind" value="${esc(kind)}"><input type="hidden" id="fit-hours-student" value="${esc(studentId)}"><label class="fit-hours-enable"><input id="fit-hours-enabled" type="checkbox" ${current?.enabled?'checked':''}><span>Aplicar esta disponibilidade na agenda<small>Aulas já cadastradas serão preservadas para conferência.</small></span></label><div class="fit-hours-list">${[1,2,3,4,5,6,0].map(day=>{const slots=(current?.slots||[]).filter(s=>s.day===day).sort((a,b)=>a.start.localeCompare(b.start));return `<fieldset class="fit-hours-row"><legend class="sr-only">${days[day]}</legend><label class="fit-hours-day"><input id="fit-hours-day-${day}" type="checkbox" ${slots.length?'checked':''}><span>${days[day]}</span></label>${[0,1].map(i=>`<div class="fit-hours-interval"><label for="fit-hours-${day}-${i}-start">${i===0?'1º intervalo':'2º intervalo (opcional)'}<input id="fit-hours-${day}-${i}-start" type="time" value="${esc(slots[i]?.start||'')}"></label><label for="fit-hours-${day}-${i}-end">Até<input id="fit-hours-${day}-${i}-end" type="time" value="${esc(slots[i]?.end||'')}"></label></div>`).join('')}</fieldset>`;}).join('')}</div><div class="fit-dialog-actions"><span>Desative a opção acima para deixar de aplicar estes horários.</span><button type="button" onclick="FitSecurity.closeDialog()">Voltar</button><button type="submit">Salvar disponibilidade</button></div></form>`,{layout:'wide',kind:'availability'});
    }
    async function submitAvailability(event){event.preventDefault();ensure();db=R.saveAvailability(db,value('fit-hours-kind'),value('fit-hours-student'),availabilityInput());await save();FitSecurity.closeDialog();FitRoutine.render();renderSchedule();FitSecurity.notice('Disponibilidade salva. Aulas anteriores foram preservadas para conferência.');}
    function openBlock(){
        FitSecurity.dialog('Bloquear horário do personal',`<p>O bloqueio impede novos horários nesse intervalo. Aulas já cadastradas são preservadas e sinalizadas para revisão.</p><form onsubmit="submitFitScheduleBlock(event)"><input id="fit-block-id" type="hidden" value="${getID()}"><label>Data<input id="fit-block-date" type="date" value="${esc(value('agenda-date')||FitData.dateKey())}" required></label><div class="fit-hours-interval"><label>De<input id="fit-block-start" type="time" required></label><label>Até<input id="fit-block-end" type="time" required></label></div><label>Motivo ou compromisso<input id="fit-block-note" maxlength="500"></label><button type="submit">Bloquear horário</button><button type="button" onclick="FitSecurity.closeDialog()">Voltar</button></form>`,{layout:'wide'});
    }
    async function submitBlock(event){event.preventDefault();ensure();db=R.block(db,{date:value('fit-block-date'),start:value('fit-block-start'),end:value('fit-block-end'),note:value('fit-block-note')},value('fit-block-id'));await save();FitSecurity.closeDialog();FitRoutine.render();renderSchedule();FitSecurity.notice('Horário bloqueado. Confira eventuais aulas já existentes nesse intervalo.');}
    async function releaseBlock(id){ensure();if(!confirm('Liberar este intervalo para novos agendamentos?'))return;db=R.release(db,id);await save();FitRoutine.render();renderSchedule();FitSecurity.notice('Horário liberado. O registro do bloqueio foi preservado.');}
    function reset(){renderedPeriod='';invalidateSeries();el('fit-schedule-blocks')?.replaceChildren();el('fit-schedule-mini')?.replaceChildren();for(const id of ['fit-schedule-count','fit-schedule-period']){const node=el(id);if(node)node.textContent='';}const search=el('fit-schedule-search');if(search)search.value='';const output=el('fit-appt-preview');if(output)output.textContent='';const mode=el('fit-schedule-view');if(mode)mode.value='day';}
    return {openAppointment:safe(openAppointment),act,clearFilters:safe(clearFilters),setView:safe(setView),selectDate:safe(selectDate),openSlot:safe(openSlot),previewForm,initializeForm,submitAppointment,renderSchedule,openEdit:safe(openEdit),openAvailability:safe(openAvailability),openBlock:safe(openBlock),submitAvailability,submitBlock,releaseBlock,reset,toggleSeries,previewSeries:safe(previewSeries),openDay:safe(openDay),movePeriod:safe(movePeriod),today:safe(today)};
})();
function submitFitAvailability(event){return FitSchedule.submitAvailability(event);}
function submitFitScheduleBlock(event){return FitSchedule.submitBlock(event);}
function releaseFitScheduleBlock(id){return FitSchedule.releaseBlock(id);}
