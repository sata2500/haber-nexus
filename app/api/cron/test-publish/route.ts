import { NextResponse } from "next/server"
import { publishScheduledArticles } from "@/lib/cron/publish-scheduled-articles"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Test endpoint for manual cron job execution
 * GET /api/cron/test-publish
 * 
 * Only accessible by admins for testing purposes
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Only allow admins to test
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    console.log("[Test Cron] Manual execution started by:", session.user.email)

    // Run the cron job
    const result = await publishScheduledArticles()

    return NextResponse.json({
      message: `Published ${result.published} articles`,
      ...result,
      executedBy: session.user.email,
      executedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("[Test Cron] Error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
