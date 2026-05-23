import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { labelRepository } from './label.repository.js';

export const getAllLabels = asyncHandler(async (req: Request, res: Response) => {
  const labels = await labelRepository.getAllLabels();
  res.status(200).json(new ApiResponse(200, labels, 'Labels retrieved successfully'));
});

export const createLabel = asyncHandler(async (req: Request, res: Response) => {
  const { name, color } = req.body;
  const result = await labelRepository.createLabel(name, color);
  res.status(201).json(new ApiResponse(201, result, 'Label created successfully'));
});
