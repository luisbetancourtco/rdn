import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import LoginForm from './LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await getSession()
  if (session.authenticated) redirect('/dashboard')
  const params = await searchParams
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">📡 Radar</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Monitor de noticias</p>
        {params.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 mb-4 text-sm">
            Contraseña incorrecta.
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  )
}
