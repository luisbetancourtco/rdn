import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: { id: string; moduleId: string; topicId: string } }
) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, url, fileType } = await req.json()
  const material = await prisma.material.create({
    data: {
      topicId: parseInt(params.topicId, 10),
      name,
      url,
      fileType: fileType || null,
    },
  })
  return NextResponse.json(material, { status: 201 })
}
