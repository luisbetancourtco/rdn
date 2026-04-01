/**
 * TácticoMD 4.0 — WordPress → Supabase user & progress migration
 *
 * Prerequisites:
 *   1. Run export-wp-data.php on the WordPress server
 *   2. Download users-export.json and progress-export.json into this directory
 *   3. Set DATABASE_URL and SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env
 *   4. Run:  npx tsx scripts/migrate-users.ts
 */

import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { unserialize } from 'php-serialize'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// ---------- Types ----------

interface WpUserRow {
  ID: string
  user_email: string
  user_registered: string
  first_name: string | null
  last_name: string | null
  up_username: string | null
  profilepicture: string | null
  country: string | null
  billing_city: string | null
  nombre_negocio: string | null
  url_negocio: string | null
  descripcion_negocio: string | null
  categoria_negocio: string | null
  facebook: string | null
  instagram: string | null
  linkedin: string | null
  twitter: string | null
  youtube: string | null
  jobstatus: string | null
  objetivo: string | null
  skills: string | null
  experience: string | null
  medio_contacto: string | null
  last_login: string | null
}

interface WpProgressRow {
  user_id: string
  meta_value: string
}

// ---------- Helpers ----------

function tryUnserialize(raw: string | null): unknown {
  if (!raw) return null
  try {
    return unserialize(raw)
  } catch {
    return null
  }
}

function phpValueToJsonArray(raw: string | null): string[] | undefined {
  const val = tryUnserialize(raw)
  if (val === null) return undefined
  if (Array.isArray(val)) return val.map(String)
  if (typeof val === 'object') return Object.values(val as Record<string, unknown>).map(String)
  return undefined
}

function extractCompletedTopics(serialized: string): number[] {
  const data = tryUnserialize(serialized) as Record<string, any> | null
  if (!data || !data['24185']) return []

  const course = data['24185']
  const topics: Record<string, Record<string, number>> = course.topics || {}
  const completed: number[] = []

  for (const lessonTopics of Object.values(topics)) {
    for (const [topicId, status] of Object.entries(lessonTopics)) {
      if (String(status) === '1') {
        completed.push(parseInt(topicId, 10))
      }
    }
  }

  return completed
}

function isValidUrl(s: string | null): boolean {
  if (!s || s === 'Ninguna' || s.trim() === '') return false
  try {
    new URL(s)
    return true
  } catch {
    return false
  }
}

function buildName(first: string | null, last: string | null, email: string): string {
  const parts = [first, last].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : email.split('@')[0]
}

// ---------- Avatar migration ----------

async function migrateAvatar(wpUserId: number, profilepictureUrl: string): Promise<string | null> {
  try {
    const response = await fetch(profilepictureUrl)
    if (!response.ok) return null

    const buffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const extension = contentType.split('/')[1]?.split(';')[0] || 'jpg'

    const fileName = `${wpUserId}.${extension}`
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, { contentType, upsert: true })

    if (error) {
      console.warn(`  Avatar upload failed for wp_user ${wpUserId}: ${error.message}`)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (err) {
    console.warn(`  Avatar download failed for wp_user ${wpUserId}: ${err}`)
    return null
  }
}

// ---------- Main ----------

async function main() {
  const scriptsDir = path.dirname(new URL(import.meta.url).pathname)
  const usersPath = path.join(scriptsDir, 'users-export.json')
  const progressPath = path.join(scriptsDir, 'progress-export.json')

  if (!fs.existsSync(usersPath) || !fs.existsSync(progressPath)) {
    console.error('Missing users-export.json or progress-export.json in scripts/')
    console.error('Run export-wp-data.php on the WordPress server first.')
    process.exit(1)
  }

  const usersRaw: WpUserRow[] = JSON.parse(fs.readFileSync(usersPath, 'utf-8'))
  const progressRaw: WpProgressRow[] = JSON.parse(fs.readFileSync(progressPath, 'utf-8'))

  console.log(`Loaded ${usersRaw.length} users and ${progressRaw.length} progress records\n`)

  // Build progress lookup: wp_user_id -> completed topic IDs
  const progressMap = new Map<number, number[]>()
  for (const row of progressRaw) {
    const wpId = parseInt(row.user_id, 10)
    const topics = extractCompletedTopics(row.meta_value)
    if (topics.length > 0) {
      progressMap.set(wpId, topics)
    }
  }

  // Counters
  let usersMigrated = 0
  let progressInserted = 0
  let photosMigrated = 0
  let photosSkipped = 0
  let errors = 0

  const BATCH_SIZE = 100
  const totalBatches = Math.ceil(usersRaw.length / BATCH_SIZE)

  for (let batch = 0; batch < totalBatches; batch++) {
    const slice = usersRaw.slice(batch * BATCH_SIZE, (batch + 1) * BATCH_SIZE)

    for (const row of slice) {
      const wpUserId = parseInt(row.ID, 10)

      try {
        // Avatar
        let avatarUrl: string | null = null
        if (isValidUrl(row.profilepicture)) {
          avatarUrl = await migrateAvatar(wpUserId, row.profilepicture!)
          if (avatarUrl) {
            photosMigrated++
          } else {
            photosSkipped++
          }
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 100))
        } else {
          photosSkipped++
        }

        // Upsert user
        const user = await prisma.user.upsert({
          where: { wpUserId },
          update: {
            email: row.user_email,
            name: buildName(row.first_name, row.last_name, row.user_email),
            firstName: row.first_name || null,
            lastName: row.last_name || null,
            username: row.up_username || null,
            avatarUrl,
            country: row.country || null,
            city: row.billing_city || null,
            nombreNegocio: row.nombre_negocio || null,
            urlNegocio: row.url_negocio || null,
            descripcionNegocio: row.descripcion_negocio || null,
            categoriaNegocio: row.categoria_negocio || null,
            facebook: row.facebook || null,
            instagram: row.instagram || null,
            linkedin: row.linkedin || null,
            twitter: row.twitter || null,
            youtube: row.youtube || null,
            jobstatus: phpValueToJsonArray(row.jobstatus) ?? undefined,
            objetivo: row.objetivo || null,
            skills: phpValueToJsonArray(row.skills) ?? undefined,
            experience: row.experience ? parseInt(row.experience, 10) : null,
            medioContacto: phpValueToJsonArray(row.medio_contacto) ?? undefined,
            registeredAt: row.user_registered ? new Date(row.user_registered) : null,
            lastLogin: row.last_login ? new Date(parseInt(row.last_login, 10) * 1000) : null,
          },
          create: {
            email: row.user_email,
            name: buildName(row.first_name, row.last_name, row.user_email),
            firstName: row.first_name || null,
            lastName: row.last_name || null,
            username: row.up_username || null,
            avatarUrl,
            country: row.country || null,
            city: row.billing_city || null,
            nombreNegocio: row.nombre_negocio || null,
            urlNegocio: row.url_negocio || null,
            descripcionNegocio: row.descripcion_negocio || null,
            categoriaNegocio: row.categoria_negocio || null,
            facebook: row.facebook || null,
            instagram: row.instagram || null,
            linkedin: row.linkedin || null,
            twitter: row.twitter || null,
            youtube: row.youtube || null,
            jobstatus: phpValueToJsonArray(row.jobstatus),
            objetivo: row.objetivo || null,
            skills: phpValueToJsonArray(row.skills),
            experience: row.experience ? parseInt(row.experience, 10) : null,
            medioContacto: phpValueToJsonArray(row.medio_contacto),
            wpUserId,
            registeredAt: row.user_registered ? new Date(row.user_registered) : null,
            lastLogin: row.last_login ? new Date(parseInt(row.last_login, 10) * 1000) : null,
          },
        })

        usersMigrated++

        // Upsert topic progress
        const completedTopics = progressMap.get(wpUserId) || []
        for (const topicId of completedTopics) {
          try {
            await prisma.topicProgress.upsert({
              where: { userId_topicId: { userId: user.id, topicId } },
              update: { completed: true },
              create: { userId: user.id, topicId, completed: true },
            })
            progressInserted++
          } catch (err) {
            // Topic may not exist in the new DB yet — log and continue
            console.warn(`  Skipped progress: user ${user.id}, topic ${topicId} (may not exist)`)
          }
        }
      } catch (err) {
        errors++
        console.error(`  Error migrating wp_user ${wpUserId}: ${err}`)
      }
    }

    console.log(`Procesados: ${Math.min((batch + 1) * BATCH_SIZE, usersRaw.length)}/${usersRaw.length}`)
  }

  console.log('\n--- Migration summary ---')
  console.log(`✓ Usuarios migrados: ${usersMigrated}`)
  console.log(`✓ Registros de progreso insertados: ${progressInserted}`)
  console.log(`✓ Usuarios con progreso en TácticoMD: ${progressMap.size}`)
  console.log(`✓ Fotos migradas: ${photosMigrated}`)
  console.log(`⚠ Fotos no disponibles: ${photosSkipped}`)
  console.log(`⚠ Errores: ${errors}`)

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
