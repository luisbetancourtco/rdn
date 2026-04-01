'use client'

import { useState } from 'react'

type User = {
  id: number
  name: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  country: string | null
  city: string | null
  nombreNegocio: string | null
  urlNegocio: string | null
  descripcionNegocio: string | null
  categoriaNegocio: string | null
  facebook: string | null
  instagram: string | null
  linkedin: string | null
  twitter: string | null
  youtube: string | null
  objetivo: string | null
}

function SocialLink({ url, label }: { url: string; label: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-md-primary font-medium hover:underline"
    >
      {label}
    </a>
  )
}

function UserProfile({ user, onClose }: { user: User; onClose: () => void }) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name
  const location = [user.city, user.country].filter(Boolean).join(', ')
  const socials = [
    { url: user.linkedin, label: 'LinkedIn' },
    { url: user.facebook, label: 'Facebook' },
    { url: user.instagram, label: 'Instagram' },
    { url: user.twitter, label: 'Twitter / X' },
    { url: user.youtube, label: 'YouTube' },
  ].filter(s => s.url)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant shadow-md-3 w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <div />
          <button
            onClick={onClose}
            className="p-1.5 text-md-on-surface-variant hover:text-md-on-surface rounded-md-sm transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 pt-2">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-md-primary-container flex items-center justify-center shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-medium text-md-on-primary-container">
                  {fullName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-medium text-md-on-surface">{fullName}</h2>
              {location && <p className="text-sm text-md-on-surface-variant">{location}</p>}
              {user.categoriaNegocio && (
                <span className="inline-block mt-1 text-xs bg-md-secondary-container text-md-on-secondary-container px-2.5 py-0.5 rounded-md-sm font-medium">
                  {user.categoriaNegocio}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-5">
            {/* Business */}
            {(user.nombreNegocio || user.descripcionNegocio) && (
              <div>
                <p className="text-xs font-medium text-md-on-surface-variant mb-1.5">Negocio</p>
                {user.nombreNegocio && (
                  <p className="text-sm text-md-on-surface font-medium">
                    {user.urlNegocio ? (
                      <a href={user.urlNegocio} target="_blank" rel="noopener noreferrer" className="text-md-primary hover:underline">
                        {user.nombreNegocio}
                      </a>
                    ) : user.nombreNegocio}
                  </p>
                )}
                {user.descripcionNegocio && (
                  <p className="text-sm text-md-on-surface-variant mt-1 leading-relaxed">{user.descripcionNegocio}</p>
                )}
              </div>
            )}

            {/* Objective */}
            {user.objetivo && (
              <div>
                <p className="text-xs font-medium text-md-on-surface-variant mb-1.5">Objetivo</p>
                <p className="text-sm text-md-on-surface leading-relaxed">{user.objetivo}</p>
              </div>
            )}

            {/* Social links */}
            {socials.length > 0 && (
              <div>
                <p className="text-xs font-medium text-md-on-surface-variant mb-2">Redes sociales</p>
                <div className="flex flex-wrap gap-2">
                  {socials.map(s => (
                    <span key={s.label} className="bg-md-surface-container px-3 py-1.5 rounded-md-sm">
                      <SocialLink url={s.url!} label={s.label} />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommunityGrid({ users }: { users: User[] }) {
  const [selected, setSelected] = useState<User | null>(null)
  const [search, setSearch] = useState('')

  const filtered = users.filter(u => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      u.name.toLowerCase().includes(q) ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.nombreNegocio?.toLowerCase().includes(q) ||
      u.country?.toLowerCase().includes(q) ||
      u.city?.toLowerCase().includes(q) ||
      u.categoriaNegocio?.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-md-on-surface-variant">{users.length} miembro{users.length !== 1 ? 's' : ''}</p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, negocio, ciudad..."
          className="w-full sm:w-72 px-3 py-2.5 text-sm bg-md-surface-container-lowest border border-md-outline-variant rounded-md-sm focus:outline-none focus:border-md-primary focus:ring-1 focus:ring-md-primary text-md-on-surface placeholder:text-md-outline"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-md-on-surface-variant">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-medium text-md-on-surface text-lg">Sin resultados</p>
          <p className="text-sm mt-1">Intenta con otro término de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(user => {
            const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name
            const location = [user.city, user.country].filter(Boolean).join(', ')
            return (
              <div
                key={user.id}
                onClick={() => setSelected(user)}
                className="state-layer bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant hover:shadow-md-2 transition-all cursor-pointer p-4 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-md-primary-container flex items-center justify-center mb-3">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-medium text-md-on-primary-container">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-md-on-surface leading-snug">{displayName}</p>
                {user.nombreNegocio && (
                  <p className="text-xs text-md-on-surface-variant mt-0.5 line-clamp-1">{user.nombreNegocio}</p>
                )}
                {location && (
                  <p className="text-xs text-md-outline mt-0.5">{location}</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {selected && <UserProfile user={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export type { User }
