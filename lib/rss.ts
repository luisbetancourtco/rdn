import Parser from 'rss-parser'
import { loadFeeds } from './feeds'

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'Alfred/1.0 RSS Reader' },
})

const MAX_SUMMARY_LENGTH = 800

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export interface RssItem {
  guid: string
  title: string
  summary: string
  url: string
  source: string
  category: string
  publishedAt: Date | null
}

export async function fetchFeed(
  source: string,
  url: string,
  category: string,
  maxAgeDays: number,
): Promise<RssItem[]> {
  try {
    const feed = await parser.parseURL(url)
    const cutoff = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000)
    const items: RssItem[] = []

    for (const entry of feed.items ?? []) {
      const pubDate = entry.pubDate ? new Date(entry.pubDate) : null
      if (pubDate && pubDate < cutoff) continue

      const guid = entry.guid || entry.link || entry.title || ''
      if (!guid) continue

      const rawSummary = entry.contentSnippet || entry.content || entry.summary || ''
      const summary = stripHtml(rawSummary).slice(0, MAX_SUMMARY_LENGTH)

      items.push({
        guid,
        title: entry.title || '(sin título)',
        summary,
        url: entry.link || url,
        source,
        category,
        publishedAt: pubDate,
      })
    }

    return items
  } catch (err) {
    console.error(`[rss] Error fetching ${url}:`, err)
    return []
  }
}

export async function fetchAllFeeds(maxAgeDays = 7): Promise<RssItem[]> {
  const feeds = loadFeeds()
  const results = await Promise.allSettled(
    feeds.map((f) => fetchFeed(f.source, f.url, f.category, maxAgeDays)),
  )
  return results
    .filter((r): r is PromiseFulfilledResult<RssItem[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value)
}
