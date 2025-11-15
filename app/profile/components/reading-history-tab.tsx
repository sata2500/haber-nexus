"use client"

import { useState, useEffect, useCallback } from "react"
import { ArticleCard } from "./article-card"
import { Button } from "@/components/ui/button"
import { Loader2, Clock } from "lucide-react"
import type { ReadingHistory } from "@/types/profile"

interface ReadingHistoryTabProps {
  userId: string
}

export function ReadingHistoryTab({ userId }: ReadingHistoryTabProps) {
  const [history, setHistory] = useState<ReadingHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchReadingHistory = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/users/${userId}/reading-history?page=${page}&limit=10`
      )
      if (response.ok) {
        const data = await response.json()
        setHistory((prev) =>
          page === 1 ? data.history : [...prev, ...data.history]
        )
        setHasMore(data.pagination.page < data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error fetching reading history:", error)
    } finally {
      setLoading(false)
    }
  }, [userId, page])

  useEffect(() => {
    fetchReadingHistory()
  }, [fetchReadingHistory])

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Henüz okuma geçmişi yok</h3>
        <p className="text-muted-foreground">
          Okuduğunuz makaleler burada görünecek
        </p>
      </div>
    )
  }

  const formatReadingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    if (minutes < 1) return "1 dakikadan az"
    if (minutes < 60) return `${minutes} dakika`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours} saat ${remainingMinutes > 0 ? `${remainingMinutes} dakika` : ""}`
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <ArticleCard
          key={item.id}
          article={item.article}
          metadata={{
            label: "Okundu",
            value: new Date(item.readAt),
          }}
          additionalInfo={
            <div className="text-sm text-muted-foreground mt-2">
              Okuma süresi: {formatReadingTime(item.readDuration)}
              {item.progress < 100 && (
                <span className="ml-2">• İlerleme: %{item.progress}</span>
              )}
            </div>
          }
        />
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
