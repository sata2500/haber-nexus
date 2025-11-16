"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle2, XCircle, Loader2, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Category {
  id: string
  name: string
}

interface Author {
  id: string
  name: string
  email: string
}

export default function NewRssFeedPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [urlValid, setUrlValid] = useState<boolean | null>(null)
  const [urlError, setUrlError] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    categoryId: "",
    scanInterval: 60,
    priority: 5,
    minQualityScore: 0.5,
    autoPublish: false,
    autoAssignAuthor: false,
    defaultAuthorId: "",
  })

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

  useEffect(() => {
    fetchCategories()
    fetchAuthors()
  }, [fetchCategories, fetchAuthors])

  const validateRssUrl = async (url: string) => {
    if (!url || !url.startsWith("http")) {
      setUrlValid(false)
      setUrlError("Geçerli bir URL girin (http:// veya https:// ile başlamalı)")
      return
    }

    setValidating(true)
    setUrlValid(null)
    setUrlError("")

    try {
      const response = await fetch("/api/rss-feeds/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setUrlValid(true)
        setUrlError("")
        // Auto-fill name if empty
        if (!formData.name && data.feedInfo?.title) {
          setFormData((prev) => ({ ...prev, name: data.feedInfo.title }))
        }
      } else {
        setUrlValid(false)
        setUrlError(data.error || "RSS feed doğrulanamadı")
      }
    } catch (error) {
      setUrlValid(false)
      setUrlError("RSS feed kontrol edilirken bir hata oluştu")
      console.error("Error validating RSS URL:", error)
    } finally {
      setValidating(false)
    }
  }

  const handleUrlBlur = () => {
    if (formData.url) {
      validateRssUrl(formData.url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate URL before submit
    if (!urlValid) {
      alert("Lütfen geçerli bir RSS feed URL'i girin")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/rss-feeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId || null,
          defaultAuthorId: formData.autoAssignAuthor ? formData.defaultAuthorId || null : null,
        }),
      })

      if (response.ok) {
        router.push("/admin/rss-feeds")
      } else {
        const data = await response.json()
        alert(data.error || "RSS feed oluşturulamadı")
      }
    } catch (error) {
      console.error("Error creating RSS feed:", error)
      alert("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Geri
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Yeni RSS Feed Ekle</CardTitle>
          <CardDescription>
            Otomatik haber taraması için yeni bir RSS feed kaynağı ekleyin. Sistem her 2 saatte bir
            otomatik olarak tarama yapacaktır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Temel Bilgiler</h3>

              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  RSS URL *
                </label>
                <div className="relative">
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => {
                      setFormData({ ...formData, url: e.target.value })
                      setUrlValid(null)
                      setUrlError("")
                    }}
                    onBlur={handleUrlBlur}
                    placeholder="https://example.com/rss"
                    required
                    className={
                      urlValid === true
                        ? "border-green-500"
                        : urlValid === false
                          ? "border-red-500"
                          : ""
                    }
                  />
                  {validating && (
                    <Loader2 className="text-muted-foreground absolute top-3 right-3 h-4 w-4 animate-spin" />
                  )}
                  {!validating && urlValid === true && (
                    <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-green-500" />
                  )}
                  {!validating && urlValid === false && (
                    <XCircle className="absolute top-3 right-3 h-4 w-4 text-red-500" />
                  )}
                </div>
                {urlError && <p className="text-xs text-red-500">{urlError}</p>}
                {urlValid && <p className="text-xs text-green-600">✓ RSS feed doğrulandı</p>}
                <p className="text-muted-foreground text-xs">
                  RSS feed&apos;in tam URL adresini girin. Sistem otomatik olarak doğrulayacaktır.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Feed Adı *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: BBC News TR"
                  required
                />
                <p className="text-muted-foreground text-xs">
                  Feed için tanımlayıcı bir isim girin
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Feed hakkında kısa açıklama..."
                  className="border-input bg-background min-h-[100px] w-full rounded-md border px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="categoryId" className="text-sm font-medium">
                  Kategori
                </label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="border-input bg-background w-full rounded-md border px-3 py-2"
                >
                  <option value="">Kategori seçin (opsiyonel)</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-muted-foreground text-xs">
                  Bu feed&apos;den gelen içerikler otomatik olarak bu kategoriye atanır
                </p>
              </div>
            </div>

            {/* Automation Settings */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Otomasyon Ayarları</h3>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Otomatik Tarama</AlertTitle>
                <AlertDescription>
                  Sistem GitHub Actions ile her 2 saatte bir otomatik olarak tüm aktif feedleri
                  tarar. Duplicate detection ve incremental scanning ile sadece yeni içerikler
                  işlenir.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    Öncelik (1-10)
                  </label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: parseInt(e.target.value) })
                    }
                  />
                  <p className="text-muted-foreground text-xs">
                    Yüksek öncelikli feedler önce taranır
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="minQualityScore" className="text-sm font-medium">
                    Min. Kalite Skoru (0-1)
                  </label>
                  <Input
                    id="minQualityScore"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.minQualityScore}
                    onChange={(e) =>
                      setFormData({ ...formData, minQualityScore: parseFloat(e.target.value) })
                    }
                  />
                  <p className="text-muted-foreground text-xs">AI kalite skorunun alt limiti</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-muted/50 flex items-start gap-3 rounded-lg border p-3">
                  <input
                    id="autoPublish"
                    type="checkbox"
                    checked={formData.autoPublish}
                    onChange={(e) => setFormData({ ...formData, autoPublish: e.target.checked })}
                    className="border-input mt-1 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="autoPublish" className="cursor-pointer text-sm font-medium">
                      Otomatik Yayınla
                    </label>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Aktif edilirse, tarama sonucu oluşturulan içerikler manuel onay gerektirmeden
                      otomatik olarak yayınlanır. Devre dışı bırakılırsa, içerikler
                      &quot;Draft&quot; olarak kaydedilir.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 flex items-start gap-3 rounded-lg border p-3">
                  <input
                    id="autoAssignAuthor"
                    type="checkbox"
                    checked={formData.autoAssignAuthor}
                    onChange={(e) =>
                      setFormData({ ...formData, autoAssignAuthor: e.target.checked })
                    }
                    className="border-input mt-1 rounded"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="autoAssignAuthor"
                      className="cursor-pointer text-sm font-medium"
                    >
                      Otomatik Yazar Ataması
                    </label>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Aktif edilirse, bu feed&apos;den gelen içerikler otomatik olarak seçilen
                      yazara atanır.
                    </p>
                  </div>
                </div>

                {formData.autoAssignAuthor && (
                  <div className="ml-9 space-y-2">
                    <label htmlFor="defaultAuthorId" className="text-sm font-medium">
                      Varsayılan Yazar
                    </label>
                    <select
                      id="defaultAuthorId"
                      value={formData.defaultAuthorId}
                      onChange={(e) =>
                        setFormData({ ...formData, defaultAuthorId: e.target.value })
                      }
                      className="border-input bg-background w-full rounded-md border px-3 py-2"
                      required={formData.autoAssignAuthor}
                    >
                      <option value="">Yazar seçin</option>
                      {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.name} ({author.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 border-t pt-4">
              <Button type="submit" disabled={loading || !urlValid} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  "RSS Feed Ekle"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
