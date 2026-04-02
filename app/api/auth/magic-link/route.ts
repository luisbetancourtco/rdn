import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendMagicLinkEmail } from '@/lib/mail'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  })

  // Always return success to avoid email enumeration
  if (!user) {
    return NextResponse.json({ ok: true })
  }

  const loginToken = crypto.randomBytes(32).toString('hex')
  const loginTokenExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: { loginToken, loginTokenExpiry },
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.headers.get('origin') || 'http://localhost:3000'
  const magicUrl = `${baseUrl}/api/auth/magic-link/${loginToken}`

  try {
    await sendMagicLinkEmail(user.email, magicUrl)
  } catch (err) {
    console.error('[Magic Link] Failed to send email:', err)
    return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
