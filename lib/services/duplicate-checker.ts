/**
 * Duplicate Content Checker
 * Prevents duplicate articles from being created
 */

import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export interface DuplicateCheckResult {
  isDuplicate: boolean
  existingArticle?: {
    id: string
    title: string
    slug: string
    createdAt: Date
  }
  similarity?: number
  reason?: string
}

/**
 * Generate content hash for duplicate detection
 */
export function generateContentHash(content: string): string {
  // Normalize content: lowercase, remove punctuation, remove extra whitespace
  const normalized = content
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Normalize whitespace

  // Generate SHA-256 hash
  return crypto.createHash("sha256").update(normalized, "utf8").digest("hex")
}

/**
 * Generate title hash for duplicate detection
 */
export function generateTitleHash(title: string): string {
  // Normalize title: lowercase, remove extra whitespace and punctuation
  const normalized = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")

  return crypto.createHash("sha256").update(normalized, "utf8").digest("hex")
}

/**
 * Calculate similarity between two strings (0-1)
 * Uses Jaccard similarity on word sets
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(
    str1
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  )

  const words2 = new Set(
    str2
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  )

  const intersection = new Set([...words1].filter((x) => words2.has(x)))
  const union = new Set([...words1, ...words2])

  return union.size === 0 ? 0 : intersection.size / union.size
}

/**
 * Check if article with same title exists
 */
export async function checkDuplicateByTitle(
  title: string,
  excludeId?: string
): Promise<DuplicateCheckResult> {
  try {
    const titleHash = generateTitleHash(title)

    // Check for exact title hash match
    const existing = await prisma.article.findFirst({
      where: {
        titleHash,
        id: excludeId ? { not: excludeId } : undefined,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
      },
    })

    if (existing) {
      return {
        isDuplicate: true,
        existingArticle: existing,
        similarity: 1.0,
        reason: "Exact title match",
      }
    }

    // Check for similar titles (fuzzy match)
    const recentArticles = await prisma.article.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
        id: excludeId ? { not: excludeId } : undefined,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
      },
      take: 100, // Limit to recent 100 articles for performance
    })

    for (const article of recentArticles) {
      const similarity = calculateSimilarity(title, article.title)

      // If similarity > 80%, consider it a duplicate
      if (similarity > 0.8) {
        return {
          isDuplicate: true,
          existingArticle: article,
          similarity,
          reason: `Similar title (${(similarity * 100).toFixed(1)}% match)`,
        }
      }
    }

    return {
      isDuplicate: false,
    }
  } catch (error) {
    console.error("[Duplicate Checker] Error checking duplicate by title:", error)
    // On error, allow creation (fail open)
    return {
      isDuplicate: false,
      reason: "Error during check, allowing creation",
    }
  }
}

/**
 * Check if article with same content exists
 */
export async function checkDuplicateByContent(
  content: string,
  excludeId?: string
): Promise<DuplicateCheckResult> {
  try {
    const contentHash = generateContentHash(content)

    // Check for exact content hash match
    const existing = await prisma.article.findFirst({
      where: {
        contentHash,
        id: excludeId ? { not: excludeId } : undefined,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
      },
    })

    if (existing) {
      return {
        isDuplicate: true,
        existingArticle: existing,
        similarity: 1.0,
        reason: "Exact content match",
      }
    }

    return {
      isDuplicate: false,
    }
  } catch (error) {
    console.error("[Duplicate Checker] Error checking duplicate by content:", error)
    // On error, allow creation (fail open)
    return {
      isDuplicate: false,
      reason: "Error during check, allowing creation",
    }
  }
}

/**
 * Check if article with same RSS source exists
 */
export async function checkDuplicateByRssSource(
  rssGuid: string,
  rssFeedId: string
): Promise<DuplicateCheckResult> {
  try {
    // Check for existing article from same RSS source
    const existing = await prisma.article.findFirst({
      where: {
        sourceRssId: rssFeedId,
        sourceGuid: rssGuid,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
      },
    })

    if (existing) {
      return {
        isDuplicate: true,
        existingArticle: existing,
        similarity: 1.0,
        reason: "Same RSS source (GUID match)",
      }
    }

    return {
      isDuplicate: false,
    }
  } catch (error) {
    console.error("[Duplicate Checker] Error checking duplicate by RSS source:", error)
    // On error, allow creation (fail open)
    return {
      isDuplicate: false,
      reason: "Error during check, allowing creation",
    }
  }
}

/**
 * Comprehensive duplicate check
 * Checks title, content, and RSS source
 */
export async function checkDuplicate(
  title: string,
  content: string,
  options?: {
    rssGuid?: string
    rssFeedId?: string
    excludeId?: string
  }
): Promise<DuplicateCheckResult> {
  console.error(`[Duplicate Checker] Checking for duplicates: "${title.substring(0, 50)}..."`)

  // 1. Check RSS source first (fastest and most reliable)
  if (options?.rssGuid && options?.rssFeedId) {
    const rssCheck = await checkDuplicateByRssSource(options.rssGuid, options.rssFeedId)
    if (rssCheck.isDuplicate) {
      console.error(`[Duplicate Checker] Duplicate found by RSS source`)
      return rssCheck
    }
  }

  // 2. Check content hash (exact match)
  const contentCheck = await checkDuplicateByContent(content, options?.excludeId)
  if (contentCheck.isDuplicate) {
    console.error(`[Duplicate Checker] Duplicate found by content hash`)
    return contentCheck
  }

  // 3. Check title (exact and fuzzy match)
  const titleCheck = await checkDuplicateByTitle(title, options?.excludeId)
  if (titleCheck.isDuplicate) {
    console.error(
      `[Duplicate Checker] Duplicate found by title (${titleCheck.similarity! * 100}% similarity)`
    )
    return titleCheck
  }

  console.error(`[Duplicate Checker] No duplicates found`)
  return {
    isDuplicate: false,
  }
}

/**
 * Add hash fields to article before saving
 */
export function addHashFields<T extends { title: string; content: string }>(
  article: T
): T & {
  titleHash: string
  contentHash: string
} {
  return {
    ...article,
    titleHash: generateTitleHash(article.title),
    contentHash: generateContentHash(article.content),
  }
}
