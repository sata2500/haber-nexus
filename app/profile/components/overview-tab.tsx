"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Bookmark,
  MessageSquare,
  Clock,
  TrendingUp,
  BookOpen,
  CheckCircle,
} from "lucide-react"

interface UserStats {
  totalReads: number
  completedReads: number
  totalLikes: number
  totalBookmarks: number
  totalComments: number
  totalReadingTimeMinutes: number
  readsLastWeek: number
  unreadNotifications: number
  topCategories?: Array<{
    slug: string
    name: string
    count: number
  }>
}

interface OverviewTabProps {
  userId: string
}

export function OverviewTab({ userId }: OverviewTabProps) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${userId}/stats`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (loading) {
    return <div className="py-12 text-center">Yükleniyor...</div>
  }

  if (!stats) {
    return <div className="py-12 text-center">İstatistikler yüklenemedi</div>
  }

  const statCards = [
    {
      title: "Toplam Okuma",
      value: stats.totalReads,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Tamamlanan",
      value: stats.completedReads,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Beğeniler",
      value: stats.totalLikes,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      title: "Kayıtlılar",
      value: stats.totalBookmarks,
      icon: Bookmark,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      title: "Yorumlar",
      value: stats.totalComments,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Okuma Süresi",
      value: `${stats.totalReadingTimeMinutes} dk`,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  const completionRate =
    stats.totalReads > 0 ? Math.round((stats.completedReads / stats.totalReads) * 100) : 0

  const avgReadingTime =
    stats.totalReads > 0 ? Math.round(stats.totalReadingTimeMinutes / stats.totalReads) : 0

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Reading Insights */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tamamlanma Oranı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{completionRate}%</span>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="bg-muted h-2 w-full rounded-full">
                <div
                  className="h-2 rounded-full bg-green-600 transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-muted-foreground text-sm">
                {stats.completedReads} / {stats.totalReads} makale tamamlandı
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ortalama Okuma Süresi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{avgReadingTime} dk</span>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-muted-foreground text-sm">Makale başına ortalama okuma süresi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Son 7 Günlük Aktivite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Okunan Makale</span>
              <span className="text-lg font-semibold">{stats.readsLastWeek}</span>
            </div>
            {stats.readsLastWeek > 0 && (
              <div className="text-sm text-green-600">↑ Harika! Okumaya devam edin</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Categories */}
      {stats.topCategories && stats.topCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>En Çok Okunan Kategoriler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCategories.map((category, index) => (
                <div key={category.slug} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-lg font-bold">#{index + 1}</span>
                    <Badge variant="secondary">{category.name}</Badge>
                  </div>
                  <span className="text-sm font-medium">{category.count} makale</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {stats.unreadNotifications > 0 && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <MessageSquare className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">
                  {stats.unreadNotifications} okunmamış bildiriminiz var
                </p>
                <p className="text-muted-foreground text-sm">Bildirimlerinizi kontrol edin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
