/**
 * 项目详情 API
 * GET /api/projects/[id]
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/server/prisma'
import { auth } from '@/server/auth/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.userId !== session.user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return Response.json({ project })
  } catch (error) {
    console.error('Get project error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.userId !== session.user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 软删除
    await prisma.project.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
