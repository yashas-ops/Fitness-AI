import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  level: { type: Number, default: 1, min: 1, max: 10 },
  xp: { type: Number, default: 0 }
}, { _id: false });

const userSkillsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  strength: { type: skillSchema, default: () => ({ level: 1, xp: 0 }) },
  endurance: { type: skillSchema, default: () => ({ level: 1, xp: 0 }) },
  flexibility: { type: skillSchema, default: () => ({ level: 1, xp: 0 }) },
  balance: { type: skillSchema, default: () => ({ level: 1, xp: 0 }) },
  cardio: { type: skillSchema, default: () => ({ level: 1, xp: 0 }) },
  totalPlansGenerated: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

/**
 * Calculate level from XP (every 100 XP = 1 level, max 10)
 */
userSkillsSchema.methods.recalculateLevels = function () {
  const skills = ['strength', 'endurance', 'flexibility', 'balance', 'cardio'];
  for (const skill of skills) {
    this[skill].level = Math.min(10, Math.floor(this[skill].xp / 100) + 1);
  }
};

/**
 * Grant XP based on a generated plan's goal
 */
userSkillsSchema.methods.grantXP = function (goalKey, level) {
  const xpMultiplier = { beginner: 1, intermediate: 1.5, advanced: 2 };
  const baseXP = 25 * (xpMultiplier[level] || 1);

  const goalSkillMap = {
    muscle_gain: { strength: 1.0, endurance: 0.3, flexibility: 0.2 },
    fat_loss: { cardio: 1.0, endurance: 0.5, flexibility: 0.2 },
    endurance: { endurance: 1.0, cardio: 0.8, balance: 0.3 },
    strength: { strength: 1.0, balance: 0.4, endurance: 0.2 },
    general_fitness: { strength: 0.5, endurance: 0.5, flexibility: 0.5, balance: 0.5, cardio: 0.5 }
  };

  const distribution = goalSkillMap[goalKey] || goalSkillMap.general_fitness;

  for (const [skill, multiplier] of Object.entries(distribution)) {
    this[skill].xp += Math.round(baseXP * multiplier);
  }

  this.totalPlansGenerated += 1;
  this.lastUpdated = new Date();
  this.recalculateLevels();
};

export default mongoose.model('UserSkills', userSkillsSchema);
