import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded pages for code splitting
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GeneratePlan = lazy(() => import('./pages/GeneratePlan'));
const PlanDetail = lazy(() => import('./pages/PlanDetail'));
const SharedPlan = lazy(() => import('./pages/SharedPlan'));
const Profile = lazy(() => import('./pages/Profile'));

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6">
      <div className="w-full max-w-md animate-pulse space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        <div className="h-6 w-1/3 rounded bg-white/10" />
        <div className="h-4 w-2/3 rounded bg-white/10" />
        <div className="h-4 w-1/2 rounded bg-white/10" />
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <>
      <Navbar />
      <div>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/generate" element={<ProtectedRoute><GeneratePlan /></ProtectedRoute>} />
            <Route path="/plan/:id" element={<ProtectedRoute><PlanDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/shared/:shareToken" element={<SharedPlan />} />
          </Routes>
        </Suspense>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(13, 13, 13, 0.88)',
            color: 'var(--text-primary)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            backdropFilter: 'blur(12px)',
            boxShadow: 'var(--shadow-md)',
          },
        }}
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
