import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NewProfileContent } from "./new-profile-content"

/**
 * Profesyonel Profil Sayfası (Server Component)
 *
 * Okuyucu rolündeki kullanıcılar için:
 * - Beğenilen içerikler
 * - Kaydedilen içerikler
 * - Okuma geçmişi
 * - Yorumlar
 * - Detaylı analizler ve istatistikler
 * - Takip edilen yazarlar
 * - Hesap ayarları
 */

export default async function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <NewProfileContent />
      <Footer />
    </div>
  )
}
