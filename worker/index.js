import dotenv from 'dotenv';
import Parser from 'rss-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import sharp from 'sharp';
import axios from 'axios';
import { eq } from 'drizzle-orm';
import { posts, authors, categories } from '../drizzle/schema.js';

dotenv.config({ path: '../.env' });

// Configuration
const RSS_FEEDS = [
  'https://www.bbc.com/turkce/index.xml',
  'https://www.ntv.com.tr/gundem.rss',
  'https://www.cnnturk.com/feed/rss/all/news',
];

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const CHECK_INTERVAL = 3600000; // 1 hour in milliseconds

// Initialize services
const parser = new Parser();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Database connection
let db;
async function initDatabase() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    db = drizzle(connection);
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Fetch all authors and categories once
let authorsCache = [];
let categoriesCache = [];

async function loadCache() {
  try {
    authorsCache = await db.select().from(authors);
    categoriesCache = await db.select().from(categories);
    console.log(`✅ Loaded ${authorsCache.length} authors and ${categoriesCache.length} categories`);
  } catch (error) {
    console.error('❌ Failed to load cache:', error);
  }
}

// Classify content and assign author/category
function classifyContent(title, description) {
  const content = `${title} ${description}`.toLowerCase();
  
  const keywords = {
    'teknoloji-bilim': ['yapay zeka', 'ai', 'teknoloji', 'bilim', 'uzay', 'robot', 'yazılım', 'internet', 'gadget'],
    'global-siyaset': ['siyaset', 'politika', 'seçim', 'hükümet', 'başkan', 'diplomat', 'uluslararası'],
    'ekonomi-finans': ['ekonomi', 'borsa', 'dolar', 'euro', 'kripto', 'bitcoin', 'finans', 'piyasa', 'yatırım'],
    'saglik-yasam': ['sağlık', 'tıp', 'doktor', 'hastane', 'tedavi', 'beslenme', 'diyet', 'wellness'],
    'kultur-sanat': ['sanat', 'müzik', 'sinema', 'film', 'kitap', 'edebiyat', 'sergi', 'konser'],
    'spor': ['futbol', 'basketbol', 'spor', 'maç', 'takım', 'şampiyon', 'lig', 'turnuva'],
  };

  for (const [categorySlug, keywordList] of Object.entries(keywords)) {
    if (keywordList.some(keyword => content.includes(keyword))) {
      const category = categoriesCache.find(c => c.slug === categorySlug);
      const author = authorsCache.find(a => a.specialty === category?.name);
      return { category, author };
    }
  }

  // Default to "Genel Gündem"
  const category = categoriesCache.find(c => c.slug === 'genel-gundem');
  const author = authorsCache.find(a => a.specialty === 'Genel Gündem');
  return { category, author };
}

// Generate slug from title
function generateSlug(title) {
  const turkishMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  
  return title
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// Check if post already exists
async function isDuplicate(title, sourceUrl) {
  try {
    const slug = generateSlug(title);
    const existing = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
    return existing.length > 0;
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return false;
  }
}

// Generate content with AI
async function generateContent(item, author) {
  try {
    const prompt = `Sen ${author.name} adında bir gazeteci ve ${author.specialty} konusunda uzmansın. ${author.bio}

Aşağıdaki haber başlığı ve özeti için profesyonel bir haber makalesi yaz:

Başlık: ${item.title}
Özet: ${item.contentSnippet || item.description || ''}

Lütfen:
1. Kendi üslubunla, ${author.specialty} alanındaki uzmanlığını yansıtarak yaz
2. En az 500 kelimelik detaylı bir makale oluştur
3. Objektif ve bilgilendirici ol
4. Türkçe dilbilgisi kurallarına uy
5. Sadece makale içeriğini döndür, başlık veya meta bilgi ekleme

Makale:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    // Generate excerpt (first 200 chars)
    const excerpt = content.substring(0, 200) + '...';

    return { content, excerpt };
  } catch (error) {
    console.error('Error generating content:', error);
    return null;
  }
}

// Download and process image
async function processImage(imageUrl) {
  try {
    // Download image
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    // Resize and convert to WebP
    const processedImage = await sharp(imageBuffer)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer();

    // Add watermark
    const watermarkedImage = await sharp(processedImage)
      .composite([{
        input: Buffer.from(
          `<svg width="200" height="40">
            <text x="10" y="30" font-family="Arial" font-size="24" font-weight="bold" fill="white" opacity="0.7">HaberNexus</text>
          </svg>`
        ),
        gravity: 'southeast',
      }])
      .toBuffer();

    // In production, upload to S3 or CDN
    // For now, return a placeholder URL
    return `https://placehold.co/1200x675/e2e8f0/64748b?text=HaberNexus`;
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
}

// Process a single RSS item
async function processRSSItem(item, feedUrl) {
  try {
    // Check for duplicates
    if (await isDuplicate(item.title, item.link)) {
      console.log(`⏭️  Skipping duplicate: ${item.title}`);
      return;
    }

    console.log(`📰 Processing: ${item.title}`);

    // Classify and assign author/category
    const { category, author } = classifyContent(item.title, item.contentSnippet || item.description || '');
    
    if (!category || !author) {
      console.log(`⚠️  Could not classify: ${item.title}`);
      return;
    }

    // Generate content with AI
    const generated = await generateContent(item, author);
    if (!generated) {
      console.log(`❌ Failed to generate content for: ${item.title}`);
      return;
    }

    // Process image if available
    let featuredImageUrl = null;
    if (item.enclosure?.url || item['media:thumbnail']?.$?.url) {
      const imageUrl = item.enclosure?.url || item['media:thumbnail'].$?.url;
      featuredImageUrl = await processImage(imageUrl);
    }

    // Create post
    const slug = generateSlug(item.title);
    const now = new Date();

    await db.insert(posts).values({
      title: item.title,
      slug,
      excerpt: generated.excerpt,
      content: generated.content,
      featuredImageUrl,
      authorId: author.id,
      categoryId: category.id,
      published: true,
      sourceUrl: item.link,
      publishedAt: now,
      viewCount: 0,
    });

    console.log(`✅ Created post: ${item.title} (Author: ${author.name}, Category: ${category.name})`);
  } catch (error) {
    console.error(`❌ Error processing item "${item.title}":`, error);
  }
}

// Fetch and process RSS feeds
async function processFeed(feedUrl) {
  try {
    console.log(`\n🔄 Fetching feed: ${feedUrl}`);
    const feed = await parser.parseURL(feedUrl);
    
    console.log(`📊 Found ${feed.items.length} items in feed`);
    
    // Process only the latest 5 items to avoid overwhelming the system
    const itemsToProcess = feed.items.slice(0, 5);
    
    for (const item of itemsToProcess) {
      await processRSSItem(item, feedUrl);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } catch (error) {
    console.error(`❌ Error processing feed ${feedUrl}:`, error);
  }
}

// Main worker loop
async function runWorker() {
  console.log('\n🚀 Starting HaberNexus Worker...');
  
  await initDatabase();
  await loadCache();

  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('⚠️  Worker will run in test mode without AI content generation');
  }

  console.log(`\n📡 Monitoring ${RSS_FEEDS.length} RSS feeds`);
  console.log(`⏰ Check interval: ${CHECK_INTERVAL / 1000 / 60} minutes\n`);

  // Initial run
  for (const feedUrl of RSS_FEEDS) {
    await processFeed(feedUrl);
  }

  // Schedule periodic checks
  setInterval(async () => {
    console.log('\n⏰ Running scheduled check...');
    for (const feedUrl of RSS_FEEDS) {
      await processFeed(feedUrl);
    }
  }, CHECK_INTERVAL);
}

// Start the worker
runWorker().catch(error => {
  console.error('❌ Worker crashed:', error);
  process.exit(1);
});
