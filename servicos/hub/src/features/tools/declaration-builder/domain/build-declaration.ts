import type { DeclarationData } from './declaration-data'

export type QuoteTableSpec = {
  headers: string[]
  rows: string[][]
  totalLabel: string
  totalValue: string
}

export type DeclarationDocument = {
  title: string
  paragraphs: string[]
  locationDate: string
  signatureName: string
  signatureLabel: string
  signatureDocument?: string
  footerNote: string
  table?: QuoteTableSpec
}

const footerNote =
  'Documento elaborado com base nas informações fornecidas pelo declarante. Confirme previamente os requisitos de aceitação com a instituição destinatária. Este arquivo não possui assinatura digital, reconhecimento de firma ou validação automática pela Plena Informática.'

const monthNames = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

function formatDateLong(date: string): string {
  if (!date) return ''
  const [year, month, day] = date.split('-').map(Number)
  if (!year || !month || !day || !monthNames[month - 1]) return date
  return `${day} de ${monthNames[month - 1]} de ${year}`
}

function locationDate(values: Record<string, string>): string {
  return [values.city, formatDateLong(values.date)]
    .filter(Boolean)
    .join(', ')
}

function identityDescription(values: Record<string, string>): string {
  const qualifications = [
    values.nationality,
    values.maritalStatus,
    values.occupation,
  ].filter(Boolean)
  const identity = values.identityDocument
    ? `, documento de identidade ${values.identityDocument}`
    : ''
  const qualificationText = qualifications.length
    ? `, ${qualifications.join(', ')}`
    : ''

  return `${values.declarantName}${qualificationText}, inscrito(a) no CPF sob o nº ${values.cpf}${identity}`
}

function purposeSentence(purpose: string): string {
  return purpose ? ` O presente documento destina-se a ${purpose}.` : ''
}

function activityNatureLabel(value: string): string {
  const labels: Record<string, string> = {
    autonomous: 'trabalho autônomo',
    informal: 'trabalho informal',
    liberal: 'atividade como profissional liberal',
    other: 'outra forma de atividade profissional',
  }
  return labels[value] ?? value
}

export function buildDeclaration(data: DeclarationData): DeclarationDocument {
  const { values } = data

  switch (data.templateId) {
    case 'residence':
      return {
        title: 'Declaração de residência',
        paragraphs: [
          `Eu, ${identityDescription(values)}, declaro, sob minha responsabilidade, que resido no endereço ${values.address}${values.residenceSince ? ` desde ${values.residenceSince}` : ''}.`,
          `Esta declaração registra o endereço informado pelo próprio declarante.${purposeSentence(values.purpose)}`,
          'Declaro que as informações acima correspondem à realidade na data da assinatura e assumo integral responsabilidade por sua exatidão, ciente de que a instituição destinatária poderá solicitar documentos complementares.',
        ],
        locationDate: locationDate(values),
        signatureName: values.declarantName,
        signatureLabel: 'Declarante',
        signatureDocument: `CPF ${values.cpf}`,
        footerNote,
      }
    case 'work-income':
      return {
        title: 'Declaração de trabalho e renda',
        paragraphs: [
          `Eu, ${identityDescription(values)}, declaro que exerço a atividade de ${values.occupation}, na modalidade de ${activityNatureLabel(values.activityNature)}, desde ${values.activitySince}${values.activityLocation ? `, com atuação em ${values.activityLocation}` : ''}.`,
          `Declaro possuir renda mensal média aproximada de ${values.income}, apurada com base no período de referência informado como ${values.incomeReferencePeriod}. As informações de atividade e renda têm natureza autodeclaratória e não representam auditoria, certificação contábil ou comprovação de vínculo empregatício.`,
          `Presto estas informações sob minha responsabilidade${values.purpose ? ` para fins de ${values.purpose}` : ''}, ciente de que o destinatário poderá solicitar comprovantes ou esclarecimentos adicionais.`,
        ],
        locationDate: locationDate(values),
        signatureName: values.declarantName,
        signatureLabel: 'Declarante',
        signatureDocument: `CPF ${values.cpf}`,
        footerNote,
      }
    case 'minor-authorization': {
      const authorizedRecipient = values.authorizedPerson
        ? ` perante ${values.authorizedPerson}`
        : ''
      const phone = values.guardianPhone
        ? ` Para contato durante o período autorizado, informo o telefone ${values.guardianPhone}.`
        : ''

      return {
        title: 'Autorização particular para atividade de menor',
        paragraphs: [
          `Eu, ${values.guardianName}, inscrito(a) no CPF sob o nº ${values.guardianDocument}${values.guardianIdentityDocument ? `, documento de identidade ${values.guardianIdentityDocument}` : ''}, na condição de ${values.guardianRelationship} de ${values.minorName}, nascido(a) em ${formatDateLong(values.minorBirthDate)}, autorizo sua participação na atividade descrita abaixo.`,
          `A autorização refere-se exclusivamente a ${values.authorizedActivity}, a ser realizada em ${values.activityLocation}${authorizedRecipient}, no período de ${formatDateLong(values.startDate)}, às ${values.startTime}, até ${formatDateLong(values.endDate)}, às ${values.endTime}.`,
          `Esta autorização limita-se à atividade, ao local e ao período expressamente indicados, não abrangendo outros atos ou finalidades.${phone}`,
        ],
        locationDate: locationDate(values),
        signatureName: values.guardianName,
        signatureLabel: 'Responsável pelo menor',
        signatureDocument: `CPF ${values.guardianDocument}`,
        footerNote,
      }
    }
    case 'receipt': {
      const settlement =
        values.settlementType === 'partial'
          ? 'quitação parcial, restrita ao valor e à referência descritos neste recibo'
          : 'quitação total, restrita ao objeto e ao período descritos neste recibo'
      const reference = values.reference
        ? ` A referência informada é: ${values.reference}.`
        : ''
      const paymentMethod = values.paymentMethod
        ? `, por meio de ${values.paymentMethod}`
        : ''

      return {
        title: 'Recibo particular',
        paragraphs: [
          `Eu, ${values.receiverName}, inscrito(a) no CPF ou CNPJ sob o nº ${values.receiverDocument}, declaro ter recebido de ${values.payerName}, inscrito(a) no CPF ou CNPJ sob o nº ${values.payerDocument}, a quantia de ${values.amount} (${values.amountInWords})${paymentMethod}, em ${formatDateLong(values.paymentDate)}.`,
          `O pagamento refere-se a ${values.reason}.${reference}`,
          `Pelo valor efetivamente recebido, concedo ${settlement}. Este recibo não substitui nota fiscal ou documento tributário quando sua emissão for obrigatória.`,
        ],
        locationDate: locationDate(values),
        signatureName: values.receiverName,
        signatureLabel: 'Recebedor(a)',
        signatureDocument: values.receiverDocument,
        footerNote,
      }
    }
    case 'quote': {
      const items = data.items ?? []
      const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
      const validityLine = values.validityDate
        ? `Validade: ${formatDateLong(values.validityDate)}.`
        : ''
      const conditionsLine = values.paymentConditions
        ? `Condicoes de pagamento: ${values.paymentConditions}.`
        : ''
      const infoLine = [validityLine, conditionsLine].filter(Boolean).join(' ')
      return {
        title: 'Orcamento',
        paragraphs: [
          `Emitente: ${values.issuerName}${values.issuerDocument ? ` — CPF/CNPJ: ${values.issuerDocument}` : ''}.`,
          `Cliente: ${values.clientName}.`,
          ...(infoLine ? [infoLine] : []),
          ...(values.notes ? [values.notes] : []),
          'Este orcamento nao constitui nota fiscal, contrato ou garantia de preco. Os valores e condicoes sao estimados e podem ser ajustados mediante acordo entre as partes.',
        ],
        locationDate: locationDate(values),
        signatureName: values.issuerName,
        signatureLabel: 'Emitente',
        signatureDocument: values.issuerDocument || undefined,
        footerNote,
        table: {
          headers: ['Descricao', 'Qtd.', 'Vlr. unit.', 'Subtotal'],
          rows: items.map((item) => [
            item.description,
            String(item.quantity),
            formatCurrency(item.unitPrice),
            formatCurrency(item.quantity * item.unitPrice),
          ]),
          totalLabel: 'Total',
          totalValue: formatCurrency(total),
        },
      }
    }
    case 'custom':
      return {
        title: values.title || 'Declaração',
        paragraphs: [
          `Eu, ${identityDescription(values)}, declaro, sob minha responsabilidade, os fatos e informações apresentados a seguir.${purposeSentence(values.purpose)}`,
          values.content,
          'Declaro que o conteúdo acima corresponde às informações por mim prestadas e assumo responsabilidade por sua exatidão e utilização.',
        ],
        locationDate: locationDate(values),
        signatureName: values.declarantName,
        signatureLabel: 'Declarante',
        signatureDocument: `CPF ${values.cpf}`,
        footerNote,
      }
  }
}
