import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const groupId = parseInt(params.id)
  const { userId } = await req.json()
  if (!userId) {
    return NextResponse.json({ error: 'userId es requerido' }, { status: 400 })
  }

  try {
    const member = await prisma.userGroupMember.create({
      data: { groupId, userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    })
    return NextResponse.json(member, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'El usuario ya es miembro del grupo' }, { status: 409 })
  }
}
