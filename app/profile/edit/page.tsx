import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EditClient } from "./edit-client"

export default async function ProfileEditPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const initialData = {
    name: session.user.name || "",
    username: session.user.username || "",
    bio: session.user.bio || "",
    email: session.user.email || "",
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <EditClient initialData={initialData} />
      </main>
      <Footer />
    </div>
  )
}
