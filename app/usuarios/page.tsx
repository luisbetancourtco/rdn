import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import UsuariosTabs from '@/components/lms/UsuariosTabs'

export default async function UsuariosPage() {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')

  const [users, courses, groups] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        access: {
          include: { course: { select: { id: true, title: true, status: true } } },
        },
        _count: { select: { asesorias: true } },
      },
    }),
    prisma.course.findMany({
      orderBy: { title: 'asc' },
      select: { id: true, title: true, status: true },
    }),
    prisma.userGroup.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        leader: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    }),
  ])

  const allUsersBasic = users.map(u => ({ id: u.id, name: u.name, email: u.email }))

  return (
    <UsuariosTabs
      initialUsers={JSON.parse(JSON.stringify(users))}
      allCourses={courses}
      initialGroups={JSON.parse(JSON.stringify(groups))}
      allUsers={allUsersBasic}
    />
  )
}
