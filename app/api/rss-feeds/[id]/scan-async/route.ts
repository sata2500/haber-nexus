import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { scanRssFeed } from "@/lib/rss/scanner"

// Vercel Hobby plan max duration: 300 seconds (5 minutes)
export const maxDuration = 300

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * Async RSS feed scan - starts scan in background and returns immediately
 * POST /api/rss-feeds/[id]/scan-async
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "EDITOR", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    console.error(`[Async Scan] Starting background scan for feed: ${id}`)

    // Start scan in background (don't await)
    scanRssFeed(id)
      .then((result) => {
        console.error(`[Async Scan] Scan completed for feed ${id}:`, {
          status: result.status,
          itemsFound: result.itemsFound,
          itemsProcessed: result.itemsProcessed,
          itemsPublished: result.itemsPublished,
          duration: result.duration,
          errors: result.errors.length > 0 ? result.errors : "none",
        })
      })
      .catch((error) => {
        console.error(`[Async Scan] Background scan failed for feed ${id}:`, {
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        })
      })

    return NextResponse.json({
      success: true,
      message: "Tarama arka planda başlatıldı. Sonuçları tarama geçmişinden kontrol edebilirsiniz.",
      feedId: id,
    })
  } catch (error: unknown) {
    console.error("[Async Scan] Error starting async scan:", error)
    return NextResponse.json({ error: "Failed to start scan" }, { status: 500 })
  }
}
