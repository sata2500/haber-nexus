 
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

interface Category {
  id: string
  name: string
}

export default function NewRssFeedPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    categoryId: "",
    scanInterval: 60,
    priority: 1,
    minQualityScore: 0.5,
    autoPublish: false,
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

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    <div className="container max-w-2xl py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Geri
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Yeni RSS Feed Ekle</CardTitle>
          <CardDescription>
            Otomatik haber taraması için yeni bir RSS feed kaynağı ekleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                RSS URL *
              </label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/rss"
                required
              />
              <p className="text-xs text-muted-foreground">
                RSS feed&apos;in tam URL adresini girin
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
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
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
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
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
                <label htmlFor="scanInterval" className="text-sm font-medium">
                  Tarama Aralığı (dakika)
                </label>
                <Input
                  id="scanInterval"
                  type="number"
                  min="15"
                  max="1440"
                  value={formData.scanInterval}
                  onChange={(e) => setFormData({ ...formData, scanInterval: parseInt(e.target.value) })}
                />
              </div>

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
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="minQualityScore" className="text-sm font-medium">
                Minimum Kalite Skoru (0-1)
              </label>
              <Input
                id="minQualityScore"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={formData.minQualityScore}
                onChange={(e) => setFormData({ ...formData, minQualityScore: parseFloat(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                Bu skorun altındaki içerikler otomatik olarak reddedilir
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="autoPublish"
                type="checkbox"
                checked={formData.autoPublish}
                onChange={(e) => setFormData({ ...formData, autoPublish: e.target.checked })}
                className="rounded border-input"
              />
              <label htmlFor="autoPublish" className="text-sm font-medium">
                Otomatik yayınla (manuel onay gerektirmez)
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Oluşturuluyor..." : "RSS Feed Ekle"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
