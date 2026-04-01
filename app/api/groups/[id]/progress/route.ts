import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const groupId = parseInt(params.id)

  // Get group with members and their course access
  const group = await prisma.userGroup.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          user: {
            include: {
              access: {
                include: {
                  course: {
                    include: {
                      modules: {
                        include: {
                          topics: { select: { id: true } },
                        },
                        orderBy: { order: 'asc' },
                      },
                    },
                  },
                },
              },
              topicProgress: {
                where: { completed: true },
                select: { topicId: true, completedAt: true },
              },
            },
          },
        },
      },
    },
  })

  if (!group) return NextResponse.json({ error: 'Grupo no encontrado' }, { status: 404 })

  // Transform into a progress report
  const memberProgress = group.members.map(m => {
    const completedTopicIds = new Set(m.user.topicProgress.map(tp => tp.topicId))

    const courses = m.user.access.map(a => {
      const allTopics = a.course.modules.flatMap(mod => mod.topics)
      const completedCount = allTopics.filter(t => completedTopicIds.has(t.id)).length
      const totalCount = allTopics.length

      return {
        courseId: a.course.id,
        courseTitle: a.course.title,
        totalTopics: totalCount,
        completedTopics: completedCount,
        progressPercent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      }
    })

    return {
      userId: m.user.id,
      userName: m.user.name,
      userEmail: m.user.email,
      courses,
    }
  })

  return NextResponse.json(memberProgress)
}
