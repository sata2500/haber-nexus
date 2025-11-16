# AI Model Yapılandırması

**Tarih**: 16 Kasım 2025  
**Proje**: HaberNexus

---

## Kullanılan AI Modelleri

### 1. Metin Üretimi: Gemini 2.5 Pro

**Model**: `gemini-2.5-pro`  
**Sağlayıcı**: Google AI (Gemini API)  
**Tier**: **Free Tier** (Ücretsiz)  
**Dosya**: `lib/ai/gemini.ts`

**Özellikler**:
- ✅ Tamamen ücretsiz (Free Tier)
- ✅ Yüksek kalite metin üretimi
- ✅ Coding ve complex reasoning'de mükemmel
- ✅ Türkçe dil desteği
- ✅ 1M token context window

**Rate Limits** (Free Tier):
- 15 RPM (requests per minute)
- ~21,600 requests/day
- Sınırsız token kullanımı

**Kullanım Alanları**:
- Haber içeriği yeniden yazma
- Başlık ve özet oluşturma
- SEO meta verisi oluşturma
- Etiket ve anahtar kelime çıkarma
- İçerik kalite analizi
- İçerik zenginleştirme (araştırma ve uzman görüşleri)

**Maliyet**: **$0** (Ücretsiz)

---

### 2. Görsel Üretimi: Imagen 4

**Model**: `imagen-4.0-generate-001`  
**Sağlayıcı**: Google AI (Gemini API)  
**Tier**: **Free Tier** (Sınırlı) / **Paid Tier**  
**Dosya**: `lib/ai/vision-enhancer.ts`

**Özellikler**:
- ✅ Yüksek kaliteli, fotorealistik görseller
- ✅ 1K-2K çözünürlük
- ✅ Aspect ratio kontrolü
- ✅ Türkçe prompt desteği
- ✅ Hızlı üretim (~10-15 saniye)

**Rate Limits**:
- Free Tier: Günlük/aylık kota (sınırlı)
- Paid Tier: Sınırsız (ücretli)

**Kullanım Alanları**:
- Haber kapak görselleri
- İçerik görselleri
- Sosyal medya görselleri

**Maliyet**:
- Free Tier: **$0** (Sınırlı kullanım)
- Paid Tier: **~$0.039 per image**

**Optimizasyon Stratejisi**:
1. Kaynak görselleri mümkün olduğunca kullan
2. Cache mekanizması ekle
3. Benzer haberlerde görselleri yeniden kullan
4. Sadece yüksek kaliteli haberlerde görsel oluştur

---

## Model Seçimi ve Değişiklikler

### Önceki Yapılandırma

**Metin Üretimi**: `gemini-2.5-flash`  
**Neden Değiştirildi**: Gemini 2.5 Pro daha kaliteli ve yine ücretsiz

### Güncel Yapılandırma (16 Kasım 2025)

**Metin Üretimi**: `gemini-2.5-pro` (Free Tier)  
**Görsel Üretimi**: `imagen-4.0-generate-001` (Free Tier)

**Avantajlar**:
- ✅ Daha yüksek kalite
- ✅ Tamamen ücretsiz (metin için)
- ✅ Mevcut API key ile çalışıyor
- ✅ Ek ücret yok

---

## API Key Yapılandırması

### Environment Variables

```bash
# .env
GOOGLE_API_KEY=your_google_api_key_here
```

**Not**: Gemini Pro aboneliği API kullanımını etkilemiyor. API kullanımı için Free Tier yeterli.

---

## Kullanım Örnekleri

### Metin Üretimi

```typescript
import { generateText } from "@/lib/ai/gemini"

const text = await generateText("Kış aylarında sağlıklı yaşam önerileri hakkında bir makale yaz")
```

### Görsel Üretimi

```typescript
import { generateArticleImage } from "@/lib/ai/vision-enhancer"

const image = await generateArticleImage(
  "Kış Yorgunluğu ve Mutsuzluğa Son!",
  "Kış aylarında artan yorgunluk ve mutsuzluğa karşı uzman önerileri...",
  ["kış", "sağlık", "yaşam"]
)
```

---

## Performans ve Maliyet Analizi

### Günlük Kullanım Tahmini

**Senaryo**: 100 haber/gün

| İşlem | Model | Miktar | Maliyet |
|-------|-------|--------|---------|
| Metin Üretimi | Gemini 2.5 Pro | 100 | **$0** |
| Görsel Üretimi | Imagen 4 | 80 | **$3.12** |
| **Toplam** | | | **$3.12/gün** |

**Aylık Maliyet**: ~$93.60

### Optimizasyon Sonrası

**Kaynak Görseli Kullanımı**: %50  
**Görsel Cache**: %30  
**Yeni Görsel Üretimi**: %20

| İşlem | Model | Miktar | Maliyet |
|-------|-------|--------|---------|
| Metin Üretimi | Gemini 2.5 Pro | 100 | **$0** |
| Görsel Üretimi | Imagen 4 | 20 | **$0.78** |
| **Toplam** | | | **$0.78/gün** |

**Aylık Maliyet**: ~$23.40

---

## Sonuç

**Mevcut Yapılandırma**:
- ✅ Metin üretimi tamamen ücretsiz (Gemini 2.5 Pro Free Tier)
- ✅ Görsel üretimi sınırlı ücretsiz (Imagen 4 Free Tier)
- ✅ Yüksek kalite
- ✅ Ek abonelik gerekmez

**Önerilen Strateji**:
1. Metin üretimi için Gemini 2.5 Pro kullan (ücretsiz)
2. Görsel üretimi için Imagen 4 kullan (free tier dahilinde)
3. Kaynak görselleri önceliklendir
4. Cache mekanizması ekle
5. Maliyet optimizasyonu yap

**Tahmini Maliyet**: $0-$25/ay (optimizasyon ile)
