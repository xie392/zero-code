import { auth } from '@/server/auth/auth'
import { modifyHtmlStream } from '@/server/langgraph/agent'
import { prisma } from '@/server/prisma'
import type { NextRequest } from 'next/server'

function handleResponse(code: number, message: string) {
  return new Response(
    JSON.stringify({
      code,
      message,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}

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

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return handleResponse(401, '未登录或登录已过期')
    }

    const body = await request.json()
    const { projectId, message } = body
    if (!projectId || !message) {
      return handleResponse(400, '缺少必要参数')
    }

    if (!prompt || typeof message !== 'string') {
      return handleResponse(400, '无效的消息')
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        deletedAt: null,
      },
    })

    if (!project) {
      return handleResponse(404, '项目不存在')
    }

    if (project.userId !== session.user.id) {
      return handleResponse(403, '无权访问此项目')
    }

    await prisma.chat_message.create({
      data: {
        projectId,
        role: 'user',
        content: message,
      },
    })

    return streamModifyResponse(projectId, project.htmlContent || '', message)
  } catch (error) {
    console.error('Chat API error:', error)
    return handleResponse(500, '服务器内部错误')
  }
}
