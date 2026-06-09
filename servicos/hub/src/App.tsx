import { HashRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom'

import { InstitutionalShell } from './app/InstitutionalShell'
import { getToolBySlug, toolRegistry } from './app/tool-registry'
import { QrCodeTool } from './features/tools/qr-code/ui/QrCodeTool'
import './styles/app.css'

const statusLabel = {
  planned: 'Em breve',
  building: 'Em construção',
  available: 'Disponível',
} as const

function ToolCatalog() {
  return (
    <main>
      <section className="hub-hero">
        <a className="brand" href="../servicos.html">
          Plena Informática
        </a>
        <span className="eyebrow">Hub de Soluções Digitais</span>
        <h1>Ferramentas simples, seguras e sob seu controle.</h1>
        <p>
          A base modular do novo Hub está pronta. Cada ferramenta será liberada
          individualmente conforme o roadmap.
        </p>
      </section>

      <section className="catalog" aria-labelledby="catalog-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MVP Plena</span>
            <h2 id="catalog-title">Ferramentas planejadas</h2>
          </div>
          <p>
            Processamento local sempre que possível e conta opcional apenas
            quando houver benefício para o usuário.
          </p>
        </div>

        <div className="tool-grid">
          {toolRegistry.map((tool) => (
            <article className="tool-card" key={tool.slug}>
              <div className="tool-meta">
                <span>{statusLabel[tool.status]}</span>
                <strong>{String(tool.roadmapOrder).padStart(2, '0')}</strong>
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.shortDescription}</p>
              <dl>
                <div>
                  <dt>Processamento</dt>
                  <dd>{tool.processing === 'local' ? 'Local' : 'Híbrido'}</dd>
                </div>
                <div>
                  <dt>Conta</dt>
                  <dd>
                    {tool.accountRequirement === 'none'
                      ? 'Não exige'
                      : 'Opcional'}
                  </dd>
                </div>
              </dl>
              <Link to={`/ferramentas/${tool.slug}`}>Ver estrutura</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function QrCodePage() {
  const tool = getToolBySlug('qr-code')

  if (!tool) {
    return null
  }

  return (
    <InstitutionalShell>
      <main className="tool-page tool-page--qr">
        <div className="tool-page__header">
          <a className="back-link" href="../../servicos.html#ferramentas">
            Voltar para ferramentas
          </a>
          <span className="eyebrow">{statusLabel[tool.status]}</span>
          <h1>{tool.name}</h1>
          <p>{tool.shortDescription}</p>
        </div>
        <QrCodeTool />
      </main>
    </InstitutionalShell>
  )
}

function ToolPlaceholder() {
  const { slug = '' } = useParams()
  const tool = getToolBySlug(slug)

  if (!tool) {
    return <Navigate to="/" replace />
  }

  if (tool.slug === 'qr-code') {
    return <QrCodePage />
  }

  return (
    <main className="tool-page">
      <Link className="back-link" to="/">
        Voltar ao Hub
      </Link>
      <span className="eyebrow">{statusLabel[tool.status]}</span>
      <h1>{tool.name}</h1>
      <p>{tool.shortDescription}</p>
      <div className="privacy-note">
        <strong>Política prevista</strong>
        <span>
          Processamento: {tool.processing}. Conta: {tool.accountRequirement}.
          Persistência: {tool.persistence}.
        </span>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<QrCodePage />} />
        <Route path="/catalogo" element={<ToolCatalog />} />
        <Route path="/ferramentas/:slug" element={<ToolPlaceholder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
