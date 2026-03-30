import { memo } from 'react';
import { motion } from 'framer-motion';

function Badge({
  children,
  icon: Icon,
  variant = 'accent',
  size = 'md',
  animate = false,
  className = ''
}) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[0.65rem]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm'
  };

  const variantStyles = {
    accent: { background: 'rgba(249,115,22,0.12)', color: 'var(--accent-secondary)', border: '1px solid rgba(249,115,22,0.18)' },
    success: { background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.15)' },
    warning: { background: 'rgba(234,179,8,0.1)', color: 'var(--warning)', border: '1px solid rgba(234,179,8,0.15)' },
    error: { background: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.15)' },
    secondary: { background: 'rgba(255,255,255,0.045)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }
  };

  const styling = variantStyles[variant] || variantStyles.accent;

  const animationProps = animate ? {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  } : {};

  return (
    <motion.span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-widest break-words whitespace-normal leading-relaxed ${sizeClasses[size]} ${className}`}
      style={styling}
      {...animationProps}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      {children}
    </motion.span>
  );
}

export default memo(Badge);
