'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'
import { trpc } from '@/server/api/trpc-client'

/**
 * Query Provider 组件
 *
 * 集成了 tRPC 和 React Query 的统一 Provider
 * 这个组件应该在应用的根组件中使用
 */
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // 创建 React Query 客户端
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 数据在 5 分钟内被认为是新鲜的
            staleTime: 5 * 60 * 1000,
            // 启用错误重试
            retry: 1,
          },
        },
      }),
  )

  // 创建 tRPC 客户端
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // httpBatchLink 会将多个请求合并成一个 HTTP 请求
        // 这样可以减少网络请求次数，提高性能
        httpBatchLink({
          // tRPC API 的 URL
          url: '/api/trpc',
          // 设置请求头（可选）
          headers() {
            return {
              // 可以在这里添加自定义请求头
              // better-auth 会自动通过 cookie 发送认证信息
            }
          },
        }),
      ],
    }),
  )

  return (
    // tRPC Provider 包装 QueryClientProvider
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* 开发环境下显示 React Query DevTools */}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </QueryClientProvider>
    </trpc.Provider>
  )
}
