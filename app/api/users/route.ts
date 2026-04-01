import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      access: {
        include: { course: { select: { id: true, title: true, status: true } } },
      },
    },
  })
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { email, name } = await req.json()
  if (!email?.trim() || !name?.trim()) {
    return NextResponse.json({ error: 'email y name son requeridos' }, { status: 400 })
  }

  try {
    const user = await prisma.user.create({ data: { email: email.trim(), name: name.trim() } })
    return NextResponse.json(user, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'El email ya existe' }, { status: 409 })
  }
}
