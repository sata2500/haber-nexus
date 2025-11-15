"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface ScheduledArticle {
  id: string
  title: string
  slug: string
  scheduledAt: string
  author: {
    name: string | null
    email: string
  }
  category: {
    name: string
  } | null
}

export default function ScheduledPublishingPage() {
  const [articles, setArticles] = useState<ScheduledArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [lastRun, setLastRun] = useState<{
    published: number
    executedAt: string
  } | null>(null)

  const fetchScheduledArticles = useCallback(async () => {
    try {
      const response = await fetch("/api/articles?status=SCHEDULED")
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles.filter((a: ScheduledArticle) => a.scheduledAt))
      }
    } catch (error) {
      console.error("Error fetching scheduled articles:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchScheduledArticles()
  }, [fetchScheduledArticles])

  const handleManualPublish = async () => {
    if (!confirm("Zamanı gelen tüm makaleleri şimdi yayınlamak istiyor musunuz?")) {
      return
    }

    setRunning(true)
    try {
      const response = await fetch("/api/cron/test-publish")
      if (response.ok) {
        const data = await response.json()
        setLastRun({
          published: data.published || 0,
          executedAt: data.executedAt,
        })
        alert(`${data.published || 0} makale yayınlandı!`)
        fetchScheduledArticles()
      } else {
        alert("Yayınlama başarısız oldu")
      }
    } catch (error) {
      console.error("Publish error:", error)
      alert("Bir hata oluştu")
    } finally {
      setRunning(false)
    }
  }

  const handlePublishSingle = async (id: string, title: string) => {
    if (!confirm(`"${title}" makalesini şimdi yayınlamak istiyor musunuz?`)) {
      return
    }

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "PUBLISHED",
          publishedAt: new Date().toISOString(),
          scheduledAt: null,
        }),
      })

      if (response.ok) {
        alert("Makale yayınlandı!")
        fetchScheduledArticles()
      } else {
        alert("Yayınlama başarısız oldu")
      }
    } catch (error) {
      console.error("Publish error:", error)
      alert("Bir hata oluştu")
    }
  }

  const getDueStatus = (scheduledAt: string) => {
    const scheduledTime = new Date(scheduledAt)
    const now = new Date()
    
    if (scheduledTime <= now) {
      return { label: "Yayına Hazır", variant: "default" as const, icon: CheckCircle }
    } else {
      const diff = scheduledTime.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours < 1) {
        return { label: `${minutes} dk sonra`, variant: "secondary" as const, icon: Clock }
      } else if (hours < 24) {
        return { label: `${hours} saat sonra`, variant: "outline" as const, icon: Clock }
      } else {
        const days = Math.floor(hours / 24)
        return { label: `${days} gün sonra`, variant: "outline" as const, icon: Clock }
      }
    }
  }

  const dueArticles = articles.filter(a => new Date(a.scheduledAt) <= new Date())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Zamanlanmış Yayın Yönetimi</h1>
        <p className="text-muted-foreground mt-2">
          Zamanlanmış makaleleri görüntüleyin ve manuel olarak yayınlayın
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Otomatik Yayınlama Hakkında
          </CardTitle>
          <CardDescription className="text-blue-900 dark:text-blue-100">
            Vercel Hobby planı nedeniyle otomatik cron job çalışmamaktadır. 
            Zamanı gelen makaleleri manuel olarak yayınlayabilir veya external cron service kurabilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Önerilen Çözüm:</strong> External cron service (cron-job.org) kullanarak 
            otomatik yayınlamayı aktif edebilirsiniz.
          </p>
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Detaylı kurulum için: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">VERCEL_DEPLOYMENT.md</code>
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Toplam Zamanlanmış</CardDescription>
            <CardTitle className="text-3xl">{articles.length}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Yayına Hazır</CardDescription>
            <CardTitle className="text-3xl text-green-600">{dueArticles.length}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Son Çalıştırma</CardDescription>
            <CardTitle className="text-lg">
              {lastRun ? (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {lastRun.published} makale yayınlandı
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(lastRun.executedAt).toLocaleString("tr-TR")}
                  </div>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Henüz çalıştırılmadı</span>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleManualPublish} disabled={running || dueArticles.length === 0}>
          {running ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Yayınlanıyor...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Yayına Hazır Makaleleri Yayınla ({dueArticles.length})
            </>
          )}
        </Button>
        
        <Button variant="outline" onClick={fetchScheduledArticles}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Yenile
        </Button>
      </div>

      {/* Articles List */}
      {loading ? (
        <div className="text-center py-8">Yükleniyor...</div>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Zamanlanmış makale bulunmuyor
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => {
            const status = getDueStatus(article.scheduledAt)
            const StatusIcon = status.icon
            
            return (
              <Card key={article.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={status.variant}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                        {article.category && (
                          <Badge variant="secondary">
                            {article.category.name}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                      <CardDescription className="space-y-1">
                        <div>
                          Yazar: {article.author.name || article.author.email}
                        </div>
                        <div>
                          Yayın Zamanı: {new Date(article.scheduledAt).toLocaleString("tr-TR")}
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePublishSingle(article.id, article.title)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Şimdi Yayınla
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
