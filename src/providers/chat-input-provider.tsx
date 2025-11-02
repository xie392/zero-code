'use client'

import { createContext, useRef, useState, type ReactNode } from 'react'
import { useContextSelector } from 'use-context-selector'

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
  children: ReactNode
  onSend?: (message: string) => void | Promise<void>
  isLoading?: boolean
  defaultValue?: string
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

// Custom hooks for selective context consumption
export function useChatInputMessage() {
  return useContextSelector(ChatInputContext, (context) => {
    if (!context) {
      throw new Error('useChatInputMessage must be used within ChatInputProvider')
    }
    return context.message
  })
}

export function useChatInputSetMessage() {
  return useContextSelector(ChatInputContext, (context) => {
    if (!context) {
      throw new Error('useChatInputSetMessage must be used within ChatInputProvider')
    }
    return context.setMessage
  })
}

export function useChatInputEditorRef() {
  return useContextSelector(ChatInputContext, (context) => {
    if (!context) {
      throw new Error('useChatInputEditorRef must be used within ChatInputProvider')
    }
    return context.editorRef
  })
}

export function useChatInputIsComposing() {
  return useContextSelector(ChatInputContext, (context) => {
    if (!context) {
      throw new Error('useChatInputIsComposing must be used within ChatInputProvider')
    }
    return { isComposing: context.isComposing, setIsComposing: context.setIsComposing }
  })
}

export function useChatInputOnSend() {
  return useContextSelector(ChatInputContext, (context) => {
    if (!context) {
      throw new Error('useChatInputOnSend must be used within ChatInputProvider')
    }
    return context.onSend
  })
}

export function useChatInputIsLoading() {
  return useContextSelector(ChatInputContext, (context) => {
    if (!context) {
      throw new Error('useChatInputIsLoading must be used within ChatInputProvider')
    }
    return context.isLoading
  })
}
