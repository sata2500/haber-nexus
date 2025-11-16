import {
  summarizeContent,
  generateTags,
  generateSeoTitle,
  generateMetaDescription,
  analyzeQuality,
  extractKeywords,
  isSpam,
  rewriteContent,
} from "./gemini"
import { cleanRssContent } from "../rss/parser"
import type { RssItem } from "../rss/parser"

export interface ProcessedContent {
  // Original
  originalTitle: string
  originalContent: string
  originalLink: string
  originalPubDate?: Date

  // Processed
  title: string
  slug: string
  excerpt: string
  content: string

  // SEO
  metaTitle: string
  metaDescription: string
  keywords: string[]

  // Tags
  tags: string[]

  // Quality
  qualityScore: number
  qualityReasons: string[]
  qualitySuggestions: string[]
  isSpam: boolean

  // Metadata
  processedAt: Date
}

/**
 * Process RSS item with AI to create article content
 */
export async function processRssItem(
  item: RssItem,
  options?: {
    rewriteStyle?: "formal" | "casual" | "news" | "blog"
    minQualityScore?: number
    generateNewContent?: boolean
  }
): Promise<ProcessedContent> {
  const minQualityScore = options?.minQualityScore ?? 0.5
  const rewriteStyle = options?.rewriteStyle ?? "news"
  const generateNewContent = options?.generateNewContent ?? false

  // Clean original content
  const cleaned = cleanRssContent(item)

  // Check for spam first
  const spamCheck = await isSpam(cleaned.content)

  if (spamCheck) {
    throw new Error("Content detected as spam")
  }

  // Analyze quality
  const quality = await analyzeQuality(cleaned.content)

  if (quality.score < minQualityScore) {
    throw new Error(`Content quality too low: ${quality.score.toFixed(2)} < ${minQualityScore}`)
  }

  // Generate or rewrite content
  let processedContent = cleaned.content
  if (generateNewContent) {
    processedContent = await rewriteContent(cleaned.content, rewriteStyle)
  }

  // Generate SEO-friendly title
  const seoTitle = await generateSeoTitle(processedContent, cleaned.title)

  // Generate meta description
  const metaDescription = await generateMetaDescription(processedContent)

  // Generate excerpt
  const excerpt = await summarizeContent(processedContent, {
    style: "brief",
    maxLength: 200,
  })

  // Extract keywords
  const keywords = await extractKeywords(processedContent, 10)

  // Generate tags
  const tags = await generateTags(processedContent, { maxTags: 5 })

  // Create slug from title
  const slug = createSlug(seoTitle)

  return {
    originalTitle: cleaned.title,
    originalContent: cleaned.content,
    originalLink: item.link,
    originalPubDate: item.pubDate ? new Date(item.pubDate) : undefined,

    title: seoTitle,
    slug,
    excerpt,
    content: processedContent,

    metaTitle: seoTitle,
    metaDescription,
    keywords,

    tags,

    qualityScore: quality.score,
    qualityReasons: quality.reasons,
    qualitySuggestions: quality.suggestions,
    isSpam: false,

    processedAt: new Date(),
  }
}

/**
 * Create URL-friendly slug from text
 */
export function createSlug(text: string): string {
  // Turkish character mapping
  const turkishMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    I: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  }

  let slug = text.toLowerCase()

  // Replace Turkish characters
  Object.entries(turkishMap).forEach(([turkish, latin]) => {
    slug = slug.replace(new RegExp(turkish, "g"), latin)
  })

  // Remove special characters and replace spaces with hyphens
  slug = slug
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  // Limit length
  if (slug.length > 100) {
    slug = slug.substring(0, 100)
    // Remove trailing hyphen if any
    slug = slug.replace(/-$/, "")
  }

  return slug
}

/**
 * Batch process multiple RSS items
 */
export async function batchProcessRssItems(
  items: RssItem[],
  options?: {
    rewriteStyle?: "formal" | "casual" | "news" | "blog"
    minQualityScore?: number
    generateNewContent?: boolean
    onProgress?: (current: number, total: number) => void
  }
): Promise<{
  successful: ProcessedContent[]
  failed: Array<{ item: RssItem; error: string }>
}> {
  const successful: ProcessedContent[] = []
  const failed: Array<{ item: RssItem; error: string }> = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    try {
      const processed = await processRssItem(item, options)
      successful.push(processed)
    } catch (error) {
      failed.push({
        item,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Report progress
    if (options?.onProgress) {
      options.onProgress(i + 1, items.length)
    }
  }

  return { successful, failed }
}
