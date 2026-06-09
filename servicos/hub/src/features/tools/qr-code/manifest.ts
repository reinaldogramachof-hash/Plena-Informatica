import type { ToolManifest } from '../types'

export const qrCodeManifest: ToolManifest = {
  slug: 'qr-code',
  name: 'Gerador de QR Code',
  shortDescription:
    'Crie QR Codes para links, Pix, WhatsApp, telefone e redes Wi-Fi.',
  category: 'utilities',
  processing: 'local',
  accountRequirement: 'none',
  persistence: 'none',
  status: 'building',
  roadmapOrder: 1,
}
