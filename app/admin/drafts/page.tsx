"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface Draft {
  id: string
  topic: string
  status: string
  qualityScore: number | null
  readabilityScore: number | null
  seoScore: number | null
  aiGenerated: boolean
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
}

export default function DraftsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetchDrafts()
  }, [filter])

  const fetchDrafts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== "all") {
        params.append("status", filter)
      }

      const response = await fetch(`/api/drafts?${params}`)
      if (!response.ok) throw new Error("Failed to fetch")

      const data = await response.json()
      setDrafts(data.drafts)
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu taslağı silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/drafts/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete")

      fetchDrafts()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Silme işlemi başarısız")
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800",
      RESEARCHING: "bg-blue-100 text-blue-800",
      GENERATING: "bg-purple-100 text-purple-800",
      REVIEW: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
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
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || colors.DRAFT}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📝 İçerik Taslakları</h1>
        <Link
          href="/admin/content-creator"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Yeni İçerik Oluştur
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-2">
        {[
          { value: "all", label: "Tümü" },
          { value: "DRAFT", label: "Taslak" },
          { value: "REVIEW", label: "İnceleme" },
          { value: "APPROVED", label: "Onaylandı" },
          { value: "PUBLISHED", label: "Yayınlandı" }
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-lg ${
              filter === option.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Drafts List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      ) : drafts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">Henüz taslak bulunmuyor.</p>
          <Link
            href="/admin/content-creator"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            İlk taslağınızı oluşturun →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold">{draft.topic}</h3>
                    {getStatusBadge(draft.status)}
                    {draft.aiGenerated && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                        🤖 AI
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Yazar: {draft.author.name} | Oluşturulma: {new Date(draft.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/admin/drafts/${draft.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Sil
                  </button>
                </div>
              </div>

              {/* Quality Scores */}
              {(draft.qualityScore || draft.readabilityScore || draft.seoScore) && (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  {draft.qualityScore !== null && (
                    <div>
                      <div className="text-xs text-gray-600">Kalite</div>
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(draft.qualityScore * 100)}%
                      </div>
                    </div>
                  )}
                  {draft.readabilityScore !== null && (
                    <div>
                      <div className="text-xs text-gray-600">Okunabilirlik</div>
                      <div className="text-lg font-bold text-green-600">
                        {Math.round(draft.readabilityScore)}%
                      </div>
                    </div>
                  )}
                  {draft.seoScore !== null && (
                    <div>
                      <div className="text-xs text-gray-600">SEO</div>
                      <div className="text-lg font-bold text-purple-600">
                        {Math.round(draft.seoScore)}%
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Published Article Link */}
              {draft.article && (
                <div className="mt-4 pt-4 border-t">
                  <Link
                    href={`/articles/${draft.article.slug}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    📄 Yayınlanan makaleyi görüntüle →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
