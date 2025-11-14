"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Search, Clock, User } from "lucide-react"
import Link from "next/link"

interface Article {
  id: string
  title: string
  excerpt: string | null
  submittedAt: string
  author: {
    name: string | null
    email: string
  }
  category: {
    name: string
  } | null
  qualityScore: number | null
  aiGenerated: boolean
}

export default function EditorReviewPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchArticles = useCallback(async () => {
    try {
      const response = await fetch("/api/editor/pending")
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getQualityBadge = (score: number | null) => {
    if (!score) return null
    if (score >= 0.8) return <Badge variant="default">Yüksek Kalite</Badge>
    if (score >= 0.6) return <Badge variant="outline">Orta Kalite</Badge>
    return <Badge variant="secondary">Düşük Kalite</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Onay Bekleyen Makaleler</h1>
          <p className="text-muted-foreground mt-2">
            Yazarlar tarafından gönderilen makaleleri inceleyin
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arama</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Makale başlığı veya yazar adı ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
            <FileCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchQuery ? "Arama kriterlerine uygun makale bulunamadı" : "Onay bekleyen makale yok"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      {article.aiGenerated && (
                        <Badge variant="outline" className="text-xs">
                          🤖 AI
                        </Badge>
                      )}
                      {getQualityBadge(article.qualityScore)}
                    </div>
                    {article.excerpt && (
                      <CardDescription className="line-clamp-2 mb-3">
                        {article.excerpt}
                      </CardDescription>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.author.name || article.author.email}
                      </span>
                      {article.category && (
                        <span className="px-2 py-0.5 bg-secondary rounded text-xs">
                          {article.category.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(article.submittedAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </div>
                  <Link href={`/editor/review/${article.id}`}>
                    <Button variant="default" size="sm">
                      İncele
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
