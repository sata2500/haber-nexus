/**
 * Detailed test script for enhanced RSS processor
 * Tests vision enhancement and content enrichment features
 * Saves enriched content to file for inspection
 */

import "dotenv/config"
import { enhancedProcessRssItem } from "../lib/ai/enhanced-processor"
import type { RssItem } from "../lib/rss/parser"
import { writeFileSync } from "fs"

async function testEnhancedProcessorDetailed() {
  console.log("=".repeat(80))
  console.log("Detailed Testing: Enhanced RSS Processor")
  console.log("=".repeat(80))

  // Create a test RSS item (simulating the example from user)
  const testItem: RssItem = {
    title: "Kış Aylarında Artan Yorgunluk ve Mutsuzluk Hissine Karşı Öneriler Sunuluyor",
    link: "https://example.com/kis-yorgunlugu",
    content: `
      <p>ANKARA – Kış mevsiminin gelişiyle birlikte birçok bireyde gözlemlenen artan yorgunluk ve mutsuzluk hissi, günlük yaşam kalitesini etkileyen önemli bir sorun olarak öne çıkıyor. Bu duruma karşı koymak ve kış aylarını daha keyifli bir şekilde geçirmek amacıyla çeşitli yaşam tarzı önerileri hazırlandığı bildirildi.</p>
      
      <p>Yapılan açıklamalarda, kış döneminde hava koşullarının ve gün ışığı süresinin azalmasının insan psikolojisi ve fizyolojisi üzerinde etkili olabileceği belirtiliyor. Bu etkilerin sonucunda ortaya çıkabilen enerji düşüklüğü, motivasyon kaybı ve genel bir karamsarlık haliyle mücadele etmek için atılabilecek adımlar üzerinde duruluyor.</p>
      
      <p>Sunulan önerilerin, bireylerin ruh hallerini iyileştirmeye ve enerji seviyelerini yükseltmeye yardımcı olmayı hedeflediği ifade ediliyor. Bu tavsiyelerin, düzenli fiziksel aktivite, dengeli beslenme, yeterli uyku ve sosyal etkileşim gibi temel yaşam alanlarında yapılacak küçük değişiklikleri kapsadığı belirtilmekte. Kış mevsiminin getirdiği olumsuzluklara karşı proaktif bir yaklaşım sergilenmesinin, bireylerin bu dönemi daha sağlıklı ve mutlu geçirmelerine katkı sağlayacağı vurgulanıyor.</p>
      
      <p>Hazırlanan bu kılavuz niteliğindeki bilgilerin, kış aylarında kendini daha iyi hissetmek ve mevsimsel etkilere karşı direncini artırmak isteyen herkes için bir yol haritası sunması bekleniyor.</p>
    `,
    contentSnippet:
      "Kış mevsiminin gelişiyle birlikte birçok bireyde gözlemlenen artan yorgunluk ve mutsuzluk hissi, günlük yaşam kalitesini etkileyen önemli bir sorun olarak öne çıkıyor.",
    guid: "test-kis-yorgunlugu-001",
    pubDate: new Date().toISOString(),
  }

  console.log("\n📰 Test RSS Item:")
  console.log(`   Title: ${testItem.title}`)
  console.log(`   Link: ${testItem.link}`)

  try {
    const result = await enhancedProcessRssItem(testItem, {
      rewriteStyle: "news",
      minQualityScore: 0.5,
      generateNewContent: true,
      enableVisionEnhancement: true,
      enableContentEnrichment: true,
    })

    console.log("\n✅ Processing completed!")

    // Save original content
    writeFileSync(
      "test-output-original.md",
      `# ${result.originalTitle}\n\n${result.contentEnrichment.originalContent}`
    )

    // Save enriched content
    writeFileSync(
      "test-output-enriched.md",
      `# ${result.title}\n\n**Özet:** ${result.excerpt}\n\n**Etiketler:** ${result.tags.join(", ")}\n\n**Anahtar Kelimeler:** ${result.keywords.join(", ")}\n\n---\n\n${result.enrichedContent}`
    )

    // Save comparison report
    const report = `# İçerik Zenginleştirme Test Raporu

## Temel Bilgiler

**Orijinal Başlık:** ${result.originalTitle}
**Yeni Başlık:** ${result.title}
**Slug:** ${result.slug}

## Kalite Metrikleri

- **Kalite Skoru:** ${result.qualityScore.toFixed(2)}
- **Spam Kontrolü:** ${result.isSpam ? "❌ Spam" : "✅ Temiz"}

## Etiketler ve Anahtar Kelimeler

**Etiketler:** ${result.tags.join(", ")}

**Anahtar Kelimeler:** ${result.keywords.join(", ")}

## Görsel İyileştirme

- **Strateji:** ${result.visionEnhancement.strategy}
- **Açıklama:** ${result.visionEnhancement.reasoning}
- **Kapak Görseli:** ${result.coverImage || "Yok"}
- **İçerik Görselleri:** ${result.visionEnhancement.contentImages.length}

## İçerik Zenginleştirme

- **Zenginleştirildi mi?** ${result.contentEnrichment.enriched ? "✅ Evet" : "❌ Hayır"}
- **Açıklama:** ${result.contentEnrichment.reasoning}
- **Araştırma Kaynakları:** ${result.researchSources.length}

${result.researchSources.length > 0 ? "### Kaynaklar\n\n" + result.researchSources.map((s, i) => `${i + 1}. ${s}`).join("\n") : ""}

## İçerik Karşılaştırması

| Metrik | Orijinal | Zenginleştirilmiş | Değişim |
|--------|----------|-------------------|---------|
| Karakter Sayısı | ${result.contentEnrichment.originalContent.length} | ${result.enrichedContent.length} | +${result.enrichedContent.length - result.contentEnrichment.originalContent.length} (${((result.enrichedContent.length / result.contentEnrichment.originalContent.length - 1) * 100).toFixed(1)}%) |
| Paragraf Sayısı | ${result.contentEnrichment.originalContent.split("\n\n").length} | ${result.enrichedContent.split("\n\n").length} | +${result.enrichedContent.split("\n\n").length - result.contentEnrichment.originalContent.split("\n\n").length} |

## SEO

- **Meta Başlık:** ${result.metaTitle}
- **Meta Açıklama:** ${result.metaDescription}

---

**Test Tarihi:** ${new Date().toLocaleString("tr-TR")}
`

    writeFileSync("test-output-report.md", report)

    console.log("\n📁 Dosyalar kaydedildi:")
    console.log("   - test-output-original.md (Orijinal içerik)")
    console.log("   - test-output-enriched.md (Zenginleştirilmiş içerik)")
    console.log("   - test-output-report.md (Karşılaştırma raporu)")

    console.log("\n" + "=".repeat(80))
    console.log("✅ Detaylı test tamamlandı!")
    console.log("=".repeat(80))
  } catch (error) {
    console.error("\n❌ Hata:")
    console.error(error)
    process.exit(1)
  }
}

// Run test
testEnhancedProcessorDetailed()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Test başarısız:")
    console.error(error)
    process.exit(1)
  })
