import { z } from 'zod'
import { publicProcedure, protectedProcedure, router } from '../trpc'

/**
 * 文章路由器（示例）
 * 
 * 这是一个示例路由器，展示如何创建 CRUD 操作
 * 实际使用时需要先创建对应的数据库表
 */
export const postRouter = router({
  /**
   * 获取文章列表（公开接口）
   */
  list: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(10),
          cursor: z.string().optional(), // 用于分页
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      // 这是一个示例，实际使用时需要创建 post 表
      // const posts = await ctx.prisma.post.findMany({
      //   take: input?.limit ?? 10,
      //   cursor: input?.cursor ? { id: input.cursor } : undefined,
      //   orderBy: { created_at: 'desc' },
      // })
      
      return {
        posts: [],
        nextCursor: null,
      }
    }),

  /**
   * 创建文章（受保护接口）
   * 只有登录用户才能创建文章
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, '标题不能为空'),
        content: z.string().min(1, '内容不能为空'),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // 示例：创建文章并关联当前用户
      // const post = await ctx.prisma.post.create({
      //   data: {
      //     title: input.title,
      //     content: input.content,
      //     author_id: ctx.user.id, // 使用当前登录用户的 ID
      //   },
      // })
      
      return {
        message: '这是一个示例接口，需要先创建 post 表',
        userId: ctx.user.id,
        input,
      }
    }),
})
