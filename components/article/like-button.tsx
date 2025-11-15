"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface LikeButtonProps {
  articleId: string
  initialLiked?: boolean
  initialCount: number
  showCount?: boolean
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function LikeButton({
  articleId,
  initialLiked = false,
  initialCount,
  showCount = true,
  showLabel = true,
  size = "md",
}: LikeButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  const fetchLikeStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/likes?articleId=${articleId}`)
      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
      }
    } catch (error) {
      console.error("Error fetching like status:", error)
    }
  }, [articleId])

  // Fetch user's like status
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchLikeStatus()
    }
  }, [status, session, fetchLikeStatus])

  const handleLike = async () => {
    // Check authentication
    if (status !== "authenticated") {
      router.push("/auth/signin")
      return
    }

    // Optimistic update
    const previousLiked = liked
    const previousCount = count
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)
    setLoading(true)

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId }),
      })

      if (!response.ok) {
        throw new Error("Failed to toggle like")
      }

      const data = await response.json()
      setLiked(data.liked)
      
      // Refresh to get accurate count from server
      setTimeout(() => {
        router.refresh()
      }, 100)
    } catch (error) {
      console.error("Error toggling like:", error)
      // Revert optimistic update
      setLiked(previousLiked)
      setCount(previousCount)
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 rounded-md transition-all",
        "hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
        liked
          ? "text-red-600 dark:text-red-500"
          : "text-muted-foreground hover:text-red-600",
        sizeClasses[size]
      )}
      aria-label={liked ? "Beğeniyi kaldır" : "Beğen"}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-all",
          liked && "fill-current"
        )}
      />
      {showLabel && <span className="font-medium">Beğen</span>}
      {showCount && (
        <span className={cn("font-semibold", liked && "text-red-600")}>
          {count}
        </span>
      )}
    </button>
  )
}
