import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateResource = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: e.issues,
        });
      }
      next(e);
    }
  };
};
