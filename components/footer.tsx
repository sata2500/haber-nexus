"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Sparkles, ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categories = [
    { name: "Gündem", href: "/kategori/gundem" },
    { name: "Teknoloji", href: "/kategori/teknoloji" },
    { name: "Ekonomi", href: "/kategori/ekonomi" },
    { name: "Spor", href: "/kategori/spor" },
    { name: "Dünya", href: "/kategori/dunya" },
    { name: "Kültür Sanat", href: "/kategori/kultur-sanat" },
  ]

  const corporate = [
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "İletişim", href: "/iletisim" },
    { name: "Gizlilik Politikası", href: "/gizlilik" },
    { name: "Kullanım Koşulları", href: "/kullanim-kosullari" },
    { name: "Çerez Politikası", href: "/cerez-politikasi" },
    { name: "RSS", href: "/rss" },
  ]

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:bg-blue-600" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:bg-sky-500" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:bg-pink-600" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:bg-blue-700" },
  ]

  return (
    <footer className="relative bg-gradient-to-b from-background to-muted/30 border-t border-border/50 mt-auto overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-5">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-r from-primary to-purple-500 p-2 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>
                <span className="text-2xl font-bold gradient-text">Haber Nexus</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Türkiye ve dünyadan güncel haberler, derinlemesine analizler ve uzman görüşleri. 
              Yapay zeka destekli profesyonel haber platformu.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`p-2.5 rounded-lg bg-secondary/50 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-5 uppercase tracking-wider">Kategoriler</h3>
            <ul className="space-y-3">
              {categories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 inline-flex items-center group"
                  >
                    <span className="relative">
                      {item.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-5 uppercase tracking-wider">Kurumsal</h3>
            <ul className="space-y-3">
              {corporate.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 inline-flex items-center group"
                  >
                    <span className="relative">
                      {item.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-5 uppercase tracking-wider">İletişim</h3>
            <ul className="space-y-4">
              <li className="group">
                <a 
                  href="mailto:info@habernexus.com" 
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span className="mt-1.5">info@habernexus.com</span>
                </a>
              </li>
              <li className="group">
                <a 
                  href="tel:+905551234567" 
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <span className="mt-1.5">+90 555 123 45 67</span>
                </a>
              </li>
              <li className="group">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="mt-1.5">İstanbul, Türkiye</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} <span className="font-semibold text-foreground">Haber Nexus</span>. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Geliştirici:</span>
              <span className="font-semibold text-primary">Salih TANRISEVEN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-500"
          aria-label="Yukarı çık"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  )
}
