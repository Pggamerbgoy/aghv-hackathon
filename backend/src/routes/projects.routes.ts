import { Router } from 'express';
import { verifyAuth } from '../middleware/auth.middleware';
import { strictRateLimiter } from '../middleware/rateLimit.middleware';
import { validate, analyzeProjectSchema, validateProjectSchema, roadmapSchema } from '../middleware/validation.middleware';
import {
  analyzeProject,
  validateProject,
  getProjectStatus,
  getProjectReport,
  generateRoadmapController,
} from '../controllers/projects.controller';

const router = Router();

// POST /projects/analyze (Initiate full project analysis)
router.post('/analyze', strictRateLimiter, verifyAuth, validate(analyzeProjectSchema), analyzeProject);

// POST /projects/validate (Run idea validation)
router.post('/validate', verifyAuth, validate(validateProjectSchema), validateProject);

// POST /projects/roadmap (Generate execution roadmap)
router.post('/roadmap', verifyAuth, validate(roadmapSchema), generateRoadmapController);

// GET /projects/:id/status (Poll job progress & stage)
router.get('/:id/status', verifyAuth, getProjectStatus);

// GET /projects/:id/report (Retrieve structured 19-section validation report)
router.get('/:id/report', verifyAuth, getProjectReport);

export default router;
