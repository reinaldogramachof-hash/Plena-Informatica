export function buildWhatsappUrl(message: string) {
  return `https://api.whatsapp.com/send?phone=5512981144676&text=${encodeURIComponent(message)}`
}
