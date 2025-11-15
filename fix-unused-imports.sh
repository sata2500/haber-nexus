#!/bin/bash

# Kullanılmayan import'ları temizle

# CardDescription - admin/content-creator/page.tsx
sed -i 's/, CardDescription//' app/admin/content-creator/page.tsx

# FileText - admin/content-creator/page.tsx  
sed -i 's/, FileText//' app/admin/content-creator/page.tsx

# User - author/profile/page.tsx
sed -i 's/import { User } from "lucide-react"//' app/author/profile/page.tsx

# ArrowLeft - profile/bookmarks/bookmarks-client.tsx
sed -i 's/import { ArrowLeft } from "lucide-react"//' app/profile/bookmarks/bookmarks-client.tsx

# ThumbsUp - profile/components/comments-tab.tsx
sed -i 's/, ThumbsUp//' app/profile/components/comments-tab.tsx

# useState - profile/components/profile-tabs.tsx
sed -i 's/import { useState } from "react"//' app/profile/components/profile-tabs.tsx

# Heart, Bookmark - components/article/article-card-actions.tsx
sed -i 's/import { Heart, Bookmark } from "lucide-react"//' components/article/article-card-actions.tsx

# analyzeSentiment - lib/ai/content-generator.ts
sed -i 's/, analyzeSentiment//' lib/ai/content-generator.ts

echo "Unused imports cleaned!"
