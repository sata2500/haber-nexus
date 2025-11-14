import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/users/[id]/bookmarked-articles
 * Kullanıcının kaydettiği makaleleri getirir
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

    // Kullanıcı sadece kendi kayıtlarını görebilir
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: "Bu kayıtları görme yetkiniz yok" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const categoryId = searchParams.get("categoryId")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    // Filtreleme koşulları
    const where: any = { userId: id }

    // Kaydedilen makaleleri getir
    const bookmarks = await prisma.bookmark.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    // Toplam sayı
    const total = await prisma.bookmark.count({
      where,
    })

    // Yayınlanmış makaleleri ve filtreleri uygula
    const filteredBookmarks = bookmarks.filter((bookmark) => {
      if (!bookmark.article || bookmark.article.status !== "PUBLISHED") return false
      if (categoryId && bookmark.article.categoryId !== categoryId) return false
      if (search) {
        const searchLower = search.toLowerCase()
        const titleMatch = bookmark.article.title.toLowerCase().includes(searchLower)
        const excerptMatch = bookmark.article.excerpt?.toLowerCase().includes(searchLower)
        return titleMatch || excerptMatch
      }
      return true
    })

    return NextResponse.json({
      bookmarks: filteredBookmarks.map((bookmark) => ({
        id: bookmark.id,
        bookmarkedAt: bookmark.createdAt,
        article: {
          id: bookmark.article.id,
          slug: bookmark.article.slug,
          title: bookmark.article.title,
          excerpt: bookmark.article.excerpt,
          coverImage: bookmark.article.coverImage,
          publishedAt: bookmark.article.publishedAt,
          viewCount: bookmark.article.viewCount,
          likeCount: bookmark.article._count.likes,
          commentCount: bookmark.article._count.comments,
          author: bookmark.article.author,
          category: bookmark.article.category,
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
    console.error("Error fetching bookmarked articles:", error)
    return NextResponse.json(
      { error: "Kaydedilen makaleler alınırken bir hata oluştu" },
      { status: 500 }
    )
  }
}
