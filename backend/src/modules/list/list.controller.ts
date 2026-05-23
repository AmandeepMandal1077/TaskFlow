import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { listRepository } from './list.repository.js';

export const getListsByBoard = asyncHandler(async (req: Request, res: Response) => {
  const { boardId } = req.params;
  const lists = await listRepository.getListsByBoardId(boardId as string);
  
  res.status(200).json(new ApiResponse(200, lists, 'Lists retrieved successfully'));
});

export const createList = asyncHandler(async (req: Request, res: Response) => {
  const result = await listRepository.createList(req.body);
  res.status(201).json(new ApiResponse(201, result, 'List created successfully'));
});

export const updateList = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedList = await listRepository.updateList(id as string, req.body);
  res.status(200).json(new ApiResponse(200, updatedList, 'List updated successfully'));
});

export const deleteList = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await listRepository.deleteList(id as string);
  res.status(200).json(new ApiResponse(200, null, 'List deleted successfully'));
});

export const reorderLists = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body;
  await listRepository.reorderLists(items);
  res.status(200).json(new ApiResponse(200, null, 'Lists reordered successfully'));
});
