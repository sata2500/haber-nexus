import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Eye, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

function PostCard({ post }: { post: any }) {
  const { data: author } = trpc.authors.getAll.useQuery(undefined, {
    select: (authors) => authors.find((a) => a.id === post.authorId),
  });

  return (
    <Link href={`/haber/${post.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer">
          <div className="relative h-48">
            <img
              src={post.featuredImageUrl || "https://placehold.co/1200x675/e2e8f0/64748b?text=HaberNexus"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
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

function LoadingSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <Skeleton className="w-full h-48" />
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function CategoryPage() {
  const [, params] = useRoute("/kategori/:slug");
  const slug = params?.slug || "";

  const { data: category, isLoading: categoryLoading } = trpc.categories.getBySlug.useQuery({ slug });
  const { data: posts, isLoading: postsLoading } = trpc.posts.getByCategory.useQuery(
    { categoryId: category?.id || 0, limit: 20 },
    { enabled: !!category }
  );

  if (categoryLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Kategori Bulunamadı</h1>
        <p className="text-muted-foreground mb-8">
          Aradığınız kategori bulunamadı.
        </p>
        <Link href="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri
        </Button>
      </Link>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground text-lg">{category.description}</p>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postsLoading
          ? Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)
          : posts && posts.length > 0
          ? posts.map((post) => <PostCard key={post.id} post={post} />)
          : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Bu kategoride henüz haber bulunmamaktadır.
            </div>
          )}
      </div>
    </div>
  );
}
