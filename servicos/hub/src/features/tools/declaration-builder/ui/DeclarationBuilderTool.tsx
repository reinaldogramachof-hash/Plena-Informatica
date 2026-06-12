import { useMemo, useState } from 'react'

import {
  buildDeclaration,
  type DeclarationDocument,
} from '../domain/build-declaration'
import { createDeclarationPdf } from '../domain/create-declaration-pdf'
import {
  parseDeclarationData,
  type DeclarationValues,
  type RawQuoteItem,
} from '../domain/declaration-data'
import {
  declarationTemplates,
  getDeclarationTemplate,
  type DeclarationField,
  type DeclarationFieldSection,
  type DeclarationTemplateId,
} from '../domain/declaration-templates'
import './declaration-builder.css'

type DeclarationBuilderToolProps = {
  generatePdf?: (document: DeclarationDocument) => Promise<Uint8Array>
}

const sections: Array<{
  id: DeclarationFieldSection
  title: string
}> = [
  { id: 'identification', title: 'Identificação' },
  { id: 'details', title: 'Informações da declaração' },
  { id: 'finalization', title: 'Finalização' },
]

function DeclarationControl({
  field,
  value,
  onChange,
}: {
  field: DeclarationField
  value: string
  onChange: (value: string) => void
}) {
  const optionalLabel = field.required ? '' : ' (opcional)'

  return (
    <label>
      {field.label}
      {optionalLabel}
      {field.required && <strong aria-hidden="true"> *</strong>}
      {field.type === 'textarea' ? (
        <textarea
          aria-label={field.label}
          maxLength={field.maxLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          rows={field.id === 'content' ? 9 : 4}
          value={value}
        />
      ) : field.type === 'select' ? (
        <select
          aria-label={field.label}
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          <option value="">Selecione</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          aria-label={field.label}
          maxLength={field.maxLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          type={field.type}
          value={value}
        />
      )}
    </label>
  )
}

export function DeclarationBuilderTool({
  generatePdf = createDeclarationPdf,
}: DeclarationBuilderToolProps) {
  const [templateId, setTemplateId] =
    useState<DeclarationTemplateId>('residence')
  const [values, setValues] = useState<DeclarationValues>({})
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [quoteItems, setQuoteItems] = useState<RawQuoteItem[]>([
    { description: '', quantity: '', unitPrice: '' },
  ])
  const template = getDeclarationTemplate(templateId)

  const preview = useMemo(() => {
    try {
      return buildDeclaration(
        parseDeclarationData(
          templateId,
          values,
          templateId === 'quote' ? quoteItems : undefined,
        ),
      )
    } catch {
      return null
    }
  }, [templateId, values, quoteItems])

  function selectTemplate(nextTemplate: DeclarationTemplateId) {
    setTemplateId(nextTemplate)
    setValues({})
    setError('')
    setQuoteItems([{ description: '', quantity: '', unitPrice: '' }])
  }

  function updateValue(fieldId: string, value: string) {
    setValues((current) => ({ ...current, [fieldId]: value }))
    setError('')
  }

  async function handleDownload() {
    if (isGenerating || !preview) return
    setError('')

    try {
      setIsGenerating(true)
      const bytes = await generatePdf(preview)
      const blob = new Blob([bytes as unknown as BlobPart], {
        type: 'application/pdf',
      })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = templateId === 'quote' ? 'plena-orcamento.pdf' : 'plena-declaracao.pdf'
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível gerar a declaração',
      )
    } finally {
      setIsGenerating(false)
    }
  }

  function addQuoteItem() {
    setQuoteItems((current) => [
      ...current,
      { description: '', quantity: '', unitPrice: '' },
    ])
  }

  function removeQuoteItem(index: number) {
    setQuoteItems((current) => current.filter((_, i) => i !== index))
  }

  function updateQuoteItem(
    index: number,
    field: keyof RawQuoteItem,
    value: string,
  ) {
    setQuoteItems((current) =>
      current.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
    setError('')
  }

  const quoteTotal = quoteItems.reduce((sum, item) => {
    const qty = parseFloat(item.quantity.replace(',', '.')) || 0
    const price = parseFloat(item.unitPrice.replace(',', '.')) || 0
    return sum + qty * price
  }, 0)

  const previewDocument: DeclarationDocument = preview ?? {
    title:
      templateId === 'custom'
        ? values.title || 'Declaração personalizada'
        : template.name,
    paragraphs: [
      'Preencha os campos obrigatórios para visualizar o texto final do documento.',
    ],
    locationDate: '',
    signatureName: '',
    signatureLabel: '',
    signatureDocument: '',
    footerNote:
      'O documento final incluirá uma orientação sobre assinatura, aceitação e responsabilidade pelas informações.',
  }

  return (
    <section
      className="declaration-builder"
      aria-labelledby="declaration-builder-title"
    >
      <div className="declaration-builder__intro">
        <span className="eyebrow">Ferramenta local</span>
        <h2 id="declaration-builder-title">Gerador de Declarações</h2>
        <p>
          Escolha um modelo, preencha as informações com atenção e revise o
          documento antes de baixar.
        </p>
      </div>

      <p className="declaration-builder__privacy">
        <strong>Seus dados permanecem neste navegador.</strong> Nenhuma
        informação é enviada para a Plena ou para o Supabase.
      </p>

      <div
        className="declaration-builder__templates"
        aria-label="Modelos de documentos"
      >
        {declarationTemplates.map((item) => (
          <article
            className={
              item.id === templateId
                ? 'declaration-template is-selected'
                : 'declaration-template'
            }
            key={item.id}
          >
            <span>{item.shortDescription}</span>
            <h3>{item.name}</h3>
            <div className="declaration-template__guidance">
              <strong>Indicado para</strong>
              <p>{item.recommendation}</p>
              <strong>Não indicado para</strong>
              <p>{item.notRecommendedFor}</p>
            </div>
            <button
              aria-label={`Usar modelo ${item.name}`}
              aria-pressed={item.id === templateId}
              onClick={() => selectTemplate(item.id)}
              type="button"
            >
              {item.id === templateId ? 'Modelo selecionado' : 'Usar modelo'}
            </button>
          </article>
        ))}
      </div>

      <div className="declaration-builder__workspace">
        <div className="declaration-builder__form">
          <div className="declaration-builder__form-heading">
            <span>Preenchimento orientado</span>
            <h3>{template.name}</h3>
          </div>

          <div className="declaration-builder__usage-note">
            <strong>Uso responsável</strong>
            <p>{template.notRecommendedFor}</p>
          </div>

          {sections.map((section) => {
            const fields = template.fields.filter(
              (item) => item.section === section.id,
            )
            if (!fields.length) return null

            return (
              <fieldset key={section.id}>
                <legend>{section.title}</legend>
                <div className="declaration-builder__fields">
                  {fields.map((field) => (
                    <DeclarationControl
                      field={field}
                      key={field.id}
                      onChange={(value) => updateValue(field.id, value)}
                      value={values[field.id] ?? ''}
                    />
                  ))}
                </div>
              </fieldset>
            )
          })}

          <p className="declaration-builder__required">
            * Campos obrigatórios. Os demais são opcionais e só aparecem no
            documento quando preenchidos.
          </p>

          {templateId === 'quote' && (
            <fieldset>
              <legend>Itens do orçamento</legend>
              <div className="declaration-builder__fields">
                {quoteItems.map((item, index) => (
                  <div className="declaration-builder__quote-item" key={index}>
                    <label>
                      Descrição *<strong aria-hidden="true"> *</strong>
                      <input
                        aria-label={`Descrição do item ${index + 1}`}
                        maxLength={200}
                        onChange={(event) =>
                          updateQuoteItem(index, 'description', event.target.value)
                        }
                        placeholder="Ex.: Impressão A4 PB"
                        type="text"
                        value={item.description}
                      />
                    </label>
                    <label>
                      Quantidade *<strong aria-hidden="true"> *</strong>
                      <input
                        aria-label={`Quantidade do item ${index + 1}`}
                        maxLength={10}
                        onChange={(event) =>
                          updateQuoteItem(index, 'quantity', event.target.value)
                        }
                        placeholder="Ex.: 100"
                        type="text"
                        value={item.quantity}
                      />
                    </label>
                    <label>
                      Valor unitário (R$) *<strong aria-hidden="true"> *</strong>
                      <input
                        aria-label={`Valor unitário do item ${index + 1}`}
                        maxLength={15}
                        onChange={(event) =>
                          updateQuoteItem(index, 'unitPrice', event.target.value)
                        }
                        placeholder="Ex.: 3,00"
                        type="text"
                        value={item.unitPrice}
                      />
                    </label>
                    {quoteItems.length > 1 && (
                      <button
                        aria-label={`Remover item ${index + 1}`}
                        onClick={() => removeQuoteItem(index)}
                        type="button"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
                <button
                  aria-label="Adicionar item"
                  onClick={addQuoteItem}
                  type="button"
                >
                  + Adicionar item
                </button>
                <p className="declaration-builder__quote-total">
                  Total estimado:{' '}
                  <strong>
                    {quoteTotal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </p>
              </div>
            </fieldset>
          )}


          {error && <p role="alert">{error}</p>}

          {!preview && (
            <p className="declaration-builder__download-help">
              Preencha os campos obrigatórios para liberar o download e a prévia
              completa.
            </p>
          )}

          <button
            className="declaration-builder__submit"
            disabled={isGenerating || !preview}
            onClick={handleDownload}
            type="button"
          >
            {isGenerating ? 'Gerando PDF...' : 'Baixar PDF'}
          </button>
        </div>

        <aside className="declaration-preview" aria-label="Prévia do documento">
          <div className="declaration-preview__toolbar">
            <strong>Prévia A4</strong>
            <span>{template.name}</span>
          </div>
          <article className="declaration-preview__paper">
            <h2>{previewDocument.title}</h2>
            <div className="declaration-preview__content">
              {previewDocument.paragraphs.map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
              ))}
            </div>
            {previewDocument.table && (
              <div className="declaration-preview__table">
                <table>
                  <thead>
                    <tr>
                      {previewDocument.table.headers.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewDocument.table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}>{previewDocument.table.totalLabel}</td>
                      <td>{previewDocument.table.totalValue}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
            <div className="declaration-preview__signature">
              <p>{previewDocument.locationDate}</p>
              <div className="declaration-preview__signature-line" />
              <strong>{previewDocument.signatureName || 'Assinatura'}</strong>
              <span>{previewDocument.signatureLabel}</span>
              {previewDocument.signatureDocument && (
                <span>{previewDocument.signatureDocument}</span>
              )}
            </div>
            <footer className="declaration-preview__footer">
              {previewDocument.footerNote}
            </footer>
          </article>
        </aside>
      </div>
    </section>
  )
}
