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

export function ChatInput() {
  const [message, setMessage] = useState<string>('')

  const handleSend = () => {
    toast.info('功能暂未开放')
  }

  const todo = () => {
    toast.info('功能暂未开放')
  }

  const isInputDisabled = useMemo(() => !message.trim().length, [message])

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
              <SendIcon size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
