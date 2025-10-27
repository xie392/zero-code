/**
 * LangGraph Agent 核心逻辑
 */

import { ChatOpenAI } from '@langchain/openai'
import { StateGraph, MessagesAnnotation, START, END } from '@langchain/langgraph'
import { AIMessage } from '@langchain/core/messages'
import { SYSTEM_PROMPT, generateUserPrompt } from './prompts'

// 定义 Agent 状态
export interface AgentState {
  messages: any[]
  htmlContent: string | null
  isComplete: boolean
}

/**
 * 创建 HTML 生成 Agent
 */
export function createHtmlGeneratorAgent() {
  // 初始化 DeepSeek 模型（兼容 OpenAI API）
  const model = new ChatOpenAI({
    modelName: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    temperature: 0.7,
    streaming: true,
    configuration: {
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
    },
  })

  // 定义生成节点
  const generateHtmlNode = async (state: typeof MessagesAnnotation.State) => {
    const response = await model.invoke([
      { role: 'system', content: SYSTEM_PROMPT },
      ...state.messages,
    ])

    return {
      messages: [response],
    }
  }

  // 构建状态图
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode('generate', generateHtmlNode)
    .addEdge(START, 'generate')
    .addEdge('generate', END)

  // 编译图
  return workflow.compile()
}

/**
 * 生成 HTML 内容（流式）
 */
export async function* generateHtmlStream(userPrompt: string) {
  const model = new ChatOpenAI({
    modelName: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    temperature: 0.7,
    streaming: true,
    configuration: {
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
    },
  })

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    { role: 'user' as const, content: generateUserPrompt(userPrompt) },
  ]

  // 使用流式生成
  const stream = await model.stream(messages)

  let fullContent = ''

  for await (const chunk of stream) {
    const content = chunk.content as string
    fullContent += content

    yield {
      type: 'chunk' as const,
      content,
      fullContent,
    }
  }

  // 提取 HTML 内容
  const htmlContent = extractHtmlFromResponse(fullContent)

  yield {
    type: 'complete' as const,
    content: fullContent,
    htmlContent,
  }
}

/**
 * 从响应中提取 HTML 代码
 */
function extractHtmlFromResponse(response: string): string {
  // 尝试提取 HTML 代码块
  const htmlBlockMatch = response.match(/```html\n([\s\S]*?)\n```/)
  if (htmlBlockMatch) {
    return htmlBlockMatch[1]
  }

  // 尝试提取 DOCTYPE 开始的内容
  const doctypeMatch = response.match(/(<!DOCTYPE[\s\S]*<\/html>)/i)
  if (doctypeMatch) {
    return doctypeMatch[1]
  }

  // 如果包含 html 标签，直接返回
  if (response.includes('<html') && response.includes('</html>')) {
    return response
  }

  // 否则返回原内容
  return response
}

/**
 * 优化/修改已有的 HTML（用于后续迭代）
 */
export async function* modifyHtmlStream(
  currentHtml: string,
  userInstruction: string
) {
  const model = new ChatOpenAI({
    modelName: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    temperature: 0.7,
    streaming: true,
    configuration: {
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
    },
  })

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    {
      role: 'user' as const,
      content: `当前的 HTML 代码：\n\n${currentHtml}\n\n请根据以下要求修改代码：\n${userInstruction}\n\n请返回完整的修改后的 HTML 代码。`,
    },
  ]

  const stream = await model.stream(messages)

  let fullContent = ''

  for await (const chunk of stream) {
    const content = chunk.content as string
    fullContent += content

    yield {
      type: 'chunk' as const,
      content,
      fullContent,
    }
  }

  const htmlContent = extractHtmlFromResponse(fullContent)

  yield {
    type: 'complete' as const,
    content: fullContent,
    htmlContent,
  }
}
