import { filterValidCategories } from './menu-data'
import type { MenuData, MenuItemData, MenuOptions } from './menu-data'

// ── Dimensões de página (pt) ──────────────────────────────────────────────────
export const PAGE_DIMS: Record<'a4' | 'half', [number, number]> = {
  a4:   [595.28, 841.89],
  half: [419.53, 595.28],
}

// ── Constantes de layout ──────────────────────────────────────────────────────
const PAD_V    = 36   // margens superior e inferior
const PAD_H    = 36   // margens esquerda e direita
const GUTTER   = 14   // espaço entre colunas

// Tamanhos de fonte (pt)
const FS_ESTAB  = 16
const FS_SLOGAN = 9
const FS_CAT    = 11
const FS_NAME   = 9
const FS_DESC   = 7.5
const FS_PGNUM  = 7

// Espaçamentos verticais (pt)
const GAP_AFTER_ESTAB   = 4
const GAP_AFTER_SLOGAN  = 4
const GAP_RULE_BELOW    = 10
const GAP_AFTER_CAT_HDR = 4
const GAP_CAT_RULE      = 4
const GAP_DESC          = 2
const GAP_AFTER_ITEM    = 6
const GAP_AFTER_BLOCK   = 10

// ── Helpers de texto ──────────────────────────────────────────────────────────

/** Remove acentos para compatibilidade com Helvetica (WinAnsiEncoding). */
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

type PdfFont = { widthOfTextAtSize: (t: string, s: number) => number }

function truncate(text: string, font: PdfFont, size: number, maxW: number): string {
  if (font.widthOfTextAtSize(text, size) <= maxW) return text
  let t = text
  while (t.length > 1 && font.widthOfTextAtSize(t + '...', size) > maxW) {
    t = t.slice(0, -1)
  }
  return t.length < text.length ? t + '...' : t
}

// ── Altura estimada de um item ────────────────────────────────────────────────

function itemHeight(item: MenuItemData): number {
  let h = FS_NAME
  if (item.description.trim()) {
    h += GAP_DESC + FS_DESC
  }
  h += GAP_AFTER_ITEM
  return h
}

// ── Gerador principal ─────────────────────────────────────────────────────────

export async function createMenuPdf(data: MenuData, options: MenuOptions): Promise<Uint8Array> {
  // Validações básicas
  if (!data.establishment.trim()) {
    throw new Error('Nome do estabelecimento e obrigatorio.')
  }

  const validCats = filterValidCategories(data.categories)
  if (validCats.length === 0) {
    throw new Error('Adicione pelo menos uma categoria com um item nomeado.')
  }

  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')

  const pdf    = await PDFDocument.create()
  const bold   = await pdf.embedFont(StandardFonts.HelveticaBold)
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const oblique = await pdf.embedFont(StandardFonts.HelveticaOblique)

  const [pageW, pageH] = PAGE_DIMS[options.pageSize]
  const numCols  = options.columns
  const contentW = pageW - PAD_H * 2
  const colW     = numCols === 2 ? (contentW - GUTTER) / 2 : contentW

  // ── Estado mutável do cursor ────────────────────────────────────────────────
  type PdfPage = Awaited<ReturnType<typeof pdf.addPage>>

  const allPages: PdfPage[] = []
  let curPage!: PdfPage
  let col     = 0
  let y       = 0
  let colTopY = 0   // y onde a coluna atual começou (para avanço para col direita)

  function getColX(): number {
    return PAD_H + col * (colW + GUTTER)
  }

  function addPage(): void {
    curPage = pdf.addPage([pageW, pageH])
    allPages.push(curPage)
    col = 0
    y   = pageH - PAD_V

    // Mini-cabeçalho em páginas adicionais
    if (allPages.length > 1) {
      const estabMini = normalize(data.establishment.trim())
      curPage.drawText(truncate(estabMini, bold, 9, contentW), {
        x: PAD_H, y: y - 9, size: 9, font: bold,
        color: rgb(0.3, 0.35, 0.45),
      })
      y -= 9 + 3
      curPage.drawLine({
        start: { x: PAD_H, y: y - 1 },
        end:   { x: pageW - PAD_H, y: y - 1 },
        thickness: 0.4, color: rgb(0.7, 0.72, 0.75),
      })
      y -= 6
    }

    colTopY = y
  }

  function advanceColumn(): void {
    if (numCols === 2 && col === 0) {
      col = 1
      y   = colTopY
    } else {
      addPage()
    }
  }

  function ensureSpace(height: number): void {
    if (y - height < PAD_V) {
      advanceColumn()
    }
  }

  // ── Desenha item (nome + preço + descrição) ─────────────────────────────────
  function drawItem(item: MenuItemData): void {
    const name  = normalize(item.name.trim())
    const price = item.price.trim()

    // Largura do preço (reserva espaço à direita)
    const priceW = price
      ? bold.widthOfTextAtSize(normalize(price), FS_NAME) + 4
      : 0
    const nameW = colW - priceW

    // Nome (esquerda)
    curPage.drawText(truncate(name, regular, FS_NAME, nameW), {
      x: getColX(), y: y - FS_NAME,
      size: FS_NAME, font: regular,
      color: rgb(0.1, 0.15, 0.25),
    })

    // Preço (direita, bold, azul suave)
    if (price) {
      const priceNorm = normalize(price)
      const priceX = getColX() + colW - bold.widthOfTextAtSize(priceNorm, FS_NAME)
      curPage.drawText(priceNorm, {
        x: priceX, y: y - FS_NAME,
        size: FS_NAME, font: bold,
        color: rgb(0.18, 0.34, 0.62),
      })
    }

    y -= FS_NAME

    // Descrição (opcional, menor, cinza)
    const desc = item.description.trim()
    if (desc) {
      y -= GAP_DESC
      const descText = normalize(desc)
      curPage.drawText(truncate(descText, regular, FS_DESC, colW), {
        x: getColX(), y: y - FS_DESC,
        size: FS_DESC, font: regular,
        color: rgb(0.5, 0.52, 0.55),
      })
      y -= FS_DESC
    }

    y -= GAP_AFTER_ITEM
  }

  // ── 1. Primeira página ──────────────────────────────────────────────────────
  addPage()

  // Cabeçalho principal
  const estabText = normalize(data.establishment.trim())
  curPage.drawText(truncate(estabText, bold, FS_ESTAB, contentW), {
    x: PAD_H, y: y - FS_ESTAB,
    size: FS_ESTAB, font: bold,
    color: rgb(0.1, 0.15, 0.25),
  })
  y -= FS_ESTAB + GAP_AFTER_ESTAB

  const slogan = data.slogan.trim()
  if (slogan) {
    const sloganText = normalize(slogan)
    curPage.drawText(truncate(sloganText, oblique, FS_SLOGAN, contentW), {
      x: PAD_H, y: y - FS_SLOGAN,
      size: FS_SLOGAN, font: oblique,
      color: rgb(0.48, 0.5, 0.56),
    })
    y -= FS_SLOGAN + GAP_AFTER_SLOGAN
  }

  curPage.drawLine({
    start: { x: PAD_H, y: y - 2 },
    end:   { x: pageW - PAD_H, y: y - 2 },
    thickness: 0.6, color: rgb(0.62, 0.66, 0.72),
  })
  y -= GAP_RULE_BELOW

  // Após o cabeçalho, atualiza colTopY para que a coluna direita use a mesma posição
  colTopY = y

  // ── 2. Categorias ───────────────────────────────────────────────────────────
  for (const cat of validCats) {
    const firstItem = cat.items[0]
    const catHdrH   = FS_CAT + GAP_AFTER_CAT_HDR + GAP_CAT_RULE
    const minBlock  = catHdrH + itemHeight(firstItem)

    ensureSpace(minBlock)

    // Título da categoria
    const catText = normalize(cat.name.trim() || 'Categoria')
    curPage.drawText(truncate(catText, bold, FS_CAT, colW), {
      x: getColX(), y: y - FS_CAT,
      size: FS_CAT, font: bold,
      color: rgb(0.15, 0.2, 0.38),
    })
    y -= FS_CAT + GAP_AFTER_CAT_HDR

    // Linha abaixo do título
    curPage.drawLine({
      start: { x: getColX(), y: y },
      end:   { x: getColX() + colW, y: y },
      thickness: 0.3, color: rgb(0.8, 0.82, 0.86),
    })
    y -= GAP_CAT_RULE

    // Itens
    for (const item of cat.items) {
      ensureSpace(itemHeight(item))
      drawItem(item)
    }

    y -= GAP_AFTER_BLOCK
  }

  // ── 3. Numeração de páginas (a partir da 2ª) ────────────────────────────────
  const totalPages = allPages.length
  if (totalPages > 1) {
    for (let i = 1; i < totalPages; i++) {
      const page    = allPages[i]
      const pageNum = normalize(`Pagina ${i + 1} de ${totalPages}`)
      page.drawText(pageNum, {
        x: PAD_H, y: PAD_V / 2,
        size: FS_PGNUM, font: regular,
        color: rgb(0.6, 0.62, 0.65),
      })
    }
  }

  return pdf.save()
}
