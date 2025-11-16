"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

interface Category {
  id: string
  name: string
}

export default function NewCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "",
    parentId: "",
    order: 0,
    isActive: true,
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

  const generateSlug = (name: string) => {
    return name
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

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || undefined,
        }),
      })

      if (response.ok) {
        router.push("/admin/categories")
      } else {
        const data = await response.json()
        alert(data.error || "Kategori oluşturulamadı")
      }
    } catch (error) {
      console.error("Error creating category:", error)
      alert("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Geri
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Kategori Oluştur</CardTitle>
          <CardDescription>Haber kategorisi ekleyin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Kategori Adı <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Örn: Teknoloji"
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
                placeholder="teknoloji"
                required
              />
              <p className="text-muted-foreground text-xs">
                URL&apos;de kullanılacak benzersiz tanımlayıcı
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Açıklama</label>
              <textarea
                className="min-h-[100px] w-full rounded-md border px-3 py-2 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kategori açıklaması..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">İkon (Emoji)</label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="💻"
                  maxLength={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Renk</label>
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Üst Kategori</label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              >
                <option value="">Ana Kategori</option>
                {categories
                  .filter((c) => !c.id)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sıralama</label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-muted-foreground text-xs">
                Kategorilerin görüntülenme sırası (küçükten büyüğe)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="isActive" className="cursor-pointer text-sm font-medium">
                Aktif
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Oluşturuluyor..." : "Kategori Oluştur"}
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
