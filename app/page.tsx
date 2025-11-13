import { HeroSection } from '@/components/home/hero-section'
import { NewsGrid } from '@/components/home/news-grid'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Hero Section */}
      <HeroSection />

      {/* Latest News */}
      <NewsGrid title="Son Haberler" />

      {/* Category Sections */}
      <div className="bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-800">
        <NewsGrid title="Teknoloji" category="Teknoloji" />
      </div>

      <NewsGrid title="Ekonomi" category="Ekonomi" />

      <div className="bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-800">
        <NewsGrid title="Spor" category="Spor" />
      </div>
    </div>
  )
}
