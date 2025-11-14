import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/users/[id]/followed-authors
 * Kullanıcının takip ettiği yazarları getirir
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

    // Kullanıcı sadece kendi takiplerini görebilir
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: "Bu takipleri görme yetkiniz yok" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    // Takip edilen yazarları getir
    const follows = await prisma.follow.findMany({
      where: { followerId: id },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
            role: true,
            authorProfile: {
              select: {
                totalArticles: true,
                totalViews: true,
                totalLikes: true,
                verified: true,
              },
            },
            _count: {
              select: {
                articles: true,
                followers: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    // Her yazar için son makalelerini getir
    const authorsWithArticles = await Promise.all(
      follows.map(async (follow) => {
        const recentArticles = await prisma.article.findMany({
          where: {
            authorId: follow.following.id,
            status: "PUBLISHED",
          },
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            coverImage: true,
            publishedAt: true,
          },
          orderBy: { publishedAt: "desc" },
          take: 3,
        })

        return {
          followId: follow.id,
          followedAt: follow.createdAt,
          author: {
            ...follow.following,
            recentArticles,
          },
        }
      })
    )

    // Toplam sayı
    const total = await prisma.follow.count({
      where: { followerId: id },
    })

    return NextResponse.json({
      follows: authorsWithArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching followed authors:", error)
    return NextResponse.json(
      { error: "Takip edilen yazarlar alınırken bir hata oluştu" },
      { status: 500 }
    )
  }
}
