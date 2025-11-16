"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, Eye, Calendar, User } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  type: string
  status: string
  viewCount: number
  likeCount: number
  createdAt: string
  publishedAt: string | null
  author: {
    id: string
    name: string | null
    email: string
  }
  category: {
    id: string
    name: string
  } | null
  tags: { id: string; name: string }[]
}

export default function EditorReviewDetailPage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)

  const fetchArticle = useCallback(async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}`)
      if (response.ok) {
        const data = await response.json()
        setArticle(data)
      }
    } catch (error) {
      console.error("Error fetching article:", error)
    } finally {
      setLoading(false)
    }
  }, [articleId])

  useEffect(() => {
    fetchArticle()
  }, [fetchArticle])

  const handleApprove = async () => {
    if (!confirm("Bu makaleyi onaylamak istediğinizden emin misiniz?")) {
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "PUBLISHED",
          publishedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        alert("Makale başarıyla onaylandı ve yayınlandı!")
        router.push("/editor/review")
      } else {
        const data = await response.json()
        alert(data.error || "Makale onaylanamadı")
      }
    } catch (error) {
      console.error("Error approving article:", error)
      alert("Bir hata oluştu")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!feedback.trim()) {
      alert("Lütfen reddetme sebebini belirtin")
      return
    }

    if (!confirm("Bu makaleyi reddetmek istediğinizden emin misiniz?")) {
      return
    }

    setActionLoading(true)
    try {
      // Makaleyi taslağa çevir ve feedback gönder
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "DRAFT",
        }),
      })

      if (response.ok) {
        // Yazara bildirim gönder (gelecekte eklenecek)
        alert("Makale reddedildi ve yazara bildirim gönderildi!")
        router.push("/editor/review")
      } else {
        const data = await response.json()
        alert(data.error || "Makale reddedilemedi")
      }
    } catch (error) {
      console.error("Error rejecting article:", error)
      alert("Bir hata oluştu")
    } finally {
      setActionLoading(false)
    }
  }

  const handleRequestRevision = async () => {
    if (!feedback.trim()) {
      alert("Lütfen revizyon talebinizi belirtin")
      return
    }

    setActionLoading(true)
    try {
      // Yazara feedback gönder (gelecekte eklenecek)
      alert("Revizyon talebi yazara gönderildi!")
      setShowFeedback(false)
      setFeedback("")
    } catch (error) {
      console.error("Error requesting revision:", error)
      alert("Bir hata oluştu")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl py-10">
        <p className="text-muted-foreground text-center">Yükleniyor...</p>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-5xl py-10">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Makale Bulunamadı</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFeedback(!showFeedback)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Feedback Gönder
          </Button>
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={actionLoading}
            className="text-red-600 hover:text-red-700"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reddet
          </Button>
          <Button onClick={handleApprove} disabled={actionLoading}>
            <CheckCircle className="mr-2 h-4 w-4" />
            {actionLoading ? "İşleniyor..." : "Onayla ve Yayınla"}
          </Button>
        </div>
      </div>

      {showFeedback && (
        <Card className="border-orange-500 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="text-base">Editör Feedback</CardTitle>
            <CardDescription>Yazara geri bildirim gönderin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="focus:ring-ring min-h-[120px] w-full resize-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Makale hakkında yorumlarınızı yazın..."
            />
            <div className="flex gap-2">
              <Button
                onClick={handleRequestRevision}
                disabled={!feedback.trim() || actionLoading}
                size="sm"
              >
                Revizyon Talep Et
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowFeedback(false)
                  setFeedback("")
                }}
                size="sm"
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="mb-2 text-2xl">{article.title}</CardTitle>
              <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                <Badge variant="secondary">{article.status}</Badge>
                {article.category && (
                  <span className="bg-secondary rounded px-2 py-0.5 text-xs">
                    {article.category.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {article.author.name || article.author.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(article.createdAt).toLocaleDateString("tr-TR")}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.viewCount} görüntülenme
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {article.coverImage && (
        <Card>
          <CardContent className="pt-6">
            <Image
              src={article.coverImage}
              alt={article.title}
              width={1200}
              height={630}
              className="h-auto w-full rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {article.excerpt && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Özet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{article.excerpt}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">İçerik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {article.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Etiketler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Editör Notları</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>
            <strong>Onaylama:</strong> Makaleyi onayladığınızda otomatik olarak yayınlanacaktır.
          </p>
          <p>
            <strong>Reddetme:</strong> Makale taslağa çevrilecek ve yazar bilgilendirilecektir.
          </p>
          <p>
            <strong>Revizyon:</strong> Yazardan belirli değişiklikler talep edebilirsiniz.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
