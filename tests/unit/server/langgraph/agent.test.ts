import { describe, it, expect, vi, beforeEach } from 'vitest'



// 在 mock 之后导入
import { generateHtmlStream } from '@/server/langgraph/agent'

// describe('generateHtmlStream', () => {


//   it('should stream chunks and yield complete result', async () => {
//     // 模拟 AI 返回的流式数据
//     const mockStream = [
//       { content: 'Here is ' },
//       { content: 'your HTML:\n' },
//       { content: '```html\n' },
//       { content: '<div>Hello World</div>\n' },
//       { content: '```' },
//     ]

//     // 设置 mock 返回值
//     // mockStreamFn.mockReturnValue(mockStream)

//     // 收集所有 yield 的结果
//     const results = []
//     for await (const result of generateHtmlStream('create a button')) {
//       results.push(result)
//     }

//     // 验证结果
//     expect(results.length).toBe(6) // 5个chunk + 1个complete

//     // 验证前几个是 chunk 类型
//     expect(results[0].type).toBe('chunk')
//     expect(results[0].content).toBe('Here is ')

//     // 验证 fullContent 在累积
//     expect(results[1].fullContent).toBe('Here is your HTML:\n')

//     // 验证最后一个是 complete 类型
//     const lastResult = results[results.length - 1]
//     expect(lastResult.type).toBe('complete')
//     expect(lastResult.content).toContain('```html')
//     expect(lastResult.htmlContent).toBe('<div>Hello World</div>')

//     // 验证 model.stream 被正确调用
//     // expect(mockStreamFn).toHaveBeenCalledTimes(1)
//     // expect(mockStreamFn).toHaveBeenCalledWith([
//     //   { role: 'system', content: 'You are a helpful assistant' },
//     //   { role: 'user', content: 'create a button' },
//     // ])
//   })
// })
