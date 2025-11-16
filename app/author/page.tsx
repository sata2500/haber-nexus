import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Heart, FilePlus, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function AuthorDashboard() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      redirect("/auth/signin")
    }

    const userId = session.user.id

    // İstatistikleri al
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalViews,
      totalLikes,
      recentArticles,
    ] = await Promise.all([
      prisma.article.count({
        where: { authorId: userId },
      }),
      prisma.article.count({
        where: { authorId: userId, status: "PUBLISHED" },
      }),
      prisma.article.count({
        where: { authorId: userId, status: "DRAFT" },
      }),
      prisma.article
        .aggregate({
          where: { authorId: userId },
          _sum: { viewCount: true },
        })
        .catch(() => ({ _sum: { viewCount: 0 } })),
      prisma.article
        .aggregate({
          where: { authorId: userId },
          _sum: { likeCount: true },
        })
        .catch(() => ({ _sum: { likeCount: 0 } })),
      prisma.article.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          viewCount: true,
          likeCount: true,
          createdAt: true,
          publishedAt: true,
        },
      }),
    ])

    const stats = [
      {
        title: "Toplam Makale",
        value: totalArticles,
        description: "Tüm makaleleriniz",
        icon: FileText,
        color: "text-blue-600",
      },
      {
        title: "Yayınlanan",
        value: publishedArticles,
        description: "Aktif makaleler",
        icon: TrendingUp,
        color: "text-green-600",
      },
      {
        title: "Toplam Görüntülenme",
        value: totalViews?._sum?.viewCount ?? 0,
        description: "Tüm makaleleriniz",
        icon: Eye,
        color: "text-purple-600",
      },
      {
        title: "Toplam Beğeni",
        value: totalLikes?._sum?.likeCount ?? 0,
        description: "Okuyucu beğenileri",
        icon: Heart,
        color: "text-red-600",
      },
    ]

    const statusLabels: Record<string, string> = {
      DRAFT: "Taslak",
      PUBLISHED: "Yayında",
      SCHEDULED: "Zamanlanmış",
      ARCHIVED: "Arşiv",
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Yazar Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Hoş geldiniz, {session.user?.name || session.user?.email}
            </p>
          </div>
          <Link href="/author/articles/new">
            <Button className="gap-2">
              <FilePlus className="h-4 w-4" />
              Yeni Makale
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground mt-1 text-xs">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {draftArticles > 0 && (
          <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="text-orange-900 dark:text-orange-100">
                Taslak Makaleler
              </CardTitle>
              <CardDescription>{draftArticles} adet taslak makaleniz var</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/author/articles?status=DRAFT">
                <Button variant="outline" size="sm">
                  Taslakları Görüntüle
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Son Makaleler</CardTitle>
            <CardDescription>En son oluşturduğunuz makaleler</CardDescription>
          </CardHeader>
          <CardContent>
            {recentArticles.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>Henüz makale oluşturmadınız</p>
                <Link href="/author/articles/new">
                  <Button className="mt-4" size="sm">
                    İlk Makalenizi Oluşturun
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="hover:bg-accent flex items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold">{article.title}</h3>
                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <span className="bg-secondary rounded px-2 py-0.5 text-xs">
                          {statusLabels[article.status]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {article.likeCount}
                        </span>
                        <span>
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString("tr-TR")
                            : new Date(article.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    </div>
                    <Link href={`/author/articles/${article.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Düzenle
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/author/articles">
            <Card className="hover:bg-accent cursor-pointer transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tüm Makaleler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Tüm makalelerinizi görüntüleyin ve yönetin
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/author/drafts">
            <Card className="hover:bg-accent cursor-pointer transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FilePlus className="h-5 w-5" />
                  Taslaklar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  AI destekli taslak oluşturun ve yönetin
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/author/analytics">
            <Card className="hover:bg-accent cursor-pointer transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  İstatistikler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Detaylı performans analizleri</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Author dashboard error:", error)

    // Fallback UI
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Yazar Dashboard</h1>
            <p className="text-muted-foreground mt-2">Dashboard yüklenirken bir hata oluştu</p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Hata</CardTitle>
            <CardDescription>
              Dashboard verileriniz yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/author/articles/new">
              <Button>Yeni Makale Oluştur</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
}
