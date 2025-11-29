import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  posts: router({
    getAll: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        const posts = await db.getAllPosts(input?.limit);
        return posts;
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await db.getPostBySlug(input.slug);
        if (!post) return null;
        
        // Increment view count
        await db.incrementPostViewCount(post.id);
        
        // Get author and category info
        const author = await db.getAllAuthors().then(authors => 
          authors.find(a => a.id === post.authorId)
        );
        const category = await db.getAllCategories().then(categories => 
          categories.find(c => c.id === post.categoryId)
        );
        
        return {
          ...post,
          author,
          category,
        };
      }),
    
    getByCategory: publicProcedure
      .input(z.object({ categoryId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        const posts = await db.getPostsByCategory(input.categoryId, input.limit);
        return posts;
      }),
    
    getByAuthor: publicProcedure
      .input(z.object({ authorId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        const posts = await db.getPostsByAuthor(input.authorId, input.limit);
        return posts;
      }),
  }),

  authors: router({
    getAll: publicProcedure.query(async () => {
      const authors = await db.getAllAuthors();
      return authors;
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const author = await db.getAuthorBySlug(input.slug);
        return author;
      }),
  }),

  categories: router({
    getAll: publicProcedure.query(async () => {
      const categories = await db.getAllCategories();
      return categories;
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const category = await db.getCategoryBySlug(input.slug);
        return category;
      }),
  }),
});

export type AppRouter = typeof appRouter;
