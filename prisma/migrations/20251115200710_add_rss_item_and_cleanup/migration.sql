-- CreateEnum
CREATE TYPE "CleanupType" AS ENUM ('RSS_SCAN_LOGS', 'RSS_ITEMS', 'DRAFT_ARTICLES', 'ORPHANED_DATA', 'DATABASE_OPTIMIZE');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN "sourceGuid" TEXT;

-- AlterTable
ALTER TABLE "RssFeed" ADD COLUMN "lastItemDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "RssItem" (
    "id" TEXT NOT NULL,
    "rssFeedId" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "urlHash" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "description" TEXT,
    "pubDate" TIMESTAMP(3) NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "articleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "RssItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CleanupLog" (
    "id" TEXT NOT NULL,
    "type" "CleanupType" NOT NULL,
    "status" TEXT NOT NULL,
    "itemsDeleted" INTEGER NOT NULL DEFAULT 0,
    "itemsKept" INTEGER NOT NULL DEFAULT 0,
    "details" JSONB,
    "error" TEXT,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CleanupLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RssItem_urlHash_key" ON "RssItem"("urlHash");

-- CreateIndex
CREATE UNIQUE INDEX "RssItem_articleId_key" ON "RssItem"("articleId");

-- CreateIndex
CREATE INDEX "RssItem_rssFeedId_idx" ON "RssItem"("rssFeedId");

-- CreateIndex
CREATE INDEX "RssItem_urlHash_idx" ON "RssItem"("urlHash");

-- CreateIndex
CREATE INDEX "RssItem_processed_idx" ON "RssItem"("processed");

-- CreateIndex
CREATE INDEX "RssItem_pubDate_idx" ON "RssItem"("pubDate");

-- CreateIndex
CREATE INDEX "RssItem_rssFeedId_pubDate_idx" ON "RssItem"("rssFeedId", "pubDate");

-- CreateIndex
CREATE UNIQUE INDEX "RssItem_rssFeedId_guid_key" ON "RssItem"("rssFeedId", "guid");

-- CreateIndex
CREATE INDEX "CleanupLog_type_idx" ON "CleanupLog"("type");

-- CreateIndex
CREATE INDEX "CleanupLog_status_idx" ON "CleanupLog"("status");

-- CreateIndex
CREATE INDEX "CleanupLog_createdAt_idx" ON "CleanupLog"("createdAt");

-- CreateIndex
CREATE INDEX "Article_sourceGuid_idx" ON "Article"("sourceGuid");

-- AddForeignKey
ALTER TABLE "RssItem" ADD CONSTRAINT "RssItem_rssFeedId_fkey" FOREIGN KEY ("rssFeedId") REFERENCES "RssFeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RssItem" ADD CONSTRAINT "RssItem_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
