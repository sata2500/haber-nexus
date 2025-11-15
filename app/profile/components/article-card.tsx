"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Eye, Heart, MessageSquare, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "@/lib/utils"

interface ArticleCardProps {
  article: {
    id: string
    slug: string
    title: string
    excerpt?: string | null
    coverImage?: string | null
    publishedAt?: Date | string | null
    viewCount?: number
    likeCount?: number
    commentCount?: number
    author?: {
      id: string
      name?: string | null
      username?: string | null
      image?: string | null
    }
    category?: {
      id: string
      name: string
      slug: string
      color?: string | null
    } | null
  }
  metadata?: {
    label: string
    value: string | Date
  }
  onAction?: () => void
  actionLabel?: string
  additionalInfo?: React.ReactNode
}

export function ArticleCard({ article, metadata, onAction, actionLabel, additionalInfo }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Cover Image */}
          {article.coverImage && (
            <Link
              href={`/articles/${article.slug}`}
              className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden"
            >
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
          )}

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col">
            {/* Category */}
            {article.category && (
              <Badge
                variant="secondary"
                className="w-fit mb-2"
                style={{
                  backgroundColor: article.category.color
                    ? `${article.category.color}20`
                    : undefined,
                  color: article.category.color || undefined,
                }}
              >
                {article.category.name}
              </Badge>
            )}

            {/* Title */}
            <Link href={`/articles/${article.slug}`}>
              <h3 className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2 mb-2">
                {article.title}
              </h3>
            </Link>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {article.excerpt}
              </p>
            )}

            {/* Author */}
            {article.author && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                {article.author.image ? (
                  <div className="relative w-6 h-6">
                    <Image
                      src={article.author.image}
                      alt={article.author.name || "Yazar"}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span>{article.author.name || article.author.username}</span>
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-auto">
              {metadata && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {metadata.label}:{" "}
                    {metadata.value instanceof Date
                      ? formatDistanceToNow(metadata.value)
                      : metadata.value}
                  </span>
                </div>
              )}

              {article.publishedAt && !metadata && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(article.publishedAt))}</span>
                </div>
              )}

              {article.viewCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.viewCount}</span>
                </div>
              )}

              {article.likeCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{article.likeCount}</span>
                </div>
              )}

              {article.commentCount !== undefined && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{article.commentCount}</span>
                </div>
              )}
            </div>

            {/* Additional Info */}
            {additionalInfo && additionalInfo}

            {/* Action Button */}
            {onAction && actionLabel && (
              <button
                onClick={onAction}
                className="mt-3 text-sm text-destructive hover:underline"
              >
                {actionLabel}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
