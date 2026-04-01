'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Course = {
  id: number
  title: string
  description: string | null
  thumbnail: string | null
  status: string
  order: number
  _count: { modules: number }
}

interface CourseManagerProps {
  initialCourses: Course[]
}

export default function CourseManager({ initialCourses }: CourseManagerProps) {
  const router = useRouter()
  const [courses, setCourses] = useState(initialCourses)
  const [reordering, setReordering] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '' })
  const [creating, setCreating] = useState(false)

  async function moveCourse(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= courses.length) return
    const updated = [...courses]
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    setCourses(updated)
    setReordering(true)
    try {
      await fetch('/api/courses/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: updated.map(c => c.id) }),
      })
    } finally {
      setReordering(false)
    }
  }

  async function createCourse() {
    if (!form.title.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const course = await res.json()
      router.push(`/cursos/${course.id}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-md-on-surface">Cursos</h1>
          <p className="text-sm text-md-on-surface-variant mt-0.5">Gestiona tus cursos y su contenido</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="state-layer px-5 py-2.5 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 transition-all"
        >
          + Nuevo curso
        </button>
      </div>

      {showForm && (
        <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant p-6 mb-8 shadow-md-1">
          <h2 className="font-medium text-md-on-surface mb-4">Nuevo curso</h2>
          <div className="space-y-3">
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Título del curso"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') createCourse() }}
              className="w-full border border-md-outline-variant rounded-md-sm px-4 py-2.5 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
            />
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Descripción corta (opcional)"
              rows={2}
              className="w-full border border-md-outline-variant rounded-md-sm px-4 py-2.5 text-sm resize-none bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={createCourse}
                disabled={creating}
                className="state-layer px-5 py-2.5 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 disabled:opacity-50 transition-all"
              >
                {creating ? 'Creando...' : 'Crear curso'}
              </button>
              <button
                onClick={() => { setShowForm(false); setForm({ title: '', description: '' }) }}
                className="state-layer px-5 py-2.5 text-sm text-md-on-surface-variant font-medium rounded-md-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {courses.length === 0 && !showForm ? (
        <div className="text-center py-20 text-md-on-surface-variant">
          <p className="text-5xl mb-4">🎓</p>
          <p className="font-medium text-md-on-surface text-lg">No hay cursos todavía</p>
          <p className="text-sm mt-1">Crea tu primer curso para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course, index) => (
            <div key={course.id} className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant hover:shadow-md-2 transition-all overflow-hidden flex flex-col">
              {course.thumbnail ? (
                <div className="w-full aspect-[300/180] overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[300/180] bg-md-surface-container flex items-center justify-center">
                  <span className="text-5xl">🎓</span>
                </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-xs px-2.5 py-0.5 rounded-md-sm font-medium ${
                    course.status === 'publicado'
                      ? 'bg-md-success-container text-md-on-success-container'
                      : 'bg-md-surface-container-high text-md-on-surface-variant'
                  }`}>
                    {course.status === 'publicado' ? 'Publicado' : 'Borrador'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveCourse(index, 'up')}
                      disabled={index === 0 || reordering}
                      className="p-0.5 text-xs text-md-on-surface-variant hover:text-md-on-surface disabled:opacity-20 transition-colors"
                      title="Mover arriba"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveCourse(index, 'down')}
                      disabled={index === courses.length - 1 || reordering}
                      className="p-0.5 text-xs text-md-on-surface-variant hover:text-md-on-surface disabled:opacity-20 transition-colors"
                      title="Mover abajo"
                    >
                      ▼
                    </button>
                  </div>
                </div>
                <Link href={`/cursos/${course.id}`} className="group">
                  <h3 className="font-medium text-md-on-surface text-sm leading-snug group-hover:text-md-primary transition-colors mb-1">{course.title}</h3>
                </Link>
                {course.description && (
                  <p className="text-xs text-md-on-surface-variant mb-2 line-clamp-2">{course.description}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-md-outline-variant">
                  <p className="text-xs text-md-outline">
                    {course._count.modules} módulo{course._count.modules !== 1 ? 's' : ''}
                  </p>
                  <Link
                    href={`/cursos/${course.id}/aprender`}
                    className="state-layer text-xs px-3 py-1 bg-md-primary text-md-on-primary rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 transition-all"
                  >
                    Comenzar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
