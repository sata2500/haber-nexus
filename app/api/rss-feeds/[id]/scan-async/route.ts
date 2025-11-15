import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { scanRssFeed } from "@/lib/rss/scanner"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * Async RSS feed scan - starts scan in background and returns immediately
 * POST /api/rss-feeds/[id]/scan-async
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "EDITOR", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Start scan in background (don't await)
    scanRssFeed(id).catch(error => {
      console.error("[Async Scan] Background scan failed:", error)
    })

    return NextResponse.json({
      success: true,
      message: "Tarama arka planda başlatıldı. Sonuçları tarama geçmişinden kontrol edebilirsiniz.",
      feedId: id,
    })
  } catch (error) {
    console.error("Error starting async scan:", error)
    return NextResponse.json(
      { error: "Failed to start scan" },
      { status: 500 }
    )
  }
}
