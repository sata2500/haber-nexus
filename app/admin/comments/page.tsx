 
"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Trash2, CheckCircle, XCircle, User, Calendar } from "lucide-react"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    name: string | null
    email: string
  }
  article: {
    id: string
    title: string
  }
  approved: boolean
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all")

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch("/api/comments")
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved: true }),
      })

      if (response.ok) {
        fetchComments()
      } else {
        alert("Yorum onaylanamadı")
      }
    } catch (error) {
      console.error("Error approving comment:", error)
      alert("Bir hata oluştu")
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved: false }),
      })

      if (response.ok) {
        fetchComments()
      } else {
        alert("Yorum reddedilemedi")
      }
    } catch (error) {
      console.error("Error rejecting comment:", error)
      alert("Bir hata oluştu")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yorumu silmek istediğinizden emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchComments()
      } else {
        alert("Yorum silinemedi")
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("Bir hata oluştu")
    }
  }

  const filteredComments = comments
    .filter((comment) => {
      if (filter === "approved") return comment.approved
      if (filter === "pending") return !comment.approved
      return true
    })
    .filter((comment) =>
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Yorum Yönetimi</h1>
          <p className="text-muted-foreground mt-2">
            Kullanıcı yorumlarını yönetin ve moderasyon yapın
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arama ve Filtreleme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Yorum içeriği, kullanıcı veya makale ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Tümü
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("approved")}
            >
              Onaylı
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              Onay Bekleyen
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      ) : filteredComments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchQuery ? "Arama kriterlerine uygun yorum bulunamadı" : "Henüz yorum yok"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={comment.approved ? "default" : "secondary"}>
                        {comment.approved ? "Onaylı" : "Onay Bekliyor"}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{comment.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {comment.user.name || comment.user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(comment.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                      <Link
                        href={`/articles/${comment.article.id}`}
                        className="text-primary hover:underline"
                      >
                        {comment.article.title}
                      </Link>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!comment.approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(comment.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {comment.approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(comment.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
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

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Yorum Moderasyonu</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Onaylama:</strong> Yorumu onayladığınızda makale sayfasında görünür hale gelir.
          </p>
          <p>
            <strong>Reddetme:</strong> Yorumu reddederseniz makale sayfasında görünmez.
          </p>
          <p>
            <strong>Silme:</strong> Yorumu kalıcı olarak siler (geri alınamaz).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
