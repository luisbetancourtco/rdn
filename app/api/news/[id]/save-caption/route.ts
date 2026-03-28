import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { caption } = await req.json()
  const item = await prisma.newsItem.update({
    where: { id: parseInt(id) },
    data: { caption },
  })
  return NextResponse.json({ ok: true, caption: item.caption })
}
