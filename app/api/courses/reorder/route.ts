import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderedIds } = await req.json() as { orderedIds: number[] }
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json({ error: 'orderedIds is required' }, { status: 400 })
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.course.update({ where: { id }, data: { order: index } })
    )
  )

  return NextResponse.json({ ok: true })
}
