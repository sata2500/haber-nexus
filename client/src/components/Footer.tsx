import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-primary mb-4">
              Haber<span className="text-accent">Nexus</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Yapay zeka destekli otomatik haber platformu. Güncel haberler, analizler ve derinlemesine içerikler.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Ana Sayfa
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Hakkımızda
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/iletisim">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    İletişim
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Yasal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gizlilik">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Gizlilik Politikası
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Kullanım Koşulları
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} HaberNexus. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
