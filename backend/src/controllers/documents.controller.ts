import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { db } from '../config/firebase';
import { parseDocumentFromUrl, extractClaimsFromDocument } from '../services/document.service';

export const analyzeDocumentsController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { documentUrls } = req.body;
    const userId = req.user?.uid || 'builder';

    const jobRef = await db.collection('jobs').add({
      ownerId: userId,
      type: 'document_analysis',
      stage: 'queued',
      progress: 0,
      status: 'queued',
      documentUrls,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const jobId = jobRef.id;

    // Run async in background
    setImmediate(async () => {
      try {
        await db.collection('jobs').doc(jobId).update({
          stage: 'running',
          progress: 30,
          status: 'running',
        });

        const allClaims = [];
        for (const docUrl of documentUrls) {
          const text = await parseDocumentFromUrl(docUrl);
          const claims = await extractClaimsFromDocument(text, docUrl);
          allClaims.push(...claims);
        }

        await db.collection('document_analyses').doc(jobId).set({
          id: jobId,
          documentUrls,
          claims: allClaims,
          createdAt: new Date(),
        });

        await db.collection('jobs').doc(jobId).update({
          stage: 'completed',
          progress: 100,
          status: 'completed',
        });
      } catch (err: any) {
        await db.collection('jobs').doc(jobId).update({
          stage: 'failed',
          status: 'failed',
          error: err.message,
        });
      }
    });

    res.status(202).json({
      jobId,
      status: 'queued',
      message: 'Document analysis queued.',
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to initiate document analysis', message: error.message });
  }
};
