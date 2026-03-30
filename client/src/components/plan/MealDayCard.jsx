import { memo } from 'react';
import { Calendar, Clock, Flame, Target } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

function MealDayCard({ day }) {
  return (
    <Card className="p-6 md:p-8 border-glow-hover rounded-2xl min-h-[120px] flex flex-col justify-center">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[var(--accent-secondary)]">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold leading-snug break-words whitespace-normal">{day.day}</h3>
            <p className="mt-1 text-sm text-gray-400 break-words whitespace-normal leading-relaxed">Daily nutrition structure</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge icon={Flame} variant="accent">{day.totalCalories} kcal</Badge>
          <Badge icon={Target} variant="secondary">{day.totalProtein}g protein</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(day.meals || []).map((meal, mealIndex) => (
          <div
            key={`${meal.name}-${mealIndex}`}
            className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="break-words whitespace-normal text-sm font-semibold uppercase tracking-[0.18em] text-white leading-relaxed">{meal.name}</h4>
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <Clock className="h-3.5 w-3.5" />
                {meal.time}
              </span>
            </div>

            <ul className="mb-5 space-y-2.5">
              {(meal.foods || []).map((food, foodIndex) => (
                <li key={`${food}-${foodIndex}`} className="flex items-start gap-3 text-sm text-[var(--text-secondary)] break-words whitespace-normal leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-secondary)]" />
                  <span>{food}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 border-t border-white/8 pt-4">
              <Badge size="sm" variant="accent"><Flame className="h-3 w-3" /> {meal.calories}</Badge>
              <Badge size="sm" variant="success">P: {meal.protein}g</Badge>
              <Badge size="sm" variant="warning">C: {meal.carbs}g</Badge>
              <Badge size="sm" variant="error">F: {meal.fats}g</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default memo(MealDayCard);
