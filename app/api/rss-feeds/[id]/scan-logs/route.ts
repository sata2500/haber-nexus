import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * Get scan logs for a specific RSS feed
 * GET /api/rss-feeds/[id]/scan-logs
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "EDITOR", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")

    // Get scan logs for this feed
    const scanLogs = await prisma.rssScanLog.findMany({
      where: {
        rssFeedId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      select: {
        id: true,
        status: true,
        itemsFound: true,
        itemsProcessed: true,
        itemsPublished: true,
        error: true,
        duration: true,
        createdAt: true,
      },
    })

    return NextResponse.json(scanLogs)
  } catch (error: unknown) {
    console.error("[Scan Logs API] Error fetching scan logs:", error)
    return NextResponse.json({ error: "Failed to fetch scan logs" }, { status: 500 })
  }
}
