'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Error al enviar el enlace')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-md-primary-container text-md-on-primary-container flex items-center justify-center mx-auto mb-4 text-xl">
          ✉
        </div>
        <p className="text-sm text-md-on-surface mb-2 font-medium">Revisa tu correo</p>
        <p className="text-xs text-md-on-surface-variant mb-4">
          Si existe una cuenta con <strong>{email}</strong>, recibirás un enlace para restablecer tu contraseña.
        </p>
        <Link
          href="/login"
          className="text-xs text-md-primary hover:underline font-medium"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    )
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

      <button
        type="submit"
        disabled={loading}
        className="state-layer bg-md-primary text-md-on-primary rounded-md-xl px-6 py-3 font-medium text-sm shadow-md-1 hover:shadow-md-2 disabled:opacity-50 disabled:shadow-none transition-all"
      >
        {loading ? 'Enviando...' : 'Enviar enlace'}
      </button>

      <Link
        href="/login"
        className="text-xs text-md-on-surface-variant hover:text-md-primary text-center transition-colors"
      >
        Volver al inicio de sesión
      </Link>
    </form>
  )
}
