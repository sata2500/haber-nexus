"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Send, Trash2, Eye, Edit } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

interface Draft {
  id: string
  topic: string
  outline: Record<string, unknown> | null
  research: Record<string, unknown> | null
  draft: string | null
  status: string
  qualityScore: number | null
  readabilityScore: number | null
  seoScore: number | null
  aiGenerated: boolean
  aiPrompt: string | null
  aiModel: string | null
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
  }
  article: {
    id: string
    title: string
    slug: string
    status: string
  } | null
  sources: Array<{
    id: string
    title: string
    url: string
    excerpt: string | null
    reliability: number
    isVerified: boolean
    isUsed: boolean
  }>
}

export default function EditDraftPageImproved() {
  const router = useRouter()
  const params = useParams()
  const draftId = params.id as string

  const [draft, setDraft] = useState<Draft | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const [formData, setFormData] = useState({
    topic: "",
    draft: "",
    status: "DRAFT"
  })

  const fetchDraft = useCallback(async () => {
    try {
      const response = await fetch(`/api/drafts/${draftId}`)
      if (!response.ok) throw new Error("Failed to fetch")

      const data = await response.json()
      const draftData = data.draft || data
      setDraft(draftData)
      setFormData({
        topic: draftData.topic,
        draft: draftData.draft || "",
        status: draftData.status
      })
      console.log("Draft loaded:", draftData)
      console.log("Draft content length:", (draftData.draft || "").length)
    } catch (error) {
      console.error("Fetch error:", error)
      alert("Taslak yüklenemedi")
      router.push("/admin/drafts")
    } finally {
      setLoading(false)
    }
  }, [draftId, router])

  useEffect(() => {
    fetchDraft()
  }, [fetchDraft])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: formData.topic,
          draft: formData.draft,
          status: formData.status
        })
      })

      if (!response.ok) throw new Error("Failed to save")

      alert("Taslak başarıyla kaydedildi")
      fetchDraft()
    } catch (error) {
      console.error("Save error:", error)
      alert("Kaydetme başarısız")
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!confirm("Bu taslağı makale olarak yayınlamak istediğinizden emin misiniz?")) return

    setPublishing(true)
    try {
      const response = await fetch(`/api/drafts/${draftId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: formData.topic,
          draft: formData.draft
        })
      })

      if (!response.ok) throw new Error("Failed to publish")

      const data = await response.json()
      alert("Taslak başarıyla yayınlandı!")
      router.push(`/admin/articles/${data.article.id}/edit`)
    } catch (error) {
      console.error("Publish error:", error)
      alert("Yayınlama başarısız")
    } finally {
      setPublishing(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Bu taslağı silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete")

      alert("Taslak silindi")
      router.push("/admin/drafts")
    } catch (error) {
      console.error("Delete error:", error)
      alert("Silme başarısız")
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
      RESEARCHING: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      GENERATING: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      REVIEW: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      APPROVED: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      PUBLISHED: "bg-green-600 text-white"
    }

    const labels: Record<string, string> = {
      DRAFT: "Taslak",
      RESEARCHING: "Araştırılıyor",
      GENERATING: "Oluşturuluyor",
      REVIEW: "İnceleme",
      APPROVED: "Onaylandı",
      PUBLISHED: "Yayınlandı"
    }

    return (
      <Badge className={colors[status] || colors.DRAFT}>
        {labels[status] || status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!draft) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-600">Taslak bulunamadı</p>
      </div>
    )
  }

  const wordCount = formData.draft.split(/\s+/).filter(Boolean).length
  const charCount = formData.draft.length

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Button
        variant="ghost"
        onClick={() => router.push("/admin/drafts")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Geri
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle>Taslak Düzenle</CardTitle>
                  {getStatusBadge(draft.status)}
                  {draft.aiGenerated && (
                    <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900">
                      🤖 AI
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={previewMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? <><Eye className="h-4 w-4 mr-2" /> Önizleme</> : <><Edit className="h-4 w-4 mr-2" /> Düzenle</>}
                  </Button>
                </div>
              </div>
              <CardDescription>
                Oluşturulma: {new Date(draft.createdAt).toLocaleDateString("tr-TR")} | 
                Yazar: {draft.author?.name || draft.author?.email || "Bilinmiyor"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Konu <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Taslak konusu..."
                  disabled={previewMode}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    İçerik Taslağı <span className="text-destructive">*</span>
                  </label>
                  <div className="text-xs text-muted-foreground">
                    {wordCount} kelime | {charCount} karakter
                  </div>
                </div>
                
                {previewMode ? (
                  <div className="w-full min-h-[400px] px-4 py-3 border rounded-md prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900">
                    {formData.draft ? (
                      <ReactMarkdown>{formData.draft}</ReactMarkdown>
                    ) : (
                      <p className="text-muted-foreground italic">İçerik bulunamadı</p>
                    )}
                  </div>
                ) : (
                  <textarea
                    className="w-full min-h-[400px] px-3 py-2 border rounded-md text-sm font-mono resize-y"
                    value={formData.draft}
                    onChange={(e) => setFormData({ ...formData, draft: e.target.value })}
                    placeholder="Taslak içeriğinizi buraya yazın..."
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Durum</label>
                <select
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={previewMode}
                >
                  <option value="DRAFT">Taslak</option>
                  <option value="REVIEW">İnceleme</option>
                  <option value="APPROVED">Onaylandı</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSave} disabled={saving || previewMode}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button onClick={handlePublish} disabled={publishing} variant="default">
                  <Send className="h-4 w-4 mr-2" />
                  {publishing ? "Yayınlanıyor..." : "Makale Olarak Yayınla"}
                </Button>
                <Button onClick={handleDelete} variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quality Scores */}
          {(draft.qualityScore || draft.readabilityScore || draft.seoScore) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kalite Skorları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {draft.qualityScore !== null && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Genel Kalite</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 dark:bg-blue-500" 
                          style={{ width: `${Math.round(draft.qualityScore * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(draft.qualityScore * 100)}%
                      </span>
                    </div>
                  </div>
                )}
                {draft.readabilityScore !== null && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Okunabilirlik</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600 dark:bg-green-500" 
                          style={{ width: `${Math.round(draft.readabilityScore)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {Math.round(draft.readabilityScore)}%
                      </span>
                    </div>
                  </div>
                )}
                {draft.seoScore !== null && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">SEO Skoru</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-600 dark:bg-purple-500" 
                          style={{ width: `${Math.round(draft.seoScore)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {Math.round(draft.seoScore)}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Info */}
          {draft.aiGenerated && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {draft.aiModel && (
                  <div>
                    <span className="text-muted-foreground">Model:</span>
                    <span className="ml-2 font-medium">{draft.aiModel}</span>
                  </div>
                )}
                {draft.aiPrompt && (
                  <div>
                    <span className="text-muted-foreground">Prompt:</span>
                    <p className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {draft.aiPrompt}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Research Sources */}
          {draft.sources && draft.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Araştırma Kaynakları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {draft.sources.slice(0, 5).map((source) => (
                  <div key={source.id} className="text-sm border-l-2 border-blue-500 pl-2">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium hover:underline text-blue-600 dark:text-blue-400"
                    >
                      {source.title}
                    </a>
                    {source.excerpt && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {source.excerpt}
                      </p>
                    )}
                  </div>
                ))}
                {draft.sources.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    +{draft.sources.length - 5} kaynak daha
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Published Article */}
          {draft.article && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Yayınlanan Makale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">{draft.article.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    Durum: {draft.article.status}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/articles/${draft.article.slug}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Görüntüle
                      </Button>
                    </Link>
                    <Link href={`/admin/articles/${draft.article.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Düzenle
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
