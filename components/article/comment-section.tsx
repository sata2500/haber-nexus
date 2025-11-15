"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { MessageSquare, Loader2 } from "lucide-react"
import { CommentForm } from "./comment-form"
import { CommentItem } from "./comment-item"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

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
  replies?: Comment[]
  likeCount?: number
  status?: string
}

interface CommentSectionProps {
  articleId: string
  initialCommentCount: number
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const { status } = useSession()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?articleId=${articleId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }, [articleId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleCommentAdded = () => {
    // Refresh comments to get updated list
    fetchComments()
    setShowForm(false)
    router.refresh()
  }

  const handleReplyAdded = () => {
    fetchComments()
    router.refresh()
  }

  const handleCommentClick = () => {
    if (status !== "authenticated") {
      router.push("/auth/signin")
      return
    }
    setShowForm(true)
  }

  return (
    <section className="mt-12 border-t pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Yorumlar ({comments.length})
        </h2>
        
        {status === "authenticated" && !showForm && (
          <Button onClick={() => setShowForm(true)}>
            Yorum Yap
          </Button>
        )}
        
        {status !== "authenticated" && (
          <Button onClick={handleCommentClick}>
            Yorum Yapmak İçin Giriş Yapın
          </Button>
        )}
      </div>

      {/* Comment Form */}
      {showForm && status === "authenticated" && (
        <div className="mb-8">
          <CommentForm
            articleId={articleId}
            onCommentAdded={handleCommentAdded}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Henüz yorum yok</h3>
          <p className="text-muted-foreground mb-4">
            İlk yorumu yapan siz olun!
          </p>
          {status === "authenticated" && !showForm && (
            <Button onClick={() => setShowForm(true)}>
              İlk Yorumu Yap
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              onReplyAdded={handleReplyAdded}
            />
          ))}
        </div>
      )}
    </section>
  )
}
