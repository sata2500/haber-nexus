import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Get reading history for a specific article
 * GET /api/reading-history?articleId=xxx
 */
export async function GET(request: NextRequest) {
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

    const readingHistory = await prisma.readingHistory.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId,
        },
      },
    })

    return NextResponse.json({ readingHistory })
  } catch (error) {
    console.error("Error fetching reading history:", error)
    return NextResponse.json(
      { error: "Failed to fetch reading history" },
      { status: 500 }
    )
  }
}

/**
 * Create or update reading history
 * POST /api/reading-history
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
    const { articleId, readDuration, progress, completed } = body

    // Validation
    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      )
    }

    if (typeof readDuration !== "number" || readDuration < 0) {
      return NextResponse.json(
        { error: "Invalid read duration" },
        { status: 400 }
      )
    }

    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      return NextResponse.json(
        { error: "Invalid progress value (must be 0-100)" },
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

    // Rate limiting: Check last save time
    const existingHistory = await prisma.readingHistory.findUnique({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId,
        },
      },
    })

    if (existingHistory) {
      const timeSinceLastSave = Date.now() - existingHistory.lastReadAt.getTime()
      // Minimum 5 seconds between saves (except for sendBeacon)
      if (timeSinceLastSave < 5000 && readDuration - existingHistory.readDuration < 5) {
        return NextResponse.json({
          success: true,
          readingHistory: existingHistory,
          message: "Too frequent, skipped",
        })
      }
    }

    // Upsert reading history
    const readingHistory = await prisma.readingHistory.upsert({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId,
        },
      },
      update: {
        readDuration,
        progress,
        completed: completed || progress >= 90,
        lastReadAt: new Date(),
      },
      create: {
        userId: session.user.id,
        articleId,
        readDuration,
        progress,
        completed: completed || progress >= 90,
        lastReadAt: new Date(),
      },
    })

    // Update article view count (only on first read or significant progress)
    if (!existingHistory || (existingHistory.progress < 10 && progress >= 10)) {
      await prisma.article.update({
        where: { id: articleId },
        data: {
          viewCount: { increment: 1 },
        },
      })
    }

    return NextResponse.json({
      success: true,
      readingHistory,
    })
  } catch (error) {
    console.error("Error saving reading history:", error)
    return NextResponse.json(
      { error: "Failed to save reading history" },
      { status: 500 }
    )
  }
}
