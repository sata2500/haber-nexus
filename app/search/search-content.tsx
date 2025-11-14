"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, FileText, FolderTree, Tag, Clock } from "lucide-react"
import Link from "next/link"

interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  category: { name: string }
  author: { name?: string; email: string }
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  _count: { articles: number }
}

interface Tag {
  id: string
  name: string
  useCount: number
}

interface SearchResults {
  query: string
  articles: Article[]
  categories: Category[]
  tags: Tag[]
  total: number
}

export default function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  
  const [query, setQuery] = useState(initialQuery)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const performSearch = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${activeTab}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, activeTab])

  useEffect(() => {
    if (searchQuery.length >= 2) {
      performSearch()
    }
  }, [searchQuery, activeTab, performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(query)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Arama</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Makale, kategori veya tag ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Ara</Button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "all"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("all")}
        >
          Tümü {results && `(${results.total})`}
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "articles"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("articles")}
        >
          Makaleler {results && `(${results.articles.length})`}
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "categories"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          Kategoriler {results && `(${results.categories.length})`}
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "tags"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("tags")}
        >
          Etiketler {results && `(${results.tags.length})`}
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aranıyor...</p>
        </div>
      ) : !results ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Aramak için yukarıdaki kutuya yazın
            </p>
          </CardContent>
        </Card>
      ) : results.total === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              &quot;{results.query}&quot; için sonuç bulunamadı
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Articles */}
          {(activeTab === "all" || activeTab === "articles") && results.articles.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Makaleler ({results.articles.length})
              </h2>
              <div className="space-y-4">
                {results.articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{article.category.name}</Badge>
                      </div>
                      <CardTitle className="text-lg">
                        <Link
                          href={`/articles/${article.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                      </CardTitle>
                      {article.excerpt && (
                        <CardDescription>{article.excerpt}</CardDescription>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span>{article.author.name || article.author.email}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.ceil(article.content.split(" ").length / 200)} dk
                        </span>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {(activeTab === "all" || activeTab === "categories") && results.categories.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                Kategoriler ({results.categories.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {results.categories.map((category) => (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-base">
                        <Link
                          href={`/categories/${category.slug}`}
                          className="hover:text-primary transition-colors flex items-center gap-2"
                        >
                          {category.icon && <span>{category.icon}</span>}
                          {category.name}
                        </Link>
                      </CardTitle>
                      {category.description && (
                        <CardDescription className="text-sm">
                          {category.description}
                        </CardDescription>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {category._count.articles} makale
                      </p>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {(activeTab === "all" || activeTab === "tags") && results.tags.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Etiketler ({results.tags.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {results.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {tag.name} ({tag.useCount})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
