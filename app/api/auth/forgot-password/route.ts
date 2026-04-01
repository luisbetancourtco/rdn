import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

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

  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  })

  // Build the reset URL
  const baseUrl = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const resetUrl = `${baseUrl}/recuperar/${resetToken}`

  // Log to console for now — replace with email sending later
  console.log(`[Password Reset] ${user.email} → ${resetUrl}`)

  return NextResponse.json({ ok: true })
}
