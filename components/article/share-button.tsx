"use client"

import { useState } from "react"
import { Share2, Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ShareButtonProps {
  articleId: string
  title: string
  url: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function ShareButton({
  articleId,
  title,
  url,
  showLabel = true,
  size = "md",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const fullUrl = typeof window !== "undefined" 
    ? `${window.location.origin}${url}`
    : url

  const handleNativeShare = async () => {
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: fullUrl,
        })
      } catch (error) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed:", error)
      }
    } else {
      // Fallback to dialog
      setOpen(true)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + fullUrl)}`,
  }

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <>
      <button
        onClick={handleNativeShare}
        className={cn(
          "flex items-center gap-2 rounded-md transition-all",
          "text-muted-foreground hover:bg-accent hover:text-primary",
          sizeClasses[size]
        )}
        aria-label="Paylaş"
      >
        <Share2 className={iconSizes[size]} />
        {showLabel && <span className="font-medium">Paylaş</span>}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Makaleyi Paylaş</DialogTitle>
            <DialogDescription>
              Bu makaleyi sosyal medyada veya link ile paylaşın
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Social Media Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="lg"
                className="flex-col h-auto py-3"
                onClick={() => window.open(shareLinks.facebook, "_blank")}
              >
                <Facebook className="h-6 w-6 mb-1 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex-col h-auto py-3"
                onClick={() => window.open(shareLinks.twitter, "_blank")}
              >
                <Twitter className="h-6 w-6 mb-1 text-sky-500" />
                <span className="text-xs">Twitter</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex-col h-auto py-3"
                onClick={() => window.open(shareLinks.linkedin, "_blank")}
              >
                <Linkedin className="h-6 w-6 mb-1 text-blue-700" />
                <span className="text-xs">LinkedIn</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex-col h-auto py-3"
                onClick={() => window.open(shareLinks.whatsapp, "_blank")}
              >
                <svg
                  className="h-6 w-6 mb-1 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-xs">WhatsApp</span>
              </Button>
            </div>

            {/* Copy Link */}
            <div className="flex items-center gap-2">
              <Input
                value={fullUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 text-center">
                Link kopyalandı!
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
