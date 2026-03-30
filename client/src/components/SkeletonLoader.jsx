import { memo } from 'react';
import { motion } from 'framer-motion';

function SkeletonLoader({ type = 'card', count = 3 }) {
  const items = Array.from({ length: count });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (type === 'card') {
    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((_, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="card p-6"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
              className="skeleton w-12 h-12 rounded-xl"
              style={{ borderRadius: 'var(--radius-md)' }}
            />
              <div className="flex-1">
                <div className="skeleton h-4 w-3/4 mb-2" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
            <div className="skeleton h-3 w-full mb-2" />
            <div className="skeleton h-3 w-5/6 mb-4" />
            <div className="flex gap-2 mt-4">
              <div
                className="skeleton"
                style={{ height: '32px', width: '80px', borderRadius: 'var(--radius-pill)' }}
              />
              <div
                className="skeleton"
                style={{ height: '32px', width: '80px', borderRadius: 'var(--radius-pill)' }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (type === 'plan') {
    return (
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="skeleton h-8 w-1/3 mb-8" />
        {items.map((_, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="card p-6"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="skeleton h-5 w-1/3" />
              <div className="skeleton h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-3">
              {[0.9, 0.75, 0.85, 0.7].map((width, j) => (
                <div key={j} className="skeleton h-3" style={{ width: `${width * 100}%` }} />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (type === 'chart') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="card p-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <motion.div variants={itemVariants}>
          <div className="skeleton h-5 w-1/3 mb-6" />
          <div
            className="skeleton w-full"
            style={{ height: '200px', borderRadius: 'var(--radius-md)' }}
          />
        </motion.div>
      </motion.div>
    );
  }

  if (type === 'stat') {
    return (
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((_, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="card p-6"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="skeleton w-12 h-12 rounded-xl" />
              <div className="flex-1">
                <div className="skeleton h-6 w-16 mb-2" />
                <div className="skeleton h-3 w-20" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return null;
}

export default memo(SkeletonLoader);
