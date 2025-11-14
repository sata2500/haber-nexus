import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Toggle like on an article
 * POST /api/likes
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

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      // Update article like count
      await prisma.article.update({
        where: { id: articleId },
        data: {
          likeCount: { decrement: 1 },
        },
      })

      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: session.user.id,
          articleId,
        },
      })

      // Update article like count
      await prisma.article.update({
        where: { id: articleId },
        data: {
          likeCount: { increment: 1 },
        },
      })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}

/**
 * Check if user has liked an article
 * GET /api/likes?articleId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ liked: false })
    }

    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get("articleId")

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      )
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId,
        },
      },
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error("Error checking like:", error)
    return NextResponse.json(
      { error: "Failed to check like" },
      { status: 500 }
    )
  }
}

/**
 * Unlike an article
 * DELETE /api/likes
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get("articleId")

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      )
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId,
        },
      },
    })

    if (!existingLike) {
      return NextResponse.json(
        { error: "Like not found" },
        { status: 404 }
      )
    }

    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    })

    // Update article like count
    await prisma.article.update({
      where: { id: articleId },
      data: {
        likeCount: { decrement: 1 },
      },
    })

    return NextResponse.json({ success: true, liked: false })
  } catch (error) {
    console.error("Error deleting like:", error)
    return NextResponse.json(
      { error: "Failed to delete like" },
      { status: 500 }
    )
  }
}
