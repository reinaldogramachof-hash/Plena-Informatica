/* Conteúdo educacional local. Não contém registros de pacientes nem executa operações. */
const TherapyTourData=(()=>{
 const sections=[],tasks=[];
 const step=(title,text,target,action=null)=>({title,text,target,action});
 const corrections={
  patients:'Abra a ficha correta e use Editar cadastro. Para um paciente arquivado, confira o filtro e a ação de reativação. Reativar não cancela nem remarca compromissos.',
  agenda:'Localize a marcação e use Alterar horário ou Situação conforme a intenção. Edite cada ocorrência da série separadamente; para encontro concluído, confira o registro em Sessões.',
  coverage:'Volte a Configurações > Convênios para revisar o cadastro. Ajuste a origem de uma marcação elegível pelo próprio formulário; preferências atuais não reclassificam o histórico.',
  sessions:'Em Registros, abra Conferir registro e Editar registro para revisar com histórico. Em Rascunhos, retome o item existente. Não crie outra anotação para a mesma marcação.',
  treatments:'Abra o plano existente para revisar dados, objetivos ou vínculos. Confira o histórico e a situação antes de arquivar; não crie outro plano apenas para esconder a revisão.',
  assessments:'Abra a aplicação existente. Use a ação própria para corrigir respostas confirmadas e preserve o histórico; retome rascunhos pela área correspondente, sem duplicar a aplicação.',
  orientations:'Reabra o documento pertinente para revisar o texto ou registrar uma movimentação. Confira o histórico; emissão, entrega e retorno têm momentos diferentes.',
  emergency:'Reencontre o episódio no histórico e confira seus detalhes. Não crie outro registro para testar ou ocultar um anterior; preserve a informação registrada e a avaliação do profissional.',
  finance:'Abra Conferir lançamento. Uma pendência admite cancelamento com motivo; valor realizado admite devolução integral realizada fora do sistema. Confira o original e o histórico antes de criar outro lançamento.',
  packages:'Abra o detalhe do pacote. A revisão permite nome e validade com motivo; paciente, quantidade, valor e consumos ficam preservados. Para acerto financeiro, confira a cobrança vinculada e o acordo.',
  reports:'Ajuste os filtros e gere uma nova prévia. Refazer a prévia não corrige os registros de origem; confira o módulo correspondente se encontrar uma divergência.',
  settings:'Volte à aba pertinente e revise somente a preferência desejada. Sair do guia não desfaz uma gravação. Antes de restaurar ou manter a base, preserve cópias externas e suas senhas.',
  assistant:'Abra a origem da pendência e confira o estado real. Preparar mensagem não confirma envio; registro de contato não confirma consulta ou pagamento.',
  manual:'Limpe os filtros para reencontrar o tópico. Use Retomar para o ponto salvo ou Repetir para recomeçar somente a orientação, sem reiniciar registros.',
  documents:'Abra a versão existente. Corrija conteúdo concluído por nova versão com motivo e preserve o histórico.',
  about:'Atualize a conferência local e confira navegador, perfil e endereço. Não limpe a base original para tentar recuperar dados de outro ambiente.'
 };
 const effects={
  patients:'Cadastro e acompanhamento administrativo não criam horários, sessões ou cobranças. Arquivar conserva o histórico.',
  agenda:'Agendar reserva o horário. Situação e anotação clínica são distintas; série semanal não gera registros clínicos nem receita automaticamente.',
  coverage:'Alterar nome, cor ou preferência vale para escolhas futuras. Cada atendimento conserva a origem registrada; não há integração com operadoras.',
  sessions:'Rascunho não conclui nem cobra. Confirmação pode gerar a cobrança escolhida ou um consumo; revisão conserva vínculos e histórico.',
  treatments:'Planos e objetivos não geram marcações, pacotes ou evolução automática. Conteúdo e decisões pertencem ao profissional.',
  assessments:'Aplicação e pontuação não são diagnóstico. Rascunhos e aplicações incompletas não equivalem a uma aplicação confirmada comparável.',
  orientations:'Confirmar o documento não envia mensagens. Notas internas e histórico ficam separados da cópia destinada ao destinatário.',
  emergency:'O módulo registra o que foi informado. Não monitora, valida referências, propõe conduta ou aciona atendimento de emergência.',
  finance:'Lançamentos representam ações externas. Gerar despesa pendente não paga uma conta; receber não realiza transferência bancária.',
  packages:'Vender registra pacote e cobrança; consumir ocorre no atendimento. O uso não repete a receita da venda e a revisão conserva os consumos.',
  reports:'Gerar prévia, imprimir ou exportar não altera registros de origem. Um comando de exportação não comprova que o arquivo ficou guardado.',
  settings:'Cada área possui seus próprios controles. Preferências visuais do navegador não substituem backup; restauração e manutenção dependem de confirmação explícita nos controles normais.',
  assistant:'Avisos dependem dos registros locais com o sistema aberto. Copiar ou abrir WhatsApp não envia mensagem nem confirma presença ou recebimento.',
  manual:'Leitura e progresso de guias ficam separados dos registros e não comprovam execução de uma tarefa.',
  documents:'Concluir preserva o conteúdo; assinatura e entrega são fatos separados. A central não cria sessões ou cobranças.',
  about:'A conferência técnica não transporta dados entre dispositivos nem comprova existência de backup externo.'
 };
 const examples={
  patients:'Exemplo: uma pendência administrativa com prazo pode lembrar um retorno; não reserva um horário. Próximo passo: confira a ficha antes de ir à Agenda.',
  sessions:'Exemplo: uma sessão de um pacote usa uma unidade; o valor da venda já está vinculado ao pacote. Próximo passo: confira registro, consumo e cobrança sem duplicar a operação.',
  finance:'Exemplo: uma despesa pendente pertence à previsão; depois do pagamento externo, registre a realização no lançamento existente. Próximo passo: confira a data considerada no filtro.',
  packages:'Exemplo: um pacote com quatro sessões tem três unidades após um consumo válido. Próximo passo: confira a data de validade e o detalhe do consumo.',
  reports:'Exemplo: uma devolução pode cair em período posterior à receita e reduzir o líquido daquele período. Próximo passo: leia os critérios da prévia antes de exportar.',
  settings:'Exemplo: abrir outro navegador mostra outra base local; o transporte depende de backup e senha conhecidos. Próximo passo: confira a cópia externa sem apagar a base original.'
 };
 function area(id,title,view,topic,description,points){sections.push({id,title,view,topic,description,steps:points.map(p=>step(...p))});}
 function task(id,area,title,before,work,result,exception,options={}){
  const section=sections.find(s=>s.id===area);if(!section)throw new Error('Área de guia desconhecida.');
  tasks.push({id,area,title,view:section.view,topic:options.topic||section.topic,version:1,before,work,result,exception,
   correction:options.correction||corrections[area],preserves:effects[area],
   example:options.example||examples[area]||'Exemplo ilustrativo: reencontre primeiro o registro e confira a situação exibida; só depois escolha a ação. Use apenas registros pertinentes à sua rotina, sem cadastrar dados fictícios para treinar.',
   intent:options.intent||null,external:options.external||false,reference:options.reference||false,
   steps:[step('Antes de começar',before,'#view-'+section.view),...work.map(p=>step(...p)),step('Conferir o resultado',result,options.resultTarget||'#view-'+section.view)]});
 }
 area('start','Primeiro acesso e primeiro ciclo','dashboard','install','Uma trilha curta para preparar o consultório e encontrar os primeiros passos.',[
  ['Seu ambiente local','Licença libera o aplicativo; a senha abre os registros. Use o mesmo navegador, perfil e endereço. O guia nunca pede sua senha.','#view-dashboard'],
  ['Preparar o consultório','Confira identificação, contatos, duração e valor padrão nas Configurações. Você decide quando salvar.','#view-dashboard','settings:clinic'],
  ['Seu primeiro paciente','Em Pacientes, cadastre somente uma pessoa que você realmente pretende acompanhar. Se ainda não houver cadastro a fazer, apenas conheça a tela.','#view-dashboard','view:patients'],
  ['Reservar e registrar','A Agenda reserva o horário. Após o encontro, Registrar atendimento permite confirmar a anotação e escolher a cobrança.','#view-dashboard','view:schedule'],
  ['Conferir e preservar','Confira o Financeiro e guarde um backup protegido fora do navegador. Um clique de download não prova que o arquivo foi guardado.','#view-dashboard','settings:security']]);
 area('dashboard','Visão geral','dashboard','assistant','Encontre horários, registros pendentes e ações do dia.',[
  ['O dia do consultório','Os indicadores resumem os registros; o relógio não conclui atendimentos.','#view-dashboard'],
  ['Horários de hoje','Confira a situação de cada marcação antes de registrar uma sessão.','#today-schedule'],
  ['Próximo atendimento','Use o próximo horário como atalho para o compromisso correspondente.','#therapy-next-session'],
  ['Anotações pendentes','Um encontro concluído sem anotação pode ser recuperado sem cobrar novamente.','#therapy-pending-sessions'],
  ['Ações e pendências','A busca abre a ficha. Pendências e lembretes leva ao Assistente da rotina.','#view-dashboard']]);
 area('assistant','Assistente da rotina','dashboard','assistant','Conferência de pendências e mensagens sob revisão humana.',[
  ['Abrir o Assistente','Abra Pendências e lembretes para conferir os registros que precisam de atenção.','#view-dashboard','open:assistant'],
  ['Filtrar pendências','Escolha uma categoria. Os avisos são calculados enquanto o aplicativo está aberto.','#assistant-filter'],
  ['Conferir a origem','Abra o registro correspondente; um aviso não confirma presença nem pagamento.','#assistant-list'],
  ['Revisar a comunicação','Preparar, copiar ou abrir WhatsApp não significa que uma mensagem foi enviada. Revise destinatário, permissão e texto.','#assistant-list'],
  ['Registrar somente o realizado','Registre um contato apenas depois da ação externa. Nunca use esse registro só para concluir um guia.','#assistant-list']]);
 area('patients','Pacientes e ficha central','patients','patients','Cadastre, reencontre e acompanhe a pessoa correta.',[
  ['Busca e filtros','Encontre por identificação e confira filtros quando um cadastro não aparecer.','#crm-directory'],
  ['Novo cadastro','Identificação, referências e preferências ficam no cadastro. Preencha apenas o necessário para sua rotina.','#view-patients','open:patient'],
  ['Origem do atendimento','A preferência de particular, convênio ou reembolso vale para novas marcações; não reclassifica o passado.','#patient-coverage'],
  ['Ficha central','Abra uma ficha pelos controles da lista. Seus dez painéis reúnem registros vinculados àquela pessoa.','#crm-profile'],
  ['Contato, pendência e arquivo','Contato é histórico; pendência tem prazo. Arquivar conserva os registros e retira o paciente das listas ativas.','#view-patients']]);
 area('agenda','Agenda','schedule','agenda','Reserve horários e diferencie marcação de atendimento concluído.',[
  ['Período e visualização','Alterne Dia, Semana, Mês e Lista; use a data para reencontrar uma marcação.','#schedule-date'],
  ['Filtros e situação','Uma sessão pode estar oculta por filtro. Cor identifica a origem; texto identifica a situação.','#agenda-status-filter'],
  ['Disponibilidade','Configurar agenda define expediente e intervalo. Feriados e datas e Bloquear período têm comandos próprios.','#view-schedule','open:agenda-settings'],
  ['Nova marcação','Escolha paciente, tipo, data, horário, duração, origem e valor. O formulário normal valida conflitos.','#appointment-form','open:appointment'],
  ['Série e resultado','Quantidade de semanas inclui a primeira. Em conflito, nenhuma marcação da série é gravada. Agendar não cria uma anotação clínica.','#therapy-repeat']]);
 area('coverage','Convênios e particulares','settings','coverage','Configure a origem e preserve a identificação de cada atendimento.',[
  ['Três origens','Particular, Convênio e Particular com reembolso são diferentes. Reembolso continua sendo atendimento particular.','#system-panel-coverage','settings:coverage'],
  ['Configurações > Convênios','Cadastre nome e cor ou inative um convênio; o histórico é preservado.','#coverage-plan-form','open:coverage'],
  ['Busca e situação','Use a busca por nome e o filtro de ativos/inativos para localizar o cadastro.','#coverage-search'],
  ['Histórico e filtros','Nome e cor anteriores permanecem nos atendimentos. Confira a origem na Agenda.','#agenda-coverage-filter','view:schedule']]);
 area('sessions','Sessões','sessions','sessions','Rascunho, registro confirmado, cobrança e histórico têm efeitos diferentes.',[
  ['Quatro áreas','Registros, A registrar, Rascunhos e Arquivo representam situações diferentes.','#sessions-tabs'],
  ['Abrir pelo atendimento','Use Registrar atendimento na Agenda ou na fila para manter o vínculo. Anotação avulsa serve para um registro sem marcação.','#view-sessions'],
  ['Guardar o trabalho','Salvar rascunho protege o texto sem concluir, cobrar ou consumir pacote. Fora do guia, os ícones de ajuda explicam os campos e o resumo visível mostra o efeito da cobrança.','#sessions-save-draft','open:session'],
  ['Escolher a cobrança','Revise paciente, data e origem. Avulsa, Pacote e Sem cobrança produzem efeitos distintos.','#therapy-billing'],
  ['Revisar sem duplicar','Um registro confirmado conserva vínculos e cobrança ao ser revisado. Recuperar uma anotação de encontro concluído não cobra novamente.','#view-sessions']]);
 area('treatments','Planos terapêuticos','treatments','treatments','Planos, objetivos, vínculos e revisões definidos pelo profissional.',[
  ['Encontrar o plano','Confira paciente, situação, revisão prevista e filtros.','#view-treatments'],
  ['Planejar','Meta e frequência não criam horários nem pacotes. O profissional define o conteúdo clínico.','#treatment-form','open:treatment'],
  ['Objetivos e vínculos','Abra um plano. Atualize objetivos e vincule apenas as sessões pertinentes deste paciente.','#treatment-detail-panel'],
  ['Revisão e histórico','Conferir versões e arquivar preserva registros. Atingir uma meta não conclui o plano automaticamente.','#view-treatments']]);
 area('assessments','Avaliações','assessments','assessments','Aplicações completas, rascunhos e registros livres.',[
  ['Áreas e filtros','Registros, Rascunhos, Acompanhamento e Arquivados ajudam a reencontrar uma aplicação.','#view-assessments'],
  ['Escolher o registro','PHQ-9, GAD-7 e Registro livre têm propostas diferentes. O guia não fornece respostas ou interpretação clínica.','#assessment-form','open:assessment'],
  ['Parcial ou confirmado','Rascunho admite aplicação incompleta. Confirmar uma escala estruturada exige os itens obrigatórios, inclusive respostas zero.','#assessment-form'],
  ['Corrigir e comparar','Corrigir respostas exige a ação própria e preserva histórico. Comparações dependem da mesma pessoa, instrumento e versão completos.','#view-assessments']]);
 area('orientations','Orientações e encaminhamentos','prescriptions','prescriptions','Prepare o documento e confira o que será entregue.',[
  ['Registro e acompanhamento','Confira filtros e as áreas do módulo para localizar rascunhos, documentos e retornos.','#view-prescriptions'],
  ['Conteúdo e destino','Preencha a finalidade e o conteúdo externo. Notas internas ficam no seu controle.','#prescription-form','open:orientation'],
  ['Prévia antes de imprimir','Confira a cópia destinada ao destinatário. Notas internas e histórico não acompanham a folha.','#view-prescriptions'],
  ['Entrega e retorno','Confirmar um documento não envia mensagem. Registre entrega externa e retorno apenas quando realizados.','#orientation-followup-status']]);
 area('emergency','Emergência e intercorrências','emergency','emergency','Conheça o registro e as referências, sem orientar conduta clínica.',[
  ['Finalidade do módulo','O aplicativo registra informações do profissional; não monitora pacientes e não aciona socorro.','#view-emergency'],
  ['Referências cadastradas','Os contatos vêm do consultório e do paciente. Não são validados por um serviço externo.','#therapy-emergency-references'],
  ['Conhecer os campos','Paciente, tipo, data, risco informado, intervenção e duração seguem validações. O guia não preenche nem classifica o episódio.','#emergency-form'],
  ['Consultar e preservar','Pesquise o histórico, abra os detalhes e respeite o aviso de alterações ao sair. Não é necessário registrar uma intercorrência para conhecer esta área.','#recent-emergencies']]);
 area('finance','Financeiro e recorrências','financial','financial','Diferencie pendências, caixa, devoluções e geração mensal.',[
  ['Indicadores e abas','Entradas e saídas realizadas ficam separadas de valores pendentes.','#finance-tabs'],
  ['Datas e origem','Confira período e Data considerada. Pagamento, vencimento e lançamento podem pertencer a períodos diferentes.','#finance-basis'],
  ['Conferir antes de agir','Abra o lançamento correto. Registrar recebimento ou pagamento documenta uma ação ocorrida fora do sistema.','#finance-table-body'],
  ['Cancelar ou devolver','Pendência permite cancelar cobrança; valor já realizado permite devolução integral com motivo. O original é preservado.','#view-financial'],
  ['Despesas recorrentes','Regra mensal, prévia e geração são etapas distintas. Gerar pendências não paga as despesas.','#view-financial','open:recurring']]);
 area('packages','Pacotes','packages','packages','Venda, cobrança, validade e consumo sem receita duplicada.',[
  ['Situação e filtros','Diferencie saldo não consumido de saldo válido hoje. Confira vencidos, esgotados e cancelados.','#therapy-packages-list'],
  ['Venda do pacote','A venda registra o pacote e uma cobrança vinculada. Não cria os horários das sessões.','#therapy-package-form','open:package'],
  ['Consumo no atendimento','No registro da sessão, escolha Pacote. Um atendimento consome uma unidade sem gerar outra receita.','#view-packages'],
  ['Detalhe e revisão','Confira consumos, cobranças e histórico. Revisar nome ou validade não muda quantidade ou valor contratados.','#package-detail-panel']]);
 area('reports','Relatórios','reports','reports','Escolha o critério, confira a prévia e só então exporte.',[
  ['Escolher o relatório','Cada tipo responde a uma pergunta. Há relatório específico de atendimentos e recebimentos por origem.','#reports-type'],
  ['Período e pessoa','Confira início, fim, paciente e inclusão de registros arquivados.','#reports-start'],
  ['Prévia fiel','Use o comando de geração da tela. Confira colunas, critérios e notas antes de imprimir ou exportar.','#therapy-report'],
  ['Interpretar corretamente','Saldo de pacote é atual. Valores sem origem ficam Não informado. Download solicitado não garante arquivo guardado.','#view-reports']]);
 area('settings','Configurações e segurança','settings','identity','Prepare o consultório e preserve seus registros.',[
  ['Ajustes por assunto','As nove áreas concentram consultório, atendimento, agenda, convênios, financeiro, aparência e identidade, mensagens, segurança e manutenção.','#system-tabs'],
  ['Consultório e atendimento','Salve cada área pelos seus controles. Valor zero é permitido; duração e contatos precisam de conferência.','#system-clinic-form','settings:clinic'],
  ['Leitura e identidade','Tema e fonte pertencem ao navegador. Identidade e modelos salvos no cofre acompanham o backup.','#system-tabs','settings:appearance'],
  ['Backup externo','Baixe a cópia protegida e confira o arquivo fora do navegador. A cópia anterior local não substitui esse cuidado.','#system-security-form','settings:security'],
  ['Operações que exigem cuidado','Restaurar, trocar senha, limpar ou reiniciar nunca são requisitos de um tour. Preserve a base e leia as consequências antes de executar por intenção própria.','#system-tabs']]);
 area('manual','Manual e guias','manual','install','Reencontre ajuda e retome uma orientação quando precisar.',[
  ['Buscar por intenção','Pesquise o que deseja fazer ou o sintoma encontrado, com ou sem acentos.','#manual-search'],
  ['Camadas da ajuda','As quatro abas reúnem tópicos, primeiros passos, fluxos e soluções rápidas.','#manual-tabs'],
  ['Leitura não é execução','Marcar um tópico como lido não confirma que uma tarefa foi realizada. Os guias mantêm progresso próprio.','#manual-topics'],
  ['Retomar ou aprofundar','Guias e tarefas reúne apresentações, artigos por tarefa e retomada. Você pode sair sem gravar registros.','#view-manual']]);
 area('about','Sobre e diagnóstico','about','install','Entenda este ambiente e prepare informação técnica para suporte.',[
  ['Ambiente atual','Versão, conexão, licença local e preparo offline ajudam a explicar o contexto.','#system-diagnostics'],
  ['Base vazia em outro lugar','Outro navegador, perfil ou endereço tem armazenamento próprio. Não limpe a base original para tentar corrigir isso.','#view-about'],
  ['Diagnóstico técnico','O diagnóstico não inclui nomes ou anotações. Confira o arquivo antes de compartilhar.','#system-diagnostics'],
  ['Proteja o conteúdo','Não envie senha, chave integral ou backup clínico para demonstrar uma dúvida de uso.','#view-about']]);

 // Tarefas com artigos e passos próprios; abrir formulários nunca grava dados.
 task('patient-create','patients','Cadastrar um paciente','Use um cadastro real apenas se houver intenção de incluí-lo. Para conhecer, consulte o exemplo.',[
  ['Abrir cadastro','Use Novo paciente e confira os campos opcionais.','#patient-form','open:patient'],
  ['Revisar antes de salvar','Confira identificação, referência de emergência e preferência de origem. Salve pelo botão normal.','#patient-form']],
  'Reencontre a pessoa na lista ou na ficha. Um cadastro novo não cria agenda ou cobrança.','Nome inválido ou falha de gravação mantém a operação sem confirmação.',{intent:['submitPatient'],example:'Exemplo ilustrativo: um novo cadastro pode usar Particular como preferência. Isso não reserva um horário.'});
 task('patient-edit','patients','Revisar cadastro e preferências','Abra a ficha correta e escolha Editar cadastro.',[
  ['Editar o necessário','Confira os campos e preserve informações que não pretende alterar.','#patient-form'],
  ['Conferir a gravação','Use Salvar no próprio formulário. Preferência de origem afeta novas marcações.','#patient-form']],
  'Reabra o cadastro e confira a alteração; o histórico de atendimentos permanece.','Paciente arquivado pode exigir reativação antes de novas operações.',{intent:['submitPatient']});
 task('patient-contact','patients','Registrar contato e retorno','Na ficha, abra Relacionamento. Um registro de contato não envia mensagem.',[
  ['Contato realizado','Abra Registrar contato, escolha canal/data e resumo administrativo.','#crm-contact-form'],
  ['Retorno opcional','Se necessário, defina uma pendência de retorno; depois salve pelos controles do formulário.','#crm-contact-form']],
  'Confira o contato no histórico e a pendência, se criada. A agenda e pagamentos não mudam.','Contato restrito precisa de conferência antes de qualquer comunicação externa.',{intent:['submitTherapyPatientContact']});
 task('patient-task','patients','Criar ou concluir uma pendência','Abra Relacionamento da ficha correta.',[
  ['Criar pendência','Defina título, prazo e prioridade pelos controles da ficha.','#crm-task-form'],
  ['Concluir ou reabrir','Use a ação da pendência correta quando o trabalho for realizado.','#crm-profile']],
  'Confira o prazo e a situação no paciente correto.','Arquivado não recebe nova pendência sem reativação.',{intent:['submitTherapyPatientTask','toggleTherapyPatientTask']});
 task('patient-stage','patients','Mudar a etapa de acompanhamento','Abra a ficha e a ação de alterar etapa.',[
  ['Conferir etapa','Escolha a etapa administrativa e a observação pertinente.','#crm-stage-form'],
  ['Salvar a mudança','Use a confirmação do formulário e confira o histórico.','#crm-stage-form']],
  'A etapa e sua mudança ficam no histórico; isso não determina condição clínica automaticamente.','Confirme a identidade da ficha antes de salvar.',{intent:['submitTherapyPatientStage']});
 task('patient-archive','patients','Arquivar ou reativar um paciente','Arquivar não apaga anotações, compromissos ou cobranças.',[
  ['Conferir o cadastro','Abra a ficha ou edição e leia as consequências da ação normal.','#crm-profile'],
  ['Encontrar depois','Inclua arquivados no filtro para consultar e reative apenas se necessário.','#view-patients']],
  'O histórico continua disponível; novas marcações exigem paciente ativo.','Arquivar não cancela automaticamente horários existentes.',{intent:['deletePatient','reactivateTherapyPatient']});

 task('agenda-create','agenda','Agendar uma sessão avulsa','É necessário um paciente ativo. Nenhum cadastro fictício será criado pelo guia.',[
  ['Preencher a marcação','Escolha paciente, tipo, data, horário e duração.','#appointment-form','open:appointment'],
  ['Conferir origem e valor','Revise origem e valor. Para consulta única, mantenha uma semana e use Salvar Sessão.','#appointment-form']],
  'Localize o horário na agenda. Agendado não significa atendido nem recebido.','Em conflito, confira expediente, bloqueio e intervalo sem repetir o clique.',{intent:['submitAppointment'],example:'Exemplo ilustrativo: 09h por 50 minutos termina às 09h50; o intervalo configurado também precisa estar livre.'});
 task('agenda-series','agenda','Criar uma série semanal','Confira todas as semanas pretendidas e um paciente ativo.',[
  ['Primeira ocorrência','Preencha a marcação que inicia a série.','#appointment-form','open:appointment'],
  ['Quantidade e confirmação','Em Repetir semanalmente, a quantidade inclui a primeira. Salve somente quando tiver conferido.','#therapy-repeat']],
  'Confira cada data na agenda. A série é validada inteira antes de gravar.','Uma semana em conflito impede a criação de todas; ajuste a intenção antes de tentar novamente.',{intent:['submitAppointment'],example:'Exemplo ilustrativo: quantidade 4 significa a primeira data e mais três semanas.'});
 task('agenda-move','agenda','Remarcar um horário','Abra a marcação correta e escolha Alterar horário.',[
  ['Nova data e hora','Confira paciente, duração, origem e a intenção de mudança.','#appointment-form'],
  ['Salvar e localizar','Salve pelo formulário e localize o novo horário.','#appointment-form']],
  'A marcação aparece no novo horário, preservando o registro pertinente.','Editar uma marcação não altera toda a série. Concluídas têm revisão pelo registro da sessão.',{intent:['submitAppointment']});
 task('agenda-status','agenda','Confirmar, registrar falta ou cancelar','Abra a marcação correta e escolha Situação.',[
  ['Conferir o estado','Selecione a situação pretendida no diálogo normal.','#view-schedule'],
  ['Confirmar conscientemente','Leia o efeito da ação. Registrar presença ou falta não escreve uma anotação clínica.','#view-schedule']],
  'Confira a situação escrita na agenda.','Não crie uma anotação avulsa apenas para confirmar presença.',{intent:['submitTherapyStatus']});
 task('agenda-hours','agenda','Definir expediente e intervalo','Expediente indicativo e restritivo têm efeitos diferentes.',[
  ['Configurar disponibilidade','Confira dias, períodos, pausas, grade e intervalo.','#agenda-settings-form','open:agenda-settings'],
  ['Conferir e salvar','Escolha a restrição pretendida e salve pelo formulário.','#agenda-settings-form']],
  'Confira o resumo da agenda e as novas tentativas de marcação; compromissos antigos são preservados.','Uma alteração pode sinalizar horários anteriores para conferência, sem apagá-los.',{intent:['submitTherapyAgendaSettings']});
 task('agenda-dates','agenda','Cadastrar feriado ou data do consultório','Datas de referência e datas que bloqueiam horários não são equivalentes.',[
  ['Feriados e datas','Escolha nome, data, tipo e repetição anual quando cabível.','#agenda-date-form','open:agenda-dates'],
  ['Definir o bloqueio','Confira se a data deve bloquear a agenda e salve.','#agenda-date-form']],
  'Localize a data no calendário e confira sua identificação.','Carnaval e outras referências não são tratadas automaticamente como todo feriado local.',{intent:['submitTherapyAgendaDate','removeTherapyAgendaDate']});
 task('agenda-block','agenda','Bloquear uma pausa ou período','Use Bloquear período para uma indisponibilidade, sem cadastrar um paciente para representá-la.',[
  ['Definir período','Informe dias, horário ou dia inteiro e motivo administrativo.','#agenda-block-form','open:agenda-blocks'],
  ['Conferir antes de salvar','Revise os limites do bloqueio e salve pelo formulário.','#agenda-block-form']],
  'Confira a faixa bloqueada na agenda.','Compromissos anteriores continuam disponíveis para conferência.',{intent:['submitTherapyAgendaBlock','removeTherapyAgendaBlock']});

 task('coverage-create','coverage','Cadastrar convênio e cor','Origem de atendimento não é situação da sessão.',[
  ['Configurações > Convênios','Defina nome, cor e disponibilidade para novas marcações.','#coverage-plan-form','open:coverage'],
  ['Salvar o cadastro','Confira o nome e use Salvar convênio.','#coverage-plan-form']],
  'O convênio fica disponível nas escolhas de novas marcações.','Nomes repetidos ou cores inválidas são recusados. Não há integração com operadoras.',{intent:['saveTherapyCoveragePlan','saveTherapyCoverageColors']});
 task('coverage-apply','coverage','Aplicar a origem a um atendimento','Configure a preferência na ficha, mas confira a origem da marcação.',[
  ['Preferência e marcação','Escolha o paciente no formulário de agenda e confira a origem sugerida.','#appointment-coverage','open:appointment'],
  ['Conferir o atendimento','A origem escolhida e o valor ficam nessa marcação; salve normalmente.','#appointment-form']],
  'Confira a origem na agenda e, depois de concluir o atendimento, na cobrança correspondente.','Alterar a preferência do paciente não reclassifica marcações já existentes.',{intent:['submitAppointment']});
 task('coverage-inactivate','coverage','Inativar um convênio','A inativação impede novas escolhas e mantém o histórico.',[
  ['Editar o convênio','Em Configurações > Convênios, use Editar no cadastro correto.','#coverage-plan-form','open:coverage'],
  ['Revisar disponibilidade','Desmarque Disponível para novas marcações se essa for sua intenção e salve.','#coverage-plan-form']],
  'Confira a situação inativa e as marcações antigas preservadas.','Preferência antiga pode permanecer no paciente; novas marcações pedem origem disponível.',{intent:['saveTherapyCoveragePlan']});
 task('coverage-history','coverage','Entender cores e histórico','Nomes, cores e origem são conservados em cada atendimento.',[
  ['Consultar a agenda','Use origem e situação como informações independentes.','#agenda-coverage-filter','view:schedule'],
  ['Conferir o passado','Registros sem origem permanecem Não informado. Não tente reclassificar tudo pela preferência atual.','#schedule-timeline']],
  'Você consegue distinguir classificação histórica de configuração atual.','Reembolso é particular; repasses e guias de convênio não são calculados por esta edição.',{reference:true});

 task('session-finish','sessions','Concluir atendimento e escolher cobrança','Abra pelo horário da Agenda ou pela fila A registrar para preservar o vínculo.',[
  ['Registrar o encontro','Confira paciente e data, escreva o registro segundo sua prática profissional.','#session-form'],
  ['Cobrança escolhida','Revise Avulsa, Pacote ou Sem cobrança e confirme pelo botão normal.','#therapy-billing']],
  'Confira o registro confirmado e o efeito escolhido: receita, consumo ou nenhum dos dois.','Falha de gravação ou pacote indisponível não confirma a tarefa.',{intent:['submitSessionNotes']});
 task('session-draft','sessions','Salvar e retomar rascunho','Rascunho protege o texto sem concluir atendimento ou cobrar.',[
  ['Guardar trabalho parcial','Preencha somente o que deseja guardar e use Salvar rascunho.','#sessions-save-draft','open:session'],
  ['Retomar depois','Na área Rascunhos, use Continuar no registro correto.','#view-sessions']],
  'O item aparece em Rascunhos. A confirmação definitiva é uma ação posterior.','Se outro registro já confirmou esse atendimento, confira o existente em vez de aplicar por cima.',{intent:['saveTherapySessionDraft']});
 task('session-review','sessions','Revisar anotação confirmada','Abra Conferir registro e escolha Editar registro.',[
  ['Complementar com intenção','Revise o conteúdo e a observação da alteração quando necessário.','#session-form'],
  ['Salvar a revisão','O histórico anterior e os vínculos financeiros permanecem.','#session-form']],
  'Confira a versão anterior no Histórico de alterações.','Revisão não deve gerar uma nova cobrança ou outro consumo.',{intent:['submitSessionNotes']});
 task('session-recover','sessions','Recuperar anotação sem cobrar novamente','Procure o encontro concluído sem anotação na fila ou na Visão geral.',[
  ['Abrir a recuperação','Escolha a ação de recuperar no próprio atendimento. Não crie outra sessão avulsa.','#view-sessions'],
  ['Salvar somente a anotação','Confira o aviso de recuperação no formulário e confirme o registro normal.','#session-form']],
  'A anotação fica vinculada ao encontro sem nova cobrança ou consumo.','Se já houver anotação, o caminho correto é conferir o registro existente.',{intent:['submitSessionNotes']});
 task('session-archive','sessions','Arquivar ou restaurar anotação','Arquivar mantém atendimento, histórico, pacote e cobrança.',[
  ['Conferir registro','Abra o registro correto antes de escolher a ação.','#view-sessions'],
  ['Arquivo e restauração','Consulte a área Arquivo para localizar o item depois.','#sessions-tabs']],
  'O estado da anotação muda sem reabrir ou cobrar o atendimento.','Não use arquivamento como cancelamento financeiro.',{intent:['deleteSessionNotes','restoreTherapySession']});

 task('treatment-create','treatments','Criar um plano terapêutico','Escolha o paciente e defina o planejamento segundo sua avaliação profissional.',[
  ['Novo plano','Preencha objetivos gerais, frequência, meta e revisão prevista quando cabível.','#treatment-form','open:treatment'],
  ['Salvar o planejamento','Revise o estado informado antes da confirmação normal.','#treatment-form']],
  'Encontre o plano salvo. Nenhum horário ou pacote foi criado por essa ação.','O guia não propõe diagnóstico ou meta clínica.',{intent:['submitTreatment']});
 task('treatment-objective','treatments','Atualizar objetivo do plano','Abra o plano correto e a aba Objetivos.',[
  ['Objetivo individual','Use Adicionar objetivo ou Atualizar objetivo e descreva seu controle.','#treatment-detail-panel'],
  ['Situação manual','Defina a situação e salve pelo formulário próprio.','#treatment-objective-title']],
  'Confira o objetivo no plano e seu histórico.','Contagens não representam cálculo automático de melhora clínica.',{intent:['submitTherapyTreatmentObjective']});
 task('treatment-links','treatments','Vincular sessões ao plano','Abra Sessões vinculadas do plano e Gerenciar vínculos.',[
  ['Selecionar o pertinente','Escolha apenas sessões deste paciente que pertencem a esse ciclo.','#treatment-links-form'],
  ['Salvar vínculos','Revise os selecionados antes de confirmar.','#treatment-links-form']],
  'Confira os vínculos no plano; anotações e cobranças permanecem.','Vínculo indisponível deve ser conferido, não substituído silenciosamente.',{intent:['submitTherapyTreatmentLinks']});
 task('treatment-review','treatments','Revisar ou arquivar um plano','Use o plano correto; arquivar preserva seu histórico.',[
  ['Conferir e revisar','Revise datas e situação pelos controles normais.','#treatment-detail-panel'],
  ['Ler o histórico','Confira a versão anterior após a mudança.','#view-treatments']],
  'A alteração aparece no plano sem concluir sessões automaticamente.','Meta atingida não determina encerramento automático.',{intent:['submitTreatment','archiveTherapyTreatment']});

 task('assessment-apply','assessments','Registrar uma aplicação estruturada','Escolha paciente, instrumento e data; respostas são responsabilidade do profissional.',[
  ['Nova avaliação','Selecione PHQ-9 ou GAD-7 e confira os campos.','#assessment-form','open:assessment'],
  ['Confirmar completa','Responda os itens obrigatórios, inclusive quando a resposta for zero, e confirme normalmente.','#assessment-form']],
  'A aplicação aparece confirmada. A pontuação não é diagnóstico.','Aplicação incompleta deve ser guardada como rascunho.',{intent:['submitAssessment']});
 task('assessment-draft','assessments','Guardar aplicação parcial','Não é necessário inventar respostas para concluir um questionário.',[
  ['Trabalho incompleto','Use Salvar rascunho no formulário da aplicação.','#assessment-form','open:assessment'],
  ['Retomar pela área correta','Localize o item em Rascunhos e continue quando houver as informações.','#view-assessments']],
  'O rascunho permanece sem uma confirmação parcial indevida.','Resultados parciais não devem ser tratados como comparação completa.',{intent:['saveTherapyAssessmentDraft']});
 task('assessment-free','assessments','Criar registro livre','Use Registro livre para uma avaliação sem escala calculada pelo sistema.',[
  ['Escolher Registro livre','Identifique o instrumento ou contexto que será registrado.','#assessment-form','open:assessment'],
  ['Conferir a descrição','Registre a avaliação profissional e confirme pelo fluxo normal.','#assessment-form']],
  'O registro fica disponível sem uma escala ou classificação inventada.','Não use uma escala diferente para contornar instrumento ausente.',{intent:['submitAssessment']});
 task('assessment-correct','assessments','Corrigir respostas confirmadas','Abra o registro e a ação própria de corrigir respostas.',[
  ['Distinguir os tipos de revisão','Editar observações preserva respostas. Corrigir respostas usa sua ação específica.','#view-assessments'],
  ['Conferir antes de confirmar','Revise as alterações e o motivo pelos controles do registro.','#assessment-form']],
  'Confira a aplicação corrigida e a versão anterior no Histórico.','Não crie outra aplicação apenas para esconder uma correção.',{intent:['submitAssessment']});
 task('assessment-compare','assessments','Comparar aplicações elegíveis','Escolha registros completos da mesma pessoa, instrumento e versão.',[
  ['Encontrar aplicações','Use os filtros e as opções de comparação do módulo.','#view-assessments'],
  ['Conferir a base','Revise datas e elegibilidade; aplicações incompletas não substituem uma completa.','#view-assessments']],
  'A comparação tem uma base identificável; interpretar o resultado é tarefa profissional.','Se a comparação não estiver disponível, confira completude, instrumento e versão.',{reference:true});
 task('assessment-followup','assessments','Reavaliação e arquivo','Acompanhamento e Arquivados têm finalidades diferentes.',[
  ['Planejar revisão','Registre a data de reavaliação prevista quando pertinente.','#assessment-form'],
  ['Conferir as áreas','Use Acompanhamento para as referências de retorno e Arquivados para itens preservados.','#view-assessments']],
  'O registro e sua situação ficam acessíveis sem disparo automático de mensagem.','Arquivo não elimina o histórico de respostas.',{intent:['submitAssessment','archiveTherapyAssessment']});

 task('orientation-create','orientations','Confirmar orientação ou encaminhamento','Escolha paciente, finalidade e destinatário.',[
  ['Conteúdo externo','Preencha o que será entregue; use Notas internas para o que não deve acompanhar o documento.','#prescription-form','open:orientation'],
  ['Confirmar e conferir','Revise o documento e confirme pelo formulário normal.','#prescription-form']],
  'O registro confirmado pode ser conferido antes de imprimir. Nada é enviado automaticamente.','Confirmar é diferente de entregar ou registrar retorno.',{intent:['submitPrescription']});
 task('orientation-draft','orientations','Salvar documento como rascunho','Guarde trabalho parcial sem registrar entrega.',[
  ['Rascunho do documento','Use Salvar rascunho com as informações disponíveis.','#prescription-form','open:orientation'],
  ['Retomar depois','Localize na área de rascunhos para continuar.','#view-prescriptions']],
  'O rascunho permanece protegido sem movimentação de entrega.','Não marque envio realizado só para avançar um guia.',{intent:['saveTherapyOrientationDraft']});
 task('orientation-print','orientations','Conferir a impressão de um documento','Abra um documento confirmado e sua prévia pelos controles do módulo.',[
  ['Conferir o destinatário','Revise os campos que estarão na cópia externa.','#view-prescriptions'],
  ['Separar o interno','Notas internas, contatos e histórico não devem acompanhar a folha.','#view-prescriptions']],
  'Somente imprima ou salve PDF depois de conferir a prévia.','O guia não confirma que um arquivo foi salvo ou entregue.',{reference:true});
 task('orientation-delivery','orientations','Registrar entrega ou retorno','Faça o registro somente depois da ação externa correspondente.',[
  ['Acompanhamento do documento','Abra o registro correto e confira as ações permitidas.','#view-prescriptions'],
  ['Registrar o realizado','Escolha entrega, espera de retorno ou retorno recebido conforme o caso real.','#view-prescriptions']],
  'A movimentação aparece no histórico; não há envio automático.','Não confunda confirmação do texto com entrega.',{intent:['submitTherapyOrientationEvent']});
 task('orientation-review','orientations','Revisar ou arquivar documento','Abra o registro correto e preserve o histórico.',[
  ['Revisão intencional','Use a edição normal para corrigir o conteúdo.','#prescription-form'],
  ['Conferir histórico ou arquivo','Verifique a versão anterior e a situação atual.','#view-prescriptions']],
  'O documento e suas movimentações anteriores continuam preservados.','Não substitua o histórico por outro documento apenas para ocultar uma revisão.',{intent:['submitPrescription','archiveTherapyOrientation']});

 task('emergency-references','emergency','Consultar contatos de referência','Esta orientação não substitui uma decisão ou atendimento profissional.',[
  ['Referências cadastradas','Confira de onde vêm os contatos de consultório e paciente.','#therapy-emergency-references'],
  ['Atualização intencional','Atualize contatos em Configurações ou no cadastro, quando necessário. O guia não liga para ninguém.','#view-emergency']],
  'Você sabe localizar e manter as referências pelos canais corretos.','Contatos não são verificados externamente pelo aplicativo.',{reference:true});
 task('emergency-record','emergency','Conhecer registro e histórico de intercorrências','Não é necessário registrar um episódio para aprender esta tela. Exercícios com conteúdo fictício pertencem a uma base de demonstração separada.',[
  ['Campos e validação','Conheça paciente, tipo, data, risco informado, intervenção e duração, sem preencher por obrigação do guia.','#emergency-form'],
  ['Histórico e saída','Abra registros apenas por intenção própria. Ao sair com alterações, respeite o aviso do formulário.','#recent-emergencies']],
  'Você sabe onde registrar e consultar, sem classificação automática ou acionamento de socorro.','O guia não sugere risco, intervenção ou encaminhamento clínico.',{reference:true});

 task('finance-create','finance','Registrar receita ou despesa manual','Confira se já existe cobrança vinculada ao atendimento ou pacote.',[
  ['Novo lançamento','Escolha tipo, descrição, valor, data, situação e vínculo necessário.','#financial-form','open:financial'],
  ['Salvar com intenção','Revise se está pendente ou já realizado antes de salvar.','#financial-form']],
  'Confira o lançamento e seu impacto em caixa ou pendências.','Não crie outra receita para uma cobrança que já existe.',{intent:['submitFinancial']});
 task('finance-receive','finance','Registrar recebimento ou pagamento','O valor precisa ter sido realizado fora do sistema.',[
  ['Conferir a pendência','Abra o lançamento correto e confira tipo, valor e vínculo.','#finance-table-body'],
  ['Baixa realizada','Informe data efetiva e forma de pagamento e use Registrar recebimento ou Registrar pagamento.','#view-financial']],
  'A pendência passa a realizada sem duplicar o lançamento.','O sistema não faz uma transferência bancária por essa ação.',{intent:['submitTherapyReceipt:receive']});
 task('finance-reverse','finance','Cancelar cobrança ou registrar devolução integral','Pendência aberta e valor já realizado permitem ações diferentes.',[
  ['Conferir o original','Abra o lançamento correto; leia se a ação disponível é cancelar ou devolver.','#finance-table-body'],
  ['Motivo e data','Use a ação normal com os dados exigidos, somente se ela corresponder ao acerto real.','#view-financial']],
  'O original fica preservado; uma devolução realizada cria o lançamento de sentido oposto.','Pacote com consumo exige conferência do acordo; não será cancelado automaticamente.',{intent:['submitTherapyReceipt:reverse']});
 task('finance-recurring','finance','Cadastrar despesa recorrente','Regra mensal e lançamento financeiro não são a mesma coisa.',[
  ['Nova regra mensal','Defina descrição, valor, dia de vencimento e vigência.','#assistant-recurring-form','settings:financial'],
  ['Salvar a regra','A geração dos lançamentos é uma etapa posterior, com prévia.','#assistant-recurring-form']],
  'A regra aparece cadastrada, sem pagamento ou geração automática do mês.','Dia 29, 30 ou 31 pode ajustar para o último dia do mês, inclusive fim de semana.',{intent:['saveTherapyRecurring']});
 task('finance-generate','finance','Conferir e gerar despesas do mês','É necessário haver regra ativa na competência escolhida.',[
  ['Prévia do mês','Escolha o mês e confira os itens A gerar e Já gerado.','#assistant-recurring-month','open:recurring'],
  ['Gerar se necessário','Use o botão normal para gerar despesas pendentes. Não é registro de pagamento.','#assistant-recurring-preview']],
  'Confira as novas pendências no Financeiro. Repetir o mês não duplica itens, inclusive cancelados.','Sem itens novos, o botão pode ficar indisponível; não crie outra regra para contornar isso.',{intent:['generateTherapyRecurring']});
 task('finance-pause','finance','Pausar ou reativar regra mensal','Pausa não apaga lançamentos anteriores.',[
  ['Localizar a regra','Abra Despesas recorrentes e confira a descrição e vigência.','#assistant-recurring-form','open:recurring'],
  ['Alterar disponibilidade','Use Pausar ou Reativar na regra correta.','#assistant-recurring-rules']],
  'Confira a situação da regra e a prévia das competências futuras.','Lançamentos já gerados continuam no histórico.',{intent:['toggleTherapyRecurring']});

 task('package-sell','packages','Vender pacote e conferir a cobrança','Escolha paciente ativo e condições contratadas.',[
  ['Novo pacote','Defina nome, quantidade, valor, início e validade opcional.','#therapy-package-form','open:package'],
  ['Recebido ou pendente','Marque pagamento recebido apenas se realizado; salve pacote e cobrança pelo comando normal.','#therapy-package-form']],
  'Confira pacote e cobrança vinculada. Nenhum horário ou consumo foi criado.','Não registre outra receita manual para a mesma venda.',{intent:['submitTherapyPackage']});
 task('package-consume','packages','Consumir uma sessão do pacote','O pacote deve pertencer ao paciente e estar válido na data do atendimento.',[
  ['Abrir o atendimento','Use o horário na Agenda ou a fila de Sessões para manter o vínculo.','#view-packages','view:sessions'],
  ['Escolher Pacote','No registro do atendimento, confira o pacote disponível e confirme normalmente.','#therapy-billing']],
  'Um consumo aparece vinculado à sessão; a venda não é cobrada novamente.','Pacote vencido, esgotado, futuro, cancelado ou de outra pessoa não pode ser escolhido.',{intent:['submitSessionNotes']});
 task('package-availability','packages','Entender por que um pacote não aparece','Confira data do atendimento e pessoa antes de criar outro pacote.',[
  ['Situação e saldo','Use os filtros de Pacotes para conferir vigência e saldo válido.','#therapy-packages-list'],
  ['Conferir o detalhe','Examine consumos, início, validade e cancelamento no pacote correto.','#package-detail-panel']],
  'Você identifica o motivo da indisponibilidade sem duplicar venda.','Saldo não consumido de pacote vencido não significa saldo válido hoje.',{reference:true});
 task('package-review','packages','Revisar nome ou validade','A revisão preserva paciente, quantidade, valor e consumos.',[
  ['Revisar pacote','Abra o detalhe e escolha a ação própria.','#package-revision-form'],
  ['Justificar a revisão','Confira nome, validade e motivo e salve.','#package-revision-form']],
  'A revisão aparece no histórico sem nova cobrança.','Mudança de validade altera o período de uso; confira o acordo antes de salvar.',{intent:['submitTherapyPackageRevision']});
 task('package-cancel','packages','Conhecer cancelamento e acerto financeiro','Não faça um cancelamento só para concluir um guia.',[
  ['Conferir o histórico','Examine consumo e cobrança vinculada no pacote correto.','#package-detail-panel'],
  ['Escolher o caminho permitido','A ação financeira depende de recebimento e consumo; confira o acordo pelos controles normais.','#view-packages']],
  'Você entende por que um pacote com sessões usadas exige conferência e não um cancelamento automático.','Devolução parcial não é executada pelo botão de devolução integral.',{reference:true});

 for(const [id,title,body]of [
  ['attendance','Conferir comparecimento','Comparecimento usa concluídos divididos por concluídos mais faltas; cancelados ficam fora desse denominador.'],
  ['financial','Conferir extrato financeiro','Confira a data considerada: pagamento efetivo, vencimento ou a data original quando não há outra informada.'],
  ['origin','Conferir recebimentos por origem','Origem histórica, recebido bruto, devoluções, líquido e pendências são diferentes. Devolução em outro mês pode produzir líquido negativo nesse período.'],
  ['packages','Conferir saldos de pacotes','O relatório retrata saldos atuais, não reconstrói automaticamente o saldo de uma data passada.']])task('report-'+id,'reports',title,'Escolha o relatório, período, paciente e inclusão de arquivados.',[
   ['Aplicar os filtros','Use os campos normais antes de gerar a prévia.','#reports-type'],['Conferir os critérios',body,'#therapy-report']],
   'Confira as linhas, indicadores e critérios da cópia gerada.','Registros sem data ou sem origem precisam de leitura dos critérios, não de classificação inventada.',{resultTarget:'#therapy-report'});
 task('report-export','reports','Imprimir ou exportar a cópia conferida','Primeiro gere e confira a prévia do relatório pretendido.',[
  ['Revisar a cópia','Confira cabeçalho, período, paciente e colunas antes de usar Imprimir ou Exportar CSV.','#therapy-report'],
  ['Conferir fora do aplicativo','Confirme o arquivo ou a impressão por sua própria conferência. O guia não vê a pasta de downloads.','#therapy-report']],
  'A cópia externa corresponde à prévia que você revisou, sem narrativas clínicas.','Solicitar exportação não comprova arquivo salvo.',{external:true,resultTarget:'#therapy-report'});

 task('settings-clinic','settings','Identificar consultório e referências','Confira nome, identificação profissional e contatos de apoio.',[
  ['Consultório','Preencha somente os campos que deseja manter.','#system-clinic-form','settings:clinic'],
  ['Salvar esta área','Use o botão do formulário de Consultório. Outras áreas têm gravação própria.','#system-clinic-form']],
  'Confira os dados salvos e a identificação exibida no aplicativo.','Sair com alterações pode exigir confirmação; o guia respeita esse aviso.',{intent:['saveSettings:clinic']});
 task('settings-routine','settings','Definir duração e valor padrão','O padrão será sugestão para novos registros, não reescrita do passado.',[
  ['Atendimento','Defina duração e valor, inclusive zero se essa for a intenção.','#system-routine-form','settings:routine'],
  ['Salvar o padrão','Use o botão desta área e confira o próximo formulário novo.','#system-routine-form']],
  'O padrão salvo permanece nas Configurações.','Valor zero é permitido; duração vazia ou fora do intervalo precisa de correção.',{intent:['saveSettings:routine']});
 task('settings-appearance','settings','Ajustar tema e tamanho da fonte','Tema e escala de leitura são preferências deste navegador.',[
  ['Aparência','Use os controles normais para escolher claro/escuro e leitura de 90% a 130%.','#system-panel-appearance','settings:appearance'],
  ['Conferir a leitura','Veja também um formulário no celular, se usar esse dispositivo.','#system-panel-appearance']],
  'A leitura fica confortável sem alterar registros clínicos.','Essas preferências não substituem o backup do cofre.',{reference:true});
 task('settings-identity','settings','Logo, assinatura e modelos','Identidade e mensagens salvas no cofre acompanham o backup protegido.',[
  ['Logo e cor','Em Aparência e identidade, confira o logo e a paleta. Use Salvar logo para confirmar uma imagem.','#system-identity-content','settings:appearance'],
  ['Assinatura e modelos','Em Assistente e mensagens, confira assinatura e modelos administrativos.','#assistant-settings-content','settings:assistant'],
  ['Salvar as mensagens','Revise o texto e salve pelos controles normais.','#assistant-settings-content']],
  'Confira a identidade e os modelos ao preparar uma mensagem.','Não inclua diagnóstico ou conteúdo clínico em mensagens administrativas.',{intent:['saveTherapyAssistantSettings']});
 task('settings-security','settings','Conhecer bloqueio e proteção','A senha pertence ao cofre local e aos backups correspondentes.',[
  ['Segurança e backup','Confira bloqueio por inatividade e os recursos de cópia.','#system-security-form','settings:security'],
  ['Preservar o acesso','Guarde a senha fora do chat e não a digite no guia. Backups antigos mantêm suas senhas anteriores.','#system-security-form']],
  'Você conhece o bloqueio e as diferenças entre senha, licença e cópia externa.','O guia não desativa proteção, troca senha ou pede credenciais.',{reference:true});
 task('settings-backup','settings','Guardar um backup protegido','O arquivo precisa ficar fora do navegador; a senha do arquivo deve ser conhecida.',[
  ['Solicitar a cópia','Na aba Segurança e backup, use Baixar backup protegido quando desejar.','#system-security-form','settings:security'],
  ['Conferir o arquivo','Localize o arquivo .json no destino escolhido e guarde uma cópia externa segura. Não envie o conteúdo ao guia.','#system-security-form']],
  'Confirme somente depois de conferir o arquivo fora do aplicativo.','Um registro de solicitação de backup não garante que o arquivo foi salvo.',{external:true,example:'Exemplo ilustrativo: conferir nome/data do arquivo no destino externo, sem abrir ou compartilhar seu conteúdo clínico.'});
 task('settings-restore','settings','Entender restauração e cópia anterior','Restauração substitui a base atual. Não é exercício obrigatório do tour.',[
  ['Antes de restaurar','Guarde as cópias que deseja preservar e conheça a senha do arquivo escolhido.','#system-security-form','settings:security'],
  ['Prévia e consequência','A prévia exige conferência. Só o usuário confirma a substituição pelos controles normais, quando realmente necessário.','#system-security-form']],
  'Você compreende a substituição e a cópia anterior local. Teste o procedimento apenas em base fictícia isolada.','Outra aba alterando a base pode invalidar a prévia; não force a confirmação.',{reference:true});
 task('settings-password','settings','Entender troca ou esquecimento de senha','Nenhuma senha deve ser digitada no guia.',[
  ['Senhas das cópias','Trocar senha protege a base atual; arquivos anteriores continuam exigindo a senha de quando foram criados.','#system-security-form','settings:security'],
  ['Se esqueceu','Preserve a base e procure uma cópia cuja senha conheça. Licença e suporte não substituem a chave de abertura.','#system-security-form']],
  'Você sabe preservar cópias e acesso antes de qualquer operação real.','Restaurar uma cópia antiga não recupera alterações feitas depois dela.',{reference:true});
 task('settings-maintenance','settings','Entender limpeza e reinício','Limpar registros e reiniciar base têm consequências diferentes. Não execute para treinar.',[
  ['Manutenção','Leia as diferenças e preserve backup externo e cópias anteriores necessárias.','#system-panel-maintenance','settings:maintenance'],
  ['Decisão explícita','O tour não abre confirmações de limpeza nem preenche frases ou senhas. Use essa operação somente por intenção própria.','#system-panel-maintenance']],
  'Você entende que sair do guia não desfaz operações de manutenção.','Cópia anterior local não é garantia contra limpeza dos dados do navegador.',{reference:true});

 task('assistant-triage','assistant','Resolver uma pendência pela origem','Abra o Assistente e confira a categoria antes de agir.',[
  ['Filtrar e abrir','Escolha o item correspondente e use sua ação para abrir a origem.','#assistant-list','open:assistant'],
  ['Conferir a situação','Atue no módulo normal e confira o resultado. Uma pendência não é uma confirmação automática.','#view-dashboard']],
  'Você sabe localizar o registro pertinente sem duplicar lançamentos.','Se o item já foi tratado, confira os filtros e o registro antes de repetir a ação.',{reference:true});
 task('assistant-message','assistant','Preparar mensagem e registrar envio realizado','Confira a permissão de contato e o número na ficha. O envio externo continua manual.',[
  ['Preparar e revisar','No Assistente, escolha a mensagem e revise o texto antes de copiar ou abrir WhatsApp.','#assistant-list','open:assistant'],
  ['Registrar só depois','Use Registrar envio realizado apenas quando a comunicação externa tiver ocorrido.','#view-dashboard']],
  'O contato administrativo pode ficar no histórico, sem confirmar consulta ou pagamento.','Não é necessário enviar uma mensagem para consultar este guia.',{intent:['recordTherapyAssistantContact']});
 task('manual-search','manual','Encontrar uma dúvida no manual','Pesquise a intenção ou o sintoma, não apenas o nome do módulo.',[
  ['Buscar e filtrar','Experimente termos como rascunho, pacote, convênio ou backup e confira grupo e leitura.','#manual-search'],
  ['Abrir a orientação','Leia o tópico ou a solução rápida; use o atalho somente se desejar ir àquela tela.','#manual-tabs']],
  'Você sabe reencontrar uma orientação e voltar à tarefa.','Marcar um tópico como lido não confirma uma operação.',{reference:true});
 task('manual-resume','manual','Retomar ou repetir um guia','Guias e tarefas guarda somente progresso educacional neste navegador.',[
  ['Encontrar o roteiro','Use a biblioteca de guias e escolha Retomar ou Repetir.','#view-manual'],
  ['Entender o progresso','Apresentado, conferido pelo usuário e operação confirmada são situações distintas.','#view-manual']],
  'Você retoma o ponto salvo sem perder registros ou reiniciar o sistema.','Se a preferência não puder ser guardada, a orientação continua disponível nesta abertura.',{reference:true});
 task('about-diagnostic','about','Conferir o ambiente e diagnóstico','Não compartilhe backup clínico para explicar uma dúvida de uso.',[
  ['Ambiente atual','Confira versão, conexão e controle do cache nesta tela.','#system-diagnostics'],
  ['Arquivo técnico','Se precisar de suporte, solicite o diagnóstico e confira o arquivo antes de compartilhar pelo canal escolhido.','#system-diagnostics']],
  'Você consegue informar o contexto técnico sem enviar senha, chave integral ou prontuário.','O diagnóstico não comprova que existe backup externo.',{external:true});
 task('about-device','about','Entender base vazia em outro navegador','Cada navegador, perfil e endereço mantém armazenamento próprio.',[
  ['Encontrar a base original','Volte ao ambiente em que trabalhava e preserve seus dados.','#view-about'],
  ['Transferência intencional','Use um backup conhecido e sua senha quando realmente precisar transferir, respeitando a licença.','#view-about']],
  'Você entende por que instalar o aplicativo ou abrir outra tela não transporta os registros.','Não limpe o navegador original como tentativa de corrigir uma base vazia em outro ambiente.',{reference:true});
 task('patient-clinical-library','patients','Consultar referências clínicas pela ficha','Você pode consultar a biblioteca sem cadastrar ou editar uma pessoa.',[
  ['Abrir a consulta','Use Referências clínicas na tela ou na ficha. O painel mantém o formulário original.','#clinical-search','clinical:all'],
  ['Pesquisar e ler','Pesquise um termo e use Consultar. As categorias separam abordagens, termos e guias.','#clinical-categories']],
  'Você sabe consultar e fechar a biblioteca sem gravar o cofre.','Os links de fontes externas exigem internet; os textos do catálogo ficam disponíveis offline após a atualização.',{topic:'clinical',reference:true,resultTarget:'#therapy-clinical',example:'Exemplo fictício: pesquisar hipótese, ler sua distinção e fechar a referência. Nenhum diagnóstico é preenchido.'});
 task('patient-clinical-terms','patients','Distinguir relato, observação e hipótese','Os termos ajudam a organizar a redação; a conclusão pertence ao profissional.',[
  ['Encontrar um conceito','Consulte Relato e os conceitos relacionados, sem copiar exemplos para o registro.','#clinical-entry-title','clinical:report'],
  ['Voltar ao registro','Fechar referências devolve o foco ao controle de origem; o texto do formulário é preservado.','#therapy-clinical']],
  'Você compreende a diferença entre consultar um termo e registrar um achado.','Sem sinalização registrada não comprova ausência de risco; um termo consultado não avalia a pessoa.',{topic:'clinical',reference:true,resultTarget:'#therapy-clinical'});
 task('treatment-clinical-approach','treatments','Conhecer Fenomenologia e sua seleção no plano','Abordagem é uma escolha do profissional no plano terapêutico, acessível também pela ficha.',[
  ['Ler o referencial','Consulte Fenomenológica (Fenomenologia) e suas distinções.','#clinical-entry-title','clinical:approach-fenomenologica'],
  ['Selecionar quando pertinente','Feche a referência. Em um plano pertinente ao seu trabalho, escolha a abordagem no formulário e salve somente quando desejar. O guia não faz essa seleção.','#therapy-clinical']],
  'Você sabe onde selecionar Fenomenologia e que a consulta não muda um plano.','Planos anteriores conservam seus valores, inclusive abordagens legadas. A biblioteca não recomenda uma abordagem para o paciente.',{topic:'clinical',reference:true,resultTarget:'#therapy-clinical'});
 task('session-clinical-reference','sessions','Consultar termos durante a anotação','Uma consulta pode ser aberta junto do conteúdo, humor ou adesão sem confirmar a sessão.',[
  ['Consultar humor e afeto','Leia o termo Humor e os conceitos relacionados. Deprimido na sessão não estabelece um transtorno.','#clinical-entry-title','clinical:mood'],
  ['Preservar sua redação','Feche a biblioteca e continue no formulário. Salvar rascunho ou confirmar permanecem ações distintas e explícitas.','#therapy-clinical']],
  'Você consulta o termo e mantém o texto, o atendimento e a cobrança como estavam.','A biblioteca não observa o paciente e não substitui avaliação; Não avaliado continua disponível.',{topic:'clinical',reference:true,resultTarget:'#therapy-clinical'});
 task('assessment-clinical-reference','assessments','Consultar fundamentação e limites da avaliação','Uma pontuação de rastreio isolada não estabelece diagnóstico.',[
  ['Ler o guia de registro','Consulte Hipótese e diagnóstico e suas fontes.','#clinical-entry-title','clinical:guide-hypothesis'],
  ['Conhecer a estrutura vazia','O guia oferece títulos para redação profissional. Nenhuma resposta, soma ou hipótese é preenchida.','#clinical-outline']],
  'Você distingue referência, instrumento, hipótese e conclusão profissional.','Ler a referência não confirma avaliação ou suficiência diagnóstica e não modifica aplicações anteriores.',{topic:'clinical',reference:true,resultTarget:'#therapy-clinical'});
 task('manual-clinical-reference','manual','Usar o Manual, as referências e a estrutura vazia','O tópico Referências clínicas explica os acessos da ficha e dos formulários.',[
  ['Consultar um guia','Abra o guia de Evolução e revisão do plano.','#clinical-entry-title','clinical:guide-evolution'],
  ['Copiar somente títulos','Copiar estrutura vazia não copia o exemplo e não altera um formulário. Se a cópia não estiver disponível, selecione o texto pelos controles do navegador.','#clinical-outline']],
  'Você sabe reencontrar a ajuda pelo Manual e pelos Guias e tarefas.','Consultar ou copiar a estrutura não equivale a registrar, avaliar ou concluir um atendimento.',{topic:'clinical',reference:true,resultTarget:'#therapy-clinical'});
 for(const id of ['patients','treatments','sessions','assessments']) {
  const section=sections.find(s=>s.id===id);
  section.steps.at(-1).text+=' Referências clínicas permite consultar termos e guias mantendo sua redação; consulte também o novo tópico do Manual.';
  section.version=2;
 }
 area('documents','Documentos por paciente','documents','documents','Prepare conteúdo, assinatura e entrega em etapas distintas.',[
  ['Preparar o rascunho','Selecione paciente, modalidade e finalidade. Declarações devem conter somente fatos; termos e contratos exigem redação individual e revisão.','#view-documents'],
  ['Concluir e assinar','Revise a prévia antes de concluir. Imprima/salve PDF e assine pelo meio adequado. Anexo não equivale a assinatura verificada.','#view-documents'],
  ['Corrigir por nova versão','Documento concluído não é editado. Abra a versão mais recente e use Criar nova versão com motivo.','#view-documents'],
  ['Registrar entrega e preservar','Informe envio e recebimento separadamente. Corrija por nova versão e confira backup com anexos em outro navegador.','#view-documents']]);
 area('support','Suporte e chamados','support','support','Atendimento técnico sem compartilhar prontuários.',[
  ['Privacidade primeiro','Nunca inclua dados de pacientes, senhas ou backups no texto. O canal é técnico, não clínico.','#view-support'],
  ['Preparar e revisar','Abra um chamado por intenção própria, selecione a categoria e revise sua mensagem. O guia não envia nada.','#view-support'],
  ['Conferir o envio','Sem confirmação, o envio fica pendente nesta aba. Repetir a operação pendente usa o mesmo identificador.','#support-queue-state'],
  ['Acompanhar com segurança','O menu avisa de respostas. Bloquear ou fechar apaga rascunhos e fila locais; confira a lista antes de criar novamente.','#view-support']]);
 task('support-privacy','support','Conhecer privacidade e envios pendentes','Abra o cofre e confira a licença neste dispositivo.',[
  ['Ler os limites','Leia o aviso do canal e a orientação sobre textos guardados somente na aba.','#view-support'],
  ['Conferir antes de repetir','Conheça o indicador de envio pendente e atualize a lista antes de abrir outra solicitação após reabrir.','#view-support']],
  'Você conhece o canal e seus limites. Nenhum chamado foi enviado pelo guia.','Se estiver sem acesso ao cofre, procure o canal da compra sem enviar a senha.',{reference:true,correction:'Reabra o Manual no tópico Suporte e chamados técnicos.',example:'Exemplo fictício: descrever um botão sem resposta, sem citar pacientes.'});
 tasks.at(-1).preserves='Consultar o guia não envia mensagens e não altera pacientes, agenda ou financeiro.';
 for(const s of sections)s.version = ['coverage','settings','finance','sessions'].includes(s.id)?3:(s.version||1);
 for(const t of tasks)if(t.area==='coverage'||t.area==='settings'||['finance-recurring','finance-pause'].includes(t.id))t.version=2;
 return {sections,tasks,all:()=>[...sections.map(s=>({...s,id:'intro-'+s.id,area:s.id,kind:'intro'})),...tasks.map(t=>({...t,kind:t.reference?'reference':'task'}))]};
})();
