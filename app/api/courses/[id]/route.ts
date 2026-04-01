import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const course = await prisma.course.findUnique({ where: { id: parseInt(params.id, 10) } })
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(course)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const course = await prisma.course.update({
    where: { id: parseInt(params.id, 10) },
    data: {
      title: data.title,
      description: data.description ?? null,
      content: data.content ?? null,
      thumbnail: data.thumbnail ?? null,
      status: data.status,
    },
  })
  return NextResponse.json(course)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.course.delete({ where: { id: parseInt(params.id, 10) } })
  return NextResponse.json({ ok: true })
}
