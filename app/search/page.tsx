import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import SearchContent from "./search-content"

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <Suspense fallback={
          <div className="text-center py-12">
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        }>
          <SearchContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
