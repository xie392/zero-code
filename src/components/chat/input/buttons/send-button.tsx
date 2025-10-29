'use client'

import { SendIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useStreamGenerate } from '@/hooks/use-stream-generate'

interface SendButtonProps extends ButtonProps {
  message: string
}

export function SendButton({ message, className, ...props }: SendButtonProps) {
  const router = useRouter()

  const { generate, isGenerating } = useStreamGenerate({
    onComplete: (data) => {
      if (data.projectId) {
        router.push(`/workspace/${data.projectId}`)
      }
    },
    onError: (error) => {
      toast.error(`生成失败: ${error}`)
    },
  })

  const handleSend = async () => {
    if (!message.trim() || isGenerating) return

    try {
      await generate(message)
    } catch (error) {
      console.error('发送失败:', error)
    }
  }

  return (
    <Button
      size="icon"
      className={cn('size-8 rounded-lg', className)}
      disabled={!message.trim().length || isGenerating}
      onClick={handleSend}
      {...props}
    >
      {isGenerating ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
      ) : (
        <SendIcon size={20} />
      )}
    </Button>
  )
}
