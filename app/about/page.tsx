import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Target, Users, Zap } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hakkımızda | Haber Nexus",
  description: "Haber Nexus - Türkiye ve dünyadan son dakika haberleri, güncel gelişmeler ve AI destekli haber analizi platformu.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-16 border-b">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Haber Nexus Hakkında
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Türkiye ve dünyadan son dakika haberleri, güncel gelişmeler ve yapay zeka destekli 
                haber analizi ile okuyucularımıza en doğru ve güncel bilgiyi sunuyoruz.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Misyonumuz</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Haber Nexus olarak misyonumuz, okuyucularımıza tarafsız, doğru ve güncel haberleri 
                    en hızlı şekilde ulaştırmaktır. Yapay zeka teknolojisini kullanarak haber akışını 
                    optimize ediyor, önemli gelişmeleri öne çıkarıyor ve okuyucularımızın zamanını 
                    en verimli şekilde kullanmalarını sağlıyoruz.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Vizyonumuz</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Türkiye&apos;nin önde gelen dijital haber platformlarından biri olmak ve yapay zeka 
                    destekli habercilik alanında öncü konumda yer almak vizyonumuzdur. Okuyucularımıza 
                    sadece haber değil, aynı zamanda derinlemesine analiz ve içgörüler sunarak bilgi 
                    çağında rehberlik etmeyi hedefliyoruz.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Neden Haber Nexus?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Hızlı ve Güncel</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      RSS feed entegrasyonu ve otomatik haber tarama sistemi sayesinde son dakika 
                      haberlerini anında okuyucularımıza ulaştırıyoruz.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">AI Destekli Analiz</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Google Gemini AI teknolojisi ile haberleri özetliyor, etiketliyor ve 
                      okuyucularımıza en alakalı içerikleri sunuyoruz.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Kullanıcı Odaklı</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Modern ve kullanıcı dostu arayüz, kişiselleştirilebilir içerik akışı ve 
                      sosyal etkileşim özellikleri ile okuma deneyimini en üst seviyeye çıkarıyoruz.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Technology */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Teknoloji Altyapımız</CardTitle>
                <CardDescription>
                  Modern web teknolojileri ve yapay zeka ile güçlendirilmiş platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Haber Nexus, Next.js 16 framework&apos;ü üzerine inşa edilmiş modern bir web uygulamasıdır. 
                  React 19 ile dinamik kullanıcı arayüzü, Prisma ORM ile güvenli veritabanı yönetimi, 
                  NextAuth.js ile güvenli kimlik doğrulama ve Google Gemini AI ile akıllı içerik işleme 
                  özelliklerine sahiptir.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  PostgreSQL veritabanı altyapımız sayesinde yüksek performanslı veri yönetimi, 
                  Tailwind CSS ile responsive tasarım ve Vercel üzerinde hızlı deployment 
                  sağlıyoruz. Tüm bu teknolojiler bir araya gelerek okuyucularımıza kesintisiz 
                  ve hızlı bir haber okuma deneyimi sunuyor.
                </p>
              </CardContent>
            </Card>

            {/* Team */}
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-bold mb-4">Ekibimiz</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Haber Nexus, deneyimli yazarlar, editörler ve teknoloji uzmanlarından oluşan 
                tutkulu bir ekip tarafından geliştirilmekte ve yönetilmektedir. Amacımız, 
                okuyucularımıza en kaliteli haber deneyimini sunmaktır.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
