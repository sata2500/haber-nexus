"use client"

import { LikeButton } from "./like-button"
import { BookmarkButton } from "./bookmark-button"
import { Eye, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface ArticleCardActionsProps {
  articleId: string
  initialLiked?: boolean
  initialBookmarked?: boolean
  likeCount: number
  commentCount: number
  viewCount: number
  className?: string
}

export function ArticleCardActions({
  articleId,
  initialLiked = false,
  initialBookmarked = false,
  likeCount,
  commentCount,
  viewCount,
  className = "",
}: ArticleCardActionsProps) {
  return (
    <div className={cn("text-muted-foreground flex items-center gap-3 text-sm", className)}>
      {/* View Count (Static) */}
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        <span>{viewCount}</span>
      </div>

      {/* Like Button */}
      <LikeButton
        articleId={articleId}
        initialLiked={initialLiked}
        initialCount={likeCount}
        showLabel={false}
        showCount={true}
        size="sm"
      />

      {/* Comment Count (Static) */}
      <div className="flex items-center gap-1">
        <MessageSquare className="h-4 w-4" />
        <span>{commentCount}</span>
      </div>

      {/* Bookmark Button */}
      <BookmarkButton
        articleId={articleId}
        initialBookmarked={initialBookmarked}
        showLabel={false}
        size="sm"
      />
    </div>
  )
}
