import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * AI Analytics endpoint
 * GET /api/ai/analytics
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get("days") || "30")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get AI-generated articles stats
    const aiArticles = await prisma.article.findMany({
      where: {
        aiGenerated: true,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
        qualityScore: true,
        createdAt: true,
        publishedAt: true,
        sourceRss: {
          select: {
            name: true,
          },
        },
      },
    })

    // Calculate statistics
    const totalAiArticles = aiArticles.length
    const publishedAiArticles = aiArticles.filter((a) => a.status === "PUBLISHED").length
    const draftAiArticles = aiArticles.filter((a) => a.status === "DRAFT").length

    const totalViews = aiArticles.reduce((sum, a) => sum + a.viewCount, 0)
    const totalLikes = aiArticles.reduce((sum, a) => sum + a.likeCount, 0)
    const totalComments = aiArticles.reduce((sum, a) => sum + a.commentCount, 0)

    const avgViews = totalAiArticles > 0 ? totalViews / totalAiArticles : 0
    const avgLikes = totalAiArticles > 0 ? totalLikes / totalAiArticles : 0
    const avgComments = totalAiArticles > 0 ? totalComments / totalAiArticles : 0

    // Get RSS feed performance
    const rssFeeds = await prisma.rssFeed.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
        scanLogs: {
          where: {
            createdAt: {
              gte: startDate,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    })

    const feedStats = rssFeeds.map((feed) => ({
      id: feed.id,
      name: feed.name,
      totalArticles: feed._count.articles,
      successRate: feed.successRate,
      lastScanned: feed.lastScannedAt,
      recentScans: feed.scanLogs.length,
      avgItemsProcessed:
        feed.scanLogs.length > 0
          ? feed.scanLogs.reduce((sum, log) => sum + log.itemsProcessed, 0) / feed.scanLogs.length
          : 0,
    }))

    // Get AI task statistics
    const aiTasks = await prisma.aiTask.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        type: true,
        status: true,
        attempts: true,
        createdAt: true,
        completedAt: true,
      },
    })

    const taskStats = {
      total: aiTasks.length,
      completed: aiTasks.filter((t) => t.status === "COMPLETED").length,
      failed: aiTasks.filter((t) => t.status === "FAILED").length,
      pending: aiTasks.filter((t) => t.status === "PENDING").length,
      processing: aiTasks.filter((t) => t.status === "PROCESSING").length,
      byType: {} as Record<string, number>,
    }

    aiTasks.forEach((task) => {
      taskStats.byType[task.type] = (taskStats.byType[task.type] || 0) + 1
    })

    // Get top performing AI articles
    const topArticles = aiArticles
      .filter((a) => a.status === "PUBLISHED")
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10)
      .map((a) => ({
        id: a.id,
        title: a.title,
        views: a.viewCount,
        likes: a.likeCount,
        comments: a.commentCount,
        source: a.sourceRss?.name,
        publishedAt: a.publishedAt,
      }))

    // Calculate daily article creation trend
    const dailyStats: Record<string, number> = {}
    aiArticles.forEach((article) => {
      const date = article.createdAt.toISOString().split("T")[0]
      dailyStats[date] = (dailyStats[date] || 0) + 1
    })

    const trend = Object.entries(dailyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }))

    return NextResponse.json({
      success: true,
      period: {
        start: startDate,
        end: new Date(),
        days,
      },
      articles: {
        total: totalAiArticles,
        published: publishedAiArticles,
        draft: draftAiArticles,
        publishRate: totalAiArticles > 0 ? (publishedAiArticles / totalAiArticles) * 100 : 0,
      },
      engagement: {
        totalViews,
        totalLikes,
        totalComments,
        avgViews: Math.round(avgViews),
        avgLikes: Math.round(avgLikes),
        avgComments: Math.round(avgComments),
      },
      rssFeeds: feedStats,
      aiTasks: taskStats,
      topArticles,
      trend,
    })
  } catch (error) {
    console.error("AI analytics error:", error)
    return NextResponse.json(
      { error: "Failed to fetch AI analytics" },
      { status: 500 }
    )
  }
}
