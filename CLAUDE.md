# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: Supabase (PostgreSQL) via Prisma ORM
- **Storage**: Supabase Buckets (thumbnails, avatars, course materials, icons)
- **Styles**: Tailwind CSS with Material Design 3 custom tokens
- **Auth**: iron-session (encrypted cookies, 30-day expiry) + bcryptjs
- **Email**: Nodemailer via Google Workspace SMTP
- **AI**: Anthropic Claude SDK (classification + caption generation)
- **Deploy**: Vercel (with Cron Jobs)

## Commands

```bash
npm install              # Install dependencies
cp .env.example .env     # Copy and fill in credentials
npm run db:push          # Push Prisma schema to Supabase
npm run db:generate      # Regenerate Prisma client
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database (migrates LearnDash courses)
npm run dev              # Run development server
npm run build            # Prisma generate + Next.js build
npm run lint             # ESLint

# Trigger ingestion manually (app must be running)
curl -X POST http://localhost:3000/api/ingestion/run \
  -H "Cookie: alfred_session=<your-session-cookie>"
```

There is no test suite yet.

## Architecture

The project has three main systems: **News Monitor** (RSS ingestion + LinkedIn publishing), **LMS** (courses, progress tracking, user/group management), and **Consulting** (advisory sessions + task tracking).

### File Structure

```
app/
  page.tsx                        — root redirect (→ /diagnostico or /login)
  layout.tsx                      — HTML shell (Roboto font), global CSS
  login/
    page.tsx                      — login page (server component)
    LoginForm.tsx                 — email/password form (client component)
  recuperar/
    page.tsx + ForgotPasswordForm — password recovery flow
  perfil/
    page.tsx                      — user profile page (server component)
    ProfileForm.tsx               — profile edit form with avatar upload (client component)
  dashboard/
    layout.tsx                    — admin-only layout with sidebar + impersonation banner
    page.tsx                      — news monitoring dashboard (force-dynamic)
  cursos/
    layout.tsx                    — authenticated layout with sidebar
    page.tsx                      — admin: CourseManager / student: StudentCourseList (3 sections)
    [id]/page.tsx                 — admin course editor (CourseDetail)
    [id]/aprender/page.tsx        — student course viewer (CourseViewer)
    [id]/aprender/[topicId]/      — single topic learning view
  usuarios/
    layout.tsx                    — admin-only layout
    page.tsx                      — user & group management (UsuariosTabs)
  asesorias/
    layout.tsx                    — authenticated layout
    page.tsx                      — advisory sessions list (AsesoriaList)
  tareas/
    layout.tsx                    — authenticated layout
    page.tsx                      — tasks from advisory sessions
  comunidad/
    layout.tsx                    — authenticated layout
    page.tsx                      — community page (CommunityTabs)
    CommunityTabs.tsx             — tab switcher: Miembros | WhatsApp
    CommunityGrid.tsx             — user directory grid with search + profile modal
  diagnostico/                    — placeholder (admin only)
  ruta/                           — placeholder (admin only)
  bitacora/                       — placeholder (admin only)
  hitos/                          — placeholder (admin only)
  alfred/                         — placeholder (admin only)
  api/
    auth/
      login/route.ts              — POST: email+password auth via bcrypt
      logout/route.ts             — POST: destroy session
      forgot-password/route.ts    — POST: generate reset token (1h expiry), send email via Nodemailer
      reset-password/route.ts     — POST: validate token, update password
      select-user/route.ts        — POST: admin impersonation (stores original session)
      stop-impersonate/route.ts   — POST: restore admin session
    ingestion/run/route.ts        — POST: fetch feeds → classify → persist (cron target)
    news/[id]/
      generate-caption/route.ts   — POST: Claude generates LinkedIn caption
      save-caption/route.ts       — POST: persist caption text
      status/route.ts             — POST: change item status
      publish/route.ts            — POST: publish to LinkedIn via ugcPosts API
    linkedin/
      connect/route.ts            — GET: initiate OAuth (CSRF state in session)
      callback/route.ts           — GET: exchange code, save tokens to DB
      disconnect/route.ts         — POST: remove LinkedIn tokens
    asesorias/route.ts            — GET/POST: list/create advisory sessions (with nested tasks)
    asesorias/[id]/route.ts       — GET/PATCH/DELETE: advisory session CRUD
    asesorias/[id]/tasks/route.ts — POST: add task to session
    asesorias/[id]/tasks/[taskId]/route.ts — PATCH/DELETE: task CRUD
    courses/route.ts              — GET/POST: list/create courses
    courses/[id]/route.ts         — GET/PATCH/DELETE: course CRUD
    courses/[id]/modules/         — GET/POST: module CRUD
    courses/[id]/modules/[moduleId]/          — PATCH/DELETE
    courses/[id]/modules/[moduleId]/topics/   — GET/POST
    courses/[id]/modules/[moduleId]/topics/[topicId]/             — PATCH/DELETE
    courses/[id]/modules/[moduleId]/topics/[topicId]/materials/   — GET/POST/DELETE
    courses/reorder/route.ts      — PUT: reorder courses by orderedIds
    users/route.ts                — GET/POST: list/create users
    users/[id]/route.ts           — GET/PUT/DELETE: user CRUD (full profile fields)
    users/[id]/courses/route.ts   — GET/POST: grant course access
    users/[id]/courses/[courseId]/ — DELETE: revoke course access
    users/[id]/progress/route.ts  — GET: user progress across all courses
    groups/route.ts               — GET/POST: list/create groups
    groups/[id]/route.ts          — GET/PUT/DELETE: group CRUD
    groups/[id]/members/          — GET/POST/DELETE: group membership
    groups/[id]/progress/route.ts — GET: group members' progress
    progress/route.ts             — POST: toggle topic / PUT: bulk toggle
    upload/route.ts               — POST: file upload to Supabase bucket

lib/
  prisma.ts          — singleton PrismaClient (dev logging)
  session.ts         — iron-session config (SessionData interface + getSession())
  sidebar-props.ts   — computes Sidebar visibility props (hasAsesorias, hasTareas) per user
  feeds.ts           — load feeds.yaml (js-yaml)
  rss.ts             — fetch + parse RSS feeds (rss-parser, 10s timeout, HTML strip, age filter)
  classifier.ts      — Claude Sonnet → {type, relevance, reason} JSON classification
  caption.ts         — Claude Sonnet → LinkedIn caption in Luis Betancourt's voice
  linkedin.ts        — OAuth helpers + ugcPosts API call
  ingestion.ts       — orchestrates: delete old discarded → fetch feeds → classify → db insert
  supabase.ts        — singleton Supabase client (service role key)
  mail.ts            — Nodemailer transporter (Google Workspace SMTP) + sendPasswordResetEmail()

components/
  Dashboard.tsx             — news tabs, filters, toasts, ingestion trigger, LinkedIn connect
  NewsCard.tsx              — caption workflow, status buttons, publish button
  Sidebar.tsx               — responsive sidebar (desktop sticky + mobile drawer), role-based nav, custom PNG icons from Supabase
  ImpersonationBanner.tsx   — fixed top banner during admin impersonation
  lms/
    CourseManager.tsx       — admin course list with create, reorder
    CourseDetail.tsx        — admin course editor (modules, topics, materials, thumbnail upload)
    CourseViewer.tsx         — student course learning interface
    StudentCourseList.tsx   — student course list (3 sections: in progress, available, completed)
    UserManager.tsx         — user CRUD, search, pagination (10/page), course access, progress view, impersonate
    GroupManager.tsx        — group CRUD, members, leader, group progress
    UsuariosTabs.tsx        — tab switcher: Usuarios | Grupos
    TopicEditor.tsx         — topic content editor
    AsesoriaList.tsx        — advisory session detail view with tasks

prisma/
  schema.prisma    — all data models (see below)
  seed.ts          — seeds courses from tacticomd_structure.json (LearnDash migration)

feeds.yaml         — 21 RSS feed sources across 8 categories
vercel.json        — cron: /api/ingestion/run daily at 00:00 UTC
```

### Data Models

```
NewsItem        — RSS articles: guid (unique), title, summary, url, source, category,
                  type (novedad|evergreen), relevance (alta|media|baja), reason,
                  status (pendiente|para_publicar|descartada|publicada), caption, publishedAt

Setting         — key-value store: linkedin_access_token, linkedin_person_id

User            — email (unique), name, passwordHash, role (alumno|admin),
                  resetToken/Expiry, avatarUrl,
                  extended profile (firstName, lastName, country, city,
                  business profile, social links, diagnostic data, WordPress metadata)
                  → CourseAccess[], TopicProgress[], UserGroupMember[], UserGroup[] (as leader), Asesoria[]

Course          — slug (unique), title, description, content, thumbnail,
                  status (borrador|publicado), isRequired, unlocksAfter, order
                  → CourseModule[], CourseAccess[]

CourseModule    — courseId, slug, title, description, content, order
                  → Topic[]  |  unique(courseId, slug)

Topic           — moduleId, title, description, content, videoUrl, videoProvider, order
                  → Material[], TopicProgress[]

Material        — topicId, name, url, fileType

CourseAccess    — composite PK(userId, courseId), grantedAt
TopicProgress   — composite PK(userId, topicId), completed, completedAt
UserGroup       — name, leaderId → UserGroupMember[]
UserGroupMember — composite PK(groupId, userId), joinedAt

Asesoria        — userId, date, startTime, endTime, duration, recordingUrl,
                  summary (quick summary), fullSummary (detailed notes),
                  → AsesoriaTask[]

AsesoriaTask    — asesoriaId, description, completed, completedAt
```

### Key Data Flows

**News Ingestion Pipeline:**
1. Vercel Cron (daily) or manual button → `POST /api/ingestion/run`
2. Delete old discarded items older than `MAX_ITEM_AGE_DAYS`
3. Fetch all feeds from `feeds.yaml` via rss-parser (parallel)
4. For each new item (dedup by guid): classify via Claude → create NewsItem in DB
5. Dashboard shows items by status tabs; admin generates captions, reviews, publishes to LinkedIn

**Course Learning Flow:**
1. Admin creates Course → Modules → Topics → Materials
2. All published courses are visible to all authenticated users (no CourseAccess gating)
3. Student sees courses in 3 sections: In Progress, Available, Completed
4. Student marks topics complete → TopicProgress upserted
5. Admin views per-user and per-group progress from /usuarios

**Advisory Sessions (Asesorías):**
1. Admin creates Asesoria with summary, fullSummary, recording URL, and tasks
2. Students with asesorías see them in /asesorias with detail view
3. Each session has AsesoriaTask items trackable as completed/pending
4. Sidebar conditionally shows Asesorías/Tareas links only if user has data

**User Profile:**
- Users edit their own profile at /perfil (personal info, avatar, business, social, objective)
- Avatar uploads go to Supabase `thumbnails/avatars/` bucket
- PUT /api/users/[id] accepts all profile fields; users can only edit their own profile

**Community:**
- /comunidad shows two tabs: Miembros (user directory grid with search + profile modal) and WhatsApp
- Profile modal shows public info: name, location, business, objective, social links

**Password Recovery:**
- User requests reset at /recuperar → POST /api/auth/forgot-password
- Generates random token (1h expiry), stores in User.resetToken/resetTokenExpiry
- Sends email via Nodemailer (Google Workspace SMTP) with reset link
- User clicks link → /recuperar/[token] → POST /api/auth/reset-password validates token and updates password

**Authentication & Impersonation:**
- Login: email + bcrypt password → iron-session cookie (name: `alfred_session`)
- Session fields: `authenticated`, `userId`, `userName`, `userRole`
- Impersonation: admin clicks "Ingresar como este usuario" → session stores `originalUserId/Name/Role`, sets `impersonating: true`, switches to student's identity
- All layouts show `ImpersonationBanner` when `session.impersonating === true`
- "Volver a admin" restores original session via `POST /api/auth/stop-impersonate`

**LinkedIn OAuth:**
- Tokens stored in `Setting` table (not in session)
- CSRF: random state stored in session before redirect, verified in callback
- `token_expired` error surfaces as HTTP 401 → frontend prompts reconnect

### Design System

Material Design 3 via Tailwind custom tokens:
- Colors: `md-primary`, `md-secondary`, `md-tertiary`, `md-error`, `md-surface`, `md-on-*`
- Containers: `md-surface-container`, `md-surface-container-lowest`, `md-surface-container-highest`
- Radii: `rounded-md-xl`, `rounded-md-sm`
- Shadows: `shadow-md-1`, `shadow-md-2`, `shadow-md-3`
- Interactive: `state-layer` class for ripple-like hover effects

### Environment Variables

```
NEXT_PUBLIC_BASE_URL          — App base URL
DATABASE_URL                  — Supabase pooler connection
DIRECT_URL                    — Supabase direct connection
SUPABASE_URL                  — Supabase project URL (for storage)
SUPABASE_SERVICE_ROLE_KEY     — Supabase service role (for storage)
SESSION_SECRET_KEY            — 32+ char key for iron-session encryption
ANTHROPIC_API_KEY             — Claude API key
SMTP_USER                     — Google Workspace email for sending (password reset, etc.)
SMTP_PASS                     — Google App Password for SMTP
LINKEDIN_CLIENT_ID            — LinkedIn OAuth (optional)
LINKEDIN_CLIENT_SECRET        — LinkedIn OAuth (optional)
LINKEDIN_REDIRECT_URI         — LinkedIn OAuth callback URL
MAX_ITEM_AGE_DAYS             — RSS item retention window (default: 7)
```

### Sidebar Navigation

**Admin:** Diagnóstico, Ruta de aprendizaje, Cursos, Asesorías, Tareas, Bitácora, Hitos, Alfred, Radar, Usuarios + Mi Perfil, Salir
**Student:** Cursos, Asesorías (if has any), Tareas (if has any), Comunidad + Mi Perfil, Salir
Sidebar props computed server-side via `lib/sidebar-props.ts`

### RSS Feed Categories

SEO/GEO, Publicidad paga, Analítica, IA, Redes sociales, Marketing, Automatización, Growth — 21 feeds total defined in `feeds.yaml`.
