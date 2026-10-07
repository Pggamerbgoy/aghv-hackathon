import { Router } from 'express';
import { verifyAuth } from '../middleware/auth.middleware';
import { strictRateLimiter } from '../middleware/rateLimit.middleware';
import { validate, analyzeDocumentsSchema } from '../middleware/validation.middleware';
import { analyzeDocumentsController } from '../controllers/documents.controller';

const router = Router();

// POST /documents/analyze (Parse & extract claims from uploaded docs)
router.post('/analyze', strictRateLimiter, verifyAuth, validate(analyzeDocumentsSchema), analyzeDocumentsController);

export default router;
