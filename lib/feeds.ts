import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

interface Feed {
  source: string
  url: string
  category: string
}

interface FeedsConfig {
  feeds: Feed[]
}

export function loadFeeds(): Feed[] {
  const feedsPath = path.join(process.cwd(), 'feeds.yaml')
  const content = fs.readFileSync(feedsPath, 'utf8')
  const config = yaml.load(content) as FeedsConfig
  return config.feeds
}
