import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Get drafts list
 * GET /api/drafts
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      authorId?: string
      status?: "DRAFT" | "RESEARCHING" | "GENERATING" | "REVIEW" | "APPROVED" | "PUBLISHED"
    } = {}

    // Authors see only their drafts, admins see all
    if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      where.authorId = session.user.id
    }

    if (status) {
      where.status = status as "DRAFT" | "RESEARCHING" | "GENERATING" | "REVIEW" | "APPROVED" | "PUBLISHED"
    }

    // Get drafts
    const [drafts, total] = await Promise.all([
      prisma.contentDraft.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true
            }
          },
          sources: {
            select: {
              id: true,
              title: true,
              url: true,
              reliability: true,
              isUsed: true
            }
          }
        },
        orderBy: {
          updatedAt: "desc"
        },
        skip,
        take: limit
      }),
      prisma.contentDraft.count({ where })
    ])

    return NextResponse.json({
      success: true,
      drafts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: unknown) {
    console.error("Drafts list error:", error)
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
      { status: 500 }
    )
  }
}

/**
 * Create new draft
 * POST /api/drafts
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!["AUTHOR", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { topic, outline, draft, aiGenerated } = body

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const newDraft = await prisma.contentDraft.create({
      data: {
        authorId: session.user.id,
        topic,
        outline: outline || undefined,
        draft: draft || undefined,
        aiGenerated: aiGenerated || false,
        status: "DRAFT"
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      draft: newDraft
    })
  } catch (error: unknown) {
    console.error("Draft creation error:", error)
    return NextResponse.json(
      { error: "Failed to create draft" },
      { status: 500 }
    )
  }
}
