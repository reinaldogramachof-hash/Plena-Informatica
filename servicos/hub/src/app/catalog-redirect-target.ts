export function redirectToPublicCatalog(location: Pick<Location, 'href' | 'origin'> = window.location) {
  const target = new URL('/servicos/servicos.html', location.origin).toString()
  location.href = target
  return target
}
