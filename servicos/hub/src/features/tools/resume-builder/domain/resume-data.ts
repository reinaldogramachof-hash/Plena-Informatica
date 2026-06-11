import { z } from 'zod'

export const MAX_EXPERIENCE_ITEMS = 6
export const MAX_EDUCATION_ITEMS = 4
export const MAX_SKILLS = 12

const requiredText = (message: string, maximum: number) =>
  z.string().trim().min(1, message).max(maximum, `Use no máximo ${maximum} caracteres`)

const personalSchema = z.object({
  fullName: requiredText('Informe seu nome completo', 100),
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail')
    .email('Informe um e-mail válido')
    .max(120, 'Use no máximo 120 caracteres'),
  phone: requiredText('Informe seu telefone', 30),
  city: z.string().trim().max(100, 'Use no máximo 100 caracteres'),
  headline: requiredText('Informe seu título profissional', 100),
  summary: requiredText('Informe seu resumo profissional', 700),
})

const experienceSchema = z
  .object({
    id: z.string().min(1),
    role: requiredText('Informe o cargo', 100),
    company: requiredText('Informe a empresa', 100),
    startDate: requiredText('Informe o início da experiência', 20),
    endDate: z.string().trim().max(20),
    current: z.boolean(),
    description: requiredText('Descreva suas principais atividades', 700),
  })
  .superRefine((experience, context) => {
    if (!experience.current && !experience.endDate) {
      context.addIssue({
        code: 'custom',
        message: 'Informe o fim da experiência',
        path: ['endDate'],
      })
    }
  })

const educationSchema = z.object({
  id: z.string().min(1),
  course: requiredText('Informe o curso', 120),
  institution: requiredText('Informe a instituição', 120),
  startYear: z.string().trim().max(10),
  endYear: z.string().trim().max(10),
})

const resumeSchema = z.object({
  personal: personalSchema,
  experiences: z
    .array(experienceSchema)
    .max(
      MAX_EXPERIENCE_ITEMS,
      `Adicione no máximo ${MAX_EXPERIENCE_ITEMS} experiências`,
    ),
  education: z
    .array(educationSchema)
    .max(
      MAX_EDUCATION_ITEMS,
      `Adicione no máximo ${MAX_EDUCATION_ITEMS} formações`,
    ),
  skills: z
    .array(z.string().trim().max(60, 'Use no máximo 60 caracteres por competência'))
    .transform((skills) => skills.filter(Boolean))
    .pipe(
      z
        .array(z.string())
        .max(MAX_SKILLS, `Adicione no máximo ${MAX_SKILLS} competências`),
    ),
})

export type ResumeDataInput = z.input<typeof resumeSchema>
export type ResumeData = z.output<typeof resumeSchema>
export type ResumePersonal = ResumeDataInput['personal']
export type ResumeExperience = ResumeDataInput['experiences'][number]
export type ResumeEducation = ResumeDataInput['education'][number]

export function parseResumeData(input: ResumeDataInput): ResumeData {
  const result = resumeSchema.safeParse(input)

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? 'Revise os dados do currículo')
  }

  return result.data
}
