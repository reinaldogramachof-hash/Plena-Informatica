import { useState } from 'react'

import './menu-builder.css'

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

export interface MenuBuilderToolProps {
  generatePdf?: (data: MenuData, options: MenuOptions) => Promise<Uint8Array>
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function createCategory(): MenuCategory {
  return { id: createId('cat'), name: '', items: [] }
}

function createItem(): MenuItemData {
  return { id: createId('item'), name: '', description: '', price: '' }
}

export function MenuBuilderTool({
  generatePdf = async () => new Uint8Array(),
}: MenuBuilderToolProps) {
  const [establishment, setEstablishment] = useState('')
  const [slogan, setSlogan] = useState('')
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [pageSize, setPageSize] = useState<'a4' | 'half'>('a4')
  const [columns, setColumns] = useState<1 | 2>(1)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const hasData = establishment.trim().length > 0 && categories.length > 0

  function addCategory() {
    setCategories((prev) => [...prev, createCategory()])
  }

  function removeCategory(categoryId: string) {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId))
  }

  function updateCategoryName(categoryId: string, name: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, name } : c)),
    )
  }

  function addItem(categoryId: string) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, items: [...c.items, createItem()] } : c,
      ),
    )
  }

  function removeItem(categoryId: string, itemId: string) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
          : c,
      ),
    )
  }

  function updateItem(
    categoryId: string,
    itemId: string,
    field: keyof Omit<MenuItemData, 'id'>,
    value: string,
  ) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, [field]: value } : i,
              ),
            }
          : c,
      ),
    )
  }

  async function handleGenerate() {
    if (!hasData || isProcessing) return
    setError('')
    setIsProcessing(true)
    try {
      const data: MenuData = { establishment, slogan, categories }
      const options: MenuOptions = { pageSize, columns }
      await generatePdf(data, options)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível gerar o cardápio. Tente novamente.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <section className="mb-tool" aria-labelledby="mb-title">
      <div className="mb-intro">
        <h2 id="mb-title">Gerador de Cardápio</h2>
        <p className="mb-subtitle">
          Crie o layout do seu cardápio e baixe em PDF para impressão.
        </p>
      </div>

      <p className="mb-privacy-notice">
        Processamento 100% local — nenhum arquivo ou dado sai do seu dispositivo.
      </p>

      {/* Dados do estabelecimento */}
      <fieldset className="mb-fieldset">
        <legend className="mb-legend">Dados do estabelecimento</legend>
        <div className="mb-fields">
          <label className="mb-label">
            Nome do estabelecimento *
            <input
              aria-label="Nome do estabelecimento *"
              className="mb-input"
              maxLength={100}
              onChange={(e) => setEstablishment(e.target.value)}
              placeholder="Ex.: Restaurante Sabor do Sol"
              type="text"
              value={establishment}
            />
          </label>
          <label className="mb-label">
            Slogan ou frase de destaque
            <input
              aria-label="Slogan ou frase de destaque"
              className="mb-input"
              maxLength={150}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="Ex.: O sabor que aquece sua alma"
              type="text"
              value={slogan}
            />
          </label>
        </div>
      </fieldset>

      {/* Categorias e itens */}
      <fieldset className="mb-fieldset">
        <legend className="mb-legend">Categorias e itens</legend>

        {categories.length === 0 && (
          <div className="mb-empty-state" aria-label="Estado vazio">
            <svg
              aria-hidden="true"
              className="mb-empty-icon"
              fill="none"
              height="48"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12h6M9 16h4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mb-empty-text">
              Adicione pelo menos uma categoria para gerar o cardápio.
            </p>
          </div>
        )}

        {categories.map((category, catIndex) => (
          <div className="mb-category" key={category.id}>
            <div className="mb-category-header">
              <label className="mb-label mb-label--inline">
                <span className="mb-category-label">
                  Categoria {catIndex + 1}
                </span>
                <input
                  aria-label={`Nome da categoria ${catIndex + 1}`}
                  className="mb-input"
                  maxLength={80}
                  onChange={(e) =>
                    updateCategoryName(category.id, e.target.value)
                  }
                  placeholder="Ex.: Entradas, Pratos principais, Bebidas"
                  type="text"
                  value={category.name}
                />
              </label>
              <button
                aria-label={`Remover categoria ${catIndex + 1}`}
                className="mb-btn mb-btn--danger"
                onClick={() => removeCategory(category.id)}
                type="button"
              >
                Remover categoria
              </button>
            </div>

            <div className="mb-items-list">
              {category.items.map((item, itemIndex) => (
                <div className="mb-item-row" key={item.id}>
                  <div className="mb-item-fields">
                    <label className="mb-label">
                      <span className="mb-sr-only">
                        Nome do item {itemIndex + 1}
                      </span>
                      <input
                        aria-label={`Nome do item ${itemIndex + 1}`}
                        className="mb-input"
                        maxLength={100}
                        onChange={(e) =>
                          updateItem(
                            category.id,
                            item.id,
                            'name',
                            e.target.value,
                          )
                        }
                        placeholder="Nome do item"
                        type="text"
                        value={item.name}
                      />
                    </label>
                    <label className="mb-label">
                      <span className="mb-sr-only">
                        Descrição do item {itemIndex + 1}
                      </span>
                      <input
                        aria-label={`Descrição do item ${itemIndex + 1}`}
                        className="mb-input"
                        maxLength={200}
                        onChange={(e) =>
                          updateItem(
                            category.id,
                            item.id,
                            'description',
                            e.target.value,
                          )
                        }
                        placeholder="Descrição breve (opcional)"
                        type="text"
                        value={item.description}
                      />
                    </label>
                    <label className="mb-label mb-label--price">
                      <span className="mb-sr-only">
                        Preço do item {itemIndex + 1}
                      </span>
                      <input
                        aria-label={`Preço do item ${itemIndex + 1}`}
                        className="mb-input"
                        maxLength={30}
                        onChange={(e) =>
                          updateItem(
                            category.id,
                            item.id,
                            'price',
                            e.target.value,
                          )
                        }
                        placeholder="R$ 0,00"
                        type="text"
                        value={item.price}
                      />
                    </label>
                  </div>
                  <button
                    aria-label={`Remover item ${itemIndex + 1}`}
                    className="mb-btn mb-btn--remove-item"
                    onClick={() => removeItem(category.id, item.id)}
                    type="button"
                  >
                    Remover item
                  </button>
                </div>
              ))}
            </div>

            <button
              className="mb-btn mb-btn--add-item"
              onClick={() => addItem(category.id)}
              type="button"
            >
              + Adicionar item
            </button>
          </div>
        ))}

        <button
          className="mb-btn mb-btn--add-category"
          onClick={addCategory}
          type="button"
        >
          + Adicionar categoria
        </button>
      </fieldset>

      {/* Formato */}
      <fieldset className="mb-fieldset">
        <legend className="mb-legend">Formato</legend>
        <div className="mb-format-options">
          <div className="mb-radio-group">
            <span className="mb-radio-label">Tamanho:</span>
            <label className="mb-radio">
              <input
                checked={pageSize === 'a4'}
                name="mb-page-size"
                onChange={() => setPageSize('a4')}
                type="radio"
                value="a4"
              />
              A4
            </label>
            <label className="mb-radio">
              <input
                checked={pageSize === 'half'}
                name="mb-page-size"
                onChange={() => setPageSize('half')}
                type="radio"
                value="half"
              />
              Meio sulfite
            </label>
          </div>
          <div className="mb-radio-group">
            <span className="mb-radio-label">Colunas:</span>
            <label className="mb-radio">
              <input
                checked={columns === 1}
                name="mb-columns"
                onChange={() => setColumns(1)}
                type="radio"
                value="1"
              />
              1 coluna
            </label>
            <label className="mb-radio">
              <input
                checked={columns === 2}
                name="mb-columns"
                onChange={() => setColumns(2)}
                type="radio"
                value="2"
              />
              2 colunas
            </label>
          </div>
        </div>
      </fieldset>

      {/* Aviso Plena */}
      <p className="mb-plena-notice">
        Para impressão e plastificação profissional, leve o arquivo à Plena.
      </p>

      {/* Ações */}
      <div className="mb-actions">
        <button
          className="mb-btn mb-btn--primary"
          disabled={!hasData || isProcessing}
          onClick={handleGenerate}
          type="button"
        >
          {isProcessing ? 'Processando...' : 'Gerar cardápio em PDF'}
        </button>
      </div>

      {error && (
        <p className="mb-error" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}
