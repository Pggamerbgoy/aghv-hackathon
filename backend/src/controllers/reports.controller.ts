import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { db } from '../config/firebase';

export const getReportController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const reportDoc = await db.collection('reports').doc(id).get();

    if (!reportDoc.exists) {
      return res.status(404).json({
        error: 'Report not found',
        message: `Validation report with ID: ${id} is not found. Ensure analysis has reached 100% completion.`,
      });
    }

    res.json(reportDoc.data());
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve report', message: error.message });
  }
};
