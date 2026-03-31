'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside className="w-52 shrink-0 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Brand */}
      <div className="px-4 py-5 flex items-center gap-3 border-b border-gray-700/60">
        <img
          src="https://media.licdn.com/dms/image/v2/D4E0BAQFgrtXjFp0jyw/company-logo_100_100/B4EZkQxTZMIIAY-/0/1756922985220?e=1776297600&v=beta&t=DPV_CjHHHF4Wr0EKz2GrCd7GTSt1eM2MG2NyYR4grN8"
          alt="Alfred"
          width={32}
          height={32}
          className="rounded-md"
        />
        <span className="font-semibold text-base tracking-wide">alfred</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname.startsWith('/dashboard')
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <span className="text-base">📡</span>
          <span>Radar</span>
        </Link>
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-700/60">
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Salir
        </button>
      </div>
    </aside>
  )
}
