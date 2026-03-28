'use client'

import { useState } from 'react'
import type { NewsItem } from '@prisma/client'

interface NewsCardProps {
  item: NewsItem
  linkedInConnected: boolean
  onUpdate: (item: NewsItem) => void
  onToast: (message: string, type?: 'success' | 'error') => void
}

const relevanceBadge: Record<string, string> = {
  alta: 'bg-green-100 text-green-800',
  media: 'bg-yellow-100 text-yellow-800',
  baja: 'bg-gray-100 text-gray-600',
}

const typeBadge: Record<string, string> = {
  novedad: 'bg-blue-100 text-blue-800',
  evergreen: 'bg-purple-100 text-purple-800',
}

export default function NewsCard({ item, linkedInConnected, onUpdate, onToast }: NewsCardProps) {
  const [captionText, setCaptionText] = useState(item.caption ?? '')
  const [showCaption, setShowCaption] = useState(!!item.caption)
  const [generatingCaption, setGeneratingCaption] = useState(false)
  const [publishing, setPublishing] = useState(false)

  async function handleGenerateCaption() {
    setGeneratingCaption(true)
    try {
      const res = await fetch(`/api/news/${item.id}/generate-caption`, { method: 'POST' })
      const data = await res.json()
      setCaptionText(data.caption)
      setShowCaption(true)
      // Auto-guardar el caption al generarlo por primera vez
      await fetch(`/api/news/${item.id}/save-caption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: data.caption }),
      })
      onUpdate({ ...item, caption: data.caption })
      onToast('Caption generado y guardado.')
    } catch {
      onToast('Error al generar caption.', 'error')
    } finally {
      setGeneratingCaption(false)
    }
  }

  async function handleSaveCaption() {
    const res = await fetch(`/api/news/${item.id}/save-caption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: captionText }),
    })
    if (res.ok) {
      onUpdate({ ...item, caption: captionText })
      onToast('Caption guardado.')
    } else {
      onToast('Error al guardar.', 'error')
    }
  }

  async function handleCopyCaption() {
    await navigator.clipboard.writeText(captionText)
    onToast('Copiado al portapapeles.')
  }

  async function handleStatus(status: string) {
    const res = await fetch(`/api/news/${item.id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      onUpdate({ ...item, status })
      onToast(`Estado cambiado a "${status}".`)
    } else {
      onToast('Error al cambiar estado.', 'error')
    }
  }

  async function handlePublish() {
    if (!captionText) return onToast('Genera y guarda un caption primero.', 'error')
    setPublishing(true)
    try {
      const res = await fetch(`/api/news/${item.id}/publish`, { method: 'POST' })
      if (res.status === 401) {
        onToast('Token de LinkedIn expirado. Reconecta tu cuenta.', 'error')
        return
      }
      if (!res.ok) throw new Error()
      onUpdate({ ...item, status: 'publicada', publishedAt: new Date() })
      onToast('Publicado en LinkedIn.')
    } catch {
      onToast('Error al publicar.', 'error')
    } finally {
      setPublishing(false)
    }
  }

  const pubDate = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    : item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    : ''

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-semibold text-blue-700 hover:underline leading-snug"
        >
          {item.title}
        </a>
        <span className="text-xs text-gray-400 whitespace-nowrap mt-1">{pubDate}</span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5">{item.source}</span>
        <span className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5">{item.category}</span>
        {item.type && (
          <span className={`text-xs rounded px-2 py-0.5 ${typeBadge[item.type] ?? 'bg-gray-100 text-gray-600'}`}>
            {item.type}
          </span>
        )}
        {item.relevance && (
          <span className={`text-xs rounded px-2 py-0.5 ${relevanceBadge[item.relevance] ?? 'bg-gray-100 text-gray-600'}`}>
            {item.relevance}
          </span>
        )}
      </div>

      {/* Summary */}
      {item.summary && (
        <p className="text-sm text-gray-600 mb-2 leading-relaxed">{item.summary}</p>
      )}

      {/* Reason */}
      {item.reason && (
        <p className="text-xs text-gray-400 italic mb-3">{item.reason}</p>
      )}

      {/* Caption */}
      {showCaption && (
        <div className="mb-3">
          <textarea
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
            rows={8}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-xs text-gray-400 text-right mt-1">{captionText.length} caracteres</div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleGenerateCaption}
          disabled={generatingCaption}
          className="text-xs border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {generatingCaption ? 'Generando...' : '✨ Generar caption'}
        </button>

        {showCaption && (
          <>
            <button
              onClick={handleCopyCaption}
              className="text-xs border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Copiar
            </button>
            <button
              onClick={handleSaveCaption}
              className="text-xs bg-blue-600 text-white rounded px-3 py-1.5 hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
            {linkedInConnected && item.status === 'para_publicar' && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="text-xs bg-blue-800 text-white rounded px-3 py-1.5 hover:bg-blue-900 disabled:opacity-50 transition-colors"
              >
                {publishing ? 'Publicando...' : 'Publicar en LinkedIn'}
              </button>
            )}
          </>
        )}

        {/* Status buttons */}
        <div className="ml-auto flex gap-2">
          {item.status !== 'para_publicar' && (
            <button
              onClick={() => handleStatus('para_publicar')}
              className="text-xs border border-green-300 text-green-700 rounded px-3 py-1.5 hover:bg-green-50 transition-colors"
            >
              Para publicar
            </button>
          )}
          {item.status !== 'pendiente' && (
            <button
              onClick={() => handleStatus('pendiente')}
              className="text-xs border border-gray-300 text-gray-600 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Pendiente
            </button>
          )}
          {item.status !== 'descartada' && (
            <button
              onClick={() => handleStatus('descartada')}
              className="text-xs border border-red-300 text-red-600 rounded px-3 py-1.5 hover:bg-red-50 transition-colors"
            >
              Descartar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
