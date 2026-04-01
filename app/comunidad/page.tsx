import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import CommunityTabs from './CommunityTabs'

export const dynamic = 'force-dynamic'

export default async function ComunidadPage() {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      country: true,
      city: true,
      nombreNegocio: true,
      urlNegocio: true,
      descripcionNegocio: true,
      categoriaNegocio: true,
      facebook: true,
      instagram: true,
      linkedin: true,
      twitter: true,
      youtube: true,
      objetivo: true,
    },
    orderBy: { name: 'asc' },
  })

  return <CommunityTabs users={users} />
}
