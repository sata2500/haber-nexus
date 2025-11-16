import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Eye, User, MessageSquare } from "lucide-react"
import { ArticleActions } from "@/components/article/article-actions"
import { CommentSection } from "@/components/article/comment-section"
import { ReadingTracker } from "@/components/article/reading-tracker"
import { ReadingProgressBar } from "@/components/article/reading-progress-bar"
import { MarkdownRenderer } from "@/components/editor/markdown-renderer"
import { isPrivilegedUser } from "@/lib/auth/session-helpers"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
      category: {
        select: {
          id: true,
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
          bookmarks: true,
        },
      },
    },
  })

  if (!article) {
    return null
  }

  // Görüntülenme sayısını artır
  await prisma.article.update({
    where: { id: article.id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  })

  return article
}

async function getRelatedArticles(categoryId: string, currentArticleId: string) {
  return await prisma.article.findMany({
    where: {
      categoryId,
      status: "PUBLISHED",
      NOT: {
        id: currentArticleId,
      },
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    take: 3,
    orderBy: {
      publishedAt: "desc",
    },
  })
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return {
      title: "Makale Bulunamadı",
    }
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || undefined,
    keywords: article.keywords,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || undefined,
      images: article.coverImage ? [article.coverImage] : undefined,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      authors: article.author.name ? [article.author.name] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = article.categoryId
    ? await getRelatedArticles(article.categoryId, article.id)
    : []

  const readingTime = Math.ceil(article.content.split(" ").length / 200)
  const showAIBadge = await isPrivilegedUser()

  // Calculate estimated read time
  const wordCount = article.content.split(/\s+/).length
  const estimatedReadTime = Math.ceil(wordCount / 200) // 200 words per minute

  return (
    <div className="flex min-h-screen flex-col">
      <ReadingProgressBar />
      <ReadingTracker articleId={article.id} estimatedReadTime={estimatedReadTime} />
      <Header />

      <main className="flex-1">
        {/* Article Header */}
        <article className="container py-8">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <div className="text-muted-foreground mb-6 flex items-center gap-2 text-sm">
              <Link href="/" className="hover:text-primary">
                Ana Sayfa
              </Link>
              {article.category && (
                <>
                  <span>/</span>
                  <Link
                    href={`/categories/${article.category.slug}`}
                    className="hover:text-primary"
                  >
                    {article.category.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-foreground">{article.title}</span>
            </div>

            {/* Category & Type */}
            <div className="mb-4 flex items-center gap-2">
              {article.category && (
                <Badge variant="default">
                  {article.category.icon} {article.category.name}
                </Badge>
              )}
              <Badge variant="outline">{article.type}</Badge>
              {article.aiGenerated && showAIBadge && (
                <Badge variant="secondary">🤖 AI Destekli</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl leading-tight font-bold md:text-5xl">{article.title}</h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-muted-foreground mb-6 text-xl">{article.excerpt}</p>
            )}

            {/* Meta Info */}
            <div className="text-muted-foreground mb-8 flex flex-wrap items-center gap-4 border-b pb-8 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author.name || article.author.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} dk okuma</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{article.viewCount} görüntülenme</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>{article._count.comments} yorum</span>
              </div>
            </div>

            {/* Cover Image */}
            {article.coverImage && (
              <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="mb-12">
              <MarkdownRenderer content={article.content} className="prose-lg" />
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-3 text-sm font-medium">Etiketler:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Social Actions */}
            <div className="border-y py-6">
              <ArticleActions
                articleId={article.id}
                articleTitle={article.title}
                articleUrl={`/articles/${article.slug}`}
                initialLikeCount={article._count.likes}
              />
            </div>

            {/* Author Bio */}
            {article.author.bio && (
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {article.author.image && (
                      <div className="relative h-16 w-16 shrink-0">
                        <Image
                          src={article.author.image}
                          alt={article.author.name || ""}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="mb-1 font-semibold">{article.author.name}</h3>
                      <p className="text-muted-foreground text-sm">{article.author.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <CommentSection articleId={article.id} initialCommentCount={article._count.comments} />
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-muted/50 py-12">
            <div className="container">
              <div className="mx-auto max-w-4xl">
                <h2 className="mb-6 text-2xl font-bold">İlgili Haberler</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedArticles.map((related) => (
                    <Card key={related.id} className="transition-shadow hover:shadow-md">
                      <CardContent className="pt-6">
                        {related.category && (
                          <Badge variant="secondary" className="mb-2">
                            {related.category.name}
                          </Badge>
                        )}
                        <h3 className="mb-2 line-clamp-2 font-semibold">
                          <a
                            href={`/articles/${related.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {related.title}
                          </a>
                        </h3>
                        {related.excerpt && (
                          <p className="text-muted-foreground line-clamp-2 text-sm">
                            {related.excerpt}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
