import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProfileContent } from "./profile-content"

/**
 * Profil Sayfası (Server Component)
 * 
 * Header ve Footer Server Component olarak çalışır.
 * ProfileContent Client Component olarak kullanıcı etkileşimlerini yönetir.
 */

export default async function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ProfileContent />
      <Footer />
    </div>
  )
}
