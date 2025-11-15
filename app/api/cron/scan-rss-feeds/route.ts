import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { scanRssFeed } from "@/lib/rss/scanner"

/**
 * Cron job to automatically scan RSS feeds based on their scanInterval
 * GET /api/cron/scan-rss-feeds
 * 
 * This endpoint should be called by Vercel Cron or external cron service
 * Authorization: Bearer token in CRON_SECRET environment variable
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const now = new Date()
    const results: Array<{
      feedId: string
      feedName: string
      status: string
      itemsProcessed: number
      itemsPublished: number
      error?: string
    }> = []

    // Get all active RSS feeds
    const feeds = await prisma.rssFeed.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        priority: "desc",
      },
    })

    console.log(`[RSS Cron] Found ${feeds.length} active RSS feeds`)

    // Process each feed based on its scan interval
    for (const feed of feeds) {
      try {
        // Check if feed should be scanned based on scanInterval
        const shouldScan = !feed.lastScannedAt || 
          (now.getTime() - feed.lastScannedAt.getTime()) >= (feed.scanInterval * 60 * 1000)

        if (!shouldScan) {
          console.log(`[RSS Cron] Skipping feed ${feed.name} - not due for scan yet`)
          continue
        }

        console.log(`[RSS Cron] Scanning feed: ${feed.name}`)

        // Scan the feed
        const result = await scanRssFeed(feed.id)

        results.push({
          feedId: feed.id,
          feedName: feed.name,
          status: result.status,
          itemsProcessed: result.itemsProcessed,
          itemsPublished: result.itemsPublished,
          error: result.errors.length > 0 ? result.errors.join(", ") : undefined,
        })

        console.log(`[RSS Cron] Completed feed ${feed.name}: ${result.itemsProcessed} processed, ${result.itemsPublished} published`)

        // Add delay between feeds to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error"
        console.error(`[RSS Cron] Error scanning feed ${feed.name}:`, error)
        
        results.push({
          feedId: feed.id,
          feedName: feed.name,
          status: "FAILED",
          itemsProcessed: 0,
          itemsPublished: 0,
          error: errorMsg,
        })
      }
    }

    // Summary
    const summary = {
      totalFeeds: feeds.length,
      scannedFeeds: results.length,
      successfulScans: results.filter(r => r.status === "SUCCESS").length,
      failedScans: results.filter(r => r.status === "FAILED").length,
      totalItemsProcessed: results.reduce((sum, r) => sum + r.itemsProcessed, 0),
      totalItemsPublished: results.reduce((sum, r) => sum + r.itemsPublished, 0),
    }

    console.log(`[RSS Cron] Summary:`, summary)

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      summary,
      results,
    })
  } catch (error) {
    console.error("[RSS Cron] Fatal error:", error)
    return NextResponse.json(
      { 
        error: "Failed to run RSS scan cron job",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
