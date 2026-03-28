import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  authenticated?: boolean
  linkedInState?: string
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET_KEY as string,
  cookieName: 'radar_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  },
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}
