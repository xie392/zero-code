# 技术栈集成指南

本项目集成了 **Prisma + better-auth + tRPC + React Query**，提供了一个类型安全、优雅的全栈开发方案。

## 📚 技术栈说明

### 1. Prisma
- **作用**: 数据库 ORM，提供类型安全的数据库操作
- **配置文件**: `prisma/schema.prisma`
- **使用位置**: 服务端 tRPC 路由中

### 2. better-auth
- **作用**: 身份认证库，基于 Cookie 的认证方案
- **配置文件**: `src/lib/auth.ts` (服务端), `src/lib/auth-client.ts` (客户端)
- **特点**: 
  - 自动管理 Cookie 会话
  - 支持邮箱密码登录
  - 可扩展第三方登录

### 3. tRPC
- **作用**: 端到端类型安全的 API 框架
- **配置文件**: 
  - `src/server/trpc.ts` (tRPC 配置)
  - `src/server/index.ts` (主路由)
  - `src/server/routers/*` (子路由)
- **特点**:
  - 完整的类型推导
  - 无需手写 API 文档
  - 自动错误处理

### 4. React Query (@tanstack/react-query)
- **作用**: 数据获取、缓存和状态管理
- **集成**: 通过 `@trpc/react-query` 与 tRPC 结合
- **特点**:
  - 自动缓存和重新验证
  - 加载和错误状态管理
  - 后台数据更新

## 🏗️ 项目结构

```
src/
├── server/                    # 服务端代码
│   ├── trpc.ts               # tRPC 配置（包含认证中间件）
│   ├── index.ts              # 主路由器
│   └── routers/              # 各个功能模块的路由
│       ├── user.ts           # 用户相关接口
│       └── post.ts           # 文章相关接口（示例）
├── app/
│   ├── api/
│   │   ├── auth/[...all]/    # better-auth API 端点
│   │   └── trpc/[trpc]/      # tRPC API 端点
│   └── (app)/
│       └── demo/             # 集成示例页面
├── lib/
│   ├── auth.ts               # better-auth 服务端配置
│   ├── auth-client.ts        # better-auth 客户端配置
│   ├── prisma.ts             # Prisma 客户端
│   └── trpc-client.ts        # tRPC React 客户端
└── components/
    └── providers/
        └── query-provider.tsx # React Query + tRPC Provider
```

## 🚀 使用方法

### 1. 在服务端创建 API（tRPC Router）

在 `src/server/routers/` 下创建新的路由文件：

```typescript
import { z } from 'zod'
import { publicProcedure, protectedProcedure, router } from '../trpc'

export const exampleRouter = router({
  // 公开接口：任何人都可以访问
  publicQuery: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // ctx.prisma 可用于数据库操作
      return { message: `公开数据: ${input.id}` }
    }),

  // 受保护接口：需要登录
  protectedMutation: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // ctx.user 包含当前登录用户信息
      // ctx.session 包含会话信息
      return {
        userId: ctx.user.id,
        title: input.title,
      }
    }),
})
```

然后在 `src/server/index.ts` 中注册路由：

```typescript
export const appRouter = router({
  user: userRouter,
  post: postRouter,
  example: exampleRouter, // 添加新路由
})
```

### 2. 在客户端调用 API（React 组件）

```typescript
'use client'

import { trpc } from '@/lib/trpc-client'

export default function MyComponent() {
  // 查询数据（Query）
  const { data, isLoading, error } = trpc.user.list.useQuery()

  // 修改数据（Mutation）
  const updateUser = trpc.user.update.useMutation({
    onSuccess: () => {
      console.log('更新成功')
    },
  })

  const handleUpdate = async () => {
    await updateUser.mutateAsync({
      name: '新名字',
    })
  }

  if (isLoading) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>

  return (
    <div>
      <ul>
        {data?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <button onClick={handleUpdate}>更新用户</button>
    </div>
  )
}
```

### 3. 身份认证（better-auth）

#### 注册用户

```typescript
import { signUp } from '@/lib/auth-client'

const handleRegister = async () => {
  await signUp.email({
    name: '张三',
    email: 'user@example.com',
    password: 'password123',
  })
}
```

#### 登录

```typescript
import { signIn } from '@/lib/auth-client'

const handleLogin = async () => {
  await signIn.email({
    email: 'user@example.com',
    password: 'password123',
  })
}
```

#### 登出

```typescript
import { signOut } from '@/lib/auth-client'

const handleLogout = async () => {
  await signOut()
}
```

#### 获取当前用户会话

```typescript
import { useSession } from '@/lib/auth-client'

export default function MyComponent() {
  const { data: session, isPending } = useSession()

  if (isPending) return <div>加载中...</div>

  if (session?.user) {
    return <div>欢迎, {session.user.name}!</div>
  }

  return <div>请先登录</div>
}
```

### 4. 数据库操作（Prisma）

在 tRPC 路由中使用 Prisma：

```typescript
export const userRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    // ctx.prisma 是 Prisma 客户端实例
    const users = await ctx.prisma.user.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'desc' },
    })
    return users
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newUser = await ctx.prisma.user.create({
        data: {
          id: generateId(), // 你的 ID 生成函数
          name: input.name,
          email: ctx.user.email, // 使用当前登录用户的邮箱
        },
      })
      return newUser
    }),
})
```

## 🔐 认证流程说明

### 公开接口 (publicProcedure)
- 任何人都可以访问
- 不需要登录
- `ctx.user` 和 `ctx.session` 可能为 `null`

### 受保护接口 (protectedProcedure)
- 只有登录用户可以访问
- 自动检查会话，未登录会返回 `UNAUTHORIZED` 错误
- `ctx.user` 和 `ctx.session` 保证存在（类型安全）

### Cookie 认证流程
1. 用户登录 → better-auth 创建会话并设置 Cookie
2. 后续请求自动携带 Cookie
3. tRPC 从请求头中提取 Cookie 并验证会话
4. 验证成功后，用户信息注入到 `ctx` 中

## 📦 开发命令

```bash
# 启动开发服务器
pnpm dev

# 数据库相关
pnpm db:generate  # 生成 Prisma 客户端
pnpm db:push      # 推送数据库 schema
pnpm db:migrate   # 运行迁移
pnpm db:studio    # 打开 Prisma Studio

# 代码检查
pnpm lint
pnpm format
```

## 🎯 最佳实践

### 1. 输入验证
始终使用 Zod 验证输入：

```typescript
.input(
  z.object({
    email: z.string().email('邮箱格式不正确'),
    age: z.number().min(0).max(150),
  })
)
```

### 2. 错误处理
在 mutation 中处理错误：

```typescript
const mutation = trpc.user.update.useMutation({
  onSuccess: (data) => {
    toast.success('更新成功')
  },
  onError: (error) => {
    toast.error(error.message)
  },
})
```

### 3. 数据刷新
修改数据后，刷新相关查询：

```typescript
const utils = trpc.useUtils()

const mutation = trpc.user.update.useMutation({
  onSuccess: () => {
    // 刷新用户列表
    utils.user.list.invalidate()
    // 刷新当前用户信息
    utils.user.me.invalidate()
  },
})
```

### 4. 加载状态
显示加载和错误状态：

```typescript
const { data, isLoading, error } = trpc.user.list.useQuery()

if (isLoading) return <Skeleton />
if (error) return <ErrorMessage error={error} />
return <UserList users={data} />
```

## 🔍 示例页面

访问 `/demo` 页面查看完整的集成示例，包括：
- 用户注册和登录
- 受保护的 API 调用
- 公开的 API 调用
- 数据修改和刷新

## 🐛 常见问题

### 1. UNAUTHORIZED 错误
确保在调用受保护接口前已登录：

```typescript
const { data: session } = useSession()
const { data } = trpc.user.me.useQuery(undefined, {
  enabled: !!session?.user, // 只有登录后才查询
})
```

### 2. 类型错误
运行 `pnpm db:generate` 重新生成 Prisma 类型

### 3. Cookie 未发送
确保 tRPC 客户端配置了正确的 URL，并且与认证服务器在同一域名下

## 📚 参考文档

- [Prisma 文档](https://www.prisma.io/docs)
- [better-auth 文档](https://www.better-auth.com/docs)
- [tRPC 文档](https://trpc.io/docs)
- [React Query 文档](https://tanstack.com/query/latest)
