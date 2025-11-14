-- Add advanced AI fields to Article table
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "qualityScore" DOUBLE PRECISION DEFAULT 0.5;
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "sentimentScore" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "sentimentType" TEXT DEFAULT 'neutral';
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "moderationScore" DOUBLE PRECISION DEFAULT 1.0;
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "factCheckScore" DOUBLE PRECISION DEFAULT 0.5;
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "detectedLanguage" TEXT DEFAULT 'tr';
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "coverImageAltText" TEXT;
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "coverImageDescription" TEXT;

-- Create index for quality score
CREATE INDEX IF NOT EXISTS "Article_qualityScore_idx" ON "Article"("qualityScore");
CREATE INDEX IF NOT EXISTS "Article_sentimentType_idx" ON "Article"("sentimentType");
CREATE INDEX IF NOT EXISTS "Article_detectedLanguage_idx" ON "Article"("detectedLanguage");

-- Add translation table for multilingual support
CREATE TABLE IF NOT EXISTS "ArticleTranslation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "articleId" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "ArticleTranslation_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "ArticleTranslation_articleId_language_key" ON "ArticleTranslation"("articleId", "language");
CREATE INDEX IF NOT EXISTS "ArticleTranslation_language_idx" ON "ArticleTranslation"("language");
