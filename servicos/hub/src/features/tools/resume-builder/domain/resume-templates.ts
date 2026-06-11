export type TemplateId = 'classic-ats' | 'executive' | 'modern' | 'first-job' | 'creative'

export interface ResumeTemplate {
  id: TemplateId
  name: string
  description: string
  atsCompatible: boolean
  atsWarning?: string
  badge?: string
  accentColor: string
  secondaryColor: string
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'classic-ats',
    name: 'Clássico ATS',
    description:
      'Formato tradicional e limpo, ideal para plataformas de emprego, cargos administrativos e ambientes corporativos. Máxima leitura por sistemas automáticos.',
    atsCompatible: true,
    badge: 'Melhor compatibilidade com ATS',
    accentColor: '#1a1a1a',
    secondaryColor: '#4a4a4a',
  },
  {
    id: 'executive',
    name: 'Executivo',
    description:
      'Visual sóbrio e elegante com cabeçalho em azul-marinho. Recomendado para gerentes, coordenadores e profissionais experientes que buscam cargos de liderança.',
    atsCompatible: true,
    accentColor: '#1e3a5f',
    secondaryColor: '#2c5282',
  },
  {
    id: 'modern',
    name: 'Moderno',
    description:
      'Layout contemporâneo com duas colunas. Perfeito para áreas de tecnologia, comercial e qualquer profissional que queira se destacar com um visual atual.',
    atsCompatible: true,
    accentColor: '#0f4c81',
    secondaryColor: '#2d8cf0',
  },
  {
    id: 'first-job',
    name: 'Primeiro Emprego',
    description:
      'Destaca formação e competências antes da experiência. Ideal para estudantes, recém-formados e candidatos ao primeiro estágio ou emprego.',
    atsCompatible: true,
    accentColor: '#2d6a4f',
    secondaryColor: '#40916c',
  },
  {
    id: 'creative',
    name: 'Criativo',
    description:
      'Visual expressivo com cabeçalho roxo e divisores coloridos. Indicado para áreas de marketing, design, publicidade e profissões criativas.',
    atsCompatible: false,
    atsWarning:
      'Layouts visuais podem ter menor compatibilidade com alguns sistemas ATS.',
    accentColor: '#7b2d8b',
    secondaryColor: '#9b4dab',
  },
]

export const DEFAULT_TEMPLATE_ID: TemplateId = 'classic-ats'

export function getTemplate(id: TemplateId): ResumeTemplate {
  return RESUME_TEMPLATES.find((template) => template.id === id) ?? RESUME_TEMPLATES[0]!
}
