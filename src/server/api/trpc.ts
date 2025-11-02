import { initTRPC, TRPCError } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { prisma } from '@/server/prisma'
import { auth } from '@/server/auth/auth'
// import type { Session, User } from 'better-auth/types'

/**
 * 1. 创建 tRPC Context
 *
 * 这是在每个 tRPC 请求时创建的上下文对象
 * 包含了请求相关的信息，如数据库连接、用户会话等
 *
 * @see https://trpc.io/docs/server/context
 */
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  // 从请求头中获取用户会话信息
  // better-auth 会通过 cookie 自动管理会话
  const session = await auth.api.getSession({
    headers: opts.req.headers,
  })

  return {
    // 原始请求对象（用于 better-auth API 调用）
    req: opts.req,
    res: opts.resHeaders,
    // Prisma 数据库客户端
    prisma,
    // 用户会话信息（包含 session 和 user）
    session: session?.session ?? null,
    // 用户信息
    user: session?.user ?? null,
  }
}

/**
 * 2. 初始化 tRPC
 *
 * 创建 tRPC 实例，这个实例在整个应用中只初始化一次
 */
const t = initTRPC.context<typeof createContext>().create()

/**
 * 3. 导出可重用的组件
 */

// 路由器：用于组合多个 procedure
export const router = t.router

// 中间件：用于在 procedure 执行前进行一些处理
export const middleware = t.middleware

/**
 * 公共 Procedure
 * 任何人都可以访问，无需认证
 */
export const publicProcedure = t.procedure

/**
 * 认证中间件
 * 检查用户是否已登录，如果未登录则抛出错误
 */
const isAuthenticated = middleware(async ({ ctx, next }) => {
  // 检查是否存在用户会话
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: '请先登录',
    })
  }

  // 将用户信息添加到上下文中，并确保类型正确
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
    },
  })
})

/**
 * 受保护的 Procedure
 * 只有已登录的用户才能访问
 * 在这个 procedure 中，ctx.user 和 ctx.session 保证存在
 */
export const protectedProcedure = t.procedure.use(isAuthenticated)
