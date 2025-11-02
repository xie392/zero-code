/**
 * 生成应用 API
 * POST /api/generate
 */

import type { NextRequest } from 'next/server'
import { prisma } from '@/server/prisma'
import { generateHtmlStream, modifyHtmlStream } from '@/server/langgraph/agent'
import { auth } from '@/server/auth/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: '未登录或登录已过期' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const body = await request.json()
    const { prompt, projectId } = body

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: '无效的提示词' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // 如果有 projectId，说明是修改现有项目
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      })

      if (!project) {
        return new Response(
          JSON.stringify({ error: 'Not Found', message: '项目不存在' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      if (project.userId !== session.user.id) {
        return new Response(
          JSON.stringify({ error: 'Forbidden', message: '无权访问此项目' }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      // 保存用户消息
      await prisma.chat_message.create({
        data: {
          projectId,
          role: 'user',
          content: prompt,
        },
      })

      // 修改现有 HTML
      return streamModifyResponse(projectId, project.htmlContent || '', prompt)
    }

    // 创建新项目
    const project = await prisma.project.create({
      data: {
        name: generateProjectName(prompt),
        userId: session.user.id,
        prompt,
        status: 'GENERATING',
      },
    })

    // 保存用户消息
    await prisma.chat_message.create({
      data: {
        projectId: project.id,
        role: 'user',
        content: prompt,
      },
    })

    // 流式生成响应
    return streamGenerateResponse(project.id, prompt)
  } catch (error) {
    console.error('Generate API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: '服务器内部错误' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

/**
 * 流式生成新项目
 */
async function streamGenerateResponse(projectId: string, prompt: string) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 发送项目 ID
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'project_id', projectId })}\n\n`,
          ),
        )

        let assistantMessage = ''
        let htmlContent = ''

        // 生成 HTML
        for await (const chunk of generateHtmlStream(prompt)) {
          if (chunk.type === 'chunk') {
            assistantMessage = chunk.fullContent
            // 发送流式内容
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'chunk', content: chunk.content })}\n\n`,
              ),
            )
          } else if (chunk.type === 'complete') {
            htmlContent = chunk.htmlContent
            // 发送完成信号
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'html', htmlContent })}\n\n`,
              ),
            )
          }
        }

        // 保存 AI 消息
        await prisma.chat_message.create({
          data: {
            projectId,
            role: 'assistant',
            content: assistantMessage,
          },
        })

        // 更新项目
        await prisma.project.update({
          where: { id: projectId },
          data: {
            htmlContent,
            status: 'COMPLETED',
          },
        })

        // 发送完成信号
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'complete', projectId, htmlContent })}\n\n`,
          ),
        )

        controller.close()
      } catch (error) {
        console.error('Stream error:', error)

        // 更新项目状态为错误
        await prisma.project.update({
          where: { id: projectId },
          data: { status: 'ERROR' },
        })

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'error', error: 'Generation failed' })}\n\n`,
          ),
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

/**
 * 流式修改项目
 */
async function streamModifyResponse(
  projectId: string,
  currentHtml: string,
  instruction: string,
) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let assistantMessage = ''
        let htmlContent = ''

        // 修改 HTML
        for await (const chunk of modifyHtmlStream(currentHtml, instruction)) {
          if (chunk.type === 'chunk') {
            assistantMessage = chunk.fullContent
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'chunk', content: chunk.content })}\n\n`,
              ),
            )
          } else if (chunk.type === 'complete') {
            htmlContent = chunk.htmlContent
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'html', htmlContent })}\n\n`,
              ),
            )
          }
        }

        // 保存 AI 消息
        await prisma.chat_message.create({
          data: {
            projectId,
            role: 'assistant',
            content: assistantMessage,
          },
        })

        // 更新项目
        await prisma.project.update({
          where: { id: projectId },
          data: {
            htmlContent,
            status: 'COMPLETED',
          },
        })

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'complete', projectId, htmlContent })}\n\n`,
          ),
        )

        controller.close()
      } catch (error) {
        console.error('Modify stream error:', error)
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'error', error: 'Modification failed' })}\n\n`,
          ),
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

/**
 * 根据 prompt 生成项目名称
 */
function generateProjectName(prompt: string): string {
  // 取前30个字符作为项目名
  const name = prompt.slice(0, 30).trim()
  return name || '未命名项目'
}
