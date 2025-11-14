import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "İletişim | Haber Nexus",
  description: "Haber Nexus ile iletişime geçin. Sorularınız, önerileriniz ve geri bildirimleriniz için bize ulaşın.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-16 border-b">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                İletişim
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz. 
                Size en kısa sürede dönüş yapacağız.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="container py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
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
                      <Input
                        id="name"
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        E-posta
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Konu
                      </label>
                      <Input
                        id="subject"
                        placeholder="Mesajınızın konusu"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Mesaj
                      </label>
                      <textarea
                        id="message"
                        className="w-full min-h-[150px] px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
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
                    <CardDescription>
                      Bize aşağıdaki kanallardan ulaşabilirsiniz
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 mt-1">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">E-posta</h3>
                        <a 
                          href="mailto:salihtanriseven25@gmail.com"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          salihtanriseven25@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 mt-1">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Adres</h3>
                        <p className="text-sm text-muted-foreground">
                          Türkiye
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 mt-1">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Çalışma Saatleri</h3>
                        <p className="text-sm text-muted-foreground">
                          Pazartesi - Cuma: 09:00 - 18:00
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Hafta Sonu: Kapalı
                        </p>
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
                      <h3 className="font-medium mb-2 text-sm">
                        Haber göndermek istiyorum, nasıl yapabilirim?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Haber önerileri için yukarıdaki formu kullanarak bizimle iletişime geçebilirsiniz. 
                        Editörlerimiz önerinizi değerlendirecektir.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 text-sm">
                        Reklam ve iş birliği için kimle görüşebilirim?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Reklam ve iş birliği teklifleri için e-posta adresimizden bize ulaşabilirsiniz.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 text-sm">
                        Teknik bir sorun bildirmek istiyorum
                      </h3>
                      <p className="text-sm text-muted-foreground">
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
