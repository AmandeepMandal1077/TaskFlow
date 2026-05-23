import type { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/ApiError.js';

export const requireAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Hardcoded for development based on user request
  const email = 'amandeep@email.com';
  
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new ApiError(401, 'Mock user not found in database');
  }

  req.user = user;
  next();
});
