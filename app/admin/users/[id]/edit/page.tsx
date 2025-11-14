"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

interface User {
  id: string
  email: string
  username: string | null
  name: string | null
  bio: string | null
  role: string
}

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    role: "USER",
  })

  useEffect(() => {
    fetchUser()
  }, [userId])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (response.ok) {
        const data: User = await response.json()
        setFormData({
          name: data.name || "",
          username: data.username || "",
          bio: data.bio || "",
          role: data.role,
        })
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/users")
      } else {
        const data = await response.json()
        alert(data.error || "Kullanıcı güncellenemedi")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Bir hata oluştu")
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

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Geri
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Düzenle</CardTitle>
          <CardDescription>
            Kullanıcı bilgilerini güncelleyin
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Rol</label>
              <select
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="USER">Kullanıcı</option>
                <option value="AUTHOR">Yazar</option>
                <option value="EDITOR">Editör</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Süper Admin</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Kullanıcının sistem içindeki yetkisi
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Güncelleniyor..." : "Güncelle"}
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
    </div>
  )
}
