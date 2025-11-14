import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/users/[id]/liked-articles
 * Kullanıcının beğendiği makaleleri getirir
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    // Kullanıcı sadece kendi beğenilerini görebilir
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: "Bu beğenileri görme yetkiniz yok" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sortBy = searchParams.get("sortBy") || "recent" // recent, popular

    const skip = (page - 1) * limit

    // Sıralama seçeneği
    let orderBy: any = { createdAt: "desc" }
    if (sortBy === "popular") {
      orderBy = { article: { viewCount: "desc" } }
    }

    // Beğenilen makaleleri getir
    const likes = await prisma.like.findMany({
      where: { userId: id },
      include: {
        article: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    })

    // Toplam sayı
    const total = await prisma.like.count({
      where: { userId: id },
    })

    // Sadece yayınlanmış makaleleri filtrele
    const filteredLikes = likes.filter(
      (like) => like.article.status === "PUBLISHED"
    )

    return NextResponse.json({
      likes: filteredLikes.map((like) => ({
        id: like.id,
        likedAt: like.createdAt,
        article: {
          id: like.article.id,
          slug: like.article.slug,
          title: like.article.title,
          excerpt: like.article.excerpt,
          coverImage: like.article.coverImage,
          publishedAt: like.article.publishedAt,
          viewCount: like.article.viewCount,
          likeCount: like.article._count.likes,
          commentCount: like.article._count.comments,
          author: like.article.author,
          category: like.article.category,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching liked articles:", error)
    return NextResponse.json(
      { error: "Beğenilen makaleler alınırken bir hata oluştu" },
      { status: 500 }
    )
  }
}
