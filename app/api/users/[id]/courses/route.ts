import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const access = await prisma.courseAccess.findMany({
    where: { userId: Number(id) },
    include: { course: { select: { id: true, title: true, status: true } } },
  })
  return NextResponse.json(access.map(a => a.course))
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { courseId } = await req.json()

  try {
    await prisma.courseAccess.create({
      data: { userId: Number(id), courseId: Number(courseId) },
    })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Acceso ya existe' }, { status: 409 })
  }
}
