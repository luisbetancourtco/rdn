import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; courseId: string }> }
) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, courseId } = await params
  await prisma.courseAccess.delete({
    where: { userId_courseId: { userId: Number(id), courseId: Number(courseId) } },
  })
  return new NextResponse(null, { status: 204 })
}
