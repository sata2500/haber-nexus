"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Heart, MessageSquare, FilePlus, Search } from "lucide-react"
import Link from "next/link"

interface Article {
  id: string
  title: string
  excerpt: string | null
  status: string
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
  publishedAt: string | null
  category: {
    name: string
  } | null
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Taslak",
  PUBLISHED: "Yayında",
  ARCHIVED: "Arşiv"
}

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "destructive"
}

export default function AuthorArticlesPage() {
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "")

  const fetchArticles = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append("status", statusFilter)
      
      const response = await fetch(`/api/author/articles?${params.toString()}`)
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
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Makalelerim</h1>
          <p className="text-muted-foreground mt-2">
            Tüm makalelerinizi görüntüleyin ve yönetin
          </p>
        </div>
        <Link href="/author/articles/new">
          <Button className="gap-2">
            <FilePlus className="h-4 w-4" />
            Yeni Makale
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arama ve Filtreleme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Makale başlığı ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
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
              Taslak
            </Button>
            <Button
              variant={statusFilter === "PUBLISHED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("PUBLISHED")}
            >
              Yayında
            </Button>
            <Button
              size="sm"
            >
              Planlanmış
            </Button>
            <Button
              variant={statusFilter === "ARCHIVED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("ARCHIVED")}
            >
              Arşiv
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
            <FilePlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Arama kriterlerine uygun makale bulunamadı" : "Henüz makale oluşturmadınız"}
            </p>
            <Link href="/author/articles/new">
              <Button>
                <FilePlus className="h-4 w-4 mr-2" />
                Yeni Makale Oluştur
              </Button>
            </Link>
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
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <Badge variant={STATUS_COLORS[article.status]}>
                        {STATUS_LABELS[article.status]}
                      </Badge>
                    </div>
                    {article.excerpt && (
                      <CardDescription className="line-clamp-2">
                        {article.excerpt}
                      </CardDescription>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                      {article.category && (
                        <span className="px-2 py-0.5 bg-secondary rounded text-xs">
                          {article.category.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {article.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {article.commentCount}
                      </span>
                      <span>
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString("tr-TR")
                          : new Date(article.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/author/articles/${article.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
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
