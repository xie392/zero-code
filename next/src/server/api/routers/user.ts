import { z } from 'zod'
import { prisma } from '@/server/prisma'
import { publicProcedure, protectedProcedure, router } from '../trpc'

/**
 * 用户路由器
 * 
 * 包含与用户相关的所有 API 接口
 */
export const userRouter = router({
  /**
   * 获取用户列表（公开接口）
   * 任何人都可以访问
   */
  list: publicProcedure.query(async () => {
    // 使用 Prisma 从数据库获取用户列表
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null, // 只获取未删除的用户
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      // 按创建时间降序排列
      orderBy: {
        createdAt: 'desc',
      },
    })

    return users
  }),

  /**
   * 根据 ID 获取用户详情（公开接口）
   */
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1, '用户 ID 不能为空'),
      }),
    )
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: input.id,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!user) {
        throw new Error('用户不存在')
      }

      return user
    }),

  /**
   * 获取当前登录用户信息（受保护接口）
   * 需要登录后才能访问
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    // ctx.user 在 protectedProcedure 中保证存在
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.user.id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new Error('用户不存在')
    }

    return user
  }),

  /**
   * 更新用户信息（受保护接口）
   * 只有登录用户才能更新自己的信息
   */
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, '姓名不能为空').optional(),
        image: z.string().url('头像必须是有效的 URL').optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 更新当前登录用户的信息
      const updatedUser = await prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          ...input,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return updatedUser
    }),
})
