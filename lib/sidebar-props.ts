import { prisma } from '@/lib/prisma'

export async function getSidebarProps(userId: number, role: string) {
  if (role === 'admin') {
    return { role, hasAsesorias: true, hasTareas: true }
  }

  const [asesoriaCount, tareaCount] = await Promise.all([
    prisma.asesoria.count({ where: { userId } }),
    prisma.asesoriaTask.count({ where: { asesoria: { userId } } }),
  ])

  return {
    role,
    hasAsesorias: asesoriaCount > 0,
    hasTareas: tareaCount > 0,
  }
}
