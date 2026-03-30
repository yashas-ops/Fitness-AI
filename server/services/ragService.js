/**
 * RAG Service for Fitness Plan Generation
 * Uses the fitness knowledge base to generate personalized workout and meal plans.
 * Instead of relying on external LLM APIs (which need paid keys), we use
 * intelligent template matching + knowledge retrieval to produce structured plans.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load knowledge base
const knowledgePath = join(__dirname, '..', 'data', 'fitness-knowledge.json');
const knowledge = JSON.parse(readFileSync(knowledgePath, 'utf-8'));

/**
 * Calculate BMR using Mifflin-St Jeor equation
 */
function calculateBMR(weight, height, age, gender = 'male') {
  if (gender === 'female') {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return 10 * weight + 6.25 * height - 5 * age + 5;
}

/**
 * Calculate TDEE based on activity level
 */
function calculateTDEE(bmr, level) {
  const multipliers = {
    beginner: 1.375,
    intermediate: 1.55,
    advanced: 1.725
  };
  return Math.round(bmr * (multipliers[level] || 1.55));
}

/**
 * Map user goal to internal key
 */
function mapGoal(goal) {
  const goalMap = {
    'muscle gain': 'muscle_gain',
    'muscle_gain': 'muscle_gain',
    'build muscle': 'muscle_gain',
    'bulking': 'muscle_gain',
    'fat loss': 'fat_loss',
    'fat_loss': 'fat_loss',
    'weight loss': 'fat_loss',
    'lose weight': 'fat_loss',
    'cutting': 'fat_loss',
    'endurance': 'endurance',
    'stamina': 'endurance',
    'cardio': 'endurance',
    'strength': 'strength',
    'powerlifting': 'strength',
    'get stronger': 'strength',
    'general fitness': 'general_fitness',
    'general_fitness': 'general_fitness',
    'stay fit': 'general_fitness',
    'maintenance': 'general_fitness'
  };
  return goalMap[goal.toLowerCase()] || 'general_fitness';
}

/**
 * Select the best workout split based on user inputs
 */
function selectWorkoutSplit(goalKey, level, daysPerWeek) {
  const splits = knowledge.workoutSplits;
  let bestSplit = null;
  let bestScore = -1;

  for (const [key, split] of Object.entries(splits)) {
    let score = 0;
    if (split.goals.includes(goalKey)) score += 3;
    if (split.suitable_for.includes(level)) score += 2;
    const daysDiff = Math.abs(split.daysPerWeek - daysPerWeek);
    score -= daysDiff;
    if (score > bestScore) {
      bestScore = score;
      bestSplit = { key, ...split };
    }
  }

  return bestSplit;
}

/**
 * Filter exercises by available equipment and difficulty
 */
function filterExercises(exercises, equipment, level) {
  const userEquipment = equipment.map(e => e.toLowerCase());
  const hasFullGym = userEquipment.includes('full gym') || userEquipment.includes('gym');

  return exercises.filter(ex => {
    // Equipment check
    const exerciseEquipment = ex.equipment.map(e => e.toLowerCase());
    const equipmentMatch = hasFullGym || exerciseEquipment.some(eq =>
      userEquipment.includes(eq) || eq === 'bodyweight'
    );

    // Difficulty check
    const difficultyOrder = ['beginner', 'intermediate', 'advanced'];
    const userLevel = difficultyOrder.indexOf(level);
    const exLevel = difficultyOrder.indexOf(ex.difficulty);
    const difficultyMatch = exLevel <= userLevel;

    return equipmentMatch && difficultyMatch;
  });
}

/**
 * Pick N random exercises from a filtered list
 */
function pickExercises(filtered, count) {
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Adjust sets/reps based on goal
 */
function adjustForGoal(exercise, goalKey) {
  const ex = { ...exercise };
  switch (goalKey) {
    case 'muscle_gain':
      ex.sets = parseInt(ex.sets) || 4;
      ex.reps = '8-12';
      ex.rest = '60-90s';
      break;
    case 'strength':
      ex.sets = 5;
      ex.reps = '3-5';
      ex.rest = '2-3 min';
      break;
    case 'fat_loss':
      ex.sets = parseInt(ex.sets) || 3;
      ex.reps = '12-15';
      ex.rest = '30-45s';
      break;
    case 'endurance':
      ex.sets = 3;
      ex.reps = '15-20';
      ex.rest = '30s';
      break;
    default:
      ex.sets = parseInt(ex.sets) || 3;
  }
  return ex;
}

/**
 * Generate workout plan based on user inputs
 */
function generateWorkoutPlan(inputs) {
  const { goal, level, equipment, daysPerWeek } = inputs;
  const goalKey = mapGoal(goal);
  const split = selectWorkoutSplit(goalKey, level, daysPerWeek || 5);

  const exerciseDB = knowledge.exercises;
  const userEquipment = equipment || ['bodyweight'];

  const workoutPlan = split.schedule.map(daySchedule => {
    if (daySchedule.focus === 'Rest' || daySchedule.focus === 'Active Recovery' || daySchedule.focus === 'Active Recovery / Cardio') {
      return {
        day: daySchedule.day,
        focus: daySchedule.focus,
        exercises: daySchedule.focus === 'Rest' ? [] : [
          { name: 'Light Walking or Yoga', sets: 1, reps: '20-30 min', rest: '-', notes: 'Focus on recovery and mobility' }
        ]
      };
    }

    const focus = daySchedule.focus.toLowerCase();
    let selectedExercises = [];

    // Map focus to muscle groups
    const muscleGroupMap = {
      'push': ['chest', 'shoulders', 'arms'],
      'pull': ['back', 'arms'],
      'legs': ['legs', 'core'],
      'upper body': ['chest', 'back', 'shoulders', 'arms'],
      'lower body': ['legs', 'core'],
      'full body': ['chest', 'back', 'legs', 'shoulders', 'core'],
      'chest': ['chest'],
      'back': ['back'],
      'shoulders': ['shoulders'],
      'arms': ['arms'],
      'cardio': ['cardio'],
      'hiit': ['cardio']
    };

    let groups = [];
    for (const [key, muscles] of Object.entries(muscleGroupMap)) {
      if (focus.includes(key)) {
        groups = [...new Set([...groups, ...muscles])];
      }
    }

    if (groups.length === 0) groups = ['chest', 'back', 'legs'];

    // Pick exercises from each group
    const exercisesPerGroup = focus.includes('full body') ? 2 : 
                               groups.length <= 2 ? 3 : 2;

    for (const group of groups) {
      const groupExercises = exerciseDB[group] || [];
      const filtered = filterExercises(groupExercises, userEquipment, level);
      const picked = pickExercises(filtered.length > 0 ? filtered : groupExercises, exercisesPerGroup);
      selectedExercises.push(...picked.map(ex => adjustForGoal(ex, goalKey)));
    }

    // Add core work on non-core days occasionally
    if (!groups.includes('core') && Math.random() > 0.5) {
      const coreExercises = filterExercises(exerciseDB.core || [], userEquipment, level);
      if (coreExercises.length > 0) {
        selectedExercises.push(adjustForGoal(coreExercises[Math.floor(Math.random() * coreExercises.length)], goalKey));
      }
    }

    // Add cardio for fat loss
    if (goalKey === 'fat_loss' && !groups.includes('cardio')) {
      const cardioExercises = filterExercises(exerciseDB.cardio || [], userEquipment, level);
      if (cardioExercises.length > 0) {
        selectedExercises.push(cardioExercises[Math.floor(Math.random() * cardioExercises.length)]);
      }
    }

    return {
      day: daySchedule.day,
      focus: daySchedule.focus,
      exercises: selectedExercises.map(ex => ({
        name: ex.name,
        sets: typeof ex.sets === 'string' ? parseInt(ex.sets) : ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        notes: ex.notes || ''
      }))
    };
  });

  return workoutPlan;
}

/**
 * Generate meal plan based on user inputs
 */
function generateMealPlan(inputs) {
  const { goal, weight, height, age, dietaryPreference, allergies } = inputs;
  const goalKey = mapGoal(goal);
  const guidelines = knowledge.nutritionGuidelines[goalKey] || knowledge.nutritionGuidelines.general_fitness;

  // Calculate caloric needs
  const bmr = calculateBMR(weight || 70, height || 170, age || 25);
  const tdee = calculateTDEE(bmr, inputs.level);
  const targetCalories = Math.round(tdee * guidelines.calorieMultiplier);
  const proteinGrams = Math.round(guidelines.proteinPerKg * (weight || 70));
  const proteinCalories = proteinGrams * 4;
  const remainingCalories = targetCalories - proteinCalories;
  const carbCalories = Math.round(remainingCalories * (guidelines.carbPercentage / (guidelines.carbPercentage + guidelines.fatPercentage)));
  const fatCalories = remainingCalories - carbCalories;
  const carbGrams = Math.round(carbCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);

  // Determine food pool based on dietary preference
  const diet = (dietaryPreference || 'non-veg').toLowerCase();
  let proteinFoods;
  if (diet === 'vegan') {
    proteinFoods = knowledge.foods.proteins.vegan;
  } else if (diet === 'veg' || diet === 'vegetarian') {
    proteinFoods = [...knowledge.foods.proteins.veg, ...knowledge.foods.proteins.vegan];
  } else {
    proteinFoods = [...knowledge.foods.proteins['non-veg'], ...knowledge.foods.proteins.veg];
  }

  // Filter out allergies
  const allergyList = (allergies || []).map(a => a.toLowerCase());
  const filterAllergies = (foods) => foods.filter(f =>
    !allergyList.some(allergy => f.name.toLowerCase().includes(allergy))
  );

  proteinFoods = filterAllergies(proteinFoods);
  const carbFoods = filterAllergies(knowledge.foods.carbs);
  const fatFoods = filterAllergies(knowledge.foods.fats);
  const veggies = filterAllergies(knowledge.foods.vegetables);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const mealPlan = days.map(day => {
    // Create 4 meals: Breakfast, Lunch, Snack, Dinner
    const shuffleProtein = [...proteinFoods].sort(() => 0.5 - Math.random());
    const shuffleCarbs = [...carbFoods].sort(() => 0.5 - Math.random());
    const shuffleFats = [...fatFoods].sort(() => 0.5 - Math.random());
    const shuffleVeggies = [...veggies].sort(() => 0.5 - Math.random());

    const breakfast = {
      name: 'Breakfast',
      time: '7:00 AM',
      foods: [
        shuffleCarbs[0]?.name || 'Oatmeal',
        shuffleProtein[0]?.name || 'Eggs',
        shuffleFats[0]?.name || 'Almonds'
      ],
      calories: Math.round(targetCalories * 0.25),
      protein: Math.round(proteinGrams * 0.25),
      carbs: Math.round(carbGrams * 0.3),
      fats: Math.round(fatGrams * 0.25)
    };

    const lunch = {
      name: 'Lunch',
      time: '12:30 PM',
      foods: [
        shuffleProtein[1]?.name || shuffleProtein[0]?.name || 'Chicken Breast',
        shuffleCarbs[1]?.name || 'Brown Rice',
        shuffleVeggies[0]?.name || 'Broccoli'
      ],
      calories: Math.round(targetCalories * 0.30),
      protein: Math.round(proteinGrams * 0.30),
      carbs: Math.round(carbGrams * 0.30),
      fats: Math.round(fatGrams * 0.25)
    };

    const snack = {
      name: 'Afternoon Snack',
      time: '4:00 PM',
      foods: [
        shuffleProtein[2]?.name || 'Greek Yogurt',
        shuffleFats[1]?.name || 'Peanut Butter'
      ],
      calories: Math.round(targetCalories * 0.15),
      protein: Math.round(proteinGrams * 0.20),
      carbs: Math.round(carbGrams * 0.10),
      fats: Math.round(fatGrams * 0.25)
    };

    const dinner = {
      name: 'Dinner',
      time: '7:30 PM',
      foods: [
        shuffleProtein[3]?.name || shuffleProtein[0]?.name || 'Salmon',
        shuffleCarbs[2]?.name || 'Sweet Potato',
        shuffleVeggies[1]?.name || 'Mixed Salad'
      ],
      calories: Math.round(targetCalories * 0.30),
      protein: Math.round(proteinGrams * 0.25),
      carbs: Math.round(carbGrams * 0.30),
      fats: Math.round(fatGrams * 0.25)
    };

    return {
      day,
      totalCalories: targetCalories,
      totalProtein: proteinGrams,
      totalCarbs: carbGrams,
      totalFats: fatGrams,
      meals: [breakfast, lunch, snack, dinner]
    };
  });

  return { mealPlan, targetCalories, proteinGrams, carbGrams, fatGrams };
}

/**
 * Generate tips based on goal
 */
function generateTips(goalKey) {
  const guidelines = knowledge.nutritionGuidelines[goalKey] || knowledge.nutritionGuidelines.general_fitness;
  const safetyTips = knowledge.safetyGuidelines;
  // Return nutrition tips plus some safety tips
  return [
    ...guidelines.tips,
    ...safetyTips.slice(0, 3).sort(() => 0.5 - Math.random())
  ];
}

/**
 * Main function: Generate a complete fitness plan
 */
export async function generateFitnessPlan(inputs) {
  const goalKey = mapGoal(inputs.goal);

  // Generate workout plan using RAG retrieval from knowledge base
  const workoutPlan = generateWorkoutPlan(inputs);

  // Generate meal plan
  const { mealPlan, targetCalories, proteinGrams, carbGrams, fatGrams } = generateMealPlan(inputs);

  // Generate tips
  const tips = generateTips(goalKey);

  // Calculate summary
  const summary = {
    totalWeeklyCalories: targetCalories * 7,
    avgDailyCalories: targetCalories,
    avgDailyProtein: proteinGrams,
    avgDailyCarbs: carbGrams,
    avgDailyFats: fatGrams
  };

  // Generate title
  const goalNames = {
    muscle_gain: 'Muscle Building',
    fat_loss: 'Fat Loss',
    endurance: 'Endurance Training',
    strength: 'Strength Training',
    general_fitness: 'General Fitness'
  };
  const title = `${goalNames[goalKey] || 'Fitness'} Plan - ${inputs.level.charAt(0).toUpperCase() + inputs.level.slice(1)} Level`;

  return {
    title,
    workoutPlan,
    mealPlan,
    tips,
    summary
  };
}
