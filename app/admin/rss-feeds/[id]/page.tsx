"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Save,
  Play,
  Trash2,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react"

interface Category {
  id: string
  name: string
}

interface User {
  id: string
  name: string | null
  email: string
  role: string
}

interface RssFeed {
  id: string
  name: string
  url: string
  description: string | null
  isActive: boolean
  scanInterval: number
  priority: number
  minQualityScore: number
  autoPublish: boolean
  lastScannedAt: string | null
  totalScans: number
  totalArticles: number
  successRate: number
  categoryId: string | null
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

interface ScanLog {
  id: string
  status: "SUCCESS" | "PARTIAL" | "FAILED"
  itemsFound: number
  itemsProcessed: number
  itemsPublished: number
  error: string | null
  duration: number
  createdAt: string
}

export default function EditRssFeedPage() {
  const router = useRouter()
  const params = useParams()
  const feedId = params.id as string

  const [feed, setFeed] = useState<RssFeed | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<User[]>([])
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>("")
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    categoryId: "",
    isActive: true,
    scanInterval: 60,
    priority: 1,
    minQualityScore: 0.5,
    autoPublish: false,
    autoAssignAuthor: false,
    defaultAuthorId: "",
  })

  const fetchFeed = useCallback(async () => {
    try {
      const response = await fetch(`/api/rss-feeds/${feedId}`)
      if (!response.ok) throw new Error("Failed to fetch")

      const data = await response.json()
      setFeed(data)
      setFormData({
        name: data.name,
        url: data.url,
        description: data.description || "",
        categoryId: data.categoryId || "",
        isActive: data.isActive,
        scanInterval: data.scanInterval,
        priority: data.priority,
        minQualityScore: data.minQualityScore,
        autoPublish: data.autoPublish,
        autoAssignAuthor: data.autoAssignAuthor || false,
        defaultAuthorId: data.defaultAuthorId || "",
      })
    } catch (error) {
      console.error("Fetch error:", error)
      alert("RSS feed yüklenemedi")
      router.push("/admin/rss-feeds")
    } finally {
      setLoading(false)
    }
  }, [feedId, router])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }, [])

  const fetchAuthors = useCallback(async () => {
    try {
      const response = await fetch("/api/users?role=AUTHOR")
      if (response.ok) {
        const data = await response.json()
        setAuthors(data)
      }
    } catch (error) {
      console.error("Error fetching authors:", error)
    }
  }, [])

  const fetchScanLogs = useCallback(async () => {
    setLoadingLogs(true)
    try {
      const response = await fetch(`/api/rss-feeds/${feedId}/scan-logs?limit=10`)
      if (response.ok) {
        const data = await response.json()
        setScanLogs(data)
      }
    } catch (error) {
      console.error("Error fetching scan logs:", error)
    } finally {
      setLoadingLogs(false)
    }
  }, [feedId])

  useEffect(() => {
    fetchFeed()
    fetchCategories()
    fetchAuthors()
    fetchScanLogs()
  }, [fetchFeed, fetchCategories, fetchAuthors, fetchScanLogs])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/rss-feeds/${feedId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId || null,
        }),
      })

      if (!response.ok) throw new Error("Failed to save")

      alert("RSS feed başarıyla güncellendi")
      fetchFeed()
    } catch (error) {
      console.error("Save error:", error)
      alert("Kaydetme başarısız")
    } finally {
      setSaving(false)
    }
  }

  const handleScan = async () => {
    setScanning(true)
    try {
      // Use async endpoint to avoid timeout
      const response = await fetch(`/api/rss-feeds/${feedId}/scan-async`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to start scan")

      const data = await response.json()
      alert(data.message || "Tarama başlatıldı. Sonuçları birkaç dakika sonra kontrol edin.")

      // Refresh feed data and scan logs after a short delay
      setTimeout(() => {
        fetchFeed()
        fetchScanLogs()
      }, 3000)
    } catch (error) {
      console.error("Scan error:", error)
      alert("Tarama başlatılamadı. Lütfen tekrar deneyin.")
    } finally {
      setScanning(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Bu RSS feed'i silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."))
      return

    try {
      const response = await fetch(`/api/rss-feeds/${feedId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || "Silme başarısız")
        return
      }

      alert("RSS feed silindi")
      router.push("/admin/rss-feeds")
    } catch (error) {
      console.error("Delete error:", error)
      alert("Silme başarısız")
    }
  }

  const handleAssignAuthor = async () => {
    if (!selectedAuthorId) {
      alert("Lütfen bir yazar seçin")
      return
    }

    try {
      // Bu feed'den oluşturulan tüm makalelerin yazarını güncelle
      const response = await fetch(`/api/rss-feeds/${feedId}/assign-author`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorId: selectedAuthorId,
        }),
      })

      if (!response.ok) throw new Error("Failed to assign author")

      const data = await response.json()
      alert(`${data.updatedCount} makale için yazar ataması yapıldı`)
    } catch (error) {
      console.error("Assign author error:", error)
      alert("Yazar ataması başarısız")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-12 text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!feed) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-600">RSS feed bulunamadı</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button variant="ghost" onClick={() => router.push("/admin/rss-feeds")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Geri
      </Button>

      <div className="space-y-6">
        {/* Main Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>RSS Feed Düzenle</CardTitle>
                <CardDescription>Feed bilgilerini ve ayarlarını güncelleyin</CardDescription>
              </div>
              <Badge variant={feed.isActive ? "default" : "secondary"}>
                {feed.isActive ? "Aktif" : "Pasif"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Feed Adı <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: BBC News TR"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                RSS URL <span className="text-destructive">*</span>
              </label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/rss"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Açıklama</label>
              <textarea
                className="min-h-[100px] w-full rounded-md border px-3 py-2 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Feed hakkında kısa açıklama..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Kategori seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tarama Aralığı (dakika)</label>
                <Input
                  type="number"
                  min="15"
                  max="1440"
                  value={formData.scanInterval}
                  onChange={(e) =>
                    setFormData({ ...formData, scanInterval: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Öncelik (1-10)</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Kalite Skoru (0-1)</label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={formData.minQualityScore}
                onChange={(e) =>
                  setFormData({ ...formData, minQualityScore: parseFloat(e.target.value) })
                }
              />
              <p className="text-muted-foreground text-xs">
                Bu skorun altındaki içerikler otomatik olarak reddedilir
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="border-input rounded"
                />
                <span className="text-sm font-medium">Aktif</span>
              </label>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.autoPublish}
                  onChange={(e) => setFormData({ ...formData, autoPublish: e.target.checked })}
                  className="border-input rounded"
                />
                <span className="text-sm font-medium">Otomatik yayınla</span>
              </label>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.autoAssignAuthor}
                  onChange={(e) => setFormData({ ...formData, autoAssignAuthor: e.target.checked })}
                  className="border-input rounded"
                />
                <span className="text-sm font-medium">
                  Otomatik yazar ata (ilgi alanlarına göre)
                </span>
              </label>
              <p className="text-muted-foreground ml-6 text-xs">
                Etkinleştirildiğinde, makaleler kategoriye göre en uygun yazara otomatik atanacaktır
              </p>

              {!formData.autoAssignAuthor && (
                <div className="ml-6 space-y-2">
                  <label className="text-sm font-medium">Varsayılan Yazar</label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={formData.defaultAuthorId}
                    onChange={(e) => setFormData({ ...formData, defaultAuthorId: e.target.value })}
                  >
                    <option value="">Varsayılan (Admin)</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name || author.email} ({author.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
              <Button onClick={handleScan} disabled={scanning} variant="outline">
                <Play className="mr-2 h-4 w-4" />
                {scanning ? "Taranıyor..." : "Şimdi Tara"}
              </Button>
              <Button onClick={handleDelete} variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Author Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Yazar Ataması</CardTitle>
            <CardDescription>
              Bu feed&apos;den oluşturulan makaleler için varsayılan yazar atayın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Yazar Seç</label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={selectedAuthorId}
                onChange={(e) => setSelectedAuthorId(e.target.value)}
              >
                <option value="">Yazar seçin</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name || author.email} ({author.role})
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleAssignAuthor} disabled={!selectedAuthorId}>
              <Users className="mr-2 h-4 w-4" />
              Mevcut Makalelere Yazar Ata
            </Button>
            <p className="text-muted-foreground text-xs">
              Bu işlem, bu feed&apos;den oluşturulan tüm mevcut makalelerin yazarını
              değiştirecektir.
            </p>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">İstatistikler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <div className="text-muted-foreground text-sm">Toplam Tarama</div>
                <div className="text-2xl font-bold">{feed.totalScans}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Toplam Makale</div>
                <div className="text-2xl font-bold">{feed.totalArticles}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Başarı Oranı</div>
                <div className="text-2xl font-bold">{(feed.successRate * 100).toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Son Tarama</div>
                <div className="text-sm font-medium">
                  {feed.lastScannedAt
                    ? new Date(feed.lastScannedAt).toLocaleDateString("tr-TR")
                    : "Henüz taranmadı"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scan Logs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Tarama Geçmişi</CardTitle>
            <CardDescription>Son 10 tarama işleminin detayları</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLogs ? (
              <div className="text-muted-foreground py-8 text-center">Yükleniyor...</div>
            ) : scanLogs.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">Henüz tarama yapılmamış</div>
            ) : (
              <div className="space-y-3">
                {scanLogs.map((log) => (
                  <div
                    key={log.id}
                    className="hover:bg-muted/50 flex items-start gap-4 rounded-lg border p-4 transition-colors"
                  >
                    {/* Status Icon */}
                    <div className="mt-1">
                      {log.status === "SUCCESS" && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {log.status === "PARTIAL" && (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      {log.status === "FAILED" && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>

                    {/* Log Details */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge
                          variant={
                            log.status === "SUCCESS"
                              ? "default"
                              : log.status === "PARTIAL"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {log.status === "SUCCESS" && "Başarılı"}
                          {log.status === "PARTIAL" && "Kısmi"}
                          {log.status === "FAILED" && "Başarısız"}
                        </Badge>
                        <span className="text-muted-foreground flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {new Date(log.createdAt).toLocaleString("tr-TR")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                        <div>
                          <span className="text-muted-foreground">Bulunan:</span>
                          <span className="ml-1 font-medium">{log.itemsFound}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">İşlenen:</span>
                          <span className="ml-1 font-medium">{log.itemsProcessed}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Yayınlanan:</span>
                          <span className="ml-1 font-medium">{log.itemsPublished}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Süre:</span>
                          <span className="ml-1 font-medium">
                            {(log.duration / 1000).toFixed(1)}s
                          </span>
                        </div>
                      </div>

                      {log.error && (
                        <div className="mt-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400">
                          <strong>Hata:</strong> {log.error.split("\n")[0]}
                          {log.error.split("\n").length > 1 && (
                            <span className="text-muted-foreground ml-1">
                              (+{log.error.split("\n").length - 1} daha fazla)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
