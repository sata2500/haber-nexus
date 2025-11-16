import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "İletişim | Haber Nexus",
  description:
    "Haber Nexus ile iletişime geçin. Sorularınız, önerileriniz ve geri bildirimleriniz için bize ulaşın.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="from-muted/50 to-background border-b bg-gradient-to-b py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">İletişim</h1>
              <p className="text-muted-foreground text-xl leading-relaxed">
                Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime
                geçebilirsiniz. Size en kısa sürede dönüş yapacağız.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="container py-16">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Bize Mesaj Gönderin</CardTitle>
                  <CardDescription>
                    Formu doldurarak bizimle iletişime geçebilirsiniz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Ad Soyad
                      </label>
                      <Input id="name" placeholder="Adınız ve soyadınız" required />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        E-posta
                      </label>
                      <Input id="email" type="email" placeholder="ornek@email.com" required />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Konu
                      </label>
                      <Input id="subject" placeholder="Mesajınızın konusu" required />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Mesaj
                      </label>
                      <textarea
                        id="message"
                        className="focus:ring-primary min-h-[150px] w-full resize-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                        placeholder="Mesajınızı buraya yazın..."
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Gönder
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>İletişim Bilgileri</CardTitle>
                    <CardDescription>Bize aşağıdaki kanallardan ulaşabilirsiniz</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 mt-1 rounded-lg p-2">
                        <Mail className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-medium">E-posta</h3>
                        <a
                          href="mailto:salihtanriseven25@gmail.com"
                          className="text-muted-foreground hover:text-primary text-sm transition-colors"
                        >
                          salihtanriseven25@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 mt-1 rounded-lg p-2">
                        <MapPin className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-medium">Adres</h3>
                        <p className="text-muted-foreground text-sm">Türkiye</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 mt-1 rounded-lg p-2">
                        <Phone className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-medium">Çalışma Saatleri</h3>
                        <p className="text-muted-foreground text-sm">
                          Pazartesi - Cuma: 09:00 - 18:00
                        </p>
                        <p className="text-muted-foreground text-sm">Hafta Sonu: Kapalı</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sık Sorulan Sorular</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-sm font-medium">
                        Haber göndermek istiyorum, nasıl yapabilirim?
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Haber önerileri için yukarıdaki formu kullanarak bizimle iletişime
                        geçebilirsiniz. Editörlerimiz önerinizi değerlendirecektir.
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 text-sm font-medium">
                        Reklam ve iş birliği için kimle görüşebilirim?
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Reklam ve iş birliği teklifleri için e-posta adresimizden bize
                        ulaşabilirsiniz.
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 text-sm font-medium">
                        Teknik bir sorun bildirmek istiyorum
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Teknik sorunlar için lütfen sorunun detaylarını içeren bir mesaj gönderin.
                        Ekibimiz en kısa sürede çözüm üretecektir.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
