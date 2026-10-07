import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { db } from '../config/firebase';
import { analyzeRepository } from '../services/github.service';

export const analyzeRepositoryController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { githubUrl } = req.body;
    const userId = req.user?.uid || 'builder';

    const jobRef = await db.collection('jobs').add({
      ownerId: userId,
      type: 'repository_analysis',
      stage: 'queued',
      progress: 0,
      status: 'queued',
      githubUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const jobId = jobRef.id;

    // Run async in background
    setImmediate(async () => {
      try {
        await db.collection('jobs').doc(jobId).update({
          stage: 'running',
          progress: 50,
          status: 'running',
          updatedAt: new Date(),
        });

        const results = await analyzeRepository(githubUrl);

        await db.collection('analyses').doc(jobId).set({
          id: jobId,
          githubUrl,
          results,
          createdAt: new Date(),
        });

        await db.collection('jobs').doc(jobId).update({
          stage: 'completed',
          progress: 100,
          status: 'completed',
          updatedAt: new Date(),
        });
      } catch (err: any) {
        await db.collection('jobs').doc(jobId).update({
          stage: 'failed',
          status: 'failed',
          error: err.message,
          updatedAt: new Date(),
        });
      }
    });

    res.status(202).json({
      jobId,
      status: 'queued',
      message: 'Repository analysis queued successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to initiate repository analysis', message: error.message });
  }
};
