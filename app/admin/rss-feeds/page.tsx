"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Rss, Play, Clock, CheckCircle2, XCircle } from "lucide-react"

interface RssFeed {
  id: string
  name: string
  url: string
  description: string | null
  isActive: boolean
  scanInterval: number
  priority: number
  lastScannedAt: string | null
  totalScans: number
  totalArticles: number
  successRate: number
  category: {
    id: string
    name: string
    slug: string
  } | null
  _count: {
    articles: number
    scanLogs: number
  }
}

export default function RssFeedsPage() {
  const router = useRouter()
  const [feeds, setFeeds] = useState<RssFeed[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [scanning, setScanning] = useState<string | null>(null)

  const fetchFeeds = useCallback(async () => {
    try {
      const response = await fetch("/api/rss-feeds?includeInactive=true", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setFeeds(data)
      }
    } catch (error) {
      console.error("Error fetching RSS feeds:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeeds()
  }, [fetchFeeds])

  const handleDelete = async (id: string) => {
    const feed = feeds.find(f => f.id === id)
    if (!feed) return

    // Prepare confirmation message
    let confirmMessage = "Bu RSS feed'i silmek istediğinizden emin misiniz?\n\n"
    
    if (feed._count.articles > 0) {
      confirmMessage += `Not: Bu feed'den oluşturulan ${feed._count.articles} makale korunacak.\n`
      confirmMessage += "Makaleleri silmek isterseniz makale yönetim sayfasından manuel olarak silebilirsiniz."
    }
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      const response = await fetch(`/api/rss-feeds/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.preservedArticles > 0) {
          alert(`RSS feed silindi. ${data.preservedArticles} makale korundu.`)
        } else {
          alert("RSS feed başarıyla silindi.")
        }
        fetchFeeds()
      } else {
        const data = await response.json()
        alert(data.error || "RSS feed silinemedi")
      }
    } catch (error) {
      console.error("Error deleting RSS feed:", error)
      alert("Bir hata oluştu")
    }
  }

  const handleScan = async (feedId: string) => {
    setScanning(feedId)
    try {
      const response = await fetch(`/api/rss-feeds/${feedId}/scan-async`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || "Tarama başlatıldı. Sonuçları tarama geçmişinden kontrol edebilirsiniz.")
        // Refresh feed list to show updated stats
        await fetchFeeds()
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Tarama başlatılamadı")
      }
    } catch (error) {
      console.error("Scan error:", error)
      alert("Bir hata oluştu: " + (error instanceof Error ? error.message : "Bilinmeyen hata"))
    } finally {
      setScanning(null)
    }
  }

  const filteredFeeds = feeds.filter((feed) =>
    feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feed.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">RSS Feed Yönetimi</h1>
          <p className="text-muted-foreground mt-1">
            RSS kaynaklarını yönetin ve otomatik tarama ayarlarını yapın
          </p>
        </div>
        <Button onClick={() => router.push("/admin/rss-feeds/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni RSS Feed
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="RSS feed ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredFeeds.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Rss className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery ? "Arama sonucu bulunamadı" : "Henüz RSS feed eklenmemiş"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push("/admin/rss-feeds/new")}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk RSS Feed&apos;i Ekle
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFeeds.map((feed) => (
            <Card key={feed.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{feed.name}</CardTitle>
                      <Badge variant={feed.isActive ? "default" : "secondary"}>
                        {feed.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                      {feed.category && (
                        <Badge variant="outline">{feed.category.name}</Badge>
                      )}
                    </div>
                    <CardDescription className="break-all">{feed.url}</CardDescription>
                    {feed.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {feed.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {feed.scanInterval} dk
                      </span>
                      <span>Öncelik: {feed.priority}</span>
                      <span>{feed._count.articles} makale</span>
                      <span>{feed.totalScans} tarama</span>
                      {feed.lastScannedAt && (
                        <span>
                          Son: {new Date(feed.lastScannedAt).toLocaleDateString("tr-TR")}
                        </span>
                      )}
                    </div>
                    {feed.totalScans > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        {feed.successRate >= 0.8 ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">
                          Başarı oranı: {(feed.successRate * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScan(feed.id)}
                      disabled={scanning === feed.id}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {scanning === feed.id ? "Başlatılıyor..." : "Tara"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/rss-feeds/${feed.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(feed.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
