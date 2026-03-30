import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#fb923c', '#fbbf24'];

const MacroTooltip = memo(function MacroTooltip({ active, payload }) {
  if (!(active && payload && payload.length)) return null;

  return (
    <div className="glass rounded-2xl p-3" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="break-words whitespace-normal leading-relaxed text-sm font-semibold text-white">
        {payload[0].name}
      </p>
      <p className="break-words whitespace-normal leading-relaxed text-xs text-[var(--text-secondary)]">
        {payload[0].payload.grams} | {payload[0].payload.cals} kcal
      </p>
    </div>
  );
});

const CalorieTooltip = memo(function CalorieTooltip({ active, payload, label }) {
  if (!(active && payload && payload.length)) return null;

  return (
    <div className="glass rounded-2xl p-3" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="mb-1 break-words whitespace-normal leading-relaxed text-sm font-semibold text-white">
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.name} className="break-words whitespace-normal leading-relaxed text-xs" style={{ color: entry.fill }}>
          {entry.name}: {entry.value}
          {entry.name === 'Calories' ? ' kcal' : 'g'}
        </p>
      ))}
    </div>
  );
});

export const MacroPieChart = memo(function MacroPieChart({ protein, carbs, fats, calories }) {
  const data = useMemo(() => [
    { name: 'Protein', value: protein, grams: `${protein}g`, cals: protein * 4 },
    { name: 'Carbs', value: carbs, grams: `${carbs}g`, cals: carbs * 4 },
    { name: 'Fats', value: fats, grams: `${fats}g`, cals: fats * 9 },
  ], [protein, carbs, fats]);

  return (
    <motion.div
      className="card-premium p-6 md:p-8"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-h3 mb-2 break-words whitespace-normal leading-relaxed">Daily macros</h3>
          <p className="text-small break-words whitespace-normal leading-relaxed">{calories} kcal per day</p>
        </div>
        <div className="badge bg-white/5 text-white/75">Nutrition</div>
      </div>

      <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-3 md:p-4">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={62} outerRadius={102} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip content={<MacroTooltip />} />
            <Legend wrapperStyle={{ color: '#d2cbc4', fontSize: '0.8rem' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

export const WeeklyCalorieChart = memo(function WeeklyCalorieChart({ mealPlan }) {
  const data = useMemo(() => (mealPlan || []).map((day) => ({
    day: day.day?.substring(0, 3) || '',
    Calories: day.totalCalories || 0,
    Protein: day.totalProtein || 0,
    Carbs: day.totalCarbs || 0,
  })), [mealPlan]);

  return (
    <motion.div
      className="card-premium p-6 md:p-8"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-h3 mb-2 break-words whitespace-normal leading-relaxed">Weekly overview</h3>
          <p className="text-small break-words whitespace-normal leading-relaxed">
            Calories, protein, and carbs across the week.
          </p>
        </div>
        <div className="badge bg-white/5 text-white/75">Overview</div>
      </div>

      <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-3 md:p-4">
        <ResponsiveContainer width="100%" height={290}>
          <BarChart data={data} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="day" stroke="#968f89" fontSize={12} />
            <YAxis stroke="#968f89" fontSize={12} />
            <Tooltip content={<CalorieTooltip />} />
            <Legend wrapperStyle={{ color: '#d2cbc4', fontSize: '0.8rem' }} />
            <Bar dataKey="Calories" fill={COLORS[0]} radius={[8, 8, 0, 0]} />
            <Bar dataKey="Protein" fill={COLORS[1]} radius={[8, 8, 0, 0]} />
            <Bar dataKey="Carbs" fill={COLORS[2]} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});
