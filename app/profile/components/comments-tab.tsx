"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare } from "lucide-react"
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
      const response = await fetch(`/api/users/${userId}/comments?page=${page}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setComments((prev) => (page === 1 ? data.comments : [...prev, ...data.comments]))
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
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="py-12 text-center">
        <MessageSquare className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
        <h3 className="mb-2 text-lg font-semibold">Henüz yorum yok</h3>
        <p className="text-muted-foreground">Yaptığınız yorumlar burada görünecek</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="space-y-3 pt-6">
            {/* Article Info */}
            <div className="flex items-start justify-between gap-4">
              <Link href={`/articles/${comment.article.slug}`} className="flex-1">
                <h4 className="hover:text-primary line-clamp-1 font-semibold transition-colors">
                  {comment.article.title}
                </h4>
              </Link>
              <Badge variant="default">Yayında</Badge>
            </div>

            {/* Comment Content */}
            <p className="text-foreground">{comment.content}</p>

            {/* Metadata */}
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <span>{formatDistanceToNow(new Date(comment.createdAt))}</span>
            </div>
          </CardContent>
        </Card>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button onClick={() => setPage((p) => p + 1)} disabled={loading} variant="outline">
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
