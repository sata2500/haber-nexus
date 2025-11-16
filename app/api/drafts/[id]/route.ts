import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Get draft by ID
 * GET /api/drafts/[id]
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const draft = await prisma.contentDraft.findUnique({
      where: { id: id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
          },
        },
        sources: true,
      },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    // Check permissions
    if (
      draft.authorId !== session.user.id &&
      !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      draft,
    })
  } catch (error: unknown) {
    console.error("Draft fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch draft" }, { status: 500 })
  }
}

/**
 * Update draft
 * PATCH /api/drafts/[id]
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const draft = await prisma.contentDraft.findUnique({
      where: { id: id },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    // Check permissions
    if (
      draft.authorId !== session.user.id &&
      !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      topic,
      outline,
      draft: draftContent,
      status,
      qualityScore,
      readabilityScore,
      seoScore,
    } = body

    const updated = await prisma.contentDraft.update({
      where: { id: id },
      data: {
        topic: topic !== undefined ? topic : undefined,
        outline: outline !== undefined ? outline : undefined,
        draft: draftContent !== undefined ? draftContent : undefined,
        status: status !== undefined ? status : undefined,
        qualityScore: qualityScore !== undefined ? qualityScore : undefined,
        readabilityScore: readabilityScore !== undefined ? readabilityScore : undefined,
        seoScore: seoScore !== undefined ? seoScore : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      draft: updated,
    })
  } catch (error: unknown) {
    console.error("Draft update error:", error)
    return NextResponse.json({ error: "Failed to update draft" }, { status: 500 })
  }
}

/**
 * Delete draft
 * DELETE /api/drafts/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const draft = await prisma.contentDraft.findUnique({
      where: { id: id },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    // Check permissions
    if (
      draft.authorId !== session.user.id &&
      !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.contentDraft.delete({
      where: { id: id },
    })

    return NextResponse.json({
      success: true,
      message: "Draft deleted successfully",
    })
  } catch (error: unknown) {
    console.error("Draft deletion error:", error)
    return NextResponse.json({ error: "Failed to delete draft" }, { status: 500 })
  }
}
