import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import AdminDashboard from './AdminDashboard'
import StudentDashboard from './StudentDashboard'

export const dynamic = 'force-dynamic'

export default async function InicioPage() {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')

  if (session.userRole === 'admin') {
    const [userCount, courseCount, publishedCourseCount, asesoriaCount, pendingNewsCount, recentNews, coursesWithTopics] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.course.count({ where: { status: 'publicado' } }),
      prisma.asesoria.count(),
      prisma.newsItem.count({ where: { status: 'pendiente' } }),
      prisma.newsItem.findMany({
        where: { status: 'pendiente' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, source: true, category: true, relevance: true, createdAt: true },
      }),
      prisma.course.findMany({
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          status: true,
          access: { select: { userId: true } },
          modules: {
            select: {
              topics: {
                select: {
                  id: true,
                  progress: { where: { completed: true }, select: { userId: true } },
                },
              },
            },
          },
        },
      }),
    ])

    // Calculate per-course completion %
    const courseProgress = coursesWithTopics.map((course) => {
      const topics = course.modules.flatMap((m) => m.topics)
      const enrolledCount = course.access.length
      const totalPossible = topics.length * enrolledCount
      const totalCompleted = topics.reduce((sum, t) => sum + t.progress.length, 0)
      const percent = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0
      return {
        id: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        status: course.status,
        enrolledCount,
        topicCount: topics.length,
        percent,
      }
    })

    return (
      <AdminDashboard
        userCount={userCount}
        courseCount={courseCount}
        publishedCourseCount={publishedCourseCount}
        asesoriaCount={asesoriaCount}
        pendingNewsCount={pendingNewsCount}
        recentNews={recentNews}
        courseProgress={courseProgress}
      />
    )
  }

  // Student
  const userId = session.userId!
  const [courses, totalTopics, completedTopics, asesorias, pendingTasks] = await Promise.all([
    prisma.courseAccess.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true, title: true, thumbnail: true, status: true,
            modules: {
              select: {
                topics: { select: { id: true } },
              },
            },
          },
        },
      },
    }),
    // Total topics across all accessible courses
    prisma.topic.count({
      where: { module: { course: { access: { some: { userId } } } } },
    }),
    // Completed topics
    prisma.topicProgress.count({
      where: { userId, completed: true },
    }),
    // Recent asesorias
    prisma.asesoria.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 3,
      select: { id: true, date: true, summary: true, startTime: true, endTime: true },
    }),
    // Pending tasks
    prisma.asesoriaTask.findMany({
      where: { asesoria: { userId }, completed: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, description: true, asesoria: { select: { date: true } } },
    }),
  ])

  // Per-course progress
  const courseProgress = courses.map((ca) => {
    const topicIds = ca.course.modules.flatMap((m) => m.topics.map((t) => t.id))
    return { courseId: ca.course.id, totalTopics: topicIds.length }
  })

  const courseTopicIds = courses.flatMap((ca) =>
    ca.course.modules.flatMap((m) => m.topics.map((t) => t.id))
  )

  const completedByTopic = courseTopicIds.length > 0
    ? await prisma.topicProgress.findMany({
        where: { userId, topicId: { in: courseTopicIds }, completed: true },
        select: { topicId: true },
      })
    : []

  const completedSet = new Set(completedByTopic.map((t) => t.topicId))

  const coursesWithProgress = courses.map((ca) => {
    const topicIds = ca.course.modules.flatMap((m) => m.topics.map((t) => t.id))
    const done = topicIds.filter((id) => completedSet.has(id)).length
    return {
      id: ca.course.id,
      title: ca.course.title,
      thumbnail: ca.course.thumbnail,
      totalTopics: topicIds.length,
      completedTopics: done,
    }
  })

  return (
    <StudentDashboard
      userName={session.userName || ''}
      coursesWithProgress={coursesWithProgress}
      totalTopics={totalTopics}
      completedTopics={completedTopics}
      asesorias={asesorias}
      pendingTasks={pendingTasks}
    />
  )
}
