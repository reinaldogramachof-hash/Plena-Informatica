export interface PixPayloadData {
  key: string
  merchantName: string
  merchantCity: string
  amount?: number
}

export function crc16(data: string): string {
  let crc = 0xffff
  for (let i = 0; i < data.length; i++) {
    const byte = data.charCodeAt(i)
    crc ^= byte << 8
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff
      } else {
        crc = (crc << 1) & 0xffff
      }
    }
  }
  const hex = crc.toString(16).toUpperCase()
  return hex.padStart(4, '0')
}

export function normalizePixText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '') // apenas letras, números e espaços
}

export function formatEMV(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0')
  return `${id}${len}${value}`
}

export function buildPixPayload(data: PixPayloadData): string {
  // 1. Payload Format Indicator
  let payload = formatEMV('00', '01')

  // 2. Point of Initiation Method (12 = estático)
  payload += formatEMV('01', '12')

  // 3. Merchant Account Information - Chave Pix
  const gui = formatEMV('00', 'br.gov.bcb.pix')
  const key = formatEMV('01', data.key.trim())
  payload += formatEMV('26', gui + key)

  // 4. Merchant Category Code
  payload += formatEMV('52', '0000')

  // 5. Transaction Currency (986 = BRL)
  payload += formatEMV('53', '986')

  // 6. Transaction Amount (se fornecido)
  if (data.amount !== undefined && data.amount > 0) {
    // Duas casas decimais, ex: 10.50
    const amountStr = data.amount.toFixed(2)
    payload += formatEMV('54', amountStr)
  }

  // 7. Country Code
  payload += formatEMV('58', 'BR')

  // 8. Merchant Name
  const cleanName = normalizePixText(data.merchantName).slice(0, 25).trim()
  payload += formatEMV('59', cleanName || 'RECEBEDOR')

  // 9. Merchant City
  const cleanCity = normalizePixText(data.merchantCity).slice(0, 15).trim()
  payload += formatEMV('60', cleanCity || 'CIDADE')

  // 10. Additional Data Field Template
  payload += formatEMV('62', formatEMV('05', '***'))

  // 11. CRC16
  const preCrc = payload + '6304'
  const calculatedCrc = crc16(preCrc)
  
  return preCrc + calculatedCrc
}
