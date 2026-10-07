import { Router } from 'express';
import { verifyAuth } from '../middleware/auth.middleware';
import { strictRateLimiter } from '../middleware/rateLimit.middleware';
import { validate, analyzeRepositorySchema } from '../middleware/validation.middleware';
import { analyzeRepositoryController } from '../controllers/repositories.controller';

const router = Router();

// POST /repositories/analyze (Analyze authorized GitHub repo)
router.post('/analyze', strictRateLimiter, verifyAuth, validate(analyzeRepositorySchema), analyzeRepositoryController);

export default router;
