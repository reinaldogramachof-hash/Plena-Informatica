const FitAttendance = (() => {
    const R=FitAttendanceRules,esc=value=>sanitizeHTML(String(value??'')),el=id=>document.getElementById(id),value=id=>el(id)?.value||'';
    let prepared=null;
    function ensure(){if(!FitSecurity.isOpen())throw new Error('Abra os registros antes de continuar.');}
    function safe(action){return (...args)=>{try{ensure();if(window.fitActionBusy)return FitSecurity.notice('Aguarde a gravação atual.');return action(...args);}catch(error){FitSecurity.notice(error.message,'error');}};}
    function request(){return {id:value('fit-attendance-id'),action:value('fit-attendance-action'),reason:value('fit-attendance-reason'),effect:value('fit-attendance-effect')};}
    function apply(input){
        if(input.action==='confirm'||input.action==='unconfirm')return R.confirm(db,input.id,input.action==='confirm',input.reason);
        if(input.action==='miss')return R.miss(db,input.id,{effect:input.effect,reason:input.reason});
        if(input.action==='correct')return R.correctAbsence(db,input.id,input.reason);
        throw new Error('Ação de atendimento inválida.');
    }
    function preview(){
        prepared=null;const checkbox=el('fit-attendance-confirm'),output=el('fit-attendance-preview');if(!checkbox||!output)return;checkbox.checked=false;checkbox.disabled=true;
        try{ensure();const input=request(),next=apply(input),a=next.appointments.find(a=>a.id===input.id),messages={confirm:'Aula marcada como confirmada pelo aluno. Isso não registra presença nem consome sessão.',unconfirm:'A confirmação será removida. A aula continuará agendada, com histórico preservado.',miss:a.attendance?.absence?.effect==='consume'?'Falta registrada com consumo de uma sessão do período contratado. Nenhuma presença será registrada.':'Falta registrada sem consumo de sessão. A aula deixa de ocupar capacidade de agendamento.',correct:'A aula voltará a ficar agendada e precisará de nova confirmação. O consumo desta falta será revertido, se houver, sem apagar o histórico.'};output.textContent=messages[input.action]+' Nenhum recebimento ou estorno será lançado. Valores contratados e recebimentos anteriores serão preservados.';output.dataset.state='ready';checkbox.disabled=false;prepared={signature:JSON.stringify(input),revision:JSON.stringify(db)};}
        catch(error){output.textContent=error.message;output.dataset.state='review';}
    }
    function open(id,action){
        const a=db.appointments.find(a=>a.id===id);if(!a)throw new Error('Aula não encontrada.');const titles={confirm:'Confirmar aula com o aluno',unconfirm:'Remover confirmação da aula',miss:'Registrar falta',correct:'Corrigir registro de falta'};if(!titles[action])throw new Error('Ação inválida.');
        if(action==='correct'?a.status!=='missed':a.status!=='pending')throw new Error('A situação desta aula não permite essa ação.');
        const missing=action==='miss',required=missing||action==='correct';prepared=null;
        FitSecurity.dialog(titles[action],`<p>${esc(a.clientName||db.clients.find(c=>c.id===a.clientId)?.name||'Aluno anterior')} · ${esc(fmtDate(a.date))} às ${esc(a.time)}. ${missing?'Registre somente após o término previsto e confira a regra combinada para esta aula.':action==='correct'?'A correção mantém o registro anterior no histórico e devolve a aula à agenda.':'Use esta ação depois de combinar o encontro com o aluno. Nenhuma mensagem será enviada.'}</p><form onsubmit="submitFitAttendance(event)" oninput="if(event.target.id!=='fit-attendance-confirm')FitAttendance.preview()"><input id="fit-attendance-id" type="hidden" value="${a.id}"><input id="fit-attendance-action" type="hidden" value="${action}">${missing?`<label>Como tratar a sessão<select id="fit-attendance-effect" required><option value="">Escolha a regra combinada...</option><option value="waived">Sem consumo de sessão</option>${a.billing?.mode==='contract'?'<option value="consume">Consumir uma sessão do contrato</option>':''}</select></label><p class="fit-muted">${a.billing?.mode==='contract'?'O consumo depende da cobertura, vigência e saldo disponíveis. A falta não quita nem altera o valor contratado.':'Aula avulsa ou anterior: a falta não cria uma nova cobrança. Recebimentos anteriores permanecem no histórico.'}</p>`:''}<label>${required?'Justificativa e regra combinada':'Observação (opcional)'}<textarea id="fit-attendance-reason" rows="3" maxlength="${required?1000:2000}" ${required?'required minlength="3"':''}></textarea></label><p id="fit-attendance-preview" class="fit-commerce-preview" role="status"></p><label><input id="fit-attendance-confirm" type="checkbox" required disabled> Conferi a aula, a decisão e seus efeitos.</label><div class="fit-dialog-actions"><button type="button" onclick="FitSecurity.closeDialog()">Voltar</button><button type="submit">${esc(titles[action])}</button></div></form>`,{layout:'wide'});preview();
    }
    async function submit(event){
        event.preventDefault();ensure();const input=request();if(!prepared||prepared.signature!==JSON.stringify(input)||prepared.revision!==JSON.stringify(db)||!el('fit-attendance-confirm')?.checked)throw new Error('Confira novamente a prévia e confirme a decisão antes de salvar.');
        db=apply(input);await save();reset();FitSecurity.closeDialog();FitRoutine.render();FitRoutine.renderSchedule();FitSecurity.notice('Atendimento atualizado com histórico. Nenhum recebimento ou estorno foi lançado.');
    }
    function details(a){
        const value=a.attendance;if(!value)return '';const labels={confirmed:'Aula confirmada pelo aluno',confirmation_cleared:'Confirmação removida',confirmation_invalidated:'Nova confirmação necessária',missed:'Falta registrada',absence_corrected:'Falta corrigida; aula devolvida à agenda',completed:'Aula concluída',canceled:'Aula cancelada'};
        return `${a.status==='pending'&&value.confirmation==='confirmed'?'<span class="fit-confirmation-badge">Confirmada pelo aluno</span>':''}${value.absence?'<span class="fit-absence-summary">'+(value.absence.effect==='consume'?'Falta com consumo de uma sessão':'Falta sem consumo de sessão')+'</span>':''}${value.history.length?`<details class="fit-appointment-detail"><summary>Histórico do atendimento</summary><ul>${value.history.slice(-100).map(entry=>`<li>${esc(new Date(entry.at).toLocaleString('pt-BR'))} · ${esc(labels[entry.action]||'Registro anterior')}${entry.effect?' · '+(entry.effect==='consume'?'com consumo':'sem consumo'):''}${entry.note?'<p>'+esc(entry.note)+'</p>':''}</li>`).join('')}</ul>${value.history.length>100?'<p>Mostrando os 100 movimentos mais recentes. O histórico integral permanece no backup.</p>':''}</details>`:''}`;
    }
    function reset(){prepared=null;}
    return {open:safe(open),preview,submit,details,reset};
})();
function submitFitAttendance(event){return FitAttendance.submit(event);}
