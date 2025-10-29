'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import type { ProjectListItem } from '@/types/project'
import Image from 'next/image'

interface AppItemProps {
  project: ProjectListItem
}

export function AppItem({ project }: AppItemProps) {
  const router = useRouter()
  const handleOpen = () => {
    router.push(`/workspace/${project.id}`)
  }

  return (
    <div className="group w-full">
      {/* 图片容器 */}
      <div
        className="relative h-64 w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100"
        onClick={handleOpen}
      >
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={project.name}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">🎨</div>
              <p className="text-gray-500 text-sm">{project.name}</p>
            </div>
          </div>
        )}
        {/* 悬浮按钮层 */}
        <div className="absolute inset-0 flex flex-col justify-end bg-black/30 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="flex gap-4 translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
            <Button className="flex-1" onClick={handleOpen}>
              打开
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/workspace/${project.id}`)
              }}
            >
              编辑
            </Button>
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="space-y-2 py-4">
        <h3
          className="truncate font-semibold text-slate-900 dark:text-white"
          title={project.name}
        >
          {project.name}
        </h3>
        <p
          className="text-sm text-gray-500 line-clamp-2"
          title={project.prompt}
        >
          {project.prompt}
        </p>

        {/* 状态与时间 */}
        <div className="flex items-center justify-between text-sm">
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
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
          <span className="text-gray-400 text-xs">
            {new Date(project.createdAt).toLocaleDateString('zh-CN')}
          </span>
        </div>
      </div>
    </div>
  )
}
