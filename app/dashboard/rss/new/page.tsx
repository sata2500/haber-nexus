"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewRssFeedPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/rss", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/dashboard/rss")
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || "RSS kaynağı eklenirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Error creating RSS feed:", error)
      alert("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 lg:px-8">
      <div className="mb-8">
        <Link
          href="/dashboard/rss"
          className="inline-flex items-center gap-x-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri Dön
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Yeni RSS Kaynağı Ekle</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Kaynak Adı *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Örn: TRT Haber"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                RSS URL *
              </label>
              <input
                type="url"
                id="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/rss"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                RSS besleme URL&apos;sini girin
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Aktif (Otomatik içerik üretimi için kullan)
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-x-4">
          <Link
            href="/dashboard/rss"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  )
}
