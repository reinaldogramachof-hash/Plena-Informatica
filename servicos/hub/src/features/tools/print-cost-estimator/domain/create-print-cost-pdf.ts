import type { PrintInput, PrintResult } from './print-cost'

export async function createPrintCostPdf(
  input: PrintInput,
  result: PrintResult,
): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')

  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89]) // A4
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const oblique = await pdf.embedFont(StandardFonts.HelveticaOblique)

  const textC = rgb(0.1, 0.15, 0.25)
  const mutedC = rgb(0.4, 0.45, 0.5)
  const accentC = rgb(0.18, 0.34, 0.62)

  let y = 841.89 - 50
  const x = 50

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  // Título
  page.drawText('Comparativo de Custos de Impressao', { x, y, size: 20, font: bold, color: textC })
  y -= 25
  page.drawText('Plena Informatica - Analise Estimativa', { x, y, size: 12, font: oblique, color: mutedC })
  y -= 40

  // Linha
  page.drawLine({ start: { x, y }, end: { x: 595.28 - x, y }, thickness: 1, color: accentC })
  y -= 30

  // Seção: Volumes e Equipamento
  page.drawText('DADOS INFORMADOS', { x, y, size: 14, font: bold, color: textC })
  y -= 20

  const drawLabelValue = (label: string, val: string) => {
    page.drawText(label, { x, y, size: 11, font: regular, color: mutedC })
    page.drawText(val, { x: x + 250, y, size: 11, font: bold, color: textC })
    y -= 15
  }

  drawLabelValue('Paginas Pretas / mes:', input.pagesBlack.toString())
  drawLabelValue('Paginas Coloridas / mes:', input.pagesColor.toString())
  drawLabelValue('Custo do Cartucho/Toner:', formatCurrency(input.cartridgeCost))
  drawLabelValue('Rendimento do Cartucho:', `${input.cartridgeYield} paginas`)
  drawLabelValue('Custo do Papel (Resma):', formatCurrency(input.paperResmaCost))
  drawLabelValue('Folhas por Resma:', input.paperResmaSheets.toString())
  drawLabelValue('Custo de Manutencao (Mensal):', formatCurrency(input.maintenanceCost))
  
  y -= 20
  page.drawLine({ start: { x, y }, end: { x: 595.28 - x, y }, thickness: 0.5, color: mutedC })
  y -= 30

  // Seção: Resultados
  page.drawText('RESULTADOS DO COMPARATIVO', { x, y, size: 14, font: bold, color: textC })
  y -= 25

  page.drawText('Impressora Propria', { x, y, size: 12, font: bold, color: textC })
  y -= 15
  drawLabelValue('Custo Mensal Estimado:', formatCurrency(result.ownCostMonthly))
  drawLabelValue('Custo por Pagina Estimado:', formatCurrency(result.ownCostPerPage))
  
  y -= 10
  page.drawText('Terceirizando na Plena Informatica', { x, y, size: 12, font: bold, color: textC })
  y -= 15
  drawLabelValue('Custo Mensal Estimado:', formatCurrency(result.plenaCostMonthly))
  drawLabelValue('Custo Medio por Pagina:', formatCurrency(result.plenaCostPerPage))
  
  y -= 20
  page.drawLine({ start: { x, y }, end: { x: 595.28 - x, y }, thickness: 0.5, color: mutedC })
  y -= 30

  // Veredito
  page.drawText('CONCLUSAO', { x, y, size: 14, font: bold, color: textC })
  y -= 20

  const verdictText = {
    economy: `Voce economizaria ${formatCurrency(result.difference)} por mes imprimindo na Plena.`,
    extra: `Sua impressora propria e ${formatCurrency(result.difference)} mais barata por mes.`,
    tie: 'Os custos sao praticamente iguais.',
  }[result.verdict]

  page.drawText(verdictText, { x, y, size: 12, font: bold, color: accentC })

  y -= 40
  page.drawText('Esta calculadora e apenas orientativa e nao representa proposta comercial.', { x, y, size: 9, font: oblique, color: mutedC })
  page.drawText('Calculo baseado nos valores informados. Nao inclui energia eletrica,', { x, y: y - 12, size: 9, font: oblique, color: mutedC })
  page.drawText('depreciacao do equipamento ou acabamentos.', { x, y: y - 24, size: 9, font: oblique, color: mutedC })

  return pdf.save()
}
