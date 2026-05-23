import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { cardRepository } from './card.repository.js';

export const getCardsByBoard = asyncHandler(async (req: Request, res: Response) => {
  const { boardId } = req.params;
  const cards = await cardRepository.getCardsByBoardId(boardId as string);
  res.status(200).json(new ApiResponse(200, cards, 'Cards retrieved successfully'));
});

export const getCardById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const card = await cardRepository.getCardById(id as string);
  if (!card) {
    throw new ApiError(404, 'Card not found');
  }
  res.status(200).json(new ApiResponse(200, card, 'Card retrieved successfully'));
});

export const createCard = asyncHandler(async (req: Request, res: Response) => {
  const { list_id, title, description, order } = req.body;
  const newCard = await cardRepository.createCard(list_id, { title, description, order });
  res.status(201).json(new ApiResponse(201, newCard, 'Card created successfully'));
});

export const updateCard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedCard = await cardRepository.updateCard(id as string, req.body);
  res.status(200).json(new ApiResponse(200, updatedCard, 'Card updated successfully'));
});

export const deleteCard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await cardRepository.deleteCard(id as string);
  res.status(200).json(new ApiResponse(200, null, 'Card deleted successfully'));
});

export const moveCard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { targetListId, targetOrder } = req.body;
  const movedCard = await cardRepository.moveCard(id as string, targetListId, targetOrder);
  res.status(200).json(new ApiResponse(200, movedCard, 'Card moved successfully'));
});

export const reorderCards = asyncHandler(async (req: Request, res: Response) => {
  const { affectedLists } = req.body;
  await cardRepository.reorderCards(affectedLists);
  res.status(200).json(new ApiResponse(200, null, 'Cards reordered successfully'));
});

export const addLabelToCard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { labelId } = req.body;
  const card = await cardRepository.addLabelToCard(id as string, labelId);
  res.status(200).json(new ApiResponse(200, card, 'Label added to card'));
});

export const removeLabelFromCard = asyncHandler(async (req: Request, res: Response) => {
  const { id, labelId } = req.params;
  const card = await cardRepository.removeLabelFromCard(id as string, labelId as string);
  res.status(200).json(new ApiResponse(200, card, 'Label removed from card'));
});

export const addAssigneeToCard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const card = await cardRepository.addAssigneeToCard(id as string, userId);
  res.status(200).json(new ApiResponse(200, card, 'Assignee added to card'));
});

export const removeAssigneeFromCard = asyncHandler(async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  const card = await cardRepository.removeAssigneeFromCard(id as string, userId as string);
  res.status(200).json(new ApiResponse(200, card, 'Assignee removed from card'));
});

export const createChecklist = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  const checklist = await cardRepository.createChecklist(id as string, title);
  res.status(201).json(new ApiResponse(201, checklist, 'Checklist created successfully'));
});

export const deleteChecklist = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // checklist id
  await cardRepository.deleteChecklist(id as string);
  res.status(200).json(new ApiResponse(200, null, 'Checklist deleted successfully'));
});

export const createChecklistItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // checklist id
  const { title } = req.body;
  const item = await cardRepository.createChecklistItem(id as string, title);
  res.status(201).json(new ApiResponse(201, item, 'Checklist item created successfully'));
});

export const toggleChecklistItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // item id
  const { is_checked } = req.body;
  const item = await cardRepository.toggleChecklistItem(id as string, is_checked);
  res.status(200).json(new ApiResponse(200, item, 'Checklist item toggled successfully'));
});

export const deleteChecklistItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // item id
  await cardRepository.deleteChecklistItem(id as string);
  res.status(200).json(new ApiResponse(200, null, 'Checklist item deleted successfully'));
});
