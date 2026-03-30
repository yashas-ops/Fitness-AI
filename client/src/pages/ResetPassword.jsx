import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import {
  Zap,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: 'var(--bg-primary)',
        paddingTop: '100px',
        paddingBottom: '60px'
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '500px', height: '500px', top: '20%', right: '10%',
            background: 'var(--accent-secondary)', opacity: 0.04, filter: 'blur(100px)',
          }}
          animate={{ x: [0, -40, 50, 0], y: [0, 30, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
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
          <h1 className="text-h1 mb-3">Reset Password</h1>
          <p className="text-body">Create a new password for your account</p>
        </div>

        <motion.div
          className="card-glow p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <motion.div
                className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(52, 211, 153, 0.15)' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--success)' }} />
              </motion.div>
              <h3 className="text-h3 mb-2">Password Reset!</h3>
              <p className="text-body text-sm">Redirecting to login...</p>
            </motion.div>
          ) : (
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
                  {error}
                </motion.div>
              )}

              <div>
                <label className="label flex items-center gap-2">
                  <Lock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    className="input input-lg pl-12"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <Lock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    className="input input-lg pl-12"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
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
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          )}

          <div className="divider-gradient my-6" />

          <p className="text-center text-body">
            <Link
              to="/login"
              className="font-semibold no-underline inline-flex items-center gap-1 transition-colors hover:opacity-80"
              style={{ color: 'var(--accent)' }}
            >
              Back to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
