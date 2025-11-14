"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Users, Mail, Calendar } from "lucide-react"

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

const roleColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  USER: "secondary",
  AUTHOR: "outline",
  EDITOR: "default",
  ADMIN: "destructive",
  SUPER_ADMIN: "destructive",
}

const roleLabels: Record<string, string> = {
  USER: "Kullanıcı",
  AUTHOR: "Yazar",
  EDITOR: "Editör",
  ADMIN: "Admin",
  SUPER_ADMIN: "Süper Admin",
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [roleFilter])

  const fetchUsers = async () => {
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
  }

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

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
          <p className="text-muted-foreground mt-2">
            Tüm kullanıcıları yönetin
          </p>
        </div>
      </div>

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
          <div className="flex gap-2">
            <Button
              variant={roleFilter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter("")}
            >
              Tümü
            </Button>
            <Button
              variant={roleFilter === "USER" ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter("USER")}
            >
              Kullanıcılar
            </Button>
            <Button
              variant={roleFilter === "AUTHOR" ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter("AUTHOR")}
            >
              Yazarlar
            </Button>
            <Button
              variant={roleFilter === "EDITOR" ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter("EDITOR")}
            >
              Editörler
            </Button>
            <Button
              variant={roleFilter === "ADMIN" ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter("ADMIN")}
            >
              Adminler
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Kullanıcı bulunamadı</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || user.email}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">
                          {user.name || user.username || "İsimsiz"}
                        </CardTitle>
                        <Badge variant={roleColors[user.role]}>
                          {roleLabels[user.role]}
                        </Badge>
                        {user.emailVerified && (
                          <Badge variant="outline" className="text-xs">
                            ✓ Doğrulanmış
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.username && (
                          <div className="text-xs">
                            @{user.username}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs mt-2">
                          <span>{user._count.articles} makale</span>
                          <span>{user._count.comments} yorum</span>
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
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
