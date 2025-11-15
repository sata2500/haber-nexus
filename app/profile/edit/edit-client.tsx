"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, CheckCircle2, AlertCircle, User, Mail, Lock } from "lucide-react"
import Link from "next/link"

interface EditClientProps {
  initialData: {
    name: string
    username: string
    bio: string
    email: string
  }
}

export function EditClient({ initialData }: EditClientProps) {
  const { update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    name: initialData.name,
    username: initialData.username,
    bio: initialData.bio,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError("")

    try {
      const response = await fetch(`/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        await update()
        setTimeout(() => setSuccess(false), 3000)
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
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Yeni şifreler eşleşmiyor")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır")
      return
    }

    setLoading(true)
    setSuccess(false)
    setError("")

    try {
      const response = await fetch(`/api/users/me/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const data = await response.json()
        setError(data.error || "Şifre değiştirilemedi")
      }
    } catch (err) {
      console.error("Error changing password:", err)
      setError("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Profil Düzenle</h1>
          <p className="text-muted-foreground mt-1">
            Hesap bilgilerinizi güncelleyin
          </p>
        </div>
      </div>

      {success && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Değişiklikler başarıyla kaydedildi!</span>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil Bilgileri
          </CardTitle>
          <CardDescription>
            Genel profil bilgilerinizi düzenleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Ad Soyad <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ad Soyad"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Kullanıcı Adı
              </label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="kullaniciadi"
              />
              <p className="text-xs text-muted-foreground">
                Benzersiz kullanıcı adınız
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Biyografi
              </label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Kendiniz hakkında kısa bir açıklama..."
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !formData.name}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Adresi
          </CardTitle>
          <CardDescription>
            Mevcut email adresiniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{initialData.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Email değiştirme özelliği yakında eklenecek
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Şifre Değiştir
          </CardTitle>
          <CardDescription>
            Hesap güvenliğiniz için şifrenizi güncelleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Mevcut Şifre <span className="text-destructive">*</span>
              </label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Mevcut şifreniz"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Yeni Şifre <span className="text-destructive">*</span>
              </label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Yeni şifreniz (en az 6 karakter)"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Yeni Şifre (Tekrar) <span className="text-destructive">*</span>
              </label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Yeni şifrenizi tekrar girin"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              variant="outline"
            >
              {loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
