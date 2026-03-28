import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.setting.deleteMany({
    where: { key: { in: ['linkedin_access_token', 'linkedin_person_id'] } },
  })
  return NextResponse.json({ ok: true })
}
