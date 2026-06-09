import { HashRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom'

import { getToolBySlug, toolRegistry } from './app/tool-registry'
import './styles/app.css'

const statusLabel = {
  planned: 'Em breve',
  building: 'Em construcao',
  available: 'Disponivel',
} as const

function ToolCatalog() {
  return (
    <main>
      <section className="hub-hero">
        <a className="brand" href="../servicos.html">
          Plena Informatica
        </a>
        <span className="eyebrow">Hub de Solucoes Digitais</span>
        <h1>Ferramentas simples, seguras e sob seu controle.</h1>
        <p>
          A base modular do novo Hub esta pronta. Cada ferramenta sera liberada
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
            Processamento local sempre que possivel e conta opcional apenas
            quando houver beneficio para o usuario.
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
                  <dd>{tool.processing === 'local' ? 'Local' : 'Hibrido'}</dd>
                </div>
                <div>
                  <dt>Conta</dt>
                  <dd>
                    {tool.accountRequirement === 'none'
                      ? 'Nao exige'
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

function ToolPlaceholder() {
  const { slug = '' } = useParams()
  const tool = getToolBySlug(slug)

  if (!tool) {
    return <Navigate to="/" replace />
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
        <strong>Politica prevista</strong>
        <span>
          Processamento: {tool.processing}. Conta: {tool.accountRequirement}.
          Persistencia: {tool.persistence}.
        </span>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ToolCatalog />} />
        <Route path="/ferramentas/:slug" element={<ToolPlaceholder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
