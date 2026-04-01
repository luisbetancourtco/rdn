import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, content, order } = await req.json()
  const module_ = await prisma.courseModule.update({
    where: { id: parseInt(params.moduleId, 10) },
    data: { title, description: description ?? null, content: content ?? null, order },
  })
  return NextResponse.json(module_)
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; moduleId: string } }
) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.courseModule.delete({ where: { id: parseInt(params.moduleId, 10) } })
  return NextResponse.json({ ok: true })
}
