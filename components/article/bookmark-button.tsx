"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface BookmarkButtonProps {
  articleId: string
  initialBookmarked?: boolean
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function BookmarkButton({
  articleId,
  initialBookmarked = false,
  showLabel = true,
  size = "md",
}: BookmarkButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)

  const fetchBookmarkStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/bookmarks?articleId=${articleId}`)
      if (response.ok) {
        const data = await response.json()
        setBookmarked(data.bookmarked)
      }
    } catch (error) {
      console.error("Error fetching bookmark status:", error)
    }
  }, [articleId])

  // Fetch user's bookmark status
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchBookmarkStatus()
    }
  }, [status, session, fetchBookmarkStatus])

  const handleBookmark = async () => {
    // Check authentication
    if (status !== "authenticated") {
      router.push("/auth/signin")
      return
    }

    // Optimistic update
    const previousBookmarked = bookmarked
    setBookmarked(!bookmarked)
    setLoading(true)

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId }),
      })

      if (!response.ok) {
        throw new Error("Failed to toggle bookmark")
      }

      const data = await response.json()
      setBookmarked(data.bookmarked)
      
      // Refresh to sync state
      setTimeout(() => {
        router.refresh()
      }, 100)
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      // Revert optimistic update
      setBookmarked(previousBookmarked)
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
      onClick={handleBookmark}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 rounded-md transition-all",
        "hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
        bookmarked
          ? "text-yellow-600 dark:text-yellow-500"
          : "text-muted-foreground hover:text-yellow-600",
        sizeClasses[size]
      )}
      aria-label={bookmarked ? "Kaydı kaldır" : "Kaydet"}
    >
      <Bookmark
        className={cn(
          iconSizes[size],
          "transition-all",
          bookmarked && "fill-current"
        )}
      />
      {showLabel && <span className="font-medium">Kaydet</span>}
    </button>
  )
}
