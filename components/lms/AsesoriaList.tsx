'use client'

import { useState } from 'react'

type Task = {
  id: number
  description: string
  completed: boolean
  completedAt: string | null
}

type Asesoria = {
  id: number
  userId: number
  user: { id: number; name: string; email: string }
  date: string
  startTime: string
  endTime: string
  duration: number
  recordingUrl: string | null
  summary: string | null
  fullSummary: string | null
  tasks: Task[]
}

interface AsesoriaListProps {
  initialAsesorias: Asesoria[]
  isAdmin: boolean
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export default function AsesoriaList({ initialAsesorias, isAdmin }: AsesoriaListProps) {
  const [asesorias] = useState(initialAsesorias)
  const [selected, setSelected] = useState<Asesoria | null>(null)

  if (selected) {
    const completedTasks = selected.tasks.filter(t => t.completed).length
    return (
      <div className="max-w-4xl mx-auto p-8">
        {/* Back button */}
        <button
          onClick={() => setSelected(null)}
          className="state-layer flex items-center gap-2 text-sm text-md-primary font-medium mb-6 px-3 py-1.5 rounded-md-xl transition-colors"
        >
          <span>←</span> Volver a asesorías
        </button>

        <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant shadow-md-1 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-md-outline-variant">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-md-on-surface-variant font-medium uppercase tracking-wider mb-1">
                  {formatDate(selected.date)}
                </p>
                <h2 className="text-xl font-medium text-md-on-surface">
                  Asesoría con {selected.user.name}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-md-secondary-container text-md-on-secondary-container px-3 py-1 rounded-md-sm font-medium">
                  {selected.startTime} – {selected.endTime}
                </span>
                <span className="text-xs bg-md-tertiary-container text-md-on-tertiary-container px-3 py-1 rounded-md-sm font-medium">
                  {formatDuration(selected.duration)}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-6">
            {/* Recording link */}
            {selected.recordingUrl && (
              <div>
                <p className="text-xs font-medium text-md-on-surface-variant mb-1.5">Grabación</p>
                <a
                  href={selected.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-md-primary font-medium hover:underline"
                >
                  Ver grabación →
                </a>
              </div>
            )}

            {/* Summary */}
            {selected.summary && (
              <div>
                <p className="text-xs font-medium text-md-on-surface-variant mb-1.5">Resumen</p>
                <p className="text-sm text-md-on-surface whitespace-pre-wrap leading-relaxed">{selected.summary}</p>
              </div>
            )}

            {/* Full Summary */}
            {selected.fullSummary && (
              <div>
                <p className="text-xs font-medium text-md-on-surface-variant mb-1.5">Resumen completo</p>
                <p className="text-sm text-md-on-surface whitespace-pre-wrap leading-relaxed">{selected.fullSummary}</p>
              </div>
            )}

            {/* Tasks */}
            {selected.tasks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-md-on-surface-variant">Tareas</p>
                  <span className="text-xs text-md-on-surface-variant">
                    {completedTasks}/{selected.tasks.length} completada{selected.tasks.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {selected.tasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-start gap-3 p-3 rounded-md-sm ${
                        task.completed
                          ? 'bg-md-primary-container/40'
                          : 'bg-md-surface-container'
                      }`}
                    >
                      <span className={`mt-0.5 text-sm ${task.completed ? 'text-md-primary' : 'text-md-outline'}`}>
                        {task.completed ? '✓' : '○'}
                      </span>
                      <span className={`text-sm ${
                        task.completed
                          ? 'text-md-on-surface-variant line-through'
                          : 'text-md-on-surface'
                      }`}>
                        {task.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state if no content */}
            {!selected.summary && !selected.fullSummary && selected.tasks.length === 0 && !selected.recordingUrl && (
              <p className="text-sm text-md-outline text-center py-8">Sin información adicional registrada</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-md-on-surface">Asesorías</h1>
        <p className="text-sm text-md-on-surface-variant mt-0.5">
          {isAdmin ? 'Todas las sesiones de asesoría' : 'Tus sesiones de asesoría'}
        </p>
      </div>

      {asesorias.length === 0 ? (
        <div className="text-center py-20 text-md-on-surface-variant">
          <p className="text-5xl mb-4">💬</p>
          <p className="font-medium text-md-on-surface text-lg">No hay asesorías registradas</p>
          <p className="text-sm mt-1">Las asesorías aparecerán aquí cuando se registren</p>
        </div>
      ) : (
        <div className="space-y-3">
          {asesorias.map(a => {
            const completedTasks = a.tasks.filter(t => t.completed).length
            return (
              <div
                key={a.id}
                onClick={() => setSelected(a)}
                className="state-layer bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant shadow-md-1 px-5 py-4 cursor-pointer transition-shadow hover:shadow-md-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-md-primary-container flex items-center justify-center text-sm font-medium text-md-on-primary-container">
                      {a.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-md-on-surface">{formatDate(a.date)}</p>
                      <p className="text-xs text-md-on-surface-variant mt-0.5">
                        {isAdmin && <span>{a.user.name} · </span>}
                        {a.startTime} – {a.endTime} · {formatDuration(a.duration)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.tasks.length > 0 && (
                      <span className="text-xs bg-md-surface-container-high text-md-on-surface-variant rounded-md-sm px-2.5 py-1 font-medium">
                        {completedTasks}/{a.tasks.length} tarea{a.tasks.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {a.recordingUrl && (
                      <span className="text-xs bg-md-tertiary-container text-md-on-tertiary-container rounded-md-sm px-2.5 py-1 font-medium">
                        Grabación
                      </span>
                    )}
                    <span className="text-md-on-surface-variant text-xs">→</span>
                  </div>
                </div>
                {a.summary && (
                  <p className="text-xs text-md-on-surface-variant mt-2 line-clamp-2 ml-14">{a.summary}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
