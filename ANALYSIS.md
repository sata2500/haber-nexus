# HaberNexus Proje Analizi

## Proje Yapısı
- **Framework**: Next.js 16.0.3 (App Router)
- **Veritabanı**: PostgreSQL (Neon) + Prisma ORM
- **Kimlik Doğrulama**: NextAuth.js
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **Dil**: TypeScript

## Navbar Bağlantı Sorunu

### Mevcut Durum
Header bileşeninde (`components/layout/header.tsx`) şu kategoriler tanımlı:
```typescript
const categories = [
  { name: "Gündem", href: "/gundem" },
  { name: "Dünya", href: "/dunya" },
  { name: "Ekonomi", href: "/ekonomi" },
  { name: "Spor", href: "/spor" },
  { name: "Teknoloji", href: "/teknoloji" },
]
```

### Sorun
Bu bağlantılar `/gundem`, `/dunya` gibi URL'lere yönlendiriyor ancak:
1. Uygulama `/categories/[slug]` yapısını kullanıyor
2. Doğrudan `/gundem` gibi route'lar tanımlanmamış
3. Kategoriler veritabanında slug'lar ile saklanıyor

### Çözüm Yaklaşımları

#### Yaklaşım 1: Header'daki href'leri düzelt (Önerilen)
- Header'daki kategorileri `/categories/gundem` formatına çevir
- Veritabanındaki slug'lar ile eşleştir

#### Yaklaşım 2: Dinamik kategori yükleme
- Kategorileri veritabanından çek ve header'da göster
- Server Component kullanarak kategorileri al

#### Yaklaşım 3: Route alias oluştur
- Her kategori için `/gundem` -> `/categories/gundem` yönlendirmesi yap
- Middleware veya rewrites kullan

## Seçilen Çözüm
**Yaklaşım 1** - Header'daki href'leri `/categories/[slug]` formatına çevireceğiz.

Bunun yanında kategorilerin veritabanında mevcut olduğundan emin olmak için seed verisi kontrol edilecek.
