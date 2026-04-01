'use client'

import { useState, useEffect } from 'react'

type UserBasic = { id: number; name: string; email: string }
type GroupMember = { userId: number; user: UserBasic; joinedAt: string }
type Group = {
  id: number
  name: string
  leaderId: number
  leader: UserBasic
  members: GroupMember[]
  createdAt: string
}

type CourseProgress = {
  courseId: number
  courseTitle: string
  totalTopics: number
  completedTopics: number
  progressPercent: number
}

type MemberProgress = {
  userId: number
  userName: string
  userEmail: string
  courses: CourseProgress[]
}

interface GroupManagerProps {
  initialGroups: Group[]
  allUsers: UserBasic[]
}

export default function GroupManager({ initialGroups, allUsers }: GroupManagerProps) {
  const [groups, setGroups] = useState(initialGroups)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', leaderId: 0 })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null)
  const [editingGroup, setEditingGroup] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ name: '', leaderId: 0 })
  const [progressData, setProgressData] = useState<Record<number, MemberProgress[]>>({})
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null)

  async function reload() {
    const res = await fetch('/api/groups')
    if (res.ok) setGroups(await res.json())
  }

  async function loadProgress(groupId: number) {
    if (progressData[groupId]) return
    setLoadingProgress(groupId)
    const res = await fetch(`/api/groups/${groupId}/progress`)
    if (res.ok) {
      const data = await res.json()
      setProgressData(prev => ({ ...prev, [groupId]: data }))
    }
    setLoadingProgress(null)
  }

  async function createGroup() {
    if (!form.name.trim() || !form.leaderId) return
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al crear grupo')
        return
      }
      setForm({ name: '', leaderId: 0 })
      setShowForm(false)
      await reload()
    } finally {
      setCreating(false)
    }
  }

  async function updateGroup(id: number) {
    const res = await fetch(`/api/groups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    if (res.ok) {
      setEditingGroup(null)
      await reload()
    }
  }

  async function deleteGroup(id: number) {
    if (!confirm('Eliminar este grupo?')) return
    await fetch(`/api/groups/${id}`, { method: 'DELETE' })
    setProgressData(prev => { const n = { ...prev }; delete n[id]; return n })
    await reload()
  }

  async function addMember(groupId: number, userId: number) {
    await fetch(`/api/groups/${groupId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    setProgressData(prev => { const n = { ...prev }; delete n[groupId]; return n })
    await reload()
  }

  async function removeMember(groupId: number, userId: number) {
    await fetch(`/api/groups/${groupId}/members/${userId}`, { method: 'DELETE' })
    setProgressData(prev => { const n = { ...prev }; delete n[groupId]; return n })
    await reload()
  }

  function toggleExpand(groupId: number) {
    if (expandedGroup === groupId) {
      setExpandedGroup(null)
    } else {
      setExpandedGroup(groupId)
      loadProgress(groupId)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-md-on-surface">Grupos</h1>
          <p className="text-sm text-md-on-surface-variant mt-0.5">Organiza usuarios en grupos con un líder que supervisa el progreso</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="state-layer px-5 py-2.5 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 transition-all"
        >
          + Nuevo grupo
        </button>
      </div>

      {showForm && (
        <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant p-6 mb-8 shadow-md-1">
          <h2 className="font-medium text-md-on-surface mb-4">Nuevo grupo</h2>
          {error && <p className="text-sm text-md-error mb-3 font-medium">{error}</p>}
          <div className="space-y-3">
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nombre del grupo"
              autoFocus
              className="w-full border border-md-outline-variant rounded-md-sm px-4 py-2.5 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
            />
            <select
              value={form.leaderId}
              onChange={e => setForm(f => ({ ...f, leaderId: parseInt(e.target.value) }))}
              className="w-full border border-md-outline-variant rounded-md-sm px-4 py-2.5 text-sm bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
            >
              <option value={0}>Seleccionar líder</option>
              {allUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={createGroup}
                disabled={creating}
                className="state-layer px-5 py-2.5 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 disabled:opacity-50 transition-all"
              >
                {creating ? 'Creando...' : 'Crear grupo'}
              </button>
              <button
                onClick={() => { setShowForm(false); setForm({ name: '', leaderId: 0 }); setError('') }}
                className="state-layer px-5 py-2.5 text-sm text-md-on-surface-variant font-medium rounded-md-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {groups.length === 0 && !showForm ? (
        <div className="text-center py-20 text-md-on-surface-variant">
          <p className="text-5xl mb-4">👥</p>
          <p className="font-medium text-md-on-surface text-lg">No hay grupos todavía</p>
          <p className="text-sm mt-1">Crea un grupo para organizar usuarios y rastrear su progreso</p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(group => {
            const isExpanded = expandedGroup === group.id
            const isEditing = editingGroup === group.id
            const memberIds = new Set(group.members.map(m => m.userId))
            memberIds.add(group.leaderId) // leader shouldn't be added as member
            const availableUsers = allUsers.filter(u => !memberIds.has(u.id))
            const progress = progressData[group.id]

            return (
              <div key={group.id} className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant overflow-hidden shadow-md-1">
                <div
                  className="state-layer flex items-center justify-between px-5 py-4 cursor-pointer"
                  onClick={() => toggleExpand(group.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-md-tertiary-container flex items-center justify-center text-sm font-medium text-md-on-tertiary-container">
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-md-on-surface">{group.name}</p>
                      <p className="text-xs text-md-on-surface-variant">Líder: {group.leader.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-md-on-surface-variant bg-md-surface-container-high rounded-md-sm px-2.5 py-1 font-medium">
                      {group.members.length} miembro{group.members.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-md-on-surface-variant text-xs">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-md-outline-variant px-5 py-4 space-y-5">
                    {/* Edit / Delete group */}
                    {isEditing ? (
                      <div className="flex gap-2 items-end flex-wrap">
                        <input
                          value={editForm.name}
                          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Nombre"
                          className="border border-md-outline-variant rounded-md-sm px-4 py-2 text-sm flex-1 bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
                        />
                        <select
                          value={editForm.leaderId}
                          onChange={e => setEditForm(f => ({ ...f, leaderId: parseInt(e.target.value) }))}
                          className="border border-md-outline-variant rounded-md-sm px-4 py-2 text-sm flex-1 bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20 transition-colors"
                        >
                          {allUsers.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => updateGroup(group.id)}
                          className="state-layer px-4 py-2 bg-md-primary text-md-on-primary text-sm rounded-md-xl font-medium shadow-md-1 hover:shadow-md-2 transition-all"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingGroup(null)}
                          className="state-layer px-4 py-2 text-sm text-md-on-surface-variant font-medium rounded-md-xl transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingGroup(group.id); setEditForm({ name: group.name, leaderId: group.leaderId }) }}
                          className="state-layer text-xs text-md-primary font-medium px-3 py-1.5 rounded-md-xl transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteGroup(group.id)}
                          className="state-layer text-xs text-md-error font-medium px-3 py-1.5 rounded-md-xl transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}

                    {/* Members list */}
                    <div>
                      <p className="text-xs font-medium text-md-on-surface-variant mb-2">Miembros del grupo</p>
                      {group.members.length === 0 ? (
                        <p className="text-xs text-md-outline">Sin miembros todavía</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {group.members.map(m => (
                            <span
                              key={m.userId}
                              className="inline-flex items-center gap-1.5 bg-md-secondary-container text-md-on-secondary-container rounded-md-sm px-3 py-1.5 text-xs font-medium"
                            >
                              {m.user.name}
                              <button
                                onClick={() => removeMember(group.id, m.userId)}
                                className="text-md-on-secondary-container/60 hover:text-md-error font-bold"
                                title="Quitar del grupo"
                              >
                                x
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add member */}
                    {availableUsers.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-md-on-surface-variant mb-2">Agregar miembro</p>
                        <div className="flex flex-wrap gap-2">
                          {availableUsers.map(u => (
                            <button
                              key={u.id}
                              onClick={() => addMember(group.id, u.id)}
                              className="state-layer inline-flex items-center gap-1 border border-dashed border-md-outline rounded-md-sm px-3 py-1.5 text-xs text-md-on-surface-variant font-medium transition-colors"
                            >
                              + {u.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Course progress per member */}
                    <div>
                      <p className="text-xs font-medium text-md-on-surface-variant mb-3">Progreso de cursos</p>
                      {loadingProgress === group.id ? (
                        <p className="text-xs text-md-outline">Cargando progreso...</p>
                      ) : !progress || progress.length === 0 ? (
                        <p className="text-xs text-md-outline">
                          {group.members.length === 0 ? 'Agrega miembros para ver su progreso' : 'Los miembros no tienen cursos asignados'}
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {progress.map(mp => (
                            <div key={mp.userId} className="bg-md-surface-container rounded-md-sm p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-full bg-md-primary-container flex items-center justify-center text-xs font-medium text-md-on-primary-container">
                                  {mp.userName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-md-on-surface">{mp.userName}</p>
                                  <p className="text-xs text-md-on-surface-variant">{mp.userEmail}</p>
                                </div>
                              </div>
                              {mp.courses.length === 0 ? (
                                <p className="text-xs text-md-outline ml-9">Sin cursos asignados</p>
                              ) : (
                                <div className="space-y-2 ml-9">
                                  {mp.courses.map(c => (
                                    <div key={c.courseId}>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-md-on-surface">{c.courseTitle}</span>
                                        <span className="text-xs text-md-on-surface-variant">
                                          {c.completedTopics}/{c.totalTopics} temas — {c.progressPercent}%
                                        </span>
                                      </div>
                                      <div className="w-full bg-md-surface-container-highest rounded-full h-2">
                                        <div
                                          className="h-2 rounded-full transition-all duration-300"
                                          style={{
                                            width: `${c.progressPercent}%`,
                                            backgroundColor: c.progressPercent === 100
                                              ? 'var(--md-tertiary)'
                                              : c.progressPercent > 0
                                                ? 'var(--md-primary)'
                                                : 'transparent',
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
