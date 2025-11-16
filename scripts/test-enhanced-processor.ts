/**
 * Test script for enhanced RSS processor
 * Tests vision enhancement and content enrichment features
 */

import "dotenv/config"
import { enhancedProcessRssItem } from "../lib/ai/enhanced-processor"
import type { RssItem } from "../lib/rss/parser"

async function testEnhancedProcessor() {
  console.log("=".repeat(80))
  console.log("Testing Enhanced RSS Processor")
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
  console.log(`   Content length: ${testItem.content.length} chars`)

  console.log("\n🚀 Starting enhanced processing...")
  console.log("   - Vision Enhancement: ENABLED")
  console.log("   - Content Enrichment: ENABLED")

  try {
    const startTime = Date.now()

    const result = await enhancedProcessRssItem(testItem, {
      rewriteStyle: "news",
      minQualityScore: 0.5,
      generateNewContent: true,
      enableVisionEnhancement: true,
      enableContentEnrichment: true,
    })

    const duration = Date.now() - startTime

    console.log("\n✅ Processing completed successfully!")
    console.log(`   Duration: ${duration}ms (${(duration / 1000).toFixed(2)}s)`)

    console.log("\n" + "=".repeat(80))
    console.log("RESULTS")
    console.log("=".repeat(80))

    console.log("\n📝 Basic Processing:")
    console.log(`   Title: ${result.title}`)
    console.log(`   Slug: ${result.slug}`)
    console.log(`   Quality Score: ${result.qualityScore.toFixed(2)}`)
    console.log(`   Tags: ${result.tags.join(", ")}`)
    console.log(`   Keywords: ${result.keywords.slice(0, 5).join(", ")}`)

    console.log("\n🖼️  Vision Enhancement:")
    console.log(`   Strategy: ${result.visionEnhancement.strategy}`)
    console.log(`   Reasoning: ${result.visionEnhancement.reasoning}`)
    console.log(`   Cover Image: ${result.coverImage || "None"}`)
    console.log(`   Content Images: ${result.visionEnhancement.contentImages.length}`)

    console.log("\n📚 Content Enrichment:")
    console.log(`   Enriched: ${result.contentEnrichment.enriched ? "Yes" : "No"}`)
    console.log(`   Reasoning: ${result.contentEnrichment.reasoning}`)
    console.log(`   Research Sources: ${result.researchSources.length}`)
    if (result.researchSources.length > 0) {
      console.log(`   Sources:`)
      result.researchSources.forEach((source, i) => {
        console.log(`     ${i + 1}. ${source}`)
      })
    }

    console.log("\n📄 Content Comparison:")
    console.log(`   Original length: ${result.contentEnrichment.originalContent.length} chars`)
    console.log(`   Enriched length: ${result.enrichedContent.length} chars`)
    console.log(
      `   Growth: ${((result.enrichedContent.length / result.contentEnrichment.originalContent.length - 1) * 100).toFixed(1)}%`
    )

    console.log("\n📖 Excerpt:")
    console.log(`   ${result.excerpt}`)

    console.log("\n" + "=".repeat(80))
    console.log("✅ Test completed successfully!")
    console.log("=".repeat(80))
  } catch (error) {
    console.error("\n❌ Error during processing:")
    console.error(error)
    process.exit(1)
  }
}

// Run test
testEnhancedProcessor()
  .then(() => {
    console.log("\n✅ All tests passed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Test failed:")
    console.error(error)
    process.exit(1)
  })
