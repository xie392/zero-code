import { router } from './trpc'

const appRouter = router({})

// 导出类型路由器类型签名，不是路由器本身。
export type AppRouter = typeof appRouter
