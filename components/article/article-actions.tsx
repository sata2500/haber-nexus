"use client"

import { LikeButton } from "./like-button"
import { BookmarkButton } from "./bookmark-button"
import { ShareButton } from "./share-button"

interface ArticleActionsProps {
  articleId: string
  articleTitle: string
  articleUrl: string
  initialLiked?: boolean
  initialBookmarked?: boolean
  initialLikeCount: number
  showCounts?: boolean
  showLabels?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ArticleActions({
  articleId,
  articleTitle,
  articleUrl,
  initialLiked = false,
  initialBookmarked = false,
  initialLikeCount,
  showCounts = true,
  showLabels = true,
  size = "md",
  className = "",
}: ArticleActionsProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LikeButton
        articleId={articleId}
        initialLiked={initialLiked}
        initialCount={initialLikeCount}
        showCount={showCounts}
        showLabel={showLabels}
        size={size}
      />

      <BookmarkButton
        articleId={articleId}
        initialBookmarked={initialBookmarked}
        showLabel={showLabels}
        size={size}
      />

      <ShareButton title={articleTitle} url={articleUrl} showLabel={showLabels} size={size} />
    </div>
  )
}
