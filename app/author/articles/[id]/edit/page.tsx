"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, Send } from "lucide-react"
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
  authorId: string
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()
  const articleId = params.id as string

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [saveType, setSaveType] = useState<"draft" | "publish">("draft")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    type: "BLOG",
    status: "DRAFT",
    categoryId: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
  })

  const fetchArticle = useCallback(async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}`)
      if (response.ok) {
        const data: Article = await response.json()

        // Yetki kontrolü - sadece kendi makalelerini düzenleyebilir
        if (data.authorId !== session?.user?.id) {
          setError("Bu makaleyi düzenleme yetkiniz yok")
          return
        }

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
      } else {
        setError("Makale bulunamadı")
      }
    } catch (error) {
      console.error("Error fetching article:", error)
      setError("Makale yüklenirken hata oluştu")
    } finally {
      setFetching(false)
    }
  }, [articleId, session])

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
    if (session) {
      fetchArticle()
      fetchCategories()
    }
  }, [fetchArticle, fetchCategories, session])

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

  const handleSubmit = async (e: React.FormEvent, type: "draft" | "publish") => {
    e.preventDefault()
    setLoading(true)
    setSaveType(type)

    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const keywords = formData.keywords
        .split(",")
        .map((kw) => kw.trim())
        .filter((kw) => kw.length > 0)

      const status = type === "publish" ? "PUBLISHED" : "DRAFT"

      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status,
          tags,
          keywords,
          publishedAt:
            status === "PUBLISHED" && formData.status !== "PUBLISHED"
              ? new Date().toISOString()
              : undefined,
        }),
      })

      if (response.ok) {
        if (type === "publish") {
          alert("Makale başarıyla güncellendi ve yayınlandı!")
        } else {
          alert("Makale başarıyla güncellendi!")
        }
        router.push("/author/articles")
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
      <div className="mx-auto max-w-5xl py-10">
        <p className="text-muted-foreground text-center">Yükleniyor...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl py-10">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Hata</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={(e) => handleSubmit(e, "draft")}
            disabled={loading || !formData.title || !formData.content}
          >
            <Save className="mr-2 h-4 w-4" />
            {loading && saveType === "draft" ? "Kaydediliyor..." : "Güncelle"}
          </Button>
          <Button
            onClick={(e) => handleSubmit(e, "publish")}
            disabled={loading || !formData.title || !formData.content || !formData.categoryId}
          >
            <Send className="mr-2 h-4 w-4" />
            {loading && saveType === "publish" ? "Yayınlanıyor..." : "Yayınla"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Makale Düzenle</CardTitle>
          <CardDescription>Makalenizi düzenleyin ve değişiklikleri kaydedin</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Başlık */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Başlık <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Makale başlığı..."
                required
                className="text-lg"
              />
            </div>

            {/* Slug */}
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
              <p className="text-muted-foreground text-xs">
                URL&apos;de kullanılacak benzersiz tanımlayıcı
              </p>
            </div>

            {/* Özet */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Özet</label>
              <textarea
                className="focus:ring-ring min-h-[80px] w-full resize-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Makalenizin kısa bir özeti..."
              />
            </div>

            {/* İçerik */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                İçerik <span className="text-destructive">*</span>
              </label>
              <textarea
                className="focus:ring-ring min-h-[400px] w-full resize-none rounded-md border px-3 py-2 font-mono text-sm focus:ring-2 focus:outline-none"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Makale içeriği (Markdown destekli)..."
                required
              />
              <p className="text-muted-foreground text-xs">Markdown formatında yazabilirsiniz</p>
            </div>

            {/* Kategori ve Tür */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Kategori <span className="text-destructive">*</span>
                </label>
                <select
                  className="focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
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
                <label className="text-sm font-medium">Makale Türü</label>
                <select
                  className="focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="BLOG">Blog Yazısı</option>
                  <option value="NEWS">Haber</option>
                  <option value="ANALYSIS">Analiz</option>
                  <option value="INTERVIEW">Röportaj</option>
                  <option value="OPINION">Görüş/Yorum</option>
                </select>
              </div>
            </div>

            {/* Kapak Görseli */}
            <ImageInput
              label="Kapak Görseli"
              value={formData.coverImage}
              onChange={(value) => setFormData({ ...formData, coverImage: value })}
              placeholder="Kapak görseli URL'si"
            />

            {/* Etiketler */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Etiketler</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="teknoloji, yazılım, yapay zeka (virgülle ayırın)"
              />
            </div>

            {/* SEO Bölümü */}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">SEO Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Başlık</label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="SEO için özel başlık"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Açıklama</label>
                  <textarea
                    className="focus:ring-ring min-h-[60px] w-full resize-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Arama motorlarında görünecek açıklama"
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
              </CardContent>
            </Card>

            {/* Durum Bilgisi */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-sm">
                  <p className="text-muted-foreground">
                    <strong>Mevcut Durum:</strong>{" "}
                    {formData.status === "PUBLISHED" ? "Yayında" : "Taslak"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
