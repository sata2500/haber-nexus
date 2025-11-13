import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, RefreshCw, Trash2, Check, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

interface RssFeed {
  id: string
  name: string
  url: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastFetched: Date | null
}

export default async function RssPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const rssFeeds = await prisma.rssFeed.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">RSS Beslemeleri</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            RSS kaynaklarını yönet ve otomatik içerik üret
          </p>
        </div>
        <Link
          href="/dashboard/rss/new"
          className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Yeni RSS Kaynağı
        </Link>
      </div>

      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-start gap-x-3">
          <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
              Otomatik İçerik Üretimi
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              RSS beslemelerinden gelen haberler için yapay zeka ile otomatik olarak profesyonel içerikler oluşturulur.
              İçerikler taslak olarak kaydedilir ve yayınlanmadan önce gözden geçirilebilir.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {rssFeeds.length > 0 ? (
          rssFeeds.map((feed: RssFeed) => (
            <div
              key={feed.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-x-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feed.name}
                    </h3>
                    {feed.isActive ? (
                      <span className="inline-flex items-center gap-x-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        <Check className="h-3 w-3" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-x-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
                        <X className="h-3 w-3" />
                        Pasif
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 break-all">
                    {feed.url}
                  </p>
                  <div className="mt-2 flex items-center gap-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      Oluşturulma: {formatDistanceToNow(feed.createdAt, { addSuffix: true, locale: tr })}
                    </span>
                    {feed.lastFetched && (
                      <span>
                        Son çekilme: {formatDistanceToNow(feed.lastFetched, { addSuffix: true, locale: tr })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <form action="/api/rss/fetch" method="POST">
                    <input type="hidden" name="feedId" value={feed.id} />
                    <button
                      type="submit"
                      className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-500 transition-colors"
                      title="RSS'i şimdi çek"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </form>
                  <button
                    className="rounded-md bg-red-600 p-2 text-white hover:bg-red-500 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <RefreshCw className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Henüz RSS kaynağı eklenmemiş
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Otomatik içerik üretimi için RSS beslemeleri ekleyin
            </p>
            <Link
              href="/dashboard/rss/new"
              className="mt-6 inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              İlk RSS Kaynağını Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
