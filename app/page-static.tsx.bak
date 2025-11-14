import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, TrendingUp, Sparkles } from "lucide-react"
import Link from "next/link"

// Örnek haber verileri (daha sonra Sanity CMS'den gelecek)
const featuredNews = {
  id: 1,
  title: "Yapay Zeka Teknolojileri 2025'te Yeni Bir Döneme Giriyor",
  description: "Teknoloji devleri, yapay zeka alanında yaptıkları yeni yatırımlarla sektörde devrim yaratmaya hazırlanıyor. AI destekli uygulamalar günlük hayatın her alanına entegre oluyor.",
  category: "Teknoloji",
  date: "14 Kasım 2025",
  readTime: "5 dk",
  image: "/placeholder-news.jpg",
}

const latestNews = [
  {
    id: 2,
    title: "Ekonomide Yeni Dönem: Dijital Para Birimleri Yaygınlaşıyor",
    description: "Merkez bankaları dijital para birimi projelerini hızlandırıyor.",
    category: "Ekonomi",
    date: "14 Kasım 2025",
    readTime: "3 dk",
    aiSummary: true,
  },
  {
    id: 3,
    title: "Spor Dünyasında Tarihi Anlar: Şampiyonluk Yarışı Kızışıyor",
    description: "Ligin son haftalarında şampiyonluk için heyecan dorukta.",
    category: "Spor",
    date: "14 Kasım 2025",
    readTime: "4 dk",
    aiSummary: false,
  },
  {
    id: 4,
    title: "Dünya Gündeminde Öne Çıkan Gelişmeler",
    description: "Uluslararası arenada yaşanan son gelişmeler dikkat çekiyor.",
    category: "Dünya",
    date: "14 Kasım 2025",
    readTime: "6 dk",
    aiSummary: true,
  },
  {
    id: 5,
    title: "Gündemdeki Konular: Toplumsal Değişim ve Yenilikler",
    description: "Sosyal medya ve teknoloji toplumsal değişimi nasıl etkiliyor?",
    category: "Gündem",
    date: "13 Kasım 2025",
    readTime: "5 dk",
    aiSummary: false,
  },
]

const trendingTopics = [
  "Yapay Zeka",
  "Dijital Para",
  "Sürdürülebilirlik",
  "Uzay Teknolojisi",
  "Siber Güvenlik",
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Featured News */}
        <section className="container py-8">
          <Card className="overflow-hidden border-2">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Placeholder */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 aspect-video md:aspect-auto flex items-center justify-center">
                <div className="text-center p-8">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <p className="text-sm text-muted-foreground">Öne Çıkan Haber Görseli</p>
                </div>
              </div>
              
              {/* Content */}
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default">{featuredNews.category}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI Özet
                  </Badge>
                </div>
                <CardTitle className="text-3xl md:text-4xl leading-tight">
                  {featuredNews.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {featuredNews.description}
                </CardDescription>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{featuredNews.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredNews.readTime}
                  </span>
                </div>
                <Button size="lg" className="w-fit">
                  Devamını Oku
                </Button>
              </CardHeader>
            </div>
          </Card>
        </section>

        {/* Breaking News Banner */}
        <section className="bg-destructive/10 border-y border-destructive/20">
          <div className="container py-3">
            <div className="flex items-center gap-4">
              <Badge variant="destructive" className="shrink-0">SON DAKİKA</Badge>
              <p className="text-sm font-medium truncate">
                Teknoloji sektöründe yeni gelişmeler: Büyük şirketler AI yatırımlarını artırıyor
              </p>
              <Link href="#" className="text-sm font-medium text-primary hover:underline shrink-0">
                Detaylar →
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Latest News - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Son Haberler</h2>
                <Button variant="outline" size="sm">
                  Tümünü Gör
                </Button>
              </div>

              <div className="grid gap-6">
                {latestNews.map((news) => (
                  <Card key={news.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{news.category}</Badge>
                            {news.aiSummary && (
                              <Badge variant="outline" className="gap-1">
                                <Sparkles className="h-3 w-3" />
                                AI
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                            {news.title}
                          </CardTitle>
                          <CardDescription>{news.description}</CardDescription>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{news.date}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {news.readTime}
                            </span>
                          </div>
                        </div>
                        {/* Thumbnail placeholder */}
                        <div className="w-24 h-24 rounded-md bg-muted flex items-center justify-center shrink-0">
                          <span className="text-xs text-muted-foreground">Görsel</span>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trend Konular
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {trendingTopics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Analizler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Günün Özeti</h4>
                    <p className="text-sm text-muted-foreground">
                      Yapay zeka destekli haber analizimiz, bugünün en önemli gelişmelerini sizin için özetledi.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Detaylı Analiz
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bülten</CardTitle>
                  <CardDescription>
                    Günlük haber özetini e-postanıza göndereceğiz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="E-posta adresiniz"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                    <Button className="w-full" size="sm">
                      Abone Ol
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
