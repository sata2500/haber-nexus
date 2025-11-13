import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Eye, ArrowRight, Clock } from "lucide-react"
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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 glass-card transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 card-hover">
      {/* Image Container */}
      <Link href={`/haber/${post.slug}`} className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {post.coverImage ? (
          <>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary via-purple-500 to-pink-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <span className="relative text-6xl font-bold text-white opacity-40 group-hover:scale-110 transition-transform duration-500">HN</span>
          </div>
        )}
        
        {/* Category Badge */}
        {post.category && (
          <div className="absolute left-4 top-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-primary">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              {post.category.name}
            </span>
          </div>
        )}
        
        {/* Read More Button (appears on hover) */}
        <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 text-foreground px-5 py-2.5 rounded-full text-sm font-bold shadow-2xl hover:scale-105 transition-transform duration-200">
            <span>Devamını Oku</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>

        {/* View Count Badge */}
        <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
            <Eye className="h-3.5 w-3.5" />
            <span>{post.viewCount}</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <Link href={`/haber/${post.slug}`} className="group/title">
          <h3 className="mb-3 text-xl font-bold text-foreground line-clamp-2 group-hover/title:text-primary transition-colors duration-300 leading-tight">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="mb-4 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-2.5 group/author">
              <div className="relative">
                {post.author.image ? (
                  <>
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm" />
                    <Image
                      src={post.author.image}
                      alt={post.author.name || "Yazar"}
                      width={32}
                      height={32}
                      className="relative rounded-full ring-2 ring-primary/20 group-hover/author:ring-primary/40 transition-all duration-200"
                    />
                  </>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500 group-hover/author:scale-110 transition-transform duration-200">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-foreground group-hover/author:text-primary transition-colors duration-200">
                {post.author.name || "Anonim"}
              </span>
            </div>

            {/* Meta Info */}
            {post.publishedAt && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 group/time">
                <Clock className="h-3.5 w-3.5 group-hover/time:scale-110 transition-transform duration-200" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {formatDistanceToNow(post.publishedAt, { addSuffix: true, locale: tr })}
                </time>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </article>
  )
}
