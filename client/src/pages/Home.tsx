import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

function PostCard({ post, featured = false }: { post: any; featured?: boolean }) {
  const { data: author } = trpc.authors.getAll.useQuery(undefined, {
    select: (authors) => authors.find((a) => a.id === post.authorId),
  });

  const { data: category } = trpc.categories.getAll.useQuery(undefined, {
    select: (categories) => categories.find((c) => c.id === post.categoryId),
  });

  return (
    <Link href={`/haber/${post.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer">
          <div className={`relative ${featured ? "h-96" : "h-48"}`}>
            <img
              src={post.featuredImageUrl || "https://placehold.co/1200x675/e2e8f0/64748b?text=HaberNexus"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            {category && (
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  {category.name}
                </span>
              </div>
            )}
          </div>
          <CardContent className="p-6">
            <h3 className={`font-bold mb-2 line-clamp-2 ${featured ? "text-2xl" : "text-lg"}`}>
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                {author && (
                  <div className="flex items-center space-x-2">
                    <img
                      src={author.avatarUrl || "https://i.pravatar.cc/40"}
                      alt={author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{author.name}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {post.publishedAt
                      ? formatDistanceToNow(new Date(post.publishedAt), {
                          addSuffix: true,
                          locale: tr,
                        })
                      : "Yeni"}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{post.viewCount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
    </Link>
  );
}

function LoadingSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <Card className="overflow-hidden h-full">
      <Skeleton className={`w-full ${featured ? "h-96" : "h-48"}`} />
      <CardContent className="p-6">
        <Skeleton className={`${featured ? "h-8" : "h-6"} w-3/4 mb-2`} />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { data: posts, isLoading } = trpc.posts.getAll.useQuery({ limit: 13 });

  const featuredPost = posts?.[0];
  const regularPosts = posts?.slice(1) || [];

  return (
    <div className="container py-8">
      {/* Hero Section - Featured Post */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Öne Çıkan Haber</h2>
        {isLoading ? (
          <LoadingSkeleton featured />
        ) : featuredPost ? (
          <PostCard post={featuredPost} featured />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Henüz haber bulunmamaktadır.
          </div>
        )}
      </section>

      {/* Latest News Grid */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Son Haberler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)
            : regularPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </section>
    </div>
  );
}
