/* eslint-disable react-hooks/exhaustive-deps */

"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"

interface ReadingTrackerProps {
  articleId: string
  estimatedReadTime: number // minutes
}

export function ReadingTracker({ articleId, estimatedReadTime }: ReadingTrackerProps) {
  const { data: session, status } = useSession()
  const [, setProgress] = useState(0)
  const [, setReadDuration] = useState(0)

  // Refs for tracking
  const startTimeRef = useRef<number>(Date.now()) // eslint-disable-line @typescript-eslint/no-unused-vars
  const lastSaveTimeRef = useRef<number>(Date.now())
  const activeTimeRef = useRef<number>(0)
  const isActiveRef = useRef<boolean>(true)
  const lastProgressRef = useRef<number>(0)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasInitializedRef = useRef<boolean>(false)

  // Calculate progress based on scroll position
  const calculateScrollProgress = (): number => {
    const articleContent = document.querySelector(".article-content")
    if (!articleContent) return 0

    // const rect = articleContent.getBoundingClientRect() // Not used currently
    const windowHeight = window.innerHeight
    const contentHeight = articleContent.scrollHeight
    const scrollTop = window.scrollY
    const articleTop = articleContent.getBoundingClientRect().top + scrollTop

    // Calculate how much of the article is visible/scrolled
    const scrolled = scrollTop + windowHeight - articleTop
    const percentage = Math.min(Math.max((scrolled / contentHeight) * 100, 0), 100)

    return Math.round(percentage * 10) / 10 // Round to 1 decimal
  }

  // Calculate progress based on time spent
  const calculateTimeProgress = (): number => {
    const estimatedSeconds = estimatedReadTime * 60
    const timePercentage = (activeTimeRef.current / estimatedSeconds) * 100
    return Math.min(timePercentage, 100)
  }

  // Save reading progress to API
  const saveProgress = async (finalSave = false) => {
    if (status !== "authenticated" || !session?.user) return

    const scrollProgress = calculateScrollProgress()
    const timeProgress = calculateTimeProgress()
    const currentProgress = Math.max(scrollProgress, timeProgress)
    const currentDuration = Math.floor(activeTimeRef.current)

    // Don't save if no significant change (unless final save)
    if (
      !finalSave &&
      Math.abs(currentProgress - lastProgressRef.current) < 5 &&
      currentDuration < 10
    ) {
      return
    }

    try {
      const response = await fetch("/api/reading-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleId,
          readDuration: currentDuration,
          progress: currentProgress,
          completed: currentProgress >= 90,
        }),
      })

      if (response.ok) {
        lastProgressRef.current = currentProgress
        lastSaveTimeRef.current = Date.now()
      }
    } catch (error) {
      console.error("Error saving reading progress:", error)
    }
  }

  // Debounced save function
  const debouncedSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveProgress()
    }, 2000) // Save 2 seconds after last activity
  }

  // Update active reading time
  useEffect(() => {
    if (status !== "authenticated") return

    const interval = setInterval(() => {
      if (isActiveRef.current && !document.hidden) {
        activeTimeRef.current += 1
        setReadDuration(activeTimeRef.current)

        // Auto-save every 30 seconds
        if (activeTimeRef.current % 30 === 0) {
          saveProgress()
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [status])

  // Track scroll progress
  useEffect(() => {
    if (status !== "authenticated") return

    const handleScroll = () => {
      const scrollProgress = calculateScrollProgress()
      setProgress(scrollProgress)
      debouncedSave()
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initial calculation
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [status])

  // Track visibility (tab active/inactive)
  useEffect(() => {
    if (status !== "authenticated") return

    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden

      if (document.hidden) {
        // Tab became inactive, save progress
        saveProgress()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [status])

  // Save on page unload
  useEffect(() => {
    if (status !== "authenticated") return

    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable sending on page unload
      if (navigator.sendBeacon) {
        const scrollProgress = calculateScrollProgress()
        const timeProgress = calculateTimeProgress()
        const currentProgress = Math.max(scrollProgress, timeProgress)
        const currentDuration = Math.floor(activeTimeRef.current)

        const data = JSON.stringify({
          articleId,
          readDuration: currentDuration,
          progress: currentProgress,
          completed: currentProgress >= 90,
        })

        navigator.sendBeacon("/api/reading-history", data)
      } else {
        // Fallback to synchronous save
        saveProgress(true)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      // Final save on component unmount
      saveProgress(true)
    }
  }, [status])

  // Initial load - fetch existing progress
  useEffect(() => {
    if (status !== "authenticated" || !session?.user || hasInitializedRef.current) return

    const fetchExistingProgress = async () => {
      try {
        const response = await fetch(`/api/reading-history?articleId=${articleId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.readingHistory) {
            activeTimeRef.current = data.readingHistory.readDuration
            setReadDuration(data.readingHistory.readDuration)
            lastProgressRef.current = data.readingHistory.progress
          }
        }
      } catch (error) {
        console.error("Error fetching reading progress:", error)
      }
    }

    fetchExistingProgress()
    hasInitializedRef.current = true
  }, [status, session])

  // This component doesn't render anything visible
  return null
}
