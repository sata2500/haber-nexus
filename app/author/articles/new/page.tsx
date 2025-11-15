 
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function NewArticlePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [saveType, setSaveType] = useState<"draft" | "publish">("draft")
  
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

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status,
          tags,
          keywords,
          publishedAt: status === "PUBLISHED" ? new Date().toISOString() : undefined,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (type === "publish") {
          alert("Makale başarıyla yayınlandı!")
        } else {
          alert("Makale taslak olarak kaydedildi!")
        }
        router.push("/author/articles")
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
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
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
            {loading && saveType === "draft" ? "Kaydediliyor..." : "Taslak Kaydet"}
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
          <CardTitle>Yeni Makale Oluştur</CardTitle>
          <CardDescription>
            Yeni bir makale yazın, taslak olarak kaydedin veya hemen yayınlayın
          </CardDescription>
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
              <p className="text-xs text-muted-foreground">
                URL&apos;de kullanılacak benzersiz tanımlayıcı (otomatik oluşturuldu)
              </p>
            </div>

            {/* Özet */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Özet</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Makalenizin kısa bir özeti (opsiyonel)..."
              />
              <p className="text-xs text-muted-foreground">
                Bu özet, makale listelerinde ve sosyal medya paylaşımlarında görünecektir
              </p>
            </div>

            {/* İçerik */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                İçerik <span className="text-destructive">*</span>
              </label>
              <textarea
                className="w-full min-h-[400px] px-3 py-2 border rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Makale içeriğinizi buraya yazın...

Markdown formatını kullanabilirsiniz:

# Başlık 1
## Başlık 2
### Başlık 3

**Kalın metin**
*İtalik metin*

- Liste öğesi 1
- Liste öğesi 2

[Link metni](https://example.com)

![Görsel açıklaması](gorsel-url.jpg)"
                required
              />
              <p className="text-xs text-muted-foreground">
                Markdown formatında yazabilirsiniz. Başlıklar, listeler, linkler ve görseller desteklenir.
              </p>
            </div>

            {/* Kategori ve Tür */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Kategori <span className="text-destructive">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                <p className="text-xs text-muted-foreground">
                  Makalenizin hangi kategoriye ait olduğunu seçin
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Makale Türü</label>
                <select
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
              <p className="text-xs text-muted-foreground">
                Makalenizle ilgili etiketler ekleyin (virgülle ayırarak)
              </p>
            </div>

            {/* SEO Bölümü */}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">SEO Ayarları (Opsiyonel)</CardTitle>
                <CardDescription className="text-xs">
                  Arama motorları için optimize edin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Başlık</label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="SEO için özel başlık (boş bırakılırsa makale başlığı kullanılır)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Açıklama</label>
                  <textarea
                    className="w-full min-h-[60px] px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Arama motorlarında görünecek açıklama (boş bırakılırsa özet kullanılır)"
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
              </CardContent>
            </Card>

            {/* Yayınlama Bilgisi */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">Yayınlama Seçenekleri</h4>
                    <p className="text-xs text-muted-foreground">
                      <strong>Taslak Kaydet:</strong> Makalenizi daha sonra düzenlemek üzere taslak olarak kaydedin.
                      <br />
                      <strong>Yayınla:</strong> Makalenizi hemen yayınlayın ve okuyucularla paylaşın.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
