import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const projectRouter = router({
  /**
   * 获取项目详情
   */
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "项目 ID 不能为空"),
      })
    )
    .query(async ({ ctx, input }) => {
      const project = await prisma.project.findUnique({
        where: {
          id: input.id,
          deletedAt: null,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "项目不存在",
        });
      }

      // 验证权限
      if (project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "无权访问此项目",
        });
      }
      
      return {
        ...project,
        messages: project.messages.map((msg) => ({
          id: msg.id,
          projectId: msg.projectId,
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
          metadata: msg.metadata as Record<string, any> | undefined,
          createdAt: msg.createdAt,
        })),
      };
    }),

  /**
   * 获取当前用户的项目列表（受保护接口）
   */
  list: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(20),
          cursor: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;
      const cursor = input?.cursor;

      const projects = await prisma.project.findMany({
        where: {
          userId: ctx.user.id,
          deletedAt: null,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          prompt: true,
          status: true,
          thumbnail: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      let nextCursor: string | undefined = undefined;
      if (projects.length > limit) {
        const nextItem = projects.pop();
        nextCursor = nextItem?.id;
      }

      return {
        projects,
        nextCursor,
      };
    }),

  /**
   * 删除项目（受保护接口）
   */
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "项目 ID 不能为空"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.id },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "项目不存在",
        });
      }

      if (project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "无权删除此项目",
        });
      }

      // 软删除
      await prisma.project.update({
        where: { id: input.id },
        data: {
          deletedAt: new Date(),
        },
      });

      return { success: true };
    }),

  /**
   * 更新项目信息（受保护接口）
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "项目 ID 不能为空"),
        name: z.string().min(1, "项目名称不能为空").optional(),
        thumbnail: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.id },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "项目不存在",
        });
      }

      if (project.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "无权修改此项目",
        });
      }

      const { id, ...updateData } = input;

      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });

      return updatedProject;
    }),
});
