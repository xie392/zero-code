'use client'

import { ImageIcon } from 'lucide-react'
import { TooltipButton } from '@/components/ui/tooltip-button'
import { toast } from 'sonner'

export function ImageUploadButton() {
  const handleClick = () => {
    toast.info('图片上传功能暂未开放')
  }

  return (
    <TooltipButton
      content="支持JPG/PNG格式，单张不超过5MB，最多上传5张"
      onClick={handleClick}
    >
      <ImageIcon size={20} />
    </TooltipButton>
  )
}
