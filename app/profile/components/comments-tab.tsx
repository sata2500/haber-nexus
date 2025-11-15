"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, ThumbsUp } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"
import type { Comment } from "@/types/profile"

interface CommentsTabProps {
  userId: string
}

export function CommentsTab({ userId }: CommentsTabProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/users/${userId}/comments?page=${page}&limit=10`
      )
      if (response.ok) {
        const data = await response.json()
        setComments((prev) =>
          page === 1 ? data.comments : [...prev, ...data.comments]
        )
        setHasMore(data.pagination.page < data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }, [userId, page])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Henüz yorum yok</h3>
        <p className="text-muted-foreground">
          Yaptığınız yorumlar burada görünecek
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="pt-6 space-y-3">
            {/* Article Info */}
            <div className="flex items-start justify-between gap-4">
              <Link
                href={`/articles/${comment.article.slug}`}
                className="flex-1"
              >
                <h4 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                  {comment.article.title}
                </h4>
              </Link>
              <Badge variant="default">
                Yayında
              </Badge>
            </div>

            {/* Comment Content */}
            <p className="text-foreground">{comment.content}</p>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{formatDistanceToNow(new Date(comment.createdAt))}</span>
            </div>
          </CardContent>
        </Card>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              "Daha Fazla Yükle"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
