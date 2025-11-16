import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = "salihtanriseven25@gmail.com"

  console.error(`\n🔧 Kullanıcı rolü güncelleniyor: ${email}\n`)

  // Kullanıcıyı bul
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.error("❌ Kullanıcı bulunamadı!")
    console.error("\nLütfen önce Google hesabınızla giriş yapın.")
    process.exit(1)
  }

  console.error(`Mevcut Rol: ${user.role}`)
  console.error(`Yeni Rol: SUPER_ADMIN`)
  console.error("\nGüncelleme yapılıyor...\n")

  // Rolü güncelle
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      role: "SUPER_ADMIN",
      emailVerified: new Date(), // Email'i de doğrulanmış olarak işaretle
    },
  })

  console.error("✅ Kullanıcı rolü başarıyla güncellendi!\n")
  console.error("Güncel Kullanıcı Bilgileri:")
  console.error("---------------------------")
  console.error(`ID: ${updatedUser.id}`)
  console.error(`Email: ${updatedUser.email}`)
  console.error(`Name: ${updatedUser.name}`)
  console.error(`Role: ${updatedUser.role}`)
  console.error(`Email Verified: ${updatedUser.emailVerified ? "Evet" : "Hayır"}`)
  console.error(`Updated At: ${updatedUser.updatedAt}`)
  console.error("\n🎉 Artık tüm admin paneline erişiminiz var!")
  console.error("\n⚠️  Değişikliklerin etkili olması için lütfen çıkış yapıp tekrar giriş yapın.\n")
}

main()
  .catch((error) => {
    console.error("❌ Hata:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
