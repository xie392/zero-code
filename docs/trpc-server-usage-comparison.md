# tRPC 服务端使用对比

## 三种方式对比

### 方式 1: 直接使用 Prisma（最简单）✅ 当前使用
```typescript
// API Route: src/app/api/chat/route.ts
import { prisma } from '@/server/prisma'

const project = await prisma.project.findUnique({
  where: { id: projectId, deletedAt: null }
})
```

**优点：**
- 直接、简单、清晰
- 性能最好（没有额外层级）
- 适合简单的数据库操作

**缺点：**
- 需要重复业务逻辑（如权限检查）
- 不能复用 tRPC router 中的验证和中间件


### 方式 2: 使用 tRPC Server Caller（更规范）
```typescript
// API Route: src/app/api/chat/route.ts
import { appRouter } from '@/server/api'
import { createContext } from '@/server/api/trpc'

export async function POST(request: NextRequest) {
  // 创建上下文
  const ctx = await createContext({ 
    req: request,
    resHeaders: new Headers()
  })
  
  // 创建 caller
  const caller = appRouter.createCaller(ctx)
  
  // 调用 tRPC procedure
  const project = await caller.project.getById({ id: projectId })
}
```

**优点：**
- 复用 tRPC router 中的所有逻辑
- 统一的验证、权限检查、错误处理
- 类型安全

**缺点：**
- 需要手动创建 context
- 代码稍微复杂一些


### 方式 3: 使用客户端 Hook（错误）❌
```typescript
// 这是错误的！
const { data } = trpc.project.getById.useQuery({ id: projectId })
```

**为什么错误：**
- `useQuery` 是 React Hook，只能在 React 组件中使用
- API route 不是 React 组件，是纯 Node.js 函数
- 违反 React Hooks 规则


## 何时使用哪种方式？

### 使用 Prisma 直接查询：
- ✅ 简单的 CRUD 操作
- ✅ 不需要复用业务逻辑
- ✅ 性能敏感的场景

### 使用 tRPC Caller：
- ✅ 需要复用 tRPC router 中的验证逻辑
- ✅ 复杂的业务逻辑
- ✅ 需要保持一致的错误处理

### 使用客户端 Hook：
- ✅ 只能在 React 组件中使用
- ❌ 永远不要在 API route、Server Component 或其他服务端代码中使用
