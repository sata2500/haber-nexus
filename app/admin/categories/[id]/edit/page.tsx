 
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  parentId: string | null
  order: number
  isActive: boolean
}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
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

  const fetchCategory = useCallback(async () => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          icon: data.icon || "",
          color: data.color || "",
          parentId: data.parentId || "",
          order: data.order,
          isActive: data.isActive,
        })
      }
    } catch (error) {
      console.error("Error fetching category:", error)
    } finally {
      setFetching(false)
    }
  }, [categoryId])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.filter((c: Category) => c.id !== categoryId))
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }, [categoryId])

  useEffect(() => {
    fetchCategory()
    fetchCategories()
  }, [fetchCategory, fetchCategories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
        }),
      })

      if (response.ok) {
        router.push("/admin/categories")
      } else {
        const data = await response.json()
        alert(data.error || "Kategori güncellenemedi")
      }
    } catch (error) {
      console.error("Error updating category:", error)
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
    <div className="container mx-auto py-10 max-w-2xl">
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
          <CardTitle>Kategori Düzenle</CardTitle>
          <CardDescription>
            Kategori bilgilerini güncelleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Kategori Adı <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <p className="text-xs text-muted-foreground">
                URL&apos;de kullanılacak benzersiz tanımlayıcı
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Açıklama</label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border rounded-md text-sm"
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
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              >
                <option value="">Ana Kategori</option>
                {categories.map((category) => (
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
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                Aktif
              </label>
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
