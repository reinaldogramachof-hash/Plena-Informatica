import type { CardData, CardStyle } from './business-card-data'

// 90 x 50 mm a 300 dpi — mínimo exigido: 1063 x 591 px
// 90mm × (300/25.4) = 1062.99... → 1063 px
// 50mm × (300/25.4) = 590.55... → 591 px
export const PNG_WIDTH  = 1063
export const PNG_HEIGHT = 591

/** Interface mínima do canvas necessária para geração do PNG. */
export interface CanvasLike {
  width: number
  height: number
  getContext(contextId: '2d'): CanvasRenderingContext2D | null
  toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: number): void
}

/** Fábrica de canvas — injetável para testes. */
export type CanvasFactory = (width: number, height: number) => CanvasLike

/** Implementação padrão do navegador. */
export function defaultCanvasFactory(width: number, height: number): CanvasLike {
  const canvas = document.createElement('canvas')
  canvas.width  = width
  canvas.height = height
  return canvas as unknown as CanvasLike
}

// Paleta de temas (valores CSS)
const THEMES = {
  classic: {
    bg:     '#ffffff',
    text:   '#1e2939',
    muted:  '#6b7280',
    accent: '#1e3a5f',
    border: true,
  },
  modern: {
    bg:     '#1e3a5f',
    text:   '#ffffff',
    muted:  '#cce0f5',
    accent: '#60a5fa',
    border: false,
  },
  colorful: {
    bg:     '#b45309',
    text:   '#ffffff',
    muted:  '#fde8c7',
    accent: '#fde68a',
    border: false,
  },
} as const

/** Quebra texto longo em múltiplas linhas dentro de maxWidth. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines.length > 0 ? lines : ['']
}

/** Trunca uma linha simples com '...' se ultrapassar maxWidth. */
function truncateLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  let t = text
  while (t.length > 1 && ctx.measureText(t + '...').width > maxWidth) {
    t = t.slice(0, -1)
  }
  return t.length < text.length ? t + '...' : t
}

export async function createBusinessCardPng(
  data: CardData,
  style: CardStyle,
  canvasFactory: CanvasFactory = defaultCanvasFactory,
): Promise<Uint8Array> {
  const canvas = canvasFactory(PNG_WIDTH, PNG_HEIGHT)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Nao foi possivel criar o canvas para geracao do PNG.')

  const theme = THEMES[style]

  // Escala: 1063 x 591 px representando 90 x 50 mm
  // Padding proporcional: 14pt × (300/72) ≈ 58px
  const PAD_X     = 58
  const PAD_TOP   = 52
  const CONTENT_W = PNG_WIDTH - PAD_X * 2

  // ── Fundo ────────────────────────────────────────────────────────────────
  ctx.fillStyle = theme.bg
  ctx.fillRect(0, 0, PNG_WIDTH, PNG_HEIGHT)

  // Borda fina (classic)
  if (theme.border) {
    ctx.strokeStyle = '#e0e5ed'
    ctx.lineWidth = 3
    ctx.strokeRect(2, 2, PNG_WIDTH - 4, PNG_HEIGHT - 4)
  }

  // Faixa de destaque no rodapé (modern / colorful)
  if (!theme.border) {
    ctx.fillStyle = theme.accent
    ctx.fillRect(0, PNG_HEIGHT - 16, PNG_WIDTH, 16)
  }

  // ── Textos ───────────────────────────────────────────────────────────────
  ctx.textBaseline = 'top'

  let y = PAD_TOP

  // Empresa (opcional)
  const company = data.company.trim()
  if (company) {
    const COMPANY_SIZE = 23
    ctx.font      = `700 ${COMPANY_SIZE}px Helvetica, Arial, sans-serif`
    ctx.fillStyle = theme.muted
    ctx.fillText(truncateLine(ctx, company.toUpperCase(), CONTENT_W), PAD_X, y)
    y += COMPANY_SIZE + 22
  }

  // Nome (obrigatório)
  const NAME_SIZE = 58
  ctx.font = `700 ${NAME_SIZE}px Helvetica, Arial, sans-serif`
  ctx.fillStyle = theme.text
  const nameLines = wrapText(ctx, data.fullName.trim(), CONTENT_W)
  for (const line of nameLines.slice(0, 2)) {  // max 2 linhas para o nome
    ctx.fillText(line, PAD_X, y)
    y += NAME_SIZE + 8
  }

  // Cargo (opcional)
  const role = data.role.trim()
  if (role) {
    const ROLE_SIZE = 31
    ctx.font      = `400 ${ROLE_SIZE}px Helvetica, Arial, sans-serif`
    ctx.fillStyle = theme.muted
    ctx.fillText(truncateLine(ctx, role, CONTENT_W), PAD_X, y)
    y += ROLE_SIZE + 24
  } else {
    y += 24
  }

  // Linha separadora
  ctx.save()
  ctx.strokeStyle = theme.accent
  ctx.lineWidth   = 2
  ctx.globalAlpha = 0.6
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(PAD_X, y)
  ctx.lineTo(PNG_WIDTH - PAD_X, y)
  ctx.stroke()
  ctx.restore()
  y += 28

  // Contatos (opcionais)
  const CONTACT_SIZE = 27
  ctx.font      = `400 ${CONTACT_SIZE}px Helvetica, Arial, sans-serif`
  ctx.fillStyle = theme.muted

  const contacts = [
    data.phone.trim(),
    data.email.trim(),
    data.website.trim(),
    data.city.trim(),
  ].filter(Boolean)

  for (const contact of contacts) {
    if (y + CONTACT_SIZE > PNG_HEIGHT - 30) break
    ctx.fillText(truncateLine(ctx, contact, CONTENT_W), PAD_X, y)
    y += CONTACT_SIZE + 14
  }

  // ── Exportar como PNG ─────────────────────────────────────────────────────
  return new Promise<Uint8Array>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Falha ao exportar o PNG do canvas.'))
        return
      }
      blob
        .arrayBuffer()
        .then((buffer) => resolve(new Uint8Array(buffer)))
        .catch(reject)
    }, 'image/png')
  })
}
