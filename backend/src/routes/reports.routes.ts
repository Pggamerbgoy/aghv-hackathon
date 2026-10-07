import { Router } from 'express';
import { verifyAuth } from '../middleware/auth.middleware';
import { getReportController } from '../controllers/reports.controller';

const router = Router();

// GET /reports/:id (Retrieve complete 19-section validation report)
router.get('/:id', verifyAuth, getReportController);

export default router;
