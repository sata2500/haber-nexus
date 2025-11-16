import { NextRequest, NextResponse } from "next/server"
import { runAllCleanupTasks } from "@/lib/services/cleanup-service"

export const maxDuration = 300 // 5 minutes max for Vercel

/**
 * Cron endpoint for automated database cleanup
 * POST /api/cron/cleanup
 *
 * This endpoint is called by GitHub Actions daily
 * Authentication: Bearer token (CRON_SECRET)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("Authorization")
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error("[Cron Cleanup] CRON_SECRET not configured")
      return NextResponse.json({ error: "Cron secret not configured" }, { status: 500 })
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error("[Cron Cleanup] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.error("[Cron Cleanup] Starting automated cleanup")

    // Run all cleanup tasks
    const results = await runAllCleanupTasks()

    // Calculate summary statistics
    const summary = {
      totalTasks: results.length,
      successful: results.filter((r) => r.status === "SUCCESS").length,
      failed: results.filter((r) => r.status === "FAILED").length,
      totalItemsDeleted: results.reduce((sum, r) => sum + r.itemsDeleted, 0),
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
      timestamp: new Date().toISOString(),
    }

    console.error("[Cron Cleanup] Automated cleanup completed:", summary)

    return NextResponse.json({
      success: true,
      message: "Cleanup completed successfully",
      summary,
      results: results.map((r) => ({
        type: r.type,
        status: r.status,
        itemsDeleted: r.itemsDeleted,
        error: r.error,
      })),
    })
  } catch (error: unknown) {
    console.error("[Cron Cleanup] Error during automated cleanup:", error)
    return NextResponse.json(
      {
        error: "Failed to complete cleanup",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint for manual testing
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
      message: "Cleanup Cron Endpoint",
      description: "This endpoint is called by GitHub Actions daily to clean up old data",
      usage: "POST /api/cron/cleanup with Authorization: Bearer <CRON_SECRET>",
      status: "ready",
    })
  } catch (_error: unknown) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
