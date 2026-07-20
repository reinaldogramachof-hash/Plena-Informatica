import { PDFDocument } from 'pdf-lib'
import { describe, expect, it } from 'vitest'

import { createPrintCostPdf } from './create-print-cost-pdf'
import { calculatePrintCost } from './print-cost'
import type { PrintInput } from './print-cost'

const input: PrintInput = {
  pagesBlack: 100,
  pagesColor: 20,
  cartridgeCost: 80,
  cartridgeYield: 800,
  paperResmaCost: 35,
  paperResmaSheets: 500,
  maintenanceCost: 25,
}

describe('createPrintCostPdf', () => {
  it('gera um PDF local válido com uma página A4', async () => {
    const bytes = await createPrintCostPdf(input, calculatePrintCost(input))
    const pdf = await PDFDocument.load(bytes)
    const [page] = pdf.getPages()

    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(bytes.byteLength).toBeGreaterThan(1_000)
    expect(pdf.getPageCount()).toBe(1)
    expect(page.getWidth()).toBeCloseTo(595.28, 1)
    expect(page.getHeight()).toBeCloseTo(841.89, 1)
  })
})
