import { useEffect, useRef, useState } from 'react'

import { mergePdfFiles } from '../domain/merge-pdf-files'
import {
  MAX_FILES,
  createPdfFile,
  validateFileCount,
  validatePdfFile,
  validateTotalSize,
  type PdfFile,
} from '../domain/pdf-files'
import { readPageCount } from '../domain/read-pdf-metadata'
import './merge-pdf.css'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MergePdfTool() {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup on unmount — no object URLs to revoke, but reset input
  useEffect(() => {
    return () => {
      // nothing to revoke (no preview URLs for PDFs)
    }
  }, [])

  async function loadPageCount(pdfFile: PdfFile) {
    try {
      const count = await readPageCount(pdfFile.file)
      setPdfFiles((current) =>
        current.map((f) => (f.id === pdfFile.id ? { ...f, pageCount: count } : f)),
      )
    } catch {
      // If we can't read page count, leave it as null silently
    }
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return
    setErrors([])

    const incoming = Array.from(fileList)
    const nextFiles: PdfFile[] = [...pdfFiles]
    const newErrors: string[] = []
    const added: PdfFile[] = []

    for (const file of incoming) {
      const countError = validateFileCount(nextFiles.length, 1)
      if (countError) {
        newErrors.push(countError)
        break
      }

      const fileError = validatePdfFile(file)
      if (fileError) {
        newErrors.push(fileError)
        continue
      }

      const currentTotal = nextFiles.reduce((sum, f) => sum + f.size, 0)
      const sizeError = validateTotalSize(currentTotal, file.size)
      if (sizeError) {
        newErrors.push(sizeError)
        break
      }

      const pdfFile = createPdfFile(file)
      nextFiles.push(pdfFile)
      added.push(pdfFile)
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
    }

    setPdfFiles(nextFiles)

    // Reset input so same file can be re-selected after removal
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Load page counts for newly added files
    for (const pdfFile of added) {
      void loadPageCount(pdfFile)
    }
  }

  function removeFile(id: string) {
    setPdfFiles((current) => current.filter((f) => f.id !== id))
    // Reset file input so removed files can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function moveUp(index: number) {
    if (index === 0) return
    setPdfFiles((current) => {
      const next = [...current]
      ;[next[index - 1]!, next[index]!] = [next[index]!, next[index - 1]!]
      return next
    })
  }

  function moveDown(index: number) {
    setPdfFiles((current) => {
      if (index === current.length - 1) return current
      const next = [...current]
      ;[next[index]!, next[index + 1]!] = [next[index + 1]!, next[index]!]
      return next
    })
  }

  async function handleMerge() {
    if (pdfFiles.length < 2 || isProcessing) return
    setErrors([])
    setIsProcessing(true)

    try {
      const files = pdfFiles.map((f) => f.file)
      const pdfBytes = await mergePdfFiles(files)
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'plena-documentos-unificados.pdf'
      anchor.click()

      URL.revokeObjectURL(url)
    } catch (err) {
      setErrors([
        err instanceof Error
          ? err.message
          : 'Não foi possível unificar os PDFs. Tente novamente.',
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const canMerge = pdfFiles.length >= 2 && !isProcessing

  return (
    <section className="merge-pdf" aria-labelledby="merge-pdf-title">
      <div className="merge-pdf__intro">
        <span className="eyebrow">Ferramenta local</span>
        <h2 id="merge-pdf-title">Unificador de PDFs</h2>
        <p>
          Selecione até {MAX_FILES} arquivos PDF, organize a ordem e unifique-os
          diretamente no seu navegador.
        </p>
      </div>

      <div className="merge-pdf__workspace">
        {/* Local processing notice */}
        <p className="merge-pdf__info-banner">
          <strong>Processamento 100% local</strong> — nenhum arquivo sai do seu
          dispositivo.
        </p>

        {/* File input */}
        <label className="merge-pdf__file-label">
          Adicionar arquivos PDF
          <input
            accept=".pdf,application/pdf"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            ref={fileInputRef}
            type="file"
          />
        </label>

        {/* Error messages */}
        {errors.length > 0 && (
          <p className="merge-pdf__error" role="alert">
            {errors[0]}
          </p>
        )}

        {/* File list */}
        {pdfFiles.length > 0 && (
          <ul className="merge-pdf__file-list" aria-label="Arquivos PDF selecionados">
            {pdfFiles.map((pdfFile, index) => (
              <li className="merge-pdf__file-item" key={pdfFile.id}>
                <span aria-hidden="true" className="merge-pdf__file-icon">
                  📄
                </span>
                <div className="merge-pdf__file-info">
                  <span className="merge-pdf__file-name">{pdfFile.name}</span>
                  <span className="merge-pdf__file-meta">
                    {formatBytes(pdfFile.size)}
                    {' · '}
                    {pdfFile.pageCount === null
                      ? 'carregando...'
                      : `${pdfFile.pageCount} ${pdfFile.pageCount === 1 ? 'página' : 'páginas'}`}
                  </span>
                </div>
                <div className="merge-pdf__actions">
                  <button
                    aria-label={`Mover ${pdfFile.name} para cima`}
                    disabled={index === 0}
                    onClick={() => moveUp(index)}
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    aria-label={`Mover ${pdfFile.name} para baixo`}
                    disabled={index === pdfFiles.length - 1}
                    onClick={() => moveDown(index)}
                    type="button"
                  >
                    ↓
                  </button>
                  <button
                    aria-label={`Remover ${pdfFile.name}`}
                    onClick={() => removeFile(pdfFile.id)}
                    type="button"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Merge button */}
        <button
          className="merge-pdf__button"
          disabled={!canMerge}
          onClick={handleMerge}
          type="button"
        >
          {isProcessing ? 'Unificando...' : 'Unificar PDFs'}
        </button>
      </div>
    </section>
  )
}
