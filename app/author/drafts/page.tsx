"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FilePlus, Search, FileText, Calendar, Trash2, Edit } from "lucide-react"
import Link from "next/link"

interface Draft {
  id: string
  title: string
  content: string
  researchData: any
  qualityScore: number | null
  createdAt: string
  updatedAt: string
}

export default function AuthorDraftsPage() {
  const router = useRouter()
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchDrafts = useCallback(async () => {
    try {
      const response = await fetch("/api/drafts")
      if (response.ok) {
        const data = await response.json()
        setDrafts(data)
      }
    } catch (error) {
      console.error("Error fetching drafts:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDrafts()
  }, [fetchDrafts])

  const handleDelete = async (id: string) => {
    if (!confirm("Bu taslağı silmek istediğinizden emin misiniz?")) {
      return
    }

    try {
      const response = await fetch(`/api/drafts/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchDrafts()
      } else {
        const data = await response.json()
        alert(data.error || "Taslak silinemedi")
      }
    } catch (error) {
      console.error("Error deleting draft:", error)
      alert("Bir hata oluştu")
    }
  }

  const handlePublish = async (draft: Draft) => {
    // Taslağı makaleye dönüştür
    router.push(`/author/articles/new?draftId=${draft.id}`)
  }

  const filteredDrafts = drafts.filter((draft) =>
    draft.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Taslaklar</h1>
          <p className="text-muted-foreground mt-2">
            AI destekli taslak oluşturun ve yönetin
          </p>
        </div>
        <Link href="/admin/content-creator">
          <Button className="gap-2">
            <FilePlus className="h-4 w-4" />
            Yeni Taslak Oluştur
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arama</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Taslak başlığı ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      ) : filteredDrafts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Arama kriterlerine uygun taslak bulunamadı" : "Henüz taslak oluşturmadınız"}
            </p>
            <Link href="/admin/content-creator">
              <Button>
                <FilePlus className="h-4 w-4 mr-2" />
                AI ile Taslak Oluştur
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDrafts.map((draft) => (
            <Card key={draft.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">{draft.title}</CardTitle>
                  {draft.qualityScore && (
                    <Badge variant={draft.qualityScore >= 80 ? "default" : "secondary"}>
                      {draft.qualityScore}%
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-3">
                  {draft.content.substring(0, 150)}...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(draft.createdAt).toLocaleDateString("tr-TR")}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePublish(draft)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Makaleye Dönüştür
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(draft.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">AI Taslak Sistemi Hakkında</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>AI Taslak Sistemi</strong>, Google Gemini AI kullanarak otomatik içerik taslakları oluşturur.
          </p>
          <p>
            Taslaklar, araştırma verilerini, kalite skorlarını ve önerilen içeriği içerir. 
            Taslakları düzenleyerek tam makaleye dönüştürebilirsiniz.
          </p>
          <p>
            Yeni taslak oluşturmak için <strong>&quot;Yeni Taslak Oluştur&quot;</strong> butonuna tıklayın 
            ve AI İçerik Oluşturucu sayfasına yönlendirileceksiniz.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
