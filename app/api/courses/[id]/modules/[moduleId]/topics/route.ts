import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const topics = await prisma.topic.findMany({
    where: { moduleId: parseInt(params.moduleId, 10) },
    orderBy: { order: 'asc' },
    include: { materials: { orderBy: { createdAt: 'asc' } } },
  })
  return NextResponse.json(topics)
}

export async function POST(
  req: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, content, videoUrl, order } = await req.json()
  const topic = await prisma.topic.create({
    data: {
      moduleId: parseInt(params.moduleId, 10),
      title,
      description: description ?? null,
      content: content ?? null,
      videoUrl: videoUrl ?? null,
      order: order ?? 0,
    },
  })
  return NextResponse.json(topic, { status: 201 })
}
