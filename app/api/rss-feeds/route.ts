import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateRssFeed } from "@/lib/rss/parser"

/**
 * Get all RSS feeds
 * GET /api/rss-feeds
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "EDITOR", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("includeInactive") === "true"

    const feeds = await prisma.rssFeed.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            articles: true,
            scanLogs: true,
          },
        },
      },
      orderBy: [{ priority: "desc" }, { name: "asc" }],
    })

    return NextResponse.json(feeds, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    })
  } catch (error: unknown) {
    console.error("Error fetching RSS feeds:", error)
    return NextResponse.json({ error: "Failed to fetch RSS feeds" }, { status: 500 })
  }
}

/**
 * Create new RSS feed
 * POST /api/rss-feeds
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      url,
      description,
      categoryId,
      scanInterval,
      priority,
      minQualityScore,
      autoPublish,
    } = body

    // Validate required fields
    if (!name || !url) {
      return NextResponse.json({ error: "Name and URL are required" }, { status: 400 })
    }

    // Validate RSS feed URL
    const validation = await validateRssFeed(url)
    if (!validation.valid) {
      return NextResponse.json({ error: `Invalid RSS feed: ${validation.error}` }, { status: 400 })
    }

    // Check if URL already exists
    const existing = await prisma.rssFeed.findUnique({
      where: { url },
    })

    if (existing) {
      return NextResponse.json({ error: "RSS feed with this URL already exists" }, { status: 409 })
    }

    // Create RSS feed
    const feed = await prisma.rssFeed.create({
      data: {
        name,
        url,
        description: description || null,
        categoryId: categoryId || null,
        scanInterval: scanInterval || 60,
        priority: priority || 1,
        minQualityScore: minQualityScore || 0.5,
        autoPublish: autoPublish || false,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(feed, { status: 201 })
  } catch (error: unknown) {
    console.error("Error creating RSS feed:", error)
    return NextResponse.json({ error: "Failed to create RSS feed" }, { status: 500 })
  }
}
