import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1, "Kategori adı gereklidir"),
  slug: z.string().min(1, "Slug gereklidir"),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
})

// GET - Tüm kategorileri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("includeInactive") === "true"

    const categories = await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    })

    return NextResponse.json(categories)
  } catch (error: unknown) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Kategoriler yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

// POST - Yeni kategori oluştur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 })
    }

    // Sadece admin ve editor kategori oluşturabilir
    const userRole = session.user?.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN" && userRole !== "EDITOR") {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    // Slug'ın benzersiz olduğunu kontrol et
    const existingCategory = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Bu slug zaten kullanılıyor" }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        icon: validatedData.icon,
        color: validatedData.color,
        parentId: validatedData.parentId,
        order: validatedData.order ?? 0,
        isActive: validatedData.isActive ?? true,
      },
      include: {
        parent: true,
        children: true,
      },
    })

    // Cache'i temizle - Kategoriler anında güncellensin
    revalidatePath("/", "layout")
    revalidatePath("/categories/[slug]", "page")

    return NextResponse.json(category, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.issues }, { status: 400 })
    }

    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Kategori oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}
