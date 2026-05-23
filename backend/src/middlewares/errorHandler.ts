import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { z } from 'zod';
import { Prisma } from '../generated/prisma/client';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  // Handle Zod Validation Errors
  if (error instanceof z.ZodError) {
    const formattedErrors = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation Error',
      errors: formattedErrors,
    });
  }

  // Handle Prisma Errors
  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    error = new ApiError(400, 'Database operation failed');
  }

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? error.statusCode : 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};
