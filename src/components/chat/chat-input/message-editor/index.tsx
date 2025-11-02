'use client'

import { useEffect } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { $getRoot, type EditorState } from 'lexical'
import { cn } from '@/lib/utils'
import { useChatInput } from '@/context/chat-input-context'

interface MessageEditorProps {
  placeholder?: string
  className?: string
}

function EditorRefPlugin() {
  const [editor] = useLexicalComposerContext()
  const editorRef = useChatInput((ctx) => ctx.editorRef)

  useEffect(() => {
    if (editorRef && editor) {
      // 将 Lexical 的根元素赋值给 ref
      const rootElement = editor.getRootElement()
      if (rootElement && editorRef.current !== rootElement) {
        editorRef.current = rootElement as HTMLDivElement
      }
    }
  }, [editor, editorRef])

  return null
}

export function MessageEditor({
  placeholder = '一句话做网站、小程序、H5、提效工具、小游戏，你可以通过@来调用插件，为应用拓展多种能力～',
  className,
}: MessageEditorProps) {
  const setMessage = useChatInput((ctx) => ctx.setMessage)

  const initialConfig = {
    namespace: 'ChatMessageEditor',
    theme: {
      paragraph: 'mb-0',
    },
    onError: (error: Error) => {
      console.error('Lexical Error:', error)
    },
  }

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot()
      const text = root.getTextContent()
      setMessage(text)
    })
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative">
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              className={cn(
                'min-h-24 max-h-64 overflow-y-auto w-full px-3 py-2',
                'border-none outline-none',
                'text-sm text-gray-900',
                'break-words whitespace-pre-wrap',
                className,
              )}
            />
          }
          placeholder={
            <div className="absolute top-2 left-3 text-sm text-gray-400 pointer-events-none">
              {placeholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
        <EditorRefPlugin />
      </div>
    </LexicalComposer>
  )
}
