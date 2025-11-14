import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Eye } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getCategory(slug: string) {
  return await prisma.category.findUnique({
    where: {
      slug,
      isActive: true,
    },
    include: {
      parent: true,
      children: true,
    },
  })
}

async function getCategoryArticles(categoryId: string) {
  return await prisma.article.findMany({
    where: {
      categoryId,
      status: "PUBLISHED",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
          icon: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
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
    take: 20,
  })
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return {
      title: "Kategori Bulunamadı",
    }
  }

  return {
    title: `${category.name} Haberleri`,
    description: category.description || `${category.name} kategorisindeki tüm haberler`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const articles = await getCategoryArticles(category.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Category Header */}
        <section className="bg-muted/50 py-12 border-b">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
                <span>/</span>
                <span className="text-foreground">Kategoriler</span>
                <span>/</span>
                <span className="text-foreground">{category.name}</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                {category.icon && (
                  <span className="text-4xl">{category.icon}</span>
                )}
                <h1 className="text-4xl font-bold">{category.name}</h1>
              </div>
              
              {category.description && (
                <p className="text-lg text-muted-foreground">
                  {category.description}
                </p>
              )}

              {/* Sub Categories */}
              {category.children.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-3">Alt Kategoriler:</p>
                  <div className="flex flex-wrap gap-2">
                    {category.children.map((child) => (
                      <a
                        key={child.id}
                        href={`/categories/${child.slug}`}
                      >
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                          {child.name}
                        </Badge>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Articles List */}
        <section className="container py-12">
          <div className="max-w-4xl mx-auto">
            {articles.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Bu kategoride henüz yayınlanmış haber bulunmuyor.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {articles.map((article) => {
                  const readingTime = Math.ceil(article.content.split(" ").length / 200)
                  
                  return (
                    <Card key={article.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {article.category && (
                                <Badge variant="secondary">{article.category.name}</Badge>
                              )}
                              <Badge variant="outline">{article.type}</Badge>
                              {article.aiGenerated && (
                                <Badge variant="outline">AI</Badge>
                              )}
                            </div>
                            
                            <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer mb-2">
                              <a href={`/articles/${article.slug}`}>
                                {article.title}
                              </a>
                            </CardTitle>
                            
                            {article.excerpt && (
                              <CardDescription className="mb-3">
                                {article.excerpt}
                              </CardDescription>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span>{article.author.name || article.author.email}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {readingTime} dk
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {article.viewCount}
                              </span>
                              <span>{article._count.likes} beğeni</span>
                              <span>{article._count.comments} yorum</span>
                            </div>

                            {article.tags.length > 0 && (
                              <div className="flex gap-1 mt-3">
                                {article.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag.id} variant="outline" className="text-xs">
                                    {tag.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Thumbnail */}
                          {article.coverImage ? (
                            <div className="relative w-32 h-24 shrink-0">
                              <Image
                                src={article.coverImage}
                                alt={article.title}
                                fill
                                className="rounded-md object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-32 h-24 rounded-md bg-muted flex items-center justify-center shrink-0">
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
        </section>
      </main>

      <Footer />
    </div>
  )
}
