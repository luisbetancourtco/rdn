'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ImpersonationBanner({ userName }: { userName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function stopImpersonating() {
    setLoading(true)
    const res = await fetch('/api/auth/stop-impersonate', { method: 'POST' })
    if (res.ok) {
      router.push('/usuarios')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-md-tertiary text-md-on-tertiary px-4 py-2 flex items-center justify-center gap-3 text-sm font-medium shadow-md-2">
      <span>Viendo como: <strong>{userName}</strong></span>
      <button
        onClick={stopImpersonating}
        disabled={loading}
        className="px-3 py-1 bg-md-on-tertiary text-md-tertiary rounded-md-xl text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? 'Volviendo...' : 'Volver a admin'}
      </button>
    </div>
  )
}
