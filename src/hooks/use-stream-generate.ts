'use client'

import { useState, useCallback } from 'react'

interface StreamChunk {
  type: 'chunk' | 'html' | 'complete' | 'error' | 'project_id'
  content?: string
  htmlContent?: string
  projectId?: string
  error?: string
}

interface UseStreamGenerateOptions {
  onChunk?: (content: string) => void
  onHtml?: (html: string) => void
  onComplete?: (data: { projectId?: string; htmlContent?: string }) => void
  onError?: (error: string) => void
}

function generateStream(body: { prompt: string; projectId?: string }) {
  return fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function useStreamGenerate(options: UseStreamGenerateOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { onChunk, onHtml, onComplete, onError } = options

  // const {} =

  const generate = useCallback(
    async (prompt: string, projectId?: string) => {
      setIsGenerating(true)

      try {
        const response = await generateStream({ prompt, projectId })

        if (!response.ok) throw new Error(`生成失败: ${response.status}`)

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error('无法读取响应')
        }

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: StreamChunk = JSON.parse(line.slice(6))

                switch (data.type) {
                  case 'chunk':
                    onChunk?.(data.content || '')
                    break
                  case 'html':
                    onHtml?.(data.htmlContent || '')
                    break
                  case 'complete':
                    onComplete?.({
                      projectId: data.projectId,
                      htmlContent: data.htmlContent,
                    })
                    break
                  case 'project_id':
                    onComplete?.({ projectId: data.projectId })
                    break
                  case 'error':
                    onError?.(data.error || '生成失败')
                    break
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '生成失败'
        onError?.(errorMsg)
        throw error
      } finally {
        setIsGenerating(false)
      }
    },
    [onChunk, onHtml, onComplete, onError],
  )

  return { generate, isGenerating }
}
