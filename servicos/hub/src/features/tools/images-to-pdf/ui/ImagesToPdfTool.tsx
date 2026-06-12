import { useEffect, useRef, useState } from 'react'

import { createImagesPdf } from '../domain/create-images-pdf'
import {
  MAX_FILES,
  createImageFile,
  validateImageFile,
  validateTotalSize,
  type ImageFile,
} from '../domain/image-files'
import {
  DEFAULT_PDF_OPTIONS,
  type Margin,
  type Orientation,
  type PdfOptions,
} from '../domain/pdf-options'
import './images-to-pdf.css'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ImagesToPdfTool() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [options, setOptions] = useState<PdfOptions>(DEFAULT_PDF_OPTIONS)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return
    setError('')

    const incoming = Array.from(fileList)
    const nextImages: ImageFile[] = [...images]
    const errors: string[] = []

    for (const file of incoming) {
      if (nextImages.length >= MAX_FILES) {
        errors.push(`Máximo de ${MAX_FILES} imagens atingido`)
        break
      }

      const fileError = validateImageFile(file)
      if (fileError) {
        errors.push(fileError)
        continue
      }

      const sizeError = validateTotalSize(nextImages, file.size)
      if (sizeError) {
        errors.push(sizeError)
        break
      }

      nextImages.push(createImageFile(file))
    }

    if (errors.length > 0) {
      setError(errors[0]!)
    }

    setImages(nextImages)

    // Reset input so same files can be re-added after removal
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function removeImage(id: string) {
    setImages((current) => {
      const target = current.find((img) => img.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return current.filter((img) => img.id !== id)
    })
  }

  function moveUp(index: number) {
    if (index === 0) return
    setImages((current) => {
      const next = [...current]
      ;[next[index - 1]!, next[index]!] = [next[index]!, next[index - 1]!]
      return next
    })
  }

  function moveDown(index: number) {
    setImages((current) => {
      if (index === current.length - 1) return current
      const next = [...current]
      ;[next[index]!, next[index + 1]!] = [next[index + 1]!, next[index]!]
      return next
    })
  }

  async function handleGenerate() {
    if (images.length === 0 || isProcessing) return
    setError('')
    setIsProcessing(true)

    try {
      const imageDataList = await Promise.all(
        images.map(async (img) => ({
          arrayBuffer: await img.file.arrayBuffer(),
          mimeType: img.file.type as 'image/jpeg' | 'image/png',
        })),
      )

      const pdfBytes = await createImagesPdf(imageDataList, options)
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'plena-imagens.pdf'
      anchor.click()

      URL.revokeObjectURL(url)
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

  return (
    <section className="images-to-pdf" aria-labelledby="images-to-pdf-title">
      <div className="images-to-pdf__intro">
        <span className="eyebrow">Ferramenta local</span>
        <h2 id="images-to-pdf-title">Imagens para PDF</h2>
        <p>
          Selecione imagens JPEG ou PNG, organize a ordem e gere um PDF
          diretamente no seu navegador.
        </p>
      </div>

      <div className="images-to-pdf__workspace">
        {/* Local processing notice */}
        <p className="images-to-pdf__local-notice">
          <strong>Processamento 100% local</strong> — nenhum arquivo sai do seu
          dispositivo.
        </p>

        {/* File input */}
        <label className="images-to-pdf__file-label">
          Adicionar imagens (JPEG ou PNG)
          <input
            accept="image/jpeg,image/png"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            ref={fileInputRef}
            type="file"
          />
        </label>

        {/* Error message */}
        {error && (
          <p className="images-to-pdf__error" role="alert">
            {error}
          </p>
        )}

        {/* Image list */}
        {images.length > 0 && (
          <ul className="images-to-pdf__list" aria-label="Imagens selecionadas">
            {images.map((img, index) => (
              <li className="images-to-pdf__item" key={img.id}>
                <img
                  alt={img.name}
                  className="images-to-pdf__thumb"
                  src={img.previewUrl}
                />
                <div className="images-to-pdf__item-info">
                  <span className="images-to-pdf__item-name">{img.name}</span>
                  <span className="images-to-pdf__item-size">
                    {formatBytes(img.size)}
                  </span>
                </div>
                <div className="images-to-pdf__item-actions">
                  <button
                    aria-label={`Mover ${img.name} para cima`}
                    disabled={index === 0}
                    onClick={() => moveUp(index)}
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    aria-label={`Mover ${img.name} para baixo`}
                    disabled={index === images.length - 1}
                    onClick={() => moveDown(index)}
                    type="button"
                  >
                    ↓
                  </button>
                  <button
                    aria-label={`Remover ${img.name}`}
                    onClick={() => removeImage(img.id)}
                    type="button"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* PDF Options */}
        <div className="images-to-pdf__options">
          <label>
            Orientação
            <select
              onChange={(e) =>
                setOptions((o) => ({
                  ...o,
                  orientation: e.target.value as Orientation,
                }))
              }
              value={options.orientation}
            >
              <option value="portrait">Retrato</option>
              <option value="landscape">Paisagem</option>
            </select>
          </label>

          <label>
            Margem
            <select
              onChange={(e) =>
                setOptions((o) => ({ ...o, margin: e.target.value as Margin }))
              }
              value={options.margin}
            >
              <option value="none">Sem margem</option>
              <option value="small">Pequena</option>
              <option value="medium">Média</option>
            </select>
          </label>
        </div>

        {/* Generate button */}
        <button
          className="images-to-pdf__submit"
          disabled={images.length === 0 || isProcessing}
          onClick={handleGenerate}
          type="button"
        >
          {isProcessing ? 'Gerando...' : 'Gerar PDF'}
        </button>
      </div>
    </section>
  )
}
