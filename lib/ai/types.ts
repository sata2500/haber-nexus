/**
 * AI Task Types
 */
export interface AiGenerateOptions {
  temperature?: number
  maxTokens?: number
}

export interface AiSummarizeOptions {
  maxLength?: number
  style?: "brief" | "detailed"
}

export interface AiTagOptions {
  maxTags?: number
  existingTags?: string[]
}

export interface AiQualityAnalysis {
  score: number
  reasons: string[]
  suggestions: string[]
}

export type AiContentStyle = "formal" | "casual" | "news" | "blog"

/**
 * RSS Processing Types
 */
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

export interface ProcessedRssItem {
  originalTitle: string
  originalContent: string
  originalLink: string
  
  // AI Generated
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  keywords: string[]
  metaTitle: string
  metaDescription: string
  
  // Analysis
  qualityScore: number
  suggestedCategory?: string
  isSpam: boolean
  
  // Metadata
  publishedAt?: Date
  author?: string
}

/**
 * AI Task Queue Types
 */
export interface AiTaskInput {
  type: "rss_scan" | "content_generate" | "summarize" | "tag_generate" | "quality_check"
  data: Record<string, unknown>
  priority?: number
  maxAttempts?: number
}

export interface AiTaskResult {
  success: boolean
  data?: Record<string, unknown>
  error?: string
}
