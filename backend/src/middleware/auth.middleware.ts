import { Request, Response, NextFunction } from 'express';
import { auth, isLiveFirebase } from '../config/firebase';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const verifyAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const isDevBypass = process.env.ENABLE_DEV_AUTH_BYPASS === 'true' || !isLiveFirebase;

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      if (isDevBypass) {
        req.user = { uid: 'dev-builder-1', email: 'builder@buildverse.test' };
        return next();
      }
      return res.status(401).json({
        error: 'Missing or invalid authorization header',
        message: 'A valid Bearer token is required to access BuildVerse endpoints.',
      });
    }

    const token = authHeader.split('Bearer ')[1];

    if (isDevBypass && (token === 'dev-token' || token === 'test-token')) {
      req.user = { uid: 'dev-builder-1', email: 'builder@buildverse.test' };
      return next();
    }

    const decoded = await auth.verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };

    next();
  } catch (error: any) {
    if (isDevBypass) {
      console.warn('⚠️ Token verification failed, applying dev bypass fallback:', error.message);
      req.user = { uid: 'dev-builder-1', email: 'builder@buildverse.test' };
      return next();
    }

    console.error('Authentication Error:', error.message || error);
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Failed to verify Firebase ID token.',
    });
  }
};
