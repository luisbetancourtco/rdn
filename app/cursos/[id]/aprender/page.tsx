import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import CourseViewer from '@/components/lms/CourseViewer'

export const dynamic = 'force-dynamic'

export default async function AprenderPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')
  if (!session.userId) redirect('/login')

  const courseId = parseInt(params.id, 10)

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          topics: {
            orderBy: { order: 'asc' },
            include: { materials: { orderBy: { createdAt: 'asc' } } },
          },
        },
      },
    },
  })

  if (!course) notFound()

  const progress = await prisma.topicProgress.findMany({
    where: { userId: session.userId, topic: { module: { courseId } } },
    select: { topicId: true, completed: true },
  })

  const completedTopicIds = new Set(
    progress.filter(p => p.completed).map(p => p.topicId)
  )

  // Redirect to first topic if exists
  const firstTopic = course.modules[0]?.topics[0]
  if (firstTopic) {
    redirect(`/cursos/${courseId}/aprender/${firstTopic.id}`)
  }

  return (
    <CourseViewer
      course={course}
      completedTopicIds={Array.from(completedTopicIds)}
      currentTopicId={null}
      userName={session.userName ?? ''}
    />
  )
}
