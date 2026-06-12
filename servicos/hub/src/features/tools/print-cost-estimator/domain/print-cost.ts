// Precos oficiais Plena — documento-base Plena Informatica
export const PLENA_PRICE_BLACK = 3.00  // R$ por pagina preta
export const PLENA_PRICE_COLOR = 4.00  // R$ por pagina colorida

// Limiar de empate: diferenca inferior a R$ 0,01
export const TIE_THRESHOLD = 0.01

export interface PrintInput {
  pagesBlack: number        // paginas pretas por mes (>= 0)
  pagesColor: number        // paginas coloridas por mes (>= 0)
  cartridgeCost: number     // custo do cartucho/toner em R$ (>= 0)
  cartridgeYield: number    // rendimento do cartucho em paginas (> 0 para calcular)
  paperResmaCost: number    // custo da resma de papel em R$ (>= 0)
  paperResmaSheets: number  // folhas por resma (> 0 para calcular)
  maintenanceCost: number   // manutencao mensal estimada em R$ (>= 0)
}

export type PrintVerdict = 'economy' | 'extra' | 'tie'
// 'economy' = Plena mais barata (usuario economiza indo a Plena)
// 'extra'   = impressora propria mais barata
// 'tie'     = diferenca < TIE_THRESHOLD

export interface PrintResult {
  ownCostPerPage: number    // custo proprio por pagina (manutencao distribuida)
  ownCostMonthly: number    // custo mensal total com impressora propria
  plenaCostPerPage: number  // custo medio ponderado Plena por pagina
  plenaCostMonthly: number  // custo mensal total na Plena
  difference: number        // |ownCostMonthly - plenaCostMonthly|
  verdict: PrintVerdict
}

/** Converte string de input para numero seguro (nunca negativo nem NaN). */
export function parseSafeNum(value: string): number {
  const n = parseFloat(value.replace(',', '.'))
  return isNaN(n) || n < 0 ? 0 : n
}

/** Calcula e retorna a comparacao de custo entre impressora propria e Plena. */
export function calculatePrintCost(input: PrintInput): PrintResult {
  const {
    pagesBlack, pagesColor,
    cartridgeCost, cartridgeYield,
    paperResmaCost, paperResmaSheets,
    maintenanceCost,
  } = input

  const totalPages = pagesBlack + pagesColor

  // Custo bruto por pagina (sem manutencao)
  const rawPerPage =
    (cartridgeYield > 0 ? cartridgeCost / cartridgeYield : 0) +
    (paperResmaSheets > 0 ? paperResmaCost / paperResmaSheets : 0)

  // Custo mensal total (paginas × custo + manutencao fixa)
  const ownCostMonthly = totalPages * rawPerPage + maintenanceCost

  // Por pagina com manutencao distribuida (somente para exibicao)
  const ownCostPerPage = totalPages > 0 ? ownCostMonthly / totalPages : 0

  // Custo Plena separado por tipo
  const plenaCostMonthly =
    pagesBlack * PLENA_PRICE_BLACK + pagesColor * PLENA_PRICE_COLOR

  // Custo medio ponderado Plena por pagina (para exibicao)
  const plenaCostPerPage = totalPages > 0 ? plenaCostMonthly / totalPages : 0

  const difference = Math.abs(ownCostMonthly - plenaCostMonthly)

  let verdict: PrintVerdict
  if (difference < TIE_THRESHOLD) {
    verdict = 'tie'
  } else if (ownCostMonthly > plenaCostMonthly) {
    verdict = 'economy'
  } else {
    verdict = 'extra'
  }

  return {
    ownCostPerPage,
    ownCostMonthly,
    plenaCostPerPage,
    plenaCostMonthly,
    difference,
    verdict,
  }
}
