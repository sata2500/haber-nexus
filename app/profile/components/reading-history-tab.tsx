"use client"

import { useState, useEffect } from "react"
import { ArticleCard } from "./article-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Clock, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ReadingHistoryTabProps {
  userId: string
}

export function ReadingHistoryTab({ userId }: ReadingHistoryTabProps) {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchReadingHistory()
  }, [page])

  const fetchReadingHistory = async () => {
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
  }

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

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col">
              <ArticleCard
                article={item.article}
                metadata={{
                  label: "Son okunma",
                  value: new Date(item.lastReadAt),
                }}
              />
              
              {/* Reading Progress */}
              <div className="px-4 pb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {Math.floor(item.readDuration / 60)} dakika okuma
                    </span>
                  </div>
                  {item.completed && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Tamamlandı</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>İlerleme</span>
                    <span>{Math.round(item.progress)}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              </div>
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
