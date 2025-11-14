"use client"

import Image from "next/image"
import { User, Mail, Shield, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions"
import { UserRole } from "@prisma/client"

interface ProfileHeaderProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    username?: string | null
    image?: string | null
    bio?: string | null
    role: string
    createdAt: Date
  }
  stats?: {
    totalLikes: number
    totalBookmarks: number
    totalComments: number
    totalFollowing: number
    totalFollowers: number
    totalReads: number
  }
}

export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  const userRole = user.role as UserRole
  const joinDate = new Date(user.createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
  })

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user.image ? (
              <div className="relative w-24 h-24 md:w-32 md:h-32">
                <Image
                  src={user.image}
                  alt={user.name || "Kullanıcı"}
                  fill
                  className="rounded-full object-cover border-4 border-border"
                />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                <User className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {user.name || "İsimsiz Kullanıcı"}
              </h1>
              {user.username && (
                <p className="text-muted-foreground mt-1">@{user.username}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{joinDate} tarihinde katıldı</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={ROLE_COLORS[userRole] as any}>
                <Shield className="h-3 w-3 mr-1" />
                {ROLE_LABELS[userRole]}
              </Badge>
            </div>

            {user.bio && (
              <p className="text-muted-foreground mt-3 max-w-2xl">{user.bio}</p>
            )}

            {/* Quick Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalReads}</div>
                  <div className="text-xs text-muted-foreground">Okunan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalLikes}</div>
                  <div className="text-xs text-muted-foreground">Beğeni</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalBookmarks}</div>
                  <div className="text-xs text-muted-foreground">Kayıt</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalComments}</div>
                  <div className="text-xs text-muted-foreground">Yorum</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalFollowing}</div>
                  <div className="text-xs text-muted-foreground">Takip</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalFollowers}</div>
                  <div className="text-xs text-muted-foreground">Takipçi</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
