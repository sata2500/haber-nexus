# HaberNexus - Detaylı Geliştirme Yol Haritası

**Proje Sahibi:** Salih TANRISEVEN
**Hazırlayan:** Manus AI
**Tarih:** 14 Kasım 2025

## 1. Giriş

Bu rapor, **HaberNexus** projesinin mevcut durumunu özetlemek ve projenin tamamlanması için gereken tüm adımları içeren detaylı bir geliştirme yol haritası sunmak amacıyla hazırlanmıştır. Bu yol haritası, geliştirme sürecini yönetilebilir fazlara ayırarak projenin düzenli, hatasız ve profesyonel bir şekilde ilerlemesini sağlamayı hedefler.

## 2. Mevcut Durum ve Tamamlanan İşler (Faz 1)

Projenin ilk fazı başarıyla tamamlanmıştır. Bu aşamada projenin temel altyapısı kurulmuş ve ana sayfa tasarımı gerçekleştirilmiştir.

### 2.1. Tamamlanan Başlıklar

- **Proje Kurulumu:**
  - Next.js 16 (Turbopack) ile proje oluşturuldu.
  - Gerekli bağımlılıklar (`next-themes`, `lucide-react`) kuruldu.
  - Git reposu klonlandı ve proje yapısı oluşturuldu.

- **Tema Sistemi (Dark/Light/System):**
  - `next-themes` kütüphanesi ile tam fonksiyonel tema sistemi entegre edildi.
  - CSS Custom Properties (Variables) kullanılarak merkezi ve tutarlı bir renk yönetimi sağlandı.
  - Tüm component'ler (Header, Footer, Kartlar vb.) hardcoded renklerden arındırılarak CSS variables kullanacak şekilde yeniden düzenlendi.
  - Açık, Koyu ve Sistem seçenekleri sunan profesyonel bir dropdown menü oluşturuldu.

- **Temel Arayüz (UI) Component'leri:**
  - **Header:** Sticky navbar, kategori menüsü, arama butonu, tema değiştirme menüsü ve mobil uyumlu menü.
  - **Footer:** Kurumsal linkler, sosyal medya ikonları, bülten abonelik formu ve telif hakkı bilgileri.
  - **Ana Sayfa (`page.tsx`):** Temel layout ve component yerleşimi.
  - **Hero Section:** Öne çıkan büyük haber kartı ve trend haberler listesi.
  - **News Grid:** Kategori bazlı haber listeleme kartları.

### 2.2. Teknik Başarılar

- **Kod Kalitesi:** Tüm component'ler, yeniden kullanılabilir ve bakımı kolay bir yapıda oluşturulmuştur.
- **Build Durumu:** Proje, `npm run build` komutu ile hatasız bir şekilde derlenmektedir (production-ready).
- **Versiyon Kontrolü:** Tüm değişiklikler atomik commit'ler halinde GitHub reposuna gönderilmiştir.

---

## 3. Geliştirme Yol Haritası

Proje, aşağıda belirtilen 8 ana faza ayrılmıştır. Her faz, belirli bir işlevsellik setini tamamlamaya odaklanmıştır.

| Faz | Başlık | Tahmini Süre | Ana Hedefler |
|:---:|:---|:---:|:---|
| **2** | **Payload CMS ve Veritabanı Entegrasyonu** | 2 Gün | İçerik yönetim altyapısını kurmak ve dinamik veri akışını sağlamak. |
| **3** | **Dinamik Sayfa ve İçerik Görüntüleme** | 3 Gün | Haber detay, kategori ve yazar sayfalarını oluşturmak. |
| **4** | **Kullanıcı Kimlik Doğrulama (NextAuth)** | 2 Gün | Google ile giriş/kayıt sistemini ve kullanıcı profillerini entegre etmek. |
| **5** | **Yorum ve Tartışma Sistemi** | 2 Gün | Kullanıcıların haberlere yorum yapabilmesini ve etkileşimde bulunabilmesini sağlamak. |
| **6** | **Gelişmiş Arama Fonksiyonu** | 1 Gün | Kullanıcıların site içinde arama yapabilmesini sağlamak. |
| **7** | **Yapay Zeka Destekli Dashboard (Admin Paneli)** | 4 Gün | Site yönetimi, içerik otomasyonu ve muhabir yönetimi için admin paneli oluşturmak. |
| **8** | **Optimizasyon, Test ve Dağıtım (Deployment)** | 2 Gün | Performans, SEO ve güvenlik optimizasyonları yaparak projeyi canlıya almak. |

### Faz 2: Payload CMS ve Veritabanı Entegrasyonu

Bu faz, projenin bel kemiği olan içerik yönetim sistemini (CMS) kurmaya odaklanır.

1.  **Payload CMS Kurulumu:**
    -   `payload` ve ilgili bağımlılıkların projeye eklenmesi.
    -   Payload konfigürasyon dosyasının (`payload.config.ts`) oluşturulması.

2.  **Veritabanı Kurulumu (PostgreSQL):**
    -   Lokal veya bulut tabanlı bir PostgreSQL veritabanı oluşturulması.
    -   `.env` dosyasına veritabanı bağlantı bilgilerinin eklenmesi.

3.  **Veri Modelleri (Collections) Oluşturma:**
    -   **Articles (Haberler):** `title`, `slug`, `content` (rich text), `featuredImage`, `category`, `tags`, `author`, `status` (draft, published) gibi alanlar.
    -   **Users (Kullanıcılar/Muhabirler):** `name`, `email`, `role` (admin, editor, user), `avatar`.
    -   **Categories (Kategoriler):** `name`, `slug`.
    -   **Tags (Etiketler):** `name`, `slug`.
    -   **Media (Görseller):** Payload'un dahili medya yönetimi.

4.  **Admin Paneli Erişimi:**
    -   `/admin` yolu üzerinden Payload admin paneline erişimin test edilmesi.
    -   İlk admin kullanıcısının oluşturulması.

### Faz 3: Dinamik Sayfa ve İçerik Görüntüleme

Bu fazda, CMS'ten gelen veriler kullanılarak dinamik sayfalar oluşturulacaktır.

1.  **Haber Detay Sayfası (`/haber/[slug]`):**
    -   `generateStaticParams` ile tüm haberler için statik sayfalar oluşturulması (performans için).
    -   Haber başlığı, içeriği, görseli, yazarı ve diğer meta verilerin gösterilmesi.

2.  **Kategori Sayfası (`/kategori/[slug]`):**
    -   Belirli bir kategoriye ait tüm haberlerin listelenmesi.
    -   Sayfalama (Pagination) eklenmesi.

3.  **Ana Sayfa Verilerini Dinamik Hale Getirme:**
    -   Hero Section ve News Grid component'lerinin Payload API'sinden veri çekmesi.
    -   `revalidate` seçenekleri ile verilerin periyodik olarak güncellenmesinin sağlanması.

### Faz 4: Kullanıcı Kimlik Doğrulama (NextAuth)

Bu faz, kullanıcıların siteye giriş yapmasını ve kişisel bir deneyim yaşamasını sağlar.

1.  **NextAuth Kurulumu:**
    -   `next-auth` kütüphanesinin kurulumu ve yapılandırılması.
    -   Google Provider'ın ayarlanması ve API anahtarlarının `.env` dosyasına eklenmesi.

2.  **Giriş/Çıkış İşlevselliği:**
    -   Header'daki kullanıcı menüsüne 
giriş/çıkış butonlarının eklenmesi.
    -   Kullanıcı oturum bilgilerinin (session) yönetilmesi.

3.  **Kullanıcı Profili:**
    -   Giriş yapmış kullanıcıların kendi profil bilgilerini görebileceği basit bir sayfa.

### Faz 5: Yorum ve Tartışma Sistemi

1.  **Yorum Veri Modeli:**
    -   Payload CMS'e `Comments` adında yeni bir collection eklenmesi: `content`, `author` (ilişki), `article` (ilişki), `createdAt`.

2.  **Yorum Arayüzü:**
    -   Haber detay sayfasının altına yorum yapma formu ve mevcut yorumları listeleme bölümü eklenmesi.
    -   Sadece giriş yapmış kullanıcıların yorum yapabilmesi.

3.  **API Endpoint'leri:**
    -   Yorum göndermek ve yorumları çekmek için Next.js API Route'ları oluşturulması.

### Faz 6: Gelişmiş Arama Fonksiyonu

1.  **Arama Arayüzü:**
    -   Header'daki arama butonuna tıklandığında açılan bir arama çubuğu veya ayrı bir arama sayfası (`/arama`).

2.  **Arama API'si:**
    -   Kullanıcının girdiği anahtar kelimelere göre haber başlıklarında ve içeriklerinde arama yapan bir API endpoint'i oluşturulması.
    -   Payload CMS'in dahili arama ve filtreleme özelliklerinden faydalanılması.

### Faz 7: Yapay Zeka Destekli Dashboard (Admin Paneli)

Bu faz, projenin en kritik ve özelleştirilmiş bölümüdür.

1.  **Özelleştirilmiş Admin Arayüzü:**
    -   Payload'un admin arayüzünü React component'leri ile genişleterek özel butonlar ve sayfalar eklenmesi.

2.  **RSS Beslemesi ile Otomatik Haber Başlığı Oluşturma:**
    -   Admin paneline bir 
arayüz eklenerek RSS feed URL'lerinin girilmesi.
    -   Girilen RSS feed'lerinden periyodik olarak başlıkların çekilmesi.

3.  **Gemini API Entegrasyonu:**
    -   Çekilen haber başlıkları için Gemini API'sini kullanarak:
        -   **Özet Çıkarma:** Haber içeriğinin özetlenmesi.
        -   **İçerik Üretme:** Başlık ve özetten yola çıkarak tam bir haber metni oluşturulması.
        -   **Uzman Görüşü Ekleme:** Konuyla ilgili kurgusal uzman görüşleri veya analizler eklenmesi.

4.  **Otomasyon İş Akışı:**
    -   Bu sürecin tek bir butona basarak (veya otomatik olarak) çalışmasını sağlayan bir iş akışı oluşturulması.
    -   Oluşturulan içeriğin `Articles` collection'ına taslak (draft) olarak kaydedilmesi.

5.  **Muhabir Yönetimi:**
    -   Adminlerin, `editor` rolündeki kullanıcıları (muhabirleri) yönetebileceği bir arayüz.
    -   Muhabirlerin sadece kendi yazılarını düzenleyebilmesi, adminlerin ise tüm yazıları düzenleyebilmesi (Payload Access Control).

### Faz 8: Optimizasyon, Test ve Dağıtım (Deployment)

1.  **Performans Optimizasyonu:**
    -   Görsellerin `next/image` ile optimize edilmesi.
    -   Statik sayfa üretiminin (SSG) ve artımlı statik rejenerasyonun (ISR) doğru yapılandırılması.
    -   Lighthouse ve Web Vitals skorlarının kontrol edilmesi.

2.  **SEO (Arama Motoru Optimizasyonu):**
    -   Tüm sayfalar için dinamik `title`, `description` ve `keywords` oluşturulması.
    -   `sitemap.xml` ve `robots.txt` dosyalarının oluşturulması.

3.  **Son Testler:**
    -   Tüm işlevlerin farklı cihazlarda ve tarayıcılarda test edilmesi.
    -   Güvenlik kontrolleri.

4.  **Vercel'e Dağıtım:**
    -   Projenin GitHub reposu üzerinden Vercel'e bağlanması.
    -   Environment variable'ların Vercel'e eklenmesi.
    -   Projenin canlıya alınması.

---

## 4. Teknik Notlar ve En İyi Uygulamalar (Best Practices)

- **Commit Mesajları:** Her commit, yapılan değişikliği net bir şekilde açıklamalıdır (`feat:`, `fix:`, `docs:` gibi prefixler kullanılmalıdır).
- **Build Testleri:** Her fazın sonunda `npm run build` komutu çalıştırılarak projenin hatasız derlendiğinden emin olunmalıdır.
- **CSS Değişkenleri:** Renk, font boyutu gibi stil değerleri için mutlaka `globals.css` dosyasındaki CSS değişkenleri kullanılmalıdır. Hardcoded değerlerden kaçınılmalıdır.
- **Component Yapısı:** Component'ler mümkün olduğunca küçük ve tek bir amaca hizmet edecek şekilde tasarlanmalıdır.
- **Environment Variables:** Tüm API anahtarları, veritabanı bilgileri ve diğer hassas veriler `.env.local` dosyasında saklanmalı ve asla kod içine yazılmamalıdır.

## 5. Sonuç

Bu yol haritası, HaberNexus projesinin başarılı bir şekilde tamamlanması için gereken tüm adımları ve teknik gereksinimleri detaylandırmaktadır. Bu planı takip ederek, projenin her aşamasını kontrollü bir şekilde ilerletebilir ve hedeflenen tüm özelliklere sahip, profesyonel bir web uygulaması oluşturabilirsiniz.

Bu raporu yeni bir sohbette kullanarak geliştirme sürecine devam edebilirsiniz. Başarılar dilerim!
