'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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

type Material = { id: number; name: string; url: string; fileType: string | null }
type Topic = { id: number; title: string; description: string | null; content: string | null; videoUrl: string | null; order: number; materials: Material[] }
type Module = { id: number; title: string; description: string | null; content: string | null; order: number; topics: Topic[] }
type Course = { id: number; title: string; description: string | null; content: string | null; modules: Module[] }

interface CourseViewerProps {
  course: Course
  completedTopicIds: number[]
  currentTopicId: number | null
  userName: string
}

export default function CourseViewer({ course, completedTopicIds: initialCompleted, currentTopicId, userName }: CourseViewerProps) {
  const router = useRouter()
  const [completed, setCompleted] = useState<Set<number>>(new Set(initialCompleted))
  const [toggling, setToggling] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const allTopics = useMemo(() => course.modules.flatMap(m => m.topics), [course])
  const totalTopics = allTopics.length
  const completedCount = allTopics.filter(t => completed.has(t.id)).length
  const courseProgress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  const currentTopic = currentTopicId ? allTopics.find(t => t.id === currentTopicId) : null
  const currentModule = currentTopic
    ? course.modules.find(m => m.topics.some(t => t.id === currentTopicId))
    : null

  // Find prev/next topic
  const currentIdx = currentTopicId ? allTopics.findIndex(t => t.id === currentTopicId) : -1
  const prevTopic = currentIdx > 0 ? allTopics[currentIdx - 1] : null
  const nextTopic = currentIdx >= 0 && currentIdx < allTopics.length - 1 ? allTopics[currentIdx + 1] : null

  async function toggleTopic(topicId: number) {
    const newCompleted = !completed.has(topicId)
    setToggling(true)

    // Optimistic update
    setCompleted(prev => {
      const next = new Set(prev)
      if (newCompleted) next.add(topicId)
      else next.delete(topicId)
      return next
    })

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, completed: newCompleted }),
      })
    } catch {
      // Revert on error
      setCompleted(prev => {
        const next = new Set(prev)
        if (newCompleted) next.delete(topicId)
        else next.add(topicId)
        return next
      })
    } finally {
      setToggling(false)
    }
  }

  async function toggleModule(mod: Module) {
    const topicIds = mod.topics.map(t => t.id)
    const allDone = topicIds.every(id => completed.has(id))
    const newCompleted = !allDone

    setToggling(true)
    setCompleted(prev => {
      const next = new Set(prev)
      topicIds.forEach(id => {
        if (newCompleted) next.add(id)
        else next.delete(id)
      })
      return next
    })

    try {
      await fetch('/api/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicIds, completed: newCompleted }),
      })
    } catch {
      setCompleted(new Set(initialCompleted))
    } finally {
      setToggling(false)
    }
  }

  async function toggleCourse() {
    const topicIds = allTopics.map(t => t.id)
    const allDone = topicIds.every(id => completed.has(id))
    const newCompleted = !allDone

    setToggling(true)
    setCompleted(prev => {
      const next = new Set(prev)
      topicIds.forEach(id => {
        if (newCompleted) next.add(id)
        else next.delete(id)
      })
      return next
    })

    try {
      await fetch('/api/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicIds, completed: newCompleted }),
      })
    } catch {
      setCompleted(new Set(initialCompleted))
    } finally {
      setToggling(false)
    }
  }

  function moduleProgress(mod: Module) {
    const total = mod.topics.length
    const done = mod.topics.filter(t => completed.has(t.id)).length
    return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
  }

  const embedUrl = currentTopic?.videoUrl ? getEmbedUrl(currentTopic.videoUrl) : null

  return (
    <div className="flex min-h-screen bg-md-surface">
      {/* Course sidebar */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} shrink-0 transition-all duration-200 overflow-hidden border-r border-md-outline-variant bg-md-surface-container-low`}>
        <div className="w-80 min-h-screen flex flex-col">
          {/* Course header */}
          <div className="p-4 border-b border-md-outline-variant">
            <Link href="/cursos" className="text-xs text-md-on-surface-variant hover:text-md-primary transition-colors mb-2 block">
              ← Volver a cursos
            </Link>
            <h2 className="font-medium text-md-on-surface text-sm leading-tight mb-3">{course.title}</h2>

            {/* Course progress */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-2 bg-md-surface-container-highest rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${courseProgress === 100 ? 'bg-green-500' : 'bg-md-primary'}`}
                  style={{ width: `${courseProgress}%` }}
                />
              </div>
              <span className="text-xs text-md-on-surface-variant font-mono shrink-0">{courseProgress}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-md-on-surface-variant">{completedCount}/{totalTopics} temas</span>
              <button
                onClick={toggleCourse}
                disabled={toggling}
                className="text-xs text-md-primary font-medium hover:underline disabled:opacity-50"
              >
                {courseProgress === 100 ? 'Desmarcar todo' : 'Marcar todo'}
              </button>
            </div>
          </div>

          {/* Module list */}
          <nav className="flex-1 overflow-y-auto py-2">
            {course.modules.map((mod, modIdx) => {
              const mp = moduleProgress(mod)
              const isCurrentModule = currentModule?.id === mod.id
              return (
                <div key={mod.id} className="mb-1">
                  {/* Module header */}
                  <div className={`px-4 py-2.5 flex items-center gap-2 ${isCurrentModule ? 'bg-md-surface-container' : ''}`}>
                    <button
                      onClick={() => toggleModule(mod)}
                      disabled={toggling}
                      className={`w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-colors disabled:opacity-50 ${
                        mp.percent === 100
                          ? 'bg-green-500 border-green-500 text-white'
                          : mp.percent > 0
                            ? 'border-md-primary bg-md-primary/10'
                            : 'border-md-outline-variant'
                      }`}
                      title={mp.percent === 100 ? 'Desmarcar módulo' : 'Completar módulo'}
                    >
                      {mp.percent === 100 && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {mp.percent > 0 && mp.percent < 100 && (
                        <div className="w-2 h-2 rounded-sm bg-md-primary" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-md-on-surface-variant font-mono">{modIdx + 1}</span>
                        <span className="text-xs font-medium text-md-on-surface truncate">{mod.title}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1 bg-md-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${mp.percent === 100 ? 'bg-green-500' : 'bg-md-primary'}`}
                            style={{ width: `${mp.percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-md-on-surface-variant font-mono">{mp.done}/{mp.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Topics in module */}
                  <div className="ml-5 border-l border-md-outline-variant">
                    {mod.topics.map((topic, topicIdx) => {
                      const isCurrent = topic.id === currentTopicId
                      const isDone = completed.has(topic.id)
                      return (
                        <div
                          key={topic.id}
                          className={`flex items-center gap-2 pl-4 pr-4 py-2 transition-colors ${
                            isCurrent
                              ? 'bg-md-primary-container/40 border-l-2 border-md-primary -ml-px'
                              : 'hover:bg-md-surface-container-high'
                          }`}
                        >
                          <button
                            onClick={(e) => { e.preventDefault(); toggleTopic(topic.id) }}
                            disabled={toggling}
                            className={`w-4 h-4 rounded-full shrink-0 border-2 flex items-center justify-center transition-colors disabled:opacity-50 ${
                              isDone
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-md-outline-variant hover:border-md-primary'
                            }`}
                          >
                            {isDone && (
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <Link
                            href={`/cursos/${course.id}/aprender/${topic.id}`}
                            className={`flex-1 min-w-0 text-xs truncate transition-colors ${
                              isCurrent
                                ? 'text-md-on-surface font-medium'
                                : isDone
                                  ? 'text-md-on-surface-variant line-through'
                                  : 'text-md-on-surface-variant hover:text-md-on-surface'
                            }`}
                          >
                            <span className="font-mono mr-1.5 text-[10px]">{modIdx + 1}.{topicIdx + 1}</span>
                            {topic.title}
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </nav>

          {/* User footer */}
          <div className="p-4 border-t border-md-outline-variant">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-md-primary-container text-md-on-primary-container flex items-center justify-center text-xs font-medium">
                {userName.charAt(0).toUpperCase()}
              </span>
              <span className="text-xs text-md-on-surface-variant truncate">{userName}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle sidebar */}
      <button
        onClick={() => setSidebarOpen(o => !o)}
        className="absolute top-4 left-2 z-10 lg:hidden state-layer p-2 rounded-md-sm bg-md-surface-container text-md-on-surface-variant"
      >
        {sidebarOpen ? '←' : '→'}
      </button>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {currentTopic ? (
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            {/* Topic header */}
            <div className="mb-6">
              {currentModule && (
                <p className="text-xs text-md-on-surface-variant mb-1">
                  {course.modules.indexOf(currentModule) + 1}. {currentModule.title}
                </p>
              )}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-xl font-medium text-md-on-surface leading-tight">{currentTopic.title}</h1>
                <button
                  onClick={() => toggleTopic(currentTopic.id)}
                  disabled={toggling}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-md-xl text-sm font-medium transition-all disabled:opacity-50 ${
                    completed.has(currentTopic.id)
                      ? 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : 'bg-md-primary text-md-on-primary shadow-md-1 hover:shadow-md-2'
                  }`}
                >
                  {completed.has(currentTopic.id) ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Completado
                    </>
                  ) : (
                    'Marcar como completado'
                  )}
                </button>
              </div>
              {currentTopic.description && (
                <p className="text-sm text-md-on-surface-variant mt-2">{currentTopic.description}</p>
              )}
            </div>

            {/* Video */}
            {currentTopic.videoUrl && embedUrl && (
              <div className="mb-6 aspect-video rounded-md-md overflow-hidden bg-md-inverse-surface shadow-md-2">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  title={currentTopic.title}
                />
              </div>
            )}

            {/* Content */}
            {currentTopic.content && (
              <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant p-6 shadow-md-1 mb-6">
                <div className="prose prose-sm max-w-none text-md-on-surface whitespace-pre-wrap leading-relaxed">
                  {currentTopic.content}
                </div>
              </div>
            )}

            {/* Materials */}
            {currentTopic.materials.length > 0 && (
              <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant p-6 shadow-md-1 mb-6">
                <h3 className="text-sm font-medium text-md-on-surface mb-3">Materiales</h3>
                <div className="space-y-2">
                  {currentTopic.materials.map(mat => (
                    <a
                      key={mat.id}
                      href={mat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 py-2.5 px-3 rounded-md-sm bg-md-surface-container hover:bg-md-surface-container-high transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-md-sm bg-md-primary-container text-md-on-primary-container flex items-center justify-center text-xs font-medium shrink-0">
                        {mat.fileType?.toUpperCase().slice(0, 3) || 'URL'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm text-md-on-surface group-hover:text-md-primary transition-colors block truncate">
                          {mat.name}
                        </span>
                        {mat.fileType && (
                          <span className="text-xs text-md-on-surface-variant">{mat.fileType}</span>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-md-on-surface-variant shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Nav prev/next */}
            <div className="flex items-center justify-between pt-4 border-t border-md-outline-variant">
              {prevTopic ? (
                <Link
                  href={`/cursos/${course.id}/aprender/${prevTopic.id}`}
                  className="state-layer flex items-center gap-2 px-4 py-2.5 rounded-md-xl text-sm text-md-on-surface-variant hover:text-md-on-surface font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline truncate max-w-[200px]">{prevTopic.title}</span>
                  <span className="sm:hidden">Anterior</span>
                </Link>
              ) : <div />}

              {nextTopic ? (
                <Link
                  href={`/cursos/${course.id}/aprender/${nextTopic.id}`}
                  className="state-layer flex items-center gap-2 px-4 py-2.5 rounded-md-xl text-sm font-medium bg-md-primary text-md-on-primary shadow-md-1 hover:shadow-md-2 transition-all"
                >
                  <span className="hidden sm:inline truncate max-w-[200px]">{nextTopic.title}</span>
                  <span className="sm:hidden">Siguiente</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                courseProgress === 100 ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 text-sm text-green-600 font-medium">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Curso completado
                  </div>
                ) : <div />
              )}
            </div>
          </div>
        ) : (
          /* No topic selected — show course overview */
          <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-medium text-md-on-surface mb-4">{course.title}</h1>
            {course.description && (
              <p className="text-md-on-surface-variant mb-4">{course.description}</p>
            )}
            {course.content && (
              <div className="bg-md-surface-container-lowest rounded-md-md border border-md-outline-variant p-6 shadow-md-1">
                <div className="prose prose-sm max-w-none text-md-on-surface whitespace-pre-wrap">
                  {course.content}
                </div>
              </div>
            )}
            {totalTopics === 0 && (
              <p className="text-md-on-surface-variant text-sm mt-6">Este curso no tiene contenido todavía.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
