export interface Media {
  id: string
  alt?: string
  caption?: string
  url?: string
  filename?: string
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
  sizes?: {
    thumbnail?: {
      url?: string
      width?: number
      height?: number
    }
    card?: {
      url?: string
      width?: number
      height?: number
    }
    tablet?: {
      url?: string
      width?: number
      height?: number
    }
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface User {
  id: string
  name?: string
  email: string
  role: 'admin' | 'editor' | 'user'
  avatar?: Media | string
  bio?: string
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: Record<string, any> // Rich text content
  featuredImage: Media | string
  category: Category | string
  tags?: (Tag | string)[]
  author: User | string
  status: 'draft' | 'published'
  isFeatured: boolean
  publishedAt?: string
  views: number
  createdAt: string
  updatedAt: string
}

export interface PaginatedDocs<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}
