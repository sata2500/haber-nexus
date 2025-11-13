import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    kurumsal: [
      { name: 'Hakkımızda', href: '/hakkimizda' },
      { name: 'İletişim', href: '/iletisim' },
      { name: 'Reklam', href: '/reklam' },
      { name: 'Kariyer', href: '/kariyer' },
    ],
    yasal: [
      { name: 'Gizlilik Politikası', href: '/gizlilik' },
      { name: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
      { name: 'Çerez Politikası', href: '/cerez-politikasi' },
      { name: 'Telif Hakları', href: '/telif-haklari' },
    ],
    kategoriler: [
      { name: 'Gündem', href: '/kategori/gundem' },
      { name: 'Dünya', href: '/kategori/dunya' },
      { name: 'Ekonomi', href: '/kategori/ekonomi' },
      { name: 'Teknoloji', href: '/kategori/teknoloji' },
      { name: 'Spor', href: '/kategori/spor' },
      { name: 'Kültür-Sanat', href: '/kategori/kultur-sanat' },
    ],
  }

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HaberNexus
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Türkiye ve dünyadan son dakika haberleri, güncel gelişmeler ve derinlemesine analizler.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kurumsal</h3>
            <ul className="space-y-2">
              {footerLinks.kurumsal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Yasal</h3>
            <ul className="space-y-2">
              {footerLinks.yasal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              {footerLinks.kategoriler.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="max-w-md">
            <h3 className="font-semibold text-foreground mb-2">
              Bültene Abone Olun
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              En önemli haberleri e-posta ile alın.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} HaberNexus. Tüm hakları saklıdır.
            </p>
            <p className="text-sm text-muted-foreground">
              Geliştirici: <span className="font-medium">Salih TANRISEVEN</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
