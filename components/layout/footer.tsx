import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { getFooterCategories } from "@/lib/services/category-service"

/**
 * Footer Bileşeni
 * 
 * Server Component olarak çalışır ve kategorileri veritabanından dinamik olarak çeker.
 * 
 * Özellikler:
 * - Kategoriler otomatik güncellenir (admin panelden ekleme/silme)
 * - Kurumsal sayfalar statik olarak tanımlanır
 * - Responsive tasarım
 * - Logo ve açıklama
 * - Copyright bilgisi
 * 
 * Kategori Yönetimi:
 * - Admin panelden kategori eklendiğinde footer'da otomatik görünür
 * - Kategori sıralaması order alanına göre yapılır
 * - Sadece aktif kategoriler gösterilir
 * - Maksimum 10 kategori gösterilir
 */

/**
 * Kurumsal sayfalar
 * Bu sayfalar statik olarak tanımlanır ve değişmez
 */
const kurumsal = [
  { name: "Hakkımızda", href: "/about" },
  { name: "İletişim", href: "/contact" },
  { name: "Gizlilik Politikası", href: "/privacy" },
  { name: "Kullanım Koşulları", href: "/terms" },
]

export async function Footer() {
  // Veritabanından kategorileri dinamik olarak çek
  const kategoriler = await getFooterCategories()

  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Haber Nexus
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Türkiye ve dünyadan son dakika haberleri, güncel gelişmeler ve 
              AI destekli haber analizi ile her zaman bilgili kalın.
            </p>
          </div>

          {/* Kategoriler - Dinamik */}
          <div>
            <h3 className="font-semibold mb-4">Kategoriler</h3>
            {kategoriler.length > 0 ? (
              <ul className="space-y-2">
                {kategoriler.map((kategori) => (
                  <li key={kategori.id}>
                    <Link
                      href={`/categories/${kategori.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {kategori.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Henüz kategori eklenmemiş
              </p>
            )}
          </div>

          {/* Kurumsal - Statik */}
          <div>
            <h3 className="font-semibold mb-4">Kurumsal</h3>
            <ul className="space-y-2">
              {kurumsal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 Haber Nexus. Tüm hakları saklıdır.</p>
          <p className="mt-2 md:mt-0">
            Geliştirici: <span className="font-medium">Salih TANRISEVEN</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
