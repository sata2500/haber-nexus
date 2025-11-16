import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = "salihtanriseven25@gmail.com"

  console.error(`\n🔍 Kullanıcı aranıyor: ${email}\n`)

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: true,
    },
  })

  if (!user) {
    console.error("❌ Kullanıcı bulunamadı!")
    console.error("\nLütfen önce Google hesabınızla giriş yapın.")
    return
  }

  console.error("✅ Kullanıcı bulundu!\n")
  console.error("Kullanıcı Bilgileri:")
  console.error("-------------------")
  console.error(`ID: ${user.id}`)
  console.error(`Email: ${user.email}`)
  console.error(`Name: ${user.name || "Belirtilmedi"}`)
  console.error(`Username: ${user.username || "Belirtilmedi"}`)
  console.error(`Role: ${user.role}`)
  console.error(`Email Verified: ${user.emailVerified ? "Evet" : "Hayır"}`)
  console.error(`Created At: ${user.createdAt}`)
  console.error(`\nBağlı Hesaplar:`)
  user.accounts.forEach((account, index) => {
    console.error(`  ${index + 1}. ${account.provider} (${account.type})`)
  })
  console.error("\n")
}

main()
  .catch((error) => {
    console.error("Hata:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
