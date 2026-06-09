import { useState, type FormEvent } from 'react'

import {
  buildQrPayload,
  MAX_QR_CONTENT_LENGTH,
  type QrInput,
  type QrMode,
} from '../domain/qr-payload'
import { createQrPng } from '../domain/qr-image'

type QrCodeToolProps = {
  generateImage?: (payload: string) => Promise<string>
}

type FormState = {
  url: string
  text: string
  phone: string
  message: string
  security: 'WPA' | 'WEP' | 'nopass'
  ssid: string
  password: string
  hidden: boolean
  pixPayload: string
}

const modes: Array<{ id: QrMode; label: string }> = [
  { id: 'link', label: 'Link' },
  { id: 'text', label: 'Texto' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'phone', label: 'Telefone' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'pix', label: 'Pix Copia e Cola' },
]

const initialForm: FormState = {
  url: '',
  text: '',
  phone: '',
  message: '',
  security: 'WPA',
  ssid: '',
  password: '',
  hidden: false,
  pixPayload: '',
}

function getQrInput(mode: QrMode, form: FormState): QrInput {
  switch (mode) {
    case 'link':
      return { mode, url: form.url }
    case 'text':
      return { mode, text: form.text }
    case 'whatsapp':
      return { mode, phone: form.phone, message: form.message }
    case 'phone':
      return { mode, phone: form.phone }
    case 'wifi':
      return {
        mode,
        security: form.security,
        ssid: form.ssid,
        password: form.password,
        hidden: form.hidden,
      }
    case 'pix':
      return { mode, payload: form.pixPayload }
  }
}

export function QrCodeTool({ generateImage = createQrPng }: QrCodeToolProps) {
  const [mode, setMode] = useState<QrMode>('link')
  const [form, setForm] = useState<FormState>(initialForm)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  function selectMode(nextMode: QrMode) {
    setMode(nextMode)
    setPreview('')
    setError('')
  }

  function updateForm<Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPreview('')

    try {
      const payload = buildQrPayload(getQrInput(mode, form))
      setIsGenerating(true)
      setPreview(await generateImage(payload))
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível gerar o QR Code',
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="qr-tool" aria-labelledby="qr-tool-title">
      <div className="qr-tool__intro">
        <span className="eyebrow">Ferramenta local</span>
        <h2 id="qr-tool-title">Monte seu QR Code</h2>
        <p>
          Escolha o tipo de conteúdo, preencha os dados e baixe a imagem em
          PNG.
        </p>
      </div>

      <div className="qr-tool__workspace">
        <form className="qr-form" onSubmit={handleSubmit}>
          <div className="qr-mode-list" aria-label="Tipo de QR Code">
            {modes.map((item) => (
              <button
                aria-pressed={mode === item.id}
                className={mode === item.id ? 'is-active' : ''}
                key={item.id}
                onClick={() => selectMode(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="qr-fields">
            {mode === 'link' && (
              <label>
                Link
                <input
                  inputMode="url"
                  onChange={(event) => updateForm('url', event.target.value)}
                  placeholder="https://seusite.com.br"
                  type="url"
                  value={form.url}
                />
              </label>
            )}

            {mode === 'text' && (
              <label>
                Texto
                <textarea
                  maxLength={MAX_QR_CONTENT_LENGTH}
                  onChange={(event) => updateForm('text', event.target.value)}
                  placeholder="Digite o conteúdo que será exibido"
                  rows={6}
                  value={form.text}
                />
              </label>
            )}

            {mode === 'whatsapp' && (
              <>
                <label>
                  Telefone com DDD e país
                  <input
                    inputMode="tel"
                    onChange={(event) =>
                      updateForm('phone', event.target.value)
                    }
                    placeholder="5511999999999"
                    type="tel"
                    value={form.phone}
                  />
                </label>
                <label>
                  Mensagem inicial
                  <textarea
                    maxLength={500}
                    onChange={(event) =>
                      updateForm('message', event.target.value)
                    }
                    placeholder="Olá, gostaria de saber mais."
                    rows={4}
                    value={form.message}
                  />
                </label>
              </>
            )}

            {mode === 'phone' && (
              <label>
                Telefone com DDD e país
                <input
                  inputMode="tel"
                  onChange={(event) => updateForm('phone', event.target.value)}
                  placeholder="5511999999999"
                  type="tel"
                  value={form.phone}
                />
              </label>
            )}

            {mode === 'wifi' && (
              <>
                <label>
                  Segurança
                  <select
                    onChange={(event) =>
                      updateForm(
                        'security',
                        event.target.value as FormState['security'],
                      )
                    }
                    value={form.security}
                  >
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Sem senha</option>
                  </select>
                </label>
                <label>
                  Nome da rede
                  <input
                    maxLength={64}
                    onChange={(event) => updateForm('ssid', event.target.value)}
                    placeholder="Minha rede"
                    type="text"
                    value={form.ssid}
                  />
                </label>
                {form.security !== 'nopass' && (
                  <label>
                    Senha da rede
                    <input
                      maxLength={128}
                      onChange={(event) =>
                        updateForm('password', event.target.value)
                      }
                      type="text"
                      value={form.password}
                    />
                  </label>
                )}
                <label className="qr-checkbox">
                  <input
                    checked={form.hidden}
                    onChange={(event) =>
                      updateForm('hidden', event.target.checked)
                    }
                    type="checkbox"
                  />
                  Rede oculta
                </label>
              </>
            )}

            {mode === 'pix' && (
              <label>
                Código Pix Copia e Cola
                <textarea
                  maxLength={MAX_QR_CONTENT_LENGTH}
                  onChange={(event) =>
                    updateForm('pixPayload', event.target.value)
                  }
                  placeholder="Cole aqui o código gerado pelo seu banco"
                  rows={6}
                  value={form.pixPayload}
                />
              </label>
            )}
          </div>

          {error && <p role="alert">{error}</p>}

          <button className="qr-submit" disabled={isGenerating} type="submit">
            {isGenerating ? 'Gerando...' : 'Gerar QR Code'}
          </button>

          <p className="qr-local-note">
            <strong>Privacidade por padrão.</strong>
            Nada é enviado para a Plena ou para o Supabase.
          </p>
        </form>

        <div className="qr-preview" aria-live="polite">
          {preview ? (
            <>
              <img alt="Prévia do QR Code" src={preview} />
              <a download="plena-qr-code.png" href={preview}>
                Baixar PNG
              </a>
            </>
          ) : (
            <div className="qr-preview__empty">
              <span>QR</span>
              <p>Sua prévia aparecerá aqui.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
