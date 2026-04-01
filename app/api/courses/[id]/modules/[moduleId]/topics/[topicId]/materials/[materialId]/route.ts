import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; moduleId: string; topicId: string; materialId: string } }
) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.material.delete({ where: { id: parseInt(params.materialId, 10) } })
  return NextResponse.json({ ok: true })
}
