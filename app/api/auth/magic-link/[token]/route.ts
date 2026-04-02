import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const user = await prisma.user.findUnique({
    where: { loginToken: token },
  })

  if (!user || !user.loginTokenExpiry || user.loginTokenExpiry < new Date()) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    return NextResponse.redirect(`${baseUrl}/login?error=magic_link_expired`)
  }

  // Clear the token (single use)
  await prisma.user.update({
    where: { id: user.id },
    data: { loginToken: null, loginTokenExpiry: null },
  })

  // Create session
  const session = await getSession()
  session.authenticated = true
  session.userId = user.id
  session.userName = user.name
  session.userRole = user.role
  await session.save()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return NextResponse.redirect(`${baseUrl}/inicio`)
}
