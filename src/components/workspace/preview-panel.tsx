'use client'

import { useEffect, useRef, useState } from 'react'
import { RefreshCw, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PreviewPanelProps {
  htmlContent: string | null
}

export function PreviewPanel({ htmlContent }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (htmlContent && iframeRef.current) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document

      if (doc) {
        doc.open()
        doc.write(htmlContent)
        doc.close()
      }
    }
  }, [htmlContent, key])

  const handleRefresh = () => {
    setKey((prev) => prev + 1)
  }

  const handleOpenInNewTab = () => {
    if (htmlContent) {
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    }
  }

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">预览</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="h-8 px-3"
            title="刷新"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenInNewTab}
            className="h-8 px-3"
            title="新标签页打开"
            disabled={!htmlContent}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 预览区域 */}
      <div className="flex-1 relative bg-gray-100">
        {htmlContent ? (
          <iframe
            key={key}
            ref={iframeRef}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms"
            title="预览"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <p>等待生成...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
