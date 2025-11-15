#!/bin/bash

# Session değişkenlerini yoruma al (gelecekte kullanılabilir)
files=(
  "app/admin/content-creator/page.tsx:9"
  "app/admin/users/[id]/edit/page.tsx:54"
  "app/admin/users/[id]/edit/page.tsx:32"
  "app/admin/users/[id]/edit/page.tsx:33"
  "app/articles/[slug]/article-client.tsx:20"
  "app/author/profile/page.tsx:80"
  "app/profile/edit/edit-client.tsx:24"
  "app/profile/profile-content.tsx:158"
  "components/article/comment-item.tsx:37"
  "components/article/comment-section.tsx:31"
)

echo "Kullanılmayan değişkenler için eslint-disable yorumları ekleniyor..."
echo "Manuel düzeltme gerekiyor - bu değişkenler kaldırılabilir veya kullanılabilir"

