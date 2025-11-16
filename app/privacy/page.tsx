import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Haber Nexus",
  description:
    "Haber Nexus gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.",
}

export default function PrivacyPage() {
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
                  <Shield className="text-primary h-12 w-12" />
                </div>
              </div>
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">Gizlilik Politikası</h1>
              <p className="text-muted-foreground text-lg">Son güncelleme: 14 Kasım 2025</p>
            </div>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="container py-16">
          <div className="mx-auto max-w-4xl space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Giriş</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Haber Nexus olarak, kullanıcılarımızın gizliliğine önem veriyoruz. Bu Gizlilik
                  Politikası, web sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda
                  kişisel bilgilerinizin nasıl toplandığını, kullanıldığını, saklandığını ve
                  korunduğunu açıklamaktadır.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili
                  mevzuata uygun olarak hazırlanmıştır.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Toplanan Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">2.1. Kişisel Bilgiler</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Platformumuza kayıt olduğunuzda veya hizmetlerimizi kullandığınızda aşağıdaki
                    bilgileri toplayabiliriz:
                  </p>
                  <ul className="text-muted-foreground mt-2 ml-4 list-inside list-disc space-y-1 text-sm">
                    <li>Ad ve soyad</li>
                    <li>E-posta adresi</li>
                    <li>Kullanıcı adı</li>
                    <li>Profil fotoğrafı (isteğe bağlı)</li>
                    <li>Biyografi bilgileri (isteğe bağlı)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">2.2. Otomatik Toplanan Bilgiler</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Web sitemizi ziyaret ettiğinizde otomatik olarak toplanan bilgiler:
                  </p>
                  <ul className="text-muted-foreground mt-2 ml-4 list-inside list-disc space-y-1 text-sm">
                    <li>IP adresi</li>
                    <li>Tarayıcı türü ve versiyonu</li>
                    <li>İşletim sistemi</li>
                    <li>Ziyaret edilen sayfalar ve tıklanan bağlantılar</li>
                    <li>Ziyaret tarihi ve süresi</li>
                    <li>Yönlendirme URL&apos;si</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">2.3. Çerezler (Cookies)</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Web sitemiz, kullanıcı deneyimini geliştirmek için çerezler kullanmaktadır.
                    Çerezler, tarayıcınız tarafından bilgisayarınızda saklanan küçük metin
                    dosyalarıdır. Tarayıcı ayarlarınızdan çerezleri yönetebilir veya
                    engelleyebilirsiniz.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Bilgilerin Kullanımı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Topladığımız bilgileri aşağıdaki amaçlarla kullanırız:
                </p>
                <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-2 text-sm">
                  <li>Kullanıcı hesabı oluşturma ve yönetme</li>
                  <li>Hizmetlerimizi sağlama ve geliştirme</li>
                  <li>Kişiselleştirilmiş içerik sunma</li>
                  <li>Kullanıcı deneyimini iyileştirme</li>
                  <li>Güvenlik ve dolandırıcılık önleme</li>
                  <li>İstatistiksel analiz ve raporlama</li>
                  <li>Yasal yükümlülükleri yerine getirme</li>
                  <li>Kullanıcılarla iletişim kurma (bildirimler, güncellemeler)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Bilgilerin Paylaşımı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Kişisel bilgilerinizi üçüncü taraflarla paylaşmıyoruz. Ancak aşağıdaki durumlarda
                  bilgileriniz paylaşılabilir:
                </p>
                <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-2 text-sm">
                  <li>Yasal zorunluluklar (mahkeme kararı, resmi talep)</li>
                  <li>Hizmet sağlayıcılar (hosting, veritabanı, analitik)</li>
                  <li>Kullanıcı onayı ile</li>
                  <li>Platform güvenliğini sağlamak için</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Veri Güvenliği</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Kişisel bilgilerinizin güvenliğini sağlamak için endüstri standardı güvenlik
                  önlemleri kullanıyoruz. Bunlar arasında:
                </p>
                <ul className="text-muted-foreground mt-2 ml-4 list-inside list-disc space-y-2 text-sm">
                  <li>SSL/TLS şifreleme</li>
                  <li>Güvenli veritabanı saklama</li>
                  <li>Şifreli parola saklama (bcrypt)</li>
                  <li>Düzenli güvenlik güncellemeleri</li>
                  <li>Erişim kontrolü ve yetkilendirme</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Kullanıcı Hakları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  KVKK kapsamında aşağıdaki haklara sahipsiniz:
                </p>
                <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-2 text-sm">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                  <li>
                    Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp
                    kullanılmadığını öğrenme
                  </li>
                  <li>
                    Kişisel verilerin yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri
                    bilme
                  </li>
                  <li>
                    Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların
                    düzeltilmesini isteme
                  </li>
                  <li>Kişisel verilerin silinmesini veya yok edilmesini isteme</li>
                  <li>
                    Düzeltme, silme veya yok edilme işlemlerinin kişisel verilerin aktarıldığı
                    üçüncü kişilere bildirilmesini isteme
                  </li>
                  <li>
                    İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi
                    suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme
                  </li>
                  <li>
                    Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız
                    hâlinde zararın giderilmesini talep etme
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Üçüncü Taraf Hizmetler</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  Platformumuz aşağıdaki üçüncü taraf hizmetleri kullanmaktadır:
                </p>
                <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-2 text-sm">
                  <li>
                    <strong>Google OAuth:</strong> Sosyal medya ile giriş için
                  </li>
                  <li>
                    <strong>Google Gemini AI:</strong> Haber analizi ve özet oluşturma için
                  </li>
                  <li>
                    <strong>Neon Database:</strong> Veritabanı hosting için
                  </li>
                  <li>
                    <strong>Vercel:</strong> Web hosting için
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  Bu hizmetlerin kendi gizlilik politikaları bulunmaktadır ve bu hizmetleri
                  kullanarak ilgili politikaları kabul etmiş olursunuz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Çocukların Gizliliği</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Hizmetlerimiz 13 yaşın altındaki çocuklara yönelik değildir. 13 yaşın altındaki
                  kullanıcılardan bilerek kişisel bilgi toplamıyoruz. Eğer 13 yaşın altında bir
                  çocuğun bilgilerini topladığımızı fark ederseniz, lütfen bizimle iletişime geçin.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Politika Değişiklikleri</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler olması
                  durumunda kullanıcılarımızı e-posta veya platform bildirimleri ile
                  bilgilendireceğiz. Politikanın güncel versiyonu her zaman bu sayfada
                  yayınlanacaktır.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. İletişim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  Gizlilik politikamız hakkında sorularınız veya talepleriniz için bizimle iletişime
                  geçebilirsiniz:
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
