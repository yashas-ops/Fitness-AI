# ⚡ FitnessAI — AI-Powered Fitness & Nutrition Planner

<div align="center">

**A premium full-stack MERN application that generates personalized workout and meal plans using an AI/RAG pipeline.**

Built with React 19 · Express · MongoDB · Three.js · Framer Motion

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## ✨ Features

### 🧠 AI Plan Generation
- **RAG Pipeline** — Retrieves from a curated fitness knowledge base (exercises, nutrition, workout splits)
- **Smart Matching** — Matches exercises to your equipment, fitness level, and goals
- **BMR/TDEE Calculations** — Personalized calorie and macro targets based on body metrics
- **Structured Output** — Generates complete weekly workout + meal plans in one request

### 🏋️ Fitness & Nutrition
- **Multi-step Questionnaire** — Goal, experience level, body metrics, diet preference, equipment
- **Workout Plans** — Day-by-day split with exercises, sets, reps, and rest periods
- **Meal Plans** — Daily meals with calories, protein, carbs, and fats per meal
- **Macro & Calorie Charts** — Visual breakdowns with Recharts (pie, bar, radar)
- **PDF Export** — Download any plan as a formatted PDF
- **Shareable Links** — Share plans publicly via unique token URLs

### 🎮 Skill & XP System
- **5 Skill Trees** — Strength, Endurance, Flexibility, Balance, Cardio
- **XP Progression** — Earn XP with each generated plan based on your training focus
- **Level System** — Visual level progression with animated progress bars
- **Radar Chart** — See your overall fitness profile at a glance

### 🔐 Authentication
- **JWT Auth** — Secure register/login with bcrypt password hashing
- **Password Reset** — Email-based forgot password flow via Nodemailer
- **Profile Management** — Edit display name, view account details
- **Protected Routes** — All app routes require authentication

### 🎨 Premium Design
- **Dark Obsidian Theme** — Deep charcoal base with red/orange accent gradients
- **3D Hero Section** — Interactive Three.js bodybuilder model with auto-rotate on the landing page
- **Framer Motion** — Page transitions, staggered reveals, micro-interactions throughout
- **Glassmorphism** — Frosted-glass cards with subtle backdrop blur
- **Responsive** — Fully mobile-optimized across all breakpoints
- **Skeleton Loaders** — Graceful loading states for every data-dependent view

### ⚡ Performance Optimized
- **Code Splitting** — React.lazy + Suspense for all page routes
- **Vite Chunk Splitting** — Separate vendor chunks for Three.js, Recharts, jsPDF, Framer Motion
- **Gzip Compression** — Server-side response compression via `compression` middleware
- **MongoDB Indexes** — Compound indexes on `userId + createdAt` and sparse index on `shareToken`
- **Lean Queries** — `.lean()` on all read-only Mongoose queries for faster serialization
- **Memoization** — `useMemo`, `useCallback`, and `React.memo` on expensive computations and heavy components

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **MongoDB** running locally or a MongoDB Atlas connection string
- **Google API Key** (for Gemini LLM in the RAG pipeline)

### 1. Clone & Install

```bash
git clone https://github.com/yashas-ops/Fitness-AI.git
cd Fitness-AI

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fitnessai
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
GOOGLE_API_KEY=your_google_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> **Note:** `EMAIL_USER` and `EMAIL_PASS` are required for the password reset feature. Use a [Gmail App Password](https://support.google.com/accounts/answer/185833) for `EMAIL_PASS`.

### 3. Run the Application

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 📁 Project Structure

```
Fitness-AI/
├── client/                    # React + Vite frontend
│   ├── public/
│   │   └── models/            # 3D GLB model files
│   └── src/
│       ├── components/
│       │   ├── plan/          # WorkoutDayCard, MealDayCard
│       │   ├── ui/            # Badge, Card, ProgressBar, UnitDropdown
│       │   ├── Navbar.jsx
│       │   ├── ProgressChart.jsx
│       │   ├── MacroChart.jsx
│       │   ├── SkeletonLoader.jsx
│       │   ├── BodybuilderHeroCanvas.jsx
│       │   ├── Bodybuilder3D.jsx
│       │   └── ErrorBoundary.jsx
│       ├── context/           # AuthContext, ThemeContext
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Dashboard.jsx
│       │   ├── GeneratePlan.jsx
│       │   ├── PlanDetail.jsx
│       │   ├── Profile.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── ResetPassword.jsx
│       │   └── SharedPlan.jsx
│       ├── utils/             # Axios API client
│       └── App.jsx            # Router + lazy loading
│
├── server/                    # Express backend
│   ├── config/                # DB connection, env config
│   ├── controllers/
│   │   ├── authController.js  # Register, login, profile, password reset
│   │   └── planController.js  # CRUD plans, generate, skills, share
│   ├── middleware/            # JWT auth middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Plan.js            # Indexed: userId+createdAt, shareToken
│   │   └── UserSkills.js      # 5-skill XP/level tracking
│   ├── routes/                # Auth & plan API routes
│   ├── services/
│   │   └── ragService.js      # RAG pipeline + Gemini LLM
│   └── data/                  # Curated fitness knowledge base
│
├── .gitignore
└── README.md
```

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite 6, Tailwind CSS v4, Framer Motion, Three.js, React Three Fiber, Recharts, jsPDF |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Email** | Nodemailer (Gmail SMTP) |
| **AI/RAG** | LangChain, Google Gemini, MemoryVectorStore, recursive text splitting |
| **3D** | Three.js, @react-three/fiber, @react-three/drei |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Login & receive JWT |
| `GET` | `/api/auth/profile` | Get user profile |
| `PUT` | `/api/auth/profile` | Update display name |
| `POST` | `/api/auth/forgot-password` | Send password reset email |
| `POST` | `/api/auth/reset-password/:token` | Reset password with token |

### Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/plans/generate` | Generate AI workout + meal plan |
| `GET` | `/api/plans` | List all user plans |
| `GET` | `/api/plans/skills` | Get user skill/XP data |
| `GET` | `/api/plans/:id` | Get single plan detail |
| `PUT` | `/api/plans/:id` | Update plan (title, sharing) |
| `DELETE` | `/api/plans/:id` | Delete a plan |
| `GET` | `/api/plans/shared/:shareToken` | Get publicly shared plan |

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

<div align="center">

**Built with ❤️ by [Yashas](https://github.com/yashas-ops)**

</div>
