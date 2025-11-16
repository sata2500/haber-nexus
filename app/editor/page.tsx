import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileCheck, MessageSquare, AlertCircle, TrendingUp, Clock, Calendar } from "lucide-react"
import Link from "next/link"

export default async function EditorDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // İstatistikleri al
  const [pendingArticles, pendingComments, todayPublished, weeklyReviewed, recentSubmissions] =
    await Promise.all([
      prisma.article.count({
        where: {
          status: "DRAFT",
          submittedAt: { not: null },
        },
      }),
      prisma.comment.count({
        where: { status: "PENDING" },
      }),
      prisma.article.count({
        where: {
          status: "PUBLISHED",
          publishedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.article.count({
        where: {
          editorId: session.user.id,
          reviewedAt: {
            gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.article.findMany({
        where: {
          status: "DRAFT",
          submittedAt: { not: null },
        },
        orderBy: { submittedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          submittedAt: true,
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      }),
    ])

  const stats = [
    {
      title: "Onay Bekleyen",
      value: pendingArticles,
      description: "İnceleme gereken makale",
      icon: FileCheck,
      color: "text-orange-600",
      link: "/editor/review",
    },
    {
      title: "Bekleyen Yorumlar",
      value: pendingComments,
      description: "Moderasyon gereken",
      icon: MessageSquare,
      color: "text-blue-600",
      link: "/editor/moderation",
    },
    {
      title: "Bugün Yayınlanan",
      value: todayPublished,
      description: "Günlük yayın sayısı",
      icon: TrendingUp,
      color: "text-green-600",
      link: "/editor/reports",
    },
    {
      title: "Haftalık İnceleme",
      value: weeklyReviewed,
      description: "Son 7 gün",
      icon: Clock,
      color: "text-purple-600",
      link: "/editor/reports",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Editör Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Hoş geldiniz, {session.user?.name || session.user?.email}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.link}>
            <Card className="hover:bg-accent cursor-pointer transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground mt-1 text-xs">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {pendingArticles > 0 && (
        <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
              <AlertCircle className="h-5 w-5" />
              Dikkat Gereken Makaleler
            </CardTitle>
            <CardDescription>{pendingArticles} adet makale incelemenizi bekliyor</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/editor/review">
              <Button variant="outline" size="sm">
                İncele
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Son Gönderilen Makaleler</CardTitle>
          <CardDescription>Yazarlar tarafından onay için gönderilen makaleler</CardDescription>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <FileCheck className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Henüz onay bekleyen makale yok</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSubmissions.map((article) => (
                <div
                  key={article.id}
                  className="hover:bg-accent flex items-center justify-between rounded-lg border p-4 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">{article.title}</h3>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <span>Yazar: {article.author.name || article.author.email}</span>
                      {article.category && (
                        <span className="bg-secondary rounded px-2 py-0.5 text-xs">
                          {article.category.name}
                        </span>
                      )}
                      <span>
                        {article.submittedAt
                          ? new Date(article.submittedAt).toLocaleDateString("tr-TR")
                          : "-"}
                      </span>
                    </div>
                  </div>
                  <Link href={`/editor/review/${article.id}`}>
                    <Button variant="outline" size="sm">
                      İncele
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/editor/review">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Makale İnceleme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Onay bekleyen makaleleri inceleyin</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/editor/moderation">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Yorum Moderasyonu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Yorumları moderasyon edin</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/editor/calendar">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                İçerik Takvimi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Yayın planlaması yapın</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
