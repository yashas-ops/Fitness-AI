import Plan from '../models/Plan.js';
import UserSkills from '../models/UserSkills.js';
import { generateFitnessPlan } from '../services/ragService.js';
import { v4 as uuidv4 } from 'uuid';

export const generatePlan = async (req, res) => {
  try {
    const { goal, level, age, weight, weightUnit, height, heightUnit, dietaryPreference, allergies, equipment, daysPerWeek } = req.body;

    if (!goal || !level) {
      return res.status(400).json({ error: 'Goal and fitness level are required.' });
    }

    // Convert units to metric if needed
    const weightKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    const heightCm = heightUnit === 'ft' ? height * 30.48 : height;

    const inputs = {
      goal, level, age: age || 25,
      weight: weightKg || 70, height: heightCm || 170,
      dietaryPreference: dietaryPreference || 'non-veg',
      allergies: allergies || [],
      equipment: equipment || ['bodyweight'],
      daysPerWeek: daysPerWeek || 5
    };

    // Generate plan using RAG service
    const result = await generateFitnessPlan(inputs);

    // Save to database
    const plan = await Plan.create({
      userId: req.userId,
      title: result.title,
      inputs: { goal, level, age, weight, weightUnit, height, heightUnit, dietaryPreference, allergies, equipment, daysPerWeek },
      workoutPlan: result.workoutPlan,
      mealPlan: result.mealPlan,
      tips: result.tips,
      summary: result.summary
    });

    // Update user skills with XP
    try {
      const goalMap = {
        'muscle gain': 'muscle_gain', 'build muscle': 'muscle_gain', 'bulking': 'muscle_gain',
        'fat loss': 'fat_loss', 'weight loss': 'fat_loss', 'cutting': 'fat_loss',
        'endurance': 'endurance', 'stamina': 'endurance',
        'strength': 'strength', 'powerlifting': 'strength',
        'general fitness': 'general_fitness', 'stay fit': 'general_fitness'
      };
      const goalKey = goalMap[goal?.toLowerCase()] || 'general_fitness';

      let skills = await UserSkills.findOne({ userId: req.userId });
      if (!skills) {
        skills = await UserSkills.create({ userId: req.userId });
      }
      skills.grantXP(goalKey, level);
      await skills.save();
    } catch (skillErr) {
      console.warn('Skill update failed (non-blocking):', skillErr.message);
    }

    res.status(201).json(plan);
  } catch (error) {
    console.error('Plan generation error:', error);
    res.status(500).json({ error: 'Failed to generate plan. Please try again.' });
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('title inputs.goal inputs.level summary createdAt')
      .lean(); // return plain JS objects — faster for read-only list
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans.' });
  }
};

export const getPlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, userId: req.userId });
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plan.' });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { title, workoutPlan, mealPlan, tips } = req.body;
    const plan = await Plan.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: { title, workoutPlan, mealPlan, tips } },
      { new: true }
    );
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update plan.' });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }
    res.json({ message: 'Plan deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plan.' });
  }
};

export const sharePlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, userId: req.userId });
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    if (!plan.shareToken) {
      plan.shareToken = uuidv4();
      plan.isPublic = true;
      await plan.save();
    }

    res.json({ shareToken: plan.shareToken, shareUrl: `/shared/${plan.shareToken}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to share plan.' });
  }
};

export const getSharedPlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ shareToken: req.params.shareToken, isPublic: true })
      .select('-userId')
      .lean(); // return plain JS object — faster for public read-only response
    if (!plan) {
      return res.status(404).json({ error: 'Shared plan not found.' });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shared plan.' });
  }
};

export const getSkills = async (req, res) => {
  try {
    // Single round-trip: find or create via upsert
    const skills = await UserSkills.findOneAndUpdate(
      { userId: req.userId },
      { $setOnInsert: { userId: req.userId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills.' });
  }
};
