import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

function ProgressChart({ skills }) {
  const chartData = useMemo(() => {
    if (!skills) {
      return [
        { skill: 'Strength', value: 1, fullMark: 10 },
        { skill: 'Endurance', value: 1, fullMark: 10 },
        { skill: 'Flexibility', value: 1, fullMark: 10 },
        { skill: 'Balance', value: 1, fullMark: 10 },
        { skill: 'Cardio', value: 1, fullMark: 10 },
      ];
    }
    return [
      { skill: 'Strength', value: skills.strength?.level || 1, fullMark: 10 },
      { skill: 'Endurance', value: skills.endurance?.level || 1, fullMark: 10 },
      { skill: 'Flexibility', value: skills.flexibility?.level || 1, fullMark: 10 },
      { skill: 'Balance', value: skills.balance?.level || 1, fullMark: 10 },
      { skill: 'Cardio', value: skills.cardio?.level || 1, fullMark: 10 },
    ];
  }, [skills]);

  if (!skills) return null;

  return (
    <motion.div
      className="card-premium p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-h3 mb-2 break-words whitespace-normal leading-relaxed">Skill radar</h3>
          <p className="text-small break-words whitespace-normal leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            A quick look at how your recent plans are shaping your overall profile.
          </p>
        </div>
        <div className="badge bg-white/5 text-white/75">Progress profile</div>
      </div>

      <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-3 md:p-4">
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <defs>
                <linearGradient id="progressRadarFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.18" />
                </linearGradient>
              </defs>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: '#d2cbc4', fontSize: 12, fontFamily: 'var(--font-body)' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fill: '#968f89', fontSize: 10 }}
                tickCount={6}
              />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="var(--accent-secondary)"
                fill="url(#progressRadarFill)"
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {chartData.map((item, index) => (
          <motion.div
            key={item.skill}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28 + index * 0.05 }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="break-words whitespace-normal leading-relaxed text-sm font-medium text-white">{item.skill}</span>
              <span className="break-words whitespace-normal leading-relaxed text-mono text-sm" style={{ color: 'var(--accent-secondary)' }}>
                Lv. {item.value}
              </span>
            </div>
            <div
              style={{
                height: '8px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: 'var(--gradient-accent)',
                  borderRadius: '999px',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / 10) * 100}%` }}
                transition={{ delay: 0.36 + index * 0.08, duration: 0.7, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default memo(ProgressChart);
