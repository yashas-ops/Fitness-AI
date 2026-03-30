import { Router } from 'express';
import { generatePlan, getPlans, getPlan, updatePlan, deletePlan, sharePlan, getSharedPlan, getSkills } from '../controllers/planController.js';
import auth from '../middleware/auth.js';

const router = Router();

// All routes require auth except shared plans
router.post('/generate', auth, generatePlan);
router.get('/', auth, getPlans);
router.get('/skills', auth, getSkills);
router.get('/shared/:shareToken', getSharedPlan);
router.get('/:id', auth, getPlan);
router.put('/:id', auth, updatePlan);
router.delete('/:id', auth, deletePlan);
router.post('/:id/share', auth, sharePlan);

export default router;
