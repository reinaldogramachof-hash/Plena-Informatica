import type { CardData, CardStyle } from './business-card-data'

// 90 x 50 mm em pontos PDF (1 mm = 72/25.4 pt)
const MM_TO_PT = 72 / 25.4
export const CARD_WIDTH_PT = parseFloat((90 * MM_TO_PT).toFixed(2))  // 255.12
export const CARD_HEIGHT_PT = parseFloat((50 * MM_TO_PT).toFixed(2)) // 141.73

const THEMES = {
  classic: {
    bg:     [1,     1,     1    ] as [number, number, number],
    text:   [0.118, 0.161, 0.239] as [number, number, number],
    muted:  [0.42,  0.45,  0.52 ] as [number, number, number],
    accent: [0.118, 0.227, 0.373] as [number, number, number],
    hasBorder: true,
  },
  modern: {
    bg:     [0.118, 0.227, 0.373] as [number, number, number],
    text:   [1,     1,     1    ] as [number, number, number],
    muted:  [0.80,  0.88,  0.96 ] as [number, number, number],
    accent: [0.376, 0.647, 0.98 ] as [number, number, number],
    hasBorder: false,
  },
  colorful: {
    bg:     [0.706, 0.329, 0.035] as [number, number, number],
    text:   [1,     1,     1    ] as [number, number, number],
    muted:  [0.98,  0.88,  0.76 ] as [number, number, number],
    accent: [0.992, 0.902, 0.545] as [number, number, number],
    hasBorder: false,
  },
} as const

/** Remove acentos e caracteres fora do WinAnsiEncoding do Helvetica. */
function normalize(text: string): string {
  return text
    .replace(/[áàâã]/g, 'a').replace(/[ÁÀÂÃ]/g, 'A')
    .replace(/[éèê]/g,  'e').replace(/[ÉÈÊ]/g,  'E')
    .replace(/[íìî]/g,  'i').replace(/[ÍÌÎ]/g,  'I')
    .replace(/[óòôõ]/g, 'o').replace(/[ÓÒÔÕ]/g, 'O')
    .replace(/[úùû]/g,  'u').replace(/[ÚÙÛ]/g,  'U')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C')
    .replace(/[–—]/g, '-')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
}

type PdfFont = { widthOfTextAtSize: (text: string, size: number) => number }

/** Trunca o texto com '...' para caber em maxWidth na fonte e tamanho dados. */
function truncate(
  text: string,
  font: PdfFont,
  size: number,
  maxWidth: number,
): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text
  let t = text
  while (t.length > 1 && font.widthOfTextAtSize(t + '...', size) > maxWidth) {
    t = t.slice(0, -1)
  }
  return t.length < text.length ? t + '...' : t
}

export async function createBusinessCardPdf(
  data: CardData,
  style: CardStyle,
): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')

  const pdf     = await PDFDocument.create()
  const page    = pdf.addPage([CARD_WIDTH_PT, CARD_HEIGHT_PT])
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold    = await pdf.embedFont(StandardFonts.HelveticaBold)

  const theme  = THEMES[style]
  const bgC    = rgb(...theme.bg)
  const textC  = rgb(...theme.text)
  const mutedC = rgb(...theme.muted)
  const accentC = rgb(...theme.accent)

  const PAD_X    = 14
  const PAD_TOP  = 13
  const CONTENT_W = CARD_WIDTH_PT - PAD_X * 2

  // Fundo
  page.drawRectangle({ x: 0, y: 0, width: CARD_WIDTH_PT, height: CARD_HEIGHT_PT, color: bgC })

  // Borda fina (estilo classic)
  if (theme.hasBorder) {
    page.drawRectangle({
      x: 1, y: 1,
      width:  CARD_WIDTH_PT - 2,
      height: CARD_HEIGHT_PT - 2,
      borderColor: rgb(0.878, 0.894, 0.922),
      borderWidth: 0.75,
    })
  }

  // Faixa de destaque no rodapé (modern e colorful)
  if (!theme.hasBorder) {
    page.drawRectangle({ x: 0, y: 0, width: CARD_WIDTH_PT, height: 4, color: accentC })
  }

  // y representa a baseline da próxima linha (eixo PDF: 0 embaixo, aumenta para cima)
  let y = CARD_HEIGHT_PT - PAD_TOP

  // Empresa (opcional, maiúscula pequena)
  const company = data.company.trim()
  if (company) {
    const compText = normalize(company.toUpperCase())
    page.drawText(truncate(compText, bold, 5.5, CONTENT_W), {
      x: PAD_X, y, size: 5.5, font: bold, color: mutedC,
    })
    y -= 5.5 + 6
  }

  // Nome (obrigatório)
  const nameText = normalize(data.fullName.trim())
  page.drawText(truncate(nameText, bold, 13, CONTENT_W), {
    x: PAD_X, y, size: 13, font: bold, color: textC,
  })
  y -= 13 + 6

  // Cargo (opcional)
  const role = data.role.trim()
  if (role) {
    const roleText = normalize(role)
    page.drawText(truncate(roleText, regular, 7.5, CONTENT_W), {
      x: PAD_X, y, size: 7.5, font: regular, color: mutedC,
    })
    y -= 7.5 + 7
  } else {
    y -= 7
  }

  // Linha separadora
  page.drawLine({
    start: { x: PAD_X, y },
    end:   { x: CARD_WIDTH_PT - PAD_X, y },
    thickness: 0.5,
    color: accentC,
  })
  y -= 10

  // Campos de contato (todos opcionais)
  const contacts = [
    data.phone.trim(),
    data.email.trim(),
    data.website.trim(),
    data.city.trim(),
  ].filter(Boolean)

  const CONTACT_SIZE = 6
  const CONTACT_GAP  = 4
  const BOTTOM_LIMIT = 10

  for (const contact of contacts) {
    if (y - CONTACT_SIZE < BOTTOM_LIMIT) break
    const contactText = normalize(contact)
    page.drawText(truncate(contactText, regular, CONTACT_SIZE, CONTENT_W), {
      x: PAD_X, y, size: CONTACT_SIZE, font: regular, color: mutedC,
    })
    y -= CONTACT_SIZE + CONTACT_GAP
  }

  return pdf.save()
}
