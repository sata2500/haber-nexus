// Profile bileşenleri için tip tanımlamaları

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl?: string
  publishedAt: Date | string
  createdAt: Date | string
  updatedAt: Date | string
  categoryId: string
  authorId: string
  category?: Category
  author?: Author
  _count?: {
    likes: number
    comments: number
    bookmarks: number
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Author {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  role: string
}

export interface Bookmark {
  id: string
  userId: string
  articleId: string
  bookmarkedAt: Date | string
  article: Article
}

export interface Comment {
  id: string
  content: string
  createdAt: Date | string
  updatedAt: Date | string
  userId: string
  articleId: string
  user: {
    id: string
    name: string
    image?: string
  }
  article: {
    id: string
    title: string
    slug: string
  }
}

export interface Like {
  id: string
  userId: string
  articleId: string
  likedAt: Date | string
  article: Article
}

export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: Date | string
  following: Author
}

export interface ReadingHistory {
  id: string
  userId: string
  articleId: string
  readAt: Date | string
  readDuration: number
  progress: number
  article: Article
}

export interface UserStats {
  totalArticlesRead: number
  totalReadingTime: number
  totalLikes: number
  totalComments: number
  totalBookmarks: number
  followersCount: number
  followingCount: number
}

export interface UserAnalytics {
  readingByCategory: {
    category: string
    count: number
  }[]
  readingByDay: {
    date: string
    count: number
  }[]
  topAuthors: {
    author: string
    count: number
  }[]
}

export interface UserSettings {
  id: string
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  newsletter: boolean
  theme: string
  language: string
}

export interface PaginationData {
  page: number
  limit: number
  totalPages: number
  totalItems: number
}

export interface BookmarkedArticlesResponse {
  bookmarks: Bookmark[]
  pagination: PaginationData
}

export interface LikedArticlesResponse {
  likes: Like[]
  pagination: PaginationData
}

export interface CommentsResponse {
  comments: Comment[]
  pagination: PaginationData
}

export interface FollowedAuthorsResponse {
  follows: Follow[]
  pagination: PaginationData
}

export interface ReadingHistoryResponse {
  history: ReadingHistory[]
  pagination: PaginationData
}
