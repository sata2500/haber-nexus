import { UserRole } from "@prisma/client"
import {
  PenTool,
  FileCheck,
  Settings,
  User,
  Crown,
  LayoutDashboard,
  LucideIcon,
} from "lucide-react"

export interface Dashboard {
  id: string
  label: string
  href: string
  icon: LucideIcon
  description: string
  color: string
  gradient: string
}

export interface DashboardInfo {
  primary: Dashboard
  accessible: Dashboard[]
}

/**
 * Kullanıcı rolüne göre ana dashboard URL'ini döndürür
 */
export function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin"
    case "EDITOR":
      return "/editor"
    case "AUTHOR":
      return "/author"
    case "USER":
    default:
      return "/profile"
  }
}

/**
 * Kullanıcı rolüne göre erişilebilir dashboard'ları döndürür
 */
export function getAccessibleDashboards(role: UserRole): Dashboard[] {
  const dashboards: Dashboard[] = []

  // Yazar Dashboard
  if (["AUTHOR", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
    dashboards.push({
      id: "author",
      label: "Yazar Dashboard",
      href: "/author",
      icon: PenTool,
      description: "Makalelerinizi yönetin ve istatistiklerinizi görüntüleyin",
      color: "text-blue-600",
      gradient: "from-blue-500/10 to-blue-600/10",
    })
  }

  // Editör Dashboard
  if (["EDITOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
    dashboards.push({
      id: "editor",
      label: "Editör Dashboard",
      href: "/editor",
      icon: FileCheck,
      description: "Makaleleri inceleyin ve yorumları moderasyon edin",
      color: "text-purple-600",
      gradient: "from-purple-500/10 to-purple-600/10",
    })
  }

  // Admin Panel
  if (["ADMIN", "SUPER_ADMIN"].includes(role)) {
    dashboards.push({
      id: "admin",
      label: "Admin Panel",
      href: "/admin",
      icon: Settings,
      description: "Tüm sistemi yönetin ve ayarları düzenleyin",
      color: "text-red-600",
      gradient: "from-red-500/10 to-red-600/10",
    })
  }

  return dashboards
}

/**
 * Kullanıcı rolüne göre dashboard bilgilerini döndürür
 */
export function getDashboardInfo(role: UserRole): DashboardInfo {
  const accessible = getAccessibleDashboards(role)
  const primaryUrl = getDashboardUrl(role)

  const primary = accessible.find((d) => d.href === primaryUrl) || {
    id: "profile",
    label: "Profilim",
    href: "/profile",
    icon: User,
    description: "Profil bilgilerinizi görüntüleyin ve düzenleyin",
    color: "text-gray-600",
    gradient: "from-gray-500/10 to-gray-600/10",
  }

  return {
    primary,
    accessible,
  }
}

/**
 * Kullanıcının belirli bir dashboard'a erişim yetkisi olup olmadığını kontrol eder
 */
export function canAccessDashboard(role: UserRole, dashboardPath: string): boolean {
  const accessible = getAccessibleDashboards(role)
  return accessible.some((d) => d.href === dashboardPath)
}

/**
 * Rol bazlı dashboard icon'unu döndürür
 */
export function getRoleIcon(role: UserRole) {
  switch (role) {
    case "SUPER_ADMIN":
      return Crown
    case "ADMIN":
      return Settings
    case "EDITOR":
      return FileCheck
    case "AUTHOR":
      return PenTool
    case "USER":
    default:
      return User
  }
}

/**
 * Rol bazlı dashboard rengini döndürür
 */
export function getRoleColor(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "text-amber-600"
    case "ADMIN":
      return "text-red-600"
    case "EDITOR":
      return "text-purple-600"
    case "AUTHOR":
      return "text-blue-600"
    case "USER":
    default:
      return "text-gray-600"
  }
}

/**
 * Rol bazlı dashboard gradient'ini döndürür
 */
export function getRoleGradient(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "from-amber-500/10 to-amber-600/10"
    case "ADMIN":
      return "from-red-500/10 to-red-600/10"
    case "EDITOR":
      return "from-purple-500/10 to-purple-600/10"
    case "AUTHOR":
      return "from-blue-500/10 to-blue-600/10"
    case "USER":
    default:
      return "from-gray-500/10 to-gray-600/10"
  }
}

/**
 * Dashboard kartı için hover class'ını döndürür
 */
export function getDashboardHoverClass(dashboardId: string): string {
  switch (dashboardId) {
    case "author":
      return "hover:border-blue-500/50 hover:shadow-blue-500/20"
    case "editor":
      return "hover:border-purple-500/50 hover:shadow-purple-500/20"
    case "admin":
      return "hover:border-red-500/50 hover:shadow-red-500/20"
    default:
      return "hover:border-gray-500/50 hover:shadow-gray-500/20"
  }
}

/**
 * Rol açıklamasını döndürür
 */
export function getRoleDescription(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Tüm sisteme tam erişim yetkisine sahipsiniz"
    case "ADMIN":
      return "Sistem yönetimi ve kullanıcı yönetimi yetkileriniz var"
    case "EDITOR":
      return "İçerik inceleme ve moderasyon yetkileriniz var"
    case "AUTHOR":
      return "Makale yazma ve yönetme yetkileriniz var"
    case "USER":
    default:
      return "Platform okuyucususunuz"
  }
}

/**
 * Dashboard istatistiklerini döndürür (rol bazlı)
 */
export interface DashboardStats {
  label: string
  value: number | string
  icon: LucideIcon
  color: string
}

export function getDashboardStatsConfig(role: UserRole): DashboardStats[] {
  switch (role) {
    case "AUTHOR":
      return [
        { label: "Makaleler", value: 0, icon: PenTool, color: "text-blue-600" },
        { label: "Görüntülenme", value: 0, icon: LayoutDashboard, color: "text-green-600" },
      ]
    case "EDITOR":
      return [
        { label: "Onay Bekleyen", value: 0, icon: FileCheck, color: "text-orange-600" },
        { label: "Yorumlar", value: 0, icon: LayoutDashboard, color: "text-purple-600" },
      ]
    case "ADMIN":
    case "SUPER_ADMIN":
      return [
        { label: "Kullanıcılar", value: 0, icon: User, color: "text-blue-600" },
        { label: "Makaleler", value: 0, icon: PenTool, color: "text-green-600" },
      ]
    default:
      return []
  }
}
