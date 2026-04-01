import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function POST() {
  const session = await getSession()
  if (!session.authenticated || !session.impersonating) {
    return NextResponse.json({ error: 'Not impersonating' }, { status: 400 })
  }

  session.userId = session.originalUserId
  session.userName = session.originalUserName
  session.userRole = session.originalUserRole
  session.impersonating = false
  session.originalUserId = undefined
  session.originalUserName = undefined
  session.originalUserRole = undefined
  await session.save()

  return NextResponse.json({ ok: true })
}
