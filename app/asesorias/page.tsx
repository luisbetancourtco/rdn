import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import AsesoriaList from '@/components/lms/AsesoriaList'

export const dynamic = 'force-dynamic'

export default async function AsesoriasPage() {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')

  const isAdmin = session.userRole === 'admin'

  const asesorias = await prisma.asesoria.findMany({
    where: isAdmin ? undefined : { userId: session.userId },
    orderBy: { date: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      tasks: { orderBy: { createdAt: 'asc' } },
    },
  })

  return (
    <AsesoriaList
      initialAsesorias={JSON.parse(JSON.stringify(asesorias))}
      isAdmin={isAdmin}
    />
  )
}
