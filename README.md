# Haber Nexus - Profesyonel Haber Platformu

Modern ve AI destekli haber platformu. Türkiye ve dünyadan güncel haberler, trend analizleri ve kişiselleştirilmiş içerik deneyimi.

## 🚀 Özellikler

- ✅ **Modern UI/UX**: Shadcn/ui ile profesyonel tasarım
- ✅ **Dark/Light Mode**: next-themes ile sorunsuz tema değişimi
- ✅ **Responsive Design**: Tüm cihazlarda mükemmel görünüm
- ✅ **AI Destekli**: Haber özetleme ve trend analizi
- 🔄 **Headless CMS**: Sanity ile içerik yönetimi (yakında)
- 🔄 **Kullanıcı Sistemi**: NextAuth.js ile güvenli kimlik doğrulama (yakında)
- 🔄 **Veritabanı**: Prisma + PostgreSQL (yakında)

## 🛠️ Teknoloji Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Theme Management**: next-themes
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend (Planlanan)
- **CMS**: Sanity
- **Database**: Prisma + Vercel Postgres
- **Auth**: NextAuth.js v5
- **AI**: OpenAI GPT-4

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
pnpm install

# Development sunucusunu başlat
pnpm dev

# Production build
pnpm build

# Production sunucusunu başlat
pnpm start
```

## 🌐 Geliştirme Sunucusu

Development sunucusu çalıştırıldığında:
- Local: http://localhost:3000
- Network: http://[your-ip]:3000

## 📁 Proje Yapısı

```
haber-nexus/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout (ThemeProvider)
│   ├── page.tsx           # Ana sayfa
│   └── globals.css        # Global styles & CSS variables
├── components/
│   ├── ui/                # Shadcn/ui bileşenleri
│   ├── layout/            # Layout bileşenleri
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── theme-provider.tsx # Theme context provider
│   └── mode-toggle.tsx    # Dark/Light mode toggle
├── lib/
│   └── utils.ts           # Utility fonksiyonlar
└── public/                # Static assets
```

## 🎨 Tema Sistemi

Proje, next-themes kullanarak üç tema modunu destekler:
- **Light Mode**: Aydınlık tema
- **Dark Mode**: Koyu tema
- **System**: Sistem tercihine göre otomatik

### Tema Değişkenleri

Tüm renkler CSS variables ile yönetilir ve `globals.css` dosyasında tanımlanmıştır:
- OKLCH renk formatı kullanılır (daha iyi renk kontrolü)
- Light ve dark mode için ayrı değişkenler
- Tailwind CSS v4 ile tam entegrasyon

## 🔧 Yapılandırma

### components.json
Shadcn/ui yapılandırma dosyası:
- Style: new-york
- Base color: neutral
- CSS variables: enabled
- Icon library: lucide

### Tailwind CSS
- Version 4.1.17
- Dark mode: class-based
- Custom theme variables

## 📝 Geliştirme Notları

### Next-themes Entegrasyonu
- `suppressHydrationWarning` prop'u `<html>` tag'inde kullanılmalı
- ThemeProvider, root layout'ta children'ı wrap etmeli
- `disableTransitionOnChange` ile tema değişiminde flash önlenir

### Shadcn/ui Bileşenleri
Kurulu bileşenler:
- Button
- Card
- Input
- Dropdown Menu
- Separator
- Badge

Yeni bileşen eklemek için:
```bash
pnpm dlx shadcn@latest add [component-name]
```

## 🚧 Sonraki Adımlar

1. **Sanity CMS Entegrasyonu**
   - Sanity Studio kurulumu
   - Schema tanımlamaları
   - GROQ sorguları

2. **Dinamik Haber Sayfaları**
   - Haber detay sayfası
   - Kategori sayfaları
   - Arama fonksiyonalitesi

3. **AI Özellikleri**
   - OpenAI API entegrasyonu
   - Haber özetleme
   - Trend analizi

4. **Kullanıcı Sistemi**
   - NextAuth.js kurulumu
   - Login/Register
   - Kullanıcı profili

5. **Deployment**
   - Vercel deployment
   - Domain bağlama (habernexus.com)
   - Analytics

## 👨‍💻 Geliştirici

**Salih TANRISEVEN**
- Email: salihtanriseven25@gmail.com
- GitHub: [@sata2500](https://github.com/sata2500)

## 📄 Lisans

Bu proje özel bir projedir. Tüm hakları saklıdır.

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Lucide Icons](https://lucide.dev/)

---

**Son Güncelleme**: 14 Kasım 2025
**Versiyon**: 0.1.0 (Alpha)
