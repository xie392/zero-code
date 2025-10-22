import { initTRPC } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { db } from '@/db'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createContext = async (opts: CreateNextContextOptions) => {
  //   const session = await getSession({ req: opts.req })

  return {
    // session,
    db
  }
}

// 初始化 tRPC 后端，应该只在后端初始化一次！
const t = initTRPC.create()

// 导出可重用的路由器和过程助手，可以在整个路由器中使用
export const router = t.router

// 导出可重用的公共过程助手，可以在整个路由器中使用
export const publicProcedure = t.procedure
