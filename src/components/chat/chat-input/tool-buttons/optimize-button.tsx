'use client'

import { SparklesIcon } from 'lucide-react'
import { TooltipButton } from '@/components/ui/tooltip-button'
import { toast } from 'sonner'
import { useChatInput } from '@/context/chat-input-context'

export function OptimizeButton() {
  const message = useChatInput((ctx) => ctx.message)

  const handleClick = () => {
    toast.info('指令优化功能暂未开放')
  }

  return (
    <TooltipButton
      content="指令优化"
      disabled={!message.trim().length}
      onClick={handleClick}
    >
      <SparklesIcon size={20} />
    </TooltipButton>
  )
}
