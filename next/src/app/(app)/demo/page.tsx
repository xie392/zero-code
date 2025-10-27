'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'
import { signIn, signUp, signOut, useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

/**
 * Demo 页面
 * 
 * 这个页面演示了如何使用以下技术栈：
 * - Prisma: 数据库 ORM
 * - better-auth: 身份认证（基于 cookie）
 * - tRPC: 类型安全的 API 调用
 * - React Query: 数据获取和缓存
 */
export default function DemoPage() {
  // ============ better-auth 认证相关 ============
  
  // 使用 better-auth 的 useSession hook 获取当前登录用户信息
  const { data: session, isPending: isSessionLoading } = useSession()
  
  // 登录表单状态
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  
  // 注册表单状态
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  // ============ tRPC + React Query 数据获取 ============
  
  // 获取用户列表（公开接口，无需登录）
  // trpc.user.list.useQuery() 返回 React Query 的 query 结果
  const { data: users, isLoading: usersLoading } = trpc.user.list.useQuery()
  
  // 获取当前用户信息（受保护接口，需要登录）
  // enabled: !!session?.user 表示只有在用户登录时才执行查询
  const { data: currentUser, isLoading: currentUserLoading } = trpc.user.me.useQuery(
    undefined,
    {
      enabled: !!session?.user, // 只有登录后才查询
    }
  )
  
  // ============ tRPC Mutations（数据修改） ============
  
  // 更新用户信息的 mutation
  const updateUserMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      toast.success('用户信息更新成功')
      // 可以手动刷新数据
      // utils.user.me.invalidate()
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`)
    },
  })

  // ============ 认证操作处理函数 ============
  
  // 处理登录
  const handleLogin = async () => {
    try {
      await signIn.email({
        email: loginForm.email,
        password: loginForm.password,
      })
      toast.success('登录成功')
    } catch (error: any) {
      toast.error(`登录失败: ${error.message}`)
    }
  }

  // 处理注册
  const handleRegister = async () => {
    try {
      await signUp.email({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
      })
      toast.success('注册成功，请登录')
    } catch (error: any) {
      toast.error(`注册失败: ${error.message}`)
    }
  }

  // 处理登出
  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('已退出登录')
    } catch (error: any) {
      toast.error(`退出失败: ${error.message}`)
    }
  }

  // 处理更新用户信息
  const handleUpdateUser = async () => {
    try {
      await updateUserMutation.mutateAsync({
        name: '新的用户名',
      })
    } catch (error: any) {
      // 错误已在 onError 中处理
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">技术栈集成示例</h1>
        <p className="text-muted-foreground">
          演示 Prisma + better-auth + tRPC + React Query 的完整集成
        </p>
      </div>

      {/* 认证状态显示 */}
      <Card>
        <CardHeader>
          <CardTitle>认证状态（better-auth）</CardTitle>
          <CardDescription>基于 Cookie 的认证方案</CardDescription>
        </CardHeader>
        <CardContent>
          {isSessionLoading ? (
            <p>加载中...</p>
          ) : session?.user ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">已登录用户：</p>
                <p className="font-medium">{session.user.name}</p>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
              <Button onClick={handleLogout} variant="outline">
                退出登录
              </Button>
            </div>
          ) : (
            <p>未登录</p>
          )}
        </CardContent>
      </Card>

      {/* 登录和注册表单 */}
      {!session?.user && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* 登录表单 */}
          <Card>
            <CardHeader>
              <CardTitle>登录</CardTitle>
              <CardDescription>使用邮箱和密码登录</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">邮箱</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">密码</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                登录
              </Button>
            </CardContent>
          </Card>

          {/* 注册表单 */}
          <Card>
            <CardHeader>
              <CardTitle>注册</CardTitle>
              <CardDescription>创建新账户</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">姓名</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="张三"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">邮箱</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">密码</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, password: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleRegister} className="w-full">
                注册
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 当前用户信息（受保护的接口） */}
      {session?.user && (
        <Card>
          <CardHeader>
            <CardTitle>当前用户详细信息（受保护接口）</CardTitle>
            <CardDescription>
              使用 tRPC protectedProcedure，需要登录才能访问
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentUserLoading ? (
              <p>加载中...</p>
            ) : currentUser ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ID</p>
                    <p className="font-mono text-sm">{currentUser.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">姓名</p>
                    <p>{currentUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">邮箱</p>
                    <p>{currentUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">邮箱验证</p>
                    <p>{currentUser.emailVerified ? '已验证' : '未验证'}</p>
                  </div>
                </div>
                <Button
                  onClick={handleUpdateUser}
                  disabled={updateUserMutation.isPending}
                >
                  {updateUserMutation.isPending ? '更新中...' : '更新用户信息（示例）'}
                </Button>
              </div>
            ) : (
              <p>无法获取用户信息</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 用户列表（公开接口） */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表（公开接口）</CardTitle>
          <CardDescription>
            使用 tRPC publicProcedure，任何人都可以访问
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <p>加载中...</p>
          ) : users && users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">暂无用户数据</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
