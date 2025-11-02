import z from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1, '项目名称不能为空'),
  prompt: z.string().min(1, '提示词不能为空'),
})

export const updateProjectSchema = z.object({
  id: z.string().min(1, '项目 ID 不能为空'),
  name: z.string().min(1, '项目名称不能为空').optional(),
  thumbnail: z.string().optional(),
})

export const listProjectSchema = z
  .object({
    limit: z.number().min(1).max(100).default(20),
    cursor: z.string(),
  })
  .optional()

export const deleteProjectSchema = z.object({
  id: z.string().min(1, '项目 ID 不能为空'),
})

export const getProjectByIdSchema = z.object({
  id: z.string().min(1, '项目 ID 不能为空'),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type ListProjectInput = z.infer<typeof listProjectSchema>
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>
export type GetProjectByIdInput = z.infer<typeof getProjectByIdSchema>
