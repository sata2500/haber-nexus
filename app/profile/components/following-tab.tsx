"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, Check, FileText, Eye, Heart } from "lucide-react"

interface FollowingTabProps {
  userId: string
}

export function FollowingTab({ userId }: FollowingTabProps) {
  const [follows, setFollows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchFollowedAuthors()
  }, [page])

  const fetchFollowedAuthors = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/users/${userId}/followed-authors?page=${page}&limit=10`
      )
      if (response.ok) {
        const data = await response.json()
        setFollows((prev) =>
          page === 1 ? data.follows : [...prev, ...data.follows]
        )
        setHasMore(data.pagination.page < data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error fetching followed authors:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async (authorId: string) => {
    try {
      const response = await fetch("/api/follows", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId: authorId }),
      })

      if (response.ok) {
        setFollows((prev) => prev.filter((follow) => follow.author.id !== authorId))
      }
    } catch (error) {
      console.error("Error unfollowing author:", error)
    }
  }

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (follows.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Henüz takip edilen yazar yok</h3>
        <p className="text-muted-foreground">
          Takip ettiğiniz yazarlar burada görünecek
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {follows.map((follow) => (
        <Card key={follow.followId}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Author Info */}
              <div className="flex items-start gap-4 flex-1">
                {follow.author.image ? (
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={follow.author.image}
                      alt={follow.author.name || "Yazar"}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {follow.author.name || "İsimsiz"}
                    </h3>
                    {follow.author.username && (
                      <p className="text-sm text-muted-foreground">
                        @{follow.author.username}
                      </p>
                    )}
                  </div>

                  {follow.author.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {follow.author.bio}
                    </p>
                  )}

                  {/* Author Stats */}
                  {follow.author.authorProfile && (
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{follow.author.authorProfile.totalArticles} makale</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{follow.author.authorProfile.totalViews} görüntülenme</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        <span>{follow.author.authorProfile.totalLikes} beğeni</span>
                      </div>
                      {follow.author.authorProfile.verified && (
                        <Badge variant="secondary" className="gap-1">
                          <Check className="h-3 w-3" />
                          Doğrulanmış
                        </Badge>
                      )}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnfollow(follow.author.id)}
                    className="mt-2"
                  >
                    Takibi Bırak
                  </Button>
                </div>
              </div>

              {/* Recent Articles */}
              {follow.author.recentArticles && follow.author.recentArticles.length > 0 && (
                <div className="md:w-64 space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Son Makaleler
                  </h4>
                  <div className="space-y-2">
                    {follow.author.recentArticles.map((article: any) => (
                      <Link
                        key={article.id}
                        href={`/articles/${article.slug}`}
                        className="block p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <p className="text-sm font-medium line-clamp-2">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(article.publishedAt).toLocaleDateString("tr-TR")}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              "Daha Fazla Yükle"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
