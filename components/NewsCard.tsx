'use client'

import { useState } from 'react'
import type { NewsItem } from '@prisma/client'

interface NewsCardProps {
  item: NewsItem
  linkedInConnected: boolean
  onUpdate: (item: NewsItem) => void
  onToast: (message: string, type?: 'success' | 'error') => void
}

const relevanceChip: Record<string, string> = {
  alta: 'bg-md-success-container text-md-on-success-container',
  media: 'bg-md-tertiary-container text-md-on-tertiary-container',
  baja: 'bg-md-surface-container-highest text-md-on-surface-variant',
}

const typeChip: Record<string, string> = {
  novedad: 'bg-md-primary-container text-md-on-primary-container',
  evergreen: 'bg-md-tertiary-container text-md-on-tertiary-container',
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
    <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant p-5 shadow-md-1 hover:shadow-md-2 transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-medium text-md-primary hover:text-md-on-primary-container leading-snug transition-colors"
        >
          {item.title}
        </a>
        <span className="text-xs text-md-on-surface-variant whitespace-nowrap mt-1">{pubDate}</span>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs bg-md-surface-container-high text-md-on-surface-variant rounded-md-sm px-3 py-1 font-medium">
          {item.source}
        </span>
        <span className="text-xs bg-md-surface-container-high text-md-on-surface-variant rounded-md-sm px-3 py-1 font-medium">
          {item.category}
        </span>
        {item.type && (
          <span className={`text-xs rounded-md-sm px-3 py-1 font-medium ${typeChip[item.type] ?? 'bg-md-surface-container-high text-md-on-surface-variant'}`}>
            {item.type}
          </span>
        )}
        {item.relevance && (
          <span className={`text-xs rounded-md-sm px-3 py-1 font-medium ${relevanceChip[item.relevance] ?? 'bg-md-surface-container-high text-md-on-surface-variant'}`}>
            {item.relevance}
          </span>
        )}
      </div>

      {/* Summary */}
      {item.summary && (
        <p className="text-sm text-md-on-surface-variant mb-2 leading-relaxed">{item.summary}</p>
      )}

      {/* Reason */}
      {item.reason && (
        <p className="text-xs text-md-outline italic mb-3">{item.reason}</p>
      )}

      {/* Caption */}
      {showCaption && (
        <div className="mb-3">
          <textarea
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
            rows={8}
            className="w-full border border-md-outline-variant rounded-md-sm px-4 py-3 text-sm font-mono resize-y bg-md-surface-container-lowest text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
          />
          <div className="text-xs text-md-on-surface-variant text-right mt-1">{captionText.length} caracteres</div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {/* Tonal button */}
        <button
          onClick={handleGenerateCaption}
          disabled={generatingCaption}
          className="state-layer text-xs bg-md-secondary-container text-md-on-secondary-container rounded-md-xl px-4 py-2 font-medium disabled:opacity-50 transition-colors"
        >
          {generatingCaption ? 'Generando...' : '✨ Generar caption'}
        </button>

        {showCaption && (
          <>
            {/* Outlined button */}
            <button
              onClick={handleCopyCaption}
              className="state-layer text-xs border border-md-outline text-md-on-surface-variant rounded-md-xl px-4 py-2 font-medium transition-colors"
            >
              Copiar
            </button>
            {/* Filled button */}
            <button
              onClick={handleSaveCaption}
              className="state-layer text-xs bg-md-primary text-md-on-primary rounded-md-xl px-4 py-2 font-medium shadow-md-1 hover:shadow-md-2 transition-all"
            >
              Guardar
            </button>
            {linkedInConnected && item.status === 'para_publicar' && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="state-layer text-xs bg-md-primary text-md-on-primary rounded-md-xl px-4 py-2 font-medium shadow-md-1 hover:shadow-md-2 disabled:opacity-50 disabled:shadow-none transition-all"
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
              className="state-layer text-xs border border-md-outline text-md-success rounded-md-xl px-4 py-2 font-medium transition-colors"
            >
              Para publicar
            </button>
          )}
          {item.status !== 'pendiente' && (
            <button
              onClick={() => handleStatus('pendiente')}
              className="state-layer text-xs border border-md-outline text-md-on-surface-variant rounded-md-xl px-4 py-2 font-medium transition-colors"
            >
              Pendiente
            </button>
          )}
          {item.status !== 'descartada' && (
            <button
              onClick={() => handleStatus('descartada')}
              className="state-layer text-xs border border-md-outline text-md-error rounded-md-xl px-4 py-2 font-medium transition-colors"
            >
              Descartar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
