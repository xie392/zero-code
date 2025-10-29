# 快速开始指南 🚀

## 5 分钟上手技术栈集成

### 第一步：安装依赖（已完成）

所有必要的依赖已经安装完成：
- ✅ @trpc/client
- ✅ @trpc/server  
- ✅ @trpc/react-query
- ✅ @tanstack/react-query
- ✅ @prisma/client
- ✅ better-auth
- ✅ zod

### 第二步：查看示例页面

启动开发服务器后访问：
```
http://localhost:3000/demo
```

这个页面包含了所有技术栈的使用示例。

### 第三步：理解核心概念

#### 1️⃣ 服务端：创建 API (tRPC Router)

**位置**: `src/server/routers/user.ts`

```typescript
import { z } from 'zod'
import { publicProcedure, protectedProcedure, router } from '../trpc'

export const userRouter = router({
  // 公开接口
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany()
  }),

  // 受保护接口（需要登录）
  me: protectedProcedure.query(async ({ ctx }) => {
    // ctx.user 自动可用，类型安全
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id }
    })
  }),
})
```

#### 2️⃣ 客户端：调用 API

```typescript
'use client'
import { trpc } from '@/lib/trpc-client'

export default function MyComponent() {
  // 自动获得类型安全和自动完成
  const { data, isLoading } = trpc.user.list.useQuery()
  
  return <div>{data?.map(user => user.name)}</div>
}
```

#### 3️⃣ 认证：登录/注册

```typescript
import { signIn, signUp, useSession } from '@/lib/auth-client'

// 注册
await signUp.email({
  name: '张三',
  email: 'test@example.com',
  password: 'password123',
})

// 登录
await signIn.email({
  email: 'test@example.com',
  password: 'password123',
})

// 获取当前用户
const { data: session } = useSession()
console.log(session?.user?.name)
```

### 第四步：创建你的第一个功能

#### 场景：创建一个待办事项列表

**1. 定义数据库模型** (`prisma/schema.prisma`)

```prisma
model todo {
  id         String   @id @default(cuid())
  title      String
  completed  Boolean  @default(false)
  user_id    String
  created_at DateTime @default(now())
  
  user user @relation(fields: [user_id], references: [id])
}
```

**2. 创建 tRPC 路由** (`src/server/routers/todo.ts`)

```typescript
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const todoRouter = router({
  // 获取我的待办事项
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.todo.findMany({
      where: { user_id: ctx.user.id },
      orderBy: { created_at: 'desc' },
    })
  }),

  // 创建待办事项
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1, '标题不能为空'),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.todo.create({
        data: {
          title: input.title,
          user_id: ctx.user.id,
        },
      })
    }),

  // 切换完成状态
  toggle: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.findUnique({
        where: { id: input.id },
      })
      
      return await ctx.prisma.todo.update({
        where: { id: input.id },
        data: { completed: !todo?.completed },
      })
    }),
})
```

**3. 注册路由** (`src/server/index.ts`)

```typescript
import { todoRouter } from './routers/todo'

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  todo: todoRouter, // 添加这行
})
```

**4. 创建 UI 组件** (`src/app/(app)/todos/page.tsx`)

```typescript
'use client'
import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function TodosPage() {
  const [title, setTitle] = useState('')
  const utils = trpc.useUtils()

  // 获取待办事项列表
  const { data: todos } = trpc.todo.list.useQuery()

  // 创建待办事项
  const createMutation = trpc.todo.create.useMutation({
    onSuccess: () => {
      utils.todo.list.invalidate() // 刷新列表
      setTitle('')
    },
  })

  // 切换完成状态
  const toggleMutation = trpc.todo.toggle.useMutation({
    onSuccess: () => {
      utils.todo.list.invalidate()
    },
  })

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">我的待办事项</h1>
      
      {/* 创建表单 */}
      <div className="flex gap-2 mb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入待办事项..."
        />
        <Button onClick={() => createMutation.mutate({ title })}>
          添加
        </Button>
      </div>

      {/* 待办事项列表 */}
      <div className="space-y-2">
        {todos?.map((todo) => (
          <div key={todo.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleMutation.mutate({ id: todo.id })}
            />
            <span className={todo.completed ? 'line-through' : ''}>
              {todo.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**5. 运行数据库迁移**

```bash
pnpm db:push
```

### 常用命令速查

```bash
# 启动开发服务器
pnpm dev

# 数据库操作
pnpm db:push      # 同步 schema 到数据库
pnpm db:studio    # 打开数据库管理界面
pnpm db:generate  # 生成 Prisma 客户端

# 代码质量
pnpm lint         # 检查代码
pnpm format       # 格式化代码
```

### 目录结构速查

```
关键文件位置：
├── src/server/routers/     👈 在这里创建 API
├── src/app/(app)/          👈 在这里创建页面
├── prisma/schema.prisma    👈 在这里定义数据库模型
└── src/lib/trpc-client.ts  👈 tRPC 客户端（已配置好）
```

### 核心 API 速查

```typescript
// ✅ 查询数据
const { data, isLoading, error } = trpc.user.list.useQuery()

// ✅ 修改数据
const mutation = trpc.user.update.useMutation()
await mutation.mutateAsync({ name: '新名字' })

// ✅ 刷新数据
const utils = trpc.useUtils()
utils.user.list.invalidate()

// ✅ 获取登录状态
const { data: session } = useSession()

// ✅ 登录
await signIn.email({ email, password })

// ✅ 登出
await signOut()
```

### 类型安全的魔法 ✨

整个流程都是类型安全的：

```typescript
// 1. 在服务端定义
export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return { id: input.id, name: 'John' }
    })
})

// 2. 在客户端调用 - 完全的类型推导！
const { data } = trpc.user.getById.useQuery({ id: '123' })
//     ^^^^                              ^^^^^^
//   自动推导类型                      自动提示和验证
console.log(data.name) // ✅ TypeScript 知道这是 string
console.log(data.age)  // ❌ 编译错误：属性不存在
```

### 下一步

1. ✅ 查看 `/demo` 页面的实际效果
2. ✅ 阅读 `INTEGRATION_GUIDE.md` 了解详细信息
3. ✅ 查看 `src/components/examples/` 下的示例组件
4. 🚀 开始构建你的应用！

### 需要帮助？

- 示例页面：`/demo`
- 详细文档：`INTEGRATION_GUIDE.md`
- Prisma Studio：`pnpm db:studio`
- React Query DevTools：已集成在开发环境中
