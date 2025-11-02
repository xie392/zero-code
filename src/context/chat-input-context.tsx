'use client'
import { useRef, useState } from 'react'
import { useContextSelector, createContext } from 'use-context-selector'

interface ChatInputContextValue {
  message: string
  setMessage: (message: string) => void
  editorRef: React.RefObject<HTMLDivElement | null>
  isComposing: boolean
  setIsComposing: (isComposing: boolean) => void
  onSend?: (message: string) => void | Promise<void>
  isLoading?: boolean
}

const ChatInputContext = createContext<ChatInputContextValue | null>(null)

interface ChatInputProviderProps {
  children: React.ReactNode
  onSend?: (message: string) => void | Promise<void>
  isLoading?: boolean
  defaultValue?: string
}

export function useChatInput<T>(
  selector: (value: ChatInputContextValue) => T,
): T {
  return useContextSelector(ChatInputContext, (context) => {
    if (!context) {
      throw new Error('useChatInput must be used within a ChatInputProvider')
    }
    return selector(context)
  })
}

export function ChatInputProvider({
  children,
  onSend,
  isLoading = false,
  defaultValue = '',
}: ChatInputProviderProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState<string>(defaultValue)
  const [isComposing, setIsComposing] = useState<boolean>(false)

  const contextValue: ChatInputContextValue = {
    message,
    setMessage,
    editorRef,
    isComposing,
    setIsComposing,
    onSend,
    isLoading,
  }

  return (
    <ChatInputContext.Provider value={contextValue}>
      {children}
    </ChatInputContext.Provider>
  )
}
