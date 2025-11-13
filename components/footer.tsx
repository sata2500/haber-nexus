import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Haber Nexus
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Türkiye ve dünyadan güncel haberler, derinlemesine analizler ve uzman görüşleri. 
              Yapay zeka destekli profesyonel haber platformu.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Kategoriler</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/kategori/gundem" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Gündem
                </Link>
              </li>
              <li>
                <Link href="/kategori/teknoloji" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Teknoloji
                </Link>
              </li>
              <li>
                <Link href="/kategori/ekonomi" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Ekonomi
                </Link>
              </li>
              <li>
                <Link href="/kategori/spor" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Spor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Kurumsal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/hakkimizda" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/gizlilik" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            © {currentYear} Haber Nexus. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
