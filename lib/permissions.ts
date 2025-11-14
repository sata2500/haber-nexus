import { UserRole } from "@prisma/client"
import { Session } from "next-auth"

export interface Permission {
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
  canPublish: boolean
  canModerate: boolean
  canManageUsers: boolean
  canManageSettings: boolean
}

/**
 * Kullanıcı rolüne göre yetkileri döndürür
 */
export function getPermissions(role: UserRole): Permission {
  const permissions: Record<UserRole, Permission> = {
    USER: {
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
      canPublish: false,
      canModerate: false,
      canManageUsers: false,
      canManageSettings: false,
    },
    AUTHOR: {
      canCreate: true,
      canRead: true,
      canUpdate: true, // Sadece kendi içerikleri
      canDelete: false,
      canPublish: false, // Editör onayı gerekli
      canModerate: false,
      canManageUsers: false,
      canManageSettings: false,
    },
    EDITOR: {
      canCreate: true,
      canRead: true,
      canUpdate: true, // Tüm içerikler
      canDelete: true,
      canPublish: true,
      canModerate: true,
      canManageUsers: false,
      canManageSettings: false,
    },
    ADMIN: {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      canPublish: true,
      canModerate: true,
      canManageUsers: true,
      canManageSettings: true,
    },
    SUPER_ADMIN: {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      canPublish: true,
      canModerate: true,
      canManageUsers: true,
      canManageSettings: true,
    },
  }

  return permissions[role]
}

/**
 * Kullanıcının belirli bir yetkiye sahip olup olmadığını kontrol eder
 */
export function hasPermission(
  role: UserRole,
  permission: keyof Permission
): boolean {
  const permissions = getPermissions(role)
  return permissions[permission]
}

/**
 * Kullanıcının admin veya editör olup olmadığını kontrol eder
 */
export function isAdminOrEditor(role: UserRole): boolean {
  return ["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(role)
}

/**
 * Kullanıcının admin olup olmadığını kontrol eder
 */
export function isAdmin(role: UserRole): boolean {
  return ["ADMIN", "SUPER_ADMIN"].includes(role)
}

/**
 * Kullanıcının yazar olup olmadığını kontrol eder
 */
export function isAuthor(role: UserRole): boolean {
  return role === "AUTHOR"
}

/**
 * Kullanıcının editör olup olmadığını kontrol eder
 */
export function isEditor(role: UserRole): boolean {
  return role === "EDITOR"
}

/**
 * Kullanıcının belirli bir içeriği düzenleme yetkisi olup olmadığını kontrol eder
 */
export function canEditContent(
  userRole: UserRole,
  userId: string,
  contentAuthorId: string
): boolean {
  // Admin ve editörler her içeriği düzenleyebilir
  if (isAdminOrEditor(userRole)) {
    return true
  }

  // Yazarlar sadece kendi içeriklerini düzenleyebilir
  if (isAuthor(userRole) && userId === contentAuthorId) {
    return true
  }

  return false
}

/**
 * Kullanıcının belirli bir içeriği silme yetkisi olup olmadığını kontrol eder
 */
export function canDeleteContent(
  userRole: UserRole
): boolean {
  // Sadece admin ve editörler içerik silebilir
  return isAdminOrEditor(userRole)
}

/**
 * Kullanıcının içerik yayınlama yetkisi olup olmadığını kontrol eder
 */
export function canPublishContent(userRole: UserRole): boolean {
  return hasPermission(userRole, "canPublish")
}

/**
 * Session'dan kullanıcı rolünü döndürür
 */
export function getUserRole(session: Session | null): UserRole | null {
  if (!session?.user?.role) {
    return null
  }
  return session.user.role as UserRole
}

/**
 * Session'dan kullanıcı ID'sini döndürür
 */
export function getUserId(session: Session | null): string | null {
  if (!session?.user?.id) {
    return null
  }
  return session.user.id
}

/**
 * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
 */
export function hasRole(session: Session | null, role: UserRole): boolean {
  const userRole = getUserRole(session)
  return userRole === role
}

/**
 * Kullanıcının belirli rollerden birine sahip olup olmadığını kontrol eder
 */
export function hasAnyRole(session: Session | null, roles: UserRole[]): boolean {
  const userRole = getUserRole(session)
  if (!userRole) return false
  return roles.includes(userRole)
}

/**
 * Rol öncelik sırası (yüksekten düşüğe)
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  EDITOR: 3,
  AUTHOR: 2,
  USER: 1,
}

/**
 * Bir rolün diğer rolden daha yüksek olup olmadığını kontrol eder
 */
export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2]
}

/**
 * Kullanıcının başka bir kullanıcıyı yönetme yetkisi olup olmadığını kontrol eder
 */
export function canManageUser(
  managerRole: UserRole,
  targetUserRole: UserRole
): boolean {
  // Sadece admin ve super admin kullanıcı yönetebilir
  if (!isAdmin(managerRole)) {
    return false
  }

  // Super admin herkes yönetebilir
  if (managerRole === "SUPER_ADMIN") {
    return true
  }

  // Admin, super admin dışında herkesi yönetebilir
  if (managerRole === "ADMIN" && targetUserRole !== "SUPER_ADMIN") {
    return true
  }

  return false
}

/**
 * Rol etiketlerini döndürür
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  USER: "Kullanıcı",
  AUTHOR: "Yazar",
  EDITOR: "Editör",
  ADMIN: "Admin",
  SUPER_ADMIN: "Süper Admin",
}

/**
 * Rol renklerini döndürür (Shadcn badge variant)
 */
export const ROLE_COLORS: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
  USER: "secondary",
  AUTHOR: "outline",
  EDITOR: "default",
  ADMIN: "destructive",
  SUPER_ADMIN: "destructive",
}

/**
 * Makale durumu etiketlerini döndürür
 */
export const ARTICLE_STATUS_LABELS = {
  DRAFT: "Taslak",
  SCHEDULED: "Planlanmış",
  PUBLISHED: "Yayında",
  ARCHIVED: "Arşiv",
}

/**
 * Makale durumu renklerini döndürür
 */
export const ARTICLE_STATUS_COLORS = {
  DRAFT: "secondary",
  SCHEDULED: "outline",
  PUBLISHED: "default",
  ARCHIVED: "destructive",
} as const
