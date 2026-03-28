import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getAuthUrl } from '@/lib/linkedin'
import crypto from 'crypto'

export async function GET() {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL))
  }

  const state = crypto.randomBytes(16).toString('hex')
  session.linkedInState = state
  await session.save()

  const authUrl = getAuthUrl(state)
  return NextResponse.redirect(authUrl)
}
