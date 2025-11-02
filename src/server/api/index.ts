import { router } from './trpc'
import { authRouter } from './routers/auth'
import { userRouter } from './routers/user'
import { projectRouter } from './routers/project'

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  project: projectRouter,
})

export type AppRouter = typeof appRouter

export * from './trpc-client'
