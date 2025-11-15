import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, User, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function EditorCalendarPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const now = new Date()
  const todayStart = new Date(now.setHours(0, 0, 0, 0))
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  // Zamanlanmış makaleler
  const scheduledArticles = await prisma.article.findMany({
    where: {
      status: "DRAFT",
      scheduledAt: {
        not: null,
        gte: todayStart
      }
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
    orderBy: { scheduledAt: "asc" },
    take: 50
  })

  // Son yayınlanan makaleler
  const recentPublished = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { gte: weekStart }
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
    orderBy: { publishedAt: "desc" },
    take: 20
  })

  // Önümüzdeki 7 gün için günlük gruplandırma
  const groupedByDate = scheduledArticles.reduce((acc, article) => {
    if (!article.scheduledAt) return acc
    const dateKey = new Date(article.scheduledAt).toLocaleDateString("tr-TR")
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(article)
    return acc
  }, {} as Record<string, typeof scheduledArticles>)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          İçerik Takvimi
        </h1>
        <p className="text-muted-foreground mt-2">
          Yayın planlaması ve içerik takvimini yönetin
        </p>
      </div>

      {/* Özet Kartlar */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Zamanlanmış Makaleler
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledArticles.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Yayınlanmayı bekliyor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bu Hafta Yayınlanan
            </CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentPublished.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Son 7 gün
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Günlük Ortalama
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(recentPublished.length / 7)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Makale/gün
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Zamanlanmış Makaleler - Günlere Göre */}
      {Object.keys(groupedByDate).length > 0 ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Zamanlanmış Yayınlar</CardTitle>
              <CardDescription>
                Yayınlanması planlanan makaleler
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(groupedByDate).map(([date, articles]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    {date}
                    <Badge variant="secondary">{articles.length} makale</Badge>
                  </div>
                  <div className="space-y-2 pl-7">
                    {articles.map((article) => (
                      <div
                        key={article.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{article.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {article.author.name || article.author.email}
                            </span>
                            {article.category && (
                              <Badge variant="outline" className="text-xs">
                                {article.category.name}
                              </Badge>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.scheduledAt
                                ? new Date(article.scheduledAt).toLocaleTimeString("tr-TR", {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : "-"}
                            </span>
                          </div>
                        </div>
                        <Link href={`/editor/review/${article.id}`}>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              Henüz zamanlanmış makale yok
            </p>
            <Link href="/editor/review">
              <Button>Makale İncele</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Son Yayınlanan Makaleler */}
      <Card>
        <CardHeader>
          <CardTitle>Son Yayınlanan Makaleler</CardTitle>
          <CardDescription>
            Bu hafta yayınlanan içerikler
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentPublished.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Bu hafta henüz makale yayınlanmadı</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPublished.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="font-medium mb-1 hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.author.name || article.author.email}
                      </span>
                      {article.category && (
                        <Badge variant="secondary" className="text-xs">
                          {article.category.name}
                        </Badge>
                      )}
                      <span>
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString("tr-TR")
                          : "-"}
                      </span>
                    </div>
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
