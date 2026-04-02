import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { email, apiKey } = await req.json()

  if (!apiKey || apiKey !== process.env.MAGIC_LINK_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  const loginToken = crypto.randomBytes(32).toString('hex')
  const loginTokenExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: { loginToken, loginTokenExpiry },
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/api/auth/magic-link/${loginToken}`

  return NextResponse.json({ url })
}
