import { useMemo, useState } from 'react'

import {
  buildDeclaration,
  type DeclarationDocument,
} from '../domain/build-declaration'
import { createDeclarationPdf } from '../domain/create-declaration-pdf'
import {
  parseDeclarationData,
  type DeclarationValues,
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
  const template = getDeclarationTemplate(templateId)

  const preview = useMemo(() => {
    try {
      return buildDeclaration(parseDeclarationData(templateId, values))
    } catch {
      return null
    }
  }, [templateId, values])

  function selectTemplate(nextTemplate: DeclarationTemplateId) {
    setTemplateId(nextTemplate)
    setValues({})
    setError('')
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
      const blob = new Blob([bytes.buffer as ArrayBuffer], {
        type: 'application/pdf',
      })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'plena-declaracao.pdf'
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
