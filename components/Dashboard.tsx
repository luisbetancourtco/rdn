'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { NewsItem } from '@prisma/client'
import NewsCard from './NewsCard'

type Tab = 'pendiente' | 'para_publicar' | 'descartada' | 'publicada'

interface DashboardProps {
  initialItems: NewsItem[]
  linkedInConnected: boolean
  hasLinkedInConfig: boolean
}

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

export default function Dashboard({ initialItems, linkedInConnected, hasLinkedInConfig }: DashboardProps) {
  const [items, setItems] = useState<NewsItem[]>(initialItems)
  const [activeTab, setActiveTab] = useState<Tab>('pendiente')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isConnected, setIsConnected] = useState(linkedInConnected)
  const [ingesting, setIngesting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  useEffect(() => {
    const linkedin = searchParams.get('linkedin')
    if (linkedin === 'connected') {
      setIsConnected(true)
      addToast('LinkedIn conectado correctamente.')
      router.replace('/dashboard')
    } else if (linkedin === 'error') {
      addToast('Error al conectar LinkedIn.', 'error')
      router.replace('/dashboard')
    }
  }, [searchParams, addToast, router])

  const categories = Array.from(new Set(items.map((i) => i.category))).sort()

  const filteredItems = items.filter((item) => {
    if (item.status !== activeTab) return false
    if (categoryFilter && item.category !== categoryFilter) return false
    if (typeFilter && item.type !== typeFilter) return false
    return true
  })

  async function handleIngestion() {
    setIngesting(true)
    try {
      const res = await fetch('/api/ingestion/run', { method: 'POST' })
      const data = await res.json()
      const deletedMsg = data.deleted > 0 ? `, ${data.deleted} descartadas eliminadas` : ''
      addToast(`Ingestión completada: ${data.created} nuevos, ${data.skipped} ya existentes${deletedMsg}.`)
      router.refresh()
    } catch {
      addToast('Error al ejecutar ingestión.', 'error')
    } finally {
      setIngesting(false)
    }
  }

  async function handleDisconnectLinkedIn() {
    await fetch('/api/linkedin/disconnect', { method: 'POST' })
    setIsConnected(false)
    addToast('LinkedIn desconectado.')
  }

  function updateItem(updated: NewsItem) {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'para_publicar', label: 'Para publicar' },
    { key: 'descartada', label: 'Descartadas' },
    { key: 'publicada', label: 'Publicadas' },
  ]

  const tabCounts = {
    pendiente: items.filter((i) => i.status === 'pendiente').length,
    para_publicar: items.filter((i) => i.status === 'para_publicar').length,
    descartada: items.filter((i) => i.status === 'descartada').length,
    publicada: items.filter((i) => i.status === 'publicada').length,
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Controls bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Filters */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-md-outline rounded-md-sm px-4 py-2.5 text-sm bg-md-surface-container-lowest text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-md-outline rounded-md-sm px-4 py-2.5 text-sm bg-md-surface-container-lowest text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
          >
            <option value="">Todos los tipos</option>
            <option value="novedad">Novedad</option>
            <option value="evergreen">Evergreen</option>
          </select>

          <div className="ml-auto flex items-center gap-3">
            {/* LinkedIn */}
            {hasLinkedInConfig && (
              isConnected ? (
                <button
                  onClick={handleDisconnectLinkedIn}
                  className="state-layer text-sm border border-md-outline rounded-md-xl px-5 py-2.5 text-md-on-surface-variant hover:bg-md-surface-container-high transition-colors font-medium"
                >
                  ✓ LinkedIn conectado · Desconectar
                </button>
              ) : (
                <a
                  href="/api/linkedin/connect"
                  className="state-layer text-sm bg-md-primary text-md-on-primary rounded-md-xl px-5 py-2.5 font-medium shadow-md-1 hover:shadow-md-2 transition-all"
                >
                  Conectar LinkedIn
                </a>
              )
            )}

            {/* Ingest button */}
            <button
              onClick={handleIngestion}
              disabled={ingesting}
              className="state-layer text-sm bg-md-primary text-md-on-primary rounded-md-xl px-5 py-2.5 font-medium shadow-md-1 hover:shadow-md-2 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              {ingesting ? 'Ingiriendo...' : '↺ Correr ingestión'}
            </button>
          </div>
        </div>

        {/* Tabs — M3 secondary tabs */}
        <div className="flex bg-md-surface-container rounded-md-lg p-1 mb-6 gap-1">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`state-layer flex-1 px-4 py-2.5 text-sm font-medium rounded-md-sm transition-all ${
                activeTab === key
                  ? 'bg-md-surface-container-lowest text-md-primary shadow-md-1'
                  : 'text-md-on-surface-variant hover:text-md-on-surface'
              }`}
            >
              {label}
              <span className={`ml-2 text-xs rounded-full px-2 py-0.5 font-medium ${
                activeTab === key
                  ? 'bg-md-primary-container text-md-on-primary-container'
                  : 'bg-md-surface-container-highest text-md-on-surface-variant'
              }`}>
                {tabCounts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* News cards */}
        {filteredItems.length === 0 ? (
          <div className="text-center text-md-on-surface-variant py-16 text-sm">
            No hay noticias en esta pestaña.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredItems.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                linkedInConnected={isConnected}
                onUpdate={updateItem}
                onToast={addToast}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toasts — M3 snackbar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-3 rounded-md-sm shadow-md-3 text-sm font-medium max-w-md animate-[slideUp_0.2s_ease-out] ${
              toast.type === 'error'
                ? 'bg-md-error-container text-md-on-error-container'
                : 'bg-md-inverse-surface text-md-inverse-on-surface'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}
