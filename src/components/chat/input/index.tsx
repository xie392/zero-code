'use client'

import { ImageIcon, MicIcon, PaperclipIcon, SparklesIcon } from 'lucide-react'
import { TooltipButton } from '@/components/ui/tooltip-button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useState } from 'react'
import { SendButton } from './buttons/send-button'
import { MinChatInput } from './input/min-chat-input'

export function ChatInput() {
  const [message, setMessage] = useState<string>('')

  const todo = () => {
    toast.info('功能暂未开放')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative p-2 flex flex-col bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative">
          <MinChatInput value={message} onChange={setMessage} />
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
              disabled={!message.trim().length}
              onClick={todo}
            >
              <SparklesIcon size={20} />
            </TooltipButton>
          </div>
          <div>
            <TooltipButton content="语音输入" className="mr-3" onClick={todo}>
              <MicIcon size={20} />
            </TooltipButton>
            <SendButton message={message} />
          </div>
        </div>
      </div>
    </div>
  )
}
