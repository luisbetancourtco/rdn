import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import TareasList from '@/components/lms/TareasList'

export const dynamic = 'force-dynamic'

export default async function TareasPage() {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')

  const isAdmin = session.userRole === 'admin'

  const tasks = await prisma.asesoriaTask.findMany({
    where: isAdmin ? undefined : { asesoria: { userId: session.userId } },
    orderBy: { createdAt: 'asc' },
    include: {
      asesoria: {
        select: { id: true, date: true, user: { select: { id: true, name: true } } },
      },
    },
  })

  return (
    <TareasList
      initialTasks={JSON.parse(JSON.stringify(tasks))}
      isAdmin={isAdmin}
    />
  )
}
