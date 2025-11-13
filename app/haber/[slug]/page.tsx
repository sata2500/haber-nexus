import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Calendar, User, Eye } from "lucide-react"
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
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <article className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <span className="inline-flex rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                {post.category.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-x-2">
              {post.author.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name || "Yazar"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <span className="font-medium">{post.author.name || "Anonim"}</span>
            </div>
            {post.publishedAt && (
              <div className="flex items-center gap-x-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {formatDistanceToNow(post.publishedAt, { addSuffix: true, locale: tr })}
                </time>
              </div>
            )}
            <div className="flex items-center gap-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount} görüntülenme</span>
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-8 aspect-video overflow-hidden rounded-lg">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1200}
                height={675}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <div className="mb-8 border-l-4 border-blue-600 bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </article>

        {/* Comments */}
        <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
          <CommentSection postId={post.id} comments={post.comments} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
