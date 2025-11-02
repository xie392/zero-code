'use client'

import { SendIcon } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useChatInput } from '@/context/chat-input-context'

interface SendButtonProps extends Omit<ButtonProps, 'onClick' | 'disabled'> {}

function useChatInputSend() {
  const message = useChatInput((ctx) => ctx.message)
  const isLoading = useChatInput((ctx) => ctx.isLoading)
  const editorRef = useChatInput((ctx) => ctx.editorRef)
  const onSend = useChatInput((ctx) => ctx.onSend)
  const setMessage = useChatInput((ctx) => ctx.setMessage)
  return { message, isLoading, editorRef, onSend, setMessage }
}

export function SendButton({ className, ...props }: SendButtonProps) {
  const { message, isLoading, editorRef, onSend, setMessage } =
    useChatInputSend()

  const isDisabled = !message.trim() || isLoading

  const clearMeesage = () => {
    if (editorRef?.current) editorRef.current.textContent = ''
    setMessage('')
  }

  const handleSend = async () => {
    if (isDisabled || !onSend) return
    const currentMessage = message.trim()
    clearMeesage()
    await onSend(currentMessage)
  }

  return (
    <Button
      size="icon"
      className={cn('size-8 rounded-lg', className)}
      disabled={isDisabled}
      onClick={handleSend}
      aria-label={isLoading ? '发送中...' : '发送消息'}
      {...props}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
      ) : (
        <SendIcon size={20} />
      )}
    </Button>
  )
}
