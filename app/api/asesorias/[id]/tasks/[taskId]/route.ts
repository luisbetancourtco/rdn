import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { taskId } = await params
  const body = await req.json()

  const data: Record<string, unknown> = {}
  if (body.description !== undefined) data.description = body.description
  if (body.completed !== undefined) {
    data.completed = body.completed
    data.completedAt = body.completed ? new Date() : null
  }

  const task = await prisma.asesoriaTask.update({
    where: { id: Number(taskId) },
    data,
  })
  return NextResponse.json(task)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { taskId } = await params
  await prisma.asesoriaTask.delete({ where: { id: Number(taskId) } })
  return NextResponse.json({ ok: true })
}
