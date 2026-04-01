import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const modules = await prisma.courseModule.findMany({
    where: { courseId: parseInt(params.id, 10) },
    orderBy: { order: 'asc' },
    include: { topics: { orderBy: { order: 'asc' } } },
  })
  return NextResponse.json(modules)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, slug, description, content, order } = await req.json()
  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const module_ = await prisma.courseModule.create({
    data: { courseId: parseInt(params.id, 10), title, slug: generatedSlug, description, content, order: order ?? 0 },
  })
  return NextResponse.json(module_, { status: 201 })
}
