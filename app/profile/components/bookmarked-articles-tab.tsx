"use client"

import { useState, useEffect, useCallback } from "react"
import { ArticleCard } from "./article-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Bookmark, Search } from "lucide-react"
import type { Bookmark as BookmarkType } from "@/types/profile"

interface BookmarkedArticlesTabProps {
  userId: string
}

export function BookmarkedArticlesTab({ userId }: BookmarkedArticlesTabProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchBookmarkedArticles = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
      })

      const response = await fetch(
        `/api/users/${userId}/bookmarked-articles?${params}`
      )
      if (response.ok) {
        const data = await response.json()
        setBookmarks((prev) =>
          page === 1 ? data.bookmarks : [...prev, ...data.bookmarks]
        )
        setHasMore(data.pagination.page < data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error fetching bookmarked articles:", error)
    } finally {
      setLoading(false)
    }
  }, [userId, page, searchQuery])

  useEffect(() => {
    fetchBookmarkedArticles()
  }, [fetchBookmarkedArticles])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setSearchQuery(search)
  }

  const handleUnbookmark = async (articleId: string) => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
      })

      if (response.ok) {
        setBookmarks((prev) =>
          prev.filter((bookmark) => bookmark.article.id !== articleId)
        )
      }
    } catch (error) {
      console.error("Error unbookmarking article:", error)
    }
  }

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Kayıtlı makalelerde ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Ara</Button>
      </form>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery
              ? "Arama sonucu bulunamadı"
              : "Henüz kayıtlı makale yok"}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Farklı bir arama terimi deneyin"
              : "Kaydettiğiniz makaleler burada görünecek"}
          </p>
        </div>
      ) : (
        <>
          {bookmarks.map((bookmark) => (
            <ArticleCard
              key={bookmark.id}
              article={bookmark.article}
              metadata={{
                label: "Kaydedildi",
                value: new Date(bookmark.bookmarkedAt),
              }}
              onAction={() => handleUnbookmark(bookmark.article.id)}
              actionLabel="Kaydı Kaldır"
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
        </>
      )}
    </div>
  )
}
