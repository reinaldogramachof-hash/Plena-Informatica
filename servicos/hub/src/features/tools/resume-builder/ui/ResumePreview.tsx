import { getTemplate, type TemplateId } from '../domain/resume-templates'
import type { ResumeData } from '../domain/resume-data'

type ResumePreviewProps = {
  data: Partial<ResumeData>
  templateId: TemplateId
}

function SectionBlock({
  title,
  pill,
  children,
}: {
  title: string
  pill?: boolean
  children: React.ReactNode
}) {
  return (
    <section className={`rp-section${pill ? ' rp-section--pill' : ''}`}>
      <h3 className="rp-section__title">{title}</h3>
      <div className="rp-section__rule" />
      {children}
    </section>
  )
}

function ExperienceItems({ experiences }: { experiences: ResumeData['experiences'] }) {
  const fmt = (start: string, end: string, current = false) =>
    [start, current ? 'Atual' : end].filter(Boolean).join(' – ')
  return (
    <>
      {experiences.map((exp) => (
        <article key={exp.id} className="rp-item">
          <strong className="rp-item__title">
            {[exp.role, exp.company].filter(Boolean).join(' · ') || 'Cargo · Empresa'}
          </strong>
          <span className="rp-item__period">{fmt(exp.startDate, exp.endDate, exp.current)}</span>
          {exp.description && <p className="rp-item__body">{exp.description}</p>}
        </article>
      ))}
    </>
  )
}

function EducationItems({ education }: { education: ResumeData['education'] }) {
  return (
    <>
      {education.map((item) => (
        <article key={item.id} className="rp-item">
          <strong className="rp-item__title">
            {[item.course, item.institution].filter(Boolean).join(' · ') || 'Curso · Instituição'}
          </strong>
          <span className="rp-item__period">
            {[item.startYear, item.endYear].filter(Boolean).join(' – ')}
          </span>
        </article>
      ))}
    </>
  )
}

/* ── Classic ATS ───────────────────────────────────────────── */
function ClassicAtsSheet({ data }: { data: Partial<ResumeData> }) {
  const p = data.personal
  const exp = data.experiences ?? []
  const edu = data.education ?? []
  const skills = (data.skills ?? []).filter(Boolean)
  return (
    <div className="rp-sheet rp-sheet--classic-ats">
      <div className="rp-classic-header">
        <h2 className="rp-name">{p?.fullName || 'Seu nome completo'}</h2>
        <p className="rp-headline rp-headline--dark">{p?.headline || 'Título profissional'}</p>
        <p className="rp-contact rp-contact--dark">
          {[p?.email, p?.phone, p?.city].filter(Boolean).join(' | ') || 'E-mail | Telefone | Cidade'}
        </p>
        <div className="rp-rule" />
      </div>
      {p?.summary && (
        <SectionBlock title="Resumo profissional">
          <p className="rp-item__body">{p.summary}</p>
        </SectionBlock>
      )}
      {exp.length > 0 && (
        <SectionBlock title="Experiência profissional">
          <ExperienceItems experiences={exp} />
        </SectionBlock>
      )}
      {edu.length > 0 && (
        <SectionBlock title="Formação">
          <EducationItems education={edu} />
        </SectionBlock>
      )}
      {skills.length > 0 && (
        <SectionBlock title="Competências">
          <p className="rp-item__body">{skills.join(' | ')}</p>
        </SectionBlock>
      )}
    </div>
  )
}

/* ── Executive ─────────────────────────────────────────────── */
function ExecutiveSheet({ data }: { data: Partial<ResumeData> }) {
  const p = data.personal
  const exp = data.experiences ?? []
  const edu = data.education ?? []
  const skills = (data.skills ?? []).filter(Boolean)
  return (
    <div className="rp-sheet rp-sheet--executive">
      <header className="rp-executive-header">
        <h2 className="rp-name rp-name--white">{p?.fullName || 'Seu nome completo'}</h2>
        <p className="rp-headline rp-headline--navy-light">{p?.headline || 'Título profissional'}</p>
        <p className="rp-contact rp-contact--navy-muted">
          {[p?.email, p?.phone, p?.city].filter(Boolean).join(' | ') || 'E-mail | Telefone | Cidade'}
        </p>
        <div className="rp-executive-accent-bar" />
      </header>
      {p?.summary && (
        <SectionBlock title="Resumo profissional">
          <p className="rp-item__body">{p.summary}</p>
        </SectionBlock>
      )}
      {exp.length > 0 && (
        <SectionBlock title="Experiência profissional">
          <ExperienceItems experiences={exp} />
        </SectionBlock>
      )}
      {edu.length > 0 && (
        <SectionBlock title="Formação">
          <EducationItems education={edu} />
        </SectionBlock>
      )}
      {skills.length > 0 && (
        <SectionBlock title="Competências">
          <p className="rp-item__body">{skills.join(' | ')}</p>
        </SectionBlock>
      )}
    </div>
  )
}

/* ── Modern ────────────────────────────────────────────────── */
function ModernSheet({ data }: { data: Partial<ResumeData> }) {
  const p = data.personal
  const exp = data.experiences ?? []
  const edu = data.education ?? []
  const skills = (data.skills ?? []).filter(Boolean)
  return (
    <div className="rp-sheet rp-sheet--modern">
      <aside className="rp-modern-sidebar">
        <h2 className="rp-name rp-name--white rp-name--sidebar">{p?.fullName || 'Seu nome completo'}</h2>
        <p className="rp-headline rp-headline--modern-light">{p?.headline || 'Título profissional'}</p>
        <div className="rp-modern-divider" />
        {[p?.email, p?.phone, p?.city].filter(Boolean).map((c, i) => (
          <p key={i} className="rp-modern-contact-item">{c}</p>
        ))}
        {skills.length > 0 && (
          <>
            <p className="rp-modern-section-label">Competências</p>
            <div className="rp-modern-divider" />
            {skills.map((s, i) => (
              <p key={i} className="rp-modern-skill">• {s}</p>
            ))}
          </>
        )}
      </aside>
      <main className="rp-modern-main">
        {p?.summary && (
          <SectionBlock title="Resumo profissional">
            <p className="rp-item__body">{p.summary}</p>
          </SectionBlock>
        )}
        {exp.length > 0 && (
          <SectionBlock title="Experiência profissional">
            <ExperienceItems experiences={exp} />
          </SectionBlock>
        )}
        {edu.length > 0 && (
          <SectionBlock title="Formação">
            <EducationItems education={edu} />
          </SectionBlock>
        )}
      </main>
    </div>
  )
}

/* ── First Job ─────────────────────────────────────────────── */
function FirstJobSheet({ data }: { data: Partial<ResumeData> }) {
  const p = data.personal
  const exp = data.experiences ?? []
  const edu = data.education ?? []
  const skills = (data.skills ?? []).filter(Boolean)
  return (
    <div className="rp-sheet rp-sheet--first-job">
      <div className="rp-firstjob-bar" />
      <div className="rp-firstjob-content">
        <h2 className="rp-name rp-name--green">{p?.fullName || 'Seu nome completo'}</h2>
        <p className="rp-headline rp-headline--green">{p?.headline || 'Título profissional'}</p>
        <p className="rp-contact rp-contact--dark">
          {[p?.email, p?.phone, p?.city].filter(Boolean).join(' | ') || 'E-mail | Telefone | Cidade'}
        </p>
        <div className="rp-rule rp-rule--green" />
        {p?.summary && (
          <SectionBlock title="Resumo / Objetivo">
            <p className="rp-item__body">{p.summary}</p>
          </SectionBlock>
        )}
        {edu.length > 0 && (
          <SectionBlock title="Formação">
            <EducationItems education={edu} />
          </SectionBlock>
        )}
        {skills.length > 0 && (
          <SectionBlock title="Competências">
            <p className="rp-item__body">{skills.join(' | ')}</p>
          </SectionBlock>
        )}
        {exp.length > 0 && (
          <SectionBlock title="Experiência profissional">
            <ExperienceItems experiences={exp} />
          </SectionBlock>
        )}
      </div>
    </div>
  )
}

/* ── Creative ──────────────────────────────────────────────── */
function CreativeSheet({ data }: { data: Partial<ResumeData> }) {
  const p = data.personal
  const exp = data.experiences ?? []
  const edu = data.education ?? []
  const skills = (data.skills ?? []).filter(Boolean)
  return (
    <div className="rp-sheet rp-sheet--creative">
      <header className="rp-creative-header">
        <h2 className="rp-name rp-name--white">{p?.fullName || 'Seu nome completo'}</h2>
        <p className="rp-headline rp-headline--creative-light">{p?.headline || 'Título profissional'}</p>
        <p className="rp-contact rp-contact--creative-muted">
          {[p?.email, p?.phone, p?.city].filter(Boolean).join(' | ') || 'E-mail | Telefone | Cidade'}
        </p>
        <div className="rp-creative-accent-bar" />
      </header>
      {p?.summary && (
        <SectionBlock title="Resumo profissional" pill>
          <p className="rp-item__body">{p.summary}</p>
        </SectionBlock>
      )}
      {exp.length > 0 && (
        <SectionBlock title="Experiência profissional" pill>
          <ExperienceItems experiences={exp} />
        </SectionBlock>
      )}
      {edu.length > 0 && (
        <SectionBlock title="Formação" pill>
          <EducationItems education={edu} />
        </SectionBlock>
      )}
      {skills.length > 0 && (
        <SectionBlock title="Competências" pill>
          <p className="rp-item__body">{skills.join(' | ')}</p>
        </SectionBlock>
      )}
    </div>
  )
}

/* ── Root component ────────────────────────────────────────── */
const SHEETS: Record<TemplateId, React.ComponentType<{ data: Partial<ResumeData> }>> = {
  'classic-ats': ClassicAtsSheet,
  executive: ExecutiveSheet,
  modern: ModernSheet,
  'first-job': FirstJobSheet,
  creative: CreativeSheet,
}

export function ResumePreview({ data, templateId }: ResumePreviewProps) {
  const template = getTemplate(templateId)
  const Sheet = SHEETS[templateId]
  return (
    <div className={`resume-preview resume-preview--${templateId}`} aria-label="Prévia do currículo">
      <p className="resume-preview__label">
        Prévia do PDF — <strong>{template.name}</strong>
      </p>
      <div className="resume-preview__sheet-wrapper">
        <Sheet data={data} />
      </div>
    </div>
  )
}
