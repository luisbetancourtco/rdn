'use client'

import Link from 'next/link'

type StudentCourse = {
  id: number
  title: string
  description: string | null
  thumbnail: string | null
  totalTopics: number
  completedTopics: number
  modulesCount: number
}

function CourseCard({ course }: { course: StudentCourse }) {
  const pct = course.totalTopics > 0
    ? Math.round((course.completedTopics / course.totalTopics) * 100)
    : 0

  return (
    <Link
      href={`/cursos/${course.id}/aprender`}
      className="block bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant hover:shadow-md-2 transition-all overflow-hidden"
    >
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
      <div className="p-4">
        <h3 className="font-medium text-md-on-surface text-sm leading-snug mb-1">
          {course.title}
        </h3>
        {course.description && (
          <p className="text-xs text-md-on-surface-variant mb-2 line-clamp-2">
            {course.description}
          </p>
        )}
        {pct > 0 && (
          <div className="flex items-center gap-3 mb-1">
            <div className="flex-1 h-1.5 bg-md-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-md-primary rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-md-on-surface-variant shrink-0 font-medium">
              {pct}%
            </span>
          </div>
        )}
        <p className="text-xs text-md-outline">
          {course.completedTopics}/{course.totalTopics} temas · {course.modulesCount} módulo{course.modulesCount !== 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  )
}

function Section({ title, subtitle, courses }: { title: string; subtitle: string; courses: StudentCourse[] }) {
  if (courses.length === 0) return null
  return (
    <div className="mb-10">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-md-on-surface">{title}</h2>
        <p className="text-xs text-md-on-surface-variant mt-0.5">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default function StudentCourseList({ courses }: { courses: StudentCourse[] }) {
  const completed = courses.filter(c => c.totalTopics > 0 && c.completedTopics === c.totalTopics)
  const inProgress = courses.filter(c => c.completedTopics > 0 && (c.totalTopics === 0 || c.completedTopics < c.totalTopics))
  const available = courses.filter(c => c.completedTopics === 0)

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-md-on-surface">Mis Cursos</h1>
        <p className="text-sm text-md-on-surface-variant mt-0.5">Tu progreso de aprendizaje</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 text-md-on-surface-variant">
          <p className="text-5xl mb-4">🎓</p>
          <p className="font-medium text-md-on-surface text-lg">No tienes cursos asignados</p>
          <p className="text-sm mt-1">Contacta a tu administrador para obtener acceso</p>
        </div>
      ) : (
        <>
          <Section
            title="En progreso"
            subtitle={`${inProgress.length} curso${inProgress.length !== 1 ? 's' : ''} en curso`}
            courses={inProgress}
          />
          <Section
            title="Disponibles"
            subtitle={`${available.length} curso${available.length !== 1 ? 's' : ''} por comenzar`}
            courses={available}
          />
          <Section
            title="Completados"
            subtitle={`${completed.length} curso${completed.length !== 1 ? 's' : ''} terminado${completed.length !== 1 ? 's' : ''}`}
            courses={completed}
          />
        </>
      )}
    </div>
  )
}
