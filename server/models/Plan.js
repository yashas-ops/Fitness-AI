import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: String,
  rest: String,
  notes: String
}, { _id: false });

const dayWorkoutSchema = new mongoose.Schema({
  day: String,
  focus: String,
  exercises: [exerciseSchema]
}, { _id: false });

const mealSchema = new mongoose.Schema({
  name: String,
  time: String,
  foods: [String],
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number
}, { _id: false });

const dayMealSchema = new mongoose.Schema({
  day: String,
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFats: Number,
  meals: [mealSchema]
}, { _id: false });

const planSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'My Fitness Plan'
  },
  inputs: {
    goal: { type: String, required: true },
    level: { type: String, required: true },
    age: Number,
    weight: Number,
    weightUnit: { type: String, default: 'kg' },
    height: Number,
    heightUnit: { type: String, default: 'cm' },
    dietaryPreference: String,
    allergies: [String],
    equipment: [String],
    daysPerWeek: { type: Number, default: 5 }
  },
  workoutPlan: [dayWorkoutSchema],
  mealPlan: [dayMealSchema],
  tips: [String],
  summary: {
    totalWeeklyCalories: Number,
    avgDailyProtein: Number,
    avgDailyCarbs: Number,
    avgDailyFats: Number,
    avgDailyCalories: Number
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Indexes for performance
planSchema.index({ userId: 1, createdAt: -1 }); // fast list + sort for getPlans
planSchema.index({ shareToken: 1 }, { sparse: true }); // fast shared plan lookup

export default mongoose.model('Plan', planSchema);
