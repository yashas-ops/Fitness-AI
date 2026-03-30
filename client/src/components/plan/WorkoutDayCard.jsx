import { memo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, Clock, Dumbbell, Zap } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

function WorkoutDayCard({ day, dayIdx, completedExercises, toggleExercise }) {
  if (!day.exercises || day.exercises.length === 0) {
    return (
      <Card className="p-6 md:p-8 rounded-2xl min-h-[120px] flex flex-col justify-center">
        <div className="flex items-center gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[var(--accent-secondary)]">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-snug break-words whitespace-normal text-white">
              Recovery day
            </p>
            <p className="mt-1 text-sm text-gray-400 break-words whitespace-normal leading-relaxed">
              Rest day with light mobility, walking, or easy recovery work.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 border-glow-hover rounded-2xl min-h-[120px] flex flex-col justify-center">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[var(--accent-secondary)]">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold leading-snug break-words whitespace-normal">
              {day.day}
            </h3>
            <p className="mt-1 text-sm font-medium text-[var(--accent-secondary)] break-words whitespace-normal leading-relaxed">
              {day.focus}
            </p>
          </div>
        </div>
        <Badge icon={Dumbbell} variant="accent">{day.exercises.length} Exercises</Badge>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/20">
        <div className="hidden grid-cols-[minmax(0,1.5fr)_0.45fr_0.45fr_0.6fr] gap-4 border-b border-white/8 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] sm:grid">
          <div>Exercise</div>
          <div className="text-center">Sets</div>
          <div className="text-center">Reps</div>
          <div className="text-center">Rest</div>
        </div>

        <div className="divide-y divide-white/8">
          {day.exercises.map((exercise, exIdx) => {
            const key = `${dayIdx}-${exIdx}`;
            const completed = completedExercises[key];

            return (
              <div
                key={key}
                className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1.5fr)_0.45fr_0.45fr_0.6fr] sm:items-center sm:px-5"
                style={{ opacity: completed ? 0.6 : 1 }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <motion.button
                    type="button"
                    onClick={() => toggleExercise(dayIdx, exIdx)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: completed ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.06)',
                      color: completed ? '#fff' : 'transparent',
                      border: completed ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.button>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-semibold text-white break-words whitespace-normal leading-relaxed"
                      style={{ textDecoration: completed ? 'line-through' : 'none' }}
                    >
                      {exercise.name}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-muted)] break-words whitespace-normal leading-relaxed sm:hidden">
                      {exercise.sets} sets | {exercise.reps} reps | {exercise.rest} rest
                    </p>
                  </div>
                </div>
                <div className="hidden text-center text-sm font-semibold text-white sm:block">{exercise.sets}</div>
                <div className="hidden text-center text-sm font-semibold text-white sm:block">{exercise.reps}</div>
                <div className="hidden items-center justify-center gap-1.5 text-sm text-[var(--text-secondary)] sm:flex">
                  <Clock className="h-3.5 w-3.5" />
                  {exercise.rest}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default memo(WorkoutDayCard);
