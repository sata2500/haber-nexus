"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { ImageInput } from "@/components/admin/image-input"

interface Category {
  id: string
  name: string
}

export default function NewArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    type: "NEWS",
    status: "DRAFT",
    categoryId: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const keywords = formData.keywords
        .split(",")
        .map((kw) => kw.trim())
        .filter((kw) => kw.length > 0)

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags,
          keywords,
          publishedAt: formData.status === "PUBLISHED" ? new Date().toISOString() : undefined,
        }),
      })

      if (response.ok) {
        router.push("/admin/articles")
      } else {
        const data = await response.json()
        alert(data.error || "Makale oluşturulamadı")
      }
    } catch (error) {
      console.error("Error creating article:", error)
      alert("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Geri
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Makale Oluştur</CardTitle>
          <CardDescription>
            Yeni bir makale yazın ve yayınlayın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Başlık <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Makale başlığı..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Slug <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="makale-slug"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL&apos;de kullanılacak benzersiz tanımlayıcı
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Özet</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Kısa özet (opsiyonel)..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                İçerik <span className="text-destructive">*</span>
              </label>
              <textarea
                className="w-full min-h-[300px] px-3 py-2 border rounded-md text-sm font-mono"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Makale içeriği (Markdown destekli)..."
                required
              />
              <p className="text-xs text-muted-foreground">
                Markdown formatında yazabilirsiniz
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Kategori <span className="text-destructive">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  <option value="">Kategori seçin</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tür</label>
                <select
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="NEWS">Haber</option>
                  <option value="BLOG">Blog</option>
                  <option value="ANALYSIS">Analiz</option>
                  <option value="INTERVIEW">Röportaj</option>
                  <option value="OPINION">Görüş</option>
                </select>
              </div>
            </div>

            <ImageInput
              label="Kapak Görseli"
              value={formData.coverImage}
              onChange={(value) => setFormData({ ...formData, coverImage: value })}
              placeholder="Kapak görseli URL'si"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Etiketler</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="teknoloji, yapay zeka, yazılım (virgülle ayırın)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">SEO Anahtar Kelimeler</label>
              <Input
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="anahtar kelime 1, anahtar kelime 2 (virgülle ayırın)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Başlık</label>
              <Input
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="SEO için meta başlık (opsiyonel)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Açıklama</label>
              <textarea
                className="w-full min-h-[60px] px-3 py-2 border rounded-md text-sm"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="SEO için meta açıklama (opsiyonel)..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Durum</label>
              <select
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="DRAFT">Taslak</option>
                <option value="PUBLISHED">Yayınla</option>
                <option value="SCHEDULED">Zamanla</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Oluşturuluyor..." : "Makale Oluştur"}
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
