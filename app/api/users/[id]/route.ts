import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  // Users can only edit their own profile (admins can edit anyone)
  if (session.userRole !== 'admin' && session.userId !== Number(id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const allowedFields = [
    'email', 'name', 'firstName', 'lastName', 'country', 'city',
    'avatarUrl',
    'nombreNegocio', 'urlNegocio', 'descripcionNegocio', 'categoriaNegocio',
    'facebook', 'instagram', 'linkedin', 'twitter', 'youtube',
    'objetivo',
  ] as const

  const data: Record<string, string | null> = {}
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field]?.trim() || null
    }
  }

  // Handle password change
  if (body.password) {
    if (body.password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }
    ;(data as Record<string, string | null>).passwordHash = await bcrypt.hash(body.password, 10)
  }

  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data,
    })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'No encontrado o email duplicado' }, { status: 409 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.user.delete({ where: { id: Number(id) } })
  return new NextResponse(null, { status: 204 })
}
