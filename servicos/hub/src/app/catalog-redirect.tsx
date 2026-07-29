import { useEffect } from 'react'

import { redirectToPublicCatalog } from './catalog-redirect-target'

export function CatalogRedirect() {
  useEffect(() => {
    redirectToPublicCatalog()
  }, [])

  return <div aria-live="polite">Redirecionando para o catalogo publico...</div>
}
