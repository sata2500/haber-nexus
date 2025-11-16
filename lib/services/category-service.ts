import "server-only"
import { prisma } from "@/lib/prisma"
import { cache } from "react"

/**
 * Kategori Servisi
 *
 * Veritabanından kategori verilerini çeker ve önbelleğe alır.
 * React cache() fonksiyonu ile aynı request içinde tekrar eden
 * veritabanı sorgularını önler.
 */

/**
 * Navbar için kategorileri getirir
 * - Sadece aktif kategoriler
 * - Navbar'da gösterilecek kategoriler (order <= 7)
 * - Sıralama: order alanına göre
 */
export const getNavbarCategories = cache(async () => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null, // Sadece ana kategoriler
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        order: true,
      },
      orderBy: {
        order: "asc",
      },
      take: 7, // Navbar'da maksimum 7 kategori göster (tüm kategoriler)
    })

    return categories
  } catch (error) {
    console.error("Navbar kategorileri yüklenirken hata:", error)
    return []
  }
})

/**
 * Footer için kategorileri getirir
 * - Sadece aktif kategoriler
 * - Tüm ana kategoriler
 * - Sıralama: order alanına göre
 */
export const getFooterCategories = cache(async () => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null, // Sadece ana kategoriler
      },
      select: {
        id: true,
        name: true,
        slug: true,
        order: true,
      },
      orderBy: {
        order: "asc",
      },
      take: 10, // Footer'da maksimum 10 kategori göster
    })

    return categories
  } catch (error) {
    console.error("Footer kategorileri yüklenirken hata:", error)
    return []
  }
})

/**
 * Tüm aktif kategorileri getirir (admin panel için)
 */
export const getAllActiveCategories = cache(async () => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        order: true,
        parentId: true,
      },
      orderBy: {
        order: "asc",
      },
    })

    return categories
  } catch (error) {
    console.error("Kategoriler yüklenirken hata:", error)
    return []
  }
})
