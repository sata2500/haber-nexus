import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { scanRssFeed } from "@/lib/rss/scanner"

// Vercel Hobby plan max duration: 300 seconds (5 minutes)
export const maxDuration = 300;

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

    // Run scan with timeout (2 minutes max)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Scan timeout - process taking too long')), 120000)
    })
    
    const result = await Promise.race([
      scanRssFeed(id),
      timeoutPromise
    ]) as Awaited<ReturnType<typeof scanRssFeed>>

    return NextResponse.json({
      success: result.status !== "FAILED",
      result,
      message: `Tarama tamamlandı. ${result.itemsFound} öğe bulundu, ${result.itemsProcessed} işlendi, ${result.itemsPublished} yayınlandı.`,
    })
  } catch (error: unknown) {
    console.error("Error scanning RSS feed:", error)
    return NextResponse.json(
      { error: "Failed to scan RSS feed" },
      { status: 500 }
    )
  }
}
