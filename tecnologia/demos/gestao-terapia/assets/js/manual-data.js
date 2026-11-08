/* Base estruturada do Manual de Uso — 100% local, sem acesso nem mutação do cofre. */
const TherapyManualData = (() => {
    function fold(value) {
        return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    }

    const viewTopics = {
        dashboard: 'assistant',
        schedule: 'agenda',
        patients: 'patients',
        sessions: 'sessions',
        treatments: 'treatments',
        assessments: 'assessments',
        prescriptions: 'prescriptions',
        documents: 'documents',
        financial: 'financial',
        packages: 'packages',
        reports: 'reports',
        settings: 'identity',
        about: 'install',
        emergency: 'emergency',
        manual: 'install',
        support: 'support'
    };

    const quickQueries = [
        { label: 'Backup e outro PC', query: 'backup' },
        { label: 'Pacotes e saldo', query: 'pacote' },
        { label: 'Rascunho e cobrança', query: 'rascunho' },
        { label: 'Devoluções e estorno', query: 'devolucoes' },
        { label: 'Convênio e reembolso', query: 'convenio' },
        { label: 'Licença vs. senha', query: 'licenca' },
        { label: 'WhatsApp e avisos', query: 'whatsapp' },
        { label: 'Uso offline', query: 'offline' }
    ];

    const onboarding = [
        {
            id: 'clinic',
            step: 1,
            icon: 'building-2',
            time: '1 min',
            title: 'Identificar o consultório e contatos de referência',
            summary: 'Personalize o nome exibido no painel, a identificação profissional e os contatos de apoio para intercorrências.',
            items: [
                'Informe o nome do consultório, telefone e, se desejar, seu registro profissional.',
                'Cadastre o contato e o hospital ou serviço de referência para consulta imediata no módulo de Emergência.'
            ],
            actions: [
                { label: 'Abrir Consultório', action: 'settings:clinic', primary: true }
            ]
        },
        {
            id: 'routine',
            step: 2,
            icon: 'calendar-clock',
            time: '2 min',
            title: 'Definir duração, valor padrão, expediente e convênios',
            summary: 'Ajuste os padrões usados nos novos formulários, os horários visíveis da grade e as origens de atendimento aceitas.',
            items: [
                'Em Atendimento, ajuste a duração sugerida (10 a 240 min) e o valor padrão da sessão avulsa.',
                'Em Configurações, use Agenda e disponibilidade para expediente, intervalos e feriados; use Convênios para cadastrar os planos atendidos.'
            ],
            actions: [
                { label: 'Padrões de atendimento', action: 'settings:routine', primary: true },
                { label: 'Expediente e feriados', action: 'modal:agenda-settings' },
                { label: 'Convênios', action: 'modal:coverage' }
            ]
        },
        {
            id: 'appearance',
            step: 3,
            icon: 'sliders-horizontal',
            time: '1 min',
            title: 'Ajustar leitura, cor de destaque e Assistente',
            summary: 'Deixe o ambiente confortável para longas jornadas de leitura e revise os modelos discretos de lembrete.',
            items: [
                'Escolha tema claro ou escuro, uma das 10 cores de destaque e o tamanho da fonte entre 90% e 130%.',
                'Em Aparência e identidade, adicione o logo (até 2 MB). Em Assistente e mensagens, revise assinatura e textos administrativos para WhatsApp.'
            ],
            actions: [
                { label: 'Tema, cor e fonte', action: 'settings:appearance', primary: true },
                { label: 'Assistente e mensagens', action: 'settings:assistant' }
            ]
        },
        {
            id: 'cycle',
            step: 4,
            icon: 'workflow',
            time: '2 min',
            title: 'Praticar o ciclo Paciente, Agenda e Registrar atendimento',
            summary: 'Compreenda a regra central que evita cobranças duplicadas ou horários abertos esquecidos.',
            items: [
                'Cadastre o paciente primeiro e reserve o horário na Agenda; agendar ou confirmar presença ainda não lança receita.',
                'Após a consulta, clique em Registrar atendimento para anotar a evolução e escolher entre sessão avulsa, consumo de pacote ou sem cobrança.'
            ],
            actions: [
                { label: 'Ir para Pacientes', action: 'view:patients', primary: true },
                { label: 'Abrir Agenda', action: 'view:schedule' }
            ]
        },
        {
            id: 'backup',
            step: 5,
            icon: 'hard-drive-download',
            time: '1 min',
            title: 'Guardar o primeiro Backup Protegido fora deste dispositivo',
            summary: 'Seus registros ficam criptografados somente neste navegador; a cópia externa protegida garante recuperação total.',
            items: [
                'Baixe o arquivo .json protegido e salve em nuvem pessoal, pendrive ou outro computador de confiança.',
                'Guarde a Senha dos Registros em local seguro: ela é exigida para abrir o sistema e restaurar seus backups.'
            ],
            actions: [
                { label: 'Baixar backup protegido', action: 'fn:backup', primary: true },
                { label: 'Segurança e backup', action: 'settings:security' }
            ]
        }
    ];

    const flows = [
        {
            id: 'flow-single',
            icon: 'calendar-check',
            tag: 'Rotina diária',
            title: 'Atendimento avulso, reembolso ou convênio',
            subtitle: 'Do cadastro do paciente e escolha da origem até o recebimento efetivo no caixa realizado.',
            keywords: ['particular', 'convenio', 'reembolso', 'plano de saude', 'avulsa', 'receber', 'pix', 'consulta'],
            steps: [
                { title: 'Cadastrar paciente e origem', detail: 'Em Pacientes, registre os dados básicos e defina a preferência de origem: Particular, Particular com reembolso ou Convênio.' },
                { title: 'Agendar horário', detail: 'Crie a marcação na Agenda. A cor identifica a origem e o texto informa a situação; agendar apenas reserva a vaga.' },
                { title: 'Registrar atendimento', detail: 'Ao concluir o encontro, acione Registrar atendimento, escreva o prontuário e confirme com cobrança Avulsa.' },
                { title: 'Dar baixa no Financeiro', detail: 'Quando o valor cair na conta ou for pago fora do sistema, confirme o recebimento em Financeiro para compor o saldo realizado.' }
            ],
            actions: [
                { label: 'Abrir Agenda', action: 'view:schedule', primary: true },
                { label: 'Convênios', action: 'modal:coverage' },
                { label: 'Abrir Financeiro', action: 'view:financial' }
            ]
        },
        {
            id: 'flow-package',
            icon: 'package-check',
            tag: 'Recorrência',
            title: 'Venda e consumo de pacotes de sessões',
            subtitle: 'Como vender um pacote uma única vez e abater cada sessão realizada sem duplicar receitas.',
            keywords: ['pacote', 'mensalidade', 'lote', 'saldo', 'validade', 'consumo', 'serie semanal'],
            steps: [
                { title: 'Registrar venda do pacote', detail: 'Em Pacotes, escolha o paciente, a quantidade de sessões, o valor total e a validade. Isso cria uma única cobrança vinculada.' },
                { title: 'Marcar horários na Agenda', detail: 'Agende as datas combinadas (individualmente ou com repetição semanal quando todas as datas estiverem livres).' },
                { title: 'Concluir com modo Pacote', detail: 'Ao registrar cada atendimento, escolha a cobrança Pacote e selecione o pacote ativo. Uma sessão é abatida sem gerar nova receita.' },
                { title: 'Conferir saldo e vigência', detail: 'Acompanhe em Pacotes as abas Resumo, Consumos e Cobranças. Se precisar prorrogar o prazo, use Revisar pacote com justificativa.' }
            ],
            actions: [
                { label: 'Abrir Pacotes', action: 'view:packages', primary: true },
                { label: 'Guia completo de Pacotes', action: 'topic:packages' }
            ]
        },
        {
            id: 'flow-clinical',
            icon: 'clipboard-list',
            tag: 'Prontuário e ética',
            title: 'Acompanhamento clínico, escalas e documentos seguros',
            subtitle: 'Uso combinado de rascunhos, planos terapêuticos, escalas padronizadas e impressões sem notas internas.',
            keywords: ['prontuario', 'evolucao', 'rascunho', 'phq-9', 'gad-7', 'plano terapeutico', 'orientacao', 'encaminhamento', 'imprimir'],
            steps: [
                { title: 'Usar rascunhos sem pressa', detail: 'Salvar rascunho em Sessões, Avaliações ou Orientações protege o texto no cofre sem concluir o horário nem gerar cobrança.' },
                { title: 'Vincular sessões ao Plano', detail: 'Em Planos terapêuticos, defina a síntese, os objetivos e a revisão. Na sessão, selecione o plano e os objetivos trabalhados; o vínculo é salvo ao confirmar o encontro.' },
                { title: 'Aplicar PHQ-9, GAD-7 ou livre', detail: 'Confirme questionários completos para manter comparativos fiéis entre aplicações; observações e respostas têm revisões auditáveis.' },
                { title: 'Imprimir cópia limpa', detail: 'Em Orientações e encaminhamentos, confira a prévia: notas internas, contatos de destino e histórico ficam fora da impressão.' }
            ],
            actions: [
                { label: 'Abrir Sessões', action: 'view:sessions', primary: true },
                { label: 'Abrir Avaliações', action: 'view:assessments' },
                { label: 'Abrir Orientações', action: 'view:prescriptions' }
            ]
        },
        {
            id: 'flow-security',
            icon: 'shield-check',
            tag: 'Proteção de dados',
            title: 'Segurança diária, uso offline e troca de computador',
            subtitle: 'Rotina recomendada para proteger o sigilo no consultório e manter cópias recuperáveis fora do aparelho.',
            keywords: ['seguranca', 'offline', 'pwa', 'outro computador', 'formatar', 'celular', 'restaurar', 'bloqueio', 'senha'],
            steps: [
                { title: 'Instalar aplicativo local', detail: 'Após abrir conectado uma vez, use a opção de instalação do navegador para abrir em janela própria mesmo sem internet.' },
                { title: 'Bloquear ao sair da mesa', detail: 'Acione Bloquear no cabeçalho ao se ausentar e mantenha o bloqueio automático por inatividade ajustado entre 5 e 60 minutos.' },
                { title: 'Baixar backup externo', detail: 'Ao fim dos atendimentos, gere o backup protegido (.json) e guarde fora do navegador; limpar dados do navegador apaga a base local.' },
                { title: 'Restaurar em outro aparelho', detail: 'No novo dispositivo, ative a licença, acesse Segurança e backup, selecione o arquivo .json e informe a senha daquele arquivo.' }
            ],
            actions: [
                { label: 'Segurança e backup', action: 'settings:security', primary: true },
                { label: 'Baixar backup agora', action: 'fn:backup' }
            ]
        }
    ];

    const topics = [
        {id:'documents',title:'Central de documentos',group:'Rotina',view:'documents',icon:'files',readTime:'3 min',summary:'Preparar documentos por paciente, preservar versões e acompanhar assinatura e entrega.',keywords:['declaracao','documento','termo','contrato','assinatura','pdf','anexo','protocolo'],steps:['Em Documentos, selecione Novo documento ou use Gerar documento na ficha do paciente. Informe modalidade, finalidade, solicitante e destinatário.','Revise o conteúdo e os fatos. Salve rascunho para completar depois; Concluir versão preserva uma cópia da identificação e conteúdo usados.','Use Imprimir / salvar PDF e escolha Salvar como PDF no navegador. Confira todas as páginas. Assine externamente ou em papel e registre a informação na versão correta.','Anexe o PDF original assinado (até 5 MB). Arquivo anexado não significa assinatura verificada; registre autor, serviço, data e resultado da conferência externa quando realizada.','Registre envio e recebimento separadamente. Para corrigir conteúdo concluído, crie nova versão com motivo; cancelar conserva o histórico.','Baixe e confira backup protegido com os anexos. Exercite a restauração em outro navegador. Não limpe os dados do site sem uma cópia externa conferida.'],rules:['Declarações utilizam somente fatos de comparecimento/acompanhamento. Não inclua sintomas ou diagnóstico.','Orientações e encaminhamentos usam uma cópia do registro confirmado, sem notas internas. Emitir não cria atendimento ou cobrança.','Limites: 12 anexos por documento, 5 MB por PDF, 70 MB de anexos por backup e 100 MB por arquivo de backup. A senha do cofre protege também as chaves dos arquivos.','Comprovantes Receita Saúde são anexados após emissão no canal oficial. A central não emite documento fiscal.'],caution:'Primeira etapa para validação local. Termos e contratos precisam de redação individual e revisão jurídica. Laudo, atestado, relatório e parecer aguardam revisão específica. O software não homologa conteúdo, habilitação ou validade jurídica.',actions:[{label:'Abrir Documentos',action:'view:documents',primary:true}]},
        {
            id: 'install',
            title: 'Primeiro acesso e uso local',
            group: 'Começar',
            view: 'settings',
            icon: 'laptop',
            readTime: '2 min',
            summary: 'Como ativar sua licença vitalícia, criar a senha do cofre local e instalar o aplicativo para trabalhar offline.',
            keywords: ['ativacao', 'chave', 'licenca', 'offline', 'pwa', 'instalar', 'navegador', 'chrome', 'edge', 'celular', 'outro computador', 'perfil', 'aba anonima'],
            steps: [
                'Conectado à internet no primeiro acesso, informe sua Chave de Licença e o e-mail da compra; em seguida, defina a Senha dos Registros (mínimo de 12 caracteres).',
                'Acesse sempre pelo mesmo navegador, perfil e endereço: cada navegador ou aparelho possui seu próprio cofre isolado, sem sincronização em nuvem.',
                'Após o carregamento inicial completo, utilize a opção Instalar aplicativo no menu do navegador para criar o atalho de uso offline.'
            ],
            rules: [
                'Licença e senha têm papéis distintos: a licença libera o software; a senha criptografa e abre seus registros locais.',
                'Instalar o aplicativo na área de trabalho não copia automaticamente dados que estavam em outro navegador; use um backup protegido se mudar de navegador.'
            ],
            caution: 'Guarde a Senha dos Registros em local seguro. Como a criptografia é 100% local para proteger o sigilo clínico, não existe redefinição remota de senha.',
            actions: [
                { label: 'Abrir Configurações', action: 'view:settings', primary: true },
                { label: 'Conferir ambiente local', action: 'view:about' }
            ]
        },
        {
            id: 'patients',
            title: 'Pacientes e ficha central',
            group: 'Rotina',
            view: 'patients',
            icon: 'users',
            readTime: '2 min',
            summary: 'Cadastro completo, preferência de origem do atendimento, linha do tempo unificada e arquivamento sem perda de histórico.',
            keywords: ['cadastro', 'ficha', 'prontuario', 'arquivar', 'reativar', 'contato', 'etapa', 'sinalizacao', 'etiquetas', 'convenio', 'particular', 'reembolso', 'busca rapida'],
            steps: [
                'Clique em Novo Paciente para informar identificação, contato de emergência e a preferência de origem para futuras marcações (Particular, Convênio ou Particular com reembolso).',
                'Use Abrir ficha (ou a busca rápida da Visão Geral) para consultar em um só lugar dados cadastrais, histórico, sessões, planos, avaliações, orientações, pacotes e financeiro.',
                'Registre etapas de acompanhamento, tarefas internas, sinalizações de atenção e contatos administrativos diretamente nos painéis da ficha.'
            ],
            rules: [
                'Etapas, permissões de contato e anotações de retorno são controles internos: registrar um contato na ficha não dispara mensagens externas.',
                'Arquivar um paciente retira o nome das listas ativas preservando todo o histórico clínico e financeiro; reative a ficha antes de criar novos agendamentos.'
            ],
            caution: 'Evite inserir conteúdo clínico sensível em etiquetas administrativas, pois elas aparecem nos filtros e listagens rápidas.',
            actions: [
                { label: 'Abrir Pacientes', action: 'view:patients', primary: true },
                { label: 'Busca na Visão Geral', action: 'view:dashboard' }
            ]
        },
        {
            id: 'agenda',
            title: 'Agenda, feriados e configurações',
            group: 'Rotina',
            view: 'schedule',
            icon: 'calendar',
            readTime: '3 min',
            summary: 'Visualizações por Dia, Semana, Mês e Lista, controle de expediente, bloqueios, repetição semanal e identificação por convênio.',
            keywords: ['horario', 'marcar', 'remarcar', 'falta', 'cancelar', 'feriado', 'bloqueio', 'expediente', 'intervalo', 'privacidade', 'repeticao semanal', 'convenio', 'cores', 'google agenda', 'meet', 'videochamada', 'link'],
            steps: [
                'Alterne entre Dia, Semana, Mês ou Lista. Use Configurar agenda para definir expediente, intervalo mínimo e privacidade; Feriados e datas para cadastrar datas locais; Bloquear período para reservar pausas ou ausências.',
                'Em Configurações > Convênios, cadastre os planos atendidos e personalize as cores de Particular e Particular com reembolso para leitura visual imediata na grade.',
                'Ao encerrar uma consulta agendada, acione Registrar atendimento no próprio compromisso para concluir o encontro e encaminhar a cobrança correta.',
                'Para videochamada, crie uma sala no Google Meet e cole o link no campo opcional da marcação. Depois de salvar, abra ou copie esse endereço pelo compromisso.',
                'Para adicionar ao Google Agenda, abra a marcação, escolha Adicionar ao Google Agenda, confira título, data e horário na prévia e salve o evento na tela do Google. O link do Meet só é incluído se você selecionar essa opção.'
            ],
            rules: [
                'Agendar ou confirmar presença apenas reserva o horário; o tempo passar não transforma agendamento em atendimento concluído nem gera receita.',
                'Na repetição semanal, todas as datas da série são validadas antes de gravar: se houver conflito, feriado bloqueado ou horário fora do expediente restrito, nenhuma ocorrência é criada.',
                'Criar bloqueios, inativar convênios ou mudar expediente vale para novas marcações e preserva compromissos anteriores para sua conferência.',
                'A adição ao Google Agenda é manual, de uma marcação por vez. Não envia nomes, notas clínicas, contatos ou valores por padrão, não confirma a criação do evento e não sincroniza alterações ou cancelamentos. Repetir a adição pode criar duplicatas.',
                'O link do Meet é opcional, fica no cofre e acompanha o backup protegido. Criar uma série semanal usa o mesmo link informado nas ocorrências. O sistema não cria salas, gravações nem convites automáticos. Confira a sala e o destinatário antes de compartilhar.',
                'Nome e cor da origem ficam registrados em cada marcação. Alterar o convênio ou a preferência do paciente não reclassifica atendimentos anteriores; registros antigos sem origem continuam como Não informado.'
            ],
            caution: 'Não há envio automático de mensagens ao salvar horários. Para lembrar pacientes por WhatsApp, utilize o Assistente da rotina sob sua revisão.',
            actions: [
                { label: 'Abrir Agenda', action: 'view:schedule', primary: true },
                { label: 'Expediente e feriados', action: 'modal:agenda-settings' },
                { label: 'Convênios', action: 'modal:coverage' }
            ]
        },
        {
            id: 'sessions',
            title: 'Sessões, contexto e próximos passos',
            group: 'Acompanhamento',
            view: 'sessions',
            icon: 'notebook-pen',
            readTime: '3 min',
            summary: 'Registro seguro de evoluções clínicas, separação entre rascunhos e sessões confirmadas e vínculo exato com a cobrança.',
            keywords: ['evolucao', 'anotacao', 'prontuario', 'rascunho', 'fila', 'cobrar', 'avulsa', 'sem cobranca', 'historico de versoes', 'recuperar'],
            steps: [
                'Inicie o registro a partir do horário na Agenda (recomendado) ou clique em Anotação avulsa quando não houver agendamento prévio.',
                'Use Salvar rascunho sempre que quiser guardar anotações parciais no cofre sem concluir o horário, sem gerar lançamento financeiro e sem abater pacote.',
                'Ao confirmar em definitivo, revise paciente, data, origem do atendimento e forma de cobrança: Avulsa (gera 1 receita), Pacote (consome 1 saldo) ou Sem cobrança.'
            ],
            rules: [
                'Sessões confirmadas, Fila de atendimentos sem texto, Rascunhos e Arquivo ficam organizados em áreas independentes para evitar confusão.',
                'Ao registrar uma sessão, consulte o contexto do último encontro e selecione o plano e os objetivos trabalhados. Salvar rascunho não aplica os vínculos.',
                'Após concluir, confira a situação da cobrança no resumo e use Conferir cobrança para abrir o lançamento correto. Quando há consumo de pacote, o atalho abre as cobranças da venda do pacote, sem criar outra receita. Se houver mais de um vínculo, escolha qual conferir.',
                'Use Agendar próximo encontro para reaproveitar paciente, horário, duração e valor da marcação anterior. A data e os demais dados precisam ser conferidos e salvos; abrir o formulário não cria agendamento. Na Agenda, Retomar rascunho e Conferir anotação levam ao registro já existente.',
                'Próximos passos também permite criar orientação dos combinados, encaminhamento ou avaliação e revisar objetivos. O texto externo é conferido antes de confirmar.',
                'Avaliações e orientações podem indicar encontro e plano de origem. A cópia para impressão mantém somente o conteúdo destinado ao destinatário.',
                'Na avaliação, uma nova aplicação originada de uma reavaliação prevista encerra a pendência ao ser confirmada. Também é possível registrar realização externa, reagendar ou dispensar com histórico.',
                'Editar ou complementar o texto de uma sessão já confirmada registra a versão anterior no histórico e nunca gera cobrança repetida.'
            ],
            caution: 'Se um atendimento foi marcado como concluído na Agenda sem anotação, recupere-o pela Fila de atendimentos em Sessões em vez de criar uma sessão avulsa duplicada.',
            actions: [
                { label: 'Abrir Sessões', action: 'view:sessions', primary: true },
                { label: 'Ir para Agenda', action: 'view:schedule' }
            ]
        },
        {
            id: 'treatments',
            title: 'Planos terapêuticos e objetivos',
            group: 'Acompanhamento',
            view: 'treatments',
            icon: 'target',
            readTime: '2 min',
            summary: 'Estruturação de metas clínicas, frequência planejada, datas de revisão e vínculo intencional das sessões.',
            keywords: ['plano', 'tratamento', 'meta', 'objetivo', 'alta', 'pausa', 'revisao', 'vincular sessao'],
            steps: [
                'Crie um plano escolhendo o paciente, a demanda trabalhada, a frequência sugerida, a meta de encontros e a data prevista para revisão.',
                'Cadastre objetivos específicos e atualize manualmente a situação de cada um conforme sua avaliação profissional ao longo do processo.',
                'Na sessão, selecione o plano e os objetivos trabalhados. Para revisar vínculos anteriores, use Gerenciar vínculos no plano.'
            ],
            rules: [
                'Frequência e meta de sessões são referências de planejamento clínico: não criam agendamentos na grade nem pacotes financeiros.',
                'Percentuais e contagens refletem apenas marcações feitas pelo profissional e não representam cálculo automático de melhora clínica.'
            ],
            caution: 'Ao pausar ou encerrar um ciclo, atualize a situação do plano. Arquivar apenas o retira das listas principais e preserva seu histórico.',
            actions: [
                { label: 'Abrir Planos terapêuticos', action: 'view:treatments', primary: true }
            ]
        },
        {
            id: 'assessments',
            title: 'Avaliações e registros livres',
            group: 'Acompanhamento',
            view: 'assessments',
            icon: 'clipboard-check',
            readTime: '2 min',
            summary: 'Aplicação de escalas estruturadas (PHQ-9 e GAD-7) ou avaliação livre, com rascunho parcial e trilha auditável de correções.',
            keywords: ['escala', 'questionario', 'phq-9', 'phq9', 'gad-7', 'gad7', 'anamnese', 'teste', 'escore', 'pontuacao', 'reavaliacao'],
            steps: [
                'Escolha entre os instrumentos estruturados disponíveis (PHQ-9, GAD-7) ou Registro livre para documentar anamneses, testes externos e pareceres.',
                'Se a aplicação for interrompida, salve como rascunho; para confirmar um questionário estruturado, responda todos os itens obrigatórios.',
                'Defina uma data de reavaliação prevista quando quiser ser lembrado pelo Assistente da rotina de reaplicar o instrumento.'
            ],
            rules: [
                'A pontuação calculada é um apoio de rastreio e acompanhamento longitudinal, nunca um diagnóstico clínico automático.',
                'Comparações entre aplicações consideram apenas registros completos da mesma versão do instrumento e do mesmo paciente.',
                'Revisar observações mantém as respostas intactas; corrigir respostas já confirmadas exige a ação própria do registro e preserva a versão anterior em Histórico.'
            ],
            caution: 'Definir data de reavaliação organiza suas pendências internas, mas não cria horário na Agenda nem avisa o paciente.',
            actions: [
                { label: 'Abrir Avaliações', action: 'view:assessments', primary: true }
            ]
        },
        {
            id: 'prescriptions',
            title: 'Orientações e encaminhamentos',
            group: 'Acompanhamento',
            view: 'prescriptions',
            icon: 'file-text',
            readTime: '2 min',
            summary: 'Elaboração de documentos para pacientes ou outros profissionais, separando o texto impresso das anotações internas.',
            keywords: ['orientacao', 'encaminhamento', 'declaracao', 'documento', 'impressao', 'pdf', 'destinatario', 'notas internas', 'retorno'],
            steps: [
                'Preencha finalidade, destinatário, serviço de destino, prazo de retorno e o conteúdo que será entregue ao paciente ou profissional externo.',
                'Use o campo Notas internas para observações exclusivas do seu controle: elas ficam protegidas na base e nunca saem na folha impressa.',
                'Após confirmar o documento, confira a prévia de impressão para imprimir ou salvar em PDF, e atualize manualmente a situação após entregar ou receber retorno.'
            ],
            rules: [
                'Confirmar ou mudar a situação do acompanhamento registra apenas o seu controle interno; o sistema não envia documentos por e-mail ou mensagem.',
                'A versão impressa omite automaticamente notas internas, telefone/contato do destino, movimentações de entrega e versões anteriores.'
            ],
            caution: 'Sempre revise a janela de prévia antes de imprimir ou gerar PDF para confirmar os dados visíveis ao destinatário.',
            actions: [
                { label: 'Abrir Orientações', action: 'view:prescriptions', primary: true }
            ]
        },
        {
            id: 'financial',
            title: 'Financeiro e devoluções',
            group: 'Gestão',
            view: 'financial',
            icon: 'wallet',
            readTime: '3 min',
            summary: 'Controle transparente de caixa realizado, contas a receber/pagar, filtro por origem do atendimento, cancelamentos e devoluções.',
            keywords: ['caixa', 'receita', 'despesa', 'pagamento', 'recebimento', 'pix', 'cartao', 'dinheiro', 'estorno', 'devolucao', 'devolucoes', 'devolver', 'vencido', 'inadimplencia', 'extrato'],
            steps: [
                'Acompanhe separadamente Entradas recebidas, Saídas pagas, Saldo realizado, A receber e A pagar, filtrando por período, paciente, origem (Particular/Convênio/Reembolso) e base de data.',
                'Quando um pagamento ocorrer fora do sistema, localize a pendência e registre o recebimento ou pagamento informando a data efetiva.',
                'Para anular uma pendência aberta, abra Conferir e use Cancelar cobrança com motivo; para restituir um valor já recebido ou pago, use Registrar devolução integral informando data e justificativa.'
            ],
            rules: [
                'Valores pendentes nunca entram no Saldo realizado até que a baixa seja registrada.',
                'A devolução integral mantém o lançamento original intacto para auditoria e cria automaticamente um lançamento compensatório de sentido oposto.',
                'O módulo é um controle administrativo local: não movimenta contas bancárias, não faz conciliação automática e não emite nota fiscal.'
            ],
            caution: 'Devoluções parciais ou renegociações de pacotes que já tiveram sessões utilizadas exigem lançamento de ajuste manual após conferência.',
            actions: [
                { label: 'Abrir Financeiro', action: 'view:financial', primary: true }, { label: 'Configurar recorrências', action: 'settings:financial' },
                { label: 'Despesas recorrentes', action: 'topic:recurring' }
            ]
        },
        {
            id: 'packages',
            title: 'Pacotes, validade e consumo',
            group: 'Gestão',
            view: 'packages',
            icon: 'package',
            readTime: '3 min',
            summary: 'Gestão completa de pacotes de sessões, vínculo com cobrança única, controle de vigência e histórico de consumos.',
            keywords: ['pacote', 'plano mensal', 'credito', 'sessoes disponiveis', 'saldo', 'vencimento', 'prorrogar', 'validade', 'consumir'],
            steps: [
                'Em Pacotes, clique em Novo pacote para definir paciente, nome do pacote, total de sessões, valor e data de validade (marcando se já foi pago ou se ficará pendente).',
                'Ao concluir cada atendimento desse paciente em Sessões, selecione a modalidade Pacote e escolha o pacote listado para abater 1 unidade sem criar nova receita.',
                'Abra os detalhes do pacote para auditar Resumo, Consumos vinculados, Cobranças e Histórico, ou use Revisar pacote para ajustar nome ou validade com justificativa.'
            ],
            rules: [
                'Para aparecer disponível ao confirmar uma sessão, o pacote precisa pertencer ao paciente, possuir saldo positivo e estar vigente na data daquele atendimento.',
                'Um pacote vencido preserva o registro do saldo remanescente para consulta, mas bloqueia novos consumos até que sua validade seja revisada.',
                'Revisar nome ou validade mantém intactos quantidade contratada, valor original e sessões já consumidas.'
            ],
            caution: 'Pacotes que já possuem sessões consumidas não são cancelados automaticamente pelo Financeiro; confira consumos e acertos financeiros antes de encerrar.',
            actions: [
                { label: 'Abrir Pacotes', action: 'view:packages', primary: true },
                { label: 'Abrir Financeiro', action: 'view:financial' }
            ]
        },
        {
            id: 'reports',
            title: 'Relatórios, impressão e CSV',
            group: 'Gestão',
            view: 'reports',
            icon: 'bar-chart-3',
            readTime: '2 min',
            summary: 'Indicadores operacionais e financeiros com prévia fiel para impressão e exportação em planilha sem expor conteúdo clínico.',
            keywords: ['relatorio', 'planilha', 'excel', 'csv', 'exportar', 'comparecimento', 'faltas', 'estatisticas', 'fechamento mensal', 'contabilidade'],
            steps: [
                'Selecione o tipo de relatório, o intervalo de datas, o paciente (ou todos) e se deseja considerar cadastros arquivados.',
                'Analise os indicadores no topo e a tabela de prévia exatamente como serão impressos ou exportados.',
                'Utilize Imprimir ou Exportar CSV após revisar os filtros aplicados.',
                'No tipo Atendimentos e recebimentos por origem, confira marcações, recebido bruto, valores devolvidos, recebido líquido e pendências por particular, convênio ou reembolso.'
            ],
            rules: [
                'Por proteção de sigilo, tanto a impressão quanto o arquivo CSV exportam somente dados administrativos exibidos na tela, sem incluir evoluções clínicas nem respostas de escalas.',
                'A taxa de comparecimento divide atendimentos concluídos pela soma de concluídos mais faltas; desmarcações/cancelamentos e horários futuros abertos não distorcem o cálculo.',
                'Relatórios de pacotes retratam a posição atual de saldo, sem reconstruir retroativamente o saldo que existia em uma data passada.'
            ],
            caution: 'Ao abrir arquivos CSV em editores de planilha em computadores compartilhados, lembre-se de apagar o arquivo exportado após o uso.',
            actions: [
                { label: 'Abrir Relatórios', action: 'view:reports', primary: true }
            ]
        },
        {
            id: 'backup',
            title: 'Senha, backup e recuperação',
            group: 'Sistema',
            view: 'settings',
            icon: 'key-round',
            readTime: '3 min',
            summary: 'Rotina de cópia criptografada externa, restauração com prévia segura, cópia anterior do navegador e troca de senha.',
            keywords: ['backup', 'restaurar', 'recuperar', 'copia', 'senha', 'trocar senha', 'esqueci a senha', 'limpar navegador', 'formatar', 'migrar', 'json', 'criptografia'],
            steps: [
                'Acesse Configurações, aba Segurança e backup, clique em Baixar backup protegido e confirme que o arquivo .json foi salvo fora deste dispositivo.',
                'Após baixar, use Conferir backup sem restaurar para validar o arquivo e a senha sem alterar a base. Para restaurar, escolha o arquivo na restauração, confira a comparação dos registros e digite RESTAURAR. As configurações também serão substituídas; a senha atual do navegador permanece.',
                'Se precisar alterar a senha atual ou ajustar o tempo de bloqueio por inatividade (5, 15, 30 ou 60 minutos), utilize o painel Bloqueio dos registros na mesma aba.'
            ],
            rules: [
                'Antes de qualquer restauração ou limpeza de manutenção, o sistema guarda automaticamente uma Cópia anterior neste navegador para segurança adicional.',
                'Trocar a senha regrava apenas a base atual: backups antigos e a cópia anterior continuam exigindo a senha que estava ativa quando foram gerados.',
                'O download solicitado e a conferência são registrados separadamente. O lembrete só é atualizado por um arquivo protegido que corresponda à base salva. Arquivos antigos ou diferentes não atualizam esse prazo.'
            ],
            caution: 'Limpar o histórico/dados de sites do navegador, desinstalar o navegador ou formatar o computador apaga a base local e a cópia anterior. Tenha sempre backup externo. Se a base não abrir, use Recuperar usando outro backup na tela da senha. É necessário conhecer a senha desse backup; a senha esquecida não pode ser recuperada. A recuperação exige prévia, confirmação e uma nova senha para a base.',
            actions: [
                { label: 'Segurança e backup', action: 'settings:security', primary: true },
                { label: 'Baixar backup protegido', action: 'fn:backup' },
                { label: 'Alterar senha', action: 'modal:password' }
            ]
        },
        {
            id: 'assistant',
            title: 'Visão geral, indicadores e Assistente',
            group: 'Rotina',
            view: 'dashboard',
            icon: 'bell-ring',
            readTime: '2 min',
            summary: 'Painel inteligente de pendências do dia e preparação assistida de mensagens discretas para WhatsApp sob revisão humana.',
            keywords: ['visao estrategica', 'indicadores', 'projecoes', 'graficos', 'assistente', 'lembrete', 'whatsapp', 'mensagem', 'confirmar consulta', 'pendencias', 'cobranca pendente', 'revisao'],
            steps: [
                'Na Visão Geral, a aba Operacional reúne o dia a dia. A aba Estratégica oferece indicadores, tabelas acessíveis e gráficos por período, com atalhos para Financeiro, Relatórios e pacientes sem retorno.',
                'As projeções distinguem caixa recebido de recebíveis esperados, usam ao menos 5 atendimentos recentes e não somam saldo de pacotes como receita nova. São cenários, sem garantia de recebimento.',
                'Na Visão Geral, clique em Pendências e lembretes nas ações rápidas para ver horários a confirmar, atendimentos sem registro, reavaliações, revisões de plano e contas vencendo.',
                'Ao preparar um aviso, confira o telefone, a permissão de contato cadastrada na ficha e revise o texto sugerido antes de copiar ou abrir o WhatsApp.',
                'Somente depois de enviar a mensagem fora do sistema, clique em Registrar envio realizado para atualizar seu histórico administrativo.'
            ],
            rules: [
                'Todos os lembretes são calculados localmente enquanto o aplicativo está aberto; não há robôs em segundo plano disparando mensagens sozinhos.',
                'Clicar em Registrar envio realizado documenta sua tentativa de contato, mas não muda o status do agendamento para confirmado nem dá baixa em pagamentos.'
            ],
            caution: 'Personalize os modelos em Configurações > Assistente e mensagens mantendo tom estritamente administrativo, sem expor temas clínicos nas mensagens.',
            actions: [
                { label: 'Ver pendências agora', action: 'modal:assistant', primary: true },
                { label: 'Modelos do Assistente', action: 'settings:assistant' }
            ]
        },
        {
            id: 'identity',
            title: 'Configurações e identidade do consultório',
            group: 'Sistema',
            view: 'settings',
            icon: 'palette',
            readTime: '2 min',
            summary: 'Personalização de logo, assinatura das comunicações, 10 paletas de bem-estar, tema claro/escuro e escala tipográfica.',
            keywords: ['logo', 'logotipo', 'imagem', 'cor', 'paleta', 'tema escuro', 'tema claro', 'fonte', 'tamanho da letra', 'zoom', 'assinatura', 'aparencia'],
            steps: [
                'Use os botões horizontais acima do conteúdo de Configurações para acessar Consultório, Atendimento, Agenda e disponibilidade, Convênios, Financeiro, Aparência e identidade, Assistente e mensagens, Segurança e backup e Manutenção.',
                'O botão de tema na barra superior alterna diretamente entre claro e escuro, sem sair da tela atual. Em Aparência e identidade, escolha também cor, logo e leitura entre 90% e 130%. Use Salvar logo para confirmar uma imagem ou sua remoção.',
                'Em Assistente e mensagens, salve assinatura, modelos e prazos dos avisos. Atendimento concentra duração e valor padrão; os atalhos da Agenda e do Financeiro levam aos mesmos editores de Configurações.'
            ],
            rules: [
                'Logo, assinatura e cor de destaque ficam guardados dentro do cofre e viajam junto com seus backups protegidos.',
                'Tema claro/escuro e escala da fonte (90% a 130%) são preferências visuais específicas de cada tela/navegador e não alteram nenhum dado clínico.',
                'Quando a assinatura própria estiver em branco, o sistema utiliza automaticamente o nome do consultório salvo na aba Consultório.'
            ],
            caution: 'As cores semânticas de alerta, sucesso e atenção permanecem padronizadas em todas as paletas para garantir legibilidade e contraste seguro.',
            actions: [
                { label: 'Assistente e mensagens', action: 'settings:assistant', primary: true },
                { label: 'Aparência e tamanho de fonte', action: 'settings:appearance' }
            ]
        },
        {
            id: 'recurring',
            title: 'Despesas mensais recorrentes',
            group: 'Gestão',
            view: 'financial',
            icon: 'repeat',
            readTime: '2 min',
            summary: 'Cadastro de custos fixos do consultório (aluguel, supervisão, contabilidade, sistemas) com geração mensal controlada.',
            keywords: ['despesa fixa', 'recorrente', 'aluguel', 'condominio', 'internet', 'supervisao', 'contas a pagar', 'mensal'],
            steps: [
                'Em Configurações > Financeiro, cadastre descrição, valor previsto, dia de vencimento e vigência da regra. O atalho Configurar recorrências leva ao mesmo editor.',
                'No módulo Financeiro, abra Despesas do mês, selecione a competência, confira a prévia e confirme a geração das pendências. Cadastrar ou pausar uma regra não paga nem gera despesas sozinho.',
                'Quando pagar efetivamente cada conta fora do sistema, registre a baixa em Financeiro para atualizar as saídas realizadas.'
            ],
            rules: [
                'Abrir o sistema em um novo mês não cria despesas sozinho: você sempre revisa e autoriza a geração do mês.',
                'Vencimentos em dias inexistentes em meses curtos (como dia 31) são ajustados automaticamente para o último dia do mês, inclusive quando cair em fim de semana.',
                'Gerar novamente o mesmo mês ignora itens já lançados (inclusive cancelados), impedindo duplicidade; pausar a regra preserva todo o passado.'
            ],
            caution: 'A recorrência organiza previsões de contas a pagar e não agenda débitos bancários automáticos.',
            actions: [
                { label: 'Abrir Financeiro', action: 'view:financial', primary: true }
            ]
        },
        {
            id: 'emergency',
            title: 'Contatos de referência e intercorrências',
            group: 'Rotina',
            view: 'emergency',
            icon: 'alert-triangle',
            readTime: '2 min',
            summary: 'Documentação estruturada de episódios críticos, condutas adotadas e consulta rápida aos contatos de apoio cadastrados.',
            keywords: ['emergencia', 'intercorrencia', 'crise', 'risco', 'hospital', 'apoio', 'encaminhamento urgente', 'conduta'],
            steps: [
                'Mantenha o contato e o hospital/serviço de referência atualizados em Configurações > Consultório, e o contato de emergência individual na ficha de cada paciente.',
                'No módulo Emergência, registre data/hora, paciente, classificação do episódio, nível de risco avaliado, intervenção realizada e encaminhamentos.',
                'Consulte os registros recentes para acompanhamento próximo nas sessões subsequentes.'
            ],
            rules: [
                'Os telefones e serviços exibidos são referências anotadas pelo próprio profissional, sem validação cadastral externa.',
                'Gravar uma intercorrência documenta o prontuário local: o software não monitora pacientes em tempo real nem aciona equipes de socorro.'
            ],
            caution: 'Em qualquer situação aguda, priorize imediatamente os protocolos éticos e serviços presenciais de urgência da sua localidade antes do registro documental.',
            actions: [
                { label: 'Abrir Emergência', action: 'view:emergency', primary: true },
                { label: 'Contatos do consultório', action: 'settings:clinic' }
            ]
        }
    ];

    topics.push({
        id:'support',title:'Suporte e chamados técnicos',group:'Sistema',view:'support',icon:'life-buoy',readTime:'3 min',
        summary:'Como abrir um chamado, acompanhar respostas e conferir um envio pendente sem compartilhar prontuários.',
        keywords:['suporte','chamado','resposta','erro tecnico','envio pendente','conexao'],
        steps:[
            'Com a licença ativa neste dispositivo e o cofre aberto, acesse Suporte. Abra um novo chamado, escolha a categoria e revise assunto e mensagem antes de enviar.',
            'Envie apenas dúvidas sobre o aplicativo. Nunca informe nomes, relatos ou dados de pacientes, senhas, backups clínicos ou chaves de licença no texto.',
            'Uma operação enviada sem confirmação fica pendente nesta aba. Ao reconectar, o aplicativo tenta a mesma operação. Tentar envios pendentes também reutiliza o identificador, sem criar outra solicitação.',
            'Fechar, recarregar ou bloquear descarta os textos e a fila local. Antes de criar novamente após reabrir, atualize a lista para conferir se o servidor já recebeu o chamado.',
            'O indicador no menu avisa sobre respostas; abra o chamado para ler e responder. Encerrar preserva o histórico. Um chamado resolvido pode receber retorno; um encerrado exige novo chamado.'
        ],
        rules:['A versão, tema e identificação geral do navegador acompanham o chamado. Não há coleta automática do prontuário ou anexos.','Os textos do suporte não são incluídos no backup do cofre e não ficam gravados em localStorage. Os chamados enviados ficam no servidor de atendimento.','Não há prazo de SLA definido nem exclusão automática. O arquivamento administrativo preserva o histórico.'],
        caution:'O suporte técnico não atende emergências clínicas. Se não conseguir abrir o cofre ou ativar a licença, utilize o canal da compra; não envie senha ou prontuário.',
        actions:[{label:'Abrir Suporte',action:'view:support',primary:true},{label:'Conferir ambiente',action:'view:about'}]
    });
    const troubleshooting = [
        {
            id: 'empty-device',
            category: 'Acesso e dispositivos',
            question: 'Abri em outro computador, celular, navegador ou aba anônima e meus registros estão vazios.',
            cause: 'Por privacidade, o cofre criptografado fica gravado exclusivamente no armazenamento local do navegador e perfil onde foi criado, sem nuvem intermediária.',
            solution: [
                'No computador ou navegador onde seus registros estão salvos, acesse Configurações > Segurança e backup e clique em Baixar backup protegido (.json).',
                'No novo dispositivo ou navegador, ative sua licença, abra Configurações > Segurança e backup, selecione o arquivo .json em Escolher backup e informe a senha daquele arquivo.'
            ],
            keywords: ['sumiu', 'vazio', 'outro pc', 'outro computador', 'notebook', 'celular', 'troquei', 'navegador', 'anonima', 'sincronizar', 'transferir'],
            actions: [
                { label: 'Segurança e backup', action: 'settings:security', primary: true },
                { label: 'Baixar backup agora', action: 'fn:backup' }
            ]
        },
        {
            id: 'password-vs-license',
            category: 'Acesso e dispositivos',
            question: 'Qual a diferença entre Chave de Licença e Senha dos Registros? E por que um backup antigo pediu a senha antiga?',
            cause: 'A Chave de Licença confirma sua compra vitalícia; já a Senha dos Registros é a chave criptográfica (AES-GCM) da sua base clínica. Quando você troca a senha, os arquivos .json já baixados no passado permanecem trancados com a senha que tinham quando foram criados.',
            solution: [
                'Use a Chave de Licença apenas na tela inicial de ativação de um navegador novo; no dia a dia, use a Senha dos Registros para destravar o cofre.',
                'Sempre que alterar sua senha em Segurança e backup, gere imediatamente um novo backup protegido e identifique o arquivo atualizado.',
                'Se esqueceu a senha atual, preserve a base e procure um backup protegido cuja senha você conheça. A licença e o suporte não substituem a senha para descriptografar os registros. Restaurar uma cópia anterior não recupera alterações feitas depois dela.'
            ],
            keywords: ['licenca', 'chave', 'senha incorreta', 'esqueci', 'troquei a senha', 'backup antigo', 'diferenca'],
            actions: [
                { label: 'Segurança e senha', action: 'settings:security', primary: true },
                { label: 'Conferir licença local', action: 'view:about' }
            ]
        },
        {
            id: 'past-appointment',
            category: 'Agenda e cobrança',
            question: 'O horário da consulta já passou na Agenda, mas não entrou como atendido nem gerou valor no Financeiro.',
            cause: 'O relógio avançar não conclui atendimentos automaticamente, pois o paciente pode ter faltado, reagendado ou utilizado saldo de pacote.',
            solution: [
                'Abra a Agenda (ou o bloco de atendimentos pendentes na Visão Geral) e localize o horário realizado.',
                'Clique em Registrar atendimento para confirmar o encontro e escolher a forma de cobrança (Avulsa, Pacote ou Sem cobrança), ou altere a situação para Falta / Cancelado.'
            ],
            keywords: ['nao cobrou', 'nao entrou no financeiro', 'horario passou', 'concluir consulta', 'confirmar presenca', 'agenda'],
            actions: [
                { label: 'Abrir Agenda', action: 'view:schedule', primary: true },
                { label: 'Ir para Visão Geral', action: 'view:dashboard' }
            ]
        },
        {
            id: 'missing-note-or-draft',
            category: 'Agenda e cobrança',
            question: 'Concluí o atendimento sem anotação ou salvei apenas como rascunho. Como finalizar sem cobrar duas vezes?',
            cause: 'Salvar rascunho guarda o texto sem concluir horário nem cobrar; já concluir horário sem texto envia o encontro para a fila pendente de evolução mantendo a cobrança já definida.',
            solution: [
                'Acesse o módulo Sessões e alterne entre as áreas Fila de atendimentos e Rascunhos.',
                'Abra o item existente para complementar e confirmar o texto: o sistema preserva o vínculo financeiro original sem duplicar cobrança nem consumir outra sessão do pacote.'
            ],
            keywords: ['rascunho', 'cobrar duas vezes', 'duplicar', 'sem anotacao', 'fila de atendimentos', 'evolucao pendente'],
            actions: [
                { label: 'Abrir Sessões', action: 'view:sessions', primary: true },
                { label: 'Guia de Sessões', action: 'topic:sessions' }
            ]
        },
        {
            id: 'package-not-listed',
            category: 'Pacotes e caixa',
            question: 'Vendi um pacote para o paciente, mas ele não aparece disponível na hora de registrar a sessão.',
            cause: 'Apenas pacotes do mesmo paciente, com sessões restantes e cuja janela de validade cubra a data informada para o atendimento são habilitados para consumo.',
            solution: [
                'Confira no formulário da sessão se o paciente selecionado e a data do atendimento estão corretos.',
                'Abra Pacotes, verifique se ainda há saldo disponível e confira a data de vencimento; se o prazo expirou, clique em Revisar pacote para estender a validade informando o motivo.'
            ],
            keywords: ['pacote sumiu', 'pacote nao aparece', 'vencido', 'validade', 'consumir pacote', 'saldo'],
            actions: [
                { label: 'Conferir Pacotes', action: 'view:packages', primary: true },
                { label: 'Abrir Sessões', action: 'view:sessions' }
            ]
        },
        {
            id: 'refund-or-cancel',
            category: 'Pacotes e caixa',
            question: 'Como cancelar uma cobrança aberta, registrar estorno de valor recebido ou corrigir lançamento no Financeiro?',
            cause: 'Para preservar a integridade do caixa, movimentações financeiras usam ações rastreáveis em vez de exclusão silenciosa.',
            solution: [
                'Se o lançamento ainda está Pendente (A receber / A pagar), acione Cancelar e registre o motivo.',
                'Se o valor já foi Recebido ou Pago, utilize a ação de devolução integral informando data e motivo para gerar o lançamento compensatório; para acordos parciais, registre um ajuste manual identificado.'
            ],
            keywords: ['estorno', 'estornar', 'devolucao', 'devolucoes', 'devolver', 'reembolsar', 'cancelar cobranca', 'erro no valor', 'apagar lancamento'],
            actions: [
                { label: 'Abrir Financeiro', action: 'view:financial', primary: true },
                { label: 'Guia do Financeiro', action: 'topic:financial' }
            ]
        },
        {
            id: 'edit-assessment-or-session',
            category: 'Prontuário e escalas',
            question: 'Preciso corrigir respostas já confirmadas de um questionário (PHQ-9 / GAD-7) ou revisar uma anotação clínica.',
            cause: 'Registros clínicos confirmados protegem a pontuação original para evitar alterações acidentais na evolução histórica do paciente.',
            solution: [
                'Em Avaliações, abra o registro: para complementar apenas comentários, edite as observações; para alterar itens marcados por engano, use a ação específica de correção de respostas.',
                'Tanto em Avaliações quanto em Sessões, a revisão mantém a versão anterior consultável na aba Histórico.'
            ],
            keywords: ['corrigir phq', 'corrigir gad', 'editar avaliacao', 'editar sessao', 'resposta errada', 'historico', 'versao'],
            actions: [
                { label: 'Abrir Avaliações', action: 'view:assessments', primary: true },
                { label: 'Abrir Sessões', action: 'view:sessions' }
            ]
        },
        {
            id: 'weekly-series-blocked',
            category: 'Agenda e cobrança',
            question: 'Tentei criar agendamentos com repetição semanal e nenhuma data da série foi gravada.',
            cause: 'A repetição semanal funciona em lote único: se qualquer uma das semanas encontrar choque de horário, feriado bloqueado, período bloqueado ou faixa fora do expediente obrigatório, toda a série é recusada para não criar agenda incompleta.',
            solution: [
                'Leia o aviso exibido no formulário para identificar a data exata do impedimento.',
                'Ajuste o horário escolhido ou revise feriados, bloqueios e restrição de expediente em Configurar Agenda antes de salvar novamente.'
            ],
            keywords: ['repeticao semanal', 'recorrencia agenda', 'conflito', 'feriado bloqueado', 'fora do expediente', 'nao salvou'],
            actions: [
                { label: 'Abrir Agenda', action: 'view:schedule', primary: true },
                { label: 'Configurar expediente e feriados', action: 'modal:agenda-settings' }
            ]
        },
        {
            id: 'multi-tab-conflict',
            category: 'Sistema e suporte',
            question: 'Apareceu a mensagem "Os dados mudaram em outra aba" ao tentar salvar uma alteração.',
            cause: 'Duas abas do sistema estavam abertas ao mesmo tempo no navegador, e a outra aba salvou informações mais novas no cofre depois que a aba atual havia sido carregada.',
            solution: [
                'Não force sobrescrita: copie eventual texto em edição, feche a aba secundária e atualize a aba principal para carregar a versão mais recente do cofre.',
                'No uso diário, mantenha apenas uma aba ou janela instalada do Gestão Terapia aberta.'
            ],
            keywords: ['outra aba', 'mudaram em outra aba', 'conflito de aba', 'erro ao salvar'],
            actions: [
                { label: 'Ir para Visão Geral', action: 'view:dashboard', primary: true }
            ]
        },
        {
            id: 'offline-pwa-support',
            category: 'Sistema e suporte',
            question: 'Como garantir funcionamento sem internet e pedir ajuda técnica sem expor dados de pacientes?',
            cause: 'O cache offline é ativado após a primeira abertura completa com conexão, e eventuais dúvidas técnicas podem ser verificadas sem jamais compartilhar seu backup clínico.',
            solution: [
                'Abra Sobre o sistema e confira em Conferência local se Acesso offline indica Página controlada pelo cache local; instale o aplicativo pelo menu do navegador.',
                'Se precisar contatar o canal da sua compra, clique em Baixar diagnóstico local (.txt): ele reúne apenas versão e status técnico, sem nomes, prontuários, contatos, senha ou licença.'
            ],
            keywords: ['suporte', 'ajuda tecnica', 'diagnostico', 'sem internet', 'offline', 'cache', 'pwa', 'instalar app', 'erro'],
            actions: [
                { label: 'Baixar diagnóstico seguro', action: 'fn:diagnostic', primary: true },
                { label: 'Abrir Sobre o sistema', action: 'view:about' }
            ]
        }
    ];

    topics.push({
        id:'coverage',title:'Convênios e origens do atendimento',group:'Gestão',view:'settings',icon:'building-2',readTime:'2 min',summary:'Cadastro central de convênios, busca, filtros, cores e preservação do histórico.',keywords:['convenio','operadora','plano','origem','particular','reembolso','inativo'],
        steps:['Abra Configurações > Convênios ou o atalho Convênios e cores na Agenda. Ambos levam ao mesmo cadastro.','Cadastre nome, cor e disponibilidade para novas marcações. Use a busca e o filtro de ativos/inativos para localizar um cadastro.','Use Editar para revisar nome, cor ou disponibilidade. Salve o cadastro; inativar impede novas escolhas e mantém os vínculos existentes.','Em Cores das origens, personalize Particular e Particular com reembolso. Escolha a origem no paciente ou no atendimento pelos formulários correspondentes.'],
        rules:['Cada atendimento preserva sua origem, nome, cor e valor históricos. Uma alteração cadastral não reclassifica o passado.','Particular com reembolso continua sendo atendimento particular. O cadastro não envia guias nem solicita pagamentos a operadoras.','O cadastro atual contém nome, cor e disponibilidade. Dados empresariais, contratos e tabelas de valores não são gerenciados nesta etapa.'],
        caution:'A cor auxilia a leitura; o nome e a situação continuam identificados por texto.',actions:[{label:'Gerenciar convênios',action:'settings:coverage',primary:true}]
    });
    topics.find(t=>t.id==='sessions').steps.push('Use os ícones de ajuda junto aos campos para duração, foco, conteúdo, intervenções, continuidade e observações. A duração registrada não altera a reserva da Agenda; o resumo da cobrança explica o efeito da confirmação. Rascunho, revisão e recuperação têm efeitos distintos.');
    topics.push({
        id: 'clinical', title: 'Referências clínicas, Fenomenologia e organização do registro',
        group: 'Acompanhamento', view: 'patients', icon: 'book-open', readTime: '3 min',
        summary: 'Consulte abordagens, 40 termos e seis guias de organização do acompanhamento dentro da ficha, com fontes identificadas.',
        keywords: ['fenomenologia', 'fenomenologica', 'referencias clinicas', 'hipotese', 'diagnostico', 'formulacao', 'humor', 'afeto', 'anamnese', 'estrutura vazia'],
        steps: [
            'Em Pacientes, abra Referências clínicas na tela ou na ficha. Os botões de ajuda ao lado dos campos abrem diretamente o assunto relacionado.',
            'Busque um termo sem precisar sair do formulário. Alterne Abordagens, Termos clínicos e Registrar e acompanhar e use Consultar para ler a referência.',
            'Para selecionar Fenomenológica (Fenomenologia), abra ou revise o plano terapêutico pela ficha. Escolher uma referência não altera a abordagem: você decide a seleção e salva pelos controles normais do plano.',
            'Nos seis guias, Copiar estrutura vazia copia somente títulos. Cole onde desejar e redija o trabalho efetivamente realizado. Exemplos fictícios não são preenchidos no prontuário.',
            'Feche a consulta para retornar ao formulário e ao texto em edição. Em Guias e tarefas, procure referências clínicas para conhecer esses percursos.'
        ],
        rules: [
            'Consulta, pesquisa e leitura não gravam o cofre nem confirmam atendimento, diagnóstico ou pagamento. As conclusões continuam sendo elaboradas pelo profissional.',
            'O campo de diagnóstico/hipótese do plano continua opcional. A biblioteca distingue hipótese, compreensão e conclusão e não analisa a narrativa do paciente.',
            'Sem sinalização registrada não comprova ausência de risco. A descrição de humor Deprimido não estabelece, isoladamente, um transtorno depressivo.',
            'O catálogo funciona offline após atualizar o aplicativo. Os links identificados como fontes externas exigem conexão e não levam dados do paciente.',
            'O conteúdo tem revisão editorial e fontes. A revisão profissional do piloto permanece pendente; leitura não equivale a formação ou avaliação concluída.'
        ],
        caution: 'Registre apenas informações pertinentes e efetivamente investigadas. Ao abrir uma ajuda durante outro guia, o roteiro anterior pode ficar pausado e ser retomado depois.',
        actions: [
            { label: 'Abrir Referências clínicas', action: 'clinical:all', primary: true },
            { label: 'Consultar Fenomenologia', action: 'clinical:approach-fenomenologica' },
            { label: 'Ir para Pacientes', action: 'view:patients' }
        ]
    });
    quickQueries.push({ label: 'Referências clínicas', query: 'referencias clinicas' });
    for (const id of ['patients', 'treatments', 'sessions', 'assessments']) {
        const topic = topics.find(item => item.id === id);
        topic.steps.push('Use os botões de Referências clínicas para consultar termos e orientações de registro, preservando o formulário e o texto ainda não salvo.');
        topic.actions.push({ label: 'Referências clínicas', action: 'clinical:all' });
    }
    troubleshooting.push({
        id: 'clinical-offline', category: 'Referências clínicas',
        question: 'Consigo ler os termos, mas o link da fonte não abre sem internet.',
        cause: 'O catálogo e seus textos ficam no aplicativo; os sites das instituições são fontes externas.',
        solution: ['Continue a consulta aos textos locais. Reabra conectado para acessar a bibliografia externa.', 'Use Fechar referências para voltar ao mesmo formulário. Consultar a biblioteca não salva seu registro.'],
        keywords: ['referencias clinicas', 'fenomenologia', 'fonte externa', 'consulta offline'],
        actions: [{ label: 'Consultar referências', action: 'clinical:all', primary: true }]
    });

    function evaluateOnboarding(state = {}) {
        const s = state.settings || {};
        const hasText = value => typeof value === 'string' && value.trim().length > 0;
        const clinicCustom = Boolean(
            (hasText(s.clinicName) && s.clinicName.trim() !== 'Consultório Psicológico') ||
            hasText(s.therapistLicense) || hasText(s.clinicPhone) ||
            hasText(s.emergencyContact) || hasText(s.hospitalReference)
        );
        const routineCustom = Boolean(
            s.agenda !== undefined ||
            (s.coverage && Array.isArray(s.coverage.plans) && s.coverage.plans.length > 0) ||
            (Number.isFinite(Number(s.sessionDuration)) && Number(s.sessionDuration) !== 50) ||
            (s.sessionFee !== undefined && s.sessionFee !== null && s.sessionFee !== '' && Number.isFinite(Number(s.sessionFee)) && Number(s.sessionFee) >= 0 && Number(s.sessionFee) !== 150)
        );
        const appearanceCustom = Boolean(
            (s.assistant && (s.assistant.logoData || hasText(s.assistant.signature) || (s.assistant.palette && s.assistant.palette !== 'blue'))) ||
            state.fontCustom
        );
        const cycleDone = Boolean(state.hasPatients && (state.hasAppointments || state.hasSessions));
        const backupValid = Boolean(state.backupStamp && Number.isFinite(Date.parse(state.backupStamp)));

        const map = {
            clinic: clinicCustom
                ? { status: 'done', badge: 'Configurado' }
                : { status: 'pending', badge: 'Pendente' },
            routine: routineCustom
                ? { status: 'done', badge: 'Personalizado' }
                : { status: 'ready', badge: 'Padrão ativo (50 min)' },
            appearance: appearanceCustom
                ? { status: 'done', badge: 'Personalizado' }
                : { status: 'ready', badge: 'Padrão ativo' },
            cycle: cycleDone
                ? { status: 'done', badge: 'Em uso' }
                : state.hasPatients
                    ? { status: 'ready', badge: 'Paciente cadastrado' }
                    : { status: 'pending', badge: 'Próximo passo' },
            backup: backupValid
                ? { status: 'done', badge: 'Backup já solicitado' }
                : { status: 'pending', badge: 'Recomendado hoje' }
        };

        const steps = onboarding.map(item => ({
            ...item,
            ...(map[item.id] || { status: 'ready', badge: 'Disponível' })
        }));
        const completedCount = steps.filter(item => item.status === 'done').length;
        return { steps, completedCount, total: steps.length };
    }

    function topicSearchText(topic) {
        return fold([
            topic.title,
            topic.group,
            topic.summary,
            ...(topic.keywords || []),
            ...(topic.steps || []),
            ...(topic.rules || []),
            topic.caution || ''
        ].join(' '));
    }

    function troubleSearchText(item) {
        return fold([
            item.category,
            item.question,
            item.cause,
            ...(item.solution || []),
            ...(item.keywords || [])
        ].join(' '));
    }

    function flowSearchText(flow) {
        return fold([
            flow.tag,
            flow.title,
            flow.subtitle,
            ...(flow.keywords || []),
            ...(flow.steps || []).map(s => s.title + ' ' + s.detail)
        ].join(' '));
    }

    function matchesQuery(haystack, rawQuery) {
        const q = fold(rawQuery);
        if (!q) return true;
        if (haystack.includes(q)) return true;
        const tokens = q.split(/\s+/).filter(token => token.length >= 2);
        return tokens.length > 1 && tokens.every(token => haystack.includes(token));
    }

    return {
        fold,
        viewTopics,
        quickQueries,
        onboarding,
        flows,
        topics,
        troubleshooting,
        evaluateOnboarding,
        topicSearchText,
        troubleSearchText,
        flowSearchText,
        matchesQuery
    };
})();
