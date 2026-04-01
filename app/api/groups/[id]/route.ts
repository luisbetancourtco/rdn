import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = parseInt(params.id)
  const { name, leaderId } = await req.json()

  const group = await prisma.userGroup.update({
    where: { id },
    data: {
      ...(name?.trim() && { name: name.trim() }),
      ...(leaderId && { leaderId }),
    },
    include: {
      leader: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
  })
  return NextResponse.json(group)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.userGroup.delete({ where: { id: parseInt(params.id) } })
  return NextResponse.json({ ok: true })
}
