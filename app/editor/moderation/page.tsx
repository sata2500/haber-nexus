 
"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Check, X, AlertTriangle, User } from "lucide-react"

interface Comment {
  id: string
  content: string
  status: string
  flagCount: number
  createdAt: string
  user: {
    name: string | null
    email: string
  }
  article: {
    title: string
  }
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Beklemede",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
  FLAGGED: "İşaretlendi"
}

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  FLAGGED: "outline"
}

export default function ModerationPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("PENDING")

  const fetchComments = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append("status", statusFilter)
      
      const response = await fetch(`/api/editor/comments?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleModerate = async (commentId: string, action: "APPROVED" | "REJECTED") => {
    try {
      const response = await fetch(`/api/editor/comments/${commentId}/moderate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      })

      if (response.ok) {
        fetchComments()
      } else {
        const data = await response.json()
        alert(data.error || "İşlem başarısız")
      }
    } catch (error) {
      console.error("Error moderating comment:", error)
      alert("Bir hata oluştu")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Yorum Moderasyonu</h1>
        <p className="text-muted-foreground mt-2">
          Kullanıcı yorumlarını inceleyin ve moderasyon edin
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtreleme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === "PENDING" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("PENDING")}
            >
              Beklemede
            </Button>
            <Button
              variant={statusFilter === "FLAGGED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("FLAGGED")}
            >
              İşaretlenmiş
            </Button>
            <Button
              variant={statusFilter === "APPROVED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("APPROVED")}
            >
              Onaylanmış
            </Button>
            <Button
              variant={statusFilter === "REJECTED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("REJECTED")}
            >
              Reddedilmiş
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      ) : comments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Bu kategoride yorum bulunamadı
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={STATUS_COLORS[comment.status]}>
                        {STATUS_LABELS[comment.status]}
                      </Badge>
                      {comment.flagCount > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {comment.flagCount} işaretleme
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mb-3">
                      <span className="flex items-center gap-1 mb-1">
                        <User className="h-3 w-3" />
                        {comment.user.name || comment.user.email}
                      </span>
                      <span className="text-xs">
                        Makale: {comment.article.title}
                      </span>
                    </CardDescription>
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(comment.createdAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  {(comment.status === "PENDING" || comment.status === "FLAGGED") && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleModerate(comment.id, "APPROVED")}
                      >
                        <Check className="h-4 w-4" />
                        Onayla
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleModerate(comment.id, "REJECTED")}
                      >
                        <X className="h-4 w-4" />
                        Reddet
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
