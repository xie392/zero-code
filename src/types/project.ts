/**
 * 项目相关类型定义
 * 直接使用 Prisma 生成的类型，避免重复定义
 */

import type { project, chat_message, ProjectStatus } from '@prisma/client'

// 导出 Prisma 生成的类型
export type { ProjectStatus }
export type Project = project
export type ChatMessage = chat_message

/**
 * 将 Date 类型转换为 string（用于序列化后的数据）
 */
type SerializedDates<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K]
}

/**
 * Project list item type (subset of Project for list views)
 * 使用 string 类型的日期，因为 TRPC 会序列化 Date 为 string
 */
export type ProjectListItem = SerializedDates<
  Pick<
    Project,
    | 'id'
    | 'name'
    | 'prompt'
    | 'status'
    | 'thumbnail'
    | 'createdAt'
    | 'updatedAt'
  >
>

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
