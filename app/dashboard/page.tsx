import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Dashboard from '@/components/Dashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session.authenticated) redirect('/login')

  const [items, linkedInToken] = await Promise.all([
    prisma.newsItem.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.setting.findUnique({ where: { key: 'linkedin_access_token' } }),
  ])

  const linkedInConnected = !!linkedInToken

  const hasLinkedInConfig = !!(
    process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
  )

  return (
    <Dashboard
      initialItems={items}
      linkedInConnected={linkedInConnected}
      hasLinkedInConfig={hasLinkedInConfig}
    />
  )
}
