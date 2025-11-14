# Haber Nexus - AI Destekli Haber ve Bilgi Platformu

![Haber Nexus](https://i.imgur.com/example.png) <!-- Replace with a real banner image -->

**Haber Nexus**, modern web teknolojileri ve yapay zeka gücüyle geliştirilen, yeni nesil bir haber ve bilgi platformudur. Amacımız, kullanıcılara sadece haber sunmak değil, aynı zamanda bilgiye erişimlerini kolaylaştırmak, etkileşimde bulunmalarını sağlamak ve topluluğun bir parçası olmalarına olanak tanımaktır.

Bu proje, **Salih TANRISEVEN** tarafından başlatılmış olup, **Manus AI** iş birliğiyle geliştirilmektedir.

---

## ✨ Proje Vizyonu ve Hedefler

- **AI Destekli İçerik Üretimi**: Google Gemini API kullanarak RSS kaynaklarından otomatik olarak haber tarama, analiz etme ve özgün makaleler üretme.
- **Geniş Kapsam**: Hem Türkiye'den hem de dünyadan güncel haberler, blog yazıları ve derinlemesine araştırma içerikleri.
- **Kullanıcı ve Yazar Yönetimi**: Gelişmiş rol tabanlı (RBAC) kullanıcı sistemi ile yazarların, editörlerin ve adminlerin platformu yönetmesi.
- **Sosyal Etkileşim**: Gelişmiş yorum sistemi, beğeni, takip ve bildirim özellikleri ile kullanıcıların etkileşimde bulunabileceği bir topluluk oluşturma.
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
| **Queue Sistemi** | [BullMQ](https://bullmq.io/) (Planlandı) | Asenkron iş kuyruğu yönetimi (Redis tabanlı). |
| **Deployment** | [Vercel](https://vercel.com/) | Next.js için optimize edilmiş hosting ve CI/CD. |

---

## 📋 Proje Durumu: Faz 2 Tamamlandı ✅

Bu fazda, projenin temelini oluşturan veritabanı ve kimlik doğrulama sistemi başarıyla kurulmuştur.

### Tamamlanan İşler

- **Veritabanı Kurulumu**:
  - ✅ Neon PostgreSQL veritabanı bağlantısı sağlandı.
  - ✅ `prisma/schema.prisma` dosyası oluşturuldu ve 20'den fazla tablo ile kapsamlı veri modeli tasarlandı.
  - ✅ `prisma migrate` ile veritabanı sıfırlandı ve yeni şema başarıyla uygulandı.

- **Kimlik Doğrulama Sistemi**:
  - ✅ NextAuth.js (Auth.js) entegrasyonu tamamlandı.
  - ✅ E-posta/şifre ve Google ile sosyal giriş desteği eklendi.
  - ✅ Kayıt (`/api/auth/register`) ve giriş (`/api/auth/[...nextauth]`) API endpoint'leri oluşturuldu.
  - ✅ `bcryptjs` ile şifreler güvenli bir şekilde hash'lendi.

- **Kullanıcı Arayüzü**:
  - ✅ Kayıt (`/auth/signup`) ve giriş (`/auth/signin`) sayfaları oluşturuldu.
  - ✅ Form yönetimi için `react-hook-form` ve `zod` entegre edildi.

- **Admin Paneli ve Yetkilendirme**:
  - ✅ Temel bir admin dashboard (`/admin`) sayfası oluşturuldu.
  - ✅ `middleware.ts` ile rol tabanlı yetkilendirme (Admin, Editor, Author) altyapısı kuruldu.

- **Hata Kontrolü ve Test**:
  - ✅ `tsc --noEmit` ile tüm TypeScript hataları giderildi.
  - ✅ Kayıt ve giriş sayfaları manuel olarak test edildi.

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

3.  **Environment Variables Dosyasını Oluşturun**:

    `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun ve kendi bilgilerinizi girin.

    ```bash
    cp .env.example .env
    ```

    Gerekli alanlar:
    - `DATABASE_URL`: PostgreSQL bağlantı adresiniz.
    - `NEXTAUTH_SECRET`: `openssl rand -base64 32` komutu ile oluşturabilirsiniz.
    - `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET`: Google Cloud Console'dan alabilirsiniz.
    - `GEMINI_API_KEY`: Google AI Studio'dan alabilirsiniz.

4.  **Veritabanı Migration'ını Çalıştırın**:

    ```bash
    npx prisma migrate dev
    ```

5.  **Development Sunucusunu Başlatın**:

    ```bash
    pnpm dev
    ```

    Uygulama artık [http://localhost:3000](http://localhost:3000) adresinde çalışıyor olacak.

---

## 🛣️ Geliştirme Yol Haritası (Roadmap)

- **📍 Faz 2: Veritabanı ve Kimlik Doğrulama (Tamamlandı)**
- **⏳ Faz 3: AI Destekli İçerik Sistemi (Sıradaki)**
  - Google Gemini API entegrasyonu.
  - RSS feed yönetimi ve otomatik tarama.
  - AI analiz motoru (kalite/trend skorlama).
  - İçerik üretim pipeline'ı.
  - Admin panelinden AI görevlerini yönetme.
- **⏳ Faz 4: Dinamik Sayfalar ve Blog Sistemi**
- **⏳ Faz 5: Sosyal Etkileşim ve Topluluk Özellikleri**
- **⏳ Faz 6: Optimizasyon, Test ve Deployment**
- **⏳ Faz 7: İleri Seviye Özellikler**

---

## 🤝 Katkıda Bulunma

Bu proje açık kaynaklıdır ve topluluk katkılarına açıktır. Katkıda bulunmak isterseniz, lütfen aşağıdaki adımları izleyin:

1.  Projeyi fork'layın.
2.  Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`).
3.  Değişikliklerinizi commit'leyin (`git commit -m 'feat: Yeni özellik eklendi'`).
4.  Branch'inizi push'layın (`git push origin feature/yeni-ozellik`).
5.  Bir Pull Request oluşturun.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.
