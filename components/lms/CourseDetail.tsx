'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Material = {
  id: number
  name: string
  url: string
  fileType: string | null
}

type Topic = {
  id: number
  title: string
  videoUrl: string | null
  materials: Material[]
}

type Module = {
  id: number
  title: string
  description: string | null
  content: string | null
  order: number
  topics: Topic[]
}

type Course = {
  id: number
  title: string
  description: string | null
  content: string | null
  thumbnail: string | null
  status: string
  modules: Module[]
}

interface CourseDetailProps {
  course: Course
}

export default function CourseDetail({ course }: CourseDetailProps) {
  const router = useRouter()

  const [form, setForm] = useState({
    title: course.title,
    description: course.description ?? '',
    content: course.content ?? '',
    thumbnail: course.thumbnail ?? '',
    status: course.status,
  })
  const [modules, setModules] = useState<Module[]>(course.modules)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [showNewModule, setShowNewModule] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [addingModule, setAddingModule] = useState(false)

  const [editingModuleId, setEditingModuleId] = useState<number | null>(null)
  const [editModuleForm, setEditModuleForm] = useState({ title: '', description: '', content: '' })

  const [addingTopicToModule, setAddingTopicToModule] = useState<number | null>(null)
  const [newTopicTitle, setNewTopicTitle] = useState('')

  async function saveCourse() {
    setSaving(true)
    try {
      await fetch(`/api/courses/${course.id}`, {
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

  async function deleteCourse() {
    if (!confirm('¿Eliminar este curso y todo su contenido? Esta acción no se puede deshacer.')) return
    await fetch(`/api/courses/${course.id}`, { method: 'DELETE' })
    router.push('/cursos')
  }

  async function addModule() {
    if (!newModuleTitle.trim()) return
    setAddingModule(true)
    try {
      const res = await fetch(`/api/courses/${course.id}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newModuleTitle, order: modules.length }),
      })
      const newMod = await res.json()
      setModules(prev => [...prev, { ...newMod, topics: [] }])
      setNewModuleTitle('')
      setShowNewModule(false)
    } finally {
      setAddingModule(false)
    }
  }

  function startEditModule(mod: Module) {
    setEditingModuleId(mod.id)
    setEditModuleForm({
      title: mod.title,
      description: mod.description ?? '',
      content: mod.content ?? '',
    })
  }

  async function saveModule(moduleId: number) {
    await fetch(`/api/courses/${course.id}/modules/${moduleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editModuleForm),
    })
    setModules(prev =>
      prev.map(m => m.id === moduleId ? { ...m, ...editModuleForm } : m)
    )
    setEditingModuleId(null)
  }

  async function deleteModule(moduleId: number) {
    if (!confirm('¿Eliminar este módulo y todos sus temas?')) return
    await fetch(`/api/courses/${course.id}/modules/${moduleId}`, { method: 'DELETE' })
    setModules(prev => prev.filter(m => m.id !== moduleId))
  }

  async function addTopic(moduleId: number) {
    if (!newTopicTitle.trim()) return
    const mod = modules.find(m => m.id === moduleId)
    const res = await fetch(`/api/courses/${course.id}/modules/${moduleId}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTopicTitle, order: mod?.topics.length ?? 0 }),
    })
    const newTopic = await res.json()
    setModules(prev =>
      prev.map(m =>
        m.id === moduleId
          ? { ...m, topics: [...m.topics, { ...newTopic, materials: [] }] }
          : m
      )
    )
    setNewTopicTitle('')
    setAddingTopicToModule(null)
  }

  async function deleteTopic(moduleId: number, topicId: number) {
    if (!confirm('¿Eliminar este tema?')) return
    await fetch(`/api/courses/${course.id}/modules/${moduleId}/topics/${topicId}`, { method: 'DELETE' })
    setModules(prev =>
      prev.map(m =>
        m.id === moduleId
          ? { ...m, topics: m.topics.filter(t => t.id !== topicId) }
          : m
      )
    )
  }

  const inputClass = "w-full border border-md-outline-variant rounded-md-sm px-4 py-2.5 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-md-on-surface-variant mb-6">
        <Link href="/cursos" className="hover:text-md-primary transition-colors">Cursos</Link>
        <span>/</span>
        <span className="text-md-on-surface font-medium truncate">{course.title}</span>
      </div>

      {/* Course form */}
      <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant p-6 mb-6 shadow-md-1">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-medium text-md-on-surface">Detalles del curso</h2>
          <div className="flex items-center gap-4">
            <Link
              href={`/cursos/${course.id}/aprender`}
              className="state-layer text-sm text-md-primary font-medium px-3 py-1.5 rounded-md-xl border border-md-primary/30 transition-colors"
            >
              Vista alumno
            </Link>
            <button
              onClick={deleteCourse}
              className="state-layer text-sm text-md-error font-medium px-3 py-1.5 rounded-md-xl transition-colors"
            >
              Eliminar
            </button>
            <button
              onClick={saveCourse}
              disabled={saving}
              className="state-layer px-5 py-2 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 disabled:opacity-50 transition-all"
            >
              {saved ? '✓ Guardado' : saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
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
            <label className="block text-xs font-medium text-md-on-surface-variant mb-1.5">Contenido (presentación del curso)</label>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={5}
              placeholder="Describe qué aprenderán los estudiantes, requisitos previos, etc."
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-md-on-surface-variant mb-1.5">Miniatura</label>
              {form.thumbnail && (
                <div className="relative mb-2 group w-fit">
                  <img
                    src={form.thumbnail}
                    alt="Miniatura del curso"
                    className="h-24 rounded-md-sm object-cover border border-md-outline-variant"
                  />
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, thumbnail: '' }))}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-md-error text-md-on-error rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    x
                  </button>
                </div>
              )}
              <label
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md-xl border border-md-outline-variant text-md-on-surface-variant cursor-pointer transition-colors hover:border-md-primary hover:text-md-primary ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setUploading(true)
                    try {
                      const fd = new FormData()
                      fd.append('file', file)
                      fd.append('bucket', 'thumbnails')
                      fd.append('folder', `courses/${course.id}`)
                      const res = await fetch('/api/upload', { method: 'POST', body: fd })
                      const data = await res.json()
                      if (data.url) {
                        setForm(f => ({ ...f, thumbnail: data.url }))
                      }
                    } finally {
                      setUploading(false)
                      e.target.value = ''
                    }
                  }}
                />
                {uploading ? 'Subiendo...' : form.thumbnail ? 'Cambiar imagen' : 'Subir imagen'}
              </label>
            </div>
            <div>
              <label className="block text-xs font-medium text-md-on-surface-variant mb-1.5">Estado</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className={inputClass}
              >
                <option value="borrador">Borrador</option>
                <option value="publicado">Publicado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-md-on-surface">
            Módulos <span className="text-md-on-surface-variant font-normal text-sm">({modules.length})</span>
          </h2>
          <button
            onClick={() => setShowNewModule(true)}
            className="state-layer text-sm px-4 py-2 border border-md-outline text-md-on-surface-variant rounded-md-xl font-medium transition-colors"
          >
            + Agregar módulo
          </button>
        </div>

        {showNewModule && (
          <div className="bg-md-surface-container-lowest rounded-md-md border border-md-primary/30 p-4 mb-4 shadow-md-1">
            <input
              type="text"
              value={newModuleTitle}
              onChange={e => setNewModuleTitle(e.target.value)}
              placeholder="Título del módulo"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') addModule() }}
              className={`${inputClass} mb-3`}
            />
            <div className="flex gap-2">
              <button
                onClick={addModule}
                disabled={addingModule}
                className="state-layer px-4 py-2 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 disabled:opacity-50 transition-all"
              >
                Crear módulo
              </button>
              <button
                onClick={() => { setShowNewModule(false); setNewModuleTitle('') }}
                className="state-layer px-4 py-2 text-sm text-md-on-surface-variant font-medium rounded-md-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {modules.length === 0 && !showNewModule && (
          <p className="text-sm text-md-on-surface-variant py-4">
            Este curso no tiene módulos. Agrega el primero.
          </p>
        )}

        <div className="space-y-4">
          {modules.map((mod, modIdx) => (
            <div key={mod.id} className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant shadow-md-1">
              {/* Module header */}
              {editingModuleId === mod.id ? (
                <div className="p-4 border-b border-md-outline-variant">
                  <input
                    type="text"
                    value={editModuleForm.title}
                    onChange={e => setEditModuleForm(f => ({ ...f, title: e.target.value }))}
                    className={`${inputClass} mb-2`}
                  />
                  <textarea
                    value={editModuleForm.description}
                    onChange={e => setEditModuleForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Descripción del módulo"
                    rows={2}
                    className={`${inputClass} resize-none mb-2`}
                  />
                  <textarea
                    value={editModuleForm.content}
                    onChange={e => setEditModuleForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Contenido del módulo (introducción, objetivos...)"
                    rows={3}
                    className={`${inputClass} resize-none mb-3`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveModule(mod.id)}
                      className="state-layer px-4 py-2 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 transition-all"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingModuleId(null)}
                      className="state-layer px-4 py-2 text-sm text-md-on-surface-variant font-medium rounded-md-xl transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-md-outline-variant">
                  <div>
                    <span className="text-xs text-md-on-surface-variant mr-2">Módulo {modIdx + 1}</span>
                    <span className="font-medium text-md-on-surface text-sm">{mod.title}</span>
                    {mod.description && (
                      <p className="text-xs text-md-on-surface-variant mt-0.5">{mod.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <button
                      onClick={() => startEditModule(mod)}
                      className="state-layer text-xs text-md-primary font-medium px-3 py-1.5 rounded-md-xl transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteModule(mod.id)}
                      className="state-layer text-xs text-md-error font-medium px-3 py-1.5 rounded-md-xl transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}

              {/* Topics */}
              <div className="p-4">
                {mod.topics.length === 0 && addingTopicToModule !== mod.id && (
                  <p className="text-xs text-md-on-surface-variant mb-3">Sin temas todavía.</p>
                )}

                <div className="space-y-1.5 mb-3">
                  {mod.topics.map((topic, topicIdx) => (
                    <div
                      key={topic.id}
                      className="state-layer flex items-center justify-between py-2 px-3 rounded-md-sm bg-md-surface-container hover:bg-md-surface-container-high group transition-colors"
                    >
                      <Link
                        href={`/cursos/${course.id}/modulos/${mod.id}/temas/${topic.id}`}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <span className="text-xs text-md-on-surface-variant shrink-0 font-mono">
                          {modIdx + 1}.{topicIdx + 1}
                        </span>
                        <span className="text-sm text-md-on-surface truncate">{topic.title}</span>
                        {topic.videoUrl && (
                          <span className="text-xs bg-md-primary-container text-md-on-primary-container px-2 py-0.5 rounded-md-sm shrink-0 font-medium">
                            ▶ video
                          </span>
                        )}
                        {topic.materials.length > 0 && (
                          <span className="text-xs text-md-on-surface-variant shrink-0">
                            {topic.materials.length} archivo{topic.materials.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={() => deleteTopic(mod.id, topic.id)}
                        className="ml-3 text-sm text-md-error opacity-0 group-hover:opacity-100 transition-opacity shrink-0 leading-none"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>

                {addingTopicToModule === mod.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTopicTitle}
                      onChange={e => setNewTopicTitle(e.target.value)}
                      placeholder="Título del tema"
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') addTopic(mod.id) }}
                      className="flex-1 border border-md-outline-variant rounded-md-sm px-4 py-2 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
                    />
                    <button
                      onClick={() => addTopic(mod.id)}
                      className="state-layer px-4 py-2 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 transition-all"
                    >
                      Crear
                    </button>
                    <button
                      onClick={() => { setAddingTopicToModule(null); setNewTopicTitle('') }}
                      className="text-md-on-surface-variant hover:text-md-on-surface text-lg leading-none"
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAddingTopicToModule(mod.id)
                      setNewTopicTitle('')
                    }}
                    className="state-layer text-xs text-md-primary font-medium px-3 py-1.5 rounded-md-xl transition-colors"
                  >
                    + Agregar tema
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
