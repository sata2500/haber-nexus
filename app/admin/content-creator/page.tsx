"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function ContentCreatorPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [topic, setTopic] = useState("")
  const [style, setStyle] = useState<"news" | "blog" | "analysis" | "interview" | "opinion">("news")
  const [tone, setTone] = useState<"formal" | "casual" | "professional" | "friendly">("professional")
  const [length, setLength] = useState<"short" | "medium" | "long">("medium")
  const [includeResearch, setIncludeResearch] = useState(true)
  const [keywords, setKeywords] = useState("")
  
  // Generated content
  const [draftId, setDraftId] = useState<string>("")
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Lütfen bir konu girin")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_article",
          data: {
            topic,
            style,
            tone,
            length,
            includeResearch,
            keywords: keywords.split(",").map(k => k.trim()).filter(Boolean)
          }
        })
      })

      if (!response.ok) {
        throw new Error("İçerik oluşturma başarısız")
      }

      const data = await response.json()
      console.log("Content generation response:", data)
      
      if (!data.success || !data.result) {
        throw new Error(data.error || "İçerik oluşturulamadı")
      }
      
      setGeneratedContent(data.result)
      setDraftId(data.result.draftId)
      console.log("Draft ID:", data.result.draftId)
      console.log("Content length:", data.result.content?.length || 0)
      setStep(2)
    } catch (error) {
      console.error("Generation error:", error)
      const errorMessage = error instanceof Error ? error.message : "İçerik oluşturulurken bir hata oluştu"
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!draftId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/drafts/${draftId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishNow: true
        })
      })

      if (!response.ok) {
        throw new Error("Yayınlama başarısız")
      }

      const data = await response.json()
      alert("Makale başarıyla yayınlandı!")
      router.push(`/articles/${data.article.slug}`)
    } catch (error) {
      console.error("Publish error:", error)
      alert("Yayınlanırken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = () => {
    if (draftId) {
      router.push(`/admin/drafts/${draftId}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">🤖 AI İçerik Oluşturucu</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${step >= 1 ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-600"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 dark:bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
              1
            </div>
            <span className="ml-2 font-medium">Konu Belirleme</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-300 dark:bg-gray-700">
            <div className={`h-full ${step >= 2 ? "bg-blue-600 dark:bg-blue-500" : ""}`} style={{ width: step >= 2 ? "100%" : "0%" }}></div>
          </div>
          <div className={`flex items-center ${step >= 2 ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-600"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600 dark:bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
              2
            </div>
            <span className="ml-2 font-medium">İçerik Önizleme</span>
          </div>
        </div>
      </div>

      {/* Step 1: Topic Input */}
      {step === 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Konu *
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Örn: Yapay zeka etiği ve geleceği"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Stil
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="news">Haber</option>
                <option value="blog">Blog</option>
                <option value="analysis">Analiz</option>
                <option value="interview">Röportaj</option>
                <option value="opinion">Görüş</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Ton
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="formal">Resmi</option>
                <option value="casual">Günlük</option>
                <option value="professional">Profesyonel</option>
                <option value="friendly">Samimi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Uzunluk
            </label>
            <div className="flex space-x-4">
              {[
                { value: "short", label: "Kısa (300-500 kelime)" },
                { value: "medium", label: "Orta (800-1200 kelime)" },
                { value: "long", label: "Uzun (1500-2500 kelime)" }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    value={option.value}
                    checked={length === option.value}
                    onChange={(e) => setLength(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-900 dark:text-gray-100">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Anahtar Kelimeler (virgülle ayırın)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="yapay zeka, etik, teknoloji"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeResearch"
              checked={includeResearch}
              onChange={(e) => setIncludeResearch(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="includeResearch" className="text-sm text-gray-900 dark:text-gray-100">
              Otomatik araştırma yap ve kaynakları ekle
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              İptal
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Oluşturuluyor..." : "🤖 İçerik Oluştur"}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Preview */}
      {step === 2 && generatedContent && (
        <div className="space-y-6">
          {/* Quality Scores */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Kalite Skorları</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Genel Kalite</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(generatedContent.qualityScore * 100)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Okunabilirlik</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(generatedContent.readabilityScore)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">SEO Skoru</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(generatedContent.seoScore)}%
                </div>
              </div>
            </div>
          </div>

          {/* Content Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{generatedContent.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{generatedContent.excerpt}</p>
            
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">{generatedContent.content}</div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Kelime Sayısı:</strong> {generatedContent.wordCount} |{" "}
                <strong>Okuma Süresi:</strong> {generatedContent.estimatedReadTime} dakika
              </div>
              <div className="mt-2">
                <strong className="text-sm text-gray-600 dark:text-gray-400">Etiketler:</strong>{" "}
                {generatedContent.tags.map((tag: string) => (
                  <span key={tag} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded mr-2">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              Geri
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-6 py-2 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              Taslak Olarak Kaydet
            </button>
            <button
              onClick={handlePublish}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Yayınlanıyor..." : "✅ Yayınla"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
