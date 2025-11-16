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
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&type=${activeTab}`
      )
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
    <div className="mx-auto max-w-4xl">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Arama</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
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
      <div className="mb-6 flex gap-2 border-b">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "all"
              ? "border-primary text-primary border-b-2"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("all")}
        >
          Tümü {results && `(${results.total})`}
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "articles"
              ? "border-primary text-primary border-b-2"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("articles")}
        >
          Makaleler {results && `(${results.articles.length})`}
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "categories"
              ? "border-primary text-primary border-b-2"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          Kategoriler {results && `(${results.categories.length})`}
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "tags"
              ? "border-primary text-primary border-b-2"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("tags")}
        >
          Etiketler {results && `(${results.tags.length})`}
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Aranıyor...</p>
        </div>
      ) : !results ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">Aramak için yukarıdaki kutuya yazın</p>
          </CardContent>
        </Card>
      ) : results.total === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
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
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <FileText className="h-5 w-5" />
                Makaleler ({results.articles.length})
              </h2>
              <div className="space-y-4">
                {results.articles.map((article) => (
                  <Card key={article.id} className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="mb-2 flex items-center gap-2">
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
                      {article.excerpt && <CardDescription>{article.excerpt}</CardDescription>}
                      <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
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
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <FolderTree className="h-5 w-5" />
                Kategoriler ({results.categories.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {results.categories.map((category) => (
                  <Card key={category.id} className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base">
                        <Link
                          href={`/categories/${category.slug}`}
                          className="hover:text-primary flex items-center gap-2 transition-colors"
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
                      <p className="text-muted-foreground mt-2 text-xs">
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
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Tag className="h-5 w-5" />
                Etiketler ({results.tags.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {results.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
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
