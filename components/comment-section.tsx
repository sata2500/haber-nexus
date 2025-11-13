"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MessageSquare, User, Send, Reply } from "lucide-react"
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
    <div className={`${isReply ? "ml-12" : ""}`}>
      <div className="flex gap-x-3">
        {comment.author.image ? (
          <Image
            src={comment.author.image}
            alt={comment.author.name || "Kullanıcı"}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
        )}
        <div className="flex-1">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">
                {comment.author.name || "Anonim"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: tr })}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
          </div>
          {!isReply && session && (
            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="mt-2 inline-flex items-center gap-x-1 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              <Reply className="h-3 w-3" />
              Yanıtla
            </button>
          )}
          {replyTo === comment.id && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmitReply(comment.id)
              }}
              className="mt-3"
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Yanıtınızı yazın..."
                rows={3}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <div className="mt-2 flex justify-end gap-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setReplyTo(null)
                    setReplyContent("")
                  }}
                  className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading || !replyContent.trim()}
                  className="inline-flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  <Send className="h-3 w-3" />
                  Gönder
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="border-t border-gray-200 pt-8 dark:border-gray-700">
      <div className="mb-6 flex items-center gap-x-2">
        <MessageSquare className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Yorumlar ({comments.length})
        </h2>
      </div>

      {/* New Comment Form */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            rows={4}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              {loading ? "Gönderiliyor..." : "Yorum Yap"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Yorum yapmak için giriş yapmalısınız.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        ) : (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Henüz yorum yapılmamış. İlk yorumu siz yapın!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
