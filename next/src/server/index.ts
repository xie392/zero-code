import { router } from './trpc'
import { userRouter } from './routers/user'
import { postRouter } from './routers/post'

/**
 * 主路由器
 * 
 * 这里组合了所有的子路由器
 * 每个子路由器负责一个特定的功能模块
 */
export const appRouter = router({
  // 用户相关的接口
  user: userRouter,
  // 文章相关的接口
  post: postRouter,
})

/**
 * 导出路由器的类型定义
 * 这个类型将在客户端使用，提供完整的类型安全
 */
export type AppRouter = typeof appRouter
