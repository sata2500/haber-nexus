"use client"

import { useState, useEffect, useCallback } from "react"
import { ArticleCard } from "./article-card"
import { Button } from "@/components/ui/button"
import { Loader2, Heart } from "lucide-react"
import type { Like } from "@/types/profile"

interface LikedArticlesTabProps {
  userId: string
}

export function LikedArticlesTab({ userId }: LikedArticlesTabProps) {
  const [likes, setLikes] = useState<Like[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchLikedArticles = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${userId}/liked-articles?page=${page}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setLikes((prev) => (page === 1 ? data.likes : [...prev, ...data.likes]))
        setHasMore(data.pagination.page < data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error fetching liked articles:", error)
    } finally {
      setLoading(false)
    }
  }, [userId, page])

  useEffect(() => {
    fetchLikedArticles()
  }, [fetchLikedArticles])

  const handleUnlike = async (articleId: string) => {
    try {
      const response = await fetch("/api/likes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
      })

      if (response.ok) {
        setLikes((prev) => prev.filter((like) => like.article.id !== articleId))
      }
    } catch (error) {
      console.error("Error unliking article:", error)
    }
  }

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (likes.length === 0) {
    return (
      <div className="py-12 text-center">
        <Heart className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
        <h3 className="mb-2 text-lg font-semibold">Henüz beğenilen makale yok</h3>
        <p className="text-muted-foreground">Beğendiğiniz makaleler burada görünecek</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {likes.map((like) => (
        <ArticleCard
          key={like.id}
          article={like.article}
          metadata={{
            label: "Beğenildi",
            value: new Date(like.likedAt),
          }}
          onAction={() => handleUnlike(like.article.id)}
          actionLabel="Beğeniyi Kaldır"
        />
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
