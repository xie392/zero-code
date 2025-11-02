'use client'

import { MicIcon } from 'lucide-react'
import { TooltipButton } from '@/components/ui/tooltip-button'
import { toast } from 'sonner'

export function VoiceButton() {
  const handleClick = () => {
    toast.info('语音输入功能暂未开放')
  }

  return (
    <TooltipButton content="语音输入" className="mr-3" onClick={handleClick}>
      <MicIcon size={20} />
    </TooltipButton>
  )
}
