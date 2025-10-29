/**
 * 项目相关类型定义
 */

export type ProjectStatus = 'GENERATING' | 'COMPLETED' | 'ERROR'

export interface Project {
  id: string
  name: string
  userId: string
  prompt: string
  htmlContent: string | null
  status: ProjectStatus
  thumbnail: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ChatMessage {
  id: string
  projectId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata?: Record<string, any>
  createdAt: Date | string
}

export interface CreateProjectRequest {
  prompt: string
}

export interface CreateProjectResponse {
  projectId: string
  status: ProjectStatus
}

export interface GenerateStreamEvent {
  type: 'message' | 'html' | 'complete' | 'error'
  data: {
    role?: 'assistant' | 'system'
    content?: string
    htmlContent?: string
    projectId?: string
    error?: string
  }
}
