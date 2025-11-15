import { NextRequest, NextResponse } from "next/server"
import { publishScheduledArticles } from "@/lib/cron/publish-scheduled-articles"

// Vercel Hobby plan max duration: 300 seconds (5 minutes)
export const maxDuration = 300;

/**
 * Cron job endpoint to publish scheduled articles
 * GET /api/cron/publish-scheduled
 * 
 * This should be called by a cron service (e.g., Vercel Cron, GitHub Actions, or external cron)
 * Authorization: Use CRON_SECRET environment variable for security
 */
export async function GET(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || "your-secret-key"
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Run the cron job
    const result = await publishScheduledArticles()

    return NextResponse.json({
      message: `Published ${result.published} articles`,
      ...result
    })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
