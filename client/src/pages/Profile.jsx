import { useCallback, useEffect, useMemo, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ProgressChart from '../components/ProgressChart';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import UserAvatar from '../components/UserAvatar';
import {
  Activity,
  Calendar,
  Check,
  Dumbbell,
  Edit3,
  Loader2,
  Trophy,
  X,
  Zap,
} from 'lucide-react';

function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: 'easeOut' });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function Profile() {
  const { user } = useAuth();
  const [skills, setSkills] = useState(null);
  const [plans, setPlans] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [skillsRes, plansRes] = await Promise.all([api.get('/plans/skills'), api.get('/plans')]);
      setSkills(skillsRes.data);
      setPlans(plansRes.data);
    } catch (err) {
      console.error('Failed to fetch profile data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateName = useCallback(async () => {
    if (!newName.trim() || newName.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    setSaving(true);
    try {
      await api.put('/auth/profile', { name: newName.trim() });
      toast.success('Name updated');
      setEditing(false);
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update name');
    } finally {
      setSaving(false);
    }
  }, [newName]);

  const handleNameChange = useCallback((event) => {
    setNewName(event.target.value);
  }, []);

  const handleStartEditing = useCallback(() => {
    setNewName(user?.name || '');
    setEditing(true);
  }, [user?.name]);

  const handleStopEditing = useCallback(() => {
    setEditing(false);
    setNewName(user?.name || '');
  }, [user?.name]);

  const totalXP = useMemo(() => skills
    ? (skills.strength?.xp || 0)
      + (skills.endurance?.xp || 0)
      + (skills.flexibility?.xp || 0)
      + (skills.balance?.xp || 0)
      + (skills.cardio?.xp || 0)
    : 0, [skills]);

  const overallLevel = useMemo(() => skills
    ? Math.round(
      ((skills.strength?.level || 1)
        + (skills.endurance?.level || 1)
        + (skills.flexibility?.level || 1)
        + (skills.balance?.level || 1)
        + (skills.cardio?.level || 1)) / 5,
    )
    : 1, [skills]);

  const skillRows = useMemo(() => [
    { name: 'Strength', icon: Dumbbell, data: skills?.strength, color: '#ef4444' },
    { name: 'Endurance', icon: Zap, data: skills?.endurance, color: '#f97316' },
    { name: 'Flexibility', icon: Activity, data: skills?.flexibility, color: '#fb923c' },
    { name: 'Balance', icon: Activity, data: skills?.balance, color: '#22c55e' },
    { name: 'Cardio', icon: Activity, data: skills?.cardio, color: '#fbbf24' },
  ], [skills]);

  return (
    <div className="min-h-screen px-6 pb-16 page-bg-mesh bg-grid-dots" style={{ paddingTop: '112px' }}>
      <div className="bg-orb bg-orb-cyan" style={{ width: '420px', height: '420px', top: '4%', right: '-8%' }} />

      <div className="container-page relative z-10">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Badge animate size="sm" variant="accent">Profile</Badge>
          <h1 className="text-h1 mt-4 break-words whitespace-normal leading-relaxed">Your profile</h1>
          <p className="mt-3 max-w-2xl text-body break-words whitespace-normal leading-relaxed">
            See your account details, training progress, and the data shaping your plans.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12">
          <motion.div
            className="space-y-6 lg:col-span-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
          >
            <Card variant="premium" className="p-8 text-center">
              <motion.div
                className="mx-auto mb-5"
                whileHover={{ scale: 1.04, rotate: -4 }}
              >
                <UserAvatar
                  user={user}
                  className="h-24 w-24"
                  imageClassName="rounded-full"
                  fallbackClassName="text-4xl font-bold"
                />
              </motion.div>

              {editing ? (
                <div className="mb-4 flex items-center justify-center gap-2">
                  <input
                    type="text"
                    className="input text-center"
                    style={{ maxWidth: '220px' }}
                    value={newName}
                    onChange={handleNameChange}
                    autoFocus
                  />
                  <motion.button
                    type="button"
                    onClick={handleUpdateName}
                    disabled={saving}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                    style={{ background: 'var(--gradient-accent)' }}
                    whileTap={{ scale: 0.94 }}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleStopEditing}
                    className="secondary-button h-10 w-10 p-0"
                    whileTap={{ scale: 0.94 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
              ) : (
                <div className="mb-2 flex items-center justify-center gap-2">
                  <h2 className="text-h2 break-words whitespace-normal leading-relaxed">{user?.name || 'Athlete'}</h2>
                  <motion.button
                    type="button"
                    onClick={handleStartEditing}
                    title="Rename"
                    aria-label="Rename profile name"
                    className="secondary-button btn-sm px-3 py-2 text-sm whitespace-nowrap"
                    whileTap={{ scale: 0.94 }}
                  >
                    <Edit3 className="h-4 w-4" />
                    Rename
                  </motion.button>
                </div>
              )}

              <p className="text-body text-sm break-words whitespace-normal leading-relaxed">{user?.email}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Plans built</div>
                  <div className="mt-2 text-2xl font-bold text-white">{skills?.totalPlansGenerated || plans.length}</div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Account tier</div>
                  <div className="mt-2 text-2xl font-bold text-white">Elite III</div>
                </div>
              </div>
            </Card>

            <Card variant="glow" className="p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[var(--accent-secondary)]">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Overall level</p>
                    <p className="text-2xl font-bold text-white">
                      Level <AnimatedNumber value={overallLevel} />
                    </p>
                  </div>
                </div>
                <div className="badge bg-white/5 text-white/75">Live XP</div>
              </div>

              <ProgressBar
                progress={(totalXP % 1000) / 10}
                label="Journey progress"
                valueLabel={`${totalXP} / ${Math.ceil(totalXP / 1000) * 1000 || 1000} XP`}
              />
            </Card>

            <Card className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[var(--accent-secondary)]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Member since</p>
                  <p className="mt-1 text-sm font-semibold text-white break-words whitespace-normal leading-relaxed">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      : 'Today'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Profile focus</p>
                <p className="mt-3 text-sm text-[var(--text-secondary)] break-words whitespace-normal leading-relaxed">
                  This page keeps your account details, progress, and plan history easy to scan.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            className="space-y-6 lg:col-span-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.4 }}
          >
            {loading ? (
              <Card className="p-12 text-center">
                <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[var(--accent-secondary)]" />
                <p className="text-body break-words whitespace-normal leading-relaxed">Gathering your latest metrics...</p>
              </Card>
            ) : (
              <>
                <ProgressChart skills={skills} />

                <Card className="p-6 md:p-8">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-h3 break-words whitespace-normal leading-relaxed">Discipline progression</h3>
                      <p className="mt-2 text-body break-words whitespace-normal leading-relaxed">
                        See how your recent plans are spreading progress across each training area.
                      </p>
                    </div>
                    <div className="badge bg-white/5 text-white/75">Detailed view</div>
                  </div>

                  <div className="space-y-6">
                    {skillRows.map((skill, index) => {
                      const Icon = skill.icon;
                      const level = skill.data?.level || 1;
                      const xp = skill.data?.xp || 0;
                      const progress = xp % 100;

                      return (
                        <motion.div
                          key={skill.name}
                          className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.18 + index * 0.06 }}
                        >
                          <div
                            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
                            style={{ background: `${skill.color}18`, color: skill.color }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <ProgressBar
                              color={skill.color}
                              progress={progress}
                              label={skill.name}
                              valueLabel={`Lv.${level} | ${xp} XP`}
                              height="8px"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
