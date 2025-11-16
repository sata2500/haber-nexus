"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, PieChart, Clock, Users } from "lucide-react"
import Image from "next/image"

interface AnalyticsTabProps {
  userId: string
}

interface CategoryDistribution {
  name: string
  count: number
  color?: string
}

interface WeeklyActivity {
  day: string
  count: number
}

interface TopAuthor {
  id: string
  name: string
  username?: string
  image?: string
  readCount: number
}

interface ReadingTrend {
  date: string
  count: number
}

interface Analytics {
  avgReadingTimeSeconds: number
  completionRate: number
  categoryDistribution: CategoryDistribution[]
  weeklyActivity: WeeklyActivity[]
  topAuthors: TopAuthor[]
  readingTrend: ReadingTrend[]
}

export function AnalyticsTab({ userId }: AnalyticsTabProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/analytics`)
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!analytics) {
    return <div className="py-12 text-center">Analizler yüklenemedi</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="text-primary mx-auto mb-2 h-8 w-8" />
              <p className="text-2xl font-bold">
                {Math.floor(analytics.avgReadingTimeSeconds / 60)} dk
              </p>
              <p className="text-muted-foreground text-sm">Ortalama Okuma Süresi</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <p className="text-2xl font-bold">{analytics.completionRate}%</p>
              <p className="text-muted-foreground text-sm">Tamamlama Oranı</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <PieChart className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <p className="text-2xl font-bold">{analytics.categoryDistribution.length}</p>
              <p className="text-muted-foreground text-sm">Farklı Kategori</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      {analytics.categoryDistribution && analytics.categoryDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kategori Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.categoryDistribution.map((category) => {
                const maxCount = analytics.categoryDistribution[0].count
                const percentage = (category.count / maxCount) * 100

                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: category.color ? `${category.color}20` : undefined,
                          color: category.color || undefined,
                        }}
                      >
                        {category.name}
                      </Badge>
                      <span className="font-medium">{category.count} makale</span>
                    </div>
                    <div className="bg-secondary h-2 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Activity */}
      {analytics.weeklyActivity && analytics.weeklyActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Haftalık Aktivite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.weeklyActivity.map((day) => {
                const maxCount = Math.max(...analytics.weeklyActivity.map((d) => d.count))
                const percentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0

                return (
                  <div key={day.day} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium">{day.day}</div>
                    <div className="bg-secondary h-8 flex-1 overflow-hidden rounded-md">
                      <div
                        className="bg-primary flex h-full items-center justify-end px-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      >
                        {day.count > 0 && (
                          <span className="text-primary-foreground text-xs font-medium">
                            {day.count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Authors */}
      {analytics.topAuthors && analytics.topAuthors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              En Çok Okunan Yazarlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topAuthors.map((author, index) => (
                <div
                  key={author.id}
                  className="hover:bg-muted flex items-center gap-4 rounded-lg p-3 transition-colors"
                >
                  <span className="text-muted-foreground w-8 text-lg font-bold">#{index + 1}</span>

                  <div className="flex flex-1 items-center gap-3">
                    {author.image ? (
                      <div className="relative h-10 w-10">
                        <Image
                          src={author.image}
                          alt={author.name || "Yazar"}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                        <Users className="text-muted-foreground h-5 w-5" />
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="font-semibold">{author.name || "İsimsiz"}</p>
                      {author.username && (
                        <p className="text-muted-foreground text-sm">@{author.username}</p>
                      )}
                    </div>
                  </div>

                  <Badge variant="secondary">{author.readCount} okuma</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reading Trend */}
      {analytics.readingTrend && analytics.readingTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Son 30 Günlük Okuma Trendi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex h-40 items-end gap-1">
                {analytics.readingTrend.slice(-30).map((item) => {
                  const maxCount = Math.max(...analytics.readingTrend.map((d) => d.count))
                  const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0

                  return (
                    <div
                      key={item.date}
                      className="bg-primary flex-1 rounded-t transition-opacity hover:opacity-80"
                      style={{ height: `${height}%`, minHeight: item.count > 0 ? "4px" : "0" }}
                      title={`${item.date}: ${item.count} okuma`}
                    />
                  )
                })}
              </div>
              <p className="text-muted-foreground text-center text-xs">Son 30 gün</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
