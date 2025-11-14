"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      const articleContent = document.querySelector('.article-content')
      if (!articleContent) return 0

      const rect = articleContent.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const contentHeight = articleContent.scrollHeight
      const scrollTop = window.scrollY
      const articleTop = articleContent.getBoundingClientRect().top + scrollTop

      const scrolled = scrollTop + windowHeight - articleTop
      const percentage = Math.min(Math.max((scrolled / contentHeight) * 100, 0), 100)
      
      return percentage
    }

    const handleScroll = () => {
      const newProgress = calculateProgress()
      setProgress(newProgress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div
        className={cn(
          "h-full transition-all duration-150 ease-out",
          progress >= 100
            ? "bg-green-500"
            : "bg-gradient-to-r from-primary to-primary/80"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
