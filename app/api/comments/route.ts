import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Get comments for an article
 * GET /api/comments?articleId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get("articleId")

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: {
        articleId,
        status: "APPROVED",
        parentId: null, // Only top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          where: {
            status: "APPROVED",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

/**
 * Create a new comment
 * POST /api/comments
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
    const { articleId, content, parentId } = body

    if (!articleId || !content) {
      return NextResponse.json(
        { error: "Article ID and content are required" },
        { status: 400 }
      )
    }

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    })

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Auto-approve for admins, pending for others
    const status = ["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(session.user.role)
      ? "APPROVED"
      : "PENDING"

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        userId: session.user.id,
        parentId: parentId || null,
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Update article comment count
    await prisma.article.update({
      where: { id: articleId },
      data: {
        commentCount: { increment: 1 },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}
