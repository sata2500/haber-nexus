import { NextRequest, NextResponse } from "next/server"
import { scanAllFeedsEnhanced } from "@/lib/rss/enhanced-scanner"

export const maxDuration = 300 // 5 minutes max for Vercel

/**
 * Cron endpoint for automated RSS scanning
 * POST /api/cron/rss-scan
 *
 * This endpoint is called by GitHub Actions every 2 hours
 * Authentication: Bearer token (CRON_SECRET)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("Authorization")
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error("[Cron RSS Scan] CRON_SECRET not configured")
      return NextResponse.json({ error: "Cron secret not configured" }, { status: 500 })
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error("[Cron RSS Scan] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.error("[Cron RSS Scan] Starting automated RSS scan")

    // Run enhanced scan for all active feeds
    const results = await scanAllFeedsEnhanced()

    // Calculate summary statistics
    const summary = {
      totalFeeds: results.length,
      successful: results.filter((r) => r.status === "SUCCESS").length,
      partial: results.filter((r) => r.status === "PARTIAL").length,
      failed: results.filter((r) => r.status === "FAILED").length,
      totalItemsFound: results.reduce((sum, r) => sum + r.itemsFound, 0),
      totalItemsNew: results.reduce((sum, r) => sum + r.itemsNew, 0),
      totalItemsDuplicate: results.reduce((sum, r) => sum + r.itemsDuplicate, 0),
      totalItemsProcessed: results.reduce((sum, r) => sum + r.itemsProcessed, 0),
      totalItemsPublished: results.reduce((sum, r) => sum + r.itemsPublished, 0),
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
      timestamp: new Date().toISOString(),
    }

    console.error("[Cron RSS Scan] Automated RSS scan completed:", summary)

    return NextResponse.json({
      success: true,
      message: "RSS scan completed successfully",
      summary,
      results: results.map((r) => ({
        feedId: r.feedId,
        status: r.status,
        itemsProcessed: r.itemsProcessed,
        itemsPublished: r.itemsPublished,
        errors: r.errors.length,
      })),
    })
  } catch (error: unknown) {
    console.error("[Cron RSS Scan] Error during automated scan:", error)
    return NextResponse.json(
      {
        error: "Failed to complete RSS scan",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint for manual testing (requires admin authentication)
 */
export async function GET(request: NextRequest) {
  try {
    // Check if this is a test request
    const testHeader = request.headers.get("X-Test-Request")

    if (testHeader !== "true") {
      return NextResponse.json(
        { error: "Method not allowed. Use POST for cron execution." },
        { status: 405 }
      )
    }

    return NextResponse.json({
      message: "RSS Scan Cron Endpoint",
      description: "This endpoint is called by GitHub Actions every 2 hours to scan RSS feeds",
      usage: "POST /api/cron/rss-scan with Authorization: Bearer <CRON_SECRET>",
      status: "ready",
    })
  } catch (_error: unknown) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
