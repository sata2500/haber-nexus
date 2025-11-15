"use client"


import { cn } from "@/lib/utils"
import { 
  Heart, 
  Bookmark, 
  Clock, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Settings 
} from "lucide-react"

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "overview", label: "Genel Bakış", icon: BarChart3 },
  { id: "liked", label: "Beğenilenler", icon: Heart },
  { id: "bookmarked", label: "Kayıtlı", icon: Bookmark },
  { id: "history", label: "Okuma Geçmişi", icon: Clock },
  { id: "comments", label: "Yorumlar", icon: MessageSquare },
  { id: "analytics", label: "Analizler", icon: BarChart3 },
  { id: "following", label: "Takip Edilenler", icon: Users },
  { id: "settings", label: "Ayarlar", icon: Settings },
]

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="border-b">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
