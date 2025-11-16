import { prisma } from "@/lib/prisma"
import { parseRssFeed } from "./parser"
import { processRssItem, createSlug } from "../ai/processor"
import { getAuthorForRssFeed } from "./auto-author-assignment"
import crypto from "crypto"

export interface EnhancedScanResult {
  feedId: string
  status: "SUCCESS" | "PARTIAL" | "FAILED"
  itemsFound: number
  itemsNew: number
  itemsDuplicate: number
  itemsProcessed: number
  itemsPublished: number
  errors: string[]
  duration: number
}

/**
 * Generate URL hash for duplicate detection
 */
function generateUrlHash(url: string): string {
  return crypto.createHash("sha256").update(url).digest("hex")
}

/**
 * Enhanced RSS feed scanner with duplicate detection and incremental scanning
 * @param feedId - RSS feed ID to scan
 * @param retryCount - Current retry attempt (default: 0)
 */
export async function enhancedScanRssFeed(
  feedId: string,
  retryCount: number = 0
): Promise<EnhancedScanResult> {
  const startTime = Date.now()
  const errors: string[] = []
  let itemsFound = 0
  let itemsNew = 0
  let itemsDuplicate = 0
  let itemsProcessed = 0
  let itemsPublished = 0

  console.error(`[Enhanced Scanner] Starting scan for feed: ${feedId}`)

  try {
    // Get feed configuration
    const feed = await prisma.rssFeed.findUnique({
      where: { id: feedId },
      include: {
        category: true,
      },
    })

    if (!feed) {
      console.error(`[Enhanced Scanner] Feed not found: ${feedId}`)
      throw new Error("RSS feed not found")
    }

    if (!feed.isActive) {
      console.warn(`[Enhanced Scanner] Feed is not active: ${feed.name} (${feedId})`)
      throw new Error("RSS feed is not active")
    }

    console.error(`[Enhanced Scanner] Feed found: ${feed.name}, URL: ${feed.url}`)

    // Parse RSS feed with retry logic
    console.error(`[Enhanced Scanner] Parsing RSS feed: ${feed.url}`)
    let feedData
    try {
      feedData = await parseRssFeed(feed.url)
      itemsFound = feedData.items.length
      console.error(`[Enhanced Scanner] Feed parsed successfully. Total items: ${itemsFound}`)
    } catch (parseError) {
      // Retry once if parsing fails
      if (retryCount < 1) {
        console.error(`[Enhanced Scanner] Parse failed, retrying... (attempt ${retryCount + 1})`)
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds
        return enhancedScanRssFeed(feedId, retryCount + 1)
      }
      throw parseError
    }

    // Incremental scanning: Filter items newer than lastItemDate
    let itemsToProcess = feedData.items
    if (feed.lastItemDate) {
      itemsToProcess = feedData.items.filter(
        (item) => item.pubDate && new Date(item.pubDate) > feed.lastItemDate!
      )
      console.error(
        `[Enhanced Scanner] Incremental scan: ${itemsToProcess.length} new items since ${feed.lastItemDate}`
      )
    }

    // Get existing URL hashes to detect duplicates
    const existingHashes = await prisma.rssItem.findMany({
      where: {
        rssFeedId: feedId,
      },
      select: {
        urlHash: true,
        guid: true,
      },
    })
    const existingHashSet = new Set(existingHashes.map((item) => item.urlHash))
    const existingGuidSet = new Set(existingHashes.map((item) => item.guid))

    console.error(
      `[Enhanced Scanner] Processing ${itemsToProcess.length} items from feed: ${feed.name}`
    )

    // Track latest item date for incremental scanning
    let latestItemDate = feed.lastItemDate || new Date(0)

    // Process each item
    for (let i = 0; i < itemsToProcess.length; i++) {
      const item = itemsToProcess[i]

      console.error(
        `[Enhanced Scanner] Processing item ${i + 1}/${itemsToProcess.length}: ${item.title}`
      )

      try {
        // Skip items without pubDate
        if (!item.pubDate) {
          console.error(`[Enhanced Scanner] Skipping item without pubDate: ${item.title}`)
          continue
        }

        const itemPubDate = new Date(item.pubDate)

        // Update latest item date
        if (itemPubDate > latestItemDate) {
          latestItemDate = itemPubDate
        }

        // Generate URL hash for duplicate detection
        const urlHash = generateUrlHash(item.link)
        const guid = item.guid || item.link

        // Check for duplicates
        if (existingHashSet.has(urlHash) || existingGuidSet.has(guid)) {
          console.error(`[Enhanced Scanner] Duplicate detected: ${item.title}`)
          itemsDuplicate++
          continue
        }

        // Create RssItem cache entry
        const rssItem = await prisma.rssItem.create({
          data: {
            rssFeedId: feedId,
            guid,
            urlHash,
            title: item.title,
            link: item.link,
            description: item.contentSnippet || item.content || null,
            pubDate: itemPubDate,
            processed: false,
          },
        })

        itemsNew++

        // Process with AI with per-item timeout (2 minutes)
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Item processing timeout")), 120000)
        })

        const processed = await Promise.race([
          processRssItem(item, {
            rewriteStyle: "news",
            minQualityScore: feed.minQualityScore,
            generateNewContent: true,
          }),
          timeoutPromise,
        ])

        // Create or find tags
        const tagIds: string[] = []
        for (const tagName of processed.tags) {
          const tagSlug = createSlug(tagName)

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
          console.error(`[Enhanced Scanner] No suitable author found for feed: ${feed.name}`)
          throw new Error("No suitable author found for article creation")
        }

        // Determine status based on autoPublish setting
        const status = feed.autoPublish ? "PUBLISHED" : "DRAFT"

        // Create article
        const article = await prisma.article.create({
          data: {
            slug: processed.slug,
            title: processed.title,
            excerpt: processed.excerpt,
            content: processed.content,
            coverImage: null,

            type: "NEWS",
            status,
            ...(feed.categoryId && { categoryId: feed.categoryId }),

            authorId: authorId,

            aiGenerated: true,
            aiSummary: processed.excerpt,
            aiTags: processed.tags,
            sourceRssId: feedId,
            sourceGuid: guid,

            metaTitle: processed.metaTitle,
            metaDescription: processed.metaDescription,
            keywords: processed.keywords,

            publishedAt: status === "PUBLISHED" ? new Date() : null,

            tags: {
              connect: tagIds.map((id) => ({ id })),
            },
          },
        })

        // Update RssItem with article reference
        await prisma.rssItem.update({
          where: { id: rssItem.id },
          data: {
            processed: true,
            processedAt: new Date(),
            articleId: article.id,
          },
        })

        itemsProcessed++
        if (status === "PUBLISHED") {
          itemsPublished++
        }

        console.error(
          `[Enhanced Scanner] Progress: ${itemsProcessed}/${itemsNew} processed, ${itemsPublished} published, ${itemsDuplicate} duplicates`
        )

        // Add to existing sets to prevent duplicates in same scan
        existingHashSet.add(urlHash)
        existingGuidSet.add(guid)
      } catch (itemError) {
        const errorMsg = itemError instanceof Error ? itemError.message : "Unknown error"
        const errorStack = itemError instanceof Error ? itemError.stack : undefined
        errors.push(`Failed to process item "${item.title}": ${errorMsg}`)
        console.error(`[Enhanced Scanner] Error processing item "${item.title}":`, {
          error: errorMsg,
          stack: errorStack,
        })
      }
    }

    // Update feed stats
    // Calculate success rate: (items processed successfully) / (new items found)
    const successRate =
      itemsNew === 0
        ? 1.0 // No new items found is not a failure
        : itemsProcessed / itemsNew

    await prisma.rssFeed.update({
      where: { id: feedId },
      data: {
        lastScannedAt: new Date(),
        lastItemDate: latestItemDate,
        totalScans: { increment: 1 },
        totalArticles: { increment: itemsPublished },
        successRate,
      },
    })

    const duration = Date.now() - startTime

    // Create scan log
    const status = errors.length === 0 ? "SUCCESS" : itemsProcessed > 0 ? "PARTIAL" : "FAILED"

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

    console.error(`[Enhanced Scanner] Scan completed for feed ${feedId}:`, {
      status,
      itemsFound,
      itemsNew,
      itemsDuplicate,
      itemsProcessed,
      itemsPublished,
      duration: `${duration}ms`,
      errors: errors.length,
    })

    return {
      feedId,
      status,
      itemsFound,
      itemsNew,
      itemsDuplicate,
      itemsProcessed,
      itemsPublished,
      errors,
      duration,
    }
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : undefined

    console.error(`[Enhanced Scanner] Fatal error during scan for feed ${feedId}:`, {
      error: errorMsg,
      stack: errorStack,
      itemsFound,
      itemsNew,
      itemsDuplicate,
      itemsProcessed,
      itemsPublished,
      duration: `${duration}ms`,
    })

    // Create failed scan log
    try {
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
    } catch (logError) {
      console.error(`[Enhanced Scanner] Failed to create scan log:`, logError)
    }

    return {
      feedId,
      status: "FAILED",
      itemsFound,
      itemsNew,
      itemsDuplicate,
      itemsProcessed,
      itemsPublished,
      errors: [errorMsg],
      duration,
    }
  }
}

/**
 * Scan all active RSS feeds with enhanced features
 */
export async function scanAllFeedsEnhanced(): Promise<EnhancedScanResult[]> {
  const feeds = await prisma.rssFeed.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      priority: "desc",
    },
  })

  console.error(`[Enhanced Scanner] Starting batch scan for ${feeds.length} feeds`)

  const results: EnhancedScanResult[] = []

  // Process feeds in batches of 3 to avoid overload
  const BATCH_SIZE = 3
  for (let i = 0; i < feeds.length; i += BATCH_SIZE) {
    const batch = feeds.slice(i, i + BATCH_SIZE)
    console.error(
      `[Enhanced Scanner] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(feeds.length / BATCH_SIZE)}`
    )

    const batchResults = await Promise.allSettled(batch.map((feed) => enhancedScanRssFeed(feed.id)))

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j]
      const feed = batch[j]

      if (result.status === "fulfilled") {
        results.push(result.value)
      } else {
        console.error(`[Enhanced Scanner] Error scanning feed ${feed.name}:`, result.reason)
        results.push({
          feedId: feed.id,
          status: "FAILED",
          itemsFound: 0,
          itemsNew: 0,
          itemsDuplicate: 0,
          itemsProcessed: 0,
          itemsPublished: 0,
          errors: [result.reason instanceof Error ? result.reason.message : "Unknown error"],
          duration: 0,
        })
      }
    }
  }

  console.error(`[Enhanced Scanner] Batch scan completed:`, {
    totalFeeds: feeds.length,
    successful: results.filter((r) => r.status === "SUCCESS").length,
    partial: results.filter((r) => r.status === "PARTIAL").length,
    failed: results.filter((r) => r.status === "FAILED").length,
    totalItemsProcessed: results.reduce((sum, r) => sum + r.itemsProcessed, 0),
    totalItemsPublished: results.reduce((sum, r) => sum + r.itemsPublished, 0),
  })

  return results
}
