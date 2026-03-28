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

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">📡 Radar</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Salir
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Filters */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white"
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
                  className="text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-100 transition-colors"
                >
                  ✓ LinkedIn conectado · Desconectar
                </button>
              ) : (
                <a
                  href="/api/linkedin/connect"
                  className="text-sm bg-blue-700 text-white rounded px-3 py-1.5 hover:bg-blue-800 transition-colors"
                >
                  Conectar LinkedIn
                </a>
              )
            )}

            {/* Ingest button */}
            <button
              onClick={handleIngestion}
              disabled={ingesting}
              className="text-sm bg-gray-800 text-white rounded px-3 py-1.5 hover:bg-gray-900 disabled:opacity-50 transition-colors"
            >
              {ingesting ? 'Ingiriendo...' : '↺ Correr ingestión'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                activeTab === key
                  ? 'bg-white border border-b-white border-gray-200 text-blue-600 -mb-px'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
              <span className={`ml-2 text-xs rounded-full px-1.5 py-0.5 ${
                activeTab === key ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {tabCounts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* News cards */}
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            No hay noticias en esta pestaña.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
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

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded shadow-lg text-white text-sm max-w-sm ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-gray-800'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}
