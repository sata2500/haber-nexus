import Parser from "rss-parser"

export interface RssItem {
  title: string
  link: string
  content: string
  contentSnippet?: string
  pubDate?: string
  author?: string
  categories?: string[]
  guid?: string
}

export interface RssFeedData {
  title: string
  description?: string
  link: string
  items: RssItem[]
}

/**
 * Parse RSS feed from URL
 */
export async function parseRssFeed(url: string): Promise<RssFeedData> {
  try {
    const parser = new Parser({
      timeout: 10000, // 10 seconds
      headers: {
        "User-Agent": "HaberNexus/1.0",
      },
    })

    const feed = await parser.parseURL(url)

    return {
      title: feed.title || "",
      description: feed.description,
      link: feed.link || url,
      items: feed.items.map((item) => ({
        title: item.title || "",
        link: item.link || "",
        content: item.content || item["content:encoded"] || item.contentSnippet || "",
        contentSnippet: item.contentSnippet,
        pubDate: item.pubDate || item.isoDate,
        author: item.creator || item.author,
        categories: item.categories || [],
        guid: item.guid || item.link,
      })),
    }
  } catch (error) {
    console.error(`Error parsing RSS feed ${url}:`, error)
    throw new Error(
      `Failed to parse RSS feed: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

/**
 * Validate RSS feed URL
 */
export async function validateRssFeed(url: string): Promise<{
  valid: boolean
  error?: string
  itemCount?: number
}> {
  try {
    const feed = await parseRssFeed(url)
    return {
      valid: true,
      itemCount: feed.items.length,
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Extract text content from HTML
 */
export function extractTextFromHtml(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, " ")

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

  // Remove extra whitespace
  text = text.replace(/\s+/g, " ").trim()

  return text
}

/**
 * Clean and normalize RSS item content
 */
export function cleanRssContent(item: RssItem): {
  title: string
  content: string
  excerpt: string
} {
  // Clean title
  const title = item.title.trim()

  // Clean content
  let content = item.content || item.contentSnippet || ""
  content = extractTextFromHtml(content)

  // Create excerpt (first 200 characters)
  const excerpt = content.length > 200 ? content.substring(0, 200).trim() + "..." : content

  return {
    title,
    content,
    excerpt,
  }
}

/**
 * Check if RSS item is duplicate
 */
export function isDuplicateItem(item: RssItem, existingGuids: string[]): boolean {
  if (!item.guid) return false
  return existingGuids.includes(item.guid)
}

/**
 * Filter recent RSS items
 */
export function filterRecentItems(items: RssItem[], maxAgeHours: number = 24): RssItem[] {
  const cutoffDate = new Date()
  cutoffDate.setHours(cutoffDate.getHours() - maxAgeHours)

  return items.filter((item) => {
    if (!item.pubDate) return true // Include if no date

    const itemDate = new Date(item.pubDate)
    return itemDate >= cutoffDate
  })
}
