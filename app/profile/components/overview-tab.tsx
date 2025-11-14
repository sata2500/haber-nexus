"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Bookmark, 
  MessageSquare, 
  Clock, 
  TrendingUp,
  BookOpen,
  CheckCircle
} from "lucide-react"

interface OverviewTabProps {
  userId: string
}

export function OverviewTab({ userId }: OverviewTabProps) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
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
  }

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>
  }

  if (!stats) {
    return <div className="text-center py-12">İstatistikler yüklenemedi</div>
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

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
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
              <span className="text-sm text-muted-foreground">Okunan Makale</span>
              <span className="text-lg font-semibold">{stats.readsLastWeek}</span>
            </div>
            {stats.readsLastWeek > 0 && (
              <div className="text-sm text-green-600">
                ↑ Harika! Okumaya devam edin
              </div>
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
              {stats.topCategories.map((category: any, index: number) => (
                <div key={category.slug} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
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
              <div className="p-2 rounded-full bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">
                  {stats.unreadNotifications} okunmamış bildiriminiz var
                </p>
                <p className="text-sm text-muted-foreground">
                  Bildirimlerinizi kontrol edin
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
