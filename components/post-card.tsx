import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Eye, ArrowRight } from "lucide-react"
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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl card-hover">
      {/* Image Container */}
      <Link href={`/haber/${post.slug}`} className="relative aspect-video overflow-hidden bg-muted">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-primary/60">
            <span className="text-5xl font-bold text-primary-foreground opacity-30">HN</span>
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        {post.category && (
          <span className="absolute left-4 top-4 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            {post.category.name}
          </span>
        )}
        
        {/* Read More Button (appears on hover) */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 text-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            <span>Devamını Oku</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <Link href={`/haber/${post.slug}`}>
          <h3 className="mb-3 text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="mb-4 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          {/* Author */}
          <div className="flex items-center gap-3">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name || "Yazar"}
                width={32}
                height={32}
                className="rounded-full ring-2 ring-primary/20"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
            )}
            <span className="text-sm font-medium text-foreground">
              {post.author.name || "Anonim"}
            </span>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {post.publishedAt && (
              <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {formatDistanceToNow(post.publishedAt, { addSuffix: true, locale: tr })}
                </time>
              </div>
            )}
            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Eye className="h-3.5 w-3.5" />
              <span>{post.viewCount}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
