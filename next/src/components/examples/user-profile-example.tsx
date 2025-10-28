'use client'

import { useState } from 'react'
import { trpc } from '@/server/api/trpc-client'
import { useSession } from '@/server/auth/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

/**
 * 用户个人资料示例组件
 * 
 * 展示如何使用受保护的 tRPC 接口
 * 需要用户登录后才能访问
 */
export function UserProfileExample() {
  // 获取当前登录状态
  const { data: session } = useSession()

  // 获取当前用户详细信息（受保护接口）
  const { data: user, isLoading } = trpc.user.me.useQuery(undefined, {
    // 只有在用户登录时才执行查询
    enabled: !!session?.user,
  })

  // 更新用户信息的表单状态
  const [formData, setFormData] = useState({
    name: '',
  })

  // 获取 tRPC utils，用于手动刷新数据
  const utils = trpc.useUtils()

  // 创建更新用户的 mutation
  const updateMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      toast.success('更新成功！')
      // 刷新用户数据
      utils.user.me.invalidate()
      // 清空表单
      setFormData({ name: '' })
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`)
    },
  })

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('请输入新的姓名')
      return
    }

    await updateMutation.mutateAsync({
      name: formData.name,
    })
  }

  // 未登录状态
  if (!session?.user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>个人资料</CardTitle>
          <CardDescription>查看和编辑你的个人信息</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">请先登录</p>
        </CardContent>
      </Card>
    )
  }

  // 加载状态
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>个人资料</CardTitle>
          <CardDescription>查看和编辑你的个人信息</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">加载中...</p>
        </CardContent>
      </Card>
    )
  }

  // 数据展示和编辑
  return (
    <Card>
      <CardHeader>
        <CardTitle>个人资料</CardTitle>
        <CardDescription>查看和编辑你的个人信息</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 当前信息显示 */}
        {user && (
          <div className="space-y-4 p-4 bg-accent/50 rounded-lg">
            <h3 className="font-semibold">当前信息</h3>
            <div className="grid gap-2">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">姓名</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">邮箱</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">邮箱状态</p>
                <p>{user.emailVerified ? '✓ 已验证' : '未验证'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">创建时间</p>
                <p>{new Date(user.createdAt).toLocaleString('zh-CN')}</p>
              </div>
            </div>
          </div>
        )}

        {/* 更新表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-semibold">更新信息</h3>
          <div className="space-y-2">
            <Label htmlFor="name">新姓名</Label>
            <Input
              id="name"
              type="text"
              placeholder="输入新的姓名"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
            />
          </div>
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full"
          >
            {updateMutation.isPending ? '更新中...' : '更新姓名'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
