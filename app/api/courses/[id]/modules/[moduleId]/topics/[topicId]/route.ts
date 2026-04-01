import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: { id: string; moduleId: string; topicId: string } }
) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const topic = await prisma.topic.findUnique({
    where: { id: parseInt(params.topicId, 10) },
    include: { materials: { orderBy: { createdAt: 'asc' } } },
  })
  if (!topic) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(topic)
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; moduleId: string; topicId: string } }
) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, content, videoUrl, order } = await req.json()
  const topic = await prisma.topic.update({
    where: { id: parseInt(params.topicId, 10) },
    data: {
      title,
      description: description ?? null,
      content: content ?? null,
      videoUrl: videoUrl || null,
      ...(order !== undefined ? { order } : {}),
    },
  })
  return NextResponse.json(topic)
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; moduleId: string; topicId: string } }
) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.topic.delete({ where: { id: parseInt(params.topicId, 10) } })
  return NextResponse.json({ ok: true })
}
