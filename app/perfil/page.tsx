import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import { getSidebarProps } from '@/lib/sidebar-props'
import ProfileForm from './ProfileForm'

export const dynamic = 'force-dynamic'

export default async function PerfilPage() {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      firstName: true,
      lastName: true,
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
  })

  if (!user) redirect('/login')
  const sidebarProps = await getSidebarProps(session.userId!, session.userRole!)

  return (
    <div className="flex min-h-screen bg-md-surface">
      <Sidebar {...sidebarProps} />
      <main className="flex-1 md:pt-0 pt-14">
        <ProfileForm user={user} />
      </main>
    </div>
  )
}
