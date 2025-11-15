/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Shield, Save, CheckCircle2, AlertCircle, Sparkles, Award } from "lucide-react"
import { InterestsSelector } from "@/components/profile/interests-selector"

export default function AuthorProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    interests: [] as string[],
    expertise: [] as string[],
  })
  
  const [profileLoaded, setProfileLoaded] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      if (session?.user) {
        setFormData(prev => ({
          ...prev,
          name: session.user.name || "",
          username: (session.user as any).username || "",
          bio: (session.user as any).bio || "",
        }))
        
        // Load author profile data
        try {
          const response = await fetch('/api/users/me')
          if (response.ok) {
            const data = await response.json()
            if (data.authorProfile) {
              setFormData(prev => ({
                ...prev,
                interests: data.authorProfile.interests || [],
                expertise: data.authorProfile.expertise || [],
              }))
            }
          }
        } catch (err) {
          console.error('Error loading profile:', err)
        } finally {
          setProfileLoaded(true)
        }
      }
    }
    loadProfile()
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError("")

    try {
      // Update basic profile
      const profileResponse = await fetch(`/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          bio: formData.bio,
          authorProfile: {
            interests: formData.interests,
            expertise: formData.expertise,
          },
        }),
      })

      if (!profileResponse.ok) {
        const data = await profileResponse.json()
        throw new Error(data.error || "Profil güncellenemedi")
      }

      setSuccess(true)
      // Session'ı güncelle
      await update()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profil Ayarları</h1>
        <p className="text-muted-foreground mt-2">
          Yazar profilinizi yönetin
        </p>
      </div>

      {success && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Profil başarıyla güncellendi!</span>
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
          <CardTitle>Hesap Bilgileri</CardTitle>
          <CardDescription>
            Temel hesap bilgilerinizi görüntüleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{session.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Rol</p>
              <Badge variant="default" className="mt-1">
                {session.user?.role === "AUTHOR" && "Yazar"}
                {session.user?.role === "EDITOR" && "Editör"}
                {session.user?.role === "ADMIN" && "Admin"}
                {session.user?.role === "SUPER_ADMIN" && "Süper Admin"}
                {session.user?.role === "USER" && "Kullanıcı"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Üyelik Tarihi</p>
              <p className="text-sm text-muted-foreground">
                {(session.user as any).createdAt 
                  ? new Date((session.user as any).createdAt).toLocaleDateString("tr-TR")
                  : "Bilinmiyor"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
          <CardDescription>
            Yazar profilinizi düzenleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <p className="text-xs text-muted-foreground">
                Makalelerinizde görünecek isim
              </p>
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
                Benzersiz kullanıcı adınız (profil URL&apos;inde kullanılır)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Biyografi
              </label>
              <textarea
                className="w-full min-h-[120px] px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
              />
              <p className="text-xs text-muted-foreground">
                Yazar sayfanızda görünecek kısa biyografi
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                İlgi Alanları
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                İlgi alanlarınız otomatik yazar ataması için kullanılır. RSS Feed'lerden gelen makaleler ilgi alanlarınıza göre size atanabilir.
              </p>
              {profileLoaded ? (
                <InterestsSelector
                  value={formData.interests}
                  onChange={(interests) => setFormData({ ...formData, interests })}
                />
              ) : (
                <div className="text-sm text-muted-foreground">Yükleniyor...</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Uzmanlık Alanları
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Uzmanlık alanlarınızı belirtin. Bu bilgiler yazar sayfanızda görüntülenecek ve otomatik atamada kullanılacaktır.
              </p>
              {profileLoaded ? (
                <InterestsSelector
                  value={formData.expertise}
                  onChange={(expertise) => setFormData({ ...formData, expertise })}
                  suggestions={[
                    "Teknoloji",
                    "Yazılım Geliştirme",
                    "Yapay Zeka",
                    "Veri Bilimi",
                    "Siber Güvenlik",
                    "Blockchain",
                    "Mobil Uygulama",
                    "Web Geliştirme",
                    "DevOps",
                    "Cloud Computing",
                    "Ekonomi",
                    "Finans",
                    "Girişimcilik",
                    "Pazarlama",
                    "Sağlık",
                    "Eğitim",
                    "Bilim",
                    "Spor",
                    "Sanat",
                    "Müzik",
                  ]}
                />
              ) : (
                <div className="text-sm text-muted-foreground">Yükleniyor...</div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading || !formData.name}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Gelecek Özellikler</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Yakında eklenecek özellikler:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Avatar/profil fotoğrafı yükleme</li>
            <li>Sosyal medya bağlantıları</li>
            <li>Uzmanlık alanları</li>
            <li>Şifre değiştirme</li>
            <li>İki faktörlü kimlik doğrulama</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
