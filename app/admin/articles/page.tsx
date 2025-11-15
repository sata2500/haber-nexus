 
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  status: string
  type: string
  publishedAt: string | null
  createdAt: string
  author: {
    id: string
    name: string | null
    email: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  tags: {
    id: string
    name: string
    slug: string
  }[]
  _count: {
    comments: number
    likes: number
    bookmarks: number
  }
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "destructive",
}

const statusLabels: Record<string, string> = {
  DRAFT: "Taslak",
  PUBLISHED: "Yayında",
  ARCHIVED: "Arşivlenmiş",
}

const typeLabels: Record<string, string> = {
  NEWS: "Haber",
  BLOG: "Blog",
  ANALYSIS: "Analiz",
  INTERVIEW: "Röportaj",
  OPINION: "Görüş",
}

export default function ArticlesPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const fetchArticles = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append("status", statusFilter)
      
      const response = await fetch(`/api/articles?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const handleDelete = async (id: string) => {
    if (!confirm("Bu makaleyi silmek istediğinizden emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchArticles()
      } else {
        const data = await response.json()
        alert(data.error || "Makale silinemedi")
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      alert("Bir hata oluştu")
    }
  }

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Makale Yönetimi</h1>
          <p className="text-muted-foreground mt-2">
            Tüm makaleleri yönetin
          </p>
        </div>
        <Button onClick={() => router.push("/admin/articles/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Makale
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Arama ve Filtreleme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Makale başlığı veya slug ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("")}
            >
              Tümü
            </Button>
            <Button
              variant={statusFilter === "DRAFT" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("DRAFT")}
            >
              Taslaklar
            </Button>
            <Button
              variant={statusFilter === "PUBLISHED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("PUBLISHED")}
            >
              Yayında
            </Button>
            <Button
              variant={statusFilter === "ARCHIVED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("ARCHIVED")}
            >
              Arşivlenmiş
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Henüz makale oluşturulmamış</p>
            <Button className="mt-4" onClick={() => router.push("/admin/articles/new")}>
              İlk Makaleyi Oluştur
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={statusColors[article.status]}>
                        {statusLabels[article.status]}
                      </Badge>
                      <Badge variant="outline">
                        {typeLabels[article.type]}
                      </Badge>
                      {article.category && (
                        <Badge variant="secondary">
                          {article.category.name}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div>
                        Yazar: {article.author.name || article.author.email}
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span>{article._count.likes} beğeni</span>
                        <span>{article._count.comments} yorum</span>
                        <span>{article._count.bookmarks} kayıt</span>
                      </div>
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {article.tags.map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-xs">
                              {tag?.name || 'Etiket'}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {article.status === "PUBLISHED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/articles/${article.slug}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
