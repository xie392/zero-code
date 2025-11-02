'use client'

import { cn } from '@/lib/utils'
import { ChatInputProvider } from '@/context/chat-input-context'
import { MessageEditor } from './message-editor'
import { ToolButtons, VoiceButton, SendButton } from './tool-buttons'

interface ChatInputProps extends React.ComponentProps<'div'> {
  onSend?: (message: string) => void
  isLoading?: boolean
  editorClassName?: string
}

export function ChatInput({
  className,
  onSend,
  isLoading = false,
  editorClassName,
  ...props
}: ChatInputProps) {
  return (
    <ChatInputProvider onSend={onSend} isLoading={isLoading}>
      <div className={cn('w-full max-w-4xl mx-auto', className)} {...props}>
        <div
          className={cn(
            'relative p-2 flex flex-col',
            'bg-gray-50 border border-gray-200',
            'rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200',
          )}
        >
          <MessageEditor className={editorClassName} />
          <div className="flex items-center justify-between gap-2 px-3 pb-2">
            <ToolButtons />
            <div className="flex items-center gap-2">
              <VoiceButton />
              <SendButton />
            </div>
          </div>
        </div>
      </div>
    </ChatInputProvider>
  )
}
