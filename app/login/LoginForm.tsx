'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const magicLinkError = searchParams.get('error') === 'magic_link_expired'

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
      router.push('/inicio')
      return
    } else {
      const data = await res.json()
      setError(data.error || 'Error al iniciar sesión')
    }
    setLoading(false)
  }

  async function handleMagicLink() {
    if (!email) {
      setError('Ingresa tu correo electrónico primero')
      return
    }
    setError('')
    setMagicLoading(true)

    const res = await fetch('/api/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setMagicSent(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Error al enviar el enlace')
    }
    setMagicLoading(false)
  }

  if (magicSent) {
    return (
      <div className="text-center space-y-3">
        <p className="text-sm font-medium text-md-on-surface">Enlace enviado</p>
        <p className="text-xs text-md-on-surface-variant">
          Revisa tu correo electrónico y haz clic en el enlace para ingresar. El enlace expira en 15 minutos.
        </p>
        <button
          onClick={() => setMagicSent(false)}
          className="text-xs text-md-primary hover:underline"
        >
          Volver al inicio de sesión
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {(error || magicLinkError) && (
        <div className="bg-md-error-container text-md-on-error-container rounded-md-sm px-4 py-3 text-sm font-medium">
          {error || 'El enlace ha expirado o no es válido. Solicita uno nuevo.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-md-outline-variant" />
        <span className="text-xs text-md-on-surface-variant">o</span>
        <div className="flex-1 h-px bg-md-outline-variant" />
      </div>

      <button
        onClick={handleMagicLink}
        disabled={magicLoading}
        className="state-layer bg-md-secondary-container text-md-on-secondary-container rounded-md-xl px-6 py-3 font-medium text-sm shadow-md-1 hover:shadow-md-2 disabled:opacity-50 disabled:shadow-none transition-all"
      >
        {magicLoading ? 'Enviando...' : 'Enviar enlace de acceso'}
      </button>

      <Link
        href="/recuperar"
        className="text-xs text-md-on-surface-variant hover:text-md-primary text-center transition-colors"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </div>
  )
}
