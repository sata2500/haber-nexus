import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    publishedAt: Date | null
    viewCount: number
    author: {
      name: string | null
      image: string | null
    }
    category: {
      name: string
      slug: string
    } | null
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <Link href={`/haber/${post.slug}`} className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-4xl font-bold text-white opacity-50">HN</span>
          </div>
        )}
        {post.category && (
          <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            {post.category.name}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <Link href={`/haber/${post.slug}`}>
          <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="mb-4 text-sm text-gray-600 line-clamp-3 dark:text-gray-400">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="flex items-center gap-x-2">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name || "Yazar"}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <User className="h-3 w-3 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {post.author.name || "Anonim"}
            </span>
          </div>

          <div className="flex items-center gap-x-4 text-xs text-gray-500 dark:text-gray-400">
            {post.publishedAt && (
              <div className="flex items-center gap-x-1">
                <Calendar className="h-3 w-3" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {formatDistanceToNow(post.publishedAt, { addSuffix: true, locale: tr })}
                </time>
              </div>
            )}
            <div className="flex items-center gap-x-1">
              <Eye className="h-3 w-3" />
              <span>{post.viewCount}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
