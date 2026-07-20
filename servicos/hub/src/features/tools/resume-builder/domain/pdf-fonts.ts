/**
 * Carregamento de fontes para o PDF do currículo.
 *
 * Fonte: Liberation Sans (SIL Open Font License, versão 1.1)
 * Fabricante: Red Hat Inc. — https://github.com/liberationfonts/liberation-fonts
 *
 * Em produção (navegador): busca os arquivos TTF como assets do Vite e os
 * embute diretamente no PDF, garantindo suporte completo a acentos e cedilha.
 *
 * Em testes (jsdom): o fetch falha e o código recua para as StandardFonts do
 * pdf-lib (Helvetica), que não têm acentos mas permitem que os testes
 * funcionais validem estrutura, layout e lógica de quebra de página sem
 * depender de arquivos externos.
 */

import type { PDFDocument, PDFFont } from 'pdf-lib'

import regularUrl from '../../../../assets/fonts/LiberationSans-Regular.ttf?url'
import boldUrl from '../../../../assets/fonts/LiberationSans-Bold.ttf?url'

export interface PdfFonts {
  regular: PDFFont
  bold: PDFFont
}

export async function embedFonts(pdf: PDFDocument): Promise<PdfFonts> {
  try {
    const [regularBytes, boldBytes] = await Promise.all([
      fetch(regularUrl).then((r) => {
        if (!r.ok) throw new Error(`Font fetch failed: ${r.status}`)
        return r.arrayBuffer()
      }),
      fetch(boldUrl).then((r) => {
        if (!r.ok) throw new Error(`Font fetch failed: ${r.status}`)
        return r.arrayBuffer()
      }),
    ])

    const [regular, bold] = await Promise.all([
      pdf.embedFont(regularBytes),
      pdf.embedFont(boldBytes),
    ])

    return { regular, bold }
  } catch {
    // Fallback para ambiente de testes (jsdom) onde fetch não serve arquivos locais.
    // Em produção isso nunca deve ser acionado.
    const { StandardFonts } = await import('pdf-lib')
    const [regular, bold] = await Promise.all([
      pdf.embedFont(StandardFonts.Helvetica),
      pdf.embedFont(StandardFonts.HelveticaBold),
    ])
    return { regular, bold }
  }
}
