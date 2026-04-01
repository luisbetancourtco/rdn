import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import CourseManager from '@/components/lms/CourseManager'
import StudentCourseList from '@/components/lms/StudentCourseList'

export const dynamic = 'force-dynamic'

export default async function CursosPage() {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')

  if (session.userRole === 'admin') {
    const courses = await prisma.course.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: { _count: { select: { modules: true } } },
    })
    return <CourseManager initialCourses={courses} />
  }

  // Alumno: all published courses with progress
  const coursesWithAccess = await prisma.course.findMany({
    where: { status: 'publicado' },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: {
      modules: {
        include: {
          topics: {
            include: {
              progress: {
                where: { userId: session.userId },
              },
            },
          },
        },
      },
    },
  })

  const courses = coursesWithAccess.map(course => {
    const totalTopics = course.modules.reduce((sum, m) => sum + m.topics.length, 0)
    const completedTopics = course.modules.reduce(
      (sum, m) => sum + m.topics.filter(t => t.progress.some(p => p.completed)).length,
      0
    )
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      totalTopics,
      completedTopics,
      modulesCount: course.modules.length,
    }
  })

  return <StudentCourseList courses={courses} />
}
