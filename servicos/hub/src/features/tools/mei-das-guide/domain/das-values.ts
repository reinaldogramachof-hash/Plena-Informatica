/**
 * Valores oficiais do DAS-MEI — Competencia 2026
 *
 * Conferencia: 2026-01-02
 * Fonte: Receita Federal do Brasil — Simples Nacional
 * URL:   https://www8.receita.fazenda.gov.br/simplesnacional/Noticias/NoticiaCompleta.aspx?id=c3b2044c-ff97-432a-b33c-ecf2a3df6dc3
 * Base legal: Decreto n. 12.797, de 23 de dezembro de 2025
 * Salario-minimo 2026: R$ 1.621,00
 *
 * Nota: MEI transportador autonomo de cargas tem INSS de 12% (R$ 194,52).
 * Esta funcao cobre apenas os tipos de atividade presentes na UI (comercio,
 * servicos, ambos e transporte de passageiros — INSS a 5%).
 */

export type ActivityType =
  | 'commerce'
  | 'services'
  | 'both'
  | 'transport'
  | 'freight-commerce'
  | 'freight-services'
  | 'freight-both'

export interface DasComponent {
  component: string  // ex.: 'INSS', 'ICMS', 'ISS'
  value: number      // valor em R$
  note: string
}

export interface DasInfo {
  components: DasComponent[]
  total: number       // soma dos componentes
  year: number        // competencia
  checkedAt: string   // YYYY-MM-DD da conferencia
  sourceLabel: string // descricao legivel da fonte
  sourceUrl: string   // URL da fonte oficial
}

// Valores vigentes — 2026
export const INSS_MEI  = 81.05  // 5% x R$ 1.621,00
export const ISS_MEI   = 5.00
export const ICMS_MEI  = 1.00

const SOURCE_URL   = 'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/perguntas-frequentes/pagamento-da-contribuicao-mensal-carne-mensal/qual-o-valor-das-contribuicoes'
const SOURCE_LABEL = 'Portal do Empreendedor - Gov.br (atualizado em 02/01/2026)'
const YEAR         = 2026
const CHECKED_AT   = '2026-07-13'

/**
 * Retorna os componentes do DAS e o total para a atividade informada.
 * Os valores sao fixos oficiais; nao ha calculo proporcional nem sobre salario.
 */
export function getDasInfo(activity: ActivityType): DasInfo {
  const isFreight = activity.startsWith('freight-')
  const inssValue = isFreight ? 194.52 : INSS_MEI
  const inssNote = isFreight
    ? 'Previdencia social — 12% do salario-minimo (R$ 1.621,00) para transporte de cargas'
    : 'Previdencia social — 5% do salario-minimo (R$ 1.621,00)'

  const components: DasComponent[] = [
    {
      component: 'INSS',
      value: inssValue,
      note: inssNote,
    },
  ]

  if (
    activity === 'commerce' ||
    activity === 'both' ||
    activity === 'freight-commerce' ||
    activity === 'freight-both'
  ) {
    components.push({
      component: 'ICMS',
      value: ICMS_MEI,
      note: 'Imposto estadual — atividade de comercio',
    })
  }

  if (
    activity === 'services' ||
    activity === 'both' ||
    activity === 'transport' ||
    activity === 'freight-services' ||
    activity === 'freight-both'
  ) {
    components.push({
      component: 'ISS',
      value: ISS_MEI,
      note: 'Imposto municipal — atividade de servicos',
    })
  }

  const total = components.reduce((sum, c) => sum + c.value, 0)

  return {
    components,
    total,
    year: YEAR,
    checkedAt: CHECKED_AT,
    sourceLabel: SOURCE_LABEL,
    sourceUrl: SOURCE_URL,
  }
}
