import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { runIngestion } from '@/lib/ingestion'

export async function POST() {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const maxAgeDays = parseInt(process.env.MAX_ITEM_AGE_DAYS ?? '7', 10)
  const result = await runIngestion(maxAgeDays)
  return NextResponse.json(result)
}
