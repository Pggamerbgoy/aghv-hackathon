import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per window
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 intensive analysis jobs per window
  message: {
    error: 'Analysis rate limit reached',
    message: 'Too many analysis requests initiated. Please wait before queuing additional projects.',
  },
});
