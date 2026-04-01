import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = req.nextUrl.searchParams.get('userId')

  const asesorias = await prisma.asesoria.findMany({
    where: userId ? { userId: Number(userId) } : undefined,
    orderBy: { date: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      tasks: { orderBy: { createdAt: 'asc' } },
    },
  })
  return NextResponse.json(asesorias)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { userId, date, startTime, endTime, duration, recordingUrl, summary, fullSummary, tasks } = await req.json()

  if (!userId || !date || !startTime || !endTime || duration == null) {
    return NextResponse.json({ error: 'Faltan campos requeridos (userId, date, startTime, endTime, duration)' }, { status: 400 })
  }

  const asesoria = await prisma.asesoria.create({
    data: {
      userId: Number(userId),
      date: new Date(date),
      startTime,
      endTime,
      duration: Number(duration),
      recordingUrl: recordingUrl || null,
      summary: summary || null,
      fullSummary: fullSummary || null,
      tasks: tasks?.length
        ? { create: tasks.map((t: string) => ({ description: t })) }
        : undefined,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      tasks: true,
    },
  })

  return NextResponse.json(asesoria, { status: 201 })
}
