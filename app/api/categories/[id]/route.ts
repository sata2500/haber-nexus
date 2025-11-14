import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().nullable().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
})

// GET - Kategori detayı
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            articles: true,
            rssFeeds: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Kategori bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Kategori yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

// PATCH - Kategori güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      )
    }

    const userRole = session.user?.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN" && userRole !== "EDITOR") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = categoryUpdateSchema.parse(body)

    // Slug değişiyorsa benzersizliğini kontrol et
    if (validatedData.slug) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          slug: validatedData.slug,
          NOT: { id },
        },
      })

      if (existingCategory) {
        return NextResponse.json(
          { error: "Bu slug zaten kullanılıyor" },
          { status: 400 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
      include: {
        parent: true,
        children: true,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Kategori güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

// DELETE - Kategori sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      )
    }

    const userRole = session.user?.role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      )
    }

    const { id } = await params

    // Kategoriye bağlı makale var mı kontrol et
    const articleCount = await prisma.article.count({
      where: { categoryId: id },
    })

    if (articleCount > 0) {
      return NextResponse.json(
        { error: "Bu kategoriye bağlı makaleler var. Önce makaleleri başka kategoriye taşıyın." },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Kategori silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
