'use client'

import { useState } from 'react'
import Link from 'next/link'

function getEmbedUrl(url: string): string | null {
  if (!url.trim()) return null
  const ytWatch = url.match(/youtube\.com\/watch\?(?:.*&)?v=([^&]+)/)
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`
  const ytShort = url.match(/youtu\.be\/([^?&]+)/)
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`
  if (url.includes('youtube.com/embed/')) return url
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  if (url.startsWith('http')) return url
  return null
}

type Material = {
  id: number
  name: string
  url: string
  fileType: string | null
}

type TopicEditorProps = {
  courseId: number
  courseTitle: string
  moduleId: number
  moduleTitle: string
  topic: {
    id: number
    title: string
    description: string | null
    content: string | null
    videoUrl: string | null
    materials: Material[]
  }
}

export default function TopicEditor({
  courseId,
  courseTitle,
  moduleId,
  moduleTitle,
  topic,
}: TopicEditorProps) {
  const [form, setForm] = useState({
    title: topic.title,
    description: topic.description ?? '',
    content: topic.content ?? '',
    videoUrl: topic.videoUrl ?? '',
  })
  const [materials, setMaterials] = useState<Material[]>(topic.materials)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [showMaterialForm, setShowMaterialForm] = useState(false)
  const [newMaterial, setNewMaterial] = useState({ name: '', url: '', fileType: '' })
  const [addingMaterial, setAddingMaterial] = useState(false)

  const embedUrl = getEmbedUrl(form.videoUrl)

  const inputClass = "w-full border border-md-outline-variant rounded-md-sm px-4 py-2.5 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"

  async function saveTopic() {
    setSaving(true)
    try {
      await fetch(`/api/courses/${courseId}/modules/${moduleId}/topics/${topic.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  async function addMaterialFn() {
    if (!newMaterial.name.trim() || !newMaterial.url.trim()) return
    setAddingMaterial(true)
    try {
      const res = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}/topics/${topic.id}/materials`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMaterial),
        }
      )
      const material = await res.json()
      setMaterials(prev => [...prev, material])
      setNewMaterial({ name: '', url: '', fileType: '' })
      setShowMaterialForm(false)
    } finally {
      setAddingMaterial(false)
    }
  }

  async function deleteMaterial(materialId: number) {
    await fetch(
      `/api/courses/${courseId}/modules/${moduleId}/topics/${topic.id}/materials/${materialId}`,
      { method: 'DELETE' }
    )
    setMaterials(prev => prev.filter(m => m.id !== materialId))
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-md-on-surface-variant mb-6 flex-wrap">
        <Link href="/cursos" className="hover:text-md-primary transition-colors">Cursos</Link>
        <span>/</span>
        <Link href={`/cursos/${courseId}`} className="hover:text-md-primary transition-colors truncate max-w-[160px]">
          {courseTitle}
        </Link>
        <span>/</span>
        <span className="text-md-outline truncate max-w-[120px]">{moduleTitle}</span>
        <span>/</span>
        <span className="text-md-on-surface font-medium truncate max-w-[160px]">{form.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form + video */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topic form */}
          <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant p-6 shadow-md-1">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-medium text-md-on-surface">Detalles del tema</h2>
              <button
                onClick={saveTopic}
                disabled={saving}
                className="state-layer px-5 py-2 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 disabled:opacity-50 transition-all"
              >
                {saved ? '✓ Guardado' : saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-md-on-surface-variant mb-1.5">Título</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-md-on-surface-variant mb-1.5">Descripción corta</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-md-on-surface-variant mb-1.5">Contenido</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={8}
                  placeholder="Notas del tema, transcripción, puntos clave..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant p-6 shadow-md-1">
            <h2 className="font-medium text-md-on-surface mb-4">Video</h2>
            <input
              type="text"
              value={form.videoUrl}
              onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
              placeholder="URL de YouTube, Vimeo o cualquier reproductor embebible"
              className={`${inputClass} mb-4`}
            />
            {form.videoUrl && embedUrl && (
              <div className="aspect-video rounded-md-md overflow-hidden bg-md-inverse-surface">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  title={form.title}
                />
              </div>
            )}
            {form.videoUrl && !embedUrl && (
              <p className="text-xs text-md-error bg-md-error-container rounded-md-sm px-4 py-2.5 font-medium">
                URL no reconocida. Acepta YouTube, Vimeo o URLs de embed directas.
              </p>
            )}
            {!form.videoUrl && (
              <p className="text-xs text-md-on-surface-variant">
                Soporta YouTube (youtube.com/watch o youtu.be) y Vimeo.
              </p>
            )}
          </div>
        </div>

        {/* Right: materials */}
        <div>
          <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant p-6 shadow-md-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-md-on-surface">Materiales</h2>
              <button
                onClick={() => setShowMaterialForm(true)}
                className="state-layer text-xs px-3 py-1.5 border border-md-outline text-md-on-surface-variant rounded-md-xl font-medium transition-colors"
              >
                + Agregar
              </button>
            </div>

            {showMaterialForm && (
              <div className="mb-4 p-3 bg-md-surface-container rounded-md-sm border border-md-outline-variant space-y-2">
                <input
                  type="text"
                  value={newMaterial.name}
                  onChange={e => setNewMaterial(m => ({ ...m, name: e.target.value }))}
                  placeholder="Nombre del material"
                  autoFocus
                  className="w-full border border-md-outline-variant rounded-md-sm px-3 py-2 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
                />
                <input
                  type="text"
                  value={newMaterial.url}
                  onChange={e => setNewMaterial(m => ({ ...m, url: e.target.value }))}
                  placeholder="URL (Google Drive, Dropbox, web...)"
                  className="w-full border border-md-outline-variant rounded-md-sm px-3 py-2 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
                />
                <input
                  type="text"
                  value={newMaterial.fileType}
                  onChange={e => setNewMaterial(m => ({ ...m, fileType: e.target.value }))}
                  placeholder="Tipo: PDF, DOCX, enlace..."
                  className="w-full border border-md-outline-variant rounded-md-sm px-3 py-2 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={addMaterialFn}
                    disabled={addingMaterial}
                    className="state-layer px-4 py-2 bg-md-primary text-md-on-primary text-xs rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 disabled:opacity-50 transition-all"
                  >
                    Agregar
                  </button>
                  <button
                    onClick={() => {
                      setShowMaterialForm(false)
                      setNewMaterial({ name: '', url: '', fileType: '' })
                    }}
                    className="state-layer text-xs text-md-on-surface-variant font-medium px-3 py-1.5 rounded-md-xl transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {materials.length === 0 && !showMaterialForm ? (
              <p className="text-xs text-md-on-surface-variant">Sin materiales adjuntos.</p>
            ) : (
              <div className="space-y-2">
                {materials.map(material => (
                  <div
                    key={material.id}
                    className="flex items-start justify-between gap-2 py-2.5 border-b border-md-outline-variant last:border-0 group"
                  >
                    <div className="min-w-0">
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-md-primary hover:underline block truncate"
                      >
                        {material.name}
                      </a>
                      {material.fileType && (
                        <span className="text-xs text-md-on-surface-variant">{material.fileType}</span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteMaterial(material.id)}
                      className="text-sm text-md-error opacity-0 group-hover:opacity-100 transition-opacity shrink-0 leading-none mt-0.5"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
