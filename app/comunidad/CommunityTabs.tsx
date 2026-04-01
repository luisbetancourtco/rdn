'use client'

import { useState } from 'react'
import CommunityGrid, { type User } from './CommunityGrid'

const tabs = [
  { key: 'miembros', label: 'Miembros' },
  { key: 'whatsapp', label: 'WhatsApp' },
] as const

type Tab = (typeof tabs)[number]['key']

export default function CommunityTabs({ users }: { users: User[] }) {
  const [tab, setTab] = useState<Tab>('miembros')

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-md-on-surface">Comunidad</h1>
        <p className="text-sm text-md-on-surface-variant mt-0.5">Conecta con otros miembros</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-md-outline-variant">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              tab === t.key
                ? 'text-md-primary'
                : 'text-md-on-surface-variant hover:text-md-on-surface'
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-md-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {tab === 'miembros' && <CommunityGrid users={users} />}
      {tab === 'whatsapp' && (
        <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant shadow-md-1 p-8 text-center">
          <p className="text-5xl mb-4">💬</p>
          <h2 className="text-lg font-medium text-md-on-surface mb-2">Comunidad en WhatsApp</h2>
          <p className="text-sm text-md-on-surface-variant max-w-md mx-auto">
            Próximamente encontrarás aquí la información para unirte a nuestra comunidad en WhatsApp.
          </p>
        </div>
      )}
    </div>
  )
}
