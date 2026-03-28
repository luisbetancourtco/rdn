import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { exchangeCode, getPersonId } from '@/lib/linkedin'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code || !state || state !== session.linkedInState) {
    return NextResponse.redirect(new URL('/dashboard?linkedin=error', req.url))
  }

  try {
    const tokenData = await exchangeCode(code)
    const personId = await getPersonId(tokenData.access_token)

    await Promise.all([
      prisma.setting.upsert({
        where: { key: 'linkedin_access_token' },
        update: { value: tokenData.access_token },
        create: { key: 'linkedin_access_token', value: tokenData.access_token },
      }),
      prisma.setting.upsert({
        where: { key: 'linkedin_person_id' },
        update: { value: personId },
        create: { key: 'linkedin_person_id', value: personId },
      }),
    ])

    session.linkedInState = undefined
    await session.save()

    return NextResponse.redirect(new URL('/dashboard?linkedin=connected', req.url))
  } catch {
    return NextResponse.redirect(new URL('/dashboard?linkedin=error', req.url))
  }
}
