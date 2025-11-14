import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/users/[id]/reading-history
 * Kullanıcının okuma geçmişini getirir
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

    // Kullanıcı sadece kendi okuma geçmişini görebilir
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: "Bu okuma geçmişini görme yetkiniz yok" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    // Okuma geçmişini getir
    const history = await prisma.readingHistory.findMany({
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
          },
        },
      },
      orderBy: { lastReadAt: "desc" },
      skip,
      take: limit,
    })

    // Toplam sayı
    const total = await prisma.readingHistory.count({
      where: { userId: id },
    })

    // Sadece yayınlanmış makaleleri filtrele
    const filteredHistory = history.filter(
      (item) => item.article.status === "PUBLISHED"
    )

    return NextResponse.json({
      history: filteredHistory.map((item) => ({
        id: item.id,
        startedAt: item.startedAt,
        lastReadAt: item.lastReadAt,
        readDuration: item.readDuration,
        progress: item.progress,
        completed: item.completed,
        article: {
          id: item.article.id,
          slug: item.article.slug,
          title: item.article.title,
          excerpt: item.article.excerpt,
          coverImage: item.article.coverImage,
          publishedAt: item.article.publishedAt,
          author: item.article.author,
          category: item.article.category,
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
    console.error("Error fetching reading history:", error)
    return NextResponse.json(
      { error: "Okuma geçmişi alınırken bir hata oluştu" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/users/[id]/reading-history
 * Okuma kaydı ekler veya günceller
 */
export async function POST(
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

    if (session.user.id !== id) {
      return NextResponse.json(
        { error: "Bu işlemi yapma yetkiniz yok" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { articleId, readDuration, progress, completed } = body

    if (!articleId) {
      return NextResponse.json(
        { error: "Makale ID gerekli" },
        { status: 400 }
      )
    }

    // Makale var mı kontrol et
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    })

    if (!article) {
      return NextResponse.json(
        { error: "Makale bulunamadı" },
        { status: 404 }
      )
    }

    // Okuma kaydını ekle veya güncelle
    const readingHistory = await prisma.readingHistory.upsert({
      where: {
        userId_articleId: {
          userId: id,
          articleId,
        },
      },
      update: {
        lastReadAt: new Date(),
        readDuration: readDuration || 0,
        progress: progress || 0,
        completed: completed || false,
      },
      create: {
        userId: id,
        articleId,
        readDuration: readDuration || 0,
        progress: progress || 0,
        completed: completed || false,
      },
    })

    return NextResponse.json({
      success: true,
      readingHistory,
    })
  } catch (error) {
    console.error("Error saving reading history:", error)
    return NextResponse.json(
      { error: "Okuma kaydı eklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
