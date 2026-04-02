import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const session = await getSession()
  if (session.authenticated) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-md-surface flex items-center justify-center">
      <div className="bg-md-surface-container-lowest rounded-md-lg shadow-md-2 p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://media.licdn.com/dms/image/v2/D4E0BAQFgrtXjFp0jyw/company-logo_100_100/B4EZkQxTZMIIAY-/0/1756922985220?e=1776297600&v=beta&t=DPV_CjHHHF4Wr0EKz2GrCd7GTSt1eM2MG2NyYR4grN8"
            alt="Luis Betancourt"
            width={48}
            height={48}
            className="rounded-md-md mb-3"
          />
          <h1 className="text-xl font-medium text-md-on-surface">Plataforma de Cursos</h1>
          <p className="text-md-on-surface-variant text-sm mt-0.5">Inicia sesión para continuar</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
