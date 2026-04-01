import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import TopicEditor from '@/components/lms/TopicEditor'

export const dynamic = 'force-dynamic'

export default async function TopicPage({
  params,
}: {
  params: { id: string; moduleId: string; topicId: string }
}) {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')

  const [course, topic] = await Promise.all([
    prisma.course.findUnique({
      where: { id: parseInt(params.id, 10) },
      select: { id: true, title: true },
    }),
    prisma.topic.findUnique({
      where: { id: parseInt(params.topicId, 10) },
      include: { materials: { orderBy: { createdAt: 'asc' } }, module: true },
    }),
  ])

  if (!course || !topic || topic.moduleId !== parseInt(params.moduleId, 10)) notFound()

  return (
    <TopicEditor
      courseId={course.id}
      courseTitle={course.title}
      moduleId={topic.moduleId}
      moduleTitle={topic.module.title}
      topic={topic}
    />
  )
}
