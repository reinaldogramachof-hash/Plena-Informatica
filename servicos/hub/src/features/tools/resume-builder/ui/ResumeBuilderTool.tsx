import { useRef, useState } from 'react'

import { createResumePdf } from '../domain/create-resume-pdf'
import {
  MAX_EDUCATION_ITEMS,
  MAX_EXPERIENCE_ITEMS,
  parseResumeData,
  type ResumeData,
  type ResumeEducation,
  type ResumeExperience,
  type ResumePersonal,
} from '../domain/resume-data'
import { DEFAULT_TEMPLATE_ID, type TemplateId } from '../domain/resume-templates'
import { ResumeTemplatePicker } from './ResumeTemplatePicker'
import { ResumePreview } from './ResumePreview'
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
  }
}

export function ResumeBuilderTool({
  generatePdf = createResumePdf,
}: ResumeBuilderToolProps) {
  const [personal, setPersonal] = useState<ResumePersonal>(initialPersonal)
  const [experiences, setExperiences] = useState<ResumeExperience[]>([])
  const [education, setEducation] = useState<ResumeEducation[]>([])
  const [skillsText, setSkillsText] = useState('')
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [templateId, setTemplateId] = useState<TemplateId>(DEFAULT_TEMPLATE_ID)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const headlineRef = useRef<HTMLInputElement>(null)

  const skills = skillsText
    .split(/[,\n]/)
    .map((skill) => skill.trim())
    .filter(Boolean)

  // Required progress: nome, email, telefone, título, (experiência OR formação > 0)
  const filledRequired = [
    personal.fullName.trim().length > 0,
    personal.email.trim().length > 0,
    personal.phone.trim().length > 0,
    personal.headline.trim().length > 0,
    experiences.length > 0 || education.length > 0,
  ].filter(Boolean).length

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
      // Focus first invalid field
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

  const previewData = {
    personal,
    experiences,
    education,
    skills,
  }

  return (
    <section className="resume-builder" aria-labelledby="resume-builder-title">
      <div className="resume-builder__intro">
        <span className="eyebrow">Ferramenta local</span>
        <h2 id="resume-builder-title">Criador de Currículo</h2>
        <p>
          Preencha seus dados, escolha o modelo, acompanhe a prévia e baixe um currículo
          profissional em PDF.
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
            <label>
              Resumo profissional
              <textarea
                maxLength={700}
                onChange={(event) =>
                  updatePersonal('summary', event.target.value)
                }
                rows={5}
                value={personal.summary}
              />
            </label>
          </fieldset>

          <fieldset>
            <div className="resume-builder__section-heading">
              <legend>Experiência profissional</legend>
              <button
                disabled={experiences.length >= MAX_EXPERIENCE_ITEMS || isGenerating}
                onClick={() =>
                  setExperiences((current) => [...current, createExperience()])
                }
                type="button"
              >
                Adicionar experiência
              </button>
            </div>
            {experiences.map((experience, index) => (
              <div className="resume-builder__dynamic-card" key={experience.id}>
                <div className="resume-builder__section-heading">
                  <strong>Experiência {index + 1}</strong>
                  <button
                    aria-label={`Remover experiência ${index + 1}`}
                    disabled={isGenerating}
                    onClick={() =>
                      setExperiences((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    type="button"
                  >
                    Remover
                  </button>
                </div>
                <div className="resume-builder__field-grid">
                  <label>
                    Cargo {index + 1}
                    <input
                      maxLength={100}
                      onChange={(event) =>
                        updateExperience(index, 'role', event.target.value)
                      }
                      value={experience.role}
                    />
                  </label>
                  <label>
                    Empresa {index + 1}
                    <input
                      maxLength={100}
                      onChange={(event) =>
                        updateExperience(index, 'company', event.target.value)
                      }
                      value={experience.company}
                    />
                  </label>
                  <label>
                    Início {index + 1}
                    <input
                      onChange={(event) =>
                        updateExperience(index, 'startDate', event.target.value)
                      }
                      type="month"
                      value={experience.startDate}
                    />
                  </label>
                  <label>
                    Fim {index + 1}
                    <input
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
                <label>
                  Atividades {index + 1}
                  <textarea
                    maxLength={700}
                    onChange={(event) =>
                      updateExperience(index, 'description', event.target.value)
                    }
                    rows={4}
                    value={experience.description}
                  />
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <div className="resume-builder__section-heading">
              <legend>Formação</legend>
              <button
                disabled={education.length >= MAX_EDUCATION_ITEMS || isGenerating}
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
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    type="button"
                  >
                    Remover
                  </button>
                </div>
                <label>
                  Curso {index + 1}
                  <input
                    maxLength={120}
                    onChange={(event) =>
                      updateEducation(index, 'course', event.target.value)
                    }
                    value={item.course}
                  />
                </label>
                <label>
                  Instituição {index + 1}
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
                    Ano de início {index + 1}
                    <input
                      inputMode="numeric"
                      maxLength={10}
                      onChange={(event) =>
                        updateEducation(index, 'startYear', event.target.value)
                      }
                      value={item.startYear}
                    />
                  </label>
                  <label>
                    Ano de conclusão {index + 1}
                    <input
                      inputMode="numeric"
                      maxLength={10}
                      onChange={(event) =>
                        updateEducation(index, 'endYear', event.target.value)
                      }
                      value={item.endYear}
                    />
                  </label>
                </div>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend>Competências</legend>
            <label>
              Competências separadas por vírgula
              <textarea
                maxLength={720}
                onChange={(event) => setSkillsText(event.target.value)}
                placeholder="Atendimento, organização, Excel"
                rows={4}
                value={skillsText}
              />
            </label>
          </fieldset>

          <p className={`required-progress${allRequiredFilled ? ' required-progress--complete' : ''}`}>
            {filledRequired} de 5 campos obrigatórios preenchidos
          </p>

          {allRequiredFilled && (
            <p className="resume-valid-notice">Currículo pronto para gerar</p>
          )}

          {error && <p role="alert">{error}</p>}

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
