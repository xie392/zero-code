import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/api'
import { createContext } from '@/server/api/trpc'

/**
 * tRPC API 路由处理器
 * 
 * 这个文件处理所有发送到 /api/trpc/* 的请求
 * Next.js 的 catch-all 路由会将所有 tRPC 请求转发到这里
 * 
 * @see https://trpc.io/docs/server/adapters/nextjs
 */

const handler = (req: Request) => {
  return fetchRequestHandler({
    // tRPC 的端点路径
    endpoint: '/api/trpc',
    // 请求对象
    req,
    // 应用的主路由器
    router: appRouter,
    // 创建请求上下文的函数
    createContext,
    // 错误处理（可选）
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            )
          }
        : undefined,
  })
}

// 导出 GET 和 POST 处理器供 Next.js App Router 使用
export { handler as GET, handler as POST }
