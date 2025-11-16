/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { getDashboardInfo, getRoleDescription } from "@/lib/dashboard-utils"
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions"
import { UserRole } from "@prisma/client"

export function DashboardWelcome() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session?.user) {
    return null
  }

  const userRole = session.user.role as UserRole
  const dashboardInfo = getDashboardInfo(userRole)
  const roleDescription = getRoleDescription(userRole)
  const Icon = dashboardInfo.primary.icon

  // USER rolü için dashboard kartı gösterme
  if (userRole === "USER") {
    return null
  }

  return (
    <Card className="border-primary/20 from-primary/5 to-primary/10 border-2 bg-gradient-to-br">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`bg-background rounded-lg border-2 p-3 ${dashboardInfo.primary.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">
                Hoş Geldiniz, {session.user.name || "Kullanıcı"}!
              </CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={ROLE_COLORS[userRole] as any} className="text-xs">
                  {ROLE_LABELS[userRole]}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-base">{roleDescription}</CardDescription>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => router.push(dashboardInfo.primary.href)} className="gap-2">
            <Icon className="h-4 w-4" />
            {dashboardInfo.primary.label}
            <ArrowRight className="h-4 w-4" />
          </Button>

          {dashboardInfo.accessible.length > 1 && (
            <Button variant="outline" onClick={() => router.push("/profile")} className="gap-2">
              Tüm Dashboard&apos;lar
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {dashboardInfo.accessible.length > 1 && (
          <div className="border-t pt-2">
            <p className="text-muted-foreground mb-2 text-xs">
              Erişebildiğiniz diğer dashboard&apos;lar:
            </p>
            <div className="flex flex-wrap gap-2">
              {dashboardInfo.accessible
                .filter((d) => d.href !== dashboardInfo.primary.href)
                .map((dashboard) => {
                  const DashIcon = dashboard.icon
                  return (
                    <Button
                      key={dashboard.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(dashboard.href)}
                      className={`gap-1 ${dashboard.color}`}
                    >
                      <DashIcon className="h-3 w-3" />
                      {dashboard.label}
                    </Button>
                  )
                })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
