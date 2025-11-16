"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Clock, CheckCircle, TrendingUp } from "lucide-react"

interface ReadingStatsWidgetProps {
  userId: string
}

export function ReadingStatsWidget({ userId }: ReadingStatsWidgetProps) {
  const [stats, setStats] = useState<{
    totalReads: number
    completedReads: number
    totalReadingTimeMinutes: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchStats()
  }, [userId])

  if (loading || !stats) {
    return null
  }

  const completionRate =
    stats.totalReads > 0 ? Math.round((stats.completedReads / stats.totalReads) * 100) : 0

  const miniStats = [
    {
      icon: BookOpen,
      value: stats.totalReads,
      label: "Okuma",
      color: "text-blue-600",
    },
    {
      icon: CheckCircle,
      value: stats.completedReads,
      label: "Tamamlanan",
      color: "text-green-600",
    },
    {
      icon: Clock,
      value: `${stats.totalReadingTimeMinutes}dk`,
      label: "Toplam Süre",
      color: "text-orange-600",
    },
    {
      icon: TrendingUp,
      value: `${completionRate}%`,
      label: "Tamamlama",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {miniStats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="border-muted">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-muted-foreground text-xs">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
