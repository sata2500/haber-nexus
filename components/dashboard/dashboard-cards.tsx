"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Dashboard, getDashboardHoverClass } from "@/lib/dashboard-utils"

interface DashboardCardsProps {
  dashboards: Dashboard[]
  title?: string
  description?: string
  columns?: 1 | 2 | 3
}

export function DashboardCards({
  dashboards,
  title = "Dashboard Erişimi",
  description = "Rolünüze özel dashboard'lara erişebilirsiniz",
  columns = 3,
}: DashboardCardsProps) {
  if (dashboards.length === 0) {
    return null
  }

  const gridCols = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
  }

  return (
    <div className="space-y-4">
      {(title || description) && (
        <div>
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      )}

      <div className={`grid gap-4 ${gridCols[columns]}`}>
        {dashboards.map((dashboard) => {
          const Icon = dashboard.icon
          const hoverClass = getDashboardHoverClass(dashboard.id)

          return (
            <Link key={dashboard.id} href={dashboard.href}>
              <Card
                className={`h-full cursor-pointer border-2 bg-gradient-to-br transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${dashboard.gradient} ${hoverClass} `}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`bg-background rounded-lg border-2 p-2 ${dashboard.color} `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{dashboard.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{dashboard.description}</CardDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-between ${dashboard.color}`}
                  >
                    <span>Dashboard&apos;a Git</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

interface DashboardCardProps {
  dashboard: Dashboard
  featured?: boolean
}

export function DashboardCard({ dashboard, featured = false }: DashboardCardProps) {
  const Icon = dashboard.icon
  const hoverClass = getDashboardHoverClass(dashboard.id)

  return (
    <Link href={dashboard.href}>
      <Card
        className={`h-full cursor-pointer border-2 bg-gradient-to-br transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${dashboard.gradient} ${hoverClass} ${featured ? "border-primary" : ""} `}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`bg-background rounded-lg border-2 p-3 ${dashboard.color} `}>
                <Icon className={featured ? "h-6 w-6" : "h-5 w-5"} />
              </div>
              <div>
                <CardTitle className={featured ? "text-xl" : "text-lg"}>
                  {dashboard.label}
                </CardTitle>
                {featured && <p className="text-muted-foreground mt-1 text-xs">Ana Dashboard</p>}
              </div>
            </div>
            <ArrowRight className={`h-5 w-5 ${dashboard.color}`} />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{dashboard.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
