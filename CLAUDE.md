# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- Frontend and backend: Next.js 14 (App Router) + TypeScript
- Database: Supabase (PostgreSQL)
- ORM: Prisma
- Styles: Tailwind CSS
- Deploy: Vercel

## Commands

```bash
# Install dependencies
npm install

# Copy and fill in credentials
cp .env.example .env

# Push schema to Supabase
npm run db:push

# Run development server
npm run dev

# Trigger a one-off ingestion via curl (app must be running)
curl -X POST http://localhost:3000/api/ingestion/run \
  -H "Cookie: radar_session=<your-session-cookie>"
```

There is no test suite yet.

## Architecture

**Stack:** Next.js 14 App Router + TypeScript + Supabase (PostgreSQL) + Prisma + Tailwind CSS + iron-session + Anthropic SDK.

```
app/
  page.tsx                  — root redirect (→ /dashboard or /login)
  layout.tsx                — HTML shell, global CSS
  login/
    page.tsx                — login page (server component)
    LoginForm.tsx           — password form (client component)
  dashboard/
    page.tsx                — fetches all items + LinkedIn status, renders Dashboard
  api/
    auth/login/route.ts     — POST: verify password, set session
    auth/logout/route.ts    — POST: destroy session
    ingestion/run/route.ts  — POST: fetch feeds → classify → persist
    news/[id]/
      generate-caption/     — POST: Claude generates LinkedIn caption
      save-caption/         — POST: persist caption text
      status/               — POST: change item status
      publish/              — POST: post to LinkedIn via ugcPosts API
    linkedin/
      connect/route.ts      — GET: initiate OAuth (stores CSRF state in session)
      callback/route.ts     — GET: exchange code, save tokens to DB
      disconnect/route.ts   — POST: remove LinkedIn tokens from DB
lib/
  prisma.ts       — singleton PrismaClient
  session.ts      — iron-session helpers (SessionData interface + getSession())
  feeds.ts        — load feeds.yaml
  rss.ts          — fetch + parse RSS feeds (rss-parser), strip HTML, age filter
  classifier.ts   — Claude call → {type, relevance, reason} JSON
  caption.ts      — Claude call with Luis Betancourt's system prompt → post text
  linkedin.ts     — OAuth helpers + ugcPosts API call
  ingestion.ts    — orchestrates rss → classify → db insert
components/
  Dashboard.tsx   — client component: tabs, filters, toasts, LinkedIn connect/disconnect
  NewsCard.tsx    — client component: caption workflow, status buttons, publish button
prisma/
  schema.prisma   — NewsItem + Setting models
feeds.yaml        — RSS feed sources (21 feeds across 8 categories)
vercel.json       — Vercel cron: runs ingestion every 12 hours
```

**Data flow:**
1. Vercel Cron (every 12h) or manual button calls `POST /api/ingestion/run`.
2. Each feed in `feeds.yaml` is fetched with rss-parser; items older than `MAX_ITEM_AGE_DAYS` are dropped; duplicates checked by `guid`.
3. Each new item is classified via Claude (`lib/classifier.ts`) — failures stored as `null`.
4. Items land in the DB with `status = "pendiente"`.
5. Dashboard is a Server Component that passes all items to the `<Dashboard>` Client Component.
6. Filtering and tab switching happen client-side. Caption generation, status changes, and LinkedIn publishing are fetch calls to API routes.

**LinkedIn OAuth:**
- Tokens (`access_token`, `person_id`) are stored in the `Setting` table.
- CSRF protection: a random `state` token is stored in the iron-session before redirecting; verified in the callback.
- A `token_expired` error from `linkedin.ts` surfaces as HTTP 401, prompting the frontend to show a "reconnect" message.

**Authentication:**
- Single-password auth via `APP_PASSWORD` env var.
- Session managed by iron-session (encrypted cookie, 30-day expiry).

**Configuration:**
- All feeds are in `feeds.yaml` — edit to add/remove sources.
- All secrets are in `.env` — never commit it.
- LinkedIn integration is optional; the connect button only appears when `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` are set.
