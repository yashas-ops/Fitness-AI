import { memo, useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  User,
  X,
  Zap,
} from 'lucide-react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/generate', label: 'Generate', icon: Sparkles },
  { to: '/profile', label: 'Profile', icon: User },
];

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((open) => !open);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      <motion.nav
        className={`navbar-container ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-page h-full">
          <div className="flex h-full items-center justify-between gap-4">
            <Link to="/" className="no-underline flex items-center gap-3 min-w-0">
              <motion.div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  background: 'var(--gradient-accent)',
                  boxShadow: '0 18px 34px rgba(249, 115, 22, 0.2)',
                }}
                whileHover={{ scale: 1.03, rotate: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="h-5 w-5 text-white" strokeWidth={2.4} />
              </motion.div>
              <div className="min-w-0">
                <div
                  className="break-words whitespace-normal leading-relaxed text-lg font-semibold text-white"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
                >
                  FitnessAI
                </div>
                <div className="hidden break-words whitespace-normal text-[0.68rem] uppercase tracking-[0.24em] text-white/45 sm:block">
                  Plans that fit real life
                </div>
              </div>
            </Link>

            {isAuthenticated && (
              <div className="hidden items-center rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-md md:flex">
                {navLinks.map(({ to, label, icon: Icon }) => {
                  const active = isActive(to);
                  return (
                    <Link key={to} to={to} className="no-underline">
                      <motion.span
                        className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
                        style={{
                          color: active ? '#fff' : 'var(--text-secondary)',
                          background: active ? 'linear-gradient(135deg, rgba(239,68,68,0.22), rgba(249,115,22,0.2))' : 'transparent',
                          border: active ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                          boxShadow: active ? '0 16px 28px rgba(0,0,0,0.18)' : 'none',
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </motion.span>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="hidden items-center gap-3 md:flex">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-md">
                    <UserAvatar
                      user={user}
                      className="h-10 w-10"
                      imageClassName="rounded-full"
                      fallbackClassName="text-sm font-bold"
                    />
                    <div className="min-w-0">
                      <div className="max-w-[160px] break-words whitespace-normal leading-relaxed text-sm font-semibold text-white">
                        {user?.name || 'Athlete'}
                      </div>
                      <div className="max-w-[180px] break-words whitespace-normal leading-relaxed text-xs text-white/45">
                        Ready for your next plan
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleLogout}
                    className="secondary-button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/login" className="no-underline">
                    <motion.button
                      className="secondary-button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Sign in
                    </motion.button>
                  </Link>
                  <Link to="/register" className="no-underline">
                    <motion.button
                      className="primary-button btn-premium"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Get started
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            <motion.button
              type="button"
              onClick={toggleMobileMenu}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white backdrop-blur-md md:hidden"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? 'close' : 'menu'}
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-[98] bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="fixed inset-x-4 top-[84px] z-[99] rounded-[1.75rem] border border-white/10 bg-[#0b0b0bcc] p-4 shadow-2xl backdrop-blur-md md:hidden"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="space-y-3">
                {isAuthenticated && (
                  <>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                      <UserAvatar
                        user={user}
                        className="h-11 w-11"
                        imageClassName="rounded-full"
                        fallbackClassName="text-sm font-bold"
                      />
                      <div className="min-w-0">
                        <div className="break-words whitespace-normal leading-relaxed text-sm font-semibold text-white">
                          {user?.name || 'Athlete'}
                        </div>
                        <div className="break-words whitespace-normal leading-relaxed text-xs text-white/45">
                          FitnessAI member
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {navLinks.map(({ to, label, icon: Icon }) => {
                        const active = isActive(to);
                        return (
                          <Link key={to} to={to} className="no-underline block" onClick={closeMobileMenu}>
                            <motion.div
                              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium"
                              style={{
                                color: active ? '#fff' : 'var(--text-secondary)',
                                background: active ? 'linear-gradient(135deg, rgba(239,68,68,0.24), rgba(249,115,22,0.18))' : 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Icon className="h-4 w-4" />
                              {label}
                            </motion.div>
                          </Link>
                        );
                      })}
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleLogout}
                      className="secondary-button w-full"
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </motion.button>
                  </>
                )}

                {!isAuthenticated && (
                  <div className="space-y-3">
                    <Link to="/login" className="no-underline block" onClick={closeMobileMenu}>
                      <motion.div className="secondary-button w-full" whileTap={{ scale: 0.98 }}>
                        Sign in
                      </motion.div>
                    </Link>
                    <Link to="/register" className="no-underline block" onClick={closeMobileMenu}>
                      <motion.div className="primary-button btn-premium w-full" whileTap={{ scale: 0.98 }}>
                        Get started
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(Navbar);
