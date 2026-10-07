import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.middleware';
import { rateLimiter } from './middleware/rateLimit.middleware';
import projectsRouter from './routes/projects.routes';
import repositoriesRouter from './routes/repositories.routes';
import documentsRouter from './routes/documents.routes';
import reportsRouter from './routes/reports.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(rateLimiter);

// Health check endpoint (for deployment monitoring and evaluation test)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AHGV BuildVerse 2026 Build & Validation Agent API (PS-02)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Official PS-02 Endpoints
app.use('/projects', projectsRouter);
app.use('/repositories', repositoriesRouter);
app.use('/documents', documentsRouter);
app.use('/reports', reportsRouter);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 BuildVerse Validation Agent Engine Running on Port ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/health`);
  console.log(`📡 Ready for live project submissions and analysis jobs`);
  console.log(`======================================================\n`);
});

export default app;
