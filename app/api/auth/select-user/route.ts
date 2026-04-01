import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only admins (or already-impersonating admins) can impersonate
  const effectiveRole = session.impersonating ? session.originalUserRole : session.userRole
  if (effectiveRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId } = await req.json()
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Save original admin info if not already impersonating
  if (!session.impersonating) {
    session.originalUserId = session.userId
    session.originalUserName = session.userName
    session.originalUserRole = session.userRole
  }

  session.userId = user.id
  session.userName = user.name
  session.userRole = user.role
  session.impersonating = true
  await session.save()

  return NextResponse.json({ ok: true, role: user.role })
}
