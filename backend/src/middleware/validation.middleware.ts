import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors?.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message,
        })) || error.message,
      });
    }
  };
};

export const analyzeProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional().default(''),
  githubUrl: z.string().url('A valid GitHub URL is required (e.g. https://github.com/owner/repo)'),
  demoUrl: z.string().url().optional().or(z.literal('')).nullable(),
  documentUrls: z.array(z.string().url()).optional().default([]),
  problem: z.string().optional(),
  solution: z.string().optional(),
  targetUser: z.string().optional(),
  targetMarket: z.string().optional(),
  businessModel: z.string().optional(),
  technology: z.string().optional(),
  currentStage: z.string().optional(),
});

export const validateProjectSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  problem: z.string().min(5, 'Problem statement must be at least 5 characters'),
  solution: z.string().min(5, 'Solution must be at least 5 characters'),
  targetUser: z.string().optional().default(''),
  targetMarket: z.string().optional().default(''),
  businessModel: z.string().optional().default(''),
  technology: z.string().optional().default(''),
  currentStage: z.string().optional().default('Prototype'),
});

export const analyzeRepositorySchema = z.object({
  githubUrl: z.string().url('A valid GitHub URL is required'),
});

export const analyzeDocumentsSchema = z.object({
  documentUrls: z.array(z.string().url()).min(1, 'At least one document URL is required'),
});

export const roadmapSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
});
