"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield } from "lucide-react"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { getAccessibleDashboards, getRoleDescription } from "@/lib/dashboard-utils"
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions"
import { UserRole } from "@prisma/client"

export function ProfileContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.name || "",
          username: data.username || "",
          bio: data.bio || "",
        })
      }
    } catch (err) {
      console.error("Error fetching user data:", err)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage("Profil başarıyla güncellendi!")
      } else {
        const data = await response.json()
        setError(data.error || "Profil güncellenemedi")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Yeni şifreler eşleşmiyor")
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalıdır")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (response.ok) {
        setMessage("Şifre başarıyla değiştirildi!")
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        const data = await response.json()
        setError(data.error || "Şifre değiştirilemedi")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </main>
    )
  }

  if (!session) {
    return null
  }

  // Dashboard bilgilerini al
  const userRole = session.user.role as UserRole
  const accessibleDashboards = getAccessibleDashboards(userRole)
  const roleDescription = getRoleDescription(userRole)

  return (
    <main className="flex-1 container py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profil</h1>
          <p className="text-muted-foreground">
            Hesap bilgilerinizi yönetin ve dashboard&apos;larınıza erişin
          </p>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Hesap Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {session.user.image ? (
                <div className="relative w-20 h-20 shrink-0">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ""}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold">
                  {session.user.name || "İsimsiz"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {session.user.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={ROLE_COLORS[userRole] as "default" | "secondary" | "destructive" | "outline"}>
                    <Shield className="h-3 w-3 mr-1" />
                    {ROLE_LABELS[userRole]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {roleDescription}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Access Cards */}
        {accessibleDashboards.length > 0 && (
          <DashboardCards 
            dashboards={accessibleDashboards}
            title="Dashboard Erişimi"
            description="Rolünüze özel dashboard'lara hızlı erişim"
            columns={3}
          />
        )}

        {/* Profile Update Form */}
        <Card id="settings">
          <CardHeader>
            <CardTitle>Profil Bilgileri</CardTitle>
            <CardDescription>
              Profil bilgilerinizi güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {message && (
                <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/10 rounded-md">
                  {message}
                </div>
              )}
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">İsim</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Adınız Soyadınız"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kullanıcı Adı</label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="kullaniciadi"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Biyografi</label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md text-sm"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Kendiniz hakkında..."
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Güncelleniyor..." : "Profili Güncelle"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change Form */}
        <Card>
          <CardHeader>
            <CardTitle>Şifre Değiştir</CardTitle>
            <CardDescription>
              Hesap şifrenizi güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mevcut Şifre</label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Yeni Şifre</label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Yeni Şifre Tekrar</label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
