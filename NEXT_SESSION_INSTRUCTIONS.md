# Yeni Sohbet İçin Başlangıç Talimatları

**Proje:** HaberNexus
**Geliştirici:** Salih TANRISEVEN
**Hazırlayan:** Manus AI

## 📋 Yeni Sohbette Kullanılacak Prompt

```
Merhaba! HaberNexus adlı haber sitesi projem üzerinde çalışmaya devam edeceğim.

Proje Bilgileri:
- GitHub Repo: https://github.com/sata2500/haber-nexus.git
- Teknoloji: Next.js 16 (Turbopack), Tailwind CSS, next-themes
- Mevcut Durum: Faz 1 tamamlandı (Ana sayfa, tema sistemi, temel layout)

Lütfen önce repoyu klonla ve DEVELOPMENT_ROADMAP.md dosyasını oku. 
Sonra Faz 2'ye (Payload CMS ve Veritabanı Entegrasyonu) başlayalım.

Önemli: 
- Her adımın sonunda npm run build ile test yap
- Hardcoded renkler kullanma, sadece CSS variables kullan
- Her işi tamamladıktan sonra git commit ve push yap
```

## 🔑 Önemli Dosyalar

1. **DEVELOPMENT_ROADMAP.md** - Tüm geliştirme planı
2. **DEVELOPMENT_PLAN.md** - Orijinal 12 fazlık detaylı plan
3. **CSS_VARIABLES_FIX.md** - Tema sistemi dokümantasyonu
4. **.env** - Environment variables (GitHub'da yok, lokal)

## 📂 Proje Yapısı

```
haber-nexus/
├── app/
│   ├── layout.tsx          # Ana layout (ThemeProvider)
│   ├── page.tsx            # Ana sayfa
│   └── globals.css         # CSS variables tanımları
├── components/
│   ├── layout/
│   │   ├── header.tsx      # Navbar
│   │   └── footer.tsx      # Footer
│   ├── home/
│   │   ├── hero-section.tsx
│   │   └── news-grid.tsx
│   └── theme-toggle.tsx    # Tema değiştirme menüsü
└── package.json
```

## ✅ Tamamlanan İşler (Faz 1)

- ✅ Next.js 16 proje kurulumu
- ✅ next-themes entegrasyonu
- ✅ CSS Custom Properties (Variables) sistemi
- ✅ Header (Navbar) component'i
- ✅ Footer component'i
- ✅ Hero Section component'i
- ✅ News Grid component'i
- ✅ Theme Toggle dropdown menüsü
- ✅ Tüm component'ler CSS variables kullanıyor
- ✅ Build testi başarılı
- ✅ GitHub'a push edildi

## 🚀 Sıradaki Adım (Faz 2)

**Payload CMS ve Veritabanı Entegrasyonu**

Yapılacaklar:
1. Payload CMS kurulumu
2. PostgreSQL veritabanı bağlantısı
3. Veri modelleri (Articles, Users, Categories, Tags, Media)
4. Admin panel erişimi

## ⚠️ Dikkat Edilmesi Gerekenler

1. **CSS Variables:** Asla hardcoded renkler kullanma
   - ❌ `bg-white dark:bg-zinc-950`
   - ✅ `bg-background`

2. **Build Test:** Her değişiklikten sonra
   ```bash
   npm run build
   ```

3. **Git Workflow:**
   ```bash
   git add -A
   git commit -m "feat: açıklama"
   git push origin main
   ```

4. **Environment Variables:** `.env` dosyasını kontrol et

## 📞 İletişim

Proje Sahibi: Salih TANRISEVEN
GitHub: https://github.com/sata2500/haber-nexus
