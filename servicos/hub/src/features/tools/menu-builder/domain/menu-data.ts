// Tipos e validações do Gerador de Cardápio

export interface MenuItemData {
  id: string
  name: string
  description: string
  price: string
}

export interface MenuCategory {
  id: string
  name: string
  items: MenuItemData[]
}

export interface MenuData {
  establishment: string
  slogan: string
  categories: MenuCategory[]
}

export interface MenuOptions {
  pageSize: 'a4' | 'half'
  columns: 1 | 2
}

export interface ValidationError {
  field: string
  message: string
}

/**
 * Remove categorias sem itens válidos e itens sem nome.
 * Retorna uma cópia normalizada pronta para o gerador de PDF.
 */
export function filterValidCategories(categories: MenuCategory[]): MenuCategory[] {
  return categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.name.trim().length > 0),
    }))
    .filter((cat) => cat.items.length > 0)
}

/**
 * Valida os dados do cardápio antes de gerar o PDF.
 * Retorna lista vazia se tudo estiver correto.
 */
export function validateMenuData(data: MenuData): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.establishment.trim()) {
    errors.push({
      field: 'establishment',
      message: 'Nome do estabelecimento e obrigatorio.',
    })
  }

  const validCats = filterValidCategories(data.categories)
  if (validCats.length === 0) {
    errors.push({
      field: 'categories',
      message: 'Adicione pelo menos uma categoria com um item nomeado.',
    })
  }

  return errors
}
