import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import CourseViewer from '@/components/lms/CourseViewer'

export const dynamic = 'force-dynamic'

export default async function TopicViewPage({
  params,
}: {
  params: { id: string; topicId: string }
}) {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')
  if (!session.userId) redirect('/login')

  const courseId = parseInt(params.id, 10)
  const topicId = parseInt(params.topicId, 10)

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

  // Verify the topic belongs to this course
  const allTopics = course.modules.flatMap(m => m.topics)
  if (!allTopics.find(t => t.id === topicId)) notFound()

  const progress = await prisma.topicProgress.findMany({
    where: { userId: session.userId, topic: { module: { courseId } } },
    select: { topicId: true, completed: true },
  })

  const completedTopicIds = new Set(
    progress.filter(p => p.completed).map(p => p.topicId)
  )

  return (
    <CourseViewer
      course={course}
      completedTopicIds={Array.from(completedTopicIds)}
      currentTopicId={topicId}
      userName={session.userName ?? ''}
    />
  )
}
