/**
 * 项目列表 API
 * GET /api/projects
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
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
    })

    return Response.json({ projects })
  } catch (error) {
    console.error('Get projects error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
