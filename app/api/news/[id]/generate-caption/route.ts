import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { generateCaption } from '@/lib/caption'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const item = await prisma.newsItem.findUnique({ where: { id: parseInt(id) } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const caption = await generateCaption(item.title, item.summary ?? '', item.url)
  return NextResponse.json({ caption })
}
