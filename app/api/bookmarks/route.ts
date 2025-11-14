import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Toggle bookmark on an article
 * POST /api/bookmarks
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { articleId } = body

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      )
    }

    // Check if already bookmarked
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId,
        },
      },
    })

    if (existingBookmark) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      })

      return NextResponse.json({ bookmarked: false })
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          articleId,
        },
      })

      return NextResponse.json({ bookmarked: true })
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    return NextResponse.json(
      { error: "Failed to toggle bookmark" },
      { status: 500 }
    )
  }
}

/**
 * Get user's bookmarked articles
 * GET /api/bookmarks
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        article: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(bookmarks.map(b => b.article))
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    )
  }
}
