import QRCode, { type QRCodeToDataURLOptions } from 'qrcode'

export type QrEncoder = (
  payload: string,
  options: QRCodeToDataURLOptions,
) => Promise<string>

const qrPngOptions: QRCodeToDataURLOptions = {
  errorCorrectionLevel: 'M',
  margin: 2,
  width: 640,
  color: {
    dark: '#061A35',
    light: '#FFFFFFFF',
  },
}

export async function createQrPng(
  payload: string,
  encoder: QrEncoder = QRCode.toDataURL,
): Promise<string> {
  if (!payload.trim()) {
    throw new Error('Não foi possível gerar um QR Code vazio')
  }

  return encoder(payload, qrPngOptions)
}
