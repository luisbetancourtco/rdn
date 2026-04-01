'use client'

import { useState } from 'react'

type TaskItem = {
  id: number
  asesoriaId: number
  description: string
  completed: boolean
  completedAt: string | null
  asesoria: {
    id: number
    date: string
    user: { id: number; name: string }
  }
}

interface TareasListProps {
  initialTasks: TaskItem[]
  isAdmin: boolean
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function TareasList({ initialTasks, isAdmin }: TareasListProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [tab, setTab] = useState<'pendientes' | 'completadas'>('pendientes')
  const [toggling, setToggling] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  const pending = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)
  const current = tab === 'pendientes' ? pending : completed

  async function toggle(task: TaskItem) {
    setToggling(task.id)
    const newCompleted = !task.completed
    const res = await fetch(`/api/asesorias/${task.asesoriaId}/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: newCompleted }),
    })
    if (res.ok) {
      setTasks(prev => prev.map(t => t.id === task.id
        ? { ...t, completed: newCompleted, completedAt: newCompleted ? new Date().toISOString() : null }
        : t
      ))
    }
    setToggling(null)
  }

  async function saveEdit(task: TaskItem) {
    if (!editText.trim() || editText.trim() === task.description) {
      setEditingId(null)
      return
    }
    const res = await fetch(`/api/asesorias/${task.asesoriaId}/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: editText.trim() }),
    })
    if (res.ok) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, description: editText.trim() } : t))
    }
    setEditingId(null)
  }

  async function deleteTask(task: TaskItem) {
    if (!confirm('¿Eliminar esta tarea?')) return
    const res = await fetch(`/api/asesorias/${task.asesoriaId}/tasks/${task.id}`, { method: 'DELETE' })
    if (res.ok) {
      setTasks(prev => prev.filter(t => t.id !== task.id))
    }
  }

  // Group by asesoria date
  const grouped: { date: string; userName: string; tasks: TaskItem[] }[] = []
  const seen = new Map<number, number>()
  for (const t of current) {
    const idx = seen.get(t.asesoriaId)
    if (idx !== undefined) {
      grouped[idx].tasks.push(t)
    } else {
      seen.set(t.asesoriaId, grouped.length)
      grouped.push({ date: t.asesoria.date, userName: t.asesoria.user.name, tasks: [t] })
    }
  }
  grouped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-md-on-surface">Tareas</h1>
        <p className="text-sm text-md-on-surface-variant mt-0.5">
          Tareas asignadas en las sesiones de asesoría
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-md-surface-container rounded-md-xl p-1">
        <button
          onClick={() => setTab('pendientes')}
          className={`flex-1 text-sm font-medium py-2 px-4 rounded-md-xl transition-all ${
            tab === 'pendientes'
              ? 'bg-md-surface-container-lowest text-md-on-surface shadow-md-1'
              : 'text-md-on-surface-variant hover:text-md-on-surface'
          }`}
        >
          Pendientes
          <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
            tab === 'pendientes' ? 'bg-md-primary-container text-md-on-primary-container' : 'bg-md-surface-container-high'
          }`}>
            {pending.length}
          </span>
        </button>
        <button
          onClick={() => setTab('completadas')}
          className={`flex-1 text-sm font-medium py-2 px-4 rounded-md-xl transition-all ${
            tab === 'completadas'
              ? 'bg-md-surface-container-lowest text-md-on-surface shadow-md-1'
              : 'text-md-on-surface-variant hover:text-md-on-surface'
          }`}
        >
          Completadas
          <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
            tab === 'completadas' ? 'bg-md-primary-container text-md-on-primary-container' : 'bg-md-surface-container-high'
          }`}>
            {completed.length}
          </span>
        </button>
      </div>

      {current.length === 0 ? (
        <div className="text-center py-20 text-md-on-surface-variant">
          <p className="text-5xl mb-4">{tab === 'pendientes' ? '🎉' : '📋'}</p>
          <p className="font-medium text-md-on-surface text-lg">
            {tab === 'pendientes' ? 'No hay tareas pendientes' : 'No hay tareas completadas'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.date}>
              <p className="text-xs font-medium text-md-on-surface-variant uppercase tracking-wider mb-2">
                {formatDate(group.date)}{isAdmin ? ` · ${group.userName}` : ''}
              </p>
              <div className="space-y-2">
                {group.tasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-md-sm transition-colors group ${
                      task.completed
                        ? 'bg-md-primary-container/40'
                        : 'bg-md-surface-container-lowest border border-md-outline-variant'
                    }`}
                  >
                    <button
                      onClick={() => toggle(task)}
                      disabled={toggling === task.id}
                      className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        task.completed
                          ? 'bg-md-primary border-md-primary text-md-on-primary'
                          : 'border-md-outline hover:border-md-primary'
                      } ${toggling === task.id ? 'opacity-50' : ''}`}
                    >
                      {task.completed && <span className="text-xs">✓</span>}
                    </button>
                    {editingId === task.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') saveEdit(task); if (e.key === 'Escape') setEditingId(null) }}
                          autoFocus
                          className="flex-1 text-sm border border-md-outline-variant rounded-md-sm px-3 py-1.5 bg-transparent text-md-on-surface focus:outline-none focus:border-md-primary focus:ring-2 focus:ring-md-primary/20"
                        />
                        <button onClick={() => saveEdit(task)} className="state-layer text-xs text-md-primary font-medium px-3 py-1.5 rounded-md-xl">Guardar</button>
                        <button onClick={() => setEditingId(null)} className="state-layer text-xs text-md-on-surface-variant font-medium px-3 py-1.5 rounded-md-xl">Cancelar</button>
                      </div>
                    ) : (
                      <>
                        <span className={`flex-1 text-sm ${
                          task.completed ? 'text-md-on-surface-variant line-through' : 'text-md-on-surface'
                        }`}>
                          {task.description}
                        </span>
                        {isAdmin && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditingId(task.id); setEditText(task.description) }}
                              className="state-layer text-xs text-md-primary font-medium px-2 py-1 rounded-md-xl"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deleteTask(task)}
                              className="state-layer text-xs text-md-error font-medium px-2 py-1 rounded-md-xl"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
