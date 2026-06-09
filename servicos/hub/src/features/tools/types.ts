export type ToolCategory =
  | 'documents'
  | 'pdf'
  | 'professional'
  | 'business'
  | 'utilities'

export type ToolProcessing = 'local' | 'hybrid'
export type ToolAccountRequirement = 'none' | 'optional' | 'required'
export type ToolPersistence = 'none' | 'optional' | 'required'
export type ToolStatus = 'planned' | 'building' | 'available'

export interface ToolManifest {
  slug: string
  name: string
  shortDescription: string
  category: ToolCategory
  processing: ToolProcessing
  accountRequirement: ToolAccountRequirement
  persistence: ToolPersistence
  status: ToolStatus
  roadmapOrder: number
}
