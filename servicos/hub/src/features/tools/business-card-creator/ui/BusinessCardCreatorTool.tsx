import { useState } from 'react'

import './business-card-creator.css'

export type CardStyle = 'classic' | 'modern' | 'colorful'

export interface CardData {
  fullName: string
  role: string
  phone: string
  email: string
  website: string
  city: string
  company: string
}

export interface BusinessCardCreatorToolProps {
  generatePdf?: (data: CardData, style: CardStyle) => Promise<Uint8Array>
}

const initialData: CardData = {
  fullName: '',
  role: '',
  phone: '',
  email: '',
  website: '',
  city: '',
  company: '',
}

export function BusinessCardCreatorTool({
  generatePdf = async () => new Uint8Array(),
}: BusinessCardCreatorToolProps) {
  const [data, setData] = useState<CardData>(initialData)
  const [style, setStyle] = useState<CardStyle>('classic')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const hasName = data.fullName.trim().length > 0

  function updateField(field: keyof CardData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleDownload() {
    if (!hasName || isProcessing) return
    setError('')
    setIsProcessing(true)
    try {
      await generatePdf(data, style)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível gerar o PDF. Tente novamente.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  const previewClass = [
    'bcc-card-preview',
    style === 'classic' ? 'bcc-card-preview--classic' : '',
    style === 'modern' ? 'bcc-card-preview--modern' : '',
    style === 'colorful' ? 'bcc-card-preview--colorful' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className="bcc-tool" aria-labelledby="bcc-title">
      <div className="bcc-intro">
        <h2 id="bcc-title">Gerador de Cartão de Visitas</h2>
        <p className="bcc-subtitle">
          Crie o layout digital e leve para impressão na Plena.
        </p>
      </div>

      <p className="bcc-privacy-notice">
        Processamento 100% local — nenhum arquivo ou dado sai do seu dispositivo.
      </p>

      <div className="bcc-workspace">
        {/* Editor */}
        <div className="bcc-editor">
          <fieldset className="bcc-fieldset">
            <legend className="bcc-legend">Dados do cartão</legend>
            <div className="bcc-fields">
              <label className="bcc-label">
                Nome completo *
                <input
                  aria-label="Nome completo *"
                  className="bcc-input"
                  maxLength={80}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Ex.: Ana Paula Souza"
                  type="text"
                  value={data.fullName}
                />
              </label>
              <label className="bcc-label">
                Cargo / profissão
                <input
                  aria-label="Cargo / profissão"
                  className="bcc-input"
                  maxLength={80}
                  onChange={(e) => updateField('role', e.target.value)}
                  placeholder="Ex.: Contadora"
                  type="text"
                  value={data.role}
                />
              </label>
              <label className="bcc-label">
                Telefone / WhatsApp
                <input
                  aria-label="Telefone / WhatsApp"
                  className="bcc-input"
                  maxLength={30}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(12) 99999-0000"
                  type="tel"
                  value={data.phone}
                />
              </label>
              <label className="bcc-label">
                E-mail
                <input
                  aria-label="E-mail"
                  className="bcc-input"
                  maxLength={100}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="contato@exemplo.com"
                  type="email"
                  value={data.email}
                />
              </label>
              <label className="bcc-label">
                Site ou Instagram
                <input
                  aria-label="Site ou Instagram"
                  className="bcc-input"
                  maxLength={100}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="@perfil ou www.site.com"
                  type="text"
                  value={data.website}
                />
              </label>
              <label className="bcc-label">
                Cidade / Estado
                <input
                  aria-label="Cidade / Estado"
                  className="bcc-input"
                  maxLength={80}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="São José dos Campos - SP"
                  type="text"
                  value={data.city}
                />
              </label>
              <label className="bcc-label">
                Nome da empresa (opcional)
                <input
                  aria-label="Nome da empresa (opcional)"
                  className="bcc-input"
                  maxLength={80}
                  onChange={(e) => updateField('company', e.target.value)}
                  placeholder="Ex.: Plena Informática"
                  type="text"
                  value={data.company}
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="bcc-fieldset">
            <legend className="bcc-legend">Estilo</legend>
            <div className="bcc-style-options">
              <label className="bcc-style-option">
                <input
                  checked={style === 'classic'}
                  name="bcc-style"
                  onChange={() => setStyle('classic')}
                  type="radio"
                  value="classic"
                />
                <span className="bcc-style-label">Clássico</span>
                <span className="bcc-style-desc">
                  Fundo branco, texto escuro
                </span>
              </label>
              <label className="bcc-style-option">
                <input
                  checked={style === 'modern'}
                  name="bcc-style"
                  onChange={() => setStyle('modern')}
                  type="radio"
                  value="modern"
                />
                <span className="bcc-style-label">Moderno</span>
                <span className="bcc-style-desc">
                  Fundo azul escuro, texto branco
                </span>
              </label>
              <label className="bcc-style-option">
                <input
                  checked={style === 'colorful'}
                  name="bcc-style"
                  onChange={() => setStyle('colorful')}
                  type="radio"
                  value="colorful"
                />
                <span className="bcc-style-label">Colorido</span>
                <span className="bcc-style-desc">
                  Fundo âmbar, texto branco
                </span>
              </label>
            </div>
            <p className="bcc-print-note">
              A Plena imprime 100 cartões por R$&nbsp;50,00.
            </p>
          </fieldset>

          <div className="bcc-actions">
            <button
              className="bcc-btn bcc-btn--primary"
              disabled={!hasName || isProcessing}
              onClick={handleDownload}
              type="button"
            >
              {isProcessing ? 'Processando...' : 'Baixar como PDF'}
            </button>
            <button
              className="bcc-btn bcc-btn--secondary"
              onClick={handlePrint}
              type="button"
            >
              Imprimir prévia
            </button>
          </div>

          {error && (
            <p className="bcc-error" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Prévia */}
        <div className="bcc-preview-area">
          <p className="bcc-preview-label">Prévia</p>
          <div className={previewClass} aria-label="Prévia do cartão de visitas">
            <div className="bcc-card-inner">
              {data.company && (
                <p className="bcc-card-company">{data.company}</p>
              )}
              <p className="bcc-card-name">
                {data.fullName || 'Seu nome'}
              </p>
              {data.role && (
                <p className="bcc-card-role">{data.role}</p>
              )}
              <div className="bcc-card-contacts">
                {data.phone && (
                  <span className="bcc-card-contact">{data.phone}</span>
                )}
                {data.email && (
                  <span className="bcc-card-contact">{data.email}</span>
                )}
                {data.website && (
                  <span className="bcc-card-contact">{data.website}</span>
                )}
                {data.city && (
                  <span className="bcc-card-contact">{data.city}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
