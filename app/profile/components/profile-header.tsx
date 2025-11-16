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
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user.image ? (
              <div className="relative h-24 w-24 md:h-32 md:w-32">
                <Image
                  src={user.image}
                  alt={user.name || "Kullanıcı"}
                  fill
                  className="border-border rounded-full border-4 object-cover"
                />
              </div>
            ) : (
              <div className="bg-muted border-border flex h-24 w-24 items-center justify-center rounded-full border-4 md:h-32 md:w-32">
                <User className="text-muted-foreground h-12 w-12 md:h-16 md:w-16" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">{user.name || "İsimsiz Kullanıcı"}</h1>
              {user.username && <p className="text-muted-foreground mt-1">@{user.username}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{joinDate} tarihinde katıldı</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  ROLE_COLORS[userRole] as "default" | "secondary" | "destructive" | "outline"
                }
              >
                <Shield className="mr-1 h-3 w-3" />
                {ROLE_LABELS[userRole]}
              </Badge>
            </div>

            {user.bio && <p className="text-muted-foreground mt-3 max-w-2xl">{user.bio}</p>}

            {/* Quick Stats */}
            {stats && (
              <div className="grid grid-cols-2 gap-4 border-t pt-4 md:grid-cols-3 lg:grid-cols-6">
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">{stats.totalReads}</div>
                  <div className="text-muted-foreground text-xs">Okunan</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">{stats.totalLikes}</div>
                  <div className="text-muted-foreground text-xs">Beğeni</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">{stats.totalBookmarks}</div>
                  <div className="text-muted-foreground text-xs">Kayıt</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">{stats.totalComments}</div>
                  <div className="text-muted-foreground text-xs">Yorum</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">{stats.totalFollowing}</div>
                  <div className="text-muted-foreground text-xs">Takip</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">{stats.totalFollowers}</div>
                  <div className="text-muted-foreground text-xs">Takipçi</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
