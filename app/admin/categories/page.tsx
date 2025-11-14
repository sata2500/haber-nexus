"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, FolderTree } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  isActive: boolean
  order: number
  parent: { id: string; name: string } | null
  children: { id: string; name: string }[]
  _count: {
    articles: number
  }
}

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?includeInactive=true")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCategories()
      } else {
        const data = await response.json()
        alert(data.error || "Kategori silinemedi")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Bir hata oluştu")
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const topLevelCategories = filteredCategories.filter((c) => !c.parent)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kategori Yönetimi</h1>
          <p className="text-muted-foreground mt-2">
            Haber kategorilerini yönetin
          </p>
        </div>
        <Button onClick={() => router.push("/admin/categories/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kategori
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Arama ve Filtreleme</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Kategori adı veya slug ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      ) : topLevelCategories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderTree className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Henüz kategori oluşturulmamış</p>
            <Button className="mt-4" onClick={() => router.push("/admin/categories/new")}>
              İlk Kategoriyi Oluştur
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {topLevelCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {category.icon && (
                        <span className="text-2xl">{category.icon}</span>
                      )}
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      {!category.isActive && (
                        <Badge variant="secondary">Pasif</Badge>
                      )}
                      <Badge variant="outline">
                        {category._count.articles} makale
                      </Badge>
                    </div>
                    <CardDescription>
                      Slug: <code className="text-xs bg-muted px-1 py-0.5 rounded">{category.slug}</code>
                      {category.description && (
                        <span className="block mt-1">{category.description}</span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      disabled={category._count.articles > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {category.children.length > 0 && (
                <CardContent>
                  <div className="border-l-2 border-muted pl-4 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Alt Kategoriler:
                    </p>
                    {category.children.map((child) => {
                      const childCategory = categories.find((c) => c.id === child.id)
                      return (
                        <div key={child.id} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{child.name}</span>
                            {childCategory && (
                              <Badge variant="outline" className="text-xs">
                                {childCategory._count.articles} makale
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/categories/${child.id}/edit`)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
