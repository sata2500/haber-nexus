import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, authors, categories, posts, InsertPost, Post, Author, Category } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Authors
export async function getAllAuthors(): Promise<Author[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(authors);
  return result;
}

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(authors).where(eq(authors.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Categories
export async function getAllCategories(): Promise<Category[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(categories);
  return result;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Posts
export async function getAllPosts(limit = 20): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  
  return result;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPostsByCategory(categoryId: number, limit = 20): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.categoryId, categoryId), eq(posts.published, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  
  return result;
}

export async function getPostsByAuthor(authorId: number, limit = 20): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.authorId, authorId), eq(posts.published, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  
  return result;
}

export async function createPost(post: InsertPost): Promise<Post> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(posts).values(post);
  const insertedId = Number(result[0].insertId);
  
  const newPost = await db.select().from(posts).where(eq(posts.id, insertedId)).limit(1);
  if (newPost.length === 0) throw new Error("Failed to retrieve created post");
  
  return newPost[0];
}

export async function incrementPostViewCount(postId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const post = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  if (post.length === 0) return;
  
  await db
    .update(posts)
    .set({ viewCount: (post[0].viewCount || 0) + 1 })
    .where(eq(posts.id, postId));
}
