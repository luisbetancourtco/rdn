import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import Sidebar from '@/components/Sidebar'
import ImpersonationBanner from '@/components/ImpersonationBanner'
import { getSidebarProps } from '@/lib/sidebar-props'

export default async function UsuariosLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')
  if (session.userRole !== 'admin' && !session.impersonating) redirect('/cursos')
  const sidebarProps = await getSidebarProps(session.userId!, session.userRole!)

  return (
    <div className="flex min-h-screen">
      {session.impersonating && <ImpersonationBanner userName={session.userName || ''} />}
      <Sidebar {...sidebarProps} />
      <main className={`flex-1 bg-md-surface min-w-0 pt-14 md:pt-0 ${session.impersonating ? 'mt-10' : ''}`}>
        {children}
      </main>
    </div>
  )
}
