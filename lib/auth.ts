import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Adapter } from "next-auth/adapters"
import { UserRole } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email ve şifre gerekli")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          throw new Error("Geçersiz email veya şifre")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Geçersiz email veya şifre")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        
        // Her session çağrısında veritabanından güncel rol bilgisini al
        // Bu sayede rol değişiklikleri anında yansır
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.sub! },
            select: { role: true, name: true, image: true, email: true }
          })
          
          if (user) {
            session.user.role = user.role as UserRole
            session.user.name = user.name
            session.user.image = user.image
            session.user.email = user.email
          } else {
            // Kullanıcı silinmişse token'daki rolü kullan
            session.user.role = token.role as UserRole
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
          // Hata durumunda token'daki rolü kullan
          session.user.role = token.role as UserRole
        }
      }
      return session
    },
    async jwt({ token, user, trigger }) {
      // İlk giriş yapıldığında user bilgilerini token'a ekle
      if (user) {
        token.role = user.role as UserRole
      }
      
      // Session güncellendiğinde (update trigger) veritabanından yeni rol bilgisini al
      if (trigger === "update") {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub! },
            select: { role: true }
          })
          
          if (dbUser) {
            token.role = dbUser.role as UserRole
          }
        } catch (error) {
          console.error("Error updating token role:", error)
        }
      }
      
      return token
    }
  },
  session: {
    strategy: "jwt",
    // Session'ın ne kadar süre geçerli olacağı (30 gün)
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
