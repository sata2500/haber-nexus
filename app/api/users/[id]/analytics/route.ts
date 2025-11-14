import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/users/[id]/analytics
 * Kullanıcının detaylı okuma analizlerini getirir
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

    if (session.user.id !== id) {
      return NextResponse.json(
        { error: "Bu analizleri görme yetkiniz yok" },
        { status: 403 }
      )
    }

    // Son 30 günlük okuma trendi
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const readingTrend = await prisma.readingHistory.findMany({
      where: {
        userId: id,
        lastReadAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        lastReadAt: true,
      },
      orderBy: {
        lastReadAt: "asc",
      },
    })

    // Günlük okuma sayılarını hesapla
    const dailyReads: Record<string, number> = {}
    readingTrend.forEach((read) => {
      const date = read.lastReadAt.toISOString().split("T")[0]
      dailyReads[date] = (dailyReads[date] || 0) + 1
    })

    const readingTrendData = Object.entries(dailyReads).map(([date, count]) => ({
      date,
      count,
    }))

    // Kategori dağılımı
    const categoryDistribution = await prisma.readingHistory.findMany({
      where: { userId: id },
      include: {
        article: {
          include: {
            category: true,
          },
        },
      },
    })

    const categoryCount: Record<string, { name: string; count: number; color?: string }> = {}
    categoryDistribution.forEach((read) => {
      if (read.article.category) {
        const catId = read.article.category.id
        if (!categoryCount[catId]) {
          categoryCount[catId] = {
            name: read.article.category.name,
            count: 0,
            color: read.article.category.color || undefined,
          }
        }
        categoryCount[catId].count++
      }
    })

    const categoryData = Object.values(categoryCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Haftalık aktivite (hangi günlerde daha aktif)
    const weeklyActivity = await prisma.readingHistory.findMany({
      where: { userId: id },
      select: {
        lastReadAt: true,
      },
    })

    const dayCount: Record<string, number> = {
      Pazar: 0,
      Pazartesi: 0,
      Salı: 0,
      Çarşamba: 0,
      Perşembe: 0,
      Cuma: 0,
      Cumartesi: 0,
    }

    const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"]
    weeklyActivity.forEach((read) => {
      const dayIndex = read.lastReadAt.getDay()
      dayCount[dayNames[dayIndex]]++
    })

    const weeklyActivityData = Object.entries(dayCount).map(([day, count]) => ({
      day,
      count,
    }))

    // Saatlik aktivite (hangi saatlerde daha aktif)
    const hourlyActivity: Record<number, number> = {}
    for (let i = 0; i < 24; i++) {
      hourlyActivity[i] = 0
    }

    weeklyActivity.forEach((read) => {
      const hour = read.lastReadAt.getHours()
      hourlyActivity[hour]++
    })

    const hourlyActivityData = Object.entries(hourlyActivity).map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
    }))

    // En çok okunan yazarlar
    const topAuthors = await prisma.readingHistory.findMany({
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
          },
        },
      },
    })

    const authorCount: Record<string, { author: any; count: number }> = {}
    topAuthors.forEach((read) => {
      const authorId = read.article.author.id
      if (!authorCount[authorId]) {
        authorCount[authorId] = {
          author: read.article.author,
          count: 0,
        }
      }
      authorCount[authorId].count++
    })

    const topAuthorsData = Object.values(authorCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((item) => ({
        ...item.author,
        readCount: item.count,
      }))

    // Ortalama okuma süresi
    const avgReadingTime = await prisma.readingHistory.aggregate({
      where: { userId: id },
      _avg: {
        readDuration: true,
      },
    })

    // Tamamlama oranı
    const totalReads = await prisma.readingHistory.count({
      where: { userId: id },
    })

    const completedReads = await prisma.readingHistory.count({
      where: {
        userId: id,
        completed: true,
      },
    })

    const completionRate = totalReads > 0 ? (completedReads / totalReads) * 100 : 0

    return NextResponse.json({
      readingTrend: readingTrendData,
      categoryDistribution: categoryData,
      weeklyActivity: weeklyActivityData,
      hourlyActivity: hourlyActivityData,
      topAuthors: topAuthorsData,
      avgReadingTimeSeconds: Math.round(avgReadingTime._avg.readDuration || 0),
      completionRate: Math.round(completionRate),
    })
  } catch (error) {
    console.error("Error fetching user analytics:", error)
    return NextResponse.json(
      { error: "Analizler alınırken bir hata oluştu" },
      { status: 500 }
    )
  }
}
