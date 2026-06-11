export type DeclarationTemplateId =
  | 'residence'
  | 'work-income'
  | 'minor-authorization'
  | 'receipt'
  | 'custom'

export type DeclarationFieldSection =
  | 'identification'
  | 'details'
  | 'finalization'

export type DeclarationField = {
  id: string
  section: DeclarationFieldSection
  label: string
  placeholder?: string
  type: 'text' | 'date' | 'time' | 'textarea' | 'select'
  options?: Array<{ value: string; label: string }>
  required: boolean
  errorMessage: string
  maxLength: number
}

export type DeclarationTemplate = {
  id: DeclarationTemplateId
  name: string
  shortDescription: string
  recommendation: string
  notRecommendedFor: string
  fields: DeclarationField[]
}

const field = (
  definition: Omit<DeclarationField, 'maxLength'> & {
    maxLength?: number
  },
): DeclarationField => ({
  maxLength: definition.type === 'textarea' ? 1200 : 160,
  ...definition,
})

const sharedLocationFields: DeclarationField[] = [
  field({
    id: 'city',
    section: 'finalization',
    label: 'Cidade',
    placeholder: 'São José dos Campos',
    type: 'text',
    required: false,
    errorMessage: 'Informe a cidade',
  }),
  field({
    id: 'date',
    section: 'finalization',
    label: 'Data da assinatura',
    type: 'date',
    required: true,
    errorMessage: 'Informe a data da assinatura',
    maxLength: 10,
  }),
]

const identityFields = (): DeclarationField[] => [
  field({
    id: 'declarantName',
    section: 'identification',
    label: 'Nome completo',
    type: 'text',
    required: true,
    errorMessage: 'Informe seu nome completo',
  }),
  field({
    id: 'cpf',
    section: 'identification',
    label: 'CPF',
    placeholder: '000.000.000-00',
    type: 'text',
    required: true,
    errorMessage: 'Informe o CPF',
    maxLength: 20,
  }),
  field({
    id: 'identityDocument',
    section: 'identification',
    label: 'Documento de identidade',
    placeholder: 'RG, RNE ou outro documento',
    type: 'text',
    required: false,
    errorMessage: 'Informe o documento de identidade',
    maxLength: 40,
  }),
]

export const declarationTemplates: DeclarationTemplate[] = [
  {
    id: 'residence',
    name: 'Declaração de residência',
    shortDescription: 'Declare o endereço informado pelo próprio residente.',
    recommendation:
      'Indicada quando uma instituição aceita declaração particular emitida e assinada pelo próprio residente.',
    notRecommendedFor:
      'Não garante aceitação nem substitui automaticamente comprovante de residência exigido pelo destinatário.',
    fields: [
      ...identityFields(),
      field({
        id: 'nationality',
        section: 'identification',
        label: 'Nacionalidade',
        type: 'text',
        required: false,
        errorMessage: 'Informe a nacionalidade',
      }),
      field({
        id: 'maritalStatus',
        section: 'identification',
        label: 'Estado civil',
        type: 'text',
        required: false,
        errorMessage: 'Informe o estado civil',
      }),
      field({
        id: 'occupation',
        section: 'identification',
        label: 'Profissão',
        type: 'text',
        required: false,
        errorMessage: 'Informe a profissão',
      }),
      field({
        id: 'address',
        section: 'details',
        label: 'Endereço completo',
        placeholder: 'Rua, número, complemento, bairro, cidade, UF e CEP',
        type: 'textarea',
        required: true,
        errorMessage: 'Informe o endereço completo',
        maxLength: 400,
      }),
      field({
        id: 'residenceSince',
        section: 'details',
        label: 'Reside no endereço desde',
        placeholder: 'Janeiro de 2022',
        type: 'text',
        required: false,
        errorMessage: 'Informe desde quando reside no endereço',
      }),
      field({
        id: 'purpose',
        section: 'details',
        label: 'Finalidade da declaração',
        placeholder: 'Ex.: apresentação à instituição de ensino',
        type: 'text',
        required: false,
        errorMessage: 'Informe a finalidade',
        maxLength: 240,
      }),
      ...sharedLocationFields,
    ],
  },
  {
    id: 'work-income',
    name: 'Declaração de trabalho e renda',
    shortDescription: 'Registre atividade profissional e renda autodeclarada.',
    recommendation:
      'Indicada para autônomos, profissionais liberais ou trabalhadores informais quando o destinatário aceita autodeclaração.',
    notRecommendedFor:
      'Não comprova vínculo empregatício, faturamento contábil, regularidade fiscal ou renda auditada.',
    fields: [
      ...identityFields(),
      field({
        id: 'occupation',
        section: 'details',
        label: 'Profissão ou atividade',
        type: 'text',
        required: true,
        errorMessage: 'Informe a profissão ou atividade',
      }),
      field({
        id: 'activityNature',
        section: 'details',
        label: 'Natureza da atividade',
        type: 'select',
        required: true,
        errorMessage: 'Informe a natureza da atividade',
        options: [
          { value: 'autonomous', label: 'Trabalho autônomo' },
          { value: 'informal', label: 'Trabalho informal' },
          { value: 'liberal', label: 'Profissional liberal' },
          { value: 'other', label: 'Outra forma de atividade' },
        ],
      }),
      field({
        id: 'activityLocation',
        section: 'details',
        label: 'Local ou forma de exercício',
        placeholder: 'Ex.: atendimento remoto e presencial',
        type: 'text',
        required: false,
        errorMessage: 'Informe o local ou forma de exercício',
        maxLength: 240,
      }),
      field({
        id: 'activitySince',
        section: 'details',
        label: 'Exerce a atividade desde',
        placeholder: 'Janeiro de 2022',
        type: 'text',
        required: true,
        errorMessage: 'Informe o início da atividade',
      }),
      field({
        id: 'income',
        section: 'details',
        label: 'Renda mensal média aproximada',
        placeholder: 'R$ 2.500,00',
        type: 'text',
        required: true,
        errorMessage: 'Informe a renda mensal média',
        maxLength: 40,
      }),
      field({
        id: 'incomeReferencePeriod',
        section: 'details',
        label: 'Período de referência da renda',
        placeholder: 'Ex.: últimos 6 meses',
        type: 'text',
        required: true,
        errorMessage: 'Informe o período de referência da renda',
      }),
      field({
        id: 'purpose',
        section: 'details',
        label: 'Finalidade da declaração',
        type: 'text',
        required: false,
        errorMessage: 'Informe a finalidade',
        maxLength: 240,
      }),
      ...sharedLocationFields,
    ],
  },
  {
    id: 'minor-authorization',
    name: 'Autorização particular para atividade de menor',
    shortDescription: 'Autorize uma atividade simples, delimitada e específica.',
    recommendation:
      'Indicada para eventos, passeios locais, retirada ou atividade simples quando não houver formulário obrigatório.',
    notRecommendedFor:
      'Não deve ser usada para viagens, procedimentos médicos, atos com formulário próprio ou exigência judicial ou cartorial.',
    fields: [
      field({
        id: 'guardianName',
        section: 'identification',
        label: 'Nome do responsável',
        type: 'text',
        required: true,
        errorMessage: 'Informe o nome do responsável',
      }),
      field({
        id: 'guardianDocument',
        section: 'identification',
        label: 'CPF do responsável',
        type: 'text',
        required: true,
        errorMessage: 'Informe o CPF do responsável',
        maxLength: 20,
      }),
      field({
        id: 'guardianIdentityDocument',
        section: 'identification',
        label: 'Documento de identidade do responsável',
        type: 'text',
        required: false,
        errorMessage: 'Informe o documento de identidade do responsável',
        maxLength: 40,
      }),
      field({
        id: 'guardianRelationship',
        section: 'identification',
        label: 'Relação com o menor',
        placeholder: 'Ex.: mãe, pai ou responsável legal',
        type: 'text',
        required: true,
        errorMessage: 'Informe a relação com o menor',
      }),
      field({
        id: 'minorName',
        section: 'identification',
        label: 'Nome completo do menor',
        type: 'text',
        required: true,
        errorMessage: 'Informe o nome do menor',
      }),
      field({
        id: 'minorBirthDate',
        section: 'identification',
        label: 'Data de nascimento do menor',
        type: 'date',
        required: true,
        errorMessage: 'Informe a data de nascimento do menor',
        maxLength: 10,
      }),
      field({
        id: 'authorizedPerson',
        section: 'details',
        label: 'Pessoa ou instituição autorizada',
        type: 'text',
        required: false,
        errorMessage: 'Informe a pessoa ou instituição autorizada',
      }),
      field({
        id: 'authorizedActivity',
        section: 'details',
        label: 'Atividade autorizada',
        type: 'textarea',
        required: true,
        errorMessage: 'Descreva a atividade autorizada',
        maxLength: 600,
      }),
      field({
        id: 'activityLocation',
        section: 'details',
        label: 'Local da atividade',
        type: 'text',
        required: true,
        errorMessage: 'Informe o local da atividade',
        maxLength: 240,
      }),
      field({
        id: 'startDate',
        section: 'details',
        label: 'Data de início',
        type: 'date',
        required: true,
        errorMessage: 'Informe a data de início',
        maxLength: 10,
      }),
      field({
        id: 'startTime',
        section: 'details',
        label: 'Horário de início',
        type: 'time',
        required: true,
        errorMessage: 'Informe o horário de início',
        maxLength: 5,
      }),
      field({
        id: 'endDate',
        section: 'details',
        label: 'Data de término',
        type: 'date',
        required: true,
        errorMessage: 'Informe a data de término',
        maxLength: 10,
      }),
      field({
        id: 'endTime',
        section: 'details',
        label: 'Horário de término',
        type: 'time',
        required: true,
        errorMessage: 'Informe o horário de término',
        maxLength: 5,
      }),
      field({
        id: 'guardianPhone',
        section: 'details',
        label: 'Telefone do responsável',
        type: 'text',
        required: false,
        errorMessage: 'Informe o telefone do responsável',
        maxLength: 30,
      }),
      ...sharedLocationFields,
    ],
  },
  {
    id: 'receipt',
    name: 'Recibo particular',
    shortDescription: 'Registre um pagamento e delimite a quitação concedida.',
    recommendation:
      'Indicado para registrar pagamento particular com identificação das partes, valor e objeto claramente definidos.',
    notRecommendedFor:
      'Não substitui nota fiscal, documento tributário ou comprovante exigido por legislação ou contrato específico.',
    fields: [
      field({
        id: 'receiverName',
        section: 'identification',
        label: 'Nome de quem recebeu',
        type: 'text',
        required: true,
        errorMessage: 'Informe o nome de quem recebeu',
      }),
      field({
        id: 'receiverDocument',
        section: 'identification',
        label: 'CPF ou CNPJ de quem recebeu',
        type: 'text',
        required: true,
        errorMessage: 'Informe o CPF ou CNPJ de quem recebeu',
        maxLength: 24,
      }),
      field({
        id: 'payerName',
        section: 'identification',
        label: 'Nome de quem pagou',
        type: 'text',
        required: true,
        errorMessage: 'Informe o nome de quem pagou',
      }),
      field({
        id: 'payerDocument',
        section: 'identification',
        label: 'CPF ou CNPJ de quem pagou',
        type: 'text',
        required: true,
        errorMessage: 'Informe o CPF ou CNPJ de quem pagou',
        maxLength: 24,
      }),
      field({
        id: 'amount',
        section: 'details',
        label: 'Valor recebido',
        placeholder: 'R$ 500,00',
        type: 'text',
        required: true,
        errorMessage: 'Informe o valor recebido',
        maxLength: 40,
      }),
      field({
        id: 'amountInWords',
        section: 'details',
        label: 'Valor por extenso',
        placeholder: 'Quinhentos reais',
        type: 'text',
        required: true,
        errorMessage: 'Informe o valor por extenso',
        maxLength: 240,
      }),
      field({
        id: 'paymentMethod',
        section: 'details',
        label: 'Meio de pagamento',
        placeholder: 'Ex.: Pix, dinheiro ou transferência',
        type: 'text',
        required: false,
        errorMessage: 'Informe o meio de pagamento',
      }),
      field({
        id: 'paymentDate',
        section: 'details',
        label: 'Data do pagamento',
        type: 'date',
        required: true,
        errorMessage: 'Informe a data do pagamento',
        maxLength: 10,
      }),
      field({
        id: 'reason',
        section: 'details',
        label: 'Descrição do pagamento',
        type: 'textarea',
        required: true,
        errorMessage: 'Informe o motivo do pagamento',
        maxLength: 600,
      }),
      field({
        id: 'settlementType',
        section: 'details',
        label: 'Tipo de quitação',
        type: 'select',
        required: true,
        errorMessage: 'Informe o tipo de quitação',
        options: [
          { value: 'total', label: 'Quitação total' },
          { value: 'partial', label: 'Quitação parcial' },
        ],
      }),
      field({
        id: 'reference',
        section: 'details',
        label: 'Referência, parcela ou período',
        placeholder: 'Ex.: parcela 2 de 4 ou serviços de maio de 2026',
        type: 'text',
        required: false,
        errorMessage: 'Informe a referência do pagamento',
        maxLength: 240,
      }),
      ...sharedLocationFields,
    ],
  },
  {
    id: 'custom',
    name: 'Declaração personalizada',
    shortDescription: 'Organize uma declaração particular para outra finalidade.',
    recommendation:
      'Use para registrar fatos simples quando os modelos anteriores não atendem e não há formulário obrigatório.',
    notRecommendedFor:
      'Não use para contratos, procurações, dívidas, cessão de direitos, viagens, consentimento médico ou atos cartoriais.',
    fields: [
      ...identityFields(),
      field({
        id: 'title',
        section: 'details',
        label: 'Título do documento',
        type: 'text',
        required: true,
        errorMessage: 'Informe o título do documento',
      }),
      field({
        id: 'purpose',
        section: 'details',
        label: 'Destinatário ou finalidade',
        type: 'text',
        required: false,
        errorMessage: 'Informe o destinatário ou finalidade',
        maxLength: 240,
      }),
      field({
        id: 'content',
        section: 'details',
        label: 'Fatos ou informações declaradas',
        type: 'textarea',
        required: true,
        errorMessage: 'Escreva os fatos ou informações declaradas',
        maxLength: 2400,
      }),
      ...sharedLocationFields,
    ],
  },
]

export function getDeclarationTemplate(
  id: DeclarationTemplateId,
): DeclarationTemplate {
  const template = declarationTemplates.find((item) => item.id === id)
  if (!template) throw new Error('Modelo de declaração não encontrado')
  return template
}
