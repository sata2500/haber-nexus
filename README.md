# Haber Nexus - AI Destekli Haber ve Bilgi Platformu

![Haber Nexus](https://i.imgur.com/example.png) <!-- Gerçek bir banner resmi ile değiştirilecek -->

**Haber Nexus**, modern web teknolojileri ve yapay zeka gücüyle geliştirilen, yeni nesil bir haber ve bilgi platformudur. Amacımız, kullanıcılara sadece haber sunmak değil, aynı zamanda bilgiye erişimlerini kolaylaştırmak, etkileşimde bulunmalarını sağlamak ve topluluğun bir parçası olmalarına olanak tanımaktır.

Bu proje, **Salih TANRISEVEN** tarafından başlatılmış olup, **Manus AI** iş birliğiyle geliştirilmektedir.

---

## ✨ Proje Vizyonu

- **AI Destekli İçerik**: Google Gemini API kullanarak RSS kaynaklarından otomatik haber tarama, analiz etme ve özgün makaleler üretme.
- **Geniş Kapsam**: Türkiye ve dünyadan güncel haberler, blog yazıları ve derinlemesine araştırma içerikleri.
- **Gelişmiş Yönetim**: Rol tabanlı (RBAC) kullanıcı sistemi ile yazarların, editörlerin ve adminlerin platformu kolayca yönetmesi.
- **Sosyal Etkileşim**: Yorum, beğeni, takip ve bildirim özellikleri ile kullanıcıların etkileşimde bulunabileceği bir topluluk oluşturma.
- **Açık Kaynak Felsefesi**: Şeffaf bir geliştirme süreci ve topluluk katkılarına açık bir yapı.

---

## 🚀 Teknolojiler

| Kategori | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) 16 (App Router) | SSR, SSG ve ISR ile yüksek performans ve SEO. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) v4 | Utility-first CSS ile hızlı ve tutarlı tasarım. |
| **UI Bileşenleri** | [Shadcn/ui](https://ui.shadcn.com/) | Erişilebilir ve özelleştirilebilir UI bileşenleri. |
| **Veritabanı** | [PostgreSQL](https://www.postgresql.org/) (Neon) | Ölçeklenebilir ve güvenilir ilişkisel veritabanı. |
| **ORM** | [Prisma](https://www.prisma.io/) | Tip güvenli veritabanı işlemleri ve migration yönetimi. |
| **Kimlik Doğrulama** | [NextAuth.js](https://next-auth.js.org/) (Auth.js) | E-posta/şifre ve sosyal (Google) giriş desteği. |
| **AI Provider** | [Google Gemini API](https://ai.google.dev/) | Metin üretimi, analiz ve web araştırması. |
| **Form Yönetimi** | [React Hook Form](https://react-hook-form.com/) | Performanslı ve esnek form yönetimi. |
| **Schema Doğrulama** | [Zod](https://zod.dev/) | Tip güvenli schema doğrulama. |
| **Deployment** | [Vercel](https://vercel.com/) | Next.js için optimize edilmiş hosting ve CI/CD. |

---

## 📦 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Repository'yi Klonlayın**:

    ```bash
    git clone https://github.com/sata2500/haber-nexus.git
    cd haber-nexus
    ```

2.  **Bağımlılıkları Yükleyin**:

    ```bash
    pnpm install
    ```

3.  **Environment Değişkenlerini Ayarlayın**:

    `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun ve kendi bilgilerinizi girin.

    ```bash
    cp .env.example .env
    ```

    Gerekli alanlar:
    - `DATABASE_URL`: PostgreSQL bağlantı adresiniz.
    - `AUTH_SECRET`: `openssl rand -base64 32` komutu ile oluşturabilirsiniz.
    - `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET`: Google Cloud Console'dan alabilirsiniz.
    - `GOOGLE_API_KEY`: Google AI Studio'dan alabilirsiniz.

4.  **Veritabanı Migration'ını Çalıştırın**:

    ```bash
    pnpm prisma migrate dev
    ```

5.  **Geliştirme Sunucusunu Başlatın**:

    ```bash
    pnpm dev
    ```

    Uygulama artık [http://localhost:3000](http://localhost:3000) adresinde çalışıyor olacak.

---

## 🛣️ Geliştirme Yol Haritası (Roadmap)

- **📍 Faz 1: Temel Kurulum (Tamamlandı)**
  - Proje iskeleti, Next.js, TypeScript, Tailwind CSS kurulumu.
  - Prisma ve veritabanı bağlantısı.
  - NextAuth.js ile kimlik doğrulama altyapısı.

- **📍 Faz 2: İçerik Yönetim Sistemi (Tamamlandı)**
  - Kategori ve Makale yönetimi için tam CRUD API'leri.
  - Gelişmiş admin paneli sayfaları (Kategori, Makale, Kullanıcı yönetimi).
  - Dinamik makale, kategori ve ana sayfalar.

- **⏳ Faz 3: AI Entegrasyonu ve RSS (Sıradaki)**
  - Google Gemini API entegrasyonu.
  - RSS feed yönetimi ve otomatik tarama.
  - AI destekli içerik üretim (özet, tag, yeniden yazma).
  - Arka plan görevleri için job queue sistemi (BullMQ).

- **⏳ Faz 4: Sosyal Etkileşim ve Topluluk**
  - Gelişmiş yorum sistemi (cevaplama, moderasyon).
  - Beğeni, kaydetme ve paylaşma özellikleri.
  - Yazar takip sistemi ve profil sayfaları.
  - Bildirim sistemi.

- **⏳ Faz 5: İleri Seviye Özellikler ve Optimizasyon**
  - Gelişmiş arama (full-text search, filtreleme).
  - SEO ve performans optimizasyonları (Sitemap, ISR, Image Optimization).
  - Newsletter ve e-posta bildirimleri.
  - Çoklu dil desteği (i18n).

---

## 🤝 Katkıda Bulunma

Bu proje açık kaynaklıdır ve topluluk katkılarına açıktır. Detaylı bilgi için lütfen `CONTRIBUTING.md` dosyasını inceleyin.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.
