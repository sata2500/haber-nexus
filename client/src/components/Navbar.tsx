import { Link } from "wouter";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: categories } = trpc.categories.getAll.useQuery();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="text-2xl font-bold text-primary">
                Haber<span className="text-accent">Nexus</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Ana Sayfa
            </Link>
            {categories?.slice(0, 5).map((category) => (
              <Link key={category.id} href={`/kategori/${category.slug}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                {category.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            <Link href="/" className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Ana Sayfa
            </Link>
            {categories?.map((category) => (
              <Link key={category.id} href={`/kategori/${category.slug}`} className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
