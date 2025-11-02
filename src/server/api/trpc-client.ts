import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from './index'

/**
 * tRPC React Hooks
 *
 * 这个对象包含了所有可以在 React 组件中使用的 tRPC hooks
 * 它提供了类型安全的 API 调用方式
 *
 * 使用示例:
 * ```tsx
 * // 查询数据
 * const { data, isLoading } = trpc.user.list.useQuery()
 *
 * // 修改数据
 * const updateMutation = trpc.user.update.useMutation()
 * await updateMutation.mutateAsync({ name: '新名字' })
 * ```
 */
export const trpc = createTRPCReact<AppRouter>()