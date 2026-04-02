'use client'

import Link from 'next/link'

type CourseProgress = {
  id: number
  title: string
  thumbnail: string | null
  totalTopics: number
  completedTopics: number
}

type AsesoriaPreview = {
  id: number
  date: Date
  summary: string | null
  startTime: string
  endTime: string
}

type PendingTask = {
  id: number
  description: string
  asesoria: { date: Date }
}

export default function StudentDashboard({
  userName,
  coursesWithProgress,
  totalTopics,
  completedTopics,
  asesorias,
  pendingTasks,
}: {
  userName: string
  coursesWithProgress: CourseProgress[]
  totalTopics: number
  completedTopics: number
  asesorias: AsesoriaPreview[]
  pendingTasks: PendingTask[]
}) {
  const overallPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
  const firstName = userName.split(' ')[0]

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-md-on-surface">Hola, {firstName}</h1>
        <p className="text-sm text-md-on-surface-variant mt-1">Aquí tienes un resumen de tu progreso.</p>
      </div>

      {/* Overall progress */}
      <div className="bg-md-primary-container rounded-md-xl p-6 shadow-md-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-md-on-primary-container">Progreso general</p>
          <p className="text-2xl font-bold text-md-on-primary-container">{overallPercent}%</p>
        </div>
        <div className="w-full h-3 bg-md-on-primary-container/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-md-on-primary-container rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <p className="text-xs text-md-on-primary-container/70 mt-2">
          {completedTopics} de {totalTopics} temas completados
        </p>
      </div>

      {/* Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-md-on-surface">Mis cursos</h2>
          <Link href="/cursos" className="text-sm text-md-primary hover:underline">
            Ver todos
          </Link>
        </div>
        {coursesWithProgress.length === 0 ? (
          <div className="bg-md-surface-container rounded-md-xl p-6 text-center">
            <p className="text-sm text-md-on-surface-variant">Aún no tienes cursos asignados.</p>
            <Link href="/cursos" className="text-sm text-md-primary hover:underline mt-2 inline-block">
              Explorar cursos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coursesWithProgress.map((course) => {
              const pct = course.totalTopics > 0 ? Math.round((course.completedTopics / course.totalTopics) * 100) : 0
              return (
                <Link
                  key={course.id}
                  href={`/cursos/${course.id}/aprender`}
                  className="state-layer bg-md-surface-container rounded-md-xl p-4 shadow-md-1 hover:shadow-md-2 transition-shadow flex gap-4"
                >
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-16 rounded-md-sm object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-md-on-surface truncate">{course.title}</p>
                    <p className="text-xs text-md-on-surface-variant mt-1">
                      {course.completedTopics}/{course.totalTopics} temas &middot; {pct}%
                    </p>
                    <div className="w-full h-2 bg-md-surface-container-highest rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-md-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Two columns: asesorias + tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent asesorias */}
        {asesorias.length > 0 && (
          <div className="bg-md-surface-container rounded-md-xl p-6 shadow-md-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-md-on-surface">Asesorias recientes</h2>
              <Link href="/asesorias" className="text-sm text-md-primary hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="space-y-3">
              {asesorias.map((a) => (
                <div key={a.id} className="p-3 rounded-md-sm bg-md-surface-container-lowest">
                  <p className="text-xs text-md-on-surface-variant">
                    {new Date(a.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' '}&middot; {a.startTime} - {a.endTime}
                  </p>
                  {a.summary && (
                    <p className="text-sm text-md-on-surface mt-1 line-clamp-2">{a.summary}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending tasks */}
        {pendingTasks.length > 0 && (
          <div className="bg-md-surface-container rounded-md-xl p-6 shadow-md-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-md-on-surface">Tareas pendientes</h2>
              <Link href="/tareas" className="text-sm text-md-primary hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="space-y-3">
              {pendingTasks.map((t) => (
                <div key={t.id} className="flex items-start gap-3 p-3 rounded-md-sm bg-md-surface-container-lowest">
                  <div className="w-4 h-4 mt-0.5 rounded border-2 border-md-outline shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-md-on-surface">{t.description}</p>
                    <p className="text-xs text-md-on-surface-variant mt-0.5">
                      {new Date(t.asesoria.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
