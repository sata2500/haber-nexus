import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Calendar, User, Eye, Clock, Share2, Bookmark, TrendingUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { CommentSection } from "@/components/comment-section"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      comments: {
        where: {
          parentId: null,
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!post || post.status !== "PUBLISHED") {
    return null
  }

  // Increment view count
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  })

  return post
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl" />
          </div>

          <article className="relative mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
            {/* Category */}
            {post.category && (
              <div className="mb-6 animate-in fade-in slide-in-from-top duration-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105 transition-transform duration-200">
                  <TrendingUp className="h-4 w-4" />
                  {post.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight animate-in fade-in slide-in-from-bottom duration-700">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="mb-8 flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
              {/* Author */}
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  {post.author.image ? (
                    <>
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm" />
                      <Image
                        src={post.author.image}
                        alt={post.author.name || "Yazar"}
                        width={40}
                        height={40}
                        className="relative rounded-full ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all duration-200"
                      />
                    </>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                    {post.author.name || "Anonim"}
                  </p>
                  <p className="text-xs text-muted-foreground">Yazar</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-border" />

              {/* Date */}
              {post.publishedAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group">
                  <Clock className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <time dateTime={post.publishedAt.toISOString()}>
                    {formatDistanceToNow(post.publishedAt, { addSuffix: true, locale: tr })}
                  </time>
                </div>
              )}

              {/* Divider */}
              <div className="h-8 w-px bg-border" />

              {/* Views */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group">
                <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span>{post.viewCount} görüntülenme</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              <button className="btn-ghost">
                <Share2 className="h-4 w-4" />
                Paylaş
              </button>
              <button className="btn-ghost">
                <Bookmark className="h-4 w-4" />
                Kaydet
              </button>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="mb-8 aspect-video overflow-hidden rounded-2xl shadow-2xl shadow-primary/10 animate-in fade-in scale-in duration-700 delay-300">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={1200}
                  height={675}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <div className="mb-12 rounded-2xl glass-card p-6 border-l-4 border-primary animate-in fade-in slide-in-from-bottom duration-700 delay-400">
                <p className="text-lg font-medium text-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom duration-700 delay-500">
              <div className="space-y-6 text-foreground leading-relaxed">
                {post.content.split('\n').map((paragraph: string, index: number) => (
                  paragraph.trim() && (
                    <p key={index} className="text-base sm:text-lg leading-relaxed">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm font-semibold text-muted-foreground">Bu haberi paylaş:</p>
                <div className="flex gap-2">
                  <button className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-110">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="p-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-all duration-200 hover:scale-110">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="p-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:scale-110">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Comments */}
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <CommentSection postId={post.id} comments={post.comments} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
