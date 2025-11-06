# 🎯 Rezumify - AI-Powered Resume Analyzer

<div align="center">

![Rezumify Banner](https://img.shields.io/badge/Rezumify-AI%20Resume%20Analyzer-blue?style=for-the-badge)

**Transform your resume with AI-powered insights and land your dream job**

[Live Demo](https://rezumify.vercel.app/) • [Report Bug](https://github.com/rajbodhak/resume-analyzer/issues) • [Request Feature](https://github.com/rajbodhak/resume-analyzer/issues)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)

</div>

---

## 🌟 Overview

**Rezumify** is an intelligent resume analysis platform that leverages Google's Gemini AI to provide job seekers with actionable insights to improve their resumes. Built with modern web technologies, it offers comprehensive analysis including ATS compatibility, keyword matching, and personalized recommendations.

### 🎓 Why Rezumify?

In today's competitive job market, having a well-optimized resume is crucial. Rezumify helps job seekers:

- **📊 Understand** how their resume performs against specific job descriptions
- **🔍 Identify** missing keywords and skills that ATS systems look for
- **✨ Improve** their resume with AI-powered recommendations
- **📈 Track** their progress with detailed analysis history
- **🎯 Match** their skills against job requirements with precision scoring

---

## ✨ Key Features

### 🤖 AI-Powered Analysis
- **Smart Resume Parsing**: Extracts and analyzes resume content with high accuracy
- **Job Description Matching**: Compares your resume against specific job postings
- **Compatibility Scoring**: Provides overall and job-specific compatibility scores
- **Keyword Analysis**: Identifies missing and found keywords crucial for ATS systems

### 📊 Comprehensive Insights
- **Skills Gap Analysis**: Highlights skills you have vs. skills the job requires
- **Improvement Recommendations**: Actionable suggestions to enhance your resume
- **Strengths & Weaknesses**: Clear breakdown of what works and what needs work
- **Experience Analysis**: Evaluates how well your experience aligns with requirements

### 👤 User Management
- **Guest Access**: Try 3 free analyses without creating an account
- **Authenticated Users**: Get 50 analyses with full history tracking
- **Analysis History**: View and revisit all past analyses (logged-in users only)
- **Secure Authentication**: Google OAuth integration for seamless login

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support**: Easy on the eyes with automatic theme detection
- **Intuitive Dashboard**: Clean interface to manage and review analyses
- **Real-time Feedback**: Instant visual indicators for scores and recommendations

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15.5](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management

### Backend
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[PostgreSQL](https://www.postgresql.org/)** (Supabase) - Reliable database
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication solution
- **[Google Gemini AI](https://ai.google.dev/)** - Advanced AI analysis

### Infrastructure
- **[Vercel](https://vercel.com/)** - Deployment and hosting
- **[Supabase](https://supabase.com/)** - Database hosting
- **Rate Limiting** - Custom implementation with LRU cache

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Supabase account)
- Google OAuth credentials
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajbodhak/resume-analyzer.git
   cd resume-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database (Supabase)
   DATABASE_URL="your_supabase_connection_string"
   DIRECT_URL="your_supabase_direct_url"

   # Google Gemini AI
   GEMINI_API_KEY="your_gemini_api_key"

   # Google OAuth
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"

   # NextAuth
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📸 Screenshots

> 🚧 **Coming Soon**: Screenshots and demo videos will be added to showcase the platform's features and user interface.

---

## 🎯 How It Works

1. **Upload Resume**: Upload your resume in PDF or DOCX format
2. **Add Job Description** (Optional): Paste the job description you're targeting
3. **AI Analysis**: Gemini AI analyzes your resume in seconds
4. **Review Results**: Get detailed scores, keyword matches, and recommendations
5. **Track Progress**: Save and revisit your analyses anytime (logged-in users)

---

## 🗺️ Roadmap

### ✅ Completed
- [x] AI-powered resume analysis
- [x] Job description matching
- [x] Skills and keyword analysis
- [x] User authentication (Google OAuth)
- [x] Analysis history tracking
- [x] Guest user support (3 free analyses)
- [x] Responsive design

### 🚧 In Progress
- [ ] Cover letter generation using AI
- [ ] Advanced recommendation engine
- [ ] Resume templates and formatting suggestions

### 🔮 Future Plans
- [ ] Multi-language support
- [ ] LinkedIn profile analysis
- [ ] Resume builder with AI assistance
- [ ] Interview preparation insights
- [ ] ATS compatibility checker enhancements
- [ ] Email notifications for analysis completion
- [ ] Export analysis as PDF report

---

## 📊 Project Structure

```
📦 resume-analyzer
├─ 📁 prisma/              # Database schema
├─ 📁 public/              # Static assets
├─ 📁 src/
│  ├─ 📁 app/              # Next.js App Router pages
│  │  ├─ 📁 api/           # API routes
│  │  ├─ 📁 auth/          # Authentication pages
│  │  ├─ 📁 dashboard/     # User dashboard
│  │  └─ 📁 upload/        # Resume upload page
│  ├─ 📁 components/       # React components
│  │  ├─ 📁 ui/            # shadcn/ui components
│  │  ├─ 📁 dashboard/     # Dashboard components
│  │  └─ 📁 upload/        # Upload & analysis components
│  ├─ 📁 lib/              # Utilities and helpers
│  │  ├─ ai.ts             # Gemini AI integration
│  │  ├─ parser.ts         # Resume parsing logic
│  │  ├─ prisma.ts         # Database client
│  │  └─ rate-limit.ts     # Rate limiting
│  └─ 📁 types/            # TypeScript type definitions
└─ 📄 package.json
```

---

## 🧠 Technical Highlights

### AI Integration
- Custom prompts engineered for accurate resume analysis
- Structured output parsing from Gemini AI responses
- Fallback mechanisms for robust error handling

### Performance
- Server-side rendering for optimal SEO
- Efficient database queries with Prisma
- Rate limiting to prevent abuse
- Optimized bundle size with Next.js 15

### Security
- Secure authentication with NextAuth.js
- Environment variable protection
- Input sanitization and validation
- CSRF protection

### User Experience
- Progressive enhancement
- Loading states and skeleton screens
- Error boundaries for graceful failures
- Accessible UI components (WCAG compliant)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 About the Developer

**Raj Bodhak**

This project was built to enhance my skills in AI integration and modern web development. Rezumify demonstrates proficiency in:

- 🤖 AI/ML integration (Google Gemini)
- ⚡ Modern React patterns and Next.js 15
- 🗄️ Database design and management
- 🔐 Authentication and security
- 🎨 UI/UX design principles
- 🚀 Full-stack development

### Connect with me:

[![GitHub](https://img.shields.io/badge/GitHub-rajbodhak-black?style=flat&logo=github)](https://github.com/rajbodhak)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-rajbodhak-blue?style=flat&logo=linkedin)](https://linkedin.com/in/rajbodhak)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Google Gemini](https://ai.google.dev/) for powerful AI capabilities
- [Vercel](https://vercel.com/) for seamless deployment
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Supabase](https://supabase.com/) for reliable database hosting

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Raj Bodhak](https://github.com/rajbodhak)

</div>