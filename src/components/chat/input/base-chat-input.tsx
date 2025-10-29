'use client'

import { useState, KeyboardEvent } from 'react'
import { SendIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MinChatInput } from './input/min-chat-input'

interface BaseChatInputProps {
  onSend: (message: string) => void | Promise<void>
  isLoading?: boolean
  placeholder?: string
  className?: string
}

export function BaseChatInput({
  onSend,
  isLoading = false,
  placeholder = '输入消息...',
  className,
}: BaseChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = async () => {
    if (!message.trim() || isLoading) return

    const currentMessage = message
    setMessage('')
    await onSend(currentMessage.trim())
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn('flex gap-2', className)}>
      <MinChatInput
        value={message}
        onChange={setMessage}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="flex-1"
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className="self-end"
        size="icon"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
