'use client'

import {
  ImageIcon,
  MicIcon,
  SendIcon,
  PaperclipIcon,
  SparklesIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TooltipButton } from '@/components/ui/tooltip-button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

export function ChatInput() {
  const router = useRouter()
  const [message, setMessage] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      })

      console.log('Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`生成失败: ${response.status} ${errorText}`)
      }

      // 读取流式响应
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('无法读取响应')
      }

      let projectId = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'project_id') {
                projectId = data.projectId
                // 立即跳转到工作区
                router.push(`/workspace/${projectId}`)
                return
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      console.error('生成失败:', error)
      toast.error('生成失败，请重试')
      setIsGenerating(false)
    }
  }

  const todo = () => {
    toast.info('功能暂未开放')
  }

  const isInputDisabled = useMemo(
    () => !message.trim().length || isGenerating,
    [message, isGenerating]
  )

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative p-2 flex flex-col bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* 输入框 */}
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setMessage(e.target.value)
            }
            className="min-h-32 max-h-64 border-none outline-none"
            placeholder="一句话做网站、小程序、H5、提效工具、小游戏，你可以通过@来调用插件，为应用拓展多种能力～"
          />
        </div>

        <div className="flex items-center justify-between gap-2 px-3 pb-2">
          <div>
            <TooltipButton
              content="支持JPG/PNG格式，单张不超过5MB，最多上传5张"
              onClick={todo}
            >
              <ImageIcon size={20} />
            </TooltipButton>
            <TooltipButton
              content="仅支持单个文件上传，支持txt、docx、doc、pdf格式"
              onClick={todo}
            >
              <PaperclipIcon size={20} />
            </TooltipButton>
            <TooltipButton
              content="指令优化"
              disabled={isInputDisabled}
              onClick={todo}
            >
              <SparklesIcon size={20} />
            </TooltipButton>
          </div>
          <div>
            <TooltipButton content="语音输入" className="mr-3" onClick={todo}>
              <MicIcon size={20} />
            </TooltipButton>
            <Button
              size="icon"
              className="size-8 rounded-lg"
              disabled={isInputDisabled}
              onClick={handleSend}
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <SendIcon size={20} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
