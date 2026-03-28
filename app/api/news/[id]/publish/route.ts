import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { postArticle } from '@/lib/linkedin'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const item = await prisma.newsItem.findUnique({ where: { id: parseInt(id) } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!item.caption) return NextResponse.json({ error: 'No caption' }, { status: 400 })

  const [tokenSetting, personSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'linkedin_access_token' } }),
    prisma.setting.findUnique({ where: { key: 'linkedin_person_id' } }),
  ])

  if (!tokenSetting || !personSetting) {
    return NextResponse.json({ error: 'LinkedIn not connected' }, { status: 400 })
  }

  try {
    const postId = await postArticle(
      tokenSetting.value,
      personSetting.value,
      item.caption,
      item.url,
      item.title,
    )
    await prisma.newsItem.update({
      where: { id: item.id },
      data: { status: 'para_publicar', publishedAt: new Date() },
    })
    return NextResponse.json({ ok: true, postId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    if (message === 'token_expired') {
      return NextResponse.json({ error: 'token_expired' }, { status: 401 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
