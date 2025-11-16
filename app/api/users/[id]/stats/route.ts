import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/users/[id]/stats
 * Kullanıcının genel istatistiklerini getirir
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user) {
      return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 })
    }

    // Kullanıcı sadece kendi istatistiklerini görebilir
    if (session.user.id !== id) {
      return NextResponse.json({ error: "Bu istatistikleri görme yetkiniz yok" }, { status: 403 })
    }

    // Toplam beğeni sayısı
    const totalLikes = await prisma.like.count({
      where: { userId: id },
    })

    // Toplam kayıt sayısı
    const totalBookmarks = await prisma.bookmark.count({
      where: { userId: id },
    })

    // Toplam yorum sayısı
    const totalComments = await prisma.comment.count({
      where: { userId: id },
    })

    // Toplam takip edilen sayısı
    const totalFollowing = await prisma.follow.count({
      where: { followerId: id },
    })

    // Toplam takipçi sayısı
    const totalFollowers = await prisma.follow.count({
      where: { followingId: id },
    })

    // Toplam okuma sayısı
    const totalReads = await prisma.readingHistory.count({
      where: { userId: id },
    })

    // Tamamlanan okuma sayısı
    const completedReads = await prisma.readingHistory.count({
      where: {
        userId: id,
        completed: true,
      },
    })

    // Toplam okuma süresi (dakika)
    const totalReadingTime = await prisma.readingHistory.aggregate({
      where: { userId: id },
      _sum: {
        readDuration: true,
      },
    })

    // Son 7 günde okunan makale sayısı
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const readsLastWeek = await prisma.readingHistory.count({
      where: {
        userId: id,
        lastReadAt: {
          gte: sevenDaysAgo,
        },
      },
    })

    // En çok okunan kategoriler (top 5)
    const topCategories = await prisma.readingHistory.findMany({
      where: { userId: id },
      include: {
        article: {
          include: {
            category: true,
          },
        },
      },
      take: 100, // Son 100 okumayı al
    })

    const categoryCount: Record<string, { name: string; count: number; slug: string }> = {}
    topCategories.forEach((read) => {
      if (read.article.category) {
        const catId = read.article.category.id
        if (!categoryCount[catId]) {
          categoryCount[catId] = {
            name: read.article.category.name,
            slug: read.article.category.slug,
            count: 0,
          }
        }
        categoryCount[catId].count++
      }
    })

    const topCategoriesArray = Object.values(categoryCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Okunmamış bildirim sayısı
    const unreadNotifications = await prisma.notification.count({
      where: {
        userId: id,
        isRead: false,
      },
    })

    return NextResponse.json({
      totalLikes,
      totalBookmarks,
      totalComments,
      totalFollowing,
      totalFollowers,
      totalReads,
      completedReads,
      totalReadingTimeMinutes: Math.round((totalReadingTime._sum.readDuration || 0) / 60),
      readsLastWeek,
      topCategories: topCategoriesArray,
      unreadNotifications,
    })
  } catch (error: unknown) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "İstatistikler alınırken bir hata oluştu" }, { status: 500 })
  }
}
