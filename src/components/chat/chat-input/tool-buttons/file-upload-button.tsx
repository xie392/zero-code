'use client'

import { PaperclipIcon } from 'lucide-react'
import { TooltipButton } from '@/components/ui/tooltip-button'
import { toast } from 'sonner'

export function FileUploadButton() {
  const handleClick = () => {
    toast.info('文件上传功能暂未开放')
  }

  return (
    <TooltipButton
      content="仅支持单个文件上传，支持txt、docx、doc、pdf格式"
      onClick={handleClick}
    >
      <PaperclipIcon size={20} />
    </TooltipButton>
  )
}
