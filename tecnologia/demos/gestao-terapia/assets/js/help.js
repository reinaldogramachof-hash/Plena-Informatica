/* Ajuda contextual: textos conferidos nos fluxos locais, sem acesso aos registros. */
const TherapyHelp = (() => {
    const entries = [
        ['#view-dashboard h2', 'Painel do consultório', 'Os indicadores resumem os registros salvos. Agendamentos não se tornam atendimentos concluídos apenas porque o horário passou. Confira a situação na Agenda.', 'assistant'],
        ['#view-schedule h2', 'Agendar, atender e cobrar', 'Agendar ou confirmar reserva o horário. Para concluir o encontro, use Registrar atendimento e confira a cobrança. Não há envio automático de lembretes.', 'agenda'],
        ['#view-patients h2', 'Ficha do paciente', 'Abra a ficha para reunir cadastro, atendimentos, planos, avaliações e financeiro. Arquivar preserva o histórico; reative o paciente antes de novos atendimentos.', 'patients'],
        ['#view-sessions h2', 'Registros e rascunhos', 'Rascunhos guardam a anotação sem concluir atendimento, cobrar ou consumir pacote. Ao confirmar o registro, confira a forma de cobrança. Revisar a anotação não cobra novamente.', 'sessions'],
        ['#view-treatments h2', 'Planos terapêuticos', 'O plano organiza objetivos e revisões. Vincule as sessões pertinentes ao plano; as contagens e situações registradas não representam uma avaliação automática de melhora.', 'treatments'],
        ['#view-assessments h2', 'Avaliações', 'PHQ-9 e GAD-7 são instrumentos de rastreio. A pontuação não estabelece diagnóstico. Respostas parciais podem ser salvas como rascunho.', 'assessments'],
        ['#view-prescriptions h2', 'Orientações e encaminhamentos', 'Confirmar salva o registro. Entrega, envio e retorno são informados manualmente depois que ocorrem fora do sistema. Confira a prévia antes de imprimir.', 'prescriptions'],
        ['#view-financial h2', 'Caixa e pendências', 'Recebidos e pagos compõem o saldo realizado. A receber e a pagar são pendências. Registre aqui os pagamentos feitos fora do sistema; o aplicativo não movimenta contas bancárias.', 'financial'],
        ['#view-packages h2', 'Venda e consumo de pacotes', 'Salvar um pacote cria uma cobrança vinculada, sem agendar sessões. Ao concluir cada atendimento com esse pacote, uma sessão é consumida sem repetir a receita.', 'packages'],
        ['#view-reports h2', 'Conferir e exportar', 'Escolha período, paciente e tipo de relatório, depois confira a prévia. Impressão e CSV contêm os campos exibidos, sem anotações clínicas ou respostas dos questionários.', 'reports'],
        ['#view-settings h2', 'Configurações do consultório', 'Use as áreas de Configurações para atendimento, agenda, convênios, recorrências, identidade, mensagens e segurança. Os atalhos dos módulos abrem os mesmos editores.', 'identity'],
        ['#view-about h2', 'Armazenamento local', 'Use o mesmo endereço e perfil do navegador para acessar sua base. Outro navegador ou dispositivo tem armazenamento próprio. Para transferir registros, use um backup protegido.', 'install'],
        ['#view-emergency h2', 'Registro de intercorrências', 'Este módulo guarda informações registradas pelo profissional. Salvar não aciona serviços, não envia alertas e não monitora o paciente.', 'emergency'],
        ['#patient-modal-title', 'Cadastro e acompanhamento', 'Cadastre os dados necessários à sua rotina. Etapa, permissão de contato e sinalizações são informadas pelo responsável; registrar um contato não envia mensagem.'],
        ['#appointment-modal-title', 'Nova marcação', 'O horário deve respeitar duração, intervalo, expediente e bloqueios configurados. Agendar não conclui atendimento nem registra recebimento.'],
        ['#session-modal-title', 'Confirmar o atendimento', 'Confira paciente, data e cobrança antes de confirmar. Salvar rascunho guarda o texto sem concluir o encontro. Alterações em registros existentes preservam a cobrança original.'],
        ['#assessment-modal-title', 'Aplicação e confirmação', 'Confirme somente após revisar os itens. Observações podem ser revisadas preservando respostas; para corrigir respostas já confirmadas, use a ação específica do registro.'],
        ['#prescription-modal-title', 'Cópia para o destinatário', 'O conteúdo destinado ao paciente fica separado das notas internas. A cópia de impressão exclui notas internas, contato do destino, movimentações e versões.'],
        ['#treatment-modal-title', 'Planejamento e revisão', 'Registre objetivos e datas previstos. Frequência e meta de sessões organizam o plano, sem criar marcações na Agenda.'],
        ['#crm-field-stage', 'Etapa de acompanhamento', 'A etapa é atualizada manualmente para organizar a ficha. Ela não conclui sessões nem altera cobranças.'],
        ['#crm-field-permission', 'Permissão de contato', 'Registre a informação fornecida pelo paciente ou responsável. Este campo não envia mensagens nem coleta autorização automaticamente.'],
        ['#crm-field-tags', 'Etiquetas', 'Separe as etiquetas por vírgula para organizar os cadastros. Evite inserir conteúdo clínico em etiquetas administrativas.'],
        ['#therapy-show-archived', 'Cadastros arquivados', 'Inclui pacientes arquivados na consulta. O histórico permanece guardado; para iniciar novos atendimentos, reative o cadastro na ficha.'],
        ['#sessions-search-content', 'Busca no conteúdo', 'Amplia a busca para o texto dos registros. Use quando o termo procurado estiver na anotação, e não apenas na identificação do registro.'],
        ['#therapy-repeat', 'Repetição semanal', 'Cria marcações semanais de uma só vez. Se houver conflito ou bloqueio em qualquer data, nenhuma marcação da série será salva. Ao editar, a alteração vale para uma marcação.'],
        ['#therapy-appointment-fee', 'Valor previsto', 'O valor informa a cobrança avulsa prevista para o atendimento. Salvar o agendamento não significa que esse valor foi recebido.'],
        ['#therapy-billing-mode', 'Cobrança do atendimento', 'Avulsa gera um lançamento financeiro; pacote consome uma sessão disponível; sem cobrança não gera receita. Confira a opção antes de concluir.'],
        ['#therapy-session-package', 'Pacote disponível', 'O pacote deve pertencer ao paciente, ter saldo e estar válido na data do atendimento. Vender um pacote não consome sessões antecipadamente.'],
        ['#agenda-slot-size', 'Passo da grade', 'Define a divisão visual dos horários. A duração da sessão e o intervalo entre atendimentos são configurados separadamente.'],
        ['#agenda-density', 'Densidade da agenda', 'Compacta reduz a altura das faixas; confortável oferece mais espaço para leitura. Não altera os horários ou a duração das sessões.'],
        ['#agenda-display-start', 'Faixa visível', 'Define o horário mostrado na grade. Não substitui o expediente; marcações existentes fora dessa faixa continuam visíveis para conferência.'],
        ['#agenda-buffer', 'Intervalo entre sessões', 'Reserva um intervalo mínimo na verificação de novos horários e mudanças. Marcações existentes são preservadas para conferência.'],
        ['#agenda-enforce-hours', 'Restrição ao expediente', 'Ativada, impede novas marcações fora dos períodos configurados. Desativada, o expediente serve como indicação visual. O espaço entre dois períodos funciona como pausa.'],
        ['#agenda-hide-names', 'Privacidade no calendário', 'Substitui os nomes por Sessão reservada na visualização da Agenda. Os dados do paciente e os registros continuam guardados na base.'],
        ['#agenda-block-national', 'Feriados e referências', 'O bloqueio nacional impede novas marcações nos feriados configurados. Datas de referência não bloqueiam automaticamente; cadastre datas locais em Feriados e datas.'],
        ['#agenda-custom-annual', 'Repetir uma data', 'Repete o dia e mês nos outros anos. Para datas móveis, confira a data de cada ano antes de cadastrar.'],
        ['#agenda-custom-blocked', 'Bloqueio da data', 'Impede novas marcações nessa data. Marcações já existentes permanecem na Agenda e precisam ser conferidas.'],
        ['#agenda-block-all-day', 'Bloqueio por período', 'Dia inteiro bloqueia todas as horas das datas escolhidas. Desmarcado, a mesma faixa de horário se repete em cada dia do período. Marcações existentes são preservadas.'],
        ['#assessment-scale', 'Instrumento ou registro livre', 'Escolha o instrumento aplicado. Registro livre permite documentar outro instrumento ou uma avaliação externa, sem pontuação automática do questionário.'],
        ['#assessment-review-date', 'Reavaliação prevista', 'Organiza a pendência de acompanhamento. Informar uma data não agenda uma sessão nem envia lembrete ao paciente.'],
        ['#orientation-followup-status', 'Situação do acompanhamento', 'Atualize após entrega, envio ou retorno realizado fora do sistema. A mudança de situação não envia o documento ao destinatário.'],
        ['#orientation-followup-date', 'Prazo de retorno', 'Organiza as pendências de acompanhamento. Não cria um horário na Agenda nem envia uma notificação ao destinatário.'],
        ['#orientation-internal-notes', 'Notas internas', 'Use para o acompanhamento interno. Este conteúdo não entra na cópia de impressão destinada ao paciente ou destinatário.'],
        ['#treatment-review-date', 'Revisão do plano', 'Indica quando conferir o planejamento. A data não cria uma sessão automaticamente.'],
        ['#treatment-sessions-goal', 'Meta de sessões', 'É uma referência de planejamento. A contagem depende das sessões vinculadas ao plano; a meta não cria agendamentos nem pacotes.'],
        ['#finance-basis', 'Qual data entra no filtro?', 'Pagamento/vencimento usa o pagamento dos realizados e o vencimento dos pendentes, com a data original quando necessário. Data do lançamento usa a data original. Cancelados usam a data original.'],
        ['#finance-overdue', 'Somente vencidos', 'Mostra pendências com vencimento anterior a hoje. O registro precisa continuar pendente para aparecer neste filtro.'],
        ['#financial-date', 'Data do lançamento', 'Se já estiver recebido ou pago, esta data também será usada como data do pagamento. Para pendências, informe o vencimento quando houver.'],
        ['#therapy-financial-status', 'Já recebido ou pendente?', 'Escolha Já recebido / pago somente quando a movimentação tiver ocorrido. Pendentes ficam em A receber ou A pagar e não entram no saldo realizado.'],
        ['#financial-description', 'Descrição administrativa', 'Use uma identificação administrativa da receita ou despesa. Essa descrição pode aparecer no extrato e nas exportações financeiras.'],
        ['#therapy-finance-date', 'Registrar uma ação realizada', 'Informe a data em que o recebimento, pagamento ou devolução ocorreu fora do sistema. A ação atualiza o controle local, sem realizar transferência bancária.'],
        ['#therapy-finance-reason', 'Correções com histórico', 'Explique o motivo da ação. Cancelamentos e devoluções preservam o histórico; uma devolução integral gera um lançamento de valor oposto ao original.'],
        ['#therapy-pack-expiry,#package-revision-expiry', 'Validade do pacote', 'O saldo pode continuar visível mesmo depois do vencimento. Para consumir, a data do atendimento deve estar dentro da validade e haver sessões disponíveis.'],
        ['#therapy-pack-paid', 'Pagamento do pacote', 'Marque somente se o valor já foi recebido. Sem a marcação, a cobrança do pacote fica pendente; o controle não executa o pagamento.'],
        ['#package-revision-reason', 'Revisar um pacote', 'A revisão permite alterar nome ou validade com motivo. Quantidade, valor e sessões consumidas são preservados, sem nova cobrança.'],
        ['#reports-archived', 'Registros arquivados no relatório', 'Inclui registros arquivados dos módulos de acompanhamento. Não equivale a incluir lançamentos financeiros cancelados no saldo realizado.'],
        ['#session-duration', 'Duração padrão', 'Sugere a duração ao criar novas sessões. Registros e marcações existentes são preservados. Confira também expediente e intervalos na Agenda.'],
        ['#therapy-default-fee', 'Valor padrão da sessão', 'Sugere o valor para novos atendimentos avulsos. Alterar este padrão não reajusta cobranças ou registros anteriores.'],
        ['#system-auto-lock', 'Bloqueio por inatividade', 'Fecha o acesso aos registros após o tempo configurado sem atividade. Para continuar, será necessário abrir o cofre novamente com a senha dos registros.'],
        ['#system-new-password', 'Nova senha dos registros', 'Use de 12 a 200 caracteres e guarde a senha em local seguro. A mudança protege a base atual; backups já baixados continuam usando a senha que tinham quando foram criados. Baixe um novo backup após alterar.'],
        ['#emergency-contact', 'Contato de referência', 'É uma informação cadastrada pelo responsável. O sistema não valida o contato nem realiza acionamento automático.'],
        ['#system-panel-security h3', 'Backup e recuperação', 'Confira o arquivo baixado e guarde a senha correspondente. Restaurar substitui a base atual após conferência; a cópia anterior fica neste navegador. Não há sincronização automática entre dispositivos.'],
        ['#system-panel-appearance h3', 'Aparência e identidade', 'Tema e tamanho das fontes são preferências deste navegador. A cor e o logo ficam no cofre e acompanham seu backup protegido.'],
        ['#system-panel-maintenance h3', 'Antes de limpar a base', 'Baixe um backup protegido e confira onde o arquivo foi guardado. Limpar remove registros operacionais; reiniciar também volta as configurações ao padrão. Leia a confirmação antes de prosseguir.'],
        ['#view-about .system-card:last-child h3', 'Diagnóstico para suporte', 'O diagnóstico local contém versão e condições técnicas, sem pacientes, contatos, senha ou chave de licença. Confira o arquivo antes de compartilhar pelo canal da sua compra.']
    ];
    entries.push(
        ["#session-patient","Paciente do registro","Confira a pessoa atendida. Em registros vinculados ou já existentes, o paciente fica fixo para preservar o histórico."],
        ["#session-date","Data do encontro","Informe a data do atendimento. Quando há vínculo com a Agenda ou registro anterior, ela é preservada."],
        ["#session-modality","Modalidade do encontro","Indique como o encontro ocorreu: presencial, online ou híbrido. A seleção não cria uma sala de atendimento."],
        ["#session-record-duration","Duração registrada","Informe os minutos efetivos do encontro, de 10 a 240, quando aplicável. Esse registro não altera o horário reservado na Agenda."],
        ["#session-focus","Foco do encontro","Descreva brevemente o tema central trabalhado. Uma classificação diagnóstica não é necessária neste campo."],
        ["#session-content","Conteúdo da sessão","Registre uma síntese pertinente do encontro e da evolução observada. Use Ajuda: registro e evolução para consultar orientações mais amplas."],
        ["#session-interventions","Intervenções realizadas","Descreva o que foi efetivamente realizado neste encontro. O planejamento do próximo encontro fica em Continuidade."],
        ["#session-next-plan","Continuidade do acompanhamento","Registre o que pretende retomar ou acompanhar. Esse texto não cria agendamentos automaticamente."],
        ["#session-objectives","Objetivos trabalhados","Descreva os objetivos abordados no encontro. Esse texto não altera a situação dos objetivos no plano terapêutico."],
        ["#session-homework","Combinados e atividades","Registre orientações ou atividades combinadas com o paciente. O campo não envia mensagens nem cria lembretes."],
        ["#session-mood","Observação de humor","Observação opcional contextualizada pelo profissional. Não equivale a instrumento de avaliação ou diagnóstico. Consulte as referências para conhecer os termos."],
        ["#session-adherence","Adesão ao acompanhamento","Registre sua observação no contexto do acompanhamento. A seleção não calcula resultados nem substitui a avaliação profissional; Não avaliado continua disponível."],
        ["#session-coverage","Origem do atendimento","Diferencie convênio direto de atendimento particular com reembolso. Registros vinculados preservam a origem do atendimento anterior."],
        ["#therapy-session-fee","Valor deste atendimento","Confira o valor da cobrança avulsa antes de confirmar. Alterar o valor padrão em Configurações não reajusta registros anteriores."],
        ["#therapy-session-paid","Valor já recebido","Marque somente se o recebimento já ocorreu. Desmarcado, a cobrança avulsa fica pendente; o sistema não realiza pagamentos."],
        ["#session-revision-reason","Observação da alteração","Contextualize a revisão quando necessário. O conteúdo anterior permanece no histórico do registro."],
        ["#sessions-save-draft","Salvar rascunho","Guarda o preenchimento sem concluir o encontro nem aplicar a cobrança da conclusão. Você poderá retomá-lo depois."],
        ['#sessions-finalize','Confirmar o registro',()=>document.getElementById('sessions-form-context').textContent]
    );
    const metricTips = {
        'Entradas recebidas':'Receitas já recebidas no período considerado. Valores pendentes não entram neste indicador.',
        'Saídas pagas e devoluções':'Despesas pagas e devoluções registradas no período considerado. Valores a pagar ficam separados.',
        'Saldo realizado':'Entradas recebidas menos saídas pagas e devoluções nos filtros escolhidos. Não inclui pendências.',
        'A receber no período':'Receitas pendentes no período, considerando vencimento ou data original. Não representa dinheiro recebido.',
        'A pagar no período':'Despesas pendentes no período, considerando vencimento ou data original. Não representa saída já paga.',
        'Comparecimento':'Atendimentos concluídos divididos por concluídos mais faltas. Cancelamentos e marcações ainda abertas ficam fora da taxa.',
        'Atendimentos concluídos':'Marcações registradas como concluídas no período. O horário passar não conclui o atendimento automaticamente.'
    };
    let active = null, timer = null, queued = false, sequence = 0;
    const content = new WeakMap(), bindings = new WeakMap();

    function button(title, text, topic='') {
        const node = document.createElement('button');
        node.type='button';node.className='therapy-help-trigger';node.textContent='i';
        node.setAttribute('aria-label','Ajuda: '+title);
        content.set(node,{title,text,topic});return node;
    }
    function decorate(target, title, text, topic='') {
        if(bindings.get(target)?.isConnected)return;
        const control=target.matches('input,select,textarea');
        const label=control?(target.closest('label')||target.labels?.[0]||target.previousElementSibling):null;
        if(control&&!label?.matches('label'))return;
        const trigger=button(title,text,topic);
        bindings.set(target,trigger);
        if(!control){if(target.matches('button'))target.after(trigger);else target.appendChild(trigger);return;}
        if(label.contains(target)) {
            // O botão fica fora do label: clicar na ajuda nunca alterna o campo.
            const wrapper=document.createElement('div');wrapper.className='therapy-help-field';
            const style=getComputedStyle(label);
            wrapper.style.marginBlockStart=style.marginBlockStart;wrapper.style.gridColumn=style.gridColumn;
            label.before(wrapper);wrapper.append(label,trigger);label.classList.add('therapy-help-label');
            if(!['checkbox','radio'].includes(target.type)) {
                const caption=document.createElement('span');caption.className='therapy-help-caption';
                while(label.firstChild&&label.firstChild!==target)caption.appendChild(label.firstChild);
                label.prepend(caption);
            } else wrapper.classList.add('therapy-help-check');
        } else {
            // Preserva a relação label/campo utilizada pelos formulários existentes.
            label.parentElement.classList.add('therapy-help-field');
            label.classList.add('therapy-help-caption');label.before(trigger);
        }
    }
    function scan() {
        queued=false;
        entries.forEach(([selector,title,text,topic])=>document.querySelectorAll(selector).forEach(target=>decorate(target,title,text,topic||'')));
        document.querySelectorAll('#reports-metrics article>span').forEach(target=>{
            const title=[...target.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE).map(node=>node.textContent).join('').trim();
            if(metricTips[title])decorate(target,title,metricTips[title]);
        });
        if(active&&(!active.trigger.isConnected||!active.trigger.getClientRects().length||active.trigger.closest('[hidden],.hide,.hidden')))hide();
    }
    function schedule(){if(!queued){queued=true;requestAnimationFrame(scan);}}
    function hide() {
        clearTimeout(timer);
        if(!active)return;
        active.trigger.removeAttribute('aria-describedby');active.box.remove();active=null;
    }
    function position() {
        if(!active)return;
        const {trigger,box}=active,rect=trigger.getBoundingClientRect(),viewport=window.visualViewport;
        const left=viewport?.offsetLeft||0,top=viewport?.offsetTop||0,width=viewport?.width||innerWidth,height=viewport?.height||innerHeight,gap=10;
        box.style.maxWidth=Math.max(0,Math.min(340,width-24))+'px';
        box.style.maxHeight=Math.max(0,height-24)+'px';
        const size=box.getBoundingClientRect();
        box.style.left=Math.max(left+12,Math.min(rect.left,left+width-size.width-12))+'px';
        box.style.top=Math.max(top+12,Math.min(rect.bottom+gap+size.height>top+height-12?rect.top-size.height-gap:rect.bottom+gap,top+height-size.height-12))+'px';
    }
    function show(trigger, pin=false) {
        if(document.getElementById('therapy-tour-panel')?.getClientRects().length||document.getElementById('therapy-clinical')){hide();return;}
        clearTimeout(timer);
        if(active?.trigger===trigger){active.pinned ||= pin;return;}
        hide();const data=content.get(trigger);if(!data)return;
        const box=document.createElement('div');box.className='therapy-help-popup';box.id='therapy-help-'+(++sequence);box.setAttribute('role',data.topic?'group':'tooltip');if(data.topic)box.setAttribute('aria-label',data.title);
        const title=document.createElement('strong'),text=document.createElement('p');title.textContent=data.title;text.textContent=typeof data.text==='function'?data.text():data.text;
        if(data.topic){
            const head=document.createElement('div'),manual=document.createElement('button');
            head.className='therapy-help-head';manual.type='button';manual.className='therapy-help-manual';manual.dataset.manualTopic=data.topic;manual.textContent='Ver no Manual';
            head.append(title,manual);box.append(head,text);
        }else box.append(title,text);
        // Dentro do modal para manter a descrição no mesmo contexto acessível.
        const heading=data.topic&&trigger.closest('h2');
        if(heading)heading.after(box);else (trigger.closest('.therapy-overlay,.therapy-modal-work')||document.body).appendChild(box);
        active={trigger,box,pinned:pin};trigger.setAttribute('aria-describedby',box.id);
        if(typeof box.showPopover==='function'){box.setAttribute('popover','manual');box.showPopover();}
        position();
    }
    function later(){clearTimeout(timer);timer=setTimeout(()=>{if(active&&!active.pinned&&document.activeElement!==active.trigger)hide();},180);}
    function boot() {
        scan();
        new MutationObserver(records=>{
            if(records.some(record=>record.type==='attributes'||[...record.removedNodes].some(node=>node.nodeType===Node.ELEMENT_NODE&&node.matches('.therapy-help-trigger'))||[...record.addedNodes,...record.removedNodes].some(node=>node.nodeType===Node.ELEMENT_NODE&&!node.matches('.therapy-help-trigger,.therapy-help-popup,.therapy-help-caption,.therapy-help-field'))))schedule();
        }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
        document.addEventListener('pointerover',event=>{const trigger=event.target.closest('.therapy-help-trigger');if(trigger&&event.pointerType!=='touch')show(trigger);else if(event.target.closest('.therapy-help-popup'))clearTimeout(timer);});
        document.addEventListener('pointerout',event=>{if(event.target.closest('.therapy-help-trigger,.therapy-help-popup'))later();});
        document.addEventListener('pointerdown',event=>{if(event.target.closest('.therapy-help-manual'))event.preventDefault();},true);
        document.addEventListener('focusin',event=>{if(event.target.closest('.therapy-help-popup')){clearTimeout(timer);return;}const trigger=event.target.closest('.therapy-help-trigger');if(trigger)show(trigger);else hide();});
        document.addEventListener('focusout',event=>{if(event.target.closest('.therapy-help-trigger')&&!event.relatedTarget?.closest('.therapy-help-popup'))later();});
        document.addEventListener('click',event=>{
            const manual=event.target.closest('.therapy-help-manual');
            if(manual){event.preventDefault();event.stopPropagation();const topic=manual.dataset.manualTopic;hide();if(typeof TherapyManual!=='undefined'&&topic)TherapyManual.openTopic(topic);return;}
            const trigger=event.target.closest('.therapy-help-trigger');
            if(trigger){event.preventDefault();event.stopPropagation();if(active?.trigger===trigger&&active.pinned)hide();else show(trigger,true);}
            else if(!event.target.closest('.therapy-help-popup'))hide();
        },true);
        document.addEventListener('keydown',event=>{
            if(event.key==='Escape'&&active){event.preventDefault();event.stopImmediatePropagation();if(active.box.contains(document.activeElement))active.trigger.focus();hide();}
        },true);
        document.addEventListener('change',hide,true);
        document.addEventListener('scroll',()=>{if(active&&(document.activeElement===active.trigger||active.box.contains(document.activeElement)))position();else hide();},true);window.addEventListener('resize',hide);
        window.visualViewport?.addEventListener('resize',hide);
        document.addEventListener('therapy-vault-locked',hide);
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
    return {refresh:schedule,close:hide};
})();
