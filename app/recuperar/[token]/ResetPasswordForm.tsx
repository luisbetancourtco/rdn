'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } else {
      setError(data.error || 'Error al restablecer la contraseña')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center">
        <p className="text-sm text-md-on-surface font-medium">Contraseña actualizada correctamente.</p>
        <p className="text-xs text-md-on-surface-variant mt-2">Redirigiendo al inicio de sesión...</p>
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder=" "
          required
          id="password"
          autoComplete="new-password"
          className="peer w-full border border-md-outline rounded-md-sm px-4 pt-5 pb-2 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
        />
        <label
          htmlFor="password"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-md-on-surface-variant pointer-events-none transition-all peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-md-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
        >
          Nueva contraseña
        </label>
      </div>

      <div className="relative">
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder=" "
          required
          id="confirm"
          autoComplete="new-password"
          className="peer w-full border border-md-outline rounded-md-sm px-4 pt-5 pb-2 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
        />
        <label
          htmlFor="confirm"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-md-on-surface-variant pointer-events-none transition-all peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-md-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
        >
          Confirmar contraseña
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="state-layer bg-md-primary text-md-on-primary rounded-md-xl px-6 py-3 font-medium text-sm shadow-md-1 hover:shadow-md-2 disabled:opacity-50 disabled:shadow-none transition-all"
      >
        {loading ? 'Guardando...' : 'Restablecer contraseña'}
      </button>
    </form>
  )
}
