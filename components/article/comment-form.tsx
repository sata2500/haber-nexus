"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Comment {
  id: string
  content: string
  createdAt: string
  userId: string
  articleId: string
  parentId?: string | null
  user: {
    id: string
    name: string
    image?: string | null
  }
}

interface CommentFormProps {
  articleId: string
  parentId?: string
  onCommentAdded: (comment: Comment) => void
  onCancel?: () => void
  placeholder?: string
  submitLabel?: string
}

export function CommentForm({
  articleId,
  parentId,
  onCommentAdded,
  onCancel,
  placeholder = "Yorumunuzu yazın...",
  submitLabel = "Yorum Yap",
}: CommentFormProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError("Yorum içeriği boş olamaz")
      return
    }

    if (content.length < 3) {
      setError("Yorum en az 3 karakter olmalıdır")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleId,
          content: content.trim(),
          parentId: parentId || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Yorum gönderilemedi")
      }

      const newComment = await response.json()
      setContent("")
      onCommentAdded(newComment)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="focus:ring-primary min-h-[100px] w-full resize-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        disabled={loading}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={loading || !content.trim()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            submitLabel
          )}
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            İptal
          </Button>
        )}
      </div>

      {!parentId && (
        <p className="text-muted-foreground text-xs">
          Yorumunuz moderasyon sonrası yayınlanacaktır.
        </p>
      )}
    </form>
  )
}
