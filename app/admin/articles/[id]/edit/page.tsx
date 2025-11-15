"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Eye, Edit3 } from "lucide-react"
import { ImageInput } from "@/components/admin/image-input"
import { MarkdownEditor } from "@/components/editor/markdown-editor"
import { MarkdownRenderer } from "@/components/editor/markdown-renderer"

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
  const [previewMode, setPreviewMode] = useState(false)
  
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
    scheduledFor: "",
  })

  const fetchArticle = useCallback(async () => {
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
          scheduledFor: (data as any).publishedAt ? new Date((data as any).publishedAt).toISOString().slice(0, 16) : "",
        })
      }
    } catch (error) {
      console.error("Error fetching article:", error)
    } finally {
      setFetching(false)
    }
  }, [articleId])

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
    fetchArticle()
    fetchCategories()
  }, [fetchArticle, fetchCategories])

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

      let publishedAt = null
      let scheduledAt = null
      
      if (formData.status === "PUBLISHED") {
        publishedAt = new Date().toISOString()
      } else if (formData.status === "SCHEDULED" && formData.scheduledFor) {
        scheduledAt = new Date(formData.scheduledFor).toISOString()
      }

      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags,
          keywords,
          publishedAt,
          scheduledAt,
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
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  İçerik <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={!previewMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode(false)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Düzenle
                  </Button>
                  <Button
                    type="button"
                    variant={previewMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode(true)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Önizle
                  </Button>
                </div>
              </div>
              {!previewMode ? (
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Makale içeriğinizi markdown formatında yazın..."
                  minHeight="400px"
                />
              ) : (
                <div className="border rounded-md p-6 min-h-[400px] bg-white dark:bg-gray-900">
                  <MarkdownRenderer content={formData.content} />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Markdown formatını kullanabilirsiniz. <strong>**kalın**</strong>, <em>*italik*</em>, 
                başlıklar için # kullanın.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {formData.status === "SCHEDULED" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Yayın Tarihi ve Saati <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Makale bu tarihte otomatik olarak yayınlanacaktır
                  </p>
                </div>
              )}
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
