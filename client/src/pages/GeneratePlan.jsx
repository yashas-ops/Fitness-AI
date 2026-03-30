import { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';
import UnitDropdown from '../components/ui/UnitDropdown';
import {
  Activity,
  AlertCircle,
  Beef,
  Brain,
  Calendar,
  Carrot,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Leaf,
  Loader2,
  Ruler,
  Scale,
  Sprout,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';

const steps = [
  { id: 'goal', title: 'What do you want to focus on?', sub: 'Pick the result that matters most right now.', icon: Target },
  { id: 'level', title: 'How experienced are you?', sub: 'This helps keep the plan realistic and useful.', icon: Activity },
  { id: 'body', title: 'Body details', sub: 'We use these to shape calories, training load, and recovery.', icon: Scale },
  { id: 'diet', title: 'Food preferences', sub: 'Set the food direction your plan should follow.', icon: Carrot },
  { id: 'equipment', title: 'What do you have access to?', sub: 'Choose the setup you actually train with.', icon: Dumbbell },
];

const goals = [
  { value: 'muscle gain', label: 'Build muscle', desc: 'Add size with training and meals that support it.', icon: Dumbbell },
  { value: 'fat loss', label: 'Lose fat', desc: 'Keep things sustainable while leaning out.', icon: Flame },
  { value: 'endurance', label: 'Endurance', desc: 'Build stamina and keep your engine strong.', icon: Zap },
  { value: 'strength', label: 'Get stronger', desc: 'Put more focus on performance and output.', icon: Trophy },
  { value: 'general fitness', label: 'Stay fit', desc: 'Keep it balanced, steady, and easy to follow.', icon: Activity },
];

const levels = [
  { value: 'beginner', label: 'Beginner', desc: 'You are just getting started or coming back to it.', icon: Sprout },
  { value: 'intermediate', label: 'Intermediate', desc: 'You train fairly often and know the basics.', icon: Leaf },
  { value: 'advanced', label: 'Advanced', desc: 'You already train seriously and want more structure.', icon: Activity },
];

const dietOptions = [
  { value: 'non-veg', label: 'Non-vegetarian', desc: 'Includes meat, eggs, and dairy.', icon: Beef },
  { value: 'veg', label: 'Vegetarian', desc: 'No meat, but dairy and eggs can stay in.', icon: Carrot },
  { value: 'vegan', label: 'Vegan', desc: 'Fully plant-based meal structure.', icon: Leaf },
];

const equipmentList = [
  { value: 'full gym', label: 'Full gym', desc: 'You have access to a complete setup.', icon: Dumbbell },
  { value: 'dumbbells', label: 'Dumbbells', desc: 'Free-weight training at home or in the gym.', icon: Dumbbell },
  { value: 'barbell', label: 'Barbell', desc: 'Barbell lifts are available to you.', icon: Activity },
  { value: 'bodyweight', label: 'Bodyweight', desc: 'No equipment needed.', icon: Activity },
  { value: 'resistance bands', label: 'Bands', desc: 'Light, portable resistance options.', icon: Activity },
  { value: 'pull-up bar', label: 'Pull-up bar', desc: 'Upper-body pulling work is available.', icon: Activity },
  { value: 'bench', label: 'Bench', desc: 'Flat or adjustable bench access.', icon: Activity },
  { value: 'cable machine', label: 'Cable machine', desc: 'Cable work is part of your setup.', icon: Activity },
];

const loadingMessages = [
  'Looking through your profile...',
  'Shaping the training split...',
  'Laying out the meal plan...',
  'Balancing calories and macros...',
  'Putting the final plan together...',
];

const metricInputClass =
  'w-full h-14 px-4 text-lg text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-[var(--text-muted)] transition-colors';

const unitOptions = {
  weight: [
    { value: 'kg', label: 'kg' },
    { value: 'lbs', label: 'lbs' },
  ],
  height: [
    { value: 'cm', label: 'cm' },
    { value: 'ft', label: 'ft' },
  ],
};

const OptionGrid = memo(function OptionGrid({
  items,
  selectedValue,
  selectedValues = [],
  onSelect,
  multi = false,
}) {
  const handleSelect = useCallback(
    (event) => {
      const nextValue = event.currentTarget.dataset.value;
      if (nextValue) {
        onSelect(nextValue);
      }
    },
    [onSelect],
  );

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        const selected = multi ? selectedValues.includes(item.value) : selectedValue === item.value;

        return (
          <motion.button
            key={item.value}
            type="button"
            data-value={item.value}
            className="relative text-left"
            onClick={handleSelect}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div
              className={`h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-red-500/40 hover:shadow-lg min-h-[120px] flex flex-col justify-center ${
                selected ? 'ring-2 ring-red-500 bg-red-500/10' : ''
              }`}
              style={{
                boxShadow: selected ? '0 24px 48px rgba(239,68,68,0.14)' : 'var(--shadow-sm)',
              }}
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      background: selected
                        ? 'var(--gradient-accent)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                      color: selected ? '#fff' : 'var(--accent-secondary)',
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  {selected && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--accent)]">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold leading-snug break-words whitespace-normal text-white">
                  {item.label}
                </h3>
                {item.desc && (
                  <p className="mt-1 text-sm text-gray-400 break-words whitespace-normal leading-relaxed">
                    {item.desc}
                  </p>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
});

export default function GeneratePlan() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [form, setForm] = useState({
    goal: '',
    level: '',
    age: '',
    weight: '',
    weightUnit: 'kg',
    height: '',
    heightUnit: 'cm',
    dietaryPreference: 'non-veg',
    allergies: '',
    equipment: ['bodyweight'],
    daysPerWeek: 5,
  });

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleEquipment = useCallback((equipment) => {
    setForm((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter((entry) => entry !== equipment)
        : [...prev.equipment, equipment],
    }));
  }, []);

  const handleStepBack = useCallback(() => {
    setStep((current) => Math.max(0, current - 1));
  }, []);

  const handleStepForward = useCallback(() => {
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }, []);

  const handleAgeChange = useCallback((event) => setField('age', event.target.value), [setField]);
  const handleWeightChange = useCallback((event) => setField('weight', event.target.value), [setField]);
  const handleHeightChange = useCallback((event) => setField('height', event.target.value), [setField]);
  const handleAllergiesChange = useCallback((event) => setField('allergies', event.target.value), [setField]);
  const handleGoalSelect = useCallback((value) => setField('goal', value), [setField]);
  const handleLevelSelect = useCallback((value) => setField('level', value), [setField]);
  const handleDietSelect = useCallback((value) => setField('dietaryPreference', value), [setField]);
  const handleWeightUnitChange = useCallback((value) => setField('weightUnit', value), [setField]);
  const handleHeightUnitChange = useCallback((value) => setField('heightUnit', value), [setField]);

  const handleEquipmentSelect = useCallback((value) => {
    toggleEquipment(value);
  }, [toggleEquipment]);

  const handleDaysPerWeekSelect = useCallback(
    (event) => {
      const nextValue = Number(event.currentTarget.dataset.days);
      if (nextValue) {
        setField('daysPerWeek', nextValue);
      }
    },
    [setField],
  );

  // useMemo so this doesn't recompute on every form keystroke — only recalculates
  // when the *relevant* field for the current step actually changes
  const canContinue = useMemo(() => {
    switch (step) {
      case 0: return Boolean(form.goal);
      case 1: return Boolean(form.level);
      case 2: return Boolean(form.age && form.weight && form.height);
      case 3: return Boolean(form.dietaryPreference);
      case 4: return form.equipment.length > 0;
      default: return true;
    }
  }, [step, form.goal, form.level, form.age, form.weight, form.height, form.dietaryPreference, form.equipment]);

  const submit = useCallback(async () => {
    setLoading(true);
    setError('');
    setLoadingStep(0);

    const intervalId = window.setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, loadingMessages.length - 1));
    }, 3000);

    try {
      const payload = {
        ...form,
        age: parseInt(form.age, 10),
        weight: parseFloat(form.weight),
        height: parseFloat(form.height),
        daysPerWeek: parseInt(form.daysPerWeek, 10),
        allergies: form.allergies
          ? form.allergies.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
      };

      const { data } = await api.post('/plans/generate', payload);
      window.clearInterval(intervalId);
      toast.success('Plan generated successfully!');
      navigate(`/plan/${data._id}`);
    } catch (err) {
      window.clearInterval(intervalId);
      setError(err.response?.data?.error || 'Failed to generate plan. Please try again.');
      toast.error('Failed to generate plan');
      setLoading(false);
    }
  }, [form, navigate]);

  // useMemo so step content is only rebuilt when the step or its required form values change
  // Prevents the step UI from being recreated on every loading-message tick or unrelated state update
  const stepContent = useMemo(() => {
    switch (step) {
      case 0:
        return <OptionGrid items={goals} selectedValue={form.goal} onSelect={handleGoalSelect} />;
      case 1:
        return <OptionGrid items={levels} selectedValue={form.level} onSelect={handleLevelSelect} />;
      case 2:
        return (
          <div className="card overflow-visible p-6 md:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Age
                </label>
                <input
                  type="number"
                  value={form.age}
                  onChange={handleAgeChange}
                  className={metricInputClass}
                  placeholder="25"
                  min="14"
                  max="80"
                />
              </div>

              <div className="relative z-50">
                <label className="label flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Weight
                </label>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px]">
                  <input
                    type="number"
                    value={form.weight}
                    onChange={handleWeightChange}
                    className={metricInputClass}
                    placeholder="70"
                  />
                  <UnitDropdown
                    value={form.weightUnit}
                    onChange={handleWeightUnitChange}
                    options={unitOptions.weight}
                    ariaLabel="Weight unit"
                  />
                </div>
              </div>

              <div className="relative z-50">
                <label className="label flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Height
                </label>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px]">
                  <input
                    type="number"
                    value={form.height}
                    onChange={handleHeightChange}
                    className={metricInputClass}
                    placeholder="170"
                  />
                  <UnitDropdown
                    value={form.heightUnit}
                    onChange={handleHeightUnitChange}
                    options={unitOptions.height}
                    ariaLabel="Height unit"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="label flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Training days per week
                </label>
                <div className="flex flex-wrap gap-3">
                  {[3, 4, 5, 6].map((dayCount) => {
                    const active = form.daysPerWeek === dayCount;
                    return (
                      <motion.button
                        key={dayCount}
                        type="button"
                        data-days={dayCount}
                        onClick={handleDaysPerWeekSelect}
                        className="rounded-xl px-5 py-3 text-sm font-semibold"
                        style={{
                          background: active ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.05)',
                          color: active ? '#fff' : 'var(--text-secondary)',
                          border: active ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
                          boxShadow: active ? '0 20px 36px rgba(249,115,22,0.16)' : 'none',
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {dayCount} days
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <OptionGrid items={dietOptions} selectedValue={form.dietaryPreference} onSelect={handleDietSelect} />

            <div className="card p-6 md:p-8">
              <label className="label">Allergies or foods to avoid</label>
              <input
                type="text"
                value={form.allergies}
                onChange={handleAllergiesChange}
                className={metricInputClass}
                placeholder="For example: nuts, dairy"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <OptionGrid
            items={equipmentList}
            selectedValues={form.equipment}
            onSelect={handleEquipmentSelect}
            multi
          />
        );
      default:
        return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    step,
    form.goal, form.level,
    form.age, form.weight, form.weightUnit, form.height, form.heightUnit, form.daysPerWeek,
    form.dietaryPreference, form.allergies, form.equipment,
    handleGoalSelect, handleLevelSelect, handleAgeChange, handleWeightChange, handleHeightChange,
    handleWeightUnitChange, handleHeightUnitChange, handleDaysPerWeekSelect,
    handleDietSelect, handleAllergiesChange, handleEquipmentSelect,
  ]);

  const StepIcon = steps[step].icon;

  return (
    <div className="min-h-screen px-6 pb-16 page-bg-mesh bg-grid-dots" style={{ paddingTop: '112px' }}>
      <div className="bg-orb bg-orb-cyan" style={{ width: '380px', height: '380px', top: '10%', right: '-8%' }} />
      <div className="bg-orb bg-orb-gold" style={{ width: '320px', height: '320px', bottom: '18%', left: '-8%' }} />

      <div className="container-page relative z-10">
        <motion.div
          className="mx-auto mb-10 max-w-3xl text-center"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="badge badge-lg mx-auto mb-5">
            <Brain className="h-3.5 w-3.5" />
            Plan builder
          </div>
          <h1 className="text-h1 break-words whitespace-normal leading-relaxed">Build a plan that fits real life</h1>
          <p className="mx-auto mt-4 max-w-2xl text-body break-words whitespace-normal leading-relaxed">
            A few quick answers, then we shape your workouts and meals around how you train, eat, and recover.
          </p>
        </motion.div>

        <motion.div
          className="card-premium mb-8 p-5 sm:p-6"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
        >
          <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const active = index === step;
              const completed = index < step;

              return (
                <div key={item.id} className="flex min-w-0 flex-1 items-center gap-3">
                  <motion.div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10"
                    style={{
                      background: active || completed ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.06)',
                      color: active || completed ? '#fff' : 'var(--text-muted)',
                      borderColor: active || completed ? 'transparent' : 'rgba(255,255,255,0.12)',
                      boxShadow: active ? '0 16px 34px rgba(249,115,22,0.22)' : 'none',
                    }}
                    animate={{ scale: active ? 1.05 : 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  >
                    {completed ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </motion.div>

                  <div className="min-w-0 hidden sm:block">
                    <div className="text-sm font-semibold text-white break-words whitespace-normal leading-relaxed">
                      {item.title}
                    </div>
                    <div className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)] break-words whitespace-normal leading-relaxed">
                      {item.id}
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden h-px flex-1 rounded-full bg-white/10 lg:block">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: index < step ? '100%' : '0%',
                          background: 'var(--gradient-accent)',
                          transition: 'width 240ms ease',
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <motion.aside
            className="card-glow h-fit p-6 md:p-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
          >
            <div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl text-white"
              style={{ background: 'var(--gradient-accent)' }}
            >
              <StepIcon className="h-8 w-8" />
            </div>
            <h2 className="text-h2 break-words whitespace-normal leading-relaxed">{steps[step].title}</h2>
            <p className="mt-4 text-body break-words whitespace-normal leading-relaxed">{steps[step].sub}</p>

            <div className="mt-8 space-y-4">
              {steps.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border px-4 py-3"
                  style={{
                    borderColor: index === step ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.08)',
                    background: index === step ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] break-words whitespace-normal leading-relaxed">
                    {item.id}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white break-words whitespace-normal leading-relaxed">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.45 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {stepContent}
              </motion.div>
            </AnimatePresence>

            {error && (
              <motion.div
                className="mt-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-[var(--error)]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="break-words whitespace-normal leading-relaxed">{error}</span>
              </motion.div>
            )}

            <motion.div
              className="card-premium mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div>
                <div className="text-sm font-semibold text-white break-words whitespace-normal leading-relaxed">
                  Step {step + 1} of {steps.length}
                </div>
                <div className="text-sm text-[var(--text-muted)] break-words whitespace-normal leading-relaxed">
                  {step < steps.length - 1 ? 'Finish this step to keep moving.' : 'Everything is set. Your plan is ready to build.'}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <motion.button
                  type="button"
                  onClick={handleStepBack}
                  className="secondary-button"
                  style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </motion.button>

                {step < steps.length - 1 ? (
                  <motion.button
                    type="button"
                    onClick={handleStepForward}
                    disabled={!canContinue}
                    className="primary-button btn-premium"
                    whileHover={canContinue ? { scale: 1.03 } : {}}
                    whileTap={canContinue ? { scale: 0.97 } : {}}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={submit}
                    disabled={loading || !canContinue}
                    className="primary-button btn-premium"
                    whileHover={!loading && canContinue ? { scale: 1.03 } : {}}
                    whileTap={!loading && canContinue ? { scale: 0.97 } : {}}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {loadingMessages[loadingStep]}
                      </>
                    ) : (
                      <>
                        Generate plan
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
