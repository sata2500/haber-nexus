"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Users, Mail, Calendar, Shield, TrendingUp } from "lucide-react"
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions"
import { UserRole } from "@prisma/client"

interface User {
  id: string
  email: string
  username: string | null
  name: string | null
  image: string | null
  role: string
  emailVerified: Date | null
  createdAt: string
  _count: {
    articles: number
    comments: number
  }
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (roleFilter) params.append("role", roleFilter)

      const response = await fetch(`/api/users?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }, [roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchUsers()
      } else {
        const data = await response.json()
        alert(data.error || "Kullanıcı silinemedi")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Bir hata oluştu")
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // İstatistikler
  const stats = {
    total: users.length,
    byRole: {
      USER: users.filter((u) => u.role === "USER").length,
      AUTHOR: users.filter((u) => u.role === "AUTHOR").length,
      EDITOR: users.filter((u) => u.role === "EDITOR").length,
      ADMIN: users.filter((u) => u.role === "ADMIN").length,
      SUPER_ADMIN: users.filter((u) => u.role === "SUPER_ADMIN").length,
    },
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        <p className="text-muted-foreground mt-2">
          Tüm kullanıcıları yönetin ve rollerini düzenleyin
        </p>
      </div>

      {/* İstatistikler */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Toplam</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        {(["USER", "AUTHOR", "EDITOR", "ADMIN", "SUPER_ADMIN"] as UserRole[]).map((role) => (
          <Card key={role}>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {ROLE_LABELS[role]}
              </CardDescription>
              <CardTitle className="text-2xl">{stats.byRole[role]}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Arama ve Filtreleme */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Arama ve Filtreleme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Email, isim veya kullanıcı adı ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant={roleFilter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter("")}
            >
              Tümü ({stats.total})
            </Button>
            {(["USER", "AUTHOR", "EDITOR", "ADMIN", "SUPER_ADMIN"] as UserRole[]).map((role) => (
              <Button
                key={role}
                variant={roleFilter === role ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter(role)}
                className="gap-1"
              >
                <Shield className="h-3 w-3" />
                {ROLE_LABELS[role]} ({stats.byRole[role]})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kullanıcı Listesi */}
      {loading ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">Kullanıcı bulunamadı</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-1 items-start gap-4">
                    {user.image ? (
                      <div className="relative h-14 w-14 shrink-0">
                        <Image
                          src={user.image}
                          alt={user.name || user.email}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="from-primary/20 to-primary/5 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-gradient-to-br">
                        <Users className="text-primary h-7 w-7" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <CardTitle className="text-lg">
                          {user.name || user.username || "İsimsiz"}
                        </CardTitle>
                        <Badge
                          variant={
                            ROLE_COLORS[user.role as UserRole] as
                              | "default"
                              | "secondary"
                              | "destructive"
                              | "outline"
                          }
                        >
                          <Shield className="mr-1 h-3 w-3" />
                          {ROLE_LABELS[user.role as UserRole]}
                        </Badge>
                        {user.emailVerified && (
                          <Badge variant="outline" className="text-xs">
                            ✓ Doğrulanmış
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.username && <div className="text-xs">@{user.username}</div>}
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {user._count.articles} makale
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user._count.comments} yorum
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                      className="gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline">Düzenle</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Sil</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
