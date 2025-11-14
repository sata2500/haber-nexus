import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Admin hesabı oluşturuluyor...")

  const email = process.env.ADMIN_EMAIL || "admin@habernexus.com"
  const password = process.env.ADMIN_PASSWORD || "admin123456"
  const name = process.env.ADMIN_NAME || "Admin"

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log(`Admin hesabı zaten mevcut: ${email}`)
    
    // Update to SUPER_ADMIN if not already
    if (existingAdmin.role !== "SUPER_ADMIN") {
      await prisma.user.update({
        where: { email },
        data: { role: "SUPER_ADMIN" },
      })
      console.log(`Kullanıcı SUPER_ADMIN rolüne yükseltildi: ${email}`)
    }
    
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
    },
  })

  console.log("✅ Admin hesabı başarıyla oluşturuldu!")
  console.log("Email:", email)
  console.log("Şifre:", password)
  console.log("Rol:", admin.role)
  console.log("\n⚠️  Güvenlik için şifrenizi değiştirmeniz önerilir!")
}

main()
  .catch((error) => {
    console.error("Hata:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
