"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ProfileHeader } from "./components/profile-header"
import { ProfileTabs } from "./components/profile-tabs"
import { OverviewTab } from "./components/overview-tab"
import { LikedArticlesTab } from "./components/liked-articles-tab"
import { BookmarkedArticlesTab } from "./components/bookmarked-articles-tab"
import { ReadingHistoryTab } from "./components/reading-history-tab"
import { CommentsTab } from "./components/comments-tab"
import { AnalyticsTab } from "./components/analytics-tab"
import { FollowingTab } from "./components/following-tab"
import { SettingsTab } from "./components/settings-tab"
import { Loader2 } from "lucide-react"

export function NewProfileContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState<{
    id: string
    name: string
    email: string
    username?: string
    bio?: string
    image?: string
    role: string
    createdAt: Date
  } | null>(null)
  const [stats, setStats] = useState<{
    totalLikes: number
    totalBookmarks: number
    totalComments: number
    totalFollowing: number
    totalFollowers: number
    totalReads: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData()
      fetchStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]) // Sadece user ID değiştiğinde çalışsın

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/stats`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  if (status === "loading" || loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </main>
    )
  }

  if (!session || !userData) {
    return null
  }

  return (
    <main className="container flex-1 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Profile Header */}
        <ProfileHeader user={userData} stats={stats || undefined} />

        {/* Tabs Navigation */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "overview" && <OverviewTab userId={session.user.id} />}
          {activeTab === "liked" && <LikedArticlesTab userId={session.user.id} />}
          {activeTab === "bookmarked" && <BookmarkedArticlesTab userId={session.user.id} />}
          {activeTab === "history" && <ReadingHistoryTab userId={session.user.id} />}
          {activeTab === "comments" && <CommentsTab userId={session.user.id} />}
          {activeTab === "analytics" && <AnalyticsTab userId={session.user.id} />}
          {activeTab === "following" && <FollowingTab userId={session.user.id} />}
          {activeTab === "settings" && <SettingsTab userId={session.user.id} user={userData} />}
        </div>
      </div>
    </main>
  )
}
