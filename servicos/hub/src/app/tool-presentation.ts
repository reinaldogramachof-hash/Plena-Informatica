export interface ProfessionalService {
  name: string
  priceLabel: string
  contextLabel: string
  actionLabel: string
}

export const professionalServices = {
  resume: {
    name: 'Currículo profissional',
    priceLabel: 'R$ 15,00',
    contextLabel: 'Prefere que a equipe prepare para você?',
    actionLabel: 'Solicitar currículo com a Plena',
  },
  documents: {
    name: 'Declaração, orçamento ou recibo',
    priceLabel: 'R$ 15,00',
    contextLabel: 'Precisa de revisão ou elaboração profissional?',
    actionLabel: 'Solicitar documento com a Plena',
  },
  digitization: {
    name: 'Digitalização',
    priceLabel: 'R$ 4,00',
    contextLabel: 'Precisa digitalizar ou imprimir os documentos?',
    actionLabel: 'Consultar atendimento Plena',
  },
  irpf: {
    name: 'Declaração de IRPF',
    priceLabel: 'R$ 110,00',
    contextLabel: 'Quer concluir o processo com atendimento profissional?',
    actionLabel: 'Solicitar atendimento para IRPF',
  },
  menu: {
    name: 'Cardápio impresso e plastificado',
    priceLabel: 'a partir de R$ 30,00',
    contextLabel: 'Depois de aprovar o layout, conte com a produção da Plena.',
    actionLabel: 'Consultar impressão de cardápio',
  },
  businessCards: {
    name: '100 cartões de visitas',
    priceLabel: 'R$ 50,00',
    contextLabel: 'Layout aprovado? A Plena cuida da impressão.',
    actionLabel: 'Solicitar impressão dos cartões',
  },
  labels: {
    name: 'Impressão de etiquetas',
    priceLabel: 'a partir de R$ 3,50',
    contextLabel: 'Precisa imprimir em papel etiqueta?',
    actionLabel: 'Consultar impressão de etiquetas',
  },
  mei: {
    name: 'Serviços para MEI',
    priceLabel: 'a partir de R$ 80,00',
    contextLabel: 'Precisa regularizar, declarar, abrir ou baixar seu MEI?',
    actionLabel: 'Solicitar atendimento MEI',
  },
  printing: {
    name: 'Impressão na Plena',
    priceLabel: 'a partir de R$ 3,00',
    contextLabel: 'Quer confirmar formato, quantidade e acabamento?',
    actionLabel: 'Consultar impressão',
  },
} satisfies Record<string, ProfessionalService>

export type ProfessionalServiceId = keyof typeof professionalServices

export interface ToolPresentation {
  resultLabel: string
  estimatedTime: string
  benefits: readonly [string, string, string?]
  privacyLabel: string
  primaryActionLabel: string
  professionalServiceId?: ProfessionalServiceId
  featured?: boolean
  popularityLabel?: string
}

export const toolPresentations = {
  'qr-code': {
    resultLabel: 'PNG',
    estimatedTime: '2 a 5 min',
    benefits: ['Links, Pix, Wi-Fi e WhatsApp', 'Baixe imediatamente'],
    privacyLabel: 'Sem cadastro e sem armazenamento',
    primaryActionLabel: 'Criar QR Code',
    featured: true,
    popularityLabel: 'Rápido e gratuito',
  },
  'images-to-pdf': {
    resultLabel: 'PDF',
    estimatedTime: '3 a 8 min',
    benefits: [
      'Reordene fotos e documentos',
      'Arquivos não saem do aparelho',
      'Baixe um único PDF',
    ],
    privacyLabel: 'Processamento 100% local',
    primaryActionLabel: 'Transformar imagens em PDF',
    professionalServiceId: 'digitization',
  },
  'merge-pdf': {
    resultLabel: 'PDF',
    estimatedTime: '2 a 5 min',
    benefits: [
      'Junte vários documentos',
      'Escolha a ordem final',
      'Sem envio de arquivos',
    ],
    privacyLabel: 'Processamento 100% local',
    primaryActionLabel: 'Unificar meus PDFs',
    professionalServiceId: 'digitization',
  },
  'resume-builder': {
    resultLabel: 'PDF',
    estimatedTime: '10 a 20 min',
    benefits: [
      'Cinco modelos profissionais',
      'Visualização em tempo real',
      'Formatação automática',
    ],
    privacyLabel: 'Seus dados permanecem neste navegador',
    primaryActionLabel: 'Criar meu currículo',
    professionalServiceId: 'resume',
    featured: true,
    popularityLabel: 'Mais procurado',
  },
  'declaration-builder': {
    resultLabel: 'PDF',
    estimatedTime: '5 a 10 min',
    benefits: [
      'Modelos orientados',
      'Texto com estrutura profissional',
      'Prévia antes de baixar',
    ],
    privacyLabel: 'Seus dados permanecem neste navegador',
    primaryActionLabel: 'Criar meu documento',
    professionalServiceId: 'documents',
  },
  'mei-irpf-checklist': {
    resultLabel: 'Checklist',
    estimatedTime: '5 a 10 min',
    benefits: [
      'Lista personalizada',
      'Menos documentos esquecidos',
      'Sem dados sensíveis',
    ],
    privacyLabel: 'Respostas usadas somente nesta sessão',
    primaryActionLabel: 'Montar meu checklist',
    professionalServiceId: 'irpf',
  },
  'menu-builder': {
    resultLabel: 'PDF',
    estimatedTime: '15 a 30 min',
    benefits: [
      'Categorias e itens organizados',
      'Prévia para aprovação',
      'Pronto para impressão',
    ],
    privacyLabel: 'Processamento 100% local',
    primaryActionLabel: 'Criar meu cardápio',
    professionalServiceId: 'menu',
  },
  'business-card-creator': {
    resultLabel: 'PDF + PNG',
    estimatedTime: '10 a 15 min',
    benefits: [
      'Três estilos profissionais',
      'Prévia em tempo real',
      'Arquivo pronto para aprovar',
    ],
    privacyLabel: 'Processamento 100% local',
    primaryActionLabel: 'Criar cartão de visitas',
    professionalServiceId: 'businessCards',
  },
  'label-generator': {
    resultLabel: 'PDF',
    estimatedTime: '5 a 10 min',
    benefits: [
      'Modelos de folha A4',
      'Contagem automática',
      'Prévia antes de imprimir',
    ],
    privacyLabel: 'Processamento 100% local',
    primaryActionLabel: 'Criar minhas etiquetas',
    professionalServiceId: 'labels',
  },
  'mei-das-guide': {
    resultLabel: 'Guia',
    estimatedTime: '5 a 10 min',
    benefits: [
      'Organize os meses pagos',
      'Entenda os componentes do DAS',
      'Acesso ao canal oficial',
    ],
    privacyLabel: 'Marcações ficam somente nesta sessão',
    primaryActionLabel: 'Consultar guia DAS',
    professionalServiceId: 'mei',
  },
  'print-cost-estimator': {
    resultLabel: 'Comparativo',
    estimatedTime: '3 a 5 min',
    benefits: [
      'Compare custos mensais',
      'Use os dados da sua impressora',
      'Resultado apenas orientativo',
    ],
    privacyLabel: 'Valores não são armazenados',
    primaryActionLabel: 'Comparar custos',
    professionalServiceId: 'printing',
  },
} satisfies Record<string, ToolPresentation>

export function getToolPresentation(
  slug: string,
): ToolPresentation | undefined {
  return toolPresentations[slug as keyof typeof toolPresentations]
}
