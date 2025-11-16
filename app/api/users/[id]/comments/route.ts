import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/users/[id]/comments
 * Kullanıcının yaptığı yorumları getirir
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user) {
      return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 })
    }

    // Kullanıcı sadece kendi yorumlarını görebilir
    if (session.user.id !== id) {
      return NextResponse.json({ error: "Bu yorumları görme yetkiniz yok" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    // Yorumları getir
    const comments = await prisma.comment.findMany({
      where: { userId: id },
      include: {
        article: {
          select: {
            id: true,
            slug: true,
            title: true,
            coverImage: true,
            status: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    // Toplam sayı
    const total = await prisma.comment.count({
      where: { userId: id },
    })

    // Sadece yayınlanmış makalelerdeki yorumları filtrele
    const filteredComments = comments.filter((comment) => comment.article.status === "PUBLISHED")

    return NextResponse.json({
      comments: filteredComments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        status: comment.status,
        likeCount: comment.likeCount,
        replyCount: comment._count.replies,
        article: {
          id: comment.article.id,
          slug: comment.article.slug,
          title: comment.article.title,
          coverImage: comment.article.coverImage,
        },
        parent: comment.parent,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: unknown) {
    console.error("Error fetching user comments:", error)
    return NextResponse.json({ error: "Yorumlar alınırken bir hata oluştu" }, { status: 500 })
  }
}
