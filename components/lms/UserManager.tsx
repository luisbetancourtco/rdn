'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

type CourseInfo = { id: number; title: string; status: string }
type User = {
  id: number
  email: string
  name: string
  createdAt: string
  access: { course: CourseInfo; grantedAt: string }[]
  _count?: { asesorias: number }
}

type TopicProgress = { id: number; title: string; completed: boolean }
type ModuleProgress = { id: number; title: string; topics: TopicProgress[] }
type CourseProgress = {
  id: number
  title: string
  totalTopics: number
  completedTopics: number
  percent: number
  modules: ModuleProgress[]
}

const PAGE_SIZE = 10

interface UserManagerProps {
  initialUsers: User[]
  allCourses: CourseInfo[]
}

export default function UserManager({ initialUsers, allCourses }: UserManagerProps) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [expandedUser, setExpandedUser] = useState<number | null>(null)
  const [editingUser, setEditingUser] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [progressMap, setProgressMap] = useState<Record<number, CourseProgress[]>>({})
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [impersonating, setImpersonating] = useState<number | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [users, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  async function reload() {
    const res = await fetch('/api/users')
    if (res.ok) setUsers(await res.json())
  }

  async function loadProgress(userId: number) {
    if (progressMap[userId]) return
    setLoadingProgress(userId)
    const res = await fetch(`/api/users/${userId}/progress`)
    if (res.ok) {
      const data: CourseProgress[] = await res.json()
      setProgressMap(prev => ({ ...prev, [userId]: data }))
    }
    setLoadingProgress(null)
  }

  async function createUser() {
    if (!form.name.trim() || !form.email.trim()) return
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al crear usuario')
        return
      }
      setForm({ name: '', email: '' })
      setShowForm(false)
      await reload()
    } finally {
      setCreating(false)
    }
  }

  async function updateUser(id: number) {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    if (res.ok) {
      setEditingUser(null)
      await reload()
    }
  }

  async function deleteUser(id: number) {
    if (!confirm('Eliminar este usuario y todos sus accesos?')) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    await reload()
  }

  async function grantAccess(userId: number, courseId: number) {
    await fetch(`/api/users/${userId}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    })
    await reload()
  }

  async function revokeAccess(userId: number, courseId: number) {
    await fetch(`/api/users/${userId}/courses/${courseId}`, { method: 'DELETE' })
    await reload()
  }

  async function impersonate(userId: number) {
    setImpersonating(userId)
    const res = await fetch('/api/auth/select-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    if (res.ok) {
      router.push('/diagnostico')
      router.refresh()
    }
    setImpersonating(null)
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-md-on-surface">Usuarios</h1>
          <p className="text-sm text-md-on-surface-variant mt-0.5">Administra usuarios y su acceso a cursos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="state-layer px-5 py-2.5 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 transition-all"
        >
          + Nuevo usuario
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0) }}
          placeholder="Buscar por nombre o email..."
          className="w-full border border-md-outline-variant rounded-md-xl px-4 py-2.5 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
        />
      </div>

      {showForm && (
        <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant p-6 mb-8 shadow-md-1">
          <h2 className="font-medium text-md-on-surface mb-4">Nuevo usuario</h2>
          {error && <p className="text-sm text-md-error mb-3 font-medium">{error}</p>}
          <div className="space-y-3">
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nombre"
              autoFocus
              className="w-full border border-md-outline-variant rounded-md-sm px-4 py-2.5 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
            />
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="Email"
              onKeyDown={e => { if (e.key === 'Enter') createUser() }}
              className="w-full border border-md-outline-variant rounded-md-sm px-4 py-2.5 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={createUser}
                disabled={creating}
                className="state-layer px-5 py-2.5 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 disabled:opacity-50 transition-all"
              >
                {creating ? 'Creando...' : 'Crear usuario'}
              </button>
              <button
                onClick={() => { setShowForm(false); setForm({ name: '', email: '' }); setError('') }}
                className="state-layer px-5 py-2.5 text-sm text-md-on-surface-variant font-medium rounded-md-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 && !showForm ? (
        <div className="text-center py-20 text-md-on-surface-variant">
          <p className="text-5xl mb-4">👥</p>
          {search ? (
            <>
              <p className="font-medium text-md-on-surface text-lg">Sin resultados</p>
              <p className="text-sm mt-1">No se encontraron usuarios para "{search}"</p>
            </>
          ) : (
            <>
              <p className="font-medium text-md-on-surface text-lg">No hay usuarios todavía</p>
              <p className="text-sm mt-1">Crea tu primer usuario para asignarle cursos</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginated.map(user => {
              const isExpanded = expandedUser === user.id
              const isEditing = editingUser === user.id
              const assignedIds = new Set(user.access.map(a => a.course.id))
              const availableCourses = allCourses.filter(c => !assignedIds.has(c.id))

              return (
                <div key={user.id} className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant overflow-hidden shadow-md-1">
                  <div
                    className="state-layer flex items-center justify-between px-5 py-4 cursor-pointer"
                    onClick={() => { setExpandedUser(isExpanded ? null : user.id); if (!isExpanded) loadProgress(user.id) }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-md-primary-container flex items-center justify-center text-sm font-medium text-md-on-primary-container">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-md-on-surface">{user.name}</p>
                        <p className="text-xs text-md-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-md-on-surface-variant bg-md-surface-container-high rounded-md-sm px-2.5 py-1 font-medium">
                        {user.access.length} curso{user.access.length !== 1 ? 's' : ''}
                      </span>
                      {(user._count?.asesorias ?? 0) > 0 && (
                        <span className="text-xs text-md-on-surface-variant bg-md-tertiary-container text-md-on-tertiary-container rounded-md-sm px-2.5 py-1 font-medium">
                          {user._count!.asesorias} asesoría{user._count!.asesorias !== 1 ? 's' : ''}
                        </span>
                      )}
                      <span className="text-md-on-surface-variant text-xs">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-md-outline-variant px-5 py-4 space-y-4">
                      {/* Edit user + impersonate */}
                      {isEditing ? (
                        <div className="flex gap-2 items-end">
                          <input
                            value={editForm.name}
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="Nombre"
                            className="border border-md-outline-variant rounded-md-sm px-4 py-2 text-sm flex-1 bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
                          />
                          <input
                            value={editForm.email}
                            onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="Email"
                            className="border border-md-outline-variant rounded-md-sm px-4 py-2 text-sm flex-1 bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
                          />
                          <button
                            onClick={() => updateUser(user.id)}
                            className="state-layer px-4 py-2 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 transition-all"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="state-layer px-4 py-2 text-sm text-md-on-surface-variant font-medium rounded-md-xl transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingUser(user.id); setEditForm({ name: user.name, email: user.email }) }}
                            className="state-layer text-xs text-md-primary font-medium px-3 py-1.5 rounded-md-xl transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteUser(user.id) }}
                            className="state-layer text-xs text-md-error font-medium px-3 py-1.5 rounded-md-xl transition-colors"
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); impersonate(user.id) }}
                            disabled={impersonating === user.id}
                            className="state-layer text-xs text-md-tertiary font-medium px-3 py-1.5 rounded-md-xl border border-md-tertiary transition-colors disabled:opacity-50"
                          >
                            {impersonating === user.id ? 'Ingresando...' : 'Ingresar como este usuario'}
                          </button>
                        </div>
                      )}

                      {/* Assigned courses */}
                      <div>
                        <p className="text-xs font-medium text-md-on-surface-variant mb-2">Cursos asignados</p>
                        {user.access.length === 0 ? (
                          <p className="text-xs text-md-outline">Sin cursos asignados</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {user.access.map(a => (
                              <span
                                key={a.course.id}
                                className="inline-flex items-center gap-1.5 bg-md-secondary-container text-md-on-secondary-container rounded-md-sm px-3 py-1.5 text-xs font-medium"
                              >
                                {a.course.title}
                                <button
                                  onClick={() => revokeAccess(user.id, a.course.id)}
                                  className="text-md-on-secondary-container/60 hover:text-md-error font-bold"
                                  title="Quitar acceso"
                                >
                                  x
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Grant access */}
                      {availableCourses.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-md-on-surface-variant mb-2">Agregar acceso</p>
                          <div className="flex flex-wrap gap-2">
                            {availableCourses.map(course => (
                              <button
                                key={course.id}
                                onClick={() => grantAccess(user.id, course.id)}
                                className="state-layer inline-flex items-center gap-1 border border-dashed border-md-outline rounded-md-sm px-3 py-1.5 text-xs text-md-on-surface-variant font-medium transition-colors"
                              >
                                + {course.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Course progress */}
                      {user.access.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-md-on-surface-variant mb-3">Progreso por curso</p>
                          {loadingProgress === user.id ? (
                            <p className="text-xs text-md-outline">Cargando progreso...</p>
                          ) : progressMap[user.id] ? (
                            <div className="space-y-3">
                              {progressMap[user.id].map(course => (
                                <div key={course.id} className="bg-md-surface-container rounded-md-sm p-3">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <p className="text-sm font-medium text-md-on-surface">{course.title}</p>
                                    <span className="text-xs text-md-on-surface-variant font-medium">
                                      {course.completedTopics}/{course.totalTopics} temas — {course.percent}%
                                    </span>
                                  </div>
                                  <div className="w-full h-2 bg-md-surface-container-highest rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-md-primary rounded-full transition-all"
                                      style={{ width: `${course.percent}%` }}
                                    />
                                  </div>
                                  {course.modules.length > 0 && (
                                    <div className="mt-2 space-y-1.5">
                                      {course.modules.map(mod => {
                                        const modCompleted = mod.topics.filter(t => t.completed).length
                                        return (
                                          <div key={mod.id}>
                                            <p className="text-xs text-md-on-surface-variant font-medium">
                                              {mod.title} ({modCompleted}/{mod.topics.length})
                                            </p>
                                            <div className="flex flex-wrap gap-1 mt-0.5">
                                              {mod.topics.map(topic => (
                                                <span
                                                  key={topic.id}
                                                  className={`text-[11px] px-2 py-0.5 rounded-md-sm ${
                                                    topic.completed
                                                      ? 'bg-md-primary-container text-md-on-primary-container'
                                                      : 'bg-md-surface-container-highest text-md-on-surface-variant'
                                                  }`}
                                                  title={topic.title}
                                                >
                                                  {topic.title}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-md-on-surface-variant">
                {filtered.length} usuario{filtered.length !== 1 ? 's' : ''}
                {search && ` encontrado${filtered.length !== 1 ? 's' : ''}`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 0}
                  className="state-layer px-3 py-1.5 text-xs font-medium text-md-on-surface-variant rounded-md-xl border border-md-outline-variant disabled:opacity-30 transition-colors"
                >
                  Anterior
                </button>
                <span className="text-xs text-md-on-surface-variant font-medium">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="state-layer px-3 py-1.5 text-xs font-medium text-md-on-surface-variant rounded-md-xl border border-md-outline-variant disabled:opacity-30 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
