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
 * Assign author to all articles from this RSS feed
 * POST /api/rss-feeds/[id]/assign-author
 */
export async function POST(
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
    const { authorId } = body

    if (!authorId) {
      return NextResponse.json(
        { error: "Author ID is required" },
        { status: 400 }
      )
    }

    // Check if RSS feed exists
    const feed = await prisma.rssFeed.findUnique({
      where: { id },
    })

    if (!feed) {
      return NextResponse.json(
        { error: "RSS feed not found" },
        { status: 404 }
      )
    }

    // Check if author exists and has appropriate role
    const author = await prisma.user.findUnique({
      where: { id: authorId },
    })

    if (!author) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      )
    }

    if (!["AUTHOR", "ADMIN", "SUPER_ADMIN"].includes(author.role)) {
      return NextResponse.json(
        { error: "User does not have author privileges" },
        { status: 400 }
      )
    }

    // Update all articles from this RSS feed
    const result = await prisma.article.updateMany({
      where: {
        sourceRssId: id,
      },
      data: {
        authorId: authorId,
      },
    })

    return NextResponse.json({
      success: true,
      updatedCount: result.count,
      message: `${result.count} makale için yazar ataması yapıldı`,
    })
  } catch (error: unknown) {
    console.error("Error assigning author:", error)
    return NextResponse.json(
      { error: "Failed to assign author" },
      { status: 500 }
    )
  }
}
