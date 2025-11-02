'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PreviewPanel } from '@/components/workspace/preview-panel'
import { ChatPanel } from '@/components/workspace/chat-panel'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trpc } from '@/server/api/trpc-client'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function WorkspacePage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [htmlContent, setHtmlContent] = useState<string | null>(null)

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = trpc.project.getById.useQuery({
    id: resolvedParams.id,
  })

  const handleNewHtml = (html: string) => {
    setHtmlContent(html)
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error?.message || '项目不存在'}</p>
          <Button onClick={() => router.push('/')}>返回首页</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <div className="h-14 border-b bg-white flex items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900 truncate">
            {project.name}
          </h1>
          <p className="text-xs text-gray-500 truncate">{project.prompt}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">发布</Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="w-full">
          <ResizablePanel defaultSize={50} minSize={25}>
            <PreviewPanel htmlContent={htmlContent || project.htmlContent} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50} minSize={25}>
            <ChatPanel
              projectId={project.id}
              initialMessages={project.messages}
              onNewHtml={handleNewHtml}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
