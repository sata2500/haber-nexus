import { getNavbarCategories } from "@/lib/services/category-service"
import { HeaderClient } from "./header-client"

/**
 * Server-side Header Wrapper
 * 
 * Kategorileri veritabanından çeker ve client component'e iletir.
 * Bu sayede kategoriler dinamik olarak güncellenir.
 * 
 * Avantajlar:
 * - Admin panelden kategori eklendiğinde otomatik güncellenir
 * - Kategori sıralaması değiştiğinde otomatik yansır
 * - Kategori aktif/pasif durumu kontrol edilir
 * - React cache ile performans optimizasyonu
 */

export async function Header() {
  // Veritabanından kategorileri çek
  const categories = await getNavbarCategories()

  return <HeaderClient categories={categories} />
}
