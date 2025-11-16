# Google Imagen API Araştırma Bulguları

**Tarih**: 16 Kasım 2025
**Amaç**: HaberNexus projesine görsel oluşturma özelliği eklemek için Google Imagen API'yi araştırmak

## Temel Bulgular

### 1. Google Imagen API Kullanılabilir

Google, **Imagen** adlı yüksek kaliteli metin-görsel (text-to-image) oluşturma modelini Gemini API üzerinden sunmaktadır. Bu API, mevcut `GOOGLE_API_KEY` ile kullanılabilir.

**Kaynak**: https://ai.google.dev/gemini-api/docs/imagen

### 2. Mevcut Modeller

- **Imagen 4** (`imagen-4.0-generate-001`): En yeni ve en kaliteli model
- **Imagen 3**: Önceki versiyon

Her iki model de Gemini API üzerinden erişilebilir.

### 3. Kullanım Örneği (Python)

```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_images(
    model='imagen-4.0-generate-001',
    prompt='Robot holding a red skateboard',
    config=types.GenerateImagesConfig(
        number_of_images=4,
    )
)

for generated_image in response.generated_images:
    generated_image.image.show()
```

### 4. Yapılandırma Parametreleri

- `numberOfImages`: 1-4 arası görsel üretme (varsayılan: 4)
- `imageSize`: "1K" veya "2K" (varsayılan: 1K)
- `aspectRatio`: "1:1", "3:4", "4:3", "9:16", "16:9" (varsayılan: 1:1)
- `personGeneration`: İnsan görselleri için izin kontrolü

### 5. Prompt Yazma Rehberi

Imagen için etkili prompt'lar:

- **Konu (Subject)**: Ana nesne, kişi, hayvan veya sahne
- **Bağlam (Context)**: Arka plan ve ortam
- **Stil (Style)**: Genel veya spesifik stil (fotoğraf, çizim, 3D vb.)

**Örnek**: "A park in the spring next to a lake, the sun sets across the lake, golden hour, red wildflowers"

### 6. Fiyatlandırma

#### Free Tier

- **Ücretsiz**: Sınırlı sayıda görsel üretimi
- Google AI Studio erişimi
- İçerik, Google'ın ürünlerini geliştirmek için kullanılabilir

#### Paid Tier

- **Fiyat**: Henüz sayfada açık fiyat bulunamadı, ancak genel bilgi:
  - Görsel çıktısı: **$30 per 1,000,000 tokens**
  - 1024x1024px'e kadar görseller: **1290 token** (yaklaşık **$0.039 per image**)

### 7. Entegrasyon Kolaylığı

Mevcut projede zaten `google.genai` paketi kullanılıyor (Gemini için). Aynı paket ve API key ile Imagen'e erişim mümkün. Ek bir API key veya yetkilendirme gerekmez.

## Sonuç ve Öneriler

✅ **Google Imagen API kullanılabilir ve projeye entegre edilebilir.**

**Avantajlar**:

1. Mevcut `GOOGLE_API_KEY` ile çalışır
2. Zaten kullanılan `google.genai` paketi ile entegrasyon kolay
3. Yüksek kalite görseller (Imagen 4)
4. Türkçe prompt'lar destekleniyor (İngilizce'ye çevrilmesi önerilir)

**Dikkat Edilmesi Gerekenler**:

- Free tier sınırlı kullanım sunar, üretim için Paid tier gerekebilir
- Her görsel yaklaşık $0.039 maliyetli (Paid tier)
- Prompt maksimum 480 token

**Sonraki Adım**: `vision-enhancer.ts` modülüne Imagen API entegrasyonu eklenecek.
