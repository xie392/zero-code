import { ChatOpenAI } from '@langchain/openai'
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from '@langchain/langgraph'
// import { AIMessage } from '@langchain/core/messages'
import { SYSTEM_PROMPT, generateUserPrompt } from './prompts'

export interface AgentState {
  messages: any[]
  htmlContent: string | null
  isComplete: boolean
}

const model = new ChatOpenAI({
  modelName: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  temperature: 0.7,
  streaming: true,
  configuration: {
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
  },
})

export function createHtmlGeneratorAgent() {
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

export async function* generateHtmlStream(userPrompt: string) {
  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    { role: 'user' as const, content: generateUserPrompt(userPrompt) },
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

function extractHtmlFromResponse(response: string): string {
  const htmlBlockMatch = response.match(/```html\n([\s\S]*?)\n```/)
  if (htmlBlockMatch) {
    return htmlBlockMatch[1]
  }

  const doctypeMatch = response.match(/(<!DOCTYPE[\s\S]*<\/html>)/i)
  if (doctypeMatch) {
    return doctypeMatch[1]
  }

  if (response.includes('<html') && response.includes('</html>')) {
    return response
  }

  return response
}

export async function* modifyHtmlStream(
  currentHtml: string,
  userInstruction: string,
) {
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
