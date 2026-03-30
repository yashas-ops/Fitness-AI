import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  BarChart3,
  Brain,
  ChartPie,
  Check,
  ClipboardList,
  Dumbbell,
  Flame,
  Leaf,
  Share2,
  Smartphone,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Zap,
} from 'lucide-react';

const features = [
  {
    title: 'AI Plans',
    desc: 'Plans that actually fit your routine - not some generic template. Built around how you train, eat, and recover.',
    icon: Brain,
    accent: 'var(--accent)',
  },
  {
    title: 'Analytics',
    desc: 'Simple breakdown of your calories and macros so you always know what is working.',
    icon: ChartPie,
    accent: 'var(--accent-secondary)',
  },
  {
    title: 'Goal Guidance',
    desc: "Whether you're bulking, cutting, or staying consistent - your plan adjusts with you.",
    icon: Target,
    accent: 'var(--accent-tertiary)',
  },
  {
    title: 'Diet Planning',
    desc: 'Works with your diet - veg, non-veg, or anything in between.',
    icon: Leaf,
    accent: 'var(--success)',
  },
  {
    title: 'Export',
    desc: 'Download or share your plan anytime. No friction.',
    icon: Share2,
    accent: 'var(--accent-secondary)',
  },
  {
    title: 'Responsive',
    desc: 'Looks and feels smooth on mobile, tablet, or desktop.',
    icon: Smartphone,
    accent: '#f5d0a9',
  },
];

const stats = [
  { value: '10k+', label: 'Plans generated' },
  { value: '50+', label: 'Exercise patterns' },
  { value: '100%', label: 'Goal-aligned outputs' },
];

const howItWorks = [
  {
    step: '01',
    title: 'Tell us what you want',
    desc: 'Share your goal, experience, body details, food preferences, and equipment.',
    icon: ClipboardList,
  },
  {
    step: '02',
    title: 'Get your plan',
    desc: 'We turn those answers into workouts, meals, and guidance you can actually use.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Keep adjusting',
    desc: 'Come back anytime, review what changed, and generate the next version when life shifts.',
    icon: BarChart3,
  },
];

const heroExercises = [
  { label: 'Bench Press', meta: '4 x 10', icon: Flame },
  { label: 'Incline DB Press', meta: '3 x 12', icon: TrendingUp },
  { label: 'Cable Flyes', meta: '3 x 15', icon: Timer },
  { label: 'Tricep Pushdown', meta: '3 x 12', icon: Zap },
];

const BodybuilderHeroCanvas = lazy(() => import('../components/BodybuilderHeroCanvas'));

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page-bg-mesh bg-grid-dots">
      <section className="relative overflow-hidden" style={{ paddingTop: '104px' }}>
        <div className="mesh-bg absolute inset-0 opacity-90" />
        <div className="hero-blob bg-orb bg-orb-cyan left-[-8%] top-0 h-[420px] w-[420px]" />
        <div className="hero-blob bg-orb bg-orb-gold bottom-[-12%] right-[-4%] h-[360px] w-[360px]" />

        <div className="container-page relative z-10 pb-12 pt-6 md:pb-16 md:pt-10">
          <div className="grid items-start gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-stretch lg:gap-14">
            <motion.div
              className="min-w-0 w-full flex flex-col justify-start gap-4 lg:h-full lg:min-h-[39rem] lg:flex-1 lg:gap-5 lg:pt-2"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mx-auto flex h-[15rem] w-full max-w-[15rem] items-center justify-center sm:h-[17rem] sm:max-w-[17rem] lg:mx-0 lg:h-[24rem] lg:max-w-[22rem] lg:items-start lg:justify-start xl:h-[26rem] xl:max-w-[24rem]">
                <Suspense fallback={null}>
                  <BodybuilderHeroCanvas />
                </Suspense>
              </div>

              <div className="min-w-0 w-full max-w-[34rem] space-y-4 lg:space-y-5">
                <motion.div
                  className="badge badge-lg"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.12)',
                  }}
                >
                  <Zap className="h-3.5 w-3.5" />
                  Plans built around you
                </motion.div>

                <div className="space-y-4 lg:space-y-5">
                  <h1 className="max-w-[12ch] break-words whitespace-normal text-5xl font-bold leading-[0.96] md:text-6xl">
                    Build a plan you can actually stick to.
                  </h1>
                  <p className="max-w-xl break-words whitespace-normal pr-3 text-lg leading-relaxed text-[var(--text-secondary)] sm:pr-0">
                    Answer a few quick questions and get training plus nutrition guidance that fits how you live, train, and recover.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Link to={isAuthenticated ? '/generate' : '/register'} className="no-underline">
                    <motion.button
                      className="primary-button btn-premium px-6 py-3"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isAuthenticated ? 'Generate plan' : 'Start free'}
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </Link>
                  <Link to={isAuthenticated ? '/dashboard' : '/login'} className="no-underline">
                    <motion.button
                      className="secondary-button px-6 py-3"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isAuthenticated ? 'Open dashboard' : 'Sign in'}
                    </motion.button>
                  </Link>
                </div>

                <div className="grid gap-3 pt-1 sm:grid-cols-3">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="card-glass rounded-2xl p-5 min-h-[120px] flex flex-col justify-center"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.08 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="break-words whitespace-normal text-3xl font-bold leading-snug stat-glow">{stat.value}</div>
                      <p className="mt-2 break-words whitespace-normal leading-relaxed text-sm text-[var(--text-muted)]">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative min-w-0 lg:flex lg:h-full lg:min-h-[39rem] lg:flex-1 lg:flex-col lg:pt-6"
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-x-10 top-8 h-44 rounded-full bg-[rgba(249,115,22,0.18)] blur-[120px]" />
              <div className="relative z-10 grid gap-5 lg:ml-4 lg:min-h-full lg:flex-1 lg:grid-rows-[minmax(0,1.12fr)_minmax(0,0.96fr)]">
                <motion.div
                  className="card-premium noise-overlay h-full p-6 md:p-7"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                        style={{ background: 'var(--gradient-accent)' }}
                      >
                        <Dumbbell className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="break-words whitespace-normal leading-relaxed text-sm font-semibold text-white">Performance split</p>
                        <p className="break-words whitespace-normal leading-relaxed text-sm text-[var(--text-muted)]">Push / Pull / Legs</p>
                      </div>
                    </div>
                    <div className="badge bg-white/5 text-white/80">Advanced</div>
                  </div>

                  <div className="space-y-3">
                    {heroExercises.map(({ label, meta, icon: Icon }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-[var(--accent-secondary)]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="break-words whitespace-normal leading-relaxed text-sm font-medium text-white">{label}</span>
                        </div>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                          {meta}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr] lg:h-full">
                  <motion.div
                    className="card h-full rounded-2xl p-6 min-h-[120px] flex flex-col justify-center"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[var(--accent)]">
                        <ChartPie className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="break-words whitespace-normal leading-relaxed text-sm font-semibold text-white">Daily macro split</p>
                        <p className="break-words whitespace-normal leading-relaxed text-sm text-[var(--text-muted)]">2,350 kcal target</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Protein', value: '140g', amount: '34%' },
                        { label: 'Carbs', value: '220g', amount: '43%' },
                        { label: 'Fats', value: '70g', amount: '23%' },
                      ].map((macro) => (
                        <div key={macro.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center">
                          <div className="break-words whitespace-normal text-lg font-bold leading-snug text-white">{macro.value}</div>
                          <div className="mt-1 break-words whitespace-normal leading-relaxed text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                            {macro.label}
                          </div>
                          <div className="mt-3 break-words whitespace-normal leading-relaxed text-xs font-semibold text-[var(--accent-secondary)]">
                            {macro.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    className="card-glow h-full rounded-2xl p-6 min-h-[120px] flex flex-col justify-center"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.34 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="mb-6 flex items-center justify-between gap-3">
                      <div>
                        <p className="break-words whitespace-normal leading-relaxed text-sm font-semibold text-white">What you get</p>
                        <p className="break-words whitespace-normal leading-relaxed text-sm text-[var(--text-muted)]">Everything in one place</p>
                      </div>
                      <div className="badge bg-white/5 text-white/70">Live</div>
                    </div>
                    <div className="space-y-4">
                      {[
                        'Workouts built around your goal and schedule',
                        'Meals with calories and macros laid out clearly',
                        'Saved history, sharing, and easy exports',
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-[var(--accent-secondary)]">
                            <Check className="h-4 w-4" />
                          </div>
                          <p className="break-words whitespace-normal leading-relaxed text-sm text-[var(--text-secondary)]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-py relative">
        <div className="container-page relative z-10">
          <motion.div
            className="mx-auto mb-12 max-w-2xl text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="badge badge-lg mx-auto mb-4">How it works</div>
            <h2 className="text-h1 break-words whitespace-normal leading-relaxed">
              From quick answers to a plan you can use
            </h2>
            <p className="mt-4 text-body break-words whitespace-normal leading-relaxed">
              The flow stays simple so you spend less time filling out forms and more time getting started.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  className="card rounded-2xl p-8 min-h-[120px] flex flex-col justify-center"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                      style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.9), rgba(249,115,22,0.9))' }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-bold text-white/30">{item.step}</div>
                  </div>
                  <h3 className="text-lg font-semibold leading-snug break-words whitespace-normal">{item.title}</h3>
                  <p className="mt-3 text-body break-words whitespace-normal leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-py-sm">
        <div className="container-page">
          <motion.div
            className="mx-auto mb-12 max-w-2xl text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="badge badge-lg mx-auto mb-4">Capabilities</div>
            <h2 className="text-h1 break-words whitespace-normal leading-relaxed">
              Built to feel clear, fast, and easy to trust
            </h2>
            <p className="mt-4 text-body break-words whitespace-normal leading-relaxed">
              Every part of the product is there to make the plan easier to read, use, and come back to.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="card-premium rounded-2xl p-6 min-h-[120px] flex flex-col justify-center"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.42 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${feature.accent}20, rgba(255,255,255,0.04))`,
                      color: feature.accent,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold leading-snug break-words whitespace-normal">{feature.title}</h3>
                  <p className="mt-1 text-sm text-gray-400 break-words whitespace-normal leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-py-lg">
        <div className="container-page">
          <motion.div
            className="card-premium noise-overlay px-6 py-10 text-center sm:px-10 md:py-14"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10" />
            <div className="relative z-10 mx-auto max-w-2xl">
              <div className="badge badge-lg mx-auto mb-5 bg-white/5 text-white/80">Ready to start?</div>
              <h2 className="text-h1 break-words whitespace-normal leading-relaxed">
                Start your next plan in a minute, not an afternoon
              </h2>
              <p className="mt-4 text-body break-words whitespace-normal leading-relaxed">
                Build a new plan, save it, share it, and come back when your routine changes.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to={isAuthenticated ? '/generate' : '/register'} className="no-underline">
                  <motion.button
                    className="primary-button btn-premium px-6 py-3"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isAuthenticated ? 'Create plan' : 'Create account'}
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
                <Link to={isAuthenticated ? '/dashboard' : '/login'} className="no-underline">
                  <motion.button
                    className="secondary-button px-6 py-3"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isAuthenticated ? 'Go to dashboard' : 'Sign in'}
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/8 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl" style={{ background: 'var(--gradient-accent)' }}>
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">FitnessAI</div>
              <div className="text-xs text-[var(--text-muted)]">Plans that fit real life</div>
            </div>
          </div>
          <p className="text-small break-words whitespace-normal leading-relaxed">
            Copyright {new Date().getFullYear()} FitnessAI. Built for people who want a plan that feels usable.
          </p>
        </div>
      </footer>
    </div>
  );
}
