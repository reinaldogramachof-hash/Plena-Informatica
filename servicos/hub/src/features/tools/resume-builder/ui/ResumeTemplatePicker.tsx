import { RESUME_TEMPLATES, type TemplateId } from '../domain/resume-templates'

type ResumeTemplatePickerProps = {
  selected: TemplateId
  onChange: (id: TemplateId) => void
}

export function ResumeTemplatePicker({ selected, onChange }: ResumeTemplatePickerProps) {
  return (
    <div className="resume-template-picker" role="group" aria-label="Escolha o modelo do currículo">
      {RESUME_TEMPLATES.map((template) => (
        <button
          key={template.id}
          type="button"
          className={`resume-template-card resume-template-card--${template.id}`}
          aria-pressed={selected === template.id ? 'true' : 'false'}
          onClick={() => onChange(template.id)}
        >
          <div className="resume-template-card__thumb" aria-hidden="true" />
          <div className="resume-template-card__body">
            {template.badge && (
              <span className="resume-template-card__badge">{template.badge}</span>
            )}
            <span className="resume-template-card__name">{template.name}</span>
            <span className="resume-template-card__description">{template.description}</span>
            {template.atsWarning && (
              <span className="resume-template-card__warning">{template.atsWarning}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
