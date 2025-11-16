import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Haber Nexus",
  description:
    "Haber Nexus kullanım koşulları. Platformumuzu kullanırken uymanız gereken kurallar ve şartlar.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="from-muted/50 to-background border-b bg-gradient-to-b py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-primary/10 rounded-full p-4">
                  <FileText className="text-primary h-12 w-12" />
                </div>
              </div>
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">Kullanım Koşulları</h1>
              <p className="text-muted-foreground text-lg">Son güncelleme: 14 Kasım 2025</p>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="container py-16">
          <div className="mx-auto max-w-4xl space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Genel Hükümler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Bu Kullanım Koşulları, Haber Nexus (&quot;Platform&quot;, &quot;Biz&quot;,
                  &quot;Bizim&quot;) web sitesini ve hizmetlerini kullanımınızı düzenler.
                  Platformumuzu kullanarak bu koşulları kabul etmiş sayılırsınız.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Bu koşulları kabul etmiyorsanız, lütfen platformumuzu kullanmayın. Platformu
                  kullanmaya devam ederek bu koşullara bağlı kalmayı kabul edersiniz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Hizmet Tanımı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Haber Nexus, kullanıcılarına aşağıdaki hizmetleri sunar:
                </p>
                <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-2 text-sm">
                  <li>Güncel haber içeriği ve makaleler</li>
                  <li>AI destekli haber analizi ve özetleme</li>
                  <li>Kategori bazlı haber filtreleme</li>
                  <li>Kullanıcı hesabı ve profil yönetimi</li>
                  <li>Yorum yapma ve etkileşim özellikleri</li>
                  <li>Favori haberleri kaydetme</li>
                  <li>Haber arama ve keşfetme</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Kullanıcı Hesabı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-semibold">3.1. Hesap Oluşturma</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Platformumuzun bazı özelliklerini kullanmak için bir hesap oluşturmanız
                    gerekebilir. Hesap oluştururken doğru, güncel ve eksiksiz bilgiler vermeyi kabul
                    edersiniz.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">3.2. Hesap Güvenliği</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizi gizli tutmalı ve
                    hesabınızda gerçekleşen tüm faaliyetlerden sorumlu olduğunuzu kabul edersiniz.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">3.3. Hesap Askıya Alma</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Bu koşulları ihlal etmeniz durumunda hesabınızı askıya alma veya sonlandırma
                    hakkımız saklıdır.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Kullanıcı Davranış Kuralları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Platformumuzu kullanırken aşağıdaki davranışlardan kaçınmalısınız:
                </p>
                <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-2 text-sm">
                  <li>
                    Yasadışı, zararlı, tehditkar, taciz edici, hakaret içeren içerik paylaşmak
                  </li>
                  <li>Başkalarının fikri mülkiyet haklarını ihlal etmek</li>
                  <li>Spam veya istenmeyen içerik göndermek</li>
                  <li>Platformun güvenliğini tehlikeye atmak</li>
                  <li>Diğer kullanıcıların kişisel bilgilerini izinsiz toplamak</li>
                  <li>Platformu otomatik araçlarla (bot, scraper) kullanmak</li>
                  <li>Yanıltıcı veya yanlış bilgi yaymak</li>
                  <li>Nefret söylemi veya ayrımcılık içeren içerik paylaşmak</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. İçerik ve Fikri Mülkiyet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-semibold">5.1. Platform İçeriği</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Platformdaki tüm içerik (haberler, makaleler, görseller, tasarım, logo, kod)
                    Haber Nexus&apos;a veya lisans verenlerine aittir ve telif hakkı yasalarıyla
                    korunmaktadır.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">5.2. Kullanıcı İçeriği</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Platformda paylaştığınız içerik (yorumlar, profil bilgileri) üzerindeki
                    haklarınızı korursunuz, ancak bu içeriği platformumuzda kullanmamız için bize
                    dünya çapında, telifsiz, alt lisanslanabilir bir lisans vermiş olursunuz.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">5.3. Telif Hakkı İhlalleri</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Telif hakkı ihlali bildirimleri için bizimle iletişime geçebilirsiniz. İhlal
                    içeren içerikleri kaldırma hakkımız saklıdır.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. AI Destekli Hizmetler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Platformumuz, haber analizi ve özetleme için yapay zeka (Google Gemini AI)
                  kullanmaktadır. AI tarafından üretilen içerikler:
                </p>
                <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-2 text-sm">
                  <li>Otomatik olarak oluşturulur ve insan denetimi olmayabilir</li>
                  <li>Hatalı veya eksik bilgi içerebilir</li>
                  <li>Referans amaçlı kullanılmalıdır</li>
                  <li>Orijinal kaynak her zaman kontrol edilmelidir</li>
                </ul>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  AI tarafından üretilen içeriklerin doğruluğunu garanti etmiyoruz ve bu
                  içeriklerden kaynaklanan zararlardan sorumlu değiliz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Sorumluluk Reddi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Platform &quot;olduğu gibi&quot; ve &quot;mevcut olduğu şekilde&quot;
                  sunulmaktadır. Aşağıdaki konularda garanti vermiyoruz:
                </p>
                <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-2 text-sm">
                  <li>Hizmetin kesintisiz veya hatasız olacağı</li>
                  <li>İçeriğin doğruluğu, güncelliği veya eksiksizliği</li>
                  <li>Platformun belirli bir amaca uygunluğu</li>
                  <li>Güvenlik açıklarının olmaması</li>
                </ul>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  Platformun kullanımından kaynaklanan doğrudan veya dolaylı zararlardan sorumlu
                  değiliz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Üçüncü Taraf Bağlantılar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Platformumuz, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu bağlantılar
                  yalnızca kolaylık sağlamak amacıyla verilmiştir. Üçüncü taraf sitelerin
                  içeriğinden veya gizlilik uygulamalarından sorumlu değiliz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Hizmet Değişiklikleri ve Sonlandırma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Hizmetlerimizi herhangi bir zamanda, önceden bildirimde bulunmaksızın değiştirme,
                  askıya alma veya sonlandırma hakkımız saklıdır. Hizmetin sonlandırılması durumunda
                  herhangi bir tazminat yükümlülüğümüz bulunmamaktadır.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Uygulanacak Hukuk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Bu Kullanım Koşulları, Türkiye Cumhuriyeti yasalarına tabidir. Bu koşullardan
                  kaynaklanan uyuşmazlıklar Türkiye mahkemelerinde çözümlenecektir.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Koşulların Değiştirilmesi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Bu Kullanım Koşullarını herhangi bir zamanda güncelleme hakkımız saklıdır.
                  Değişiklikler bu sayfada yayınlandığında yürürlüğe girer. Önemli değişiklikler
                  için kullanıcıları bilgilendireceğiz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. İletişim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  Kullanım koşulları hakkında sorularınız için bizimle iletişime geçebilirsiniz:
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>E-posta:</strong> salihtanriseven25@gmail.com
                  </p>
                  <p>
                    <strong>Web:</strong> habernexus.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/50 rounded-lg border p-6">
              <p className="text-muted-foreground text-sm leading-relaxed">
                <strong>Önemli Not:</strong> Bu Kullanım Koşullarını düzenli olarak gözden
                geçirmenizi öneririz. Platformu kullanmaya devam ederek güncel koşulları kabul etmiş
                sayılırsınız.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
