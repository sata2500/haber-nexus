import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Target, Users, Zap } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hakkımızda | Haber Nexus",
  description:
    "Haber Nexus - Türkiye ve dünyadan son dakika haberleri, güncel gelişmeler ve AI destekli haber analizi platformu.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="from-muted/50 to-background border-b bg-gradient-to-b py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">Haber Nexus Hakkında</h1>
              <p className="text-muted-foreground text-xl leading-relaxed">
                Türkiye ve dünyadan son dakika haberleri, güncel gelişmeler ve yapay zeka destekli
                haber analizi ile okuyucularımıza en doğru ve güncel bilgiyi sunuyoruz.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="container py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Target className="text-primary h-6 w-6" />
                    </div>
                    <CardTitle>Misyonumuz</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Haber Nexus olarak misyonumuz, okuyucularımıza tarafsız, doğru ve güncel
                    haberleri en hızlı şekilde ulaştırmaktır. Yapay zeka teknolojisini kullanarak
                    haber akışını optimize ediyor, önemli gelişmeleri öne çıkarıyor ve
                    okuyucularımızın zamanını en verimli şekilde kullanmalarını sağlıyoruz.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Sparkles className="text-primary h-6 w-6" />
                    </div>
                    <CardTitle>Vizyonumuz</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Türkiye&apos;nin önde gelen dijital haber platformlarından biri olmak ve yapay
                    zeka destekli habercilik alanında öncü konumda yer almak vizyonumuzdur.
                    Okuyucularımıza sadece haber değil, aynı zamanda derinlemesine analiz ve
                    içgörüler sunarak bilgi çağında rehberlik etmeyi hedefliyoruz.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div className="mb-16">
              <h2 className="mb-8 text-center text-3xl font-bold">Neden Haber Nexus?</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Zap className="text-primary h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">Hızlı ve Güncel</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      RSS feed entegrasyonu ve otomatik haber tarama sistemi sayesinde son dakika
                      haberlerini anında okuyucularımıza ulaştırıyoruz.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Sparkles className="text-primary h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">AI Destekli Analiz</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Google Gemini AI teknolojisi ile haberleri özetliyor, etiketliyor ve
                      okuyucularımıza en alakalı içerikleri sunuyoruz.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Users className="text-primary h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">Kullanıcı Odaklı</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Modern ve kullanıcı dostu arayüz, kişiselleştirilebilir içerik akışı ve sosyal
                      etkileşim özellikleri ile okuma deneyimini en üst seviyeye çıkarıyoruz.
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
                  Haber Nexus, Next.js 16 framework&apos;ü üzerine inşa edilmiş modern bir web
                  uygulamasıdır. React 19 ile dinamik kullanıcı arayüzü, Prisma ORM ile güvenli
                  veritabanı yönetimi, NextAuth.js ile güvenli kimlik doğrulama ve Google Gemini AI
                  ile akıllı içerik işleme özelliklerine sahiptir.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  PostgreSQL veritabanı altyapımız sayesinde yüksek performanslı veri yönetimi,
                  Tailwind CSS ile responsive tasarım ve Vercel üzerinde hızlı deployment
                  sağlıyoruz. Tüm bu teknolojiler bir araya gelerek okuyucularımıza kesintisiz ve
                  hızlı bir haber okuma deneyimi sunuyor.
                </p>
              </CardContent>
            </Card>

            {/* Team */}
            <div className="mt-16 text-center">
              <h2 className="mb-4 text-3xl font-bold">Ekibimiz</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl leading-relaxed">
                Haber Nexus, deneyimli yazarlar, editörler ve teknoloji uzmanlarından oluşan tutkulu
                bir ekip tarafından geliştirilmekte ve yönetilmektedir. Amacımız, okuyucularımıza en
                kaliteli haber deneyimini sunmaktır.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
