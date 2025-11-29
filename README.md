# HaberNexus - AI-Powered Automated News Platform

![HaberNexus](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)

**HaberNexus** is a fully automated news agency platform that leverages AI to generate high-quality content from RSS feeds. The system presents AI-generated articles through **7 distinct human personas**, ensuring authenticity and diverse perspectives across different news categories.

## 🌟 Features

- **7 AI-Powered Personas**: Each with unique expertise and writing style
  - Teknoloji & Bilim (Technology & Science)
  - Global Siyaset (Global Politics)
  - Ekonomi & Finans (Economy & Finance)
  - Sağlık & Yaşam (Health & Lifestyle)
  - Kültür & Sanat (Culture & Arts)
  - Spor (Sports)
  - Genel Gündem (General News)

- **Automated Content Generation**
  - RSS feed monitoring
  - AI-powered content creation using Google Gemini
  - Automatic categorization and author assignment
  - Image processing with watermarking
  - Duplicate detection

- **Modern UI/UX**
  - Responsive design (mobile-first)
  - Dark/Light mode toggle
  - Hero slider for featured news
  - Grid layout for latest articles
  - Author cards with persona details

- **Full Docker Support**
  - One-command deployment
  - PostgreSQL database
  - Next.js application
  - Worker service for automation

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript** (Strict mode)
- **Tailwind CSS** (Latest)
- **next-themes** (Dark mode)
- **tRPC** (Type-safe API)
- **React 19**

### Backend
- **Express.js**
- **Drizzle ORM**
- **PostgreSQL 16**
- **tRPC 11**

### Worker Service
- **Node.js**
- **Google Gemini API** (Content generation)
- **RSS Parser**
- **Sharp** (Image processing)

### DevOps
- **Docker & Docker Compose**
- **pnpm** (Package manager)

## 📦 Installation

### Prerequisites
- Docker & Docker Compose
- Node.js 22+ (for local development)
- pnpm (for local development)
- Google Gemini API key

### Quick Start with Docker

1. **Clone the repository**
```bash
git clone https://github.com/sata2500/haber-nexus.git
cd haber-nexus
```

2. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Run database migrations**
```bash
docker-compose exec app pnpm db:push
```

5. **Seed the database with personas**
```bash
docker-compose exec app npx tsx scripts/seed-authors.mjs
```

6. **Access the application**
- Frontend: http://localhost:3000
- Database: localhost:5432

### Local Development

1. **Install dependencies**
```bash
pnpm install
cd worker && npm install && cd ..
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Configure your DATABASE_URL and GEMINI_API_KEY
```

3. **Run database migrations**
```bash
pnpm db:push
```

4. **Seed the database**
```bash
npx tsx scripts/seed-authors.mjs
```

5. **Start development server**
```bash
pnpm dev
```

6. **Start worker (in another terminal)**
```bash
cd worker
npm run dev
```

## 🗂️ Project Structure

```
haber-nexus/
├── client/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── lib/           # Utilities
├── server/                # Backend (Express + tRPC)
│   ├── routers.ts         # API routes
│   ├── db.ts              # Database helpers
│   └── _core/             # Core server logic
├── drizzle/               # Database schema & migrations
│   └── schema.ts          # Database models
├── worker/                # AI Worker Service
│   ├── index.js           # Main worker logic
│   └── package.json       # Worker dependencies
├── scripts/               # Utility scripts
│   └── seed-authors.mjs   # Seed personas
├── docker-compose.yml     # Docker orchestration
├── Dockerfile             # App container
└── Dockerfile.worker      # Worker container
```

## 🤖 How It Works

1. **RSS Monitoring**: Worker service monitors configured RSS feeds every hour
2. **Duplicate Check**: Checks if the article already exists in the database
3. **Classification**: Analyzes content to determine category and assign appropriate persona
4. **Content Generation**: Uses Google Gemini to generate article in persona's style
5. **Image Processing**: Downloads, resizes, converts to WebP, and adds watermark
6. **Publication**: Saves to database and makes available on the website

## 🎨 Personas

Each persona has:
- **Unique name and avatar**
- **Specialty area** (e.g., Technology, Politics, Sports)
- **Bio and writing style**
- **Automatic assignment** based on article topic

## 🔧 Configuration

### RSS Feeds
Edit `worker/index.js` to add/remove RSS feeds:
```javascript
const RSS_FEEDS = [
  'https://www.bbc.com/turkce/index.xml',
  'https://www.ntv.com.tr/gundem.rss',
  // Add more feeds here
];
```

### Worker Interval
Change check frequency in `worker/index.js`:
```javascript
const CHECK_INTERVAL = 3600000; // 1 hour in milliseconds
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `JWT_SECRET` | Session secret | Yes |
| `VITE_APP_TITLE` | Application title | No |
| `VITE_APP_LOGO` | Logo path | No |

## 🚀 Deployment

### Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Manual Deployment
1. Build the application
```bash
pnpm build
```

2. Start the production server
```bash
pnpm start
```

3. Start the worker
```bash
cd worker && npm start
```

## 🧪 Testing

Run tests:
```bash
pnpm test
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👨‍💻 Developer

**Salih TANRISEVEN**
- GitHub: [@sata2500](https://github.com/sata2500)
- Email: salihtanriseven25@gmail.com

## 🌐 Domain

Production: [habernexus.com](https://habernexus.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, and AI**
