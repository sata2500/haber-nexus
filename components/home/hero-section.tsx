import Link from 'next/link'
import Image from 'next/image'
import { Clock, TrendingUp } from 'lucide-react'

// Geçici mock data - sonra Payload CMS'den gelecek
const featuredNews = {
  id: 1,
  title: 'Yapay Zeka Teknolojisinde Yeni Dönem: Google Gemini 2.0 Tanıtıldı',
  excerpt: 'Google, yapay zeka modellerinde çığır açan Gemini 2.0 versiyonunu tanıttı. Yeni model, önceki versiyona göre 10 kat daha hızlı ve daha doğru sonuçlar üretiyor.',
  image: '/placeholder-hero.jpg',
  category: 'Teknoloji',
  author: 'Ahmet Yılmaz',
  date: '13 Kasım 2025',
  readTime: '5 dk',
  slug: 'yapay-zeka-teknolojisinde-yeni-donem',
}

const trendingNews = [
  {
    id: 2,
    title: 'Ekonomide Yeni Gelişmeler: Merkez Bankası Faiz Kararını Açıkladı',
    category: 'Ekonomi',
    date: '13 Kasım 2025',
    slug: 'ekonomide-yeni-gelismeler',
  },
  {
    id: 3,
    title: 'Dünya Kupası Elemeleri: Türkiye Kritik Maça Hazırlanıyor',
    category: 'Spor',
    date: '13 Kasım 2025',
    slug: 'dunya-kupasi-elemeleri',
  },
  {
    id: 4,
    title: 'İklim Zirvesi Sonuçlandı: Tarihi Kararlar Alındı',
    category: 'Dünya',
    date: '13 Kasım 2025',
    slug: 'iklim-zirvesi-sonuclandi',
  },
]

export function HeroSection() {
  return (
    <section className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured News */}
          <div className="lg:col-span-2">
            <Link
              href={`/haber/${featuredNews.slug}`}
              className="group block relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 aspect-[16/9] lg:aspect-[21/9]"
            >
              {/* Placeholder Image */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-medium">
                    {featuredNews.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-zinc-200">
                    <Clock className="h-4 w-4" />
                    {featuredNews.readTime}
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  {featuredNews.title}
                </h2>
                <p className="text-zinc-200 text-sm lg:text-base mb-3 line-clamp-2">
                  {featuredNews.excerpt}
                </p>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <span>{featuredNews.author}</span>
                  <span>•</span>
                  <span>{featuredNews.date}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Trending News */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Trend Haberler
              </h3>
            </div>
            {trendingNews.map((news, index) => (
              <Link
                key={news.id}
                href={`/haber/${news.slug}`}
                className="group block p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium mb-2">
                      {news.category}
                    </span>
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                      {news.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {news.date}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
