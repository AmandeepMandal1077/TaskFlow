import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { userRepository } from './user.repository.js';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userRepository.getAllUsers();
  res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
});

export const getUserByEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.params;
  const user = await userRepository.getUserByEmail(email as string);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(new ApiResponse(200, user, 'User retrieved successfully'));
});
