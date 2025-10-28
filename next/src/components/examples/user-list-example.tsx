'use client'

import { trpc } from '@/server/api/trpc-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * 用户列表示例组件
 * 
 * 展示如何使用 tRPC 和 React Query 获取数据
 * 这是一个公开接口，无需登录即可访问
 */
export function UserListExample() {
  // 使用 tRPC hook 获取用户列表
  // 这个 hook 返回 React Query 的所有功能
  const { data: users, isLoading, error } = trpc.user.list.useQuery()

  // 加载状态
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  // 错误状态
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">加载失败: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  // 数据展示
  return (
    <Card>
      <CardHeader>
        <CardTitle>用户列表</CardTitle>
      </CardHeader>
      <CardContent>
        {users && users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <Avatar>
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {user.emailVerified ? (
                    <span className="text-green-600">✓ 已验证</span>
                  ) : (
                    <span className="text-amber-600">未验证</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">暂无用户</p>
        )}
      </CardContent>
    </Card>
  )
}
