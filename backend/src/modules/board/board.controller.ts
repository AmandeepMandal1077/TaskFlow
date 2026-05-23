import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { boardRepository } from './board.repository.js';

export const getBoards = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const boards = await boardRepository.getBoardsByUserId(userId);

  res.status(200).json(new ApiResponse(200, boards, 'Boards retrieved successfully'));
});

export const getBoard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const boardData = await boardRepository.getBoardWithLists(id as string);

  if (!boardData) {
    throw new ApiError(404, 'Board not found');
  }

  if (boardData.board.user_id !== req.user!.id) {
    throw new ApiError(403, 'Unauthorized access to board');
  }

  res.status(200).json(new ApiResponse(200, boardData, 'Board details retrieved successfully'));
});

export const createBoard = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { title, description, color, image_url } = req.body;

  const result = await boardRepository.createBoardWithDefaultLists({
    title,
    userId,
    description,
    color,
    image_url,
  });

  res.status(201).json(new ApiResponse(201, result, 'Board created successfully'));
});

export const updateBoard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const board = await boardRepository.getBoardById(id as string);
  if (!board) {
    throw new ApiError(404, 'Board not found');
  }

  if (board.user_id !== userId) {
    throw new ApiError(403, 'Unauthorized access to board');
  }

  const updatedBoard = await boardRepository.updateBoard(id as string, req.body);

  res.status(200).json(new ApiResponse(200, updatedBoard, 'Board updated successfully'));
});

export const deleteBoard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const board = await boardRepository.getBoardById(id as string);
  if (!board) {
    throw new ApiError(404, 'Board not found');
  }

  if (board.user_id !== userId) {
    throw new ApiError(403, 'Unauthorized access to board');
  }

  await boardRepository.deleteBoard(id as string);

  res.status(200).json(new ApiResponse(200, null, 'Board deleted successfully'));
});
