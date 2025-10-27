'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PreviewPanel } from '@/components/workspace/preview-panel'
import { ChatPanel } from '@/components/workspace/chat-panel'
import type { Project, ChatMessage } from '@/types/project'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function WorkspacePage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProject()
  }, [resolvedParams.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`)

      if (!response.ok) {
        throw new Error('获取项目失败')
      }

      const data = await response.json()
      setProject(data.project)
      setMessages(data.project.messages || [])
      setHtmlContent(data.project.htmlContent)
    } catch (err) {
      console.error('获取项目失败:', err)
      setError('获取项目失败')
    } finally {
      setIsLoading(false)
    }
  }

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

  if (error || !project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || '项目不存在'}</p>
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
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              project.status === 'COMPLETED'
                ? 'bg-green-100 text-green-700'
                : project.status === 'GENERATING'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-red-100 text-red-700'
            }`}
          >
            {project.status === 'COMPLETED'
              ? '已完成'
              : project.status === 'GENERATING'
                ? '生成中'
                : '错误'}
          </span>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：预览区 */}
        <div className="w-3/5">
          <PreviewPanel htmlContent={htmlContent} />
        </div>

        {/* 右侧：对话区 */}
        <div className="w-2/5">
          <ChatPanel
            projectId={project.id}
            initialMessages={messages}
            onNewHtml={handleNewHtml}
          />
        </div>
      </div>
    </div>
  )
}
