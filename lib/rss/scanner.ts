import { prisma } from "@/lib/prisma"
import { parseRssFeed, filterRecentItems } from "./parser"
import { processRssItem, createSlug } from "../ai/processor"
import { getAuthorForRssFeed } from "./auto-author-assignment"

export interface ScanResult {
  feedId: string
  status: "SUCCESS" | "PARTIAL" | "FAILED"
  itemsFound: number
  itemsProcessed: number
  itemsPublished: number
  errors: string[]
  duration: number
}

/**
 * Scan RSS feed and process items with AI
 */
export async function scanRssFeed(feedId: string): Promise<ScanResult> {
  const startTime = Date.now()
  const errors: string[] = []
  let itemsFound = 0
  let itemsProcessed = 0
  let itemsPublished = 0

  try {
    // Get feed configuration
    const feed = await prisma.rssFeed.findUnique({
      where: { id: feedId },
      include: {
        category: true,
      },
    })

    if (!feed) {
      throw new Error("RSS feed not found")
    }

    if (!feed.isActive) {
      throw new Error("RSS feed is not active")
    }

    // Parse RSS feed
    const feedData = await parseRssFeed(feed.url)
    
    // Filter recent items (last 24 hours)
    const recentItems = filterRecentItems(feedData.items, 24)
    itemsFound = recentItems.length

    // Get existing article slugs to avoid duplicates
    const existingArticles = await prisma.article.findMany({
      where: {
        sourceRssId: feedId,
      },
      select: {
        slug: true,
      },
    })
    const existingSlugs = new Set(existingArticles.map(a => a.slug))

    // Process each item
    for (const item of recentItems) {
      try {
        // Process with AI
        const processed = await processRssItem(item, {
          rewriteStyle: "news",
          minQualityScore: feed.minQualityScore,
          generateNewContent: true,
        })

        // Check for duplicate slug
        if (existingSlugs.has(processed.slug)) {
          // Add timestamp to make it unique
          processed.slug = `${processed.slug}-${Date.now()}`
        }

        // Create or find tags
        const tagIds: string[] = []
        for (const tagName of processed.tags) {
          const tagSlug = createSlug(tagName)
          
          // Find or create tag
          const tag = await prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {
              useCount: { increment: 1 },
            },
            create: {
              slug: tagSlug,
              name: tagName,
              useCount: 1,
            },
          })
          
          tagIds.push(tag.id)
        }

        // Get author using auto-assignment or default
        const authorId = await getAuthorForRssFeed(feedId, feed.categoryId || undefined)
        
        if (!authorId) {
          throw new Error("No suitable author found for article creation")
        }

        // Determine status based on autoPublish setting
        const status = feed.autoPublish ? "PUBLISHED" : "DRAFT"

        // Create article
        await prisma.article.create({
          data: {
            slug: processed.slug,
            title: processed.title,
            excerpt: processed.excerpt,
            content: processed.content,
            coverImage: null, // TODO: Extract image from content or use AI to generate
            
            type: "NEWS",
            status,
            ...(feed.categoryId && { categoryId: feed.categoryId }),
            
            authorId: authorId,
            
            aiGenerated: true,
            aiSummary: processed.excerpt,
            aiTags: processed.tags,
            sourceRssId: feedId,
            
            metaTitle: processed.metaTitle,
            metaDescription: processed.metaDescription,
            keywords: processed.keywords,
            
            publishedAt: status === "PUBLISHED" ? new Date() : null,
            
            tags: {
              connect: tagIds.map(id => ({ id })),
            },
          },
        })

        itemsProcessed++
        if (status === "PUBLISHED") {
          itemsPublished++
        }
        
        existingSlugs.add(processed.slug)
      } catch (itemError) {
        const errorMsg = itemError instanceof Error ? itemError.message : "Unknown error"
        errors.push(`Failed to process item "${item.title}": ${errorMsg}`)
        console.error("Error processing RSS item:", itemError)
      }
    }

    // Update feed stats
    await prisma.rssFeed.update({
      where: { id: feedId },
      data: {
        lastScannedAt: new Date(),
        totalScans: { increment: 1 },
        totalArticles: { increment: itemsPublished },
        successRate: errors.length === 0 ? 1.0 : Math.max(0, 1 - (errors.length / itemsFound)),
      },
    })

    const duration = Date.now() - startTime

    // Create scan log
    const status = errors.length === 0 ? "SUCCESS" : (itemsProcessed > 0 ? "PARTIAL" : "FAILED")
    
    await prisma.rssScanLog.create({
      data: {
        rssFeedId: feedId,
        status,
        itemsFound,
        itemsProcessed,
        itemsPublished,
        error: errors.length > 0 ? errors.join("\n") : null,
        duration,
      },
    })

    return {
      feedId,
      status,
      itemsFound,
      itemsProcessed,
      itemsPublished,
      errors,
      duration,
    }
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    
    // Create failed scan log
    await prisma.rssScanLog.create({
      data: {
        rssFeedId: feedId,
        status: "FAILED",
        itemsFound,
        itemsProcessed,
        itemsPublished,
        error: errorMsg,
        duration,
      },
    })

    return {
      feedId,
      status: "FAILED",
      itemsFound,
      itemsProcessed,
      itemsPublished,
      errors: [errorMsg],
      duration,
    }
  }
}

/**
 * Scan all active RSS feeds
 */
export async function scanAllFeeds(): Promise<ScanResult[]> {
  const feeds = await prisma.rssFeed.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      priority: "desc",
    },
  })

  const results: ScanResult[] = []

  for (const feed of feeds) {
    try {
      const result = await scanRssFeed(feed.id)
      results.push(result)
    } catch (error) {
      console.error(`Error scanning feed ${feed.name}:`, error)
      results.push({
        feedId: feed.id,
        status: "FAILED",
        itemsFound: 0,
        itemsProcessed: 0,
        itemsPublished: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        duration: 0,
      })
    }
  }

  return results
}
