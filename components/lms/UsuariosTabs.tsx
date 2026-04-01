'use client'

import { useState } from 'react'
import UserManager from './UserManager'
import GroupManager from './GroupManager'

type CourseInfo = { id: number; title: string; status: string }
type UserBasic = { id: number; name: string; email: string }
type User = {
  id: number
  email: string
  name: string
  createdAt: string
  access: { course: CourseInfo; grantedAt: string }[]
}
type GroupMember = { userId: number; user: UserBasic; joinedAt: string }
type Group = {
  id: number
  name: string
  leaderId: number
  leader: UserBasic
  members: GroupMember[]
  createdAt: string
}

interface UsuariosTabsProps {
  initialUsers: User[]
  allCourses: CourseInfo[]
  initialGroups: Group[]
  allUsers: UserBasic[]
}

export default function UsuariosTabs({ initialUsers, allCourses, initialGroups, allUsers }: UsuariosTabsProps) {
  const [tab, setTab] = useState<'usuarios' | 'grupos'>('usuarios')

  return (
    <div>
      <div className="border-b border-md-outline-variant px-8 pt-6">
        <div className="flex gap-1">
          <button
            onClick={() => setTab('usuarios')}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-md-sm transition-colors ${
              tab === 'usuarios'
                ? 'bg-md-surface-container-lowest text-md-primary border border-md-outline-variant border-b-transparent -mb-px'
                : 'text-md-on-surface-variant hover:text-md-on-surface'
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setTab('grupos')}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-md-sm transition-colors ${
              tab === 'grupos'
                ? 'bg-md-surface-container-lowest text-md-primary border border-md-outline-variant border-b-transparent -mb-px'
                : 'text-md-on-surface-variant hover:text-md-on-surface'
            }`}
          >
            Grupos
          </button>
        </div>
      </div>

      {tab === 'usuarios' ? (
        <UserManager initialUsers={initialUsers} allCourses={allCourses} />
      ) : (
        <GroupManager initialGroups={initialGroups} allUsers={allUsers} />
      )}
    </div>
  )
}
