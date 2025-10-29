'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Code2,
  Palette,
  Database,
  Shield,
  Smartphone,
  Moon,
  BarChart3,
  ExternalLink,
  Rocket,
  Users,
  Target,
  Lightbulb,
} from 'lucide-react'
import Link from 'next/link'
import { GithubIcon } from '@/components/ui/icon+'

const techStack = {
  frontend: [
    {
      name: 'React 19',
      icon: '⚛️',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    {
      name: 'Next.js',
      icon: '▲',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    },
    {
      name: 'TypeScript',
      icon: '📘',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    {
      name: 'Tailwind CSS',
      icon: '🎨',
      color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    },
    {
      name: 'Radix UI',
      icon: '🔧',
      color:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    },
  ],
  backend: [
    {
      name: 'Next.js API',
      icon: '▲',
      color:
        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    },
    {
      name: 'Prisma ORM',
      icon: '🔺',
      color:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    },
    {
      name: 'PostgreSQL',
      icon: '🐘',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    {
      name: 'Better Auth',
      icon: '🔐',
      color:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    },
  ],
}

const features = [
  {
    icon: Code2,
    title: 'AI 网页生成',
    description: '使用 LangGraph + DeepSeek 智能生成 HTML 应用',
    status: '✅ 已完成',
  },
  {
    icon: Palette,
    title: '实时预览',
    description: '左侧预览右侧对话，实时查看生成效果',
    status: '✅ 已完成',
  },
  {
    icon: Shield,
    title: '用户认证',
    description: '基于 Better Auth 的完整认证系统',
    status: '✅ 已完成',
  },
  {
    icon: Smartphone,
    title: '流式生成',
    description: '实时流式展示 AI 生成过程',
    status: '✅ 已完成',
  },
  {
    icon: Moon,
    title: '对话优化',
    description: '多轮对话持续优化生成的应用',
    status: '✅ 已完成',
  },
  {
    icon: BarChart3,
    title: '项目管理',
    description: '完整的项目历史和对话记录',
    status: '✅ 已完成',
  },
]

const stats = [
  { label: '首屏加载', value: '< 2s', description: '极速响应' },
  { label: '打包大小', value: '< 500KB', description: '轻量级应用' },
  { label: 'API响应', value: '< 100ms', description: '毫秒级响应' },
  { label: '移动适配', value: '100%', description: '完美适配' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* 背景渐变 */}
      <div
        className={cn(
          'fixed top-0 -z-10 h-screen w-full',
          'bg-gradient-to-b from-white via-blue-50 to-indigo-100',
          'dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900',
        )}
      />

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Hero 区域 */}
        <section className="text-center space-y-8">
          <div className="space-y-4">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              🚀 Version 1.0.0
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Zero Code AI Platform
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              零代码AI平台 - 让AI开发变得简单而强大
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2">
              <Rocket className="size-4" />
              开始使用
            </Button>
            <Link href="https://github.com" target="_blank">
              <Button variant="outline" size="lg" className="gap-2">
                <GithubIcon className="size-4" />
                查看源码
              </Button>
            </Link>
          </div>
        </section>

        {/* 核心亮点 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">✨ 项目亮点</h2>
            <p className="text-muted-foreground">
              现代化技术栈，强大的功能特性
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="size-5 text-blue-500" />
                  现代化前端
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {techStack.frontend.map((tech) => (
                    <Badge
                      key={tech.name}
                      variant="secondary"
                      className={tech.color}
                    >
                      {tech.icon} {tech.name}
                    </Badge>
                  ))}
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>⚡ React 19 + TypeScript</li>
                  <li>🎭 Tailwind CSS + Radix UI</li>
                  <li>🌙 深色模式支持</li>
                  <li>📱 响应式设计</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Database className="size-5 text-green-500" />
                  强大后端
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {techStack.backend.map((tech) => (
                    <Badge
                      key={tech.name}
                      variant="secondary"
                      className={tech.color}
                    >
                      {tech.icon} {tech.name}
                    </Badge>
                  ))}
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>▲ Next.js 15 API Routes</li>
                  <li>🐘 PostgreSQL 数据库</li>
                  <li>🔺 Prisma ORM</li>
                  <li>🔐 Better Auth 认证</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 核心功能 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">🎯 核心功能</h2>
            <p className="text-muted-foreground">
              强大的功能模块，满足各种开发需求
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="size-5 text-primary" />
                    </div>
                    <span className="text-lg">{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{feature.description}</p>
                  <Badge
                    variant={
                      feature.status.includes('✅') ? 'default' : 'secondary'
                    }
                  >
                    {feature.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 性能指标 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">📈 性能指标</h2>
            <p className="text-muted-foreground">
              优异的性能表现，极致的用户体验
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 text-center">
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="font-medium">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 团队信息 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">👥 关于团队</h2>
            <p className="text-muted-foreground">
              致力于打造最优秀的零代码AI平台
            </p>
          </div>

          <Card className="p-8 text-center">
            <CardContent className="space-y-6">
              <div className="flex justify-center items-center gap-4 text-4xl">
                <Users className="size-12 text-primary" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Zero Code Team</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  我们是一支充满激情的开发团队，专注于AI技术与零代码平台的结合，
                  致力于让每个人都能轻松创建强大的AI应用。
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="https://github.com" target="_blank">
                    <Button variant="outline" className="gap-2">
                      <GithubIcon className="size-4" />
                      GitHub
                    </Button>
                  </Link>
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="size-4" />
                    联系我们
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 行动号召 */}
        <section className="text-center space-y-8 py-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">🌟 开始你的AI开发之旅</h2>
            <p className="text-xl text-muted-foreground">
              加入我们，体验零代码AI开发的魅力
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <Lightbulb className="size-4" />
                立即开始
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2">
              <Target className="size-4" />
              了解更多
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
