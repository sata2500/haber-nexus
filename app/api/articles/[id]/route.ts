import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const articleUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().optional(),
  type: z.enum(["NEWS", "BLOG", "ANALYSIS", "INTERVIEW", "OPINION"]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  publishedAt: z.string().nullable().optional(),
})

// GET - Makale detayı
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
          },
        },
        category: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
    })

    if (!article) {
      return NextResponse.json(
        { error: "Makale bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error: unknown) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Makale yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

// PATCH - Makale güncelle
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

    const { id } = await params
    
    // Mevcut makaleyi kontrol et
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Makale bulunamadı" },
        { status: 404 }
      )
    }

    // Yetki kontrolü - sadece makale sahibi, editör veya admin düzenleyebilir
    const userRole = session.user?.role
    const isOwner = existingArticle.authorId === session.user?.id
    const canEdit = isOwner || ["EDITOR", "ADMIN", "SUPER_ADMIN"].includes(userRole || "")

    if (!canEdit) {
      return NextResponse.json(
        { error: "Bu makaleyi düzenleme yetkiniz yok" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = articleUpdateSchema.parse(body)

    // Slug değişiyorsa benzersizliğini kontrol et
    if (validatedData.slug && validatedData.slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findFirst({
        where: {
          slug: validatedData.slug,
          NOT: { id },
        },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: "Bu slug zaten kullanılıyor" },
          { status: 400 }
        )
      }
    }

    // Tag'leri işle
    let tagConnections = undefined
    if (validatedData.tags) {
      tagConnections = await Promise.all(
        validatedData.tags.map(async (tagName) => {
          const slug = tagName
            .toLowerCase()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")

          const tag = await prisma.tag.upsert({
            where: { slug },
            update: {
              useCount: { increment: 1 },
            },
            create: {
              name: tagName,
              slug,
              useCount: 1,
            },
          })

          return { id: tag.id }
        })
      )
    }

    const updateData: Record<string, unknown> = {
      title: validatedData.title,
      slug: validatedData.slug,
      excerpt: validatedData.excerpt,
      content: validatedData.content,
      coverImage: validatedData.coverImage,
      type: validatedData.type,
      status: validatedData.status,
      categoryId: validatedData.categoryId,
      metaTitle: validatedData.metaTitle,
      metaDescription: validatedData.metaDescription,
      keywords: validatedData.keywords,
      publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined,
    }

    // Undefined değerleri temizle
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    if (tagConnections) {
      updateData.tags = {
        set: tagConnections,
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
      },
    })

    return NextResponse.json(article)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating article:", error)
    return NextResponse.json(
      { error: "Makale güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

// DELETE - Makale sil
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

    const { id } = await params

    // Mevcut makaleyi kontrol et
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Makale bulunamadı" },
        { status: 404 }
      )
    }

    // Yetki kontrolü - sadece makale sahibi veya admin silebilir
    const userRole = session.user?.role
    const isOwner = existingArticle.authorId === session.user?.id
    const canDelete = isOwner || ["ADMIN", "SUPER_ADMIN"].includes(userRole || "")

    if (!canDelete) {
      return NextResponse.json(
        { error: "Bu makaleyi silme yetkiniz yok" },
        { status: 403 }
      )
    }

    await prisma.article.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Error deleting article:", error)
    return NextResponse.json(
      { error: "Makale silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
