import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try another email.');
    } finally {
      setLoading(false);
    }
  };

  const passwordValid = form.password.length >= 6;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: 'var(--bg-primary)',
        paddingTop: '100px',
        paddingBottom: '60px'
      }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '500px',
            height: '500px',
            top: '20%',
            left: '10%',
            background: 'var(--accent)',
            opacity: 0.05,
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '400px',
            height: '400px',
            bottom: '20%',
            right: '10%',
            background: 'var(--accent-secondary)',
            opacity: 0.03,
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, -40, 50, 0],
            y: [0, 30, -40, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="text-center mb-10">
          <Link to="/" className="no-underline inline-flex items-center gap-3 mb-8 group">
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: 'var(--gradient-accent)',
                boxShadow: '0 8px 32px var(--accent-glow)',
              }}
              whileHover={{ scale: 1.05, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
            </motion.div>
          </Link>
          <h1 className="text-h1 mb-3 break-words whitespace-normal leading-relaxed">Create your account</h1>
          <p className="text-body break-words whitespace-normal leading-relaxed">Start building plans that fit your routine.</p>
        </div>

        <motion.div
          className="card-glow p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl text-sm flex items-center gap-3"
                style={{
                  background: 'rgba(248, 113, 113, 0.1)',
                  color: 'var(--error)',
                  border: '1px solid rgba(248, 113, 113, 0.2)',
                }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="break-words whitespace-normal leading-relaxed">{error}</span>
              </motion.div>
            )}

            <div>
              <label className="label flex items-center gap-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="input input-lg pl-12"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="input input-lg pl-12"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="input input-lg pl-12"
                  placeholder="6+ characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                {passwordValid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success)' }} />
                    <span className="text-xs" style={{ color: 'var(--success)' }}>
                      Password meets requirements
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 rounded-full" style={{ border: '1px solid var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Must be at least 6 characters
                    </span>
                  </>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold text-base text-white"
              style={{
                background: 'var(--gradient-accent)',
                boxShadow: '0 4px 16px var(--accent-glow)',
              }}
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="divider-gradient my-6" />

          <p className="text-center text-body">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold no-underline inline-flex items-center gap-1 transition-colors hover:opacity-80"
              style={{ color: 'var(--accent)' }}
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
