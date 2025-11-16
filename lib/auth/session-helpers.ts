import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Check if user has privileged role (AUTHOR, ADMIN, SUPER_ADMIN)
 */
export async function isPrivilegedUser(): Promise<boolean> {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return false
  }

  const privilegedRoles = ["AUTHOR", "EDITOR", "ADMIN", "SUPER_ADMIN"]
  return privilegedRoles.includes(session.user.role)
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}
