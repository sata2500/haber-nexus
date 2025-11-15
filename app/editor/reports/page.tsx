import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, FileCheck, Clock, Calendar, Eye, Heart, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

export default async function EditorReportsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const now = new Date()
  const todayStart = new Date(now.setHours(0, 0, 0, 0))
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // Bugün yayınlanan makaleler
  const todayPublished = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { gte: todayStart }
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        }
      },
      category: {
        select: {
          name: true,
        }
      }
    },
    orderBy: { publishedAt: "desc" }
  })

  // Haftalık incelenen makaleler
  const weeklyReviewed = await prisma.article.findMany({
    where: {
      editorId: session.user.id,
      reviewedAt: { gte: weekStart }
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        }
      },
      category: {
        select: {
          name: true,
        }
      }
    },
    orderBy: { reviewedAt: "desc" },
    take: 20
  })

  // İstatistikler
  const [
    todayCount,
    weekCount,
    monthCount,
    totalViews,
    totalLikes,
    activeAuthors
  ] = await Promise.all([
    prisma.article.count({
      where: {
        status: "PUBLISHED",
        publishedAt: { gte: todayStart }
      }
    }),
    prisma.article.count({
      where: {
        status: "PUBLISHED",
        publishedAt: { gte: weekStart }
      }
    }),
    prisma.article.count({
      where: {
        status: "PUBLISHED",
        publishedAt: { gte: monthStart }
      }
    }),
    prisma.article.aggregate({
      where: {
        status: "PUBLISHED",
        publishedAt: { gte: monthStart }
      },
      _sum: {
        viewCount: true
      }
    }),
    prisma.article.aggregate({
      where: {
        status: "PUBLISHED",
        publishedAt: { gte: monthStart }
      },
      _sum: {
        likeCount: true
      }
    }),
    prisma.user.count({
      where: {
        role: "AUTHOR",
        articles: {
          some: {
            status: "PUBLISHED",
            publishedAt: { gte: monthStart }
          }
        }
      }
    })
  ])

  const stats = [
    {
      title: "Bugün Yayınlanan",
      value: todayCount,
      description: "Günlük yayın",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Haftalık Yayın",
      value: weekCount,
      description: "Son 7 gün",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Aylık Yayın",
      value: monthCount,
      description: "Bu ay",
      icon: FileCheck,
      color: "text-purple-600"
    },
    {
      title: "Toplam Görüntülenme",
      value: totalViews._sum.viewCount || 0,
      description: "Bu ay",
      icon: Eye,
      color: "text-orange-600"
    },
    {
      title: "Toplam Beğeni",
      value: totalLikes._sum.likeCount || 0,
      description: "Bu ay",
      icon: Heart,
      color: "text-red-600"
    },
    {
      title: "Aktif Yazarlar",
      value: activeAuthors,
      description: "Bu ay",
      icon: Users,
      color: "text-indigo-600"
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Raporlar ve İstatistikler
        </h1>
        <p className="text-muted-foreground mt-2">
          Yayın performansını ve içerik metriklerini görüntüleyin
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bugün Yayınlanan Makaleler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Bugün Yayınlanan Makaleler ({todayPublished.length})
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString("tr-TR", { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayPublished.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Bugün henüz makale yayınlanmadı</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayPublished.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="font-semibold mb-1 hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Yazar: {article.author.name || article.author.email}</span>
                      {article.category && (
                        <Badge variant="secondary" className="text-xs">
                          {article.category.name}
                        </Badge>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {article.likeCount}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleTimeString("tr-TR", {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "-"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Haftalık İncelenen Makaleler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Haftalık İncelenen Makaleler ({weeklyReviewed.length})
          </CardTitle>
          <CardDescription>
            Son 7 günde incelediğiniz makaleler
          </CardDescription>
        </CardHeader>
        <CardContent>
          {weeklyReviewed.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Bu hafta henüz makale incelemediniz</p>
            </div>
          ) : (
            <div className="space-y-4">
              {weeklyReviewed.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="font-semibold mb-1 hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Yazar: {article.author.name || article.author.email}</span>
                      {article.category && (
                        <Badge variant="secondary" className="text-xs">
                          {article.category.name}
                        </Badge>
                      )}
                      <Badge 
                        variant={article.status === "PUBLISHED" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {article.status === "PUBLISHED" ? "Yayında" : "Taslak"}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {article.reviewedAt
                      ? new Date(article.reviewedAt).toLocaleDateString("tr-TR")
                      : "-"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
