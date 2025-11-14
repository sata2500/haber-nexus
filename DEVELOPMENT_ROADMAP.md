# Haber Nexus - Geliştirme Yol Haritası

**Tarih**: 14 Kasım 2025  
**Geliştirici**: Manus AI  
**Proje Sahibi**: Salih TANRISEVEN

---

## Mevcut Durum (v1.1.0)

Proje şu anda temel içerik yönetim sistemi (CMS) ile birlikte çalışır durumda. Tamamlanan özellikler:

✅ **Temel Altyapı**
- Next.js 16 App Router
- TypeScript, Prisma ORM
- NextAuth.js kimlik doğrulama
- Tailwind CSS + Shadcn/ui

✅ **İçerik Yönetimi**
- Kategori CRUD işlemleri
- Makale CRUD işlemleri
- Tag sistemi
- Dinamik sayfalar (Ana sayfa, Makale detay, Kategori)

✅ **Kullanıcı Yönetimi**
- E-posta/şifre ve Google OAuth girişi
- Rol tabanlı yetkilendirme (USER, AUTHOR, EDITOR, ADMIN, SUPER_ADMIN)
- Profil yönetimi

✅ **Admin Paneli**
- Kategori yönetimi
- Makale yönetimi
- Kullanıcı yönetimi

---

## Sıradaki Geliştirmeler

### Faz 2: Google Gemini API Entegrasyonu

**Hedef**: AI destekli içerik üretimi için temel altyapıyı kurmak.

**Görevler**:
1. Google Gemini SDK kurulumu ve yapılandırması
2. `/lib/ai/gemini.ts` - AI helper fonksiyonları
   - `generateText()` - Metin üretimi
   - `summarizeContent()` - Özet oluşturma
   - `generateTags()` - Tag önerileri
   - `analyzeQuality()` - İçerik kalite analizi
3. Error handling ve retry mekanizması
4. Rate limiting ve quota yönetimi
5. Test fonksiyonları

**Tahmini Süre**: 2-3 saat

---

### Faz 3: RSS Feed Yönetim Sistemi

**Hedef**: RSS kaynaklarından otomatik haber tarama altyapısını kurmak.

**Görevler**:

#### 3.1 RSS Feed CRUD API'leri
- `POST /api/rss-feeds` - Yeni RSS feed ekleme
- `GET /api/rss-feeds` - RSS feed listesi
- `GET /api/rss-feeds/[id]` - RSS feed detayı
- `PATCH /api/rss-feeds/[id]` - RSS feed güncelleme
- `DELETE /api/rss-feeds/[id]` - RSS feed silme
- `POST /api/rss-feeds/[id]/scan` - Manuel tarama tetikleme

#### 3.2 RSS Feed Admin Sayfaları
- `/admin/rss-feeds` - RSS feed listesi ve yönetim
- `/admin/rss-feeds/new` - Yeni RSS feed ekleme
- `/admin/rss-feeds/[id]/edit` - RSS feed düzenleme
- `/admin/rss-feeds/[id]/logs` - Tarama logları

#### 3.3 RSS Parser Entegrasyonu
- `rss-parser` paketi kurulumu
- `/lib/rss/parser.ts` - RSS parsing fonksiyonları
- Feed validation ve error handling

#### 3.4 Otomatik Tarama Sistemi
- Cron job veya scheduled task altyapısı
- `/lib/rss/scanner.ts` - Otomatik tarama mantığı
- Scan log kayıt sistemi

**Tahmini Süre**: 4-5 saat

---

### Faz 4: AI Destekli İçerik Üretim Pipeline'ı

**Hedef**: RSS'den gelen haberleri AI ile analiz edip otomatik makale üretmek.

**Görevler**:

#### 4.1 İçerik Analiz Sistemi
- RSS item'larını AI ile analiz etme
- Kalite skorlama (0-1 arası)
- Trend tespiti
- Kategori önerisi

#### 4.2 Otomatik İçerik Üretimi
- RSS içeriğinden özet oluşturma
- SEO dostu başlık üretme
- Meta description oluşturma
- Otomatik tag oluşturma ve bağlama
- Slug oluşturma

#### 4.3 AI Task Queue Sistemi
- `/lib/ai/queue.ts` - Task queue yönetimi
- Arka plan işleme (background jobs)
- Priority-based processing
- Retry mekanizması

#### 4.4 Admin Kontrol Paneli
- AI görev durumları görüntüleme
- Manuel onay/reddetme
- Toplu işlemler
- İstatistikler ve raporlar

**Tahmini Süre**: 5-6 saat

---

### Faz 5: Gelişmiş Yorum Sistemi ve Sosyal Etkileşim

**Hedef**: Kullanıcıların içerikle etkileşime geçmesini sağlamak.

**Görevler**:

#### 5.1 Yorum Sistemi
- `POST /api/comments` - Yorum ekleme
- `GET /api/comments` - Yorumları listeleme
- `PATCH /api/comments/[id]` - Yorum düzenleme
- `DELETE /api/comments/[id]` - Yorum silme
- İç içe yorumlar (reply) desteği
- Makale sayfasında yorum bölümü
- Yorum moderasyonu (admin)

#### 5.2 Beğeni ve Kaydetme
- `POST /api/likes` - Beğeni ekleme/kaldırma
- `POST /api/bookmarks` - Kaydetme ekleme/kaldırma
- Makale sayfasında beğeni/kaydet butonları
- Profil sayfasında kaydedilen makaleler

#### 5.3 Takip Sistemi
- `POST /api/follows` - Yazar takip etme/bırakma
- Yazar profil sayfası
- Takip edilen yazarların makaleleri
- Takipçi/Takip edilen listeleri

#### 5.4 Bildirim Sistemi
- `GET /api/notifications` - Bildirimleri listeleme
- `PATCH /api/notifications/[id]/read` - Bildirimi okundu işaretleme
- Header'da bildirim dropdown
- Bildirim tipleri: yorum, beğeni, takip, mention

**Tahmini Süre**: 6-7 saat

---

### Faz 6: Arama Sistemi ve Kullanıcı Profil İyileştirmeleri

**Hedef**: Kullanıcı deneyimini iyileştirmek.

**Görevler**:

#### 6.1 Gelişmiş Arama
- Full-text search (Prisma veya Meilisearch)
- `/api/search` - Gelişmiş arama endpoint
- Filtreleme (kategori, tarih, yazar, tag)
- Arama önerileri (autocomplete)
- Arama geçmişi

#### 6.2 Kullanıcı Profili
- Detaylı profil sayfası
- Kullanıcı istatistikleri
- Yazar başvurusu sistemi
- Sosyal medya bağlantıları
- Avatar yükleme

#### 6.3 Yazar Profil Sayfası
- Yazarın tüm makaleleri
- Yazar bio ve uzmanlık alanları
- Sosyal medya linkleri
- İstatistikler (toplam görüntülenme, beğeni)

**Tahmini Süre**: 4-5 saat

---

### Faz 7: SEO Optimizasyonu ve Performans İyileştirmeleri

**Hedef**: Arama motoru sıralamasını ve performansı iyileştirmek.

**Görevler**:

#### 7.1 SEO
- `sitemap.xml` oluşturma
- `robots.txt` yapılandırması
- Open Graph ve Twitter Card metadata
- Structured data (JSON-LD)
- Canonical URL'ler

#### 7.2 Performans
- Image optimization (zaten yapıldı ✅)
- Lazy loading
- ISR (Incremental Static Regeneration)
- Code splitting ve dynamic imports
- Bundle size optimization

#### 7.3 Analytics
- Görüntülenme sayısı takibi
- Popüler makaleler
- Trend analizi
- Admin dashboard istatistikleri

**Tahmini Süre**: 3-4 saat

---

### Faz 8: Test, Deployment ve Final Kontroller

**Hedef**: Projeyi production'a hazır hale getirmek.

**Görevler**:

#### 8.1 Testing
- Unit testler (Jest)
- Integration testler
- E2E testler (Playwright)
- API endpoint testleri

#### 8.2 Deployment
- Vercel deployment yapılandırması
- Environment variables kontrolü
- Database migration stratejisi
- CI/CD pipeline (GitHub Actions)

#### 8.3 Final Kontroller
- Security audit
- Performance audit (Lighthouse)
- Accessibility audit
- Cross-browser testing
- Mobile responsiveness

**Tahmini Süre**: 4-5 saat

---

## Toplam Tahmini Süre

- **Faz 2**: 2-3 saat
- **Faz 3**: 4-5 saat
- **Faz 4**: 5-6 saat
- **Faz 5**: 6-7 saat
- **Faz 6**: 4-5 saat
- **Faz 7**: 3-4 saat
- **Faz 8**: 4-5 saat

**Toplam**: 28-35 saat (yaklaşık 4-5 gün yoğun çalışma)

---

## Öncelikler

1. **Yüksek Öncelik**: Faz 2, 3, 4 (AI ve RSS sistemi - projenin ana değer önerisi)
2. **Orta Öncelik**: Faz 5, 6 (Sosyal özellikler ve kullanıcı deneyimi)
3. **Düşük Öncelik**: Faz 7, 8 (Optimizasyon ve test - son aşama)

---

## Sonraki Adım

Şimdi **Faz 2: Google Gemini API Entegrasyonu** ile başlıyoruz.
