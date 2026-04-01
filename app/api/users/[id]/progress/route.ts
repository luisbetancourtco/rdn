import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const userId = Number(id)

  // Get courses the user has access to, with all their topics and user's progress
  const access = await prisma.courseAccess.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { order: 'asc' },
            include: {
              topics: {
                orderBy: { order: 'asc' },
                include: {
                  progress: {
                    where: { userId },
                    select: { completed: true, completedAt: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  const courses = access.map(a => {
    let totalTopics = 0
    let completedTopics = 0

    const modules = a.course.modules.map(m => {
      const topics = m.topics.map(t => {
        totalTopics++
        const done = t.progress.length > 0 && t.progress[0].completed
        if (done) completedTopics++
        return { id: t.id, title: t.title, completed: done }
      })
      return { id: m.id, title: m.title, topics }
    })

    return {
      id: a.course.id,
      title: a.course.title,
      totalTopics,
      completedTopics,
      percent: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
      modules,
    }
  })

  return NextResponse.json(courses)
}
