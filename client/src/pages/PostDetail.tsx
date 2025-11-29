import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Eye, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function PostDetail() {
  const [, params] = useRoute("/haber/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading } = trpc.posts.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-96 w-full mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Haber Bulunamadı</h1>
        <p className="text-muted-foreground mb-8">
          Aradığınız haber bulunamadı veya kaldırılmış olabilir.
        </p>
        <Link href="/">
          <a>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </a>
        </Link>
      </div>
    );
  }

  return (
    <article className="container py-8">
      {/* Back Button */}
      <Link href="/">
        <a>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
        </a>
      </Link>

      {/* Category Badge */}
      {post.category && (
        <div className="mb-4">
          <Link href={`/kategori/${post.category.slug}`}>
            <a>
              <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                {post.category.name}
              </span>
            </a>
          </Link>
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
        {post.title}
      </h1>

      {/* Meta Info */}
      <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-8">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>
            {post.publishedAt
              ? formatDistanceToNow(new Date(post.publishedAt), {
                  addSuffix: true,
                  locale: tr,
                })
              : "Yeni"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4" />
          <span>{post.viewCount || 0} görüntülenme</span>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImageUrl && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full h-auto max-h-[600px] object-cover"
          />
        </div>
      )}

      {/* Author Card */}
      {post.author && (
        <Card className="mb-8 bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={post.author.avatarUrl || undefined} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{post.author.name}</h3>
                <p className="text-sm text-muted-foreground">{post.author.specialty}</p>
                {post.author.bio && (
                  <p className="text-sm text-muted-foreground mt-2">{post.author.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <div className="text-xl text-muted-foreground mb-8 font-medium italic border-l-4 border-primary pl-6">
          {post.excerpt}
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }} />
      </div>

      {/* Source Link */}
      {post.sourceUrl && (
        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Kaynak:{" "}
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {new URL(post.sourceUrl).hostname}
            </a>
          </p>
        </div>
      )}
    </article>
  );
}
