import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { MacroPieChart, WeeklyCalorieChart } from '../components/MacroChart';
import SkeletonLoader from '../components/SkeletonLoader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import MealDayCard from '../components/plan/MealDayCard';
import WorkoutDayCard from '../components/plan/WorkoutDayCard';
import api from '../utils/api';
import {
  ArrowLeft,
  Carrot,
  Check,
  Download,
  Dumbbell,
  Edit2,
  Lightbulb,
  Loader2,
  RefreshCw,
  Save,
  Share2,
  Target,
} from 'lucide-react';

const tabs = [
  { id: 'workout', label: 'Workout plan', icon: Dumbbell },
  { id: 'meal', label: 'Meal plan', icon: Carrot },
  { id: 'tips', label: 'Guidance', icon: Lightbulb },
];

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const planContentRef = useRef(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('workout');
  const [shareLoading, setShareLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [completedExercises, setCompletedExercises] = useState({});

  useEffect(() => {
    if (!id) return;

    try {
      const saved = localStorage.getItem(`plan-completed-${id}`);
      if (saved) {
        setCompletedExercises(JSON.parse(saved));
      }
    } catch {
      setCompletedExercises({});
    }
  }, [id]);

  const toggleExercise = useCallback(
    (dayIdx, exIdx) => {
      const key = `${dayIdx}-${exIdx}`;
      setCompletedExercises((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        localStorage.setItem(`plan-completed-${id}`, JSON.stringify(next));
        return next;
      });
    },
    [id],
  );

  const fetchPlan = useCallback(async () => {
    try {
      const { data } = await api.get(`/plans/${id}`);
      setPlan(data);
      setEditTitle(data.title);
    } catch (err) {
      console.error('Failed to fetch plan:', err);
      toast.error('Failed to load plan');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const handleShare = useCallback(async () => {
    setShareLoading(true);
    try {
      const { data } = await api.post(`/plans/${id}/share`);
      const url = `${window.location.origin}/shared/${data.shareToken}`;
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard!');
    } catch {
      toast.error('Failed to generate share link');
    } finally {
      setShareLoading(false);
    }
  }, [id]);

  const handleSaveTitle = useCallback(async () => {
    if (!plan) return;

    try {
      await api.put(`/plans/${id}`, { ...plan, title: editTitle });
      setPlan((current) => (current ? { ...current, title: editTitle } : current));
      setEditing(false);
      toast.success('Title updated');
    } catch {
      toast.error('Failed to update');
    }
  }, [editTitle, id, plan]);

  const handleExport = useCallback(async () => {
    if (!plan) {
      console.error('Export failed: Plan data not found');
      toast.error('Failed to export PDF');
      return;
    }

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = margin;

      pdf.setFontSize(24);
      pdf.setTextColor(40, 40, 40);
      pdf.text(plan.title || 'Fitness Plan', margin, yPos);
      yPos += 10;

      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      const goalLevel = `${plan.inputs?.goal || ''} | ${plan.inputs?.level || ''}`;
      pdf.text(goalLevel, margin, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.text(`Generated on ${new Date(plan.createdAt).toLocaleDateString()}`, margin, yPos);
      yPos += 12;

      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Daily Macros', margin, yPos);
      yPos += 8;

      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Calories: ${plan.summary?.avgDailyCalories || 0} kcal`, margin, yPos);
      yPos += 6;
      pdf.text(`Protein: ${plan.summary?.avgDailyProtein || 0}g`, margin, yPos);
      yPos += 6;
      pdf.text(`Carbs: ${plan.summary?.avgDailyCarbs || 0}g`, margin, yPos);
      yPos += 6;
      pdf.text(`Fats: ${plan.summary?.avgDailyFats || 0}g`, margin, yPos);
      yPos += 12;

      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Workout Plan', margin, yPos);
      yPos += 8;

      const workoutPlan = plan.workoutPlan || [];
      for (const day of workoutPlan) {
        if (yPos > 260) {
          pdf.addPage();
          yPos = margin;
        }

        pdf.setFontSize(12);
        pdf.setTextColor(30, 30, 30);
        pdf.text(`${day.day} - ${day.focus || 'Workout'}`, margin, yPos);
        yPos += 7;

        if (day.exercises && day.exercises.length > 0) {
          pdf.setFontSize(10);
          pdf.setTextColor(80, 80, 80);
          for (const exercise of day.exercises) {
            if (yPos > 270) {
              pdf.addPage();
              yPos = margin;
            }
            pdf.text(`  ${exercise.name}: ${exercise.sets}x${exercise.reps} (${exercise.rest} rest)`, margin, yPos);
            yPos += 5;
          }
        } else {
          pdf.setFontSize(10);
          pdf.setTextColor(120, 120, 120);
          pdf.text('  Recovery / Rest Day', margin, yPos);
        }
        yPos += 6;
      }

      yPos += 4;
      if (yPos > 250) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Meal Plan', margin, yPos);
      yPos += 8;

      const mealPlan = plan.mealPlan || [];
      for (const day of mealPlan) {
        if (yPos > 260) {
          pdf.addPage();
          yPos = margin;
        }

        pdf.setFontSize(12);
        pdf.setTextColor(30, 30, 30);
        pdf.text(`${day.day}: ${day.totalCalories} kcal | ${day.totalProtein}g protein`, margin, yPos);
        yPos += 7;

        if (day.meals && day.meals.length > 0) {
          pdf.setFontSize(10);
          pdf.setTextColor(80, 80, 80);
          for (const meal of day.meals) {
            if (yPos > 270) {
              pdf.addPage();
              yPos = margin;
            }
            pdf.text(`  ${meal.name} (${meal.time}): ${meal.calories} kcal`, margin, yPos);
            yPos += 5;
            if (meal.foods && meal.foods.length > 0) {
              for (const food of meal.foods) {
                if (yPos > 275) {
                  pdf.addPage();
                  yPos = margin;
                }
                pdf.text(`    - ${food}`, margin + 3, yPos);
                yPos += 4;
              }
            }
            yPos += 2;
          }
        }
        yPos += 4;
      }

      if (plan.tips && plan.tips.length > 0) {
        yPos += 4;
        if (yPos > 240) {
          pdf.addPage();
          yPos = margin;
        }

        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;

        pdf.setFontSize(14);
        pdf.setTextColor(40, 40, 40);
        pdf.text('Tips & Guidance', margin, yPos);
        yPos += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        for (const tip of plan.tips) {
          if (yPos > 275) {
            pdf.addPage();
            yPos = margin;
          }
          const lines = pdf.splitTextToSize(`• ${tip}`, contentWidth);
          for (const line of lines) {
            pdf.text(line, margin, yPos);
            yPos += 5;
          }
          yPos += 2;
        }
      }

      pdf.save('fitness-plan.pdf');
      toast.success('PDF downloaded!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to export PDF');
    }
  }, [plan]);

  const handleTitleChange = useCallback((event) => {
    setEditTitle(event.target.value);
  }, []);

  const handleOpenEditor = useCallback(() => {
    setEditing(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setEditing(false);
    setEditTitle(plan?.title || '');
  }, [plan?.title]);

  const handleNewPlan = useCallback(() => {
    navigate('/generate');
  }, [navigate]);

  const handleTabChange = useCallback((event) => {
    const nextTab = event.currentTarget.dataset.tab;
    if (nextTab) {
      setActiveTab(nextTab);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen px-6" style={{ paddingTop: '112px' }}>
        <div className="container-page">
          <SkeletonLoader type="plan" count={3} />
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen px-6 pb-16 page-bg-mesh bg-grid-dots" style={{ paddingTop: '112px' }}>
      <div className="container-page relative z-10">
        <motion.div
          className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="max-w-3xl">
            <Link to="/dashboard" className="no-underline inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>

            <div className="mt-5">
              {editing ? (
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    value={editTitle}
                    onChange={handleTitleChange}
                    className="w-full max-w-[360px] h-14 px-4 text-lg text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                  <button type="button" onClick={handleSaveTitle} className="primary-button btn-sm">
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button type="button" onClick={handleCloseEditor} className="secondary-button btn-sm">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-h1 break-words whitespace-normal leading-relaxed">{plan.title}</h1>
                    <button
                      type="button"
                      onClick={handleOpenEditor}
                      title="Rename plan"
                      aria-label="Rename plan"
                      className="secondary-button btn-sm px-4 py-2 text-sm"
                      style={{
                        color: '#fff',
                        borderColor: 'rgba(255,255,255,0.16)',
                        background: 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                      Rename
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="accent" size="sm" icon={Target}>{plan.inputs?.goal}</Badge>
                    <Badge variant="secondary" size="sm">{plan.inputs?.level}</Badge>
                    <span className="break-words whitespace-normal leading-relaxed text-sm text-[var(--text-muted)]">
                      Generated on {new Date(plan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="max-w-2xl text-body break-words whitespace-normal leading-relaxed">
                    Your workouts, meals, and guidance all in one place.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-nowrap items-center gap-3 xl:justify-end h-full">
            <button
              type="button"
              onClick={handleNewPlan}
              className="secondary-button h-12 px-5 whitespace-nowrap"
            >
              <RefreshCw className="h-4 w-4" />
              New plan
            </button>
            <button type="button" onClick={handleShare} disabled={shareLoading} className="secondary-button h-12 px-5 whitespace-nowrap">
              {shareLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sharing
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Share
                </>
              )}
            </button>
            <button type="button" onClick={handleExport} className="primary-button btn-premium h-12 px-5 whitespace-nowrap">
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </motion.div>

        <div className="mb-10 grid gap-8 lg:grid-cols-2">
          <MacroPieChart
            protein={plan.summary?.avgDailyProtein || 0}
            carbs={plan.summary?.avgDailyCarbs || 0}
            fats={plan.summary?.avgDailyFats || 0}
            calories={plan.summary?.avgDailyCalories || 0}
          />
          <WeeklyCalorieChart mealPlan={plan.mealPlan} />
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                data-tab={tab.id}
                onClick={handleTabChange}
                className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
                style={{
                  background: active ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.045)',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  border: active ? '1px solid transparent' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: active ? '0 18px 36px rgba(249,115,22,0.16)' : 'none',
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        <div id="plan-content" ref={planContentRef} className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'workout' && (
              <motion.div
                key="workout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {(plan.workoutPlan || []).map((day, index) => (
                  <WorkoutDayCard
                    key={index}
                    day={day}
                    dayIdx={index}
                    completedExercises={completedExercises}
                    toggleExercise={toggleExercise}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'meal' && (
              <motion.div
                key="meal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {(plan.mealPlan || []).map((day, index) => (
                  <MealDayCard key={index} day={day} />
                ))}
              </motion.div>
            )}

            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-8 md:p-10">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-white/5 text-[var(--accent-secondary)]">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-h3 break-words whitespace-normal leading-relaxed">Guidance</h3>
                      <p className="mt-2 text-body break-words whitespace-normal leading-relaxed">
                        Simple notes to help you stay consistent and get more out of the plan.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    {(plan.tips || []).map((tip, index) => (
                      <motion.div
                        key={index}
                        className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5 min-h-[120px] flex flex-col justify-center"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[var(--accent-secondary)]">
                          <Check className="h-4 w-4" />
                        </div>
                        <p className="text-sm text-gray-400 break-words whitespace-normal leading-relaxed">{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
