'use client'

import Link from 'next/link'

type RecentNews = {
  id: number
  title: string
  source: string
  category: string
  relevance: string | null
  createdAt: Date
}

type CourseProgress = {
  id: number
  title: string
  thumbnail: string | null
  status: string
  enrolledCount: number
  topicCount: number
  percent: number
}

export default function AdminDashboard({
  userCount,
  courseCount,
  publishedCourseCount,
  asesoriaCount,
  pendingNewsCount,
  recentNews,
  courseProgress,
}: {
  userCount: number
  courseCount: number
  publishedCourseCount: number
  asesoriaCount: number
  pendingNewsCount: number
  recentNews: RecentNews[]
  courseProgress: CourseProgress[]
}) {
  const stats = [
    { label: 'Usuarios', value: userCount, href: '/usuarios', color: 'bg-md-primary-container text-md-on-primary-container' },
    { label: 'Cursos publicados', value: `${publishedCourseCount}/${courseCount}`, href: '/cursos', color: 'bg-md-secondary-container text-md-on-secondary-container' },
    { label: 'Asesorías', value: asesoriaCount, href: '/asesorias', color: 'bg-md-tertiary-container text-md-on-tertiary-container' },
    { label: 'Noticias pendientes', value: pendingNewsCount, href: '/dashboard', color: 'bg-md-error-container text-md-on-error-container' },
  ]

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-md-on-surface">Panel de administración</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`state-layer rounded-md-xl p-5 shadow-md-1 hover:shadow-md-2 transition-shadow ${s.color}`}
          >
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm mt-1 opacity-80">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Course completion */}
      <div className="bg-md-surface-container rounded-md-xl shadow-md-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-md-on-surface">Completitud por curso</h2>
          <Link href="/cursos" className="text-sm text-md-primary hover:underline">
            Gestionar
          </Link>
        </div>
        {courseProgress.length === 0 ? (
          <p className="text-sm text-md-on-surface-variant">No hay cursos creados.</p>
        ) : (
          <div className="space-y-4">
            {courseProgress.map((course) => (
              <div key={course.id} className="flex items-center gap-4">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.title} className="w-10 h-10 rounded-md-sm object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-md-on-surface truncate">{course.title}</p>
                    <span className="text-sm font-bold text-md-on-surface ml-2 shrink-0">{course.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-md-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-md-primary rounded-full transition-all"
                      style={{ width: `${course.percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-md-on-surface-variant mt-1">
                    {course.enrolledCount} alumnos &middot; {course.topicCount} temas
                    {course.status === 'borrador' && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-md-surface-container-highest text-md-on-surface-variant text-xs">borrador</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent pending news */}
      <div className="bg-md-surface-container rounded-md-xl shadow-md-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-md-on-surface">Noticias pendientes</h2>
          <Link href="/dashboard" className="text-sm text-md-primary hover:underline">
            Ver todas
          </Link>
        </div>
        {recentNews.length === 0 ? (
          <p className="text-sm text-md-on-surface-variant">No hay noticias pendientes de revisión.</p>
        ) : (
          <div className="space-y-3">
            {recentNews.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-md-sm bg-md-surface-container-lowest">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-md-on-surface truncate">{item.title}</p>
                  <p className="text-xs text-md-on-surface-variant mt-0.5">
                    {item.source} &middot; {item.category}
                    {item.relevance && (
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${
                        item.relevance === 'alta' ? 'bg-md-error-container text-md-on-error-container' :
                        item.relevance === 'media' ? 'bg-md-tertiary-container text-md-on-tertiary-container' :
                        'bg-md-surface-container-highest text-md-on-surface-variant'
                      }`}>
                        {item.relevance}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Gestionar cursos', href: '/cursos' },
          { label: 'Gestionar usuarios', href: '/usuarios' },
          { label: 'Radar de noticias', href: '/dashboard' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="state-layer bg-md-surface-container rounded-md-xl p-4 text-sm font-medium text-md-on-surface shadow-md-1 hover:shadow-md-2 transition-shadow text-center"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
