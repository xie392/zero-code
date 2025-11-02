'use client'

import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github-dark.css'

import { ToolButtons } from './tool-buttons'

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date | string
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user'
  const isSystem = role === 'system'
  const isAssistant = role === 'assistant'

  return (
    <div
      className={cn(
        'flex',
        isUser && 'justify-end',
        isAssistant && 'justify-start',
        isSystem && 'justify-center',
      )}
    >
      <div className="flex flex-col">
        <div
          className={cn(
            'max-w-full rounded-lg py-2 shadow mb-1.5',
            isUser && 'px-4 bg-gray-100',
          )}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words text-sm">
              {content}
            </div>
          ) : (
            <div
              className={cn(
                'text-sm',
                'prose prose-sm max-w-none',
                'prose-headings:mt-3 prose-headings:mb-2 prose-headings:text-gray-900',
                'prose-p:my-2 prose-p:text-gray-900',
                'prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:my-2',
                'prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs',
                'prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline',
                'prose-ul:my-2 prose-ol:my-2',
                'prose-li:my-1 prose-li:text-gray-900',
                'prose-strong:text-gray-900 prose-strong:font-semibold',
                'prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-700',
              )}
            >
              {/* <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            > */}
              {content}
              {/* </ReactMarkdown> */}
            </div>
          )}
        </div>
        <ToolButtons />
      </div>
    </div>
  )
}
