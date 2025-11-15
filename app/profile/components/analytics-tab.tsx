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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!analytics) {
    return <div className="text-center py-12">Analizler yüklenemedi</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">
                {Math.floor(analytics.avgReadingTimeSeconds / 60)} dk
              </p>
              <p className="text-sm text-muted-foreground">Ortalama Okuma Süresi</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold">{analytics.completionRate}%</p>
              <p className="text-sm text-muted-foreground">Tamamlama Oranı</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <PieChart className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold">{analytics.categoryDistribution.length}</p>
              <p className="text-sm text-muted-foreground">Farklı Kategori</p>
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
                          backgroundColor: category.color
                            ? `${category.color}20`
                            : undefined,
                          color: category.color || undefined,
                        }}
                      >
                        {category.name}
                      </Badge>
                      <span className="font-medium">{category.count} makale</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
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
                const maxCount = Math.max(
                  ...analytics.weeklyActivity.map((d) => d.count)
                )
                const percentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0

                return (
                  <div key={day.day} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium">{day.day}</div>
                    <div className="flex-1 h-8 bg-secondary rounded-md overflow-hidden">
                      <div
                        className="h-full bg-primary flex items-center justify-end px-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      >
                        {day.count > 0 && (
                          <span className="text-xs font-medium text-primary-foreground">
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
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="text-lg font-bold text-muted-foreground w-8">
                    #{index + 1}
                  </span>
                  
                  <div className="flex items-center gap-3 flex-1">
                    {author.image ? (
                      <div className="relative w-10 h-10">
                        <Image
                          src={author.image}
                          alt={author.name || "Yazar"}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <p className="font-semibold">{author.name || "İsimsiz"}</p>
                      {author.username && (
                        <p className="text-sm text-muted-foreground">
                          @{author.username}
                        </p>
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
              <div className="flex items-end gap-1 h-40">
                {analytics.readingTrend.slice(-30).map((item) => {
                  const maxCount = Math.max(
                    ...analytics.readingTrend.map((d) => d.count)
                  )
                  const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0

                  return (
                    <div
                      key={item.date}
                      className="flex-1 bg-primary rounded-t hover:opacity-80 transition-opacity"
                      style={{ height: `${height}%`, minHeight: item.count > 0 ? "4px" : "0" }}
                      title={`${item.date}: ${item.count} okuma`}
                    />
                  )
                })}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Son 30 gün
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
