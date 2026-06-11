export type ChecklistAudience = 'mei' | 'irpf'
export type ChecklistAnswer = string | boolean

export type ChecklistQuestion = {
  id: string
  audience: ChecklistAudience
  label: string
  description?: string
  type: 'boolean' | 'single-choice'
  options?: Array<{ value: string; label: string }>
}

export type ChecklistRule = {
  questionId: string
  equals: ChecklistAnswer
}

export type ChecklistItem = {
  id: string
  audience: ChecklistAudience
  scenarioIds?: string[]
  category: string
  title: string
  description: string
  requiredWhen?: ChecklistRule[]
  attention?: string
}

export type ChecklistScenario = {
  id: string
  audience: ChecklistAudience
  label: string
  description: string
}

// ---------------------------------------------------------------------------
// Cenários
// ---------------------------------------------------------------------------

export const scenarios: ChecklistScenario[] = [
  {
    id: 'mei-abertura',
    audience: 'mei',
    label: 'Abertura de MEI',
    description: 'Registrar-se como Microempreendedor Individual pela primeira vez',
  },
  {
    id: 'mei-alteracao',
    audience: 'mei',
    label: 'Alteração cadastral',
    description: 'Alterar dados cadastrais como endereço, atividade ou situação do MEI',
  },
  {
    id: 'mei-declaracao',
    audience: 'mei',
    label: 'Declaração Anual do MEI',
    description: 'Entregar a DASN-SIMEI referente ao ano-calendário anterior',
  },
  {
    id: 'mei-regularizacao',
    audience: 'mei',
    label: 'Regularização de pendências',
    description: 'Resolver débitos, bloqueios ou irregularidades no CNPJ',
  },
  {
    id: 'mei-das',
    audience: 'mei',
    label: 'Emissão ou organização do DAS',
    description: 'Emitir, pagar ou organizar as guias mensais de contribuição',
  },
  {
    id: 'mei-notas',
    audience: 'mei',
    label: 'Nota fiscal e organização documental',
    description: 'Habilitar emissão de NFS-e ou organizar documentos do negócio',
  },
]

// ---------------------------------------------------------------------------
// Perguntas MEI
// ---------------------------------------------------------------------------

export const meiQuestions: ChecklistQuestion[] = [
  {
    id: 'mei-q-govbr',
    audience: 'mei',
    label: 'Você possui conta GOV.br?',
    type: 'boolean',
  },
  {
    id: 'mei-q-titulo',
    audience: 'mei',
    label: 'Você possui título de eleitor?',
    type: 'boolean',
  },
  {
    id: 'mei-q-ir-anterior',
    audience: 'mei',
    label: 'Você entregou declaração de Imposto de Renda anteriormente?',
    type: 'boolean',
  },
  {
    id: 'mei-q-endereco-comercial',
    audience: 'mei',
    label: 'Você possui endereço comercial diferente do residencial?',
    type: 'boolean',
  },
  {
    id: 'mei-q-faturamento',
    audience: 'mei',
    label: 'Você teve faturamento no período de referência?',
    type: 'boolean',
  },
  {
    id: 'mei-q-empregado',
    audience: 'mei',
    label: 'Você possui empregado registrado?',
    type: 'boolean',
  },
  {
    id: 'mei-q-mudanca',
    audience: 'mei',
    label: 'Houve mudança de endereço ou atividade desde o último cadastro?',
    type: 'boolean',
  },
  {
    id: 'mei-q-das-atraso',
    audience: 'mei',
    label: 'Existem boletos DAS em atraso?',
    type: 'boolean',
  },
  {
    id: 'mei-q-notas-emitidas',
    audience: 'mei',
    label: 'Você precisa organizar notas fiscais emitidas?',
    type: 'boolean',
  },
  {
    id: 'mei-q-relatorio',
    audience: 'mei',
    label: 'Você possui relatório de receitas mensais?',
    type: 'boolean',
  },
]

// ---------------------------------------------------------------------------
// Perguntas IRPF
// ---------------------------------------------------------------------------

export const irpfQuestions: ChecklistQuestion[] = [
  {
    id: 'irpf-q-emprego',
    audience: 'irpf',
    label: 'Você teve rendimentos de emprego ou aposentadoria?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-autonomo',
    audience: 'irpf',
    label: 'Você trabalhou como autônomo?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-aluguel',
    audience: 'irpf',
    label: 'Você recebeu aluguel?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-dependentes',
    audience: 'irpf',
    label: 'Você possui dependentes?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-saude',
    audience: 'irpf',
    label: 'Você teve despesas médicas ou odontológicas?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-educacao',
    audience: 'irpf',
    label: 'Você teve despesas com educação?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-investimentos',
    audience: 'irpf',
    label: 'Você possui contas bancárias ou investimentos?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-imovel',
    audience: 'irpf',
    label: 'Você comprou ou vendeu imóvel?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-veiculo',
    audience: 'irpf',
    label: 'Você comprou ou vendeu veículo?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-bolsa',
    audience: 'irpf',
    label: 'Você realizou operações em bolsa ou criptoativos?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-heranca',
    audience: 'irpf',
    label: 'Você recebeu herança ou doação?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-pensao',
    audience: 'irpf',
    label: 'Você pagou ou recebeu pensão alimentícia?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-rural',
    audience: 'irpf',
    label: 'Você possui atividade rural?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-declaracao-anterior',
    audience: 'irpf',
    label: 'Você entregou declaração no ano anterior?',
    type: 'boolean',
  },
  {
    id: 'irpf-q-retificacao',
    audience: 'irpf',
    label: 'Você precisa retificar uma declaração anterior?',
    type: 'boolean',
  },
]

// ---------------------------------------------------------------------------
// Itens do checklist MEI
// ---------------------------------------------------------------------------

export const meiItems: ChecklistItem[] = [
  // Identificação pessoal
  {
    id: 'mei-rg',
    audience: 'mei',
    category: 'Identificação pessoal',
    title: 'Documento de identidade (RG ou CNH)',
    description: 'Cópia e original do documento de identidade com foto válido.',
  },
  {
    id: 'mei-cpf',
    audience: 'mei',
    category: 'Identificação pessoal',
    title: 'CPF',
    description: 'Número do CPF — confirme se está regularizado na Receita Federal.',
    attention: 'Confirme a situação cadastral do CPF no site da Receita Federal antes do atendimento.',
  },
  {
    id: 'mei-titulo',
    audience: 'mei',
    category: 'Identificação pessoal',
    title: 'Título de eleitor',
    description: 'Pode ser solicitado para confirmação de identidade.',
    requiredWhen: [{ questionId: 'mei-q-titulo', equals: true }],
  },
  {
    id: 'mei-comprovante-residencia',
    audience: 'mei',
    scenarioIds: ['mei-abertura', 'mei-alteracao'],
    category: 'Identificação pessoal',
    title: 'Comprovante de residência recente',
    description: 'Conta de água, luz ou telefone com data recente.',
  },
  // Acesso governamental
  {
    id: 'mei-govbr-acesso',
    audience: 'mei',
    category: 'Acesso governamental',
    title: 'Acesso ao GOV.br (login)',
    description:
      'Acesso ao portal GOV.br — necessário para serviços do Portal do Empreendedor.',
    attention:
      'Não informe sua senha a terceiros. Realize o acesso somente em dispositivo próprio e seguro.',
    requiredWhen: [{ questionId: 'mei-q-govbr', equals: true }],
  },
  {
    id: 'mei-govbr-criar',
    audience: 'mei',
    category: 'Acesso governamental',
    title: 'Criar conta GOV.br (se ainda não tiver)',
    description:
      'Se você não possui conta GOV.br, será necessário criá-la antes de prosseguir.',
    requiredWhen: [{ questionId: 'mei-q-govbr', equals: false }],
  },
  {
    id: 'mei-ir-anterior',
    audience: 'mei',
    category: 'Acesso governamental',
    title: 'Número do recibo da última declaração de IR',
    description: 'Pode ser exigido para elevar o nível da conta GOV.br.',
    requiredWhen: [{ questionId: 'mei-q-ir-anterior', equals: true }],
  },
  // Dados da atividade
  {
    id: 'mei-cnae',
    audience: 'mei',
    scenarioIds: ['mei-abertura', 'mei-alteracao'],
    category: 'Dados da atividade',
    title: 'Código CNAE da atividade principal',
    description:
      'Informe ou confirme o código CNAE da atividade que será exercida como MEI.',
    attention:
      'Confirme com a Receita Federal se a atividade desejada é permitida ao MEI.',
  },
  {
    id: 'mei-nome-fantasia',
    audience: 'mei',
    scenarioIds: ['mei-abertura', 'mei-alteracao'],
    category: 'Dados da atividade',
    title: 'Nome fantasia (opcional)',
    description: 'Nome comercial que aparecerá nas notas fiscais e documentos.',
  },
  // Endereço
  {
    id: 'mei-endereco-residencial',
    audience: 'mei',
    scenarioIds: ['mei-abertura', 'mei-alteracao'],
    category: 'Endereço',
    title: 'Endereço residencial completo',
    description:
      'CEP, logradouro, número, complemento, bairro, município e UF.',
  },
  {
    id: 'mei-endereco-comercial',
    audience: 'mei',
    scenarioIds: ['mei-abertura', 'mei-alteracao'],
    category: 'Endereço',
    title: 'Endereço comercial completo',
    description:
      'Endereço do estabelecimento onde a atividade será exercida.',
    requiredWhen: [{ questionId: 'mei-q-endereco-comercial', equals: true }],
  },
  // Faturamento e receitas
  {
    id: 'mei-relatorio-receitas',
    audience: 'mei',
    scenarioIds: ['mei-declaracao', 'mei-notas'],
    category: 'Faturamento e receitas',
    title: 'Relatório mensal de receitas brutas',
    description:
      'Documento com o total de receitas mês a mês no período de referência.',
    requiredWhen: [{ questionId: 'mei-q-faturamento', equals: true }],
  },
  {
    id: 'mei-comprovante-receitas',
    audience: 'mei',
    scenarioIds: ['mei-declaracao', 'mei-notas'],
    category: 'Faturamento e receitas',
    title: 'Comprovantes de recebimento',
    description:
      'Extratos, recibos ou outros registros que comprovem as receitas declaradas.',
    requiredWhen: [{ questionId: 'mei-q-faturamento', equals: true }],
  },
  // Guias DAS
  {
    id: 'mei-das-pagos',
    audience: 'mei',
    scenarioIds: ['mei-declaracao', 'mei-regularizacao', 'mei-das'],
    category: 'Guias DAS',
    title: 'Comprovantes de pagamento do DAS',
    description:
      'Guias DAS pagas dos últimos 12 meses ou do período de referência.',
  },
  {
    id: 'mei-das-atraso',
    audience: 'mei',
    scenarioIds: ['mei-regularizacao', 'mei-das'],
    category: 'Guias DAS',
    title: 'Guias DAS em atraso para regularização',
    description:
      'Liste os meses em atraso. Confirme com a Receita Federal os valores e acréscimos legais vigentes.',
    attention:
      'Confirme esta exigência com a Receita Federal, pois valores e prazos podem ter sido alterados.',
    requiredWhen: [{ questionId: 'mei-q-das-atraso', equals: true }],
  },
  // Notas fiscais
  {
    id: 'mei-notas-organizadas',
    audience: 'mei',
    scenarioIds: ['mei-declaracao', 'mei-notas'],
    category: 'Notas fiscais',
    title: 'Notas fiscais emitidas no período',
    description:
      'Relação ou arquivo com todas as NFS-e ou NF emitidas no período de apuração.',
    requiredWhen: [{ questionId: 'mei-q-notas-emitidas', equals: true }],
  },
  {
    id: 'mei-habilitacao-nfe',
    audience: 'mei',
    scenarioIds: ['mei-notas'],
    category: 'Notas fiscais',
    title: 'Cadastro na prefeitura para emissão de NFS-e',
    description:
      'Verifique no site da sua prefeitura se o MEI está habilitado a emitir nota fiscal de serviços.',
    attention:
      'Confirme esta exigência com a prefeitura do município, pois cada cidade possui regras próprias.',
  },
  // Empregado (quando aplicável)
  {
    id: 'mei-empregado-carteira',
    audience: 'mei',
    category: 'Empregado',
    title: 'Carteira de trabalho do empregado',
    description: 'Documento obrigatório para formalização do vínculo empregatício.',
    requiredWhen: [{ questionId: 'mei-q-empregado', equals: true }],
  },
  {
    id: 'mei-empregado-guias',
    audience: 'mei',
    category: 'Empregado',
    title: 'Guias de recolhimento INSS do empregado',
    description:
      'Comprovantes de recolhimento das contribuições previdenciárias do empregado.',
    requiredWhen: [{ questionId: 'mei-q-empregado', equals: true }],
    attention:
      'Confirme os percentuais e prazos vigentes com a Previdência Social.',
  },
  // Pendências e protocolos
  {
    id: 'mei-protocolo-alteracao',
    audience: 'mei',
    scenarioIds: ['mei-alteracao', 'mei-regularizacao'],
    category: 'Pendências e protocolos',
    title: 'Protocolo de alteração cadastral anterior (se houver)',
    description:
      'Caso exista algum processo aberto anteriormente, leve o número do protocolo.',
    requiredWhen: [{ questionId: 'mei-q-mudanca', equals: true }],
  },
  // Itens para confirmar com o atendimento
  {
    id: 'mei-confirmar-atendimento',
    audience: 'mei',
    category: 'Itens para confirmar com o atendimento',
    title: 'Lista de dúvidas para o atendente',
    description:
      'Anote as principais dúvidas antes do atendimento para não esquecer.',
  },
]

// ---------------------------------------------------------------------------
// Itens do checklist IRPF
// ---------------------------------------------------------------------------

export const irpfItems: ChecklistItem[] = [
  // Identificação e declaração anterior
  {
    id: 'irpf-rg',
    audience: 'irpf',
    category: 'Identificação e declaração anterior',
    title: 'Documento de identidade (RG ou CNH)',
    description: 'Cópia e original do documento de identidade com foto.',
  },
  {
    id: 'irpf-cpf',
    audience: 'irpf',
    category: 'Identificação e declaração anterior',
    title: 'CPF',
    description: 'Número do CPF — confirme se está regularizado na Receita Federal.',
    attention: 'Confirme a situação cadastral do CPF no site da Receita Federal.',
  },
  {
    id: 'irpf-declaracao-anterior',
    audience: 'irpf',
    category: 'Identificação e declaração anterior',
    title: 'Última declaração entregue (arquivo .rec ou PDF)',
    description: 'Cópia da declaração do ano anterior para pré-preenchimento.',
    requiredWhen: [{ questionId: 'irpf-q-declaracao-anterior', equals: true }],
  },
  {
    id: 'irpf-recibo-anterior',
    audience: 'irpf',
    category: 'Identificação e declaração anterior',
    title: 'Recibo de entrega da declaração anterior',
    description: 'Número do recibo pode ser necessário para retificação ou acesso.',
    requiredWhen: [{ questionId: 'irpf-q-declaracao-anterior', equals: true }],
  },
  // Informes de rendimentos
  {
    id: 'irpf-informe-emprego',
    audience: 'irpf',
    category: 'Informes de rendimentos',
    title: 'Informe de rendimentos do empregador ou INSS',
    description:
      'Documento fornecido pela empresa, órgão público ou INSS com o total de rendimentos e imposto retido.',
    requiredWhen: [{ questionId: 'irpf-q-emprego', equals: true }],
  },
  // Autônomos e aluguéis
  {
    id: 'irpf-recibos-autonomo',
    audience: 'irpf',
    category: 'Autônomos e aluguéis',
    title: 'Recibos ou comprovantes de serviços prestados',
    description:
      'Registros de recebimentos por serviços autônomos, carnê-leão ou DARF recolhido.',
    requiredWhen: [{ questionId: 'irpf-q-autonomo', equals: true }],
  },
  {
    id: 'irpf-contrato-aluguel',
    audience: 'irpf',
    category: 'Autônomos e aluguéis',
    title: 'Contrato de locação e recibos de aluguel recebido',
    description:
      'Documentos que comprovem os rendimentos de aluguel e o pagamento de carnê-leão, se aplicável.',
    requiredWhen: [{ questionId: 'irpf-q-aluguel', equals: true }],
    attention:
      'Confirme com um contador se houve obrigação de recolhimento mensal de carnê-leão.',
  },
  // Dependentes
  {
    id: 'irpf-dependentes-cpf',
    audience: 'irpf',
    category: 'Dependentes',
    title: 'CPF e data de nascimento dos dependentes',
    description:
      'Necessário para declarar dependentes, independentemente da idade.',
    requiredWhen: [{ questionId: 'irpf-q-dependentes', equals: true }],
  },
  {
    id: 'irpf-dependentes-rendimentos',
    audience: 'irpf',
    category: 'Dependentes',
    title: 'Informes de rendimentos dos dependentes (se houver)',
    description:
      'Informes de rendimentos de dependentes que tiveram renda no ano.',
    requiredWhen: [{ questionId: 'irpf-q-dependentes', equals: true }],
  },
  // Saúde
  {
    id: 'irpf-recibos-medicos',
    audience: 'irpf',
    category: 'Saúde',
    title: 'Recibos de consultas, exames e internações',
    description:
      'Recibos emitidos por médicos, dentistas, psicólogos e outros profissionais de saúde.',
    requiredWhen: [{ questionId: 'irpf-q-saude', equals: true }],
    attention:
      'Despesas com plano de saúde são dedutíveis; confirme com um contador quais valores são aceitos.',
  },
  {
    id: 'irpf-plano-saude',
    audience: 'irpf',
    category: 'Saúde',
    title: 'Comprovante anual de despesas com plano de saúde',
    description:
      'Informe anual fornecido pela operadora de plano de saúde.',
    requiredWhen: [{ questionId: 'irpf-q-saude', equals: true }],
  },
  // Educação
  {
    id: 'irpf-recibos-educacao',
    audience: 'irpf',
    category: 'Educação',
    title: 'Comprovantes de despesas educacionais',
    description:
      'Recibos ou informes de escolas, faculdades, cursos técnicos e pós-graduação.',
    requiredWhen: [{ questionId: 'irpf-q-educacao', equals: true }],
    attention:
      'Confirme quais despesas são dedutíveis e os limites aplicáveis com a Receita Federal.',
  },
  // Bancos e investimentos
  {
    id: 'irpf-extratos-bancarios',
    audience: 'irpf',
    category: 'Bancos e investimentos',
    title: 'Extratos bancários e informes de rendimentos financeiros',
    description:
      'Informes emitidos pelos bancos e corretoras com rendimentos de poupança, CDB, fundos e outros.',
    requiredWhen: [{ questionId: 'irpf-q-investimentos', equals: true }],
  },
  // Bens e direitos
  {
    id: 'irpf-bens-imovel',
    audience: 'irpf',
    category: 'Bens e direitos',
    title: 'Documentação do imóvel (escritura, contrato ou IPTU)',
    description:
      'Documentos que comprovem a propriedade, valor de aquisição e dados do imóvel.',
    requiredWhen: [{ questionId: 'irpf-q-imovel', equals: true }],
  },
  {
    id: 'irpf-bens-veiculo',
    audience: 'irpf',
    category: 'Bens e direitos',
    title: 'CRLV e documentação do veículo',
    description:
      'Documentos que comprovem a propriedade, valor de compra e dados do veículo.',
    requiredWhen: [{ questionId: 'irpf-q-veiculo', equals: true }],
  },
  // Compra e venda de bens
  {
    id: 'irpf-compra-venda-imovel',
    audience: 'irpf',
    category: 'Compra e venda de bens',
    title: 'Contrato e documentos da compra/venda do imóvel',
    description:
      'Escritura, contrato, valor de venda, custo de aquisição e DARF de ganho de capital, se aplicável.',
    requiredWhen: [{ questionId: 'irpf-q-imovel', equals: true }],
    attention:
      'Confirme com um contador ou a Receita Federal se houve ganho de capital tributável na transação.',
  },
  {
    id: 'irpf-compra-venda-veiculo',
    audience: 'irpf',
    category: 'Compra e venda de bens',
    title: 'Documentos da compra/venda do veículo',
    description:
      'DUT, contrato ou nota fiscal com valor de compra e valor de venda.',
    requiredWhen: [{ questionId: 'irpf-q-veiculo', equals: true }],
  },
  // Pensão alimentícia
  {
    id: 'irpf-pensao',
    audience: 'irpf',
    category: 'Pensão alimentícia',
    title: 'Sentença judicial ou escritura de pensão alimentícia',
    description:
      'Documento que estabelece o valor e os beneficiários da pensão paga ou recebida.',
    requiredWhen: [{ questionId: 'irpf-q-pensao', equals: true }],
    attention:
      'Confirme com um contador quais valores são dedutíveis conforme a legislação vigente.',
  },
  // Doações e heranças
  {
    id: 'irpf-heranca',
    audience: 'irpf',
    category: 'Doações e heranças',
    title: 'Documentação da herança ou doação recebida',
    description:
      'Formal de partilha, escritura de doação ou documentos que comprovem o recebimento e o valor.',
    requiredWhen: [{ questionId: 'irpf-q-heranca', equals: true }],
    attention:
      'Confirme com a Receita Federal a necessidade de recolhimento de ITCMD e outros tributos estaduais.',
  },
  // Atividade rural
  {
    id: 'irpf-rural',
    audience: 'irpf',
    category: 'Atividade rural',
    title: 'Livro Caixa ou relação de receitas e despesas rurais',
    description:
      'Documentação completa das receitas e despesas da atividade rural no ano-calendário.',
    requiredWhen: [{ questionId: 'irpf-q-rural', equals: true }],
    attention:
      'A atividade rural possui regras específicas de tributação. Consulte um contador especializado.',
  },
  // Renda variável e criptoativos
  {
    id: 'irpf-bolsa',
    audience: 'irpf',
    category: 'Renda variável e criptoativos',
    title: 'Notas de corretagem e informes da corretora',
    description:
      'Documentos de operações em bolsa (ações, FIIs, ETFs) e extrato de criptoativos.',
    requiredWhen: [{ questionId: 'irpf-q-bolsa', equals: true }],
    attention:
      'Confirme com a Receita Federal a obrigatoriedade e o método de apuração de ganhos em criptoativos.',
  },
  // Pendências e comprovantes complementares
  {
    id: 'irpf-retificacao',
    audience: 'irpf',
    category: 'Pendências e comprovantes complementares',
    title: 'Declaração original para retificação',
    description:
      'Arquivo .rec ou PDF da declaração que será retificada, com número do recibo.',
    requiredWhen: [{ questionId: 'irpf-q-retificacao', equals: true }],
  },
  {
    id: 'irpf-duvidas',
    audience: 'irpf',
    category: 'Pendências e comprovantes complementares',
    title: 'Lista de dúvidas para o atendente',
    description:
      'Anote as principais dúvidas antes do atendimento para não esquecer.',
  },
]
