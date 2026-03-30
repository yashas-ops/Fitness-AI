import { memo } from 'react';
import { motion } from 'framer-motion';

function ProgressBar({
  progress = 0,
  label,
  valueLabel,
  color = 'var(--accent)',
  height = '12px',
  showText = true,
  animateOnMount = true
}) {
  // Cap progress between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full">
      {showText && (label || valueLabel) && (
        <div className="flex justify-between items-end mb-2">
          {label && <span className="break-words whitespace-normal leading-relaxed text-sm font-semibold text-white">{label}</span>}
          {valueLabel && <span className="break-words whitespace-normal leading-relaxed text-xs font-mono" style={{ color }}>{valueLabel}</span>}
        </div>
      )}
      
      <div 
        className="w-full rounded-full overflow-hidden"
        style={{ height, background: 'rgba(255,255,255,0.07)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ 
            background: `linear-gradient(90deg, ${color}90 0%, ${color} 100%)`,
            boxShadow: `0 0 10px ${color}40`
          }}
          initial={animateOnMount ? { width: '0%' } : { width: `${normalizedProgress}%` }}
          animate={{ width: `${normalizedProgress}%` }}
          transition={{ 
            duration: 1.2, 
            ease: [0.22, 1, 0.36, 1], // fluid spring-like spring
            delay: 0.1 
          }}
        />
      </div>
    </div>
  );
}

export default memo(ProgressBar);
