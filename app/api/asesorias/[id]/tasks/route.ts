import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { description } = await req.json()

  if (!description?.trim()) {
    return NextResponse.json({ error: 'Descripción requerida' }, { status: 400 })
  }

  const task = await prisma.asesoriaTask.create({
    data: { asesoriaId: Number(id), description: description.trim() },
  })
  return NextResponse.json(task, { status: 201 })
}
