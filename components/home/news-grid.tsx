import Link from 'next/link'
import { Clock } from 'lucide-react'

// Geçici mock data
const newsItems = [
  {
    id: 1,
    title: 'Teknoloji Şirketleri Yapay Zeka Yarışında Hız Kesmiyor',
    excerpt: 'Dünya devleri yapay zeka alanındaki yatırımlarını artırırken, rekabet giderek kızışıyor.',
    category: 'Teknoloji',
    author: 'Mehmet Demir',
    date: '13 Kasım 2025',
    readTime: '4 dk',
    slug: 'teknoloji-sirketleri-yapay-zeka',
  },
  {
    id: 2,
    title: 'Ekonomide Büyüme Beklentileri Yükseldi',
    excerpt: 'Uzmanlar, yılın son çeyreğinde ekonomik büyümenin hızlanacağını öngörüyor.',
    category: 'Ekonomi',
    author: 'Ayşe Kaya',
    date: '13 Kasım 2025',
    readTime: '3 dk',
    slug: 'ekonomide-buyume-beklentileri',
  },
  {
    id: 3,
    title: 'Yeni Eğitim Reformu Mecliste Kabul Edildi',
    excerpt: 'Eğitim sisteminde köklü değişiklikler getiren yasa paketi onaylandı.',
    category: 'Gündem',
    author: 'Can Öztürk',
    date: '13 Kasım 2025',
    readTime: '5 dk',
    slug: 'yeni-egitim-reformu',
  },
  {
    id: 4,
    title: 'Dünya Kupası Hazırlıkları Devam Ediyor',
    excerpt: 'Milli takım, kritik maç öncesi son antrenmanlarını yaptı.',
    category: 'Spor',
    author: 'Emre Yıldız',
    date: '13 Kasım 2025',
    readTime: '3 dk',
    slug: 'dunya-kupasi-hazirliklari',
  },
  {
    id: 5,
    title: 'Yenilenebilir Enerjide Rekor Artış',
    excerpt: 'Türkiye, yenilenebilir enerji kapasitesini son bir yılda yüzde 25 artırdı.',
    category: 'Ekonomi',
    author: 'Zeynep Arslan',
    date: '12 Kasım 2025',
    readTime: '4 dk',
    slug: 'yenilenebilir-enerjide-rekor',
  },
  {
    id: 6,
    title: 'Sanat Dünyasından Önemli Gelişme',
    excerpt: 'Ünlü ressam, yeni sergisini İstanbul\'da açtı.',
    category: 'Kültür-Sanat',
    author: 'Deniz Şahin',
    date: '12 Kasım 2025',
    readTime: '3 dk',
    slug: 'sanat-dunyasindan-gelisme',
  },
]

interface NewsGridProps {
  title: string
  category?: string
}

export function NewsGrid({ title, category }: NewsGridProps) {
  // Eğer kategori belirtilmişse filtrele
  const filteredNews = category
    ? newsItems.filter(item => item.category === category)
    : newsItems

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
          {category && (
            <Link
              href={`/kategori/${category.toLowerCase()}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Tümünü Gör →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <Link
              key={news.id}
              href={`/haber/${news.slug}`}
              className="group block rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-lg dark:hover:shadow-zinc-900/50 transition-all"
            >
              {/* Image Placeholder */}
              <div className="aspect-[16/9] bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                    {news.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <Clock className="h-3 w-3" />
                    {news.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {news.title}
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                  {news.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{news.author}</span>
                  <span>{news.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
