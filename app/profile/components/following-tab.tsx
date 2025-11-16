"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, Check, FileText, Eye, Heart } from "lucide-react"
import type { Follow, Article } from "@/types/profile"

interface FollowingTabProps {
  userId: string
}

interface FollowWithAuthorDetails extends Follow {
  author: {
    id: string
    name: string
    image?: string
    username?: string
    bio?: string
    authorProfile?: {
      totalArticles: number
      totalViews: number
      totalLikes: number
      verified: boolean
    }
    recentArticles?: Article[]
  }
}

export function FollowingTab({ userId }: FollowingTabProps) {
  const [follows, setFollows] = useState<FollowWithAuthorDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchFollowedAuthors = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${userId}/followed-authors?page=${page}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setFollows((prev) => (page === 1 ? data.follows : [...prev, ...data.follows]))
        setHasMore(data.pagination.page < data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error fetching followed authors:", error)
    } finally {
      setLoading(false)
    }
  }, [userId, page])

  useEffect(() => {
    fetchFollowedAuthors()
  }, [fetchFollowedAuthors])

  const handleUnfollow = async (authorId: string) => {
    try {
      const response = await fetch("/api/follows", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId: authorId }),
      })

      if (response.ok) {
        setFollows((prev) => prev.filter((follow) => follow.following.id !== authorId))
      }
    } catch (error) {
      console.error("Error unfollowing author:", error)
    }
  }

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (follows.length === 0) {
    return (
      <div className="py-12 text-center">
        <Users className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
        <h3 className="mb-2 text-lg font-semibold">Henüz takip edilen yazar yok</h3>
        <p className="text-muted-foreground">Takip ettiğiniz yazarlar burada görünecek</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {follows.map((follow) => (
        <Card key={follow.id}>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Author Info */}
              <div className="flex flex-1 items-start gap-4">
                {follow.author.image ? (
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <Image
                      src={follow.author.image}
                      alt={follow.author.name || "Yazar"}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-muted flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full">
                    <Users className="text-muted-foreground h-8 w-8" />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold">{follow.author.name || "İsimsiz"}</h3>
                    {follow.author.username && (
                      <p className="text-muted-foreground text-sm">@{follow.author.username}</p>
                    )}
                  </div>

                  {follow.author.bio && (
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {follow.author.bio}
                    </p>
                  )}

                  {/* Author Stats */}
                  {follow.author.authorProfile && (
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{follow.author.authorProfile.totalArticles} makale</span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{follow.author.authorProfile.totalViews} görüntülenme</span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1">
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
                <div className="space-y-2 md:w-64">
                  <h4 className="text-muted-foreground text-sm font-semibold">Son Makaleler</h4>
                  <div className="space-y-2">
                    {follow.author.recentArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/articles/${article.slug}`}
                        className="hover:bg-muted block rounded-md p-2 transition-colors"
                      >
                        <p className="line-clamp-2 text-sm font-medium">{article.title}</p>
                        <p className="text-muted-foreground mt-1 text-xs">
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
          <Button onClick={() => setPage((p) => p + 1)} disabled={loading} variant="outline">
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
