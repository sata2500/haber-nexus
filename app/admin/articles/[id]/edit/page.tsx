"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { ImageInput } from "@/components/admin/image-input"

interface Category {
  id: string
  name: string
}

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  type: string
  status: string
  categoryId: string
  tags: { id: string; name: string }[]
  metaTitle: string | null
  metaDescription: string | null
  keywords: string[]
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
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
    fetchArticle()
    fetchCategories()
  }, [articleId])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}`)
      if (response.ok) {
        const data: Article = await response.json()
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || "",
          content: data.content,
          coverImage: data.coverImage || "",
          type: data.type,
          status: data.status,
          categoryId: data.categoryId,
          tags: data.tags.map((t) => t.name).join(", "),
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          keywords: data.keywords.join(", "),
        })
      }
    } catch (error) {
      console.error("Error fetching article:", error)
    } finally {
      setFetching(false)
    }
  }

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

      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags,
          keywords,
          publishedAt: formData.status === "PUBLISHED" ? new Date().toISOString() : null,
        }),
      })

      if (response.ok) {
        router.push("/admin/articles")
      } else {
        const data = await response.json()
        alert(data.error || "Makale güncellenemedi")
      }
    } catch (error) {
      console.error("Error updating article:", error)
      alert("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center text-muted-foreground">Yükleniyor...</p>
      </div>
    )
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
          <CardTitle>Makale Düzenle</CardTitle>
          <CardDescription>
            Makale bilgilerini güncelleyin
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Özet</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Kısa özet..."
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
                placeholder="Makale içeriği..."
                required
              />
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
              placeholder="Kapak görseli URL&apos;si"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Etiketler</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="teknoloji, yapay zeka (virgülle ayırın)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">SEO Anahtar Kelimeler</label>
              <Input
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="anahtar kelime 1, anahtar kelime 2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Başlık</label>
              <Input
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="SEO için meta başlık"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Açıklama</label>
              <textarea
                className="w-full min-h-[60px] px-3 py-2 border rounded-md text-sm"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="SEO için meta açıklama..."
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
                <option value="ARCHIVED">Arşivle</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Güncelleniyor..." : "Güncelle"}
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
