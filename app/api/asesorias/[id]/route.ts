import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const asesoria = await prisma.asesoria.findUnique({
    where: { id: Number(id) },
    include: { user: { select: { id: true, name: true, email: true } }, tasks: { orderBy: { createdAt: 'asc' } } },
  })
  if (!asesoria) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(asesoria)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const data: Record<string, unknown> = {}
  if (body.date !== undefined) data.date = new Date(body.date)
  if (body.startTime !== undefined) data.startTime = body.startTime
  if (body.endTime !== undefined) data.endTime = body.endTime
  if (body.duration !== undefined) data.duration = Number(body.duration)
  if (body.recordingUrl !== undefined) data.recordingUrl = body.recordingUrl || null
  if (body.summary !== undefined) data.summary = body.summary || null
  if (body.fullSummary !== undefined) data.fullSummary = body.fullSummary || null

  const asesoria = await prisma.asesoria.update({
    where: { id: Number(id) },
    data,
    include: { user: { select: { id: true, name: true, email: true } }, tasks: { orderBy: { createdAt: 'asc' } } },
  })
  return NextResponse.json(asesoria)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.asesoria.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
