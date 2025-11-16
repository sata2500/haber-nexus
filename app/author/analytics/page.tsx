import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Heart, MessageSquare, TrendingUp } from "lucide-react"

export default async function AuthorAnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const userId = session.user.id

  // Genel istatistikler
  const [totalStats, topArticles, recentStats] = await Promise.all([
    prisma.article.aggregate({
      where: { authorId: userId, status: "PUBLISHED" },
      _sum: {
        viewCount: true,
        likeCount: true,
        commentCount: true,
      },
      _avg: {
        viewCount: true,
        likeCount: true,
      },
      _count: true,
    }),
    prisma.article.findMany({
      where: { authorId: userId, status: "PUBLISHED" },
      orderBy: { viewCount: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
        publishedAt: true,
        category: {
          select: { name: true },
        },
      },
    }),
    prisma.article.aggregate({
      where: {
        authorId: userId,
        status: "PUBLISHED",
        publishedAt: {
          gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // Son 30 gün
        },
      },
      _sum: {
        viewCount: true,
        likeCount: true,
        commentCount: true,
      },
    }),
  ])

  const stats = [
    {
      title: "Toplam Görüntülenme",
      value: totalStats._sum.viewCount || 0,
      icon: Eye,
      color: "text-blue-600",
      description: "Tüm zamanlar",
    },
    {
      title: "Toplam Beğeni",
      value: totalStats._sum.likeCount || 0,
      icon: Heart,
      color: "text-red-600",
      description: "Tüm zamanlar",
    },
    {
      title: "Toplam Yorum",
      value: totalStats._sum.commentCount || 0,
      icon: MessageSquare,
      color: "text-green-600",
      description: "Tüm zamanlar",
    },
    {
      title: "Ortalama Görüntülenme",
      value: Math.round(totalStats._avg.viewCount || 0),
      icon: TrendingUp,
      color: "text-purple-600",
      description: "Makale başına",
    },
  ]

  const monthlyStats = [
    {
      title: "Son 30 Gün Görüntülenme",
      value: recentStats._sum.viewCount || 0,
      icon: Eye,
      color: "text-blue-600",
    },
    {
      title: "Son 30 Gün Beğeni",
      value: recentStats._sum.likeCount || 0,
      icon: Heart,
      color: "text-red-600",
    },
    {
      title: "Son 30 Gün Yorum",
      value: recentStats._sum.commentCount || 0,
      icon: MessageSquare,
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">İstatistikler ve Analitik</h1>
        <p className="text-muted-foreground mt-2">Makalelerinizin performansını inceleyin</p>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Genel İstatistikler</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-muted-foreground mt-1 text-xs">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Son 30 Gün</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {monthlyStats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>En Popüler Makaleler</CardTitle>
          <CardDescription>En çok görüntülenen makaleleriniz</CardDescription>
        </CardHeader>
        <CardContent>
          {topArticles.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <p>Henüz yayınlanmış makale yok</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topArticles.map((article, index) => (
                <div key={article.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">{article.title}</h3>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      {article.category && (
                        <span className="bg-secondary rounded px-2 py-0.5 text-xs">
                          {article.category.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.viewCount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {article.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {article.commentCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Oranı</CardTitle>
            <CardDescription>Beğeni ve yorum oranları</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Beğeni Oranı</span>
                  <span className="text-muted-foreground text-sm">
                    {totalStats._sum.viewCount
                      ? ((totalStats._sum.likeCount! / totalStats._sum.viewCount) * 100).toFixed(2)
                      : 0}
                    %
                  </span>
                </div>
                <div className="bg-secondary h-2 w-full rounded-full">
                  <div
                    className="h-2 rounded-full bg-red-600"
                    style={{
                      width: `${Math.min(
                        totalStats._sum.viewCount
                          ? (totalStats._sum.likeCount! / totalStats._sum.viewCount) * 100
                          : 0,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Yorum Oranı</span>
                  <span className="text-muted-foreground text-sm">
                    {totalStats._sum.viewCount
                      ? ((totalStats._sum.commentCount! / totalStats._sum.viewCount) * 100).toFixed(
                          2
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="bg-secondary h-2 w-full rounded-full">
                  <div
                    className="h-2 rounded-full bg-green-600"
                    style={{
                      width: `${Math.min(
                        totalStats._sum.viewCount
                          ? (totalStats._sum.commentCount! / totalStats._sum.viewCount) * 100
                          : 0,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performans Özeti</CardTitle>
            <CardDescription>Genel değerlendirme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Toplam Makale</span>
                <span className="font-bold">{totalStats._count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Ortalama Beğeni</span>
                <span className="font-bold">{Math.round(totalStats._avg.likeCount || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">En Çok Görüntülenen</span>
                <span className="font-bold">{topArticles[0]?.viewCount.toLocaleString() || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
