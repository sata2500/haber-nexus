import { HeroSection } from '@/components/home/hero-section'
import { NewsGrid } from '@/components/home/news-grid'

export default function Home() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <HeroSection />

      {/* Latest News */}
      <NewsGrid title="Son Haberler" />

      {/* Category Sections */}
      <div className="bg-background border-y border-border">
        <NewsGrid title="Teknoloji" category="Teknoloji" />
      </div>

      <NewsGrid title="Ekonomi" category="Ekonomi" />

      <div className="bg-background border-y border-border">
        <NewsGrid title="Spor" category="Spor" />
      </div>
    </div>
  )
}
