import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const groups = await prisma.userGroup.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      leader: { select: { id: true, name: true, email: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  })
  return NextResponse.json(groups)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, leaderId } = await req.json()
  if (!name?.trim() || !leaderId) {
    return NextResponse.json({ error: 'name y leaderId son requeridos' }, { status: 400 })
  }

  const group = await prisma.userGroup.create({
    data: { name: name.trim(), leaderId },
    include: {
      leader: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
  })
  return NextResponse.json(group, { status: 201 })
}
