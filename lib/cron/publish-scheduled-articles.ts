import { prisma } from "@/lib/prisma"

/**
 * Publish scheduled articles that are due
 * This function should be called by a cron job every minute
 */
export async function publishScheduledArticles() {
  try {
    const now = new Date()

    // Find all scheduled articles that are due
    const dueArticles = await prisma.article.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          not: null,
          lte: now
        }
      },
      select: {
        id: true,
        title: true,
        publishedAt: true
      }
    })

    if (dueArticles.length === 0) {
      console.log("[Cron] No scheduled articles to publish")
      return {
        success: true,
        published: 0,
        articles: []
      }
    }

    console.log(`[Cron] Found ${dueArticles.length} articles to publish`)

    // Update all due articles to PUBLISHED status
    const result = await prisma.article.updateMany({
      where: {
        id: {
          in: dueArticles.map(a => a.id)
        },
        status: "SCHEDULED"
      },
      data: {
        status: "PUBLISHED",
        publishedAt: now
      }
    })

    console.log(`[Cron] Successfully published ${result.count} articles`)

    return {
      success: true,
      published: result.count,
      articles: dueArticles.map(a => ({
        id: a.id,
        title: a.title,
        scheduledFor: a.publishedAt
      }))
    }
  } catch (error) {
    console.error("[Cron] Error publishing scheduled articles:", error)
    return {
      success: false,
      published: 0,
      articles: [],
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}
