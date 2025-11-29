import { drizzle } from "drizzle-orm/mysql2";
import { authors, categories } from "../drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const authorData = [
  {
    name: "Dr. Ayşe Yılmaz",
    slug: "ayse-yilmaz",
    avatarUrl: "https://i.pravatar.cc/300?img=5",
    bio: "Yapay zeka, uzay teknolojileri ve yeni nesil gadget'lar konusunda uzman teknoloji gazetecisi. 15 yıllık deneyimiyle sektörün nabzını tutuyor.",
    specialty: "Teknoloji & Bilim",
  },
  {
    name: "Mehmet Kaya",
    slug: "mehmet-kaya",
    avatarUrl: "https://i.pravatar.cc/300?img=12",
    bio: "Uluslararası ilişkiler ve jeopolitik analizlerde uzman. Dünya siyasetini yakından takip eden deneyimli bir gazeteci.",
    specialty: "Global Siyaset",
  },
  {
    name: "Zeynep Demir",
    slug: "zeynep-demir",
    avatarUrl: "https://i.pravatar.cc/300?img=9",
    bio: "Finans piyasaları ve ekonomi analisti. Borsa, kripto para ve global ekonomik trendleri takip ediyor.",
    specialty: "Ekonomi & Finans",
  },
  {
    name: "Dr. Elif Özkan",
    slug: "elif-ozkan",
    avatarUrl: "https://i.pravatar.cc/300?img=20",
    bio: "Tıp doktoru ve sağlıklı yaşam uzmanı. Wellness, beslenme ve modern tıp konularında yazıyor.",
    specialty: "Sağlık & Yaşam",
  },
  {
    name: "Can Arslan",
    slug: "can-arslan",
    avatarUrl: "https://i.pravatar.cc/300?img=33",
    bio: "Sanat eleştirmeni ve kültür yazarı. Sinema, müzik, edebiyat ve görsel sanatlar üzerine derinlemesine analizler yapıyor.",
    specialty: "Kültür & Sanat",
  },
  {
    name: "Burak Şahin",
    slug: "burak-sahin",
    avatarUrl: "https://i.pravatar.cc/300?img=15",
    bio: "Dinamik spor yorumcusu. Futbol, basketbol ve diğer spor dallarında güncel haberleri ve analizleri paylaşıyor.",
    specialty: "Spor",
  },
  {
    name: "Selin Aydın",
    slug: "selin-aydin",
    avatarUrl: "https://i.pravatar.cc/300?img=47",
    bio: "Tarafsız ve objektif gazetecilik anlayışıyla genel gündem haberlerini takip eden deneyimli muhabir.",
    specialty: "Genel Gündem",
  },
];

const categoryData = [
  {
    name: "Teknoloji & Bilim",
    slug: "teknoloji-bilim",
    description: "Yapay zeka, uzay, gadget'lar ve bilimsel gelişmeler",
  },
  {
    name: "Global Siyaset",
    slug: "global-siyaset",
    description: "Uluslararası ilişkiler ve dünya politikası",
  },
  {
    name: "Ekonomi & Finans",
    slug: "ekonomi-finans",
    description: "Piyasalar, borsa, kripto para ve ekonomik analizler",
  },
  {
    name: "Sağlık & Yaşam",
    slug: "saglik-yasam",
    description: "Sağlık, wellness, beslenme ve yaşam tarzı",
  },
  {
    name: "Kültür & Sanat",
    slug: "kultur-sanat",
    description: "Sinema, müzik, edebiyat ve görsel sanatlar",
  },
  {
    name: "Spor",
    slug: "spor",
    description: "Futbol, basketbol ve diğer spor dalları",
  },
  {
    name: "Genel Gündem",
    slug: "genel-gundem",
    description: "Güncel haberler ve genel konular",
  },
];

async function seed() {
  try {
    console.log("🌱 Seeding authors...");
    
    for (const author of authorData) {
      await db.insert(authors).values(author);
      console.log(`✓ Created author: ${author.name}`);
    }

    console.log("\n🌱 Seeding categories...");
    
    for (const category of categoryData) {
      await db.insert(categories).values(category);
      console.log(`✓ Created category: ${category.name}`);
    }

    console.log("\n✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
