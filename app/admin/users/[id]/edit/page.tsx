"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, AlertCircle, CheckCircle2 } from "lucide-react"
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions"
import { UserRole } from "@prisma/client"

interface User {
  id: string
  email: string
  username: string | null
  name: string | null
  bio: string | null
  role: string
}

const roleDescriptions: Record<string, string> = {
  USER: "Platform okuyucusu - Makale okuma, yorum yapma, beğenme",
  AUTHOR: "İçerik üreticisi - Makale yazma ve yönetme yetkisi",
  EDITOR: "İçerik editörü - Makale inceleme ve yorum moderasyonu",
  ADMIN: "Sistem yöneticisi - Kullanıcı ve içerik yönetimi",
  SUPER_ADMIN: "Süper yönetici - Tüm sisteme tam erişim"
}

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    role: "USER" as UserRole,
  })

  const [originalRole, setOriginalRole] = useState<UserRole>("USER")

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (response.ok) {
        const data: User = await response.json()
        const userData = {
          name: data.name || "",
          username: data.username || "",
          bio: data.bio || "",
          role: data.role as UserRole,
        }
        setFormData(userData)
        setOriginalRole(data.role as UserRole)
      } else {
        setError("Kullanıcı yüklenemedi")
      }
    } catch (err) {
      console.error("Error fetching user:", err)
      setError("Bir hata oluştu")
    } finally {
      setFetching(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError("")

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        
        // Eğer rol değiştiyse kullanıcıya bildirim gönder ve session refresh tetikle
        if (roleChanged) {
          try {
            // Bildirim gönder
            await fetch(`/api/users/${userId}/notify-role-change`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                oldRole: ROLE_LABELS[originalRole],
                newRole: ROLE_LABELS[formData.role],
              }),
            })
            
            // Session refresh tetikle
            // Bu sayede kullanıcının session'ı 5 saniye içinde güncellenecek
            await fetch(`/api/users/${userId}/force-session-refresh`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            })
          } catch (notifyError) {
            console.error("Bildirim/refresh gönderilemedi:", notifyError)
            // Bildirim hatası kullanıcı güncellemesini engellemez
          }
        }
        
        setTimeout(() => {
          router.push("/admin/users")
        }, 1500)
      } else {
        const data = await response.json()
        setError(data.error || "Kullanıcı güncellenemedi")
      }
    } catch (err) {
      console.error("Error updating user:", err)
      setError("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center text-muted-foreground">Yükleniyor...</p>
      </div>
    )
  }

  const roleChanged = formData.role !== originalRole

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Geri
      </Button>

      {success && (
        <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-900/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Kullanıcı başarıyla güncellendi! Yönlendiriliyorsunuz...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mb-6 border-red-500 bg-red-50 dark:bg-red-900/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Düzenle</CardTitle>
          <CardDescription>
            Kullanıcı bilgilerini ve rolünü güncelleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">İsim</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Kullanıcı adı..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kullanıcı Adı</label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="username"
              />
              <p className="text-xs text-muted-foreground">
                Benzersiz kullanıcı adı
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Biyografi</label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border rounded-md text-sm"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Kullanıcı hakkında..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Kullanıcı Rolü</label>
                <Badge variant={ROLE_COLORS[formData.role] as any}>
                  <Shield className="h-3 w-3 mr-1" />
                  {ROLE_LABELS[formData.role]}
                </Badge>
              </div>
              
              {roleChanged && (
                <Card className="border-orange-500 bg-orange-50 dark:bg-orange-900/10">
                  <CardContent className="py-3">
                    <div className="flex items-start gap-2 text-sm text-orange-600 dark:text-orange-400">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">Rol değişikliği tespit edildi</p>
                        <p className="text-xs mt-1">
                          {ROLE_LABELS[originalRole]} → {ROLE_LABELS[formData.role]}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-3">
                {(["USER", "AUTHOR", "EDITOR", "ADMIN", "SUPER_ADMIN"] as UserRole[]).map((role) => (
                  <Card
                    key={role}
                    className={`
                      cursor-pointer transition-all
                      ${formData.role === role 
                        ? 'border-2 border-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                      }
                    `}
                    onClick={() => setFormData({ ...formData, role })}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                          ${formData.role === role 
                            ? 'border-primary bg-primary' 
                            : 'border-muted-foreground'
                          }
                        `}>
                          {formData.role === role && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{ROLE_LABELS[role]}</span>
                            <Badge 
                              variant={ROLE_COLORS[role] as any}
                              className="text-xs"
                            >
                              {role}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {roleDescriptions[role]}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={loading || success}>
                {loading ? "Güncelleniyor..." : success ? "Güncellendi ✓" : "Güncelle"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading || success}
              >
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
