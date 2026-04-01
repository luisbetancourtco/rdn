'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      const data = await res.json()
      router.push('/diagnostico')
      return
    } else {
      const data = await res.json()
      setError(data.error || 'Error al iniciar sesión')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-md-error-container text-md-on-error-container rounded-md-sm px-4 py-3 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=" "
          required
          id="email"
          autoComplete="email"
          className="peer w-full border border-md-outline rounded-md-sm px-4 pt-5 pb-2 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
        />
        <label
          htmlFor="email"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-md-on-surface-variant pointer-events-none transition-all peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-md-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
        >
          Correo electrónico
        </label>
      </div>

      <div className="relative">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder=" "
          required
          id="password"
          autoComplete="current-password"
          className="peer w-full border border-md-outline rounded-md-sm px-4 pt-5 pb-2 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
        />
        <label
          htmlFor="password"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-md-on-surface-variant pointer-events-none transition-all peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-md-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
        >
          Contraseña
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="state-layer bg-md-primary text-md-on-primary rounded-md-xl px-6 py-3 font-medium text-sm shadow-md-1 hover:shadow-md-2 disabled:opacity-50 disabled:shadow-none transition-all"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <Link
        href="/recuperar"
        className="text-xs text-md-on-surface-variant hover:text-md-primary text-center transition-colors"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </form>
  )
}
