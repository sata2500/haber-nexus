import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import SearchContent from "./search-content"

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container flex-1 py-12">
        <Suspense
          fallback={
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
          }
        >
          <SearchContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
