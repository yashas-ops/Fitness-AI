import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Flame } from 'lucide-react';

const themeIcons = {
  neon: Moon,
  clean: Sun,
  athlete: Flame
};

const themeGradients = {
  neon: 'linear-gradient(135deg, #7c5cfc 0%, #22d3ee 100%)',
  clean: 'linear-gradient(135deg, #059669 0%, #3b82f6 100%)',
  athlete: 'linear-gradient(135deg, #dc2626 0%, #eab308 100%)'
};

export default function ThemeSwitcher() {
  const { theme, setTheme, themes, appearance, toggleAppearance } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Dark/Light toggle */}
      <motion.button
        onClick={toggleAppearance}
        className="relative flex items-center justify-center w-8 h-8 rounded-full cursor-pointer focus-ring"
        style={{
          background: appearance === 'light' ? 'rgba(251, 191, 36, 0.15)' : 'var(--bg-tertiary)',
          color: appearance === 'light' ? '#fbbf24' : 'var(--text-muted)',
          border: '1px solid var(--border)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={appearance === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={`Switch to ${appearance === 'dark' ? 'light' : 'dark'} mode`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={appearance}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            {appearance === 'dark' ? (
              <Moon className="w-4 h-4" strokeWidth={2} />
            ) : (
              <Sun className="w-4 h-4" strokeWidth={2} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Theme variant selector */}
      <div
        className="flex items-center gap-1 p-1 rounded-full"
        style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)'
        }}
      >
        {themes.map((t) => {
          const Icon = themeIcons[t.id];
          const isActive = theme === t.id;

          return (
            <motion.button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="relative flex items-center justify-center w-8 h-8 rounded-full text-xs cursor-pointer focus-ring"
              style={{
                background: isActive ? themeGradients[t.id] : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                border: 'none',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={t.desc}
              aria-label={`Switch to ${t.desc} theme`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isActive ? 'active' : 'inactive'}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
              </AnimatePresence>

              {isActive && (
                <motion.div
                  layoutId="activeThemeGlow"
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: `0 0 20px ${t.id === 'neon' ? 'rgba(124, 92, 252, 0.5)' :
                      t.id === 'clean' ? 'rgba(5, 150, 105, 0.5)' :
                      'rgba(220, 38, 38, 0.5)'}`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
