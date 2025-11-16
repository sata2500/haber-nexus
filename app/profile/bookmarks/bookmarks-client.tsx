"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Eye, Heart, Calendar, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BookmarkedArticle {
  id: string
  article: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    viewCount: number
    likeCount: number
    publishedAt: string | null
    category: {
      name: string
    } | null
    author: {
      name: string | null
    }
  }
  createdAt: string
}

interface BookmarksClientProps {
  initialBookmarks: BookmarkedArticle[]
}

export function BookmarksClient({ initialBookmarks }: BookmarksClientProps) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks)

  const handleRemove = async (articleId: string) => {
    if (!confirm("Bu makaleyi kaydedilenlerden kaldırmak istediğinizden emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/articles/${articleId}/bookmark`, {
        method: "DELETE",
      })

      if (response.ok) {
        setBookmarks(bookmarks.filter((b) => b.article.id !== articleId))
      } else {
        alert("İşlem başarısız")
      }
    } catch (error) {
      console.error("Error removing bookmark:", error)
      alert("Bir hata oluştu")
    }
  }

  if (bookmarks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Bookmark className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground mb-4">Henüz kaydettiğiniz makale yok</p>
          <Link href="/">
            <Button>Makaleleri Keşfet</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{bookmarks.length} Kayıtlı Makale</CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {bookmarks.map((bookmark) => (
          <Card key={bookmark.id} className="overflow-hidden transition-shadow hover:shadow-md">
            {bookmark.article.coverImage && (
              <div className="relative h-48 w-full">
                <Image
                  src={bookmark.article.coverImage}
                  alt={bookmark.article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="mb-2 flex items-start gap-2">
                {bookmark.article.category && (
                  <Badge variant="secondary" className="text-xs">
                    {bookmark.article.category.name}
                  </Badge>
                )}
              </div>
              <Link href={`/articles/${bookmark.article.slug}`}>
                <CardTitle className="hover:text-primary line-clamp-2 text-lg transition-colors">
                  {bookmark.article.title}
                </CardTitle>
              </Link>
              {bookmark.article.excerpt && (
                <CardDescription className="line-clamp-2">
                  {bookmark.article.excerpt}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {bookmark.article.viewCount}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {bookmark.article.likeCount}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {bookmark.article.publishedAt
                    ? new Date(bookmark.article.publishedAt).toLocaleDateString("tr-TR")
                    : "Tarih yok"}
                </span>
              </div>
              <div className="flex gap-2">
                <Link href={`/articles/${bookmark.article.slug}`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full">
                    Oku
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(bookmark.article.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
