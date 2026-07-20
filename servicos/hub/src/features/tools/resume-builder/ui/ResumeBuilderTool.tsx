import { useRef, useState } from 'react'

import { createResumePdf } from '../domain/create-resume-pdf'
import {
  CURRENT_YEAR,
  MAX_DESCRIPTION_CHARS,
  MAX_EDUCATION_ITEMS,
  MAX_EXPERIENCE_ITEMS,
  MAX_SKILLS,
  MAX_SUMMARY_CHARS,
  MIN_YEAR,
  parseResumeData,
  type ResumeData,
  type ResumeEducation,
  type ResumeExperience,
  type ResumePersonal,
} from '../domain/resume-data'
import { DEFAULT_TEMPLATE_ID, type TemplateId } from '../domain/resume-templates'
import { ResumeTemplatePicker } from './ResumeTemplatePicker'
import { ResumePreview } from './ResumePreview'
import { useLocalStorage } from '../../../../lib/use-local-storage'
import './resume-builder.css'

type ResumeBuilderToolProps = {
  generatePdf?: (resume: ResumeData, templateId: TemplateId) => Promise<Uint8Array>
}

const initialPersonal: ResumePersonal = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  headline: '',
  summary: '',
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function createExperience(): ResumeExperience {
  return {
    id: createId('experience'),
    role: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  }
}

function createEducation(): ResumeEducation {
  return {
    id: createId('education'),
    course: '',
    institution: '',
    startYear: '',
    endYear: '',
    current: false,
  }
}

function CharCounter({
  value,
  max,
}: {
  value: string
  max: number
}) {
  const len = value.length
  const near = len >= Math.floor(max * 0.9)
  return (
    <span
      className={`resume-builder__char-counter${near ? ' resume-builder__char-counter--near' : ''}`}
      aria-live="polite"
    >
      {len}/{max}
    </span>
  )
}

export function ResumeBuilderTool({
  generatePdf = createResumePdf,
}: ResumeBuilderToolProps) {
  interface ResumeStateData {
    personal: ResumePersonal
    experiences: ResumeExperience[]
    education: ResumeEducation[]
    skillsText: string
    templateId: TemplateId
  }

  const [resumeState, setResumeState] = useLocalStorage<ResumeStateData>(
    'plena-hub-resume-v1',
    {
      personal: initialPersonal,
      experiences: [],
      education: [],
      skillsText: '',
      templateId: DEFAULT_TEMPLATE_ID,
    },
  )

  const [showDraftBanner, setShowDraftBanner] = useState(() => {
    const item = window.localStorage.getItem('plena-hub-resume-v1')
    if (item) {
      try {
        const parsed = JSON.parse(item)
        const hasContent = !!(
          parsed.personal?.fullName?.trim() ||
          parsed.experiences?.length > 0 ||
          parsed.education?.length > 0 ||
          parsed.skillsText?.trim()
        )
        return hasContent
      } catch {
        return false
      }
    }
    return false
  })

  const personal = resumeState.personal
  const experiences = resumeState.experiences
  const education = resumeState.education
  const skillsText = resumeState.skillsText
  const templateId = resumeState.templateId

  const setPersonal = (
    newVal: ResumePersonal | ((prev: ResumePersonal) => ResumePersonal),
  ) => {
    setResumeState((prev) => ({
      ...prev,
      personal: newVal instanceof Function ? newVal(prev.personal) : newVal,
    }))
  }
  const setExperiences = (
    newVal:
      | ResumeExperience[]
      | ((prev: ResumeExperience[]) => ResumeExperience[]),
  ) => {
    setResumeState((prev) => ({
      ...prev,
      experiences:
        newVal instanceof Function ? newVal(prev.experiences) : newVal,
    }))
  }
  const setEducation = (
    newVal:
      | ResumeEducation[]
      | ((prev: ResumeEducation[]) => ResumeEducation[]),
  ) => {
    setResumeState((prev) => ({
      ...prev,
      education: newVal instanceof Function ? newVal(prev.education) : newVal,
    }))
  }
  const setSkillsText = (newVal: string | ((prev: string) => string)) => {
    setResumeState((prev) => ({
      ...prev,
      skillsText: newVal instanceof Function ? newVal(prev.skillsText) : newVal,
    }))
  }
  const setTemplateId = (
    newVal: TemplateId | ((prev: TemplateId) => TemplateId),
  ) => {
    setResumeState((prev) => ({
      ...prev,
      templateId:
        newVal instanceof Function ? newVal(prev.templateId) : newVal,
    }))
  }

  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const headlineRef = useRef<HTMLInputElement>(null)

  const skills = skillsText
    .split(/[,\n]/)
    .map((skill) => skill.trim())
    .filter(Boolean)

  // Obrigatórios: nome, e-mail, telefone, título, (ao menos 1 experiência OU formação)
  const requiredChecks = [
    personal.fullName.trim().length > 0,
    personal.email.trim().length > 0,
    personal.phone.trim().length > 0,
    personal.headline.trim().length > 0,
    experiences.length > 0 || education.length > 0,
  ]
  const filledRequired = requiredChecks.filter(Boolean).length
  const allRequiredFilled = filledRequired === 5

  function updatePersonal<Key extends keyof ResumePersonal>(
    key: Key,
    value: ResumePersonal[Key],
  ) {
    setPersonal((current) => ({ ...current, [key]: value }))
  }

  function updateExperience<Key extends keyof ResumeExperience>(
    index: number,
    key: Key,
    value: ResumeExperience[Key],
  ) {
    setExperiences((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    )
  }

  function updateEducation<Key extends keyof ResumeEducation>(
    index: number,
    key: Key,
    value: ResumeEducation[Key],
  ) {
    setEducation((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    )
  }

  async function handleDownload() {
    if (isGenerating) return
    setError('')

    try {
      const resume = parseResumeData({
        personal,
        experiences,
        education,
        skills,
      })
      setIsGenerating(true)
      const pdfBytes = await generatePdf(resume, templateId)
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: 'application/pdf',
      })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'plena-curriculo.pdf'
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível gerar o currículo'
      setError(message)
      if (!personal.fullName.trim()) {
        nameRef.current?.focus()
      } else if (!personal.email.trim()) {
        emailRef.current?.focus()
      } else if (!personal.phone.trim()) {
        phoneRef.current?.focus()
      } else if (!personal.headline.trim()) {
        headlineRef.current?.focus()
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const previewData: Partial<ResumeData> = {
    personal,
    experiences,
    education: education.map((item) => ({
      id: item.id,
      course: item.course,
      institution: item.institution,
      startYear: item.startYear ?? '',
      endYear: item.endYear ?? '',
      current: item.current ?? false,
    })),
    skills,
  }

  return (
    <section className="resume-builder" aria-labelledby="resume-builder-title">
      {showDraftBanner && (
        <div
          className="rb-draft-banner"
          style={{
            background: '#f0f4ff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>
              Rascunho detectado
            </p>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#4b5563' }}>
              Você quer continuar editando o rascunho salvo anteriormente?
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                const emptyState: ResumeStateData = {
                  personal: initialPersonal,
                  experiences: [],
                  education: [],
                  skillsText: '',
                  templateId: DEFAULT_TEMPLATE_ID,
                }
                setResumeState(emptyState)
                setShowDraftBanner(false)
              }}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Começar do zero
            </button>
            <button
              onClick={() => setShowDraftBanner(false)}
              style={{
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continuar rascunho
            </button>
          </div>
        </div>
      )}

      <div className="resume-builder__intro">
        <span className="eyebrow">Ferramenta local</span>
        <h2 id="resume-builder-title">Criador de Currículo</h2>
        <p>
          Preencha seus dados, escolha o modelo, acompanhe a prévia e baixe um
          currículo profissional em PDF.
        </p>
      </div>

      <p className="resume-builder__privacy">
        <strong>Privacidade por padrão.</strong> Seus dados ficam somente neste
        navegador e não são enviados para a Plena ou para o Supabase.
      </p>

      <ResumeTemplatePicker selected={templateId} onChange={setTemplateId} />

      <div className="resume-builder__workspace">
        <div className="resume-builder__editor">
          <p className="required-note">Campos marcados com * são obrigatórios</p>

          {/* ── Dados profissionais ── */}
          <fieldset>
            <legend>Dados profissionais</legend>

            <label>
              Nome completo *
              <input
                ref={nameRef}
                maxLength={100}
                onChange={(event) =>
                  updatePersonal('fullName', event.target.value)
                }
                value={personal.fullName}
              />
            </label>

            <div className="resume-builder__field-grid">
              <label>
                E-mail *
                <input
                  ref={emailRef}
                  maxLength={120}
                  onChange={(event) =>
                    updatePersonal('email', event.target.value)
                  }
                  type="email"
                  value={personal.email}
                />
              </label>
              <label>
                Telefone *
                <input
                  ref={phoneRef}
                  maxLength={30}
                  onChange={(event) =>
                    updatePersonal('phone', event.target.value)
                  }
                  type="tel"
                  value={personal.phone}
                />
              </label>
            </div>

            <label>
              Cidade e estado
              <input
                maxLength={100}
                onChange={(event) =>
                  updatePersonal('city', event.target.value)
                }
                placeholder="São José dos Campos - SP"
                value={personal.city}
              />
            </label>

            <label>
              Título profissional *
              <input
                ref={headlineRef}
                maxLength={100}
                onChange={(event) =>
                  updatePersonal('headline', event.target.value)
                }
                placeholder="Ex.: Assistente administrativa"
                value={personal.headline}
              />
            </label>

            <label htmlFor="resume-summary">
              Resumo profissional
            </label>
            <textarea
              id="resume-summary"
                maxLength={MAX_SUMMARY_CHARS}
                onChange={(event) =>
                  updatePersonal('summary', event.target.value)
                }
                placeholder="Descreva brevemente seu perfil, objetivos e diferenciais"
                rows={5}
                value={personal.summary}
            />
            <CharCounter value={personal.summary} max={MAX_SUMMARY_CHARS} />
          </fieldset>

          {/* ── Experiência profissional ── */}
          <fieldset>
            <div className="resume-builder__section-heading">
              <legend>Experiência profissional</legend>
              <button
                disabled={
                  experiences.length >= MAX_EXPERIENCE_ITEMS || isGenerating
                }
                onClick={() =>
                  setExperiences((current) => [...current, createExperience()])
                }
                type="button"
              >
                Adicionar experiência
              </button>
            </div>

            {experiences.map((experience, index) => (
              <div
                className="resume-builder__dynamic-card"
                key={experience.id}
              >
                <div className="resume-builder__section-heading">
                  <strong>Experiência {index + 1}</strong>
                  <button
                    aria-label={`Remover experiência ${index + 1}`}
                    disabled={isGenerating}
                    onClick={() =>
                      setExperiences((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                    type="button"
                  >
                    Remover
                  </button>
                </div>

                <div className="resume-builder__field-grid">
                  <label htmlFor={`experience-role-${experience.id}`}>
                    Cargo {index + 1}
                    <input
                      id={`experience-role-${experience.id}`}
                      maxLength={100}
                      onChange={(event) =>
                        updateExperience(index, 'role', event.target.value)
                      }
                      value={experience.role}
                    />
                  </label>
                  <label htmlFor={`experience-company-${experience.id}`}>
                    Empresa {index + 1}
                    <input
                      id={`experience-company-${experience.id}`}
                      maxLength={100}
                      onChange={(event) =>
                        updateExperience(index, 'company', event.target.value)
                      }
                      value={experience.company}
                    />
                  </label>
                  <label htmlFor={`experience-start-${experience.id}`}>
                    Início {index + 1}
                    <input
                      id={`experience-start-${experience.id}`}
                      onChange={(event) =>
                        updateExperience(
                          index,
                          'startDate',
                          event.target.value,
                        )
                      }
                      type="month"
                      value={experience.startDate}
                    />
                  </label>
                  <label htmlFor={`experience-end-${experience.id}`}>
                    Fim {index + 1}
                    <input
                      id={`experience-end-${experience.id}`}
                      disabled={experience.current}
                      onChange={(event) =>
                        updateExperience(index, 'endDate', event.target.value)
                      }
                      type="month"
                      value={experience.endDate}
                    />
                  </label>
                </div>

                <label className="resume-builder__checkbox">
                  <input
                    checked={experience.current}
                    onChange={(event) =>
                      updateExperience(index, 'current', event.target.checked)
                    }
                    type="checkbox"
                  />
                  Trabalho atualmente nesta empresa
                </label>

                <label htmlFor={`experience-description-${experience.id}`}>
                  Atividades e conquistas
                </label>
                <textarea
                  id={`experience-description-${experience.id}`}
                    maxLength={MAX_DESCRIPTION_CHARS}
                    onChange={(event) =>
                      updateExperience(
                        index,
                        'description',
                        event.target.value,
                      )
                    }
                    placeholder="Descreva suas responsabilidades e principais resultados"
                    rows={4}
                    value={experience.description}
                />
                <CharCounter
                  value={experience.description}
                  max={MAX_DESCRIPTION_CHARS}
                />
              </div>
            ))}
          </fieldset>

          {/* ── Formação ── */}
          <fieldset>
            <div className="resume-builder__section-heading">
              <legend>Formação</legend>
              <button
                disabled={
                  education.length >= MAX_EDUCATION_ITEMS || isGenerating
                }
                onClick={() =>
                  setEducation((current) => [...current, createEducation()])
                }
                type="button"
              >
                Adicionar formação
              </button>
            </div>

            {education.map((item, index) => (
              <div className="resume-builder__dynamic-card" key={item.id}>
                <div className="resume-builder__section-heading">
                  <strong>Formação {index + 1}</strong>
                  <button
                    aria-label={`Remover formação ${index + 1}`}
                    disabled={isGenerating}
                    onClick={() =>
                      setEducation((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                    type="button"
                  >
                    Remover
                  </button>
                </div>

                <label>
                  Curso
                  <input
                    maxLength={120}
                    onChange={(event) =>
                      updateEducation(index, 'course', event.target.value)
                    }
                    value={item.course}
                  />
                </label>

                <label>
                  Instituição
                  <input
                    maxLength={120}
                    onChange={(event) =>
                      updateEducation(index, 'institution', event.target.value)
                    }
                    value={item.institution}
                  />
                </label>

                <div className="resume-builder__field-grid">
                  <label>
                    Ano de início
                    <input
                      max={CURRENT_YEAR + 10}
                      min={MIN_YEAR}
                      onChange={(event) =>
                        updateEducation(index, 'startYear', event.target.value)
                      }
                      placeholder="2018"
                      type="number"
                      value={item.startYear ?? ''}
                    />
                  </label>
                  <label>
                    Ano de conclusão
                    <input
                      disabled={!!item.current}
                      max={CURRENT_YEAR + 10}
                      min={MIN_YEAR}
                      onChange={(event) =>
                        updateEducation(index, 'endYear', event.target.value)
                      }
                      placeholder="2022"
                      type="number"
                      value={item.endYear ?? ''}
                    />
                  </label>
                </div>

                <label className="resume-builder__checkbox">
                  <input
                    checked={!!item.current}
                    onChange={(event) => {
                      updateEducation(index, 'current', event.target.checked)
                      if (event.target.checked) {
                        updateEducation(index, 'endYear', '')
                      }
                    }}
                    type="checkbox"
                  />
                  Cursando atualmente
                </label>
              </div>
            ))}
          </fieldset>

          {/* ── Competências ── */}
          <fieldset>
            <legend>Competências</legend>
            <label>
              Liste suas competências
              <textarea
                maxLength={720}
                onChange={(event) => setSkillsText(event.target.value)}
                placeholder="Atendimento ao cliente, Excel, organização"
                rows={4}
                value={skillsText}
              />
            </label>
            <p className="resume-builder__field-hint">
              Separe por vírgula ou uma por linha. Máximo de {MAX_SKILLS}{' '}
              competências.
            </p>
          </fieldset>

          {/* ── Progresso e ação ── */}
          <p
            className={`required-progress${allRequiredFilled ? ' required-progress--complete' : ''}`}
          >
            {filledRequired} de 5 campos obrigatórios preenchidos
          </p>

          {allRequiredFilled && (
            <p className="resume-valid-notice">Currículo pronto para gerar</p>
          )}

          {error && (
            <p className="resume-builder__error" role="alert">
              {error}
            </p>
          )}

          <button
            className="resume-builder__submit"
            disabled={isGenerating}
            onClick={handleDownload}
            type="button"
          >
            {isGenerating ? 'Gerando PDF...' : 'Baixar currículo em PDF'}
          </button>
        </div>

        <ResumePreview data={previewData} templateId={templateId} />
      </div>
    </section>
  )
}
