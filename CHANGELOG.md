# Haber Nexus - Değişiklik Günlüğü

Bu proje [Semantic Versioning](https://semver.org/spec/v2.0.0.html) standardını takip eder.

## [1.1.0] - 2025-11-14

### ✨ Eklendi

- **Geliştirici Dostu Dokümantasyon**: Proje dokümantasyonu tamamen yeniden düzenlendi.
  - `README.md` güncellendi ve basitleştirildi.
  - `CONTRIBUTING.md` dosyası ile katkıda bulunma rehberi eklendi.
  - `LICENSE` dosyası (MIT) eklendi.
  - `CHANGELOG.md` dosyası ile değişiklik takibi başlatıldı.
  - `CODE_OF_CONDUCT.md` ile davranış kuralları belirlendi.
- **`.env.example` Dosyası**: Geliştiricilerin ortam değişkenlerini kolayca ayarlayabilmesi için örnek dosya eklendi.

### 🐛 Düzeltildi

- **Tüm ESLint Uyarıları**: Projedeki 16 ESLint uyarısının tamamı giderildi.
  - `react-hooks/exhaustive-deps`: 8 adet `useEffect` bağımlılık uyarısı, `useCallback` kullanılarak düzeltildi.
  - `@typescript-eslint/no-unused-vars`: 2 adet kullanılmayan değişken uyarısı düzeltildi.
- **Next.js Image Optimizasyonu**: Projedeki tüm `<img>` etiketleri, performans ve optimizasyon için Next.js `<Image>` bileşenine dönüştürüldü (8 adet).
- **Parsing Hataları**: `<Image>` bileşenine geçiş sırasında oluşan 3 adet JSX parsing hatası giderildi.

### 🧹 İyileştirildi

- **Kod Kalitesi**: Kullanılmayan değişkenler ve hatalı `try-catch` blokları temizlendi.
- **Proje Yapısı**: Gereksiz `.bak` dosyası projeden kaldırıldı.
- **Yapılandırma**: `next.config.ts` dosyasına, dış kaynaklardan görsel yüklenebilmesi için `images.remotePatterns` eklendi.

## [1.0.0] - 2025-11-13

### ✨ Eklendi

- **Temel Proje Kurulumu**: Next.js, TypeScript, Prisma, NextAuth ve Tailwind CSS ile proje başlatıldı.
- **Veritabanı Şeması**: Kapsamlı veri modeli (`User`, `Article`, `Category` vb.) oluşturuldu.
- **Kimlik Doğrulama**: E-posta/şifre ve Google ile kullanıcı girişi ve kaydı eklendi.
- **İçerik Yönetim Sistemi (CMS)**: Kategori ve makaleler için tam CRUD (Oluştur, Oku, Güncelle, Sil) işlemleri.
- **Admin Paneli**: Kategori, makale ve kullanıcı yönetimi için arayüzler oluşturuldu.
- **Dinamik Sayfalar**: Ana sayfa, makale detay ve kategori sayfaları veritabanından gelen verilerle dinamik hale getirildi.
