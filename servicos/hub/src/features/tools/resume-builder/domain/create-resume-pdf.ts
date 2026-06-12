import type { ResumeData } from './resume-data'
import type { TemplateId } from './resume-templates'
import { getVisibleSections } from './resume-layout'

export type ResumeDocumentSection = {
  title: string
  items: string[]
}

export type ResumeDocument = {
  title: string
  subtitle: string
  contactLine: string
  sections: ResumeDocumentSection[]
}

export type ResumePdfRenderer = (
  document: ResumeDocument,
  templateId?: TemplateId,
) => Promise<Uint8Array>

function formatPeriod(start: string, end: string, current = false): string {
  return [start, current ? 'Atual' : end].filter(Boolean).join(' - ')
}

function normalizeForPdf(text: string): string {
  return text
    .replace(/[áàâä]/g, 'a').replace(/[ÁÀÂÄ]/g, 'A')
    .replace(/[éèêë]/g, 'e').replace(/[ÉÈÊË]/g, 'E')
    .replace(/[íìîï]/g, 'i').replace(/[ÍÌÎÏ]/g, 'I')
    .replace(/[óòôö]/g, 'o').replace(/[ÓÒÔÖ]/g, 'O')
    .replace(/[úùûü]/g, 'u').replace(/[ÚÙÛÜ]/g, 'U')
    .replace(/[ç]/g, 'c').replace(/[Ç]/g, 'C')
    .replace(/ã/g, 'a').replace(/Ã/g, 'A')
    .replace(/õ/g, 'o').replace(/Õ/g, 'O')
    .replace(/ñ/g, 'n').replace(/Ñ/g, 'N')
    .replace(/[–—]/g, '-').replace(/[""]/g, '"').replace(/['']/g, "'")
}

export function buildResumeDocument(
  resume: ResumeData,
  templateId: TemplateId = 'classic-ats',
): ResumeDocument {
  const visible = getVisibleSections(resume, templateId)
  const sections: ResumeDocumentSection[] = []

  if (visible.hasSummary) {
    sections.push({
      title: 'Resumo profissional',
      items: [resume.personal.summary],
    })
  }

  const experienceSection: ResumeDocumentSection = {
    title: 'Experiencia profissional',
    items: resume.experiences.map(
      (experience) =>
        `${experience.role} - ${experience.company}\n${formatPeriod(
          experience.startDate,
          experience.endDate,
          experience.current,
        )}\n${experience.description}`,
    ),
  }

  const educationSection: ResumeDocumentSection = {
    title: 'Formacao',
    items: resume.education.map(
      (education) =>
        `${education.course} - ${education.institution}\n${formatPeriod(
          education.startYear,
          education.endYear,
        )}`,
    ),
  }

  const skillsSection: ResumeDocumentSection = {
    title: 'Competencias',
    items: [resume.skills.join(' | ')],
  }

  if (visible.experienceIsSecondary) {
    // first-job: education and skills before experience
    if (visible.hasEducation) sections.push(educationSection)
    if (visible.hasSkills) sections.push(skillsSection)
    if (visible.hasExperience) sections.push(experienceSection)
  } else {
    if (visible.hasExperience) sections.push(experienceSection)
    if (visible.hasEducation) sections.push(educationSection)
    if (visible.hasSkills) sections.push(skillsSection)
  }

  return {
    title: resume.personal.fullName,
    subtitle: resume.personal.headline,
    contactLine: [
      resume.personal.email,
      resume.personal.phone,
      resume.personal.city,
    ]
      .filter(Boolean)
      .join(' | '),
    sections,
  }
}

function breakLongWord(
  word: string,
  font: { widthOfTextAtSize: (value: string, size: number) => number },
  size: number,
  maxWidth: number,
): string[] {
  if (font.widthOfTextAtSize(word, size) <= maxWidth) return [word]
  const parts: string[] = []
  let current = ''
  for (const char of word) {
    if (font.widthOfTextAtSize(current + char, size) > maxWidth) {
      if (current) parts.push(current)
      current = char
    } else {
      current += char
    }
  }
  if (current) parts.push(current)
  return parts
}

function wrapText(
  text: string,
  font: { widthOfTextAtSize: (value: string, size: number) => number },
  size: number,
  maximumWidth: number,
): string[] {
  return text.split('\n').flatMap((paragraph) => {
    const words = paragraph.split(/\s+/).filter(Boolean)
    const lines: string[] = []
    let current = ''

    for (const word of words) {
      const subwords = breakLongWord(word, font, size, maximumWidth)
      for (const sub of subwords) {
        const candidate = current ? `${current} ${sub}` : sub
        if (current && font.widthOfTextAtSize(candidate, size) > maximumWidth) {
          lines.push(current)
          current = sub
        } else {
          current = candidate
        }
      }
    }

    if (current) lines.push(current)
    return lines.length > 0 ? lines : ['']
  })
}

async function renderClassicAts(document: ResumeDocument): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
  const pdf = await PDFDocument.create()
  const regularFont = await pdf.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const pageSize: [number, number] = [595.28, 841.89]
  const margin = 54
  const contentWidth = pageSize[0] - margin * 2
  let page = pdf.addPage(pageSize)
  let y = pageSize[1] - 52

  const addPage = () => {
    page = pdf.addPage(pageSize)
    y = pageSize[1] - 52
  }
  const ensureSpace = (h: number) => { if (y - h < margin) addPage() }

  const draw = (
    value: string, size: number,
    opts: { bold?: boolean; color?: ReturnType<typeof rgb>; leading?: number } = {},
  ) => {
    const font = opts.bold ? boldFont : regularFont
    const leading = opts.leading ?? size * 1.55
    const lines = wrapText(normalizeForPdf(value), font, size, contentWidth)
    ensureSpace(lines.length * leading)
    for (const line of lines) {
      page.drawText(normalizeForPdf(line), { x: margin, y, size, font, color: opts.color ?? rgb(0.1, 0.1, 0.1) })
      y -= leading
    }
  }

  // Header
  draw(document.title, 26, { bold: true, color: rgb(0.08, 0.08, 0.08), leading: 32 })
  draw(document.subtitle, 12, { bold: true, color: rgb(0.3, 0.3, 0.3), leading: 17 })
  draw(document.contactLine, 9, { color: rgb(0.38, 0.38, 0.38), leading: 14 })
  y -= 10
  page.drawLine({ start: { x: margin, y }, end: { x: pageSize[0] - margin, y }, thickness: 0.75, color: rgb(0.65, 0.65, 0.65) })
  y -= 18

  for (const section of document.sections) {
    ensureSpace(50)
    draw(section.title.toUpperCase(), 9.5, { bold: true, color: rgb(0.08, 0.08, 0.08), leading: 13 })
    y -= 2
    page.drawLine({ start: { x: margin, y }, end: { x: pageSize[0] - margin, y }, thickness: 0.5, color: rgb(0.78, 0.78, 0.78) })
    y -= 10

    for (const item of section.items) {
      draw(item, 10, { leading: 15.5 })
      y -= 10
    }
    y -= 6
  }

  return pdf.save()
}

async function renderExecutive(document: ResumeDocument): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
  const pdf = await PDFDocument.create()
  const regularFont = await pdf.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const pageSize: [number, number] = [595.28, 841.89]
  const margin = 52
  const contentWidth = pageSize[0] - margin * 2
  const navy = rgb(0.118, 0.227, 0.373)
  const navyLight = rgb(0.63, 0.74, 0.87)
  const headerHeight = 124
  let page = pdf.addPage(pageSize)
  let y = pageSize[1] - margin

  const addPage = () => { page = pdf.addPage(pageSize); y = pageSize[1] - margin }
  const ensureSpace = (h: number) => { if (y - h < margin) addPage() }

  const draw = (
    value: string, size: number, xPos: number,
    opts: { bold?: boolean; color?: ReturnType<typeof rgb>; leading?: number; width?: number } = {},
  ) => {
    const font = opts.bold ? boldFont : regularFont
    const leading = opts.leading ?? size * 1.55
    const lines = wrapText(normalizeForPdf(value), font, size, opts.width ?? contentWidth)
    ensureSpace(lines.length * leading)
    for (const line of lines) {
      page.drawText(normalizeForPdf(line), { x: xPos, y, size, font, color: opts.color ?? rgb(0.13, 0.18, 0.25) })
      y -= leading
    }
  }

  // Header band
  page.drawRectangle({ x: 0, y: pageSize[1] - headerHeight, width: pageSize[0], height: headerHeight, color: navy })
  // Thin accent strip at bottom of header
  page.drawRectangle({ x: 0, y: pageSize[1] - headerHeight, width: pageSize[0], height: 3, color: rgb(0.39, 0.6, 0.84) })

  const hBase = pageSize[1] - 44
  page.drawText(normalizeForPdf(document.title), { x: margin, y: hBase, size: 26, font: boldFont, color: rgb(1, 1, 1) })
  page.drawText(normalizeForPdf(document.subtitle), { x: margin, y: hBase - 30, size: 12, font: regularFont, color: navyLight })
  page.drawText(normalizeForPdf(document.contactLine), { x: margin, y: hBase - 50, size: 9, font: regularFont, color: rgb(0.62, 0.72, 0.84) })

  y = pageSize[1] - headerHeight - 28

  for (const section of document.sections) {
    ensureSpace(52)
    draw(section.title.toUpperCase(), 10, margin, { bold: true, color: navy, leading: 14 })
    y -= 3
    page.drawLine({ start: { x: margin, y }, end: { x: pageSize[0] - margin, y }, thickness: 1, color: navy })
    y -= 12

    for (const item of section.items) {
      draw(item, 10, margin, { leading: 15.5 })
      y -= 10
    }
    y -= 8
  }

  return pdf.save()
}

async function renderModern(document: ResumeDocument): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
  const pdf = await PDFDocument.create()
  const regularFont = await pdf.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const pageSize: [number, number] = [595.28, 841.89]
  const sidebarWidth = 210
  const sidebarPad = 20
  const sidebarContentW = sidebarWidth - sidebarPad * 2
  const mainX = sidebarWidth + 22
  const mainPad = 34
  const mainWidth = pageSize[0] - mainX - mainPad
  const accentBg = rgb(0.059, 0.298, 0.506)
  const accentText = rgb(0.059, 0.298, 0.506)

  const drawSidebarBg = (p: ReturnType<typeof pdf.addPage>) => {
    p.drawRectangle({ x: 0, y: 0, width: sidebarWidth, height: pageSize[1], color: accentBg })
  }

  let page = pdf.addPage(pageSize)
  drawSidebarBg(page)
  let ySide = pageSize[1] - 44
  let yMain = pageSize[1] - 44

  const drawSide = (value: string, size: number, opts: { bold?: boolean; color?: ReturnType<typeof rgb>; leading?: number } = {}) => {
    const font = opts.bold ? boldFont : regularFont
    const leading = opts.leading ?? size * 1.5
    const lines = wrapText(normalizeForPdf(value), font, size, sidebarContentW)
    for (const line of lines) {
      page.drawText(normalizeForPdf(line), { x: sidebarPad, y: ySide, size, font, color: opts.color ?? rgb(1, 1, 1) })
      ySide -= leading
    }
  }

  const drawMain = (value: string, size: number, opts: { bold?: boolean; color?: ReturnType<typeof rgb>; leading?: number } = {}) => {
    const font = opts.bold ? boldFont : regularFont
    const leading = opts.leading ?? size * 1.55
    const lines = wrapText(normalizeForPdf(value), font, size, mainWidth)
    if (yMain - lines.length * leading < mainPad) {
      page = pdf.addPage(pageSize)
      drawSidebarBg(page)
      yMain = pageSize[1] - 44
    }
    for (const line of lines) {
      page.drawText(normalizeForPdf(line), { x: mainX, y: yMain, size, font, color: opts.color ?? rgb(0.13, 0.18, 0.25) })
      yMain -= leading
    }
  }

  // Sidebar: name block
  drawSide(document.title, 17, { bold: true, leading: 22 })
  ySide -= 4
  drawSide(document.subtitle, 10, { color: rgb(0.72, 0.88, 1), leading: 14 })
  ySide -= 10
  // Contact: one item per line
  for (const contact of document.contactLine.split(' | ')) {
    drawSide(contact, 8.5, { color: rgb(0.85, 0.93, 1), leading: 13 })
  }

  // Sidebar: skills
  const sidebarSections = document.sections.filter(s => s.title === 'Competencias')
  const mainSections = document.sections.filter(s => s.title !== 'Competencias')

  ySide -= 20
  for (const section of sidebarSections) {
    drawSide(section.title.toUpperCase(), 8.5, { bold: true, color: rgb(0.65, 0.85, 1), leading: 13 })
    ySide -= 2
    page.drawLine({ start: { x: sidebarPad, y: ySide }, end: { x: sidebarWidth - sidebarPad, y: ySide }, thickness: 0.5, color: rgb(0.4, 0.65, 0.85) })
    ySide -= 10
    for (const item of section.items) {
      for (const skill of item.split(' | ')) {
        drawSide(`• ${skill.trim()}`, 9, { color: rgb(0.93, 0.97, 1), leading: 14 })
      }
    }
  }

  // Main: sections
  for (const section of mainSections) {
    drawMain(section.title.toUpperCase(), 10, { bold: true, color: accentText, leading: 14 })
    yMain -= 3
    page.drawLine({ start: { x: mainX, y: yMain }, end: { x: pageSize[0] - mainPad, y: yMain }, thickness: 0.75, color: accentText })
    yMain -= 12
    for (const item of section.items) {
      drawMain(item, 10, { leading: 15.5 })
      yMain -= 10
    }
    yMain -= 8
  }

  return pdf.save()
}

async function renderFirstJob(document: ResumeDocument): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
  const pdf = await PDFDocument.create()
  const regularFont = await pdf.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const pageSize: [number, number] = [595.28, 841.89]
  const margin = 54
  const contentWidth = pageSize[0] - margin * 2
  const green = rgb(0.176, 0.416, 0.31)
  const greenMid = rgb(0.22, 0.52, 0.38)
  let page = pdf.addPage(pageSize)
  let y = pageSize[1] - 52

  const addPage = () => { page = pdf.addPage(pageSize); y = pageSize[1] - 52 }
  const ensureSpace = (h: number) => { if (y - h < margin) addPage() }

  const draw = (
    value: string, size: number,
    opts: { bold?: boolean; color?: ReturnType<typeof rgb>; leading?: number } = {},
  ) => {
    const font = opts.bold ? boldFont : regularFont
    const leading = opts.leading ?? size * 1.55
    const lines = wrapText(normalizeForPdf(value), font, size, contentWidth)
    ensureSpace(lines.length * leading)
    for (const line of lines) {
      page.drawText(normalizeForPdf(line), { x: margin, y, size, font, color: opts.color ?? rgb(0.13, 0.18, 0.25) })
      y -= leading
    }
  }

  // Accent left bar
  page.drawRectangle({ x: 0, y: 0, width: 5, height: pageSize[1], color: green })

  // Header
  draw(document.title, 26, { bold: true, color: green, leading: 32 })
  draw(document.subtitle, 12, { bold: true, color: greenMid, leading: 17 })
  draw(document.contactLine, 9, { color: rgb(0.35, 0.42, 0.48), leading: 14 })
  y -= 10
  page.drawLine({ start: { x: margin, y }, end: { x: pageSize[0] - margin, y }, thickness: 1.5, color: green })
  y -= 18

  for (const section of document.sections) {
    ensureSpace(52)
    const isEducation = section.title === 'Formacao'
    draw(section.title.toUpperCase(), isEducation ? 11.5 : 10, { bold: true, color: green, leading: 15 })
    y -= 2
    page.drawLine({ start: { x: margin, y }, end: { x: pageSize[0] - margin, y }, thickness: 0.5, color: rgb(0.6, 0.8, 0.7) })
    y -= 12

    for (const item of section.items) {
      draw(item, 10, { leading: 15.5 })
      y -= 10
    }
    y -= 8
  }

  return pdf.save()
}

async function renderCreative(document: ResumeDocument): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
  const pdf = await PDFDocument.create()
  const regularFont = await pdf.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const pageSize: [number, number] = [595.28, 841.89]
  const margin = 52
  const contentWidth = pageSize[0] - margin * 2
  const purple = rgb(0.482, 0.176, 0.545)
  const purpleLight = rgb(0.88, 0.76, 0.93)
  const headerHeight = 118
  let page = pdf.addPage(pageSize)
  let y = pageSize[1] - margin

  const addPage = () => { page = pdf.addPage(pageSize); y = pageSize[1] - margin }
  const ensureSpace = (h: number) => { if (y - h < margin) addPage() }

  const draw = (
    value: string, size: number,
    opts: { bold?: boolean; color?: ReturnType<typeof rgb>; leading?: number } = {},
  ) => {
    const font = opts.bold ? boldFont : regularFont
    const leading = opts.leading ?? size * 1.55
    const lines = wrapText(normalizeForPdf(value), font, size, contentWidth)
    ensureSpace(lines.length * leading)
    for (const line of lines) {
      page.drawText(normalizeForPdf(line), { x: margin, y, size, font, color: opts.color ?? rgb(0.13, 0.18, 0.25) })
      y -= leading
    }
  }

  // Header band
  page.drawRectangle({ x: 0, y: pageSize[1] - headerHeight, width: pageSize[0], height: headerHeight, color: purple })
  // Bottom accent stripe
  page.drawRectangle({ x: 0, y: pageSize[1] - headerHeight, width: pageSize[0], height: 4, color: purpleLight })

  const hBase = pageSize[1] - 42
  page.drawText(normalizeForPdf(document.title), { x: margin, y: hBase, size: 26, font: boldFont, color: rgb(1, 1, 1) })
  page.drawText(normalizeForPdf(document.subtitle), { x: margin, y: hBase - 30, size: 12, font: regularFont, color: purpleLight })
  page.drawText(normalizeForPdf(document.contactLine), { x: margin, y: hBase - 50, size: 9, font: regularFont, color: rgb(0.86, 0.74, 0.93) })

  y = pageSize[1] - headerHeight - 28

  for (const section of document.sections) {
    ensureSpace(52)
    // Colored label pill background
    page.drawRectangle({ x: margin - 6, y: y - 2, width: contentWidth + 12, height: 16, color: rgb(0.96, 0.91, 0.98) })
    draw(section.title.toUpperCase(), 10, { bold: true, color: purple, leading: 14 })
    y -= 3
    page.drawLine({ start: { x: margin, y }, end: { x: pageSize[0] - margin, y }, thickness: 1.5, color: purple })
    y -= 12

    for (const item of section.items) {
      draw(item, 10, { leading: 15.5 })
      y -= 10
    }
    y -= 8
  }

  return pdf.save()
}

export const renderResumePdf: ResumePdfRenderer = async (document, templateId = 'classic-ats') => {
  switch (templateId) {
    case 'executive':
      return renderExecutive(document)
    case 'modern':
      return renderModern(document)
    case 'first-job':
      return renderFirstJob(document)
    case 'creative':
      return renderCreative(document)
    case 'classic-ats':
    default:
      return renderClassicAts(document)
  }
}

export async function createResumePdf(
  resume: ResumeData,
  templateId: TemplateId = 'classic-ats',
  renderer: ResumePdfRenderer = renderResumePdf,
): Promise<Uint8Array> {
  return renderer(buildResumeDocument(resume, templateId), templateId)
}
