'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type NavItem = { href: string; label: string; icon: string }

const ICON_BASE = 'https://rdkfjppgbvthvtjdkcgi.supabase.co/storage/v1/object/public/icons'

const alwaysVisible: NavItem[] = [
  { href: '/cursos', label: 'Cursos', icon: `${ICON_BASE}/courses.png` },
  { href: '/comunidad', label: 'Comunidad', icon: `${ICON_BASE}/community.png` },
]

const conditionalItems: NavItem[] = [
  { href: '/asesorias', label: 'Asesorías', icon: `${ICON_BASE}/advisory.png` },
  { href: '/tareas', label: 'Tareas', icon: `${ICON_BASE}/tasks.png` },
]

const adminOnlyItems: NavItem[] = [
  { href: '/diagnostico', label: 'Diagnóstico', icon: `${ICON_BASE}/diagnostic.png` },
  { href: '/ruta', label: 'Ruta de aprendizaje', icon: `${ICON_BASE}/route.png` },
  { href: '/bitacora', label: 'Bitácora', icon: `${ICON_BASE}/journal.png` },
  { href: '/hitos', label: 'Hitos', icon: `${ICON_BASE}/milestones.png` },
  { href: '/alfred', label: 'Alfred', icon: `${ICON_BASE}/alfred-chat.png` },
  { href: '/dashboard', label: 'Radar', icon: `${ICON_BASE}/radar.png` },
  { href: '/usuarios', label: 'Usuarios', icon: `${ICON_BASE}/users.png` },
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
    window.location.href = '/login'
  }

  const navItems: NavItem[] = []
  // Inicio is always first
  navItems.push({ href: '/inicio', label: 'Inicio', icon: `${ICON_BASE}/home.png` })

  if (role === 'admin') {
    // Admin sees everything in canonical order
    navItems.push(
      { href: '/diagnostico', label: 'Diagnóstico', icon: `${ICON_BASE}/diagnostic.png` },
      { href: '/ruta', label: 'Ruta de aprendizaje', icon: `${ICON_BASE}/route.png` },
      { href: '/cursos', label: 'Cursos', icon: `${ICON_BASE}/courses.png` },
      { href: '/asesorias', label: 'Asesorías', icon: `${ICON_BASE}/advisory.png` },
      { href: '/tareas', label: 'Tareas', icon: `${ICON_BASE}/tasks.png` },
      { href: '/bitacora', label: 'Bitácora', icon: `${ICON_BASE}/journal.png` },
      { href: '/hitos', label: 'Logros', icon: `${ICON_BASE}/milestones.png` },
      { href: '/comunidad', label: 'Comunidad', icon: `${ICON_BASE}/community.png` },
      { href: '/alfred', label: 'Alfred', icon: `${ICON_BASE}/alfred-chat.png` },
      { href: '/dashboard', label: 'Radar', icon: `${ICON_BASE}/radar.png` },
      { href: '/usuarios', label: 'Usuarios', icon: `${ICON_BASE}/users.png` },
    )
  } else {
    // Student: cursos, conditional asesorías/tareas, comunidad
    navItems.push({ href: '/cursos', label: 'Cursos', icon: `${ICON_BASE}/courses.png` })
    if (hasAsesorias) navItems.push({ href: '/asesorias', label: 'Asesorías', icon: `${ICON_BASE}/advisory.png` })
    if (hasTareas) navItems.push({ href: '/tareas', label: 'Tareas', icon: `${ICON_BASE}/tasks.png` })
    navItems.push({ href: '/comunidad', label: 'Comunidad', icon: `${ICON_BASE}/community.png` })
  }

  const navContent = (
    <>
      {/* Brand */}
      <div className="px-4 py-5 flex items-center">
        <img
          src="https://rdkfjppgbvthvtjdkcgi.supabase.co/storage/v1/object/public/icons/logo-alfred.png"
          alt="Alfred"
          width={400}
          className="w-full max-w-[400px]"
        />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-1 space-y-0 overflow-y-auto">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`state-layer flex items-center gap-3 px-4 py-[4.8px] rounded-md-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-md-secondary-container text-md-on-secondary-container'
                  : 'text-md-on-surface-variant hover:bg-md-surface-container-highest'
              }`}
            >
              {icon.startsWith('http') ? (
                <img src={icon} alt={label} width={40} height={40} className="w-[52px] h-[52px]" />
              ) : (
                <span className="text-3xl">{icon}</span>
              )}
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="px-3 py-2 space-y-0">
        <Link
          href="/perfil"
          className={`state-layer flex items-center gap-3 px-4 py-1.5 rounded-md-xl text-sm font-medium transition-colors ${
            pathname.startsWith('/perfil')
              ? 'bg-md-secondary-container text-md-on-secondary-container'
              : 'text-md-on-surface-variant hover:bg-md-surface-container-highest'
          }`}
        >
          <img src={`${ICON_BASE}/profile.png`} alt="Mi Perfil" width={40} height={40} className="w-[52px] h-[52px]" />
          <span>Mi Perfil</span>
        </Link>
        <button
          onClick={handleLogout}
          className="state-layer flex items-center gap-3 text-sm text-md-on-surface-variant hover:text-md-on-surface px-4 py-1.5 rounded-md-xl transition-colors w-full text-left font-medium"
        >
          <img src={`${ICON_BASE}/log-out.png`} alt="Salir" width={40} height={40} className="w-[52px] h-[52px]" />
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
          src="https://rdkfjppgbvthvtjdkcgi.supabase.co/storage/v1/object/public/icons/logo-alfred.png"
          alt="Alfred"
          width={120}
          className="ml-3"
        />
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
