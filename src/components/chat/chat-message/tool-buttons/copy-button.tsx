import { TooltipButton } from '@/components/ui/tooltip-button'
import { CopyIcon } from 'lucide-react'

export function CopyButton() {
  return (
    <TooltipButton content="复制">
      <CopyIcon size={16} className="text-gray-500" />
    </TooltipButton>
  )
}
