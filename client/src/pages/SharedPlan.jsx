import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MacroPieChart, WeeklyCalorieChart } from '../components/MacroChart';
import SkeletonLoader from '../components/SkeletonLoader';
import api from '../utils/api';

export default function SharedPlan() {
  const { shareToken } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedPlan = async () => {
      try {
        const { data } = await api.get(`/plans/shared/${shareToken}`);
        setPlan(data);
      } catch {
        setError('This shared plan is not available or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedPlan();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen px-6" style={{ paddingTop: '112px' }}>
        <div className="container-page">
          <SkeletonLoader type="plan" count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-6 flex items-center justify-center" style={{ paddingTop: '112px' }}>
        <motion.div
          className="card-premium max-w-xl p-10 text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-white/5 text-4xl text-[var(--accent-secondary)]">
            !
          </div>
          <h2 className="text-h2 break-words whitespace-normal leading-relaxed">{error}</h2>
          <p className="mt-4 text-body break-words whitespace-normal leading-relaxed">
            The share link may be expired, deleted, or no longer accessible.
          </p>
          <Link to="/" className="no-underline inline-block">
            <motion.button className="primary-button btn-premium mt-8" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Go home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-16 page-bg-mesh bg-grid-dots" style={{ paddingTop: '112px' }}>
      <div className="container-page relative z-10">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="badge badge-lg mb-4">Shared plan</div>
          <h1 className="text-h1 break-words whitespace-normal leading-relaxed">{plan.title}</h1>
          <p className="mt-3 text-body capitalize break-words whitespace-normal leading-relaxed">
            {plan.inputs?.goal} | {plan.inputs?.level}
          </p>
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

        <div className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="badge bg-white/5 text-white/80">Workout plan</div>
            <p className="text-sm text-[var(--text-muted)] break-words whitespace-normal leading-relaxed">Shared training structure</p>
          </div>

          <div className="space-y-5">
            {(plan.workoutPlan || []).map((day, index) => (
              <motion.div
                key={`${day.day}-${index}`}
                className="card rounded-2xl p-6 md:p-8 min-h-[120px] flex flex-col justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold leading-snug break-words whitespace-normal">{day.day}</h3>
                    <p className="mt-1 text-sm font-medium text-[var(--accent-secondary)] break-words whitespace-normal leading-relaxed">{day.focus}</p>
                  </div>
                  <div className="badge bg-white/5 text-white/80">{day.exercises?.length || 0} exercises</div>
                </div>

                {day.exercises?.length ? (
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/20">
                    <div className="hidden grid-cols-[minmax(0,1.5fr)_0.45fr_0.45fr_0.6fr] gap-4 border-b border-white/8 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] sm:grid">
                      <div>Exercise</div>
                      <div className="text-center">Sets</div>
                      <div className="text-center">Reps</div>
                      <div className="text-center">Rest</div>
                    </div>
                    <div className="divide-y divide-white/8">
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <div
                          key={`${exercise.name}-${exerciseIndex}`}
                          className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1.5fr)_0.45fr_0.45fr_0.6fr] sm:items-center sm:px-5"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white break-words whitespace-normal leading-relaxed">{exercise.name}</p>
                            <p className="mt-1 text-xs text-[var(--text-muted)] break-words whitespace-normal leading-relaxed sm:hidden">
                              {exercise.sets} sets | {exercise.reps} reps | {exercise.rest} rest
                            </p>
                          </div>
                          <div className="hidden text-center text-sm font-semibold text-white sm:block">{exercise.sets}</div>
                          <div className="hidden text-center text-sm font-semibold text-white sm:block">{exercise.reps}</div>
                          <div className="hidden text-center text-sm text-[var(--text-secondary)] sm:block">{exercise.rest}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] px-5 py-4 text-sm text-[var(--text-secondary)] break-words whitespace-normal leading-relaxed">
                    Recovery day
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="badge bg-white/5 text-white/80">Meal plan</div>
            <p className="text-sm text-[var(--text-muted)] break-words whitespace-normal leading-relaxed">Shared nutrition structure</p>
          </div>

          <div className="space-y-5">
            {(plan.mealPlan || []).map((day, index) => (
              <motion.div
                key={`${day.day}-${index}`}
                className="card rounded-2xl p-6 md:p-8 min-h-[120px] flex flex-col justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold leading-snug break-words whitespace-normal">{day.day}</h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)] break-words whitespace-normal leading-relaxed">{day.totalCalories} kcal total</p>
                  </div>
                  <div className="badge bg-white/5 text-white/80">{day.totalProtein}g protein</div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {(day.meals || []).map((meal, mealIndex) => (
                    <div key={`${meal.name}-${mealIndex}`} className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white break-words whitespace-normal leading-relaxed">{meal.name}</h4>
                        <span className="text-xs text-[var(--text-muted)]">{meal.time}</span>
                      </div>
                      <ul className="mb-5 space-y-2 text-sm text-[var(--text-secondary)]">
                        {(meal.foods || []).map((food, foodIndex) => (
                          <li key={`${food}-${foodIndex}`} className="break-words whitespace-normal leading-relaxed">
                            - {food}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-sm bg-white/5 text-white/80">{meal.calories} kcal</span>
                        <span className="badge badge-sm bg-white/5 text-white/80">P: {meal.protein}g</span>
                        <span className="badge badge-sm bg-white/5 text-white/80">C: {meal.carbs}g</span>
                        <span className="badge badge-sm bg-white/5 text-white/80">F: {meal.fats}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="card-premium p-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/12 to-orange-500/12" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-h2 break-words whitespace-normal leading-relaxed">Create your own plan</h2>
            <p className="mt-4 text-body break-words whitespace-normal leading-relaxed">
              Build a workout and meal plan that fits your own routine, food preferences, and schedule.
            </p>
            <Link to="/register" className="no-underline inline-block">
              <motion.button className="primary-button btn-premium mt-8" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Get started free
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
