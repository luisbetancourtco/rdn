import { prisma } from './prisma'
import { fetchAllFeeds } from './rss'
import { classifyItem } from './classifier'

export async function runIngestion(maxAgeDays = 7): Promise<{ created: number; skipped: number }> {
  const items = await fetchAllFeeds(maxAgeDays)
  let created = 0
  let skipped = 0

  for (const item of items) {
    const exists = await prisma.newsItem.findUnique({ where: { guid: item.guid } })
    if (exists) {
      skipped++
      continue
    }

    const classification = await classifyItem(item.title, item.summary)

    await prisma.newsItem.create({
      data: {
        guid: item.guid,
        title: item.title,
        summary: item.summary,
        url: item.url,
        source: item.source,
        category: item.category,
        type: classification?.type ?? null,
        relevance: classification?.relevance ?? null,
        reason: classification?.reason ?? null,
        publishedAt: item.publishedAt,
      },
    })
    created++
  }

  return { created, skipped }
}
