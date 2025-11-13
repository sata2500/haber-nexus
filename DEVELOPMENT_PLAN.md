# HaberNexus - Detaylı Geliştirme Planı

**Proje:** HaberNexus - Gelişmiş Haber ve Sosyal Platform
**Geliştirici:** Salih TANRISEVEN
**Tarih:** 13 Kasım 2025

## Mevcut Durum Analizi

Proje Next.js 16.0.3, React 19.2.0 ve Tailwind CSS v4 ile başlatılmıştır. Temel yapı hazır durumda.

**Kurulu Bağımlılıklar:**
- Next.js 16.0.3
- React 19.2.0
- Tailwind CSS v4
- TypeScript 5
- next-auth (kurulmuş)

**Veritabanı:** Neon PostgreSQL (bağlantı bilgileri mevcut)

---

## Geliştirme Fazları

### FAZ 1: Temel Altyapı ve Konfigürasyon (MEVCUT FAZ)
**Süre:** 1-2 gün
**Durum:** Başlangıç

#### 1.1. Environment ve Konfigürasyon
- [x] .env dosyasını oluşturma ve tüm değişkenleri ekleme
- [ ] next-themes kurulumu ve konfigürasyonu
- [ ] Temel klasör yapısını oluşturma
- [ ] Git konfigürasyonu

#### 1.2. Temel Layout ve Tema Sistemi
- [ ] Root layout'u düzenleme
- [ ] Theme Provider entegrasyonu
- [ ] Navbar component'i (Header)
- [ ] Footer component'i
- [ ] Dark/Light mode toggle

#### 1.3. Ana Sayfa (Homepage) - MVP
- [ ] Hero Section (Öne çıkan haberler slider)
- [ ] Kategori bazlı haber listeleri
- [ ] Trending haberler bölümü
- [ ] Son eklenen haberler
- [ ] Responsive tasarım

**Çıktı:** Temel layout ve tema sistemi ile çalışan ana sayfa

---

### FAZ 2: Payload CMS Entegrasyonu
**Süre:** 3-4 gün

#### 2.1. Payload CMS Kurulumu
- [ ] Payload CMS 3.0 kurulumu
- [ ] PostgreSQL bağlantısı
- [ ] Temel konfigürasyon

#### 2.2. Veri Modelleri (Collections)
- [ ] Users Collection (auth: true)
- [ ] Articles Collection
- [ ] Categories Collection
- [ ] Tags Collection
- [ ] Comments Collection
- [ ] Media Collection

#### 2.3. Admin Panel Özelleştirme
- [ ] Admin panel erişimi
- [ ] Rol tabanlı yetkilendirme
- [ ] Dashboard özelleştirme

**Çıktı:** Çalışan CMS ve admin paneli

---

### FAZ 3: Authentication Sistemi
**Süre:** 2-3 gün

#### 3.1. NextAuth.js Konfigürasyonu
- [ ] NextAuth.js setup
- [ ] Google OAuth provider
- [ ] Database adapter (Payload ile entegrasyon)
- [ ] Session yönetimi

#### 3.2. Auth UI
- [ ] Login sayfası
- [ ] Kullanıcı menüsü
- [ ] Profil sayfası
- [ ] Korumalı route'lar

**Çıktı:** Google ile giriş yapabilen kullanıcı sistemi

---

### FAZ 4: İçerik Sayfaları
**Süre:** 3-4 gün

#### 4.1. Haber Detay Sayfası
- [ ] Dinamik route ([slug])
- [ ] Haber içeriği görüntüleme
- [ ] Yazar bilgileri
- [ ] İlgili haberler
- [ ] Social sharing

#### 4.2. Kategori Sayfası
- [ ] Kategori listesi
- [ ] Filtreleme
- [ ] Pagination

#### 4.3. Arama Sayfası
- [ ] Full-text search
- [ ] Filtreleme seçenekleri

**Çıktı:** Tüm içerik sayfaları çalışır durumda

---

### FAZ 5: Yorum Sistemi
**Süre:** 2-3 gün

#### 5.1. Yorum Altyapısı
- [ ] Comment component
- [ ] Hiyerarşik yorumlar (nested)
- [ ] Like/Dislike

#### 5.2. Moderasyon
- [ ] Admin moderasyon paneli
- [ ] Spam filtreleme

**Çıktı:** Çalışan yorum sistemi

---

### FAZ 6: Muhabir Paneli
**Süre:** 2-3 gün

#### 6.1. Muhabir Dashboard
- [ ] İçerik oluşturma formu
- [ ] İçerik listeleme
- [ ] İçerik düzenleme
- [ ] Draft/Publish yönetimi

**Çıktı:** Muhabirler için içerik yönetim paneli

---

### FAZ 7: AI Entegrasyonu (Temel)
**Süre:** 3-4 gün

#### 7.1. Gemini API Entegrasyonu
- [ ] API client setup
- [ ] Temel içerik üretim fonksiyonu
- [ ] Error handling

#### 7.2. RSS Feed İşleme
- [ ] rss-parser kurulumu
- [ ] RSS kaynakları yönetimi
- [ ] Feed okuma fonksiyonu

#### 7.3. Manuel AI Araçları
- [ ] "İçeriği İyileştir" butonu
- [ ] SEO optimizasyon önerileri

**Çıktı:** Temel AI destekli araçlar

---

### FAZ 8: AI Otomasyonu (Jobs Queue)
**Süre:** 3-4 gün

#### 8.1. Payload Jobs Queue
- [ ] Cron job setup
- [ ] RSS monitoring task
- [ ] Content generation task

#### 8.2. Otomasyon İş Akışı
- [ ] RSS → AI → Draft pipeline
- [ ] Bildirim sistemi

**Çıktı:** Tam otonom içerik üretim sistemi

---

### FAZ 9: Tartışma Forumu
**Süre:** 2-3 gün

#### 9.1. Forum Altyapısı
- [ ] Discussions Collection
- [ ] Forum ana sayfası
- [ ] Konu oluşturma
- [ ] Yanıtlama sistemi

**Çıktı:** Çalışan tartışma forumu

---

### FAZ 10: Analytics ve SEO
**Süre:** 2 gün

#### 10.1. SEO Optimizasyonu
- [ ] Meta tags
- [ ] Sitemap
- [ ] robots.txt
- [ ] Open Graph

#### 10.2. Analytics
- [ ] Sayfa görüntüleme tracking
- [ ] Dashboard analytics

**Çıktı:** SEO ve analytics entegrasyonu

---

### FAZ 11: Test ve Optimizasyon
**Süre:** 3-4 gün

#### 11.1. Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

#### 11.2. Performans Optimizasyonu
- [ ] Image optimization
- [ ] Caching stratejileri
- [ ] Database query optimization

#### 11.3. Güvenlik
- [ ] Security audit
- [ ] Rate limiting
- [ ] Input validation

**Çıktı:** Test edilmiş ve optimize edilmiş uygulama

---

### FAZ 12: Deployment ve Launch
**Süre:** 1-2 gün

#### 12.1. Production Hazırlığı
- [ ] Environment variables (production)
- [ ] Database migration
- [ ] SSL/DNS setup

#### 12.2. Vercel Deployment
- [ ] Vercel project setup
- [ ] GitHub entegrasyonu
- [ ] Otomatik deployment

**Çıktı:** Canlı uygulama

---

## Toplam Tahmini Süre

**Minimum:** 24-30 gün (5-6 hafta)
**Maksimum:** 35-45 gün (7-9 hafta)

---

## Öncelikli Görevler (Şu An)

### Bugün Yapılacaklar:

1. ✅ Proje analizi tamamlandı
2. ⏳ Environment setup
3. ⏳ next-themes kurulumu
4. ⏳ Temel layout (Header, Footer)
5. ⏳ Ana sayfa tasarımı
6. ⏳ Build test

---

## Notlar

- Her fazın sonunda `npm run build` çalıştırılacak
- Hata varsa düzeltilecek
- Git commit'leri düzenli yapılacak
- Her önemli özellik ayrı branch'te geliştirilecek
- Vercel'de preview deployment'lar kontrol edilecek
