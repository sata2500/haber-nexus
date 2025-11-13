"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const categories = [
    { name: "Gündem", href: "/kategori/gundem" },
    { name: "Teknoloji", href: "/kategori/teknoloji" },
    { name: "Ekonomi", href: "/kategori/ekonomi" },
    { name: "Spor", href: "/kategori/spor" },
  ]

  const corporate = [
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "İletişim", href: "/iletisim" },
    { name: "Gizlilik Politikası", href: "/gizlilik" },
    { name: "Kullanım Koşulları", href: "/kullanim-kosullari" },
  ]

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ]

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold gradient-text">Haber Nexus</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Türkiye ve dünyadan güncel haberler, derinlemesine analizler ve uzman görüşleri. 
              Yapay zeka destekli profesyonel haber platformu.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-110"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Kategoriler</h3>
            <ul className="space-y-3">
              {categories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Kurumsal</h3>
            <ul className="space-y-3">
              {corporate.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <a href="mailto:info@habernexus.com" className="hover:text-primary transition-colors">
                  info@habernexus.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <a href="tel:+905551234567" className="hover:text-primary transition-colors">
                  +90 555 123 45 67
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Haber Nexus. Tüm hakları saklıdır.
            </p>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              Geliştirici: <span className="text-primary font-semibold">Salih TANRISEVEN</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
