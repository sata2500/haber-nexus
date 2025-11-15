#!/bin/bash

# Son temizlik - kullanılmayan import'lar

# ArrowLeft - bookmarks-client.tsx
sed -i '/import.*ArrowLeft.*from.*lucide-react/d' app/profile/bookmarks/bookmarks-client.tsx

# Heart, Bookmark - article-card-actions.tsx  
sed -i '/import.*Heart.*Bookmark.*from.*lucide-react/d' components/article/article-card-actions.tsx

# analyzeSentiment - content-generator.ts
sed -i 's/import { analyzeSentiment } from/import {/' lib/ai/content-generator.ts
sed -i 's/import { } from/@\/lib\/ai\/openai-client/d' lib/ai/content-generator.ts

echo "Final cleanup done!"
