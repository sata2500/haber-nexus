# Geliştirme Planı: Görsel Ekleme ve İçerik Zenginleştirme

**Tarih**: 16 Kasım 2025
**Yazar**: Manus AI

## 1. Genel Bakış

Bu doküman, HaberNexus projesine eklenecek iki ana özelliği detaylandırmaktadır: **otomatik görsel ekleme** ve **içerik zenginleştirme**. Amaç, RSS kaynaklarından otomatik olarak oluşturulan makalelerin kalitesini, değerini ve görsel çekiciliğini artırmaktır.

## 2. Mevcut Durum Analizi

Mevcut iş akışı, `app/api/cron/rss-scan/route.ts` endpoint'i aracılığıyla tetiklenmektedir. Bu endpoint, `scanAllFeedsEnhanced` fonksiyonunu çağırarak aktif tüm RSS feed'lerini tarar. Her bir feed için `enhancedScanRssFeed` çalıştırılır. Bu fonksiyon, yeni RSS öğelerini tespit eder, `processRssItem` ile yapay zeka destekli temel içerik (başlık, özet, içerik, etiketler) oluşturur ve veritabanına kaydeder.

**Tespit Edilen Eksiklikler:**

1.  **Görsel Eksikliği**: Oluşturulan makalelerde `coverImage` alanı `null` olarak ayarlanmakta ve içeriklere herhangi bir görsel eklenmemektedir.
2.  **İçerik Derinliği**: Yapay zeka tarafından yeniden yazılan içerikler, intihalden kaçınmak için yüzeysel kalabilmekte ve kullanıcıya yeterli değeri sunamamaktadır. Kullanıcının verdiği örnekte olduğu gibi, bir haberin "ne olduğu" anlatılırken, "nasıl yapılacağı" veya "neden önemli olduğu" gibi detaylar eksik kalmaktadır.

## 3. Geliştirme Hedefleri

- **Görsel Ekleme**: Makalelere, içeriğin konusuna ve türüne uygun görsellerin otomatik olarak eklenmesi.
- **İçerik Zenginleştirme**: Yüzeysel veya yarım kalmış haberlerin, ek araştırmalar, uzman görüşleri ve detaylı bilgilerle zenginleştirilerek tam ve değerli makalelere dönüştürülmesi.

---

## 4. Detaylı Geliştirme Planı

### Faz 1: Görsel İşleme Modülü (`lib/ai/vision-enhancer.ts`)

Bu modül, bir makale için görsel stratejisini belirleyecek ve uygulayacaktır.

**Adım 1.1: Kaynak Görseli Tespiti ve Değerlendirmesi**

- `enhancedScanRssFeed` fonksiyonunda, `parseRssFeed` ile gelen `item.content` içindeki `<img>` etiketleri tespit edilecek.
- Eğer bir veya daha fazla görsel bulunursa, bu görsellerin URL'leri `vision.ts` içindeki `analyzeImage` fonksiyonuna gönderilerek analiz edilecek.
- Analiz kriterleri: `isRelevant` (içerikle ilgili mi?), `qualityScore` (kalite skoru), `isProductCatalog` (ürün kataloğu gibi özel bir görsel mi?).
- **Karar Mantığı**:
  - Eğer görsel, ürün kataloğu, infografik gibi yeniden oluşturulması zor ve haberin ana odağı olan bir içerikse (`isProductCatalog` = true ve `qualityScore` > 0.6), bu görsel doğrudan kullanılmak üzere seçilir.
  - Diğer durumlarda, kaynak görselin alaka ve kalite skorları, AI tarafından yeni bir görsel oluşturma seçeneğiyle karşılaştırılır.

**Adım 1.2: Yapay Zeka ile Görsel Oluşturma**

- Eğer kaynakta uygun bir görsel yoksa veya kalitesi düşükse, yeni bir görsel oluşturulur.
- **Prompt Oluşturma**: Makalenin başlığı, özeti (`excerpt`) ve anahtar kelimeleri (`keywords`) kullanılarak `generate` aracı için detaylı bir prompt hazırlanır. Örnek: `"Profesyonel haber fotoğrafı, kış depresyonuyla mücadele eden bir kişinin pencereden dışarıyı izlediği an, sinematik ve umut dolu bir atmosfer, 8K, yüksek detay"`.
- Oluşturulan görsel, `coverImage` olarak atanır.

**Adım 1.3: Görselin İçeriğe Entegrasyonu**

- Seçilen veya oluşturulan görsel (URL'si), makalenin `content` alanına HTML `<img>` etiketi olarak eklenecektir. En uygun yerleşim genellikle ilk veya ikinci paragraftan sonrasıdır. Bu, içeriğin okunabilirliğini artırır.

### Faz 2: İçerik Zenginleştirme Modülü (`lib/ai/content-enricher.ts`)

Bu modül, içeriğin derinliğini ve değerini artırmak için çalışacaktır.

**Adım 2.1: İçerik Değerlendirme**

- `processRssItem` tarafından oluşturulan ilk taslak içerik, bu modüle gönderilir.
- Yapay zeka tabanlı bir fonksiyon (`evaluateContentDepth`), içeriği analiz eder. Analiz soruları:
  - Bu makale sadece bir durumu mu özetliyor, yoksa pratik çözümler veya derinlemesine bilgi sunuyor mu?
  - Okuyucunun aklında "Peki şimdi ne yapmalıyım?" veya "Bunun detayları neler?" gibi sorular kalır mı?
  - Makale, başlığında vaat ettiği bilgiyi tam olarak veriyor mu?
- Değerlendirme sonucunda `enrichmentNeeded: true` veya `false` kararı verilir.

**Adım 2.2: Derinlemesine Araştırma**

- Eğer zenginleştirme gerekiyorsa (`enrichmentNeeded: true`), `search` aracı kullanılarak makalenin ana konusu hakkında ek bilgi toplanır.
- Arama sorguları, makalenin başlığı ve anahtar kelimelerinden türetilir. Örnek: `"kış yorgunluğuyla başa çıkma yolları", "seasonal affective disorder expert opinions", "dengeli beslenmenin kış depresyonuna etkileri"`.
- Akademik makaleler, güvenilir haber siteleri ve uzman blogları gibi çeşitli kaynaklardan en az 3-5 farklı kaynak incelenir.

**Adım 2.3: Özgün İçerik Üretme ve Entegrasyon**

- Toplanan bilgiler ışığında, yapay zeka bir "uzman yazar" gibi davranarak yeni ve özgün paragraflar yazar.
- Bu yeni paragraflar, ilk taslak içeriğin sonuna veya mantıksal olarak uygun ara noktalara eklenir. Örneğin, "Kış yorgunluğuna karşı öneriler sunuluyor" cümlesinden sonra, araştırma sonuçlarına dayanan somut öneriler (örneğin, D vitamini takviyesi, ışık terapisi, belirli besinler) listelenir.
- Eklenen bölümlerin, orijinal içerikle akıcı bir bütünlük oluşturması sağlanır.

### Faz 3: İş Akışı Entegrasyonu

**Adım 3.1: `enhancedScanRssFeed` Fonksiyonunu Güncelleme**

- Mevcut `processRssItem` çağrısı, yeni oluşturulan `advancedProcessRssItem` (veya benzeri bir pipeline fonksiyonu) ile değiştirilecektir. Bu yeni fonksiyon, hem görsel işleme hem de içerik zenginleştirme adımlarını sırayla çalıştıracaktır.
- `Article` modeli için veritabanı kaydı, `coverImage` alanı ve zenginleştirilmiş `content` alanı ile güncellenecektir.

| Özellik                   | Sorumlu Modül         | Entegrasyon Noktası   | Açıklama                                                                 |
| :------------------------ | :-------------------- | :-------------------- | :----------------------------------------------------------------------- |
| **Kaynak Görsel Analizi** | `vision-enhancer.ts`  | `enhancedScanRssFeed` | RSS içeriğindeki `<img>` etiketlerini bulur ve analiz eder.              |
| **AI Görsel Üretimi**     | `vision-enhancer.ts`  | `enhancedScanRssFeed` | Uygun görsel yoksa, başlıktan prompt üreterek yeni görsel oluşturur.     |
| **İçerik Değerlendirme**  | `content-enricher.ts` | `enhancedScanRssFeed` | AI ile içeriğin derinliğini ve doyuruculuğunu analiz eder.               |
| **Araştırma ve Yazma**    | `content-enricher.ts` | `enhancedScanRssFeed` | Eksik bilgileri `search` ile araştırır ve yeni, özgün paragraflar yazar. |

## 5. Test ve Doğrulama

- **Birim Testleri**: `vision-enhancer.ts` ve `content-enricher.ts` modülleri için ayrı ayrı test senaryoları oluşturulacak.
- **Entegrasyon Testi**: Manuel olarak bir `cron` görevi tetiklenerek, bir RSS öğesinin baştan sona (tarama, görsel ekleme, zenginleştirme, veritabanına kaydetme) tüm iş akışından geçtiği doğrulanacak.
- **Kalite Kontrol**: Oluşturulan makaleler manuel olarak incelenerek, eklenen görsellerin uygunluğu ve zenginleştirilen içeriğin kalitesi ve doğruluğu kontrol edilecek.

Bu plan doğrultusunda çalışmalara başlıyorum. İlk olarak **Görsel İşleme Modülü**'nü geliştireceğim.
