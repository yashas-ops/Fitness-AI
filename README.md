# ⚡ FitnessAI - AI-Powered Fitness Plan Generator

A full-stack web application that generates personalized workout and meal plans using an AI/RAG pipeline. Features 3 switchable themes, 3D visuals, JWT authentication, and beautiful charts.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **MongoDB** running locally (default: `mongodb://localhost:27017/fitnessai`)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root (already created with defaults):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fitnessai
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

### 3. Run the Application

Open **two terminals**:

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 🎨 Three Themes

| Theme | Style | Colors |
|-------|-------|--------|
| 🌌 **Cyberpunk** | Neon glow, dark vibes | Purple, Blue, Pink |
| 🍃 **Minimal** | Apple-like clean UI | White, Green, Blue |
| 🔥 **Athlete** | Bold, high contrast | Black, Red, Yellow |

Switch themes using the selector in the navbar.

## 🧠 AI/RAG Pipeline

The app uses a knowledge-based RAG system that:
1. Retrieves from a curated fitness knowledge base (exercises, nutrition, workout splits)
2. Matches exercises to user's equipment, fitness level, and goals
3. Calculates BMR/TDEE for personalized calorie targets
4. Generates structured weekly workout and meal plans

## 📁 Project Structure

```
fitnessai/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # Navbar, Charts, 3D Scene, etc.
│       ├── context/      # Auth & Theme providers
│       ├── pages/        # Landing, Dashboard, etc.
│       └── utils/        # API client
├── server/          # Express backend
│   ├── config/      # DB & env config
│   ├── controllers/ # Auth & Plan controllers
│   ├── middleware/   # JWT auth
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── services/    # RAG service
│   └── data/        # Fitness knowledge base
└── .env             # Environment variables
```

## ⚙️ Features

- ✅ JWT authentication (register/login)
- ✅ AI-powered workout plan generation
- ✅ AI-powered meal plan generation
- ✅ 3 switchable themes (Cyberpunk, Minimal, Athlete)
- ✅ 3D Three.js hero section
- ✅ Macro/calorie charts (Recharts)
- ✅ Download plans as PDF
- ✅ Share plans via link
- ✅ Edit plan titles
- ✅ Responsive design
- ✅ Framer Motion animations
- ✅ Glassmorphism & Neumorphism UI
- ✅ Skeleton loading states
- ✅ Multi-step fitness questionnaire

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Three.js, Recharts
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Auth**: JWT (jsonwebtoken, bcryptjs)
- **AI**: Knowledge-based RAG pipeline with fitness dataset
