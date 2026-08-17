export function buildWhatsappUrl(message: string) {
  return `https://api.whatsapp.com/send?phone=5512992191018&text=${encodeURIComponent(message)}`
}
