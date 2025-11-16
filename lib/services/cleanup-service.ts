import { prisma } from "@/lib/prisma"
import { CleanupType } from "@prisma/client"

export interface CleanupResult {
  type: CleanupType
  status: "SUCCESS" | "FAILED" | "PARTIAL"
  itemsDeleted: number
  itemsKept: number
  details: Record<string, string | number | boolean>
  error?: string
  duration: number
}

/**
 * Clean up old RSS scan logs
 * @param retentionDays Number of days to keep (default: 30)
 */
export async function cleanupRssScanLogs(retentionDays: number = 30): Promise<CleanupResult> {
  const startTime = Date.now()
  console.error(
    `[Cleanup Service] Starting RSS scan logs cleanup (retention: ${retentionDays} days)`
  )

  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    // Count items before deletion
    const countBefore = await prisma.rssScanLog.count()
    const toDelete = await prisma.rssScanLog.count({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    })

    console.error(
      `[Cleanup Service] Found ${toDelete} RSS scan logs to delete (out of ${countBefore} total)`
    )

    // Delete old scan logs
    const result = await prisma.rssScanLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    })

    console.error(`[Cleanup Service] Deleted ${result.count} RSS scan logs`)

    const duration = Date.now() - startTime

    const cleanupResult: CleanupResult = {
      type: "RSS_SCAN_LOGS",
      status: "SUCCESS",
      itemsDeleted: result.count,
      itemsKept: toDelete - result.count,
      details: {
        cutoffDate: cutoffDate.toISOString(),
        retentionDays,
      },
      duration,
    }

    // Log cleanup
    await prisma.cleanupLog.create({
      data: {
        type: "RSS_SCAN_LOGS",
        status: "SUCCESS",
        itemsDeleted: result.count,
        itemsKept: 0,
        details: cleanupResult.details,
        duration,
      },
    })

    console.error(`[Cleanup Service] RSS scan logs cleanup completed:`, cleanupResult)
    return cleanupResult
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMsg = error instanceof Error ? error.message : "Unknown error"

    console.error(`[Cleanup Service] RSS scan logs cleanup failed:`, error)

    const cleanupResult: CleanupResult = {
      type: "RSS_SCAN_LOGS",
      status: "FAILED",
      itemsDeleted: 0,
      itemsKept: 0,
      details: {},
      error: errorMsg,
      duration,
    }

    // Log cleanup failure
    try {
      await prisma.cleanupLog.create({
        data: {
          type: "RSS_SCAN_LOGS",
          status: "FAILED",
          itemsDeleted: 0,
          itemsKept: 0,
          error: errorMsg,
          duration,
        },
      })
    } catch (logError) {
      console.error(`[Cleanup Service] Failed to log cleanup:`, logError)
    }

    return cleanupResult
  }
}

/**
 * Clean up old RSS items cache
 * Note: This only deletes RSS cache, not articles
 * @param retentionDays Number of days to keep (default: 30, increased from 7)
 */
export async function cleanupRssItems(retentionDays: number = 30): Promise<CleanupResult> {
  const startTime = Date.now()
  console.error(`[Cleanup Service] Starting RSS items cleanup (retention: ${retentionDays} days)`)

  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    // Count items to be deleted (only processed items older than retention period)
    const toDelete = await prisma.rssItem.count({
      where: {
        processed: true,
        processedAt: {
          lt: cutoffDate,
        },
      },
    })

    // Delete old processed RSS items
    const result = await prisma.rssItem.deleteMany({
      where: {
        processed: true,
        processedAt: {
          lt: cutoffDate,
        },
      },
    })

    const duration = Date.now() - startTime

    const cleanupResult: CleanupResult = {
      type: "RSS_ITEMS",
      status: "SUCCESS",
      itemsDeleted: result.count,
      itemsKept: toDelete - result.count,
      details: {
        cutoffDate: cutoffDate.toISOString(),
        retentionDays,
      },
      duration,
    }

    // Log cleanup
    await prisma.cleanupLog.create({
      data: {
        type: "RSS_ITEMS",
        status: "SUCCESS",
        itemsDeleted: result.count,
        itemsKept: 0,
        details: cleanupResult.details,
        duration,
      },
    })

    console.error(`[Cleanup Service] RSS items cleanup completed:`, cleanupResult)
    return cleanupResult
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMsg = error instanceof Error ? error.message : "Unknown error"

    console.error(`[Cleanup Service] RSS items cleanup failed:`, error)

    const cleanupResult: CleanupResult = {
      type: "RSS_ITEMS",
      status: "FAILED",
      itemsDeleted: 0,
      itemsKept: 0,
      details: {},
      error: errorMsg,
      duration,
    }

    // Log cleanup failure
    try {
      await prisma.cleanupLog.create({
        data: {
          type: "RSS_ITEMS",
          status: "FAILED",
          itemsDeleted: 0,
          itemsKept: 0,
          error: errorMsg,
          duration,
        },
      })
    } catch (logError) {
      console.error(`[Cleanup Service] Failed to log cleanup:`, logError)
    }

    return cleanupResult
  }
}

/**
 * Clean up old unpublished draft articles
 * IMPORTANT: This function ONLY deletes DRAFT articles, never PUBLISHED articles
 * @param retentionDays Number of days to keep (default: 180, increased from 90)
 */
export async function cleanupDraftArticles(retentionDays: number = 180): Promise<CleanupResult> {
  const startTime = Date.now()
  console.error(
    `[Cleanup Service] Starting draft articles cleanup (retention: ${retentionDays} days)`
  )

  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    // Count items to be deleted (only AI-generated drafts older than retention period)
    const toDelete = await prisma.article.count({
      where: {
        status: "DRAFT",
        aiGenerated: true,
        createdAt: {
          lt: cutoffDate,
        },
      },
    })

    // Delete old AI-generated draft articles
    const result = await prisma.article.deleteMany({
      where: {
        status: "DRAFT",
        aiGenerated: true,
        createdAt: {
          lt: cutoffDate,
        },
      },
    })

    const duration = Date.now() - startTime

    const cleanupResult: CleanupResult = {
      type: "DRAFT_ARTICLES",
      status: "SUCCESS",
      itemsDeleted: result.count,
      itemsKept: toDelete - result.count,
      details: {
        cutoffDate: cutoffDate.toISOString(),
        retentionDays,
      },
      duration,
    }

    // Log cleanup
    await prisma.cleanupLog.create({
      data: {
        type: "DRAFT_ARTICLES",
        status: "SUCCESS",
        itemsDeleted: result.count,
        itemsKept: 0,
        details: cleanupResult.details,
        duration,
      },
    })

    console.error(`[Cleanup Service] Draft articles cleanup completed:`, cleanupResult)
    return cleanupResult
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMsg = error instanceof Error ? error.message : "Unknown error"

    console.error(`[Cleanup Service] Draft articles cleanup failed:`, error)

    const cleanupResult: CleanupResult = {
      type: "DRAFT_ARTICLES",
      status: "FAILED",
      itemsDeleted: 0,
      itemsKept: 0,
      details: {},
      error: errorMsg,
      duration,
    }

    // Log cleanup failure
    try {
      await prisma.cleanupLog.create({
        data: {
          type: "DRAFT_ARTICLES",
          status: "FAILED",
          itemsDeleted: 0,
          itemsKept: 0,
          error: errorMsg,
          duration,
        },
      })
    } catch (logError) {
      console.error(`[Cleanup Service] Failed to log cleanup:`, logError)
    }

    return cleanupResult
  }
}

/**
 * Clean up orphaned data (RssItems without articles, etc.)
 */
export async function cleanupOrphanedData(): Promise<CleanupResult> {
  const startTime = Date.now()
  console.error(`[Cleanup Service] Starting orphaned data cleanup`)

  try {
    let totalDeleted = 0

    // Clean up processed RSS items without articles (orphaned)
    const orphanedRssItems = await prisma.rssItem.deleteMany({
      where: {
        processed: true,
        articleId: null,
        processedAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Older than 1 day
        },
      },
    })
    totalDeleted += orphanedRssItems.count

    const duration = Date.now() - startTime

    const cleanupResult: CleanupResult = {
      type: "ORPHANED_DATA",
      status: "SUCCESS",
      itemsDeleted: totalDeleted,
      itemsKept: 0,
      details: {
        orphanedRssItems: orphanedRssItems.count,
      },
      duration,
    }

    // Log cleanup
    await prisma.cleanupLog.create({
      data: {
        type: "ORPHANED_DATA",
        status: "SUCCESS",
        itemsDeleted: totalDeleted,
        itemsKept: 0,
        details: cleanupResult.details,
        duration,
      },
    })

    console.error(`[Cleanup Service] Orphaned data cleanup completed:`, cleanupResult)
    return cleanupResult
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMsg = error instanceof Error ? error.message : "Unknown error"

    console.error(`[Cleanup Service] Orphaned data cleanup failed:`, error)

    const cleanupResult: CleanupResult = {
      type: "ORPHANED_DATA",
      status: "FAILED",
      itemsDeleted: 0,
      itemsKept: 0,
      details: {},
      error: errorMsg,
      duration,
    }

    // Log cleanup failure
    try {
      await prisma.cleanupLog.create({
        data: {
          type: "ORPHANED_DATA",
          status: "FAILED",
          itemsDeleted: 0,
          itemsKept: 0,
          error: errorMsg,
          duration,
        },
      })
    } catch (logError) {
      console.error(`[Cleanup Service] Failed to log cleanup:`, logError)
    }

    return cleanupResult
  }
}

/**
 * Run all cleanup tasks
 */
export async function runAllCleanupTasks(): Promise<CleanupResult[]> {
  console.error(`[Cleanup Service] Starting all cleanup tasks`)

  const results: CleanupResult[] = []

  // Run cleanup tasks sequentially to avoid database overload
  results.push(await cleanupRssScanLogs(30))  // RSS scan logs: 30 days
  results.push(await cleanupRssItems(30))     // RSS items cache: 30 days (increased from 7)
  results.push(await cleanupDraftArticles(180)) // Draft articles: 180 days (increased from 90)
  results.push(await cleanupOrphanedData())   // Orphaned data: 1 day

  const totalDeleted = results.reduce((sum, r) => sum + r.itemsDeleted, 0)
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)

  console.error(`[Cleanup Service] All cleanup tasks completed:`, {
    totalTasks: results.length,
    successful: results.filter((r) => r.status === "SUCCESS").length,
    failed: results.filter((r) => r.status === "FAILED").length,
    totalDeleted,
    totalDuration: `${totalDuration}ms`,
  })

  return results
}
