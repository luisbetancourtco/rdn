import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import CourseDetail from '@/components/lms/CourseDetail'

export const dynamic = 'force-dynamic'

export default async function CoursePage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')

  const course = await prisma.course.findUnique({
    where: { id: parseInt(params.id, 10) },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          topics: {
            orderBy: { order: 'asc' },
            include: {
              materials: { orderBy: { createdAt: 'asc' } },
            },
          },
        },
      },
    },
  })

  if (!course) notFound()

  return <CourseDetail course={course} />
}
