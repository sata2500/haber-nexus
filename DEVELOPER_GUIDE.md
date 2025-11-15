# HaberNexus Developer Guide

This comprehensive guide will help you understand the project structure, development workflow, and best practices for contributing to HaberNexus.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Development Workflow](#development-workflow)
3. [Code Quality](#code-quality)
4. [Database Management](#database-management)
5. [API Development](#api-development)
6. [Component Development](#component-development)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## Project Structure

```
haber-nexus/
├── app/                      # Next.js App Router pages and API routes
│   ├── (auth)/              # Authentication pages (signin, signup)
│   ├── admin/               # Admin dashboard pages
│   ├── author/              # Author dashboard pages
│   ├── editor/              # Editor dashboard pages
│   ├── profile/             # User profile pages
│   ├── api/                 # API routes
│   │   ├── articles/        # Article CRUD endpoints
│   │   ├── auth/            # Authentication endpoints
│   │   ├── ai/              # AI-powered features
│   │   └── ...              # Other API endpoints
│   ├── articles/            # Public article pages
│   ├── categories/          # Category pages
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # Shadcn/ui components
│   ├── layout/              # Layout components (Header, Footer)
│   ├── article/             # Article-related components
│   ├── editor/              # Rich text editor components
│   └── ...                  # Other components
├── lib/                     # Utility functions and configurations
│   ├── ai/                  # AI-related utilities
│   ├── auth.ts              # NextAuth configuration
│   ├── prisma.ts            # Prisma client instance
│   ├── permissions.ts       # RBAC utilities
│   └── ...                  # Other utilities
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── public/                  # Static assets
├── scripts/                 # Utility scripts
└── types/                   # TypeScript type definitions
```

---

## Development Workflow

### 1. Setting Up Your Development Environment

```bash
# Clone the repository
git clone https://github.com/sata2500/haber-nexus.git
cd haber-nexus

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
pnpm prisma migrate dev

# Start development server
pnpm dev
```

### 2. Creating a New Feature

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Run linting and type checking
pnpm lint
pnpm build

# Commit your changes
git commit -m "feat: Add your feature description"

# Push to your fork
git push origin feature/your-feature-name
```

### 3. Available Scripts

```bash
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Run ESLint
pnpm lint:fix      # Fix ESLint errors automatically
pnpm prisma:studio # Open Prisma Studio (database GUI)
pnpm prisma:generate # Generate Prisma Client
```

---

## Code Quality

### TypeScript Best Practices

1. **Avoid `any` types**: Always use proper type definitions
2. **Use interfaces for object shapes**: Define clear interfaces for data structures
3. **Leverage type inference**: Let TypeScript infer types when possible
4. **Use strict mode**: The project uses `strict: true` in `tsconfig.json`

### ESLint Rules

The project uses ESLint with the following key rules:

- `@typescript-eslint/no-explicit-any`: Disallow `any` types
- `@typescript-eslint/no-unused-vars`: Disallow unused variables
- `react-hooks/rules-of-hooks`: Enforce React Hooks rules
- `react-hooks/exhaustive-deps`: Enforce useEffect dependencies

### Code Formatting

- Use **2 spaces** for indentation
- Use **semicolons**
- Use **double quotes** for strings
- Max line length: **100 characters**

---

## Database Management

### Prisma Workflow

```bash
# Create a new migration
pnpm prisma migrate dev --name your-migration-name

# Apply migrations to production
pnpm prisma migrate deploy

# Reset database (development only)
pnpm prisma migrate reset

# Generate Prisma Client after schema changes
pnpm prisma generate

# Open Prisma Studio
pnpm prisma:studio
```

### Schema Best Practices

1. **Use proper relations**: Define relations between models correctly
2. **Add indexes**: Index frequently queried fields
3. **Use enums**: Define enums for fixed sets of values
4. **Add default values**: Set sensible defaults for fields

---

## API Development

### API Route Structure

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await prisma.example.findMany()
    
    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
```

### Error Handling

Always use proper error handling:

```typescript
try {
  // Your code
} catch (error: unknown) {
  console.error("Error:", error)
  return NextResponse.json(
    { error: "Descriptive error message" },
    { status: 500 }
  )
}
```

---

## Component Development

### Component Structure

```typescript
// components/example/example-component.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ExampleComponentProps {
  title: string
  onAction?: () => void
}

export function ExampleComponent({ title, onAction }: ExampleComponentProps) {
  const [state, setState] = useState<string>("")

  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={onAction}>Click me</Button>
    </div>
  )
}
```

### Best Practices

1. **Use TypeScript interfaces** for props
2. **Destructure props** in function parameters
3. **Use proper naming**: PascalCase for components, camelCase for functions
4. **Keep components small**: Split large components into smaller ones
5. **Use React Hooks properly**: Follow the rules of hooks

---

## Testing

### Unit Testing (Coming Soon)

The project will use **Jest** and **React Testing Library** for unit tests.

```bash
# Run tests (when implemented)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

---

## Deployment

### Vercel Deployment

The project is configured for deployment on Vercel:

1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy**: Vercel will automatically deploy on push to `main`

### Environment Variables

Required environment variables for production:

```env
DATABASE_URL=your_production_database_url
AUTH_SECRET=your_production_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_API_KEY=your_google_api_key
NEXTAUTH_URL=https://your-domain.com
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## Getting Help

If you need help or have questions:

1. Check the [GitHub Issues](https://github.com/sata2500/haber-nexus/issues)
2. Read the [Contributing Guide](CONTRIBUTING.md)
3. Contact the maintainers at [salihtanriseven@gmail.com](mailto:salihtanriseven@gmail.com)

Happy coding! 🚀
