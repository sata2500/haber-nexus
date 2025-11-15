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
 * Get RSS feed by ID
 * GET /api/rss-feeds/[id]
 */
export async function GET(
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

    const feed = await prisma.rssFeed.findUnique({
      where: { id },
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
    })

    if (!feed) {
      return NextResponse.json(
        { error: "RSS feed not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(feed, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    })
  } catch (error) {
    console.error("Error fetching RSS feed:", error)
    return NextResponse.json(
      { error: "Failed to fetch RSS feed" },
      { status: 500 }
    )
  }
}

/**
 * Update RSS feed
 * PATCH /api/rss-feeds/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const {
      name,
      url,
      description,
      categoryId,
      isActive,
      scanInterval,
      priority,
      minQualityScore,
      autoPublish,
    } = body

    // Check if feed exists
    const existing = await prisma.rssFeed.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "RSS feed not found" },
        { status: 404 }
      )
    }

    // Update feed
    const feed = await prisma.rssFeed.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(url !== undefined && { url }),
        ...(description !== undefined && { description }),
        ...(categoryId !== undefined && { categoryId }),
        ...(isActive !== undefined && { isActive }),
        ...(scanInterval !== undefined && { scanInterval }),
        ...(priority !== undefined && { priority }),
        ...(minQualityScore !== undefined && { minQualityScore }),
        ...(autoPublish !== undefined && { autoPublish }),
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

    return NextResponse.json(feed, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    })
  } catch (error) {
    console.error("Error updating RSS feed:", error)
    return NextResponse.json(
      { error: "Failed to update RSS feed" },
      { status: 500 }
    )
  }
}

/**
 * Delete RSS feed
 * DELETE /api/rss-feeds/[id]
 * Query params:
 *   - cascade: boolean (optional) - if true, delete all associated articles
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const cascade = searchParams.get('cascade') === 'true'

    // Check if feed exists
    const existing = await prisma.rssFeed.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "RSS feed not found" },
        { status: 404 }
      )
    }

    // Check if feed has articles
    if (existing._count.articles > 0 && !cascade) {
      return NextResponse.json(
        { 
          error: "Cannot delete RSS feed with existing articles.",
          articleCount: existing._count.articles,
          suggestion: "Use cascade=true query parameter to delete all associated articles, or delete articles manually first."
        },
        { status: 409 }
      )
    }

    // If cascade delete, remove all associated articles first
    if (cascade && existing._count.articles > 0) {
      // Delete all articles associated with this RSS feed
      await prisma.article.deleteMany({
        where: { sourceRssId: id },
      })
    }

    // Delete scan logs first (they have foreign key constraint)
    await prisma.rssScanLog.deleteMany({
      where: { rssFeedId: id },
    })

    // Delete feed
    await prisma.rssFeed.delete({
      where: { id },
    })

    return NextResponse.json({ 
      success: true,
      deletedArticles: cascade ? existing._count.articles : 0,
    })
  } catch (error) {
    console.error("Error deleting RSS feed:", error)
    return NextResponse.json(
      { error: "Failed to delete RSS feed" },
      { status: 500 }
    )
  }
}
