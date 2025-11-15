#!/bin/bash

# API route dosyalarındaki any tiplerini düzelt
FILES=(
  "app/api/content/generate/route.ts"
  "app/api/drafts/route.ts"
  "app/api/users/[id]/analytics/route.ts"
  "app/api/users/[id]/liked-articles/route.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    # Request tipini düzelt
    sed -i 's/request: any/request: Request/g' "$file"
    sed -i 's/req: any/req: Request/g' "$file"
    sed -i 's/data: any/data: unknown/g' "$file"
    sed -i 's/error: any/error: unknown/g' "$file"
    sed -i 's/result: any/result: unknown/g' "$file"
  fi
done

echo "Type fixes completed!"
