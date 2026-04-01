import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function DELETE(_req: Request, { params }: { params: { id: string; userId: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.userGroupMember.delete({
    where: {
      groupId_userId: {
        groupId: parseInt(params.id),
        userId: parseInt(params.userId),
      },
    },
  })
  return NextResponse.json({ ok: true })
}
