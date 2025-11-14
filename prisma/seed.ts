import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create categories
  const categories = [
    {
      slug: "gundem",
      name: "Gündem",
      description: "Güncel haberler ve gelişmeler",
      icon: "📰",
      color: "#ef4444",
      order: 1,
    },
    {
      slug: "dunya",
      name: "Dünya",
      description: "Dünya haberleri ve uluslararası gelişmeler",
      icon: "🌍",
      color: "#06b6d4",
      order: 2,
    },
    {
      slug: "ekonomi",
      name: "Ekonomi",
      description: "Ekonomi ve finans haberleri",
      icon: "💰",
      color: "#10b981",
      order: 3,
    },
    {
      slug: "spor",
      name: "Spor",
      description: "Spor haberleri ve sonuçları",
      icon: "⚽",
      color: "#f59e0b",
      order: 4,
    },
    {
      slug: "teknoloji",
      name: "Teknoloji",
      description: "Teknoloji ve inovasyon haberleri",
      icon: "💻",
      color: "#3b82f6",
      order: 5,
    },
    {
      slug: "saglik",
      name: "Sağlık",
      description: "Sağlık ve yaşam haberleri",
      icon: "🏥",
      color: "#ec4899",
      order: 6,
    },
    {
      slug: "kultur-sanat",
      name: "Kültür & Sanat",
      description: "Kültür, sanat ve eğlence haberleri",
      icon: "🎨",
      color: "#8b5cf6",
      order: 7,
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    console.log(`✅ Category created: ${category.name}`)
  }

  // Create admin user
  const adminEmail = "salihtanriseven25@gmail.com"
  const hashedPassword = await hash("admin123", 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "SUPER_ADMIN",
    },
    create: {
      email: adminEmail,
      name: "Salih TANRISEVEN",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
    },
  })
  console.log(`✅ Admin user created: ${adminEmail}`)

  // Create sample tags
  const tags = [
    { slug: "son-dakika", name: "Son Dakika" },
    { slug: "ozel-haber", name: "Özel Haber" },
    { slug: "analiz", name: "Analiz" },
    { slug: "roportaj", name: "Röportaj" },
    { slug: "video", name: "Video" },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
    console.log(`✅ Tag created: ${tag.name}`)
  }

  console.log("✅ Seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
