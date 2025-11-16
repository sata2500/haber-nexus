# HaberNexus - AI-Powered News & Information Platform

<p align="center">
  <img src="https://i.imgur.com/example.png" alt="HaberNexus Banner" width="600"/>
</p>

**HaberNexus** is a next-generation news and information platform developed with modern web technologies and the power of artificial intelligence. Our goal is not just to deliver news, but to facilitate access to information, enable user interaction, and foster a sense of community.

This project was initiated by **Salih TANRISEVEN** and is being developed in collaboration with **Manus AI**.

---

## ✨ Project Vision

- **AI-Powered Content**: Automated news scanning, analysis, and original article generation from RSS feeds using the Google Gemini API.
- **Broad Scope**: Up-to-date news from Turkey and the world, blog posts, and in-depth research content.
- **Advanced Management**: A role-based access control (RBAC) system for authors, editors, and admins to easily manage the platform.
- **Social Interaction**: A community where users can interact through comments, likes, follows, and notifications.
- **Open Source Philosophy**: A transparent development process and a structure open to community contributions.

---

## 🚀 Technology Stack

| Category              | Technology                                         | Description                                             |
| :-------------------- | :------------------------------------------------- | :------------------------------------------------------ |
| **Framework**         | [Next.js](https://nextjs.org/) 16 (App Router)     | High performance and SEO with SSR, SSG, and ISR.        |
| **Styling**           | [Tailwind CSS](https://tailwindcss.com/) v4        | Utility-first CSS for rapid and consistent design.      |
| **UI Components**     | [Shadcn/ui](https://ui.shadcn.com/)                | Accessible and customizable UI components.              |
| **Database**          | [PostgreSQL](https://www.postgresql.org/) (Neon)   | Scalable and reliable relational database.              |
| **ORM**               | [Prisma](https://www.prisma.io/)                   | Type-safe database operations and migration management. |
| **Authentication**    | [NextAuth.js](https://next-auth.js.org/) (Auth.js) | Email/password and social (Google) login support.       |
| **AI Provider**       | [Google Gemini API](https://ai.google.dev/)        | Text generation, analysis, and web research.            |
| **Form Management**   | [React Hook Form](https://react-hook-form.com/)    | Performant and flexible form management.                |
| **Schema Validation** | [Zod](https://zod.dev/)                            | Type-safe schema validation.                            |
| **Deployment**        | [Vercel](https://vercel.com/)                      | Optimized hosting and CI/CD for Next.js.                |

---

## 📦 Installation and Setup

Follow these steps to run the project on your local machine:

1.  **Clone the Repository**:

    ```bash
    git clone https://github.com/sata2500/haber-nexus.git
    cd haber-nexus
    ```

2.  **Install Dependencies**:

    ```bash
    pnpm install
    ```

3.  **Set Up Environment Variables**:

    Create a new file named `.env` by copying `.env.example` and enter your own information.

    ```bash
    cp .env.example .env
    ```

    Required fields:
    - `DATABASE_URL`: Your PostgreSQL connection string.
    - `AUTH_SECRET`: You can generate one with `openssl rand -base64 32`.
    - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Obtain from Google Cloud Console.
    - `GOOGLE_API_KEY`: Obtain from Google AI Studio.

4.  **Run Database Migration**:

    ```bash
    pnpm prisma migrate dev
    ```

5.  **Start the Development Server**:

    ```bash
    pnpm dev
    ```

    The application will now be running at [http://localhost:3000](http://localhost:3000).

---

## 🛣️ Development Roadmap

- **📍 Phase 1: Basic Setup (Completed)**
  - Project skeleton, Next.js, TypeScript, Tailwind CSS setup.
  - Prisma and database connection.
  - NextAuth.js for authentication infrastructure.

- **📍 Phase 2: Content Management System (Completed)**
  - Full CRUD APIs for Category and Article management.
  - Advanced admin panel pages (Category, Article, User management).
  - Dynamic article, category, and home pages.

- **⏳ Phase 3: AI Integration and RSS (In Progress)**
  - Google Gemini API integration.
  - RSS feed management and automated scanning.
  - AI-powered content generation (summaries, tags, rewriting).
  - Job queue system for background tasks (BullMQ).

- **⏳ Phase 4: Social Interaction and Community**
  - Advanced comment system (replies, moderation).
  - Like, save, and share features.
  - Author follow system and profile pages.
  - Notification system.

- **⏳ Phase 5: Advanced Features and Optimization**
  - Advanced search (full-text search, filtering).
  - SEO and performance optimizations (Sitemap, ISR, Image Optimization).
  - Newsletter and email notifications.
  - Multi-language support (i18n).

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Developer Guide](docs/guides/DEVELOPER_GUIDE.md)** - Development processes and best practices
- **[AI Features Guide](docs/guides/AI_FEATURES_GUIDE.md)** - AI features usage guide
- **[Deployment Instructions](docs/deployment/DEPLOYMENT_INSTRUCTIONS.md)** - Step-by-step deployment guide
- **[Development Roadmap](docs/plans/DEVELOPMENT_ROADMAP.md)** - Project roadmap
- **[Reports](docs/reports/)** - Development and improvement reports
- **[Analysis](docs/analysis/)** - Project analysis documents

For a complete overview of all documentation, see [docs/README.md](docs/README.md).

---

## 🤝 Contributing

This project is open source and open to community contributions. For detailed information, please review the `CONTRIBUTING.md` file.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
