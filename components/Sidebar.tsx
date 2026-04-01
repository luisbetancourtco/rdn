'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type NavItem = { href: string; label: string; icon: string }

const alwaysVisible: NavItem[] = [
  { href: '/cursos', label: 'Cursos', icon: '🎓' },
  { href: '/comunidad', label: 'Comunidad', icon: '🤝' },
]

const conditionalItems: NavItem[] = [
  { href: '/asesorias', label: 'Asesorías', icon: '💬' },
  { href: '/tareas', label: 'Tareas', icon: '✅' },
]

const adminOnlyItems: NavItem[] = [
  { href: '/diagnostico', label: 'Diagnóstico', icon: 'https://rdkfjppgbvthvtjdkcgi.supabase.co/storage/v1/object/public/icons/diagnostic.png' },
  { href: '/ruta', label: 'Ruta de aprendizaje', icon: 'https://rdkfjppgbvthvtjdkcgi.supabase.co/storage/v1/object/public/icons/route.png' },
  { href: '/bitacora', label: 'Bitácora', icon: '📓' },
  { href: '/hitos', label: 'Hitos', icon: '🏆' },
  { href: '/alfred', label: 'Alfred', icon: '🤖' },
  { href: '/dashboard', label: 'Radar', icon: '📡' },
  { href: '/usuarios', label: 'Usuarios', icon: '👥' },
]

export default function Sidebar({ role = 'alumno', hasAsesorias = false, hasTareas = false }: { role?: string; hasAsesorias?: boolean; hasTareas?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const navItems: NavItem[] = []
  if (role === 'admin') {
    // Admin sees everything
    navItems.push(
      { href: '/diagnostico', label: 'Diagnóstico', icon: 'https://rdkfjppgbvthvtjdkcgi.supabase.co/storage/v1/object/public/icons/diagnostic.png' },
      { href: '/ruta', label: 'Ruta de aprendizaje', icon: 'https://rdkfjppgbvthvtjdkcgi.supabase.co/storage/v1/object/public/icons/route.png' },
      ...alwaysVisible,
      ...conditionalItems,
      { href: '/bitacora', label: 'Bitácora', icon: '📓' },
      { href: '/hitos', label: 'Hitos', icon: '🏆' },
      { href: '/alfred', label: 'Alfred', icon: '🤖' },
      { href: '/dashboard', label: 'Radar', icon: '📡' },
      { href: '/usuarios', label: 'Usuarios', icon: '👥' },
    )
  } else {
    navItems.push({ href: '/cursos', label: 'Cursos', icon: '🎓' })
    if (hasAsesorias) navItems.push(conditionalItems[0])
    if (hasTareas) navItems.push(conditionalItems[1])
    navItems.push({ href: '/comunidad', label: 'Comunidad', icon: '🤝' })
  }

  const navContent = (
    <>
      {/* Brand */}
      <div className="px-4 py-5 flex items-center gap-3">
        <img
          src="https://rdkfjppgbvthvtjdkcgi.supabase.co/storage/v1/object/public/icons/alfred-icon.png"
          alt="Alfred"
          width={32}
          height={32}
          className="rounded-md-sm"
        />
        <span className="font-medium text-base text-md-on-surface tracking-wide">alfred</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`state-layer flex items-center gap-3 px-4 py-3 rounded-md-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-md-secondary-container text-md-on-secondary-container'
                  : 'text-md-on-surface-variant hover:bg-md-surface-container-highest'
              }`}
            >
              {icon.startsWith('http') ? (
                <img src={icon} alt={label} width={40} height={40} className="w-10 h-10" />
              ) : (
                <span className="text-3xl">{icon}</span>
              )}
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="px-3 py-4 space-y-1">
        <Link
          href="/perfil"
          className={`state-layer flex items-center gap-3 px-4 py-3 rounded-md-xl text-sm font-medium transition-colors ${
            pathname.startsWith('/perfil')
              ? 'bg-md-secondary-container text-md-on-secondary-container'
              : 'text-md-on-surface-variant hover:bg-md-surface-container-highest'
          }`}
        >
          <span className="text-3xl">👤</span>
          <span>Mi Perfil</span>
        </Link>
        <button
          onClick={handleLogout}
          className="state-layer flex items-center gap-3 text-sm text-md-on-surface-variant hover:text-md-on-surface px-4 py-3 rounded-md-xl transition-colors w-full text-left font-medium"
        >
          <span className="text-3xl">🚪</span>
          <span>Salir</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-md-surface-container border-b border-md-outline-variant flex items-center h-14 px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 text-md-on-surface"
          aria-label="Abrir menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <img
          src="https://rdkfjppgbvthvtjdkcgi.supabase.co/storage/v1/object/public/icons/alfred-icon.png"
          alt="Alfred"
          width={28}
          height={28}
          className="ml-3 rounded-md-sm"
        />
        <span className="ml-2 font-medium text-md-on-surface">alfred</span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-md-surface-container flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-end px-4 pt-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-md-on-surface-variant"
            aria-label="Cerrar menú"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 h-screen sticky top-0 bg-md-surface-container flex-col border-r border-md-outline-variant">
        {navContent}
      </aside>
    </>
  )
}
