import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, TrendingUp, Sparkles, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"

async function getFeaturedArticle() {
  return await prisma.article.findFirst({
    where: {
      status: "PUBLISHED",
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
          icon: true,
        },
      },
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  })
}

async function getLatestArticles() {
  return await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 6,
    skip: 1, // Skip the featured article
  })
}

async function getTrendingTags() {
  return await prisma.tag.findMany({
    orderBy: {
      useCount: "desc",
    },
    take: 5,
  })
}

export default async function HomePage() {
  const [featuredArticle, latestArticles, trendingTags] = await Promise.all([
    getFeaturedArticle(),
    getLatestArticles(),
    getTrendingTags(),
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Featured News */}
        {featuredArticle && (
          <section className="container py-8">
            <Card className="overflow-hidden border-2">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image */}
                {featuredArticle.coverImage ? (
                  <div className="aspect-video md:aspect-auto relative">
                    <Image
                      src={featuredArticle.coverImage}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 aspect-video md:aspect-auto flex items-center justify-center">
                    <div className="text-center p-8">
                      <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
                      <p className="text-sm text-muted-foreground">Öne Çıkan Haber</p>
                    </div>
                  </div>
                )}
                
                {/* Content */}
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">
                      {featuredArticle.category?.icon} {featuredArticle.category?.name}
                    </Badge>
                    {featuredArticle.aiGenerated && (
                      <Badge variant="outline" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI Özet
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-3xl md:text-4xl leading-tight">
                    {featuredArticle.title}
                  </CardTitle>
                  {featuredArticle.excerpt && (
                    <CardDescription className="text-base">
                      {featuredArticle.excerpt}
                    </CardDescription>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{featuredArticle.author.name || featuredArticle.author.email}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {featuredArticle.viewCount}
                    </span>
                  </div>
                  <Link href={`/articles/${featuredArticle.slug}`}>
                    <Button size="lg" className="w-fit">
                      Devamını Oku
                    </Button>
                  </Link>
                </CardHeader>
              </div>
            </Card>
          </section>
        )}

        {/* Main Content Grid */}
        <section className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Latest News - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Son Haberler</h2>
              </div>

              {latestArticles.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Henüz haber yayınlanmamış</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {latestArticles.map((article) => {
                    const readingTime = Math.ceil(article.content.split(" ").length / 200)
                    
                    return (
                      <Card key={article.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                {article.category && (
                                  <Badge variant="secondary">{article.category.name}</Badge>
                                )}
                                {article.aiGenerated && (
                                  <Badge variant="outline" className="gap-1">
                                    <Sparkles className="h-3 w-3" />
                                    AI
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                                <Link href={`/articles/${article.slug}`}>
                                  {article.title}
                                </Link>
                              </CardTitle>
                              {article.excerpt && (
                                <CardDescription>{article.excerpt}</CardDescription>
                              )}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{article.author.name}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {readingTime} dk
                                </span>
                                <span>{article._count.likes} beğeni</span>
                              </div>
                            </div>
                            {/* Thumbnail */}
                            {article.coverImage ? (
                              <div className="relative w-24 h-24 shrink-0">
                                <Image
                                  src={article.coverImage}
                                  alt={article.title}
                                  fill
                                  className="rounded-md object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-md bg-muted flex items-center justify-center shrink-0">
                                <span className="text-xs text-muted-foreground">Görsel</span>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Trending Topics */}
              {trendingTags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Trend Konular
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {trendingTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Insights */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Analizler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Günün Özeti</h4>
                    <p className="text-sm text-muted-foreground">
                      Yapay zeka destekli haber analizimiz, bugünün en önemli gelişmelerini sizin için özetledi.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Detaylı Analiz
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bülten</CardTitle>
                  <CardDescription>
                    Günlük haber özetini e-postanıza göndereceğiz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="E-posta adresiniz"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                    <Button className="w-full" size="sm">
                      Abone Ol
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
