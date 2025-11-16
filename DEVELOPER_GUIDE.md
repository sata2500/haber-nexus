# HaberNexus Geliştirme Kılavuzu

Bu doküman, HaberNexus projesinde hatasız, verimli ve standartlara uygun bir geliştirme süreci sağlamak için oluşturulmuş kapsamlı bir kılavuzdur. Projeye entegre edilen yeni araçlar, standartlar ve iş akışları hakkında detaylı bilgi içerir.

## 1. Felsefemiz: Sıfır Hata ve Yüksek Kalite

Projenin kod kalitesini en üst düzeye çıkarmak, hataları daha oluşmadan engellemek ve geliştirme süreçlerini otomatikleştirmek amacıyla profesyonel bir altyapı kurulmuştur. Bu sistem, her kod değişikliğinin belirli kalite standartlarını karşıladığından emin olur.

## 2. Hızlı Başlangıç ve Kurulum

### 2.1. Projeyi Ayarlama

```bash
# 1. Repoyu klonlayın
git clone https://github.com/sata2500/haber-nexus.git
cd haber-nexus

# 2. Bağımlılıkları yükleyin
pnpm install

# 3. Ortam değişkenlerini ayarlayın
cp .env.example .env
# .env dosyasını kendi bilgilerinizle düzenleyin

# 4. Veritabanı migrasyonlarını çalıştırın
pnpm prisma migrate dev

# 5. Geliştirme sunucusunu başlatın
pnpm dev
```

### 2.2. Önemli: Editör Yapılandırması (VS Code)

Tüm otomasyonun editörünüzde de sorunsuz çalışması için aşağıdaki **VS Code eklentilerini** kurmanız şiddetle tavsiye edilir. Bu eklentiler `.vscode/extensions.json` dosyasında tanımlıdır ve VS Code size bunları kurmayı otomatik olarak önerecektir.

- **ESLint:** `dbaeumer.vscode-eslint` (Hataları anında gösterir)
- **Prettier - Code formatter:** `esbenp.prettier-vscode` (Kod formatını otomatik düzeltir)
- **Tailwind CSS IntelliSense:** `bradlc.vscode-tailwindcss` (Tailwind sınıflarını otomatik tamamlar)
- **Prisma:** `prisma.prisma` (Prisma şeması için syntax highlighting ve formatlama)
- **Error Lens:** `usernamehw.errorlens` (Hataları ve uyarıları satır içinde gösterir)
- **Code Spell Checker:** `streetsidesoftware.code-spell-checker` (Yazım hatalarını denetler)

Projedeki `.vscode/settings.json` dosyası sayesinde, **dosyayı her kaydettiğinizde (`formatOnSave`) kodunuz otomatik olarak formatlanacak ve ESLint hataları düzeltilecektir.**

## 3. Otomatik Kalite Kontrol Sistemi

Projede, kodun repoya kalitesiz veya hatalı bir şekilde gönderilmesini engelleyen çok aşamalı bir otomasyon sistemi bulunmaktadır.

### 3.1. İş Akışı

1.  **Kod Yazarken:** VS Code, ESLint ve Prettier sayesinde sizi anlık olarak uyarır ve hataları düzeltir.
2.  **`git commit` Anında:** `pre-commit` hook'u tetiklenir.
    - **lint-staged:** Sadece `commit`'e eklenen dosyaları (`staged`) formatlar ve lint kurallarına göre denetler.
    - **TypeScript Kontrolü:** Projenin tamamında tip hatası olup olmadığını kontrol eder (`tsc --noEmit`).
    - **Sonuç:** Hata varsa `commit` işlemi engellenir. Hataları düzeltmeden devam edemezsiniz.
3.  **`git push` Anında:** `pre-push` hook'u tetiklenir.
    - **Tam Lint Kontrolü:** Projenin tamamında `pnpm lint` çalıştırılır.
    - **Build Kontrolü:** Projenin canlıya alınabilir durumda olduğundan emin olmak için `pnpm build` çalıştırılır.
    - **Sonuç:** Hata varsa `push` işlemi engellenir. Repoya bozuk kod gönderemezsiniz.
4.  **Pull Request (PR) Açıldığında:** GitHub Actions tetiklenir.
    - **CI (Sürekli Entegrasyon):** Sunucu ortamında tüm testler (lint, type-check, build) yeniden çalıştırılır.
    - **PR Kalite Kontrolü:** PR başlığının standartlara uygunluğu ve kodda `console.log` gibi istenmeyen ifadelerin olup olmadığı kontrol edilir.

### 3.2. Kullanılan Araçlar

- **Husky & lint-staged:** Git hook'larını yönetir ve `commit` öncesi sadece ilgili dosyalarda işlem yapılmasını sağlar.
- **ESLint & Prettier:** Kodun tutarlı, okunabilir ve hatasız olmasını sağlar.
- **TypeScript (Strict Mode):** `tsconfig.json` dosyasındaki en katı kurallar sayesinde tip güvenliği en üst düzeyde tutulur.
- **GitHub Actions:** Repodaki kodun kalitesini sunucu tarafında sürekli olarak denetler.

## 4. Hata Takibi ve Raporlama (Error Handling)

Uygulama genelinde oluşabilecek hataları yakalamak ve yönetmek için merkezi bir sistem kurulmuştur.

### 4.1. `ErrorBoundary` Component'i

Bu React component'i, render sırasında oluşan hataları yakalayarak tüm uygulamanın çökmesini engeller ve kullanıcıya anlamlı bir hata ekranı gösterir. Geliştirme modunda, hatanın teknik detayları da bu ekranda yer alır.

### 4.2. `errorLogger` Utility

`lib/error-logger.ts` dosyasındaki bu araç, hem client hem de server tarafında hataları merkezi bir şekilde loglamak için kullanılır.

- **Otomatik Hata Yakalama:** Tarayıcıdaki yakalanamayan tüm hataları ve Promise reddetmelerini otomatik olarak yakalar.
- **Manuel Loglama:** `try-catch` blokları içinde istediğiniz hatayı ve ek bilgiyi loglayabilirsiniz:

  ```ts
  import { errorLogger } from "@/lib/error-logger"

  try {
    // Hata üretebilecek kod
  } catch (error) {
    errorLogger.error(error, { context: "Kullanıcı profili güncellenirken hata oluştu" })
  }
  ```

### 4.3. Geliştirici Hata Paneli (Dev Error Dashboard)

**Sadece geliştirme modunda**, ekranın sağ altında kırmızı bir hata ikonu belirir. Bu ikona tıklandığında, o ana kadar loglanmış tüm hataları (otomatik veya manuel) gösteren bir panel açılır. Bu panel, hataları anında görmenizi ve ayıklamanızı sağlar.

## 5. Güncellenmiş Scriptler

`package.json` dosyasındaki kullanabileceğiniz bazı önemli scriptler:

```bash
pnpm dev           # Geliştirme sunucusunu başlatır
pnpm build         # Projeyi production için build eder
pnpm start         # Production sunucusunu başlatır
pnpm lint          # Tüm projede ESLint kontrolü yapar
pnpm lint:fix      # ESLint hatalarını otomatik düzeltir
pnpm format        # Tüm projeyi Prettier ile formatlar
pnpm format:check  # Formatlama hatalarını kontrol eder
pnpm type-check    # TypeScript tip kontrolü yapar
pnpm prepare       # Husky'yi kurar (genellikle otomatik çalışır)
```

## 6. Proje Yapısı

Proje, Next.js App Router mimarisine uygun olarak modüler bir yapıda organize edilmiştir. Detaylı yapı için projenin dosya ağacını inceleyebilirsiniz.

Bu kılavuz, projenin kalitesini korumak ve geliştirme sürecini herkes için daha kolay hale getirmek amacıyla hazırlanmıştır. Bu standartlara uymak, uzun vadede daha sürdürülebilir ve hatasız bir proje geliştirmemizi sağlayacaktır.

**Mutlu ve hatasız kodlamalar! 🚀**
