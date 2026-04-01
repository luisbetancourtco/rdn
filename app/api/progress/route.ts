import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// Toggle a single topic's completion
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.authenticated || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { topicId, completed } = await req.json()
  if (typeof topicId !== 'number' || typeof completed !== 'boolean') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const progress = await prisma.topicProgress.upsert({
    where: { userId_topicId: { userId: session.userId, topicId } },
    update: { completed, completedAt: completed ? new Date() : null },
    create: { userId: session.userId, topicId, completed, completedAt: completed ? new Date() : null },
  })

  return NextResponse.json(progress)
}

// Bulk toggle: complete/uncomplete all topics in a module or course
export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session.authenticated || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { topicIds, completed } = await req.json()
  if (!Array.isArray(topicIds) || typeof completed !== 'boolean') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const now = new Date()
  await prisma.$transaction(
    topicIds.map((topicId: number) =>
      prisma.topicProgress.upsert({
        where: { userId_topicId: { userId: session.userId!, topicId } },
        update: { completed, completedAt: completed ? now : null },
        create: { userId: session.userId!, topicId, completed, completedAt: completed ? now : null },
      })
    )
  )

  return NextResponse.json({ ok: true, count: topicIds.length })
}
