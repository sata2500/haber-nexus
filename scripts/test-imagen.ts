/**
 * Test script for Google Imagen API
 * Tests image generation using the @google/genai package
 */

import "dotenv/config"
import { GoogleGenAI } from "@google/genai"
import { writeFileSync } from "fs"

async function testImagen() {
  console.log("=".repeat(80))
  console.log("Testing Google Imagen API")
  console.log("=".repeat(80))

  try {
    // Initialize client
    const client = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY || "",
    })

    console.log("\n✅ Client initialized")

    // Test prompt
    const prompt =
      "sağlık ve yaşam tarzı fotoğrafı, kış mevsiminde mutlu bir insan, sıcak renkler, doğal ışık, profesyonel fotoğraf"

    console.log(`\n📝 Prompt: ${prompt}`)
    console.log("\n🎨 Generating image...")

    // Generate image
    const response = await client.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "16:9",
      },
    })

    console.log("\n✅ Image generated successfully!")
    console.log(`   Number of images: ${response.generatedImages?.length || 0}`)

    // Save first image
    if (response.generatedImages && response.generatedImages.length > 0) {
      const generatedImage = response.generatedImages[0]

      console.log(`   Image object keys: ${Object.keys(generatedImage).join(", ")}`)

      // Get image data from imageBytes
      if (generatedImage.image && generatedImage.image.imageBytes) {
        console.log(`   Image MIME type: ${generatedImage.image.mimeType}`)
        
        // imageBytes is a base64 string
        const imageBuffer = Buffer.from(generatedImage.image.imageBytes, "base64")
        const filename = "test-imagen-output.png"
        writeFileSync(filename, imageBuffer)
        
        console.log(`\n💾 Image saved to: ${filename}`)
        console.log(`   Size: ${imageBuffer.length} bytes`)
      }
    }

    console.log("\n" + "=".repeat(80))
    console.log("✅ Test completed successfully!")
    console.log("=".repeat(80))
  } catch (error) {
    console.error("\n❌ Error:")
    console.error(error)
    process.exit(1)
  }
}

// Run test
testImagen()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Test failed:")
    console.error(error)
    process.exit(1)
  })
