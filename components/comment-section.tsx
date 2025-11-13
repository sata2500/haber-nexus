"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MessageSquare, User, Send, Reply, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

interface Comment {
  id: string
  content: string
  createdAt: Date
  author: {
    name: string | null
    image: string | null
  }
  replies?: Comment[]
}

interface CommentSectionProps {
  postId: string
  comments: Comment[]
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !newComment.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: newComment,
        }),
      })

      if (response.ok) {
        setNewComment("")
        router.refresh()
      }
    } catch (error) {
      console.error("Error posting comment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!session || !replyContent.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: replyContent,
          parentId,
        }),
      })

      if (response.ok) {
        setReplyContent("")
        setReplyTo(null)
        router.refresh()
      }
    } catch (error) {
      console.error("Error posting reply:", error)
    } finally {
      setLoading(false)
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? "ml-12 mt-4" : ""} animate-in fade-in slide-in-from-bottom duration-500`}>
      <div className="flex gap-4">
        <div className="relative flex-shrink-0">
          {comment.author.image ? (
            <>
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm" />
              <Image
                src={comment.author.image}
                alt={comment.author.name || "Kullanıcı"}
                width={40}
                height={40}
                className="relative rounded-full ring-2 ring-primary/20"
              />
            </>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
              <User className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl glass-card p-5 hover:shadow-lg transition-all duration-300">
            <div className="mb-3 flex items-start justify-between gap-2">
              <span className="font-bold text-foreground">
                {comment.author.name || "Anonim"}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: tr })}
              </span>
            </div>
            <p className="text-foreground leading-relaxed">{comment.content}</p>
          </div>
          {!isReply && session && (
            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 group"
            >
              <Reply className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              Yanıtla
            </button>
          )}
          {replyTo === comment.id && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmitReply(comment.id)
              }}
              className="mt-4 animate-in fade-in slide-in-from-top duration-300"
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Yanıtınızı yazın..."
                rows={3}
                className="block w-full rounded-xl border-2 border-border glass px-4 py-3 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReplyTo(null)
                    setReplyContent("")
                  }}
                  className="btn-ghost"
                >
                  <X className="h-4 w-4" />
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading || !replyContent.trim()}
                  className="btn-primary"
                >
                  <Send className="h-4 w-4" />
                  {loading ? "Gönderiliyor..." : "Gönder"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4 border-l-2 border-border/50 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="border-t border-border/50 pt-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-500 shadow-lg shadow-primary/25">
          <MessageSquare className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
            Yorumlar
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {comments.length} yorum yapıldı
          </p>
        </div>
      </div>

      {/* New Comment Form */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-10">
          <div className="flex gap-4">
            <div className="relative flex-shrink-0">
              {session.user.image ? (
                <>
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm" />
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={40}
                    height={40}
                    className="relative rounded-full ring-2 ring-primary/30"
                  />
                </>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                rows={4}
                className="block w-full rounded-xl border-2 border-border glass px-4 py-3 text-foreground shadow-lg placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="btn-primary"
                >
                  <Send className="h-4 w-4" />
                  {loading ? "Gönderiliyor..." : "Yorum Yap"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 rounded-2xl glass-card p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-semibold text-foreground mb-2">
            Yorum yapmak için giriş yapın
          </p>
          <p className="text-sm text-muted-foreground">
            Düşüncelerinizi paylaşmak için hesabınıza giriş yapmanız gerekmektedir.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div 
              key={comment.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CommentItem comment={comment} />
            </div>
          ))
        ) : (
          <div className="py-16 text-center rounded-2xl glass-card">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-6">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">
              Henüz yorum yok
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Bu habere ilk yorumu yapan siz olun! Düşüncelerinizi bizimle paylaşın.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
