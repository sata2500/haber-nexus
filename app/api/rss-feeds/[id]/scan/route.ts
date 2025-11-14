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
 * Manually trigger RSS feed scan with AI processing
 * POST /api/rss-feeds/[id]/scan
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

    // Run scan
    const result = await scanRssFeed(id)

    return NextResponse.json({
      success: result.status !== "FAILED",
      result,
      message: `Tarama tamamlandı. ${result.itemsFound} öğe bulundu, ${result.itemsProcessed} işlendi, ${result.itemsPublished} yayınlandı.`,
    })
  } catch (error) {
    console.error("Error scanning RSS feed:", error)
    return NextResponse.json(
      { error: "Failed to scan RSS feed" },
      { status: 500 }
    )
  }
}
