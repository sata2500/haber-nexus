"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { User, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommentForm } from "./comment-form"
import { formatDistanceToNow } from "@/lib/utils"

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

interface CommentItemProps {
  comment: Comment
  articleId: string
  onReplyAdded: () => void
  isReply?: boolean
}

export function CommentItem({
  comment,
  articleId,
  onReplyAdded,
  isReply = false,
}: CommentItemProps) {
  const { status } = useSession()
  const [showReplyForm, setShowReplyForm] = useState(false)

  const handleReplyAdded = () => {
    setShowReplyForm(false)
    onReplyAdded()
  }

  return (
    <div className={isReply ? "ml-12" : ""}>
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.user.image ? (
            <div className="relative h-10 w-10">
              <Image
                src={comment.user.image}
                alt={comment.user.name || "User"}
                fill
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <User className="text-muted-foreground h-5 w-5" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{comment.user.name || "Anonim"}</span>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(comment.createdAt))}
            </span>
          </div>

          <p className="text-foreground text-sm whitespace-pre-wrap">{comment.content}</p>

          {/* Actions */}
          {!isReply && status === "authenticated" && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="h-7 text-xs"
              >
                <Reply className="mr-1 h-3 w-3" />
                Yanıtla
              </Button>
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <div className="bg-muted/50 mt-3 rounded-md p-3">
              <CommentForm
                articleId={articleId}
                parentId={comment.id}
                onCommentAdded={handleReplyAdded}
                onCancel={() => setShowReplyForm(false)}
                placeholder="Yanıtınızı yazın..."
                submitLabel="Yanıtla"
              />
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  articleId={articleId}
                  onReplyAdded={onReplyAdded}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
