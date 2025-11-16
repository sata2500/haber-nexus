"use client"

import { useState, useEffect, useCallback } from "react"
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
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  const fetchDrafts = useCallback(async () => {
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
  }, [filter])

  useEffect(() => {
    fetchDrafts()
  }, [fetchDrafts])

  const handleDelete = async (id: string) => {
    if (!confirm("Bu taslağı silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/drafts/${id}`, {
        method: "DELETE",
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
      DRAFT: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
      RESEARCHING: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      GENERATING: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      REVIEW: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      APPROVED: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      PUBLISHED: "bg-green-600 text-white",
    }

    const labels: Record<string, string> = {
      DRAFT: "Taslak",
      RESEARCHING: "Araştırılıyor",
      GENERATING: "Oluşturuluyor",
      REVIEW: "İnceleme",
      APPROVED: "Onaylandı",
      PUBLISHED: "Yayınlandı",
    }

    return (
      <span className={`rounded px-2 py-1 text-xs font-medium ${colors[status] || colors.DRAFT}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          📝 İçerik Taslakları
        </h1>
        <Link
          href="/admin/content-creator"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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
          { value: "PUBLISHED", label: "Yayınlandı" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`rounded-lg px-4 py-2 ${
              filter === option.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Drafts List */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      ) : drafts.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center shadow dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">Henüz taslak bulunmuyor.</p>
          <Link
            href="/admin/content-creator"
            className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
          >
            İlk taslağınızı oluşturun →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {draft.topic}
                    </h3>
                    {getStatusBadge(draft.status)}
                    {draft.aiGenerated && (
                      <span className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        🤖 AI
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Yazar: {draft.author.name} | Oluşturulma:{" "}
                    {new Date(draft.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/admin/drafts/${draft.id}`}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Sil
                  </button>
                </div>
              </div>

              {/* Quality Scores */}
              {(draft.qualityScore || draft.readabilityScore || draft.seoScore) && (
                <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  {draft.qualityScore !== null && (
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Kalite</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(draft.qualityScore * 100)}%
                      </div>
                    </div>
                  )}
                  {draft.readabilityScore !== null && (
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Okunabilirlik</div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {Math.round(draft.readabilityScore)}%
                      </div>
                    </div>
                  )}
                  {draft.seoScore !== null && (
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">SEO</div>
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {Math.round(draft.seoScore)}%
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Published Article Link */}
              {draft.article && (
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <Link
                    href={`/articles/${draft.article.slug}`}
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
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
