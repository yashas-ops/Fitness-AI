import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import SkeletonLoader from '../components/SkeletonLoader';
import ProgressChart from '../components/ProgressChart';
import {
  Activity,
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';

const goalMeta = {
  'muscle gain': { icon: Dumbbell, color: 'var(--accent-secondary)', bgColor: 'rgba(249,115,22,0.16)' },
  muscle_gain: { icon: Dumbbell, color: 'var(--accent-secondary)', bgColor: 'rgba(249,115,22,0.16)' },
  'fat loss': { icon: Flame, color: 'var(--accent)', bgColor: 'rgba(239,68,68,0.16)' },
  fat_loss: { icon: Flame, color: 'var(--accent)', bgColor: 'rgba(239,68,68,0.16)' },
  endurance: { icon: Zap, color: 'var(--accent-tertiary)', bgColor: 'rgba(251,146,60,0.16)' },
  stamina: { icon: Zap, color: 'var(--accent-tertiary)', bgColor: 'rgba(251,146,60,0.16)' },
  strength: { icon: Trophy, color: '#fbbf24', bgColor: 'rgba(251,191,36,0.15)' },
  'general fitness': { icon: Activity, color: 'var(--success)', bgColor: 'rgba(34,197,94,0.15)' },
  general_fitness: { icon: Activity, color: 'var(--success)', bgColor: 'rgba(34,197,94,0.15)' },
};

const getMeta = (goal) =>
  goalMeta[goal?.toLowerCase()] || { icon: Target, color: 'var(--accent-secondary)', bgColor: 'rgba(249,115,22,0.16)' };

// Extracted + memoized so individual cards don't re-render when sibling state
// (e.g. skills loading, other plan deleted) changes — only rerenders on own data change
const PlanCard = memo(function PlanCard({ plan, index, onOpen, onDelete }) {
  const meta = getMeta(plan.inputs?.goal);
  const GoalIcon = meta.icon;

  return (
    <motion.div
      key={plan._id}
      data-plan-id={plan._id}
      className="card group cursor-pointer rounded-2xl p-6 min-h-[120px] flex flex-col justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ scale: 1.03 }}
      onClick={onOpen}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ background: meta.bgColor, color: meta.color }}
        >
          <GoalIcon className="h-5 w-5" />
        </div>

        <motion.button
          type="button"
          data-plan-id={plan._id}
          onClick={onDelete}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-[var(--text-muted)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          whileHover={{ scale: 1.03, backgroundColor: 'rgba(239,68,68,0.18)', color: '#fff' }}
          whileTap={{ scale: 0.97 }}
          title="Delete plan"
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </div>

      <h3 className="text-lg font-semibold leading-snug break-words whitespace-normal text-white">
        {plan.title || 'Fitness plan'}
      </h3>
      <p className="mt-2 break-words whitespace-normal leading-relaxed text-sm capitalize text-[var(--text-muted)]">
        {plan.inputs?.goal} | {plan.inputs?.level}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {plan.summary?.avgDailyCalories && (
          <span className="badge bg-white/5 text-white/80">
            <Flame className="h-3.5 w-3.5" />
            {plan.summary.avgDailyCalories} kcal
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
          <Clock className="h-3.5 w-3.5" />
          {new Date(plan.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
});

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      // Fire both requests in parallel \u2014 same pattern as Profile page
      const [plansRes, skillsRes] = await Promise.allSettled([
        api.get('/plans'),
        api.get('/plans/skills'),
      ]);

      if (plansRes.status === 'fulfilled') {
        setPlans(plansRes.value.data);
      } else {
        console.error('Failed to fetch plans:', plansRes.reason);
        toast.error('Failed to load plans');
      }

      if (skillsRes.status === 'fulfilled') {
        setSkills(skillsRes.value.data);
      }
      // Skills failure is non-blocking \u2014 dashboard still works without them
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deletePlan = useCallback(async (id) => {
    if (!window.confirm('Delete this plan?')) return;

    try {
      await api.delete(`/plans/${id}`);
      setPlans((prev) => prev.filter((plan) => plan._id !== id));
      toast.success('Plan deleted');
    } catch (err) {
      console.error('Failed to delete plan:', err);
      toast.error('Failed to delete plan');
    }
  }, []);

  const handleOpenPlan = useCallback(
    (event) => {
      const planId = event.currentTarget.dataset.planId;
      if (planId) {
        navigate(`/plan/${planId}`);
      }
    },
    [navigate],
  );

  const handleDeleteClick = useCallback(
    (event) => {
      event.stopPropagation();
      const planId = event.currentTarget.dataset.planId;
      if (planId) {
        deletePlan(planId);
      }
    },
    [deletePlan],
  );

  const stats = useMemo(() => [
    {
      label: 'Plans created',
      value: plans.length,
      sub: 'Saved in your workspace',
      icon: TrendingUp,
    },
    {
      label: 'Latest focus',
      value: plans[0]?.inputs?.goal || 'No plan yet',
      sub: plans.length ? 'From your most recent plan' : 'Generate your first one',
      icon: Target,
    },
    {
      label: 'Member since',
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'Today',
      sub: 'When you joined',
      icon: Calendar,
    },
  ], [plans, user]);

  return (
    <div className="min-h-screen px-6 pb-16 page-bg-mesh bg-grid-dots" style={{ paddingTop: '112px' }}>
      <div className="bg-orb bg-orb-cyan" style={{ width: '440px', height: '440px', top: '2%', right: '-10%' }} />
      <div className="bg-orb bg-orb-gold" style={{ width: '340px', height: '340px', bottom: '8%', left: '-8%' }} />

      <div className="container-page relative z-10">
        <motion.div
          className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="space-y-4">
            <div className="badge badge-lg">Dashboard</div>
            <div className="space-y-3">
              <h1 className="text-h1 break-words whitespace-normal leading-relaxed">
                Welcome back, <span className="text-gradient">{user?.name || 'Athlete'}</span>
              </h1>
              <p className="max-w-2xl text-body break-words whitespace-normal leading-relaxed">
                Check what you have built, see what is working, and start the next plan whenever you are ready.
              </p>
            </div>
          </div>

          <Link to="/generate" className="no-underline">
            <motion.button
              className="primary-button btn-premium px-6 py-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Generate new plan
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          className="mb-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="card-premium rounded-2xl p-6 min-h-[120px] flex flex-col justify-center"
                whileHover={{ scale: 1.03 }}
                transition={{ delay: index * 0.04 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="break-words whitespace-normal leading-relaxed text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                      {stat.label}
                    </p>
                    <p className="mt-4 break-words whitespace-normal text-3xl font-bold capitalize leading-snug text-white">
                      {stat.value}
                    </p>
                    <p className="mt-3 break-words whitespace-normal leading-relaxed text-sm text-[var(--text-secondary)]">
                      {stat.sub}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[var(--accent-secondary)]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {skills && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
          >
            <ProgressChart skills={skills} />
          </motion.div>
        )}

        <motion.div
          className="card-premium mb-10 p-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.45 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/12 to-orange-500/12" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="badge mb-4 bg-white/5 text-white/80">Fresh start</div>
              <h2 className="text-h2 break-words whitespace-normal leading-relaxed">Ready for your next plan?</h2>
              <p className="mt-3 text-body break-words whitespace-normal leading-relaxed">
                Create a new workout and nutrition plan without losing your history.
              </p>
            </div>

            <Link to="/generate" className="no-underline">
              <motion.button
                className="secondary-button bg-white/10 text-white"
                style={{ borderColor: 'rgba(255,255,255,0.16)' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Open generator
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h2 break-words whitespace-normal leading-relaxed">Your plans</h2>
            <p className="mt-2 text-body break-words whitespace-normal leading-relaxed">
              Everything you have generated so far, in one place.
            </p>
          </div>
          <Link to="/generate" className="no-underline">
            <motion.button className="secondary-button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Plus className="h-4 w-4" />
              New plan
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader type="card" count={3} />
        ) : plans.length === 0 ? (
          <motion.div
            className="card-premium p-12 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white/5 text-[var(--accent-secondary)]">
              <Plus className="h-10 w-10" />
            </div>
            <h3 className="text-h2 break-words whitespace-normal leading-relaxed">No plans yet</h3>
            <p className="mx-auto mt-4 max-w-md text-body break-words whitespace-normal leading-relaxed">
              Start with one plan and we will keep the rest organized here.
            </p>
            <Link to="/generate" className="no-underline inline-block">
              <motion.button
                className="primary-button btn-premium mt-8"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Create first plan
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan, index) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                index={index}
                onOpen={handleOpenPlan}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
