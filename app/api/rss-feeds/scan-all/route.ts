import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { scanAllFeeds } from "@/lib/rss/scanner"

/**
 * Scan all active RSS feeds
 * POST /api/rss-feeds/scan-all
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Run scan for all feeds
    const results = await scanAllFeeds()

    const totalFound = results.reduce((sum, r) => sum + r.itemsFound, 0)
    const totalProcessed = results.reduce((sum, r) => sum + r.itemsProcessed, 0)
    const totalPublished = results.reduce((sum, r) => sum + r.itemsPublished, 0)
    const successCount = results.filter(r => r.status === "SUCCESS").length
    const failedCount = results.filter(r => r.status === "FAILED").length

    return NextResponse.json({
      success: true,
      results,
      summary: {
        totalFeeds: results.length,
        successCount,
        failedCount,
        totalFound,
        totalProcessed,
        totalPublished,
      },
      message: `${results.length} feed tarandı. ${totalFound} öğe bulundu, ${totalProcessed} işlendi, ${totalPublished} yayınlandı.`,
    })
  } catch (error) {
    console.error("Error scanning all RSS feeds:", error)
    return NextResponse.json(
      { error: "Failed to scan RSS feeds" },
      { status: 500 }
    )
  }
}
