'use client'

import { useEffect, useState } from 'react'
import { AppItem } from './app-list-item'
import type { Project } from '@/types/project'
import { Loader2 } from 'lucide-react'

export function AppList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('获取项目列表失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full md:px-8 px-4 mx-auto pt-10">
      <div className="flex justify-between items-center py-2 bg-mute sticky top-0 z-10 h-16">
        <div className="text-lg font-bold">我的应用</div>
        <div className="text-sm text-gray-500">{projects.length} 个应用</div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg mb-2">还没有应用</p>
          <p className="text-sm">在上方输入框中描述你的想法，开始创建吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-5">
          {projects.map((project) => (
            <AppItem key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
