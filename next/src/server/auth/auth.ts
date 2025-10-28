import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { prisma } from '@/server/prisma'

/**
 * better-auth 配置
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true, // 要求邮箱验证才能登录
  },
  plugins: [nextCookies()],
})
